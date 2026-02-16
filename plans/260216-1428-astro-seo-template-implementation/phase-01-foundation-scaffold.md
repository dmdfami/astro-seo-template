# Phase 1: Foundation & Scaffold

**Priority:** P1 | **Status:** ✅ completed | **Effort:** 6h

## Context Links

- **Research**: [Stack Research](../reports/researcher-260216-1413-astro5-tailwind4-stack-research.md)
- **Architecture**: [Brainstorm](../reports/brainstorm-260216-1408-astro-seo-template-architecture.md)

## Overview

Scaffold Astro 5 + Tailwind 4 + MDX + TypeScript. Create config system (design-tokens.json, site-config.json, schema-org.json), content collections, BaseLayout, build scripts, and `astro-auto-import` setup. This is the foundation for all subsequent phases.

## Key Insights

- `@astrojs/tailwind` is DEPRECATED — use `@tailwindcss/vite` plugin
- Config file is `src/content.config.ts` (NOT `src/content/config.ts` — Astro 5 change)
- ALL content is `.mdx` — `.md` files are only human-readable copies from web-cloner
- `astro-auto-import` MUST come BEFORE `mdx()` in integrations array
- Design tokens flow: JSON → build script → `@theme` CSS + `:root`/`.dark` runtime vars
- **Google Fonts CDN** for font loading — add `<link>` to BaseLayout
- **`output: 'static'`** in astro.config — 100% static for CF Pages deployment
- **`lang="en"`** default — English only, i18n deferred
<!-- Updated: Validation Session 1 - Added Google Fonts, static output, locale decisions -->

## Requirements

### Functional
- Astro 5 + Tailwind 4 + MDX + TypeScript scaffold
- Three JSON config files with schemas
- Content collections for blog, products, pages
- Build script to generate `@theme` CSS from design-tokens.json
- BaseLayout with Organization + WebSite schema
- MDX auto-import for all `src/components/mdx/*` components

### Non-Functional
- Build time < 5s for empty project
- TypeScript strict mode enabled
- Zero build warnings
- All paths use absolute imports via tsconfig

## Architecture

```
astro-seo-template/
├── design-tokens.json          ← Colors, typography, spacing, glass tokens
├── site-config.json            ← Site meta, nav, social, feature flags
├── schema-org.json             ← Organization, WebSite, authors, contact
├── package.json
├── astro.config.mjs            ← Vite tailwind plugin, auto-import, mdx, pagefind
├── tsconfig.json               ← Strict mode, path aliases
├── scripts/
│   └── generate-theme.mjs      ← Reads design-tokens.json → outputs theme.css
├── src/
│   ├── content.config.ts       ← Content collections (blog, products, pages)
│   ├── env.d.ts
│   ├── styles/
│   │   ├── global.css          ← @import tailwindcss, theme.css, utilities
│   │   └── theme.css           ← AUTO-GENERATED from design-tokens.json
│   ├── layouts/
│   │   └── BaseLayout.astro    ← HTML shell, schema tier 1, dark mode script
│   ├── components/             ← Placeholder dirs for future phases
│   │   ├── mdx/
│   │   ├── layout/
│   │   ├── sections/
│   │   ├── ui/
│   │   └── seo/
│   ├── lib/
│   │   ├── types.ts            ← Global types
│   │   └── utils.ts            ← Utility functions
│   └── pages/
│       └── index.astro         ← Test homepage (Hello World)
└── public/
    └── robots.txt
```

## Related Code Files

