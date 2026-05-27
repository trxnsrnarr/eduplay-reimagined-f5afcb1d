
-- =========================================
-- ENUMS
-- =========================================
CREATE TYPE public.agama_type AS ENUM ('islam','kristen','katolik','hindu','buddha','konghucu');
CREATE TYPE public.classroom_role AS ENUM ('teacher','student');
CREATE TYPE public.class_tier AS ENUM ('free','premium');
CREATE TYPE public.transaction_status AS ENUM ('pending','success','failed','expired','cancelled');
CREATE TYPE public.subscription_status AS ENUM ('inactive','active','expired','cancelled');

-- =========================================
-- PROFILE EXTENSIONS
-- =========================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS agama public.agama_type,
  ADD COLUMN IF NOT EXISTS fakultas text;

-- Add teacher role to app_role if missing
DO $$ BEGIN
  ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'guru';
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- =========================================
-- PROGRESSION
-- =========================================
CREATE TABLE public.progression (
  user_id uuid PRIMARY KEY,
  level int NOT NULL DEFAULT 1,
  xp int NOT NULL DEFAULT 0,
  streak_days int NOT NULL DEFAULT 0,
  rank text NOT NULL DEFAULT 'Pemula',
  last_active_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.progression TO authenticated;
GRANT ALL ON public.progression TO service_role;
ALTER TABLE public.progression ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own progression" ON public.progression FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "read leaderboard" ON public.progression FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert own progression" ON public.progression FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own progression" ON public.progression FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Auto-create progression row + reset existing
INSERT INTO public.progression (user_id) SELECT id FROM public.profiles ON CONFLICT DO NOTHING;
UPDATE public.progression SET level = 1, xp = 0, streak_days = 0, rank = 'Pemula';

-- Extend handle_new_user trigger to create progression + handle agama
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
declare
  v_role public.app_role;
  v_jenjang public.jenjang_level;
  v_jenjang_anak public.jenjang_level;
  v_agama public.agama_type;
begin
  v_role := coalesce((new.raw_user_meta_data ->> 'primary_role')::public.app_role, 'siswa');
  begin v_jenjang := nullif(new.raw_user_meta_data ->> 'jenjang', '')::public.jenjang_level;
  exception when others then v_jenjang := null; end;
  begin v_jenjang_anak := nullif(new.raw_user_meta_data ->> 'jenjang_anak', '')::public.jenjang_level;
  exception when others then v_jenjang_anak := null; end;
  begin v_agama := nullif(new.raw_user_meta_data ->> 'agama', '')::public.agama_type;
  exception when others then v_agama := null; end;

  insert into public.profiles (
    id, display_name, primary_role,
    jenjang, kelas, jurusan, tujuan_belajar,
    bidang, pengalaman, institusi,
    nama_anak, jenjang_anak,
    student_invite_code, agama, fakultas
  ) values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    v_role, v_jenjang,
    nullif(new.raw_user_meta_data ->> 'kelas', ''),
    nullif(new.raw_user_meta_data ->> 'jurusan', ''),
    nullif(new.raw_user_meta_data ->> 'tujuan_belajar', ''),
    nullif(new.raw_user_meta_data ->> 'bidang', ''),
    nullif(new.raw_user_meta_data ->> 'pengalaman', ''),
    nullif(new.raw_user_meta_data ->> 'institusi', ''),
    nullif(new.raw_user_meta_data ->> 'nama_anak', ''),
    v_jenjang_anak,
    case when v_role = 'siswa' then public.generate_student_invite_code() else null end,
    v_agama,
    nullif(new.raw_user_meta_data ->> 'fakultas', '')
  );

  insert into public.user_roles (user_id, role) values (new.id, v_role);
  insert into public.progression (user_id) values (new.id) on conflict do nothing;
  insert into public.subscriptions (user_id, plan, status) values (new.id, 'free', 'inactive') on conflict do nothing;

  return new;
end; $$;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- ACHIEVEMENTS
-- =========================================
CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  xp_reward int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.achievements TO authenticated, anon;
GRANT ALL ON public.achievements TO service_role;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "achievements public read" ON public.achievements FOR SELECT USING (true);

