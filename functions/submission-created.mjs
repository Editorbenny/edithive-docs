/**
 * Edithive — form submission auto-responder.
 *
 * Netlify invokes a function named "submission-created" automatically on every
 * VERIFIED form submission (spam-filtered already). This one:
 *
 *   waitlist       -> branded welcome email to the subscriber + admin notification
 *   editor-survey  -> admin notification
 *   beta-report    -> admin notification (flagged for same-day reading)
 *
 * Email delivery is via the Resend HTTP API (https://resend.com).
 *
 * Environment variables (Netlify > Site configuration > Environment variables):
 *   RESEND_API_KEY   required for any email to send. Without it this function
 *                    logs and exits cleanly so form capture itself never breaks.
 *   EMAIL_FROM       default: "Benny from Edithive <hello@myedithive.com>"
 *                    (the domain must be verified in Resend first)
 *   ADMIN_EMAIL      default: "myedithive@gmail.com"
 *   SITE_URL         default: "https://myedithive.com"
 *   BRIEF_PDF_URL    optional. Public URL of the Edithive brief PDF; when set,
 *                    it is fetched and attached to the welcome email.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const env = (key, fallback) => process.env[key] || fallback;

async function sendEmail({ to, subject, html, attachments }) {
  const apiKey = env("RESEND_API_KEY", "");
  if (!apiKey) {
    console.log("[submission-created] RESEND_API_KEY not set; skipping email:", subject);
    return { skipped: true };
  }
  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env("EMAIL_FROM", "Benny from Edithive <hello@myedithive.com>"),
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(attachments && attachments.length ? { attachments } : {}),
    }),
  });
  const body = await res.text();
  if (!res.ok) {
    console.error("[submission-created] Resend error", res.status, body);
    return { error: body };
  }
  console.log("[submission-created] sent:", subject, "->", to);
  return { ok: true };
}

/* Shared shell so every Edithive email looks like the brand. */
function emailShell(inner) {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0b0d12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0d12;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="padding:0 4px 18px;">
          <span style="font-size:19px;font-weight:700;letter-spacing:-0.02em;color:#edeff5;">Edithive</span>
          <span style="font-size:12px;color:#6a7086;letter-spacing:0.14em;text-transform:uppercase;padding-left:10px;">Smart Selects</span>
        </td></tr>
        <tr><td style="background:#ffffff;border-radius:16px;padding:36px 32px;">
          ${inner}
        </td></tr>
        <tr><td style="padding:20px 8px 0;text-align:center;">
          <p style="margin:0;font-size:12px;line-height:1.6;color:#6a7086;">
            Edithive &middot; The post-production suite for editors<br/>
            You received this because you joined the waitlist at myedithive.com.<br/>
            Want out? Just reply with "unsubscribe" and a human will remove you.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function button(href, label) {
  return `<a href="${href}" style="display:inline-block;background:#4f7bff;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:13px 26px;border-radius:999px;">${label}</a>`;
}

function welcomeEmail({ firstName, email, siteUrl }) {
  const surveyUrl = `${siteUrl}/survey?email=${encodeURIComponent(email)}`;
  return emailShell(`
    <h1 style="margin:0 0 18px;font-size:24px;letter-spacing:-0.02em;color:#0b0d12;">Welcome to the hive, ${firstName}.</h1>
    <p style="margin:0 0 16px;font-size:15.5px;line-height:1.65;color:#3c4152;">
      You just joined a small group of editors who are done losing nights to grunt work.
      Edithive is one suite that finds your best takes, knows every track you own,
      and remembers where everything lives. Built by an editor, for editors.
    </p>
    <p style="margin:0 0 16px;font-size:15.5px;line-height:1.65;color:#3c4152;">
      <strong style="color:#0b0d12;">What happens next:</strong> beta invites go out in waves,
      starting with the first 100 on the list. You will hear from us before anyone else does.
      I've attached a short brief that explains what Edithive is and why it exists.
    </p>
    <p style="margin:0 0 24px;font-size:15.5px;line-height:1.65;color:#3c4152;">
      One favour. Sixty seconds. Tell us how you edit, so we build the right things first:
    </p>
    <p style="margin:0 0 28px;">${button(surveyUrl, "Answer 5 quick questions")}</p>
    <p style="margin:0;font-size:15.5px;line-height:1.65;color:#3c4152;">
      And this inbox is not a robot. Hit reply any time, I read everything.<br/><br/>
      Benny<br/>
      <span style="color:#6a7086;">Founder, Edithive</span>
    </p>
  `);
}

function adminEmail(formName, data) {
  const rows = Object.entries(data)
    .filter(([k]) => !["bot-field", "form-name"].includes(k))
    .map(
      ([k, v]) =>
        `<tr><td style="padding:7px 14px 7px 0;font-size:13px;color:#6a7086;vertical-align:top;white-space:nowrap;">${k}</td>
         <td style="padding:7px 0;font-size:14px;color:#0b0d12;">${String(v || "").replace(/</g, "&lt;")}</td></tr>`
    )
    .join("");
  return emailShell(`
    <h1 style="margin:0 0 14px;font-size:20px;letter-spacing:-0.02em;color:#0b0d12;">New ${formName} submission</h1>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">${rows}</table>
  `);
}

async function fetchAttachment(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const filename = url.split("/").pop().split("?")[0] || "edithive-brief.pdf";
    return [{ filename, content: buf.toString("base64") }];
  } catch (err) {
    console.error("[submission-created] attachment fetch failed:", err.message);
    return null;
  }
}

