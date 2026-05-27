import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Users, Plus, LogIn, Sparkles, ArrowRight, Info } from "lucide-react";
import { listMyClassrooms, joinClassroomByCode, createClassroom } from "@/lib/api/classroom.functions";
import { useProfile } from "@/components/shell/profile-context";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/classroom")({
  head: () => ({ meta: [{ title: "Classroom — Eduverse" }] }),
  component: ClassroomList,
});

function ClassroomList() {
  const navigate = useNavigate();
  const profile = useProfile();
  const canCreate = profile?.primary_role === "creator";
  const fetchList = useServerFn(listMyClassrooms);
  const joinFn = useServerFn(joinClassroomByCode);
  const createFn = useServerFn(createClassroom);
  const [list, setList] = useState<Awaited<ReturnType<typeof listMyClassrooms>> | null>(null);
  const [code, setCode] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    fetchList().then(setList).catch(() => setList({ memberships: [], owned: [] }));
  }, [fetchList]);

  const onJoin = async () => {
    if (!code.trim()) return;
    try {
      const { classroomId } = await joinFn({ data: { code } });
      toast.success("Berhasil bergabung ke classroom!");
      navigate({ to: "/classroom/$id", params: { id: classroomId } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal bergabung");
    }
  };

  const onCreate = async () => {
    if (!newName.trim()) return;
    try {
      const row = await createFn({ data: { name: newName, description: newDesc } });
      toast.success(`Classroom dibuat. Kode: ${row.classroom_code}`);
      navigate({ to: "/classroom/$id", params: { id: row.id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal membuat classroom");
    }
  };

  const allClassrooms = [
    ...(list?.owned ?? []).map((c) => ({ ...c, role: "teacher" as const })),
    ...(list?.memberships ?? []).map((m) => ({ ...(m.classrooms as never as { id: string; name: string; description: string | null; subject: string | null; cover_gradient: string; classroom_code: string; is_demo: boolean }), role: m.role })),
  ];
  const seen = new Set<string>();
  const uniqueClassrooms = allClassrooms.filter((c) => (seen.has(c.id) ? false : seen.add(c.id)));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-2"><Users className="w-7 h-7" /> Classroom</h1>
          <p className="text-sm text-muted-foreground mt-1">Gabung kelas, ikuti materi, diskusi realtime dengan teman & guru.</p>
        </div>
        <button onClick={() => setShowCreate((v) => !v)} className="px-5 py-2.5 rounded-full bg-gradient-brand text-white text-sm font-bold inline-flex items-center gap-2 shadow-soft">
          <Plus className="w-4 h-4" /> Buat Classroom
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-white border-2 border-border">
          <div className="flex items-center gap-2 mb-3"><LogIn className="w-5 h-5 text-primary" /><span className="font-extrabold">Gabung dengan Kode</span></div>
          <p className="text-xs text-muted-foreground mb-3">Masukkan kode classroom dari gurumu (contoh: <span className="font-mono font-bold">SIJADEMO</span>)</p>
          <div className="flex gap-2">
            <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="KODE KELAS" className="flex-1 px-4 py-2.5 rounded-xl border-2 border-border focus:border-primary outline-none text-sm font-mono font-bold" />
            <button onClick={onJoin} className="px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-bold">Gabung</button>
          </div>
        </div>

        {showCreate ? (
          <div className="p-6 rounded-3xl bg-gradient-hero border-2 border-primary/30 space-y-3">
            <div className="font-extrabold flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> Classroom Baru</div>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nama classroom" className="w-full px-4 py-2.5 rounded-xl border-2 border-border focus:border-primary outline-none text-sm" />
            <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Deskripsi singkat" rows={2} className="w-full px-4 py-2.5 rounded-xl border-2 border-border focus:border-primary outline-none text-sm" />
            <button onClick={onCreate} className="w-full px-5 py-2.5 rounded-xl bg-gradient-pink text-white text-sm font-bold">Buat Sekarang</button>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-gradient-brand text-white relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/15 rounded-full blur-2xl" />
            <div className="font-extrabold text-lg">Demo Classroom Siap Coba</div>
            <p className="text-xs text-white/85 mt-1 mb-3">Coba langsung fitur classroom Eduverse dengan kelas demo SIJA Cloud.</p>
            <button onClick={() => { setCode("SIJADEMO"); }} className="text-xs font-bold bg-white text-foreground px-3 py-1.5 rounded-full inline-flex items-center gap-1">
              Pakai kode <span className="font-mono">SIJADEMO</span> <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Classroom kamu</div>
        {!list ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />)}
          </div>
        ) : uniqueClassrooms.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-border text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Belum ada classroom. Coba kode <span className="font-mono font-bold">SIJADEMO</span>!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uniqueClassrooms.map((c) => (
              <Link key={c.id} to="/classroom/$id" params={{ id: c.id }} className={`group p-5 rounded-2xl text-white relative overflow-hidden hover:-translate-y-1 transition-all shadow-card bg-gradient-to-br ${c.cover_gradient}`}>
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/15 rounded-full blur-2xl" />
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">{c.role === "teacher" ? "Pengajar" : "Anggota"} {c.is_demo && "· Demo"}</div>
                <div className="font-extrabold text-lg mt-1 leading-tight">{c.name}</div>
                <div className="text-xs opacity-85 mt-1 line-clamp-2">{c.description ?? "Belum ada deskripsi"}</div>
                <div className="mt-4 flex items-center justify-between text-[11px] font-bold">
                  <span className="px-2 py-1 rounded-full bg-white/20 font-mono">{c.classroom_code}</span>
                  <span className="opacity-80">{c.subject}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
