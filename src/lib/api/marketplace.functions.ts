import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listCreatorClasses = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      tier: z.enum(["all", "free", "premium"]).default("all"),
      jenjang: z.string().optional(),
      search: z.string().optional(),
    }).parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    let q = supabase
      .from("creator_classes")
      .select("id, title, description, jenjang, jurusan, mapel, cover_gradient, tier, price_idr, rating, students_count, creator_id")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (data.tier !== "all") q = q.eq("tier", data.tier);
    if (data.jenjang) q = q.eq("jenjang", data.jenjang);
    if (data.search) q = q.ilike("title", `%${data.search}%`);
    const [{ data: classes }, { data: purchases }] = await Promise.all([
      q,
      supabase.from("creator_class_purchases").select("class_id").eq("user_id", userId),
    ]);
    const owned = new Set((purchases ?? []).map((p) => p.class_id));
    return (classes ?? []).map((c) => ({ ...c, isOwned: owned.has(c.id) }));
  });

export const getCreatorClassDetail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const [{ data: klass }, { data: chapters }, { data: purchase }] = await Promise.all([
      supabase.from("creator_classes").select("*").eq("id", data.id).maybeSingle(),
      supabase.from("creator_class_chapters").select("*").eq("class_id", data.id).order("bab_index"),
      supabase.from("creator_class_purchases").select("id").eq("user_id", userId).eq("class_id", data.id).maybeSingle(),
    ]);
    if (!klass) throw new Error("Class tidak ditemukan");
    let creatorName: string | null = null;
    if (klass.creator_id) {
      const { data: p } = await supabase.from("profiles").select("display_name").eq("id", klass.creator_id).maybeSingle();
      creatorName = p?.display_name ?? null;
    }
    return { klass, chapters: chapters ?? [], isOwned: !!purchase || klass.tier === "free", creatorName };
  });
