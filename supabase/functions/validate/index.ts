// POST /functions/v1/validate
// Periodic re-check (app calls on launch + every 7 days). Tells a revoked/refunded/
// expired license to downgrade. Never 5xx on expected states. The app keeps working
// offline within its 30-day grace if this is unreachable (handled client-side).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { json, normalizeKey } from "../_shared/sign.ts";

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ ok: false, reason: "method" }, 405);
  let body: { license_key?: string; key?: string; machine_fp?: string };
  try { body = await req.json(); } catch { return json({ ok: false, reason: "bad_request" }, 400); }

  // Accept both `license_key` (new client) and `key` (legacy beta_online.py) for compat.
  const key = normalizeKey((body.license_key ?? body.key) ?? "");
  const fp = (body.machine_fp ?? "").trim();
  if (!key || !fp) return json({ ok: false, reason: "bad_request" }, 400);

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";

  const { data: lic } = await sb.from("licenses").select("id,status,expires_at,seats").eq("license_key", key).maybeSingle();
  if (!lic) return json({ ok: true, status: "unknown_key" });            // app downgrades

  const { data: dev } = await sb.from("devices")
    .select("id,status").eq("license_id", lic.id).eq("machine_fp", fp).maybeSingle();
  if (!dev || dev.status !== "active") return json({ ok: false, reason: "unknown_device" });

  let status = lic.status;
  if (status === "active" && lic.expires_at && new Date(lic.expires_at).getTime() < Date.now()) {
    status = "expired";
    await sb.from("licenses").update({ status: "expired" }).eq("id", lic.id);
  }

  // Leak / over-seat signal.
  const { count } = await sb.from("devices").select("*", { count: "exact", head: true })
    .eq("license_id", lic.id).eq("status", "active");
  if ((count ?? 0) > lic.seats) {
    await sb.from("license_events").insert({ license_id: lic.id, event: "leak_flag", machine_fp: fp, ip, actor: "system", meta: { active: count, seats: lic.seats } });
  }

  await sb.from("devices").update({ last_seen: new Date().toISOString(), last_ip: ip }).eq("id", dev.id);

  // Flush client-buffered telemetry (grace enter/exit, expiry — may have
  // happened offline) into the audit log.
  const clientEvents = Array.isArray((body as { events?: unknown }).events)
    ? (body as { events: Array<{ event?: string; meta?: unknown }> }).events.slice(0, 50) : [];
  if (clientEvents.length) {
    await sb.from("license_events").insert(clientEvents.map((e) => ({
      license_id: lic.id, device_id: dev.id,
      event: String(e?.event || "client_event").slice(0, 40),
      machine_fp: fp, ip, actor: "app",
      meta: (e && typeof e.meta === "object") ? e.meta as Record<string, unknown> : {},
    })));
  }

  await sb.from("license_events").insert({ license_id: lic.id, device_id: dev.id, event: "validate", machine_fp: fp, ip, actor: "app", meta: { status } });

  return json({ ok: true, status });   // active | revoked | refunded | suspended | expired
});
