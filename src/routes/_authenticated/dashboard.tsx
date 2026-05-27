import { createFileRoute } from "@tanstack/react-router";
import { SiswaDashboard } from "@/components/dashboard/SiswaDashboard";
import { CreatorDashboard } from "@/components/dashboard/CreatorDashboard";
import { ParentDashboard } from "@/components/dashboard/ParentDashboard";
import { useProfile } from "@/components/shell/profile-context";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Eduverse" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const profile = useProfile();
  if (!profile) return <div className="text-sm text-muted-foreground">Memuat profil…</div>;
  if (profile.primary_role === "creator") return <CreatorDashboard profile={profile} />;
  if (profile.primary_role === "parent") return <ParentDashboard profile={profile} />;
  return <SiswaDashboard profile={profile} />;
}
