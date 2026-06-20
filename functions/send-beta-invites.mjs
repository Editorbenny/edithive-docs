/**
 * Edithive — beta invite sender.
 *
 * Secured batch endpoint to invite chosen waitlist members to a beta wave.
 * Selection stays in your hands: export the waitlist CSV from Netlify Forms,
 * pick your 10-100 editors, then call this with their emails.
 *
 * Usage (replace the secret and emails):
 *
 *   curl -X POST https://myedithive.com/.netlify/functions/send-beta-invites \
 *     -H "Content-Type: application/json" \
 *     -H "x-edithive-secret: YOUR_SECRET" \
 *     -d '{
 *       "emails": [
 *         { "email": "editor@studio.com", "name": "Ada" },
 *         { "email": "cutter@films.com" }
 *       ],
 *       "wave": "Beta wave 1",
 *       "downloadUrl": "https://example.com/edithive-beta.dmg",
 *       "note": "Optional extra line shown inside the email."
 *     }'
 *
 * Environment variables:
 *   BETA_INVITE_SECRET  required. Requests without the matching header are rejected.
 *   RESEND_API_KEY      required to actually send.
 *   EMAIL_FROM          default "Benny from Edithive <hello@myedithive.com>"
 *   BETA_DOWNLOAD_URL   fallback download link if the request omits downloadUrl
 *   SITE_URL            default "https://myedithive.com"
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const MAX_PER_CALL = 100;

const env = (key, fallback) => process.env[key] || fallback;

function inviteEmail({ firstName, downloadUrl, wave, note, siteUrl, key }) {
  const reportUrl = `${siteUrl}/beta`;
  const keyBlock = key
    ? `<div style="margin:0 0 24px;padding:18px 20px;border:1px solid #d7ddff;background:#f5f7ff;border-radius:12px;">
         <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#6a7086;margin-bottom:6px;">Your activation key</div>
         <div style="font-family:'SF Mono',Menlo,monospace;font-size:22px;font-weight:700;letter-spacing:.06em;color:#0b0d12;">${key}</div>
         <div style="font-size:13px;color:#6a7086;margin-top:8px;">Paste this on the activation screen the first time you open Edithive Select. It binds to your Mac. Keep it private.</div>
       </div>`
    : "";
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0b0d12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0d12;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="padding:0 4px 18px;">
          <span style="font-size:19px;font-weight:700;letter-spacing:-0.02em;color:#edeff5;">Edithive</span>
          <span style="font-size:12px;color:#6a7086;letter-spacing:0.14em;text-transform:uppercase;padding-left:10px;">${wave}</span>
        </td></tr>
        <tr><td style="background:#ffffff;border-radius:16px;padding:36px 32px;">
          <h1 style="margin:0 0 18px;font-size:24px;letter-spacing:-0.02em;color:#0b0d12;">${firstName}, your beta access is ready.</h1>
          <p style="margin:0 0 16px;font-size:15.5px;line-height:1.65;color:#3c4152;">
            Out of everyone on the waitlist, you are in the first group to run
            Edithive Smart Selects on real work. That is not a small thing:
            what you report in the next weeks decides what this becomes.
          </p>
          ${keyBlock}
          <p style="margin:0 0 24px;">
            <a href="${downloadUrl}" style="display:inline-block;background:#4f7bff;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:13px 26px;border-radius:999px;">Download the beta</a>
          </p>
          <p style="margin:0 0 16px;font-size:15.5px;line-height:1.65;color:#3c4152;">
            <strong style="color:#0b0d12;">Two asks:</strong><br/>
            1. Point Smart Selects at a real project this week, not a test folder.<br/>
            2. When anything breaks or delights you, send a 60-second report:
            <a href="${reportUrl}" style="color:#4f7bff;text-decoration:none;">${reportUrl}</a>
          </p>
          ${note ? `<p style="margin:0 0 16px;font-size:15.5px;line-height:1.65;color:#3c4152;">${note}</p>` : ""}
          <p style="margin:0;font-size:15.5px;line-height:1.65;color:#3c4152;">
            Reply to this email any time. During the beta you are talking straight to me.<br/><br/>
            Benny<br/>
            <span style="color:#6a7086;">Founder, Edithive</span>
          </p>
        </td></tr>
        <tr><td style="padding:20px 8px 0;text-align:center;">
          <p style="margin:0;font-size:12px;line-height:1.6;color:#6a7086;">
            Edithive &middot; The post-production suite for editors<br/>
            Reply "unsubscribe" to opt out of beta emails.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "POST only" };
  }

  const secret = env("BETA_INVITE_SECRET", "");
  const given = event.headers["x-edithive-secret"] || event.headers["X-Edithive-Secret"] || "";
  if (!secret || given !== secret) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  const apiKey = env("RESEND_API_KEY", "");
  if (!apiKey) {
    return { statusCode: 500, body: "RESEND_API_KEY not configured" };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const emails = Array.isArray(body.emails) ? body.emails.slice(0, MAX_PER_CALL) : [];
  if (!emails.length) {
    return { statusCode: 400, body: 'Provide "emails": [{ "email": "...", "name": "..." }]' };
  }

  /* Default to the on-site downloads page so testers always pick the right
     OS build instead of being handed a single file. Caller can still override
     with a custom URL per wave. */
  const downloadUrl =
    body.downloadUrl ||
    env("BETA_DOWNLOAD_URL", "") ||
    `${env("SITE_URL", "https://myedithive.com").replace(/\/$/, "")}/downloads`;

  const wave = body.wave || "Beta access";
  const siteUrl = env("SITE_URL", "https://myedithive.com").replace(/\/$/, "");
  const from = env("EMAIL_FROM", "Benny from Edithive <hello@myedithive.com>");

  const results = [];
  for (const entry of emails) {
    const email = (entry.email || "").trim();
    if (!email || !email.includes("@")) {
      results.push({ email, ok: false, error: "invalid email" });
      continue;
    }
    const firstName = (entry.name || "editor").trim().split(/\s+/)[0];
    const key = (entry.key || "").trim();
    try {
      const res = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [email],
          subject: `${firstName}, your Edithive beta access is ready`,
          html: inviteEmail({ firstName, downloadUrl, wave, note: body.note || "", siteUrl, key }),
        }),
      });
      results.push({ email, ok: res.ok, ...(res.ok ? {} : { error: await res.text() }) });
      /* Gentle pacing to stay inside Resend rate limits. */
      await new Promise((r) => setTimeout(r, 600));
    } catch (err) {
      results.push({ email, ok: false, error: err.message });
    }
  }

  const sent = results.filter((r) => r.ok).length;
  console.log(`[send-beta-invites] ${wave}: sent ${sent}/${results.length}`);
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wave, sent, total: results.length, results }),
  };
};
