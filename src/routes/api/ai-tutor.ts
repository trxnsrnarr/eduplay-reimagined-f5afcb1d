import { createFileRoute } from "@tanstack/react-router";

type Msg = { role: "system" | "user" | "assistant"; content: string };

export const Route = createFileRoute("/api/ai-tutor")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages, jenjang, jurusan } = (await request.json()) as {
            messages: Msg[];
            jenjang?: string | null;
            jurusan?: string | null;
          };

          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) {
            return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          const jenjangLabel = jenjang ? jenjang.toUpperCase() : "umum";
          const jurusanLabel = jurusan ? ` jurusan ${jurusan}` : "";
          const systemPrompt = `Kamu adalah AI Tutor Eduverse — guru privat yang ramah, sabar, dan adaptif untuk siswa Indonesia jenjang ${jenjangLabel}${jurusanLabel}.

Aturan menjawab:
- Selalu balas dalam Bahasa Indonesia yang jelas dan mudah dipahami.
- Sesuaikan kedalaman penjelasan dengan jenjang siswa (SD: sederhana, SMP/SMA: lebih teknis, Kuliah: akademis).
- Jelaskan step-by-step. Gunakan analogi, contoh konkret, dan emoji secukupnya 🎯.
- Jika menjelaskan rumus/kode, gunakan markdown (heading, list, blok kode bila perlu).
- Akhiri dengan 1 mini-quiz singkat ATAU saran latihan berikutnya untuk memperkuat pemahaman.
- Jangan mengarang fakta. Jika tidak yakin, katakan dan sarankan cara verifikasinya.`;

          const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              stream: true,
              messages: [{ role: "system", content: systemPrompt }, ...messages],
            }),
          });

          if (!upstream.ok || !upstream.body) {
            const text = await upstream.text().catch(() => "");
            if (upstream.status === 429) {
              return new Response(JSON.stringify({ error: "Rate limit tercapai, coba lagi sebentar." }), {
                status: 429,
                headers: { "Content-Type": "application/json" },
              });
            }
            if (upstream.status === 402) {
              return new Response(JSON.stringify({ error: "Kredit AI habis. Tambahkan kredit di workspace Lovable AI." }), {
                status: 402,
                headers: { "Content-Type": "application/json" },
              });
            }
            return new Response(JSON.stringify({ error: text || "AI gateway error" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(upstream.body, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
            },
          });
        } catch (e) {
          return new Response(
            JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
