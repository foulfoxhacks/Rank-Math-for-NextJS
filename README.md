# Rank Math SEO 1.0.275 — Next.js Port

This project ports the Rank Math SEO 1.0.275 admin experience and SEO runtime to the Next.js App Router. It preserves Rank Math's information architecture and visual language while replacing every WordPress-only primitive with an explicit Next.js route, component, data contract, or provider adapter.

## Included

- Rank Math dashboard with Easy/Advanced modes and the complete adapted module catalog
- Setup Wizard, General Settings, Titles & Meta, Sitemap Settings, and Next.js Adapters
- Live SEO/readability scoring, focus keywords, snippet editing, robots, Schema, social previews, and typed custom fields
- Analytics, SEO Analyzer, Content AI, AI Visibility, IndexNow, 404 Monitor, redirects, link graph, Schema Templates, Authorization Manager, and Status & Tools
- Persistent module state, options, permissions, redirects, 404 records, indexing history, content, adapters, and normalized entities
- Next.js-native sitemaps, robots, LLMS, metadata, Open Graph, X cards, JSON-LD, redirects, 404 tracking, feeds, and protected scheduled work
- A 33-item WordPress-to-Next.js equivalence registry
- Native profile, group, forum, commerce, story, custom-field, feed, authorization, and scheduler adapters
- JSON import/export and a replaceable repository boundary
- Responsive Rank Math interface

## Start

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The local adapter initializes from defaults and writes changes to `data/runtime.json`.

## WordPress features are adapted—not renamed

The **Next.js Adapters** screen and `/api/rank-math/adapters` expose the full implementation matrix.

| WordPress capability | Next.js implementation |
| --- | --- |
| `wp_head` | `metadata`, `generateMetadata`, canonical, robots, Open Graph, and X cards |
| Plugin REST controllers | App Router Route Handlers using Web Request/Response APIs |
| `wp_options` and plugin tables | Typed `RuntimeState` repository boundary |
| Posts/custom post types | Provider-normalized typed content collections |
| postmeta / ACF | `customFields: Record<string, string>` analyzed and mapped into Schema |
| Categories/taxonomies | Explicit collection and topic models plus dynamic segments |
| BuddyPress | `/profile/[slug]` and `/groups/[slug]` with server metadata and Schema |
| bbPress | `/forum/[topicId]` with `DiscussionForumPosting` Schema |
| WooCommerce | `/products/[slug]` with Product, Offer, SKU, price, brand, and availability Schema |
| Web Stories | `/stories/[slug]` with story data, Article metadata, slides, and sitemap participation |
| Roles/capabilities | Auth-provider role to typed SEO-capability authorization |
| Nonces | Same-origin mutation checks plus optional server API token/session authorization |
| Rewrite rules | App Router dynamic segments and `proxy.ts` |
| WP-Cron | `CRON_SECRET`-protected `/api/rank-math/cron` plus `vercel.json` schedule |
| Shortcodes/widgets | Typed React components |
| RSS/podcast hooks | XML Route Handlers at `/feed.xml` and `/podcast.xml` |
| AMP | Next.js Image, Font, caching, streaming, and Core Web Vitals optimization |

Native records make every route testable immediately. An external adapter can be selected in the UI and given an endpoint ending with `{slug}` or a collection base URL. The resolver fetches normalized JSON server-side and uses native fallback data when a provider is unavailable.

## Runtime routes

| Route | Purpose |
| --- | --- |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt` | Search and AI crawler discovery |
| `/feed.xml`, `/podcast.xml` | Content and podcast RSS feeds |
| `/news-sitemap.xml`, `/video-sitemap.xml` | Specialized XML sitemaps |
| `/api/rank-math/state` | Read and update port state |
| `/api/rank-math/analyze` | Run Rank Math-style content assessments |
| `/api/rank-math/headless?path=/blog/content-strategy` | Metadata, Schema graph, and normalized SEO record |
| `/api/rank-math/adapters` | Equivalence registry, connections, and entity counts |
| `/api/rank-math/adapters?resource=products&slug=seo-strategy-intensive` | Adapter entity, metadata, and Schema |
| `/api/rank-math/authorize?role=editor&capability=analytics` | Permission authorization check |
| `/api/rank-math/cron` | Protected, idempotent scheduled score recalculation |
| `/api/rank-math/indexing` | IndexNow submission and history |
| `/api/rank-math/export` | Portable JSON export |
| `/profile/sam-reed` | Community profile replacement |
| `/groups/technical-seo` | Community group replacement |
| `/forum/technical-seo-audit` | Forum topic replacement |
| `/products/seo-strategy-intensive` | Commerce product replacement |
| `/stories/technical-seo-in-five-steps` | Mobile story replacement |

Public content is served at its stored path, such as `/blog/content-strategy`. Redirect rules execute before rendering, and unknown paths are recorded by the 404 Monitor.

## Production adapters

`lib/store.ts` is the repository boundary. Replace it with Postgres/Prisma, D1, KV, or a CMS while retaining the `RuntimeState` contract. The filesystem implementation is only for local development because a serverless deployment filesystem is not durable application storage.

Provider endpoint environment variables are available for community, forum, commerce, and story records. `RANK_MATH_ADMIN_TOKEN` protects programmatic mutations; normal applications should augment or replace it with their authenticated server session and call `hasSeoCapability`.

Set `INDEXNOW_KEY` for live IndexNow submission and `CRON_SECRET` for the scheduled route. Google Search Console/Analytics, Rank Math Content AI, and AI Visibility require their applicable credentials and service entitlement.

## Architecture references

- [Next.js dynamic metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)
- [Payload collections and fields](https://payloadcms.com/docs/configuration/collections)
- [Supabase Auth for Next.js](https://supabase.com/docs/guides/auth/quickstarts/nextjs)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront/latest)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Next.js 16 AMP replacement guidance](https://nextjs.org/learn/seo/amp)

## Verification

```powershell
npm run typecheck
npm run build
```

## License and provenance

The port is based on Rank Math SEO 1.0.275, licensed under GPL-3.0. See `NOTICE.md`. No Rank Math trademark ownership or official endorsement is claimed.
