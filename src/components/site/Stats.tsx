const stats = [
  { value: "50K+", label: "Siswa Aktif", color: "text-success" },
  { value: "1000+", label: "Video Pembelajaran", color: "text-primary" },
  { value: "100+", label: "Tryout UTBK", color: "text-secondary" },
  { value: "98%", label: "Tingkat Kepuasan", color: "text-success" },
];

export function Stats() {
  return (
    <section className="py-16 bg-background border-y border-border/50">
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <div className={`text-4xl md:text-5xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="mt-2 text-sm md:text-base text-muted-foreground font-medium">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
