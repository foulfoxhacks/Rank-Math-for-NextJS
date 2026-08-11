import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EntityPage } from "@/components/public/entity-page";
import { entitySite, resolveEntity } from "@/lib/entity-runtime";
import { createEntityMetadata, createEntitySchema } from "@/lib/seo/entity-metadata";

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params; const { state, entity } = await resolveEntity("product", slug);
  return entity ? createEntityMetadata(entity, entitySite(state)) : { title: "Product Not Found" };
}
export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params; const { state, entity } = await resolveEntity("product", slug); if (!entity) notFound();
  return <EntityPage entity={entity} schema={createEntitySchema(entity, entitySite(state))} source="commerce adapter" />;
}
