/**
 * Edithive — download key gate.
 *
 * The public downloads page shows locked cards. A beta editor pastes the
 * key from their invite; this endpoint checks it server side and, only on
 * a match, returns the real download URLs. The URLs use tokened filenames
 * and never appear in the page source, so there is nothing to scrape.
 *
 * Keys are the SAME keys the app uses for activation: the check runs
 * against the licensing database (beta_keys + licenses) through a
 * read-only RPC that returns only true/false. Generate a key in the
 * licence admin and it immediately unlocks downloads too; revoke it and
 * it stops working everywhere.
 *
 *   POST /.netlify/functions/validate-download-key
 *   { "key": "XXXX-XXXX-XXXX" }
 *   200 → { ok: true, downloads: { arm64, intel, premiere, resolve } }
 *   401 → { ok: false }
 *
 * Environment variables (all optional):
 *   SUPABASE_URL         override the licensing project URL
 *   SUPABASE_ANON_KEY    override the public anon key
 *   DOWNLOAD_KEYS        extra ad-hoc keys (comma/space separated)
 *   DOWNLOAD_LINKS_JSON  override download URLs (arm64/intel/win/premiere/resolve)
 */

const SUPABASE_URL = process.env.SUPABASE_URL || "https://wfheadgwjkfedyaeucuu.supabase.co";
/* the public anon key (can only call the boolean RPC) comes from Netlify env */
const SUPABASE_ANON = process.env.SUPABASE_ANON_KEY || "";

const DEFAULT_LINKS = {
  arm64: "/assets/downloads/edithive-select-mac-apple-silicon-b7f4k2.pkg",
  intel: "/assets/downloads/edithive-select-mac-intel-b7f4k2.pkg",
  premiere: "/assets/downloads/edithive-premiere-panel-mac-b7f4k2.pkg",
  resolve: "/assets/downloads/edithive-resolve-panel-mac-b7f4k2.pkg",
};

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

const norm = (s) => String(s || "").trim().toUpperCase().replace(/\s+/g, "");

export const handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { ok: false });

  let key = "";
  try {
    key = norm(JSON.parse(event.body || "{}").key);
  } catch {
    return json(400, { ok: false });
  }
  if (!key || key.length < 6 || key.length > 64) return json(401, { ok: false });

  let valid = false;

  /* ad-hoc keys from env, if any */
  const extra = String(process.env.DOWNLOAD_KEYS || "")
    .split(/[\s,;]+/)
    .map(norm)
    .filter(Boolean);
  if (extra.includes(key)) valid = true;

  /* the licensing database: same keys the app activates with */
  if (!valid && !SUPABASE_ANON) return json(503, { ok: false, reason: "not-configured" });
  if (!valid) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/check_download_key`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON,
          Authorization: `Bearer ${SUPABASE_ANON}`,
        },
        body: JSON.stringify({ k: key }),
      });
      if (res.ok) valid = (await res.json()) === true;
    } catch {
      return json(502, { ok: false, reason: "licence-check-unreachable" });
    }
  }

  if (!valid) {
    await new Promise((r) => setTimeout(r, 800)); // keep guessing slow
    return json(401, { ok: false });
  }

  let links = DEFAULT_LINKS;
  try {
    if (process.env.DOWNLOAD_LINKS_JSON) {
      links = { ...DEFAULT_LINKS, ...JSON.parse(process.env.DOWNLOAD_LINKS_JSON) };
    }
  } catch {
    /* keep defaults if the env JSON is malformed */
  }

  return json(200, { ok: true, downloads: links });
};
