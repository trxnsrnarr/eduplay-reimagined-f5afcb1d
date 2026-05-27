// Curriculum data: jenjang → (jurusan) → mapel → bab list.

export type Jenjang = "sd" | "smp" | "sma" | "smk" | "kuliah" | "utbk";
export type MapelKind = "umum" | "kejuruan";
export type Difficulty = "Pemula" | "Menengah" | "Lanjut";

export const JENJANG_OPTIONS: { value: Jenjang; label: string; emoji: string }[] = [
  { value: "sd", label: "SD / MI", emoji: "🎒" },
  { value: "smp", label: "SMP / MTS", emoji: "📘" },
  { value: "sma", label: "SMA", emoji: "🎓" },
  { value: "smk", label: "SMK", emoji: "🛠️" },
  { value: "kuliah", label: "Kuliah", emoji: "🏛️" },
  { value: "utbk", label: "Persiapan UTBK / TKA", emoji: "🚀" },
];

export const JURUSAN_OPTIONS: Record<Jenjang, string[]> = {
  sd: [],
  smp: [],
  sma: ["IPA", "IPS", "Bahasa"],
  smk: ["TKJ", "RPL", "DKV", "Multimedia", "Akuntansi", "Perhotelan", "Tata Boga", "Otomotif", "Farmasi"],
  kuliah: [
    "Teknik Informatika",
    "Sistem Informasi",
    "Manajemen",
    "Akuntansi",
    "Kedokteran",
    "Hukum",
    "Psikologi",
    "Desain Komunikasi Visual",
    "Teknik Sipil",
    "Ilmu Komunikasi",
  ],
  utbk: [],
};

export const TUJUAN_OPTIONS = [
  "Belajar materi sekolah",
  "Persiapan ujian sekolah",
  "Persiapan UTBK / TKA",
  "Meningkatkan nilai rapor",
  "Belajar skill tertentu",
];

export type Mapel = {
  slug: string;
  name: string;
  emoji: string;
  color: string;
  kind: MapelKind;
  difficulty: Difficulty;
  estMinutes: number;
  xpPerBab: number;
  bab: string[];
};

const C = {
  pink: "bg-gradient-pink",
  purple: "bg-gradient-purple",
  brand: "bg-gradient-brand",
  accent: "bg-accent",
};

function bab(n: number, titles: string[]): string[] {
  return Array.from({ length: n }, (_, i) => titles[i] ?? `Bab ${i + 1}`);
}

const mk = (
  slug: string, name: string, emoji: string, color: string,
  kind: MapelKind, difficulty: Difficulty, estMinutes: number, xpPerBab: number,
  babList: string[],
): Mapel => ({ slug, name, emoji, color, kind, difficulty, estMinutes, xpPerBab, bab: babList });

