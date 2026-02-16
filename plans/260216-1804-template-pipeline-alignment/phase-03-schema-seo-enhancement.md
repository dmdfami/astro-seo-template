# Phase 03: Schema & SEO Enhancement

## Context Links

- SEO/Schema audit: `plans/reports/researcher-260216-1800-seo-schema-audit.md`
- SchemaRenderer: `src/components/seo/SchemaRenderer.astro`
- OpenGraph: `src/components/seo/OpenGraph.astro`
- BaseLayout: `src/layouts/BaseLayout.astro`
- schema-org.json: `schema-org.json`
- seo-utils: `src/lib/seo-utils.ts`

## Overview

- **Priority:** P0 -- missing HowTo schema loses rich snippets; broken breadcrumb hurts all pages
- **Status:** complete
- **Description:** Add HowTo schema builder, fix SchemaRenderer head placement, add ogTitle/ogDescription override, enrich author schema, fix breadcrumb (Home + titles), add category to OG meta.

## Key Insights

- SchemaRenderer renders in `<body>` (default slot) instead of `<head>` (named `schema` slot) -- blog/product pages missing `slot="schema"`
- No `buildHowToSchema()` exists -- how-to articles lose rich snippet eligibility
- OpenGraph.astro always uses `generateMetaTitle(title)` -- no `ogTitle` override
- Breadcrumb schema derives names from URL slugs, misses "Home" as position 1
- Author schema has basic Person but no `jobTitle`, `sameAs`, `image` -- weak E-E-A-T
- `schema-org.json` authors already have `role` field -- just needs to be wired to schema

## Requirements

### Functional
- HowTo schema generated when `frontmatter.steps` has items
- SchemaRenderer output goes to `<head>` via `slot="schema"` on all pages
- `ogTitle`/`ogDescription` used for OG/Twitter meta when present
- Breadcrumb schema starts with "Home" at position 1, uses page titles
- Author Person schema includes `jobTitle`, `sameAs`, `image` from schema-org.json
- `category` field maps to `article:section` OG meta

### Non-Functional
- Valid JSON-LD per schema.org spec
- Google Rich Results Test passes for HowTo, FAQ, Article, Product, BreadcrumbList

## Related Code Files

### Files to MODIFY (4)
1. `src/components/seo/SchemaRenderer.astro` -- add HowTo builder, fix breadcrumb, enrich author
2. `src/components/seo/OpenGraph.astro` -- accept ogTitle/ogDescription, add article:section
3. `src/pages/blog/[slug].astro` -- add `slot="schema"` to SchemaRenderer
4. `src/pages/products/[slug].astro` -- add `slot="schema"` to SchemaRenderer

Note: `src/pages/[slug].astro` already uses `slot="schema"` per Phase 1 implementation.

## Implementation Steps

### Step 1: Fix SchemaRenderer slot placement in existing pages

File: `src/pages/blog/[slug].astro` (line 33)

Change:
```astro
<SchemaRenderer contentType="blog" frontmatter={post.data} url={url} />
```
To:
```astro
<SchemaRenderer slot="schema" contentType="blog" frontmatter={post.data} url={url} />
```

File: `src/pages/products/[slug].astro` (line 29)

Change:
```astro
<SchemaRenderer contentType="product" frontmatter={product.data} url={url} />
```
To:
```astro
<SchemaRenderer slot="schema" contentType="product" frontmatter={product.data} url={url} />
```

**Effort:** 2 min

### Step 2: Add buildHowToSchema to SchemaRenderer

File: `src/components/seo/SchemaRenderer.astro`

Add after `buildFAQSchema` function:

```ts
function buildHowToSchema(fm: Record<string, any>) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: fm.title,
    description: fm.description,
    ...(fm.image?.src && { image: fm.image.src }),
    step: fm.steps.map((step: { name: string; text: string }, i: number) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
```

Add to `buildSchemas()` function, after the FAQ check:

```ts
if (frontmatter.steps?.length) {
  schemas.push(buildHowToSchema(frontmatter));
}
```

**Effort:** 15 min

### Step 3: Fix breadcrumb -- add Home, use titles

File: `src/components/seo/SchemaRenderer.astro`

Update `buildBreadcrumb` to accept frontmatter for page title:

```ts
function buildBreadcrumb(pageUrl: string, pageTitle: string) {
  const parsed = new URL(pageUrl);
  const pathParts = parsed.pathname.replace(/\/$/, '').split('/').filter(Boolean);
  const siteUrl = siteConfig.site.url.replace(/\/$/, '');

  // Always start with Home
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteUrl + "/"
    }
  ];

  // Add intermediate segments (if any)
  pathParts.forEach((part, i) => {
    const isLast = i === pathParts.length - 1;
    items.push({
      "@type": "ListItem",
      position: i + 2,
      name: isLast ? pageTitle : part.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      item: `${siteUrl}/${pathParts.slice(0, i + 1).join('/')}/`
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}
```

Update the call in `buildSchemas()`:
```ts
schemas.push(buildBreadcrumb(url, frontmatter.title));
```

**Effort:** 15 min

### Step 4: Enrich author schema in Article

File: `src/components/seo/SchemaRenderer.astro`

Update `buildArticleSchema` to include richer author data:

