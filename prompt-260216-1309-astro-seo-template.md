# Prompt: Astro SEO Template — Premium B2B Website Builder

**Dùng prompt này để bắt đầu session mới tạo template Astro.**

---

## PROMPT

```
Tạo Astro web template project tại ~/projects/astro-seo-template/

## Tầm nhìn

Template Astro **CHUẨN MỰC** cho corporate/B2B websites — NHƯNG đẹp như landing page spa thẩm mỹ cao cấp.
Đây là khuôn mẫu copy cho 100+ websites sau này. KHÔNG hardcode bất kỳ brand/color/content nào.
Mọi thứ đều config qua file JSON/YAML — đổi brand = đổi 2-3 file config, không sửa code.

## Pipeline Integration

```
web-cloner (crawl WP) → ai-content-rewriter (viết .mdx) → [TEMPLATE NÀY] (render website)
```

Input files từ web-cloner output:
- `brand-profile.md` — brand voice, CTAs, voice constraints
- `schema-org.json` — Organization, WebSite, Products, Authors, LocalBusiness, Breadcrumb
- `product-spec/[slug]/` — core.md, audience.md, offer.md per product
- `.mdx` content files — output từ ai-content-rewriter với 40+ MDX components

## Design Philosophy

### Visual Identity (CONFIGURABLE, mặc định mẫu)
- **Palette mặc định**: Teal/Cyan gradient — xanh dương-xanh lá dịu mát, tương phản nhẹ, dễ nhìn
  - Primary: `#0D9488` (teal-600) → `#14B8A6` (teal-500)
  - Secondary: `#06B6D4` (cyan-500)
  - Accent: `#F59E0B` (amber-500) cho CTA buttons
  - Background: `#F0FDFA` (teal-50) → `#FFFFFF`
  - Text: `#134E4A` (teal-900) headings, `#374151` (gray-700) body
- **NHƯNG** tất cả colors nằm trong `design-tokens.json` — đổi file này = đổi toàn bộ site
- **Design level**: Mỗi trang ĐỀU phải đẹp như landing page (gradient backgrounds, glassmorphism cards,
  smooth animations, micro-interactions, floating elements, parallax sections)
- **Typography**: Inter/DM Sans headings + Source Serif Pro body (configurable trong design-tokens)
- **Consistency**: Mọi trang ĐỒNG NHẤT sắc thái — header, footer, sidebar, cards, buttons, hover states

### Design System Architecture
```
design-tokens.json          ← 1 file đổi toàn bộ visual identity
├── colors (primary, secondary, accent, neutral, success, warning, error)
├── typography (fonts, sizes, weights, line-heights)
├── spacing (scale 4-8-12-16-24-32-48-64)
├── borderRadius (sm, md, lg, xl, 2xl, full)
├── shadows (sm, md, lg, xl, glow, inner)
├── gradients (primary, secondary, accent, hero, card)
├── animations (durations, easings, keyframes)
└── breakpoints (sm 640, md 768, lg 1024, xl 1280, 2xl 1536)
```

## Schema 3-Tier Architecture

### Tier 1: BaseLayout.astro (Site-wide)
- Read `schema-org.json` → render Organization + WebSite JSON-LD
- EVERY page gets this automatically

### Tier 2: Page Templates (từ frontmatter)
- Read `contentType` + structured data fields từ frontmatter
- Auto-generate: Article, Product, FAQPage, HowTo, BreadcrumbList JSON-LD
- Template tự chọn schema dựa trên contentType

### Tier 3: AI Content Writer
- CHỈ viết frontmatter structured data (contentType, faq:[], specs:{}, steps:[])
- KHÔNG viết JSON-LD — template handle hết

## Page Templates (15+ loại, KHÔNG chỉ 6)

### Core Pages
1. **HomePage.astro** — Hero + Stats + Features + Products Grid + Testimonials + CTA
2. **AboutPage.astro** — Story + Mission + Team + Timeline + Certifications + CTA
3. **ContactPage.astro** — Form + Map + Office Cards + FAQ + WhatsApp float
4. **GenericPage.astro** — Fallback cho content pages

