# Codebase Summary

## Project Overview

**astro-seo-template** is a premium, reusable Astro 5 template built for high-performance content sites. It features zero brand hardcode, 44 auto-imported MDX components, and enterprise-grade SEO infrastructure. Designed to integrate with the `web-cloner → ai-content-rewriter → astro-seo-template` pipeline.

**Core Tech Stack:**
- Astro 5 (static output for Cloudflare Pages)
- Tailwind CSS 4 via `@tailwindcss/vite`
- MDX for rich content (44 auto-imported components)
- Schema.org JSON-LD (3-tier structured data)
- Pagefind (full-text search)
- View Transitions with ClientRouter

## Directory Structure

```
astro-seo-template/
├── src/
│   ├── components/
│   │   ├── mdx/                # 44 auto-imported MDX components
│   │   ├── seo/                # SEO components (Head, Meta, Schema)
│   │   ├── ui/                 # Reusable UI primitives
│   │   ├── sections/           # Layout sections (header, footer, nav)
│   │   └── layout/             # Page layout wrappers
│   ├── content/
│   │   ├── blog/               # Blog posts (MDX)
│   │   ├── products/           # Product listings (MDX)
│   │   └── pages/              # Static pages (MDX)
│   ├── layouts/
│   │   ├── BlogLayout.astro    # Blog post wrapper
│   │   ├── ProductLayout.astro # Product page wrapper
│   │   └── PageLayout.astro    # Generic page wrapper
│   ├── pages/
│   │   ├── index.astro         # Homepage
│   │   ├── blog/               # Blog index & posts
│   │   ├── products/           # Product catalog
│   │   ├── search.astro        # Pagefind search page
│   │   ├── sitemap.xml.ts      # Auto-generated sitemap
│   │   └── rss.xml.ts          # Blog RSS feed
│   ├── lib/
│   │   ├── site-config.ts      # Parse site-config.json
│   │   ├── schema-builder.ts   # Build Schema.org JSON-LD
│   │   └── formatting.ts       # Date, slug utilities
│   └── styles/
│       ├── global.css          # @import tailwindcss + theme.css
│       └── theme.css           # AUTO-GENERATED from design-tokens.json
├── scripts/
│   ├── generate-theme.mjs      # Compile design-tokens.json → theme.css
│   └── validate-schema.mjs     # Validate Schema.org JSON
├── site-config.json            # Site identity (name, URL, nav, contact)
├── schema-org.json             # Schema.org organization, author data
├── design-tokens.json          # Colors, fonts, spacing, shadows
├── astro.config.mjs            # Astro 5 config with AutoImport, MDX
├── package.json                # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

## Configuration Files (JSON)

### `site-config.json`
Central hub for site-wide metadata and navigation. Controls:
- **site**: name, URL, description, language, default OG image
- **navigation**: header, footer links with grouping
- **social**: LinkedIn, Twitter, GitHub, contact URLs
- **contact**: email, phone, business address
- **features**: enable/disable pagefind, dark mode, animations

**Example:**
```json
{
  "site": {
    "name": "Client Corp",
    "url": "https://clientcorp.com",
    "description": "Industrial innovation since 1990"
  },
  "navigation": {
    "primary": [{ "label": "About", "href": "/about" }]
  }
}
```

### `schema-org.json`
Structured data for search engines. Defines:
- **organization**: name, logo, url, contact, social profiles
- **website**: name, url, search action
- **author**: name, avatar, bio (default author for content)

**Security Note:** All `</` in JSON-LD must be escaped to `<\/` to prevent script injection.

### `design-tokens.json`
Visual identity compiled to CSS. Contains:
- **colors**: oklch palettes (primary, neutral, accent, etc.) with shades
- **typography**: font families, sizes (sm/base/lg/xl/2xl)
- **spacing**: scale (xs through 3xl)
- **radius**: border radius scales
- **shadows**: elevation shadows (sm, md, lg, xl)
- **glass**: glassmorphism constants (bg, blur, border)
- **gradients**: hero, card, accent gradient definitions

## Content Collections

### Blog Posts (`src/content/blog/`)
**Schema:** title, description, publishDate, author, image, tags, draft, faq

Each post renders with:
- Metadata cards (author, date, read time)
- Table of contents
- Related posts links
- Newsletter subscription

### Products (`src/content/products/`)
**Schema:** title, description, image, specs, draft

Each product displays:
- Hero image with gallery
- Specification table
- Related products

### Pages (`src/content/pages/`)
**Schema:** title, description, contentType, draft, pipelineFields

**Content Types:** landing, generic, homepage, about, contact, product, product-list, blog-list, reviews, gallery, video-hub

Each page supports optional `pipelineFields` for ai-content-rewriter integration, enabling dynamic component orchestration while maintaining backward compatibility with static template content.

## Component Library (44 MDX Components)

All components are **auto-imported** via `astro-auto-import`. No import statements needed in MDX.

**7 Core Components Now Support Dual-API** (v1.1): Hero, AuthorBox, TOC, Callout, CTA, CTABlock, FAQ
- **Template API:** Direct MDX props (original behavior, backward compatible)
- **Pipeline API:** Rewriter pipeline integration fields (new workflow support)

### Content Components
Hero, AuthorBox, TOC, Callout, CTA, CTABlock, Stats, Steps, FAQ, Newsletter, LogoCloud, MdxImage

### Data & Interactive
CardGrid, Card, Testimonial, ComparisonTable, Tabs, PricingTable, Accordion, Modal, Tooltip, Drawer

### Product & Visual
SpecTable, Gallery, BeforeAfter, Counter, ProgressBar, CertBadges, FeatureGrid, ProcessFlow, StarRating, ReviewCard, PriceRange

### Social & Trust
SocialLinks, TrustBar, ClientLogos, WhatsAppButton, FloatingCTA, VideoEmbed, ContactForm, ScrollReveal, Timeline, TeamGrid

### New Utility Wrappers (v1.1)
Badge, BreadcrumbNav, Image

## SEO Infrastructure

**OpenGraph & Twitter Cards:** Auto-generated from frontmatter (title, description, image) on every page

**Canonical URLs:** Set per-page to prevent duplicate content penalties

**Sitemap:** `@astrojs/sitemap` auto-generates; filters draft pages

**RSS Feed:** Blog posts with full content, auto-discovery link in `<head>`

**Pagefind:** Full-text search index built on `npm run build`; accessible via `/search.astro`

**3-Tier Schema.org JSON-LD:**
1. **Organization** (site-wide): from `schema-org.json` (enriched with author image/sameAs)
2. **Auto-generated**: BlogPosting, Product, BreadcrumbList, HowTo per page (fixed breadcrumb Home position, page title for last item)
3. **Frontmatter**: Custom FAQ, Recipe, Review schemas via frontmatter

## Theme System

### Design Token Pipeline
```
design-tokens.json
    ↓
