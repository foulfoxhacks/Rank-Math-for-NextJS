import { readState } from "@/lib/store";

export const dynamic = "force-dynamic";
const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" }[character]!));

export async function GET() {
  const state = await readState();
  const baseUrl = String(state.settings.local_url || "https://example.com").replace(/\/$/, "");
  const items = state.adapterData.forumTopics.map((topic) => `<item><title>${escapeXml(topic.title)}</title><link>${baseUrl}/forum/${topic.slug}</link><guid>${baseUrl}/forum/${topic.slug}</guid><description>${escapeXml(topic.excerpt)}</description><pubDate>${new Date(topic.createdAt).toUTCString()}</pubDate></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0"><channel><title>${escapeXml(String(state.settings.website_name || "Example Company"))} Podcast</title><link>${baseUrl}</link><description>Community discussions from ${escapeXml(String(state.settings.website_name || "Example Company"))}.</description><itunes:author>${escapeXml(String(state.settings.knowledge_name || "Example Company"))}</itunes:author>${items}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
