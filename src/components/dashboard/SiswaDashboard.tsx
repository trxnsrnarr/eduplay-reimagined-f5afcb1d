import { Link } from "@tanstack/react-router";
import { Flame, Trophy, Target, Bot, Copy, Folder, Lock, Zap, ChevronRight, Sparkles, Clock, TrendingUp, Star, BookOpen, PlayCircle, Award } from "lucide-react";
import { toast } from "sonner";
import type { Profile } from "./types";
import { getMapelForTrack, FREE_BAB_LIMIT, type Jenjang } from "@/lib/curriculum";

const CHALLENGES = [
  { title: "Selesaikan 1 quiz harian", xp: 50, done: false },
  { title: "Belajar 20 menit hari ini", xp: 30, done: false },
  { title: "Buka 1 modul baru", xp: 20, done: false },
];

const LEADERBOARD = [
  { name: "Aisyah", xp: 4820, rank: 1 },
  { name: "Rifky", xp: 4310, rank: 2 },
  { name: "Naufal", xp: 3980, rank: 3 },
  { name: "Kamu", xp: 0, rank: "—" as number | string },
];

const ACTIVITY = [
  { icon: "🎉", text: "Akun baru dibuat", time: "Baru saja" },
  { icon: "🎯", text: "Daily challenge tersedia", time: "Baru saja" },
];

