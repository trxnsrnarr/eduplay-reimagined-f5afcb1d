import { createFileRoute } from "@tanstack/react-router";
import { Crown, CheckCircle2 } from "lucide-react";
import { PRICING_BY_JENJANG, type Jenjang } from "@/lib/curriculum";
import { useProfile } from "@/components/shell/profile-context";

export const Route = createFileRoute("/_authenticated/subscription")({
  head: () => ({ meta: [{ title: "Subscription — Eduverse" }] }),
  component: SubscriptionPage,
});

const BENEFITS = [
  "Akses semua bab di setiap mapel",
  "AI Tutor unlimited",
  "Battle Quiz & game premium",
  "Tryout lengkap + pembahasan",
  "Sertifikat penyelesaian modul",
  "Tanpa iklan",
];

function SubscriptionPage() {
  const profile = useProfile();
  const jenjangPrice = profile?.jenjang ? PRICING_BY_JENJANG[profile.jenjang as Jenjang] : null;

  const plans = [
    { name: "Monthly", price: jenjangPrice?.price ?? 35000, period: "/bulan", featured: false },
    { name: "Yearly", price: (jenjangPrice?.price ?? 35000) * 10, period: "/tahun", featured: true, save: "Hemat 17%" },
    { name: "Family", price: (jenjangPrice?.price ?? 35000) * 2, period: "/bulan", featured: false, sub: "Hingga 4 akun" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-pink text-white text-xs font-bold mb-3">
          <Crown className="w-3.5 h-3.5" /> EDUVERSE PREMIUM
        </div>
        <h1 className="text-4xl font-extrabold">Upgrade & Unlock Semua Fitur</h1>
        <p className="text-sm text-muted-foreground mt-2">Harga menyesuaikan jenjang {jenjangPrice?.label ?? "-"}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <div key={p.name} className={`p-6 rounded-3xl border-2 ${p.featured ? "border-primary bg-white shadow-card relative" : "border-border bg-white"}`}>
            {p.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-1 rounded-full bg-gradient-pink text-white">PALING POPULER</div>}
            <div className="text-sm font-bold text-muted-foreground">{p.name}</div>
            <div className="mt-2 text-3xl font-extrabold">Rp {p.price.toLocaleString("id-ID")}<span className="text-sm font-medium text-muted-foreground">{p.period}</span></div>
            {p.save && <div className="mt-1 text-xs font-bold text-success">{p.save}</div>}
            {p.sub && <div className="mt-1 text-xs text-muted-foreground">{p.sub}</div>}
            <ul className="mt-5 space-y-2">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" /> {b}</li>
              ))}
            </ul>
            <button className={`mt-5 w-full py-3 rounded-full font-bold text-sm ${p.featured ? "bg-gradient-brand text-white" : "bg-muted text-foreground"}`}>
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
