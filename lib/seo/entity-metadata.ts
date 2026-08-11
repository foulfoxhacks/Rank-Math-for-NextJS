import type { Metadata } from "next";
import type { SeoEntity } from "@/lib/adapters";
import { entityPath } from "@/lib/adapters";

export interface EntitySiteIdentity {
  name: string;
  baseUrl: string;
  defaultImage?: string;
}

function entityCopy(entity: SeoEntity) {
  switch (entity.kind) {
    case "profile": return { title: `${entity.name} | Community Profile`, description: entity.bio, image: entity.avatarUrl };
    case "group": return { title: `${entity.name} | Community Group`, description: `Join ${entity.memberCount.toLocaleString()} members in ${entity.name}. ${entity.description}`, image: entity.coverImage };
    case "forum": return { title: `${entity.title} | Community Forum`, description: entity.excerpt, image: undefined };
    case "product": return { title: entity.title, description: entity.description, image: entity.image };
    case "story": return { title: entity.title, description: entity.summary, image: entity.coverImage };
  }
}

export function createEntityMetadata(entity: SeoEntity, site: EntitySiteIdentity): Metadata {
  const copy = entityCopy(entity);
  const canonical = `${site.baseUrl.replace(/\/$/, "")}${entityPath(entity)}`;
  const image = copy.image || site.defaultImage;
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical },
    robots: { index: !entity.noindex, follow: true, googleBot: { index: !entity.noindex, follow: true, "max-image-preview": "large" } },
    openGraph: {
      type: entity.kind === "profile" ? "profile" : entity.kind === "product" ? "website" : "article",
      siteName: site.name,
      title: copy.title,
      description: copy.description,
      url: canonical,
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.description, images: image ? [image] : undefined },
  };
}

export function createEntitySchema(entity: SeoEntity, site: EntitySiteIdentity) {
  const url = `${site.baseUrl.replace(/\/$/, "")}${entityPath(entity)}`;
  const common = { "@context": "https://schema.org", "@id": `${url}#entity`, url };
  switch (entity.kind) {
    case "profile": return { ...common, "@type": "ProfilePage", mainEntity: { "@type": "Person", name: entity.name, description: entity.bio, image: entity.avatarUrl, jobTitle: entity.customFields.jobTitle } };
    case "group": return { ...common, "@type": "Organization", name: entity.name, description: entity.description, image: entity.coverImage, member: { "@type": "QuantitativeValue", value: entity.memberCount } };
    case "forum": return { ...common, "@type": "DiscussionForumPosting", headline: entity.title, articleBody: entity.excerpt, author: { "@type": "Person", name: entity.author }, commentCount: entity.replyCount, datePublished: entity.createdAt };
    case "product": return { ...common, "@type": "Product", name: entity.title, description: entity.description, image: entity.image, sku: entity.sku, brand: { "@type": "Brand", name: entity.brand }, offers: { "@type": "Offer", price: entity.price, priceCurrency: entity.currency, availability: `https://schema.org/${entity.availability}`, url } };
    case "story": return { ...common, "@type": "Article", headline: entity.title, description: entity.summary, image: entity.coverImage, author: { "@type": "Person", name: entity.author }, datePublished: entity.publishedAt, articleBody: entity.slides.join(" ") };
  }
}
