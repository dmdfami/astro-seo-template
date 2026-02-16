# System Architecture

## High-Level Overview

**astro-seo-template** follows a static-first, configuration-driven architecture optimized for content distribution via Cloudflare Pages. The system combines build-time content rendering with runtime interactivity for dark mode, search, and form interactions.

```
┌─────────────────────────────────────────────────────────┐
│                    Development Phase                    │
├─────────────────────────────────────────────────────────┤
│  Config Files (JSON)          Content (MDX)             │
│  ├─ site-config.json         ├─ src/content/blog/      │
│  ├─ schema-org.json          ├─ src/content/products/  │
│  └─ design-tokens.json       └─ src/content/pages/     │
│           │                           │                 │
│           └──────────────┬────────────┘                 │
│                          ↓                              │
│              Astro 5 Build Pipeline                    │
│         ┌──────────────────────────────┐               │
│         │ 1. Parse content collections │               │
│         │ 2. Generate theme.css        │               │
│         │ 3. Validate Schema.org       │               │
│         │ 4. Render to HTML            │               │
│         │ 5. Build Pagefind index      │               │
│         │ 6. Generate sitemap.xml      │               │
│         └──────────────────────────────┘               │
│                          ↓                              │
│              dist/ (static output)                     │
│         ├─ index.html                                  │
│         ├─ blog/post-slug/index.html                   │
│         ├─ sitemap.xml                                 │
│         ├─ rss.xml                                     │
│         ├─ search/index.html (Pagefind)               │
│         └─ _pagefind/ (search index)                   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│           Deployment: Cloudflare Pages                  │
├─────────────────────────────────────────────────────────┤
│  dist/ → CDN edge locations worldwide                  │
│  Static HTML served with instant cache hits            │
│  JavaScript bundles (dark mode, search, forms) loaded  │
│  on-demand via <script> tags in page HTML              │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│           Runtime: Browser/Client                       │
├─────────────────────────────────────────────────────────┤
│  • Dark mode toggle (localStorage → CSS class)         │
│  • Pagefind search (offline full-text)                 │
│  • Form submissions (to backend if configured)         │
│  • View transitions (ClientRouter)                     │
│  • Scroll animations (Intersection Observer)           │
└─────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

### 1. Configuration Layer

**Input:** 3 JSON files in project root
- `site-config.json` → Site metadata, navigation, features
- `schema-org.json` → SEO structured data templates
- `design-tokens.json` → Visual identity (colors, typography)

**Processing:**
```
site-config.json ──┐
                   ├──> astro.config.mjs settings
schema-org.json ───┤
                   └──> Head/Meta components
design-tokens.json ──> scripts/generate-theme.mjs ──> theme.css
```

**Output:** Runtime-available via imports
```typescript
import siteConfig from '@/site-config.json';
import schemaOrg from '@/schema-org.json';
```

### 2. Content Collections Layer

**Input:** MDX files in `src/content/`
- Blog posts: `src/content/blog/*.mdx`
- Products: `src/content/products/*.mdx`
- Pages: `src/content/pages/*.mdx`

**Schema Validation:**
Each collection defines a schema via `astro:content`:
```typescript
defineCollection({
  schema: z.object({
    title: z.string(),
    publishDate: z.date(),
    tags: z.array(z.string()).optional(),
  })
})
```

**Processing:**
```
.mdx files ──> Parse frontmatter + body
          ──> Validate against schema
          ──> Auto-import 44 MDX components
          ──> Compile to HTML
          ──> Build search index (Pagefind)
```

**Output:** Routes and search index
```
src/content/blog/my-post.mdx ──> /blog/my-post/
src/content/products/item.mdx ──> /products/item/
```

### 3. Component Layer (64 Auto-Imported Components)

**Architecture:**
```
astro-auto-import integration
    ↓
AutoImport({ imports: [...64 components...] })
    ↓
Available in all .mdx files without import statements
    ↓
Rendered server-side to static HTML
    ↓
Client-side interactivity only where needed (client:load)
```

**Component Categories:**

| Category | Count | Examples | Rendering |
|----------|-------|----------|-----------|
| Premium | 6 | Highlight, FloatingBadge, BentoGrid | Server-side (visual emphasis) |
| Content | 10 | Hero, Callout, FAQ, CTA, Stats | Server-side (static HTML) |
| Utility | 11 | Alert, Banner, Quote, Table, List | Server-side (reusable blocks) |
| Data & Interactive | 18 | PricingTable, Accordion, Modal, Tabs | Server-side + client:load JS |
| Product & Visual | 12 | Gallery, BeforeAfter, SpecTable, Counter | Server-side (lazy-load images) |
| Social & Trust | 7 | ClientLogos, TrustBar, Timeline, Forms | Server-side + optional JS |

### 4. Styling Layer

**Design Token Compilation Pipeline:**
```
design-tokens.json (colors, typography, spacing)
    ↓
generate-theme.mjs (prebuild script)
    ↓
theme.css (@theme directive for Tailwind)
    ↓
global.css (@import tailwindcss + theme.css)
    ↓
Component utilities (@apply in .astro, classes in MDX)
    ↓
Compiled CSS bundled in dist/
```

**CSS Variables (Light Theme Only):**
```css
:root {
  /* OKLCH colors (perceptually uniform) */
  --color-primary-50: oklch(0.97 0.01 178);
  --color-primary-500: oklch(0.60 0.13 178);
  --color-primary-900: oklch(0.27 0.07 178);

  /* Typography scales */
  --text-heading-hero: 3.5rem / 1.2;
  --text-heading-lg: 2.25rem / 1.3;
  --text-base: 1rem / 1.5;

  /* Glass morphism */
  --glass-bg: rgba(255, 255, 255, 0.5);
  --glass-blur: blur(10px);
  --glass-border: rgba(0, 0, 0, 0.1);
}
```

### 5. SEO Layer (3-Tier Schema.org)

**Tier 1: Organization (Site-wide)**
```json
{
  "@type": "Organization",
  "name": "from schema-org.json",
  "logo": "...",
  "url": "...",
  "contactPoint": { ... }
}
```

**Tier 2: Auto-Generated (Per Page)**
- BlogPosting (blog posts)
- Product (product pages)
- BreadcrumbList (navigation)
- WebPage (generic pages)

**Tier 3: Frontmatter (Custom)**
```yaml
---
title: "Post"
faq:
  - q: "Question?"
    a: "Answer"
