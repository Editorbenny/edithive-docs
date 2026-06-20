// Shared Ed25519 signing for Edithive license tokens.
// Produces the SAME token format the desktop app verifies (licensing.py):
//   token = b64url(bodyJSONbytes) + "." + b64url(signature)
// The app re-reads the body bytes verbatim and verifies the sig over them,
// so we only need: valid JSON body + correct b64url + a sig from the real seed.
//
// SECRET: SIGNING_SEED_B64 = the `private_seed_b64` value from owner_keypair.json
// (the 32-byte Ed25519 seed). It lives ONLY here as a Supabase Function secret —
// never in the desktop app, never in git.
import * as ed from "https://esm.sh/@noble/ed25519@2.1.0";

export function b64uEncode(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function b64uDecode(txt: string): Uint8Array {
  const pad = "=".repeat((4 - (txt.length % 4)) % 4);
  const s = (txt + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// Deterministic, sorted-key JSON (cosmetic — the app reads bytes as-is).
function stable(payload: Record<string, unknown>): string {
  const keys = Object.keys(payload).sort();
  const obj: Record<string, unknown> = {};
  for (const k of keys) obj[k] = payload[k];
  return JSON.stringify(obj);
}

export interface LicensePayload {
  schema: number;            // 1
  edition: string;           // beta | pro | studio | ...
  lid: string;               // license_key
  name: string;
  email: string;
  expires_at: number | null; // EPOCH SECONDS (app does now > float(exp)); null=lifetime
  machine: string;           // machine_fp this token is bound to
  seats: number;
}

export async function signToken(payload: LicensePayload): Promise<string> {
  const seedB64 = Deno.env.get("SIGNING_SEED_B64");
  if (!seedB64) throw new Error("SIGNING_SEED_B64 not configured");
  const seed = b64uDecode(seedB64);
  if (seed.length !== 32) throw new Error("seed must be 32 bytes");
  const body = new TextEncoder().encode(stable(payload as unknown as Record<string, unknown>));
  const sig = await ed.signAsync(body, seed);
  return b64uEncode(body) + "." + b64uEncode(sig);
}

// One-time self-check: confirm the configured seed matches the app's public key.
export async function publicKeyB64u(): Promise<string> {
  const seed = b64uDecode(Deno.env.get("SIGNING_SEED_B64") ?? "");
  return b64uEncode(await ed.getPublicKeyAsync(seed));
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Normalize a typed key: uppercase, strip separators (matches client normalize()).
export function normalizeKey(k: string): string {
  return (k || "").trim().toUpperCase().replace(/[\s\-_.]/g, "");
}
