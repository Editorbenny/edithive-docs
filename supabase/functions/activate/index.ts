// POST /functions/v1/activate
// Bind a license to this machine and return a device-bound, server-signed Ed25519 token.
// Replaces the offline beta_keys.py path. Fails CLOSED (deny on any doubt).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { signToken, json, normalizeKey } from "../_shared/sign.ts";

const GRACE_DAYS = 30;

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ ok: false, reason: "method" }, 405);
  let body: { license_key?: string; key?: string; machine_fp?: string; machine_label?: string };
  try { body = await req.json(); } catch { return json({ ok: false, reason: "bad_request" }, 400); }

  // Accept both `license_key` (new client) and `key` (legacy beta_online.py) for compat.
  const key = normalizeKey((body.license_key ?? body.key) ?? "");
  const fp = (body.machine_fp ?? "").trim();
  const label = (body.machine_label ?? "").slice(0, 120);
  if (!key || !fp) return json({ ok: false, reason: "bad_request" }, 400);

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";

  const { data: lic } = await sb.from("licenses").select("*").eq("license_key", key).maybeSingle();
  const logDeny = (reason: string, license_id: string | null = null) =>
    sb.from("license_events").insert({ license_id, event: "activate_denied", machine_fp: fp, ip, actor: "app", meta: { reason } });

  if (!lic) { await logDeny("unknown_key"); return json({ ok: false, reason: "unknown_key" }); }
  if (lic.status !== "active") { await logDeny(lic.status, lic.id); return json({ ok: false, reason: lic.status }); }

  if (lic.expires_at && new Date(lic.expires_at).getTime() < Date.now()) {
    await sb.from("licenses").update({ status: "expired" }).eq("id", lic.id);
    await logDeny("expired", lic.id);
    return json({ ok: false, reason: "expired" });
  }

  // Seat check — only matters for a NEW machine.
  const { data: existing } = await sb.from("devices")
    .select("id,activated_at").eq("license_id", lic.id).eq("machine_fp", fp).maybeSingle();
  if (!existing) {
    const { count } = await sb.from("devices")
      .select("*", { count: "exact", head: true })
      .eq("license_id", lic.id).eq("status", "active");
    if ((count ?? 0) >= lic.seats) {
      await sb.from("license_events").insert({ license_id: lic.id, event: "seat_exceeded", machine_fp: fp, ip, actor: "app", meta: { seats: lic.seats, used: count } });
      return json({ ok: false, reason: "seat_limit", seats: lic.seats, used: count });
    }
  }

  const expSec = lic.expires_at ? Math.floor(new Date(lic.expires_at).getTime() / 1000) : null;
  const token = await signToken({
    schema: 1, edition: lic.edition, lid: lic.license_key,
    name: lic.name ?? "", email: lic.email ?? "",
    expires_at: expSec, machine: fp, seats: lic.seats,
  });

  const now = new Date().toISOString();
  const { data: dev } = await sb.from("devices").upsert({
    license_id: lic.id, machine_fp: fp, machine_label: label, token,
    status: "active", last_seen: now, last_ip: ip,
    activated_at: existing?.activated_at ?? now,
  }, { onConflict: "license_id,machine_fp" }).select("id").maybeSingle();

  await sb.from("license_events").insert({
    license_id: lic.id, device_id: dev?.id ?? null,
    event: existing ? "reactivate" : "activate", machine_fp: fp, ip, actor: "app",
  });

  return json({ ok: true, token, edition: lic.edition, expires_at: expSec, grace_days: GRACE_DAYS });
});
