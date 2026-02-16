# Phase 05: Content Migration Prep

## Context Links

- Web-cloner output: `/Users/david/projects/skill-builder/output/vietnam-plywood.com/pages/`
- Brand profile: `/Users/david/projects/skill-builder/output/vietnam-plywood.com/brand-profile.md`
- Content config (after Phase 1): `src/content.config.ts`
- Routing (after Phase 1): `src/pages/[slug].astro`

## Overview

- **Priority:** P1 -- required before ai-content-rewriter can generate content
- **Status:** complete
- **Description:** Create slug mapping (old site -> new template), define image path strategy, prepare content file list for ai-content-rewriter, document brand profile integration.

## Key Insights

- Old site has 24 pages (web-cloner output) + 146 blog posts
- ALL old URLs MUST be preserved for SEO (Google rankings)
- Old site uses flat URLs: `/bintangor-plywood-vietnam/`, `/about-vietnam-plywood-factory/`
- Products must be in `pages` collection (not `products`) to get flat URLs
- Blog posts at `/vietnam-plywood-blog/` is a listing page, actual posts are separate
- Images from old site stored at `/images/wp-content/uploads/image-v1w/...`
- Brand profile contains tone, keywords, target audience for rewriter briefing

## Requirements

### Functional
- Complete slug mapping document for all 24 pages
- Image path strategy defined (preserve old paths vs reorganize)
- Content file manifest for ai-content-rewriter (which files to generate, which collection, which contentType)
- Brand profile integration notes for rewriter configuration

### Non-Functional
- Zero broken links from old site URLs
- All images accessible at expected paths

## Slug Mapping: Old Site -> New Template

### Pages (24 total from web-cloner)

| # | Old Slug (filename) | Old URL | contentType | Collection | New File Path |
|---|---------------------|---------|-------------|------------|---------------|
| 1 | `index` | `/` | homepage | pages | `src/content/pages/home.mdx` |
| 2 | `about-vietnam-plywood-factory` | `/about-vietnam-plywood-factory/` | about | pages | `src/content/pages/about-vietnam-plywood-factory.mdx` |
| 3 | `contact` | `/contact/` | contact | pages | `src/content/pages/contact.mdx` |
| 4 | `vietnam-plywood-blog` | `/vietnam-plywood-blog/` | blog-list | pages | `src/content/pages/vietnam-plywood-blog.mdx` |
| 5 | `vietnam-plywood-reviews` | `/vietnam-plywood-reviews/` | reviews | pages | `src/content/pages/vietnam-plywood-reviews.mdx` |
| 6 | `gallery` | `/gallery/` | gallery | pages | `src/content/pages/gallery.mdx` |
| 7 | `video-hub` | `/video-hub/` | video-hub | pages | `src/content/pages/video-hub.mdx` |
| 8 | `plywood-manufacturer-in-vietnam` | `/plywood-manufacturer-in-vietnam/` | landing | pages | `src/content/pages/plywood-manufacturer-in-vietnam.mdx` |
| 9 | `app-packing` | `/app-packing/` | generic | pages | `src/content/pages/app-packing.mdx` |
| 10 | `plywood-return-policy` | `/plywood-return-policy/` | generic | pages | `src/content/pages/plywood-return-policy.mdx` |
| 11 | `ai-qa-hub` | `/ai-qa-hub/` | generic | pages | `src/content/pages/ai-qa-hub.mdx` |
| -- | **PRODUCTS (flat URLs via pages collection)** | | | | |
| 12 | `bintangor-plywood-vietnam` | `/bintangor-plywood-vietnam/` | product | pages | `src/content/pages/bintangor-plywood-vietnam.mdx` |
| 13 | `birch-plywood-vietnam` | `/birch-plywood-vietnam/` | product | pages | `src/content/pages/birch-plywood-vietnam.mdx` |
| 14 | `eucalyptus-plywood-vietnam` | `/eucalyptus-plywood-vietnam/` | product | pages | `src/content/pages/eucalyptus-plywood-vietnam.mdx` |
| 15 | `ev-plywood-vietnam` | `/ev-plywood-vietnam/` | product | pages | `src/content/pages/ev-plywood-vietnam.mdx` |
| 16 | `film-faced-plywood-vietnam` | `/film-faced-plywood-vietnam/` | product | pages | `src/content/pages/film-faced-plywood-vietnam.mdx` |
| 17 | `gurjan-plywood-vietnam` | `/gurjan-plywood-vietnam/` | product | pages | `src/content/pages/gurjan-plywood-vietnam.mdx` |
| 18 | `matt-plywood-vietnam` | `/matt-plywood-vietnam/` | product | pages | `src/content/pages/matt-plywood-vietnam.mdx` |
| 19 | `okoume-plywood-vietnam` | `/okoume-plywood-vietnam/` | product | pages | `src/content/pages/okoume-plywood-vietnam.mdx` |
| 20 | `packing-plywood-vietnam` | `/packing-plywood-vietnam/` | product | pages | `src/content/pages/packing-plywood-vietnam.mdx` |
| 21 | `pine-plywood-vietnam` | `/pine-plywood-vietnam/` | product | pages | `src/content/pages/pine-plywood-vietnam.mdx` |
| 22 | `poplar-plywood-vietnam` | `/poplar-plywood-vietnam/` | product | pages | `src/content/pages/poplar-plywood-vietnam.mdx` |
| 23 | `anti-slip-plywood-vietnam` | `/anti-slip-plywood-vietnam/` | product | pages | `src/content/pages/anti-slip-plywood-vietnam.mdx` |
| 24 | `core-veneer-vietnam` | `/core-veneer-vietnam/` | product | pages | `src/content/pages/core-veneer-vietnam.mdx` |

