import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EntityPage } from "@/components/public/entity-page";
import { entitySite, resolveEntity } from "@/lib/entity-runtime";
import { createEntityMetadata, createEntitySchema } from "@/lib/seo/entity-metadata";

export async function generateMetadata({ params }: PageProps<"/profile/[slug]">): Promise<Metadata> {
  const { slug } = await params; const { state, entity } = await resolveEntity("profile", slug);
  return entity ? createEntityMetadata(entity, entitySite(state)) : { title: "Profile Not Found" };
}
export default async function ProfilePage({ params }: PageProps<"/profile/[slug]">) {
  const { slug } = await params; const { state, entity } = await resolveEntity("profile", slug); if (!entity) notFound();
  return <EntityPage entity={entity} schema={createEntitySchema(entity, entitySite(state))} source="community profile adapter" />;
}
