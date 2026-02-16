# Code Review: Astro SEO Template

## Scope
- Files: 55+ files across config, SEO layer, layouts, pages, MDX components, UI components, scripts, styles
- LOC: ~2,500 (estimated across all reviewed files)
- Focus: Full codebase review

## Overall Assessment

Well-architected Astro 5 template with clean separation of concerns. The 3-JSON config approach (site-config, schema-org, design-tokens) is excellent for the stated fork-per-site model. Code quality is generally high with consistent patterns. Several security issues, SEO gaps, and edge cases identified below.

---

## Critical Issues

### C1. XSS Vulnerability in MdxImage Lightbox

**File:** `/Users/david/projects/astro-seo-template/src/components/mdx/MdxImage.astro` (lines 55-57)

```javascript
overlay.innerHTML = `
  <img src="${img.src}" alt="${img.alt}" class="...">
  <button ...>&times;</button>
`;
```

`img.alt` is interpolated directly into `innerHTML` without sanitization. If an MDX author supplies a malicious `alt` attribute (e.g. `" onload="alert(1)"` or HTML entities), it could result in XSS. While MDX content is author-controlled, this is a template meant for AI-generated pipeline content, which increases risk.

**Fix:** Use `document.createElement` instead of `innerHTML`, or escape the values:
```javascript
const imgEl = document.createElement('img');
imgEl.src = img.src;
imgEl.alt = img.alt;
imgEl.className = 'max-w-full max-h-full rounded-lg';
overlay.appendChild(imgEl);
```

### C2. SchemaRenderer Uses `set:html` with User-Derived Data

**File:** `/Users/david/projects/astro-seo-template/src/components/seo/SchemaRenderer.astro` (line 103)

