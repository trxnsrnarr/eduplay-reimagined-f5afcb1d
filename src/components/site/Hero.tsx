import { Sparkles, GraduationCap, UserPlus, Check, Shield, Zap, ChevronRight } from "lucide-react";
import { HeroOrbit } from "./HeroOrbit";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero min-h-[calc(100vh-72px)] flex items-center">
      {/* background blobs */}
      <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-primary/20 blur-3xl rounded-full" />
      <div className="absolute top-20 -right-40 w-[34rem] h-[34rem] bg-secondary/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-40 left-1/3 w-[28rem] h-[28rem] bg-accent/20 blur-3xl rounded-full" />

      <div className="container mx-auto px-6 py-20 lg:py-16 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative">
        <div className="text-center lg:text-left order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur border border-white/80 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">Platform Edukasi Interaktif #1 di Indonesia</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-foreground">
            Jelajahi <span className="text-gradient-brand">Universe</span> Pembelajaran <br className="hidden md:block" />dengan Cara Baru!
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
            Video learning, tryout UTBK, game edukatif, dan AI tutor dalam satu platform. Belajar jadi lebih seru dan efektif!
          </p>
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start">
            <a href="/register" className="inline-flex items-center justify-center gap-2 bg-gradient-pink text-white font-semibold px-7 py-4 rounded-full shadow-soft hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-10px_oklch(0.68_0.22_5_/_0.5)] transition-all">
              <GraduationCap className="w-5 h-5" /> Mulai Belajar Gratis <ChevronRight className="w-4 h-4" />
            </a>
            <a href="/register" className="inline-flex items-center justify-center gap-2 bg-white border-2 border-primary text-primary font-semibold px-7 py-4 rounded-full hover:bg-primary/5 transition-all">
              <UserPlus className="w-5 h-5" /> Daftar sebagai Guru
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm justify-center lg:justify-start">
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> <span className="font-medium">100% Gratis</span></div>
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-secondary" /> <span className="font-medium">Aman untuk Anak</span></div>
            <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-warning" /> <span className="font-medium">AI-Powered</span></div>
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          <HeroOrbit />
        </div>
      </div>
    </section>
  );
}
