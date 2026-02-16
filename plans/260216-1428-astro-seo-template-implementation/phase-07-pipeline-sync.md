# Phase 7: Pipeline Sync

**Priority:** P1 | **Status:** ✅ completed | **Effort:** 2h
**Documentation**: component-api.md, pipeline-integration.md, migration-guide.md, deployment-guide.md created

## Context Links

- **Phase 6**: [Test & Polish](phase-06-test-polish.md)
- **Architecture**: [Brainstorm](../reports/brainstorm-260216-1408-astro-seo-template-architecture.md)

## Overview

Sync with ai-content-rewriter pipeline. Update visual-composition-guide.md, content-type-registry.cjs, remove import statements from output templates. Ensure seamless integration: web-cloner → ai-content-rewriter → **this template**.

## Key Insights

- `astro-auto-import` eliminates need for import statements in MDX
- ai-content-rewriter output templates should NO LONGER include `import` lines
- Update visual-composition-guide.md with new component specs (51 total)
- Update content-type-registry.cjs with all 51 component mappings
- Test full pipeline with real Vietnam Plywood content
- Verify zero manual edits needed after rewriter output

## Requirements

### Functional
- ai-content-rewriter outputs MDX without import statements
- All 51 components documented in visual-composition-guide.md
- content-type-registry.cjs maps all components
- Pipeline test: web-cloner → rewriter → template (zero manual edits)

### Non-Functional
- Documentation complete and accurate
- Component APIs match between rewriter and template
- Example usage for all 51 components
- Migration guide for existing content

## Architecture

```
Pipeline Flow (Updated):
web-cloner (scrapes HTML)
    ↓
ai-content-rewriter (converts to MDX)
    ├── visual-composition-guide.md (updated with 51 components)
    ├── content-type-registry.cjs (updated mappings)
    └── templates/*.md (NO IMPORT STATEMENTS)
    ↓
astro-seo-template (renders MDX)
    ├── astro-auto-import (auto-imports all 51 components)
    └── content collections (blog, products, pages)
```

## Related Code Files

### To Create (in ai-content-rewriter repo)
Note: These are in a different repo, documentation only

- `visual-composition-guide.md` (UPDATE with 51 components)
- `content-type-registry.cjs` (UPDATE with mappings)
- `templates/blog-post.md` (REMOVE import statements)
- `templates/product-page.md` (REMOVE import statements)
- `templates/landing-page.md` (REMOVE import statements)

### To Create (in this template repo)
- `/Users/david/projects/astro-seo-template/docs/component-api.md` (API reference)
- `/Users/david/projects/astro-seo-template/docs/pipeline-integration.md` (integration guide)
- `/Users/david/projects/astro-seo-template/docs/migration-guide.md` (for existing content)
- `/Users/david/projects/astro-seo-template/docs/deployment-guide.md` (fork-per-site + CF Pages deployment)
<!-- Updated: Validation Session 1 - Added deployment guide for fork-per-site workflow -->

## Implementation Steps

### 1. Create Component API Reference

```markdown
<!-- docs/component-api.md -->
# Component API Reference

All components are auto-imported. No `import` statements needed in MDX.

## Core Content Components

### Hero
**Usage:**
```mdx
<Hero
  title="Your Title"
  subtitle="Your subtitle"
  variant="centered"
  background="gradient"
  cta={{
    primary: { text: "Get Started", url: "/contact" },
    secondary: { text: "Learn More", url: "/about" }
  }}
/>
```

**Props:**
- `title` (string, required): Main headline
- `subtitle` (string, optional): Subheading
- `variant` ('default' | 'centered' | 'split', default: 'default')
- `background` ('gradient' | 'solid' | 'none', default: 'gradient')
- `cta` (object, optional): Primary and secondary CTAs
  - `primary` (object): { text: string, url: string }
  - `secondary` (object): { text: string, url: string }

---

### CTA
**Unified API - Two Usage Patterns:**

**Pattern A: Props-based (for structured data)**
```mdx
<CTA
  primary={{ text: "Get Quote", url: "/contact" }}
  secondary={{ text: "Catalog", url: "/products" }}
  note="Free shipping on all orders"
/>
```

**Pattern B: Slot-based (for inline usage)**
```mdx
<CTA href="/contact" variant="primary">Request Quote</CTA>
```

**Props:**
- Props mode: `primary`, `secondary`, `note`
- Slot mode: `href`, `variant` ('primary' | 'secondary' | 'outline')

---

### Stats
**Usage:**
```mdx
<Stats
  items={[
    { value: "10+", label: "Years Experience" },
    { value: "500+", label: "Happy Clients" },
    { value: "99%", label: "Satisfaction Rate" }
  ]}
