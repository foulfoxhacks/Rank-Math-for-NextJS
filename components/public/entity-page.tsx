import { entityPath, type SeoEntity } from "@/lib/adapters";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export function EntityPage({ entity, schema, source }: { entity: SeoEntity; schema: object; source: string }) {
  const title = entity.kind === "profile" || entity.kind === "group" ? entity.name : entity.title;
  const description = entity.kind === "profile" ? entity.bio : entity.kind === "group" ? entity.description : entity.kind === "forum" ? entity.excerpt : entity.kind === "product" ? entity.description : entity.summary;
  const image = entity.kind === "profile" ? entity.avatarUrl : entity.kind === "group" ? entity.coverImage : entity.kind === "product" ? entity.image : entity.kind === "story" ? entity.coverImage : "";
  const path = entityPath(entity);
  const collectionPath = `/${path.split("/").filter(Boolean)[0]}`;
  return <main className={`entity-public entity-${entity.kind}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <nav><a href="/">← SEO dashboard</a><span>Native Next.js {source}</span></nav>
    <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: entity.kind, href: collectionPath }, { name: title, href: path }]} />
    {image && <img className="entity-cover" src={image} alt={title} title={title} loading="eager" />}
    <div className="entity-kicker">{entity.kind} · {source}</div>
    <h1>{title}</h1><p className="entity-lead">{description}</p>
    {entity.kind === "profile" && <div className="entity-stats"><span><strong>{entity.activityCount}</strong> activities</span><span><strong>{new Date(entity.memberSince).getFullYear()}</strong> member since</span></div>}
    {entity.kind === "group" && <div className="entity-stats"><span><strong>{entity.memberCount.toLocaleString()}</strong> members</span><span><strong>{entity.privacy}</strong> access</span></div>}
    {entity.kind === "forum" && <article className="entity-content"><p>{entity.excerpt}</p><div className="entity-stats"><span><strong>{entity.replyCount}</strong> replies</span><span>Started by <strong>{entity.author}</strong></span></div></article>}
    {entity.kind === "product" && <article className="entity-content"><div className="product-price">{new Intl.NumberFormat("en-US", { style: "currency", currency: entity.currency }).format(entity.price)}</div><p>SKU {entity.sku} · {entity.availability}</p><button>Request this service</button></article>}
    {entity.kind === "story" && <div className="story-slides">{entity.slides.map((slide, index) => <article key={slide}><span>{index + 1}</span><p>{slide}</p></article>)}</div>}
    <section className="entity-fields"><h2>Normalized custom fields</h2>{Object.entries(entity.customFields).map(([key, value]) => <div key={key}><strong>{key}</strong><span>{value}</span></div>)}</section>
  </main>;
}
