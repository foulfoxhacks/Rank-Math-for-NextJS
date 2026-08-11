import { readState } from "@/lib/store";

export const dynamic = "force-dynamic";
const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" }[character]!));

export async function GET() {
  const state = await readState();
  const baseUrl = String(state.settings.local_url || process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, "");
  const items = state.content.filter((item) => item.status === "published" && !item.noindex).map((item) => `<item><title>${escapeXml(item.title)}</title><link>${baseUrl}${item.path}</link><guid>${baseUrl}${item.path}</guid><description>${escapeXml(item.description)}</description><pubDate>${new Date(state.updatedAt).toUTCString()}</pubDate></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(String(state.settings.website_name || "Example Company"))}</title><link>${baseUrl}</link><description>${escapeXml(String(state.settings.local_description || "Search-optimized content"))}</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
