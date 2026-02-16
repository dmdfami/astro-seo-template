# Pipeline Integration Guide

## Overview

This template is the final stage in the content pipeline:

```
web-cloner → ai-content-rewriter → astro-seo-template
```

## Key Architecture

### No Import Statements
All 44 MDX components are auto-imported via `astro-auto-import`. The `ai-content-rewriter` should output MDX **without** any `import` lines.

**Correct output:**
```mdx
---
title: "My Post"
---
<Hero title="Welcome" />
<CTA href="/contact">Contact Us</CTA>
```

**Incorrect (legacy):**
```mdx
---
title: "My Post"
---
import Hero from '@components/mdx/Hero.astro';
<Hero title="Welcome" />
```

### Zero Brand Hardcode
All site identity comes from 3 JSON config files:
- `site-config.json` — Site name, navigation, social links, contact info
- `schema-org.json` — Organization, WebSite, authors for Schema.org
- `design-tokens.json` — Colors, typography, spacing, shadows

### Fork-Per-Site Deployment
Each client site gets its own repo fork:
1. Fork this template
2. Replace 3 JSON config files
3. Add content to `src/content/`
4. Deploy to Cloudflare Pages

## Content Collections

### Blog Posts (`src/content/blog/*.mdx`)
```yaml
---
title: "Post Title"          # required
description: "Summary"       # required
publishDate: 2026-01-15      # required
author: "default"             # matches schema-org.json authors key
image:
  src: "/images/hero.jpg"
  alt: "Description"
tags: ["tag1", "tag2"]
draft: false
faq:                          # optional, generates FAQPage schema
  - q: "Question?"
    a: "Answer."
---
```

### Products (`src/content/products/*.mdx`)
```yaml
---
title: "Product Name"         # required
description: "Summary"        # required
image:
  src: "/images/product.jpg"
  alt: "Product photo"
specs:
  Thickness: "18mm"
  Grade: "A/A"
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

## Component Mapping for ai-content-rewriter

See `docs/component-api.md` for full API reference of all 44 components.

### Common HTML → MDX Mappings

| HTML Pattern | MDX Component |
|---|---|
| Hero section with h1 + CTA | `<Hero>` |
| Statistics/numbers row | `<Stats>` |
| Feature grid/cards | `<FeatureGrid>` |
| Testimonial/quote | `<Testimonial>` |
| FAQ/accordion | `<FAQ>` or `<Accordion>` |
| Call-to-action section | `<CTABlock>` |
| Product specs table | `<SpecTable>` |
| Image gallery | `<Gallery>` |
| Pricing table | `<PricingTable>` |
| Step-by-step guide | `<Steps>` + `<Step>` |
| Client logos | `<ClientLogos>` or `<LogoCloud>` |
| Team members | `<TeamGrid>` |
| Timeline/history | `<Timeline>` |

## Testing Pipeline Integration

```bash
# 1. Copy rewriter output to template
cp -r ai-content-rewriter/output/*.mdx src/content/blog/

# 2. Build (should succeed with zero errors)
npm run build

# 3. Verify no import statements
grep -r "^import.*from.*@components" src/content/ && echo "FAIL" || echo "PASS"

# 4. Validate schemas
npm run test:schema
```
