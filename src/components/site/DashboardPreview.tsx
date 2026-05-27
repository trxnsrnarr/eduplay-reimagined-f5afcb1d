import { DashboardMock } from "./DashboardMock";
import { Check } from "lucide-react";

const points = [
  "Dashboard berubah otomatis sesuai jenjang & jurusan",
  "Rekomendasi modul harian + target mingguan",
  "Streak, XP, dan progres terlihat real-time",
  "Akses cepat ke AI Tutor, game, dan tryout",
];

export function DashboardPreview() {
  return (
    <section id="dashboard" className="py-24 bg-gradient-to-b from-muted/40 to-background">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <DashboardMock />
        </div>
        <div className="order-1 lg:order-2">
          <span className="inline-block px-4 py-1.5 rounded-full bg-warning/15 text-warning text-xs font-bold tracking-wider">PREVIEW DASHBOARD</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">Belajar Terasa Seperti Main Game ✨</h2>
          <p className="mt-4 text-muted-foreground">Tidak ada lagi tampilan portal sekolah yang membosankan. Dashboard Eduverse menampilkan progress, challenge, dan reward dengan visual yang fun dan jelas.</p>
          <ul className="mt-6 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-success/15 text-success grid place-items-center"><Check className="w-3 h-3" strokeWidth={3} /></span>
                <span className="text-sm font-medium">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}