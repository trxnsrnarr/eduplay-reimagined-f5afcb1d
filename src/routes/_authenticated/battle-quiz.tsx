import { createFileRoute } from "@tanstack/react-router";
import { Swords, Users, Trophy, Zap, Crown } from "lucide-react";

export const Route = createFileRoute("/_authenticated/battle-quiz")({
  head: () => ({ meta: [{ title: "Battle Quiz — Eduverse" }] }),
  component: BattleQuizPage,
});

const ROOMS = [
  { id: 1, topic: "Matematika SMA", players: 4, max: 4, level: "Menengah", reward: 120, status: "Full" },
  { id: 2, topic: "Bahasa Inggris SMP", players: 2, max: 4, level: "Pemula", reward: 80, status: "Open" },
  { id: 3, topic: "Fisika - Listrik", players: 1, max: 4, level: "Lanjut", reward: 200, status: "Open" },
  { id: 4, topic: "Sejarah Indonesia", players: 3, max: 4, level: "Menengah", reward: 100, status: "Open" },
];

function BattleQuizPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-pink text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/15 rounded-full blur-3xl" />
        <Swords className="w-10 h-10 mb-3" />
        <h1 className="text-3xl font-extrabold">Battle Quiz Arena</h1>
        <p className="text-white/85 text-sm mt-1">Tantang teman atau pemain lain · Menang dapat XP & coin!</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button className="px-5 py-2.5 rounded-full bg-white text-foreground font-bold text-sm">⚡ Quick Match</button>
          <button className="px-5 py-2.5 rounded-full bg-white/20 text-white font-bold text-sm">Buat Room</button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { Icon: Trophy, label: "Win", value: "0" },
          { Icon: Swords, label: "Match", value: "0" },
          { Icon: Crown, label: "Rank", value: "Newbie" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl bg-white border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand grid place-items-center"><s.Icon className="w-5 h-5 text-white" /></div>
            <div>
              <div className="text-xs text-muted-foreground font-bold">{s.label}</div>
              <div className="text-xl font-extrabold">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-extrabold text-lg mb-3">Room Tersedia</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ROOMS.map((r) => (
            <div key={r.id} className="p-5 rounded-2xl bg-white border border-border hover:border-primary transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted">{r.level}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.status === "Full" ? "bg-muted text-muted-foreground" : "bg-success/15 text-success"}`}>{r.status}</span>
              </div>
              <div className="font-extrabold">{r.topic}</div>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" /> {r.players}/{r.max}</span>
                <span className="inline-flex items-center gap-1"><Zap className="w-3 h-3" /> +{r.reward} XP</span>
              </div>
              <button disabled={r.status === "Full"} className="mt-3 w-full py-2 rounded-full bg-gradient-brand text-white text-sm font-bold disabled:opacity-50">
                {r.status === "Full" ? "Penuh" : "Join Battle"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
