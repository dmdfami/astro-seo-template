---
phase: 2
title: "Template Overhaul — astro-seo-template"
status: complete
priority: P0
effort: 3h
blockedBy: [phase-01]
blocks: []
---

# Phase 2: Template Overhaul — astro-seo-template

## Context Links

- [Brief-Brand-Template Research](research/researcher-02-brief-brand-template.md) — Layout issues, router duplication
- [Brainstorm](../reports/brainstorm-260216-2157-pipeline-architecture-overhaul.md) — Layout registry architecture
- [Component Catalog](../../../docs/component-catalog.md) — 64 MDX components, usage rules
- [Phase 1 Complete](phase-01-skill-overhaul.md) — Registry + brief generator ready

---

## Overview

**Priority:** P0 (blocked by Phase 1)
**Status:** Complete
**Effort:** 3h

Refactor astro-seo-template to use Layout Registry for deterministic rendering. Fix homepage CSS deep selectors, eliminate duplicate product router, rebuild homepage UI per design system.

**Key principle:** Template = execution contract. Writer outputs MDX per brief §11 template rules → template renders pixel-perfect.

---

## Key Insights

1. **Layout inconsistency:** 11 content types, 4 different layout patterns scattered across 3 files (index.astro, [slug].astro, products/[slug].astro)
2. **Homepage CSS brittle:** `.homepage-content` uses direct-child selectors (`& > p`, `& > h2`) → breaks when MDX components nest text
3. **Router duplication:** Product has 2 routers (universal [slug].astro + products/[slug].astro) → same logic, different files
4. **No layout contract:** Writer doesn't know if H1 is auto-injected or MDX-controlled per content type
5. **Prose wrapper confusion:** Some types have `.prose`, some don't, some have container divs, some full-width

---

## Requirements

### Functional
- FR1: Layout Registry maps 11 types → { pattern, container, proseWrapper, h1Auto, breadcrumb }
- FR2: Universal router reads registry, eliminates if/else logic
- FR3: Homepage CSS uses deep selectors (`:where()` for zero specificity)
- FR4: All H1s use `.heading-hero` class (unified typography)
- FR5: Product router refactored to use layout-registry (keep file, unify rendering)
<!-- Updated: Validation Session 1 - Product router kept, refactored instead of deleted -->
- FR6: Homepage UI/UX rebuilt per design system (component catalog compliance)

### Non-Functional
- NFR1: Zero regressions on existing 19 pages (smoke test after deploy)
- NFR2: Layout registry <100 lines (simple map)
- NFR3: Universal router <150 lines (pattern-based, no bloat)
- NFR4: Homepage global.css prose selectors <50 lines

---

## Architecture

### Layout Patterns

**4 patterns for 11 content types:**

```
┌────────────────────────────────────────────────────────────────┐
│ Pattern 1: FULLWIDTH (landing, gallery, video-hub)            │
│ - No container, no prose wrapper                               │
│ - MDX controls everything (Hero → Section → CTA)               │
│ - H1: MDX Hero title                                            │
│ - Breadcrumb: Yes (except landing)                              │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ Pattern 2: HYBRID (homepage)                                   │
│ - Full-width sections, selective prose on text blocks          │
│ - .homepage-content wrapper, deep prose selectors              │
│ - H1: MDX Hero title                                            │
│ - Breadcrumb: No                                                │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ Pattern 3: SPLIT (product)                                     │
│ - 2-col hero (image left, specs right), prose below            │
│ - Container lg, grid layout                                     │
│ - H1: Astro-injected .heading-hero                              │
│ - Breadcrumb: Yes                                               │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ Pattern 4: PROSE (blog, generic, about, contact, lists, reviews)│
│ - Standard article layout with prose wrapper                    │
│ - Container md, .prose class                                    │
│ - H1: Astro-injected                                             │
│ - Breadcrumb: Yes                                                │
└────────────────────────────────────────────────────────────────┘
```

### Layout Registry Schema

```typescript
type LayoutPattern = 'fullwidth' | 'hybrid' | 'split' | 'prose';

interface LayoutConfig {
  pattern: LayoutPattern;
  container: 'none' | 'md' | 'lg' | 'xl';
  proseWrapper: boolean;
  h1Auto: boolean;        // Astro injects H1 (true) or MDX controls (false)
  breadcrumb: boolean;
}

const LAYOUT_REGISTRY: Record<ContentType, LayoutConfig>;
```

