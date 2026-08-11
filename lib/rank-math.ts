import { DEFAULT_ADAPTER_CONNECTIONS, DEMO_ADAPTER_DATA, type AdapterConnection, type AdapterData } from "@/lib/adapters";

export type RankMathView =
  | "dashboard" | "wizard" | "analytics" | "seo-analysis" | "content-ai" | "ai-visibility"
  | "general-settings" | "titles-meta" | "sitemap" | "instant-indexing" | "monitor-404"
  | "redirections" | "links" | "schema" | "role-manager" | "status" | "editor" | "integrations";

export type FieldType = "text" | "textarea" | "toggle" | "select" | "number" | "multiselect" | "image" | "code";

export interface ModuleDefinition {
  id: string;
  title: string;
  desc: string;
  icon: string;
  active: boolean;
  pro?: boolean;
  beta?: boolean;
  dependency?: string;
  wordpressSource?: string;
  nextEquivalent?: string;
  native?: boolean;
  settingsView?: RankMathView;
}

export interface SettingField {
  id: string;
  label: string;
  description: string;
  type: FieldType;
  defaultValue: string | number | boolean | string[];
  options?: string[];
  placeholder?: string;
}

export interface SettingsPanel {
  id: string;
  label: string;
  description: string;
  fields: SettingField[];
}

export interface RedirectRecord {
  id: string;
  sources: string[];
  destination: string;
  type: "301" | "302" | "307" | "410" | "451";
  status: "active" | "inactive";
  hits: number;
  lastAccessed: string;
}

export interface MonitorRecord {
  id: string;
  uri: string;
  hits: number;
  accessTime: string;
  referrer: string;
  userAgent: string;
}

export interface IndexingLog {
  id: string;
  url: string;
  action: "update" | "delete";
  status: "success" | "error";
  response: string;
  createdAt: string;
}

export interface ContentRecord {
  id: string;
  title: string;
  path: string;
  type: "article" | "page" | "product";
  status: "published" | "draft";
  seoTitle: string;
  description: string;
  focusKeyword: string;
  score: number;
  schemaType: string;
  canonical: string;
  content: string;
  noindex: boolean;
  nofollow: boolean;
  customFields?: Record<string, string>;
}

export interface RuntimeState {
  version: string;
  mode: "easy" | "advanced";
  connected: boolean;
  setupComplete: boolean;
  modules: Record<string, boolean>;
  settings: Record<string, string | number | boolean | string[]>;
  redirects: RedirectRecord[];
  monitor404: MonitorRecord[];
  indexingLog: IndexingLog[];
  content: ContentRecord[];
  roles: Record<string, string[]>;
  adapters: Record<string, AdapterConnection>;
  adapterData: AdapterData;
  updatedAt: string;
}

const field = (id: string, label: string, description: string, type: FieldType, defaultValue: SettingField["defaultValue"], options?: string[]): SettingField =>
  ({ id, label, description, type, defaultValue, options });

