# Astro 5 + Tailwind CSS 4 Stack Research Report

**Date:** 2026-02-16 | **Researcher:** a239868

---

## 1. Astro 5 + Tailwind CSS 4 Integration

**`@astrojs/tailwind` is DEPRECATED.** Tailwind 4 uses a Vite plugin approach instead.

### Installation (Tailwind 4 + Astro 5)

```bash
npm install tailwindcss @tailwindcss/vite
```

### Config (`astro.config.mjs`)

```js
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### CSS Entry Point (`src/styles/global.css`)

```css
@import "tailwindcss";
```

### Usage in Astro Components

```astro
---
import "../styles/global.css";
---
<h1 class="text-3xl font-bold underline">Hello</h1>
```

**Key points:**
- No `tailwind.config.js` needed -- all config lives in CSS via `@theme`
- No PostCSS config needed -- Vite plugin handles everything
- `astro add tailwind` CLI command also works (auto-configures)
- Astro 5.2+ officially supports Tailwind 4

**Sources:**
- [Tailwind CSS Astro Installation Guide](https://tailwindcss.com/docs/installation/framework-guides/astro)
- [Astro 5.2 Release](https://astro.build/blog/astro-520/)

---

## 2. Tailwind CSS 4 Design Tokens

### CSS-First Config with `@theme`

Tailwind 4 replaces `tailwind.config.js` with CSS-native `@theme` directive. All tokens auto-generate utilities AND CSS custom properties.

```css
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.72 0.11 178);
  --color-secondary: oklch(0.74 0.17 40.24);
  --font-body: "Inter", sans-serif;
  --spacing-lg: 2rem;
  --radius-card: 0.75rem;
}
```

This creates: `bg-primary`, `text-secondary`, `font-body`, `p-lg`, `rounded-card` utilities + `var(--color-primary)` etc. as CSS variables.

### Key Namespaces

| Namespace | Generates | Example |
|---|---|---|
| `--color-*` | Color utilities | `bg-primary`, `text-primary` |
| `--font-*` | Font family | `font-body` |
| `--text-*` | Font size | `text-xl` |
| `--spacing-*` | Padding/margin/sizing | `p-lg`, `m-lg` |
| `--radius-*` | Border radius | `rounded-card` |
| `--shadow-*` | Box shadow | `shadow-md` |
| `--breakpoint-*` | Responsive variants | `md:*` |
| `--animate-*` | Animations | `animate-fade-in` |
| `--ease-*` | Timing functions | `ease-fluid` |

### Overriding Defaults

```css
@theme {
  --color-*: initial;       /* Remove ALL default colors */
  --color-white: #fff;
  --color-brand: #3f3cbb;
}
```

Use `--*: initial` to nuke ALL defaults for fully custom theme.

### Converting JSON Tokens to @theme

**Option A: Simple build script** (recommended for most projects)

Write a Node script that reads `design-tokens.json` and outputs a `.css` file with `@theme` block:

```js
// scripts/generate-theme.mjs
import { readFileSync, writeFileSync } from 'fs';

const tokens = JSON.parse(readFileSync('design-tokens.json', 'utf-8'));
let css = '@theme {\n';

for (const [category, values] of Object.entries(tokens)) {
  for (const [name, value] of Object.entries(values)) {
    css += `  --${category}-${name}: ${value};\n`;
  }
}

