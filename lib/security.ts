import type { RuntimeState } from "@/lib/rank-math";

export function authorizeAdminMutation(request: Request): Response | null {
  const expectedToken = process.env.RANK_MATH_ADMIN_TOKEN;
  const suppliedToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || request.headers.get("x-rank-math-token");
  if (expectedToken && suppliedToken !== expectedToken) return Response.json({ error: "Unauthorized mutation." }, { status: 401 });

  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) return Response.json({ error: "Cross-origin mutation rejected." }, { status: 403 });
  return null;
}

export function hasSeoCapability(state: RuntimeState, role: string, capability: string) {
  return Boolean(state.roles[role]?.includes(capability));
}
