export type AdapterStatus = "native" | "connected" | "configurable";
export type AdapterLayer = "routing" | "content" | "data" | "auth" | "runtime" | "seo" | "delivery";

export interface WordPressNextEquivalent {
  id: string;
  wordpress: string;
  nextjs: string;
  layer: AdapterLayer;
  implementation: string;
  status: AdapterStatus;
  route?: string;
  providerOptions?: string[];
}

export interface AdapterConnection {
  enabled: boolean;
  provider: string;
  mode: "native" | "external";
  endpoint?: string;
}

interface EntityBase {
  id: string;
  slug: string;
  noindex: boolean;
  customFields: Record<string, string>;
}

export interface CommunityProfile extends EntityBase {
  kind: "profile";
  name: string;
  bio: string;
  avatarUrl: string;
  memberSince: string;
  activityCount: number;
}

export interface CommunityGroup extends EntityBase {
  kind: "group";
  name: string;
  description: string;
  coverImage: string;
  memberCount: number;
  privacy: "public" | "private";
}

export interface ForumTopic extends EntityBase {
  kind: "forum";
  title: string;
  excerpt: string;
  author: string;
  replyCount: number;
  createdAt: string;
}

export interface CommerceProduct extends EntityBase {
  kind: "product";
  title: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  availability: "InStock" | "OutOfStock" | "PreOrder";
  sku: string;
  brand: string;
}

export interface StoryRecord extends EntityBase {
  kind: "story";
  title: string;
  summary: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  slides: string[];
}

export type SeoEntity = CommunityProfile | CommunityGroup | ForumTopic | CommerceProduct | StoryRecord;

export interface AdapterData {
  profiles: CommunityProfile[];
  groups: CommunityGroup[];
  forumTopics: ForumTopic[];
  products: CommerceProduct[];
  stories: StoryRecord[];
}

