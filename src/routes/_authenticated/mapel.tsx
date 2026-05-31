import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Folder, Lock, Clock, Zap } from "lucide-react";
import { getMapelForTrack, FREE_BAB_LIMIT, type Jenjang } from "@/lib/curriculum";
import { useProfile } from "@/components/shell/profile-context";
import { coverFor, PatternSVG } from "@/lib/mapel-cover";

export const Route = createFileRoute("/_authenticated/mapel")({
  head: () => ({ meta: [{ title: "Mapel — Eduverse" }] }),
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
            const cover = coverFor(m.slug, m.name);
            return (
              <Link key={m.slug} to="/mapel/$slug" params={{ slug: m.slug }} className="group rounded-2xl border-2 border-border bg-white hover:border-primary hover:-translate-y-1 hover:shadow-card transition-all overflow-hidden">
                <div className={`relative h-36 ${cover.gradient} overflow-hidden`}>
                  <img
                    src={cover.photoUrl}
                    alt={m.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 ${cover.gradient} mix-blend-multiply opacity-60`} />
                  <PatternSVG pattern={cover.pattern} className="absolute inset-0 w-full h-full opacity-40" />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-2 left-2 inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/25 backdrop-blur text-white font-extrabold text-sm">
                    {cover.initials}
                  </div>
                  <div className="absolute bottom-2 left-3 right-3 text-white font-extrabold text-sm leading-tight drop-shadow line-clamp-2">
                    {m.name}
                  </div>
                  {lockedCount > 0 && (
                    <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-black/50 backdrop-blur text-white">
                      <Lock className="w-3 h-3" /> {lockedCount}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="font-extrabold text-base leading-tight line-clamp-2 min-h-[2.6rem]">{m.name}</div>
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-muted font-bold">{m.difficulty}</span>
                    <span className="inline-flex items-center gap-0.5"><Clock className="w-3 h-3" /> {m.estMinutes}m</span>
                    <span className="inline-flex items-center gap-0.5"><Zap className="w-3 h-3" /> +{m.xpPerBab}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">{m.bab.length} bab</span>
                    <span className="font-bold text-primary">0%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full w-0 bg-gradient-brand" /></div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
