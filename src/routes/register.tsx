import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Sparkles, ArrowLeft, GraduationCap, PenTool, HeartHandshake, Check, Info, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";
import { JENJANG_OPTIONS, JURUSAN_OPTIONS, TUJUAN_OPTIONS, type Jenjang } from "@/lib/curriculum";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Daftar — Eduverse" },
      { name: "description", content: "Daftar gratis sebagai siswa, edu creator, atau orang tua." },
    ],
  }),
  component: RegisterPage,
});

type Role = "siswa" | "creator" | "parent";

const roleCards: { role: Role; Icon: typeof GraduationCap; title: string; desc: string; color: string }[] = [
  { role: "siswa", Icon: GraduationCap, title: "Belajar Sebagai Siswa", desc: "Akses modul, AI tutor, game edukasi, dan tryout.", color: "bg-gradient-pink" },
  { role: "creator", Icon: PenTool, title: "Menjadi Edu Creator", desc: "Buat & jual kelas, modul, dan tryout. Dapatkan penghasilan.", color: "bg-gradient-purple" },
  { role: "parent", Icon: HeartHandshake, title: "Pantau Progress Anak", desc: "Hubungkan akun anak dan pantau perkembangan belajarnya.", color: "bg-accent" },
];

const baseSchema = z.object({
  display_name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80),
  email: z.string().trim().email("Email tidak valid").max(255),
  password: z.string().min(6, "Password minimal 6 karakter").max(72),
});

