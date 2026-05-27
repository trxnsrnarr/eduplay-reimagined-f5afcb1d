import { Flame, Trophy, Sparkles, Play, CheckCircle2, Bot, Target, Zap } from "lucide-react";

export function DashboardMock({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative w-full ${compact ? "max-w-md" : "max-w-2xl"} mx-auto`}>
      {/* glow */}
      <div className="absolute -inset-6 bg-gradient-brand opacity-20 blur-3xl rounded-[2.5rem]" />
      <div className="relative rounded-[2rem] bg-white/90 backdrop-blur-xl border border-white/80 shadow-card p-5 md:p-6 space-y-4">
        {/* top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-brand grid place-items-center text-white font-extrabold">A</div>
            <div>
              <div className="text-xs text-muted-foreground">Halo, Andi 👋</div>
              <div className="text-sm font-bold">Kelas 11 IPA · Level 12</div>
            </div>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-warning/15 text-warning text-xs font-bold">
            <Flame className="w-3.5 h-3.5" /> 14 hari
          </div>
        </div>

        {/* XP bar */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-white">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-foreground">XP Progress</span>
            <span className="text-muted-foreground">2,340 / 3,000</span>
          </div>
          <div className="h-2.5 rounded-full bg-white overflow-hidden">
            <div className="h-full w-[78%] bg-gradient-pink rounded-full" />
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground">660 XP lagi ke Level 13 🚀</div>
        </div>

        {/* grid mini cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-white border border-border">
            <div className="flex items-center gap-2 text-xs font-bold"><Target className="w-3.5 h-3.5 text-primary" /> Challenge Harian</div>
            <div className="mt-2 text-sm font-extrabold">Trigonometri</div>
            <div className="mt-1 text-[11px] text-success font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 3/5 selesai</div>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-border">
            <div className="flex items-center gap-2 text-xs font-bold"><Trophy className="w-3.5 h-3.5 text-warning" /> Leaderboard</div>
            <div className="mt-2 text-sm font-extrabold">Rank #12</div>
            <div className="mt-1 text-[11px] text-muted-foreground">+4 minggu ini</div>
          </div>
        </div>

        {/* learning path */}
        <div className="p-4 rounded-2xl bg-white border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-secondary" /> Smart Learning Path</div>
            <span className="text-[10px] text-muted-foreground">UTBK 2026</span>
          </div>
          <div className="flex items-center gap-2">
            {["Aljabar", "Logika", "Statistik", "Fisika", "Kimia"].map((m, i) => (
              <div key={m} className={`flex-1 text-center py-2 rounded-xl text-[10px] font-bold ${i < 2 ? "bg-gradient-pink text-white" : i === 2 ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                {m}
              </div>
            ))}
          </div>
        </div>

        {/* AI tutor row */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-purple/10 border border-secondary/20">
          <div className="w-9 h-9 rounded-xl bg-gradient-purple grid place-items-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold">AI Tutor aktif</div>
            <div className="text-[11px] text-muted-foreground">"Mau aku jelaskan integral parsial? 🤖"</div>
          </div>
          <button className="px-3 py-1.5 rounded-full bg-secondary text-white text-[11px] font-bold flex items-center gap-1">
            <Play className="w-3 h-3" /> Mulai
          </button>
        </div>

        {/* footer chip */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-primary" /> Personalized untukmu</span>
          <span>Hari ini: 42 menit belajar</span>
        </div>
      </div>
    </div>
  );
}