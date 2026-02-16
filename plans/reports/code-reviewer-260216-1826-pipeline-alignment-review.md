# Code Review: Template Pipeline Alignment

**Reviewer:** code-reviewer | **Date:** 2026-02-16 | **Build:** PASS (1.16s, 19 pages)

---

## Scope

- **Files reviewed:** 17 (14 modified, 3 new)
- **LOC changed:** ~650 (estimated across all files)
- **Focus:** Backward compatibility, type safety, security, edge cases
- **Build status:** Clean build, zero errors, zero warnings

## Overall Assessment

Solid implementation. The dual-API normalization pattern (accepting both original template props and rewriter-pipeline props) is consistent and well-executed across all components. Backward compatibility verified -- existing MDX content (`sample-landing.mdx`, `complete-guide-industrial-plywood.mdx`, `about.mdx`) continues to build correctly with the original API. Schema.org expansion (HowTo, breadcrumb fix, author enrichment) is correct. Three new wrapper components are thin and appropriate.

**Verdict: APPROVE with minor fixes recommended.**

---

## Critical Issues

None found.

---

## High Priority

### 1. Auto-imported `Image.astro` shadows Astro's `<Image>` in MDX context

**File:** `/Users/david/projects/astro-seo-template/src/components/mdx/Image.astro` + `astro.config.mjs` line 69

The auto-import registers `Image` as a global MDX component. This means any `<Image>` tag in MDX will resolve to this wrapper, not Astro's native `astro:assets` Image. The wrapper delegates to `MdxImage.astro` which uses the native Image internally, so it works -- but this creates a naming collision risk:

- If a user writes `<Image src={...} />` expecting Astro's native props (e.g., `format`, `quality`), only props defined in `MdxImage.astro`'s interface are forwarded.
- The wrapper uses `{...Astro.props}` spread, so unrecognized props do pass through. This is acceptable but fragile.

**Recommendation:** Verify `MdxImage.astro` forwards all native Image props. Current implementation spreads props, which should be safe. Document this shadowing behavior in component API docs. Consider renaming the auto-import to `MdxImage` only and removing the `Image.astro` wrapper.

### 2. TOC IntersectionObserver never disconnected

**File:** `/Users/david/projects/astro-seo-template/src/components/mdx/TOC.astro` lines 74-89

The `initTOC()` function creates a new `IntersectionObserver` on every page load but never calls `observer.disconnect()`. With Astro View Transitions, each navigation creates a new observer while previous ones remain active, leading to memory leak and stale callbacks.

```javascript
// Current: observer created but never cleaned up
const observer = new IntersectionObserver((entries) => { ... });

// Fix: store reference, disconnect on re-init
let tocObserver;
function initTOC() {
  if (tocObserver) tocObserver.disconnect();
  tocObserver = new IntersectionObserver((entries) => { ... });
  // ...
}
```

### 3. FAQ script duplicate event listeners on View Transitions

**File:** `/Users/david/projects/astro-seo-template/src/components/mdx/FAQ.astro` lines 64-81

`initFAQ()` re-adds click listeners to `.faq-trigger` elements on every `astro:page-load` without removing old listeners. If the same DOM element persists across transitions (View Transitions reuse DOM nodes), handlers stack.

**Fix:** Use `{ once: false }` with a guard, or remove listeners before re-adding. Alternatively, use event delegation on a parent container.

### 4. MdxImage lightbox script duplicate listener accumulation

**File:** `/Users/david/projects/astro-seo-template/src/components/mdx/MdxImage.astro` lines 49-81

Same pattern as FAQ: `initLightbox()` called on `astro:page-load` adds new click listeners to `[data-lightbox="true"]` without cleanup. Multiple overlays can be created from stacked handlers.

---

## Medium Priority

### 5. Hero component: `Image` from `astro:assets` used with string `src`

**File:** `/Users/david/projects/astro-seo-template/src/components/mdx/Hero.astro` lines 115-121

Astro's native `<Image>` component expects either an imported image module or a full URL for remote images. Passing a string path like `/images/hero.jpg` works only if the image is in `public/`. This is fine for this project but the component doesn't validate or warn about invalid paths.

The `resolvedImage` normalization (line 49-51) correctly handles string-to-object conversion, using `title` as the fallback alt text. Good pattern.

### 6. SchemaRenderer breadcrumb generates trailing slash inconsistency

