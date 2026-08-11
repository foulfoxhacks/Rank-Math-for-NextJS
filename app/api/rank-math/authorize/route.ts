import { readState } from "@/lib/store";
import { hasSeoCapability } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const role = url.searchParams.get("role") || "subscriber";
  const capability = url.searchParams.get("capability") || "dashboard";
  const state = await readState();
  return Response.json({ role, capability, allowed: hasSeoCapability(state, role, capability), implementation: "Call this function after resolving the authenticated user's provider role on the server." });
}
