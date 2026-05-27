import { Check, Sparkles } from "lucide-react";

const tiers = [
  { name: "SD / MI", emoji: "🎒", price: 15000 },
  { name: "SMP / MTS", emoji: "📘", price: 25000 },
  { name: "SMA / SMK", emoji: "🎓", price: 35000, best: true },
  { name: "Kuliah / UTBK", emoji: "🚀", price: 60000 },
];

const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID");

const freeFeatures = ["3 bab pertama tiap mata pelajaran", "Quiz dasar", "XP & streak basic", "AI Tutor 5x/hari"];
const proFeatures = [
  "Akses semua modul & bab",
  "AI Tutor unlimited (adaptif)",
  "Tryout lengkap + pembahasan",
  "Battle Quiz Arena & game premium",
  "Leaderboard penuh + reward",
  "Sertifikat penyelesaian",
];

export function Pricing() {
  return (
    <section id="harga" className="py-24 bg-gradient-to-b from-background to-muted/40">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-success/15 text-success text-xs font-bold tracking-wider">SUBSCRIPTION</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">Mulai Gratis, Upgrade Saat Siap 💎</h2>
          <p className="mt-3 text-muted-foreground">Freemium — semua siswa bisa mencoba. Premium membuka semua fitur sesuai jenjang.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Free */}
          <div className="p-8 rounded-3xl bg-card border border-border shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-extrabold">Free</h3>
              <span className="px-3 py-1 rounded-full bg-muted text-xs font-bold">Selamanya</span>
            </div>
            <div className="mt-4 text-4xl font-extrabold">Rp 0</div>
            <p className="mt-1 text-sm text-muted-foreground">Cocok untuk mencoba platform.</p>
            <ul className="mt-6 space-y-3">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-success" /> {f}
                </li>
              ))}
            </ul>
            <button className="mt-8 w-full py-3 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-all">Mulai Gratis</button>
          </div>

          {/* Premium */}
          <div className="relative p-8 rounded-3xl bg-gradient-brand text-white shadow-soft overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-extrabold flex items-center gap-2">Premium <Sparkles className="w-5 h-5" /></h3>
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold">Paling Populer</span>
            </div>
            <div className="mt-4 text-4xl font-extrabold">mulai Rp 15.000<span className="text-sm font-medium opacity-80">/bulan</span></div>
            <p className="mt-1 text-sm opacity-90">Harga berbeda per jenjang — bayar sesuai kebutuhan.</p>
            <ul className="mt-6 space-y-3">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4" /> {f}
                </li>
              ))}
            </ul>
            <button className="mt-8 w-full py-3 rounded-full bg-white text-primary font-bold hover:-translate-y-0.5 transition-all">Upgrade ke Premium</button>
          </div>
        </div>

        {/* tier per jenjang */}
        <div className="mt-10">
          <h3 className="text-center text-sm font-bold text-muted-foreground tracking-wider mb-4">HARGA PER JENJANG</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {tiers.map((t) => (
              <div key={t.name} className={`relative p-5 rounded-2xl bg-card border-2 text-center transition-all hover:-translate-y-1 ${t.best ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
                {t.best && <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-gradient-pink text-white text-[10px] font-bold">TERLARIS</span>}
                <div className="text-3xl mb-1">{t.emoji}</div>
                <div className="text-xs text-muted-foreground font-bold">{t.name}</div>
                <div className="mt-2 text-xl font-extrabold">{fmt(t.price)}<span className="text-xs font-medium text-muted-foreground">/bln</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}