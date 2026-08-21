import { getStore } from "@netlify/blobs";

// Fixed-window counter backed by Netlify Blobs, shared across all function
// instances (unlike an in-memory counter, which only sees its own instance).
// Strong consistency so concurrent requests in the same window don't all
// read a stale count and let more than `max` through.
const RATE_STORE = "sql-gym-ratelimit";

export async function checkRateLimit(key, max, windowMs) {
  const store = getStore({ name: RATE_STORE, consistency: "strong" });
  const now = Date.now();
  const record = await store.get(key, { type: "json" });

  if (!record || now - record.windowStart >= windowMs) {
    await store.setJSON(key, { windowStart: now, count: 1 });
    return { allowed: true };
  }

  if (record.count >= max) {
    const retryAfterSec = Math.ceil((record.windowStart + windowMs - now) / 1000);
    return { allowed: false, retryAfterSec };
  }

  await store.setJSON(key, { windowStart: record.windowStart, count: record.count + 1 });
  return { allowed: true };
}

export function clientIp(req, context) {
  return (
    context?.ip ||
    req.headers.get("x-nf-client-connection-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}
