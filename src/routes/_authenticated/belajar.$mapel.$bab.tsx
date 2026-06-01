import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowLeft as PrevIcon, Sparkles, Zap, Trophy, Lightbulb, Target, BookOpen, CheckCircle2, Quote } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { findMapelBySlug, FREE_BAB_LIMIT } from "@/lib/curriculum";
import { completeChapter } from "@/lib/api/progression.functions";
import { DrawingOverlay } from "@/components/learning/DrawingOverlay";
import { coverFor, PatternSVG } from "@/lib/mapel-cover";

export const Route = createFileRoute("/_authenticated/belajar/$mapel/$bab")({
  head: ({ params }) => ({ meta: [{ title: `Belajar ${params.mapel} — Bab ${params.bab}` }] }),
  component: BelajarPage,
});

type SlideKind = "intro" | "konsep" | "contoh" | "latihan" | "rangkuman";
type Slide = {
  kind: SlideKind;
  title: string;
  body: string;
  bullets?: string[];
  keyTerms?: { term: string; def: string }[];
  quote?: string;
  question?: { q: string; options: string[]; answer: number };
};

function buildSlides(mapelName: string, babTitle: string): Slide[] {
  return [
    {
      kind: "intro",
      title: babTitle,
      body: `Di bab ini kamu akan memahami "${babTitle}" dalam mata pelajaran ${mapelName}. Total 6 slide interaktif: dari konsep, contoh nyata, sampai latihan singkat.`,
      bullets: [
        "Pahami definisi & ruang lingkup",
        "Lihat contoh penerapan nyata",
        "Coba latihan mini di slide 5",
        "Klaim XP di slide terakhir",
      ],
    },
    {
      kind: "konsep",
      title: "Konsep Utama",
      body: `Inti dari "${babTitle}" adalah memahami dasar dan terminologi sebelum melangkah ke aplikasi praktis.`,
      keyTerms: [
        { term: babTitle, def: `Topik utama yang dibahas di bab ini dalam ${mapelName}.` },
        { term: "Konteks", def: "Hubungan materi ini dengan bab sebelum & sesudahnya." },
        { term: "Tujuan", def: "Apa yang harus kamu kuasai setelah bab selesai." },
      ],
    },
    {
      kind: "konsep",
      title: "Pendalaman",
      body: `Mari gali lebih dalam cara kerja "${babTitle}" secara sistematis.`,
      bullets: [
        `Langkah 1 — Identifikasi unsur ${babTitle}`,
        "Langkah 2 — Susun hubungan antar konsep",
        "Langkah 3 — Tarik kesimpulan & pola umum",
        "Langkah 4 — Validasi dengan contoh",
      ],
    },
    {
      kind: "contoh",
      title: "Contoh Nyata",
      body: `Berikut penerapan "${babTitle}" di dunia nyata.`,
      quote: `"${babTitle}" muncul setiap hari — di sekolah, di tempat kerja, bahkan dalam keputusan kecil. Belajar konsepnya = belajar membaca dunia.`,
      bullets: [
        "Studi kasus sederhana di lingkungan sekitar",
        "Penerapan profesional di industri",
        "Kesalahan umum yang sering terjadi",
      ],
    },
    {
      kind: "latihan",
      title: "Latihan Singkat",
      body: "Coba jawab pertanyaan ini untuk mengecek pemahamanmu.",
      question: {
        q: `Apa hal terpenting dari "${babTitle}"?`,
        options: [
          "Menghafal istilah tanpa konteks",
          "Memahami konsep & cara menerapkannya",
          "Mengabaikan contoh nyata",
        ],
        answer: 1,
      },
    },
    {
      kind: "rangkuman",
      title: "Rangkuman & Klaim XP",
      body: `Selamat! Kamu telah menuntaskan "${babTitle}".`,
      bullets: [
        "Kamu menguasai definisi & ruang lingkup",
        "Kamu paham langkah sistematis",
        "Kamu lihat contoh & coba latihan",
        "Saatnya klaim XP-mu 🎉",
      ],
    },
  ];
}

const ICON_BY: Record<SlideKind, typeof Sparkles> = {
  intro: Sparkles, konsep: BookOpen, contoh: Lightbulb, latihan: Target, rangkuman: Trophy,
};

const LABEL_BY: Record<SlideKind, string> = {
  intro: "Pembuka", konsep: "Konsep", contoh: "Contoh", latihan: "Latihan", rangkuman: "Rangkuman",
};

