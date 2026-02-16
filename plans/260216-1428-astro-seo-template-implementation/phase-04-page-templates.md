# Phase 4: Page Templates (15+)

**Priority:** P1 | **Status:** ✅ completed | **Effort:** 8h

## Context Links

- **Phase 3**: [MDX Components](phase-03-mdx-components.md)
- **Architecture**: [Brainstorm](../reports/brainstorm-260216-1408-astro-seo-template-architecture.md)

## Overview

Build 15+ page templates covering blog, products, and core pages. All templates use BaseLayout, Header/Footer, and Phase 3 MDX components. Content from content collections. Dynamic routes with `getStaticPaths()`.

## Key Insights

- Blog uses content collections with glob loader (`src/content/blog/*.mdx`)
- Product pages similar pattern (`src/content/products/*.mdx`)
- All page templates < 200 lines (extract logic to lib/ if needed)
- RSS feed for blog (Astro built-in)
- Sitemap HTML (human-readable, SEO bonus)
- Search results page uses Pagefind UI

## Requirements

### Functional
- Blog: Post detail, list, category, tag archives, RSS
- Products: Detail, list, category archives
- Core: Home, About, Contact, Generic, Landing, 404, Search
- Dynamic routes with pagination
- Sitemap HTML (not just XML)

### Non-Functional
- Each template < 200 lines
- Content collections for all content
- RSS valid XML
- Pagination max 10 items/page
- Search indexed by Pagefind

## Architecture

### Page Distribution (3 Parallel Agents)

#### Agent E: Blog Pages (5 pages)
- BlogPost (`/blog/[slug].astro`)
- BlogList (`/blog/index.astro`, `/blog/[page].astro`)
- BlogCategory (`/blog/category/[category].astro`)
- BlogTag (`/blog/tag/[tag].astro`)
- RSS (`/rss.xml.ts`)

#### Agent F: Product Pages (3 pages)
- ProductPage (`/products/[slug].astro`)
- ProductList (`/products/index.astro`, `/products/[page].astro`)
- ProductCategory (`/products/category/[category].astro`)

#### Agent G: Core Pages (8 pages)
- HomePage (`/index.astro`)
- AboutPage (`/about.astro`)
- ContactPage (`/contact.astro`)
- GenericPage (`/[slug].astro` - from pages collection)
- LandingPage (`/landing/[slug].astro`)
- 404 (`/404.astro`)
- SearchResults (`/search.astro`)
- SitemapHTML (`/sitemap.astro`)

## Page Specifications

### Blog Pages (Agent E)

#### BlogPost (`/blog/[slug].astro`)
- **Route**: `/blog/post-slug`
- **Data**: Content collection `blog`, render MDX content
- **Layout**: BaseLayout + Header + Footer
- **Components**: Breadcrumb, AuthorBox, TOC, Image, ShareButtons, RelatedPosts
- **Schema**: SchemaRenderer with `contentType: 'blog'`

#### BlogList (`/blog/index.astro`, `/blog/[page].astro`)
- **Route**: `/blog`, `/blog/2`, `/blog/3`
- **Data**: Paginated blog posts (10/page), sorted by date desc
- **Layout**: Grid of Card components
- **Features**: Pagination controls, filter by draft=false

#### BlogCategory (`/blog/category/[category].astro`)
- **Route**: `/blog/category/plywood`
- **Data**: Posts filtered by category
- **Features**: Category header, post count

#### BlogTag (`/blog/tag/[tag].astro`)
- **Route**: `/blog/tag/industrial`
- **Data**: Posts filtered by tag
- **Features**: Tag cloud, related tags

#### RSS (`/rss.xml.ts`)
- **Route**: `/rss.xml`
- **Data**: All non-draft blog posts
- **Format**: Astro RSS helper, valid XML

### Product Pages (Agent F)

#### ProductPage (`/products/[slug].astro`)
- **Route**: `/products/product-slug`
- **Data**: Content collection `products`, render MDX
- **Components**: Gallery, SpecTable, PriceRange, CertBadges, CTABlock
- **Schema**: SchemaRenderer with `contentType: 'product'`