### Blog System
5. **BlogPost.astro** — Article layout + AuthorBox + TOC + Related Posts + Share buttons
6. **BlogList.astro** — Blog index with pagination, category filter, search
7. **BlogCategory.astro** — Category landing page (beautiful grid + description)
8. **BlogTag.astro** — Tag archive page with related tag cloud

### Product System
9. **ProductPage.astro** — Product detail + Specs table + Gallery + Related + CTA
10. **ProductList.astro** — Product catalog grid + filter sidebar + compare
11. **ProductCategory.astro** — Category page with featured products

### Utility Pages
12. **SearchResults.astro** — Pagefind search results
13. **404.astro** — Custom 404 with navigation suggestions
14. **SitemapIndex.astro** — HTML sitemap for humans
15. **LandingPage.astro** — High-conversion landing (form + testimonials + urgency)

### Auto-generated Pages (Astro dynamic routes)
- `/blog/` — BlogList
- `/blog/[slug]/` — BlogPost
- `/blog/category/[category]/` — BlogCategory
- `/blog/tag/[tag]/` — BlogTag
- `/[product-slug]/` — ProductPage
- `/products/` — ProductList
- `/search/` — SearchResults

## MDX Components (40+, mở rộng từ 27 gốc)

### Content Components (từ ai-content-rewriter, PHẢI KHỚP)
Hero, AuthorBox, TOC, Callout, CardGrid, Card, Stats, Image, Steps, Step, FAQ, CTA, CTABlock,
Badge, Breadcrumb, Newsletter, LogoCloud, Testimonial, ComparisonTable, VideoEmbed, Timeline,
TeamGrid, StarRating, Gallery, ContactForm, Tabs, PricingTable

### NEW: Layout/Section Components
- **Section** — Wrapper với background gradient/color variants
- **Container** — Max-width container (configurable)
- **Grid** — Responsive grid (cols configurable)
- **Divider** — Section divider (wave, angle, curve SVG)
- **Spacer** — Vertical spacing

### NEW: Interactive Components
- **Accordion** — Expandable sections (animate)
- **Modal** — Popup/lightbox
- **Drawer** — Side drawer
- **Tooltip** — Hover tooltip
- **ScrollReveal** — Animate on scroll (IntersectionObserver)
- **Counter** — Animated number counter
- **ProgressBar** — Animated progress bar
- **FloatingCTA** — Sticky floating action button (WhatsApp/quote)

### NEW: Data Display Components
- **SpecTable** — Product specification table (từ frontmatter specs:{})
- **PriceRange** — Price display với currency format
- **CertBadges** — Certification badge row (FSC, ISO, CE...)
- **FeatureGrid** — Icon + text feature grid
- **ProcessFlow** — Horizontal/vertical process flow
- **BeforeAfter** — Image comparison slider

### NEW: Social/Trust Components
- **SocialLinks** — Social media icons row
- **TrustBar** — "Trusted by 30+ countries" bar
- **ReviewCard** — Single review/testimonial card
- **ClientLogos** — Animated client logo carousel
- **WhatsAppButton** — Floating WhatsApp chat button

**QUAN TRỌNG**: Khi tạo components mới, CẬP NHẬT LUÔN file
`~/.claude/skills/ai-content-rewriter/references/visual-composition-guide.md`
và `content-type-registry.cjs` để ai-content-rewriter biết components mới.

## Config Files (ZERO hardcode)

### 1. `schema-org.json` — Brand/Organization data
Copy từ web-cloner output. Contains: Organization, WebSite, LocalBusiness, Authors, Products, Breadcrumb.
Template reads this at build time.

### 2. `design-tokens.json` — Visual identity
Colors, typography, spacing, gradients, animations. Đổi file này = đổi toàn bộ look & feel.
Tailwind config generates CSS variables từ file này.

### 3. `site-config.json` — Site metadata
```json
{
  "name": "Vietnam Plywood",
  "url": "https://vietnam-plywood.com",
  "locale": "en",
  "defaultAuthor": "lucy",
  "analytics": { "ga4": "G-XXXXX" },
  "social": { "facebook": "...", "linkedin": "..." },
  "navigation": [...],
  "footer": { "columns": [...] },
  "cta": { "primary": { "text": "Get Free Quote", "href": "/contact/" } }
}
```

