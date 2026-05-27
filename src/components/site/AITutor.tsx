import { Bot, Sparkles, Sigma, BookOpen, Network } from "lucide-react";

export function AITutor() {
  const messages = [
    { from: "user", text: "Apa itu subnetting?", level: "SMK TKJ" },
    { from: "ai", text: "Subnetting itu seperti membagi satu kompleks rumah jadi RT/RW. Tujuannya supaya alamat IP lebih rapi dan efisien. Mau lihat contoh perhitungan /24? 🧮" },
    { from: "user", text: "Jelaskan integral parsial", level: "SMA" },
    { from: "ai", text: "Rumus ∫u dv = uv − ∫v du. Pilih u yang turunannya makin sederhana. Coba soal: ∫x·eˣ dx 👇" },
  ];

  return (
    <section id="ai-tutor" className="py-24 bg-background">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold tracking-wider">AI STUDY ASSISTANT</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">AI Tutor yang Paham Levelmu 🤖</h2>
          <p className="mt-4 text-muted-foreground">Tanya apa saja — dari matematika SD sampai materi UTBK. Jawabannya menyesuaikan jenjang dan gaya belajarmu. Tidak ada lagi penjelasan yang terlalu sulit atau terlalu mudah.</p>
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {[
              { Icon: BookOpen, t: "SD/MI", d: "Penjelasan sederhana" },
              { Icon: Sigma, t: "SMA", d: "Detail & rumus" },
              { Icon: Network, t: "UTBK", d: "Latihan intensif" },
            ].map((x) => (
              <div key={x.t} className="p-4 rounded-2xl bg-card border border-border">
                <x.Icon className="w-5 h-5 text-primary" />
                <div className="mt-2 text-sm font-bold">{x.t}</div>
                <div className="text-xs text-muted-foreground">{x.d}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-purple opacity-20 blur-3xl rounded-[2.5rem]" />
          <div className="relative rounded-[2rem] bg-white/90 backdrop-blur-xl border border-white/80 shadow-card p-5 space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <div className="w-9 h-9 rounded-xl bg-gradient-purple grid place-items-center"><Bot className="w-4 h-4 text-white" /></div>
              <div>
                <div className="text-sm font-bold flex items-center gap-1">Eduverse AI <Sparkles className="w-3 h-3 text-secondary" /></div>
                <div className="text-[11px] text-success font-semibold">● online · adaptif per jenjang</div>
              </div>
            </div>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${m.from === "user" ? "bg-gradient-pink text-white rounded-br-sm" : "bg-muted rounded-bl-sm"}`}>
                  {m.from === "user" && m.level && <div className="text-[10px] font-bold opacity-80 mb-1">{m.level}</div>}
                  {m.text}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <input disabled placeholder="Tanya AI Tutor..." className="flex-1 px-4 py-2.5 rounded-full bg-muted text-sm" />
              <button className="px-4 py-2.5 rounded-full bg-gradient-purple text-white text-sm font-bold">Kirim</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}