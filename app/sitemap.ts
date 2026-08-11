import type { MetadataRoute } from "next";
import { readState } from "@/lib/store";
import { allEntities, entityPath } from "@/lib/adapters";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const state = await readState();
  const baseUrl = String(state.settings.local_url || process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, "");
  const exclusions = String(state.settings.sitemap_exclude_posts || "").split(/[,\n]/).map((item) => item.trim()).filter(Boolean);
  const contentEntries: MetadataRoute.Sitemap = state.content
    .filter((item) => {
      const enabled = item.type === "article" ? state.settings.sitemap_articles : item.type === "page" ? state.settings.sitemap_pages : state.settings.sitemap_products;
      return enabled !== false && item.status === "published" && !item.noindex && !exclusions.includes(item.id) && !exclusions.includes(item.path);
    })
    .map((item) => ({
      url: `${baseUrl}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
      lastModified: state.updatedAt,
      changeFrequency: item.type === "article" ? "weekly" : "monthly",
      priority: item.path === "/" ? 1 : item.type === "page" ? 0.8 : 0.7,
    }));
  const adapterEntries: MetadataRoute.Sitemap = allEntities(state.adapterData).filter((item) => {
    const enabled = item.kind === "profile" ? state.settings.author_sitemap : item.kind === "group" ? state.settings.sitemap_groups : item.kind === "forum" ? state.settings.sitemap_forums : item.kind === "product" ? state.settings.sitemap_products : state.settings.sitemap_stories;
    return enabled !== false && !item.noindex;
  }).map((item) => ({
    url: `${baseUrl}${entityPath(item)}`,
    lastModified: state.updatedAt,
    changeFrequency: item.kind === "forum" ? "daily" : item.kind === "product" ? "weekly" : "monthly",
    priority: item.kind === "product" || item.kind === "group" ? 0.8 : 0.7,
  }));
  return [...contentEntries, ...adapterEntries];
}
