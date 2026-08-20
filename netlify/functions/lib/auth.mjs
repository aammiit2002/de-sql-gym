import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";

// Shared by auth.mjs (issues tokens) and progress.mjs (verifies them).
// Tokens are stateless: `${usernameKey}.${hmac}` signed with a secret that's
// generated once and cached in Blobs, so no session table to manage.
const AUTH_STORE = "sql-gym-auth";

export async function getSecret() {
  const store = getStore(AUTH_STORE);
  let secret = await store.get("secret", { type: "text" });
  if (!secret) {
    secret = crypto.randomBytes(32).toString("hex");
    await store.set("secret", secret);
  }
  return secret;
}

export function computeMac(usernameKey, secret) {
  return crypto.createHmac("sha256", secret).update(usernameKey).digest("hex");
}

export function makeToken(usernameKey, secret) {
  return `${usernameKey}.${computeMac(usernameKey, secret)}`;
}

export function safeEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

// Returns the lowercase username key for a valid token, or null.
export async function verifyToken(req) {
  const authz = req.headers.get("authorization") || "";
  const m = /^Bearer\s+(.+)$/.exec(authz);
  if (!m) return null;
  const token = m[1];
  const idx = token.lastIndexOf(".");
  if (idx < 0) return null;
  const usernameKey = token.slice(0, idx);
  const mac = token.slice(idx + 1);

  const secret = await getSecret();
  if (!safeEqual(mac, computeMac(usernameKey, secret))) return null;

  const store = getStore(AUTH_STORE);
  const user = await store.get(`user:${usernameKey}`, { type: "json" });
  if (!user) return null;
  return usernameKey;
}