### 4. `brand-profile.md` — Brand voice (cho ai-content-rewriter, optional read by template)

## Content Collections

```
src/content/
├── blog/           ← .mdx blog posts (từ ai-content-rewriter)
├── products/       ← .mdx product pages
├── pages/          ← .mdx static pages (about, contact, etc.)
└── config.ts       ← Zod schemas validating frontmatter
```

### Frontmatter Format (khớp ai-content-rewriter output)
```yaml
title: "..."
description: "..."
slug: "..."
contentType: "blog"  # blog|landing|homepage|product|about|contact|product-list|blog-list
author: "lucy"       # matches key in schema-org.json authors
publishDate: "2026-02-16"
updatedDate: "2026-02-16"
category: "Manufacturing"
tags: ["plywood", "export"]
image:
  src: "./images/hero.webp"
  alt: "Descriptive alt text"
ogTitle: "Social title"
ogDescription: "Social description"
faq:
  - q: "Question?"
    a: "Answer"
specs:
  thickness: "9mm - 28mm"
  size: "1220x2440mm"
steps:
  - name: "Step 1"
    text: "Instructions"
```

## SEO Features (tận dụng Astro ecosystem)

- **Sitemap**: `@astrojs/sitemap` auto-generated
- **Robots.txt**: Static file with customizable rules
- **Open Graph**: Auto từ frontmatter (title, description, image)
- **Twitter Cards**: Auto từ frontmatter
- **Canonical URLs**: Auto từ slug
- **BreadcrumbList**: Auto từ URL path + schema-org.json categoryMap
- **Responsive Images**: `astro:assets` + `<Image>` component (WebP, lazy, responsive srcset)
- **Pagefind**: Client-side search (0 JS bundle cost)
- **RSS Feed**: `@astrojs/rss` cho blog
- **View Transitions**: `astro:transitions` cho smooth page navigation
- **Prefetch**: Auto-prefetch visible links
- **Performance**: Target 100/100 Lighthouse (static HTML, minimal JS)

## Tech Stack

- **Astro 5** (latest) — Static-first, Islands architecture
- **Tailwind CSS 4** — Utility-first, configured from design-tokens.json
- **MDX** — Component-rich content
- **TypeScript** — Strict type safety
- **Pagefind** — Static search
- **Sharp** — Image optimization
- **Cloudflare Pages** — Deploy target (static, adapter nếu cần SSR)

## Astro Integrations
- `@astrojs/mdx` — MDX support
- `@astrojs/sitemap` — Auto sitemap
- `@astrojs/tailwind` — Tailwind integration
- `@astrojs/cloudflare` — Deploy adapter
- `astro-icon` — Icon system (Lucide icons)
- `astro-seo` — SEO meta helper
- View Transitions API (built-in Astro 5)

## Quality Standards

- Lighthouse 100/100 (Performance, Accessibility, Best Practices, SEO)
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- WCAG 2.1 AA accessibility
- Mobile-first responsive (test 320px → 1536px)
- Dark mode support (via design-tokens, toggle in header)
- Print stylesheet
- i18n-ready (language switcher structure, hreflang tags)

## File Structure