export const WORDPRESS_TO_NEXT_EQUIVALENTS: WordPressNextEquivalent[] = [
  { id: "plugin-bootstrap", wordpress: "Plugin bootstrap / PHP includes", nextjs: "ES modules + Server and Client Components", layer: "runtime", implementation: "App Router module graph and typed component boundaries", status: "native", route: "/" },
  { id: "admin-menu", wordpress: "wp-admin menus and pages", nextjs: "React administration shell", layer: "runtime", implementation: "Client navigation with typed RankMathView screens", status: "native", route: "/" },
  { id: "options", wordpress: "wp_options / Settings API", nextjs: "Typed persistence adapter + Route Handler", layer: "data", implementation: "RuntimeState through lib/store.ts and /api/rank-math/state", status: "native", route: "/api/rank-math/state" },
  { id: "hooks", wordpress: "Actions and filters", nextjs: "Composable functions, props, events, and route middleware", layer: "runtime", implementation: "Explicit imports and adapter contracts replace global mutable hooks", status: "native" },
  { id: "rest", wordpress: "WordPress REST API", nextjs: "App Router Route Handlers", layer: "delivery", implementation: "Web Request/Response APIs under app/api", status: "native", route: "/api/rank-math/adapters" },
  { id: "head", wordpress: "wp_head metadata injection", nextjs: "Metadata API and generateMetadata", layer: "seo", implementation: "Server-resolved title, robots, canonical, Open Graph, and X cards", status: "native", route: "/api/rank-math/headless?path=/blog/content-strategy" },
  { id: "schema", wordpress: "JSON-LD output hooks", nextjs: "Server-rendered application/ld+json graph", layer: "seo", implementation: "Typed Schema.org graphs emitted with each public entity", status: "native", route: "/profile/sam-reed" },
  { id: "rewrites", wordpress: "Rewrite rules and template redirects", nextjs: "App Router dynamic segments + proxy.ts", layer: "routing", implementation: "Typed routes, 301/302/307 redirects, and 410/451 responses", status: "native", route: "/old-content-guide" },
  { id: "templates", wordpress: "Template hierarchy", nextjs: "Layouts, pages, dynamic segments, and not-found", layer: "routing", implementation: "File-system routes with explicit loading and metadata boundaries", status: "native", route: "/blog/content-strategy" },
  { id: "posts", wordpress: "Posts, pages, and custom post types", nextjs: "Typed content collections", layer: "content", implementation: "ContentRecord plus provider-normalized collection adapters", status: "native", providerOptions: ["Payload", "Strapi", "Sanity", "Contentful", "filesystem"] },
  { id: "post-meta", wordpress: "postmeta and ACF fields", nextjs: "Typed customFields records + CMS field adapter", layer: "content", implementation: "Custom fields participate in analysis, metadata, and Schema mapping", status: "native", route: "/api/rank-math/adapters?resource=custom-fields", providerOptions: ["Payload fields", "Strapi components", "Sanity objects", "database JSON"] },
  { id: "taxonomy", wordpress: "Categories, tags, and taxonomies", nextjs: "Typed collection indexes and dynamic route segments", layer: "content", implementation: "Explicit collection/tag models replace implicit taxonomy globals", status: "native", providerOptions: ["CMS relationships", "database join tables", "static params"] },
  { id: "users", wordpress: "wp_users", nextjs: "Server-side authentication provider", layer: "auth", implementation: "Provider-neutral profile contract; production can bind Supabase Auth, Auth.js, Clerk, or Payload Auth", status: "configurable", route: "/profile/sam-reed", providerOptions: ["Supabase Auth", "Auth.js", "Clerk", "Payload Auth"] },
  { id: "capabilities", wordpress: "Roles and capabilities", nextjs: "Session authorization + typed permissions", layer: "auth", implementation: "Role Manager state maps to server middleware and UI authorization", status: "native" },
  { id: "buddypress", wordpress: "BuddyPress profiles and groups", nextjs: "Community profile/group data adapters + dynamic routes", layer: "content", implementation: "generateMetadata and Profile/Organization Schema for every entity", status: "native", route: "/profile/sam-reed", providerOptions: ["Supabase/Postgres", "Payload collections", "custom API"] },
  { id: "bbpress", wordpress: "bbPress forums and topics", nextjs: "Forum topic adapter + dynamic route", layer: "content", implementation: "DiscussionForumPosting metadata and Schema generated server-side", status: "native", route: "/forum/technical-seo-audit" },
  { id: "woocommerce", wordpress: "WooCommerce products", nextjs: "Commerce adapter + product routes", layer: "content", implementation: "Product, Offer, availability, price, SKU, brand, canonical, and social output", status: "native", route: "/products/seo-strategy-intensive", providerOptions: ["Shopify Storefront API", "Medusa", "Stripe", "Payload products", "custom database"] },
  { id: "acf", wordpress: "Advanced Custom Fields", nextjs: "Typed CMS fields and normalized records", layer: "content", implementation: "Provider values are flattened into searchable SEO text and Schema properties", status: "native", route: "/api/rank-math/adapters?resource=custom-fields" },
  { id: "media", wordpress: "Media Library and attachment posts", nextjs: "Object storage + next/image + explicit media records", layer: "content", implementation: "Media URLs are first-class fields; orphan attachment pages are replaced by explicit redirects", status: "configurable", providerOptions: ["Vercel Blob", "Cloudflare R2", "S3", "Supabase Storage", "CMS media"] },
  { id: "web-stories", wordpress: "Google Web Stories plugin", nextjs: "Story collection + mobile-first dynamic route", layer: "content", implementation: "Article metadata, slide content, cover image, and story Schema", status: "native", route: "/stories/technical-seo-in-five-steps" },
  { id: "amp", wordpress: "AMP module", nextjs: "Core Web Vitals and built-in performance primitives", layer: "delivery", implementation: "Next.js 16 removed AMP; Image, Font, caching, streaming, and minimal client JS are the supported replacement", status: "native" },
  { id: "shortcodes", wordpress: "Shortcodes and widgets", nextjs: "Typed React components", layer: "runtime", implementation: "Components receive validated props instead of parsing global shortcode strings", status: "native" },
  { id: "metabox", wordpress: "Gutenberg/Classic Editor metabox", nextjs: "Controlled React SEO editor", layer: "runtime", implementation: "Live score, snippet, robots, Schema, social, and custom-field analysis", status: "native", route: "/" },
  { id: "cron", wordpress: "WP-Cron", nextjs: "Protected idempotent Route Handler + deployment scheduler", layer: "runtime", implementation: "CRON_SECRET-authorized endpoint suitable for Vercel Cron or another scheduler", status: "native", route: "/api/rank-math/cron" },
  { id: "transients", wordpress: "Transients API", nextjs: "Cache APIs and provider cache", layer: "data", implementation: "Cache lifetime and revalidation replace database-backed transient values", status: "native" },
  { id: "database", wordpress: "wpdb and plugin tables", nextjs: "Replaceable repository/store adapter", layer: "data", implementation: "Filesystem default with the same contract for Postgres, D1, KV, Prisma, or a CMS", status: "native" },
  { id: "nonces", wordpress: "WordPress nonces", nextjs: "Authenticated server mutations, Origin checks, and provider CSRF protection", layer: "auth", implementation: "Session-bound authorization belongs at Route Handler and Server Action boundaries", status: "configurable" },
  { id: "mail", wordpress: "wp_mail", nextjs: "Transactional email service adapter", layer: "delivery", implementation: "Email reports call a provider from server-only code", status: "configurable", providerOptions: ["Resend", "Postmark", "SendGrid", "Cloudflare Email"] },
  { id: "feeds", wordpress: "RSS and podcast feeds", nextjs: "XML Route Handlers", layer: "delivery", implementation: "Dynamic content and podcast feeds with explicit content types", status: "native", route: "/feed.xml" },
  { id: "sitemap", wordpress: "XML sitemap providers", nextjs: "sitemap.ts metadata route", layer: "seo", implementation: "All public content and adapter entities participate in sitemap.xml", status: "native", route: "/sitemap.xml" },
  { id: "robots", wordpress: "Virtual robots.txt filter", nextjs: "robots.ts metadata route", layer: "seo", implementation: "Stored directives are resolved at request time", status: "native", route: "/robots.txt" },
  { id: "multisite", wordpress: "WordPress Multisite", nextjs: "Host/tenant-aware routing and data adapters", layer: "routing", implementation: "Resolve tenant from host or route segment before loading SEO state", status: "configurable", providerOptions: ["subdomain routing", "domain mapping", "tenant path"] },
  { id: "updates", wordpress: "Plugin updates and rollback", nextjs: "Package manager + source control + immutable deployment", layer: "delivery", implementation: "Versioned builds and deployment rollback replace in-place PHP file updates", status: "native" },
];

