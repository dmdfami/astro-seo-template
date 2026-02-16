# Documentation Index

Welcome to **astro-seo-template** documentation. This guide helps you navigate our comprehensive documentation suite.

## Quick Navigation

### For New Developers (Start Here)
1. **[Codebase Summary](./codebase-summary.md)** (5 min read)
   - Project overview, directory structure, tech stack
   - Best for: Understanding the big picture quickly

2. **[Code Standards](./code-standards.md)** (15 min read)
   - Implementation patterns, naming conventions, best practices
   - Best for: Writing code that fits the project

3. **[Component API Reference](./component-api.md)** (10 min read)
   - Complete 44-component library with usage examples
   - Best for: Using components in MDX content

### For Architects & Technical Leads
1. **[System Architecture](./system-architecture.md)** (20 min read)
   - Data flow, deployment model, security architecture
   - Best for: Understanding system design and extensibility

2. **[Project Overview & PDR](./project-overview-pdr.md)** (15 min read)
   - Requirements, success metrics, roadmap
   - Best for: Project planning and stakeholder communication

### For DevOps & Deployment
1. **[Deployment Guide](./deployment-guide.md)** (10 min read)
   - Fork setup, Cloudflare Pages configuration
   - Best for: Setting up new client sites

2. **[Pipeline Integration](./pipeline-integration.md)** (5 min read)
   - web-cloner → ai-content-rewriter → astro-seo-template integration
   - Best for: Automating the content pipeline