### To Create
- `/Users/david/projects/astro-seo-template/design-tokens.json`
- `/Users/david/projects/astro-seo-template/site-config.json`
- `/Users/david/projects/astro-seo-template/schema-org.json`
- `/Users/david/projects/astro-seo-template/package.json`
- `/Users/david/projects/astro-seo-template/astro.config.mjs`
- `/Users/david/projects/astro-seo-template/tsconfig.json`
- `/Users/david/projects/astro-seo-template/scripts/generate-theme.mjs`
- `/Users/david/projects/astro-seo-template/src/content.config.ts`
- `/Users/david/projects/astro-seo-template/src/env.d.ts`
- `/Users/david/projects/astro-seo-template/src/styles/global.css`
- `/Users/david/projects/astro-seo-template/src/layouts/BaseLayout.astro`
- `/Users/david/projects/astro-seo-template/src/lib/types.ts`
- `/Users/david/projects/astro-seo-template/src/lib/utils.ts`
- `/Users/david/projects/astro-seo-template/src/pages/index.astro`
- `/Users/david/projects/astro-seo-template/public/robots.txt`
- `/Users/david/projects/astro-seo-template/.gitignore`
- `/Users/david/projects/astro-seo-template/README.md`

## Implementation Steps

### 1. Initialize Astro 5 Project

```bash
cd /Users/david/projects/astro-seo-template
npm create astro@latest . -- --template minimal --typescript strict --install --git --no-dry-run
```

### 2. Install Dependencies

```bash
npm install tailwindcss @tailwindcss/vite
npm install astro-auto-import @astrojs/mdx astro-pagefind
npm install -D @types/node
```

### 3. Create `design-tokens.json`

```json
{
  "colors": {
    "primary": {
      "50": "oklch(0.97 0.01 178)",
      "100": "oklch(0.94 0.03 178)",
      "200": "oklch(0.88 0.06 178)",
      "300": "oklch(0.79 0.09 178)",
      "400": "oklch(0.69 0.11 178)",
      "500": "oklch(0.60 0.13 178)",
      "600": "oklch(0.52 0.13 178)",
      "700": "oklch(0.43 0.11 178)",
      "800": "oklch(0.35 0.09 178)",
      "900": "oklch(0.27 0.07 178)",
      "950": "oklch(0.17 0.05 178)"
    },
    "secondary": {
      "50": "oklch(0.97 0.02 40)",
      "500": "oklch(0.74 0.17 40.24)",
      "900": "oklch(0.35 0.10 40)"
    },
    "accent": {
      "400": "oklch(0.77 0.16 75)",
      "500": "oklch(0.72 0.18 75)",
      "600": "oklch(0.65 0.19 75)"
    },
    "neutral": {
      "50": "#fafaf9",
      "100": "#f5f5f4",
      "200": "#e7e5e4",
      "300": "#d6d3d1",
      "400": "#a8a29e",
      "500": "#78716c",
      "600": "#57534e",
      "700": "#44403c",
      "800": "#292524",
      "900": "#1c1917",
      "950": "#0c0a09"
    }
  },
  "typography": {
    "fonts": {
      "heading": "\"Inter\", \"DM Sans\", system-ui, sans-serif",
      "body": "\"Inter\", system-ui, sans-serif",
      "mono": "\"JetBrains Mono\", \"Fira Code\", monospace"
    },
    "sizes": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem"
    }
  },
  "spacing": {
    "xs": "0.5rem",
    "sm": "0.75rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem",
    "2xl": "3rem",
    "3xl": "4rem"
  },
  "radius": {
    "sm": "0.25rem",
    "md": "0.5rem",
    "lg": "0.75rem",
    "xl": "1rem",
    "2xl": "1.5rem",
    "full": "9999px"
  },
  "shadows": {
    "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.15)"
  },
  "glass": {
    "bg": "rgba(255, 255, 255, 0.08)",
    "bgLight": "rgba(255, 255, 255, 0.15)",
    "border": "rgba(255, 255, 255, 0.18)",
    "blur": "12px"
  },
  "gradients": {
    "hero": "linear-gradient(135deg, var(--color-primary-600), var(--color-secondary-500))",
    "card": "linear-gradient(135deg, var(--color-primary-900), var(--color-primary-800))",
    "accent": "linear-gradient(135deg, var(--color-accent-400), var(--color-accent-600))"
  }
}
```

### 4. Create `site-config.json`