css += '}\n';
writeFileSync('src/styles/theme.css', css);
```

Then import in your main CSS:
```css
@import "tailwindcss";
@import "./theme.css";
```

**Option B: Style Dictionary** (enterprise/Figma workflows)

Use [tokens-studio/sd-tailwindv4](https://github.com/tokens-studio/sd-tailwindv4) -- a Style Dictionary workflow that outputs `@theme` CSS from JSON tokens. Best for Figma Tokens Studio integration.

**Option C: Direct CSS** (simplest)

Just write tokens directly in CSS. No JSON needed. This is the Tailwind 4 recommended way.

### `@theme inline` for Variable References

```css
@theme inline {
  --font-sans: var(--font-inter);  /* Resolves at use-time, not definition-time */
}
```

### Sharing Tokens Across Projects

```css
/* packages/brand/theme.css */
@theme {
  --*: initial;
  --color-brand: oklch(0.72 0.11 221.19);
  --font-body: Inter, sans-serif;
}
```

```css
/* app.css */
@import "tailwindcss";
@import "../brand/theme.css";
```

**Sources:**
- [Tailwind CSS Theme Variables Docs](https://tailwindcss.com/docs/theme)
- [Tailwind CSS v4.0 Blog Post](https://tailwindcss.com/blog/tailwindcss-v4)
- [tokens-studio/sd-tailwindv4](https://github.com/tokens-studio/sd-tailwindv4)

---

## 3. Astro 5 Content Collections

### Config File: `src/content.config.ts`

```ts
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
  }),
});

const authors = defineCollection({
  loader: file("src/data/authors.json"),
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    avatar: z.string(),
  }),
});

export const collections = { blog, authors };
```

### Built-in Loaders

| Loader | Use Case | ID Source |
|---|---|---|
| `glob()` | One file per entry (Markdown, MDX, JSON, YAML) | Filename |
| `file()` | Multiple entries in single file (JSON array, CSV) | `id` field in data |

### Custom Loader (remote API)

```ts
const products = defineCollection({
  loader: async () => {
    const res = await fetch("https://api.example.com/products");
    const data = await res.json();
    return data.map((p) => ({ id: p.slug, ...p }));
  },
  schema: z.object({ /* ... */ }),
});
```

### Querying

```ts
import { getCollection, getEntry, render } from 'astro:content';

// All entries
const posts = await getCollection('blog');

// Filtered
const published = await getCollection('blog', ({ data }) => !data.draft);

// Single entry
const post = await getEntry('blog', 'my-post-slug');

// Render markdown/MDX content
const { Content, headings } = await render(post);
```

### References Between Collections

```ts
import { reference } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    author: reference('authors'),
    relatedPosts: z.array(reference('blog')),
  }),
});
```

### Route Generation

```ts
// src/pages/blog/[id].astro
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { id: post.id },
    props: { post },
  }));
}
```

**Performance:** 5x faster Markdown builds, 2x faster MDX, 25-50% less memory vs Astro 4.

**Sources:**
- [Astro Content Collections Docs](https://docs.astro.build/en/guides/content-collections/)
- [Content Layer Deep Dive](https://astro.build/blog/content-layer-deep-dive/)
- [Astro 5.0 Release](https://astro.build/blog/astro-5/)

---

## 4. MDX Auto-Import in Astro 5

**Yes, possible via `astro-auto-import` integration.**

### Installation

```bash
npm install astro-auto-import
```

### Config (`astro.config.mjs`)

```js
import AutoImport from 'astro-auto-import';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [
    AutoImport({
      imports: [
        './src/components/Callout.astro',
        './src/components/CodeBlock.astro',
        './src/components/Button.astro',
      ],
    }),
    mdx(),  // MUST come AFTER AutoImport
  ],
});
```

**Critical:** `AutoImport` must be listed BEFORE `mdx()` in integrations array.

### MDX Usage (no imports needed)

```mdx
# My Blog Post

<Callout type="warning">Watch out!</Callout>

