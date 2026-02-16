# Phase 04: UI/UX Quality Fixes

## Context Links

- UI/UX audit: `plans/reports/researcher-260216-1800-page-routing-uiux-audit.md`
- Global CSS: `src/styles/global.css`
- Button: `src/components/ui/Button.astro`
- BaseLayout: `src/layouts/BaseLayout.astro`
- Card: `src/components/mdx/Card.astro`

## Overview

- **Priority:** P1 -- accessibility failures (WCAG 2.1 AA) and performance issues
- **Status:** complete
- **Description:** Add focus-visible styles globally, enforce 44px touch targets, add skip-to-content link, add cursor-pointer on clickable cards, add font preload hint.

## Key Insights

- Button.astro has ZERO focus styles -- critical keyboard nav failure
- ThemeToggle is 32x32px, below 44px WCAG minimum
- No skip-to-content link -- keyboard users must tab through all nav items
- Card.astro `<div>` with `href` renders a Button inside but card itself lacks cursor-pointer
- Google Fonts loaded without `<link rel="preload">` -- delays LCP
- Font URL already has `display=swap` (good) but no preload for critical font file
- `about.astro` emoji icons become moot after Phase 1 deletes that file

## Requirements

### Functional
- All interactive elements have visible focus indicator
- All touch targets >= 44x44px
- Skip-to-content link as first focusable element
- Card shows pointer cursor when clickable
- Font preload link in `<head>`

### Non-Functional
- WCAG 2.1 Level AA compliance for focus indicators
- Lighthouse accessibility score improvement
- No layout shift from focus styles

## Related Code Files

### Files to MODIFY (3)
1. `src/styles/global.css` -- global focus-visible styles, touch target minimums
2. `src/layouts/BaseLayout.astro` -- skip-to-content link, font preload
3. `src/components/mdx/Card.astro` -- cursor-pointer when href present

### Files NOT modified (already handled)
- `src/pages/about.astro` -- deleted in Phase 1 (emoji icons no longer an issue)

## Implementation Steps

### Step 1: Global focus-visible styles

File: `src/styles/global.css`

Add after the base styles block (after line 33):

```css
/* Focus-visible styles for keyboard accessibility (WCAG 2.1 AA) */
@layer base {
  :focus-visible {
    outline: 2px solid var(--color-primary-500, #3b82f6);
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* Remove default outline for mouse users */
  :focus:not(:focus-visible) {
    outline: none;
  }
}

/* Touch target minimum 44x44px for interactive elements */
@layer base {
  button,
  [role="button"],
  input[type="submit"],
  input[type="reset"],
  input[type="button"] {
    min-height: 44px;
    min-width: 44px;
  }

  /* Icon-only buttons (ThemeToggle, mobile menu) */
  button:has(svg:only-child),
  [aria-label]:is(button) {
    min-height: 44px;
    min-width: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
```

Note: Using `@layer base` keeps specificity low so component styles can override if needed. The `:focus-visible` pseudo-class ensures only keyboard navigation shows the ring (not mouse clicks).

**Effort:** 15 min

### Step 2: Skip-to-content link

File: `src/layouts/BaseLayout.astro`

Add as first child inside `<body>`:

```astro
<body>
  <!-- Skip navigation for keyboard users -->
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-primary-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
  >
    Skip to content
  </a>
  <slot />
</body>
```

Then in each page template that has a `<main>`, add `id="main-content"`:
- `src/pages/blog/[slug].astro`: `<main id="main-content" data-pagefind-body>`
- `src/pages/products/[slug].astro`: `<main id="main-content" data-pagefind-body>`
- `src/pages/[slug].astro`: add `id="main-content"` to the `<main>` or `<article>` wrapper
- `src/pages/index.astro`: `<main id="main-content" data-pagefind-body>`

Since most pages use `<main data-pagefind-body>`, just add the id attribute alongside.

**Effort:** 15 min

### Step 3: Font preload

File: `src/layouts/BaseLayout.astro`

Add before the Google Fonts `<link>` tag (before line 68):

