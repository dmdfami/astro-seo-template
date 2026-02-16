# SEO & Schema.org Audit Report

**Date:** 2026-02-16
**Template:** astro-seo-template
**Evaluated against:** ai-content-rewriter v6.0 SKILL.md requirements
**Verdict:** 24/37 checks pass. 6 CRITICAL gaps block TOP 1 Google.

---

## Summary

| Category | Pass | Partial | Missing | Total |
|----------|------|---------|---------|-------|
| Tier 1: Global Schema | 2 | 0 | 0 | 2 |
| Tier 2: Page Schema | 3 | 1 | 1 | 5 |
| Tier 3: Frontmatter Flow | 1 | 0 | 0 | 1 |
| SEO Meta Tags | 8 | 3 | 6 | 17 |
| Content Type Routing | 3 | 1 | 1 | 5 |
| Frontmatter Compatibility | 7 | 2 | 5 | 14 |
| **TOTAL** | **24** | **7** | **13** | **44** |

---

## Tier 1: Global Schema

| Check | Status | Notes |
|-------|--------|-------|
| Organization schema from `schema-org.json` | **PASS** | BaseLayout L30-38 builds Organization with name, url, logo, sameAs, contactPoint |
| WebSite schema from `schema-org.json` | **PASS** | BaseLayout L40-45 builds WebSite with name, url |

Both injected as `<script type="application/ld+json">` in `<head>`. Correct.

**Issue (minor):** WebSite schema missing `potentialAction` with SearchAction — this enables Google sitelinks searchbox. Not a hard requirement but a missed rich result.

---

## Tier 2: Page-Specific Schema

| Check | Status | Notes |
|-------|--------|-------|
| blog -> Article schema | **PASS** | SchemaRenderer `buildArticleSchema()` — headline, description, image, dates, author (Person), publisher (Organization), mainEntityOfPage. Uses `schemaOrg.authors` lookup. |
| product -> Product schema | **PASS** | SchemaRenderer `buildProductSchema()` — name, description, image, brand, additionalProperty from `specs`. |
| FAQ detected -> FAQPage schema | **PASS** | SchemaRenderer checks `frontmatter.faq?.length` and calls `buildFAQSchema()` — correct Question/Answer structure. |
| HowTo detected -> HowTo schema | **MISSING** | **No HowTo schema builder exists.** SchemaRenderer has no `buildHowToSchema()`. No `steps` field check. The `steps:` frontmatter field required by ai-content-rewriter has zero schema support. |
| BreadcrumbList schema | **PARTIAL** | `buildBreadcrumb()` exists and auto-generates from URL path segments. However, names are derived from URL slug (`part.replace(/-/g, ' ')`) rather than actual page titles — produces ugly breadcrumb names like "Film Faced Plywood" instead of proper titles. Also, breadcrumb is missing "Home" as position 1. |

### CRITICAL: SchemaRenderer placement bug

SchemaRenderer is rendered inside `<body>` (default slot), NOT in `<head>` via the `schema` named slot. BaseLayout has `<slot name="schema" />` in `<head>` (L99) but blog/product pages do:

```astro
<BaseLayout ...>
  <SchemaRenderer ... />  <!-- Goes to default slot = <body> -->
```

Should be:
```astro
<SchemaRenderer slot="schema" ... />
```

**Impact:** JSON-LD works in body per spec, but Google recommends `<head>` placement. More importantly, the `<slot name="schema" />` in `<head>` is unused dead code — confusing for maintenance.

---

## Tier 3: Frontmatter -> Schema Flow

| Check | Status | Notes |
|-------|--------|-------|
| Only frontmatter data fields (no JSON-LD in MDX) | **PASS** | MDX files contain only YAML frontmatter. SchemaRenderer reads `frontmatter` prop and generates JSON-LD. ai-content-rewriter `frontmatter-builder.cjs` outputs `faq:`, `steps:`, `specs:` as data fields — matches this paradigm. |

---

## SEO Meta Tags

