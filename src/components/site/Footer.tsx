import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-brand grid place-items-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-extrabold">Edu<span className="text-gradient-brand">verse</span></span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">
            Platform edukasi interaktif #1 di Indonesia. Belajar jadi lebih seru dengan video, game, dan AI tutor.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-3">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#fitur" className="hover:text-foreground">Fitur</a></li>
            <li><a href="#game" className="hover:text-foreground">Game</a></li>
            <li><a href="#platform" className="hover:text-foreground">Tryout UTBK</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">Perusahaan</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">Tentang Kami</a></li>
            <li><a href="#" className="hover:text-foreground">Kontak</a></li>
            <li><a href="#" className="hover:text-foreground">Kebijakan Privasi</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Eduverse. Dibuat dengan ❤️ untuk pendidikan Indonesia.
      </div>
    </footer>
  );
}