/>
```

**Props:**
- `items` (array, required): Array of { value: string, label: string, icon?: string }

---

[... document all 51 components ...]
```

### 2. Create Pipeline Integration Guide

```markdown
<!-- docs/pipeline-integration.md -->
# Pipeline Integration Guide

## Overview
This template integrates with the `ai-content-rewriter` pipeline.

## Flow
1. **web-cloner**: Scrapes HTML from existing sites
2. **ai-content-rewriter**: Converts HTML to MDX with components
3. **astro-seo-template**: Renders MDX to static HTML

## Key Changes from Previous Version

### ✅ No Import Statements
**OLD (deprecated):**
```mdx
---
title: "My Post"
---
import Hero from '@components/mdx/Hero.astro';
import CTA from '@components/mdx/CTA.astro';

<Hero title="Welcome" />
<CTA href="/contact">Contact Us</CTA>
```

**NEW (current):**
```mdx
---
title: "My Post"
---
<Hero title="Welcome" />
<CTA href="/contact">Contact Us</CTA>
```

All components auto-imported via `astro-auto-import`.

### ✅ Unified CTA API
CTA component now supports both props-based and slot-based usage.
See docs/component-api.md for details.

### ✅ 51 Components Available
Full list in docs/component-api.md

## Updating ai-content-rewriter

### 1. Update visual-composition-guide.md
Add all 51 components with usage examples.

### 2. Update content-type-registry.cjs
Map HTML patterns to MDX components.

### 3. Update Templates
Remove all `import` statements from templates.

### 4. Test Full Pipeline
```bash
# 1. Clone sample site
cd web-cloner
npm run clone -- https://vietnam-plywood.com

# 2. Rewrite to MDX
cd ../ai-content-rewriter
npm run rewrite -- ../web-cloner/output

