# Brainstorm: Astro SEO Template Architecture

**Date:** 2026-02-16 | **Status:** Complete
**Research:** [Stack Research](researcher-260216-1413-astro5-tailwind4-stack-research.md) | [Premium Template Research](researcher-260216-1414-astro-premium-template-research.md)

---

## Problem Statement

Build a reusable Astro 5 template for 100+ B2B/corporate websites. Must integrate with existing pipeline: `web-cloner` → `ai-content-rewriter` → **this template**. Zero hardcode — all brand/visual identity via JSON config. Every page must look premium (glassmorphism, gradients, animations). ~51 MDX components, 15+ page templates, 3-tier Schema.org.

---

## Key Architecture Decisions

### 1. Tailwind CSS 4 Integration (CONFIRMED)

`@astrojs/tailwind` is **DEPRECATED**. Use Vite plugin:

```js
// astro.config.mjs
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  vite: { plugins: [tailwindcss()] },
});
```

**Design tokens flow:**
```
design-tokens.json → build script → src/styles/theme.css (@theme) → Tailwind utilities
                                   → :root / .dark (runtime-swappable)
```

Hybrid approach: `@theme` generates utility classes; `:root`/`.dark` handles runtime dark mode swap.

### 2. Content Collections (Astro 5 Content Layer)

Config in `src/content.config.ts` (NOT `src/content/config.ts` — Astro 5 change):

```ts
import { glob } from 'astro/loaders';
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({ /* frontmatter fields */ })
});
```

ALL content is `.mdx`. `.md` files are only human-readable copies from web-cloner, NOT used by template.

### 3. MDX Auto-Import (RECOMMENDED)

Use `astro-auto-import` to eliminate import statements in MDX:

```js
// astro.config.mjs
integrations: [
  AutoImport({ imports: ['./src/components/mdx/CTA.astro', ...] }),
  mdx(),  // AFTER AutoImport
  pagefind(),  // LAST
]
```

**Impact:** ai-content-rewriter output NO LONGER needs import lines. Cleaner MDX, more portable.

**Backward compat:** Also configure `@components` tsconfig alias for any existing content with imports.

### 4. Component Path Convention

```
src/components/
├── mdx/           ← 40+ MDX-usable components (auto-imported)
├── layout/        ← Header, Footer, Nav, Sidebar
├── sections/      ← Page section patterns (HeroSection, etc.)
├── ui/            ← Atomic: Button, Input, Badge, Icon
└── seo/           ← SchemaRenderer, OpenGraph, Breadcrumb
```

Auto-import ALL `mdx/*` components. Layout/UI/SEO imported explicitly in `.astro` files.

### 5. CTA Component API (UNIFIED)

Current test articles show 2 incompatible patterns. Solution — unified component:

```astro
<!-- Pattern A: Props-based (homepage/landing) -->
<CTA
  primary={{ text: "Get Quote", url: "/contact" }}
  secondary={{ text: "Catalog", url: "/products" }}
  note="Free shipping"
/>

<!-- Pattern B: Slot-based (inline) -->
<CTA href="/contact" variant="primary">Request Quote</CTA>
```

Component detects which pattern via `Astro.props.primary` presence.

### 6. Schema.org 3-Tier Architecture

| Tier | Scope | Source | Auto? |
|------|-------|--------|-------|
| 1 | Organization + WebSite | `schema-org.json` | Every page via BaseLayout |
| 2 | Article, Product, FAQ, HowTo, Breadcrumb | Frontmatter `contentType` + fields | Auto via SchemaRenderer |
| 3 | Raw schema (override) | Frontmatter `schema:` array | Pass-through (legacy support) |

**IMPORTANT:** Test articles have `schema:` array in frontmatter with full JSON-LD. Template should:
- If `contentType` present → auto-generate (Tier 2)
- If `schema:` array present → use as-is (Tier 3, backward compat)
- Never duplicate — prefer Tier 2 auto-generation

### 7. View Transitions

`<ClientRouter />` (NOT deprecated `<ViewTransitions />`). Re-init animations via `astro:page-load` + `astro:after-swap` for dark mode persistence.

### 8. UI Foundation: Custom Build (Not bejamas/ui)

**Reason:** bejamas/ui is copy-and-own but doesn't match our 51-component spec. Building custom ensures exact match with ai-content-rewriter output. Can reference bejamas patterns for atomic UI (Button, Input) but MDX components are custom.

### 9. Animations: IntersectionObserver + CSS

Zero JS bundle for animations. ScrollReveal component wraps `data-animate` attribute. Inline `<script>` (~500 bytes) handles IntersectionObserver. Motion lib ONLY if Counter/ProgressBar need spring physics.

### 10. Dark Mode: Class-based Toggle

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Inline `<head>` script prevents FOUC. Three-state toggle: Light/Dark/System.

---

## Component Inventory (51 total)

### Core Content (16) — from ai-content-rewriter
Hero, AuthorBox, TOC, Callout, CTA, CTABlock, Stats, Steps, Step, FAQ, Newsletter, Badge, Breadcrumb, Image, LogoCloud, Testimonial

### Data Display (8)
CardGrid, Card, ComparisonTable, Tabs, PricingTable, SpecTable, PriceRange, CertBadges