#### ProductList (`/products/index.astro`)
- **Route**: `/products`
- **Data**: All products, paginated
- **Layout**: CardGrid with product cards
- **Features**: Filter, sort options

#### ProductCategory (`/products/category/[category].astro`)
- **Route**: `/products/category/plywood`
- **Data**: Products filtered by category
- **Features**: Category description, product count

### Core Pages (Agent G)

#### HomePage (`/index.astro`)
- **Route**: `/`
- **Components**: Hero, Stats, FeatureGrid, Testimonial, LogoCloud, CTABlock
- **Schema**: SchemaRenderer with `contentType: 'homepage'`

#### AboutPage (`/about.astro`)
- **Route**: `/about`
- **Components**: Hero, TeamGrid, Timeline, Stats, CTABlock
- **Content**: From pages collection or hardcoded

#### ContactPage (`/contact.astro`)
- **Route**: `/contact`
- **Components**: ContactForm, TrustBar, FAQ
- **Features**: Form submission, validation

#### GenericPage (`/[slug].astro`)
- **Route**: `/privacy`, `/terms`, etc.
- **Data**: Pages collection
- **Layout**: Simple container + MDX content

#### LandingPage (`/landing/[slug].astro`)
- **Route**: `/landing/promo`
- **Data**: Pages collection with `contentType: 'landing'`
- **Components**: Hero, FeatureGrid, PricingTable, Testimonial, CTABlock

#### 404 (`/404.astro`)
- **Route**: `/404`
- **Components**: Hero, SiteSearch, PopularLinks
- **Features**: Custom 404 message

#### SearchResults (`/search.astro`)
- **Route**: `/search?q=query`
- **Components**: Pagefind UI
- **Features**: Search input, results list, filters

#### SitemapHTML (`/sitemap.astro`)
- **Route**: `/sitemap`
- **Data**: All pages, blog posts, products
- **Layout**: Organized by section
- **Features**: Human-readable, links to all content

## Related Code Files

### To Create (Blog - Agent E)
- `/Users/david/projects/astro-seo-template/src/pages/blog/[slug].astro`
- `/Users/david/projects/astro-seo-template/src/pages/blog/index.astro`
- `/Users/david/projects/astro-seo-template/src/pages/blog/[page].astro`
- `/Users/david/projects/astro-seo-template/src/pages/blog/category/[category].astro`
- `/Users/david/projects/astro-seo-template/src/pages/blog/tag/[tag].astro`
- `/Users/david/projects/astro-seo-template/src/pages/rss.xml.ts`

### To Create (Products - Agent F)
- `/Users/david/projects/astro-seo-template/src/pages/products/[slug].astro`
- `/Users/david/projects/astro-seo-template/src/pages/products/index.astro`
- `/Users/david/projects/astro-seo-template/src/pages/products/[page].astro`
- `/Users/david/projects/astro-seo-template/src/pages/products/category/[category].astro`

### To Create (Core - Agent G)
- `/Users/david/projects/astro-seo-template/src/pages/index.astro` (replace test version)
- `/Users/david/projects/astro-seo-template/src/pages/about.astro`
- `/Users/david/projects/astro-seo-template/src/pages/contact.astro`
- `/Users/david/projects/astro-seo-template/src/pages/[slug].astro`
- `/Users/david/projects/astro-seo-template/src/pages/landing/[slug].astro`
- `/Users/david/projects/astro-seo-template/src/pages/404.astro`
- `/Users/david/projects/astro-seo-template/src/pages/search.astro`
- `/Users/david/projects/astro-seo-template/src/pages/sitemap.astro`

### To Create (Supporting)
- `/Users/david/projects/astro-seo-template/src/lib/pagination.ts` (pagination helper)
- `/Users/david/projects/astro-seo-template/src/components/seo/SchemaRenderer.astro` (auto-generate schema from frontmatter)