```json
{
  "site": {
    "name": "Example Corp",
    "url": "https://example.com",
    "description": "Leading provider of industrial solutions",
    "language": "en",
    "defaultImage": "/images/og-default.jpg"
  },
  "navigation": {
    "main": [
      { "label": "Home", "href": "/" },
      { "label": "About", "href": "/about" },
      { "label": "Products", "href": "/products" },
      { "label": "Blog", "href": "/blog" },
      { "label": "Contact", "href": "/contact" }
    ],
    "footer": [
      {
        "title": "Company",
        "links": [
          { "label": "About Us", "href": "/about" },
          { "label": "Careers", "href": "/careers" },
          { "label": "Press", "href": "/press" }
        ]
      },
      {
        "title": "Resources",
        "links": [
          { "label": "Blog", "href": "/blog" },
          { "label": "Documentation", "href": "/docs" },
          { "label": "Support", "href": "/support" }
        ]
      }
    ]
  },
  "social": {
    "twitter": "https://twitter.com/example",
    "linkedin": "https://linkedin.com/company/example",
    "facebook": "https://facebook.com/example",
    "github": "https://github.com/example"
  },
  "contact": {
    "email": "info@example.com",
    "phone": "+1-234-567-8900",
    "address": "123 Business St, City, State 12345"
  },
  "features": {
    "darkMode": true,
    "search": true,
    "blog": true,
    "products": true,
    "newsletter": true
  }
}
```

### 5. Create `schema-org.json`

```json
{
  "organization": {
    "name": "Example Corp",
    "url": "https://example.com",
    "logo": "https://example.com/logo.png",
    "sameAs": [
      "https://twitter.com/example",
      "https://linkedin.com/company/example",
      "https://facebook.com/example"
    ],
    "contactPoint": {
      "telephone": "+1-234-567-8900",
      "contactType": "customer service",
      "areaServed": "US",
      "availableLanguage": "en"
    }
  },
  "website": {
    "name": "Example Corp",
    "url": "https://example.com"
  },
  "authors": {
    "default": {
      "name": "Example Team",
      "url": "https://example.com/about"
    }
  }
}
```

### 6. Create `scripts/generate-theme.mjs`

```javascript
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const tokens = JSON.parse(readFileSync(join(rootDir, 'design-tokens.json'), 'utf-8'));

let css = '/* AUTO-GENERATED - DO NOT EDIT */\n/* Run: node scripts/generate-theme.mjs */\n\n@theme {\n';

// Colors
for (const [palette, shades] of Object.entries(tokens.colors)) {
  for (const [shade, value] of Object.entries(shades)) {
    css += `  --color-${palette}-${shade}: ${value};\n`;
  }
}

// Typography
for (const [name, value] of Object.entries(tokens.typography.fonts)) {
  css += `  --font-${name}: ${value};\n`;
}
for (const [size, value] of Object.entries(tokens.typography.sizes)) {
  css += `  --text-${size}: ${value};\n`;
}

// Spacing
for (const [name, value] of Object.entries(tokens.spacing)) {
  css += `  --spacing-${name}: ${value};\n`;
}

// Radius
for (const [name, value] of Object.entries(tokens.radius)) {
  css += `  --radius-${name}: ${value};\n`;
}

// Shadows
for (const [name, value] of Object.entries(tokens.shadows)) {
  css += `  --shadow-${name}: ${value};\n`;
}

css += '}\n\n';

// Runtime CSS vars for dark mode
css += `/* Runtime-swappable tokens for dark mode */\n`;
css += `:root {\n`;
css += `  --glass-bg: ${tokens.glass.bg};\n`;
css += `  --glass-bg-light: ${tokens.glass.bgLight};\n`;
css += `  --glass-border: ${tokens.glass.border};\n`;
css += `  --glass-blur: ${tokens.glass.blur};\n`;
css += `  --gradient-hero: ${tokens.gradients.hero};\n`;
css += `  --gradient-card: ${tokens.gradients.card};\n`;
css += `  --gradient-accent: ${tokens.gradients.accent};\n`;
css += `}\n\n`;

css += `.dark {\n`;
css += `  --glass-bg: rgba(0, 0, 0, 0.3);\n`;
css += `  --glass-bg-light: rgba(255, 255, 255, 0.05);\n`;
css += `  --glass-border: rgba(255, 255, 255, 0.1);\n`;
css += `}\n`;

writeFileSync(join(rootDir, 'src/styles/theme.css'), css);
console.log('✅ Generated src/styles/theme.css from design-tokens.json');
```

