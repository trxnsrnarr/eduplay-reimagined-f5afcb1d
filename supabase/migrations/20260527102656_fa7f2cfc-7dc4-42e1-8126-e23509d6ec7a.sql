-- Enums
create type public.app_role as enum ('siswa', 'creator', 'parent');
create type public.jenjang_level as enum ('sd', 'smp', 'sma', 'smk', 'utbk');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  primary_role public.app_role not null default 'siswa',
  jenjang public.jenjang_level,
  kelas text,
  jurusan text,
  tujuan_belajar text,
  bidang text,
  pengalaman text,
  institusi text,
  nama_anak text,
  jenjang_anak public.jenjang_level,
  student_invite_code text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

-- User Roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Parent-Child Links
create table public.parent_child_links (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (parent_id, child_id)
);

grant select, insert, delete on public.parent_child_links to authenticated;
grant all on public.parent_child_links to service_role;

alter table public.parent_child_links enable row level security;

create or replace function public.generate_student_invite_code()
returns text
language plpgsql
as $$
declare
  code text;
  attempts int := 0;
begin
  loop
    code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    exit when not exists (select 1 from public.profiles where student_invite_code = code);
    attempts := attempts + 1;
    if attempts > 8 then
      raise exception 'Could not generate unique invite code';
    end if;
  end loop;
  return code;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role public.app_role;
  v_jenjang public.jenjang_level;
  v_jenjang_anak public.jenjang_level;
begin
  v_role := coalesce((new.raw_user_meta_data ->> 'primary_role')::public.app_role, 'siswa');

  begin
    v_jenjang := nullif(new.raw_user_meta_data ->> 'jenjang', '')::public.jenjang_level;
  exception when others then v_jenjang := null;
  end;

  begin
    v_jenjang_anak := nullif(new.raw_user_meta_data ->> 'jenjang_anak', '')::public.jenjang_level;
  exception when others then v_jenjang_anak := null;
  end;

  insert into public.profiles (
    id, display_name, primary_role,
    jenjang, kelas, jurusan, tujuan_belajar,
    bidang, pengalaman, institusi,
    nama_anak, jenjang_anak,
    student_invite_code
  ) values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    v_role,
    v_jenjang,
    nullif(new.raw_user_meta_data ->> 'kelas', ''),
    nullif(new.raw_user_meta_data ->> 'jurusan', ''),
    nullif(new.raw_user_meta_data ->> 'tujuan_belajar', ''),
    nullif(new.raw_user_meta_data ->> 'bidang', ''),
    nullif(new.raw_user_meta_data ->> 'pengalaman', ''),
    nullif(new.raw_user_meta_data ->> 'institusi', ''),
    nullif(new.raw_user_meta_data ->> 'nama_anak', ''),
    v_jenjang_anak,
    case when v_role = 'siswa' then public.generate_student_invite_code() else null end
  );

  insert into public.user_roles (user_id, role) values (new.id, v_role);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- RLS Policies
create policy "Users view own profile"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id);

create policy "Users insert own profile"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

create policy "Parents view linked child profile"
  on public.profiles for select to authenticated
  using (
    exists (
      select 1 from public.parent_child_links l
      where l.child_id = profiles.id and l.parent_id = auth.uid()
    )
  );

create policy "Users view own roles"
  on public.user_roles for select to authenticated
  using (auth.uid() = user_id);

create policy "Parent reads own links"
  on public.parent_child_links for select to authenticated
  using (auth.uid() = parent_id);

create policy "Child reads links to self"
  on public.parent_child_links for select to authenticated
  using (auth.uid() = child_id);

create policy "Parent inserts own links"
  on public.parent_child_links for insert to authenticated
  with check (auth.uid() = parent_id and public.has_role(auth.uid(), 'parent'));

create policy "Parent removes own links"
  on public.parent_child_links for delete to authenticated
  using (auth.uid() = parent_id);

alter function public.generate_student_invite_code() set search_path = public;
alter function public.set_updated_at() set search_path = public;

revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
revoke execute on function public.generate_student_invite_code() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;

create or replace function public.link_child_by_code(_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_child uuid;
  v_parent uuid := auth.uid();
begin
  if v_parent is null then
    raise exception 'Not authenticated';
  end if;

  if not public.has_role(v_parent, 'parent') then
    raise exception 'Hanya akun orang tua yang dapat menautkan anak';
  end if;

  select id into v_child from public.profiles
  where student_invite_code = upper(trim(_code))
    and primary_role = 'siswa'
  limit 1;

  if v_child is null then
    raise exception 'Kode siswa tidak ditemukan';
  end if;

  insert into public.parent_child_links (parent_id, child_id)
  values (v_parent, v_child)
  on conflict do nothing;

  return v_child;
end;
$$;

revoke all on function public.link_child_by_code(text) from public, anon;
grant execute on function public.link_child_by_code(text) to authenticated;

create unique index if not exists parent_child_links_unique
  on public.parent_child_links (parent_id, child_id);