export const MODULES: ModuleDefinition[] = [
  { id: "ai-visibility", title: "AI Visibility", desc: "Track brand mentions, citations, sentiment, and opportunities through an external answer-engine data provider.", icon: "sparkles", active: true, beta: true, nextEquivalent: "Provider API + Route Handlers", settingsView: "ai-visibility" },
  { id: "content-ai", title: "Content AI", desc: "Research keywords and receive optimization targets through a configurable AI/research provider.", icon: "content-ai", active: true, nextEquivalent: "AI provider adapter", settingsView: "content-ai" },
  { id: "404-monitor", title: "404 Monitor", desc: "Records the URLs on which visitors and search engines run into 404 errors.", icon: "404", active: true, settingsView: "monitor-404" },
  { id: "acf", title: "Custom Fields", desc: "Normalize typed custom fields from Payload, Strapi, Sanity, Contentful, a database, or native records for analysis and Schema.", icon: "acf", active: true, wordpressSource: "Advanced Custom Fields (ACF)", nextEquivalent: "Typed CMS field adapter", native: true, settingsView: "integrations" },
  { id: "analytics", title: "Analytics", desc: "Connect with Google Search Console and Analytics to see important search information in the dashboard.", icon: "search-console", active: true, settingsView: "analytics" },
  { id: "buddypress", title: "Community SEO", desc: "Generate metadata and ProfilePage/Organization Schema for dynamic member and group routes.", icon: "users", active: true, wordpressSource: "BuddyPress", nextEquivalent: "Profile/group data adapters + dynamic routes", native: true, settingsView: "integrations" },
  { id: "bbpress", title: "Forum SEO", desc: "Generate server metadata and DiscussionForumPosting Schema for forum topics and replies.", icon: "comments", active: true, wordpressSource: "bbPress", nextEquivalent: "Forum adapter + /forum/[topicId]", native: true, settingsView: "integrations" },
  { id: "image-seo", title: "Image SEO", desc: "Automate missing ALT and title attributes for images on the fly.", icon: "images", active: true, settingsView: "general-settings" },
  { id: "instant-indexing", title: "Instant Indexing", desc: "Notify search engines using the IndexNow API when pages are added, updated or removed.", icon: "instant-indexing", active: true, settingsView: "instant-indexing" },
  { id: "link-counter", title: "Link Counter", desc: "Count internal, external, incoming and outgoing links in your content.", icon: "link", active: true, settingsView: "links" },
  { id: "link-genius", title: "AI Link Suggestions", desc: "Analyze normalized content, track link data and highlight internal linking opportunities.", icon: "link", active: true, wordpressSource: "AI Link Genius", nextEquivalent: "Content graph analyzer", native: true, settingsView: "links" },
  { id: "llms-txt", title: "LLMS Txt", desc: "Serve a custom llms.txt file to guide AI models to your most important content.", icon: "bot", active: true, settingsView: "general-settings" },
  { id: "local-seo", title: "Local SEO", desc: "Optimize for local audiences and provide the entities required for the Knowledge Graph.", icon: "local-seo", active: true, settingsView: "titles-meta" },
  { id: "news-sitemap", title: "News Sitemap", desc: "Serve a dedicated XML news sitemap from the normalized editorial collection.", icon: "post", active: true, nextEquivalent: "XML Route Handler", native: true, settingsView: "sitemap" },
  { id: "podcast", title: "Podcast Feed", desc: "Generate a standards-based podcast RSS feed and associated episode metadata.", icon: "podcast", active: true, nextEquivalent: "XML Route Handler", native: true, settingsView: "integrations" },
  { id: "redirections", title: "Redirections", desc: "Redirect non-existent or moved content using 301, 302, 307, 410 and 451 responses.", icon: "redirection", active: true, settingsView: "redirections" },
  { id: "rich-snippet", title: "Schema (Structured Data)", desc: "Add Schema code that produces eligible rich search results and improves machine understanding.", icon: "schema", active: true, settingsView: "schema" },
  { id: "role-manager", title: "Authorization Manager", desc: "Map application roles to SEO capabilities enforced by your server-side auth provider.", icon: "role-manager", active: true, wordpressSource: "WordPress roles/capabilities", nextEquivalent: "Session authorization + typed permissions", native: true, settingsView: "role-manager" },
  { id: "seo-analysis", title: "SEO Analyzer", desc: "Analyze the website with 28+ technical and content tests.", icon: "analyzer", active: true, settingsView: "seo-analysis" },
  { id: "sitemap", title: "Sitemap", desc: "Generate XML and HTML sitemaps to help search engines crawl site content intelligently.", icon: "sitemap", active: true, settingsView: "sitemap" },
  { id: "video-sitemap", title: "Video Sitemap", desc: "Generate an XML sitemap for normalized video records and Video Search eligibility.", icon: "video", active: true, nextEquivalent: "XML Route Handler", native: true, settingsView: "sitemap" },
  { id: "web-stories", title: "Story SEO", desc: "Generate mobile-first story routes with Article metadata, cover images, slides, and Schema.", icon: "stories", active: true, wordpressSource: "Google Web Stories", nextEquivalent: "Story collection + /stories/[slug]", native: true, settingsView: "integrations" },
  { id: "woocommerce", title: "Commerce SEO", desc: "Normalize products from Shopify, Medusa, Stripe, Payload, or a database and emit complete Product/Offer Schema.", icon: "cart", active: true, wordpressSource: "WooCommerce", nextEquivalent: "Commerce adapter + /products/[slug]", native: true, settingsView: "integrations" },
  { id: "amp", title: "Core Web Vitals", desc: "Use Next.js Image, Font, caching, streaming, and minimal client JavaScript instead of the removed AMP runtime.", icon: "performance", active: true, wordpressSource: "AMP", nextEquivalent: "Next.js performance primitives", native: true, settingsView: "integrations" },
];

