const items = [
  { quote: "Anak saya jadi lebih semangat belajar sejak pakai Eduverse. Video pembelajarannya keren dan game-nya seru!", emoji: "👩", name: "Ibu Sari", role: "Orang Tua Siswa SD" },
  { quote: "Tryout UTBK-nya sangat membantu. Prediksi skornya akurat dan pembahasannya detail!", emoji: "👨‍🎓", name: "Andi", role: "Siswa SMA Kelas 12" },
  { quote: "Dashboard guru sangat membantu saya memantau progress siswa. Fitur bulk assign menghemat banyak waktu!", emoji: "👨‍🏫", name: "Pak Budi", role: "Guru SMP" },
];

export function Testimonials() {
  return (
    <section id="testimoni" className="py-24 bg-gradient-to-b from-muted/40 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-foreground text-xs font-bold tracking-wider">TESTIMONI</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">Apa Kata Mereka? 💬</h2>
          <p className="mt-3 text-muted-foreground">Dengarkan pengalaman dari pengguna Eduverse</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t) => (
            <div key={t.name} className="p-7 rounded-3xl bg-card border border-border shadow-card">
              <p className="text-foreground/90 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
                <div className="w-12 h-12 rounded-full bg-gradient-hero grid place-items-center text-2xl">{t.emoji}</div>
                <div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}