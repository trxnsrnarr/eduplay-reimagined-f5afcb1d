import { createFileRoute } from "@tanstack/react-router";
import { Target, Zap, Gift, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/daily-challenge")({
  head: () => ({ meta: [{ title: "Daily Challenge — Eduverse" }] }),
  component: DailyChallengePage,
});

const MISSIONS = [
  { title: "Selesaikan 1 quiz matematika", xp: 50, coin: 10, done: false, progress: 0, max: 1 },
  { title: "Belajar 20 menit hari ini", xp: 30, coin: 5, done: false, progress: 0, max: 20 },
  { title: "Menangkan 1 Battle Quiz", xp: 80, coin: 20, done: false, progress: 0, max: 1 },
  { title: "Selesaikan 2 challenge harian", xp: 100, coin: 25, done: false, progress: 0, max: 2 },
  { title: "Main 1 game edukasi", xp: 40, coin: 8, done: false, progress: 0, max: 1 },
];

function DailyChallengePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-brand text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/15 rounded-full blur-3xl" />
        <Target className="w-10 h-10 mb-3" />
        <h1 className="text-3xl font-extrabold">Daily Challenge</h1>
        <p className="text-white/85 text-sm mt-1">Misi reset setiap hari · Selesaikan untuk dapat XP, coin & badge!</p>
        <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
          <Clock className="w-3 h-3" /> Reset dalam 18 jam 24 menit
        </div>
      </div>

      <div className="space-y-3">
        {MISSIONS.map((m) => (
          <div key={m.title} className="p-5 rounded-2xl bg-white border border-border">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="font-extrabold">{m.title}</div>
                <div className="mt-1 flex items-center gap-3 text-[11px] font-bold">
                  <span className="text-warning inline-flex items-center gap-0.5"><Zap className="w-3 h-3" /> +{m.xp} XP</span>
                  <span className="text-primary inline-flex items-center gap-0.5"><Gift className="w-3 h-3" /> +{m.coin} coin</span>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.done ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                {m.done ? "SELESAI" : "BELUM"}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                <span className="text-muted-foreground">{m.progress} / {m.max}</span>
                <span>{Math.round((m.progress / m.max) * 100)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-gradient-brand" style={{ width: `${(m.progress / m.max) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