CREATE TABLE public.user_achievements (
  user_id uuid NOT NULL,
  achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, achievement_id)
);
GRANT SELECT, INSERT ON public.user_achievements TO authenticated;
GRANT ALL ON public.user_achievements TO service_role;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own achievements read" ON public.user_achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own achievements insert" ON public.user_achievements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- =========================================
-- MODULE PROGRESS
-- =========================================
CREATE TABLE public.chapter_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  mapel_slug text NOT NULL,
  modul_slug text NOT NULL,
  bab_index int NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  xp_earned int NOT NULL DEFAULT 0,
  UNIQUE (user_id, mapel_slug, modul_slug, bab_index)
);
GRANT SELECT, INSERT ON public.chapter_completions TO authenticated;
GRANT ALL ON public.chapter_completions TO service_role;
ALTER TABLE public.chapter_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own completions read" ON public.chapter_completions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own completions insert" ON public.chapter_completions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  mapel_slug text NOT NULL,
  modul_slug text NOT NULL,
  bab_index int NOT NULL,
  slide_index int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.bookmarks TO authenticated;
GRANT ALL ON public.bookmarks TO service_role;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own bookmarks" ON public.bookmarks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.personal_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  mapel_slug text NOT NULL,
  modul_slug text NOT NULL,
  bab_index int NOT NULL,
  content text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, mapel_slug, modul_slug, bab_index)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.personal_notes TO authenticated;
GRANT ALL ON public.personal_notes TO service_role;
ALTER TABLE public.personal_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own notes" ON public.personal_notes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =========================================
-- CLASSROOMS
-- =========================================
CREATE OR REPLACE FUNCTION public.generate_classroom_code()
RETURNS text LANGUAGE plpgsql SET search_path = public AS $$
declare code text; attempts int := 0;
begin
  loop
    code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
    exit when not exists (select 1 from public.classrooms where classroom_code = code);
    attempts := attempts + 1;
    if attempts > 10 then raise exception 'cannot generate code'; end if;
  end loop;
  return code;
end; $$;

CREATE TABLE public.classrooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  subject text,
  cover_gradient text NOT NULL DEFAULT 'from-violet-500 to-fuchsia-500',
  classroom_code text UNIQUE NOT NULL DEFAULT public.generate_classroom_code(),
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classrooms TO authenticated;
GRANT ALL ON public.classrooms TO service_role;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.classroom_members (
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role public.classroom_role NOT NULL DEFAULT 'student',
  xp_in_class int NOT NULL DEFAULT 0,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (classroom_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classroom_members TO authenticated;
GRANT ALL ON public.classroom_members TO service_role;
ALTER TABLE public.classroom_members ENABLE ROW LEVEL SECURITY;

-- Helper to avoid recursion in RLS
CREATE OR REPLACE FUNCTION public.is_classroom_member(_classroom uuid, _user uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.classroom_members WHERE classroom_id = _classroom AND user_id = _user)
$$;

CREATE OR REPLACE FUNCTION public.is_classroom_owner(_classroom uuid, _user uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.classrooms WHERE id = _classroom AND owner_id = _user)
$$;

CREATE POLICY "classrooms member read" ON public.classrooms FOR SELECT TO authenticated USING (
  owner_id = auth.uid() OR public.is_classroom_member(id, auth.uid()) OR is_demo = true
);
CREATE POLICY "classrooms owner write" ON public.classrooms FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "classrooms owner update" ON public.classrooms FOR UPDATE TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "classrooms owner delete" ON public.classrooms FOR DELETE TO authenticated USING (auth.uid() = owner_id);

CREATE POLICY "members read in own classroom" ON public.classroom_members FOR SELECT TO authenticated USING (
  user_id = auth.uid() OR public.is_classroom_member(classroom_id, auth.uid()) OR public.is_classroom_owner(classroom_id, auth.uid())
);
CREATE POLICY "members self join" ON public.classroom_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "members self leave" ON public.classroom_members FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.is_classroom_owner(classroom_id, auth.uid()));

-- Posts (announcements / materials)
CREATE TABLE public.classroom_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  kind text NOT NULL DEFAULT 'announcement',
  title text NOT NULL,
  body text,
  attachment_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classroom_posts TO authenticated;
GRANT ALL ON public.classroom_posts TO service_role;
ALTER TABLE public.classroom_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts members read" ON public.classroom_posts FOR SELECT TO authenticated USING (
  public.is_classroom_member(classroom_id, auth.uid()) OR public.is_classroom_owner(classroom_id, auth.uid())
);
CREATE POLICY "posts members write" ON public.classroom_posts FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = author_id AND (public.is_classroom_member(classroom_id, auth.uid()) OR public.is_classroom_owner(classroom_id, auth.uid()))
);
CREATE POLICY "posts author update" ON public.classroom_posts FOR UPDATE TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "posts author delete" ON public.classroom_posts FOR DELETE TO authenticated USING (auth.uid() = author_id OR public.is_classroom_owner(classroom_id, auth.uid()));

