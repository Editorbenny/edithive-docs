/**
 * Edithive — daily digest.
 *
 * Runs once a day on Netlify's scheduler, reads the last day of form
 * submissions straight from the Netlify Forms API (the source of truth, so
 * nothing is ever missed), compiles them into ONE smart summary email, and
 * sends it to the admin. This replaces the per-signup admin emails, so you get
 * one clean read a day instead of a flooded inbox.
 *
 * Schedule: 07:00 UTC daily (08:00 Lagos). Change the cron in `config` below.
 *
 * Environment variables:
 *   NETLIFY_API_TOKEN  required. A Netlify personal access token
 *                      (User settings > Applications > Personal access tokens).
 *   RESEND_API_KEY     required to send the digest email.
 *   EMAIL_FROM         default "Edithive <hello@myedithive.com>"
 *   ADMIN_EMAIL        default "myedithive@gmail.com"
 *   SITE_ID            default the known Edithive site id.
 *   DIGEST_HOURS       lookback window in hours (default 25, a little overlap).
 *
 * Manual run for testing: GET /.netlify/functions/daily-digest?key=YOUR_SECRET
 * (uses BETA_INVITE_SECRET so it can't be triggered by strangers).
 */

const env = (k, d) => process.env[k] || d;
const SITE_ID = () => env("SITE_ID", "c2dffc2e-4cec-4951-9482-c22c62b9ba3c");
const API = "https://api.netlify.com/api/v1";