### Blog Posts (146 total)

Blog posts stay in the `blog` collection with URLs at `/blog/[slug]`. The 146 blog posts from the old site will be rewritten by ai-content-rewriter and placed in `src/content/blog/`. Old blog URLs were likely under a different structure -- redirects may be needed (out of scope for template work).

## Image Path Strategy

### Decision: Preserve old paths

Old site images at: `/images/wp-content/uploads/image-v1w/...`

**Strategy:** Copy the entire `images/` directory from web-cloner output to `public/images/` in the Astro project. This preserves all image URLs.

```
Source: /Users/david/projects/skill-builder/output/vietnam-plywood.com/images/
Target: /Users/david/projects/astro-seo-template/public/images/
```

### Image reference in MDX frontmatter

```yaml
image:
  src: "/images/wp-content/uploads/image-v1w/banner/vietnam-plywood-export-banner-hcply-homepage-hero-image-011.webp"
  alt: "Vietnam Plywood Export Banner"
```

### Image in MDX body (via MdxImage/Image component)

```mdx
<Image src="/images/wp-content/uploads/image-v1w/products/bintangor-plywood-001.webp" alt="Bintangor Plywood" />
```

### Future optimization

After migration, images can be reorganized to shorter paths like `/images/products/`, `/images/blog/`. But for launch, preserving old paths prevents any broken image references in Google's index and cached pages.

## Content File Manifest for ai-content-rewriter

### Pages to Generate (24 files)

```json
{
  "pages": [
    {
      "source": "index.md",
      "target": "src/content/pages/home.mdx",
      "contentType": "homepage",
      "collection": "pages",
      "preserveSlug": "home",
      "routeUrl": "/"
    },
    {
      "source": "about-vietnam-plywood-factory.md",
      "target": "src/content/pages/about-vietnam-plywood-factory.mdx",
      "contentType": "about",
      "collection": "pages",
      "preserveSlug": "about-vietnam-plywood-factory",
      "routeUrl": "/about-vietnam-plywood-factory/"
    },
    {
      "source": "contact.md",
      "target": "src/content/pages/contact.mdx",
      "contentType": "contact",
      "collection": "pages",
      "preserveSlug": "contact",
      "routeUrl": "/contact/"
    }
  ],
  "products": [
    {
      "source": "bintangor-plywood-vietnam.md",
      "target": "src/content/pages/bintangor-plywood-vietnam.mdx",
      "contentType": "product",
      "collection": "pages",
      "preserveSlug": "bintangor-plywood-vietnam",
      "routeUrl": "/bintangor-plywood-vietnam/",
      "needsSpecs": true,
      "needsFaq": true
    }
  ],
  "blog": "146 posts -- separate manifest from blog crawler"
}
```

Full manifest should be generated programmatically from the web-cloner output directory listing. The above is the schema/pattern.

### Frontmatter Template for Products (pages collection)

```yaml
---
title: "Bintangor Plywood Vietnam - Premium Export Grade"
description: "High-quality Bintangor plywood from Vietnam. FSC certified, competitive pricing, export to 30+ countries."
contentType: "product"
image:
  src: "/images/wp-content/uploads/image-v1w/products/bintangor-plywood-001.webp"
  alt: "Bintangor Plywood Vietnam"
author: "lucy"
authorCredentials: "International Sales Manager at HCPLY with 10+ years plywood export experience"
publishDate: 2026-02-16
tags: ["bintangor", "plywood", "vietnam", "export"]
category: "Plywood Products"
ogTitle: "Bintangor Plywood Vietnam | HCPLY Manufacturer"
ogDescription: "Premium Bintangor plywood from certified Vietnam mills. Get quotes for bulk orders."
specs:
  thickness: "2.5mm - 40mm"
  size: "1220x2440mm"
  grade: "BB/CC, BB/BB"
  glue: "MR, WBP, Melamine"
  certification: "FSC, CE, ISO 9001"
faq:
  - q: "What is Bintangor plywood?"
    a: "Bintangor plywood is made from Bintangor tropical hardwood..."
  - q: "What sizes are available?"
    a: "Standard 1220x2440mm, custom sizes available on request."
draft: false
---
```

