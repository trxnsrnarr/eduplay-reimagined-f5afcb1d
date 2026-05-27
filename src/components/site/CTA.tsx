import { Sparkles } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-brand p-12 md:p-16 text-center text-white shadow-soft">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-white/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" /> Bergabung dengan 50,000+ Siswa
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto">
              Siap Menjelajahi Universe Pembelajaran?
            </h2>
            <p className="mt-4 text-white/90 max-w-xl mx-auto">
              Daftar sekarang dan mulai belajar dengan cara yang menyenangkan. 100% gratis untuk semua siswa!
            </p>
            <button className="mt-8 inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-full shadow-lg hover:-translate-y-0.5 transition-all">
              Mulai Sekarang - Gratis!
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}