| Check | Status | Notes |
|-------|--------|-------|
| Title tag: dynamic, keyword-optimized | **PASS** | OpenGraph.astro generates `<title>` via `generateMetaTitle()`. Truncates at 60 chars. Appends site name with `|` separator. |
| Meta description: 120-160 chars | **PASS** | `generateMetaDescription()` truncates at 160. ai-content-rewriter targets 120-160 range. Match. |
| Canonical URL on every page | **PASS** | `<link rel="canonical">` in OpenGraph.astro using `getCanonicalURL()`. Built from `siteConfig.site.url` + pathname. |
| OpenGraph tags | **PASS** | og:type, og:url, og:title, og:description, og:image, og:site_name all present. Article metadata (published_time, modified_time, author, tags) conditional on type. |
| Twitter Cards | **PASS** | summary_large_image card with url, title, description, image, site handle. |
| Robots meta tags | **PASS** | `<meta name="robots" content="index, follow" />` in OpenGraph.astro. |
| Mobile viewport meta tag | **PASS** | `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` in BaseLayout. |
| XML Sitemap | **PASS** | `@astrojs/sitemap` integration in astro.config.mjs. Generates sitemap-index.xml. Filter excludes `/draft/`. |
| RSS feed for blog | **PARTIAL** | `rss.xml.ts` exists with title, description, pubDate, link. Missing: `content` field (full article HTML), `author` field, `categories` field. Thin RSS hurts syndication and AI citation. |
| Hreflang (multi-language) | **MISSING** | Zero hreflang support anywhere. `schema-org.json` has `availableLanguage: ["en", "vi", "hi"]` but no hreflang links generated. If the site only serves English, this is acceptable. But `contactPoint.availableLanguage` suggests multilingual intent. |
| Breadcrumb with BreadcrumbList schema | **PARTIAL** | Visual Breadcrumb component exists. Schema BreadcrumbList auto-generated. But two issues: (1) breadcrumb names from slugs not titles, (2) missing "Home" as first item. |
| Image alt text support | **PARTIAL** | `image.alt` field in blog/product collections. Product page uses `loading="lazy"`. But no enforcement — alt is optional in schema (`z.object({...}).optional()`). |
| Semantic HTML (h1-h6, article, nav, main, footer) | **PASS** | `<header>`, `<main>`, `<footer>`, `<article>`, `<nav aria-label="Breadcrumb">` all present. Heading hierarchy correct: single h1 per page. |
| Core Web Vitals optimization | **MISSING** | Google Fonts loaded via external CSS link (render-blocking). No `font-display: swap`. No preload for critical assets. No explicit image width/height for CLS prevention (except AuthorBox). Product images have `loading="lazy"` but blog images don't specify dimensions. |
| Structured data for FAQ pages | **PASS** | (covered in Tier 2) |
| Structured data for HowTo pages | **MISSING** | (covered in Tier 2) |
| Structured data for Product pages | **PASS** | (covered in Tier 2) |
| Author schema / AuthorBox component | **MISSING** | AuthorBox MDX component exists for visual display. But: (1) No Person schema generated for the author page/profile, (2) Article schema has basic author but no `sameAs`, `jobTitle`, `image`, (3) `authorCredentials` frontmatter field from ai-content-rewriter NOT in content.config.ts schema, (4) AuthorBox not auto-injected in blog template — relies on MDX author manually adding it. |
| ogTitle / ogDescription frontmatter override | **MISSING** | OpenGraph.astro always uses `generateMetaTitle(title)` and `generateMetaDescription(description)`. No support for separate `ogTitle`/`ogDescription` fields that ai-content-rewriter outputs. OG title/desc should be different from page title/meta desc for optimal social sharing. |

---

## Content Type Routing

| Check | Status | Notes |
|-------|--------|-------|
| homepage contentType -> `index.astro` | **PASS** | `index.astro` filters `contentType === 'homepage'` from pages collection. |
| landing contentType -> `landing/[slug].astro` | **PASS** | Filters `contentType === 'landing'`. |
| generic contentType -> `[slug].astro` | **PASS** | Filters `contentType === 'generic'`. |
| blog contentType routing | **PARTIAL** | Blog has its own collection and route `/blog/[slug]`. But `contentType` is hardcoded to `z.literal('blog').default('blog')` — no sub-type support (pillar, cluster, how-to, listicle, comparison, case-study). Sub-types affect layout, CTA count, word count targets. |
| product contentType routing | **PASS** | Products collection with `/products/[slug]` route. `contentType` defaults to 'product'. |