export function SiswaDashboard({ profile }: { profile: Profile }) {
  const copyCode = () => {
    if (!profile.student_invite_code) return;
    navigator.clipboard.writeText(profile.student_invite_code);
    toast.success("Kode disalin");
  };

  const mapelList = getMapelForTrack(profile.jenjang as Jenjang | null, profile.jurusan);
  const continueLearning = mapelList.slice(0, 3);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-brand text-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative grid lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[11px] font-bold mb-3">
              <Sparkles className="w-3 h-3" /> LEVEL 1 · NEWBIE
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold">Halo, {profile.display_name ?? "Belajar"} 👋</h1>
            <p className="text-white/85 mt-1 text-sm">
              {profile.jenjang?.toUpperCase() ?? "-"}{profile.kelas ? ` · Kelas ${profile.kelas}` : ""}{profile.jurusan ? ` · ${profile.jurusan}` : ""} · Yuk mulai perjalanan belajarmu!
            </p>
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span>XP 0 / 100</span>
                <span className="text-white/80">100 XP ke Level 2</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full w-0 bg-white" />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/modul" className="px-4 py-2 rounded-full bg-white text-foreground text-sm font-bold inline-flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Mulai Belajar
              </Link>
              <Link to="/daily-challenge" className="px-4 py-2 rounded-full bg-white/20 text-white text-sm font-bold inline-flex items-center gap-1.5">
                <Target className="w-4 h-4" /> Daily Challenge
              </Link>
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-3">
            <MiniStat Icon={Flame} label="Streak" value="0" sub="hari" />
            <MiniStat Icon={Trophy} label="Rank" value="—" sub="global" />
            <MiniStat Icon={Star} label="Level" value="1" sub="newbie" />
            <MiniStat Icon={Zap} label="XP" value="0" sub="total" />
          </div>
        </div>
      </div>

      {/* Mobile stats */}
      <div className="grid grid-cols-2 lg:hidden gap-3">
        <MiniStat Icon={Flame} label="Streak" value="0" sub="hari" dark />
        <MiniStat Icon={Trophy} label="Rank" value="—" sub="global" dark />
        <MiniStat Icon={Star} label="Level" value="1" sub="newbie" dark />
        <MiniStat Icon={Zap} label="XP" value="0" sub="total" dark />
      </div>

      {/* Continue learning */}
      <div className="p-6 rounded-3xl bg-white border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-lg flex items-center gap-2"><PlayCircle className="w-5 h-5" /> Lanjutkan Belajar</h2>
          <Link to="/modul" className="text-xs font-bold text-primary inline-flex items-center gap-1">Lihat semua <ChevronRight className="w-3 h-3" /></Link>
        </div>
        {continueLearning.length === 0 ? (
          <div className="p-6 rounded-2xl bg-muted/40 text-center text-sm text-muted-foreground">
            Lengkapi jenjang & jurusan untuk rekomendasi modul.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {continueLearning.map((m) => (
              <Link key={m.slug} to="/modul/$slug" params={{ slug: m.slug }} className="group p-4 rounded-2xl border-2 border-border hover:border-primary hover:-translate-y-1 hover:shadow-card transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${m.color} grid place-items-center text-2xl shadow-soft`}>{m.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-sm truncate">{m.name}</div>
                    <div className="text-[11px] text-muted-foreground">{m.bab.length} bab · {m.difficulty}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                    <span className="text-muted-foreground">Progress</span><span>0%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full w-0 bg-gradient-brand" /></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 3-col layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-extrabold text-lg flex items-center gap-2"><Folder className="w-5 h-5" /> Modul Belajar Kamu</h2>
              <span className="text-xs font-bold text-muted-foreground">{mapelList.length} mapel</span>
            </div>
            {mapelList.length === 0 ? (
              <div className="p-6 rounded-2xl bg-muted/40 text-center text-sm text-muted-foreground">Belum ada modul.</div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {mapelList.slice(0, 6).map((m) => {
                  const lockedCount = Math.max(0, m.bab.length - FREE_BAB_LIMIT);
                  return (
                    <Link key={m.slug} to="/modul/$slug" params={{ slug: m.slug }} className="group p-4 rounded-2xl border-2 border-border bg-card hover:border-primary hover:-translate-y-0.5 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div className={`w-11 h-11 rounded-xl ${m.color} grid place-items-center text-xl shadow-soft`}>{m.emoji}</div>
                        {lockedCount > 0 && <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground"><Lock className="w-3 h-3" /> {lockedCount}</span>}
                      </div>
                      <div className="font-extrabold text-sm">{m.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-2">
                        <span className="inline-flex items-center gap-0.5"><Clock className="w-3 h-3" /> {m.estMinutes}m</span>
                        <span>·</span><span>+{m.xpPerBab} XP</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-6 rounded-3xl bg-white border border-border">
            <h2 className="font-extrabold text-lg flex items-center gap-2 mb-4"><Zap className="w-5 h-5 text-warning" /> Daily Challenge</h2>
            <ul className="space-y-2">
              {CHALLENGES.map((c) => (
                <li key={c.title} className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30">
                  <div className={`w-5 h-5 rounded-full border-2 ${c.done ? "bg-gradient-pink border-transparent" : "border-border"}`} />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{c.title}</div>
                    <div className="text-xs text-muted-foreground">+{c.xp} XP</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-border">
            <h2 className="font-extrabold text-base flex items-center gap-2 mb-3"><Trophy className="w-4 h-4" /> Leaderboard Minggu Ini</h2>
            <ul className="space-y-2">
              {LEADERBOARD.map((u) => (
                <li key={u.name} className={`flex items-center justify-between p-2.5 rounded-xl ${u.name === "Kamu" ? "bg-gradient-hero" : ""}`}>
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-muted grid place-items-center text-[11px] font-extrabold">{u.rank}</span>
                    <span className="font-semibold text-sm">{u.name}</span>
                  </div>
                  <span className="text-xs font-bold">{u.xp.toLocaleString()} XP</span>
                </li>
              ))}
            </ul>
            <Link to="/leaderboard" className="mt-3 block text-center text-xs font-bold text-primary">Lihat lengkap →</Link>
          </div>

          <Link to="/ai-tutor" className="block p-5 rounded-3xl bg-gradient-purple text-white">
            <Bot className="w-7 h-7 mb-2" />
            <div className="font-extrabold">AI Tutor</div>
            <div className="text-xs text-white/85 mt-0.5">Tanya apapun, jawaban adaptif sesuai jenjang kamu.</div>
            <div className="mt-3 text-xs font-bold inline-flex items-center gap-1">Chat sekarang <ChevronRight className="w-3 h-3" /></div>
          </Link>

          <div className="p-5 rounded-3xl bg-white border border-border">
            <h2 className="font-extrabold text-base flex items-center gap-2 mb-3"><TrendingUp className="w-4 h-4" /> Recent Activity</h2>
            <ul className="space-y-2">
              {ACTIVITY.map((a, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <span className="text-lg">{a.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold">{a.text}</div>
                    <div className="text-[10px] text-muted-foreground">{a.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {profile.student_invite_code && (
        <div className="p-5 rounded-3xl bg-white border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-muted-foreground">KODE AKUN SISWA</div>
            <div className="text-2xl font-extrabold tracking-widest mt-1">{profile.student_invite_code}</div>
            <div className="text-xs text-muted-foreground mt-1">Bagikan ke orang tua untuk menautkan akun.</div>
          </div>
          <button onClick={copyCode} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-pink text-white text-sm font-bold">
            <Copy className="w-4 h-4" /> Salin
          </button>
        </div>
      )}
    </div>
  );
}

function MiniStat({ Icon, label, value, sub, dark = false }: { Icon: typeof Flame; label: string; value: string; sub: string; dark?: boolean }) {
  return (
    <div className={`p-3 rounded-2xl ${dark ? "bg-white border border-border" : "bg-white/15 backdrop-blur"}`}>
      <Icon className={`w-4 h-4 mb-1 ${dark ? "" : "text-white"}`} />
      <div className={`text-[10px] font-bold ${dark ? "text-muted-foreground" : "text-white/80"}`}>{label}</div>
      <div className={`text-xl font-extrabold ${dark ? "" : "text-white"}`}>{value} <span className={`text-[10px] font-bold ${dark ? "text-muted-foreground" : "text-white/80"}`}>{sub}</span></div>
    </div>
  );
}
