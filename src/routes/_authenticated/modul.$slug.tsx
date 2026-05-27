import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Lock, CheckCircle2, FileText, Brain, Trophy, Zap, Clock, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { findMapelBySlug, FREE_BAB_LIMIT, PRICING_BY_JENJANG, type Jenjang } from "@/lib/curriculum";
import { coverFor, PatternSVG } from "@/lib/mapel-cover";

export const Route = createFileRoute("/_authenticated/modul/$slug")({
  head: ({ params }) => ({ meta: [{ title: `Modul ${params.slug} — Eduverse` }] }),
  component: ModulPage,
});

function ModulPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const mapel = findMapelBySlug(slug);
  const [showPaywall, setShowPaywall] = useState(false);
  const [lockedBab, setLockedBab] = useState<{ idx: number; title: string } | null>(null);
  const [jenjang, setJenjang] = useState<Jenjang | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("jenjang").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data?.jenjang) setJenjang(data.jenjang as Jenjang);
    });
  }, [user]);

  if (!mapel) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Modul tidak ditemukan.</p>
        <button onClick={() => navigate({ to: "/modul" })} className="mt-4 px-5 py-2 rounded-full bg-gradient-pink text-white text-sm font-bold">Kembali</button>
      </div>
    );
  }

  const onBabClick = (idx: number, title: string) => {
    if (idx >= FREE_BAB_LIMIT) { setLockedBab({ idx, title }); setShowPaywall(true); return; }
    navigate({ to: "/belajar/$mapel/$bab", params: { mapel: slug, bab: String(idx) } });
  };

  const price = jenjang ? PRICING_BY_JENJANG[jenjang] : null;

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/modul" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali ke daftar modul
      </Link>

      <div className={`p-6 lg:p-8 rounded-3xl ${mapel.color} text-white shadow-soft relative overflow-hidden`}>
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="text-5xl mb-3">{mapel.emoji}</div>
        <h1 className="text-3xl md:text-4xl font-extrabold">{mapel.name}</h1>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold">
          <span className="px-2.5 py-1 rounded-full bg-white/20 inline-flex items-center gap-1"><Star className="w-3 h-3" /> {mapel.difficulty}</span>
          <span className="px-2.5 py-1 rounded-full bg-white/20 inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {mapel.estMinutes} menit / bab</span>
          <span className="px-2.5 py-1 rounded-full bg-white/20 inline-flex items-center gap-1"><Zap className="w-3 h-3" /> +{mapel.xpPerBab} XP / bab</span>
          <span className="px-2.5 py-1 rounded-full bg-white/20">{mapel.bab.length} bab · {FREE_BAB_LIMIT} gratis</span>
        </div>
        <div className="mt-5">
          <div className="flex items-center justify-between text-[11px] font-bold mb-1"><span>Progress modul</span><span>0%</span></div>
          <div className="h-2 rounded-full bg-white/20 overflow-hidden"><div className="h-full w-0 bg-white" /></div>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-4 gap-3">
        {[
          { Icon: FileText, label: "Materi", color: "bg-gradient-pink" },
          { Icon: Brain, label: "Rangkuman", color: "bg-gradient-purple" },
          { Icon: Zap, label: "Latihan", color: "bg-accent" },
          { Icon: Trophy, label: "Quiz", color: "bg-gradient-brand" },
        ].map((f) => (
          <div key={f.label} className="p-4 rounded-2xl bg-white border border-border flex flex-col items-center text-center hover:-translate-y-0.5 transition-all">
            <div className={`w-10 h-10 rounded-xl ${f.color} grid place-items-center mb-2`}><f.Icon className="w-5 h-5 text-white" /></div>
            <div className="text-xs font-bold">{f.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="font-extrabold text-lg mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Daftar Bab</h2>
        <div className="space-y-3">
          {mapel.bab.map((title, idx) => {
            const locked = idx >= FREE_BAB_LIMIT;
            return (
              <button
                key={idx}
                onClick={() => onBabClick(idx, title)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${locked ? "bg-muted/40 border-border/60 hover:border-primary/40" : "bg-white border-border hover:border-primary hover:-translate-y-0.5 hover:shadow-card"}`}
              >
                <div className={`w-12 h-12 rounded-xl grid place-items-center font-extrabold shrink-0 ${locked ? "bg-muted text-muted-foreground" : `${mapel.color} text-white`}`}>
                  {locked ? <Lock className="w-5 h-5" /> : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">BAB {idx + 1}</span>
                    {!locked && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/15 text-success">GRATIS</span>}
                    {locked && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-pink text-white">PREMIUM</span>}
                    <span className="text-[10px] font-bold text-muted-foreground">· +{mapel.xpPerBab} XP</span>
                  </div>
                  <div className={`font-bold mt-0.5 ${locked ? "text-muted-foreground" : ""}`}>{title}</div>
                </div>
                {!locked && <CheckCircle2 className="w-5 h-5 text-success/60" />}
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={showPaywall} onOpenChange={setShowPaywall}>
        <DialogContent className="sm:max-w-md rounded-3xl border-0 p-0 overflow-hidden">
          <div className="bg-gradient-brand text-white p-6">
            <div className="w-12 h-12 rounded-2xl bg-white/20 grid place-items-center mb-3"><Lock className="w-6 h-6" /></div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-extrabold text-white">Bab ini Premium 🔒</DialogTitle>
              <DialogDescription className="text-white/85">
                {lockedBab ? `"${lockedBab.title}" hanya untuk member Premium.` : "Upgrade untuk membuka semua bab."}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6 space-y-4">
            <ul className="space-y-2 text-sm">
              {["Semua bab di setiap mata pelajaran", "AI Tutor unlimited", "Quiz Battle & game premium", "Tryout lengkap + pembahasan", "Sertifikat penyelesaian"].map((f) => (
                <li key={f} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> {f}</li>
              ))}
            </ul>
            {price && (
              <div className="p-4 rounded-2xl bg-gradient-hero border border-border text-center">
                <div className="text-xs font-bold text-muted-foreground">PAKET {price.label.toUpperCase()}</div>
                <div className="text-3xl font-extrabold mt-1">Rp {price.price.toLocaleString("id-ID")}<span className="text-sm font-medium text-muted-foreground">/bulan</span></div>
              </div>
            )}
            <Link to="/subscription" onClick={() => setShowPaywall(false)} className="block w-full text-center py-3 rounded-full bg-gradient-pink text-white font-bold shadow-soft hover:-translate-y-0.5 transition-all">
              Upgrade ke Premium
            </Link>
            <button onClick={() => setShowPaywall(false)} className="block w-full text-center text-sm text-muted-foreground hover:text-foreground">Nanti saja</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
