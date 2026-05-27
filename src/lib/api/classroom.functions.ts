import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listMyClassrooms = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: memberships } = await supabase
      .from("classroom_members")
      .select("classroom_id, role, joined_at, classrooms(id, name, description, subject, cover_gradient, classroom_code, owner_id, is_demo)")
      .eq("user_id", userId);
    const { data: owned } = await supabase
      .from("classrooms")
      .select("id, name, description, subject, cover_gradient, classroom_code, owner_id, is_demo")
      .eq("owner_id", userId);
    return { memberships: memberships ?? [], owned: owned ?? [] };
  });

export const listPublicDemos = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data } = await supabase
      .from("classrooms")
      .select("id, name, description, subject, cover_gradient, classroom_code, is_demo")
      .eq("is_demo", true);
    return data ?? [];
  });

export const joinClassroomByCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ code: z.string().min(3).max(32) }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: classId, error } = await supabase.rpc("join_classroom_by_code", { _code: data.code });
    if (error) throw new Error(error.message);
    return { classroomId: classId as string };
  });

export const createClassroom = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      name: z.string().min(3).max(120),
      description: z.string().max(500).optional(),
      subject: z.string().max(80).optional(),
      cover_gradient: z.string().max(120).optional(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    // Role gate — siswa tidak boleh membuat classroom.
    const { data: prof } = await supabase.from("profiles").select("primary_role").eq("id", userId).maybeSingle();
    if (!prof || prof.primary_role === "siswa") {
      throw new Error("Hanya guru / Edu Creator yang dapat membuat classroom. Akun siswa hanya dapat bergabung dengan kode kelas.");
    }
    const { data: row, error } = await supabase
      .from("classrooms")
      .insert({
        owner_id: userId,
        name: data.name,
        description: data.description ?? null,
        subject: data.subject ?? null,
        cover_gradient: data.cover_gradient ?? "from-violet-500 to-fuchsia-500",
      })
      .select("id, classroom_code")
      .single();
    if (error) throw new Error(error.message);
    await supabase.from("classroom_members").insert({ classroom_id: row.id, user_id: userId, role: "teacher" });
    return row;
  });

export const getClassroomDetail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const [{ data: classroom }, { data: posts }, { data: members }, { data: assignments }, { data: messages }] =
      await Promise.all([
        supabase.from("classrooms").select("*").eq("id", data.id).maybeSingle(),
        supabase.from("classroom_posts").select("*").eq("classroom_id", data.id).order("created_at", { ascending: false }).limit(50),
        supabase.from("classroom_members").select("user_id, role, xp_in_class, joined_at").eq("classroom_id", data.id).limit(100),
        supabase.from("classroom_assignments").select("*").eq("classroom_id", data.id).order("created_at", { ascending: false }).limit(20),
        supabase.from("classroom_messages").select("*").eq("classroom_id", data.id).order("created_at", { ascending: true }).limit(100),
      ]);
    if (!classroom) throw new Error("Classroom tidak ditemukan");
    const memberIds = (members ?? []).map((m) => m.user_id);
    const { data: profiles } = memberIds.length
      ? await supabase.from("profiles").select("id, display_name").in("id", memberIds)
      : { data: [] };
    return {
      classroom,
      posts: posts ?? [],
      members: members ?? [],
      assignments: assignments ?? [],
      messages: messages ?? [],
      profiles: profiles ?? [],
      currentUserId: userId,
      isOwner: classroom.owner_id === userId,
    };
  });

export const sendClassroomMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      classroom_id: z.string().uuid(),
      channel: z.string().min(1).max(40).default("umum"),
      content: z.string().min(1).max(2000),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("classroom_messages").insert({
      classroom_id: data.classroom_id,
      author_id: userId,
      channel: data.channel,
      content: data.content,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const createClassroomPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      classroom_id: z.string().uuid(),
      kind: z.enum(["announcement", "material", "discussion"]).default("announcement"),
      title: z.string().min(3).max(180),
      body: z.string().max(4000).optional(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("classroom_posts").insert({
      classroom_id: data.classroom_id,
      author_id: userId,
      kind: data.kind,
      title: data.title,
      body: data.body ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
