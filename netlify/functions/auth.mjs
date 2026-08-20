import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";
import { getSecret, makeToken, safeEqual, hashPassword } from "./lib/auth.mjs";

const AUTH_STORE = "sql-gym-auth";
const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;

export default async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }
  const { action, username, password } = body || {};

  if (typeof username !== "string" || !USERNAME_RE.test(username)) {
    return Response.json({ error: "Username must be 3-20 letters, numbers, or underscores." }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 6) {
    return Response.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  const store = getStore(AUTH_STORE);
  const secret = await getSecret();
  const usernameKey = username.toLowerCase();
  const userRecordKey = `user:${usernameKey}`;

  if (action === "signup") {
    const existing = await store.get(userRecordKey, { type: "json" });
    if (existing) return Response.json({ error: "That username is already taken." }, { status: 409 });
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = hashPassword(password, salt);
    await store.setJSON(userRecordKey, { username, salt, hash, createdAt: new Date().toISOString() });
    return Response.json({ ok: true, token: makeToken(usernameKey, secret), username });
  }

  if (action === "login") {
    const user = await store.get(userRecordKey, { type: "json" });
    if (!user || !safeEqual(hashPassword(password, user.salt), user.hash)) {
      return Response.json({ error: "Unknown username or wrong password." }, { status: 401 });
    }
    return Response.json({ ok: true, token: makeToken(usernameKey, secret), username: user.username });
  }

  return Response.json({ error: "Unknown action." }, { status: 400 });
};

export const config = { path: "/api/auth" };
