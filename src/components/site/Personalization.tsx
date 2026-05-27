import { GraduationCap, Cpu, Target } from "lucide-react";

const tracks = [
  {
    Icon: GraduationCap,
    color: "bg-gradient-pink",
    badge: "Siswa SD",
    title: "Belajar Dasar Seru",
    path: ["Membaca", "Berhitung", "IPA Dasar", "Bahasa Inggris"],
  },
  {
    Icon: Cpu,
    color: "bg-gradient-purple",
    badge: "SMK TKJ",
    title: "Jaringan & Server",
    path: ["Subnetting", "Routing", "Linux Server", "Keamanan Jaringan"],
  },
  {
    Icon: Target,
    color: "bg-accent",
    badge: "UTBK 2026",
    title: "Intensif Tryout",
    path: ["Penalaran Umum", "Literasi", "Matematika", "Tryout Mingguan"],
  },
];

export function Personalization() {
  return (
    <section id="personalisasi" className="py-24 bg-gradient-to-b from-background via-muted/40 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider">PERSONALIZED LEARNING</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">Setiap Siswa, Jalur Belajar Berbeda 🧭</h2>
          <p className="mt-3 text-muted-foreground">Smart Learning Path otomatis menyesuaikan modul, quiz, dan tryout dengan umur, kelas, jurusan, dan tujuanmu.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {tracks.map((t) => (
            <div key={t.badge} className="p-6 rounded-3xl bg-card border border-border shadow-card hover:-translate-y-1 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${t.color} grid place-items-center`}>
                  <t.Icon className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 rounded-full bg-muted text-xs font-bold">{t.badge}</span>
              </div>
              <h3 className="text-lg font-bold">{t.title}</h3>
              <div className="mt-4 space-y-2">
                {t.path.map((p, i) => (
                  <div key={p} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full grid place-items-center text-[11px] font-extrabold ${i === 0 ? "bg-gradient-pink text-white" : i === 1 ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 text-sm font-semibold">{p}</div>
                    {i === 0 && <span className="text-[10px] font-bold text-success">Sedang berjalan</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}