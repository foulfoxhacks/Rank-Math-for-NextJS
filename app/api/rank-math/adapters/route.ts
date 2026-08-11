import { NextResponse } from "next/server";
import { allEntities, WORDPRESS_TO_NEXT_EQUIVALENTS, type SeoEntity } from "@/lib/adapters";
import { readState } from "@/lib/store";
import { createEntityMetadata, createEntitySchema } from "@/lib/seo/entity-metadata";
import { entitySite } from "@/lib/entity-runtime";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const state = await readState();
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get("resource");
  const slug = searchParams.get("slug");

  if (resource === "custom-fields") {
    return NextResponse.json({
      content: state.content.map((item) => ({ id: item.id, title: item.title, customFields: item.customFields ?? {} })),
      entities: allEntities(state.adapterData).map((item) => ({ kind: item.kind, slug: item.slug, customFields: item.customFields })),
      contract: "Record<string, string>",
    });
  }

  if (resource && slug) {
    const entities = allEntities(state.adapterData);
    const kind = resource === "profiles" ? "profile" : resource === "groups" ? "group" : resource === "forums" ? "forum" : resource === "products" ? "product" : resource === "stories" ? "story" : "";
    const entity = entities.find((item) => item.kind === kind && (item.slug === slug || item.id === slug)) as SeoEntity | undefined;
    if (!entity) return NextResponse.json({ error: "Adapter entity not found." }, { status: 404 });
    return NextResponse.json({ entity, metadata: createEntityMetadata(entity, entitySite(state)), schema: createEntitySchema(entity, entitySite(state)) });
  }

  return NextResponse.json({
    equivalents: WORDPRESS_TO_NEXT_EQUIVALENTS,
    connections: state.adapters,
    resources: {
      profiles: state.adapterData.profiles.length,
      groups: state.adapterData.groups.length,
      forums: state.adapterData.forumTopics.length,
      products: state.adapterData.products.length,
      stories: state.adapterData.stories.length,
    },
  });
}
