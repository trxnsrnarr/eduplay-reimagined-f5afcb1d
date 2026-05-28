import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowLeft as PrevIcon, Sparkles, Zap, Trophy, Lightbulb, Target, BookOpen, CheckCircle2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { findMapelBySlug, FREE_BAB_LIMIT } from "@/lib/curriculum";
import { completeChapter } from "@/lib/api/progression.functions";
import { DrawingOverlay } from "@/components/learning/DrawingOverlay";

export const Route = createFileRoute("/_authenticated/belajar/$mapel/$bab")({
  head: ({ params }) => ({ meta: [{ title: `Belajar ${params.mapel} — Bab ${params.bab}` }] }),
  component: BelajarPage,
});

type Slide = { kind: "intro" | "konsep" | "contoh" | "latihan" | "rangkuman"; title: string; body: string };

function buildSlides(mapelName: string, babTitle: string): Slide[] {
  return [
    { kind: "intro", title: babTitle, body: `Selamat datang di pembelajaran "${babTitle}" pada mata pelajaran ${mapelName}. Pada bab ini kamu akan memahami konsep, melihat contoh nyata, mencoba latihan, dan menutup dengan rangkuman.` },
    { kind: "konsep", title: "Konsep Utama", body: `Inti dari "${babTitle}" adalah memahami dasar-dasarnya sebelum melangkah ke aplikasi praktis. Fokuskan perhatian pada definisi, fungsi, dan keterkaitannya dengan materi sebelumnya.` },
    { kind: "konsep", title: "Pendalaman", body: `Mari kita gali lebih dalam. Bagian ini menjelaskan bagaimana "${babTitle}" bekerja secara sistematis, lengkap dengan terminologi yang perlu kamu kuasai.` },
    { kind: "contoh", title: "Contoh Nyata", body: `Berikut contoh penerapan "${babTitle}" dalam kehidupan sehari-hari maupun dunia profesional. Perhatikan pola yang berulang sehingga mudah kamu kenali.` },
    { kind: "latihan", title: "Latihan Singkat", body: `Coba jawab dalam hati: apa hal terpenting dari "${babTitle}"? Tulis 3 poin di catatanmu sebelum lanjut ke slide berikutnya.` },
    { kind: "rangkuman", title: "Rangkuman", body: `Selamat! Kamu telah menyelesaikan "${babTitle}". Ingat poin utamanya, dan klaim XP-mu di slide terakhir untuk menyimpan progres.` },
  ];
}

const ICON_BY: Record<Slide["kind"], typeof Sparkles> = {
  intro: Sparkles, konsep: BookOpen, contoh: Lightbulb, latihan: Target, rangkuman: Trophy,
};

function BelajarPage() {
  const { mapel: mapelSlug, bab } = Route.useParams();
  const navigate = useNavigate();
  const mapel = findMapelBySlug(mapelSlug);
  const babIndex = Number.parseInt(bab, 10);
  const [slideIdx, setSlideIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [claimed, setClaimed] = useState(false);

  const complete = useServerFn(completeChapter);
  const mutation = useMutation({
    mutationFn: () => complete({ data: { mapel_slug: mapelSlug, modul_slug: mapelSlug, bab_index: babIndex, xp: mapel?.xpPerBab ?? 50 } }),
    onSuccess: (res) => {
      setClaimed(true);
      if (res.alreadyCompleted) toast.success("Bab ini sudah pernah diselesaikan");
      else toast.success(`+${res.xpEarned} XP! Level ${res.level} · Streak ${res.streak} 🔥`);
    },
    onError: (e: Error) => toast.error(e.message ?? "Gagal menyimpan progres"),
  });

  if (!mapel || Number.isNaN(babIndex) || babIndex < 0 || babIndex >= mapel.bab.length) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Bab tidak ditemukan.</p>
        <button onClick={() => navigate({ to: "/modul" })} className="mt-4 px-5 py-2 rounded-full bg-gradient-pink text-white text-sm font-bold">Kembali</button>
      </div>
    );
  }

  if (babIndex >= FREE_BAB_LIMIT) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="text-5xl mb-3">🔒</div>
        <h2 className="text-2xl font-extrabold">Bab Premium</h2>
        <p className="text-muted-foreground mt-2">Upgrade untuk membuka bab lanjutan.</p>
        <Link to="/subscription" className="inline-block mt-5 px-5 py-2.5 rounded-full bg-gradient-pink text-white text-sm font-bold">Upgrade ke Premium</Link>
      </div>
    );
  }

  const babTitle = mapel.bab[babIndex];
  const slides = useMemo(() => buildSlides(mapel.name, babTitle), [mapel.name, babTitle]);
  const total = slides.length;
  const slide = slides[slideIdx];
  const Icon = ICON_BY[slide.kind];
  const isLast = slideIdx === total - 1;
  const progress = ((slideIdx + 1) / total) * 100;

  const next = () => { if (slideIdx < total - 1) { setDirection(1); setSlideIdx((i) => i + 1); } };
  const prev = () => { if (slideIdx > 0) { setDirection(-1); setSlideIdx((i) => i - 1); } };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/modul/$slug" params={{ slug: mapelSlug }} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali ke modul
      </Link>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mb-1.5">
          <span>Bab {babIndex + 1} · {babTitle}</span>
          <span>{slideIdx + 1} / {total}</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div className="h-full bg-gradient-brand" initial={false} animate={{ width: `${progress}%` }} transition={{ type: "spring", stiffness: 180, damping: 24 }} />
        </div>
      </div>

      {/* Slide stage */}
      <div className="relative h-[460px] md:h-[520px] rounded-3xl overflow-hidden border border-border bg-white shadow-card">
        <div className={`absolute inset-0 ${mapel.color} opacity-10`} />
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-purple opacity-20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-gradient-pink opacity-20 blur-3xl" />
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slideIdx}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -direction * 60, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="absolute inset-0 p-8 md:p-12 flex flex-col"
          >
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-2xl ${mapel.color} text-white grid place-items-center shadow-soft`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                {slide.kind} · slide {slideIdx + 1}
              </span>
            </div>
            <h2 className="mt-5 text-3xl md:text-5xl font-extrabold tracking-tight">{slide.title}</h2>
            <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">{slide.body}</p>

            {isLast && (
              <div className="mt-auto">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={mutation.isPending || claimed}
                  onClick={() => mutation.mutate()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-pink text-white font-extrabold shadow-card disabled:opacity-60"
                >
                  {claimed ? <CheckCircle2 className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                  {claimed ? "XP tersimpan" : mutation.isPending ? "Menyimpan…" : `Klaim +${mapel.xpPerBab} XP`}
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <DrawingOverlay resetKey={`${babIndex}-${slideIdx}`} />
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <button onClick={prev} disabled={slideIdx === 0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-border bg-white text-sm font-bold disabled:opacity-40">
          <PrevIcon className="w-4 h-4" /> Sebelumnya
        </button>
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button key={i} onClick={() => { setDirection(i > slideIdx ? 1 : -1); setSlideIdx(i); }}
              className={`h-1.5 rounded-full transition-all ${i === slideIdx ? "w-8 bg-gradient-brand" : "w-2 bg-muted"}`} />
          ))}
        </div>
        {!isLast ? (
          <button onClick={next} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-sm font-bold">
            Lanjut <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <Link to="/modul/$slug" params={{ slug: mapelSlug }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-brand text-white text-sm font-bold">
            Selesai <Trophy className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
