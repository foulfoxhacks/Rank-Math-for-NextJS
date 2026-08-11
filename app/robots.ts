import type { MetadataRoute } from "next";
import { readState } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const state = await readState();
  const baseUrl = String(state.settings.local_url || process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, "");
  const source = String(state.settings.robots_content || "User-agent: *\nAllow: /\nDisallow: /api/");
  const allow = [...source.matchAll(/^Allow:\s*(.+)$/gim)].map((match) => match[1].trim());
  const disallow = [...source.matchAll(/^Disallow:\s*(.+)$/gim)].map((match) => match[1].trim());
  return { rules: { userAgent: "*", allow: allow.length ? allow : "/", disallow }, sitemap: `${baseUrl}/sitemap.xml` };
}
