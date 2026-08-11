import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { readState, writeState } from "@/lib/store";
import { createPageMetadata, createSchemaGraph } from "@/lib/seo/metadata";
import type { ContentDraft } from "@/lib/seo/analyze";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

type PageProps = { params: Promise<{ slug: string[] }> };

function asDraft(content: Awaited<ReturnType<typeof readState>>["content"][number]): ContentDraft {
  return {
    title: content.title, seoTitle: content.seoTitle, slug: content.path, description: content.description,
    content: content.content, focusKeyword: content.focusKeyword, canonical: content.canonical,
    schemaType: content.schemaType, noindex: content.noindex, nofollow: content.nofollow,
    socialTitle: "", socialDescription: "",
    customFields: content.customFields,
  };
}

async function resolveContent(params: PageProps["params"]) {
  const { slug } = await params;
  const path = `/${slug.join("/")}`;
  const state = await readState();
  return { state, path, content: state.content.find((item) => item.path === path && item.status === "published") };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state, content } = await resolveContent(params);
  if (!content) return {};
  return createPageMetadata(asDraft(content), {
    name: String(state.settings.website_name || "Example Company"),
    baseUrl: String(state.settings.local_url || process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, ""),
    defaultImage: String(state.settings.opengraph_thumbnail || ""),
    twitterHandle: String(state.settings.twitter_username || ""),
  });
}

export default async function PublicContentPage({ params }: PageProps) {
  const { state, path, content } = await resolveContent(params);
  if (!content) {
    if (state.modules["404-monitor"]) {
      const existing = state.monitor404.find((item) => item.uri === path);
      state.monitor404 = existing
        ? state.monitor404.map((item) => item.id === existing.id ? { ...item, hits: item.hits + 1, accessTime: new Date().toISOString() } : item)
        : [{ id: crypto.randomUUID(), uri: path, hits: 1, accessTime: new Date().toISOString(), referrer: "Direct", userAgent: "Next.js request" }, ...state.monitor404];
      await writeState(state);
    }
    notFound();
  }
  const site = { name: String(state.settings.website_name || "Example Company"), baseUrl: String(state.settings.local_url || "https://example.com").replace(/\/$/, "") };
  const schema = createSchemaGraph(asDraft(content), site);
  return <main style={{ maxWidth: 780, margin: "70px auto", padding: "0 24px", fontFamily: "system-ui, sans-serif", lineHeight: 1.7 }}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <a href="/" style={{ color: "#069de3" }}>← Rank Math dashboard</a>
    <Breadcrumbs items={[{ name: "Home", href: "/" }, ...content.path.split("/").filter(Boolean).map((segment, index, parts) => ({ name: index === parts.length - 1 ? content.title : segment, href: `/${parts.slice(0, index + 1).join("/")}` }))]} />
    <p style={{ marginTop: 38, color: "#636eb9", textTransform: "uppercase", letterSpacing: ".08em", fontSize: 12 }}>{content.type} · SEO score {content.score}/100</p>
    <h1 style={{ fontSize: "clamp(34px,6vw,58px)", lineHeight: 1.08 }}>{content.title}</h1>
    <p style={{ color: "#697078", fontSize: 20 }}>{content.description}</p>
    <article style={{ marginTop: 40, whiteSpace: "pre-wrap", fontFamily: "Georgia, serif", fontSize: 18 }}>{content.content}</article>
  </main>;
}