review:
  author: "Reviewer"
  rating: 5
---
```

**Processing:**
```
Frontmatter ──> schema-builder.ts
            ──> Merge with organization schema
            ──> Escape </ as <\/
            ──> Inject in <head> as JSON-LD
            ──> Validated by validate-schema.mjs
```

### 6. Search Infrastructure (Pagefind)

**Build-Time:**
```
HTML pages ──> Pagefind indexes during npm run build
           ──> Generates _pagefind/ directory
           ──> Includes metadata, references, stems
```

**Runtime:**
```
User opens /search ──> Loads pagefind.js (client-side)
                   ──> Searches _pagefind/ index (offline)
                   ──> Renders results dynamically
```

**Index Contents:**
- Page title, URL, slug
- Meta description
- Body text (up to ~5000 chars per page)
- Structured data (JSON-LD)

## Request/Response Flow

### Page Request (Initial Load)

```
User → Browser → Cloudflare CDN
                      ↓
                 Cache hit?
                   ↙    ↘
                Yes    No
                 ↓      ↓
              Cache  Origin (dist/)
                       ↓
              index.html delivered
              • Meta tags
              • JSON-LD in <head>
              • CSS bundle
              • JavaScript (minimal, on-demand)
                       ↓
                   Browser renders
                       ↓
              Scripts execute:
              • Dark mode detect/apply
              • View transitions setup
              • Form listeners
              • Scroll animations
```

### Dynamic Interactions

**Dark Mode Toggle:**
```
User clicks toggle
    ↓
JavaScript event listener
    ↓
localStorage.setItem('theme-preference', 'dark')
    ↓
document.documentElement.classList.add('dark')
    ↓
CSS custom variables swap (.dark selector)
    ↓
Page re-renders immediately (no server call)
```

**Search Query:**
```
User types search query
    ↓
JavaScript listener
    ↓
pagefind.search(query) (offline, client-side)
    ↓
Results rendered in DOM
    ↓
No network request needed
```

**Form Submission:**
```
User fills form
    ↓
JavaScript intercepts submit
    ↓
POST to /api/contact (if backend exists)
    ↓
Response handled client-side
    ↓
Success/error message displayed
```

## Deployment Architecture

### Fork-Per-Site Model

Each client gets independent fork:

```
astro-seo-template (main repo)
    ↓ fork
