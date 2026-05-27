import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Midtrans signature: SHA512(order_id + status_code + gross_amount + server_key)
export const Route = createFileRoute("/api/midtrans-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const serverKey = process.env.MIDTRANS_SERVER_KEY;
        if (!serverKey) return new Response("Server key missing", { status: 500 });
        const payload = (await request.json()) as Record<string, string>;
        const { order_id, status_code, gross_amount, signature_key, transaction_status, payment_type } = payload;
        if (!order_id || !status_code || !gross_amount || !signature_key) {
          return new Response("Invalid", { status: 400 });
        }
        const expected = createHash("sha512")
          .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
          .digest("hex");
        if (expected !== signature_key) return new Response("Invalid signature", { status: 401 });

        const status =
          transaction_status === "settlement" || transaction_status === "capture"
            ? "success"
            : transaction_status === "pending"
            ? "pending"
            : transaction_status === "deny" || transaction_status === "cancel" || transaction_status === "failure"
            ? "failed"
            : transaction_status === "expire"
            ? "expired"
            : "pending";

        const { data: tx } = await supabaseAdmin
          .from("transactions")
          .update({ status, payment_type: payment_type ?? null, raw_response: payload as never, updated_at: new Date().toISOString() })
          .eq("order_id", order_id)
          .select("user_id, target_kind, target_id")
          .maybeSingle();

        if (status === "success" && tx) {
          if (tx.target_kind === "subscription") {
            const periodEnd = new Date();
            periodEnd.setMonth(periodEnd.getMonth() + 1);
            await supabaseAdmin
              .from("subscriptions")
              .upsert({
                user_id: tx.user_id,
                plan: "premium",
                status: "active",
                current_period_end: periodEnd.toISOString(),
                updated_at: new Date().toISOString(),
              });
          } else if (tx.target_kind === "creator_class" && tx.target_id) {
            await supabaseAdmin
              .from("creator_class_purchases")
              .upsert({ user_id: tx.user_id, class_id: tx.target_id });
          }
        }

        return new Response("ok");
      },
    },
  },
});