# 3. Copy to template
cp -r output/*.mdx ../astro-seo-template/src/content/blog/

# 4. Build template
cd ../astro-seo-template
npm run build

# 5. Verify zero errors
```

## Component Mapping Examples

### Before (HTML) → After (MDX)
```html
<!-- Input HTML -->
<section class="hero">
  <h1>Welcome</h1>
  <p>Subtitle</p>
  <a href="/contact">Get Started</a>
</section>
```

```mdx
<!-- Output MDX -->
<Hero
  title="Welcome"
  subtitle="Subtitle"
  cta={{ primary: { text: "Get Started", url: "/contact" } }}
/>
```
```

### 3. Create Migration Guide

```markdown
<!-- docs/migration-guide.md -->
# Migration Guide

## Migrating Existing Content

If you have existing MDX content with manual imports, follow these steps:

### Step 1: Remove Import Statements
**Before:**
```mdx
---
title: "My Post"
---
import Hero from '@components/mdx/Hero.astro';
import CTA from '@components/mdx/CTA.astro';
import Stats from '@components/mdx/Stats.astro';

<Hero title="Welcome" />
<Stats items={[...]} />
<CTA href="/contact">Contact</CTA>
```

**After:**
```mdx
---
title: "My Post"
---
<Hero title="Welcome" />
<Stats items={[...]} />
<CTA href="/contact">Contact</CTA>
```

Use find/replace to remove all lines starting with `import`.

### Step 2: Update CTA Components
Old CTA components used inconsistent APIs. Update to unified API.

**Before (props-based):**
```mdx
<CTA primary="Get Quote" primaryUrl="/contact" />
```

**After:**
```mdx
<CTA primary={{ text: "Get Quote", url: "/contact" }} />
```

**Before (slot-based):**
```mdx
<CTAButton href="/contact">Get Quote</CTAButton>
```

**After:**
```mdx
<CTA href="/contact" variant="primary">Get Quote</CTA>
```

### Step 3: Update Image Components
Use Astro's built-in Image component.

**Before:**
```mdx
<CustomImage src="/images/hero.jpg" alt="Hero" />
```

**After:**
```mdx
<Image src="/images/hero.jpg" alt="Hero" width={800} height={600} />
```

### Step 4: Validate Frontmatter
Ensure all frontmatter matches content collection schemas.

**Required for blog posts:**
- `title` (string)
- `description` (string)
- `publishDate` (date)
- `contentType: "blog"`

**Required for products:**
- `title` (string)
- `description` (string)
- `contentType: "product"`

### Step 5: Test Build
```bash
npm run build
```

Fix any validation errors reported by Astro.
```

### 4. Update ai-content-rewriter visual-composition-guide.md

```markdown
<!-- Example structure for ai-content-rewriter repo -->
# Visual Composition Guide

## Component Inventory (51 Total)

### Core Content (16)
1. **Hero** - Full-width hero sections
2. **AuthorBox** - Author bio with avatar and social links
3. **TOC** - Table of contents
4. **Callout** - Info/warning/success/error boxes
5. **CTA** - Call-to-action buttons (unified API)
6. **CTABlock** - Full-width CTA sections
7. **Stats** - Statistics grid
8. **Steps** - Numbered step lists
9. **Step** - Individual step (child of Steps)
10. **FAQ** - Frequently asked questions
11. **Newsletter** - Newsletter signup form
12. **Badge** - Small labels
13. **Breadcrumb** - Navigation breadcrumbs
14. **Image** - Optimized images with captions
15. **LogoCloud** - Logo grid
16. **Testimonial** - Customer testimonials

### Data Display (8)
17. **CardGrid** - Responsive card grid wrapper
18. **Card** - Content card with image/title/description
19. **ComparisonTable** - Feature comparison tables
20. **Tabs** - Tabbed content
21. **PricingTable** - Pricing plans
22. **SpecTable** - Product specifications table
23. **PriceRange** - Min-max price display
24. **CertBadges** - Certification badges grid

[... all 51 components ...]

## Usage Examples

### Converting HTML Hero to MDX Hero
**HTML Input:**
```html
<div class="hero">
  <h1>Welcome to Example Corp</h1>
  <p>Leading provider of industrial solutions</p>
  <a href="/contact">Get Started</a>
  <a href="/about">Learn More</a>
</div>
```

**MDX Output:**
```mdx
<Hero
  title="Welcome to Example Corp"
  subtitle="Leading provider of industrial solutions"
  variant="centered"
  background="gradient"
  cta={{
    primary: { text: "Get Started", url: "/contact" },
    secondary: { text: "Learn More", url: "/about" }
  }}
/>
```

[... examples for all 51 components ...]
```

### 5. Update content-type-registry.cjs

```javascript
// Example for ai-content-rewriter repo
// content-type-registry.cjs

module.exports = {
  components: {
    // Core Content
    hero: {
      pattern: /<section class="hero"|<div class="hero"/,
      extract: (html) => {
        // Extract title, subtitle, CTA buttons
        const title = html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1];
        const subtitle = html.match(/<p[^>]*>(.*?)<\/p>/)?.[1];
        const ctas = [...html.matchAll(/<a href="([^"]+)"[^>]*>(.*?)<\/a>/g)];

        return {
          component: 'Hero',
          props: {
            title,
            subtitle,
            variant: 'centered',
            background: 'gradient',
            cta: ctas.length > 0 ? {
              primary: { text: ctas[0][2], url: ctas[0][1] },
              secondary: ctas[1] ? { text: ctas[1][2], url: ctas[1][1] } : undefined
            } : undefined
          }
        };
      },
      render: (data) => {
        const ctaProp = data.props.cta
          ? `cta={${JSON.stringify(data.props.cta)}}`
          : '';
        return `<Hero
  title="${data.props.title}"
  subtitle="${data.props.subtitle}"
  variant="${data.props.variant}"
  background="${data.props.background}"
  ${ctaProp}
/>`;
      }
    },

    stats: {
      pattern: /<div class="stats"|<section class="statistics"/,
      extract: (html) => {
        const items = [...html.matchAll(/<div class="stat-item"[^>]*>.*?<span class="value">([^<]+)<\/span>.*?<span class="label">([^<]+)<\/span>/gs)];
        return {
          component: 'Stats',
          props: {
            items: items.map(([_, value, label]) => ({ value, label }))
          }
        };
      },
      render: (data) => {
        return `<Stats items={${JSON.stringify(data.props.items)}} />`;
      }
    },

    // ... mappings for all 51 components ...
  }
};
```

### 6. Test Full Pipeline Integration

```bash
# Create test script
# scripts/test-pipeline.sh

#!/bin/bash
set -e

echo "🔗 Testing full pipeline integration..."

# Ensure ai-content-rewriter is updated
cd ../ai-content-rewriter
echo "Checking ai-content-rewriter is on correct branch..."
git status

# Run sample conversion
echo "Converting sample HTML to MDX..."
npm run rewrite -- test/fixtures/sample-site

# Copy output to template
echo "Copying output to template..."
cp -r output/*.mdx ../astro-seo-template/src/content/blog/test-pipeline/

# Build template
cd ../astro-seo-template
echo "Building template..."
npm run build

# Verify build success
if [ $? -eq 0 ]; then
  echo "✅ Pipeline test PASSED"
else
  echo "❌ Pipeline test FAILED"
  exit 1
fi

# Check for imports in output
echo "Checking for stray import statements..."
if grep -r "^import.*from.*@components" src/content/blog/test-pipeline/*.mdx; then
  echo "❌ Found import statements in output! ai-content-rewriter needs updating."
  exit 1
else
  echo "✅ No import statements found"
fi

echo "✅ Full pipeline integration test complete"
```

### 7. Create Component Checklist

```markdown
<!-- Component Checklist for ai-content-rewriter -->
# Component Integration Checklist

Verify each component is:
- [ ] Documented in visual-composition-guide.md
- [ ] Mapped in content-type-registry.cjs
- [ ] Has HTML → MDX conversion example
- [ ] Tested with real content
- [ ] Renders without imports

## Core Content (16/16)
- [x] Hero
- [x] AuthorBox
- [x] TOC
- [x] Callout
- [x] CTA
- [x] CTABlock
- [x] Stats
- [x] Steps
- [x] Step
- [x] FAQ
- [x] Newsletter
- [x] Badge
- [x] Breadcrumb
- [x] Image
- [x] LogoCloud
- [x] Testimonial

## Data Display (8/8)
- [x] CardGrid
- [x] Card
- [x] ComparisonTable
- [x] Tabs
- [x] PricingTable
- [x] SpecTable
- [x] PriceRange
- [x] CertBadges

[... all categories ...]

## Total: 51/51 ✅
```

## Todo List

### Documentation (This Repo)
- [ ] Create `docs/component-api.md` with all 51 component APIs
- [ ] Create `docs/pipeline-integration.md` with integration guide
- [ ] Create `docs/migration-guide.md` for existing content
- [ ] Create `scripts/test-pipeline.sh` for end-to-end testing
- [ ] Update README.md with pipeline integration section

### ai-content-rewriter Updates (Other Repo)
- [ ] Update `visual-composition-guide.md` with all 51 components
- [ ] Update `content-type-registry.cjs` with component mappings
- [ ] Remove import statements from `templates/blog-post.md`
- [ ] Remove import statements from `templates/product-page.md`
- [ ] Remove import statements from `templates/landing-page.md`
- [ ] Add component checklist
- [ ] Update README.md with "no imports" note

### Testing
- [ ] Run test-pipeline.sh script
- [ ] Verify ai-content-rewriter output has zero imports
- [ ] Convert 1 real blog post from Vietnam Plywood
- [ ] Convert 1 real product page from Vietnam Plywood
- [ ] Verify converted content renders in template
- [ ] Check for any manual edits needed (target: zero)
- [ ] Test with 10+ posts to verify scale

### Integration Validation
- [ ] Clone Vietnam Plywood site with web-cloner
- [ ] Run ai-content-rewriter on cloned content
- [ ] Copy output to this template
- [ ] Build template (should succeed with zero errors)
- [ ] Verify all components render correctly
- [ ] Check Lighthouse scores on converted content
- [ ] Verify SEO metadata preserved

### Final Checks
- [ ] All 51 components documented
- [ ] Component API reference complete
- [ ] Migration guide tested with real content
- [ ] Pipeline integration tested end-to-end
- [ ] Zero manual edits required after rewriter
- [ ] Build time still < 30s with real content

## Success Criteria

- ai-content-rewriter outputs MDX with ZERO import statements
- All 51 components documented in visual-composition-guide.md
- content-type-registry.cjs maps all HTML patterns to components
- Pipeline test passes: web-cloner → rewriter → template (zero manual edits)
- Real content from Vietnam Plywood converts and renders successfully
- Component API reference complete and accurate
- Migration guide tested with existing content
- Build time < 30s with 50+ pages of real content

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| ai-content-rewriter not updated | High | Coordinate updates, test integration |
| Component API mismatches | Medium | Comprehensive API docs, validation |
| Import statements slip through | Medium | Automated check in pipeline test |
| Real content edge cases | Medium | Test with diverse content samples |
| Build time increases | Low | Monitor build time, optimize if needed |

## Security Considerations

- Validate all URLs in converted content (no javascript: or data:)
- Sanitize HTML in component props (prevent XSS)
- Verify external images use HTTPS
- Check for sensitive data in sample content

## Next Steps

After Phase 7 complete:
- **Deploy template** to production
- **Update ai-content-rewriter** in parallel
- **Test with real clients** (Vietnam Plywood, others)
- **Iterate based on feedback**
- **Document common issues** in troubleshooting guide

## Unresolved Questions

1. Should we version-lock ai-content-rewriter to template version? (e.g., rewriter v2.x → template v1.x)
2. How to handle component API changes? (breaking vs non-breaking)
3. Should we provide migration scripts for bulk content updates?