const M = {
  // ============ SD ============
  mtkSD: mk("mtk-sd", "Matematika", "🔢", C.pink, "umum", "Pemula", 25, 40, bab(8, ["Bilangan", "Operasi Hitung", "Pengukuran", "Geometri Dasar", "Pecahan", "Bangun Datar", "Statistika Dasar", "Soal Cerita"])),
  ipaSD: mk("ipa-sd", "IPA", "🔬", C.purple, "umum", "Pemula", 20, 35, bab(7, ["Makhluk Hidup", "Tubuh Manusia", "Energi", "Bumi & Alam", "Gaya & Gerak", "Cahaya & Bunyi", "Lingkungan"])),
  ipsSD: mk("ips-sd", "IPS", "🌏", C.brand, "umum", "Pemula", 20, 30, bab(6, ["Lingkungan Sekitar", "Keluarga", "Indonesia", "Pahlawan", "Ekonomi Sederhana", "Peta"])),
  binSD: mk("bin-sd", "Bahasa Indonesia", "📚", C.accent, "umum", "Pemula", 20, 30, bab(7, ["Membaca", "Menulis", "Mendengar", "Kosakata", "Puisi", "Cerita", "Tata Bahasa"])),
  bingSD: mk("bing-sd", "Bahasa Inggris", "🅰️", C.pink, "umum", "Pemula", 20, 30, bab(6, ["Alphabet", "Numbers", "Family", "Animals", "Colors", "Daily Activities"])),
  ppknSD: mk("ppkn-sd", "PPKn", "🇮🇩", C.purple, "umum", "Pemula", 15, 25, bab(5, ["Pancasila", "UUD 1945", "Bhinneka", "Hak & Kewajiban", "Gotong Royong"])),
  agamaSD: mk("agama-sd", "Pendidikan Agama", "🕌", C.accent, "umum", "Pemula", 15, 25, bab(6, ["Iman", "Ibadah", "Akhlak", "Kisah Nabi", "Doa Sehari-hari", "Toleransi"])),
  sbkSD: mk("sbk-sd", "Seni Budaya", "🎨", C.pink, "umum", "Pemula", 15, 20, bab(5, ["Menggambar", "Mewarnai", "Musik", "Tari", "Kerajinan"])),
  pjokSD: mk("pjok-sd", "PJOK / Olahraga", "⚽", C.brand, "umum", "Pemula", 15, 20, bab(5, ["Atletik", "Permainan Bola", "Senam", "Kebugaran", "Kesehatan"])),

  // ============ SMP ============
  mtkSMP: mk("mtk-smp", "Matematika", "🔢", C.pink, "umum", "Menengah", 30, 50, bab(8, ["Bilangan", "Aljabar", "Persamaan Linear", "Bangun Datar", "Bangun Ruang", "Statistika", "Peluang", "Trigonometri Dasar"])),
  ipaSMP: mk("ipa-smp", "IPA Terpadu", "🧪", C.purple, "umum", "Menengah", 30, 50, bab(7, ["Fisika Dasar", "Kimia Dasar", "Biologi Dasar", "Sistem Tubuh", "Listrik", "Energi", "Ekosistem"])),
  ipsSMP: mk("ips-smp", "IPS Terpadu", "🌍", C.brand, "umum", "Menengah", 25, 40, bab(6, ["Sejarah", "Geografi", "Ekonomi", "Sosiologi", "Indonesia & Dunia", "Globalisasi"])),
  binSMP: mk("bin-smp", "Bahasa Indonesia", "📚", C.accent, "umum", "Menengah", 25, 40, bab(6, ["Teks Berita", "Teks Eksposisi", "Cerpen", "Puisi", "Tata Bahasa", "Karya Ilmiah"])),
  bingSMP: mk("bing-smp", "Bahasa Inggris", "🅰️", C.pink, "umum", "Menengah", 25, 40, bab(6, ["Tenses Dasar", "Vocabulary", "Reading", "Listening", "Speaking", "Writing"])),
  infoSMP: mk("info-smp", "Informatika", "💻", C.purple, "umum", "Menengah", 25, 45, bab(6, ["Pengantar Komputer", "Algoritma Dasar", "Scratch", "Internet & Etika", "Office Tools", "Logika"])),
  ppknSMP: mk("ppkn-smp", "PPKn", "🇮🇩", C.brand, "umum", "Menengah", 20, 30, bab(5, ["Pancasila", "Konstitusi", "Bhinneka", "HAM", "Negara Hukum"])),

  // ============ SMA UMUM ============
  mtkWajib: mk("mtk-wajib", "Matematika Wajib", "🔢", C.pink, "umum", "Menengah", 35, 60, bab(8, ["Fungsi", "Persamaan Kuadrat", "SPLDV/SPLTV", "Trigonometri", "Statistika", "Peluang", "Limit", "Turunan"])),
  binSMA: mk("bin-sma", "Bahasa Indonesia", "📚", C.accent, "umum", "Menengah", 30, 50, bab(6, ["Teks Editorial", "Cerpen & Novel", "Drama", "Karya Ilmiah", "Resensi", "Debat"])),
  bingSMA: mk("bing-sma", "Bahasa Inggris", "🅰️", C.pink, "umum", "Menengah", 30, 50, bab(6, ["Advanced Tenses", "Reading Comprehension", "Listening", "Speaking", "Essay Writing", "Grammar"])),
  sejarah: mk("sejarah", "Sejarah", "📜", C.brand, "umum", "Menengah", 25, 40, bab(6, ["Pra-Aksara", "Kerajaan", "Kolonial", "Kemerdekaan", "Orde Lama & Baru", "Reformasi"])),
  ppknSMA: mk("ppkn-sma", "PPKn", "🇮🇩", C.purple, "umum", "Menengah", 20, 30, bab(5, ["Pancasila", "UUD", "HAM", "Sistem Politik", "Wawasan Nusantara"])),
  agamaSMA: mk("agama-sma", "Pendidikan Agama", "🕌", C.accent, "umum", "Pemula", 20, 30, bab(5, ["Aqidah", "Ibadah", "Akhlak", "Sejarah", "Muamalah"])),
  sbkSMA: mk("sbk-sma", "Seni Budaya", "🎨", C.pink, "umum", "Pemula", 20, 30, bab(5, ["Seni Rupa", "Musik", "Tari", "Teater", "Apresiasi Seni"])),
  pjokSMA: mk("pjok-sma", "PJOK", "⚽", C.brand, "umum", "Pemula", 20, 30, bab(5, ["Atletik", "Permainan", "Senam & Beladiri", "Kebugaran", "Kesehatan Reproduksi"])),

  // ============ SMA IPA ============
  mtkPeminatan: mk("mtk-peminatan", "Matematika Peminatan", "📐", C.purple, "kejuruan", "Lanjut", 40, 75, bab(7, ["Eksponen & Logaritma", "Trigonometri Lanjut", "Limit", "Turunan", "Integral", "Vektor", "Matriks"])),
  fisika: mk("fisika", "Fisika", "⚛️", C.brand, "kejuruan", "Lanjut", 40, 70, bab(8, ["Besaran & Satuan", "Kinematika", "Dinamika", "Energi", "Listrik", "Magnet", "Gelombang", "Modern"])),
  kimia: mk("kimia", "Kimia", "⚗️", C.purple, "kejuruan", "Lanjut", 35, 65, bab(7, ["Struktur Atom", "Ikatan Kimia", "Stoikiometri", "Larutan", "Termokimia", "Laju Reaksi", "Kesetimbangan"])),
  biologi: mk("biologi", "Biologi", "🧬", C.pink, "kejuruan", "Menengah", 35, 60, bab(7, ["Sel", "Genetika", "Evolusi", "Sistem Tubuh", "Ekosistem", "Bioteknologi", "Klasifikasi"])),

  // ============ SMA IPS ============
  ekonomi: mk("ekonomi", "Ekonomi", "💰", C.pink, "kejuruan", "Menengah", 30, 55, bab(7, ["Konsep Dasar", "Permintaan & Penawaran", "Pasar", "Uang & Bank", "Akuntansi", "APBN", "Ekonomi Internasional"])),
  geografi: mk("geografi", "Geografi", "🗺️", C.purple, "kejuruan", "Menengah", 25, 45, bab(6, ["Bumi & Tata Surya", "Atmosfer", "Hidrosfer", "Litosfer", "Penduduk", "Lingkungan"])),
  sosiologi: mk("sosiologi", "Sosiologi", "👥", C.brand, "kejuruan", "Menengah", 25, 40, bab(6, ["Interaksi Sosial", "Sosialisasi", "Penyimpangan", "Struktur Sosial", "Konflik", "Perubahan"])),

  // ============ SMK TKJ ============
  jaringan: mk("jaringan", "Jaringan Komputer", "🌐", C.brand, "kejuruan", "Menengah", 40, 70, bab(8, ["Pengantar Jaringan", "OSI Layer", "TCP/IP", "Subnetting", "Routing", "Switching", "Wireless", "Troubleshooting"])),
  linuxSrv: mk("linux-server", "Linux Server", "🐧", C.purple, "kejuruan", "Lanjut", 40, 75, bab(7, ["Pengantar Linux", "CLI Dasar", "File System", "User Management", "Web Server", "DNS Server", "Security"])),
  mikrotik: mk("mikrotik", "Mikrotik", "📡", C.pink, "kejuruan", "Lanjut", 35, 65, bab(6, ["RouterOS", "Konfigurasi Dasar", "Firewall", "Bandwidth Management", "Hotspot", "VPN"])),
  adminSys: mk("admin-sys", "Administrasi Sistem", "🖥️", C.accent, "kejuruan", "Menengah", 30, 55, bab(6, ["Windows Server", "Active Directory", "Backup", "Monitoring", "Scripting", "Virtualisasi"])),
  fiber: mk("fiber", "Fiber Optik", "🔆", C.brand, "kejuruan", "Menengah", 30, 50, bab(5, ["Pengenalan FO", "Splicing", "OTDR", "Instalasi", "Perawatan"])),
  cyberSec: mk("cyber-sec", "Cyber Security", "🔐", C.purple, "kejuruan", "Lanjut", 45, 80, bab(7, ["Pengantar Keamanan", "Ethical Hacking", "Cryptography", "Network Security", "Web Security", "Forensik", "Compliance"])),
  cloud: mk("cloud", "Cloud Computing", "☁️", C.pink, "kejuruan", "Lanjut", 40, 70, bab(6, ["Pengantar Cloud", "AWS Basic", "Containerisasi", "Kubernetes", "Serverless", "Cloud Security"])),
  iot: mk("iot", "Internet of Things", "📶", C.brand, "kejuruan", "Lanjut", 35, 65, bab(5, ["Sensor & Aktuator", "Mikrokontroler", "Protokol IoT", "Cloud IoT", "Proyek Smart Device"])),

  // ============ SMK RPL ============
  pemrograman: mk("pemrograman", "Pemrograman Dasar", "👨‍💻", C.pink, "kejuruan", "Pemula", 35, 60, bab(7, ["Variabel & Tipe Data", "Operator", "Percabangan", "Perulangan", "Fungsi", "Array", "OOP Dasar"])),
  webDev: mk("web-dev", "Web Development", "🌐", C.purple, "kejuruan", "Menengah", 45, 80, bab(8, ["HTML", "CSS", "JavaScript", "Responsive", "Backend Dasar", "Database Web", "Framework", "Deploy"])),
  mobileDev: mk("mobile-dev", "Mobile Development", "📱", C.brand, "kejuruan", "Lanjut", 40, 75, bab(6, ["Android Dasar", "UI/UX Mobile", "Database Lokal", "API", "State Management", "Publish App"])),
  database: mk("database", "Database", "🗄️", C.accent, "kejuruan", "Menengah", 35, 65, bab(7, ["Konsep DB", "ERD", "SQL Dasar", "JOIN", "Subquery", "Normalisasi", "NoSQL"])),
  uiux: mk("uiux", "UI / UX Design", "🎨", C.pink, "kejuruan", "Pemula", 30, 55, bab(6, ["Design Principle", "Wireframe", "Prototyping", "Figma", "User Research", "Design System"])),
  jsPro: mk("js-pro", "JavaScript Lanjut", "📜", C.purple, "kejuruan", "Lanjut", 40, 75, bab(6, ["ES6+", "Async / Promise", "TypeScript", "Testing", "Build Tools", "Patterns"])),
  reactFw: mk("react-fw", "React & Framework", "⚛️", C.brand, "kejuruan", "Lanjut", 45, 80, bab(6, ["JSX", "Hooks", "State Management", "Routing", "Data Fetching", "Performance"])),
  devops: mk("devops", "DevOps Basic", "🛠️", C.accent, "kejuruan", "Lanjut", 40, 75, bab(5, ["CI/CD", "Docker", "Git Advanced", "Monitoring", "Cloud Deploy"])),

  // ============ SMK DKV ============
  desGrafis: mk("des-grafis", "Desain Grafis", "🎨", C.pink, "kejuruan", "Pemula", 30, 55, bab(7, ["Prinsip Desain", "Warna", "Tipografi", "Layout", "Adobe Illustrator", "Photoshop", "Branding Dasar"])),
  ilustrasi: mk("ilustrasi", "Ilustrasi Digital", "✏️", C.purple, "kejuruan", "Menengah", 35, 60, bab(6, ["Sketsa", "Line Art", "Coloring", "Karakter", "Komposisi", "Style Eksplorasi"])),
  motion: mk("motion", "Motion Graphic", "🎞️", C.brand, "kejuruan", "Lanjut", 40, 70, bab(6, ["Pengantar Motion", "After Effects", "Animasi Karakter", "Sound Design", "Render", "Showreel"])),
  videoEdit: mk("video-edit", "Video Editing", "🎬", C.accent, "kejuruan", "Menengah", 35, 60, bab(6, ["Premiere Basic", "Cutting", "Color Grading", "Audio Mixing", "Transisi", "Export"])),
  branding: mk("branding", "Branding & Identity", "🏷️", C.pink, "kejuruan", "Menengah", 30, 55, bab(5, ["Brand Strategy", "Logo Design", "Brand Guidelines", "Mockup", "Studi Kasus"])),

  // ============ SMK Akuntansi ============
  akunDasar: mk("akun-dasar", "Akuntansi Dasar", "📒", C.pink, "kejuruan", "Pemula", 30, 55, bab(7, ["Persamaan Akuntansi", "Jurnal Umum", "Buku Besar", "Neraca Saldo", "Penyesuaian", "Laporan Keuangan", "Penutupan"])),
  perpajakan: mk("perpajakan", "Perpajakan", "📑", C.purple, "kejuruan", "Menengah", 30, 55, bab(6, ["Pengantar Pajak", "PPh", "PPN", "PBB", "Pelaporan", "E-Faktur"])),
  spreadsheet: mk("spreadsheet", "Spreadsheet & Excel", "📊", C.brand, "kejuruan", "Pemula", 25, 50, bab(6, ["Dasar Excel", "Formula", "Pivot Table", "VLOOKUP", "Chart", "Macro Dasar"])),
  audit: mk("audit", "Audit Dasar", "🔍", C.accent, "kejuruan", "Lanjut", 35, 65, bab(5, ["Pengantar Audit", "Etika Auditor", "Bukti Audit", "Sampling", "Laporan Audit"])),

  // ============ SMK Multimedia ============
  fotografi: mk("fotografi", "Fotografi", "📷", C.brand, "kejuruan", "Pemula", 30, 50, bab(6, ["Kamera", "Komposisi", "Pencahayaan", "Genre", "Editing Foto", "Portofolio"])),
  animasi: mk("animasi", "Animasi 2D/3D", "🐝", C.purple, "kejuruan", "Lanjut", 40, 70, bab(6, ["Prinsip Animasi", "Storyboard", "Rigging", "3D Modeling", "Lighting", "Render"])),

  // ============ SMK Otomotif ============
  mesinDasar: mk("mesin-dasar", "Teknologi Dasar Otomotif", "🔧", C.brand, "kejuruan", "Pemula", 30, 55, bab(7, ["Motor Bakar", "Sistem Bahan Bakar", "Sistem Pendingin", "Pelumasan", "Kelistrikan", "Sistem Rem", "Transmisi"])),
  enginePerf: mk("engine-perf", "Engine Performance", "🚗", C.pink, "kejuruan", "Lanjut", 35, 65, bab(5, ["Diagnostik", "ECU", "Tuning", "Modifikasi", "Standar Emisi"])),

  // ============ SMK Tata Boga ============
  pastry: mk("pastry", "Pastry & Bakery", "🥐", C.accent, "kejuruan", "Pemula", 30, 50, bab(6, ["Bahan Dasar", "Roti", "Cake", "Cookies", "Dekorasi", "Plating"])),
  kulinerNus: mk("kuliner-nus", "Kuliner Nusantara", "🍛", C.brand, "kejuruan", "Menengah", 35, 60, bab(6, ["Bumbu Dasar", "Sumatra", "Jawa", "Bali", "Sulawesi", "Plating Modern"])),

  // ============ SMK Perhotelan ============
  frontOffice: mk("front-office", "Front Office", "🏨", C.purple, "kejuruan", "Pemula", 25, 45, bab(5, ["Reservasi", "Check-in/out", "Komunikasi Tamu", "Concierge", "Komplain Handling"])),
  housekeeping: mk("housekeeping", "Housekeeping", "🧺", C.pink, "kejuruan", "Pemula", 20, 35, bab(5, ["SOP Kamar", "Linen & Laundry", "Public Area", "Hygiene", "Inventaris"])),

  // ============ SMK Farmasi ============
  farmasi: mk("farmasi", "Ilmu Farmasi Dasar", "💊", C.purple, "kejuruan", "Menengah", 30, 55, bab(6, ["Pengantar Farmasi", "Resep & Dosis", "Sediaan Obat", "Etika Profesi", "Toksikologi", "Manajemen Apotek"])),

  // ============ Kuliah Teknik Informatika ============
  algoritma: mk("algoritma", "Algoritma & Pemrograman", "🧠", C.pink, "kejuruan", "Menengah", 40, 75, bab(8, ["Pengantar", "Variabel", "Kontrol Alur", "Fungsi", "Rekursi", "Pencarian", "Sorting", "Kompleksitas"])),
  strukDat: mk("struktur-data", "Struktur Data", "📊", C.purple, "kejuruan", "Lanjut", 45, 80, bab(7, ["Array & List", "Stack & Queue", "Linked List", "Tree", "Graph", "Hash Table", "Heap"])),
  basisData: mk("basis-data", "Basis Data", "🗄️", C.brand, "kejuruan", "Menengah", 40, 70, bab(7, ["Model Data", "ERD", "SQL", "Normalisasi", "Transaksi", "Indexing", "NoSQL"])),
  ml: mk("ml", "Machine Learning", "🤖", C.purple, "kejuruan", "Lanjut", 50, 90, bab(8, ["Pengantar ML", "Regresi", "Klasifikasi", "Clustering", "Neural Network", "Deep Learning", "NLP", "Evaluasi"])),
  sisop: mk("sisop", "Sistem Operasi", "⚙️", C.accent, "kejuruan", "Lanjut", 40, 75, bab(7, ["Pengantar OS", "Proses", "Thread", "Memory", "File System", "I/O", "Konkurensi"])),
  jarkom: mk("jarkom", "Jaringan Komputer", "🌐", C.brand, "kejuruan", "Menengah", 40, 70, bab(7, ["OSI & TCP/IP", "Application Layer", "Transport", "Network Layer", "Data Link", "Security", "Wireless"])),
  webProg: mk("web-prog", "Pemrograman Web", "💻", C.pink, "kejuruan", "Menengah", 45, 80, bab(7, ["HTML/CSS", "JavaScript", "DOM", "REST API", "Auth", "Framework", "Deploy"])),
  ai: mk("ai", "Artificial Intelligence", "🤖", C.purple, "kejuruan", "Lanjut", 45, 85, bab(7, ["Pengantar AI", "Search", "Knowledge", "Logika", "Machine Learning", "NLP", "Etika AI"])),
  blockchain: mk("blockchain", "Blockchain", "⛓️", C.brand, "kejuruan", "Lanjut", 40, 75, bab(5, ["Kriptografi", "Konsensus", "Smart Contract", "DApps", "Use Case"])),
  swArch: mk("sw-arch", "Software Architecture", "🏛️", C.accent, "kejuruan", "Lanjut", 40, 75, bab(5, ["Pattern", "Microservices", "Event-Driven", "Cloud Native", "Studi Kasus"])),

  // ============ Kuliah Manajemen ============
  manBisnis: mk("man-bisnis", "Manajemen Bisnis", "💼", C.pink, "kejuruan", "Menengah", 30, 55, bab(7, ["Pengantar Manajemen", "Perencanaan", "Organisasi", "Kepemimpinan", "Kontrol", "Strategi", "Etika Bisnis"])),
  manSDM: mk("man-sdm", "Manajemen SDM", "👥", C.purple, "kejuruan", "Menengah", 30, 55, bab(6, ["Rekrutmen", "Training", "Performance", "Kompensasi", "Hubungan Industrial", "HR Analytics"])),
  marketing: mk("marketing", "Marketing", "📣", C.brand, "kejuruan", "Menengah", 30, 55, bab(7, ["Marketing Mix", "Segmentasi", "Branding", "Pricing", "Distribusi", "Promosi", "Riset Pasar"])),
  digMarketing: mk("dig-marketing", "Digital Marketing", "📲", C.pink, "kejuruan", "Menengah", 30, 60, bab(6, ["SEO", "SEM", "Social Media", "Content", "Email", "Analytics"])),
  finance: mk("finance", "Manajemen Keuangan", "💰", C.accent, "kejuruan", "Lanjut", 35, 65, bab(6, ["Time Value of Money", "Kapital Anggaran", "Struktur Modal", "Working Capital", "Investasi", "Risiko"])),
  entrepreneur: mk("entrepreneur", "Entrepreneurship", "🚀", C.purple, "kejuruan", "Menengah", 30, 55, bab(5, ["Mindset", "Business Model Canvas", "Pitching", "Funding", "Scaling"])),

  // ============ Kuliah Kedokteran ============
  anatomi: mk("anatomi", "Anatomi", "🦴", C.brand, "kejuruan", "Lanjut", 40, 75, bab(7, ["Sistem Rangka", "Otot", "Saraf", "Kardiovaskular", "Respirasi", "Digestif", "Reproduksi"])),
  fisiologi: mk("fisiologi", "Fisiologi", "🫀", C.pink, "kejuruan", "Lanjut", 40, 75, bab(6, ["Sel & Membran", "Kardio-Respirasi", "Renal", "Endokrin", "Saraf", "Reproduksi"])),
  biokimia: mk("biokimia", "Biokimia", "🧪", C.purple, "kejuruan", "Lanjut", 35, 70, bab(5, ["Karbohidrat", "Protein", "Lipid", "Enzim", "Metabolisme"])),
  farmakologi: mk("farmakologi", "Farmakologi", "💊", C.accent, "kejuruan", "Lanjut", 35, 70, bab(5, ["Farmakokinetik", "Farmakodinamik", "Antibiotik", "Analgetik", "Toksikologi"])),
  patologi: mk("patologi", "Patologi", "🔬", C.purple, "kejuruan", "Lanjut", 35, 70, bab(5, ["Inflamasi", "Neoplasma", "Sistem Imun", "Genetik", "Klinis"])),
  mikrobiologi: mk("mikrobiologi", "Mikrobiologi", "🦠", C.brand, "kejuruan", "Lanjut", 30, 65, bab(5, ["Bakteri", "Virus", "Jamur", "Parasit", "Resistensi"])),

  // ============ Kuliah Hukum ============
  hukumDasar: mk("hukum-dasar", "Pengantar Ilmu Hukum", "⚖️", C.pink, "kejuruan", "Menengah", 30, 55, bab(6, ["Sumber Hukum", "Klasifikasi", "Lembaga Negara", "Hukum Acara", "Tata Negara", "Internasional"])),
  pidana: mk("pidana", "Hukum Pidana", "🚓", C.purple, "kejuruan", "Lanjut", 30, 60, bab(5, ["Asas", "Tindak Pidana", "Sanksi", "Hukum Acara Pidana", "Cybercrime"])),
  perdata: mk("perdata", "Hukum Perdata", "📜", C.brand, "kejuruan", "Lanjut", 30, 60, bab(5, ["Subjek Hukum", "Perjanjian", "Waris", "Keluarga", "Acara Perdata"])),

  // ============ Kuliah Psikologi ============
  psiUmum: mk("psi-umum", "Psikologi Umum", "🧠", C.pink, "kejuruan", "Menengah", 30, 55, bab(6, ["Sejarah", "Persepsi", "Memori", "Emosi", "Motivasi", "Kepribadian"])),
  psiPerkembangan: mk("psi-perkembangan", "Psikologi Perkembangan", "👶", C.purple, "kejuruan", "Menengah", 30, 55, bab(5, ["Bayi", "Anak", "Remaja", "Dewasa", "Lansia"])),
  psiSosial: mk("psi-sosial", "Psikologi Sosial", "👥", C.brand, "kejuruan", "Menengah", 30, 55, bab(5, ["Kognisi Sosial", "Sikap", "Pengaruh Sosial", "Kelompok", "Prososial"])),

  // ============ Kuliah Teknik Sipil ============
  strukturBangunan: mk("struktur-bangunan", "Struktur Bangunan", "🏗️", C.brand, "kejuruan", "Lanjut", 40, 75, bab(6, ["Statika", "Mekanika Bahan", "Beton", "Baja", "Pondasi", "Gempa"])),
  hidrologi: mk("hidrologi", "Hidrologi", "💧", C.accent, "kejuruan", "Menengah", 35, 65, bab(5, ["Siklus Hidrologi", "Curah Hujan", "Aliran", "DAS", "Banjir"])),

  // ============ Kuliah Ilmu Komunikasi ============
  komMassa: mk("kom-massa", "Komunikasi Massa", "📺", C.pink, "kejuruan", "Menengah", 30, 55, bab(5, ["Teori", "Media", "Jurnalisme", "Efek", "Etika"])),
  pr: mk("pr", "Public Relations", "🤝", C.purple, "kejuruan", "Menengah", 30, 55, bab(5, ["Konsep PR", "Krisis", "Media Relations", "CSR", "Digital PR"])),

  // ============ UTBK ============
  tps: mk("tps", "TPS - Tes Potensi Skolastik", "🧩", C.pink, "kejuruan", "Lanjut", 40, 80, bab(6, ["Penalaran Umum", "Kuantitatif", "Pemahaman Bacaan", "Pengetahuan Umum", "Strategi", "Latihan"])),
  penalaran: mk("penalaran", "Penalaran Umum", "🧠", C.purple, "kejuruan", "Lanjut", 35, 70, bab(6, ["Analitik", "Deduktif", "Induktif", "Pola Bilangan", "Sebab-Akibat", "Latihan"])),
  literasi: mk("literasi", "Literasi Bahasa", "📖", C.brand, "kejuruan", "Lanjut", 35, 70, bab(6, ["Indonesia", "Inggris", "Ide Pokok", "Inferensi", "Kosakata", "Latihan"])),
  mtkDasar: mk("mtk-dasar", "Matematika Dasar", "🔢", C.accent, "kejuruan", "Menengah", 35, 70, bab(7, ["Aritmetika", "Aljabar", "Geometri", "Statistika", "Logika", "Fungsi", "Soal Cerita"])),
  tryout: mk("tryout", "Tryout Lengkap", "📝", C.pink, "kejuruan", "Lanjut", 90, 150, bab(6, ["Tryout 1", "Tryout 2", "Tryout 3", "Tryout 4", "Tryout 5", "Tryout 6"])),
  pembahasan: mk("pembahasan", "Pembahasan Soal", "💡", C.purple, "umum", "Menengah", 25, 50, bab(5, ["TPS", "Penalaran", "Literasi", "Matematika", "Tips & Trik"])),
} satisfies Record<string, Mapel>;

