import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, LinkIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard/link-anak")({
  head: () => ({ meta: [{ title: "Tautkan Akun Anak — Eduverse" }] }),
  component: LinkChildPage,
});

function LinkChildPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 4) {
      toast.error("Masukkan kode siswa yang valid");
      return;
    }
    setLoading(true);
    const { error } = await supabase.rpc("link_child_by_code", { _code: trimmed });
    setLoading(false);
    if (error) {
      toast.error(error.message ?? "Gagal menautkan akun");
      return;
    }
    toast.success("Akun anak berhasil ditautkan");
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] grid place-items-center px-6 py-10">
      <div className="w-full max-w-md">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Kembali ke dashboard
        </Link>
        <div className="p-8 rounded-3xl bg-white border border-border shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-gradient-brand grid place-items-center mb-4">
            <LinkIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold">Tautkan Akun Anak</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Minta anak membuka dashboard mereka dan menyalin <span className="font-semibold">Kode Akun Siswa</span>, lalu masukkan di sini.
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-bold text-muted-foreground">KODE SISWA</span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="MIS. A1B2C3D4"
                className="mt-2 w-full px-4 py-3 rounded-2xl border border-border bg-background text-lg font-extrabold tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={12}
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-brand text-white font-bold disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
              Tautkan Akun
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}