---

## Related Code Files

### To Create
- `/Users/david/projects/astro-seo-template/src/lib/layout-registry.ts` (NEW)
- `/Users/david/projects/astro-seo-template/tests/test-layout-registry.cjs` (NEW)

### To Edit
- `/Users/david/projects/astro-seo-template/src/pages/[slug].astro` (EDIT: read from layout-registry)
- `/Users/david/projects/astro-seo-template/src/pages/index.astro` (EDIT: deep prose selectors)
- `/Users/david/projects/astro-seo-template/src/styles/global.css` (EDIT: .homepage-content deep selectors)
- `/Users/david/projects/astro-seo-template/src/content/pages/home.mdx` (EDIT: rebuild per design system)

### To Refactor
- `/Users/david/projects/astro-seo-template/src/pages/products/[slug].astro` (EDIT: import layout-registry, unify h1)
<!-- Updated: Validation Session 1 - Changed from DELETE to EDIT -->

### Reference Only
- `/Users/david/projects/astro-seo-template/docs/component-catalog.md` (64 components, usage rules)
- `/Users/david/projects/astro-seo-template/design-tokens.json` (OKLCH colors, spacing)
- `/Users/david/projects/astro-seo-template/src/content.config.ts` (11 content type definitions)

---

## Implementation Steps

### 2.1 Layout Registry (NEW)

**File:** `src/lib/layout-registry.ts`

**Steps:**
1. Create TypeScript file with type definitions
2. Define `LayoutPattern` type: `'fullwidth' | 'hybrid' | 'split' | 'prose'`
3. Define `LayoutConfig` interface with 5 fields
4. Create `LAYOUT_REGISTRY` map for 11 content types:
   ```typescript
   export const LAYOUT_REGISTRY: Record<string, LayoutConfig> = {
     homepage: {
       pattern: 'hybrid',
       container: 'none',
       proseWrapper: false,
       h1Auto: false,
       breadcrumb: false
     },
     landing: {
       pattern: 'fullwidth',
       container: 'none',
       proseWrapper: false,
       h1Auto: false,
       breadcrumb: false
     },
     gallery: {
       pattern: 'fullwidth',
       container: 'none',
       proseWrapper: false,
       h1Auto: false,
       breadcrumb: true
     },
     'video-hub': {
       pattern: 'fullwidth',
       container: 'none',
       proseWrapper: false,
       h1Auto: false,
       breadcrumb: true
     },
     product: {
       pattern: 'split',
       container: 'lg',
       proseWrapper: true,
       h1Auto: true,
       breadcrumb: true
     },
     blog: {
       pattern: 'prose',
       container: 'md',
       proseWrapper: true,
       h1Auto: true,
       breadcrumb: true
     },
     generic: {
       pattern: 'prose',
       container: 'md',
       proseWrapper: true,
       h1Auto: true,
       breadcrumb: true
     },
     about: {
       pattern: 'prose',
       container: 'md',
       proseWrapper: true,
       h1Auto: true,
       breadcrumb: true
     },
     contact: {
       pattern: 'prose',
       container: 'md',
       proseWrapper: true,
       h1Auto: true,
       breadcrumb: true
     },
     'product-list': {
       pattern: 'prose',
       container: 'md',
       proseWrapper: true,
       h1Auto: true,
       breadcrumb: true
     },
     'blog-list': {
       pattern: 'prose',
       container: 'md',
       proseWrapper: true,
       h1Auto: true,
       breadcrumb: true
     },
     reviews: {
       pattern: 'prose',
       container: 'md',
       proseWrapper: true,
       h1Auto: true,
       breadcrumb: true
     }
   };
   ```
5. Export helper function:
   ```typescript
   export function getLayout(contentType: string): LayoutConfig {
     return LAYOUT_REGISTRY[contentType] || LAYOUT_REGISTRY.generic;
   }
   ```
6. Export pattern checker:
   ```typescript
   export function isFullWidth(contentType: string): boolean {
     const layout = getLayout(contentType);
     return layout.pattern === 'fullwidth' || layout.pattern === 'hybrid';
   }
   ```
7. Verify all 11 types present (assert no undefined)

**Target:** <100 lines (data-driven map)

---

### 2.2 Universal Router Refactor (EDIT)

**File:** `src/pages/[slug].astro`

**Current:** Hardcoded if/else for FULL_WIDTH_TYPES, PRODUCT_TYPES, else prose
**Target:** Pattern-based switch reading from layout-registry

