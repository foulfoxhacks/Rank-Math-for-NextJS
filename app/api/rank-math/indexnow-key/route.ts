import { readState } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = await readState();
  const key = String(state.settings.indexnow_key || process.env.INDEXNOW_KEY || "");
  if (!key) return new Response("IndexNow key is not configured.", { status: 404 });
  return new Response(key, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