-- Messages (realtime chat)
CREATE TABLE public.classroom_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  channel text NOT NULL DEFAULT 'umum',
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.classroom_messages TO authenticated;
GRANT ALL ON public.classroom_messages TO service_role;
ALTER TABLE public.classroom_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "msg members read" ON public.classroom_messages FOR SELECT TO authenticated USING (
  public.is_classroom_member(classroom_id, auth.uid()) OR public.is_classroom_owner(classroom_id, auth.uid())
);
CREATE POLICY "msg members write" ON public.classroom_messages FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = author_id AND (public.is_classroom_member(classroom_id, auth.uid()) OR public.is_classroom_owner(classroom_id, auth.uid()))
);
CREATE POLICY "msg author delete" ON public.classroom_messages FOR DELETE TO authenticated USING (auth.uid() = author_id);
ALTER PUBLICATION supabase_realtime ADD TABLE public.classroom_messages;

-- Assignments
CREATE TABLE public.classroom_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  deadline timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classroom_assignments TO authenticated;
GRANT ALL ON public.classroom_assignments TO service_role;
ALTER TABLE public.classroom_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assign members read" ON public.classroom_assignments FOR SELECT TO authenticated USING (
  public.is_classroom_member(classroom_id, auth.uid()) OR public.is_classroom_owner(classroom_id, auth.uid())
);
CREATE POLICY "assign owner write" ON public.classroom_assignments FOR INSERT TO authenticated WITH CHECK (public.is_classroom_owner(classroom_id, auth.uid()));
CREATE POLICY "assign owner update" ON public.classroom_assignments FOR UPDATE TO authenticated USING (public.is_classroom_owner(classroom_id, auth.uid()));
CREATE POLICY "assign owner delete" ON public.classroom_assignments FOR DELETE TO authenticated USING (public.is_classroom_owner(classroom_id, auth.uid()));

-- Join by code
CREATE OR REPLACE FUNCTION public.join_classroom_by_code(_code text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
declare v_class uuid; v_user uuid := auth.uid();
begin
  if v_user is null then raise exception 'Not authenticated'; end if;
  select id into v_class from public.classrooms where classroom_code = upper(trim(_code)) limit 1;
  if v_class is null then raise exception 'Classroom code tidak ditemukan'; end if;
  insert into public.classroom_members (classroom_id, user_id, role) values (v_class, v_user, 'student')
    on conflict do nothing;
  return v_class;
end; $$;

-- =========================================
-- CREATOR MARKETPLACE
-- =========================================
CREATE TABLE public.creator_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  jenjang text,
  jurusan text,
  mapel text,
  cover_gradient text NOT NULL DEFAULT 'from-pink-500 to-violet-500',
  tier public.class_tier NOT NULL DEFAULT 'free',
  price_idr int NOT NULL DEFAULT 0,
  rating numeric(2,1) NOT NULL DEFAULT 4.8,
  students_count int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.creator_classes TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.creator_classes TO authenticated;
GRANT ALL ON public.creator_classes TO service_role;
ALTER TABLE public.creator_classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "classes public read" ON public.creator_classes FOR SELECT USING (is_published = true OR creator_id = auth.uid());
CREATE POLICY "classes creator write" ON public.creator_classes FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "classes creator update" ON public.creator_classes FOR UPDATE TO authenticated USING (auth.uid() = creator_id);
CREATE POLICY "classes creator delete" ON public.creator_classes FOR DELETE TO authenticated USING (auth.uid() = creator_id);

CREATE TABLE public.creator_class_chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.creator_classes(id) ON DELETE CASCADE,
  bab_index int NOT NULL,
  title text NOT NULL,
  duration_min int NOT NULL DEFAULT 15,
  is_free_preview boolean NOT NULL DEFAULT false,
  UNIQUE (class_id, bab_index)
);
GRANT SELECT ON public.creator_class_chapters TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.creator_class_chapters TO authenticated;
GRANT ALL ON public.creator_class_chapters TO service_role;
ALTER TABLE public.creator_class_chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chapters public read" ON public.creator_class_chapters FOR SELECT USING (true);
CREATE POLICY "chapters creator write" ON public.creator_class_chapters FOR INSERT TO authenticated WITH CHECK (
  EXISTS(SELECT 1 FROM public.creator_classes WHERE id = class_id AND creator_id = auth.uid())
);
CREATE POLICY "chapters creator update" ON public.creator_class_chapters FOR UPDATE TO authenticated USING (
  EXISTS(SELECT 1 FROM public.creator_classes WHERE id = class_id AND creator_id = auth.uid())
);
CREATE POLICY "chapters creator delete" ON public.creator_class_chapters FOR DELETE TO authenticated USING (
  EXISTS(SELECT 1 FROM public.creator_classes WHERE id = class_id AND creator_id = auth.uid())
);

