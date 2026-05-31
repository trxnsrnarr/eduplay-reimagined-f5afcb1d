import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles, LayoutDashboard, BookOpen, Bot, Swords, Gamepad2, Target, Trophy, Award, Route as RouteIcon, Crown, User, Settings, X, Users, ShoppingBag } from "lucide-react";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/mapel", label: "Modul Belajar", icon: BookOpen },
  { to: "/classroom", label: "Classroom", icon: Users, badge: "NEW" },
  { to: "/marketplace", label: "Creator Class", icon: ShoppingBag, badge: "HOT" },
  { to: "/ai-tutor", label: "AI Tutor", icon: Bot, badge: "AI" },
  { to: "/battle-quiz", label: "Battle Quiz", icon: Swords },
  { to: "/games", label: "Game Edukasi", icon: Gamepad2 },
  { to: "/daily-challenge", label: "Daily Challenge", icon: Target },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/achievement", label: "Achievement", icon: Award },
  { to: "/learning-path", label: "Learning Path", icon: RouteIcon },
  { to: "/subscription", label: "Subscription", icon: Crown, badge: "PRO" },
] as const;

const bottom = [
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-foreground/40 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 shrink-0 bg-white border-r border-border flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-brand grid place-items-center shadow-soft">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg">Edu<span className="text-gradient-brand">verse</span></span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-2 rounded-lg hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-3 mb-2">Menu Utama</div>
          {items.map((it) => {
            const active = path === it.to || path.startsWith(it.to + "/");
            return (
              <Link
                key={it.to}
                to={it.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-gradient-brand text-white shadow-soft"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <it.icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{it.label}</span>
                {"badge" in it && it.badge && (
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${active ? "bg-white/25" : "bg-gradient-pink text-white"}`}>
                    {it.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-3 mt-6 mb-2">Akun</div>
          {bottom.map((it) => {
            const active = path === it.to;
            return (
              <Link
                key={it.to}
                to={it.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <it.icon className="w-4 h-4 shrink-0" />
                <span>{it.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="m-3 p-4 rounded-2xl bg-gradient-brand text-white relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/15 rounded-full blur-xl" />
          <Crown className="w-6 h-6 mb-2" />
          <div className="font-extrabold text-sm">Upgrade Premium</div>
          <div className="text-[11px] text-white/85 mt-0.5">Unlock semua bab & AI unlimited</div>
          <Link to="/subscription" onClick={onClose} className="mt-3 inline-block text-[11px] font-bold bg-white text-foreground px-3 py-1.5 rounded-full">
            Lihat Paket →
          </Link>
        </div>
      </aside>
    </>
  );
}