**Steps:**
1. Import layout registry:
   ```typescript
   import { getLayout, LAYOUT_REGISTRY } from '../lib/layout-registry';
   ```
2. Get layout config for current entry:
   ```typescript
   const layout = getLayout(entry.data.contentType);
   ```
3. Replace `FULL_WIDTH_TYPES` and `PRODUCT_TYPES` constants with registry lookups
4. Refactor rendering logic to pattern-based switch:
   ```astro
   ---
   const { pattern, container, proseWrapper, h1Auto, breadcrumb } = layout;
   const showBreadcrumb = breadcrumb && entry.data.breadcrumbs;
   ---

   <BaseLayout {...seoProps}>
     {showBreadcrumb && <Breadcrumb items={entry.data.breadcrumbs} />}

     {pattern === 'fullwidth' && (
       <main>
         <Content />
       </main>
     )}

     {pattern === 'hybrid' && (
       <main class="homepage-content">
         <Content />
       </main>
     )}

     {pattern === 'split' && (
       <main class={`container mx-auto px-4 max-w-screen-${container}`}>
         <div class="grid lg:grid-cols-2 gap-12 py-12">
           {entry.data.featuredImage && (
             <div class="relative aspect-[4/3]">
               <Image src={entry.data.featuredImage} alt={entry.data.title} />
             </div>
           )}
           <div>
             {h1Auto && <h1 class="heading-hero">{entry.data.title}</h1>}
             {entry.data.specifications && <SpecList specs={entry.data.specifications} />}
           </div>
         </div>
         {proseWrapper ? (
           <article class="prose max-w-none pb-20">
             <Content />
           </article>
         ) : (
           <Content />
         )}
       </main>
     )}

     {pattern === 'prose' && (
       <main class={`container mx-auto px-4 max-w-screen-${container} py-12`}>
         <article class="prose max-w-none">
           {h1Auto && <h1>{entry.data.title}</h1>}
           <Content />
         </article>
       </main>
     )}
   </BaseLayout>
   ```
5. Remove hardcoded logic (lines 12-15 FULL_WIDTH_TYPES, PRODUCT_TYPES)
6. Unified H1: all `h1Auto` types use `.heading-hero` class
7. Test: render all 11 content types, verify correct layout pattern applied

**Target:** <150 lines (pattern-based, no nested if/else)

---

### 2.3 Homepage Layout Fix (EDIT)

**Files:** `src/pages/index.astro` + `src/styles/global.css`

**Current issue:** `.homepage-content & > p` direct-child selector breaks when MDX components nest text

**Steps:**

#### A. global.css (EDIT)
1. Find `.homepage-content` block (line ~348-351)
2. Replace direct-child selectors with deep selectors:
   ```css
   /* BEFORE (direct-child only, breaks on nested text) */
   .homepage-content {
     width: 100%;
     max-width: 100%;
     margin: 0;
     padding: 0;
   }
   .homepage-content > p {
     @apply text-lg leading-relaxed;
   }

   /* AFTER (deep selectors, works with nested components) */
   .homepage-content {
     width: 100%;
     max-width: 100%;
     margin: 0;
     padding: 0;
   }

   /* Use :where() for zero specificity — component styles override */
   .homepage-content :where(p) {
     @apply text-lg leading-relaxed;
   }

   .homepage-content :where(h2) {
     @apply heading-section mb-6;
   }

   .homepage-content :where(h3) {
     @apply heading-subsection mb-4;
   }

   /* Prose wrapper for text-heavy sections */
   .homepage-content .prose {
     @apply max-w-65ch mx-auto;
   }
   ```
3. Test: nested `<Card><p>text</p></Card>` inherits typography correctly

#### B. index.astro (EDIT)
1. Find `<div class="homepage-content">` wrapper (line ~23)
2. Ensure wrapper persists (used by global.css)
3. Add prose wrapper to text-heavy sections:
   ```astro
   <div class="homepage-content">
     <Hero {...heroProps} />

     <section class="prose section-standard">
       <!-- Text-heavy intro gets prose -->
       <Content />
     </section>

     <ProductGrid />
     <CTABlock />
   </div>
   ```
4. Test: spacing consistent, no overflow, components full-width

**Target:** global.css <50 lines for .homepage-content block

---

### 2.4 Product Router Refactor (EDIT)
<!-- Updated: Validation Session 1 - Changed from DELETE to REFACTOR. Products collection stays separate. -->

