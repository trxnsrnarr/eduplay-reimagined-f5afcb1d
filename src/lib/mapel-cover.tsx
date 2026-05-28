// Visual cover (gradient + pattern + AI illustration) untuk mapel.
// Deterministik berdasarkan slug. Mapel populer pakai ilustrasi AI;
// sisanya fallback ke picsum dengan seed yang sama.

import { getMapelImageWithFallback } from "./mapel-images";


const PALETTES = [
  { from: "from-violet-500", to: "to-fuchsia-500", accent: "bg-fuchsia-300/30" },
  { from: "from-sky-500", to: "to-indigo-600", accent: "bg-sky-300/30" },
  { from: "from-emerald-500", to: "to-teal-600", accent: "bg-emerald-300/30" },
  { from: "from-rose-500", to: "to-orange-500", accent: "bg-rose-300/30" },
  { from: "from-amber-500", to: "to-pink-500", accent: "bg-amber-300/30" },
  { from: "from-cyan-500", to: "to-blue-600", accent: "bg-cyan-300/30" },
  { from: "from-purple-600", to: "to-blue-500", accent: "bg-purple-300/30" },
  { from: "from-lime-500", to: "to-emerald-600", accent: "bg-lime-300/30" },
  { from: "from-pink-500", to: "to-rose-600", accent: "bg-pink-300/30" },
  { from: "from-slate-700", to: "to-zinc-900", accent: "bg-slate-300/20" },
];

const PATTERNS = ["dots", "grid", "waves", "rings", "diag"] as const;
type Pattern = (typeof PATTERNS)[number];

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export type MapelCover = {
  gradient: string;
  accent: string;
  pattern: Pattern;
  initials: string;
  photoUrl: string;
  photoUrlLg: string;
};

export function coverFor(slugOrName: string, label?: string): MapelCover {
  const h = hash(slugOrName);
  const p = PALETTES[h % PALETTES.length];
  const pattern = PATTERNS[h % PATTERNS.length];
  const text = (label ?? slugOrName).trim();
  const words = text.split(/[\s-]+/).filter(Boolean);
  const initials = (words[0]?.[0] ?? "M") + (words[1]?.[0] ?? words[0]?.[1] ?? "");
  const img = getMapelImageWithFallback(slugOrName);
  return {
    gradient: `bg-gradient-to-br ${p.from} ${p.to}`,
    accent: p.accent,
    pattern,
    initials: initials.toUpperCase().slice(0, 2),
    photoUrl: img,
    photoUrlLg: img,
  };
}

export function PatternSVG({ pattern, className = "" }: { pattern: Pattern; className?: string }) {
  const common = { stroke: "white", strokeOpacity: 0.25, fill: "none", strokeWidth: 1.5 };
  return (
    <svg className={className} viewBox="0 0 200 200" preserveAspectRatio="none">
      {pattern === "dots" &&
        Array.from({ length: 8 }).map((_, r) =>
          Array.from({ length: 8 }).map((__, c) => (
            <circle key={`${r}-${c}`} cx={12 + c * 26} cy={12 + r * 26} r={2.5} fill="white" fillOpacity={0.35} />
          )),
        )}
      {pattern === "grid" &&
        Array.from({ length: 9 }).map((_, i) => (
          <g key={i}>
            <line x1={i * 25} y1={0} x2={i * 25} y2={200} {...common} />
            <line x1={0} y1={i * 25} x2={200} y2={i * 25} {...common} />
          </g>
        ))}
      {pattern === "waves" &&
        Array.from({ length: 6 }).map((_, i) => (
          <path key={i} d={`M0 ${30 + i * 30} Q 50 ${10 + i * 30} 100 ${30 + i * 30} T 200 ${30 + i * 30}`} {...common} />
        ))}
      {pattern === "rings" &&
        Array.from({ length: 5 }).map((_, i) => (
          <circle key={i} cx={100} cy={100} r={20 + i * 18} {...common} />
        ))}
      {pattern === "diag" &&
        Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1={-50 + i * 30} y1={0} x2={50 + i * 30} y2={200} {...common} />
        ))}
    </svg>
  );
}
