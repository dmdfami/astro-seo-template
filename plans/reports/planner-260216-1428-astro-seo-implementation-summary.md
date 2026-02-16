# Astro 5 SEO Template - Implementation Plan Summary

**Planner:** af52694
**Date:** 2026-02-16 14:28
**Status:** Complete
**Plan Directory:** `/Users/david/projects/astro-seo-template/plans/260216-1428-astro-seo-template-implementation/`

---

## Executive Summary

Created comprehensive 7-phase implementation plan for Astro 5 SEO Template project. Greenfield build targeting 100+ B2B/corporate websites. Zero hardcode architecture — all brand/visual identity via JSON config. Premium design with glassmorphism, gradients, animations. 51 MDX components, 15+ page templates, 3-tier Schema.org.

**Total Effort:** 40 hours
**Build Strategy:** Sequential foundation (Phase 1-2), parallel components/pages (Phase 3-4), sequential integration/test/sync (Phase 5-7)

---

## Research Foundation

Plan built on 3 research reports:
1. **Brainstorm** (260216-1408): Architecture decisions, component inventory, parallel build strategy, risk assessment
2. **Stack Research** (260216-1413): Astro 5 + Tailwind 4 integration, content collections, MDX auto-import
3. **Premium Template Research** (260216-1414): Glassmorphism, animations, Schema.org 3-tier, Pagefind, dark mode

---

## Phase Breakdown

### Phase 1: Foundation & Scaffold (6h)
**Status:** pending | **Priority:** P1

**Deliverables:**
- Astro 5 + Tailwind 4 + MDX + TypeScript scaffold
- Three JSON configs (design-tokens, site-config, schema-org)
- Content collections (blog, products, pages)
- Build script: design-tokens.json → theme.css
- BaseLayout with Organization + WebSite schema
- MDX auto-import setup

**Key Files:**
- `design-tokens.json` (colors, typography, spacing, glass, gradients)
- `site-config.json` (nav, social, contact, feature flags)
- `schema-org.json` (organization, website, authors)
- `scripts/generate-theme.mjs` (JSON → CSS build script)
- `src/content.config.ts` (content collections)
- `src/layouts/BaseLayout.astro` (HTML shell, schema tier 1)

**Success Criteria:**
- `npm run dev` starts without errors
- `theme.css` auto-generated from `design-tokens.json`
- Dark mode script prevents FOUC
- Zero build warnings

---

### Phase 2: Design System (5h)
**Status:** pending | **Priority:** P1

**Deliverables:**
- UI atomics: Button (6 variants), Input, Badge, Tag, Icon
- Layout: Header, Footer, Navigation, MobileMenu
- Section wrappers: Section, Container, Grid, Divider, Spacer
- Dark mode toggle (light/dark/system 3-state)
- View transitions with dark mode persistence
- Breadcrumb component

**Component Count:** 15

**Key Files:**
- `src/components/ui/` (Button, Input, Badge, Tag, Icon, ThemeToggle)
- `src/components/layout/` (Header, Footer, Navigation, MobileMenu)
- `src/components/sections/` (Section, Container, Grid, Divider, Spacer)
- `src/components/seo/Breadcrumb.astro`

**Success Criteria:**
- All 15 components render without errors
- Dark mode toggle persists across page navigations
- View transitions smooth between pages
- Lighthouse Accessibility 100

---

### Phase 3: MDX Components (12h)
**Status:** pending | **Priority:** P1

**Deliverables:**
- 51 MDX-compatible components
- Auto-imported via `astro-auto-import`
- Split across 4 parallel agents

**Component Distribution:**
- **Agent A (12):** Core Content - Hero, AuthorBox, TOC, Callout, CTA, CTABlock, Stats, Steps, FAQ, Newsletter, LogoCloud, Image
- **Agent B (11):** Data/Interactive - CardGrid, Card, Testimonial, ComparisonTable, Tabs, PricingTable, Accordion, Modal, Tooltip, Drawer
- **Agent C (11):** Product/Visual - SpecTable, Gallery, BeforeAfter, Counter, ProgressBar, CertBadges, FeatureGrid, ProcessFlow, StarRating, ReviewCard, PriceRange
- **Agent D (14):** Social/Trust - SocialLinks, TrustBar, ClientLogos, WhatsAppButton, FloatingCTA, VideoEmbed, ContactForm, ScrollReveal, Timeline, TeamGrid, Step, Tag, Divider, Spacer

**Key Files:**
- `src/components/mdx/*.astro` (51 components)
- Updated `astro.config.mjs` (all 51 components in auto-import)

**Success Criteria:**
- All 51 components render in MDX without manual imports
- Zero console errors
- All components work in light + dark mode
- Lighthouse Performance 90+

---

