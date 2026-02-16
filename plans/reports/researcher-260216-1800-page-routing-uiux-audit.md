# Page Routing & UI/UX Quality Audit Report

**Date:** 2026-02-16
**Template:** astro-seo-template
**Audit scope:** Routing coverage for 11 content types, content flow pipeline, UI/UX per `ui-ux-pro-max` checklist

---

## Summary

**Routing Coverage: 8/11 content types mapped (73%)**
**UI/UX Quality: 17/24 checks pass (71%)**
**Critical Gaps: 5 issues MUST FIX before production**

The template handles blog, product, landing, homepage, generic pages well. Three content types from `ai-content-rewriter` have NO routes: `reviews`, `gallery`, `video-hub`. The `about` and `contact` pages are hardcoded Astro files instead of reading from content collections, breaking the ai-content-rewriter pipeline. UI/UX has several violations: emojis used as icons, missing cursor-pointer on clickable cards, no touch target enforcement, and font preloading missing.

---

## Content Type -> Route Mapping (11 types)

| # | contentType | Route | Page File | Collection | Status |
|---|-------------|-------|-----------|------------|--------|
| 1 | `homepage` | `/` | `index.astro` | `pages` (contentType=homepage) | PASS -- reads from collection |
| 2 | `landing` | `/landing/[slug]` | `landing/[slug].astro` | `pages` (contentType=landing) | PASS -- dynamic from collection |
| 3 | `blog` | `/blog/[slug]` | `blog/[slug].astro` | `blog` | PASS -- with SchemaRenderer |
| 4 | `product` | `/products/[slug]` | `products/[slug].astro` | `products` | PASS -- with SchemaRenderer |
| 5 | `blog-list` | `/blog` | `blog/index.astro` | `blog` (listing) | PASS -- lists all posts |
| 6 | `product-list` | `/products` | `products/index.astro` | `products` (listing) | PASS -- lists all products |
| 7 | `generic` | `/[slug]` | `[slug].astro` | `pages` (contentType=generic) | PASS -- dynamic from collection |
| 8 | `about` | `/about` | `about.astro` | **HARDCODED** | FAIL -- hardcoded, ignores collection |
| 9 | `contact` | `/contact` | `contact.astro` | **HARDCODED** | FAIL -- hardcoded, ignores collection |
| 10 | `reviews` | **NONE** | **MISSING** | **MISSING** | FAIL -- no route, no collection |
| 11 | `gallery` | **NONE** | **MISSING** | **MISSING** | FAIL -- no route, no collection |
| 12 | `video-hub` | **NONE** | **MISSING** | **MISSING** | FAIL -- no route, no collection |

### Bonus routes (not in 11-type spec)
- `/blog/tag/[tag]` -- tag filtering, good
- `/search` -- Pagefind search page
- `/sitemap` -- HTML sitemap
- `/404` -- custom error page

---

## Content Flow Pipeline

```
ai-content-rewriter outputs .mdx with frontmatter (contentType field)
  |
  v
src/content/{blog,products,pages}/*.mdx
  |
  v
content.config.ts validates schema (Zod)
  |
  v
Page templates read via getCollection() + render()
  |
  v
BaseLayout renders SEO meta (OpenGraph, canonical, Schema.org Tier 1)
  |
  v
SchemaRenderer renders Tier 2 schemas (Article, Product, FAQ, BreadcrumbList)
```

### Flow Issues

1. **`contentType` enum in content.config.ts is limited**: Only allows `'landing' | 'generic' | 'homepage'` for pages collection. Missing: `about`, `contact`, `reviews`, `gallery`, `video-hub`. If ai-content-rewriter outputs `contentType: "about"`, Zod validation WILL FAIL.

2. **about.astro and contact.astro are hardcoded**: They don't read from any collection. If ai-content-rewriter generates `about.mdx` with `contentType: "about"`, it won't be rendered by these pages. The existing `src/content/pages/about.mdx` has `contentType: "generic"` as a workaround, but it renders at `/about` via `[slug].astro` ONLY if there's no hardcoded `about.astro` (Astro prioritizes explicit routes over dynamic). So the hardcoded `about.astro` always wins, making the MDX about page unreachable.

3. **SchemaRenderer only handles `blog` and `product`**: Missing schema generation for `landing`, `homepage`, `about`, `contact`. These pages get only Tier 1 schemas (Organization, WebSite) but no page-specific BreadcrumbList.

