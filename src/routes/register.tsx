import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, GraduationCap, PenTool, HeartHandshake, Check, ChevronRight, ChevronLeft, Search, Target } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";
import {
  JENJANG_OPTIONS, SMA_JURUSAN, SMK_JURUSAN_GROUPS, FAKULTAS_OPTIONS, KULIAH_PRODI,
  UTBK_RUMPUN, AGAMA_OPTIONS, type Jenjang,
} from "@/lib/curriculum";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [
    { title: "Daftar — Eduverse" },
    { name: "description", content: "Daftar gratis sebagai siswa, edu creator, atau orang tua." },
  ]}),
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

const KELAS_BY_JENJANG: Record<Jenjang, string[]> = {
  sd: ["1", "2", "3", "4", "5", "6"],
  smp: ["7", "8", "9"],
  sma: ["10", "11", "12"],
  smk: ["10", "11", "12", "13 (4 tahun)"],
  kuliah: ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8+"],
  utbk: ["Gap year", "Kelas 12", "Alumni"],
};

type SiswaStep = "role" | "jenjang" | "kelas" | "jurusan" | "agama" | "akun";

export function RegisterPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const [siswaStep, setSiswaStep] = useState<SiswaStep>("role");
  const [loading, setLoading] = useState(false);

  // shared
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // siswa
  const [jenjang, setJenjang] = useState<Jenjang | "">("");
  const [kelas, setKelas] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [fakultas, setFakultas] = useState("");
  const [utbkRumpun, setUtbkRumpun] = useState("");
  const [targetKampus, setTargetKampus] = useState("");
  const [agama, setAgama] = useState("");
  // creator
  const [bidang, setBidang] = useState("");
  const [pengalaman, setPengalaman] = useState("");
  const [institusi, setInstitusi] = useState("");
  // parent
  const [namaAnak, setNamaAnak] = useState("");
  const [jenjangAnak, setJenjangAnak] = useState("");
  const [kodeAnak, setKodeAnak] = useState("");

  useEffect(() => { if (user) navigate({ to: "/dashboard", replace: true }); }, [user, navigate]);

  const needsJurusan = jenjang === "sma" || jenjang === "smk" || jenjang === "kuliah" || jenjang === "utbk";

  const siswaSteps: { id: SiswaStep; label: string }[] = useMemo(() => {
    const arr: { id: SiswaStep; label: string }[] = [
      { id: "role", label: "Peran" },
      { id: "jenjang", label: "Jenjang" },
      { id: "kelas", label: "Kelas" },
    ];
    if (needsJurusan) arr.push({ id: "jurusan", label: jenjang === "kuliah" ? "Fakultas" : jenjang === "utbk" ? "Rumpun" : "Jurusan" });
    arr.push({ id: "agama", label: "Agama" }, { id: "akun", label: "Akun" });
    return arr;
  }, [needsJurusan, jenjang]);

  const stepIndex = siswaSteps.findIndex((s) => s.id === siswaStep);
  const totalSteps = role === "siswa" ? siswaSteps.length : 2;
  const currentIndex = role === "siswa" ? Math.max(0, stepIndex) : (siswaStep === "role" ? 0 : 1);

  const pickRole = (r: Role) => {
    setRole(r);
    if (r === "siswa") setSiswaStep("jenjang");
    else setSiswaStep("akun");
  };

  const resetFlow = () => { setRole(null); setSiswaStep("role"); };

  const goNext = () => {
    if (role !== "siswa") return;
    if (siswaStep === "jenjang" && jenjang) setSiswaStep("kelas");
    else if (siswaStep === "kelas" && kelas) setSiswaStep(needsJurusan ? "jurusan" : "agama");
    else if (siswaStep === "jurusan") {
      if (jenjang === "kuliah" && (!fakultas || !jurusan)) { toast.error("Pilih fakultas & program studi"); return; }
      if (jenjang === "utbk" && !utbkRumpun) { toast.error("Pilih rumpun UTBK"); return; }
      if ((jenjang === "sma" || jenjang === "smk") && !jurusan) { toast.error("Pilih jurusan dulu"); return; }
      setSiswaStep("agama");
    } else if (siswaStep === "agama" && agama) setSiswaStep("akun");
  };

  const goBack = () => {
    const order = siswaSteps.map((s) => s.id);
    const idx = order.indexOf(siswaStep);
    if (idx <= 0) { resetFlow(); return; }
    setSiswaStep(order[idx - 1]);
  };

  const onGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (result.error) toast.error("Gagal masuk dengan Google");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!role) return;
    const parsed = baseSchema.safeParse({ display_name: displayName, email, password });
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Data tidak valid"); return; }

    if (role === "siswa") {
      if (!jenjang || !kelas || !agama) { toast.error("Lengkapi data sebelumnya"); return; }
      if (needsJurusan && jenjang !== "utbk" && !jurusan) { toast.error("Pilih jurusan/fakultas dulu"); return; }
    }

    const metadata: Record<string, string> = { display_name: displayName, primary_role: role };
    if (role === "siswa") {
      Object.assign(metadata, {
        jenjang, kelas, agama,
        jurusan: jenjang === "utbk" ? utbkRumpun : jurusan,
        fakultas: jenjang === "kuliah" ? fakultas : "",
        tujuan_belajar: jenjang === "utbk" ? `Target: ${targetKampus || "-"}` : "Belajar materi sekolah",
      });
    } else if (role === "creator") Object.assign(metadata, { bidang, pengalaman, institusi });
    else if (role === "parent") Object.assign(metadata, { nama_anak: namaAnak, jenjang_anak: jenjangAnak });

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: window.location.origin + "/dashboard", data: metadata },
    });
    if (error) { setLoading(false); toast.error(error.message); return; }

    if (role === "parent" && kodeAnak && data.session) {
      const code = kodeAnak.trim().toUpperCase();
      const { data: child } = await supabase.from("profiles").select("id").eq("student_invite_code", code).maybeSingle();
      if (child?.id) await supabase.from("parent_child_links").insert({ parent_id: data.user!.id, child_id: child.id });
      else toast.warning("Kode anak tidak ditemukan. Bisa dihubungkan nanti di dashboard.");
    }

    setLoading(false);
    toast.success(data.session ? "Selamat datang di Eduverse! 🎉" : "Akun dibuat! Cek email untuk verifikasi.");
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Kembali ke beranda
        </Link>

        <div className="rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/80 shadow-card p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-brand grid place-items-center"><Sparkles className="w-5 h-5 text-white" /></div>
              <span className="text-xl font-extrabold">Edu<span className="text-gradient-brand">verse</span></span>
            </div>
            <div className="text-xs font-bold text-muted-foreground">Langkah {currentIndex + 1} dari {totalSteps}</div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-6">
            <motion.div
              className="h-full bg-gradient-pink"
              initial={false}
              animate={{ width: `${((currentIndex + 1) / totalSteps) * 100}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${role ?? "role"}-${siswaStep}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {/* STEP: ROLE */}
              {siswaStep === "role" && (
                <>
                  <h1 className="text-3xl font-extrabold">Daftar Gratis 🚀</h1>
                  <p className="text-sm text-muted-foreground mt-1">Pilih peran kamu untuk memulai.</p>
                  <div className="mt-6 grid md:grid-cols-3 gap-4">
                    {roleCards.map((r) => (
                      <button key={r.role} onClick={() => pickRole(r.role)}
                        className="text-left p-5 rounded-3xl border-2 border-border bg-card hover:border-primary hover:-translate-y-1 hover:shadow-card transition-all">
                        <div className={`w-12 h-12 rounded-2xl ${r.color} grid place-items-center mb-4`}><r.Icon className="w-6 h-6 text-white" /></div>
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
              )}

              {/* SISWA: JENJANG */}
              {role === "siswa" && siswaStep === "jenjang" && (
                <StepLayout title="Pilih jenjang pendidikan" subtitle="Konten belajar disesuaikan dengan jenjangmu." onBack={resetFlow} onNext={goNext} canNext={!!jenjang}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {JENJANG_OPTIONS.map((j) => (
                      <motion.button key={j.value} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} onClick={() => setJenjang(j.value)}
                        className={`p-5 rounded-2xl border-2 text-left transition-all ${jenjang === j.value ? "border-primary bg-primary/5 ring-2 ring-primary/30 shadow-soft" : "border-border bg-card hover:border-primary/50"}`}>
                        <div className="text-3xl">{j.emoji}</div>
                        <div className="mt-2 font-extrabold text-sm">{j.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </StepLayout>
              )}

              {/* SISWA: KELAS */}
              {role === "siswa" && siswaStep === "kelas" && jenjang && (
                <StepLayout title={`Pilih ${jenjang === "kuliah" ? "semester" : "kelas"}`} subtitle="Memilih kelas membantu kami menampilkan modul yang tepat." onBack={goBack} onNext={goNext} canNext={!!kelas}>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {KELAS_BY_JENJANG[jenjang].map((k) => (
                      <motion.button key={k} whileTap={{ scale: 0.95 }} onClick={() => setKelas(k)}
                        className={`py-4 rounded-2xl border-2 font-bold text-sm transition-all ${kelas === k ? "border-primary bg-gradient-pink text-white shadow-soft" : "border-border bg-card hover:border-primary/50"}`}>
                        {jenjang === "kuliah" ? k : `Kelas ${k}`}
                      </motion.button>
                    ))}
                  </div>
                </StepLayout>
              )}

              {/* SISWA: JURUSAN (varies by jenjang) */}
              {role === "siswa" && siswaStep === "jurusan" && (
                <StepLayout title={jenjang === "kuliah" ? "Fakultas & Program Studi" : jenjang === "utbk" ? "Rumpun UTBK / TKA" : "Pilih jurusan"}
                  subtitle={jenjang === "utbk" ? "Tentukan rumpun & target kampus impianmu." : "Cari atau pilih jurusan yang sesuai."}
                  onBack={goBack} onNext={goNext}
                  canNext={jenjang === "kuliah" ? !!(fakultas && jurusan) : jenjang === "utbk" ? !!utbkRumpun : !!jurusan}>
                  {jenjang === "sma" && <CardPicker items={SMA_JURUSAN} value={jurusan} onChange={setJurusan} />}
                  {jenjang === "smk" && <SmkSearchPicker value={jurusan} onChange={setJurusan} />}
                  {jenjang === "kuliah" && <KuliahPicker fakultas={fakultas} setFakultas={setFakultas} prodi={jurusan} setProdi={setJurusan} />}
                  {jenjang === "utbk" && <UtbkPicker rumpun={utbkRumpun} setRumpun={setUtbkRumpun} target={targetKampus} setTarget={setTargetKampus} />}
                </StepLayout>
              )}

              {/* SISWA: AGAMA */}
              {role === "siswa" && siswaStep === "agama" && (
                <StepLayout title="Pilih agama" subtitle="Mapel Pendidikan Agama akan otomatis disesuaikan." onBack={goBack} onNext={goNext} canNext={!!agama}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {AGAMA_OPTIONS.map((a) => (
                      <motion.button key={a.value} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} onClick={() => setAgama(a.value)}
                        className={`p-5 rounded-2xl border-2 text-left transition-all ${agama === a.value ? "border-primary bg-primary/5 ring-2 ring-primary/30 shadow-soft" : "border-border bg-card hover:border-primary/50"}`}>
                        <div className="text-3xl">{a.emoji}</div>
                        <div className="mt-2 font-extrabold text-sm">{a.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </StepLayout>
              )}

              {/* AKUN — siswa / creator / parent */}
              {siswaStep === "akun" && role && (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-extrabold">{role === "siswa" ? "Buat akunmu" : roleCards.find((r) => r.role === role)!.title}</h1>
                    <button type="button" onClick={role === "siswa" ? goBack : resetFlow} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                      <ChevronLeft className="w-4 h-4" /> Kembali
                    </button>
                  </div>

                  {role === "siswa" && (
                    <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 flex flex-wrap gap-2 text-xs font-semibold">
                      <Chip color="bg-gradient-pink">{JENJANG_OPTIONS.find((j) => j.value === jenjang)?.label}</Chip>
                      <Chip color="bg-gradient-purple">{jenjang === "kuliah" ? kelas : `Kelas ${kelas}`}</Chip>
                      {fakultas && <Chip color="bg-gradient-brand">{fakultas}</Chip>}
                      {jurusan && <Chip color="bg-accent">{jurusan}</Chip>}
                      {jenjang === "utbk" && utbkRumpun && <Chip color="bg-gradient-brand">{utbkRumpun.toUpperCase()}</Chip>}
                      {agama && <Chip color="bg-secondary">{AGAMA_OPTIONS.find((a) => a.value === agama)?.label}</Chip>}
                    </div>
                  )}

                  <Field label="Nama lengkap" value={displayName} onChange={setDisplayName} placeholder="Nama kamu" required />
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="kamu@email.com" required />
                    <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Min. 6 karakter" required />
                  </div>

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
                      <Select label="Jenjang anak" value={jenjangAnak} onChange={setJenjangAnak} options={JENJANG_OPTIONS.map((j) => ({ v: j.value, l: j.label }))} />
                      <Field label="Kode akun siswa (opsional)" value={kodeAnak} onChange={setKodeAnak} placeholder="Contoh: A1B2C3D4" />
                    </>
                  )}

                  <button disabled={loading} type="submit" className="w-full py-3 rounded-full bg-gradient-pink text-white font-bold shadow-soft hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> {loading ? "Membuat akun..." : "Buat akun"}
                  </button>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StepLayout({ title, subtitle, children, onBack, onNext, canNext }: { title: string; subtitle: string; children: React.ReactNode; onBack: () => void; onNext: () => void; canNext: boolean }) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
      {children}
      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={onBack} className="px-4 py-2.5 rounded-full font-semibold text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Kembali
        </button>
        <button type="button" disabled={!canNext} onClick={onNext}
          className="px-6 py-3 rounded-full bg-gradient-pink text-white font-bold shadow-soft hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 inline-flex items-center gap-2">
          Lanjutkan <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function CardPicker({ items, value, onChange }: { items: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid sm:grid-cols-2 gap-2">
      {items.map((j) => (
        <motion.button key={j} whileTap={{ scale: 0.97 }} onClick={() => onChange(j)}
          className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold text-left transition-all ${value === j ? "border-primary bg-gradient-pink text-white shadow-soft" : "border-border bg-card hover:border-primary/50"}`}>
          {j}
        </motion.button>
      ))}
    </div>
  );
}

function SmkSearchPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [q, setQ] = useState("");
  const groups = useMemo(() => {
    if (!q.trim()) return SMK_JURUSAN_GROUPS;
    const needle = q.toLowerCase();
    return SMK_JURUSAN_GROUPS.map((g) => ({ ...g, items: g.items.filter((i) => i.toLowerCase().includes(needle)) }))
      .filter((g) => g.items.length > 0);
  }, [q]);
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari jurusan (mis. TKJ, Multimedia, Boga…)"
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-white text-sm outline-none focus:border-primary" />
      </div>
      <div className="max-h-[360px] overflow-auto pr-1 space-y-4 scroll-smooth">
        {groups.map((g) => (
          <div key={g.group}>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-2">{g.group}</div>
            <div className="grid sm:grid-cols-2 gap-2">
              {g.items.map((j) => (
                <motion.button key={j} whileTap={{ scale: 0.97 }} type="button" onClick={() => onChange(j)}
                  className={`px-3 py-2.5 rounded-xl border-2 text-xs font-semibold text-left transition-all ${value === j ? "border-primary bg-gradient-pink text-white shadow-soft" : "border-border bg-card hover:border-primary/50"}`}>
                  {j}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
        {groups.length === 0 && <div className="text-sm text-center text-muted-foreground py-8">Tidak ada jurusan yang cocok.</div>}
      </div>
    </div>
  );
}

function KuliahPicker({ fakultas, setFakultas, prodi, setProdi }: { fakultas: string; setFakultas: (v: string) => void; prodi: string; setProdi: (v: string) => void }) {
  const prodiList = fakultas ? KULIAH_PRODI[fakultas] ?? [] : [];
  return (
    <div className="space-y-5">
      <div>
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-2">1. Pilih Fakultas</div>
        <div className="grid sm:grid-cols-2 gap-2 max-h-56 overflow-auto pr-1">
          {FAKULTAS_OPTIONS.map((f) => (
            <motion.button key={f} whileTap={{ scale: 0.97 }} type="button" onClick={() => { setFakultas(f); setProdi(""); }}
              className={`px-3 py-2.5 rounded-xl border-2 text-xs font-semibold text-left transition-all ${fakultas === f ? "border-primary bg-gradient-purple text-white shadow-soft" : "border-border bg-card hover:border-primary/50"}`}>
              {f}
            </motion.button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {fakultas && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-2">2. Program Studi</div>
            <div className="grid sm:grid-cols-2 gap-2 max-h-56 overflow-auto pr-1">
              {prodiList.map((p) => (
                <motion.button key={p} whileTap={{ scale: 0.97 }} type="button" onClick={() => setProdi(p)}
                  className={`px-3 py-2.5 rounded-xl border-2 text-xs font-semibold text-left transition-all ${prodi === p ? "border-primary bg-gradient-pink text-white shadow-soft" : "border-border bg-card hover:border-primary/50"}`}>
                  {p}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UtbkPicker({ rumpun, setRumpun, target, setTarget }: { rumpun: string; setRumpun: (v: string) => void; target: string; setTarget: (v: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-3">
        {UTBK_RUMPUN.map((r) => (
          <motion.button key={r.value} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} type="button" onClick={() => setRumpun(r.value)}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${rumpun === r.value ? "border-primary bg-primary/5 ring-2 ring-primary/30 shadow-soft" : "border-border bg-card hover:border-primary/50"}`}>
            <div className="font-extrabold">{r.label}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{r.desc}</div>
          </motion.button>
        ))}
      </div>
      <label className="block">
        <span className="text-xs font-semibold inline-flex items-center gap-1"><Target className="w-3.5 h-3.5" /> Target kampus / jurusan (opsional)</span>
        <input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Contoh: Teknik Informatika ITB"
          className="mt-1 w-full px-4 py-3 rounded-2xl border border-border bg-white text-sm outline-none focus:border-primary" />
      </label>
    </div>
  );
}

function Chip({ children, color }: { children: React.ReactNode; color: string }) {
  return <span className={`px-2 py-1 rounded-lg ${color} text-white`}>{children}</span>;
}

function Field({ label, value, onChange, type = "text", placeholder, required }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold">{label}</span>
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="mt-1 w-full px-4 py-3 rounded-2xl border border-border bg-white text-sm outline-none focus:border-primary" />
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