export const DEFAULT_ADAPTER_CONNECTIONS: Record<string, AdapterConnection> = {
  content: { enabled: true, provider: "Native typed records", mode: "native" },
  customFields: { enabled: true, provider: "Typed customFields", mode: "native" },
  community: { enabled: true, provider: "Native community records", mode: "native" },
  forum: { enabled: true, provider: "Native forum records", mode: "native" },
  commerce: { enabled: true, provider: "Native product records", mode: "native" },
  stories: { enabled: true, provider: "Native story records", mode: "native" },
  auth: { enabled: false, provider: "Configure Supabase/Auth.js/Clerk/Payload", mode: "external" },
  media: { enabled: false, provider: "Configure object storage or CMS media", mode: "external" },
  email: { enabled: false, provider: "Configure transactional email", mode: "external" },
  analytics: { enabled: false, provider: "Configure Google OAuth", mode: "external" },
};

export const DEMO_ADAPTER_DATA: AdapterData = {
  profiles: [{ kind: "profile", id: "profile-1", slug: "sam-reed", name: "Sam Reed", bio: "Technical SEO lead helping product teams build fast, crawlable and genuinely useful web experiences.", avatarUrl: "/rank-math/social-placeholder.jpg", memberSince: "2022-04-18", activityCount: 148, noindex: false, customFields: { jobTitle: "Technical SEO Lead", location: "New York" } }],
  groups: [{ kind: "group", id: "group-1", slug: "technical-seo", name: "Technical SEO", description: "A public community for rendering, crawling, structured data, site architecture and web performance discussions.", coverImage: "/rank-math/trends-preview.jpg", memberCount: 2840, privacy: "public", noindex: false, customFields: { cadence: "Weekly discussions", moderator: "Sam Reed" } }],
  forumTopics: [{ kind: "forum", id: "topic-1", slug: "technical-seo-audit", title: "What belongs in a modern technical SEO audit?", excerpt: "A practical discussion of rendering, crawl paths, canonicalization, structured data, performance and monitoring for Next.js sites.", author: "Sam Reed", replyCount: 24, createdAt: "2026-08-08T14:00:00.000Z", noindex: false, customFields: { category: "Technical SEO", solved: "true" } }],
  products: [{ kind: "product", id: "commerce-1", slug: "seo-strategy-intensive", title: "SEO Strategy Intensive", description: "A focused technical and content strategy engagement with a prioritized implementation roadmap.", image: "/rank-math/social-placeholder.jpg", price: 2400, currency: "USD", availability: "InStock", sku: "SEO-INTENSIVE-01", brand: "Example Company", noindex: false, customFields: { duration: "Two weeks", delivery: "Remote" } }],
  stories: [{ kind: "story", id: "story-1", slug: "technical-seo-in-five-steps", title: "Technical SEO in Five Steps", summary: "A concise, mobile-first walkthrough of the technical foundations every modern Next.js site needs.", coverImage: "/rank-math/trends-preview.jpg", author: "Sam Reed", publishedAt: "2026-08-09T13:00:00.000Z", slides: ["Make every important URL reachable.", "Resolve one canonical URL per resource.", "Generate metadata on the server.", "Ship valid structured data.", "Monitor crawlers and real users."], noindex: false, customFields: { format: "Five slides", audience: "Product teams" } }],
};

export function entityPath(entity: SeoEntity) {
  const prefix = entity.kind === "profile" ? "profile" : entity.kind === "group" ? "groups" : entity.kind === "forum" ? "forum" : entity.kind === "product" ? "products" : "stories";
  return `/${prefix}/${entity.slug}`;
}

export function allEntities(data: AdapterData): SeoEntity[] {
  return [...data.profiles, ...data.groups, ...data.forumTopics, ...data.products, ...data.stories];
}
