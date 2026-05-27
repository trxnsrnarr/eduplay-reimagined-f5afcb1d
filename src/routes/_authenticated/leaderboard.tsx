import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trophy, Crown, Medal } from "lucide-react";

export const Route = createFileRoute("/_authenticated/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard — Eduverse" }] }),
  component: LeaderboardPage,
});

const DATA = [
  { name: "Aisyah", school: "SMA 1 Jakarta", xp: 4820 },
  { name: "Rifky", school: "SMK Negeri 4", xp: 4310 },
  { name: "Naufal", school: "SMA 8 Bandung", xp: 3980 },
  { name: "Salsa", school: "SMA 3 Surabaya", xp: 3720 },
  { name: "Dimas", school: "SMK TKJ Jakarta", xp: 3540 },
  { name: "Putri", school: "SMP 5 Yogya", xp: 3200 },
  { name: "Bagas", school: "SMA 2 Medan", xp: 2980 },
  { name: "Lina", school: "SMA 4 Bali", xp: 2750 },
];

function LeaderboardPage() {
  const [tab, setTab] = useState<"mingguan" | "global" | "sekolah" | "jurusan">("mingguan");
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold flex items-center gap-2"><Trophy className="w-7 h-7" /> Leaderboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Kompetisi sehat untuk top XP, quiz score & streak.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["mingguan", "global", "sekolah", "jurusan"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full text-xs font-bold capitalize ${tab === t ? "bg-gradient-brand text-white" : "bg-white border border-border"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {DATA.slice(0, 3).map((u, i) => (
          <div key={u.name} className={`p-5 rounded-2xl text-center ${i === 0 ? "bg-gradient-pink text-white" : i === 1 ? "bg-gradient-purple text-white" : "bg-gradient-brand text-white"}`}>
            {i === 0 ? <Crown className="w-7 h-7 mx-auto" /> : <Medal className="w-7 h-7 mx-auto" />}
            <div className="text-2xl font-extrabold mt-2">#{i + 1}</div>
            <div className="font-bold mt-1">{u.name}</div>
            <div className="text-[11px] opacity-85">{u.school}</div>
            <div className="mt-2 text-sm font-extrabold">{u.xp.toLocaleString()} XP</div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-white border border-border">
        <ul className="divide-y divide-border">
          {DATA.map((u, i) => (
            <li key={u.name} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-muted grid place-items-center text-xs font-extrabold">{i + 1}</span>
                <div>
                  <div className="font-bold text-sm">{u.name}</div>
                  <div className="text-[10px] text-muted-foreground">{u.school}</div>
                </div>
              </div>
              <span className="text-sm font-extrabold">{u.xp.toLocaleString()} XP</span>
            </li>
          ))}
          <li className="flex items-center justify-between py-3 mt-2 rounded-xl bg-gradient-hero px-3">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-white grid place-items-center text-xs font-extrabold">—</span>
              <div className="font-bold text-sm">Kamu</div>
            </div>
            <span className="text-sm font-extrabold">0 XP</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