```ts
function buildArticleSchema(fm: Record<string, any>, pageUrl: string) {
  const authorData = (schemaOrg.authors as Record<string, any>)?.[fm.author] || schemaOrg.authors.default;

  const author: Record<string, any> = {
    "@type": "Person",
    name: authorData.name,
    url: authorData.url,
  };

  // Enrich with optional fields from schema-org.json
  if (authorData.role) author.jobTitle = authorData.role;
  if (authorData.image) author.image = authorData.image;
  if (authorData.sameAs) author.sameAs = authorData.sameAs;

  // Add authorCredentials from frontmatter
  if (fm.authorCredentials) author.description = fm.authorCredentials;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: fm.title,
    description: fm.description,
    image: fm.image?.src,
    datePublished: fm.publishDate,
    dateModified: fm.updatedDate || fm.publishDate,
    author,
    publisher: {
      "@type": "Organization",
      name: schemaOrg.organization.name,
      logo: { "@type": "ImageObject", url: schemaOrg.organization.logo }
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl }
  };
}
```

**Effort:** 10 min

### Step 5: Update OpenGraph.astro for ogTitle/ogDescription + category

File: `src/components/seo/OpenGraph.astro`

Update Props interface:
```ts
interface Props {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: Date;
  modifiedTime?: Date;
  author?: string;
  tags?: string[];
  // New: rewriter overrides
  ogTitle?: string;
  ogDescription?: string;
  category?: string;
}
```

Update destructuring:
```ts
const {
  title, description, image,
  type = 'website',
  publishedTime, modifiedTime, author, tags = [],
  ogTitle, ogDescription, category
} = Astro.props;
```

Update meta generation:
```ts
const metaTitle = generateMetaTitle(title);
const metaDescription = generateMetaDescription(description);
// OG uses override if available, otherwise falls back to page meta
const ogMetaTitle = ogTitle || metaTitle;
const ogMetaDescription = ogDescription || metaDescription;
```

Update OG tags in template:
```astro
<!-- Use page meta for <title> and meta description -->
<title>{metaTitle}</title>
<meta name="description" content={metaDescription} />

<!-- Use OG-specific overrides for social sharing -->
<meta property="og:title" content={ogMetaTitle} />
<meta property="og:description" content={ogMetaDescription} />

<!-- Twitter also uses OG override -->
<meta name="twitter:title" content={ogMetaTitle} />
<meta name="twitter:description" content={ogMetaDescription} />
```

Add category as `article:section`:
```astro
{type === 'article' && category && (
  <meta property="article:section" content={category} />
)}
```

**Effort:** 15 min

### Step 6: Pass ogTitle/ogDescription through BaseLayout

File: `src/layouts/BaseLayout.astro`

Add to Props interface:
```ts
ogTitle?: string;
ogDescription?: string;
category?: string;
```

Pass through to OpenGraph:
```astro
<OpenGraph
  title={title}
  description={description}
  image={image}
  type={type}
  publishedTime={publishedTime}
  modifiedTime={modifiedTime}
  author={author}
  tags={tags}
  ogTitle={ogTitle}
  ogDescription={ogDescription}
  category={category}
/>
```

Update page templates (blog/[slug].astro, [slug].astro) to pass these from frontmatter:
```astro
<BaseLayout
  title={post.data.title}
  description={post.data.description}
  ogTitle={post.data.ogTitle}
  ogDescription={post.data.ogDescription}
  category={post.data.category}
  ...
>
```

**Effort:** 15 min

### Step 7: Verify with build

```bash
npm run build
```

Spot-check generated HTML for:
- JSON-LD in `<head>` (not body)
- BreadcrumbList starts with "Home"
- HowTo schema present on pages with steps
- OG meta uses override values

## Todo List

- [ ] Add `slot="schema"` to SchemaRenderer in `blog/[slug].astro`
- [ ] Add `slot="schema"` to SchemaRenderer in `products/[slug].astro`
- [ ] Add `buildHowToSchema()` to SchemaRenderer
- [ ] Add `steps` check to `buildSchemas()` switch
- [ ] Fix `buildBreadcrumb()` -- add Home, use page title for last item
- [ ] Enrich `buildArticleSchema()` author with jobTitle, sameAs, image
- [ ] Add ogTitle/ogDescription/category props to OpenGraph.astro
- [ ] Add ogTitle/ogDescription/category props to BaseLayout.astro
- [ ] Pass ogTitle/ogDescription/category from page templates to BaseLayout
- [ ] Run `npm run build` and verify output

## Success Criteria

- JSON-LD scripts render inside `<head>` (via slot="schema")
- BreadcrumbList always starts with `{"position": 1, "name": "Home"}`
- Last breadcrumb item uses page title, not slug-derived text
- HowTo schema generated for pages with `steps` frontmatter
- OG meta uses `ogTitle`/`ogDescription` when provided
- `article:section` meta tag present when `category` is set
- Author Person schema includes `jobTitle` when available in schema-org.json
- `npm run build` passes
- Google Rich Results Test validates HowTo markup

## Risk Assessment

- **RISK:** Adding `slot="schema"` might break if SchemaRenderer has wrapper elements. **Mitigation:** SchemaRenderer only outputs `<script>` tags -- slot assignment works on individual elements.
- **RISK:** Breadcrumb "Home" + title changes affect all pages. **Mitigation:** This is the correct behavior per Google guidelines. Only visual breadcrumb is affected in schema; UI breadcrumb (seo/Breadcrumb.astro) already passes correct items.

## Security Considerations

- JSON-LD escaping (`<\/`) already implemented in SchemaRenderer line 103
- New schema builders use same escaping pattern via `JSON.stringify().replace()`
- No user input directly in schema -- all from validated frontmatter

## Next Steps

- Phase 4: UI/UX quality fixes (focus styles, touch targets, skip-nav)
- After Phase 2+3: template is pipeline-ready for content generation
