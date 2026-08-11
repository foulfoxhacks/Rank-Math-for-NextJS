import { readState } from "@/lib/store";

export const dynamic = "force-dynamic";
const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" }[character]!));

export async function GET() {
  const state = await readState(); const baseUrl = String(state.settings.local_url || "https://example.com").replace(/\/$/, "");
  const urls = state.content.filter((item) => item.type === "article" && item.status === "published" && !item.noindex).map((item) => `<url><loc>${baseUrl}${item.path}</loc><news:news><news:publication><news:name>${escapeXml(String(state.settings.website_name || "Example Company"))}</news:name><news:language>en</news:language></news:publication><news:publication_date>${state.updatedAt}</news:publication_date><news:title>${escapeXml(item.title)}</news:title></news:news></url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${urls}</urlset>`, { headers: { "content-type": "application/xml; charset=utf-8" } });
}
