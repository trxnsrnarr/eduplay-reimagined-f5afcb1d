import { Zap, Flame, Award, Crown, Users, Sparkles } from "lucide-react";

const items = [
  { Icon: Zap, color: "bg-gradient-pink", title: "XP & Level", desc: "Setiap aktivitas menambah XP. Naik level untuk membuka avatar baru." },
  { Icon: Flame, color: "bg-warning", title: "Daily Streak", desc: "Login & belajar harian untuk menjaga streak. Streak lama = reward besar." },
  { Icon: Award, color: "bg-gradient-purple", title: "Badge Achievement", desc: "Selesaikan misi khusus untuk membuka badge eksklusif." },
  { Icon: Crown, color: "bg-accent", title: "Leaderboard Mingguan", desc: "Bersaing dengan siswa lain di kelas, sekolah, atau nasional." },
  { Icon: Users, color: "bg-success", title: "Battle Quiz Arena", desc: "Tantang teman dalam pertandingan quiz real-time." },
  { Icon: Sparkles, color: "bg-gradient-brand", title: "Avatar & Frame", desc: "Unlock skin, avatar, dan profile frame eksklusif dari reward." },
];

export function Gamification() {
  return (
    <section id="gamifikasi" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider">GAMIFICATION SYSTEM</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">Belajar yang Bikin Nagih 🔥</h2>
          <p className="mt-3 text-muted-foreground">Sistem gamifikasi penuh — dirancang agar siswa kembali tiap hari tanpa disuruh.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it) => (
            <div key={it.title} className="p-6 rounded-3xl bg-card border border-border hover:shadow-card hover:-translate-y-1 transition-all">
              <div className={`w-12 h-12 rounded-2xl ${it.color} grid place-items-center mb-4`}>
                <it.Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}