4. **Frontmatter fields partially passed**: `faq` and `steps` from frontmatter generate Schema.org in SchemaRenderer only for blog/product. Landing pages with FAQ won't get FAQPage schema since SchemaRenderer isn't used on landing pages.

5. **`specs` field only on products collection**: Content config only defines specs for products, not pages. A landing page can't have specs in frontmatter.

---

## Missing Routes (MUST CREATE)

### Priority 1: Fix contentType enum + routing

**Option A (recommended -- KISS):** Expand the `pages` collection to accept all remaining types and route them through appropriate templates.

1. **Update `content.config.ts`**: Expand pages contentType enum:
   ```ts
   contentType: z.enum(['landing', 'generic', 'homepage', 'about', 'contact', 'reviews', 'gallery', 'video-hub']).default('generic')
   ```

2. **Convert `about.astro` to collection-driven**: Delete hardcoded `about.astro`, make `[slug].astro` handle `contentType: "about"` (or create `about/index.astro` that reads from pages collection with contentType=about).

3. **Convert `contact.astro` to collection-driven**: Same approach. The contact form can be an MDX component (`<ContactForm />`).

4. **Create routes for reviews, gallery, video-hub**: These can all use `[slug].astro` with contentType filtering, OR create dedicated page files:
   - `/reviews` or `/reviews/[slug]`
   - `/gallery` or `/gallery/[slug]`
   - `/video-hub` or `/videos/[slug]`

### Priority 2: SchemaRenderer expansion

Add schema generation for:
- `landing` / `homepage` -> WebPage schema
- `about` -> AboutPage schema
- `contact` -> ContactPage schema
- `reviews` -> Review aggregate schema
- `gallery` -> ImageGallery schema
- `video-hub` -> VideoGallery schema

---

## UI/UX Quality Check (per ui-ux-pro-max checklist)

### Visual Quality

| Check | Status | Details |
|-------|--------|---------|
| No emojis as icons | **FAIL** | `about.astro` lines 45-47 use emojis as icons (star, handshake, lightbulb). Must replace with SVG icons from Icon.astro or Heroicons. |
| Consistent icon set | PASS | Icon.astro uses Heroicons (outlined, 24x24 viewBox), SVG-based. |
| Brand logos correct | N/A | No brand logos rendered in current template. |
| Hover states no layout shift | **WARN** | Card.astro uses `hover:-translate-y-1` which causes slight layout shift. Not a hard fail but violates "stable hover states" rule. |
| Theme colors direct (bg-primary) | PASS | Uses Tailwind theme tokens directly, not var() wrappers. |

### Interaction

| Check | Status | Details |
|-------|--------|---------|
| cursor-pointer on clickable elements | **FAIL** | Blog listing cards (`blog/index.astro`), product listing cards (`products/index.astro`), tag page cards (`blog/tag/[tag].astro`) -- all use `<a>` wrappers but no explicit cursor-pointer. Browsers default `<a>` to pointer, so this is technically OK for links. BUT: Card.astro MDX component (used in CardGrid) is a `<div>` with no cursor-pointer even when `href` is set -- the Button inside gets pointer but the card itself doesn't. FAQ and Accordion trigger buttons also missing cursor-pointer. |
| Hover feedback | PASS | Footer links, nav links, blog cards, product cards all have hover color transitions. |
| Transitions 150-300ms | PASS | `transition-colors`, `transition-shadow`, `duration-200`, `duration-300` used throughout. Global CSS animations 0.5-0.6s. |
| Focus states visible | **FAIL** | Only contact form inputs have `focus:ring-2`. Buttons (Button.astro) have NO focus styles. Navigation links have NO focus styles. ThemeToggle has NO focus ring. MobileMenu toggle has NO focus ring. This is a critical accessibility failure. |

### Light/Dark Mode

| Check | Status | Details |
|-------|--------|---------|
| Light mode text contrast 4.5:1 | PASS | Body text: neutral-900 on neutral-50 (near black on near white). Good contrast. |
| Glass elements visible in light mode | **WARN** | Header uses `bg-white/80` in light mode, `bg-neutral-950/80` in dark -- good. But glass utility class defaults to `rgba(255,255,255,0.08)` which is invisible in light mode. Only used via `.glass` utility, not in core layout. |
| Borders visible both modes | PASS | Uses `border-neutral-200 dark:border-neutral-800` consistently. |
| Test both modes | N/A | Can't test visually in this audit. |

### Layout

