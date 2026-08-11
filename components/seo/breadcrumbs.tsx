export interface BreadcrumbItem { name: string; href: string; }

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const graph = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: item.href })),
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
    <nav className="seo-breadcrumbs" aria-label="Breadcrumb">{items.map((item, index) => <span key={item.href}>{index > 0 && <b aria-hidden="true">›</b>}{index === items.length - 1 ? <span>{item.name}</span> : <a href={item.href}>{item.name}</a>}</span>)}</nav>
  </>;
}