**Missing page types from ai-content-rewriter registry:**
- `about` — hardcoded astro page, not MDX-driven
- `contact` — hardcoded astro page, not MDX-driven
- `product-list` — exists as `products/index.astro` but not MDX-driven
- `blog-list` — exists as `blog/index.astro` but not MDX-driven
- `reviews` — no support
- `gallery` — no support
- `video-hub` — no support

These 7 missing types are LOW priority — ai-content-rewriter primarily generates blog/landing/product/homepage content.

---

## Frontmatter Compatibility

Comparing ai-content-rewriter frontmatter template fields vs content.config.ts Zod schema:

### Blog Collection

| Field | ai-content-rewriter | content.config.ts | Status |
|-------|---------------------|-------------------|--------|
| title | Required | `z.string()` | **PASS** |
| description | Required | `z.string()` | **PASS** |
| slug | From filename | Derived from file path (Astro Content Layer) | **PASS** |
| author | Required | `z.string().default('default')` | **PASS** |
| authorCredentials | Required | NOT in schema | **MISSING** |
| publishDate | Required | `z.coerce.date()` | **PASS** |
| updatedDate | Optional | `z.coerce.date().optional()` | **PASS** |
| category | Required | NOT in schema | **MISSING** |
| tags | Required | `z.array(z.string()).default([])` | **PASS** |
| image.src | Required | `z.object({src, alt}).optional()` | **PASS** |
| image.alt | Required | In image object | **PASS** |
| ogTitle | Optional | NOT in schema | **MISSING** |
| ogDescription | Optional | NOT in schema | **MISSING** |
| canonical | Optional | NOT in schema (auto-derived from URL) | **PARTIAL** — auto-derived works for most cases but no override for cross-domain canonicals |
| lang | Optional | NOT in schema (global from site-config) | **PARTIAL** — site-wide lang works if monolingual |
| contentType | Required | `z.literal('blog').default('blog')` | **PASS** |
| faq | Optional | `z.array(z.object({q, a})).optional()` | **PASS** |
| steps | Optional | NOT in schema | **MISSING** |
| specs | N/A for blog | N/A | N/A |

### Products Collection

| Field | Status | Notes |
|-------|--------|-------|
| specs | **PASS** | `z.record(z.string()).optional()` |
| faq | **MISSING** | Products schema has no `faq` field — products with FAQs won't generate FAQPage schema |
| publishDate | **MISSING** | Products have no date fields — cannot generate datePublished/dateModified in Product schema |
| author | **MISSING** | Products have no author field |
| tags | **MISSING** | Products have no tags field |

### Pages Collection

| Field | Status | Notes |
|-------|--------|-------|
| image | **MISSING** | Pages schema has no `image` field — landing/homepage can't set og:image |
| faq | **MISSING** | Pages schema has no `faq` field |
| steps | **MISSING** | Pages schema has no `steps` field |
| author | **MISSING** | Pages schema has no `author` field |

---

## Critical Gaps (MUST FIX for TOP 1 Google)

### 1. HowTo Schema Missing (HIGH IMPACT)
- **Gap:** No `buildHowToSchema()` in SchemaRenderer. No `steps` field in blog content.config.ts.
- **Impact:** How-to articles lose rich snippet eligibility. Google shows step-by-step rich results for HowTo markup — significant CTR boost.
- **Fix:** Add `steps: z.array(z.object({name: z.string(), text: z.string()})).optional()` to blog schema. Add `buildHowToSchema()` to SchemaRenderer that checks `frontmatter.steps?.length`.

### 2. SchemaRenderer in Body, Not Head (MEDIUM-HIGH IMPACT)
- **Gap:** JSON-LD scripts render in `<body>` instead of `<head>` via the named slot.
- **Impact:** Works but suboptimal. Google processes both, but head placement is recommended practice.
- **Fix:** Add `slot="schema"` to all `<SchemaRenderer>` usages in blog/product pages.

### 3. Missing ogTitle/ogDescription Frontmatter Override (MEDIUM IMPACT)
- **Gap:** ai-content-rewriter outputs `ogTitle` (<=60 chars) and `ogDescription` (<=155 chars) — template ignores them.
- **Impact:** Social sharing uses truncated page title instead of optimized OG copy. Reduces click-through from social/AI platforms.
- **Fix:** Add `ogTitle`/`ogDescription` to content schemas. Update OpenGraph.astro to prefer `ogTitle` over `title` when available.

