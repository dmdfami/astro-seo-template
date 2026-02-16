# Phase 01: Content Collection & Routing

## Context Links

- SEO/Schema audit: `plans/reports/researcher-260216-1800-seo-schema-audit.md`
- Routing audit: `plans/reports/researcher-260216-1800-page-routing-uiux-audit.md`
- Content config: `src/content.config.ts`
- Catch-all route: `src/pages/[slug].astro`
- Web-cloner output: `/Users/david/projects/skill-builder/output/vietnam-plywood.com/pages/`

## Overview

- **Priority:** P0 -- blocks all content generation
- **Status:** complete
- **Description:** Expand contentType enum to all 11 types. Convert all pages (including products) to use `pages` collection with flat URLs via `[slug].astro` catch-all. Delete hardcoded `about.astro` and `contact.astro`.

## Key Insights

- Old site uses flat URLs: `/bintangor-plywood-vietnam/`, `/about-vietnam-plywood-factory/` -- NO `/products/` prefix
- Current products collection routes to `/products/[slug]` which breaks URL preservation
- `[slug].astro` currently only handles `contentType === 'generic'` -- must become universal
- `about.astro` hardcoded page blocks MDX about page from rendering (Astro prioritizes explicit routes)
- Zod validation WILL FAIL if ai-content-rewriter outputs `contentType: "about"` (not in enum)

## Requirements

### Functional
- All 11 contentType values accepted by `pages` collection schema
- `[slug].astro` renders all page types with contentType-based template selection
- Products use `pages` collection with `contentType: "product"` and flat URLs
- Old `products` collection kept for backward compat but NOT used for new content
- `about.astro` and `contact.astro` deleted
- All 24 old site slugs mapped and routable

### Non-Functional
- Zero downtime for existing content
- Build must pass after changes

## Architecture

```
ai-content-rewriter outputs .mdx with contentType field
  |
  v
src/content/pages/*.mdx  (ALL page types: product, about, contact, etc.)
  |
  v
content.config.ts validates (expanded enum)
  |
  v
[slug].astro catches ALL pages, switches template by contentType
  |
  v
Renders with appropriate layout (prose, product grid, landing full-width, etc.)
```

### Template Selection in [slug].astro

```
contentType -> Template behavior
------------------------------------
generic     -> Prose article (current behavior)
about       -> Prose article (same as generic)
contact     -> Prose article (ContactForm via MDX)
landing     -> Full-width MDX (no prose wrapper)
homepage    -> Full-width MDX (handled by index.astro, not [slug])
product     -> Product layout (image + specs + prose)
blog-list   -> Handled by blog/index.astro (no change)
product-list-> Handled by products/index.astro (no change)
reviews     -> Prose article (same as generic)
gallery     -> Full-width MDX (same as landing)
video-hub   -> Full-width MDX (same as landing)
```

## Related Code Files

### Files to MODIFY
1. `src/content.config.ts` -- expand pages contentType enum, add missing fields
2. `src/pages/[slug].astro` -- universal catch-all with contentType template selection
3. `src/pages/index.astro` -- no change needed (already reads from pages collection)
4. `src/pages/landing/[slug].astro` -- consider removing (handled by [slug].astro)
5. `src/pages/products/[slug].astro` -- keep for backward compat but products move to pages
6. `src/pages/blog/[slug].astro` -- no structural change (blog stays in own collection)

### Files to DELETE
1. `src/pages/about.astro` -- replaced by collection-driven page
2. `src/pages/contact.astro` -- replaced by collection-driven page

### Files to CREATE (content)
- None in this phase (content migration is Phase 5)

## Implementation Steps

### Step 1: Expand content.config.ts pages schema

Update `src/content.config.ts`:

```ts
const pages = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    contentType: z.enum([
      'landing', 'generic', 'homepage', 'about', 'contact',
      'product', 'product-list', 'blog-list',
      'reviews', 'gallery', 'video-hub'
    ]).default('generic'),
    draft: z.boolean().default(false),
    // New fields for pipeline compatibility
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
    author: z.string().optional(),
    publishDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    specs: z.record(z.string()).optional(),
    faq: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).optional(),
    steps: z.array(z.object({
      name: z.string(),
      text: z.string(),
    })).optional(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    category: z.string().optional(),
    authorCredentials: z.string().optional(),
  }),
});
```

Also add missing fields to blog collection:
```ts
// Add to blog schema:
authorCredentials: z.string().optional(),
category: z.string().optional(),
ogTitle: z.string().optional(),
ogDescription: z.string().optional(),
steps: z.array(z.object({
  name: z.string(),
  text: z.string(),
})).optional(),
```

Also add missing fields to products collection:
```ts
// Add to products schema:
faq: z.array(z.object({
  q: z.string(),
  a: z.string(),
})).optional(),
publishDate: z.coerce.date().optional(),
updatedDate: z.coerce.date().optional(),
author: z.string().optional(),
tags: z.array(z.string()).default([]),
ogTitle: z.string().optional(),
ogDescription: z.string().optional(),
```

### Step 2: Delete hardcoded pages

Delete these files:
- `src/pages/about.astro`
- `src/pages/contact.astro`

### Step 3: Update [slug].astro to universal catch-all

Replace `src/pages/[slug].astro` with contentType-aware template:

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '@layouts/BaseLayout.astro';
import Header from '@components/layout/Header.astro';
import Footer from '@components/layout/Footer.astro';
import Container from '@components/sections/Container.astro';
import Section from '@components/sections/Section.astro';
import Breadcrumb from '@components/seo/Breadcrumb.astro';
import SchemaRenderer from '@components/seo/SchemaRenderer.astro';

// Content types that get full-width MDX rendering (no prose wrapper)
const FULL_WIDTH_TYPES = ['landing', 'gallery', 'video-hub'];
// Content types that get product-style layout
const PRODUCT_TYPES = ['product'];