## Implementation Steps

### 1. Create Pagination Helper

```typescript
// src/lib/pagination.ts
export interface PaginationProps {
  page: number;
  lastPage: number;
  url: {
    prev: string | undefined;
    next: string | undefined;
  };
}

export function paginate<T>(
  items: T[],
  { page = 1, pageSize = 10 }: { page?: number; pageSize?: number }
): { items: T[]; pagination: PaginationProps; totalPages: number } {
  const totalPages = Math.ceil(items.length / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: items.slice(start, end),
    totalPages,
    pagination: {
      page,
      lastPage: totalPages,
      url: {
        prev: page > 1 ? (page - 1 === 1 ? '' : `${page - 1}`) : undefined,
        next: page < totalPages ? `${page + 1}` : undefined,
      },
    },
  };
}
```

### 2. Create SchemaRenderer Component

```astro
---
// src/components/seo/SchemaRenderer.astro
import schemaOrg from '../../../schema-org.json';
import siteConfig from '../../../site-config.json';

interface Props {
  contentType: 'blog' | 'product' | 'landing' | 'homepage' | 'generic';
  frontmatter: Record<string, any>;
  url: string;
}

const { contentType, frontmatter, url } = Astro.props;

function buildSchemas() {
  const schemas: object[] = [];

  // Breadcrumb (always)
  schemas.push(buildBreadcrumb(url));

  // Content-type specific
  switch(contentType) {
    case 'blog':
      schemas.push(buildArticleSchema(frontmatter, url));
      break;
    case 'product':
      schemas.push(buildProductSchema(frontmatter, url));
      break;
  }

  // FAQ (if frontmatter has faq array)
  if (frontmatter.faq?.length) {
    schemas.push(buildFAQSchema(frontmatter.faq));
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
      item: `${siteConfig.site.url}/${parts.slice(0, i + 1).join('/')}/`
    }))
  };
}

function buildArticleSchema(fm: Record<string, any>, url: string) {
  const author = schemaOrg.authors?.[fm.author] || schemaOrg.authors.default;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: fm.title,
    description: fm.description,
    image: fm.image?.src,
    datePublished: fm.publishDate,
    dateModified: fm.updatedDate || fm.publishDate,
    author: { "@type": "Person", name: author.name, url: author.url },
    publisher: {
      "@type": "Organization",
      name: schemaOrg.organization.name,
      logo: { "@type": "ImageObject", url: schemaOrg.organization.logo }
    },
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
    ...(fm.specs && {
      additionalProperty: Object.entries(fm.specs).map(([k, v]) => ({
        "@type": "PropertyValue",
        name: k,
        value: v
      }))
    })
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

const schemas = buildSchemas();
---

{schemas.map(schema => (
  <script type="application/ld+json" set:html={JSON.stringify(schema)} slot="schema" />
))}
```

### 3. BlogPost Template Example

```astro
---
// src/pages/blog/[slug].astro
import { getCollection, getEntry, render } from 'astro:content';
import BaseLayout from '@layouts/BaseLayout.astro';
import Header from '@components/layout/Header.astro';
import Footer from '@components/layout/Footer.astro';
import Container from '@components/sections/Container.astro';
import Breadcrumb from '@components/seo/Breadcrumb.astro';
import SchemaRenderer from '@components/seo/SchemaRenderer.astro';
import { formatDate } from '@lib/utils';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content, headings } = await render(post);
const url = `${Astro.site}blog/${post.id}`;
---

<BaseLayout title={post.data.title} description={post.data.description} image={post.data.image?.src}>
  <SchemaRenderer contentType="blog" frontmatter={post.data} url={url} />
  <Header />

  <main data-pagefind-body>
    <Container size="md">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.data.title }
        ]}
      />

      <article class="prose dark:prose-invert max-w-none">
        <header class="mb-8">
          <h1 data-pagefind-meta="title" class="text-4xl lg:text-5xl font-bold mb-4">
            {post.data.title}
          </h1>
          <p class="text-xl text-neutral-600 dark:text-neutral-400 mb-4">
            {post.data.description}
          </p>
          <div class="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
            <time datetime={post.data.publishDate.toISOString()}>
              {formatDate(post.data.publishDate)}
            </time>
            {post.data.tags?.map(tag => (
              <a href={`/blog/tag/${tag}`} class="hover:text-primary-600">
                #{tag}
              </a>
            ))}
          </div>
        </header>

        <Content />
      </article>
    </Container>
  </main>

  <Footer />
</BaseLayout>
```

