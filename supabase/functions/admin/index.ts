// POST /functions/v1/admin   (authenticated admin only)
// One endpoint, action-dispatched. AuthN = Supabase Auth JWT (verify_jwt, supports MFA);
// AuthZ = caller email in public.app_admins table OR in the ADMIN_EMAILS secret.
// Every action is written to license_events with actor = admin email.
//
// NOTE: when deployed via the Supabase MCP/CLI, sign.ts is co-located next to
// index.ts, so the live function imports "./sign.ts". This repo keeps the shared
// helper under ../_shared/sign.ts for organisation — keep the two in sync.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { json, normalizeKey } from "../_shared/sign.ts";

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
function genKey(prefix = "EDIT"): string {
  const r = crypto.getRandomValues(new Uint8Array(12));
  let s = "";
  for (const b of r) s += CROCKFORD[b & 31];
  return `${prefix}-${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8, 12)}`;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ ok: false, reason: "method" }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  const sb = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  // ── AuthN: verify the caller's Supabase Auth token ──
  const jwt = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const userClient = createClient(url, anon, { global: { headers: { Authorization: `Bearer ${jwt}` } } });
  const { data: u } = await userClient.auth.getUser();
  const email = (u?.user?.email ?? "").toLowerCase();

  // ── AuthZ: app_admins table OR the ADMIN_EMAILS secret ──
  const allow = (Deno.env.get("ADMIN_EMAILS") ?? "").toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);
  let isAdmin = !!email && allow.includes(email);
  if (email && !isAdmin) {
    const { data: a } = await sb.from("app_admins").select("email").eq("email", email).maybeSingle();
    isAdmin = !!a;
  }
  if (!isAdmin) return json({ ok: false, reason: "forbidden" }, 403);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ ok: false, reason: "bad_request" }, 400); }
  const action = String(body.action ?? "");
  const log = (license_id: string | null, event: string, meta: unknown = {}) =>
    sb.from("license_events").insert({ license_id, event: "admin_action", actor: email, meta: { action: event, ...(meta as object) } });

  switch (action) {
    case "whoami":
      return json({ ok: true, email });
    case "issue": {
      const key = genKey(String(body.edition ?? "pro").toUpperCase().startsWith("BETA") ? "BETA" : "EDIT");
      const row = { license_key: normalizeKey(key), edition: String(body.edition ?? "pro"), email: String(body.email ?? ""), name: String(body.name ?? ""), seats: Number(body.seats ?? 1), expires_at: body.expires_at ?? null, order_ref: String(body.order_ref ?? ""), source: String(body.source ?? "manual"), notes: String(body.notes ?? "") };
      const { data, error } = await sb.from("licenses").insert(row).select("id,license_key").single();
      if (error) return json({ ok: false, reason: error.message });
      await log(data.id, "issue", { edition: row.edition });
      return json({ ok: true, license_id: data.id, license_key: key });
    }
    case "revoke":
    case "refund": {
      const status = action === "refund" ? "refunded" : "revoked";
      const key = normalizeKey(String(body.license_key ?? ""));
      const { data, error } = await sb.from("licenses").update({ status, revoked_at: new Date().toISOString(), revoked_reason: String(body.reason ?? action) }).eq("license_key", key).select("id").maybeSingle();
      if (error || !data) return json({ ok: false, reason: error?.message ?? "unknown_key" });
      await log(data.id, action, { reason: body.reason });
      return json({ ok: true });
    }
    case "restore": {
      const key = normalizeKey(String(body.license_key ?? ""));
      const { data, error } = await sb.from("licenses").update({ status: "active", revoked_at: null, revoked_reason: "" }).eq("license_key", key).select("id").maybeSingle();
      if (error || !data) return json({ ok: false, reason: error?.message ?? "unknown_key" });
      await log(data.id, "restore", {});
      return json({ ok: true });
    }
    case "set_seats": {
      const key = normalizeKey(String(body.license_key ?? ""));
      const { data, error } = await sb.from("licenses").update({ seats: Number(body.seats ?? 1) }).eq("license_key", key).select("id").maybeSingle();
      if (error || !data) return json({ ok: false, reason: error?.message ?? "unknown_key" });
      await log(data.id, "set_seats", { seats: body.seats });
      return json({ ok: true });
    }
    case "extend_expiry": {
      const key = normalizeKey(String(body.license_key ?? ""));
      const { data, error } = await sb.from("licenses").update({ expires_at: body.expires_at ?? null, status: "active" }).eq("license_key", key).select("id").maybeSingle();
      if (error || !data) return json({ ok: false, reason: error?.message ?? "unknown_key" });
      await log(data.id, "extend_expiry", { expires_at: body.expires_at });
      return json({ ok: true });
    }
    case "deactivate_device": {
      const { data, error } = await sb.from("devices").update({ status: "deactivated" }).eq("id", String(body.device_id ?? "")).select("license_id").maybeSingle();
      if (error || !data) return json({ ok: false, reason: error?.message ?? "unknown_device" });
      await log(data.license_id, "deactivate_device", { device_id: body.device_id });
      return json({ ok: true });
    }
    case "list": {
      const { data: lic } = await sb.from("licenses").select("*").order("created_at", { ascending: false });
      const { data: dev } = await sb.from("devices").select("*").order("activated_at", { ascending: false });
      const byLic: Record<string, Record<string, unknown>[]> = {};
      for (const d of (dev ?? [])) { const k = String((d as Record<string, unknown>).license_id); (byLic[k] ||= []).push(d as Record<string, unknown>); }
      const licenses = (lic ?? []).map((l) => {
        const devs = byLic[String((l as Record<string, unknown>).id)] ?? [];
        const active = devs.filter((d) => d.status === "active");
        return { ...l, devices: devs, active_devices: active.length, over_seat: active.length > Number((l as Record<string, unknown>).seats) };
      });
      return json({ ok: true, licenses });
    }
    case "events": {
      const { data } = await sb.from("license_events").select("*").eq("license_id", String(body.license_id ?? "")).order("created_at", { ascending: false }).limit(200);
      return json({ ok: true, events: data ?? [] });
    }
    default:
      return json({ ok: false, reason: "unknown_action" }, 400);
  }
});
