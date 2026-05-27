import { createFileRoute } from "@tanstack/react-router";
import { Award, Lock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/achievement")({
  head: () => ({ meta: [{ title: "Achievement — Eduverse" }] }),
  component: AchievementPage,
});

const BADGES = [
  { name: "First Step", emoji: "👣", desc: "Daftar akun Eduverse", unlocked: true },
  { name: "First Lesson", emoji: "📖", desc: "Selesaikan bab pertamamu", unlocked: false },
  { name: "Streak Master", emoji: "🔥", desc: "Login 7 hari berturut", unlocked: false },
  { name: "Quiz Champion", emoji: "🏆", desc: "Menang 10 Battle Quiz", unlocked: false },
  { name: "Knowledge Seeker", emoji: "🧠", desc: "Selesaikan 5 mata pelajaran", unlocked: false },
  { name: "Top 10", emoji: "👑", desc: "Masuk top 10 leaderboard mingguan", unlocked: false },
  { name: "Game Master", emoji: "🎮", desc: "Main semua game edukasi", unlocked: false },
  { name: "AI Friend", emoji: "🤖", desc: "Chat dengan AI Tutor 50x", unlocked: false },
];

function AchievementPage() {
  const unlocked = BADGES.filter((b) => b.unlocked).length;
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold flex items-center gap-2"><Award className="w-7 h-7" /> Achievement</h1>
        <p className="text-sm text-muted-foreground mt-1">{unlocked} dari {BADGES.length} badge unlocked</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {BADGES.map((b) => (
          <div key={b.name} className={`p-5 rounded-2xl border-2 text-center ${b.unlocked ? "bg-white border-primary shadow-soft" : "bg-muted/30 border-border opacity-60"}`}>
            <div className="text-4xl mb-2 relative inline-block">
              {b.unlocked ? b.emoji : <span className="opacity-40">{b.emoji}</span>}
              {!b.unlocked && <Lock className="absolute -bottom-1 -right-1 w-4 h-4 text-muted-foreground" />}
            </div>
            <div className="font-extrabold text-sm">{b.name}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{b.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
