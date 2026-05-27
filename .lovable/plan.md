
# Eduverse Expansion Plan

Scope is very large. I'll deliver it in **4 phases** within this turn, prioritizing **siswa-side** experience as you asked. Guru/Creator dashboards get scaffolding only.

---

## Phase 1 — Data Reset & Foundation

**Database migration (single migration):**
- Add `agama` enum (`islam`, `kristen`, `katolik`, `hindu`, `buddha`, `konghucu`) + `profiles.agama` column
- Add `fakultas` column to profiles (for kuliah jenjang)
- Add `progression` table per-user: `level`, `xp`, `streak_days`, `rank`, `last_active_at` — defaults to L1/XP0
- Add `achievements`, `user_achievements`, `daily_challenges`, `user_challenge_progress`
- **Reset rule**: progression table created empty; existing leaderboard/XP data wiped (DELETE statements where any progress tables exist; otherwise N/A since fresh project)
- Add `classrooms`, `classroom_members`, `classroom_posts`, `classroom_assignments`, `classroom_messages` (realtime chat)
- Add `creator_classes`, `creator_class_chapters`, `creator_class_purchases`
- Add `transactions` table (Midtrans: `order_id`, `status`, `gross_amount`, `payment_type`, `snap_token`, `target_kind`, `target_id`)
- Add `subscriptions` table (`plan`, `status`, `current_period_end`)
- RLS + GRANTs on every table

**Seed:**
- 1 demo classroom "SIJA Cloud Computing Fundamental" with teacher "Demo Edu Creator", classroom_code generated, 3 demo posts, 3 demo chat messages, leaderboard rows
- ~6 demo creator classes (mix free/premium) across SMK/SMA tracks

---

## Phase 2 — Curriculum Restructure (`src/lib/curriculum.ts`)

New hierarchy: **Jenjang → Jurusan/Fakultas → Kategori (Umum / Kejuruan) → Mapel → Modul → Bab**

- Expand SMK jurusan: TKJ, SIJA, RPL, DKV, Multimedia, Animasi, Broadcasting, Perfilman, Akuntansi, Perhotelan, Tata Boga, Tata Busana, Farmasi, Keperawatan, Teknik Mesin/Elektro/Kendaraan Ringan/Sepeda Motor/Audio Video/Pendingin/Las, Bisnis Digital, Pemasaran, Manajemen Perkantoran, Agribisnis, Perikanan, Nautika, Tata Kecantikan, Usaha Layanan Wisata, Geomatika, Energi Terbarukan
- Add Kuliah jenjang with Fakultas (Teknik, Kedokteran, Ekonomi, Sosial-Humaniora, Seni) + jurusan
- Mapel Umum lengkap: Bhs Indonesia/Inggris/Jepang/Korea/Mandarin, Matematika, Informatika, PKN, Sejarah, PJOK, Seni Budaya, Agama (resolved by `profile.agama`)
- Mapel Kejuruan per jurusan dengan modul realistis (DevOps → Docker/K8s/CI-CD/Git/Monitoring/Deployment/IaC, dst.)
- Remove emoji-as-icon; replace dengan gradient banner config (warna + pattern + ilustrasi SVG/CSS) per mapel
- Setiap mapel: `thumbnail` (gradient + pattern), `banner`, `kategori`, daftar modul, tiap modul punya bab

---

## Phase 3 — Siswa Experience

**Routes baru / refactor:**
- `_authenticated/dashboard.tsx` — animated stats, streak ring, daily challenge card, progress chart (recharts), continue-learning carousel, joined classrooms preview
- `_authenticated/modul.tsx` — tabs Umum / Kejuruan, filter by mapel, modern card grid dengan gradient banner (bukan emoji)
- `_authenticated/modul.$slug.tsx` — list modul + bab dengan progress
- **NEW** `_authenticated/belajar.$mapel.$modul.tsx` — **interactive slide reader**:
  - Fullscreen slide deck (1 bab = beberapa slide)
  - Prev/Next dengan animasi transisi (framer-motion)
  - Progress bar atas
  - Sidebar: outline + bookmark + personal notes
  - Tools floating: highlight, canvas-coret (HTML canvas overlay), bookmark, fullscreen toggle
  - Cover slide dengan ilustrasi + animasi reveal
  - XP reward saat bab complete
- **NEW** `_authenticated/classroom.tsx` — list joined classrooms + tombol Join (code/link) + tombol Create (untuk guru)
- **NEW** `_authenticated/classroom.$id.tsx` — Discord/Slack-like:
  - Sidebar: channels (Umum, Materi, Tugas, Diskusi)
  - Main: posts/chat dengan realtime (supabase channel)
  - Panel kanan: anggota + leaderboard kelas
- **NEW** `_authenticated/classroom.join.tsx` — input code; juga handle `?code=` dari link
- **NEW** `_authenticated/marketplace.tsx` — grid creator classes (filter jenjang/jurusan/mapel/tipe), badge FREE/PREMIUM
- **NEW** `_authenticated/marketplace.$id.tsx` — detail class, preview bab 1–3 free, popup paywall untuk bab 4+
- `_authenticated/subscription.tsx` — paket Premium dengan tombol checkout Midtrans
- Profile/register: tambah field agama; mapel agama otomatis sesuai pilihan

**UI/UX:**
- Glassmorphism cards, gradient backgrounds, floating illustrations
- framer-motion animations (page transitions, hover lift, stagger)
- Skeleton loaders
- Recharts untuk progression
- Responsive sidebar (collapsible)

---

## Phase 4 — Payment (Midtrans Sandbox)

- Server functions:
  - `createMidtransTransaction` — creates Snap token (server-side, uses `MIDTRANS_SERVER_KEY`), stores pending row in `transactions`
  - `getMyTransactions`
- Server route `/api/public/midtrans-webhook` — verifies signature (sha512 of order_id+status_code+gross_amount+server_key), updates transaction + unlocks target (subscription/class)
- Frontend: Snap.js loader, payment modal, status states (pending/success/failed), transaction history page
- **Secrets needed**: `MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY` (client key juga di-store sbg secret, di-expose via server fn ke client saat dibutuhkan — atau pakai VITE var jika user setuju)

---

## Tech Notes
- All progression starts at 0 (no seed XP)
- Realtime classroom: `supabase.channel` on `classroom_messages` filtered by classroom_id
- Demo classroom seeded with public join code (e.g. `SIJA-DEMO-2026`)
- Guru/Creator dashboard: hanya scaffolding routes + placeholder UI dengan note "Coming soon — handled by next developer"

---

## What I need from you before building Phase 4
**Midtrans Sandbox keys** — saya akan minta via secrets tool saat sampai Phase 4. Anda perlu siapkan dari https://dashboard.sandbox.midtrans.com → Settings → Access Keys:
- `MIDTRANS_SERVER_KEY` (SB-Mid-server-...)
- `MIDTRANS_CLIENT_KEY` (SB-Mid-client-...)

---

## Confirm to proceed
Karena scope sangat besar (~30+ file baru, 1 migration besar, realtime, payment), saya akan jalankan **Phase 1 → 2 → 3 → 4 berurutan dalam beberapa turn**. Reply **"lanjut"** untuk mulai Phase 1 (migration + reset). Atau kasih tahu jika ada bagian yang ingin di-skip / di-prioritaskan beda.