### 4. BlogList Template Example

```astro
---
// src/pages/blog/index.astro
import { getCollection } from 'astro:content';
import BaseLayout from '@layouts/BaseLayout.astro';
import Header from '@components/layout/Header.astro';
import Footer from '@components/layout/Footer.astro';
import Container from '@components/sections/Container.astro';
import Section from '@components/sections/Section.astro';
import CardGrid from '@components/mdx/CardGrid.astro';
import Card from '@components/mdx/Card.astro';
import { formatDate } from '@lib/utils';

const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
  .slice(0, 10);
---

<BaseLayout title="Blog" description="Latest articles and insights">
  <Header />

  <Section padding="xl">
    <Container>
      <div class="text-center mb-12">
        <h1 class="text-4xl lg:text-5xl font-bold mb-4">Blog</h1>
        <p class="text-xl text-neutral-600 dark:text-neutral-400">
          Latest articles and insights
        </p>
      </div>

      <CardGrid cols={3}>
        {posts.map(post => (
          <Card
            title={post.data.title}
            description={post.data.description}
            image={post.data.image}
            href={`/blog/${post.id}`}
            tags={post.data.tags}
          />
        ))}
      </CardGrid>
    </Container>
  </Section>

  <Footer />
</BaseLayout>
```

### 5. RSS Feed Example

```typescript
// src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import siteConfig from '../../site-config.json';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  return rss({
    title: siteConfig.site.name,
    description: siteConfig.site.description,
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/blog/${post.id}/`,
    })),
  });
}
```

### 6. ProductPage Template Example

```astro
---
// src/pages/products/[slug].astro
import { getCollection, render } from 'astro:content';
import BaseLayout from '@layouts/BaseLayout.astro';
import Header from '@components/layout/Header.astro';
import Footer from '@components/layout/Footer.astro';
import Container from '@components/sections/Container.astro';
import Breadcrumb from '@components/seo/Breadcrumb.astro';
import SchemaRenderer from '@components/seo/SchemaRenderer.astro';

export async function getStaticPaths() {
  const products = await getCollection('products', ({ data }) => !data.draft);
  return products.map(product => ({
    params: { slug: product.id },
    props: { product },
  }));
}

const { product } = Astro.props;
const { Content } = await render(product);
const url = `${Astro.site}products/${product.id}`;
---

<BaseLayout title={product.data.title} description={product.data.description} image={product.data.image?.src}>
  <SchemaRenderer contentType="product" frontmatter={product.data} url={url} />
  <Header />

  <main data-pagefind-body>
    <Container>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: product.data.title }
        ]}
      />

      <div class="grid lg:grid-cols-2 gap-12 mb-12">
        <div>
          {product.data.image && (
            <img
              src={product.data.image.src}
              alt={product.data.image.alt}
              class="rounded-xl w-full"
            />
          )}
        </div>

        <div>
          <h1 class="text-4xl font-bold mb-4">{product.data.title}</h1>
          <p class="text-xl text-neutral-600 dark:text-neutral-400 mb-6">
            {product.data.description}
          </p>
        </div>
      </div>

      <div class="prose dark:prose-invert max-w-none">
        <Content />
      </div>
    </Container>
  </main>

  <Footer />
