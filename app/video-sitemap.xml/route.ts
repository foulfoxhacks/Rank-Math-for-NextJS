import { readState } from "@/lib/store";

export const dynamic = "force-dynamic";
const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" }[character]!));

export async function GET() {
  const state = await readState(); const baseUrl = String(state.settings.local_url || "https://example.com").replace(/\/$/, "");
  const urls = state.adapterData.stories.filter((item) => !item.noindex).map((item) => `<url><loc>${baseUrl}/stories/${item.slug}</loc><video:video><video:thumbnail_loc>${baseUrl}${item.coverImage}</video:thumbnail_loc><video:title>${escapeXml(item.title)}</video:title><video:description>${escapeXml(item.summary)}</video:description><video:player_loc>${baseUrl}/stories/${item.slug}</video:player_loc></video:video></url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">${urls}</urlset>`, { headers: { "content-type": "application/xml; charset=utf-8" } });
}
