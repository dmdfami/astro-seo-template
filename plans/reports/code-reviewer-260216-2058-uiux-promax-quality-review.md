# Code Review: UI/UX Pro Max Upgrade

**Reviewer:** code-reviewer | **Date:** 2026-02-16 | **Quality Score: 7.5/10**

## Scope

- **Files reviewed:** 15 (styles, MDX components, pages, config)
- **Focus:** CSS validity, design token usage, component patterns, build health
- **Build status:** PASS -- 19 pages, 1.18s, 0 errors
- **Dark mode remnants:** None found (clean removal)

## Overall Assessment

Solid implementation. Clean component architecture with consistent Props interfaces, proper dual-API support (template + rewriter), and good use of design tokens via CSS custom properties. A few issues found, one critical.

---

## Critical Issues

### 1. BentoItem: Dynamic Tailwind classes will be purged

**File:** `/Users/david/projects/astro-seo-template/src/components/mdx/BentoItem.astro` (lines 10-11)

```typescript
const spanClass = span > 1 ? `md:col-span-${span}` : 'col-span-1';
const rowSpanClass = rowSpan > 1 ? `row-span-${rowSpan}` : 'row-span-1';
```

Tailwind does NOT detect dynamically constructed class names. `md:col-span-2` and `row-span-2` will be purged from the CSS output, making the bento grid span feature non-functional in production.

**Fix:** Use a static lookup map:

```typescript
const spanClass = { 1: 'col-span-1', 2: 'md:col-span-2' }[span];
const rowSpanClass = { 1: 'row-span-1', 2: 'row-span-2' }[rowSpan];
```

---

## High Priority

### 2. Stagger animation: last-child rule overrides all delays

**File:** `/Users/david/projects/astro-seo-template/src/styles/global.css` (line 61)

```css
[data-animate-stagger].is-visible > * { opacity: 1; transform: translateY(0); }
```

This catch-all rule on line 61 has no `transition-delay`, so it applies to ALL children including nth-child(1-5). Since CSS specificity is equal, this last rule wins for children 1-5, stripping their `transition-delay`. Only children 6+ need this fallback.

**Fix:** Add `:nth-child(n+6)` selector:

```css
[data-animate-stagger].is-visible > *:nth-child(n+6) { opacity: 1; transform: translateY(0); }
```

### 3. Accent color scale has gaps in theme.css

**File:** `/Users/david/projects/astro-seo-template/src/styles/theme.css`

The accent palette is missing shades 300, 800, 900, 950. While no component currently references these shades (verified), this is a latent risk. Any future component or MDX content using `accent-300` will silently fail. Primary and secondary have full 50-950 scales.

**Impact:** Low immediate risk, but breaks the "swap tokens = new website" reusability promise if another brand's content uses these shades.

**Fix:** Add missing shades to `design-tokens.json` and regenerate `theme.css`.

### 4. Prose h3 weight conflict

**File:** `/Users/david/projects/astro-seo-template/src/styles/global.css` (lines 116-124)

```css
.prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  @apply font-bold text-neutral-900;  /* sets font-bold */
}
.prose h3 { @apply text-2xl md:text-3xl font-semibold; }  /* overrides to font-semibold */
```

The group selector applies `font-bold` to h3, then the individual rule overrides to `font-semibold`. This works due to CSS cascade order, but the intent is unclear and fragile. Same issue with h4, h5.

**Fix:** Remove `font-bold` from the group selector, apply weight per-heading:

```css
.prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  @apply text-neutral-900;
  margin-top: 2em;
  margin-bottom: 0.5em;
  line-height: 1.375;
}
.prose h2 { @apply text-3xl md:text-4xl font-bold; }
.prose h3 { @apply text-2xl md:text-3xl font-semibold; }
/* etc. */
```

---

## Medium Priority

### 5. SectionWrapper uses bare `container` class

**File:** `/Users/david/projects/astro-seo-template/src/components/mdx/SectionWrapper.astro` (line 34)

```html
<div class="container mx-auto px-4 max-w-7xl">
```

In Tailwind 4, `container` is not included by default (it was a core plugin in v3). The `max-w-7xl mx-auto px-4` does all the work here, so `container` is dead weight. If Tailwind 4 does generate a `container` class with its own `max-width`, it could conflict with `max-w-7xl`.

**Fix:** Remove `container` and keep only `mx-auto px-4 max-w-7xl`.

### 6. Hero component: unused `size` and `overlay` props

