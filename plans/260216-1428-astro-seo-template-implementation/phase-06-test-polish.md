# Phase 6: Test & Polish

**Priority:** P1 | **Status:** ✅ completed | **Effort:** 3h
**Results**: 20 pages generated, 52 schemas validated, 0 errors, build time 1.16s

## Context Links

- **Phase 5**: [SEO Integration](phase-05-seo-integration.md)
- **Architecture**: [Brainstorm](../reports/brainstorm-260216-1408-astro-seo-template-architecture.md)

## Overview

Add sample content, run comprehensive testing (Lighthouse, responsive, a11y), fix issues, polish UX. Verify all success metrics from Phase 1. This phase ensures production-ready quality.

## Key Insights

- Copy test content from Vietnam Plywood project (ai-content-rewriter output)
- Lighthouse targets: Performance 90+, Accessibility 100, Best Practices 100, SEO 100
- Test on real devices + BrowserStack for cross-browser
- Responsive breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop), 1536px (wide)
- Dark mode must work on all breakpoints
- All interactive elements keyboard accessible

## Requirements

### Functional
- 5+ sample blog posts (MDX)
- 3+ sample products (MDX)
- 2+ sample pages (about, landing)
- Test content covers all 51 MDX components
- All test content renders without errors

### Non-Functional
- Lighthouse Performance 90+
- Lighthouse Accessibility 100
- Lighthouse Best Practices 100
- Lighthouse SEO 100
- Works on Chrome, Firefox, Safari, Edge
- Responsive 320px → 1536px
- Zero console errors/warnings
- Build time < 30s for 50-page site

## Architecture

```
Test Content:
src/content/
├── blog/
│   ├── sample-post-1.mdx       ← Hero, Stats, CTA, FAQ
│   ├── sample-post-2.mdx       ← Gallery, Testimonial, Accordion
│   ├── sample-post-3.mdx       ← Steps, FeatureGrid, CTABlock
│   ├── sample-post-4.mdx       ← Timeline, Counter, ProgressBar
│   └── sample-post-5.mdx       ← BeforeAfter, PricingTable, Tabs
├── products/
│   ├── sample-product-1.mdx    ← SpecTable, Gallery, PriceRange
│   ├── sample-product-2.mdx    ← CertBadges, ReviewCard, StarRating
│   └── sample-product-3.mdx    ← ProcessFlow, TrustBar
└── pages/
    ├── about.mdx               ← TeamGrid, Timeline
    └── sample-landing.mdx      ← Hero, Pricing, Testimonial
```

## Related Code Files

### To Create (Test Content)
- `/Users/david/projects/astro-seo-template/src/content/blog/sample-post-1.mdx`
- `/Users/david/projects/astro-seo-template/src/content/blog/sample-post-2.mdx`
- `/Users/david/projects/astro-seo-template/src/content/blog/sample-post-3.mdx`
- `/Users/david/projects/astro-seo-template/src/content/blog/sample-post-4.mdx`
- `/Users/david/projects/astro-seo-template/src/content/blog/sample-post-5.mdx`
- `/Users/david/projects/astro-seo-template/src/content/products/sample-product-1.mdx`
- `/Users/david/projects/astro-seo-template/src/content/products/sample-product-2.mdx`
- `/Users/david/projects/astro-seo-template/src/content/products/sample-product-3.mdx`
- `/Users/david/projects/astro-seo-template/src/content/pages/about.mdx`
- `/Users/david/projects/astro-seo-template/src/content/pages/sample-landing.mdx`

### To Create (Testing Scripts)
- `/Users/david/projects/astro-seo-template/scripts/lighthouse-audit.mjs`
- `/Users/david/projects/astro-seo-template/scripts/test-responsive.mjs`

### To Create (Sample Images)
- `/Users/david/projects/astro-seo-template/public/images/hero-sample.jpg`
- `/Users/david/projects/astro-seo-template/public/images/product-sample-1.jpg`
- `/Users/david/projects/astro-seo-template/public/images/team-member-1.jpg`

## Implementation Steps

### 1. Create Sample Blog Posts

