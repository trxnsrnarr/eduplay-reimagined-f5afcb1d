import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Folder, Lock, Clock, Zap } from "lucide-react";
import { getMapelForTrack, FREE_BAB_LIMIT, type Jenjang } from "@/lib/curriculum";
import { useProfile } from "@/components/shell/profile-context";

export const Route = createFileRoute("/_authenticated/modul")({
  head: () => ({ meta: [{ title: "Modul Belajar — Eduverse" }] }),
  component: ModulListPage,
});

function ModulListPage() {
  const profile = useProfile();
  const [tab, setTab] = useState<"umum" | "kejuruan">("umum");
  const all = getMapelForTrack(profile?.jenjang as Jenjang | null, profile?.jurusan);
  const umum = all.filter((m) => m.kind === "umum");
  const kejuruan = all.filter((m) => m.kind === "kejuruan");
  const list = tab === "umum" ? umum : kejuruan;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold flex items-center gap-2"><BookOpen className="w-7 h-7" /> Modul Belajar</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Modul otomatis dipilih untuk {profile?.jenjang?.toUpperCase() ?? "-"}{profile?.jurusan ? ` · ${profile.jurusan}` : ""}. Bab 1–{FREE_BAB_LIMIT} gratis.
        </p>
      </div>

      <div className="inline-flex p-1 rounded-full bg-muted">
        <button onClick={() => setTab("umum")} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${tab === "umum" ? "bg-white shadow-soft" : "text-muted-foreground"}`}>
          📁 Mapel Umum <span className="text-[10px] ml-1 opacity-70">({umum.length})</span>
        </button>
        <button onClick={() => setTab("kejuruan")} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${tab === "kejuruan" ? "bg-white shadow-soft" : "text-muted-foreground"}`}>
          📁 Mapel Kejuruan <span className="text-[10px] ml-1 opacity-70">({kejuruan.length})</span>
        </button>
      </div>

      {list.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-border text-center">
          <Folder className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">Belum ada modul {tab} untuk jenjang ini.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {list.map((m) => {
            const lockedCount = Math.max(0, m.bab.length - FREE_BAB_LIMIT);
            return (
              <Link key={m.slug} to="/modul/$slug" params={{ slug: m.slug }} className="group p-5 rounded-2xl border-2 border-border bg-white hover:border-primary hover:-translate-y-1 hover:shadow-card transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-14 h-14 rounded-2xl ${m.color} grid place-items-center text-2xl shadow-soft`}>{m.emoji}</div>
                  {lockedCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      <Lock className="w-3 h-3" /> {lockedCount}
                    </span>
                  )}
                </div>
                <div className="font-extrabold text-base leading-tight">{m.name}</div>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="px-2 py-0.5 rounded-full bg-muted font-bold">{m.difficulty}</span>
                  <span className="inline-flex items-center gap-0.5"><Clock className="w-3 h-3" /> {m.estMinutes}m</span>
                  <span className="inline-flex items-center gap-0.5"><Zap className="w-3 h-3" /> +{m.xpPerBab}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">{m.bab.length} bab</span>
                  <span className="font-bold text-primary">0%</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full w-0 bg-gradient-brand" /></div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