```
~/projects/astro-seo-template/
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
├── schema-org.json              ← Tier 1: Brand/Organization (from web-cloner)
├── design-tokens.json           ← Visual identity config
├── site-config.json             ← Site metadata, nav, footer
├── brand-profile.md             ← Brand voice (optional, for reference)
├── public/
│   ├── robots.txt
│   ├── favicon.svg
│   └── fonts/
├── src/
│   ├── components/
│   │   ├── mdx/                 ← 40+ MDX components (Hero, CTA, FAQ, etc.)
│   │   ├── layout/              ← Header, Footer, Sidebar, Navigation
│   │   ├── sections/            ← Page section patterns (reusable)
│   │   ├── ui/                  ← Atomic UI (Button, Input, Badge, etc.)
│   │   └── seo/                 ← SchemaRenderer, OpenGraph, Breadcrumb
│   ├── content/
│   │   ├── blog/                ← .mdx posts
│   │   ├── products/            ← .mdx products
│   │   ├── pages/               ← .mdx static pages
│   │   └── config.ts            ← Collection schemas (Zod)
│   ├── layouts/
│   │   ├── BaseLayout.astro     ← HTML shell + Tier 1 schema
│   │   ├── BlogPost.astro       ← Blog article layout
│   │   ├── ProductPage.astro    ← Product detail layout
│   │   ├── LandingPage.astro    ← High-conversion layout
│   │   └── GenericPage.astro    ← Default content layout
│   ├── pages/
│   │   ├── index.astro          ← HomePage
│   │   ├── about.astro          ← AboutPage
│   │   ├── contact.astro        ← ContactPage
│   │   ├── blog/
│   │   │   ├── index.astro      ← BlogList
│   │   │   ├── [slug].astro     ← BlogPost (dynamic)
│   │   │   ├── category/[cat].astro
│   │   │   └── tag/[tag].astro
│   │   ├── products/
│   │   │   └── index.astro      ← ProductList
│   │   ├── [slug].astro         ← Product/GenericPage (dynamic)
│   │   ├── search.astro
│   │   └── 404.astro
│   ├── styles/
│   │   ├── global.css           ← Tailwind base + design tokens CSS vars
│   │   └── animations.css       ← Scroll animations, transitions
│   ├── lib/
│   │   ├── schema-renderer.ts   ← JSON-LD từ schema-org.json + frontmatter
│   │   ├── design-tokens.ts     ← Load + type design tokens
│   │   ├── site-config.ts       ← Load + type site config
│   │   └── utils.ts             ← Helpers (slugify, formatDate, etc.)
│   └── types/
│       └── index.ts             ← TypeScript interfaces
```

## Approach

1. **Research** Astro 5 latest docs, Tailwind 4, best Astro templates
2. **Plan** architecture with phases
3. **Build incrementally:**
   - Phase 1: Scaffold + config system (design-tokens, site-config, schema-org)
   - Phase 2: BaseLayout + Header/Footer + design system
   - Phase 3: MDX components (40+) — beautiful, animated, responsive
   - Phase 4: Page templates (15+) + Content Collections
   - Phase 5: Schema rendering (3-tier) + SEO
   - Phase 6: Blog system (list, category, tag, search, RSS)
   - Phase 7: Product system (detail, catalog, category)
   - Phase 8: Animations, dark mode, accessibility audit
   - Phase 9: Test with vietnam-plywood.com content
   - Phase 10: Update ai-content-rewriter components list
4. **Test** với nội dung thực từ `~/projects/skill-builder/output/vietnam-plywood.com/`

## Reference Files
- schema-org.json: `~/projects/skill-builder/output/vietnam-plywood.com/schema-org.json`
- brand-profile: `~/projects/skill-builder/output/vietnam-plywood.com/brand-profile.md`
- product specs: `~/projects/skill-builder/output/vietnam-plywood.com/product-spec/`
- ai-content-rewriter components: `~/.claude/skills/ai-content-rewriter/references/visual-composition-guide.md`
- ai-content-rewriter content types: `~/.claude/skills/ai-content-rewriter/scripts/lib/content-type-registry.cjs`
- Test articles: `~/projects/skill-builder/plans/test-articles/`

## Skills cần kích hoạt
- `/ui-ux-pro-max` — Design system, color palettes, typography, spacing
- `/frontend-design` — Component implementation, responsive patterns
- `/web-frameworks` — Astro 5 best practices
- `/docs-seeker` — Astro/Tailwind latest docs
- `/seo-optimization` — Technical SEO audit
- `/web-design-guidelines` — Web interface guidelines compliance
- `/design-system` — Token architecture, component specs
- `/creativity` — Creative direction, visual styles

## QUAN TRỌNG
- KHÔNG hardcode brand name, colors, URLs, content — TẤT CẢ từ config files
- Mỗi trang PHẢI đẹp như landing page — gradient, glass, animation, micro-interaction
- ĐỒNG NHẤT sắc thái trên TOÀN BỘ site — header đến footer, blog đến product
- Template này là NỀN TẢNG cho 100+ websites — phải robust, flexible, extensible
- Khi tạo MDX components mới → CẬP NHẬT ai-content-rewriter skill
- Mobile-first, performance-first, accessibility-first
```