function BelajarPage() {
  const { mapel: mapelSlug, bab } = Route.useParams();
  const navigate = useNavigate();
  const mapel = findMapelBySlug(mapelSlug);
  const babIndex = Number.parseInt(bab, 10);
  const [slideIdx, setSlideIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [claimed, setClaimed] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);

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

  const cover = useMemo(() => (mapel ? coverFor(mapel.slug, mapel.name) : null), [mapel]);

  const babTitle = mapel?.bab[babIndex] ?? "";
  const slides = useMemo(() => (mapel ? buildSlides(mapel.name, babTitle) : []), [mapel, babTitle]);
  const total = slides.length;
  const slide = slides[slideIdx];
  const isLast = slideIdx === total - 1;
  const progress = total > 0 ? ((slideIdx + 1) / total) * 100 : 0;

  const next = () => { if (slideIdx < total - 1) { setDirection(1); setPicked(null); setSlideIdx((i) => i + 1); } };
  const prev = () => { if (slideIdx > 0) { setDirection(-1); setPicked(null); setSlideIdx((i) => i - 1); } };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!mapel || Number.isNaN(babIndex) || babIndex < 0 || babIndex >= mapel.bab.length) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Bab tidak ditemukan.</p>
        <button onClick={() => navigate({ to: "/mapel" })} className="mt-4 px-5 py-2 rounded-full bg-gradient-pink text-white text-sm font-bold">Kembali</button>
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

  const Icon = ICON_BY[slide.kind];

  return (
    <div className="max-w-5xl mx-auto">
      <Link to="/mapel/$slug" params={{ slug: mapelSlug }} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali ke {mapel.name}
      </Link>

      {/* Progress */}
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
      <div className="relative h-[560px] md:h-[600px] rounded-3xl overflow-hidden border border-border bg-white shadow-card">
        {cover && (
          <>
            <img src={cover.photoUrlLg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
            <div className={`absolute inset-0 ${cover.gradient} opacity-10`} />
            <PatternSVG pattern={cover.pattern} className="absolute inset-0 w-full h-full opacity-20" />
          </>
        )}
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
            className="absolute inset-0 p-6 md:p-10 flex flex-col overflow-y-auto"
          >
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-2xl ${cover?.gradient ?? "bg-gradient-brand"} text-white grid place-items-center shadow-soft`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                {LABEL_BY[slide.kind]} · slide {slideIdx + 1}
              </span>
            </div>

            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">{slide.title}</h2>
            <p className="mt-3 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">{slide.body}</p>

            {/* Bullets */}
            {slide.bullets && (
              <ul className="mt-5 grid sm:grid-cols-2 gap-2.5 max-w-3xl">
                {slide.bullets.map((b, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/50 border border-border/60"
                  >
                    <span className={`shrink-0 mt-0.5 w-6 h-6 rounded-full ${cover?.gradient ?? "bg-gradient-brand"} text-white grid place-items-center text-[11px] font-extrabold`}>
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium">{b}</span>
                  </motion.li>
                ))}
              </ul>
            )}

            {/* Key terms */}
            {slide.keyTerms && (
              <div className="mt-5 grid sm:grid-cols-3 gap-3 max-w-3xl">
                {slide.keyTerms.map((k, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="p-4 rounded-2xl bg-white border-2 border-border hover:border-primary/60 transition-colors"
                  >
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-primary mb-1">Term</div>
                    <div className="font-extrabold text-sm leading-tight">{k.term}</div>
                    <div className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{k.def}</div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Quote */}
            {slide.quote && (
              <div className="mt-5 p-4 rounded-2xl bg-gradient-hero border-l-4 border-primary max-w-3xl flex gap-3">
                <Quote className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm md:text-base italic font-medium">{slide.quote}</p>
              </div>
            )}

            {/* Question */}
            {slide.question && (
              <div className="mt-5 max-w-2xl">
                <div className="font-bold mb-3">{slide.question.q}</div>
                <div className="space-y-2">
                  {slide.question.options.map((opt, i) => {
                    const isPicked = picked === i;
                    const isCorrect = i === slide.question!.answer;
                    const show = picked !== null;
                    const cls = !show
                      ? "border-border bg-white hover:border-primary"
                      : isCorrect
                        ? "border-success bg-success/10"
                        : isPicked
                          ? "border-destructive bg-destructive/10"
                          : "border-border bg-white opacity-60";
                    return (
                      <button
                        key={i}
                        disabled={show}
                        onClick={() => setPicked(i)}
                        className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${cls}`}
                      >
                        <span className="shrink-0 w-7 h-7 rounded-full bg-muted grid place-items-center text-xs font-extrabold">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-sm font-medium">{opt}</span>
                        {show && isCorrect && <CheckCircle2 className="ml-auto w-4 h-4 text-success" />}
                      </button>
                    );
                  })}
                </div>
                {picked !== null && (
                  <p className={`mt-3 text-sm font-bold ${picked === slide.question.answer ? "text-success" : "text-destructive"}`}>
                    {picked === slide.question.answer ? "✓ Tepat! Lanjut ke slide berikutnya." : "Belum tepat — coba pahami kembali konsepnya."}
                  </p>
                )}
              </div>
            )}

            {isLast && (
              <div className="mt-6">
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
            <button key={i} onClick={() => { setDirection(i > slideIdx ? 1 : -1); setPicked(null); setSlideIdx(i); }}
              className={`h-1.5 rounded-full transition-all ${i === slideIdx ? "w-8 bg-gradient-brand" : "w-2 bg-muted"}`} />
          ))}
        </div>
        {!isLast ? (
          <button onClick={next} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-sm font-bold">
            Lanjut <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <Link to="/mapel/$slug" params={{ slug: mapelSlug }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-brand text-white text-sm font-bold">
            Selesai <Trophy className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
