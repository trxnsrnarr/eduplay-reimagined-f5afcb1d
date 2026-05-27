import { useEffect, useState } from "react";
import { Outlet } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "./AppSidebar";
import { TopNav } from "./TopNav";
import type { Profile } from "@/components/dashboard/types";
import { ProfileContext } from "./profile-context";

export function AppShell() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data) setProfile(data as Profile);
    });
  }, [user]);

  return (
    <ProfileContext.Provider value={profile}>
      <div className="min-h-screen flex bg-gradient-hero">
        <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav profile={profile} onOpenSidebar={() => setSidebarOpen(true)} />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </ProfileContext.Provider>
  );
}