export const GENERAL_PANELS: SettingsPanel[] = [
  { id: "links", label: "Links", description: "Configure URL cleanup and external link behavior.", fields: [
    field("strip_category_base", "Remove Collection Route Prefix", "Flatten collection index URLs when your App Router structure permits it.", "toggle", false),
    field("redirect_attachments", "Redirect Media Detail Routes", "Redirect explicit media detail routes to their owning content or object-storage URL.", "toggle", true),
    field("redirect_orphan_attachments", "Unowned Media Destination", "Destination for media records that have no owning content record.", "text", "/"),
    field("nofollow_external", "Nofollow External Links", "Apply rel=nofollow to external links in rendered content.", "toggle", false),
    field("nofollow_image_links", "Nofollow Image File Links", "Apply nofollow to direct image file links.", "toggle", false),
    field("nofollow_domains", "Nofollow Domains", "Domains that should always receive rel=nofollow.", "textarea", ""),
    field("nofollow_exclude_domains", "Nofollow Exclude Domains", "Domains excluded from the global nofollow rule.", "textarea", ""),
    field("new_window_external", "Open External Links in New Tab/Window", "Add target=_blank and safe rel attributes to external links.", "toggle", true),
  ] },
  { id: "breadcrumbs", label: "Breadcrumbs", description: "Configure breadcrumb navigation and BreadcrumbList schema.", fields: [
    field("breadcrumbs", "Enable breadcrumbs function", "Expose the Next.js breadcrumb component and JSON-LD generator.", "toggle", true),
    field("breadcrumb_separator", "Separator Character", "Character displayed between breadcrumb items.", "select", "›", ["›", "-", "•", "/", "→"]),
    field("breadcrumb_home", "Show Homepage Link", "Include the homepage at the beginning of breadcrumbs.", "toggle", true),
    field("breadcrumb_home_label", "Homepage label", "Label used for the home breadcrumb.", "text", "Home"),
    field("breadcrumb_home_link", "Homepage Link", "Absolute URL for the homepage breadcrumb.", "text", "https://example.com"),
    field("breadcrumb_prefix", "Prefix Breadcrumb", "Optional text before the breadcrumb trail.", "text", ""),
    field("breadcrumb_archive", "Archive Format", "Format for archive breadcrumb labels.", "text", "Archives for %s"),
    field("breadcrumb_search", "Search Results Format", "Format for search result breadcrumbs.", "text", "Results for %s"),
    field("breadcrumb_404", "404 label", "Label shown for not-found routes.", "text", "Error 404: Page not found"),
    field("breadcrumb_hide_title", "Hide Post Title", "Exclude the current page title from the trail.", "toggle", false),
    field("breadcrumb_show_category", "Show Primary Collection", "Include the primary collection or topic in article breadcrumbs.", "toggle", true),
    field("breadcrumb_hide_taxonomy", "Hide Collection Namespace", "Remove the collection namespace from index breadcrumbs.", "toggle", false),
  ] },
  { id: "images", label: "Images", description: "Automate image ALT and title attributes.", fields: [
    field("image_alt", "Add missing ALT attributes", "Generate ALT text only when the source markup has none.", "toggle", true),
    field("image_alt_format", "Alt attribute format", "Variables: %filename%, %title%, %focuskw%, %sitename%.", "text", "%filename%"),
    field("image_title", "Add missing TITLE attributes", "Generate title attributes only when missing.", "toggle", false),
    field("image_title_format", "Title attribute format", "Variables: %filename%, %title%, %focuskw%, %sitename%.", "text", "%title% %count(title)%"),
  ] },
  { id: "webmaster", label: "Webmaster Tools", description: "Add verification tags for search and social platforms.", fields: [
    field("google_verify", "Google Search Console", "Verification code from Google Search Console.", "text", ""),
    field("bing_verify", "Bing Webmaster Tools", "Verification code from Bing Webmaster Tools.", "text", ""),
    field("baidu_verify", "Baidu Webmaster Tools", "Verification code from Baidu.", "text", ""),
    field("yandex_verify", "Yandex Verification ID", "Verification ID from Yandex Webmaster.", "text", ""),
    field("pinterest_verify", "Pinterest Verification ID", "Pinterest domain verification value.", "text", ""),
    field("norton_verify", "Norton Safe Web Verification ID", "Norton ownership verification value.", "text", ""),
    field("custom_webmaster", "Custom Webmaster Tags", "Additional complete meta tags to render in head.", "code", ""),
  ] },
  { id: "robots", label: "Edit robots.txt", description: "Manage crawler directives served from /robots.txt.", fields: [
    field("robots_content", "robots.txt Content", "Rules are served dynamically by the Next.js metadata route.", "code", "User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: https://example.com/sitemap.xml"),
  ] },
  { id: "others", label: "Others", description: "Headless, score display, tracking, and RSS settings.", fields: [
    field("headless_support", "Headless CMS Support", "Expose resolved SEO metadata from the headless API endpoint.", "toggle", true),
    field("show_score", "Show SEO Score to Visitors", "Render the public SEO score badge for selected content.", "toggle", false),
    field("score_post_types", "SEO Score Collections", "Content collections that may show a public score.", "multiselect", ["article"], ["article", "page", "product", "profile", "group", "forum", "story"]),
    field("score_template", "SEO Score Template", "Visual style for the public score.", "select", "circle", ["circle", "square"]),
    field("score_position", "SEO Score Position", "Automatic placement for the public score.", "select", "below-content", ["above-content", "below-content", "both", "custom"]),
    field("usage_tracking", "Usage Tracking", "Share anonymous product telemetry.", "toggle", false),
    field("rss_before", "RSS Before Content", "Content inserted before each feed item.", "textarea", ""),
    field("rss_after", "RSS After Content", "Content inserted after each feed item.", "textarea", "The post %POSTLINK% appeared first on %BLOGLINK%."),
  ] },
  { id: "404-monitor", label: "404 Monitor", description: "Configure not-found logging.", fields: [
    field("monitor_mode", "Mode", "Simple records URI and time; Advanced also records referrer and user agent.", "select", "advanced", ["simple", "advanced"]),
    field("monitor_limit", "Log Limit", "Maximum stored 404 records. Enter 0 for unlimited.", "number", 100),
    field("monitor_exclude", "Exclude Paths", "One path or regular expression per line.", "textarea", "/favicon.ico\n/robots.txt"),
    field("monitor_ignore_query", "Ignore Query Parameters", "Group URL variants that only differ by query string.", "toggle", true),
  ] },
  { id: "redirections", label: "Redirections", description: "Configure global redirect behavior.", fields: [
    field("redirect_debug", "Debug Redirections", "Show debugging information to authorized administrators.", "toggle", false),
    field("redirect_fallback", "Fallback Behavior", "Behavior when no matching redirect exists.", "select", "default", ["default", "homepage", "custom"]),
    field("redirect_custom_url", "Custom Url", "Fallback destination when custom behavior is selected.", "text", ""),
    field("redirect_default_type", "Redirection Type", "Default status for new redirects.", "select", "301", ["301", "302", "307", "410", "451"]),
    field("auto_post_redirect", "Auto Post Redirect", "Create a redirect when a published content slug changes.", "toggle", true),
  ] },
  { id: "analytics", label: "Analytics", description: "Configure Google data storage and reports.", fields: [
    field("analytics_database", "Analytics Data Adapter", "Persist imported performance data through the configured repository for dashboard queries.", "toggle", true),
    field("frontend_stats", "Frontend Stats Bar", "Show authorized users a performance bar on public pages.", "toggle", false),
    field("email_reports", "Email Reports", "Send periodic SEO performance reports.", "toggle", false),
    field("email_frequency", "Email Frequency", "Delivery cadence for reports.", "select", "30", ["7", "15", "30"]),
  ] },
  { id: "content-ai", label: "Content AI", description: "Default Content AI preferences.", fields: [
    field("content_ai_country", "Default Country", "Country used for research and keyword recommendations.", "select", "United States", ["Worldwide", "United States", "United Kingdom", "Canada", "Australia", "India"]),
    field("content_ai_tone", "Default Tone", "Default writing voice for generated suggestions.", "select", "Formal", ["Formal", "Conversational", "Friendly", "Professional"]),
    field("content_ai_audience", "Default Audience", "Primary audience for suggestions.", "text", "General audience"),
  ] },
  { id: "llms", label: "LLMS Txt", description: "Configure the generated /llms.txt file.", fields: [
    field("llms_post_types", "Select Content Collections", "Normalized content collections included in llms.txt.", "multiselect", ["article", "page"], ["article", "page", "product", "profile", "group", "forum", "story"]),
    field("llms_taxonomies", "Select Collection Indexes", "Collection and topic indexes included in llms.txt.", "multiselect", ["collection"], ["collection", "topic", "tag"]),
    field("llms_limit", "Posts/Terms Limit", "Maximum items from each selected collection.", "number", 100),
    field("llms_additional", "Additional Content", "Custom guidance appended to llms.txt.", "textarea", "## Contact\nFor questions, visit https://example.com/contact"),
  ] },
];

