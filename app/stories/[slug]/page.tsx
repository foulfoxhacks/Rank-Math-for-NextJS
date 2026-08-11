import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EntityPage } from "@/components/public/entity-page";
import { entitySite, resolveEntity } from "@/lib/entity-runtime";
import { createEntityMetadata, createEntitySchema } from "@/lib/seo/entity-metadata";

export async function generateMetadata({ params }: PageProps<"/stories/[slug]">): Promise<Metadata> {
  const { slug } = await params; const { state, entity } = await resolveEntity("story", slug);
  return entity ? createEntityMetadata(entity, entitySite(state)) : { title: "Story Not Found" };
}
export default async function StoryPage({ params }: PageProps<"/stories/[slug]">) {
  const { slug } = await params; const { state, entity } = await resolveEntity("story", slug); if (!entity) notFound();
  return <EntityPage entity={entity} schema={createEntitySchema(entity, entitySite(state))} source="story collection adapter" />;
}
