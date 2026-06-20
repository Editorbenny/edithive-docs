// ──────────────────────────────────────────────────────────────────
// Edithive Founder OS · Phase 6 · health-monitor.mjs
// Scheduled Netlify function. Pings the live system every 30 minutes and
// EMAILS THE FOUNDER (via Resend) if anything is down. This is the alerting
// layer the system was missing.
//
// Deploy: it ships with the other functions on the next `netlify deploy`.
// Manual run: GET /.netlify/functions/health-monitor?key=<BETA_INVITE_SECRET>
//
// Env used (all already configured for the other email functions):
//   RESEND_API_KEY, ADMIN_EMAIL, EMAIL_FROM, SITE_URL,
//   SUPABASE_URL (or derives from project ref), BETA_INVITE_SECRET (manual trigger gate)
//
// Anti-spam note: this alerts on every failing run. During a long outage that
// repeats every 30 min. To make it alert only on state CHANGE, persist the last
// status (e.g. in Supabase or Netlify Blobs) — left simple on purpose.
// ──────────────────────────────────────────────────────────────────

const DOMAIN = (process.env.SITE_URL || "https://myedithive.com").replace(/\/+$/, "");
const SUPA = process.env.SUPABASE_URL || "https://wfheadgwjkfedyaeucuu.supabase.co";
const ADMIN = process.env.ADMIN_EMAIL || "myedithive@gmail.com";
const FROM = process.env.EMAIL_FROM || "Edithive Monitor <hello@myedithive.com>";

async function timed(name, fn) {
  const t0 = Date.now();
  try {
    const detail = await fn();
    return { name, ok: true, ms: Date.now() - t0, ...detail };
  } catch (e) {
    return { name, ok: false, ms: Date.now() - t0, error: String(e && e.message || e) };
  }
}

async function expectOk(url, opts = {}) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 10000);
  try {
    const r = await fetch(url, { ...opts, signal: ctrl.signal });
    clearTimeout(to);
    // A response at all = the host is up. For licensing fns even 400/401 is "alive".
    return { status: r.status, alive: true };
  } finally { clearTimeout(to); }
}

async function runChecks() {
  return Promise.all([
    timed("Website", async () => {
      const r = await expectOk(`${DOMAIN}/`, { redirect: "manual" });
      if (r.status >= 500 || r.status === 0) throw new Error(`HTTP ${r.status}`);
      return { status: r.status };
    }),
    timed("Update manifest (version.json)", async () => {
      const r = await fetch(`${DOMAIN}/version.json`, { signal: AbortSignal.timeout(10000) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      return { status: r.status, version: j.version };
    }),
    timed("Installer storage", async () => {
      const r = await fetch(`${DOMAIN}/assets/downloads/edithive-select-mac-apple-silicon.pkg`, { method: "HEAD", signal: AbortSignal.timeout(10000) });
      if (r.status >= 500 || r.status === 404) throw new Error(`HTTP ${r.status}`);
      return { status: r.status };
    }),
    timed("Supabase REST", async () => {
      const r = await expectOk(`${SUPA}/rest/v1/`);
      if (r.status >= 500) throw new Error(`HTTP ${r.status}`);
      return { status: r.status };
    }),
    timed("Licensing · validate", async () => {
      const r = await expectOk(`${SUPA}/functions/v1/validate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      if (r.status >= 500) throw new Error(`HTTP ${r.status}`);
      return { status: r.status };
    }),
    timed("Licensing · activate", async () => {
      const r = await expectOk(`${SUPA}/functions/v1/activate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      if (r.status >= 500) throw new Error(`HTTP ${r.status}`);
      return { status: r.status };
    }),
  ]);
}

async function emailAlert(failures, all) {
  if (!process.env.RESEND_API_KEY) return { sent: false, reason: "no RESEND_API_KEY" };
  const rows = all.map(c =>
    `<tr><td style="padding:4px 10px">${c.ok ? "✅" : "🔴"} ${c.name}</td>
     <td style="padding:4px 10px;color:#666">${c.ok ? (c.version ? "v" + c.version : "HTTP " + (c.status ?? "ok")) : c.error}</td>
     <td style="padding:4px 10px;color:#999">${c.ms}ms</td></tr>`).join("");
  const html = `<div style="font-family:system-ui">
    <h2 style="color:#b00">⚠ Edithive: ${failures.length} check(s) failing</h2>
    <p>Automated health monitor detected a problem at ${new Date().toISOString()}.</p>
    <table style="border-collapse:collapse">${rows}</table>
    <p style="color:#666;font-size:13px">Open the Founder Console → Infrastructure, and see
    founder-os/05-docs/DISASTER_RECOVERY_GUIDE.md.</p></div>`;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: ADMIN, subject: `🔴 Edithive health: ${failures.map(f => f.name).join(", ")}`, html }),
  });
  return { sent: r.ok, status: r.status };
}

// Scheduled handler
export default async (req) => {
  // manual trigger requires the shared secret as ?key=
  const url = new URL(req.url);
  const manual = url.searchParams.has("key");
  if (manual && url.searchParams.get("key") !== process.env.BETA_INVITE_SECRET) {
    return new Response("forbidden", { status: 403 });
  }

  const all = await runChecks();
  const failures = all.filter(c => !c.ok);
  let alert = { sent: false };
  if (failures.length) alert = await emailAlert(failures, all);

  const body = { checkedAt: new Date().toISOString(), failures: failures.length, alert, results: all };
  return new Response(JSON.stringify(body, null, 2), {
    status: failures.length ? 503 : 200,
    headers: { "Content-Type": "application/json" },
  });
};

// Run every 30 minutes. Tune in netlify.toml or here.
export const config = { schedule: "*/30 * * * *" };
