import { Video, Brain, FileText, Trophy } from "lucide-react";
import logoUrl from "@/assets/eduverse-logo.svg";

/**
 * Eduverse hero visual — matches eduplay.id: the orbiting Eduverse mark
 * in the center with four floating icon chips around it.
 */
export function HeroOrbit() {
  const chips = [
    { Icon: Video, color: "text-primary", pos: "top-6 left-2 md:left-0", delay: "0s" },
    { Icon: Brain, color: "text-secondary", pos: "top-1/2 left-0 -translate-y-1/2 md:-left-6", delay: "1s" },
    { Icon: FileText, color: "text-accent", pos: "top-20 right-2 md:right-0", delay: "2s" },
    { Icon: Trophy, color: "text-warning", pos: "bottom-10 right-6 md:right-4", delay: "3s" },
  ];

  return (
    <div className="relative w-full max-w-xl mx-auto aspect-square">
      {/* soft brand glow behind logo */}
      <div className="absolute inset-10 rounded-full bg-gradient-brand opacity-20 blur-3xl" />

      {/* the orbiting logo (slow spin) */}
      <img
        src={logoUrl}
        alt="Eduverse"
        className="relative z-10 w-full h-full object-contain animate-float"
        style={{ animationDuration: "6s" }}
      />

      {/* floating icon chips */}
      {chips.map(({ Icon, color, pos, delay }, i) => (
        <div
          key={i}
          className={`absolute ${pos} w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white shadow-card border border-white grid place-items-center animate-float`}
          style={{ animationDelay: delay, animationDuration: "5s" }}
        >
          <Icon className={`w-6 h-6 md:w-7 md:h-7 ${color}`} strokeWidth={2.2} />
        </div>
      ))}

      {/* small decorative dots */}
      <span className="absolute top-2 right-10 w-3 h-3 rounded-full bg-secondary/60 blur-[1px] animate-float" />
      <span className="absolute bottom-4 left-12 w-2.5 h-2.5 rounded-full bg-primary/60 blur-[1px] animate-float" style={{ animationDelay: "1.5s" }} />
    </div>
  );
}
