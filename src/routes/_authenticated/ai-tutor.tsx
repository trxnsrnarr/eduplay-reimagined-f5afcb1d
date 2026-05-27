import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, Loader2, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { useProfile } from "@/components/shell/profile-context";

export const Route = createFileRoute("/_authenticated/ai-tutor")({
  head: () => ({ meta: [{ title: "AI Tutor — Eduverse" }] }),
  component: AITutorPage,
});

const SUGGESTIONS = [
  "Jelaskan rumus Pythagoras dengan contoh",
  "Buatkan 5 latihan soal aljabar",
  "Ringkas materi Fotosintesis",
  "Apa beda HTTP dan HTTPS?",
];

type Msg = { role: "user" | "assistant"; content: string };

function AITutorPage() {
  const profile = useProfile();
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hai! Aku **AI Tutor Eduverse** ✨ Tanyakan apa saja seputar pelajaranmu — aku akan jelaskan step-by-step sesuai jenjangmu." },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || isStreaming) return;

    const userMsg: Msg = { role: "user", content };
    const history = [...messages, userMsg];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;
    let assistantBuf = "";

    try {
      const res = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: history,
          jenjang: profile?.jenjang ?? null,
          jurusan: profile?.jurusan ?? null,
        }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: "Gagal menghubungi AI" }));
        if (res.status === 429) toast.error("Terlalu banyak permintaan. Coba lagi sebentar.");
        else if (res.status === 402) toast.error("Kredit AI habis. Hubungi admin untuk top-up.");
        else toast.error(err.error ?? "Gagal menghubungi AI");
        setMessages((prev) => prev.slice(0, -2));
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              assistantBuf += delta;
              const snapshot = assistantBuf;
              setMessages((prev) => prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: snapshot } : m)));
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        toast.error("Koneksi terputus");
        setMessages((prev) => (prev[prev.length - 1]?.content ? prev : prev.slice(0, -2)));
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  const stop = () => abortRef.current?.abort();
  const reset = () => {
    if (isStreaming) return;
    setMessages([{ role: "assistant", content: "Sesi baru dimulai. Ada yang ingin kamu pelajari hari ini? ✨" }]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-purple grid place-items-center shrink-0">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold flex items-center gap-2">
              AI Tutor <Sparkles className="w-5 h-5 text-warning" />
            </h1>
            <p className="text-xs text-muted-foreground truncate">
              Adaptif untuk {profile?.jenjang?.toUpperCase() ?? "umum"}
              {profile?.jurusan ? ` · ${profile.jurusan}` : ""} · powered by Lovable AI
            </p>
          </div>
        </div>
        <button
          onClick={reset}
          disabled={isStreaming}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full bg-white border border-border hover:border-primary disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Sesi baru
        </button>
      </div>

      <div ref={scrollerRef} className="flex-1 overflow-y-auto space-y-3 p-4 rounded-3xl bg-white border border-border">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                m.role === "user" ? "bg-gradient-brand text-white" : "bg-muted"
              }`}
            >
              {m.role === "assistant" ? (
                m.content ? (
                  <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-headings:my-2 prose-pre:my-2 prose-code:text-[12px]">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                )
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            disabled={isStreaming}
            className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-border hover:border-primary disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-2 flex items-center gap-2 p-2 rounded-2xl bg-white border border-border"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isStreaming ? "AI sedang menjawab…" : "Tanya apapun tentang pelajaranmu…"}
          disabled={isStreaming}
          className="flex-1 bg-transparent outline-none text-sm px-3 py-1.5 disabled:opacity-60"
        />
        {isStreaming ? (
          <button type="button" onClick={stop} className="px-3 py-2 rounded-xl bg-destructive text-white text-xs font-bold">
            Stop
          </button>
        ) : (
          <button type="submit" disabled={!input.trim()} className="p-2.5 rounded-xl bg-gradient-brand text-white disabled:opacity-50">
            <Send className="w-4 h-4" />
          </button>
        )}
      </form>
    </div>
  );
}
