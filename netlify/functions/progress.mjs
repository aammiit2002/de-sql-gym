import { getStore } from "@netlify/blobs";
import { verifyToken } from "./lib/auth.mjs";

// One legacy unkeyed "progress" blob exists from before accounts were added —
// it holds the site owner's real solved/attempted history. Whoever logs in
// and asks for progress first claims it as their starting point; everyone
// after starts blank (rec() in the client lazily fills in {} per question).
async function initialProgressFor(store) {
  const claimed = await store.get("legacy-claimed", { type: "text" });
  if (claimed !== "true") {
    await store.set("legacy-claimed", "true");
    const legacy = await store.get("progress", { type: "json" });
    if (legacy) return legacy;
  }
  return {};
}

export default async (req) => {
  const usernameKey = await verifyToken(req);
  if (!usernameKey) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const store = getStore("sql-gym");
  const key = `progress:${usernameKey}`;

  if (req.method === "GET") {
    let data = await store.get(key, { type: "json" });
    if (!data) {
      data = await initialProgressFor(store);
      await store.setJSON(key, data);
    }
    return Response.json(data);
  }

  if (req.method === "POST") {
    const body = await req.json();
    await store.setJSON(key, body);
    return Response.json({ ok: true });
  }

  return new Response("Method Not Allowed", { status: 405 });
};

export const config = { path: "/api/progress" };