export const TITLES_PANELS: SettingsPanel[] = [
  { id: "global", label: "Global Meta", description: "Site-wide robots, separator, and social card defaults.", fields: [
    field("global_robots", "Robots Meta", "Default index and follow behavior.", "multiselect", ["index", "follow"], ["index", "noindex", "follow", "nofollow", "noarchive", "noimageindex", "nosnippet"]),
    field("advanced_robots", "Advanced Robots Meta", "Preview, snippet and video length directives.", "text", "max-snippet:-1, max-video-preview:-1, max-image-preview:large"),
    field("noindex_empty", "Noindex Empty Collection Indexes", "Prevent empty collection and topic indexes from entering search results.", "toggle", true),
    field("title_separator", "Separator Character", "Separator used by title templates.", "select", "-", ["-", "–", "—", "·", "•", "|", ">", "<"]),
    field("rewrite_titles", "Rewrite Titles", "Ensure the resolved title is emitted by the Next.js Metadata API.", "toggle", true),
    field("capitalize_titles", "Capitalize Titles", "Apply title casing to generated titles.", "toggle", false),
    field("opengraph_thumbnail", "OpenGraph Thumbnail", "Default social sharing image.", "image", "/rank-math/social-placeholder.jpg"),
    field("twitter_card", "Twitter Card Type", "Default X/Twitter card type.", "select", "summary_large_image", ["summary_large_image", "summary_card"]),
  ] },
  { id: "local", label: "Local SEO", description: "Knowledge Graph organization or person identity.", fields: [
    field("local_type", "Person or Company", "Entity represented by this website.", "select", "organization", ["organization", "person"]),
    field("website_name", "Website Name", "Name used by WebSite schema.", "text", "Example Company"),
    field("website_alt_name", "Website Alternate Name", "Short or alternate brand name.", "text", "Example"),
    field("knowledge_name", "Person/Organization Name", "Primary Knowledge Graph entity name.", "text", "Example Company"),
    field("local_description", "Description", "Short entity description.", "textarea", ""),
    field("local_logo", "Logo", "Square organization logo.", "image", "/rank-math/logo.svg"),
    field("local_url", "URL", "Canonical organization URL.", "text", "https://example.com"),
    field("local_email", "Email", "Public business contact email.", "text", "hello@example.com"),
    field("local_phone", "Phone", "Primary contact phone number.", "text", "+1-555-0100"),
    field("local_address", "Address", "Postal address for local business schema.", "textarea", "123 Market Street\nNew York, NY 10001"),
    field("business_type", "Business Type", "Most specific applicable LocalBusiness subtype.", "select", "Organization", ["Organization", "LocalBusiness", "ProfessionalService", "Store", "Restaurant"]),
    field("opening_hours", "Opening Hours", "One specification per line.", "textarea", "Monday-Friday 09:00-17:00"),
    field("price_range", "Price Range", "Approximate business price range.", "text", "$$"),
    field("about_page", "About Page", "Path of the official about page.", "text", "/about"),
    field("contact_page", "Contact Page", "Path of the official contact page.", "text", "/contact"),
  ] },
  { id: "social", label: "Social Meta", description: "Organization social profiles and Facebook settings.", fields: [
    field("facebook_page", "Facebook Page URL", "Official Facebook page.", "text", ""),
    field("facebook_author", "Facebook Authorship", "Default author profile URL.", "text", ""),
    field("facebook_admin", "Facebook Admin", "Numeric Facebook admin ID.", "text", ""),
    field("facebook_app", "Facebook App", "Facebook application ID.", "text", ""),
    field("facebook_secret", "Facebook Secret", "Facebook app secret.", "text", ""),
    field("twitter_username", "Twitter Username", "Username without the @ character.", "text", ""),
    field("additional_profiles", "Additional Profiles", "One official profile URL per line.", "textarea", ""),
  ] },
  { id: "homepage", label: "Homepage", description: "Search and social metadata for the homepage.", fields: [
    field("home_title", "Homepage Title", "Title template for the homepage.", "text", "%sitename% %sep% %sitedesc%"),
    field("home_description", "Homepage Meta Description", "Search description for the homepage.", "textarea", ""),
    field("home_robots", "Homepage Robots Meta", "Crawler directives for the homepage.", "multiselect", ["index", "follow"], ["index", "noindex", "follow", "nofollow", "noarchive", "nosnippet"]),
    field("home_facebook_title", "Homepage Title for Facebook", "Open Graph title for the homepage.", "text", ""),
    field("home_facebook_description", "Homepage Description for Facebook", "Open Graph description for the homepage.", "textarea", ""),
    field("home_facebook_image", "Homepage Thumbnail for Facebook", "Open Graph image for the homepage.", "image", "/rank-math/social-placeholder.jpg"),
  ] },
  { id: "authors", label: "Profiles", description: "Community profile route indexing and templates.", fields: [
    field("author_archives", "Profile Routes", "Enable generated profile routes from the auth/community adapter.", "toggle", true),
    field("author_base", "Profile Route Prefix", "Path prefix for public profile routes.", "text", "profile"),
    field("author_robots", "Profile Robots Meta", "Crawler directives for public profiles.", "multiselect", ["index", "follow"], ["index", "noindex", "follow", "nofollow"]),
    field("author_title", "Profile Title", "Title template for public profiles.", "text", "%name% %sep% %sitename%"),
    field("author_description", "Profile Description", "Description template for public profiles.", "textarea", "%user_description%"),
    field("author_slack", "Enhanced Sharing", "Add profile and activity details to supported social previews.", "toggle", true),
    field("author_controls", "Per-Profile SEO Controls", "Allow the community data adapter to provide SEO overrides.", "toggle", true),
  ] },
  { id: "misc", label: "Misc Pages", description: "Date archives, 404s, search results, and pagination.", fields: [
    field("date_archives", "Date Archives", "Enable date-based archive routes.", "toggle", false),
    field("date_title", "Date Archive Title", "Title template for date archives.", "text", "%date% %page% %sep% %sitename%"),
    field("date_description", "Date Archive Description", "Description for date archives.", "textarea", ""),
    field("date_robots", "Date Robots Meta", "Crawler directives for date archives.", "multiselect", ["noindex", "follow"], ["index", "noindex", "follow", "nofollow"]),
    field("title_404", "404 Title", "Title template for not-found pages.", "text", "Page not found %sep% %sitename%"),
    field("search_title", "Search Results Title", "Title template for internal search results.", "text", "%search_query% %page% %sep% %sitename%"),
    field("noindex_search", "Noindex Search Results", "Exclude internal search result pages.", "toggle", true),
    field("noindex_subpages", "Noindex Subpages", "Noindex paginated archive pages.", "toggle", false),
    field("noindex_paginated", "Noindex Paginated Single Pages", "Noindex multipage post continuations.", "toggle", false),
    field("noindex_password", "Noindex Password Protected Pages", "Exclude protected content.", "toggle", true),
  ] },
  ...["Articles", "Pages", "Products"].map((name) => ({ id: name.toLowerCase(), label: name, description: `Default search, schema, and social settings for ${name.toLowerCase()}.`, fields: [
    field(`${name.toLowerCase()}_title`, `Single ${name.slice(0,-1)} Title`, "Default title template.", "text", `%title% %sep% %sitename%`),
    field(`${name.toLowerCase()}_description`, `Single ${name.slice(0,-1)} Description`, "Default description template.", "textarea", "%excerpt%"),
    field(`${name.toLowerCase()}_schema`, "Schema Type", "Default schema type.", "select", name === "Products" ? "Product" : "Article", ["None", "Article", "BlogPosting", "NewsArticle", "Product", "Service", "WebPage"]),
    field(`${name.toLowerCase()}_robots`, `${name.slice(0,-1)} Robots Meta`, "Default crawler directives.", "multiselect", ["index", "follow"], ["index", "noindex", "follow", "nofollow"]),
    field(`${name.toLowerCase()}_links`, "Link Suggestions", "Show internal link suggestions while editing.", "toggle", true),
    field(`${name.toLowerCase()}_primary`, "Primary Collection", "Collection or topic used for breadcrumbs and canonical hierarchy.", "select", "collection", ["None", "collection", "topic", "tag"]),
    field(`${name.toLowerCase()}_facebook`, "Thumbnail for Facebook", "Default social image.", "image", "/rank-math/social-placeholder.jpg"),
    field(`${name.toLowerCase()}_bulk`, "Bulk Editing", "Permit bulk SEO metadata editing.", "toggle", true),
    field(`${name.toLowerCase()}_controls`, "Add SEO Controls", "Show Rank Math controls in the content editor.", "toggle", true),
  ] } as SettingsPanel)),
  ...["Collections", "Topics"].map((name) => ({ id: name.toLowerCase(), label: name, description: `Metadata defaults for ${name.toLowerCase()} indexes.`, fields: [
    field(`${name.toLowerCase()}_title`, `${name} Archive Titles`, "Archive title template.", "text", `%term% %sep% %sitename%`),
    field(`${name.toLowerCase()}_description`, `${name} Archive Descriptions`, "Archive description template.", "textarea", "%term_description%"),
    field(`${name.toLowerCase()}_robots`, `${name} Archives Robots Meta`, "Archive crawler directives.", "multiselect", ["index", "follow"], ["index", "noindex", "follow", "nofollow"]),
    field(`${name.toLowerCase()}_slack`, "Slack Enhanced Sharing", "Add enhanced sharing details.", "toggle", true),
    field(`${name.toLowerCase()}_controls`, "Add SEO Controls", "Allow per-term SEO overrides.", "toggle", true),
    field(`${name.toLowerCase()}_schema_remove`, "Remove Snippet Data", "Remove automatic schema from these archives.", "toggle", false),
  ] } as SettingsPanel)),
];