async function nf(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${env("NETLIFY_API_TOKEN", "")}` },
  });
  if (!res.ok) throw new Error(`Netlify API ${res.status} on ${path}`);
  return res.json();
}

function esc(s) {
  return String(s == null ? "" : s).replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
}

/* Count how often each value of a field appears, return a sorted "a (3), b (2)" string. */
function tally(rows, field) {
  const counts = {};
  rows.forEach((r) => {
    const v = (r.data && r.data[field]) || "";
    if (v) counts[v] = (counts[v] || 0) + 1;
  });
  const pairs = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return pairs.map(([k, n]) => `${esc(k)} (${n})`).join(" &middot; ");
}

function shell(inner) {
  return `<!DOCTYPE html><html><body style="margin:0;background:#0b0d12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0d12;padding:30px 16px;"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;">
      <tr><td style="padding:0 4px 16px;">
        <span style="font-size:18px;font-weight:700;color:#edeff5;">Edithive</span>
        <span style="font-size:11px;color:#6a7086;letter-spacing:.14em;text-transform:uppercase;padding-left:10px;">Daily digest</span>
      </td></tr>
      <tr><td style="background:#ffffff;border-radius:16px;padding:30px 28px;">${inner}</td></tr>
      <tr><td style="padding:16px 8px 0;text-align:center;">
        <p style="margin:0;font-size:12px;color:#6a7086;">Full records live in Netlify &rarr; Forms. Reply to this email to reach yourself a note.</p>
      </td></tr>
    </table>
  </td></tr></table></body></html>`;
}

function section(title, count, bodyHtml) {
  return `
    <div style="margin:0 0 26px;">
      <div style="font-size:13px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#4f7bff;margin-bottom:4px;">${title}</div>
      <div style="font-size:22px;font-weight:700;color:#0b0d12;margin-bottom:12px;">${count} new</div>
      ${bodyHtml}
    </div>`;
}

function list(rows, render) {
  if (!rows.length) return `<p style="margin:0;font-size:14px;color:#9aa0b4;">Nothing new today.</p>`;
  return rows
    .map(
      (r) =>
        `<div style="padding:11px 0;border-top:1px solid #eef0f4;font-size:14px;color:#3c4152;line-height:1.5;">${render(r.data || {}, r)}</div>`
    )
    .join("");
}

async function sendDigest(html, subject) {
  const apiKey = env("RESEND_API_KEY", "");
  if (!apiKey) {
    console.log("[daily-digest] RESEND_API_KEY not set; digest not emailed.");
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env("EMAIL_FROM", "Edithive <hello@myedithive.com>"),
      to: [env("ADMIN_EMAIL", "myedithive@gmail.com")],
      subject,
      html,
    }),
  });
  if (!res.ok) console.error("[daily-digest] Resend error", res.status, await res.text());
  else console.log("[daily-digest] digest sent.");
}

async function buildAndSend() {
  if (!env("NETLIFY_API_TOKEN", "")) {
    console.log("[daily-digest] NETLIFY_API_TOKEN not set; cannot read submissions.");
    return { ok: false, reason: "no-token" };
  }
  const sinceMs = Date.now() - Number(env("DIGEST_HOURS", "25")) * 3600 * 1000;
  const forms = await nf(`/sites/${SITE_ID()}/forms`);

  const byName = {};
  for (const form of forms) {
    const subs = await nf(`/forms/${form.id}/submissions?per_page=100`);
    byName[form.name] = subs.filter((s) => new Date(s.created_at).getTime() >= sinceMs);
  }

  const waitlist = byName["waitlist"] || [];
  const survey = byName["editor-survey"] || [];
  const reports = byName["beta-report"] || [];
  const total = waitlist.length + survey.length + reports.length;

  if (total === 0) {
    console.log("[daily-digest] no new submissions; skipping email.");
    return { ok: true, total: 0 };
  }

  let inner = `<h1 style="margin:0 0 6px;font-size:24px;color:#0b0d12;">Yesterday at Edithive</h1>
    <p style="margin:0 0 26px;font-size:15px;color:#9aa0b4;">${total} new ${total === 1 ? "thing" : "things"} across the waitlist, survey and beta.</p>`;

  inner += section(
    "Waitlist signups",
    waitlist.length,
    list(waitlist, (d) => `<strong style="color:#0b0d12;">${esc(d.name || "?")}</strong> &middot; ${esc(d.email || "?")}${d.editor_type ? ` &middot; <span style="color:#9aa0b4;">${esc(d.editor_type)}</span>` : ""}`)
  );

  let surveyExtra = "";
  if (survey.length) {
    surveyExtra = `<div style="background:#f5f7ff;border-radius:10px;padding:12px 14px;margin-bottom:12px;font-size:13px;color:#3c4152;line-height:1.7;">
      <strong>Cuts in:</strong> ${tally(survey, "nle") || "—"}<br/>
      <strong>Biggest time sink:</strong> ${tally(survey, "biggest_time_sink") || "—"}<br/>
      <strong>Edits most:</strong> ${tally(survey, "edits_most") || "—"}
    </div>`;
  }
  inner += section(
    "Survey responses",
    survey.length,
    surveyExtra +
      list(survey, (d) => {
        const wish = d.one_wish ? `<div style="margin-top:4px;color:#0b0d12;">&ldquo;${esc(d.one_wish)}&rdquo;</div>` : "";
        return `<strong style="color:#0b0d12;">${esc(d.email || "?")}</strong> &middot; ${esc(d.edits_most || "")} &middot; ${esc(d.nle || "")}${wish}`;
      })
  );

  inner += section(
    "Beta reports",
    reports.length,
    list(reports, (d) => {
      const broke = d.what_broke ? `<div style="margin-top:4px;"><span style="color:#b6553a;">Issue:</span> ${esc(d.what_broke)}</div>` : "";
      const great = d.what_felt_great ? `<div style="margin-top:2px;color:#9aa0b4;">Loved: ${esc(d.what_felt_great)}</div>` : "";
      return `<strong style="color:#0b0d12;">${esc(d.email || "?")}</strong> &middot; ${esc(d.tested || "")} &middot; ${esc(d.keep_using || "")}${broke}${great}`;
    })
  );

  await sendDigest(shell(inner), `Edithive digest: ${total} new (${waitlist.length} signups, ${survey.length} surveys, ${reports.length} reports)`);
  return { ok: true, total };
}

/* Scheduled entry point. Also reachable via GET with ?key=BETA_INVITE_SECRET for a manual run. */
export default async (req) => {
  try {
    const url = new URL(req.url);
    const manual = url.searchParams.get("key");
    if (manual && manual !== env("BETA_INVITE_SECRET", "\0")) {
      return new Response("Unauthorized", { status: 401 });
    }
    const result = await buildAndSend();
    return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("[daily-digest]", err.message);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};

export const config = { schedule: "0 7 * * *" };
