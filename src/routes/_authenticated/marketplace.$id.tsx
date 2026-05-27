import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Lock, CheckCircle2, Sparkles, Clock, PlayCircle } from "lucide-react";
import { getCreatorClassDetail } from "@/lib/api/marketplace.functions";
import { createMidtransTransaction, getMidtransClientKey } from "@/lib/api/payment.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/marketplace/$id")({
  head: () => ({ meta: [{ title: "Class Detail — Eduverse" }] }),
  component: ClassDetail,
});

declare global {
  interface Window {
    snap?: { pay: (token: string, opts?: { onSuccess?: () => void; onPending?: () => void; onError?: () => void; onClose?: () => void }) => void };
  }
}

function loadSnap(clientKey: string) {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.snap) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    s.setAttribute("data-client-key", clientKey);
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Gagal memuat Snap.js"));
    document.head.appendChild(s);
  });
}

type Detail = Awaited<ReturnType<typeof getCreatorClassDetail>>;

function ClassDetail() {
  const { id } = Route.useParams();
  const fetchDetail = useServerFn(getCreatorClassDetail);
  const createTx = useServerFn(createMidtransTransaction);
  const getKey = useServerFn(getMidtransClientKey);
  const [data, setData] = useState<Detail | null>(null);
  const [buying, setBuying] = useState(false);

  useEffect(() => { fetchDetail({ data: { id } }).then(setData).catch((e) => toast.error(e.message)); }, [id]);

  const onBuy = async () => {
    if (!data) return;
    setBuying(true);
    try {
      const { clientKey } = await getKey();
      if (!clientKey) {
        toast.error("Midtrans belum dikonfigurasi. Hubungi admin untuk set MIDTRANS_CLIENT_KEY.");
        return;
      }
      await loadSnap(clientKey);
      const { snapToken } = await createTx({ data: { target_kind: "creator_class", target_id: data.klass.id, title: data.klass.title, amount: data.klass.price_idr } });
      window.snap?.pay(snapToken, {
        onSuccess: () => { toast.success("Pembayaran berhasil! Class akan terbuka setelah webhook diproses."); setTimeout(() => fetchDetail({ data: { id } }).then(setData), 2000); },
        onPending: () => toast.info("Menunggu pembayaran…"),
        onError: () => toast.error("Pembayaran gagal"),
        onClose: () => toast.info("Popup ditutup"),
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal");
    } finally { setBuying(false); }
  };

  if (!data) return <div className="h-96 grid place-items-center text-sm text-muted-foreground">Memuat…</div>;
  const k = data.klass;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/marketplace" className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"><ArrowLeft className="w-3.5 h-3.5" /> Marketplace</Link>

      <div className={`p-8 rounded-3xl text-white relative overflow-hidden bg-gradient-to-br ${k.cover_gradient}`}>
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/15 rounded-full blur-2xl" />
        <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">{k.jenjang?.toUpperCase()} {k.jurusan && `· ${k.jurusan}`} {k.mapel && `· ${k.mapel}`}</div>
        <h1 className="font-extrabold text-3xl md:text-4xl mt-2">{k.title}</h1>
        <p className="text-sm opacity-90 mt-2 max-w-2xl">{k.description}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold">
          {k.tier === "premium" ? (
            <span className="px-3 py-1.5 rounded-full bg-white text-foreground inline-flex items-center gap-1"><Sparkles className="w-3 h-3" /> PREMIUM</span>
          ) : (
            <span className="px-3 py-1.5 rounded-full bg-emerald-400 text-white">FREE CLASS</span>
          )}
          <span className="px-3 py-1.5 rounded-full bg-white/20">⭐ {k.rating}</span>
          <span className="px-3 py-1.5 rounded-full bg-white/20">{k.students_count} siswa</span>
          {data.creatorName && <span className="px-3 py-1.5 rounded-full bg-white/20">oleh {data.creatorName}</span>}
        </div>
      </div>

      {!data.isOwned && k.tier === "premium" && (
        <div className="p-6 rounded-3xl border-2 border-primary/30 bg-gradient-hero flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase text-muted-foreground">Buka semua bab + sertifikat</div>
            <div className="text-3xl font-extrabold mt-1">Rp {k.price_idr.toLocaleString("id-ID")}</div>
            <div className="text-xs text-muted-foreground mt-1">Sekali bayar, akses selamanya. Bab 1–3 bisa dicoba gratis.</div>
          </div>
          <button onClick={onBuy} disabled={buying} className="px-6 py-3 rounded-full bg-gradient-pink text-white font-bold shadow-soft disabled:opacity-50">
            {buying ? "Memproses…" : "Unlock Sekarang"}
          </button>
        </div>
      )}

      <div>
        <div className="font-extrabold mb-3">Daftar Bab</div>
        <div className="space-y-2">
          {data.chapters.length === 0 && <div className="p-6 rounded-2xl bg-white border border-border text-sm text-muted-foreground text-center">Belum ada bab.</div>}
          {data.chapters.map((ch) => {
            const accessible = data.isOwned || ch.is_free_preview;
            return (
              <div key={ch.id} className={`p-4 rounded-2xl border-2 flex items-center gap-4 ${accessible ? "bg-white border-border" : "bg-muted/40 border-border/60"}`}>
                <div className={`w-11 h-11 rounded-xl grid place-items-center font-extrabold shrink-0 ${accessible ? `bg-gradient-to-br ${k.cover_gradient} text-white` : "bg-muted text-muted-foreground"}`}>
                  {accessible ? <PlayCircle className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">BAB {ch.bab_index}</span>
                    {ch.is_free_preview && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">FREE PREVIEW</span>}
                  </div>
                  <div className="font-bold mt-0.5">{ch.title}</div>
                  <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" /> {ch.duration_min} menit</div>
                </div>
                {accessible && <CheckCircle2 className="w-5 h-5 text-success/60" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