### Phase 4: Page Templates (8h)
**Status:** pending | **Priority:** P1

**Deliverables:**
- 15+ page templates
- Split across 3 parallel agents

**Template Distribution:**
- **Agent E (5):** Blog - BlogPost, BlogList, BlogCategory, BlogTag, RSS
- **Agent F (3):** Products - ProductPage, ProductList, ProductCategory
- **Agent G (8):** Core - HomePage, AboutPage, ContactPage, GenericPage, LandingPage, 404, SearchResults, SitemapHTML

**Key Files:**
- `src/pages/blog/` (5 templates)
- `src/pages/products/` (3 templates)
- `src/pages/` (8 core templates)
- `src/lib/pagination.ts` (helper)
- `src/components/seo/SchemaRenderer.astro` (auto-generate schema from frontmatter)

**Success Criteria:**
- All 15+ templates render without errors
- Blog pagination works (10 posts/page)
- RSS feed validates
- Schema.org markup validates
- Lighthouse SEO 100

---

### Phase 5: SEO Integration (4h)
**Status:** pending | **Priority:** P1

**Deliverables:**
- OpenGraph meta tags on all pages
- Canonical URLs
- XML sitemap (auto-generated)
- Robots.txt
- Pagefind search index
- Structured data validation

**Key Files:**
- `src/components/seo/OpenGraph.astro` (OG tags component)
- `src/lib/seo-utils.ts` (meta helpers)
- Updated `BaseLayout.astro` (OpenGraph, canonical)
- Updated `astro.config.mjs` (@astrojs/sitemap)
- `scripts/validate-schema.mjs` (testing script)

**Success Criteria:**
- Sitemap auto-generated at `/sitemap-index.xml`
- All pages have OpenGraph tags
- Schema.org validation passes (zero errors)
- Lighthouse SEO 100

---

### Phase 6: Test & Polish (3h)
**Status:** pending | **Priority:** P1

**Deliverables:**
- 5+ sample blog posts
- 3+ sample products
- 2+ sample pages
- Lighthouse audits (all pages)
- Responsive testing (320px → 1536px)
- Accessibility testing
- Cross-browser testing

**Key Files:**
- `src/content/blog/*.mdx` (sample posts)
- `src/content/products/*.mdx` (sample products)
- `scripts/lighthouse-audit.mjs` (automated audits)
- `scripts/test-responsive.mjs` (responsive testing)
- `scripts/test-a11y.mjs` (accessibility testing)

**Success Criteria:**
- Lighthouse Performance 90+, Accessibility 100, Best Practices 100, SEO 100
- Build time < 30s for 50-page site
- No horizontal scroll on any breakpoint
- Zero console errors/warnings

---

### Phase 7: Pipeline Sync (2h)
**Status:** pending | **Priority:** P1

**Deliverables:**
- Update ai-content-rewriter configs
- Remove import statements from output templates
- Component API reference
- Pipeline integration guide
- Full pipeline test

**Key Files:**
- `docs/component-api.md` (51 component APIs)
- `docs/pipeline-integration.md` (integration guide)
- `docs/migration-guide.md` (for existing content)
- `scripts/test-pipeline.sh` (end-to-end test)

**Success Criteria:**
- ai-content-rewriter outputs MDX with ZERO imports
- Pipeline test passes: web-cloner → rewriter → template (zero manual edits)
- Real content from Vietnam Plywood converts successfully

---

## Architecture Highlights

### Tech Stack
- **Astro 5**: Static site generator
- **Tailwind 4**: Via Vite plugin (NOT @astrojs/tailwind)
- **MDX**: All content, auto-imported components
- **TypeScript**: Strict mode

### Design Tokens Flow
```
design-tokens.json → build script → @theme CSS + :root/:dark runtime vars
```

### Content Collections
```
src/content.config.ts
├── blog (glob loader, MDX)
├── products (glob loader, MDX)
└── pages (glob loader, MDX)
```

### Schema.org 3-Tier
1. **Tier 1:** Organization + WebSite (every page via BaseLayout)
2. **Tier 2:** Article, Product, FAQ, HowTo (auto-generated via SchemaRenderer)
3. **Tier 3:** Raw schema (frontmatter passthrough for legacy support)

### View Transitions
- `<ClientRouter />` (NOT deprecated `<ViewTransitions />`)
- Dark mode persistence via `astro:after-swap` event

### Animations
- IntersectionObserver + CSS (zero JS bundle)
- Motion lib ONLY if Counter/ProgressBar need spring physics

### Dark Mode
- Class-based `.dark` with `@custom-variant dark`
- 3-state toggle: Light/Dark/System
- Inline `<head>` script prevents FOUC

---

## Success Metrics