CREATE TABLE public.creator_class_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  class_id uuid NOT NULL REFERENCES public.creator_classes(id) ON DELETE CASCADE,
  purchased_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, class_id)
);
GRANT SELECT ON public.creator_class_purchases TO authenticated;
GRANT ALL ON public.creator_class_purchases TO service_role;
ALTER TABLE public.creator_class_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "purchases own read" ON public.creator_class_purchases FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- =========================================
-- PAYMENTS
-- =========================================
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  order_id text UNIQUE NOT NULL,
  status public.transaction_status NOT NULL DEFAULT 'pending',
  gross_amount int NOT NULL,
  payment_type text,
  snap_token text,
  snap_redirect_url text,
  target_kind text NOT NULL,
  target_id text,
  raw_response jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tx own read" ON public.transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.subscriptions (
  user_id uuid PRIMARY KEY,
  plan text NOT NULL DEFAULT 'free',
  status public.subscription_status NOT NULL DEFAULT 'inactive',
  current_period_end timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sub own read" ON public.subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Backfill subscriptions for existing users
INSERT INTO public.subscriptions (user_id, plan, status)
  SELECT id, 'free', 'inactive' FROM public.profiles ON CONFLICT DO NOTHING;

-- =========================================
-- SEED ACHIEVEMENTS
-- =========================================
INSERT INTO public.achievements (code, title, description, icon, xp_reward) VALUES
  ('first_chapter', 'Langkah Pertama', 'Selesaikan bab pertamamu', 'sparkles', 50),
  ('streak_7', 'Konsisten Seminggu', 'Belajar 7 hari berturut-turut', 'flame', 200),
  ('level_5', 'Bintang Naik Daun', 'Mencapai level 5', 'star', 100),
  ('classroom_join', 'Bagian dari Komunitas', 'Bergabung ke classroom pertamamu', 'users', 75),
  ('marketplace_first', 'Pelajar Mandiri', 'Buka kelas creator pertamamu', 'shopping-bag', 75)
ON CONFLICT (code) DO NOTHING;

-- =========================================
-- SEED DEMO CLASSROOM + CREATOR CLASSES (no owner, NULL safe demo)
-- =========================================
-- Pre-create a deterministic demo classroom owned by a sentinel "demo creator" user_id (uuid zero).
-- Since we need an owner_id (uuid NOT NULL), use the first existing user if any, else skip.
DO $$
DECLARE
  v_owner uuid;
  v_demo_id uuid;
