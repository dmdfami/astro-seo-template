# Research Report: Astro Premium B2B Template Stack

**Date:** 2026-02-16
**Context:** /Users/david/projects/astro-seo-template

---

## 1. Top Premium Astro Templates - Design Patterns & Architecture

### Market Overview
Premium Astro templates (2025-2026) cost ~$29, built on Astro 5.x + Tailwind CSS 4.x. Key players: Colorlib, Themefisher, Tailkits, GetAstroThemes.

### Common Design Patterns (B2B/Corporate)

| Pattern | Usage |
|---------|-------|
| Hero + Stats + Features Grid | Every B2B template |
| Trust indicators (metrics, logos, badges) | SaaSify, LogiTrans, WealthWise |
| Tiered pricing tables | SaaS/fintech templates |
| Testimonial carousels | Universal |
| Scroll-triggered animations | CreativeX, SaaSify |
| Dark mode w/ OS detection | Most premium templates |
| Data-driven TypeScript content files | All Colorlib templates |

### Component Architecture Pattern

All premium templates follow this architecture:
```
data files (TS/JSON) --> Astro components --> static HTML
                         ^-- design tokens (CSS vars)
```

- **Data-driven content**: All text/images/config in TS files, zero hardcode in components
- **Island Architecture**: Interactive widgets hydrate only when hitting viewport
- **Section-based composition**: Pages built from reusable section components (HeroSection, StatsSection, TestimonialsSection)
- **Atomic UI layer**: Button, Badge, Card, Input as base; composed into sections

### Key Takeaway for This Project
The project spec aligns perfectly with market patterns. JSON config approach (design-tokens.json, site-config.json, schema-org.json) is the correct architecture.

---

## 2. Glassmorphism + Gradient Design System

### Core CSS Recipe

```css
/* Base glassmorphism card */
.glass-card {
  background: rgba(255, 255, 255, 0.08);    /* 0.08-0.15 opacity */
  backdrop-filter: blur(12px);               /* 8-15px sweet spot */
  -webkit-backdrop-filter: blur(12px);       /* Safari */
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  border-radius: 1rem;
}
```

### Design Tokens Integration (Tailwind 4)

```css
@theme {
  /* Glassmorphism tokens */
  --glass-bg: rgba(255, 255, 255, 0.08);
  --glass-bg-light: rgba(255, 255, 255, 0.15);
  --glass-border: rgba(255, 255, 255, 0.18);
  --glass-blur: 12px;
  --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);

  /* Gradient tokens */
  --gradient-hero: linear-gradient(135deg, var(--color-primary-600), var(--color-secondary-500));
  --gradient-card: linear-gradient(135deg, var(--color-primary-900), var(--color-primary-800));
  --gradient-accent: linear-gradient(135deg, var(--color-accent-400), var(--color-accent-600));
}
```

### Practical Tailwind Utility Classes

Create custom utilities in global.css:

```css
@layer utilities {
  .glass {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    box-shadow: var(--glass-shadow);
  }
  .glass-light {
    background: var(--glass-bg-light);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
  }
}
```

### Enhanced Glassmorphism Variants

```css
/* Blur + brightness for premium feel */
backdrop-filter: blur(12px) brightness(1.1);

/* Blur + saturation for vivid backgrounds */
backdrop-filter: blur(12px) saturate(180%);
```

### Performance Rules
- Use `backdrop-filter` on max 3-5 elements per viewport
- Add `transform: translateZ(0)` for GPU acceleration
- Use `will-change: backdrop-filter` only during animation, remove after
- Provide solid `background` fallback via `@supports`:

```css
@supports not (backdrop-filter: blur(12px)) {
  .glass-card {
    background: rgba(15, 23, 42, 0.95); /* solid fallback */
  }
}
```

### Gradient Background Patterns

```css
/* Multi-stop gradient for hero sections */
.hero-gradient {
  background: linear-gradient(
    135deg,
    var(--color-primary-900) 0%,
    var(--color-primary-700) 40%,
    var(--color-secondary-600) 70%,
    var(--color-accent-500) 100%
  );
}

/* Animated gradient (subtle) */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.gradient-animate {
  background-size: 200% 200%;
  animation: gradient-shift 15s ease infinite;
}

/* Mesh gradient (organic look) */
.mesh-gradient {
  background:
    radial-gradient(at 20% 80%, var(--color-primary-500) 0%, transparent 50%),
    radial-gradient(at 80% 20%, var(--color-secondary-400) 0%, transparent 50%),
    radial-gradient(at 50% 50%, var(--color-accent-300) 0%, transparent 50%),
    var(--color-primary-950);
}
```