```astro
<!-- Preload critical font (Inter regular 400) -->
<link
  rel="preload"
  href="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

Note: The exact font URL may need verification. An alternative approach that is more maintainable is to self-host Inter. However, for now the preload hint for the most common weight (400 latin) improves LCP without changing the font loading strategy.

A simpler, more robust alternative: just ensure the Google Fonts link has `&display=swap` (it already does based on BaseLayout line 70: `display=swap`). The preconnect hints are already present. The primary improvement is the preload.

**Effort:** 10 min

### Step 4: Card cursor-pointer

File: `src/components/mdx/Card.astro`

The Card component wraps content in a `<div>`. When `href` is provided, a Button is rendered inside but the outer div lacks cursor indication.

Read the current Card component first, then add conditional cursor-pointer class:

In the Card's outer `<div>`, add:
```astro
<div class={cn(
  'rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden',
  'bg-white dark:bg-neutral-950',
  'transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
  href && 'cursor-pointer',
  className
)}>
```

If the Card uses an `<a>` tag wrapper when `href` is present, cursor-pointer is automatic. But per the audit, Card is a `<div>` -- so the explicit class is needed.

**Effort:** 10 min

### Step 5: Image dimensions for CLS prevention

This is a lower-priority item but quick to note: listing pages (`blog/index.astro`, `products/index.astro`) render `<img>` tags without explicit `width`/`height` attributes. Adding them prevents Cumulative Layout Shift.

In blog/product listing card images, ensure:
```astro
<img
  src={post.data.image.src}
  alt={post.data.image.alt}
  width="400"
  height="225"
  class="w-full h-48 object-cover"
  loading="lazy"
/>
```

The `h-48` CSS already constrains visual height, but explicit attributes let the browser reserve space before CSS loads.

**Effort:** 10 min

### Step 6: Verify

```bash
npm run build
```

Manual checks:
- Tab through page with keyboard: focus ring visible on all interactive elements
- Skip-to-content link appears on Tab from top of page
- Card shows pointer cursor when hovering over clickable cards
- ThemeToggle button is at least 44x44px (inspect element)

## Todo List

- [ ] Add `:focus-visible` global styles to `global.css`
- [ ] Add touch target minimum styles to `global.css`
- [ ] Add skip-to-content link to `BaseLayout.astro`
- [ ] Add `id="main-content"` to `<main>` in all page templates
- [ ] Add font preload `<link>` to `BaseLayout.astro`
- [ ] Add `cursor-pointer` to Card.astro when `href` present
- [ ] Add `width`/`height` to listing page card images
- [ ] Run `npm run build` and verify
- [ ] Keyboard-test focus indicators

## Success Criteria

- `:focus-visible` ring visible on buttons, links, form inputs when tabbing
- No visible focus ring on mouse click (`:focus:not(:focus-visible)` handles this)
- Skip-to-content link appears when pressing Tab from top of page
- Skip-to-content link jumps to `#main-content`
- All buttons/interactive elements >= 44x44px
- Card shows `cursor: pointer` when `href` is set
- Font preload hint present in `<head>`
- `npm run build` passes
- Lighthouse accessibility score >= 95

## Risk Assessment

- **RISK:** Global `:focus-visible` may conflict with component-specific focus styles. **Mitigation:** Using `@layer base` keeps specificity low. Components can override with higher-specificity selectors.
- **RISK:** Touch target minimum 44px on ALL buttons may enlarge some UI elements unexpectedly. **Mitigation:** Only applies to `<button>` and `[role="button"]` -- most are already adequate. Monitor for visual regression in compact areas (tag filters, pagination).
- **RISK:** Font preload URL hardcoded -- may break if Google Fonts changes CDN paths. **Mitigation:** The preconnect hints already exist as fallback. If preload fails, fonts still load via the CSS link.

## Security Considerations

- No security implications. All changes are CSS and HTML structural.

## Next Steps

- Phase 5: Content migration prep (slug mapping, image paths)
- This phase is independent and can run in parallel with Phases 2+3
