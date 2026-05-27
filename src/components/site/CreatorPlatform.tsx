import { Upload, DollarSign, BarChart3, Sparkles, Check } from "lucide-react";

const perks = [
  { Icon: Upload, t: "Upload Modul & Kelas", d: "Bangun kelas premium, tryout, atau modul tambahan dalam hitungan menit." },
  { Icon: DollarSign, t: "Revenue Sharing", d: "Dapatkan penghasilan dari setiap siswa yang membeli kelasmu." },
  { Icon: BarChart3, t: "Creator Dashboard", d: "Pantau pendapatan, jumlah siswa, dan engagement secara real-time." },
];

export function CreatorPlatform() {
  return (
    <section id="kreator" className="py-24 bg-background">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold tracking-wider">EDU CREATOR</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">Jadi Kreator Edukasi, Hasilkan Uang dari Ilmu 🎓</h2>
          <p className="mt-4 text-muted-foreground">Eduverse bukan hanya platform belajar — ini juga panggung untuk guru, mahasiswa, dan profesional berbagi ilmu sekaligus mendapatkan penghasilan.</p>
          <div className="mt-6 space-y-3">
            {perks.map((p) => (
              <div key={p.t} className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border">
                <div className="w-10 h-10 rounded-xl bg-gradient-purple grid place-items-center shrink-0">
                  <p.Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold">{p.t}</div>
                  <div className="text-sm text-muted-foreground">{p.d}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 inline-flex items-center gap-2 bg-gradient-purple text-white font-bold px-6 py-3 rounded-full shadow-soft hover:-translate-y-0.5 transition-all">
            <Sparkles className="w-4 h-4" /> Gabung sebagai Edu Creator
          </button>
        </div>

        {/* mock creator dashboard */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-pink opacity-15 blur-3xl rounded-[2.5rem]" />
          <div className="relative rounded-[2rem] bg-white/95 backdrop-blur border border-white/80 shadow-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Creator Dashboard</div>
                <div className="text-lg font-extrabold">Bu Sari · Matematika</div>
              </div>
              <span className="px-3 py-1 rounded-full bg-success/15 text-success text-xs font-bold">Verified</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-gradient-pink text-white">
                <div className="text-[11px] opacity-90">Pendapatan</div>
                <div className="text-lg font-extrabold mt-1">Rp 4.2jt</div>
              </div>
              <div className="p-3 rounded-2xl bg-card border border-border">
                <div className="text-[11px] text-muted-foreground">Siswa</div>
                <div className="text-lg font-extrabold mt-1">312</div>
              </div>
              <div className="p-3 rounded-2xl bg-card border border-border">
                <div className="text-[11px] text-muted-foreground">Rating</div>
                <div className="text-lg font-extrabold mt-1">4.9★</div>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-muted">
              <div className="text-xs font-bold mb-2">Kelas Aktif</div>
              {["Persiapan UTBK Matematika", "Aljabar Kelas 10", "Geometri Asik"].map((k) => (
                <div key={k} className="flex items-center justify-between py-1.5 text-sm">
                  <span className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-success" /> {k}</span>
                  <span className="text-xs text-muted-foreground">Premium</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}