```mdx
---
# src/content/blog/sample-post-1.mdx
title: "Complete Guide to Industrial Plywood Selection"
description: "Learn how to choose the right plywood for your industrial project"
publishDate: 2026-01-15
author: "default"
image:
  src: "/images/hero-sample.jpg"
  alt: "Industrial plywood samples"
tags: ["plywood", "industrial", "guide"]
contentType: "blog"
faq:
  - q: "What thickness is best for industrial use?"
    a: "18mm is standard for most industrial applications"
  - q: "How to identify quality plywood?"
    a: "Check for consistent layers and smooth surface finish"
---

<Hero
  title="Complete Guide to Industrial Plywood"
  subtitle="Everything you need to know about selecting quality plywood"
  variant="centered"
  background="gradient"
/>

<Stats
  items={[
    { value: "50+", label: "Plywood Types" },
    { value: "15", label: "Years Experience" },
    { value: "99%", label: "Customer Satisfaction" }
  ]}
/>

## Understanding Plywood Grades

<Callout type="info" title="Pro Tip">
Always request grade certification from suppliers before bulk orders.
</Callout>

Lorem ipsum content here...

<CTA
  primary={{ text: "Request Quote", url: "/contact" }}
  secondary={{ text: "View Products", url: "/products" }}
/>

<FAQ
  items={[
    { q: "What is the typical lead time?", a: "2-3 weeks for standard orders" },
    { q: "Do you offer custom sizes?", a: "Yes, we cut to custom specifications" }
  ]}
/>
```

### 2. Create Sample Product

```mdx
---
# src/content/products/sample-product-1.mdx
title: "Premium Marine Plywood 18mm"
description: "Water-resistant plywood ideal for marine and outdoor applications"
image:
  src: "/images/product-sample-1.jpg"
  alt: "Marine plywood sheet"
specs:
  Thickness: "18mm"
  Grade: "A/A"
  Core: "Hardwood"
  Glue: "WBP (Water Resistant)"
  Size: "1220mm x 2440mm"
  Weight: "28kg per sheet"
contentType: "product"
---

<Gallery
  images={[
    { src: "/images/product-sample-1.jpg", alt: "Front view" },
    { src: "/images/product-sample-2.jpg", alt: "Side view" },
    { src: "/images/product-sample-3.jpg", alt: "Detail" }
  ]}
  layout="grid"
/>

## Product Specifications

<SpecTable
  specs={{
    Thickness: "18mm",
    Grade: "A/A",
    Core: "Hardwood",
    Glue: "WBP (Water Resistant)",
    Size: "1220mm x 2440mm",
    Weight: "28kg per sheet"
  }}
  variant="table"
/>

## Pricing

<PriceRange min={45} max={65} currency="USD" unit="per sheet" />

<CertBadges
  badges={[
    { name: "ISO 9001", image: "/images/cert-iso.png" },
    { name: "FSC Certified", image: "/images/cert-fsc.png" }
  ]}
/>

<CTABlock
  title="Ready to order?"
  description="Contact us for bulk pricing and custom specifications"
  cta={{ primary: { text: "Request Quote", url: "/contact" } }}
  background="gradient"
/>
```

### 3. Create Lighthouse Audit Script

```javascript
// scripts/lighthouse-audit.mjs
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { writeFileSync } from 'fs';

const urls = [
  'http://localhost:4321/',
  'http://localhost:4321/blog',
  'http://localhost:4321/blog/sample-post-1',
  'http://localhost:4321/products',
  'http://localhost:4321/products/sample-product-1',
];

async function runAudit(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse(url, options);
  await chrome.kill();

  return {
    url,
    scores: {
      performance: runnerResult.lhr.categories.performance.score * 100,
      accessibility: runnerResult.lhr.categories.accessibility.score * 100,
      bestPractices: runnerResult.lhr.categories['best-practices'].score * 100,
      seo: runnerResult.lhr.categories.seo.score * 100,
    },
  };
}

async function auditAll() {
  console.log('🔍 Running Lighthouse audits...\n');

  const results = [];
  for (const url of urls) {
    console.log(`Auditing: ${url}`);
    const result = await runAudit(url);
    results.push(result);

    const { scores } = result;
    console.log(`  Performance: ${scores.performance}`);
    console.log(`  Accessibility: ${scores.accessibility}`);
    console.log(`  Best Practices: ${scores.bestPractices}`);
    console.log(`  SEO: ${scores.seo}\n`);
  }

  // Save results
  writeFileSync('lighthouse-results.json', JSON.stringify(results, null, 2));

  // Check if all meet targets
  const failed = results.filter(
    r =>
      r.scores.performance < 90 ||
      r.scores.accessibility < 100 ||
      r.scores.bestPractices < 100 ||
      r.scores.seo < 100
  );

  if (failed.length > 0) {
    console.error('❌ Some pages failed Lighthouse targets:');
    failed.forEach(f => console.error(`   ${f.url}`));
    process.exit(1);
  }

  console.log('✅ All pages meet Lighthouse targets!');
}

auditAll();
```