export const SITEMAP_PANELS: SettingsPanel[] = [
  { id: "general", label: "General", description: "Core XML sitemap generation settings.", fields: [
    field("sitemap_links", "Links Per Sitemap", "Maximum number of URLs in each sitemap file.", "number", 200),
    field("sitemap_images", "Images in Sitemaps", "Include images discovered in content.", "toggle", true),
    field("sitemap_featured", "Include Featured Images", "Include featured images even when absent from content.", "toggle", true),
    field("sitemap_exclude_posts", "Exclude Content", "Comma-separated normalized record IDs or paths.", "textarea", ""),
    field("sitemap_exclude_terms", "Exclude Collection Indexes", "Comma-separated collection/topic IDs or paths.", "textarea", ""),
  ] },
  { id: "html", label: "HTML Sitemap", description: "Public human-readable sitemap settings.", fields: [
    field("html_sitemap", "HTML Sitemap", "Enable the generated HTML sitemap component.", "toggle", true),
    field("html_format", "Display Format", "Render using a reusable React component or a dedicated App Router page.", "select", "page", ["component", "page"]),
    field("html_page", "Page", "Path for the HTML sitemap.", "text", "/sitemap"),
    field("html_sort", "Sort By", "Sort sitemap entries.", "select", "published", ["published", "modified", "alphabetical"]),
    field("html_dates", "Show Dates", "Display published or modified dates.", "toggle", true),
    field("html_titles", "Item Titles", "Use SEO titles or content titles.", "select", "seo", ["seo", "content"]),
  ] },
  { id: "authors", label: "Profiles", description: "Community profile sitemap options.", fields: [
    field("author_sitemap", "Include in Sitemap", "Include public, indexable profile routes.", "toggle", true),
    field("author_html_sitemap", "Include in HTML Sitemap", "Include public profile links in the HTML sitemap.", "toggle", false),
    field("author_without_posts", "Include Profiles Without Activity", "Include public profiles with no published activity.", "toggle", false),
    field("author_exclude_roles", "Exclude Application Roles", "Auth-provider roles excluded from the profile sitemap.", "multiselect", ["subscriber"], ["administrator", "editor", "author", "contributor", "subscriber"]),
    field("author_exclude_users", "Exclude Profiles", "Comma-separated profile IDs or slugs.", "text", ""),
  ] },
  ...["Articles", "Pages", "Products", "Collections", "Topics", "Groups", "Forums", "Stories"].map((name) => ({ id: `sitemap-${name.toLowerCase()}`, label: name, description: `Sitemap inclusion for ${name.toLowerCase()}.`, fields: [
    field(`sitemap_${name.toLowerCase()}`, "Include in Sitemap", "Include this collection in XML sitemaps.", "toggle", true),
    field(`html_${name.toLowerCase()}`, "Include in HTML Sitemap", "Include this collection in the HTML sitemap.", "toggle", true),
    ...(["Articles", "Pages", "Products", "Groups", "Forums", "Stories"].includes(name) ? [field(`image_fields_${name.toLowerCase()}`, "Media Field Mappings", "Adapter field names containing image or video URLs.", "textarea", "")] : [field(`empty_${name.toLowerCase()}`, "Include Empty Indexes", "Include indexes that have no public content.", "toggle", false)]),
  ] } as SettingsPanel)),
];