### For Site Maintenance
1. **[Code Standards - Testing](./code-standards.md#testing-patterns)** (5 min read)
   - Validation, linting, build checks
   - Best for: Ensuring quality before deployment

2. **[Migration Guide](./migration-guide.md)** (10 min read)
   - Version upgrades, breaking changes
   - Best for: Keeping sites updated safely

## Documentation Overview

| Document | Purpose | Audience | LOC |
|----------|---------|----------|-----|
| **codebase-summary.md** | Project structure & tech stack overview | All developers | 246 |
| **code-standards.md** | Implementation patterns & conventions | Developers | 558 |
| **system-architecture.md** | Data flow, deployment, system design | Architects, DevOps | 510 |
| **project-overview-pdr.md** | Requirements, metrics, roadmap | All stakeholders | 410 |
| **component-api.md** | 44 MDX component reference | Content creators | 306 |
| **deployment-guide.md** | Fork setup & deployment instructions | DevOps, Site maintainers | 121 |
| **pipeline-integration.md** | Content pipeline automation | Engineers | 128 |
| **migration-guide.md** | Version upgrades & breaking changes | Site maintainers | 87 |

## Key Resources

### Core Technologies
- **Astro 5** - Static site generator ([docs.astro.build](https://docs.astro.build))
- **Tailwind CSS 4** - CSS framework with @theme directive
- **MDX** - Markdown with JSX components
- **Schema.org** - Structured data for SEO

### Essential Files
- `site-config.json` - Site identity and navigation
- `schema-org.json` - Schema.org organization data
- `design-tokens.json` - Visual identity (colors, fonts, spacing)
- `astro.config.mjs` - Astro configuration and integrations
- `src/content/` - Blog posts, products, pages (MDX)
- `src/components/mdx/` - 44 auto-imported components

### Quick Commands
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build (validates schema, compiles theme)
npm run preview      # Preview production build locally
```

## Common Workflows

### Adding a Blog Post
1. Create `src/content/blog/post-slug.mdx`
2. Add frontmatter: title, description, publishDate
3. Use auto-imported components in content
4. Post auto-appears on `/blog/` and RSS feed

👉 See: [Component API Reference](./component-api.md)

### Customizing Brand Colors
1. Edit `design-tokens.json` (colors.primary, colors.accent, etc.)
2. Run `npm run build` to regenerate theme.css
3. Colors automatically propagate to all components

👉 See: [Code Standards - Design Tokens Flow](./code-standards.md#design-tokens-flow)

### Deploying to Cloudflare Pages
1. Fork template repo
2. Update the 3 config JSON files
3. Push to GitHub
4. Cloudflare Pages auto-triggers build
5. Site live in < 5 minutes

👉 See: [Deployment Guide](./deployment-guide.md)

### Toggling Dark Mode
1. Click dark mode toggle button
2. Preference saved to localStorage
3. CSS variables swap in `.dark` selector
4. Persists across browser sessions

👉 See: [Code Standards - Dark Mode](./code-standards.md#dark-mode-implementation)

## Architecture Highlights

### Zero Brand Hardcode
All site identity driven by 3 JSON files—no code modifications needed per client fork.

### 44 Auto-Imported MDX Components
Use components directly in `.mdx` files without import statements.

### 3-Tier Schema.org JSON-LD
1. Organization (site-wide)
2. Auto-generated (BlogPosting, Product, BreadcrumbList)
3. Frontmatter (custom FAQ, Recipe, Review)

### Fork-Per-Site Model
Each client gets independent fork with isolated Git history and deployment.

### Design Token Pipeline
```
design-tokens.json → generate-theme.mjs → theme.css → Tailwind utilities
```

## SEO & Performance

| Feature | Status | Details |
|---------|--------|---------|
| OpenGraph Meta Tags | ✓ Auto-generated | Every page |
| Twitter Cards | ✓ Auto-generated | Every page |
| Canonical URLs | ✓ Automatic | Prevents duplicates |
| Sitemap.xml | ✓ Auto-generated | Auto-discovery, filters drafts |
| RSS Feed | ✓ Auto-generated | Blog posts with full content |
| Pagefind Search | ✓ Full-text indexing | Client-side, offline search |
| Lighthouse Score | ✓ ≥ 95 | Performance target |
| WCAG AA Accessibility | ✓ Compliant | Semantic HTML, color contrast |

## File Structure Reference

```
astro-seo-template/
├── docs/                     ← Documentation
│   ├── README.md            ← This file
│   ├── codebase-summary.md  ← Project overview
│   ├── code-standards.md    ← Implementation patterns
│   ├── system-architecture.md ← Data flow & design
│   ├── project-overview-pdr.md ← Requirements & metrics
│   ├── component-api.md     ← Component reference
│   ├── deployment-guide.md  ← Deployment instructions
│   ├── pipeline-integration.md ← Pipeline automation
│   └── migration-guide.md   ← Version upgrades
├── src/
│   ├── components/mdx/      ← 44 Auto-imported components
│   ├── components/seo/      ← SEO components
│   ├── content/             ← MDX files (blog, products, pages)
│   ├── layouts/             ← Page layout wrappers
│   ├── lib/                 ← Utilities (site-config, schema-builder)
│   ├── pages/               ← Route pages (index, blog, products)
│   └── styles/              ← CSS (global.css, theme.css)
├── scripts/
│   ├── generate-theme.mjs   ← Compile design-tokens.json → theme.css
│   └── validate-schema.mjs  ← Validate Schema.org JSON
├── site-config.json         ← Site identity and navigation
├── schema-org.json          ← Schema.org organization data
├── design-tokens.json       ← Visual identity (colors, fonts, spacing)
├── astro.config.mjs         ← Astro 5 configuration
├── package.json             ← Dependencies and scripts
└── tsconfig.json            ← TypeScript configuration
```

## Troubleshooting

**Build fails with schema error:**
- Check frontmatter in `.mdx` files against defined schema
- See: [Code Standards - Error Handling](./code-standards.md#error-handling)

**Colors not updating after editing design-tokens.json:**
- Run `npm run build` (auto-runs generate-theme.mjs)
- See: [Code Standards - Design Tokens Flow](./code-standards.md#design-tokens-flow)

**Component not rendering:**
- Verify component is added to AutoImport list in `astro.config.mjs`
- Check component filename matches import path
- See: [Component API Reference](./component-api.md)

**Dark mode not persisting:**
- Check browser localStorage (DevTools → Application → Storage)
- Verify `.dark` CSS selector is applied to `<html>` element
- See: [Code Standards - Dark Mode](./code-standards.md#dark-mode-implementation)

**Deployment failing:**
- Check `npm run build` succeeds locally
- Verify all 3 JSON config files are valid
- Review Cloudflare Pages build logs
- See: [Deployment Guide](./deployment-guide.md)

## Support & Contribution

- **Issues:** GitHub Issues for bug reports and feature requests
- **Discussions:** GitHub Discussions for questions and ideas
- **Contributing:** Pull requests welcome (follow code-standards.md)

## Documentation Maintenance

Last updated: **2026-02-16**

- Codebase Summary: Accurate for Astro 5.x
- Code Standards: Follows Tailwind CSS 4, Astro 5 patterns
- Component API: All 44 components documented
- System Architecture: Current deployment model

For updates or corrections, see respective document headers.

## Next Steps

1. **New developer?** Start with [Codebase Summary](./codebase-summary.md)
2. **Building features?** Review [Code Standards](./code-standards.md)
3. **Deploying?** Follow [Deployment Guide](./deployment-guide.md)
4. **Deep dive?** Read [System Architecture](./system-architecture.md)

Happy building! 🚀
