import { readState } from "@/lib/store";
import { allEntities, entityPath } from "@/lib/adapters";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = await readState();
  const baseUrl = String(state.settings.local_url || process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, "");
  const limit = Number(state.settings.llms_limit || 100);
  const lines = state.content.filter((item) => item.status === "published" && !item.noindex).slice(0, limit)
    .map((item) => `- [${item.title}](${baseUrl}${item.path}): ${item.description}`);
  const entityLines = allEntities(state.adapterData).filter((item) => !item.noindex).slice(0, limit).map((item) => {
    const title = item.kind === "profile" || item.kind === "group" ? item.name : item.title;
    const description = item.kind === "profile" ? item.bio : item.kind === "group" ? item.description : item.kind === "forum" ? item.excerpt : item.kind === "product" ? item.description : item.summary;
    return `- [${title}](${baseUrl}${entityPath(item)}): ${description}`;
  });
  const body = `# ${String(state.settings.website_name || "Example Company")}\n\n> ${String(state.settings.local_description || "Search-optimized website content.")}\n\n## Important content\n\n${lines.join("\n")}\n\n## Community, commerce, and story records\n\n${entityLines.join("\n")}\n\n${String(state.settings.llms_additional || "")}\n`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