**File:** `/Users/david/projects/astro-seo-template/src/components/seo/SchemaRenderer.astro` line 59

```typescript
item: `${siteUrl}/${pathParts.slice(0, i + 1).join('/')}/`
```

The `siteUrl` already has trailing slash stripped (line 40), and the breadcrumb item URLs always add a trailing `/`. However, the `Home` item uses `siteUrl + "/"` (line 48). This is consistent, but for single-segment pages like `/about`, the last breadcrumb item URL will be `https://domain.com/about/` -- which should match the canonical URL. Verify this matches `getCanonicalURL()` output from `seo-utils.ts`.

Looking at `seo-utils.ts` line 22: `getCanonicalURL` strips trailing slashes from the path and returns `https://domain.com/about` (no trailing slash). This creates a **mismatch between canonical URL and breadcrumb item URL**. Google may flag this as inconsistent.

**Fix:** Align breadcrumb URLs to match canonical URL format (no trailing slash for non-root pages), or vice versa.

### 7. `Callout` type narrowing loses custom types silently

**File:** `/Users/david/projects/astro-seo-template/src/components/mdx/Callout.astro` line 13-14

```typescript
const typeMap: Record<string, string> = { tip: 'info', note: 'info' };
const type = (typeMap[rawType] || rawType) as 'info' | 'warning' | 'success' | 'error';
```

If an unknown type is passed (e.g., `type="danger"`), it falls through to `rawType` and gets cast. Then `styles[type]` and `icons[type]` will be `undefined`, rendering without styles/icon. The Props interface already restricts to known types, but MDX doesn't enforce TypeScript at runtime.

**Fix:** Add a fallback: `const type = (typeMap[rawType] || rawType) as ... || 'info';` won't work since rawType is truthy. Instead: validate against styles keys.

```typescript
const mapped = typeMap[rawType] || rawType;
const type = (mapped in styles ? mapped : 'info') as keyof typeof styles;
```

### 8. Products collection schema allows optional `publishDate` but blog/[slug] assumes it exists

**File:** `/Users/david/projects/astro-seo-template/src/content.config.ts` line 52