client-a-website (Client A's fork)
    ├─ Custom site-config.json
    ├─ Custom schema-org.json
    ├─ Custom design-tokens.json
    ├─ Custom content (src/content/)
    └─ Deploy to Cloudflare Pages (Client A's account)

client-b-website (Client B's fork)
    ├─ Custom site-config.json
    ├─ Custom schema-org.json
    ├─ Custom design-tokens.json
    ├─ Custom content (src/content/)
    └─ Deploy to Cloudflare Pages (Client B's account)
```

**Benefits:**
- Independent Git history per client
- No shared state or infrastructure
- Isolated CSS, JS, assets
- Client can modify code independently
- Easy to merge upstream template updates

### Cloudflare Pages Deployment

**Setup:**
```
1. Connect GitHub repo (fork)
2. Build command: npm run build
3. Build output: dist/
4. On push to main: Auto-build and deploy
```

**Build Process (on Cloudflare):**
```bash
npm install
npm run build  # Runs: prebuild script + astro build
#              → Validates schema
#              → Compiles design tokens
#              → Renders all pages
#              → Indexes for search
#              → Generates sitemap/RSS
```

**CDN Caching:**
- HTML: Cache until content changes (via git commit)
- CSS/JS: Long-term cache (hash-based)
- Images: Long-term cache with versioning
- Search index: Cache until rebuild

## Database/State Architecture

**No Database by Default.**

This is a static-first system. Optional enhancements:

| Need | Solution |
|------|----------|
| Contact forms | Serverless function (Cloudflare Workers, Netlify) |
| Newsletter signup | Third-party API (Mailchimp, ConvertKit) |
| User authentication | OAuth provider (GitHub, Google) |
| Comments | Third-party widget (Disqus, Giscus) |
| Analytics | JavaScript beacon (Plausible, Fathom, GA4) |

**Recommended Pattern:**
```astro
<!-- Contact form -->
<form id="contact" action="/api/contact" method="POST">
  <input type="email" name="email" required />
  <textarea name="message"></textarea>
  <button type="submit">Send</button>
</form>

<script>
  document.getElementById('contact').addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch('/api/contact', {
      method: 'POST',
      body: new FormData(e.target),
    });
    if (res.ok) alert('Message sent!');
  });
</script>
```

## Performance Characteristics

| Metric | Target | Optimization |
|--------|--------|--------------|
| First Contentful Paint | < 1.5s | Static HTML, minimal JS |
| Largest Contentful Paint | < 2.5s | Image optimization, lazy loading |
| Cumulative Layout Shift | < 0.1 | Fixed image dimensions, no late fonts |
| Time to Interactive | < 2s | Small JS bundles, async load |
| Build Time | < 60s | Incremental builds, parallel theme gen |

**Key Optimizations:**
- Static HTML (no server rendering)
- CSS inlined or cached
- JavaScript loaded on-demand
- Images optimized (WebP, srcset)
- Fonts preloaded (or system fonts)
- Search index built once, served static

## Security Architecture

**Threat Mitigations:**

| Threat | Mitigation |
|--------|-----------|
| Script injection (JSON-LD) | Escape `</` as `</\` in schema-builder.ts |
| XSS (user input in forms) | Validate server-side (if using serverless) |
| CSRF (form submissions) | Use POST, validate origin headers |
| Content spoofing | Canonical URLs in `<head>` |
| Information disclosure | No sensitive data in client JS |
| DDoS | Cloudflare DDoS protection (free tier) |

**Best Practices:**
- Never store API keys in client-side JS
- Validate all form inputs server-side (if backend exists)
- Use Content Security Policy (CSP) headers
- Enable Cloudflare Web Application Firewall (WAF)
- Regular security audits of schema output

## Extensibility Points

**Adding Features:**

1. **New Component Type:**
   - Create `src/components/mdx/new-component.astro`
   - Add to `astro.config.mjs` AutoImport list
   - Use in .mdx files immediately

2. **New Content Collection:**
   - Create schema in `src/content.config.ts`
   - Create `.mdx` files in `src/content/new-collection/`
   - Create routes in `src/pages/new-collection/[slug].astro`

3. **New JSON Config:**
   - Add to project root (e.g., `analytics-config.json`)
   - Import in components: `import config from '@/analytics-config.json'`
   - Use in head or global script

4. **New CSS Variable Category:**
   - Add to `design-tokens.json` (e.g., `animations`)
   - Re-run `npm run build` to regenerate `theme.css`
   - Use in components: `animation: var(--animation-fade-in)`

5. **New Middleware/Hook:**
   - Create `src/middleware.ts` for request interception
   - Modify `astro.config.mjs` to register

## Testing & Validation

**Build-Time Validation:**
```bash
npm run build
  1. Schema.org JSON validation (validate-schema.mjs)
  2. TypeScript type checking (astro check)
  3. Astro component compilation
  4. CSS generation and bundling
  5. HTML rendering (all pages)
  6. Search index build (Pagefind)
```

**Pre-Deploy Checklist:**
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] Schema.org validation passes
- [ ] All routes accessible in `npm run preview`
- [ ] Dark mode toggle works
- [ ] Search index populated
- [ ] Images optimized and referenced
- [ ] Canonical URLs correct
- [ ] OpenGraph meta tags set

## Monitoring & Debugging

**During Development:**
```bash
npm run dev  # Local server with hot reload
npm run build  # Test production build locally
npm run preview  # Preview dist/ locally
```

**In Production (Cloudflare Pages):**
- View build logs in Cloudflare dashboard
- Monitor performance via Web Analytics
- Check SEO indexing via Search Console
- Track errors via JS console (browser DevTools)

**Common Issues:**
| Issue | Debugging |
|-------|-----------|
| Page not rendering | Check frontmatter schema, validate YAML |
| Styles not applied | Ensure design tokens regenerated (`npm run build`) |
| Search not indexing | Verify page is not in draft, check Pagefind build log |
| Dark mode not persisting | Check localStorage in DevTools, verify JS runs |
| Build fails | Check astro.config.mjs syntax, validate JSON files |