1. **Lighthouse 100/100** on all page types
2. **Zero brand hardcode** — change 3 JSON files = completely new site
3. **Build time < 30s** for 50-page site
4. **All test articles render** — homepage, landing, blog
5. **Dark mode works** on every component
6. **Schema validation passes** on all page types

---

## Risk Mitigation

### High-Risk Items
- **51 components = scope creep**: Strict < 200 line limit, parallel agents
- **Schema validation errors**: Automated test script, manual validation
- **Content collections empty = build fails**: Add sample content in Phase 6, graceful empty state

### Medium-Risk Items
- **`astro-auto-import` unmaintained**: Fallback to `components` prop on `<Content />`
- **View transitions + dark mode flash**: `astro:after-swap` event re-applies theme
- **Import statements slip through pipeline**: Automated check in pipeline test

---

## Parallel Execution Strategy

### Phase 1-2: Sequential (Foundation)
Must complete before Phase 3-4. Single agent implementation.

### Phase 3-4: Parallel (Components + Pages)
**7 agents total:**
- 4 agents on Phase 3 (MDX components)
- 3 agents on Phase 4 (page templates)

Can run simultaneously after Phase 2 complete.

### Phase 5-7: Sequential (Integration)
Require Phase 3+4 complete. Single agent implementation.

---

## File Structure Summary

```
astro-seo-template/
├── design-tokens.json (colors, typography, spacing, glass, gradients)
├── site-config.json (nav, social, contact, feature flags)
├── schema-org.json (organization, website, authors)
├── astro.config.mjs (Vite TW plugin, auto-import, MDX, sitemap, pagefind)
├── scripts/
│   ├── generate-theme.mjs (JSON → CSS)
│   ├── validate-schema.mjs (testing)
│   ├── lighthouse-audit.mjs (performance)
│   └── test-pipeline.sh (end-to-end)
├── src/
│   ├── content.config.ts (blog, products, pages)
│   ├── content/
│   │   ├── blog/*.mdx
│   │   ├── products/*.mdx
│   │   └── pages/*.mdx
│   ├── styles/
│   │   ├── global.css
│   │   └── theme.css (auto-generated)
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   ├── mdx/ (51 components)
│   │   ├── layout/ (Header, Footer, Nav, MobileMenu)
│   │   ├── sections/ (Section, Container, Grid, Divider, Spacer)
│   │   ├── ui/ (Button, Input, Badge, Tag, Icon, ThemeToggle)
│   │   └── seo/ (SchemaRenderer, OpenGraph, Breadcrumb)
│   ├── pages/ (15+ templates)
│   └── lib/
│       ├── types.ts
│       ├── utils.ts
│       ├── pagination.ts
│       └── seo-utils.ts
├── docs/
│   ├── component-api.md
│   ├── pipeline-integration.md
│   └── migration-guide.md
└── public/
    ├── robots.txt
    └── images/
```

---

## Next Actions

1. **User approval** of this plan
2. **Phase 1 implementation**: Foundation scaffold (6h)
3. **Phase 2 implementation**: Design system (5h)
4. **Phase 3-4 parallel**: 7 agents on components + pages (12h + 8h = 20h total, ~12h wall time)
5. **Phase 5-7 sequential**: SEO + Test + Pipeline sync (9h)

---

## Plan Files Created

- ✅ `plan.md` - Overview with YAML frontmatter, phase status table
- ✅ `phase-01-foundation-scaffold.md` - Detailed scaffold steps
- ✅ `phase-02-design-system.md` - UI components, layout system
- ✅ `phase-03-mdx-components.md` - 51 MDX components, 4 agents
- ✅ `phase-04-page-templates.md` - 15+ page templates, 3 agents
- ✅ `phase-05-seo-integration.md` - OpenGraph, sitemap, schema validation
- ✅ `phase-06-test-polish.md` - Sample content, Lighthouse, responsive testing
- ✅ `phase-07-pipeline-sync.md` - ai-content-rewriter integration

**Total Plan Size:** 8 files, ~3200 lines of detailed implementation guidance

---

## Unresolved Questions

1. **Component API versioning**: Should we version-lock ai-content-rewriter to template version?
2. **Breaking changes**: How to handle component API changes between template versions?
3. **Migration automation**: Should we provide scripts for bulk content updates?
4. **CSS scroll-driven animations**: Worth using as progressive enhancement or wait for wider adoption?
5. **Motion lib**: Decide per-component or commit to one animation approach for all 51 components?

---

## References

- Plan Directory: `/Users/david/projects/astro-seo-template/plans/260216-1428-astro-seo-template-implementation/`
- Research Reports: `/Users/david/projects/astro-seo-template/plans/reports/`
- Work Context: `/Users/david/projects/astro-seo-template/` (GREENFIELD)