export async function getStaticPaths() {
  const pages = await getCollection('pages', ({ data }) =>
    !data.draft && data.contentType !== 'homepage'
  );
  return pages.map(page => ({
    params: { slug: page.id },
    props: { page },
  }));
}

const { page } = Astro.props;
const { Content } = await render(page);
const { contentType } = page.data;
const isFullWidth = FULL_WIDTH_TYPES.includes(contentType);
const isProduct = PRODUCT_TYPES.includes(contentType);
const url = `${Astro.site}${page.id}`;
---

<BaseLayout
  title={page.data.title}
  description={page.data.description}
  image={page.data.image?.src}
  type={isProduct ? 'product' : 'website'}
>
  <SchemaRenderer
    slot="schema"
    contentType={contentType}
    frontmatter={page.data}
    url={url}
  />
  <Header />

  {isFullWidth ? (
    <main data-pagefind-body>
      <Content />
    </main>
  ) : isProduct ? (
    <main data-pagefind-body>
      <Container>
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: page.data.title }
        ]} />
        <div class="grid lg:grid-cols-2 gap-12 py-8 mb-12">
          <div>
            {page.data.image && (
              <img src={page.data.image.src} alt={page.data.image.alt}
                class="rounded-xl w-full" loading="lazy" />
            )}
          </div>
          <div>
            <h1 class="text-4xl font-bold font-heading mb-4">{page.data.title}</h1>
            <p class="text-xl text-neutral-600 dark:text-neutral-400 mb-6">
              {page.data.description}
            </p>
            {page.data.specs && (
              <div class="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                <table class="w-full text-sm">
                  {Object.entries(page.data.specs).map(([key, value]) => (
                    <tr class="border-b border-neutral-200 dark:border-neutral-800 last:border-b-0">
                      <td class="px-4 py-3 font-medium bg-neutral-50 dark:bg-neutral-900 w-1/3 capitalize">{key}</td>
                      <td class="px-4 py-3">{value}</td>
                    </tr>
                  ))}
                </table>
              </div>
            )}
          </div>
        </div>
        <div class="prose dark:prose-invert max-w-none">
          <Content />
        </div>
      </Container>
    </main>
  ) : (
    <Section padding="xl">
      <Container size="md">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: page.data.title }
        ]} />
        <article class="prose dark:prose-invert max-w-none" data-pagefind-body>
          <h1>{page.data.title}</h1>
          <Content />
        </article>
      </Container>
    </Section>
  )}

  <Footer />
</BaseLayout>
```

### Step 4: Optionally remove landing/[slug].astro

Since `[slug].astro` now handles landing pages, the `landing/[slug].astro` route creates duplicate paths. Options:
- **Option A (safe):** Keep `landing/[slug].astro` but have landing content use flat slugs via `[slug].astro`. Landing MDX files go in `src/content/pages/` with `contentType: "landing"`.
- **Option B (clean):** Delete `src/pages/landing/[slug].astro`. All landing pages route through `[slug].astro`.

**Recommendation:** Option B. Delete `src/pages/landing/[slug].astro`. Simpler, DRYer.

### Step 5: Update SchemaRenderer contentType union

In `src/components/seo/SchemaRenderer.astro`, expand Props interface:

```ts
interface Props {
  contentType: 'blog' | 'product' | 'landing' | 'homepage' | 'generic' | 'about' | 'contact' | 'reviews' | 'gallery' | 'video-hub';
  frontmatter: Record<string, any>;
  url: string;
}
```

Add `product` handling for pages (not just products collection) in the switch.

### Step 6: Verify build

```bash
npm run build
```

Ensure no Zod validation errors, all routes compile.

## Todo List

- [ ] Expand pages contentType enum to all 11 types
- [ ] Add missing frontmatter fields to pages schema (image, author, specs, faq, steps, ogTitle, ogDescription, etc.)
- [ ] Add missing frontmatter fields to blog schema (authorCredentials, category, ogTitle, ogDescription, steps)
- [ ] Add missing frontmatter fields to products schema (faq, publishDate, author, tags, ogTitle, ogDescription)
- [ ] Delete `src/pages/about.astro`
- [ ] Delete `src/pages/contact.astro`
- [ ] Delete `src/pages/landing/[slug].astro`
- [ ] Update `src/pages/[slug].astro` to universal catch-all with template selection
- [ ] Update SchemaRenderer contentType union
- [ ] Run `npm run build` and fix any errors

## Success Criteria

- `npm run build` passes
- All 11 contentType values accepted without Zod errors
- Products with flat URLs render at `/{slug}` (not `/products/{slug}`)
- About/contact pages render from MDX content collection
- Landing pages render through `[slug].astro`
- No duplicate routes

## Risk Assessment

- **RISK:** Existing content in `src/content/products/` still expects `/products/[slug]` routes. **Mitigation:** Keep `products/[slug].astro` for backward compat during transition. New products go in `pages` collection.
- **RISK:** Existing landing content in `src/content/pages/` with `contentType: "landing"` expects `/landing/[slug]` route. **Mitigation:** After deleting `landing/[slug].astro`, these pages route through `[slug].astro` instead. URLs change from `/landing/slug` to `/slug`. If old URLs must be preserved, keep `landing/[slug].astro`.
- **RISK:** `about.mdx` and `contact.mdx` may not exist in content collection. **Mitigation:** Check before deleting hardcoded pages. If missing, ai-content-rewriter will generate them in Phase 5.

## Security Considerations

- No new attack surface. All changes are routing/schema related.
- Content validation via Zod remains intact.

## Next Steps

- Phase 2: Fix MDX component API mismatches
- Phase 5: Create content migration file list with slug mappings