### Frontmatter Template for Blog Posts

```yaml
---
title: "How to Choose the Right Plywood for Packing"
description: "Complete guide to selecting plywood for industrial packing..."
contentType: "blog"
author: "david"
authorCredentials: "Export Project Leader at HCPLY"
publishDate: 2026-02-16
tags: ["packing", "plywood", "guide"]
category: "Guides"
ogTitle: "Plywood Packing Guide | Vietnam Plywood Expert Tips"
ogDescription: "Expert guide on choosing the right plywood for packing applications."
image:
  src: "/images/blog/packing-plywood-guide.webp"
  alt: "Packing plywood selection guide"
faq:
  - q: "What thickness is best for packing?"
    a: "For most packing applications, 9-12mm is recommended."
steps:
  - name: "Assess your packing needs"
    text: "Determine weight, size, and shipping method..."
  - name: "Choose wood species"
    text: "Eucalyptus and poplar are cost-effective for packing..."
draft: false
---
```

## Brand Profile Integration Notes

The brand profile at `/Users/david/projects/skill-builder/output/vietnam-plywood.com/brand-profile.md` contains:

- **Company name:** HC PLYWOOD CO LTD (HCPLY)
- **Tone:** Professional, trustworthy, export-focused
- **Target markets:** India, UAE, Korea, SE Asia, Americas
- **Key differentiators:** FSC/CE/ISO certified, 30+ country export, fast shipment
- **Keywords:** Vietnam plywood, plywood manufacturer, plywood supplier, export plywood

These must be fed to ai-content-rewriter as context when generating content. The rewriter's `brand-profile` input slot should reference this file.

### schema-org.json alignment

Already configured with correct organization data. Authors `lucy` and `david` have roles. Need to add `image` and `sameAs` fields to authors for enriched schema (Phase 3).

Recommended additions to `schema-org.json`:
```json
{
  "authors": {
    "lucy": {
      "name": "Lucy",
      "url": "https://lucyvietnam.com",
      "role": "International Sales Manager",
      "image": "/images/team/lucy-avatar.webp",
      "sameAs": ["https://linkedin.com/in/lucy-hcply"]
    },
    "david": {
      "name": "David",
      "url": "https://vietnam-plywood.com/contact",
      "role": "Export Project Leader",
      "image": "/images/team/david-avatar.webp",
      "sameAs": ["https://linkedin.com/in/david-hcply"]
    }
  }
}
```

## Todo List

- [ ] Verify all 24 old slugs map to valid `[slug].astro` routes (after Phase 1)
- [ ] Copy `images/` from web-cloner output to `public/images/`
- [ ] Create content manifest JSON for ai-content-rewriter (all 24 pages)
- [ ] Add `image`, `sameAs` fields to authors in `schema-org.json`
- [ ] Document frontmatter templates for rewriter (product, blog, generic)
- [ ] Verify `site-config.json` has correct production URL (not `https://example.com`)
- [ ] Update `site-config.json` navigation to match old site nav structure

## Success Criteria

- All 24 old site URLs resolve to valid pages after content generation
- All images load from preserved paths
- ai-content-rewriter has a complete file manifest with target paths, contentTypes, and collections
- Brand profile data consistent between schema-org.json and rewriter input
- `site-config.json` site.url set to `https://vietnam-plywood.com`

## Risk Assessment

- **RISK:** Some old slugs may conflict with Astro reserved paths (e.g., `404`, `search`). **Mitigation:** None of the 24 slugs conflict with existing special pages.
- **RISK:** Blog posts (146) may have different URL structure on old site vs new. **Mitigation:** Old blog URLs need redirect mapping. Out of scope for template -- handled at DNS/CDN level or via `_redirects` file.
- **RISK:** Image paths from web-cloner may have encoding issues or special chars. **Mitigation:** Verify a sample of image paths load correctly after copy.
- **RISK:** `homepage` contentType with slug `home` -- `index.astro` reads `contentType === 'homepage'` from pages collection. The file `home.mdx` must use `contentType: "homepage"`. Slug `home` won't appear in URL (index.astro handles `/`).

## Security Considerations

- Images from old site should be scanned for unexpected file types
- Ensure `public/images/` doesn't contain any PHP/server-side files from WordPress migration
- Brand profile may contain internal business info -- don't expose in public-facing schema

## Next Steps

- After all 5 phases: run ai-content-rewriter on the 24 pages
- Then run ai-content-rewriter on 146 blog posts
- Final: `npm run build` + Lighthouse audit + Google Rich Results Test
