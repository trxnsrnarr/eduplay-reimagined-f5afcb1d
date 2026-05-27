import { Sparkles, GraduationCap, UserPlus, Check, Shield, Zap, ChevronRight, Trophy, Bot, Target, Flame } from "lucide-react";
import { DashboardMock } from "./DashboardMock";

export function Hero() {
  const floatingCards = [
    { label: "+50 XP Earned", Icon: Zap, color: "bg-gradient-pink", pos: "left-0 top-10 md:-left-8" },
    { label: "Daily Challenge ✓", Icon: Target, color: "bg-success", pos: "right-0 top-24 md:-right-6" },
    { label: "AI Tutor Active", Icon: Bot, color: "bg-gradient-purple", pos: "left-2 bottom-32 md:-left-10" },
    { label: "Rank #12 This Week", Icon: Trophy, color: "bg-warning", pos: "right-2 bottom-12 md:-right-8" },
    { label: "🔥 14 day streak", Icon: Flame, color: "bg-gradient-brand", pos: "left-1/2 -top-2 md:-top-4 -translate-x-1/2" },
  ];

  const particles = [
    { c: "bg-primary/70", s: "w-3 h-3", p: "top-10 left-1/4" },
    { c: "bg-secondary/70", s: "w-4 h-4", p: "top-1/3 right-10" },
    { c: "bg-accent/70", s: "w-2.5 h-2.5", p: "bottom-20 left-8" },
    { c: "bg-primary/60", s: "w-2 h-2", p: "bottom-32 right-1/4" },
    { c: "bg-secondary/60", s: "w-3 h-3", p: "top-1/2 left-6" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-hero min-h-screen flex items-center">
      {/* background blobs */}
      <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-primary/25 blur-3xl rounded-full animate-blob" />
      <div className="absolute top-20 -right-40 w-[34rem] h-[34rem] bg-secondary/25 blur-3xl rounded-full animate-blob" style={{ animationDelay: "2s" }} />
      <div className="absolute -bottom-40 left-1/3 w-[28rem] h-[28rem] bg-accent/25 blur-3xl rounded-full animate-blob" style={{ animationDelay: "4s" }} />

      {/* floating particles */}
      {particles.map((p, i) => (
        <span key={i} className={`absolute ${p.p} ${p.s} ${p.c} rounded-full blur-[2px] animate-float`} style={{ animationDelay: `${i * 0.6}s` }} />
      ))}

      <div className="container mx-auto px-6 py-24 lg:py-20 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative">
        <div className="text-center lg:text-left order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur border border-white/80 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">Platform Edukasi Interaktif #1 di Indonesia</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-foreground">
            Jelajahi <span className="text-gradient-brand">Universe</span> Pembelajaran dengan Cara Baru!
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
            Video learning, tryout UTBK, game edukatif, dan AI tutor dalam satu platform. Belajar jadi lebih seru dan efektif!
          </p>
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start">
            <button className="inline-flex items-center justify-center gap-2 bg-gradient-pink text-white font-semibold px-7 py-4 rounded-full shadow-soft hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-10px_oklch(0.68_0.22_5_/_0.5)] transition-all">
              <GraduationCap className="w-5 h-5" /> Mulai Belajar Gratis <ChevronRight className="w-4 h-4" />
            </button>
            <button className="inline-flex items-center justify-center gap-2 bg-white border-2 border-primary text-primary font-semibold px-7 py-4 rounded-full hover:bg-primary/5 transition-all">
              <UserPlus className="w-5 h-5" /> Daftar sebagai Guru
            </button>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm justify-center lg:justify-start">
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> <span className="font-medium">100% Gratis</span></div>
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-secondary" /> <span className="font-medium">Aman untuk Anak</span></div>
            <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-warning" /> <span className="font-medium">AI-Powered</span></div>
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          <div className="animate-float" style={{ animationDuration: "7s" }}>
            <DashboardMock />
          </div>

          {floatingCards.map(({ Icon, color, pos, label }, i) => (
            <div
              key={i}
              className={`hidden md:flex absolute ${pos} items-center gap-2 px-3 py-2 rounded-2xl bg-white/95 backdrop-blur shadow-card animate-float border border-white`}
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              <div className={`w-8 h-8 rounded-xl ${color} grid place-items-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-bold whitespace-nowrap">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}