import { NextResponse } from "next/server";
import { readState } from "@/lib/store";
import { createPageMetadata, createSchemaGraph } from "@/lib/seo/metadata";
import type { ContentDraft } from "@/lib/seo/analyze";
import { allEntities } from "@/lib/adapters";
import { createEntityMetadata, createEntitySchema } from "@/lib/seo/entity-metadata";
import { entitySite } from "@/lib/entity-runtime";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get("path") ?? "/";
  const state = await readState();
  const content = state.content.find((item) => item.path === path || item.id === path);
  if (!content) {
    const entity = allEntities(state.adapterData).find((item) => path.endsWith(`/${item.slug}`) || item.id === path);
    if (!entity) return NextResponse.json({ error: "Content or adapter entity not found." }, { status: 404 });
    return NextResponse.json({ entity, metadata: createEntityMetadata(entity, entitySite(state)), schema: createEntitySchema(entity, entitySite(state)) });
  }

  const baseUrl = String(state.settings.local_url || process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, "");
  const draft: ContentDraft = {
    title: content.title,
    seoTitle: content.seoTitle,
    slug: content.path,
    description: content.description,
    content: content.content,
    focusKeyword: content.focusKeyword,
    canonical: content.canonical,
    schemaType: content.schemaType,
    noindex: content.noindex,
    nofollow: content.nofollow,
    socialTitle: "",
    socialDescription: "",
    customFields: content.customFields,
  };
  const site = {
    name: String(state.settings.website_name || "Example Company"),
    baseUrl,
    defaultImage: String(state.settings.opengraph_thumbnail || ""),
    twitterHandle: String(state.settings.twitter_username || ""),
  };

  return NextResponse.json({
    content,
    metadata: createPageMetadata(draft, site),
    schema: createSchemaGraph(draft, site),
  });
}
