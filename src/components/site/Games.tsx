import { HelpCircle, MousePointer2, Brain, Puzzle } from "lucide-react";

const games = [
  { Icon: HelpCircle, title: "Quiz", desc: "Jawab pertanyaan dengan cepat dan tepat", tag: "Paling Populer", color: "bg-gradient-pink", tagColor: "bg-primary/10 text-primary" },
  { Icon: MousePointer2, title: "Drag & Drop", desc: "Susun dan cocokkan item dengan menyenangkan", tag: "Interaktif", color: "bg-gradient-purple", tagColor: "bg-secondary/10 text-secondary" },
  { Icon: Brain, title: "Memory Game", desc: "Latih ingatan dengan mencocokkan kartu", tag: "Asah Otak", color: "bg-accent", tagColor: "bg-accent/20 text-foreground" },
  { Icon: Puzzle, title: "Puzzle", desc: "Susun gambar dan pecahkan teka-teki", tag: "Menantang", color: "bg-warning", tagColor: "bg-warning/20 text-foreground" },
];

export function Games() {
  return (
    <section id="game" className="py-24 bg-gradient-to-b from-background to-muted/40">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider">JENIS GAME</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">4 Jenis Game Seru! 🎯</h2>
          <p className="mt-3 text-muted-foreground">Berbagai jenis game interaktif yang dirancang untuk membuat belajar tidak membosankan</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((g) => (
            <div key={g.title} className="relative p-6 rounded-3xl bg-card border border-border shadow-card hover:-translate-y-1 hover:shadow-soft transition-all">
              <div className={`w-16 h-16 rounded-2xl ${g.color} grid place-items-center mb-4`}>
                <g.Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold">{g.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 mb-4">{g.desc}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${g.tagColor}`}>{g.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}