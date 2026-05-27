import { UserCircle2, Sparkles, Rocket } from "lucide-react";

const steps = [
  { Icon: UserCircle2, num: "01", title: "Pilih Jenjang & Tujuan", desc: "Daftar singkat: jenjang, kelas, jurusan, dan tujuan belajarmu (UTBK, naik kelas, dll)." },
  { Icon: Sparkles, num: "02", title: "Smart Learning Path Otomatis", desc: "Sistem menyusun roadmap belajar personal — modul, quiz, tryout, dan jadwal mingguan." },
  { Icon: Rocket, num: "03", title: "Belajar, Main, Naik Level", desc: "Kumpulkan XP, jaga streak, kalahkan leaderboard. Belajar yang nagih dan terukur." },
];

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/15 text-accent-foreground text-xs font-bold tracking-wider">CARA KERJA</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">3 Langkah, Siap Belajar 🎯</h2>
          <p className="mt-3 text-muted-foreground">Tidak ada onboarding rumit. Dalam 2 menit kamu sudah punya jalur belajar sendiri.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 relative">
          {steps.map((s) => (
            <div key={s.num} className="relative p-8 rounded-3xl bg-card border border-border shadow-card hover:-translate-y-1 transition-all">
              <div className="absolute -top-4 left-6 px-3 py-1 rounded-full bg-gradient-brand text-white text-xs font-extrabold tracking-wider">{s.num}</div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-pink grid place-items-center mb-5 mt-2">
                <s.Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}