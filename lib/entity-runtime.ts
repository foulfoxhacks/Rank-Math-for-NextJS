import { readState } from "@/lib/store";
import type { SeoEntity } from "@/lib/adapters";

export async function resolveEntity(kind: SeoEntity["kind"], slug: string) {
  const state = await readState();
  const nativeEntity = kind === "profile" ? state.adapterData.profiles.find((item) => item.slug === slug)
    : kind === "group" ? state.adapterData.groups.find((item) => item.slug === slug)
    : kind === "forum" ? state.adapterData.forumTopics.find((item) => item.slug === slug || item.id === slug)
    : kind === "product" ? state.adapterData.products.find((item) => item.slug === slug)
    : state.adapterData.stories.find((item) => item.slug === slug);
  const adapterId = kind === "profile" || kind === "group" ? "community" : kind === "forum" ? "forum" : kind === "product" ? "commerce" : "stories";
  const adapter = state.adapters[adapterId];
  let entity = nativeEntity;
  if (adapter?.enabled && adapter.mode === "external" && adapter.endpoint) {
    try {
      const target = adapter.endpoint.includes("{slug}") ? adapter.endpoint.replace("{slug}", encodeURIComponent(slug)) : `${adapter.endpoint.replace(/\/$/, "")}/${encodeURIComponent(slug)}`;
      const response = await fetch(target, { cache: "no-store", headers: { accept: "application/json" } });
      if (response.ok) entity = { ...(nativeEntity ?? {}), ...(await response.json()), kind, slug } as SeoEntity;
    } catch (error) {
      console.error(`The ${adapterId} adapter could not resolve ${slug}; native fallback used.`, error);
    }
  }
  return { state, entity };
}

export function entitySite(state: Awaited<ReturnType<typeof readState>>) {
  return {
    name: String(state.settings.website_name || "Example Company"),
    baseUrl: String(state.settings.local_url || process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, ""),
    defaultImage: String(state.settings.opengraph_thumbnail || ""),
  };
}
