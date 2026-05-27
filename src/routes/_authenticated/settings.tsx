import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — Eduverse" }] }),
  component: SettingsPage,
});

const SECTIONS = [
  { title: "Notifikasi", items: ["Email notifikasi", "Push notifikasi", "Reminder belajar harian"] },
  { title: "Tampilan", items: ["Dark mode", "Bahasa: Indonesia", "Font size"] },
  { title: "Privasi", items: ["Tampilkan profil di leaderboard", "Bagikan progress ke orang tua"] },
  { title: "Akun", items: ["Ubah password", "Hapus akun"] },
];

function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-extrabold flex items-center gap-2"><SettingsIcon className="w-7 h-7" /> Settings</h1>
      {SECTIONS.map((s) => (
        <div key={s.title} className="p-5 rounded-2xl bg-white border border-border">
          <h2 className="font-extrabold mb-3">{s.title}</h2>
          <ul className="divide-y divide-border">
            {s.items.map((it) => (
              <li key={it} className="py-3 flex items-center justify-between">
                <span className="text-sm font-semibold">{it}</span>
                <span className="w-10 h-5 rounded-full bg-muted relative"><span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white" /></span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
