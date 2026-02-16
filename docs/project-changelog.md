# Project Changelog

All notable changes to astro-seo-template are documented here.

## [2.0.0] - 2026-02-16

### UI/UX Pro Max Upgrade (Complete)

#### Phase Completion
- Phase 1: Premium Component System ✓
- Phase 2: Design Token OKLCH Palette ✓
- Phase 3: Typography & Section Rhythm ✓
- Phase 4: Glass Morphism & Gradients ✓
- Phase 5: Bento Layouts & Image Fallbacks ✓
- Phase 6: Content Beautification Framework ✓
- Phase 7: Component Catalog Documentation ✓

#### Added
- **Premium Components** (6): Highlight, FloatingBadge, BentoGrid/BentoItem, ImageWithFallback, DividerLine
- **Utility Components** (11): Alert, Banner, Blockquote, List, Logo, Metric, Pagination, PricingCard, Quote, Table, and more
- **64 Total Auto-Imported Components** across 6 categories (Premium, Content, Utility, Data, Product, Social)
- **OKLCH Color System:**
  - Primary: Teal (#178 hue, 0-13% chroma)
  - Secondary: Blue-grey (#240 hue, 0-11% chroma)
  - Accent: Amber (#75 hue, 4-19% chroma)
  - Neutral: Stone hex values
- **Typography System:** heading-hero through heading-small + body/prose styles
- **Section Rhythm Utilities:** section-compact (4.5rem), section-standard (6rem), section-spacious (7.5rem)
- **Glass Morphism CSS Variables:** --glass-bg, --glass-blur, --glass-border
- **Gradient System:** Primary, secondary, accent gradients for buttons and backgrounds
- **Component Catalog** (docs/component-catalog.md) as contract between template and ai-content-rewriter

#### Changed
- **Removed Dark Mode:** Eliminated all `.dark` selectors, reduced CSS size ~10%
- **Color Tokens:** Migrated from HSL to OKLCH for perceptually uniform scales
- **Component Patterns:** All components use design-token colors (no hardcoded values)
- **Spacing:** Switched to section-rhythm utilities instead of inline padding
- **Headings:** Use heading-* utility classes instead of inline text sizes

#### Removed
- Dark mode toggle component
- Dark mode CSS variables and `.dark` selectors
- All `dark:` Tailwind prefixes throughout codebase
- Dynamic theme preference localStorage logic

#### Component Improvements
- All interactive components: consistent rounded-xl, shadow transitions
- Buttons: gradient backgrounds with hover elevation
- Cards: shadow-sm→shadow-lg on hover, rounded-lg baseline
- Images: automatic fallback handling via ImageWithFallback
- Tables: redesigned with prose typography, responsive stacking
- Forms: 44px touch targets, focus-visible outlines

#### Files Changed
- 37 modified | 6 new components
- Build: 19 pages, ~1.2s, 0 errors
- Breaking: dark mode toggle removed (update layout imports)

---

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
