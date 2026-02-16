# Project Changelog

All notable changes to astro-seo-template are documented here.

## [1.1.0] - 2026-02-16

### Template Pipeline Alignment (Complete)

#### Added
- **Dual-API Support** for 7 core content components (Hero, AuthorBox, TOC, Callout, CTA, CTABlock, FAQ)
  - Template API: Original props-based approach, fully backward compatible
  - Pipeline API: New rewriter pipeline integration fields for ai-content-rewriter workflow
  - Both APIs coexist, allowing gradual migration of content

- **Content Routing & Collection Expansion**
  - Pages contentType enum expanded to 11 types: landing, generic, homepage, about, contact, product, product-list, blog-list, reviews, gallery, video-hub
  - Universal catch-all routing via `[slug].astro`
  - Removed redundant page files: about.astro, contact.astro, landing/[slug].astro
  - Added pipelineFields to all collection schemas for rewriter integration

- **New Utility Components**
  - Badge: Flexible tag/label component
  - BreadcrumbNav: SEO-friendly navigation with Schema.org markup
  - Image: Optimized image wrapper with lazy loading

- **Schema.org Enhancements**
  - HowTo schema builder for step-by-step guides
  - Fixed breadcrumb navigation (Home at position 1, page title for last item)
  - Enriched author schema with jobTitle, sameAs, and image fields
  - Added ogTitle, ogDescription, and category support for OpenGraph

- **UI/UX Improvements**
  - :focus-visible styles (WCAG 2.1 AA compliance)
  - 44px touch targets for all interactive elements
  - Skip-to-content link for keyboard navigation
  - cursor-pointer on clickable cards
  - Font preload hint in document head

#### Updated
- Auto-import configuration for 7 new wrapper components
- schema-org.json authors with image and sameAs URLs
- site-config.json navigation structure
- astro.config.mjs site URL set to production

#### Files Changed
- 14 modified | 3 new
- Build: 19 pages, 1.14s, 0 errors

### Performance & Accessibility
- Maintained zero-error build state
- Improved WCAG 2.1 AA compliance with focus styles and touch targets
- Sub-2s build time maintained

---

## [1.0.0] - Initial Release

### Core Features
- Astro 5 static site generation
- Tailwind CSS 4 with design token compilation
- 44 auto-imported MDX components
- 3-tier Schema.org JSON-LD infrastructure
- Dark mode (class-based, localStorage)
- Pagefind full-text search
- Content collections (blog, products, pages)
- Sitemap and RSS feed auto-generation
- Cloudflare Pages deployment ready
