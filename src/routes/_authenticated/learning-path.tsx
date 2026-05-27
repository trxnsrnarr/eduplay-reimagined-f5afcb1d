import { createFileRoute } from "@tanstack/react-router";
import { Route as RouteIcon, CheckCircle2, Lock, Sparkles } from "lucide-react";
import { getMapelForTrack, type Jenjang } from "@/lib/curriculum";
import { useProfile } from "@/components/shell/profile-context";

export const Route = createFileRoute("/_authenticated/learning-path")({
  head: () => ({ meta: [{ title: "Learning Path — Eduverse" }] }),
  component: LearningPathPage,
});

function LearningPathPage() {
  const profile = useProfile();
  const mapel = getMapelForTrack(profile?.jenjang as Jenjang | null, profile?.jurusan);
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold flex items-center gap-2"><RouteIcon className="w-7 h-7" /> Learning Path</h1>
        <p className="text-sm text-muted-foreground mt-1">Rute belajar terarah berdasarkan jenjang & jurusanmu</p>
      </div>
      <div className="relative pl-8">
        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border" />
        {mapel.map((m, idx) => (
          <div key={m.slug} className="relative mb-4">
            <div className={`absolute -left-8 top-3 w-6 h-6 rounded-full grid place-items-center ${idx === 0 ? "bg-gradient-brand text-white" : "bg-muted text-muted-foreground"}`}>
              {idx === 0 ? <Sparkles className="w-3 h-3" /> : idx < 3 ? <span className="text-[10px] font-bold">{idx + 1}</span> : <Lock className="w-3 h-3" />}
            </div>
            <div className={`p-4 rounded-2xl border-2 ${idx === 0 ? "bg-white border-primary" : "bg-white border-border"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl ${m.color} grid place-items-center text-xl`}>{m.emoji}</div>
                <div className="flex-1">
                  <div className="font-extrabold text-sm">{m.name}</div>
                  <div className="text-[11px] text-muted-foreground">{m.bab.length} bab · {m.estMinutes} menit · {m.difficulty}</div>
                </div>
                {idx === 0 && <CheckCircle2 className="w-5 h-5 text-success" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