### 7. Create `astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import AutoImport from 'astro-auto-import';
import mdx from '@astrojs/mdx';
import pagefind from 'astro-pagefind';

export default defineConfig({
  site: 'https://example.com', // Replace with actual domain per fork
  output: 'static', // 100% static for Cloudflare Pages
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    AutoImport({
      imports: [
        // Will be populated in Phase 3 with all MDX components
      ],
    }),
    mdx(),
    pagefind(), // MUST be last
  ],
});
```

### 8. Create `tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@lib/*": ["src/lib/*"],
      "@styles/*": ["src/styles/*"]
    }
  }
}
```

### 9. Create `src/content.config.ts`

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('default'),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    contentType: z.literal('blog').default('blog'),
    faq: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).optional(),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/products" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
    specs: z.record(z.string()).optional(),
    contentType: z.literal('product').default('product'),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    contentType: z.enum(['landing', 'generic', 'homepage']).default('generic'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, products, pages };
```

### 10. Create `src/styles/global.css`

```css
@import "tailwindcss";
@import "./theme.css";

/* Dark mode custom variant */
@custom-variant dark (&:where(.dark, .dark *));

/* Glassmorphism utilities */
@layer utilities {
  .glass {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-glass);
  }

  .glass-light {
    background: var(--glass-bg-light);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
  }
}

/* Base styles */
html {
  scroll-behavior: smooth;
}