<Button href="/signup">Get Started</Button>
```

### Alternative: `components` Prop

For dynamic content rendering, pass components via the `components` prop:

```astro
---
const { Content } = await render(post);
---
<Content components={{ Callout, Button }} />
```

**Sources:**
- [astro-auto-import GitHub](https://github.com/delucis/astro-auto-import)
- [Component Auto Import in Astro](https://lirantal.com/blog/component-auto-import-in-astro-framework)

---

## 5. Best Astro UI Component Libraries (2025-2026)

### Tier 1: Astro-Native (No JS Framework Required)

| Library | Approach | Tailwind | Notes |
|---|---|---|---|
| **[bejamas/ui](https://bejamas.com/blog/introducing-bejamas-ui-an-astro-native-component-library)** | Copy-and-own `.astro` files | v4 | Zero-JS default, shadcn-compatible tokens, CLI: `bunx bejamas@latest add button` |
| **[fulldev/ui](https://github.com/fulldotdev/ui)** | Vanilla Astro, zero deps | v4 | Content-first blocks (heroes, pricing, CTAs), shadcn-compatible |

### Tier 2: Framework-Based (Requires React/Svelte/Vue)

| Library | Framework | Notes |
|---|---|---|
| **[shadcn/ui](https://ui.shadcn.com/docs/installation/astro)** | React | Largest ecosystem, but adds React runtime to Astro |
| **[Flowbite](https://flowbite.com/docs/getting-started/astro/)** | Vanilla JS/React | 56+ components, works with Tailwind |

### Recommendation

For an SEO-focused Astro template: **bejamas/ui** or **fulldev/ui** -- both are Astro-native (zero client JS), built on Tailwind v4, and follow copy-and-own philosophy. Avoid shadcn/ui unless you need React interactivity, since it adds unnecessary JS bundle for static/SEO sites.

---

## 6. Astro 5 View Transitions

### Setup (2 lines)

```astro
---
import { ClientRouter } from "astro:transitions";
---
<html>
  <head>
    <ClientRouter />
  </head>
</html>
```

**Note:** `<ViewTransitions />` is deprecated in Astro 5, renamed to `<ClientRouter />`.

### Transition Directives

```astro
<!-- Name elements for cross-page matching -->
<h1 transition:name="page-title">{title}</h1>

<!-- Animate: fade (default), slide, initial, none -->
<main transition:animate="slide">

<!-- Persist elements across navigations -->
<video controls transition:persist>
<AudioPlayer transition:persist="media-player" />
```

### Lifecycle Events

| Event | When | Use Case |
|---|---|---|
| `astro:before-preparation` | Navigation starts | Show loading indicator |
| `astro:after-preparation` | New content loaded | Pre-process DOM |
| `astro:before-swap` | Before DOM replacement | Save scroll position |
| `astro:after-swap` | After DOM swap | Update third-party widgets |
| `astro:page-load` | Page fully loaded | Re-init analytics, listeners |

### Re-initializing Scripts

```js
document.addEventListener("astro:page-load", () => {
  // Runs on every page navigation
  initAnalytics();
  setupEventListeners();
});
```

### Programmatic Navigation

```js
import { navigate } from "astro:transitions/client";
navigate("/blog");
```

### Link Control

```html
<!-- Force full page reload -->
<a href="/external" data-astro-reload>External</a>

<!-- Control history behavior -->
<a href="/page" data-astro-history="replace">Replace</a>
```

### Fallback for Unsupported Browsers

```astro
<ClientRouter fallback="swap" />
<!-- Options: "animate" (default), "swap", "none" -->
```

### Accessibility

- Auto-announces route changes via page title
- Respects `prefers-reduced-motion` -- disables animations automatically

### Browser Support

85%+ as of 2025. Chrome 126+, Firefox 144+ (Oct 2025). Unsupported browsers get normal page navigation (no animation, full functionality).

**Sources:**
- [Astro View Transitions Docs](https://docs.astro.build/en/guides/view-transitions/)
- [View Transitions Router API Reference](https://docs.astro.build/en/reference/modules/astro-transitions/)

---

## Unresolved Questions

1. **bejamas/ui maturity** -- Relatively new (2025). Unclear how many production sites use it. Worth evaluating component coverage against project needs before committing.
2. **Tailwind 4 + Astro content collections images** -- Image optimization in content collections with Tailwind 4's new asset handling not fully documented; may need custom `image()` schema helper from Astro.
3. **MDX auto-import + content collections** -- `astro-auto-import` v0.5.1 confirmed working with Astro 5, but no official Astro-maintained solution exists. If the package becomes unmaintained, the `components` prop approach is the fallback.
4. **Astro 6 alpha** -- Released Dec 2025 with Zod 4, workerd dev mode. Content collections API may change. Current Astro 5 patterns should remain stable for production use.