type MapelKey = keyof typeof M;

export function getMapelForTrack(jenjang: Jenjang | null | undefined, jurusan?: string | null): Mapel[] {
  const keys: MapelKey[] = (() => {
    switch (jenjang) {
      case "sd": return ["mtkSD", "ipaSD", "ipsSD", "binSD", "bingSD", "ppknSD", "agamaSD", "sbkSD", "pjokSD"];
      case "smp": return ["mtkSMP", "ipaSMP", "ipsSMP", "binSMP", "bingSMP", "infoSMP", "ppknSMP"];
      case "sma": {
        const umum = ["mtkWajib", "binSMA", "bingSMA", "sejarah", "ppknSMA", "agamaSMA", "sbkSMA", "pjokSMA"] as MapelKey[];
        if (jurusan === "IPS") return [...umum, "ekonomi", "geografi", "sosiologi"];
        if (jurusan === "Bahasa") return [...umum, "sosiologi"];
        return [...umum, "mtkPeminatan", "fisika", "kimia", "biologi"];
      }
      case "smk": {
        const umum = ["binSMA", "bingSMA", "mtkWajib", "ppknSMA", "agamaSMA", "pjokSMA"] as MapelKey[];
        if (jurusan === "RPL") return [...umum, "pemrograman", "webDev", "mobileDev", "database", "uiux", "jsPro", "reactFw", "devops"];
        if (jurusan === "TKJ") return [...umum, "jaringan", "linuxSrv", "mikrotik", "adminSys", "fiber", "cyberSec", "cloud", "iot"];
        if (jurusan === "DKV") return [...umum, "desGrafis", "ilustrasi", "motion", "videoEdit", "branding", "uiux"];
        if (jurusan === "Akuntansi") return [...umum, "akunDasar", "perpajakan", "spreadsheet", "audit"];
        if (jurusan === "Multimedia") return [...umum, "desGrafis", "fotografi", "videoEdit", "animasi", "motion"];
        if (jurusan === "Otomotif") return [...umum, "mesinDasar", "enginePerf"];
        if (jurusan === "Tata Boga") return [...umum, "pastry", "kulinerNus"];
        if (jurusan === "Perhotelan") return [...umum, "frontOffice", "housekeeping"];
        if (jurusan === "Farmasi") return [...umum, "farmasi"];
        return [...umum, "pemrograman", "database"];
      }
      case "kuliah": {
        if (jurusan === "Teknik Informatika" || jurusan === "Sistem Informasi")
          return ["algoritma", "strukDat", "basisData", "sisop", "jarkom", "webProg", "ml", "ai", "blockchain", "swArch"];
        if (jurusan === "Manajemen") return ["manBisnis", "manSDM", "marketing", "digMarketing", "finance", "entrepreneur"];
        if (jurusan === "Akuntansi") return ["akunDasar", "perpajakan", "spreadsheet", "audit", "finance"];
        if (jurusan === "Kedokteran") return ["anatomi", "fisiologi", "biokimia", "farmakologi", "patologi", "mikrobiologi"];
        if (jurusan === "Hukum") return ["hukumDasar", "pidana", "perdata"];
        if (jurusan === "Psikologi") return ["psiUmum", "psiPerkembangan", "psiSosial"];
        if (jurusan === "Desain Komunikasi Visual") return ["desGrafis", "ilustrasi", "motion", "videoEdit", "branding", "uiux"];
        if (jurusan === "Teknik Sipil") return ["strukturBangunan", "hidrologi"];
        if (jurusan === "Ilmu Komunikasi") return ["komMassa", "pr", "digMarketing"];
        return ["algoritma", "basisData", "webProg"];
      }
      case "utbk": return ["tps", "penalaran", "literasi", "mtkDasar", "tryout", "pembahasan"];
      default: return [];
    }
  })();
  return keys.map((k) => M[k]);
}

export function findMapelBySlug(slug: string): Mapel | undefined {
  return (Object.values(M) as Mapel[]).find((m) => m.slug === slug);
}

export const PRICING_BY_JENJANG: Record<Jenjang, { price: number; label: string; emoji: string }> = {
  sd: { price: 15000, label: "SD / MI", emoji: "🎒" },
  smp: { price: 25000, label: "SMP / MTS", emoji: "📘" },
  sma: { price: 35000, label: "SMA / SMK", emoji: "🎓" },
  smk: { price: 35000, label: "SMA / SMK", emoji: "🛠️" },
  kuliah: { price: 60000, label: "Kuliah", emoji: "🏛️" },
  utbk: { price: 60000, label: "UTBK / TKA", emoji: "🚀" },
};

export const FREE_BAB_LIMIT = 3;
