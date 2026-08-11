import { NextResponse } from "next/server";
import { readState, writeState } from "@/lib/store";
import type { IndexingLog } from "@/lib/rank-math";
import { authorizeAdminMutation } from "@/lib/security";

export async function POST(request: Request) {
  const unauthorized = authorizeAdminMutation(request);
  if (unauthorized) return unauthorized;
  const { urls, action = "update" } = (await request.json()) as { urls?: string[]; action?: "update" | "delete" };
  const validUrls = (urls ?? []).map((url) => url.trim()).filter((url) => /^https?:\/\//i.test(url));
  if (!validUrls.length) return NextResponse.json({ error: "Enter at least one absolute URL." }, { status: 400 });

  const state = await readState();
  const key = String(state.settings.indexnow_key || process.env.INDEXNOW_KEY || "");
  let status: IndexingLog["status"] = "success";
  let response = "Queued locally (set INDEXNOW_KEY to submit live)";

  if (key && action === "update") {
    try {
      const host = new URL(validUrls[0]).host;
      const result = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host, key, keyLocation: `https://${host}/api/rank-math/indexnow-key`, urlList: validUrls }),
      });
      status = result.ok ? "success" : "error";
      response = `${result.status} ${result.statusText}`;
    } catch (error) {
      status = "error";
      response = error instanceof Error ? error.message : "IndexNow request failed";
    }
  }

  const logs: IndexingLog[] = validUrls.map((url) => ({
    id: crypto.randomUUID(), url, action, status, response, createdAt: new Date().toISOString(),
  }));
  state.indexingLog = [...logs, ...state.indexingLog].slice(0, 200);
  await writeState(state);
  return NextResponse.json({ status, response, logs });
}