BEGIN
  SELECT id INTO v_owner FROM public.profiles LIMIT 1;
  IF v_owner IS NULL THEN
    -- create placeholder owner row will not be possible without auth user; insert demo with null-skip
    RETURN;
  END IF;

  INSERT INTO public.classrooms (owner_id, name, description, subject, cover_gradient, classroom_code, is_demo)
  VALUES (v_owner, 'SIJA Cloud Computing Fundamental', 'Kelas demo: fundamental cloud computing untuk siswa SIJA. Eksplorasi materi, chat, tugas, dan leaderboard.', 'Cloud Computing', 'from-sky-500 to-indigo-600', 'SIJADEMO', true)
  ON CONFLICT (classroom_code) DO NOTHING
  RETURNING id INTO v_demo_id;

  IF v_demo_id IS NULL THEN
    SELECT id INTO v_demo_id FROM public.classrooms WHERE classroom_code = 'SIJADEMO';
  END IF;

  INSERT INTO public.classroom_posts (classroom_id, author_id, kind, title, body) VALUES
    (v_demo_id, v_owner, 'announcement', 'Selamat datang di SIJA Cloud Fundamental!', 'Halo semua, mari kita mulai perjalanan belajar cloud computing. Cek tab Materi untuk modul minggu ini.'),
    (v_demo_id, v_owner, 'material', 'Materi 1 — Pengenalan Cloud Computing', 'Pelajari IaaS, PaaS, SaaS. Baca slide dan kerjakan quiz di akhir.'),
    (v_demo_id, v_owner, 'announcement', 'Tugas Minggu Pertama', 'Buat akun GCP/AWS Free Tier dan screenshot dashboard.')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.classroom_messages (classroom_id, author_id, channel, content) VALUES
    (v_demo_id, v_owner, 'umum', 'Selamat datang teman-teman! 👋'),
    (v_demo_id, v_owner, 'umum', 'Jangan lupa join Discord komunitas ya.')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.classroom_assignments (classroom_id, author_id, title, description, deadline) VALUES
    (v_demo_id, v_owner, 'Lab 1: Deploy First VM', 'Deploy Ubuntu VM di cloud provider pilihanmu, lalu kirim screenshot.', now() + interval '7 days')
  ON CONFLICT DO NOTHING;

  -- Seed creator classes
  INSERT INTO public.creator_classes (creator_id, title, description, jenjang, jurusan, mapel, cover_gradient, tier, price_idr) VALUES
    (v_owner, 'Mastering Docker & Kubernetes', 'Dari container basics sampai production-grade orchestration.', 'smk', 'SIJA', 'DevOps', 'from-cyan-500 to-blue-600', 'premium', 149000),
    (v_owner, 'React 19 untuk Pemula', 'Bangun web modern dengan React 19, hooks, dan TanStack.', 'sma', 'IPA', 'Informatika', 'from-violet-500 to-fuchsia-500', 'premium', 99000),
    (v_owner, 'Persiapan UTBK SAINTEK', 'Drill soal TPS + Saintek lengkap dengan pembahasan.', 'utbk', NULL, 'Matematika', 'from-rose-500 to-orange-500', 'premium', 249000),
    (v_owner, 'Bahasa Inggris Conversation', 'Latihan speaking dengan native-style dialogue.', 'sma', NULL, 'Bahasa Inggris', 'from-emerald-500 to-teal-600', 'free', 0),
    (v_owner, 'Intro to Cyber Security', 'OWASP Top 10, network basics, hands-on CTF.', 'smk', 'SIJA', 'Cyber Security', 'from-slate-700 to-zinc-900', 'premium', 179000),
    (v_owner, 'Matematika SD: Pecahan Seru', 'Belajar pecahan dengan visual & gamifikasi.', 'sd', NULL, 'Matematika', 'from-yellow-400 to-orange-500', 'free', 0)
  ON CONFLICT DO NOTHING;

  -- Chapters for the first premium class
  INSERT INTO public.creator_class_chapters (class_id, bab_index, title, duration_min, is_free_preview)
  SELECT id, idx, t, 20, idx <= 3
  FROM public.creator_classes c,
       LATERAL (VALUES (1,'Pengenalan Container'),(2,'Dockerfile & Image'),(3,'Docker Compose'),(4,'Kubernetes Architecture'),(5,'Pods & Deployments'),(6,'Services & Ingress'),(7,'Helm & GitOps'),(8,'Production Best Practices')) AS v(idx,t)
  WHERE c.title = 'Mastering Docker & Kubernetes'
  ON CONFLICT DO NOTHING;
END $$;
