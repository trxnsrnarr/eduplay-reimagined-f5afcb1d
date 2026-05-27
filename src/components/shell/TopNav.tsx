import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Bell, Search, Crown, Moon, Sun, User, Settings, LogOut, HelpCircle, Languages, Award, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/components/dashboard/types";

const notifications = [
  { id: 1, title: "Challenge baru tersedia!", desc: "Selesaikan 1 quiz matematika hari ini", time: "Baru saja", unread: true },
  { id: 2, title: "Welcome ke Eduverse 🎉", desc: "Yuk, mulai dari modul pertamamu", time: "1 jam lalu", unread: true },
  { id: 3, title: "Streak siap dimulai", desc: "Login besok untuk mendapatkan streak Day 2", time: "2 jam lalu", unread: false },
];

export function TopNav({ profile, onOpenSidebar }: { profile: Profile | null; onOpenSidebar: () => void }) {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleDark = () => {
    setDark((d) => {
      document.documentElement.classList.toggle("dark", !d);
      return !d;
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Keluar dari akun");
    navigate({ to: "/", replace: true });
  };

  const unread = notifications.filter((n) => n.unread).length;
  const initial = profile?.display_name?.[0]?.toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-border">
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3">
        <button onClick={onOpenSidebar} className="lg:hidden p-2 rounded-lg hover:bg-muted">
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md px-3 py-2 rounded-xl bg-muted/60">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input placeholder="Cari modul, mapel, materi…" className="flex-1 bg-transparent outline-none text-sm" />
          <kbd className="hidden lg:inline text-[10px] font-bold text-muted-foreground bg-white px-1.5 py-0.5 rounded">⌘K</kbd>
        </div>

        <div className="flex-1 md:hidden" />

        <div className="flex items-center gap-2">
          <Link to="/subscription" className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-pink text-white text-xs font-extrabold">
            <Crown className="w-3.5 h-3.5" /> FREE
          </Link>

          <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-muted" aria-label="Toggle theme">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="relative" ref={notifRef}>
            <button onClick={() => setNotifOpen((v) => !v)} className="p-2 rounded-lg hover:bg-muted relative">
              <Bell className="w-4 h-4" />
              {unread > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gradient-pink" />}
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-border shadow-card overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <div className="font-extrabold text-sm">Notifikasi</div>
                  <span className="text-[10px] font-bold text-primary">{unread} BARU</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 hover:bg-muted/50 border-b border-border/50 last:border-b-0">
                      <div className="flex items-start gap-2">
                        {n.unread && <span className="mt-1.5 w-2 h-2 rounded-full bg-gradient-pink shrink-0" />}
                        <div className="flex-1">
                          <div className="text-sm font-bold">{n.title}</div>
                          <div className="text-xs text-muted-foreground">{n.desc}</div>
                          <div className="text-[10px] text-muted-foreground mt-1">{n.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button onClick={() => setProfileOpen((v) => !v)} className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-muted">
              <div className="w-8 h-8 rounded-full bg-gradient-brand text-white grid place-items-center font-extrabold text-sm">
                {initial}
              </div>
              <span className="hidden sm:inline text-sm font-bold">{profile?.display_name ?? "User"}</span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-border shadow-card overflow-hidden">
                <div className="p-4 bg-gradient-hero border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-brand text-white grid place-items-center font-extrabold">{initial}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-sm truncate">{profile?.display_name ?? "User"}</div>
                      <div className="text-[11px] text-muted-foreground capitalize">{profile?.primary_role ?? "Siswa"} · Level 1</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[10px] font-bold">
                    <span className="text-muted-foreground">XP 0 / 100</span>
                    <span className="text-primary">FREE PLAN</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-white overflow-hidden">
                    <div className="h-full w-0 bg-gradient-brand" />
                  </div>
                </div>
                <div className="py-2">
                  <MenuItem to="/profile" icon={User} label="Edit Profile" />
                  <MenuItem to="/achievement" icon={Award} label="Achievement" />
                  <MenuItem to="/subscription" icon={Crown} label="Subscription" />
                  <MenuItem to="/settings" icon={Settings} label="Settings" />
                  <MenuItem to="/settings" icon={Languages} label="Bahasa: ID" />
                  <MenuItem to="/" icon={HelpCircle} label="Help Center" />
                </div>
                <button onClick={signOut} className="w-full px-4 py-3 text-left text-sm font-semibold text-destructive hover:bg-destructive/5 border-t border-border flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuItem({ to, icon: Icon, label }: { to: string; icon: typeof User; label: string }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">
      <Icon className="w-4 h-4" /> {label}
    </Link>
  );
}
