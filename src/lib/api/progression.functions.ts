import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const RANK_BY_LEVEL = (level: number) => {
  if (level >= 30) return "Legend";
  if (level >= 20) return "Master";
  if (level >= 12) return "Ahli";
  if (level >= 6) return "Mahir";
  if (level >= 3) return "Pelajar";
  return "Pemula";
};

const xpForLevel = (level: number) => 100 * level;

export const getMyProgression = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: prog } = await supabase
      .from("progression").select("*").eq("user_id", userId).maybeSingle();
    const { data: completions } = await supabase
      .from("chapter_completions")
      .select("mapel_slug, modul_slug, bab_index, xp_earned, completed_at")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })
      .limit(60);

    // Weekly XP buckets (last 7 days)
    const days: { day: string; xp: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i); d.setHours(0,0,0,0);
      const next = new Date(d); next.setDate(d.getDate() + 1);
      const xp = (completions ?? []).filter((c) => {
        const t = new Date(c.completed_at).getTime();
        return t >= d.getTime() && t < next.getTime();
      }).reduce((s, c) => s + (c.xp_earned ?? 0), 0);
      days.push({ day: ["Min","Sen","Sel","Rab","Kam","Jum","Sab"][d.getDay()], xp });
    }

    // Leaderboard top 5 from progression
    const { data: top } = await supabase
      .from("progression").select("user_id, xp, level, rank").order("xp", { ascending: false }).limit(5);
    let leaders: { user_id: string; xp: number; level: number; rank: string; name: string }[] = [];
    if (top && top.length) {
      const ids = top.map((t) => t.user_id);
      const { data: profs } = await supabase.from("profiles").select("id, display_name").in("id", ids);
      const nameMap = new Map((profs ?? []).map((p) => [p.id, p.display_name ?? "Anon"]));
      leaders = top.map((t) => ({ ...t, name: nameMap.get(t.user_id) ?? "Anon" }));
    }

    return {
      progression: prog ?? { xp: 0, level: 1, rank: "Pemula", streak_days: 0 },
      completions: completions ?? [],
      weekly: days,
      leaders,
      nextLevelXp: xpForLevel(prog?.level ?? 1),
    };
  });

export const completeChapter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      mapel_slug: z.string().min(1).max(80),
      modul_slug: z.string().min(1).max(80),
      bab_index: z.number().int().min(0).max(200),
      xp: z.number().int().min(1).max(500),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    // Idempotent: only insert if not exists
    const { data: existing } = await supabase
      .from("chapter_completions")
      .select("id")
      .eq("user_id", userId)
      .eq("mapel_slug", data.mapel_slug)
      .eq("modul_slug", data.modul_slug)
      .eq("bab_index", data.bab_index)
      .maybeSingle();
    if (existing) return { alreadyCompleted: true, xpEarned: 0 };

    await supabase.from("chapter_completions").insert({
      user_id: userId,
      mapel_slug: data.mapel_slug,
      modul_slug: data.modul_slug,
      bab_index: data.bab_index,
      xp_earned: data.xp,
    });

    const { data: prog } = await supabase
      .from("progression").select("*").eq("user_id", userId).maybeSingle();
    const prev = prog ?? { xp: 0, level: 1, streak_days: 0, last_active_at: null as string | null };
    const newXp = (prev.xp ?? 0) + data.xp;
    let level = prev.level ?? 1;
    while (newXp >= xpForLevel(level)) level += 1;

    // Streak
    const today = new Date(); today.setHours(0,0,0,0);
    const last = prev.last_active_at ? new Date(prev.last_active_at) : null;
    let streak = prev.streak_days ?? 0;
    if (!last) streak = 1;
    else {
      const lastDay = new Date(last); lastDay.setHours(0,0,0,0);
      const diff = Math.round((today.getTime() - lastDay.getTime()) / 86400000);
      if (diff === 0) streak = streak || 1;
      else if (diff === 1) streak = streak + 1;
      else streak = 1;
    }

    await supabase.from("progression").upsert({
      user_id: userId,
      xp: newXp,
      level,
      rank: RANK_BY_LEVEL(level),
      streak_days: streak,
      last_active_at: new Date().toISOString(),
    });

    return { alreadyCompleted: false, xpEarned: data.xp, newXp, level, streak };
  });