### Interactive (9)
Accordion, Modal, Drawer, Tooltip, ScrollReveal, Counter, ProgressBar, FloatingCTA, BeforeAfter

### Layout/Section (5)
Section, Container, Grid, Divider, Spacer

### Product/Portfolio (4)
Gallery, FeatureGrid, ProcessFlow, StarRating

### Social/Trust (6)
SocialLinks, TrustBar, ReviewCard, ClientLogos, WhatsAppButton, VideoEmbed

### Layout System (3)
Header, Footer, Navigation

### SEO (3 — internal, not MDX)
SchemaRenderer, OpenGraph, SitemapHTML

---

## Parallel Build Strategy (for team agents)

### Phase 1: Foundation (Sequential — MUST be first)
- Scaffold Astro 5 + Tailwind 4 + MDX + TypeScript
- Config system: design-tokens.json → theme.css, site-config.json, schema-org.json
- Content collections schema (src/content.config.ts)
- BaseLayout.astro + global.css + types
- Build script: generate-theme.mjs
- `astro-auto-import` setup

### Phase 2: Design System (Sequential after Phase 1)
- UI atomics: Button, Input, Badge, Tag, Icon
- Layout: Header, Footer, Navigation, MobileMenu
- Section wrapper: Section, Container, Grid, Divider, Spacer
- Dark mode toggle + View transitions
- Breadcrumb component

### Phase 3: MDX Components (4 PARALLEL agents after Phase 2)

| Agent | Components (12-13 each) |
|-------|------------------------|
| **A: Content** | Hero, AuthorBox, TOC, Callout, CTA, CTABlock, Stats, Steps, FAQ, Newsletter, LogoCloud, Image |
| **B: Data/Interactive** | CardGrid, Card, Testimonial, ComparisonTable, Tabs, PricingTable, Accordion, Modal, Tooltip, Drawer, Badge |
| **C: Product/Visual** | SpecTable, Gallery, BeforeAfter, Counter, ProgressBar, CertBadges, FeatureGrid, ProcessFlow, StarRating, ReviewCard, PriceRange |
| **D: Social/Misc** | SocialLinks, TrustBar, ClientLogos, WhatsAppButton, FloatingCTA, VideoEmbed, ContactForm, ScrollReveal, Timeline, TeamGrid, Divider, Spacer |

### Phase 4: Page Templates (3 PARALLEL agents, after Phase 2)

| Agent | Pages |
|-------|-------|
| **E: Blog** | BlogPost, BlogList, BlogCategory, BlogTag, RSS |
| **F: Product** | ProductPage, ProductList, ProductCategory |
| **G: Core** | HomePage, AboutPage, ContactPage, GenericPage, LandingPage, 404, SearchResults, SitemapHTML |

### Phase 5: SEO + Integration (Sequential after 3+4)
- SchemaRenderer (Tier 2 + 3)
- OpenGraph meta component
- Pagefind integration
- Sitemap + robots.txt
- RSS feed

### Phase 6: Test + Polish (Sequential)
- Copy Vietnam Plywood test content
- Build + verify pages render
- Lighthouse audit (target 100/100)
- Dark mode visual check
- Responsive check (320px → 1536px)
- Accessibility audit

### Phase 7: Pipeline Sync
- Update ai-content-rewriter `visual-composition-guide.md`
- Update `content-type-registry.cjs` with new components
- Remove import statements from rewriter output template

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| `astro-auto-import` unmaintained | Medium | Fallback: `components` prop on `<Content />` |
| Tailwind 4 + Astro edge cases | Low | Astro 5.2+ officially supports TW4 |
| 51 components = scope creep | High | Strict component API contracts, parallel agents |
| CTA API inconsistency | Medium | Unified component detecting pattern from props |
| Dark mode + glassmorphism | Low | CSS variables in `:root`/`.dark`, tested |
| Content collection images | Medium | Use Astro `image()` schema helper |

---

## Success Metrics

1. **Lighthouse 100/100** on all page types
2. **Zero brand hardcode** — change 3 JSON files = completely new site
3. **Build time < 30s** for 50-page site
4. **All test articles render** — homepage, landing, blog
5. **Dark mode works** on every component
6. **Schema validation passes** on all page types

---

## Next Steps

1. User approval of this architecture
2. Create detailed implementation plan (`/plan`)
3. Phase 1-2: Foundation + Design System (1 agent, sequential)
4. Phase 3-4: Components + Pages (7 parallel agents)
5. Phase 5-7: Integration + Testing + Pipeline sync

---

## Resolved Decisions

1. **design-tokens.json format**: **Nested + build script**. `colors.primary.500: "#0D9488"` → build script → `--color-primary-500`. Single source of truth.
2. **Image handling**: **Co-located**. `src/content/blog/images/hero.webp` next to `.mdx`. Astro optimizes via Sharp (WebP, srcset, lazy).
3. **i18n**: **Structure only**. `lang` attribute, `hreflang` slots, no full routing. YAGNI.
4. **Print stylesheet**: **Deferred**. Low priority.
5. **Content format**: **ALL content is `.mdx`**. `.md` files are only human-readable copies from web-cloner. ai-content-rewriter ALWAYS outputs `.mdx`. Content collections only need `glob({ pattern: "**/*.mdx" })`.
6. **UI foundation**: **Custom build** from scratch. Full control over 51 components, exact match with ai-content-rewriter output.