export const ALL_PANELS = [...GENERAL_PANELS, ...TITLES_PANELS, ...SITEMAP_PANELS];

export function createDefaultSettings() {
  return Object.fromEntries(ALL_PANELS.flatMap((panel) => panel.fields.map((item) => [item.id, item.defaultValue])));
}

export const DEMO_CONTENT: ContentRecord[] = [
  { id: "article-1", title: "How to Build a Content Strategy That Compounds", path: "/blog/content-strategy", type: "article", status: "published", seoTitle: "Content Strategy: A Practical Guide for Compounding Growth", description: "Learn how to build a content strategy that compounds through research, topic clusters, internal links, distribution and useful performance reviews.", focusKeyword: "content strategy", score: 86, schemaType: "Article", canonical: "https://example.com/blog/content-strategy", noindex: false, nofollow: false, customFields: { audience: "Product and marketing teams", editorialOwner: "Sam Reed", contentTier: "Pillar" }, content: "A useful content strategy creates a connected system where every strong article makes the next easier to discover.\n\n## Start with customer questions\n\nResearch the questions customers ask. Then organize those questions into durable topic clusters and connect related pages with useful internal links." },
  { id: "page-1", title: "About Example Company", path: "/about", type: "page", status: "published", seoTitle: "About Example Company", description: "Meet the team behind Example Company and learn how we help growing organizations build durable search visibility.", focusKeyword: "Example Company", score: 78, schemaType: "AboutPage", canonical: "https://example.com/about", noindex: false, nofollow: false, customFields: { foundingYear: "2022", teamSize: "12", specialty: "Search strategy" }, content: "Example Company helps teams build durable search visibility through technical excellence and useful content." },
  { id: "product-1", title: "SEO Strategy Intensive", path: "/services/seo-strategy", type: "product", status: "published", seoTitle: "SEO Strategy Intensive | Example Company", description: "A focused SEO strategy intensive covering technical foundations, content opportunities, schema and measurement.", focusKeyword: "SEO strategy", score: 92, schemaType: "Service", canonical: "https://example.com/services/seo-strategy", noindex: false, nofollow: false, customFields: { duration: "Two weeks", delivery: "Remote", priceBand: "Premium" }, content: "A focused engagement for teams that need a clear, prioritized SEO roadmap." },
];

