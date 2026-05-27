import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, Flame, Trophy, Clock, LinkIcon, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "./types";

type Child = { id: string; display_name: string | null; jenjang: string | null; kelas: string | null };

export function ParentDashboard({ profile }: { profile: Profile }) {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: links } = await supabase
        .from("parent_child_links")
        .select("child_id");
      const ids = (links ?? []).map((l) => l.child_id);
      if (ids.length === 0) { setLoading(false); return; }
      const { data } = await supabase
        .from("profiles")
        .select("id,display_name,jenjang,kelas")
        .in("id", ids);
      setChildren((data ?? []) as Child[]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Halo, {profile.display_name ?? "Parent"} 👨‍👩‍👧</h1>
          <p className="text-muted-foreground mt-1">Pantau progres belajar anak secara real-time.</p>
        </div>
        <Link to="/dashboard/link-anak" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-brand text-white text-sm font-bold shadow-md">
          <LinkIcon className="w-4 h-4" /> Tautkan Akun Anak
        </Link>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Memuat data anak…</div>
      ) : children.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white border border-dashed border-border text-center">
          <Users className="w-10 h-10 mx-auto text-muted-foreground" />
          <h2 className="font-extrabold text-lg mt-3">Belum ada anak yang ditautkan</h2>
          <p className="text-sm text-muted-foreground mt-1">Minta kode siswa dari anakmu di dashboard mereka, lalu tautkan di sini.</p>
          <Link to="/dashboard/link-anak" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-pink text-white text-sm font-bold">
            <LinkIcon className="w-4 h-4" /> Tautkan sekarang
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {children.map((c) => (
            <div key={c.id} className="p-6 rounded-3xl bg-white border border-border space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-lg">{c.display_name ?? "Anak"}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.jenjang?.toUpperCase() ?? "-"}{c.kelas ? ` · Kelas ${c.kelas}` : ""}
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold">Aktif hari ini</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <MiniStat Icon={Flame} label="Streak" value="14 hari" />
                <MiniStat Icon={Clock} label="Belajar" value="42 jam" />
                <MiniStat Icon={Trophy} label="Rank" value="#12" />
              </div>
              <div>
                <div className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> AKTIVITAS TERAKHIR</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between"><span>Matematika · Fungsi Kuadrat</span><span className="text-muted-foreground">2 jam lalu</span></li>
                  <li className="flex justify-between"><span>Quiz Battle Bahasa Inggris</span><span className="text-muted-foreground">kemarin</span></li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MiniStat({ Icon, label, value }: { Icon: typeof Flame; label: string; value: string }) {
  return (
    <div className="p-3 rounded-2xl bg-muted/50">
      <Icon className="w-4 h-4 mb-1 text-muted-foreground" />
      <div className="text-[10px] font-bold text-muted-foreground uppercase">{label}</div>
      <div className="text-sm font-extrabold">{value}</div>
    </div>
  );
}