import { createFileRoute } from "@tanstack/react-router";
import { Gamepad2, Zap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/games")({
  head: () => ({ meta: [{ title: "Game Edukasi — Eduverse" }] }),
  component: GamesPage,
});

const GAMES = [
  { name: "Math Rush", emoji: "🔢", desc: "Selesaikan soal matematika sebanyak mungkin dalam 60 detik", color: "bg-gradient-pink", xp: 50 },
  { name: "Memory Card", emoji: "🃏", desc: "Cocokkan pasangan kartu rumus & definisi", color: "bg-gradient-purple", xp: 40 },
  { name: "Typing Challenge", emoji: "⌨️", desc: "Latih kecepatan & akurasi mengetik", color: "bg-accent", xp: 30 },
  { name: "Word Scramble", emoji: "🔤", desc: "Susun huruf jadi kata yang benar", color: "bg-gradient-brand", xp: 35 },
  { name: "Logic Puzzle", emoji: "🧩", desc: "Pecahkan teka-teki logika bertingkat", color: "bg-gradient-pink", xp: 60 },
  { name: "Coding Challenge", emoji: "💻", desc: "Selesaikan tantangan algoritma singkat", color: "bg-gradient-purple", xp: 80 },
  { name: "Science Lab", emoji: "🧪", desc: "Simulasi eksperimen sains interaktif", color: "bg-accent", xp: 70 },
  { name: "Puzzle Edukasi", emoji: "🎯", desc: "Puzzle berbasis materi pelajaran", color: "bg-gradient-brand", xp: 45 },
];

function GamesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold flex items-center gap-2"><Gamepad2 className="w-7 h-7" /> Game Edukasi</h1>
        <p className="text-sm text-muted-foreground mt-1">Belajar sambil main · Dapat XP tiap menyelesaikan game!</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {GAMES.map((g) => (
          <div key={g.name} className="p-5 rounded-2xl bg-white border border-border hover:-translate-y-1 hover:shadow-card transition-all">
            <div className={`w-14 h-14 rounded-2xl ${g.color} grid place-items-center text-3xl shadow-soft mb-3`}>{g.emoji}</div>
            <div className="font-extrabold">{g.name}</div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{g.desc}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] font-bold text-warning inline-flex items-center gap-1"><Zap className="w-3 h-3" /> +{g.xp} XP</span>
              <button className="text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-brand text-white">Main</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
