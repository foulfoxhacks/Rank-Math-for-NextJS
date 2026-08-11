import { NextResponse, type NextRequest } from "next/server";
import { readState } from "@/lib/store";

export async function proxy(request: NextRequest) {
  const state = await readState();
  const path = request.nextUrl.pathname.replace(/\/$/, "") || "/";
  const rule = state.modules.redirections
    ? state.redirects.find((item) => item.status === "active" && item.sources.some((source) => (source.replace(/\/$/, "") || "/") === path))
    : undefined;
  if (!rule) return NextResponse.next();

  if (rule.type === "410" || rule.type === "451") {
    return new NextResponse(rule.type === "410" ? "This resource is gone." : "Unavailable for legal reasons.", {
      status: Number(rule.type), headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
  return NextResponse.redirect(new URL(rule.destination, request.url), Number(rule.type));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|rank-math|sitemap.xml|robots.txt|llms.txt).*)"],
};