### 4. Missing authorCredentials & Enriched Author Schema (MEDIUM IMPACT)
- **Gap:** `authorCredentials` field not in schema. Article schema has basic Person but no `jobTitle`, `sameAs`, `image`.
- **Impact:** E-E-A-T signal loss. Google heavily weighs author expertise for YMYL and commercial content. Author rich results require enriched Person schema.
- **Fix:** Add `authorCredentials` to blog schema. Extend `schema-org.json` authors with `role`/`credentials`/`image`/`sameAs`. Enrich `buildArticleSchema()` author with these fields.

### 5. Google Fonts Render-Blocking (MEDIUM IMPACT)
- **Gap:** External Google Fonts CSS in `<head>` without `font-display: swap` or preload strategy.
- **Impact:** Blocks first paint. Hurts LCP (Largest Contentful Paint) Core Web Vital. Google uses CWV as ranking signal.
- **Fix:** Add `&display=swap` to Google Fonts URL. Or self-host fonts with `font-display: swap` in CSS.

### 6. Missing `category` Field in Blog Schema (LOW-MEDIUM IMPACT)
- **Gap:** ai-content-rewriter outputs `category: "[Primary Category]"` — not in content.config.ts.
- **Impact:** Can't generate `article:section` OG meta, limits topical clustering signals.
- **Fix:** Add `category: z.string().optional()` to blog schema.

---

## Recommendations (Priority Order)

### P0 — Must Fix Before Content Generation

1. **Add `steps` field to blog schema + HowTo schema builder**
   - content.config.ts: add `steps` to blog collection
   - SchemaRenderer: add `buildHowToSchema()`
   - SchemaRenderer switch: check `frontmatter.steps?.length`

2. **Add missing frontmatter fields to content.config.ts**
   - Blog: `authorCredentials`, `category`, `ogTitle`, `ogDescription`, `steps`
   - Products: `faq`, `publishDate`, `updatedDate`, `author`, `tags`
   - Pages: `image`, `faq`, `steps`, `author`

3. **Fix SchemaRenderer slot placement**
   - `blog/[slug].astro`: `<SchemaRenderer slot="schema" ...>`
   - `products/[slug].astro`: `<SchemaRenderer slot="schema" ...>`

4. **Update OpenGraph.astro to support ogTitle/ogDescription overrides**
   - Accept optional `ogTitle`/`ogDescription` props
   - Use them for OG/Twitter meta when provided

### P1 — Should Fix for Competitive Edge

5. **Enrich author schema** — add jobTitle, sameAs, image to Person in Article schema
6. **Fix Google Fonts** — add `&display=swap` to URL, or self-host
7. **Fix Breadcrumb schema** — add "Home" as position 1, accept page titles instead of slug-derived names
8. **Add SearchAction to WebSite schema** — enables sitelinks searchbox
9. **Enrich RSS feed** — add `content`, `author`, `categories` fields

### P2 — Nice to Have

10. **Add `canonical` override to content schemas** — for cross-domain canonical support
11. **Add hreflang** — if multilingual content is planned
12. **Add `about` and `contact` as MDX-driven pages** — enables ai-content-rewriter to generate them
13. **Add blog sub-type field** — pillar/cluster/how-to/listicle/comparison/case-study for layout variations
14. **Explicit image dimensions** — for CLS prevention (width/height on all `<img>`)

---

## Unresolved Questions

1. Is the site intended to be multilingual? `contactPoint.availableLanguage: ["en", "vi", "hi"]` suggests yes, but there's zero i18n infrastructure. If yes, hreflang becomes P0.
2. Should `about.astro` and `contact.astro` be converted to MDX-driven pages from the `pages` collection? This would allow ai-content-rewriter to generate/rewrite them but requires migration work.
3. The `astro.config.mjs` has `site: 'https://example.com'` — this is placeholder. Must update to actual domain for sitemap and canonical URLs to work correctly in production. Not a schema issue but a deployment blocker.
4. Product schema has no `offers` (price/availability) — is pricing data available? Without it, Product rich results are limited.
5. Should `SchemaRenderer` also handle `landing` and `homepage` content types with specific schemas, or are Tier 1 (Organization + WebSite) sufficient for these?
