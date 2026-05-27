import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Sparkles, Mail, Lock, LogIn, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Masuk — Eduverse" },
      { name: "description", content: "Masuk ke akun Eduverse untuk melanjutkan belajar." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/dashboard", replace: true });
  }, [user, navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Berhasil masuk!");
  };

  const onGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (result.error) toast.error("Gagal masuk dengan Google");
  };

  return (
    <div className="min-h-screen bg-gradient-hero grid place-items-center p-6">
      <div className="absolute top-6 left-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Kembali ke beranda
        </Link>
      </div>
      <div className="w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-card p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-brand grid place-items-center"><Sparkles className="w-5 h-5 text-white" /></div>
          <span className="text-xl font-extrabold">Edu<span className="text-gradient-brand">verse</span></span>
        </div>
        <h1 className="text-2xl font-extrabold">Selamat datang kembali 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">Lanjutkan belajar dari mana kamu berhenti.</p>

        <button onClick={onGoogle} className="mt-6 w-full py-3 rounded-full border-2 border-border bg-white font-semibold hover:bg-muted transition-all flex items-center justify-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC04" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
          Lanjutkan dengan Google
        </button>

        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">atau</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block">
            <span className="text-xs font-semibold text-foreground">Email</span>
            <div className="mt-1 flex items-center gap-2 px-4 py-3 rounded-2xl border border-border bg-white">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 outline-none text-sm" placeholder="kamu@email.com" />
            </div>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-foreground">Password</span>
            <div className="mt-1 flex items-center gap-2 px-4 py-3 rounded-2xl border border-border bg-white">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="flex-1 outline-none text-sm" placeholder="••••••••" />
            </div>
          </label>
          <button disabled={loading} type="submit" className="w-full py-3 rounded-full bg-gradient-pink text-white font-bold shadow-soft hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" /> {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-muted-foreground">
          Belum punya akun?{" "}
          <Link to="/register" className="font-bold text-primary hover:underline">Daftar gratis</Link>
        </p>
      </div>
    </div>
  );
}