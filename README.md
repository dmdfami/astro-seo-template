# Astro SEO Template

Premium, reusable Astro 5 template with built-in SEO, 44 MDX components, and zero brand hardcode. Designed for the `web-cloner → ai-content-rewriter → astro-seo-template` pipeline.

## Features

- **Astro 5** with static output for Cloudflare Pages
- **Tailwind CSS 4** via `@tailwindcss/vite`
- **44 MDX components** auto-imported (no import statements needed)
- **3-tier Schema.org** structured data (Organization, auto-generated, frontmatter)
- **Zero brand hardcode** — all identity via 3 JSON config files
- **Dark mode** with class-based toggle and system preference detection
- **View Transitions** with `ClientRouter`
- **Pagefind** full-text search
- **Sitemap** auto-generated via `@astrojs/sitemap`
- **OpenGraph + Twitter Cards** on every page
- **RSS feed** for blog posts
- **Fork-per-site** deployment model

## Quick Start

```bash
# Clone / fork
gh repo fork your-org/astro-seo-template --clone
cd astro-seo-template
npm install

# Development
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## Configuration

All site identity is controlled by 3 JSON files in the project root:

| File | Purpose |
|------|---------|
| `site-config.json` | Site name, URL, navigation, social links, contact info, feature flags |
| `schema-org.json` | Organization, WebSite, and author data for Schema.org |
| `design-tokens.json` | Colors (oklch), typography, spacing, shadows, border radius |

### Theme Generation

Design tokens are compiled to CSS on build:

```
design-tokens.json → scripts/generate-theme.mjs → src/styles/theme.css
```

Runs automatically via `prebuild` script.

## Content Collections

Place MDX files in `src/content/`:

### Blog Posts (`src/content/blog/*.mdx`)
```yaml
---
title: "Post Title"          # required
description: "Summary"       # required
publishDate: 2026-01-15      # required
author: "default"
image: { src: "/images/hero.jpg", alt: "Description" }
tags: ["tag1", "tag2"]
draft: false
faq:
  - q: "Question?"
    a: "Answer."
---
```

### Products (`src/content/products/*.mdx`)
```yaml
---
title: "Product Name"         # required
description: "Summary"        # required
image: { src: "/images/product.jpg", alt: "Photo" }
specs: { Thickness: "18mm", Grade: "A/A" }
draft: false
---
```

### Pages (`src/content/pages/*.mdx`)
```yaml
---
title: "Page Title"           # required
description: "Summary"        # required
contentType: "landing"        # landing | generic | homepage
draft: false
---
```

## MDX Components

All 44 components are auto-imported. No `import` statements needed.

**Core:** Hero, AuthorBox, TOC, Callout, CTA, CTABlock, Stats, Steps/Step, FAQ, Newsletter, LogoCloud, MdxImage

**Data/Interactive:** CardGrid/Card, ComparisonTable, Tabs, PricingTable, Accordion, Modal, Tooltip, Drawer

**Product/Visual:** SpecTable, Gallery, BeforeAfter, Counter, ProgressBar, CertBadges, FeatureGrid, ProcessFlow, StarRating, ReviewCard, PriceRange

**Social/Trust:** SocialLinks, TrustBar, ClientLogos, WhatsAppButton, FloatingCTA, VideoEmbed, ContactForm, ScrollReveal, Timeline, TeamGrid, Testimonial

See [docs/component-api.md](docs/component-api.md) for full API reference.

## Project Structure

```
├── site-config.json          # Site identity
├── schema-org.json           # Schema.org data
├── design-tokens.json        # Visual tokens
├── src/
│   ├── components/
│   │   ├── mdx/              # 44 MDX components
│   │   ├── seo/              # OpenGraph, SchemaRenderer
│   │   └── ui/               # Header, Footer, ThemeToggle, SearchButton
│   ├── content/
│   │   ├── blog/             # Blog posts (MDX)
│   │   ├── products/         # Products (MDX)
│   │   └── pages/            # Landing/generic pages (MDX)
│   ├── layouts/
│   │   └── BaseLayout.astro  # Main layout with SEO
│   ├── lib/
│   │   ├── utils.ts          # Config helpers
│   │   └── seo-utils.ts      # SEO utilities
│   ├── pages/                # Route pages
│   └── styles/
│       ├── global.css         # Tailwind + base styles
│       └── theme.css          # Generated from design-tokens.json
├── scripts/
│   ├── generate-theme.mjs    # Token → CSS compiler
│   └── validate-schema.mjs   # Schema.org validator
└── public/                   # Static assets
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (auto-generates theme) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run test:schema` | Validate Schema.org structured data |

## Deployment

Designed for **Cloudflare Pages** static hosting.

```bash
# Via Wrangler CLI
npm run build
wrangler pages deploy dist --project-name=your-site
```

Or connect GitHub repo to Cloudflare Pages dashboard with:
- Build command: `npm run build`
- Build output: `dist`
- Node version: `20`

See [docs/deployment-guide.md](docs/deployment-guide.md) for full guide.

## Documentation

- [Component API Reference](docs/component-api.md)
- [Pipeline Integration Guide](docs/pipeline-integration.md)
- [Deployment Guide](docs/deployment-guide.md)
- [Migration Guide](docs/migration-guide.md)

## Tech Stack

- [Astro 5](https://astro.build) — Static site generator
- [Tailwind CSS 4](https://tailwindcss.com) — Utility-first CSS
- [MDX](https://mdxjs.com) — Markdown with components
- [Pagefind](https://pagefind.app) — Static search
- [astro-auto-import](https://github.com/delucis/astro-auto-import) — Auto MDX imports

## License

MIT
