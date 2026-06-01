import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Crown, Receipt, Clock, CheckCircle2, XCircle, AlertCircle, ArrowLeft, Sparkles } from "lucide-react";
import { listMyTransactions, getMySubscription } from "@/lib/api/payment.functions";

export const Route = createFileRoute("/_authenticated/transactions")({
  head: () => ({ meta: [{ title: "Riwayat Transaksi — Eduverse" }] }),
  component: TransactionsPage,
});

const STATUS_STYLE: Record<string, { label: string; cls: string; Icon: typeof Clock }> = {
  success: { label: "Berhasil", cls: "bg-success/15 text-success", Icon: CheckCircle2 },
  pending: { label: "Menunggu", cls: "bg-amber-100 text-amber-700", Icon: Clock },
  failed: { label: "Gagal", cls: "bg-destructive/15 text-destructive", Icon: XCircle },
  expired: { label: "Kedaluwarsa", cls: "bg-muted text-muted-foreground", Icon: AlertCircle },
};

function fmtDate(s: string) {
  return new Date(s).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

function TransactionsPage() {
  const listFn = useServerFn(listMyTransactions);
  const subFn = useServerFn(getMySubscription);
  const txs = useQuery({ queryKey: ["transactions"], queryFn: () => listFn(), refetchInterval: 10_000 });
  const sub = useQuery({ queryKey: ["subscription"], queryFn: () => subFn(), refetchInterval: 10_000 });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>

      {/* Premium status banner */}
      <div className={`p-6 rounded-3xl text-white relative overflow-hidden ${sub.data?.isPremium ? "bg-gradient-brand" : "bg-gradient-pink"}`}>
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/15 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur grid place-items-center">
            {sub.data?.isPremium ? <Crown className="w-7 h-7" /> : <Sparkles className="w-7 h-7" />}
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold opacity-80">STATUS LANGGANAN</div>
            <div className="text-2xl font-extrabold mt-0.5">
              {sub.data?.isPremium ? "Premium Aktif 🎉" : "Free Plan"}
            </div>
            <div className="text-xs opacity-90 mt-1">
              {sub.data?.isPremium && sub.data.currentPeriodEnd
                ? `Berlaku hingga ${fmtDate(sub.data.currentPeriodEnd)}`
                : "Upgrade untuk membuka semua bab & fitur premium."}
            </div>
          </div>
          {!sub.data?.isPremium && (
            <Link to="/subscription" className="px-4 py-2 rounded-full bg-white text-foreground text-sm font-extrabold hover:scale-105 transition-transform">
              Upgrade
            </Link>
          )}
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="text-xl font-extrabold flex items-center gap-2 mb-4">
          <Receipt className="w-5 h-5" /> Riwayat Transaksi
        </h2>

        {txs.isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-2xl bg-muted/50 animate-pulse" />)}
          </div>
        ) : (txs.data?.length ?? 0) === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-border text-center">
            <Receipt className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="font-bold">Belum ada transaksi</p>
            <p className="text-sm text-muted-foreground mt-1">Mulai berlangganan untuk mengakses semua fitur premium.</p>
            <Link to="/subscription" className="inline-block mt-4 px-5 py-2 rounded-full bg-gradient-pink text-white text-sm font-bold">
              Lihat Paket
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {txs.data!.map((t) => {
              const st = STATUS_STYLE[t.status as string] ?? STATUS_STYLE.pending;
              return (
                <div key={t.id} className="p-4 rounded-2xl bg-white border border-border hover:border-primary/40 transition-colors flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${st.cls} grid place-items-center shrink-0`}>
                    <st.Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm">
                        {t.target_kind === "subscription" ? `Premium ${t.target_id}` : `Class · ${t.target_id ?? "-"}`}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                      {t.order_id} · {fmtDate(t.created_at)}
                      {t.payment_type ? ` · ${t.payment_type}` : ""}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-extrabold">Rp {t.gross_amount.toLocaleString("id-ID")}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-center text-[11px] text-muted-foreground">
        Status diperbarui otomatis setelah pembayaran dikonfirmasi oleh Midtrans (biasanya &lt; 1 menit).
      </p>
    </div>
  );
}