```astro
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

The schema objects are built from `frontmatter` (passed as `Record<string, any>`). `JSON.stringify` output inside a `<script>` tag could be vulnerable if frontmatter values contain `</script>` strings, which would break out of the script context.

**Fix:** Sanitize the JSON string to escape `</script>` and `<!--`:
```javascript
JSON.stringify(schema).replace(/<\//g, '<\\/')
```

Same issue exists in `BaseLayout.astro` lines 94-95, though those use data from `schema-org.json` which is operator-controlled, so lower risk.

### C3. Contact Form Submits to Non-Existent Endpoint

**Files:**
- `/Users/david/projects/astro-seo-template/src/pages/contact.astro` (line 43): `action="/api/contact"`
- `/Users/david/projects/astro-seo-template/src/components/mdx/ContactForm.astro` (line 34): `action="/api/contact"`
- `/Users/david/projects/astro-seo-template/src/components/mdx/Newsletter.astro` (line 30): `action="/api/newsletter"`

This is a **static output** site. There are no API routes (`output: 'static'`). Form submissions will result in 404 errors. The contact page form does not even `preventDefault()` -- it only validates then allows default submission.

**Fix:** Either document that these endpoints require external services (e.g., Cloudflare Functions, Formspree) or add `e.preventDefault()` to contact form and provide clear configuration hooks.

---

## High Priority

### H1. TypeScript Version Conflict in astro.config.mjs

`tsc --noEmit` reports a type error on the Tailwind CSS Vite plugin (line 13). This is a common Vite version mismatch between `@tailwindcss/vite` and Astro's bundled Vite. While it does not break the build (Astro uses its own compiler), it prevents type checking from passing cleanly.

**Fix:** Add `// @ts-ignore` above the plugins line, or pin compatible versions. Alternatively, the `@ts-check` pragma at line 1 could be removed since Astro config is not really type-checked in practice.

### H2. Missing `lang` Attribute Dynamicity

**File:** `/Users/david/projects/astro-seo-template/src/layouts/BaseLayout.astro` (line 48)

```html
<html lang="en">
```

Hardcoded to `"en"` despite `site-config.json` having a `language` field. The OpenGraph component correctly reads `siteConfig.site.language`, but the HTML lang attribute does not.

**Fix:**
```astro
<html lang={siteConfig.site.language || 'en'}>
```

### H3. SchemaRenderer Not Using Named Slot

**File:** `/Users/david/projects/astro-seo-template/src/pages/blog/[slug].astro` (line 33)

```astro
<SchemaRenderer contentType="blog" frontmatter={post.data} url={url} />
```

The SchemaRenderer is rendered as a direct child of `BaseLayout`, but BaseLayout defines a `<slot name="schema" />` (line 98) for schema injection into `<head>`. The SchemaRenderer is NOT placed in the schema slot -- it renders in the `<body>` instead. This means structured data `<script>` tags appear in `<body>` rather than `<head>`.

While browsers tolerate this, Google recommends placing ld+json in `<head>` for best practice. Same issue in `products/[slug].astro`.

**Fix:**
```astro
<Fragment slot="schema">
  <SchemaRenderer contentType="blog" frontmatter={post.data} url={url} />
</Fragment>
```

### H4. Canonical URL Removes Trailing Slash from Homepage

**File:** `/Users/david/projects/astro-seo-template/src/lib/seo-utils.ts` (lines 19-23)

```typescript
export function getCanonicalURL(pathname: string): string {
  const cleanPath = pathname.replace(/\/$/, '');
  const cleanSite = siteConfig.site.url.replace(/\/$/, '');
  return cleanPath === '' ? cleanSite : `${cleanSite}${cleanPath}`;
}
```

For `pathname = "/"`, `cleanPath` becomes `""`, returning `https://example.com` (no trailing slash). For inner pages like `/blog/post`, it returns without trailing slash. This is fine but must be consistent with Astro's `trailingSlash` config (defaults to `'ignore'`). If the sitemap generates URLs with trailing slashes (Astro default), this creates canonical/sitemap mismatch which hurts SEO.

**Fix:** Explicitly set `trailingSlash: 'never'` in `astro.config.mjs`, or always append trailing slash in `getCanonicalURL`.

### H5. Event Listener Accumulation on View Transitions

Multiple components use the pattern:
```javascript
initFunction();
document.addEventListener('astro:page-load', initFunction);
```

This is correct for initial page load + view transitions. However, the `initFunction()` call on line load (before the event listener) combined with `astro:page-load` firing on initial load means double initialization. In Astro 5, `astro:page-load` fires on initial page load too, so the bare call is redundant and causes double event listener attachment.

**Affected files:** FAQ.astro, PricingTable.astro, Accordion.astro, Modal.astro, Tabs.astro, ScrollReveal.astro, ContactForm.astro, Newsletter.astro, MobileMenu.astro, ThemeToggle.astro, Gallery.astro, FloatingCTA.astro

**Fix:** Remove the bare `initFunction()` call and rely solely on `astro:page-load`:
```javascript
document.addEventListener('astro:page-load', initFunction);
```

Or if supporting non-ViewTransition pages, use `astro:page-load` only since it fires on initial navigation regardless.

### H6. Gallery Lightbox Has Singleton ID Collision

**File:** `/Users/david/projects/astro-seo-template/src/components/mdx/Gallery.astro` (line 48)

The lightbox element uses `id="gallery-lightbox"`. If two Gallery components are used on the same page, IDs collide. Same issue with `gallery-close`, `gallery-prev`, `gallery-next`.

**Fix:** Use a unique prefix per gallery instance, similar to how Tabs uses `tabsId`.

### H7. FloatingCTA Singleton ID Collision

**File:** `/Users/david/projects/astro-seo-template/src/components/mdx/FloatingCTA.astro` (line 28)

Uses `id="floating-cta"`. Multiple FloatingCTA components on a page would conflict.

---

## Medium Priority

### M1. Missing `noindex` on 404 Page

**File:** `/Users/david/projects/astro-seo-template/src/pages/404.astro`

The 404 page inherits the default `<meta name="robots" content="index, follow" />` from OpenGraph.astro. Search engines should not index 404 pages.

**Fix:** Pass a `noindex` prop or override the robots meta on the 404 page.

### M2. Breadcrumb Schema Missing "Home" Entry

**File:** `/Users/david/projects/astro-seo-template/src/components/seo/SchemaRenderer.astro` (lines 33-47)

The `buildBreadcrumb` function derives breadcrumb items from URL path parts, but never includes "Home" as the first item. Google recommends starting breadcrumbs with the homepage.

```javascript
const pathParts = parsed.pathname.replace(/\/$/, '').split('/').filter(Boolean);
```

For `/blog/my-post`, this produces `["Blog", "My Post"]` but should be `["Home", "Blog", "My Post"]`.

### M3. PricingTable Toggle Has No Price-Swapping Logic

**File:** `/Users/david/projects/astro-seo-template/src/components/mdx/PricingTable.astro` (lines 76-100)

The monthly/annual toggle changes visual state (CSS classes) but does not actually swap any pricing data. The toggle feature flag (`toggle` prop) creates a non-functional UI element.

### M4. `Image` Component Used with String `src`

**Files:** Hero.astro (line 63), Gallery.astro (line 32), MdxImage.astro (line 32)

The `Image` component from `astro:assets` is used with string URLs (`src={image.src}`). In Astro 5 with static output, the Image component expects either an imported image or a remote URL configured in `image.domains` / `image.remotePatterns` in astro.config. String paths to local `/images/` will fail unless the images exist in `public/` and are treated as remote.

If images are in `public/`, use a plain `<img>` tag instead -- `astro:assets` Image optimization does not work with public directory assets passed as strings.

### M5. Blog Post URL Construction May Produce Double Slashes

**File:** `/Users/david/projects/astro-seo-template/src/pages/blog/[slug].astro` (line 21)

```javascript
const url = `${Astro.site}blog/${post.id}`;
```

`Astro.site` returns a `URL` object which, when template-interpolated, includes a trailing slash: `https://example.com/blog/my-post`. However, if `site` in config already ends with `/`, this is fine. But `Astro.site` is a `URL` object not a string, so string interpolation calls `URL.toString()` which always includes the trailing `/`. This is actually correct, but the resulting URL lacks a trailing slash on the page path. Be consistent.

### M6. Empty Category Directories

**Directories:**
- `/Users/david/projects/astro-seo-template/src/pages/blog/category/` (empty)
- `/Users/david/projects/astro-seo-template/src/pages/products/category/` (empty)

These suggest incomplete feature implementation. Either add category pages or remove the empty directories.

### M7. `cn()` Utility Is Minimal

**File:** `/Users/david/projects/astro-seo-template/src/lib/utils.ts` (line 1)

The `cn` function is a basic `filter(Boolean).join(' ')`. It does not merge conflicting Tailwind classes (e.g. `cn('px-4', 'px-8')` produces `"px-4 px-8"` rather than `"px-8"`). Consider using `tailwind-merge` if class conflicts are expected, especially since components accept `class` props.

### M8. Content Config Missing `products` Content Directory

No product MDX files were checked for frontmatter structure compliance, but the product collection schema allows optional `image` and `specs`. Products without these fields will render empty product detail pages (no image, no specs table). Consider making `description` more prominent when no image is provided.

### M9. Search Page Pagefind Integration Order

**File:** `/Users/david/projects/astro-seo-template/src/pages/search.astro` (lines 22-34)

The CSS and JS for Pagefind are loaded after the closing `</html>` tag (they appear after the layout closes). While browsers are forgiving, this is technically invalid HTML. The pagefind assets should be loaded via the `head` slot.

---

## Low Priority

### L1. Deprecated `substr` Usage

Multiple files use `Math.random().toString(36).substr(2, 9)`:
- Modal.astro (line 9)
- Tabs.astro (line 13)
- MdxImage.astro (line 27)

`String.prototype.substr` is deprecated. Use `substring(2, 11)` instead.

### L2. Footer Grid Assumes 2 Footer Sections

**File:** `/Users/david/projects/astro-seo-template/src/components/layout/Footer.astro` (line 11)

`grid-cols-1 md:grid-cols-4` assumes the company section + 2 footer nav sections + 1 implicit column = 4. If site-config adds more footer sections, layout breaks.

### L3. Stagger Animation CSS Limited to 5 Children

**File:** `/Users/david/projects/astro-seo-template/src/styles/global.css` (lines 60-65)

The stagger effect only has explicit rules for `:nth-child(1)` through `:nth-child(5)`. The fallback on line 65 (`[data-animate-stagger].is-visible > *`) removes animation for children beyond 5, but they appear instantly without stagger.

### L4. Missing `aria-label` on Navigation

**File:** `/Users/david/projects/astro-seo-template/src/components/layout/Navigation.astro`

Desktop navigation `<nav>` lacks an `aria-label` to distinguish it from the breadcrumb nav and mobile nav.

### L5. ThemeToggle Double Event Listener for System Preference

**File:** `/Users/david/projects/astro-seo-template/src/components/ui/ThemeToggle.astro` (lines 25-28)

The `matchMedia` change listener is added every time `initThemeToggle` runs (on every page navigation). These listeners accumulate because `matchMedia` listeners are not automatically cleaned up.

### L6. `sitemap.astro` Page Partially Duplicates Sitemap Plugin

The human-readable `/sitemap` page manually lists all content. The `@astrojs/sitemap` integration generates `sitemap-index.xml` for search engines. This is fine for UX but adds maintenance surface.

---

## Positive Observations

1. **Clean 3-JSON config architecture** -- Excellent for the fork-per-site pipeline model. Zero brand hardcoding in code.
2. **Proper Astro 5 patterns** -- Uses `glob` loader in content.config.ts, `ClientRouter` (not deprecated ViewTransitions), `render()` API.
3. **Consistent dark mode** -- Proper FOUC prevention with inline script, system preference detection, and view transition re-application.
4. **Good Tailwind CSS 4 usage** -- Correct `@theme` directive for design tokens, `@custom-variant dark` for class-based dark mode.
5. **Strong accessibility** -- `aria-expanded`, `aria-selected`, `role="tablist"`, `aria-label` on buttons, `aria-hidden` on icons, `prefers-reduced-motion` media query.
6. **View transition support** -- All client scripts properly listen to `astro:page-load` for re-initialization.
7. **Solid SEO foundation** -- 3-tier Schema.org (Organization, WebSite, page-specific), OpenGraph + Twitter Cards on every page, canonical URLs, RSS feed.
8. **Well-typed props** -- All components use TypeScript interfaces for props.
9. **Lazy loading** -- Images use `loading="lazy"`, YouTube embeds use privacy-enhanced mode (`youtube-nocookie.com`).
10. **Design system consistency** -- Uniform use of design tokens, consistent component API patterns.

---

## Recommended Actions (Priority Order)

1. **Fix XSS in MdxImage lightbox** (C1) -- Replace innerHTML with DOM creation
2. **Sanitize JSON in script tags** (C2) -- Escape `</script>` in JSON.stringify output
3. **Address form endpoint issue** (C3) -- Document or implement form handling strategy
4. **Fix HTML lang attribute** (H2) -- Use config value
5. **Fix SchemaRenderer slot placement** (H3) -- Use named `schema` slot
6. **Remove double initialization** (H5) -- Remove bare init calls, use only astro:page-load
7. **Fix Gallery/FloatingCTA ID collisions** (H6, H7) -- Use unique IDs per instance
8. **Add noindex to 404** (M1)
9. **Add Home to breadcrumb schema** (M2)
10. **Set explicit trailingSlash config** (H4)

---

## Metrics

- Type Coverage: ~90% (strong interface usage, `Record<string, any>` in SchemaRenderer is the weakest point)
- Test Coverage: 0% (no test files found)
- Linting Issues: 1 TypeScript error (Vite plugin type mismatch, non-blocking)
- Security Issues: 2 critical (XSS, script injection), 1 high (dead form endpoints)
- SEO Issues: 3 (schema slot, breadcrumb home, canonical/trailing slash consistency)
- Accessibility Issues: 2 minor (nav label, double init)
- Total Components: 44 MDX + 6 UI + 4 layout + 3 SEO + 5 section = 62

---

## Unresolved Questions

1. Is the `astro:assets` `Image` component intended to work with `/images/` public paths, or will images be placed in `src/assets/` and imported? Current string-based usage will fail with remote image optimization unless configured.
2. Are the `/api/contact` and `/api/newsletter` endpoints expected to be handled by Cloudflare Functions or an external service? This should be documented.
3. Should the `blog/category/` and `products/category/` empty directories be implemented or removed?
4. Is the `PricingTable` toggle intended to be purely visual, or should it swap price data?