### Dark Mode Glass
In dark mode, flip glass opacity:
- Light mode: `rgba(255, 255, 255, 0.08-0.15)`
- Dark mode: `rgba(0, 0, 0, 0.2-0.4)` or `rgba(255, 255, 255, 0.03-0.06)`

### Browser Support
~95% global (2025). Always use `-webkit-` prefix. Safari needs it.

---

## 3. Animation Approaches for Astro

### Recommended Strategy: IntersectionObserver + CSS Animations

This is the best fit for Astro's static-first approach. Zero JS bundle cost for animations themselves.

### Implementation Pattern

**scroll-reveal.css** - Define animation states:
```css
/* Initial hidden state */
[data-animate] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

/* Visible state */
[data-animate].is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Variants */
[data-animate="fade-up"] { transform: translateY(30px); }
[data-animate="fade-down"] { transform: translateY(-30px); }
[data-animate="fade-left"] { transform: translateX(30px); }
[data-animate="fade-right"] { transform: translateX(-30px); }
[data-animate="scale"] { transform: scale(0.95); }
[data-animate="scale"].is-visible { transform: scale(1); }

/* Stagger children */
[data-animate-stagger] > * {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
[data-animate-stagger].is-visible > *:nth-child(1) { transition-delay: 0ms; }
[data-animate-stagger].is-visible > *:nth-child(2) { transition-delay: 100ms; }
[data-animate-stagger].is-visible > *:nth-child(3) { transition-delay: 200ms; }
[data-animate-stagger].is-visible > *:nth-child(4) { transition-delay: 300ms; }
[data-animate-stagger].is-visible > *:nth-child(5) { transition-delay: 400ms; }
[data-animate-stagger].is-visible > * { opacity: 1; transform: translateY(0); }
```

**scroll-observer.js** - Minimal inline script:
```html
<script is:inline>
(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  document.querySelectorAll('[data-animate], [data-animate-stagger]').forEach(el => {
    observer.observe(el);
  });
})();
</script>
```

### Usage in Astro Components
```astro
<section data-animate="fade-up">
  <h2>Features</h2>
</section>

<div data-animate-stagger class="grid grid-cols-3 gap-6">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</div>
```

### CSS-Only Micro-Interactions (No JS)

```css
/* Button hover glow */
.btn-primary {
  transition: all 0.3s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(var(--color-accent-500), 0.4);
}

/* Card hover lift */
.card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
}

/* Animated counter (CSS counter + keyframes) */
@property --num {
  syntax: '<integer>';
  initial-value: 0;
  inherits: false;
}
.counter {
  animation: count-up 2s ease-out forwards;
  counter-reset: num var(--num);
}
.counter::after {
  content: counter(num);
}
@keyframes count-up {
  from { --num: 0; }
  to { --num: var(--target); }
}
```

### Astro View Transitions Integration

```astro
---
import { ViewTransitions } from 'astro:transitions';
---
<head>
  <ViewTransitions />
</head>
```

- Use `transition:persist` on elements that should survive page navigation (audio, video, nav state)
- Use `transition:animate="slide"` for page-level transitions
- View Transitions + scroll animations work together; re-init observer on `astro:page-load` event:

```html
<script is:inline>
document.addEventListener('astro:page-load', () => {
  // Re-initialize IntersectionObserver after view transition
  initScrollObserver();
});
</script>
```

### Alternative: Motion Library (GSAP Alternative)

If richer animations needed beyond CSS, use **Motion** (formerly Framer Motion for vanilla JS):
```bash
npm install motion
```
```html
<script>
  import { animate, stagger, inView } from "motion";

  inView(".card", ({ target }) => {
    animate(target, { opacity: [0, 1], y: [30, 0] }, {
      duration: 0.5,
      easing: [0.17, 0.55, 0.55, 1.0]
    });
  }, { amount: 0.25 });
</script>
```

**Recommendation**: Start with IntersectionObserver + CSS. Only add Motion lib if specific animations require spring physics or complex sequencing.

### CSS Scroll-Driven Animations (Future)

`animation-timeline: scroll()` and `view()` landed in Safari 26 (2025) and Chrome 145 (2026). ~85% support by mid-2026. Not yet production-safe for universal audience; use as progressive enhancement:

```css
@supports (animation-timeline: view()) {
  .parallax-bg {
    animation: parallax linear both;
    animation-timeline: view();
  }
  @keyframes parallax {
    from { transform: translateY(-20%); }
    to { transform: translateY(20%); }
  }
}
```

### Reduced Motion Support (A11y)

```css
@media (prefers-reduced-motion: reduce) {
  [data-animate],
  [data-animate-stagger] > * {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
    animation: none !important;
  }
}
```

---

## 4. Schema.org JSON-LD - 3-Tier Architecture for Astro

### Tier 1: BaseLayout (Site-Wide)

Read `schema-org.json` at build time, render Organization + WebSite on every page.

**src/lib/schema-renderer.ts:**
```typescript
import schemaOrg from '../../schema-org.json';

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: schemaOrg.organization.name,
    url: schemaOrg.organization.url,
    logo: schemaOrg.organization.logo,
    sameAs: schemaOrg.organization.sameAs,
    contactPoint: schemaOrg.organization.contactPoint,
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: schemaOrg.website.name,
    url: schemaOrg.website.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${schemaOrg.website.url}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}
```

**BaseLayout.astro:**
```astro
---
import { getOrganizationSchema, getWebSiteSchema } from '../lib/schema-renderer';
const orgSchema = getOrganizationSchema();
const siteSchema = getWebSiteSchema();
---
<html>
<head>
  <script type="application/ld+json" set:html={JSON.stringify(orgSchema)} />
  <script type="application/ld+json" set:html={JSON.stringify(siteSchema)} />
  <slot name="schema" />  <!-- Tier 2 schemas injected here -->
</head>
```

### Tier 2: Page Templates (from frontmatter contentType)

**src/components/seo/SchemaRenderer.astro:**
```astro
---
import type { CollectionEntry } from 'astro:content';
import schemaOrg from '../../../schema-org.json';

interface Props {
  contentType: string;
  frontmatter: Record<string, any>;
  url: string;
}

const { contentType, frontmatter, url } = Astro.props;

function buildSchema() {
  const schemas: object[] = [];

  // BreadcrumbList (always)
  schemas.push(buildBreadcrumb(url));

  // Content-type specific
  switch(contentType) {
    case 'blog':
      schemas.push(buildArticleSchema(frontmatter, url));
      break;
    case 'product':
      schemas.push(buildProductSchema(frontmatter, url));
      break;
    case 'landing':
    case 'homepage':
      // Organization already in Tier 1
      break;
  }

  // FAQ (if frontmatter has faq array)
  if (frontmatter.faq?.length) {
    schemas.push(buildFAQSchema(frontmatter.faq));
  }

  // HowTo (if frontmatter has steps array)
  if (frontmatter.steps?.length) {
    schemas.push(buildHowToSchema(frontmatter));
  }

  return schemas;
}

function buildBreadcrumb(url: string) {
  const parts = url.replace(/\/$/, '').split('/').filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: parts.map((part, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: part.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      item: `${schemaOrg.website.url}/${parts.slice(0, i + 1).join('/')}/`
    }))
  };
}

function buildArticleSchema(fm: Record<string, any>, url: string) {
  const author = schemaOrg.authors?.[fm.author] || { name: fm.author };
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: fm.title,
    description: fm.description,
    image: fm.image?.src,
    datePublished: fm.publishDate,
    dateModified: fm.updatedDate || fm.publishDate,
    author: { "@type": "Person", name: author.name, url: author.url },
    publisher: { "@type": "Organization", name: schemaOrg.organization.name, logo: { "@type": "ImageObject", url: schemaOrg.organization.logo } },
    mainEntityOfPage: { "@type": "WebPage", "@id": url }
  };
}

function buildProductSchema(fm: Record<string, any>, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: fm.title,
    description: fm.description,
    image: fm.image?.src,
    brand: { "@type": "Brand", name: schemaOrg.organization.name },
    ...(fm.specs && { additionalProperty: Object.entries(fm.specs).map(([k, v]) => ({
      "@type": "PropertyValue", name: k, value: v
    }))})
  };
}

function buildFAQSchema(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a }
    }))
  };
}

function buildHowToSchema(fm: Record<string, any>) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: fm.title,
    step: fm.steps.map((s: { name: string; text: string }, i: number) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text
    }))
  };
}

const schemas = buildSchema();
---

{schemas.map(schema => (
  <script type="application/ld+json" set:html={JSON.stringify(schema)} />
))}
```