| Check | Status | Details |
|-------|--------|---------|
| Floating elements proper spacing | PASS | Header is `sticky top-0`, not floating with offset. Fine for this design. |
| No content behind fixed navbar | **WARN** | Header is `sticky top-0` with `h-16`. Blog post pages (`blog/[slug].astro`) use `<main>` without top padding -- content could peek behind sticky header on scroll. Not a hard fail since sticky (not fixed) handles this better, but worth checking. |
| Responsive at 375/768/1024/1440px | PASS | Container sizes: `max-w-7xl` with responsive padding `px-4 sm:px-6 lg:px-8`. Grid layouts use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. |
| No horizontal scroll on mobile | PASS | Container has `mx-auto` with padding. No obvious overflow risks. |

---

## Accessibility Audit

| Check | Status | Details |
|-------|--------|---------|
| All images have alt text | PASS | Blog listing, product listing, Hero, Gallery -- all require/use alt text. Content images via MdxImage require alt. |
| Form inputs have labels | PASS | Contact form uses `<label for="...">` properly. |
| Color not only indicator | PASS | Active nav link uses color + font weight difference. |
| `prefers-reduced-motion` | PASS | Global CSS has media query disabling all animations/transitions. |
| ARIA labels on icon buttons | PASS | ThemeToggle has `aria-label="Toggle dark mode"`. Footer social links have aria-labels. |
| Keyboard tab order | **WARN** | Navigation is `hidden md:flex` with no skip-nav link. Keyboard users must tab through all nav items before reaching content. No `<a href="#main">Skip to content</a>`. |
| Semantic HTML | **WARN** | Blog listing page uses `<a>` wrapping `<h2>` -- valid but `<article>` wrapper would be better. Homepage `<main>` is correct. Missing `role="navigation"` on nav or relying on `<nav>` element (Navigation.astro uses `<nav>` -- good). |
| Focus ring on buttons | **FAIL** | Button.astro has NO focus-visible styles. Critical for keyboard navigation. |
| Skip navigation link | **FAIL** | No skip-to-content link in BaseLayout or Header. |

---

## Performance Audit

| Check | Status | Details |
|-------|--------|---------|
| Static output | PASS | `output: 'static'` in astro.config.mjs. |
| Image optimization (WebP, srcset, lazy) | PASS | Hero uses `loading="eager"`, other images use `loading="lazy"`. MdxImage and Gallery support lazy loading. Astro Image component used for srcset. |
| Font optimization | **FAIL** | Google Fonts loaded via `<link>` with `display=swap` (good), but missing `<link rel="preload">` for fonts. The preconnect hints are present. However, two font families loaded (Inter + JetBrains Mono) -- JetBrains Mono only needed for code blocks, could be conditionally loaded. |
| CSS optimization | PASS | Tailwind CSS 4 via Vite plugin handles purging. theme.css is auto-generated. |
| JavaScript minimal | PASS | Only inline scripts for: theme toggle, mobile menu, FAQ accordion, scroll reveal, Pagefind. No framework JS. |
| Pagefind integration | PASS | `astro-pagefind` integration + search page. |
| View Transitions | PASS | `ClientRouter` from `astro:transitions` in BaseLayout. Dark mode re-applied on `astro:after-swap`. |
| Core Web Vitals - CLS | **WARN** | Blog card images use `h-48 object-cover` (fixed height, good). But no `width`/`height` attributes on `<img>` tags in listing pages -- browser can't reserve space before load. Hero background image has no dimensions. |
| Sitemap | PASS | `@astrojs/sitemap` integration with draft filtering. |

---

## Dark Mode Compatibility

| Area | Status | Notes |
|------|--------|-------|
| Body background | PASS | `bg-neutral-50 dark:bg-neutral-950` |
| Text colors | PASS | `text-neutral-900 dark:text-neutral-100` |
| Header | PASS | `bg-white/80 dark:bg-neutral-950/80` with backdrop-blur |
| Footer | PASS | `bg-neutral-100 dark:bg-neutral-900` |
| Cards/borders | PASS | Consistent `border-neutral-200 dark:border-neutral-800` |
| Prose content | PASS | `prose dark:prose-invert` on article content |
| FOUC prevention | PASS | Inline script in `<head>` applies dark class before render |
| System preference | PASS | Detects `prefers-color-scheme: dark` + localStorage override |
| View transition persist | PASS | `astro:after-swap` handler re-applies dark class |

---

## Mobile Responsiveness