### 4. Install Lighthouse

```bash
npm install -D lighthouse chrome-launcher
npm pkg set scripts.test:lighthouse="node scripts/lighthouse-audit.mjs"
```

### 5. Create Responsive Test Script

```javascript
// scripts/test-responsive.mjs
import puppeteer from 'puppeteer';

const viewports = [
  { name: 'Mobile', width: 320, height: 568 },
  { name: 'Mobile Large', width: 414, height: 896 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1024, height: 768 },
  { name: 'Wide', width: 1536, height: 864 },
];

const urls = [
  'http://localhost:4321/',
  'http://localhost:4321/blog/sample-post-1',
  'http://localhost:4321/products/sample-product-1',
];

async function testResponsive() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log('📱 Testing responsive layouts...\n');

  for (const url of urls) {
    console.log(`Testing: ${url}`);

    for (const viewport of viewports) {
      await page.setViewport(viewport);
      await page.goto(url, { waitUntil: 'networkidle0' });

      // Check for horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      if (hasHorizontalScroll) {
        console.error(`  ❌ ${viewport.name}: Horizontal scroll detected`);
      } else {
        console.log(`  ✅ ${viewport.name}: OK`);
      }

      // Take screenshot
      await page.screenshot({
        path: `screenshots/${url.split('/').pop() || 'home'}-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
      });
    }
    console.log('');
  }

  await browser.close();
  console.log('✅ Responsive test complete. Screenshots saved to screenshots/');
}

testResponsive();
```

### 6. Install Puppeteer

```bash
npm install -D puppeteer
npm pkg set scripts.test:responsive="node scripts/test-responsive.mjs"
mkdir screenshots
```

### 7. Create Accessibility Test Script

```javascript
// scripts/test-a11y.mjs
import { axe, toHaveNoViolations } from 'jest-axe';
import puppeteer from 'puppeteer';

expect.extend(toHaveNoViolations);

const urls = [
  'http://localhost:4321/',
  'http://localhost:4321/blog',
  'http://localhost:4321/products',
];

async function testAccessibility() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log('♿ Testing accessibility...\n');

  for (const url of urls) {
    await page.goto(url, { waitUntil: 'networkidle0' });

    const results = await page.evaluate(async () => {
      return await window.axe.run();
    });

    if (results.violations.length > 0) {
      console.error(`❌ ${url}: ${results.violations.length} violations`);
      results.violations.forEach(v => {
        console.error(`   - ${v.id}: ${v.description}`);
      });
    } else {
      console.log(`✅ ${url}: No violations`);
    }
  }

  await browser.close();
}

testAccessibility();
```

### 8. Build Performance Test

```bash
# Test build time
time npm run build

# Should complete in < 30s for 50-page site
# If > 30s, investigate:
# - Large unoptimized images
# - Too many MDX components imported
# - Slow content collection queries
```

### 9. Cross-Browser Testing Checklist

```markdown
# Manual Cross-Browser Checklist

## Chrome (latest)
- [ ] Homepage renders
- [ ] Dark mode toggle works
- [ ] View transitions smooth
- [ ] Mobile menu opens/closes
- [ ] Search works
- [ ] All animations trigger

## Firefox (latest)
- [ ] Homepage renders
- [ ] Dark mode toggle works
- [ ] View transitions work (with fallback)
- [ ] Mobile menu works
- [ ] Search works

## Safari (latest)
- [ ] Homepage renders
- [ ] Dark mode toggle works
- [ ] Glassmorphism renders (backdrop-filter)
- [ ] Mobile menu works
- [ ] Search works

## Edge (latest)
- [ ] Homepage renders
- [ ] All features work
```

### 10. Performance Optimization Checklist

```markdown
# Performance Optimization

## Images
- [ ] All images < 500KB
- [ ] WebP format where supported
- [ ] Lazy loading enabled
- [ ] Width/height attributes set
- [ ] Responsive srcset for large images

## CSS
- [ ] Unused CSS purged by Tailwind
- [ ] Critical CSS inlined
- [ ] Font loading optimized

## JavaScript
- [ ] Scripts deferred where possible
- [ ] No blocking scripts in head (except dark mode)
- [ ] View transition scripts minimal

