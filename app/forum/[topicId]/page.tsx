import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EntityPage } from "@/components/public/entity-page";
import { entitySite, resolveEntity } from "@/lib/entity-runtime";
import { createEntityMetadata, createEntitySchema } from "@/lib/seo/entity-metadata";

export async function generateMetadata({ params }: PageProps<"/forum/[topicId]">): Promise<Metadata> {
  const { topicId } = await params; const { state, entity } = await resolveEntity("forum", topicId);
  return entity ? createEntityMetadata(entity, entitySite(state)) : { title: "Forum Topic Not Found" };
}
export default async function ForumPage({ params }: PageProps<"/forum/[topicId]">) {
  const { topicId } = await params; const { state, entity } = await resolveEntity("forum", topicId); if (!entity) notFound();
  return <EntityPage entity={entity} schema={createEntitySchema(entity, entitySite(state))} source="forum topic adapter" />;
}