</BaseLayout>
```

### 7. HomePage Template Example

```astro
---
// src/pages/index.astro (replace test version)
import BaseLayout from '@layouts/BaseLayout.astro';
import Header from '@components/layout/Header.astro';
import Footer from '@components/layout/Footer.astro';
import Hero from '@components/mdx/Hero.astro';
import Stats from '@components/mdx/Stats.astro';
import FeatureGrid from '@components/mdx/FeatureGrid.astro';
import Testimonial from '@components/mdx/Testimonial.astro';
import LogoCloud from '@components/mdx/LogoCloud.astro';
import CTABlock from '@components/mdx/CTABlock.astro';
import Section from '@components/sections/Section.astro';
import Container from '@components/sections/Container.astro';
import siteConfig from '../../site-config.json';

const stats = [
  { value: '10+', label: 'Years Experience' },
  { value: '500+', label: 'Happy Clients' },
  { value: '99%', label: 'Satisfaction Rate' },
];

const features = [
  { icon: 'check', title: 'Quality Products', description: 'Premium materials' },
  { icon: 'truck', title: 'Fast Delivery', description: 'Worldwide shipping' },
  { icon: 'shield', title: 'Guaranteed', description: '100% satisfaction' },
];
---

<BaseLayout title="Home" description={siteConfig.site.description}>
  <Header />

  <Hero
    title="Welcome to Example Corp"
    subtitle="Leading provider of industrial solutions"
    variant="centered"
    background="gradient"
    cta={{
      primary: { text: 'Get Started', url: '/contact' },
      secondary: { text: 'Learn More', url: '/about' }
    }}
  />

  <Section padding="xl">
    <Container>
      <Stats items={stats} />
    </Container>
  </Section>

  <Section padding="xl" background="neutral">
    <Container>
      <FeatureGrid features={features} cols={3} />
    </Container>
  </Section>

  <Section padding="xl">
    <Container>
      <LogoCloud logos={[]} cols={4} />
    </Container>
  </Section>

  <CTABlock
    title="Ready to get started?"
    description="Contact us today for a quote"
    cta={{
      primary: { text: 'Contact Us', url: '/contact' }
    }}
    background="gradient"
  />

  <Footer />
</BaseLayout>
```

### 8. Search Page Example

```astro
---
// src/pages/search.astro
import BaseLayout from '@layouts/BaseLayout.astro';
import Header from '@components/layout/Header.astro';
import Footer from '@components/layout/Footer.astro';
import Container from '@components/sections/Container.astro';
import Section from '@components/sections/Section.astro';
import Search from 'astro-pagefind/components/Search';
---

<BaseLayout title="Search" description="Search our site">
  <Header />

  <Section padding="xl">
    <Container size="md">
      <h1 class="text-4xl font-bold mb-8">Search</h1>
      <Search
        id="search"
        className="pagefind-ui"
        uiOptions={{ showImages: false, showSubResults: true }}
      />
    </Container>
  </Section>

  <Footer />
</BaseLayout>
```

### 9. 404 Page Example

```astro
---
// src/pages/404.astro
import BaseLayout from '@layouts/BaseLayout.astro';
import Header from '@components/layout/Header.astro';
import Footer from '@components/layout/Footer.astro';
import Container from '@components/sections/Container.astro';
import Section from '@components/sections/Section.astro';
import Button from '@components/ui/Button.astro';
---

<BaseLayout title="404 - Page Not Found" description="Page not found">
  <Header />

  <Section padding="xl">
    <Container size="sm">
      <div class="text-center">
        <h1 class="text-9xl font-bold text-primary-600 dark:text-primary-400">404</h1>
        <h2 class="text-3xl font-bold mt-4 mb-6">Page Not Found</h2>
        <p class="text-xl text-neutral-600 dark:text-neutral-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div class="flex gap-4 justify-center">
          <Button href="/" variant="primary" size="lg">Go Home</Button>
          <Button href="/search" variant="outline" size="lg">Search</Button>
        </div>
      </div>
    </Container>
  </Section>

  <Footer />