body {
  @apply font-body text-neutral-900 dark:text-neutral-100;
  @apply bg-neutral-50 dark:bg-neutral-950;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 11. Create `src/layouts/BaseLayout.astro`

```astro
---
import '../styles/global.css';
import schemaOrg from '../../schema-org.json';

interface Props {
  title?: string;
  description?: string;
  image?: string;
}

const { title, description, image } = Astro.props;

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: schemaOrg.organization.name,
  url: schemaOrg.organization.url,
  logo: schemaOrg.organization.logo,
  sameAs: schemaOrg.organization.sameAs,
  contactPoint: schemaOrg.organization.contactPoint,
};

const siteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: schemaOrg.website.name,
  url: schemaOrg.website.url,
};
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title || schemaOrg.website.name}</title>
  <meta name="description" content={description || ''} />

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

  <!-- Dark mode script (inline to prevent FOUC) -->
  <script is:inline>
    (function() {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    })();
  </script>

  <!-- Schema.org Tier 1: Organization + WebSite -->
  <script type="application/ld+json" set:html={JSON.stringify(orgSchema)} />
  <script type="application/ld+json" set:html={JSON.stringify(siteSchema)} />

  <!-- Tier 2 schemas injected here -->
  <slot name="schema" />

  <slot name="head" />
</head>
<body>
  <slot />
</body>
</html>
```

### 12. Create `src/lib/types.ts`

```typescript
export interface SiteConfig {
  site: {
    name: string;
    url: string;
    description: string;
    language: string;
    defaultImage: string;
  };
  navigation: {
    main: NavLink[];
    footer: FooterSection[];
  };
  social: Record<string, string>;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  features: {
    darkMode: boolean;
    search: boolean;
    blog: boolean;
    products: boolean;
    newsletter: boolean;
  };
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: NavLink[];
}

export interface DesignTokens {
  colors: Record<string, Record<string, string>>;
  typography: {
    fonts: Record<string, string>;
    sizes: Record<string, string>;
  };
  spacing: Record<string, string>;
  radius: Record<string, string>;
  shadows: Record<string, string>;
  glass: Record<string, string>;
  gradients: Record<string, string>;
}
```

### 13. Create `src/lib/utils.ts`

```typescript
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
```

### 14. Create `src/pages/index.astro`

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
---

<BaseLayout title="Home" description="Welcome to the template">
  <main class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-6xl font-heading font-bold text-primary-600 dark:text-primary-400">
        Astro 5 SEO Template
      </h1>
      <p class="mt-4 text-xl text-neutral-600 dark:text-neutral-400">
        Foundation scaffold complete ✅
      </p>
    </div>
  </main>
</BaseLayout>
```

### 15. Create `.gitignore`

```
# dependencies
node_modules/

# build output
dist/
.astro/

# generated files
src/styles/theme.css

# env
.env
.env.production
.env.local

# macOS
.DS_Store

# IDEs
.vscode/
.idea/
```

### 16. Create `public/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap-index.xml
```

### 17. Run Build Script & Test

```bash
# Generate theme.css from design-tokens.json
node scripts/generate-theme.mjs

# Add prebuild script to package.json
npm pkg set scripts.prebuild="node scripts/generate-theme.mjs"
npm pkg set scripts.dev="npm run prebuild && astro dev"
npm pkg set scripts.build="npm run prebuild && astro build"
npm pkg set scripts.preview="astro preview"

# Test dev server
npm run dev
```

### 18. Create Content Collection Directories

```bash
mkdir -p src/content/blog
mkdir -p src/content/products
mkdir -p src/content/pages
mkdir -p src/components/mdx
mkdir -p src/components/layout
mkdir -p src/components/sections
mkdir -p src/components/ui
mkdir -p src/components/seo
```

## Todo List

- [ ] Initialize Astro 5 project with minimal template
- [ ] Install dependencies (Tailwind 4, MDX, auto-import, pagefind)
- [ ] Create `design-tokens.json` with colors, typography, spacing, glass, gradients
- [ ] Create `site-config.json` with nav, social, contact, features
- [ ] Create `schema-org.json` with organization, website, authors
- [ ] Create `scripts/generate-theme.mjs` build script
- [ ] Create `astro.config.mjs` with Vite Tailwind plugin, auto-import, MDX, pagefind
- [ ] Create `tsconfig.json` with strict mode and path aliases
- [ ] Create `src/content.config.ts` with blog, products, pages collections
- [ ] Create `src/styles/global.css` with Tailwind, theme import, utilities
- [ ] Create `src/layouts/BaseLayout.astro` with schema tier 1, dark mode script
- [ ] Create `src/lib/types.ts` with TypeScript interfaces
- [ ] Create `src/lib/utils.ts` with utility functions
- [ ] Create `src/pages/index.astro` test homepage
- [ ] Create `.gitignore` and `public/robots.txt`
- [ ] Run `generate-theme.mjs` script
- [ ] Add prebuild/dev/build scripts to package.json
- [ ] Create content collection and component directories
- [ ] Test `npm run dev` - should open on localhost:4321
- [ ] Verify dark mode toggle works (localStorage + system preference)
- [ ] Verify no build warnings or TypeScript errors
- [ ] Commit foundation scaffold

## Success Criteria

- `npm run dev` starts without errors
- Homepage renders "Astro 5 SEO Template" with Tailwind classes
- `src/styles/theme.css` is auto-generated from `design-tokens.json`
- Dark mode script in `<head>` prevents FOUC
- All TypeScript strict checks pass
- Content collection schemas validate
- Zero build warnings

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| `astro-auto-import` package unmaintained | Medium | Fallback to `components` prop on `<Content />` |
| Tailwind 4 + Astro edge cases | Low | Astro 5.2+ officially supports TW4 |
| Design tokens JSON → CSS mapping errors | Medium | Validate generated theme.css manually, add tests |
| Dark mode FOUC on first load | Low | Inline script in `<head>` runs before paint |

## Security Considerations

- No user input in this phase
- Schema.org data from trusted JSON files only
- No API keys or secrets needed
- Ensure `.env` files are gitignored

## Next Steps

→ **Phase 2**: Build Design System (UI atomics, layout components, dark mode toggle, view transitions)

**Dependencies**: Phase 2 requires Phase 1 complete
