import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

const links = [
  { href: "#fitur", label: "Fitur" },
  { href: "#cara-kerja", label: "Cara Kerja" },
  { href: "#harga", label: "Harga" },
  { href: "#kreator", label: "Kreator" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/40">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-brand grid place-items-center shadow-soft group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-extrabold tracking-tight">
            Edu<span className="text-gradient-brand">verse</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden sm:inline-flex text-sm font-semibold text-foreground/80 hover:text-foreground px-3 py-2">
            Masuk
          </Link>
          <Link to="/register" className="inline-flex bg-gradient-pink text-white font-semibold px-5 py-2.5 rounded-full shadow-soft hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm">
            Daftar Gratis
          </Link>
        </div>
      </div>
    </header>
  );
}