Products `publishDate` is optional. If a product page's `contentType` is `product` and SchemaRenderer is called, the `buildProductSchema` function doesn't use `publishDate` so this is safe. But if a product entry were ever passed to `buildArticleSchema` (shouldn't happen given the switch statement), it would fail. Current routing logic prevents this. Acceptable risk.

### 9. `AuthorBox` social array spread creates empty arrays on falsy values

**File:** `/Users/david/projects/astro-seo-template/src/components/mdx/AuthorBox.astro` lines 28-31

```typescript
const resolvedSocial = social.length ? social : [
  ...(linkedin ? [{ platform: 'linkedin' as const, url: linkedin }] : []),
  ...(twitter ? [{ platform: 'twitter' as const, url: twitter }] : []),
];
```

If `social` is provided as an empty array `[]` (which is the default), then `social.length` is falsy and it falls through to build from flat props. This is actually the correct behavior -- if no social array AND no flat props, you get `[]`. Good.

However, the `iconMap` (lines 33-38) maps all platforms to `'external-link'` which is a generic icon. This is functional but reduces visual distinction between social platforms.

---

## Low Priority

### 10. `CTABlock` unused `variant` prop

**File:** `/Users/david/projects/astro-seo-template/src/components/mdx/CTABlock.astro` line 17

`variant` is declared in Props and destructured (line 27) but never used in the template. The button always uses `variant="secondary"` (line 58). Dead code.

### 11. `CTA` unused `size` and `id` props in object-branch rendering

**File:** `/Users/david/projects/astro-seo-template/src/components/mdx/CTA.astro`

When `hasSlot` is false (lines 39-55), the `size` and `id` props are not applied to the container. Only the slot-based branch uses them. Not a bug since the object API is the original API and doesn't need these, but the type interface suggests they're always available.

### 12. Font preload as `style` type is incorrect

**File:** `/Users/david/projects/astro-seo-template/src/layouts/BaseLayout.astro` lines 77-81

```html
<link rel="preload" href="...css2?family=Inter..." as="style" />
```

This preloads the Google Fonts CSS stylesheet, then loads it again as a regular `<link rel="stylesheet">` on line 86. The preload hint is valid and reduces render-blocking, but the font files themselves (woff2) are not preloaded. For true font performance, preload the actual font files, not the CSS. The current approach is acceptable but suboptimal.

### 13. CSS stagger animation incomplete for 6+ children

**File:** `/Users/david/projects/astro-seo-template/src/styles/global.css` lines 60-65

Only children 1-5 get explicit stagger delays. The catch-all on line 65 (`[data-animate-stagger].is-visible > *`) immediately shows all children, which means children 6+ appear instantly without stagger. Works but animation feels incomplete for larger lists.

---

## Edge Cases Found by Scouting

1. **Route conflict potential:** `[slug].astro` catches all top-level pages from the `pages` collection. No conflict with `/blog/*` or `/products/*` since those have dedicated routes. The `homepage` contentType is excluded from `[slug]` via the filter on line 18. Safe.

2. **`Astro.site` trailing slash:** In `[slug].astro` line 31, `const url = `${Astro.site}${page.id}``; -- `Astro.site` includes trailing slash from config (`https://vietnam-plywood.com/`), so URLs like `https://vietnam-plywood.com/about` are correct (page.id has no leading slash). Verified in `blog/[slug].astro` line 21 which uses the same pattern. Consistent.

3. **`Image.astro` wrapper in auto-import does NOT shadow** component-level imports. Auto-import only affects MDX files. Components that `import { Image } from 'astro:assets'` in their frontmatter continue to get the native Astro Image. This is correct Astro behavior.

4. **Schema `</` escaping** is consistently applied in both `BaseLayout.astro` (lines 111-112) and `SchemaRenderer.astro` (line 155). Matches the security requirement in `code-standards.md`.

5. **OpenGraph `publishedTime` type safety:** `OpenGraph.astro` calls `publishedTime.toISOString()` (line 66) which requires a Date object. The blog schema uses `z.coerce.date()`, so dates from content collections are already Date objects. The guard `type === 'article' && publishedTime &&` prevents calling on undefined. Safe.

---

## Positive Observations

- **Consistent normalization pattern** across all dual-API components (FAQ, CTA, CTABlock, Hero, AuthorBox, TOC, Callout, Testimonial). Each resolves pipeline props to the original format, keeping template logic unchanged.
- **Schema.org `</` escaping** properly applied on all JSON-LD outputs.
- **Skip-to-content link** added to BaseLayout with proper focus styles. Good WCAG 2.1 compliance.
- **`focus-visible` styles** in `global.css` correctly distinguish keyboard from mouse focus.
- **44px touch targets** for buttons -- meets WCAG 2.5.5 AAA.
- **`prefers-reduced-motion`** media query disables animations. Excellent accessibility.
- **BreadcrumbNav wrapper** avoids naming conflict with SEO Breadcrumb component. Clean separation.
- **Content schema expansion** is backward compatible -- all new fields are optional with defaults.
- **Dark mode re-application** after View Transitions is handled correctly.

---

## Recommended Actions

1. **[HIGH]** Fix TOC `IntersectionObserver` memory leak -- add `disconnect()` before re-init
2. **[HIGH]** Fix FAQ/MdxImage duplicate event listener stacking on View Transitions
3. **[MEDIUM]** Align breadcrumb URL format with canonical URL (trailing slash consistency)
4. **[MEDIUM]** Add fallback for unknown Callout types to prevent undefined styles
5. **[LOW]** Remove unused `variant` prop from CTABlock or wire it up
6. **[LOW]** Consider self-hosting fonts instead of Google Fonts for performance

---

## Metrics

- **Type Coverage:** Props interfaces on all 17 files. No `any` in component code (SchemaRenderer uses `Record<string, any>` for frontmatter passthrough -- acceptable).
- **Build:** Clean, 19 pages, 1.16s
- **Linting Issues:** 0 (build-verified)
- **Security:** JSON-LD escaping present, no exposed secrets, `rel="noopener noreferrer"` on external links

---

## Unresolved Questions

1. Should the `Image.astro` MDX wrapper be kept, or should MDX authors use `<MdxImage>` directly? The shadowing is safe but potentially confusing for developers who expect native Astro Image behavior in MDX.
2. Is the trailing-slash mismatch between canonical URLs and breadcrumb URLs intentional? Both formats are valid but inconsistency may impact SEO crawl signals.
3. The `iconMap` in `AuthorBox` maps all social platforms to `external-link`. Should platform-specific icons be added for better UX?