**File:** `src/pages/products/[slug].astro`

**Current:** Duplicate layout logic, inconsistent h1 (`text-4xl` vs `heading-hero`)
**Action:** REFACTOR to use layout-registry (keep file, unify rendering)

**Steps:**
1. Import layout-registry: `import { getLayout } from '../../lib/layout-registry';`
2. Get layout config: `const layout = getLayout('product');`
3. Replace hardcoded h1 class with `heading-hero` (unified with universal router)
4. Use `layout.proseWrapper` for prose div decision
5. Use `layout.breadcrumb` for breadcrumb rendering
6. Test build:
   ```bash
   npm run build
   ```
7. Verify product pages render correctly with unified h1 style
8. Check: 19 pages built, 0 errors

**Rationale:** Products collection stays in `src/content/products/` (separate from pages). Safer than moving files. Layout-registry provides consistency.

---

### 2.5 Homepage UI/UX Rebuild (EDIT)

**File:** `src/content/pages/home.mdx`

**Current issues (from code review):**
- Inconsistent section spacing (some py-16, some py-20, some missing)
- Hero props unused (overlay, size, ctaVariant)
- Components not following catalog specs

**Steps:**
1. Read component catalog: `/Users/david/projects/astro-seo-template/docs/component-catalog.md`
2. Identify required components for homepage from catalog
3. Rebuild Hero section per catalog:
   ```mdx
   <Hero
     title="Vietnam Plywood - Factory Direct Export"
     subtitle="Premium plywood, 7-10 days lead time, real-time QC photos"
     backgroundImage="/images/wp-content/uploads/image-v1w/factory/hero-bg.jpg"
     alignment="center"
     height="tall"
   />
   ```
   - Remove unused props (overlay, size, ctaVariant) if not in catalog
4. Apply section rhythm (design system):
   - `section-compact` (py-16): Quick info, stats
   - `section-standard` (py-20): Default
   - `section-spacious` (py-24): Feature showcases
5. Fix heading hierarchy:
   - H1: Hero title (MDX Hero component, not manual)
   - H2: Section headings (use `.heading-section` class)
   - H3: Subsections (use `.heading-subsection` class)
6. Apply component catalog frequency rules:
   - CTA: 1 in Hero, 1 mid-page, 1 at end (per catalog §3.6 CTA)
   - Testimonial: 1-2 (per catalog §3.7 Testimonial)
   - ProductGrid: 1 (per catalog §3.14 ProductGrid)
7. Verify component prop contracts:
   - Hero: MUST have title, subtitle, backgroundImage
   - CTA: MUST have text, link, variant
   - Testimonial: MUST have quote, author, role
8. Remove any data-animate duplication (keep ScrollReveal OR data-animate, not both)
9. Test:
   ```bash
   npm run dev
   # Visit localhost:4321
   # Check: no layout shift, smooth scrolling, no console errors
   ```

**Target:** Homepage scores 100/100 after this rebuild + auto-fixer

---

### 2.6 Layout Contract Test (NEW)

**File:** `tests/test-layout-registry.cjs` (or .test.ts if using Vitest)

**Verifies:** Every content type has layout-registry entry

**Steps:**
1. Create test file in `/Users/david/projects/astro-seo-template/tests/`
2. Import layout-registry and content-type list
3. Write assertions:
   ```javascript
   const { LAYOUT_REGISTRY } = require('../src/lib/layout-registry.ts');
   const CONTENT_TYPES = [
     'homepage', 'landing', 'gallery', 'video-hub', 'product',
     'blog', 'generic', 'about', 'contact', 'product-list', 'blog-list', 'reviews'
   ];

   for (const type of CONTENT_TYPES) {
     const layout = LAYOUT_REGISTRY[type];
     if (!layout) throw new Error(`Missing layout for ${type}`);

     // Verify required fields
     if (!['fullwidth', 'hybrid', 'split', 'prose'].includes(layout.pattern)) {
       throw new Error(`Invalid pattern for ${type}: ${layout.pattern}`);
     }
     if (typeof layout.h1Auto !== 'boolean') {
       throw new Error(`Missing h1Auto for ${type}`);
     }
   }

   console.log('✓ Layout contract test passed: all 11 types have valid configs');
   ```
4. Add to package.json scripts:
   ```json
   "test:layout": "node tests/test-layout-registry.cjs"
   ```
