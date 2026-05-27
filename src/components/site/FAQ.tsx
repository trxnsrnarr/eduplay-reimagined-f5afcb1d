import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Apakah Eduverse benar-benar gratis?", a: "Ya. Versi Free memberikan akses 3 bab pertama tiap mata pelajaran, quiz dasar, dan AI Tutor 5x per hari. Premium membuka semua modul, tryout, dan game premium." },
  { q: "Bagaimana sistem personalisasi belajarnya bekerja?", a: "Saat daftar, kamu memilih jenjang, kelas, jurusan, dan tujuan belajar. Sistem otomatis menyusun Smart Learning Path dengan modul, quiz, dan tryout yang relevan." },
  { q: "Apakah orang tua bisa memantau anaknya?", a: "Bisa. Orang tua mendaftar dengan role 'Orang Tua' dan menghubungkan akun anak menggunakan kode akun siswa. Dashboard menampilkan progress, streak, dan nilai quiz." },
  { q: "Bagaimana cara menjadi Edu Creator?", a: "Daftar dengan role 'Edu Creator', isi bidang pelajaran dan pengalaman, lalu mulai unggah modul/kelas. Kamu mendapat bagian dari setiap pembelian kelas premium." },
  { q: "Apakah AI Tutor benar-benar adaptif?", a: "Ya. Jawaban AI menyesuaikan jenjang — anak SD mendapat penjelasan sederhana, siswa SMA lebih detail, peserta UTBK lebih intensif dengan latihan soal." },
  { q: "Apakah subscription bisa dibatalkan kapan saja?", a: "Bisa. Tidak ada kontrak jangka panjang — berhenti kapan saja dan akses Premium tetap aktif sampai akhir periode berbayar." },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider">FAQ</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">Pertanyaan yang Sering Ditanyakan</h2>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="rounded-2xl bg-card border border-border px-5">
              <AccordionTrigger className="text-left font-bold hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}