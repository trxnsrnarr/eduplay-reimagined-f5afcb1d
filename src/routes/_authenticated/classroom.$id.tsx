import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Send, Megaphone, BookOpen, ClipboardList, Users, Hash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getClassroomDetail, sendClassroomMessage, createClassroomPost } from "@/lib/api/classroom.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/classroom/$id")({
  head: ({ params }) => ({ meta: [{ title: `Classroom — Eduverse` }] }),
  component: ClassroomDetail,
});

type Detail = Awaited<ReturnType<typeof getClassroomDetail>>;

function ClassroomDetail() {
  const { id } = Route.useParams();
  const fetchDetail = useServerFn(getClassroomDetail);
  const sendMsg = useServerFn(sendClassroomMessage);
  const createPost = useServerFn(createClassroomPost);

  const [data, setData] = useState<Detail | null>(null);
  const [tab, setTab] = useState<"chat" | "materi" | "tugas">("chat");
  const [msg, setMsg] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const reload = () => fetchDetail({ data: { id } }).then(setData).catch((e) => toast.error(e.message));

  useEffect(() => { reload(); }, [id]);

  useEffect(() => {
    const ch = supabase
      .channel(`classroom-${id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "classroom_messages", filter: `classroom_id=eq.${id}` }, () => reload())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [id]);

  useEffect(() => { scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight }); }, [data?.messages?.length]);

  const onSend = async () => {
    if (!msg.trim()) return;
    const text = msg; setMsg("");
    try { await sendMsg({ data: { classroom_id: id, channel: "umum", content: text } }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Gagal kirim"); setMsg(text); }
  };

  const onPost = async () => {
    if (!newTitle.trim()) return;
    try {
      await createPost({ data: { classroom_id: id, kind: "announcement", title: newTitle, body: newBody } });
      setNewTitle(""); setNewBody(""); reload(); toast.success("Postingan dibuat");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Gagal"); }
  };

  if (!data) return <div className="h-96 grid place-items-center text-sm text-muted-foreground">Memuat classroom…</div>;
  const c = data.classroom;
  const profileById = new Map(data.profiles.map((p) => [p.id, p.display_name]));

  return (
    <div className="max-w-7xl mx-auto -mx-4 sm:-mx-6 lg:-mx-8 -my-6 lg:-my-8 h-[calc(100vh-4rem)] flex flex-col">
      <Link to="/classroom" className="px-6 py-3 text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 self-start"><ArrowLeft className="w-3.5 h-3.5" /> Kembali</Link>

      <div className={`mx-4 lg:mx-6 px-6 py-5 rounded-2xl text-white bg-gradient-to-br ${c.cover_gradient} relative overflow-hidden`}>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/15 rounded-full blur-2xl" />
        <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">{c.subject} {data.isOwner && "· Pengajar"}</div>
        <div className="font-extrabold text-2xl mt-1">{c.name}</div>
        <p className="text-sm opacity-85 mt-1 max-w-2xl">{c.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-bold">
          <span className="px-2.5 py-1 rounded-full bg-white/20 font-mono">Kode: {c.classroom_code}</span>
          <span className="px-2.5 py-1 rounded-full bg-white/20 inline-flex items-center gap-1"><Users className="w-3 h-3" /> {data.members.length} anggota</span>
          <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/classroom?code=${c.classroom_code}`); toast.success("Link disalin"); }} className="px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30">Salin Link Undang</button>
        </div>
      </div>

      <div className="flex-1 mx-4 lg:mx-6 mt-4 grid lg:grid-cols-[1fr_280px] gap-4 min-h-0">
        <div className="flex flex-col bg-white border border-border rounded-2xl min-h-0 overflow-hidden">
          <div className="flex border-b border-border px-2">
            {[
              { k: "chat" as const, l: "Chat", I: Hash },
              { k: "materi" as const, l: "Materi & Pengumuman", I: Megaphone },
              { k: "tugas" as const, l: "Tugas", I: ClipboardList },
            ].map((t) => (
              <button key={t.k} onClick={() => setTab(t.k)} className={`px-4 py-3 text-xs font-bold inline-flex items-center gap-1.5 border-b-2 ${tab === t.k ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}>
                <t.I className="w-3.5 h-3.5" /> {t.l}
              </button>
            ))}
          </div>

          {tab === "chat" && (
            <>
              <div ref={scrollerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {data.messages.length === 0 && <div className="text-center text-xs text-muted-foreground py-8">Belum ada pesan. Mulai percakapan!</div>}
                {data.messages.map((m) => (
                  <div key={m.id} className={`flex gap-2 ${m.author_id === data.currentUserId ? "flex-row-reverse" : ""}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-brand text-white grid place-items-center text-[11px] font-extrabold shrink-0">{(profileById.get(m.author_id) ?? "U").slice(0, 1).toUpperCase()}</div>
                    <div className={`max-w-[70%] px-3 py-2 rounded-2xl ${m.author_id === data.currentUserId ? "bg-gradient-brand text-white rounded-tr-sm" : "bg-muted rounded-tl-sm"}`}>
                      <div className="text-[10px] font-bold opacity-70 mb-0.5">{profileById.get(m.author_id) ?? "Anggota"}</div>
                      <div className="text-sm">{m.content}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border p-3 flex gap-2">
                <input value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSend()} placeholder="Ketik pesan…" className="flex-1 px-4 py-2.5 rounded-full bg-muted focus:bg-white focus:outline focus:outline-2 focus:outline-primary text-sm" />
                <button onClick={onSend} className="w-10 h-10 rounded-full bg-gradient-brand text-white grid place-items-center"><Send className="w-4 h-4" /></button>
              </div>
            </>
          )}

          {tab === "materi" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {data.isOwner && (
                <div className="p-4 rounded-2xl border-2 border-dashed border-border space-y-2">
                  <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Judul pengumuman / materi" className="w-full px-3 py-2 rounded-lg border border-border outline-none text-sm font-bold" />
                  <textarea value={newBody} onChange={(e) => setNewBody(e.target.value)} placeholder="Isi…" rows={2} className="w-full px-3 py-2 rounded-lg border border-border outline-none text-sm" />
                  <button onClick={onPost} className="px-4 py-2 rounded-full bg-foreground text-background text-xs font-bold">Posting</button>
                </div>
              )}
              {data.posts.length === 0 && <div className="text-center text-xs text-muted-foreground py-8">Belum ada postingan.</div>}
              {data.posts.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-gradient-hero border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    {p.kind === "material" ? <BookOpen className="w-4 h-4 text-primary" /> : <Megaphone className="w-4 h-4 text-pink-500" />}
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">{p.kind}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">{new Date(p.created_at).toLocaleDateString("id-ID")}</span>
                  </div>
                  <div className="font-extrabold">{p.title}</div>
                  {p.body && <div className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{p.body}</div>}
                </div>
              ))}
            </div>
          )}

          {tab === "tugas" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {data.assignments.length === 0 && <div className="text-center text-xs text-muted-foreground py-8">Belum ada tugas.</div>}
              {data.assignments.map((a) => (
                <div key={a.id} className="p-4 rounded-2xl bg-white border border-border">
                  <div className="font-extrabold">{a.title}</div>
                  {a.description && <div className="text-sm text-muted-foreground mt-1">{a.description}</div>}
                  {a.deadline && <div className="text-[11px] font-bold text-pink-600 mt-2">⏰ Deadline: {new Date(a.deadline).toLocaleString("id-ID")}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="bg-white border border-border rounded-2xl p-4 overflow-y-auto hidden lg:block">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Anggota & Leaderboard</div>
          <div className="space-y-2">
            {[...data.members].sort((a, b) => b.xp_in_class - a.xp_in_class).map((m, i) => (
              <div key={m.user_id} className="flex items-center gap-2 p-2 rounded-xl hover:bg-muted">
                <div className="w-7 h-7 rounded-full bg-gradient-brand text-white grid place-items-center text-[10px] font-extrabold">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate">{profileById.get(m.user_id) ?? "Anggota"}</div>
                  <div className="text-[10px] text-muted-foreground">{m.role}</div>
                </div>
                <div className="text-[11px] font-bold text-primary">{m.xp_in_class} XP</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