| Area | Status | Notes |
|------|--------|-------|
| Navigation | PASS | Desktop: `hidden md:flex`. Mobile: full-screen slide-in menu with close button. |
| Container padding | PASS | `px-4 sm:px-6 lg:px-8` responsive padding. |
| Grid layouts | PASS | Blog/product grids: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. |
| Typography scaling | PASS | Hero title: `text-4xl lg:text-6xl`. Body text base 1rem. |
| Touch targets | **FAIL** | No minimum 44x44px enforcement. ThemeToggle is `p-2` (32x32px at default icon size). Mobile menu links are `text-lg` block elements with `space-y-6` -- adequate height but no min-height set. Navigation desktop links have no min-height. |
| CTA button "Get Started" | PASS | Hidden on mobile (`hidden md:inline-flex`), but no mobile alternative CTA. |
| Footer grid | PASS | `grid-cols-1 md:grid-cols-4` -- stacks on mobile. |

---

## Critical Gaps (MUST FIX)

### 1. Missing 3 Content Type Routes (reviews, gallery, video-hub)
- **Impact:** ai-content-rewriter can generate these content types but no route will render them.
- **Fix:** Add routes + update content.config.ts contentType enum.
- **Effort:** Medium (3-4 hours)

### 2. Hardcoded about.astro and contact.astro Break Pipeline
- **Impact:** ai-content-rewriter generates MDX for about/contact pages but they're never rendered. The hardcoded pages use generic placeholder content with emojis.
- **Fix:** Convert to collection-driven pages OR make them read from content collection with fallback to hardcoded.
- **Effort:** Low (1-2 hours)

### 3. No Focus Styles on Interactive Elements
- **Impact:** Keyboard navigation is broken. WCAG 2.1 Level AA failure. Google Lighthouse will flag this.
- **Fix:** Add `focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2` to Button.astro, Navigation links, ThemeToggle, and all interactive elements.
- **Effort:** Low (30 min)

### 4. Emojis Used as Icons in about.astro
- **Impact:** Violates ui-ux-pro-max "no-emoji-icons" rule. Renders differently across OS/browsers. Unprofessional.
- **Fix:** Replace with SVG icons from Icon.astro (add `star`, `users`, `lightbulb` variants) or use inline SVG.
- **Effort:** Low (30 min) -- but moot if about.astro is converted to collection-driven.

### 5. Touch Targets Below 44px
- **Impact:** ThemeToggle (32x32px), nav links, and some interactive elements fail WCAG touch target guidelines.
- **Fix:** Increase padding on ThemeToggle to `p-2.5` minimum. Add `min-h-[44px] min-w-[44px]` to icon buttons.
- **Effort:** Low (30 min)

---

## Recommendations

### High Priority (before production)
1. **Expand content.config.ts** to accept all 11 contentType values
2. **Convert about/contact to collection-driven** pages, or create a universal `[...slug].astro` catch-all that reads contentType and applies appropriate template
3. **Add focus-visible styles** to all interactive elements globally (can be done in global.css)
4. **Add skip-to-content link** in BaseLayout
5. **Fix touch targets** to 44px minimum

### Medium Priority (quality improvements)
6. **Expand SchemaRenderer** to generate schemas for all content types
7. **Add font preload** for Inter (primary font)
8. **Add width/height** to listing page images for CLS prevention
9. **Remove emojis** from about.astro (or delete if collection-driven)
10. **Add cursor-pointer** to Card.astro when href is set
11. **Consider removing Card hover:-translate-y-1** to prevent layout shift

### Low Priority (nice to have)
12. **Conditionally load JetBrains Mono** only on pages with code blocks
13. **Add `<article>` wrappers** around blog/product listing cards for better semantics
14. **Add RSS autodiscovery link** in BaseLayout head (RSS feed exists per README)

---

## Unresolved Questions

1. **Should reviews/gallery/video-hub be top-level routes or nested?** E.g., `/reviews` vs `/pages/reviews`. Need alignment with site-config.json navigation structure.
2. **Should about/contact become purely MDX-driven or hybrid?** Pure MDX means the contact form must be an MDX component (ContactForm already exists). Hybrid means Astro page reads from collection for text but keeps form logic.
3. **Is the `[slug].astro` catch-all the right place to handle about/contact/reviews/gallery/video-hub?** Or should each get a dedicated page file? Dedicated files give more control over layout but increase maintenance. A single flexible template with contentType switching is DRYer.
4. **Font loading strategy:** Should Inter be self-hosted instead of Google Fonts for better performance and privacy?