## Build
- [ ] Build output < 5MB total
- [ ] Individual pages < 500KB
- [ ] No duplicate chunks
```

## Todo List

### Sample Content Creation
- [ ] Create 5 sample blog posts covering different MDX components
- [ ] Create 3 sample products with specs, images, pricing
- [ ] Create about page with TeamGrid, Timeline
- [ ] Create sample landing page with full component showcase
- [ ] Add sample images to `/public/images/` (hero, products, team)
- [ ] Verify all sample content validates (frontmatter schemas)

### Testing Scripts
- [ ] Install lighthouse and chrome-launcher
- [ ] Create `scripts/lighthouse-audit.mjs`
- [ ] Install puppeteer
- [ ] Create `scripts/test-responsive.mjs`
- [ ] Create `scripts/test-a11y.mjs`
- [ ] Add test scripts to package.json

### Build & Performance
- [ ] Run `npm run build` and verify < 30s
- [ ] Check build output size < 5MB
- [ ] Verify no build warnings or errors
- [ ] Test dev server startup time
- [ ] Check for duplicate dependencies in bundle

### Lighthouse Audits
- [ ] Run Lighthouse on homepage (target: 90/100/100/100)
- [ ] Run Lighthouse on blog list page
- [ ] Run Lighthouse on blog post page
- [ ] Run Lighthouse on product list page
- [ ] Run Lighthouse on product detail page
- [ ] Fix any failing audits
- [ ] Verify all scores meet targets

### Responsive Testing
- [ ] Test 320px mobile (iPhone SE)
- [ ] Test 414px mobile (iPhone 14 Pro Max)
- [ ] Test 768px tablet (iPad)
- [ ] Test 1024px desktop
- [ ] Test 1536px wide screen
- [ ] Verify no horizontal scroll on any breakpoint
- [ ] Test mobile menu on small screens
- [ ] Test grid layouts collapse correctly

### Accessibility Testing
- [ ] Run axe DevTools on all page types
- [ ] Verify all interactive elements keyboard accessible
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Verify skip-to-content link works
- [ ] Check color contrast ratios (WCAG AA)
- [ ] Verify focus indicators visible
- [ ] Test form validation messages accessible

### Cross-Browser Testing
- [ ] Test on Chrome (latest)
- [ ] Test on Firefox (latest)
- [ ] Test on Safari (latest)
- [ ] Test on Edge (latest)
- [ ] Verify glassmorphism works in Safari
- [ ] Test view transitions fallback in older browsers

### Dark Mode Testing
- [ ] Test dark mode on all page types
- [ ] Verify no color contrast issues in dark mode
- [ ] Test system preference detection
- [ ] Test manual toggle persistence
- [ ] Verify dark mode works after view transitions

### SEO Validation
- [ ] Run Google Rich Results Test on blog post
- [ ] Run Google Rich Results Test on product page
- [ ] Test Twitter Card validator
- [ ] Test Facebook sharing debugger
- [ ] Verify sitemap generates correctly
- [ ] Test search functionality with 10+ posts

### Polish & UX
- [ ] Add loading states to forms
- [ ] Add error states to forms
- [ ] Verify all CTAs have clear labels
- [ ] Check all links have descriptive text
- [ ] Verify images have meaningful alt text
- [ ] Test print stylesheet (if needed)
- [ ] Add 404 page test
- [ ] Test breadcrumbs on deep pages

## Success Criteria

- Lighthouse Performance 90+ on all pages
- Lighthouse Accessibility 100 on all pages
- Lighthouse Best Practices 100 on all pages
- Lighthouse SEO 100 on all pages
- Build time < 30s for 50-page site
- No horizontal scroll on any breakpoint (320px → 1536px)
- Zero console errors or warnings
- All interactive elements keyboard accessible
- Dark mode works on all components
- Cross-browser compatible (Chrome, Firefox, Safari, Edge)
- Schema.org validates on all content types
- Pagefind search returns relevant results
- All sample content renders correctly

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Lighthouse performance fails | High | Optimize images, defer scripts, minimize CSS |
| Horizontal scroll on mobile | Medium | Test with real devices, fix layout issues |
| Accessibility violations | High | Run axe, fix ARIA labels, test with screen reader |
| Cross-browser issues | Medium | Use feature detection, provide fallbacks |
| Build time too slow | Low | Optimize content collections, check for slow loaders |

## Security Considerations

- Verify no sensitive data in sample content
- Check all external links use HTTPS
- Ensure forms don't expose internal errors
- Verify robots.txt doesn't leak sensitive paths

## Next Steps

→ **Phase 7**: Pipeline Sync (update ai-content-rewriter configs, remove import statements)

**Dependencies**: Phase 7 requires Phase 6 complete (verified working template)