### Tier 3: AI Content Writer

Writer only produces frontmatter with `contentType`, `faq`, `specs`, `steps`. Template handles all JSON-LD generation. **Zero JSON-LD in MDX content.**

### Validation
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org validator: https://validator.schema.org/

---

## 5. Pagefind Integration with Astro 5

### Recommended: astro-pagefind Package

Use `astro-pagefind` (not manual) for dev mode support and simpler DX.

### Setup

```bash
npm i astro-pagefind
```

**astro.config.mjs** (add LAST in integrations):
```javascript
import { defineConfig } from "astro/config";
import pagefind from "astro-pagefind";

export default defineConfig({
  integrations: [
    mdx(),
    sitemap(),
    pagefind(),  // MUST be last
  ],
});
```

### Search Component

**src/components/ui/Search.astro:**
```astro
---
import Search from "astro-pagefind/components/Search";
---
<Search
  id="search"
  className="pagefind-ui"
  uiOptions={{ showImages: false, showSubResults: true }}
/>
```

### Custom Styling (match design tokens)

```css
/* Override Pagefind UI variables */
:root {
  --pagefind-ui-scale: 1;
  --pagefind-ui-primary: var(--color-primary-600);
  --pagefind-ui-text: var(--color-neutral-800);
  --pagefind-ui-background: var(--color-neutral-50);
  --pagefind-ui-border: var(--color-neutral-200);
  --pagefind-ui-tag: var(--color-primary-100);
  --pagefind-ui-border-width: 1px;
  --pagefind-ui-border-radius: var(--radius-lg);
  --pagefind-ui-font: inherit;
}

/* Dark mode overrides */
.dark {
  --pagefind-ui-primary: var(--color-primary-400);
  --pagefind-ui-text: var(--color-neutral-200);
  --pagefind-ui-background: var(--color-neutral-900);
  --pagefind-ui-border: var(--color-neutral-700);
  --pagefind-ui-tag: var(--color-primary-900);
}
```

### Content Indexing Control

Use `data-pagefind-*` attributes in templates:
```html
<main data-pagefind-body>
  <h1 data-pagefind-meta="title">{title}</h1>
  <article>{content}</article>
</main>

<!-- Exclude from search -->
<nav data-pagefind-ignore>...</nav>
<footer data-pagefind-ignore>...</footer>
```

### Lazy Loading (Performance)

For custom API approach (if not using PagefindUI):
```javascript
let pagefind;
searchInput.addEventListener("focus", async () => {
  if (!pagefind) {
    pagefind = await import("/pagefind/pagefind.js");
    pagefind.init();
  }
});
```

### View Transitions Compatibility

astro-pagefind supports View Transitions out of the box.

### Vite Config (if using bundled scripts)

```javascript
// astro.config.mjs
export default defineConfig({
  vite: {
    build: {
      rollupOptions: {
        external: ['/pagefind/pagefind.js']
      }
    }
  }
});
```

---

## 6. Dark Mode in Tailwind CSS 4 (CSS-First)

### Configuration

**src/styles/global.css:**
```css
@import "tailwindcss";

/* Dark mode via class toggle (manual control) */
@custom-variant dark (&:where(.dark, .dark *));

/* Design tokens with dark mode variants */
@theme {
  /* Light mode defaults (in @theme) */
  --color-surface: #ffffff;
  --color-surface-alt: #f0fdfa;
  --color-text-primary: #134e4a;
  --color-text-secondary: #374151;
  --color-border: rgba(0, 0, 0, 0.1);
}
```

### Dark Mode Color Tokens (via CSS)

```css
/* After @import and @theme, define dark overrides */
:root {
  --color-surface: #ffffff;
  --color-surface-alt: #f0fdfa;
  --color-text-primary: #134e4a;
  --color-text-secondary: #374151;
}

.dark {
  --color-surface: #0f172a;
  --color-surface-alt: #1e293b;
  --color-text-primary: #e2e8f0;
  --color-text-secondary: #94a3b8;
}
```

### Toggle Script (Inline in `<head>` to Prevent FOUC)

**BaseLayout.astro:**
```astro
<head>
  <!-- MUST be inline, MUST be in head, prevents FOUC -->
  <script is:inline>
    (function() {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    })();
  </script>
</head>
```

### Toggle Component