export function createDefaultState(): RuntimeState {
  return {
    version: "1.0.275-next.1",
    mode: "advanced",
    connected: false,
    setupComplete: true,
    modules: Object.fromEntries(MODULES.map((module) => [module.id, module.active])),
    settings: createDefaultSettings(),
    redirects: [
      { id: "redirect-1", sources: ["/old-content-guide"], destination: "/blog/content-strategy", type: "301", status: "active", hits: 1284, lastAccessed: "2026-08-11T04:12:00.000Z" },
      { id: "redirect-2", sources: ["/seo-audit"], destination: "/services/seo-strategy", type: "301", status: "active", hits: 611, lastAccessed: "2026-08-10T20:44:00.000Z" },
      { id: "redirect-3", sources: ["/summer-event"], destination: "/events", type: "302", status: "inactive", hits: 93, lastAccessed: "2026-08-02T13:10:00.000Z" },
    ],
    monitor404: [
      { id: "404-1", uri: "/resources/seo-checklist.pdf", hits: 31, accessTime: "2026-08-11T05:17:00.000Z", referrer: "https://google.com/", userAgent: "Googlebot/2.1" },
      { id: "404-2", uri: "/blog/technical-audit", hits: 18, accessTime: "2026-08-11T03:42:00.000Z", referrer: "https://linkedin.com/", userAgent: "Mozilla/5.0" },
      { id: "404-3", uri: "/team/sam-reed", hits: 7, accessTime: "2026-08-10T18:03:00.000Z", referrer: "https://example.com/about", userAgent: "Mozilla/5.0" },
    ],
    indexingLog: [
      { id: "idx-1", url: "https://example.com/blog/content-strategy", action: "update", status: "success", response: "200 OK", createdAt: "2026-08-11T04:14:00.000Z" },
      { id: "idx-2", url: "https://example.com/services/seo-strategy", action: "update", status: "success", response: "200 OK", createdAt: "2026-08-10T20:45:00.000Z" },
    ],
    content: DEMO_CONTENT,
    roles: {
      administrator: ["dashboard", "general", "titles", "sitemap", "analysis", "analytics", "redirections", "role-manager", "content-ai"],
      editor: ["dashboard", "analysis", "analytics", "redirections", "content-ai"],
      author: ["analysis", "content-ai"],
      contributor: ["analysis"],
      subscriber: [],
    },
    adapters: structuredClone(DEFAULT_ADAPTER_CONNECTIONS),
    adapterData: structuredClone(DEMO_ADAPTER_DATA),
    updatedAt: new Date().toISOString(),
  };
}
