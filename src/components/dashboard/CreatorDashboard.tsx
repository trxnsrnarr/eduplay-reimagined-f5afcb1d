import { Users, DollarSign, Eye, Plus, BookOpen, TrendingUp } from "lucide-react";
import type { Profile } from "./types";

const MODUL = [
  { title: "Aljabar Dasar untuk SMP", students: 1240, rating: 4.8, revenue: 2_480_000 },
  { title: "TOEFL Reading Strategy", students: 860, rating: 4.7, revenue: 1_720_000 },
  { title: "Fisika Asik: Newton", students: 410, rating: 4.6, revenue: 820_000 },
];

export function CreatorDashboard({ profile }: { profile: Profile }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Halo, {profile.display_name ?? "Creator"} ✨</h1>
          <p className="text-muted-foreground mt-1">
            Edu Creator{profile.bidang ? ` · ${profile.bidang}` : ""}{profile.institusi ? ` · ${profile.institusi}` : ""}
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-brand text-white text-sm font-bold shadow-md">
          <Plus className="w-4 h-4" /> Buat Modul Baru
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Stat Icon={Users} color="bg-gradient-purple" label="Total Siswa" value="2,510" />
        <Stat Icon={Eye} color="bg-gradient-pink" label="Views Bulan Ini" value="18.4K" />
        <Stat Icon={DollarSign} color="bg-gradient-brand" label="Pendapatan" value="Rp 5,02jt" />
        <Stat Icon={TrendingUp} color="bg-warning" label="Growth" value="+24%" />
      </div>

      <div className="p-6 rounded-3xl bg-white border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-lg flex items-center gap-2"><BookOpen className="w-5 h-5" /> Modul Kamu</h2>
          <button className="text-sm font-bold text-primary">Lihat semua</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="py-3 font-bold">Judul</th>
                <th className="py-3 font-bold">Siswa</th>
                <th className="py-3 font-bold">Rating</th>
                <th className="py-3 font-bold">Pendapatan</th>
              </tr>
            </thead>
            <tbody>
              {MODUL.map((m) => (
                <tr key={m.title} className="border-b border-border/60">
                  <td className="py-3 font-semibold">{m.title}</td>
                  <td className="py-3">{m.students.toLocaleString()}</td>
                  <td className="py-3">⭐ {m.rating}</td>
                  <td className="py-3 font-bold">Rp {m.revenue.toLocaleString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-gradient-brand text-white">
          <h2 className="font-extrabold text-xl">Revenue Share 70/30</h2>
          <p className="text-sm text-white/85 mt-1">Kamu dapat 70% dari setiap subscription siswa yang mengakses modulmu.</p>
        </div>
        <div className="p-6 rounded-3xl bg-white border border-border">
          <h2 className="font-extrabold text-lg mb-2">Tips Creator</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Tambahkan kuis interaktif untuk meningkatkan completion rate</li>
            <li>• Update modul minimal 1x per bulan agar tetap di top recommendation</li>
            <li>• Gunakan AI assistant untuk generate soal latihan otomatis</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Stat({ Icon, color, label, value }: { Icon: typeof Users; color: string; label: string; value: string }) {
  return (
    <div className="p-5 rounded-3xl bg-white border border-border">
      <div className={`w-10 h-10 rounded-xl ${color} grid place-items-center mb-3`}><Icon className="w-5 h-5 text-white" /></div>
      <div className="text-xs font-semibold text-muted-foreground">{label}</div>
      <div className="text-2xl font-extrabold">{value}</div>
    </div>
  );
}