**src/components/ui/ThemeToggle.astro:**
```astro
<button
  id="theme-toggle"
  type="button"
  class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
  aria-label="Toggle dark mode"
>
  <!-- Sun icon (shown in dark mode) -->
  <svg class="hidden dark:block w-5 h-5" ...><!-- sun --></svg>
  <!-- Moon icon (shown in light mode) -->
  <svg class="block dark:hidden w-5 h-5" ...><!-- moon --></svg>
</button>

<script is:inline>
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Listen for system changes when user hasn't set preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      document.documentElement.classList.toggle('dark', e.matches);
    }
  });
</script>
```

### Three-State Toggle (Light / Dark / System)

```javascript
function setTheme(mode) {
  if (mode === 'system') {
    localStorage.removeItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', systemDark);
  } else {
    localStorage.setItem('theme', mode);
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }
}
```

### View Transitions Compatibility

Re-apply theme after view transition swap:
```html
<script is:inline>
  document.addEventListener('astro:after-swap', () => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });
</script>
```

### Using dark: Variant in Templates

```html
<div class="bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
  <div class="glass dark:glass-dark">
    <!-- glass card adapts to dark mode -->
  </div>
</div>
```

---

## Bonus: Astro 5 + Tailwind 4 - Design Tokens Bridge

### How design-tokens.json Maps to @theme

**Build-time script** (or Astro integration): Read `design-tokens.json`, generate CSS variables for `@theme`.

**Option A: Direct CSS file generation from JSON** (recommended for this project):

```typescript
// src/lib/design-tokens.ts
import tokens from '../../design-tokens.json';

export function generateThemeCSS(tokens: DesignTokens): string {
  return `
@theme {
  --color-primary-50: ${tokens.colors.primary[50]};
  --color-primary-100: ${tokens.colors.primary[100]};
  /* ... generated from JSON ... */
  --font-heading: ${tokens.typography.fonts.heading};
  --font-body: ${tokens.typography.fonts.body};
  --radius-sm: ${tokens.borderRadius.sm};
  --radius-md: ${tokens.borderRadius.md};
  /* etc */
}`;
}
```

**Option B: Use CSS custom properties alongside @theme:**

Keep @theme for Tailwind utility generation, use `:root` + `.dark` for runtime-swappable tokens. This is the pragmatic approach because @theme values are resolved at build time while :root CSS vars change at runtime.

### Recommended Hybrid Approach

```css
/* global.css */
@import "tailwindcss";

/* Static design tokens (generate utilities) */
@theme {
  --font-heading: "Inter", "DM Sans", sans-serif;
  --font-body: "Source Serif Pro", Georgia, serif;
  --color-primary-50: oklch(0.97 0.01 175);
  --color-primary-500: oklch(0.60 0.13 175);
  --color-primary-600: oklch(0.52 0.13 175);
  --color-accent-500: oklch(0.77 0.16 75);
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --spacing: 0.25rem;
}

/* Runtime-swappable tokens (dark mode, theming) */
@custom-variant dark (&:where(.dark, .dark *));
```

---

## Summary of Recommendations

| Topic | Recommendation |
|-------|---------------|
| Template architecture | Data-driven JSON/TS config, section-based composition, atomic UI layer |
| Glassmorphism | `backdrop-filter: blur(12px)` + 8-15% opacity, max 3-5 elements/viewport |
| Animations | IntersectionObserver + CSS transitions (zero JS bundle). Motion lib only if needed |
| Schema.org | 3-tier: BaseLayout (Org+Site), SchemaRenderer component (Article/Product/FAQ), frontmatter-only from writers |
| Pagefind | `astro-pagefind` package (not manual). Last in integrations array |
| Dark mode | `@custom-variant dark` + inline `<head>` script + `astro:after-swap` event |
| Design tokens | Hybrid: `@theme` for utility generation + `:root`/`.dark` for runtime swap |

---

## Unresolved Questions

1. **CSS scroll-driven animations**: `animation-timeline: view()` now in Safari 26 + Chrome 145. Worth using as progressive enhancement? Or wait for wider adoption?
2. **Motion vs vanilla IntersectionObserver**: For the 40+ MDX components, some (Counter, ProgressBar, BeforeAfter slider) may need Motion lib for spring physics. Decide per-component or commit to one approach?
3. **design-tokens.json generation**: Should use a build-time script to auto-generate the `@theme` CSS from JSON, or manually maintain CSS? Build script adds complexity but ensures single source of truth.
4. **Pagefind + View Transitions**: astro-pagefind claims compatibility, but should test with the actual site to verify no edge cases with search state persistence during navigation.