export function RegisterPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  // shared
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [umur, setUmur] = useState("");
  // siswa
  const [jenjang, setJenjang] = useState<Jenjang | "">("");
  const [kelas, setKelas] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [tujuan, setTujuan] = useState("");
  // creator
  const [bidang, setBidang] = useState("");
  const [pengalaman, setPengalaman] = useState("");
  const [institusi, setInstitusi] = useState("");
  // parent
  const [namaAnak, setNamaAnak] = useState("");
  const [jenjangAnak, setJenjangAnak] = useState("");
  const [kodeAnak, setKodeAnak] = useState("");

  useEffect(() => {
    if (user) navigate({ to: "/dashboard", replace: true });
  }, [user, navigate]);

  const pickRole = (r: Role) => {
    setRole(r);
    setStep(r === "siswa" ? 2 : 3);
  };

  const resetFlow = () => {
    setRole(null);
    setStep(1);
  };

  const jurusanList = jenjang ? JURUSAN_OPTIONS[jenjang] : [];
  const showJurusan = jurusanList.length > 0;

  const onGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (result.error) toast.error("Gagal masuk dengan Google");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!role) return;

    const parsed = baseSchema.safeParse({ display_name: displayName, email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Data tidak valid");
      return;
    }

    if (role === "siswa") {
      if (!jenjang) { toast.error("Pilih jenjang dulu"); return; }
      if (showJurusan && !jurusan) { toast.error("Pilih jurusan dulu"); return; }
      if (!tujuan) { toast.error("Pilih tujuan belajar"); return; }
    }

    const metadata: Record<string, string> = {
      display_name: displayName,
      primary_role: role,
    };
    if (role === "siswa") {
      Object.assign(metadata, { jenjang, kelas, jurusan, tujuan_belajar: tujuan, umur });
    } else if (role === "creator") {
      Object.assign(metadata, { bidang, pengalaman, institusi });
    } else if (role === "parent") {
      Object.assign(metadata, { nama_anak: namaAnak, jenjang_anak: jenjangAnak });
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/dashboard",
        data: metadata,
      },
    });
    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    // If parent provided child invite code & session is active, try to link
    if (role === "parent" && kodeAnak && data.session) {
      const code = kodeAnak.trim().toUpperCase();
      const { data: child } = await supabase.from("profiles").select("id").eq("student_invite_code", code).maybeSingle();
      if (child?.id) {
        await supabase.from("parent_child_links").insert({ parent_id: data.user!.id, child_id: child.id });
      } else {
        toast.warning("Kode anak tidak ditemukan. Bisa dihubungkan nanti di dashboard.");
      }
    }

    setLoading(false);
    if (!data.session) {
      toast.success("Akun dibuat! Cek email untuk verifikasi.");
    } else {
      toast.success("Selamat datang di Eduverse! 🎉");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Kembali ke beranda
        </Link>

        <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-card p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand grid place-items-center"><Sparkles className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-extrabold">Edu<span className="text-gradient-brand">verse</span></span>
          </div>

          {role && <Stepper role={role} step={step} />}

          {step === 1 || !role ? (
            <>
              <h1 className="text-3xl font-extrabold">Daftar Gratis 🚀</h1>
              <p className="text-sm text-muted-foreground mt-1">Langkah 1 dari {role === "siswa" ? 3 : 2}: pilih peranmu.</p>
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                {roleCards.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => pickRole(r.role)}
                    className="text-left p-5 rounded-3xl border-2 border-border bg-card hover:border-primary hover:-translate-y-1 transition-all"
                  >
                    <div className={`w-12 h-12 rounded-2xl ${r.color} grid place-items-center mb-4`}>
                      <r.Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-extrabold">{r.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>
                  </button>
                ))}
              </div>
              <button onClick={onGoogle} className="mt-6 w-full py-3 rounded-full border-2 border-border bg-white font-semibold hover:bg-muted transition-all">
                Atau lanjutkan dengan Google
              </button>
              <p className="mt-6 text-sm text-center text-muted-foreground">
                Sudah punya akun? <Link to="/login" className="font-bold text-primary hover:underline">Masuk</Link>
              </p>
            </>
          ) : step === 2 && role === "siswa" ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-extrabold">Pilih jenjang pendidikan</h1>
                <button type="button" onClick={resetFlow} className="text-sm text-muted-foreground hover:text-foreground">Ganti peran</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {JENJANG_OPTIONS.map((j) => (
                  <button
                    key={j.value}
                    onClick={() => setJenjang(j.value)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${jenjang === j.value ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "border-border bg-card hover:border-primary/50"}`}
                  >
                    <div className="text-2xl">{j.emoji}</div>
                    <div className="mt-2 font-bold text-sm">{j.label}</div>
                  </button>
                ))}
              </div>

              {showJurusan && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pilih jurusan</label>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {jurusanList.map((j) => (
                      <button
                        key={j}
                        onClick={() => setJurusan(j)}
                        className={`px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${jurusan === j ? "border-primary bg-gradient-pink text-white" : "border-border bg-card hover:border-primary/50"}`}
                      >
                        {j}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                disabled={!jenjang || (showJurusan && !jurusan)}
                onClick={() => setStep(3)}
                className="w-full py-3 rounded-full bg-gradient-pink text-white font-bold shadow-soft hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 inline-flex items-center justify-center gap-2"
              >
                Lanjutkan <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-extrabold">
                  {role === "siswa" ? "Lengkapi data kamu" : roleCards.find((r) => r.role === role)!.title}
                </h1>
                {role === "siswa" ? (
                  <button type="button" onClick={() => setStep(2)} className="text-sm text-muted-foreground hover:text-foreground">← Ubah jenjang</button>
                ) : (
                  <button type="button" onClick={resetFlow} className="text-sm text-muted-foreground hover:text-foreground">Ganti peran</button>
                )}
              </div>

              <Field label="Nama lengkap" value={displayName} onChange={setDisplayName} placeholder="Nama kamu" required />
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="kamu@email.com" required />
                <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Min. 6 karakter" required />
              </div>

              {role === "siswa" && (
                <>
                  <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-2 text-xs font-semibold">
                    <span className="px-2 py-1 rounded-lg bg-gradient-pink text-white">{JENJANG_OPTIONS.find(j => j.value === jenjang)?.label}</span>
                    {jurusan && <span className="px-2 py-1 rounded-lg bg-gradient-purple text-white">{jurusan}</span>}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="Umur" type="number" value={umur} onChange={setUmur} placeholder="Contoh: 16" />
                    <Field label="Kelas / Semester" value={kelas} onChange={setKelas} placeholder="Contoh: 11" />
                  </div>
                  <Select label="Tujuan belajar" value={tujuan} onChange={setTujuan} options={TUJUAN_OPTIONS.map((t) => ({ v: t, l: t }))} />
                  <div className="flex gap-3 p-3 rounded-2xl bg-secondary/10 text-xs">
                    <Info className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span>Sistem akan merekomendasikan modul belajar sesuai data yang dipilih.</span>
                  </div>
                </>
              )}

              {role === "creator" && (
                <>
                  <Field label="Bidang pelajaran" value={bidang} onChange={setBidang} placeholder="Matematika, Bahasa Inggris, dll" />
                  <Field label="Pengalaman" value={pengalaman} onChange={setPengalaman} placeholder="Contoh: 5 tahun mengajar SMA" />
                  <Field label="Institusi (opsional)" value={institusi} onChange={setInstitusi} placeholder="Sekolah / bimbel / freelance" />
                </>
              )}

              {role === "parent" && (
                <>
                  <Field label="Nama anak" value={namaAnak} onChange={setNamaAnak} placeholder="Nama lengkap anak" />
                  <Select label="Jenjang anak" value={jenjangAnak} onChange={setJenjangAnak} options={[
                    { v: "sd", l: "SD / MI" },
                    { v: "smp", l: "SMP / MTS" },
                    { v: "sma", l: "SMA" },
                    { v: "smk", l: "SMK" },
                    { v: "utbk", l: "UTBK / TKA" },
                  ]} />
                  <Field label="Kode akun siswa (opsional sekarang)" value={kodeAnak} onChange={setKodeAnak} placeholder="Contoh: A1B2C3D4" />
                  <p className="text-xs text-muted-foreground">Kode bisa dilihat anak di profil mereka. Bisa dihubungkan nanti.</p>
                </>
              )}

              <button disabled={loading} type="submit" className="w-full py-3 rounded-full bg-gradient-pink text-white font-bold shadow-soft hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> {loading ? "Membuat akun..." : "Buat akun"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Stepper({ role, step }: { role: Role; step: 1 | 2 | 3 }) {
  const steps = role === "siswa"
    ? [{ n: 1, l: "Peran" }, { n: 2, l: "Jenjang" }, { n: 3, l: "Data" }]
    : [{ n: 1, l: "Peran" }, { n: 3, l: "Data" }];
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((s, i) => {
        const active = step >= s.n;
        return (
          <div key={s.n} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full grid place-items-center text-xs font-extrabold transition-all ${active ? "bg-gradient-pink text-white shadow-soft" : "bg-muted text-muted-foreground"}`}>{i + 1}</div>
            <div className={`text-xs font-bold ${active ? "text-foreground" : "text-muted-foreground"}`}>{s.l}</div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 rounded-full ${step > s.n ? "bg-gradient-pink" : "bg-muted"}`} />}
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, required }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full px-4 py-3 rounded-2xl border border-border bg-white text-sm outline-none focus:border-primary"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold">{label}</span>
      <select required value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-2xl border border-border bg-white text-sm outline-none focus:border-primary">
        <option value="">Pilih...</option>
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </label>
  );
}