scripts/generate-theme.mjs (prebuild)
    ↓
src/styles/theme.css (@theme directive)
    ↓
src/styles/global.css (@import tailwindcss + theme.css)
```

### Tailwind CSS 4 Integration
- `@tailwindcss/vite` plugin in Astro config
- `@import "tailwindcss"` in global.css
- CSS custom properties via `@theme { --var: value; }`
- Utility-first workflow with design tokens

### Dark Mode
- **Implementation:** Class-based `.dark` selector
- **Toggle:** localStorage `theme-preference` (light/dark/system)
- **System Detection:** `prefers-color-scheme` media query fallback
- **Runtime Swap:** CSS custom variables for glass, gradients in `.dark`

## Deployment Model

### Fork-Per-Site
Each client gets independent repository fork:
- Custom branding via 3 JSON files
- Isolated Git history and versioning
- Deploy to Cloudflare Pages via `npm run build`

**Setup:**
1. Fork template repo
2. Update `site-config.json`, `schema-org.json`, `design-tokens.json`
3. Replace placeholder images in `public/images/`
4. Add content via `src/content/blog/`, `products/`, `pages/`

## Build Process

**Scripts:**
- `npm run dev`: Start dev server with hot reload
- `npm run build`: Compile Astro + generate theme + validate schema
- `npm run preview`: Preview production build locally

**Prebuild Hook:** `scripts/generate-theme.mjs` automatically runs to compile `design-tokens.json` → `theme.css`

## Key Libraries

| Package | Purpose |
|---------|---------|
| `astro` | Static site builder, routing, components |
| `astro-auto-import` | Auto-import MDX components (no manual imports) |
| `@astrojs/mdx` | MDX support for `.mdx` content files |
| `tailwindcss` + `@tailwindcss/vite` | CSS framework + Vite plugin |
| `@astrojs/sitemap` | Auto-generate sitemap.xml, filter drafts |
| `astro-pagefind` | Full-text search indexing |
| `typescript` | Type checking |

## Development Workflow

1. **Create Content:** Add `.mdx` files to `src/content/blog/`, `products/`, or `pages/`
2. **Use Components:** Auto-imported components available in MDX (no imports needed)
3. **Configure Site:** Edit `site-config.json`, `schema-org.json`, `design-tokens.json`
4. **Style:** Use Tailwind utilities + design token CSS variables
5. **Test:** `npm run build` validates Schema.org and compiles theme
6. **Deploy:** Push to GitHub; Cloudflare Pages auto-builds and deploys

## Common Patterns

**Adding a New MDX Component:**
1. Create `src/components/mdx/ComponentName.astro`
2. Add import to `astro.config.mjs` AutoImport list
3. Use in `.mdx` files without import statement

**Customizing Brand Colors:**
1. Edit `design-tokens.json` (colors.primary, colors.accent, etc.)
2. Run `npm run build` to regenerate `theme.css`
3. Colors automatically propagate to all components

**Adding a Blog Post:**
1. Create `src/content/blog/post-slug.mdx`
2. Add frontmatter: title, description, publishDate
3. Use auto-imported components in markdown body
4. Post auto-appears in blog index and RSS feed

**Dark Mode Toggle:**
Toggle happens client-side via localStorage; CSS variables swap automatically for glass, gradients, and dark-mode utilities.