</BaseLayout>
```

## Todo List

### Agent E: Blog Pages (5 pages)
- [ ] Create `src/pages/blog/[slug].astro` (detail page, SchemaRenderer, Breadcrumb, MDX content)
- [ ] Create `src/pages/blog/index.astro` (list, CardGrid, pagination)
- [ ] Create `src/pages/blog/[page].astro` (paginated list)
- [ ] Create `src/pages/blog/category/[category].astro` (category archive)
- [ ] Create `src/pages/blog/tag/[tag].astro` (tag archive)
- [ ] Create `src/pages/rss.xml.ts` (RSS feed with @astrojs/rss)
- [ ] Test blog routes generate correctly
- [ ] Verify RSS validates

### Agent F: Product Pages (3 pages)
- [ ] Create `src/pages/products/[slug].astro` (detail, SchemaRenderer, specs table)
- [ ] Create `src/pages/products/index.astro` (list, CardGrid)
- [ ] Create `src/pages/products/[page].astro` (paginated)
- [ ] Create `src/pages/products/category/[category].astro` (category)
- [ ] Test product routes generate
- [ ] Verify product schema validates

### Agent G: Core Pages (8 pages)
- [ ] Replace `src/pages/index.astro` (HomePage with Hero, Stats, Features, CTA)
- [ ] Create `src/pages/about.astro` (TeamGrid, Timeline, Stats)
- [ ] Create `src/pages/contact.astro` (ContactForm, TrustBar, FAQ)
- [ ] Create `src/pages/[slug].astro` (generic pages from collection)
- [ ] Create `src/pages/landing/[slug].astro` (landing pages)
- [ ] Create `src/pages/404.astro` (custom 404 with search)
- [ ] Create `src/pages/search.astro` (Pagefind UI)
- [ ] Create `src/pages/sitemap.astro` (HTML sitemap)
- [ ] Test all core routes
- [ ] Verify 404 works

### Supporting Files (All Agents)
- [ ] Create `src/lib/pagination.ts` helper
- [ ] Create `src/components/seo/SchemaRenderer.astro`
- [ ] Install `@astrojs/rss` package (`npm install @astrojs/rss`)
- [ ] Test pagination helper with 20+ items
- [ ] Verify SchemaRenderer auto-generates correct JSON-LD

### Integration Testing
- [ ] Build site (`npm run build`)
- [ ] Verify all routes in `dist/`
- [ ] Test RSS feed in reader
- [ ] Test search functionality
- [ ] Verify breadcrumbs on all pages
- [ ] Check schema.org validates (Google Rich Results Test)
- [ ] Test pagination prev/next links
- [ ] Verify 404 page shows on invalid route
- [ ] Check sitemap HTML lists all pages
- [ ] Run Lighthouse on 5 random pages

## Success Criteria

- All 15+ page templates render without errors
- Blog pagination works (10 posts/page)
- RSS feed validates
- Product pages show specs + images
- Search returns relevant results
- 404 page shows on invalid routes
- Breadcrumbs accurate on all pages
- Schema.org markup validates on all content types
- Lighthouse Performance 90+, SEO 100
- All pages indexed by Pagefind

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Content collections empty = build fails | High | Add sample content in Phase 6, graceful empty state |
| Pagination edge cases (0 items, 1 page) | Medium | Test with 0, 1, 10, 11, 20, 100 items |
| RSS feed URL issues | Low | Use Astro.site for absolute URLs |
| Search not indexing MDX content | Medium | Use `data-pagefind-body` on main content areas |
| Schema.org validation errors | Medium | Test with Google Rich Results, schema.org validator |

## Security Considerations

- ContactForm: Server-side validation (Phase 5 backend integration)
- Search: No XSS risk (Pagefind sanitizes)
- RSS: Escape HTML in descriptions
- 404: No sensitive info in error messages

## Next Steps

→ **Phase 5**: SEO Integration (Schema.org tier 2/3, OpenGraph, Sitemap XML, robots.txt)

**Dependencies**: Phase 5 requires Phase 4 complete (uses page templates to generate sitemap)
