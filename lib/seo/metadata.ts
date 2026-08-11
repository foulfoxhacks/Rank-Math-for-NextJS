import type { Metadata } from "next";
import type { ContentDraft } from "./analyze";

export interface SiteIdentity {
  name: string;
  baseUrl: string;
  defaultImage?: string;
  twitterHandle?: string;
}

export function createPageMetadata(draft: ContentDraft, site: SiteIdentity): Metadata {
  const title = draft.seoTitle || draft.title;
  const canonical = draft.canonical || `${site.baseUrl}/${draft.slug.replace(/^\//, "")}`;
  const socialTitle = draft.socialTitle || title;
  const socialDescription = draft.socialDescription || draft.description;

  return {
    title,
    description: draft.description,
    alternates: { canonical },
    robots: {
      index: !draft.noindex,
      follow: !draft.nofollow,
      googleBot: { index: !draft.noindex, follow: !draft.nofollow, "max-image-preview": "large" },
    },
    openGraph: {
      type: "article",
      siteName: site.name,
      title: socialTitle,
      description: socialDescription,
      url: canonical,
      images: site.defaultImage ? [{ url: site.defaultImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      creator: site.twitterHandle,
      title: socialTitle,
      description: socialDescription,
      images: site.defaultImage ? [site.defaultImage] : undefined,
    },
  };
}

export function createSchemaGraph(draft: ContentDraft, site: SiteIdentity) {
  const canonical = draft.canonical || `${site.baseUrl}/${draft.slug.replace(/^\//, "")}`;
  const articleId = `${canonical}#article`;
  const websiteId = `${site.baseUrl}#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: site.baseUrl,
        name: site.name,
      },
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: draft.seoTitle || draft.title,
        description: draft.description,
        isPartOf: { "@id": websiteId },
      },
      {
        "@type": draft.schemaType || "Article",
        "@id": articleId,
        headline: draft.title,
        description: draft.description,
        mainEntityOfPage: { "@id": `${canonical}#webpage` },
        additionalProperty: Object.entries(draft.customFields ?? {}).map(([name, value]) => ({ "@type": "PropertyValue", name, value })),
      },
    ],
  };
}
