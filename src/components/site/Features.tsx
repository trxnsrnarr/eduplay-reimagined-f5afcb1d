import { Video, FileSpreadsheet, Route as RouteIcon } from "lucide-react";

const features = [
  { Icon: Video, title: "Video Learning", desc: "Ribuan video pembelajaran berkualitas dari guru-guru terbaik Indonesia", color: "bg-gradient-pink" },
  { Icon: FileSpreadsheet, title: "Tryout UTBK", desc: "Simulasi ujian dengan sistem scoring IRT dan prediksi passing grade", color: "bg-gradient-purple" },
  { Icon: RouteIcon, title: "Learning Path", desc: "Jalur belajar terstruktur sesuai kurikulum nasional SD-SMA", color: "bg-accent" },
];

export function Features() {
  return (
    <section id="platform" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold tracking-wider">PLATFORM LENGKAP</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">Semua yang Kamu Butuhkan 🚀</h2>
          <p className="mt-3 text-muted-foreground">Dari video learning hingga simulasi UTBK, semua ada di Eduverse</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="group p-8 rounded-3xl bg-card border border-border shadow-card hover:-translate-y-1 transition-all">
              <div className={`w-14 h-14 rounded-2xl ${f.color} grid place-items-center mb-5 group-hover:scale-110 transition-transform`}>
                <f.Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}