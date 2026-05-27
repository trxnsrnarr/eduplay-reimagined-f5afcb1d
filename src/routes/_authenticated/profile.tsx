import { createFileRoute } from "@tanstack/react-router";
import { User, Mail, GraduationCap, Target } from "lucide-react";
import { useProfile } from "@/components/shell/profile-context";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — Eduverse" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const profile = useProfile();
  if (!profile) return <div className="text-sm text-muted-foreground">Memuat…</div>;
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-brand text-white flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-white/20 grid place-items-center text-3xl font-extrabold">
          {profile.display_name?.[0]?.toUpperCase() ?? "U"}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold">{profile.display_name ?? "User"}</h1>
          <p className="text-white/85 text-sm capitalize">{profile.primary_role} · Level 1 · 0 XP</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field Icon={User} label="Nama" value={profile.display_name} />
        <Field Icon={Mail} label="Role" value={profile.primary_role} />
        <Field Icon={GraduationCap} label="Jenjang" value={profile.jenjang?.toUpperCase()} />
        <Field Icon={GraduationCap} label="Jurusan" value={profile.jurusan} />
        <Field Icon={Target} label="Tujuan Belajar" value={profile.tujuan_belajar} />
        <Field Icon={User} label="Kode Siswa" value={profile.student_invite_code} />
      </div>
    </div>
  );
}

function Field({ Icon, label, value }: { Icon: typeof User; label: string; value: string | null | undefined }) {
  return (
    <div className="p-4 rounded-2xl bg-white border border-border flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-purple grid place-items-center"><Icon className="w-5 h-5 text-white" /></div>
      <div>
        <div className="text-[10px] font-bold text-muted-foreground uppercase">{label}</div>
        <div className="font-bold capitalize">{value ?? "—"}</div>
      </div>
    </div>
  );
}
