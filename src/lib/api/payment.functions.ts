import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const MIDTRANS_BASE = "https://app.sandbox.midtrans.com/snap/v1/transactions";

export const getMidtransClientKey = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    return { clientKey: process.env.MIDTRANS_CLIENT_KEY ?? "" };
  });

export const listMyTransactions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("transactions")
      .select("id, order_id, status, gross_amount, payment_type, target_kind, target_id, created_at, updated_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    return data ?? [];
  });

export const getMySubscription = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("subscriptions")
      .select("plan, status, current_period_end")
      .eq("user_id", userId)
      .maybeSingle();
    const isPremium = data?.status === "active" && (!data.current_period_end || new Date(data.current_period_end) > new Date());
    return {
      plan: data?.plan ?? "free",
      status: data?.status ?? "inactive",
      currentPeriodEnd: data?.current_period_end ?? null,
      isPremium,
    };
  });

export const createMidtransTransaction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      target_kind: z.enum(["subscription", "creator_class"]),
      target_id: z.string().min(1).max(120),
      title: z.string().min(1).max(160),
      amount: z.number().int().min(1000).max(50_000_000),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      throw new Error("MIDTRANS_SERVER_KEY belum di-set. Tambahkan di Project Settings → Secrets.");
    }
    const { supabase, userId } = context;
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", userId)
      .maybeSingle();

    const orderId = `EDU-${Date.now()}-${userId.slice(0, 8)}`;
    const body = {
      transaction_details: { order_id: orderId, gross_amount: data.amount },
      item_details: [{ id: data.target_id, price: data.amount, quantity: 1, name: data.title.slice(0, 50) }],
      customer_details: { first_name: profile?.display_name ?? "Eduverse User" },
      credit_card: { secure: true },
    };

    const auth = "Basic " + Buffer.from(`${serverKey}:`).toString("base64");
    const res = await fetch(MIDTRANS_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: auth },
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as { token?: string; redirect_url?: string; error_messages?: string[] };
    if (!res.ok || !json.token) {
      throw new Error(json.error_messages?.join(", ") ?? "Gagal membuat transaksi Midtrans");
    }

    await supabase.from("transactions").insert({
      user_id: userId,
      order_id: orderId,
      status: "pending",
      gross_amount: data.amount,
      snap_token: json.token,
      snap_redirect_url: json.redirect_url ?? null,
      target_kind: data.target_kind,
      target_id: data.target_id,
      raw_response: json as never,
    });

    return { orderId, snapToken: json.token, redirectUrl: json.redirect_url };
  });
