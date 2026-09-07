# Rank Math SEO 1.0.275 - Next.js Port

An independent port of the **Rank Math SEO 1.0.275** admin experience and SEO runtime concepts to the **Next.js App Router**.

**Maintained by [Sammy The Femboy Puppy](https://akasammythepuppy.me/)** · [web/search development portfolio](https://akasammythepuppy.me/work/)

> This repository is an independent project. It does not claim Rank Math trademark ownership or official endorsement. Original provenance and GPL licensing information are preserved in `NOTICE.md`.

## Included

- Easy and Advanced dashboard modes
- adapted Rank Math module catalog
- Setup Wizard
- General Settings
- Titles & Meta
- Sitemap Settings
- Next.js Adapters
- live SEO/readability scoring
- focus keywords
- snippet editing
- robots controls
- Schema
- social previews
- typed custom fields
- Analytics
- SEO Analyzer
- Content AI surfaces
- AI Visibility surfaces
- IndexNow
- 404 Monitor
- redirects
- link graph
- Schema Templates
- Authorization Manager
- Status & Tools
- persistent module/options/runtime state
- Next.js-native sitemap, robots, metadata, Open Graph, X cards and JSON-LD output
- feeds, specialized sitemaps and protected scheduled work
- WordPress-to-Next.js equivalence registry
- provider-normalized profile, group, forum, commerce and story records
- JSON import/export
- replaceable repository boundary

## Start locally

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000
```

The local adapter initializes from defaults and writes development state to `data/runtime.json`.

## WordPress capabilities mapped to Next.js

| WordPress capability | Next.js implementation |
| --- | --- |
| `wp_head` | `metadata`, `generateMetadata`, canonical, robots, Open Graph, X cards |
| Plugin REST controllers | App Router Route Handlers |
| `wp_options` / plugin tables | typed `RuntimeState` repository boundary |
| Posts / custom post types | provider-normalized content collections |
| postmeta / ACF | `customFields: Record<string, string>` analyzed and mapped into Schema |
| Categories / taxonomies | explicit collection and topic models |
| BuddyPress | `/profile/[slug]` and `/groups/[slug]` with server metadata and Schema |
| bbPress | `/forum/[topicId]` with `DiscussionForumPosting` Schema |
| WooCommerce | `/products/[slug]` with Product/Offer data and Schema |
| Web Stories | `/stories/[slug]` with story data and Article metadata |
| Roles / capabilities | auth-provider role to typed SEO capability authorization |
| Nonces | same-origin mutation checks plus optional server token/session authorization |
| Rewrite rules | App Router dynamic segments and `proxy.ts` |
| WP-Cron | protected `/api/rank-math/cron` plus `vercel.json` schedule |
| Shortcodes / widgets | typed React components |
| RSS / podcast hooks | XML Route Handlers |
| AMP-era optimization concerns | Next.js Image, Font, caching, streaming and CWV-focused implementation |

## Runtime routes

| Route | Purpose |
| --- | --- |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt` | discovery surfaces |
| `/feed.xml`, `/podcast.xml` | RSS feeds |
| `/news-sitemap.xml`, `/video-sitemap.xml` | specialized XML sitemaps |
| `/api/rank-math/state` | read/update port state |
| `/api/rank-math/analyze` | content assessments |
| `/api/rank-math/headless?path=...` | metadata, Schema graph and normalized SEO record |
| `/api/rank-math/adapters` | implementation registry and adapter information |
| `/api/rank-math/authorize` | capability authorization check |
| `/api/rank-math/cron` | protected scheduled score recalculation |
| `/api/rank-math/indexing` | IndexNow submission and history |
| `/api/rank-math/export` | portable JSON export |
| `/profile/[slug]` | profile/community replacement surface |
| `/groups/[slug]` | group replacement surface |
| `/forum/[topicId]` | forum replacement surface |
| `/products/[slug]` | commerce replacement surface |
| `/stories/[slug]` | story replacement surface |

## Production adapters

`lib/store.ts` is the repository boundary.

Replace the local filesystem implementation with a durable production store such as Postgres/Prisma, D1, KV, or a CMS while retaining the `RuntimeState` contract.

The local filesystem implementation is for development only and should not be treated as durable serverless persistence.

Environment integration points include:

- external provider endpoints
- `RANK_MATH_ADMIN_TOKEN`
- `INDEXNOW_KEY`
- `CRON_SECRET`
- applicable Google Search Console / Analytics credentials
- any independently entitled AI/service credentials

Production applications should use their authenticated server session and typed capability checks rather than treating a static admin token as the entire authorization system.

## Verification

```powershell
npm run typecheck
npm run build
```

## Architecture references

- [Next.js dynamic metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)
- [Payload collections and fields](https://payloadcms.com/docs/configuration/collections)
- [Supabase Auth for Next.js](https://supabase.com/docs/guides/auth/quickstarts/nextjs)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront/latest)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

## License and provenance

The port is based on Rank Math SEO 1.0.275 and is distributed under GPL-3.0 terms as documented by the repository. See `NOTICE.md` for attribution/provenance details.

No official Rank Math endorsement is claimed.

## Creator and maintenance

This Next.js port is maintained by **[Sammy The Femboy Puppy](https://akasammythepuppy.me/)** (`@foulfoxhacks`).

More web-development and technical-search work is documented in **[Sammy's Work & Skills Portfolio](https://akasammythepuppy.me/work/)**.

For project-specific issues, [open an issue](https://github.com/foulfoxhacks/Rank-Math-for-NextJS/issues).
