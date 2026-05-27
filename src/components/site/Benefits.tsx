import { Bot, Gamepad2, LayoutDashboard, BookOpen, Calendar, Users } from "lucide-react";

const items = [
  { Icon: Bot, title: "AI Tutor", desc: "Asisten AI yang siap membantu belajar 24/7", color: "bg-gradient-pink" },
  { Icon: Gamepad2, title: "Gamifikasi", desc: "Kumpulkan badge, naik level, dan bersaing di leaderboard", color: "bg-gradient-purple" },
  { Icon: LayoutDashboard, title: "Dashboard Guru", desc: "Pantau progress siswa dan berikan tugas dengan mudah", color: "bg-accent" },
  { Icon: BookOpen, title: "Kurikulum Lengkap", desc: "Mencakup semua mata pelajaran SD hingga SMA", color: "bg-warning" },
  { Icon: Calendar, title: "Daily Challenge", desc: "Tantangan harian dengan bonus poin spesial", color: "bg-success" },
  { Icon: Users, title: "Parent Dashboard", desc: "Orang tua bisa memantau progress anak", color: "bg-gradient-brand" },
];

export function Benefits() {
  return (
    <section id="fitur" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold tracking-wider">FITUR UNGGULAN</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">Kenapa Pilih Eduverse? 🚀</h2>
          <p className="mt-3 text-muted-foreground">Platform belajar yang didesain khusus untuk membuat pendidikan lebih menyenangkan</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it) => (
            <div key={it.title} className="flex gap-4 p-6 rounded-3xl bg-card border border-border hover:shadow-card transition-all">
              <div className={`shrink-0 w-12 h-12 rounded-2xl ${it.color} grid place-items-center`}>
                <it.Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{it.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}