export const handler = async (event) => {
  let payload;
  try {
    payload = JSON.parse(event.body).payload;
  } catch {
    return { statusCode: 400, body: "Bad payload" };
  }

  const formName = payload.form_name || "unknown";
  const data = payload.data || {};
  const siteUrl = env("SITE_URL", "https://myedithive.com").replace(/\/$/, "");
  const adminTo = env("ADMIN_EMAIL", "myedithive@gmail.com");

  const jobs = [];

  /*
   * Per-signup admin emails are intentionally OFF to keep the inbox calm.
   * The daily-digest function compiles every submission into one summary a day,
   * and the full record always lives in Netlify > Forms. We only auto-respond
   * to the person who signed up (the welcome below). Set ALWAYS_NOTIFY_ADMIN=1
   * if you ever want the instant per-submission copy back.
   */
  const alwaysNotify = env("ALWAYS_NOTIFY_ADMIN", "") === "1";

  if (formName === "waitlist" && data.email) {
    const firstName = (data.name || "editor").trim().split(/\s+/)[0];
    /* The Edithive brief ships with the site; BRIEF_PDF_URL can override it.
       The ?v= bypasses the CDN's cached older copy when the PDF is updated. */
    const briefUrl = env("BRIEF_PDF_URL", `${siteUrl}/assets/edithive-brief.pdf?v=2`);
    const attachments = await fetchAttachment(briefUrl);
    jobs.push(
      sendEmail({
        to: data.email,
        subject: `Welcome to the hive, ${firstName}`,
        html: welcomeEmail({ firstName, email: data.email, siteUrl }),
        attachments,
      })
    );
  }

  /* Beta reports are time-sensitive, so they still ping immediately even
     though signups and surveys wait for the digest. */
  if (formName === "beta-report") {
    jobs.push(
      sendEmail({
        to: adminTo,
        subject: `BETA REPORT from ${data.email || "?"}: ${data.tested || ""}`,
        html: adminEmail("beta-report", data),
      })
    );
  } else if (alwaysNotify && (formName === "waitlist" || formName === "editor-survey")) {
    jobs.push(
      sendEmail({
        to: adminTo,
        subject: `New ${formName}: ${data.email || data.name || "?"}`,
        html: adminEmail(formName, data),
      })
    );
  }

  await Promise.allSettled(jobs);
  return { statusCode: 200, body: "ok" };
};