**File:** `/Users/david/projects/astro-seo-template/src/components/mdx/Hero.astro` (lines 23-25)

```typescript
overlay?: boolean;
size?: 'sm' | 'md' | 'lg';
align?: 'left' | 'center' | 'right';
```

`overlay` and `size` are declared in Props but never destructured or used. `ctaVariant` is declared but also unused. Dead code in the interface.

**Fix:** Remove unused props or implement them.

### 7. Card component: `href` prop makes card clickable but entire card is not wrapped in anchor

**File:** `/Users/david/projects/astro-seo-template/src/components/mdx/Card.astro` (line 34)

```html
<div class={cn('...', href && 'cursor-pointer', className)}>
```

When `href` is provided, `cursor-pointer` is added but the card div is not actually clickable -- only the "Learn More" button inside is a link. The cursor change misleads users into thinking the whole card is a link.

**Fix:** Either wrap the entire card in an `<a>` tag when `href` is present, or remove the `cursor-pointer` class.

### 8. Hero `<Image>` receives string `src` -- may fail with Astro Image

**File:** `/Users/david/projects/astro-seo-template/src/components/mdx/Hero.astro` (line 115)

```astro
<Image src={resolvedImage.src} alt={resolvedImage.alt} width={600} height={400} />
```

Astro's `<Image>` component in static mode expects imported image references, not string URLs. Remote URLs require explicit `domains` or `remotePatterns` in `astro.config.mjs`. If MDX content passes a relative path string, this will fail at build time.

**Fix:** Use a regular `<img>` tag for string URLs, or `ImageWithFallback` which already handles this correctly.

---

## Low Priority

### 9. Stats component: `.stat-value` selector collision risk

`document.querySelectorAll('.stat-value')` in Stats.astro will match all stat instances on a page. If multiple `<Stats animated>` components exist on one page, re-running `initStats()` on page load creates duplicate observers.

### 10. ScrollReveal + data-animate duplication

Both `ScrollReveal.astro` (IntersectionObserver-based) and the `data-animate` system in `global.css` (needs JS not shown) provide scroll-triggered animations. Two parallel systems for the same feature. Consolidate when convenient.

---

## Positive Observations

- **Dual-API pattern** in Hero, CTABlock is well-executed: flat props (rewriter) normalized to nested objects (template). Clean separation.
- **Design token pipeline** from `design-tokens.json` -> `generate-theme.mjs` -> `theme.css` is proper.
- **OKLCH color spaces** used consistently for primary/secondary, hex only for neutral (correct -- neutral grays don't benefit from OKLCH).
- **Accessibility:** `prefers-reduced-motion`, focus-visible, 44px touch targets, skip-to-content all present.
- **No hardcoded brand values** in components. Colors reference design tokens. Config-swappable as intended.
- **`heading-hero`** utility correctly used in `[slug].astro` (product layout) and `blog/[slug].astro`. Not duplicated with Hero component on those pages.
- **Auto-import config** is clean and well-organized by category.
- **Build is fast** (1.18s for 19 pages).

---

## Recommended Actions (Priority Order)

1. **FIX NOW:** BentoItem dynamic class purging (Critical -- broken in production)
2. **FIX NOW:** Stagger animation catch-all rule (visually broken)
3. **FIX SOON:** Remove unused Hero props or implement them
4. **FIX SOON:** Card clickability misleading cursor
5. **IMPROVE:** Add missing accent color shades for reusability
6. **IMPROVE:** Remove bare `container` class from SectionWrapper
7. **CLEANUP:** Consolidate ScrollReveal vs data-animate systems

---

## Metrics

| Metric | Value |
|--------|-------|
| Build | PASS (19 pages, 1.18s) |
| Dark mode remnants | 0 |
| Hardcoded colors in MDX components | 1 (StarRating SVG stop-color -- acceptable) |
| Components with Props interface | 100% of reviewed |
| Unused props in interfaces | 3 (Hero: overlay, size, ctaVariant) |
| Dynamic class construction (Tailwind-unsafe) | 1 (BentoItem) |
| Duplicate animation systems | 2 (ScrollReveal + data-animate) |

## Unresolved Questions

1. Is there a JS initializer for the `data-animate` / `data-animate-stagger` system? Not found in styles or components -- if missing, those animations never trigger.
2. Does Tailwind 4 with `@tailwindcss/vite` generate a `container` class by default? If not, `SectionWrapper` and `Banner` references are harmless dead classes. If yes, potential `max-width` conflict.