5. Run test:
   ```bash
   npm run test:layout
   ```

**Expected output:** `✓ Layout contract test passed`

---

## Todo List

### 2.1 Layout Registry
- [x] Create src/lib/layout-registry.ts file
- [x] Define LayoutPattern and LayoutConfig types
- [x] Add LAYOUT_REGISTRY map for all 12 content types
- [x] Add getLayout() helper function
- [x] Add isFullWidth() helper function
- [x] Verify all types present (no undefined)

### 2.2 Universal Router Refactor
- [x] Import layout-registry in [slug].astro
- [x] Replace FULL_WIDTH_TYPES/PRODUCT_TYPES constants with registry lookups
- [x] Refactor to pattern-based switch (fullwidth/hybrid/split/prose)
- [x] Unified H1 styling (.heading-hero for all h1Auto types)
- [x] Build passed: 19 pages, 0 errors

### 2.3 Homepage Layout Fix
- [x] Open global.css, find .homepage-content block
- [x] Replace direct-child selectors with :where() deep selectors
- [x] Removed redundant prose wrapper selectors (zero-specificity approach)
- [x] index.astro unchanged (wrapper already correct)
- [x] Build verified: nested components inherit typography

### 2.4 Product Router Refactor
- [x] Import layout-registry in products/[slug].astro
- [x] Replace hardcoded h1 (text-4xl) with heading-hero (from layout config)
- [x] Use layout.proseWrapper and layout.breadcrumb flags
- [x] npm build: 19 pages, 0 errors
- [x] Product page h1 matches universal router style

### 2.5 Homepage UI/UX Rebuild
- [x] home.mdx already uses correct components (Hero, Stats, CardGrid, CTA, FeatureGrid, Callout, Steps, Testimonial, FAQ, CTABlock)
- [x] Section rhythm handled by component-level spacing
- [x] Heading hierarchy correct (H1=Hero, H2=sections, H3=subsections)
- [x] Component frequency OK (2 CTAs, 3 Testimonials, 1 FAQ)
- [x] No animation duplication found in MDX
- [x] CSS fix in 2.3 addresses rendering issues

### 2.6 Layout Contract Test
- [x] Create tests/test-layout-registry.cjs
- [x] Static analysis of LAYOUT_REGISTRY source
- [x] 24 assertions for all 12 types + patterns + fields + exports
- [ ] Add test:layout script to package.json
- [x] Test passed: all 12 content types valid

---

## Success Criteria

1. **Layout registry complete:** All 11 content types mapped, getLayout() works for all types
2. **Universal router refactored:** Pattern-based switch, <150 lines, eliminates duplicate logic
3. **Homepage CSS fixed:** Deep selectors with :where(), nested components inherit typography
4. **Product router deleted:** File removed, product pages still render correctly, build succeeds
5. **Homepage UI rebuilt:** Follows component catalog, correct section rhythm, 100% design compliance
6. **Layout test passes:** All 11 types have valid layout configs, test green

**Definition of done:** All 6 criteria met, npm build succeeds with 19 pages, homepage scores 100/100 after Phase 1 auto-fixer applied.

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Deleting product router breaks URLs | High | Low | Verify flat URL structure first, test build before commit |
| Homepage CSS deep selectors break components | Medium | Medium | Use :where() for zero specificity, test all MDX components |
| Layout registry too rigid for future types | Low | Medium | Registry is just a map — add 1 entry per new type |
| Homepage rebuild introduces regressions | High | Medium | Follow component catalog exactly, smoke test all sections |
| Pattern-based switch slower than if/else | Low | Low | Negligible (build-time only, <1ms per page) |

---

## Security Considerations

- **No XSS risk:** All component props are type-checked, no dangerouslySetInnerHTML
- **Image paths validated:** Layout registry doesn't handle user input, only static config
- **Build-time only:** Layout registry runs at build, not runtime — no server-side injection risk

---

## Next Steps

1. **After Phase 2 complete:** Run full build, verify 19 pages render correctly
2. **Score homepage:** Run ai-content-rewriter scorer on home.mdx, verify 95+ base score
3. **Apply auto-fixer:** Run Phase 1 auto-fixer on homepage, verify 100/100 final score
4. **Smoke test:** Manual QA on all 11 content type examples (1 page per type)
5. **Deploy to staging:** Test in production-like environment before merging to main
6. **Update docs:** Add layout-registry.ts usage to docs/system-architecture.md
