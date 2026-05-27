import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ShoppingBag, Star, Users, Lock, Sparkles } from "lucide-react";
import { listCreatorClasses } from "@/lib/api/marketplace.functions";

export const Route = createFileRoute("/_authenticated/marketplace")({
  head: () => ({ meta: [{ title: "Creator Class Marketplace — Eduverse" }] }),
  component: Marketplace,
});

function Marketplace() {
  const fetchList = useServerFn(listCreatorClasses);
  const [tier, setTier] = useState<"all" | "free" | "premium">("all");
  const [classes, setClasses] = useState<Awaited<ReturnType<typeof listCreatorClasses>> | null>(null);

  useEffect(() => {
    fetchList({ data: { tier } }).then(setClasses).catch(() => setClasses([]));
  }, [fetchList, tier]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold flex items-center gap-2"><ShoppingBag className="w-7 h-7" /> Creator Class</h1>
        <p className="text-sm text-muted-foreground mt-1">Kelas premium dari creator & guru pilihan. Bab 1–3 gratis untuk semua premium class.</p>
      </div>

      <div className="inline-flex p-1 rounded-full bg-muted">
        {[
          { k: "all" as const, l: "Semua" },
          { k: "free" as const, l: "Gratis" },
          { k: "premium" as const, l: "Premium" },
        ].map((t) => (
          <button key={t.k} onClick={() => setTier(t.k)} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${tier === t.k ? "bg-white shadow-soft" : "text-muted-foreground"}`}>{t.l}</button>
        ))}
      </div>

      {!classes ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />)}
        </div>
      ) : classes.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-border text-center text-sm text-muted-foreground">Belum ada class.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((c) => (
            <Link key={c.id} to="/marketplace/$id" params={{ id: c.id }} className="group rounded-2xl bg-white border-2 border-border overflow-hidden hover:-translate-y-1 hover:shadow-card transition-all">
              <div className={`h-32 relative overflow-hidden bg-gradient-to-br ${c.cover_gradient}`}>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/20 rounded-full blur-xl" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">{c.jenjang?.toUpperCase()} {c.jurusan && `· ${c.jurusan}`}</div>
                    <div className="font-extrabold text-base leading-tight line-clamp-2">{c.title}</div>
                  </div>
                  {c.tier === "premium" ? (
                    <span className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-white text-foreground inline-flex items-center gap-1"><Sparkles className="w-3 h-3" /> PRO</span>
                  ) : (
                    <span className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-emerald-400 text-white">FREE</span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-0.5 font-bold"><Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {c.rating}</span>
                    <span className="inline-flex items-center gap-0.5 text-muted-foreground"><Users className="w-3 h-3" /> {c.students_count}</span>
                  </div>
                  <div className="font-extrabold">
                    {c.isOwned ? <span className="text-emerald-600">Dimiliki</span> : c.tier === "free" ? <span className="text-emerald-600">Gratis</span> : <span>Rp {c.price_idr.toLocaleString("id-ID")}</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="p-6 rounded-3xl bg-gradient-brand text-white relative overflow-hidden">
        <Lock className="w-6 h-6 mb-2 opacity-80" />
        <div className="font-extrabold text-lg">Mau jadi Creator?</div>
        <p className="text-xs text-white/85 mt-1">Dashboard creator class sedang dalam pengembangan oleh tim. Siswa dapat mulai membeli & mengikuti class yang sudah tersedia.</p>
      </div>
    </div>
  );
}
