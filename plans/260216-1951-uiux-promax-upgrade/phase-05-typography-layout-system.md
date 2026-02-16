# Phase 5: Typography & Layout System

**Date:** 2026-02-16
**Priority:** P2 (Polish)
**Status:** ✅ Complete
**Effort:** 1.5h

## Context Links

- Parent plan: [plan.md](plan.md)
- Previous phase: [phase-04-upgrade-existing-components.md](phase-04-upgrade-existing-components.md)

## Overview

Establish typography hierarchy and layout system for long-form content. Define prose styles (line-height, max-width, paragraph spacing), heading hierarchy (h1-h6 sizes/weights), section rhythm (consistent py-16/py-20/py-24 patterns), responsive typography (fluid or breakpoint-based). Goal: "Long content that's still beautiful" — readable, scannable, visually rhythmic.

**Why fifth:** Typography system builds on components (Phase 3-4) and tokens (Phase 2). Defines reading experience across all content types.

## Key Insights

- **Current state:** No consistent prose styles, headings sized ad-hoc per component
- **Ideal line-height:** 1.6-1.75 for body text (readability), 1.2-1.3 for headings (tightness)
- **Optimal line length:** 60-75 characters (max-width: 65ch) for long-form reading
- **Paragraph spacing:** 1.5em between paragraphs, 0.5em after headings
- **Heading hierarchy:** h1 (hero only), h2 (major sections), h3 (subsections), h4 (minor points), h5-h6 rare
- **Section rhythm:** py-16 (compact), py-20 (standard), py-24 (spacious) — already defined in Phase 2 tokens
- **Responsive approach:** Mix of CSS clamp() for headings (h1-h3) + breakpoint-based for body/h4-h6
<!-- Updated: Validation Session 1 - User chose hybrid clamp + breakpoint typography -->

## Requirements

### Functional
1. Global prose styles applied to long-form content areas (blog posts, product descriptions, about pages)
2. Heading hierarchy defined: h1 (4xl-6xl), h2 (3xl-4xl), h3 (2xl-3xl), h4 (xl-2xl), h5 (lg-xl), h6 (base-lg)
3. Section rhythm classes: .section-compact (py-16), .section-standard (py-20), .section-spacious (py-24)
4. Responsive typography: CSS clamp() for h1-h3 (fluid sizing), breakpoint-based for h4-h6 and body text
5. Visual hierarchy clear: Size, weight, spacing, color communicate importance

### Non-Functional
1. Accessibility: Contrast ratios meet WCAG AA (4.5:1 for body, 3:1 for headings)
2. Readability: Flesch reading ease 60+ (8th grade level)
3. Performance: No additional CSS bundle size increase (utility classes only)

## Architecture

### Typography Scale (Design Tokens Already Defined)

From `design-tokens.json` lines 46-57:
```json
"sizes": {
  "xs": "0.75rem",    // 12px
  "sm": "0.875rem",   // 14px
  "base": "1rem",     // 16px
  "lg": "1.125rem",   // 18px
  "xl": "1.25rem",    // 20px
  "2xl": "1.5rem",    // 24px
  "3xl": "1.875rem",  // 30px
  "4xl": "2.25rem",   // 36px
  "5xl": "3rem",      // 48px
  "6xl": "3.75rem"    // 60px
}
```

### Heading Hierarchy Mapping

| Element | Mobile Size | Desktop Size | Weight | Line Height | Use Case |
|---------|------------|--------------|---------|-------------|----------|
| h1 | text-4xl (36px) | text-5xl/6xl (48-60px) | font-bold (700) | leading-tight (1.25) | Hero headlines only |
| h2 | text-3xl (30px) | text-4xl (36px) | font-bold (700) | leading-snug (1.375) | Major section titles |
| h3 | text-2xl (24px) | text-3xl (30px) | font-semibold (600) | leading-snug (1.375) | Subsection titles |
| h4 | text-xl (20px) | text-2xl (24px) | font-semibold (600) | leading-normal (1.5) | Minor section titles |
| h5 | text-lg (18px) | text-xl (20px) | font-medium (500) | leading-normal (1.5) | Small headings |
| h6 | text-base (16px) | text-lg (18px) | font-medium (500) | leading-normal (1.5) | Micro headings |

### Prose Styles (Long-Form Content)

```css
.prose {
  /* Base typography */
  font-size: 1rem;           /* 16px */
  line-height: 1.75;         /* 28px (comfortable reading) */
  color: var(--color-neutral-700);

  /* Max width for readability */
  max-width: 65ch;           /* ~60-75 characters per line */

  /* Paragraph spacing */
  p {
    margin-bottom: 1.5em;    /* 24px */
  }

  /* Heading spacing */
  h2, h3, h4 {
    margin-top: 2em;         /* Space before heading */
    margin-bottom: 0.5em;    /* Tight after heading */
  }

  /* Lists */
  ul, ol {
    margin-bottom: 1.5em;
    padding-left: 1.5em;
  }

  li {
    margin-bottom: 0.5em;
  }

  /* Links */
  a {
    color: var(--color-primary-600);
    text-decoration: underline;
    text-decoration-color: var(--color-primary-200);
    text-underline-offset: 2px;
    transition: text-decoration-color 0.2s;
  }

  a:hover {
    text-decoration-color: var(--color-primary-600);
  }

  /* Images */
  img {
    border-radius: 0.75rem;
    margin-top: 2em;
    margin-bottom: 2em;
  }

  /* Blockquotes */
  blockquote {
    border-left: 4px solid var(--color-primary-500);
    padding-left: 1em;
    margin: 1.5em 0;
    font-style: italic;
    color: var(--color-neutral-600);
  }

  /* Code blocks */
  pre {
    border-radius: 0.5rem;
    padding: 1em;
    margin: 1.5em 0;
    overflow-x: auto;
  }

  /* Inline code */
  code {
    background: var(--color-neutral-100);
    padding: 0.2em 0.4em;
    border-radius: 0.25rem;
    font-size: 0.875em;
  }
}
```

### Section Rhythm Classes

```css
/* Already defined in Phase 2 tokens, create utility classes */
.section-compact {
  padding-top: var(--spacing-section-sm);    /* 4rem / 64px */
  padding-bottom: var(--spacing-section-sm);
}

.section-standard {
  padding-top: var(--spacing-section-md);    /* 6rem / 96px */
  padding-bottom: var(--spacing-section-md);
}

.section-spacious {
  padding-top: var(--spacing-section-lg);    /* 8rem / 128px */
  padding-bottom: var(--spacing-section-lg);
}
```

## Related Code Files

```
src/
├── styles/
│   ├── global.css                      # UPDATE: Add prose styles, heading hierarchy, section rhythm
│   └── theme.css                       # REFERENCE: Token values (auto-generated)
├── layouts/
│   └── BaseLayout.astro                # UPDATE: Apply heading hierarchy classes
└── content/
    └── [all MDX files]                 # BENEFIT: Automatic prose styling
design-tokens.json                      # REFERENCE: Typography tokens (already defined)
```

## Implementation Steps

### Step 1: Define Prose Styles in global.css (30 min)

**1.1 Add prose class after line 99 (after touch target rules)**

Edit `src/styles/global.css`:

```css
/* Prose styles for long-form content */
.prose {
  /* Base typography */
  @apply text-base text-neutral-700;
  line-height: 1.75;
  max-width: 65ch;
}

.prose p {
  margin-bottom: 1.5em;
}

.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  @apply font-bold text-neutral-900;
  margin-top: 2em;
  margin-bottom: 0.5em;
  line-height: 1.375;
}

.prose h2 {
  @apply text-3xl md:text-4xl;
}

.prose h3 {
  @apply text-2xl md:text-3xl font-semibold;
}

.prose h4 {
  @apply text-xl md:text-2xl font-semibold;
}

.prose h5 {
  @apply text-lg md:text-xl font-medium;
}

.prose h6 {
  @apply text-base md:text-lg font-medium;
}

.prose ul,
.prose ol {
  margin-bottom: 1.5em;
  padding-left: 1.5em;
}

.prose li {
  margin-bottom: 0.5em;
}

.prose a {
  @apply text-primary-600 underline;
  text-decoration-color: var(--color-primary-200);
  text-underline-offset: 2px;
  transition: text-decoration-color 0.2s;
}

.prose a:hover {
  text-decoration-color: var(--color-primary-600);
}

.prose img {
  @apply rounded-xl my-8;
}

.prose blockquote {
  @apply border-l-4 border-primary-500 pl-4 my-6 italic text-neutral-600;
}

.prose pre {
  @apply rounded-lg p-4 my-6 overflow-x-auto;
}

.prose code {
  @apply bg-neutral-100 px-2 py-1 rounded text-sm;
}

.prose pre code {
  @apply bg-transparent p-0;
}

/* Responsive prose sizing */
@media (min-width: 768px) {
  .prose {
    font-size: 1.125rem;  /* 18px on tablet+ */
  }
}
```

### Step 2: Define Heading Hierarchy Utilities (20 min)

**2.1 Add heading utility classes to global.css**

```css
/* Heading hierarchy utilities */
.heading-hero {
  @apply text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900;
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.heading-section {
  @apply text-3xl md:text-4xl font-bold text-neutral-900;
  line-height: 1.375;
  letter-spacing: -0.01em;
}

.heading-subsection {
  @apply text-2xl md:text-3xl font-semibold text-neutral-900;
  line-height: 1.375;
}

.heading-minor {
  @apply text-xl md:text-2xl font-semibold text-neutral-800;
  line-height: 1.5;
}

.heading-small {
  @apply text-lg md:text-xl font-medium text-neutral-800;
  line-height: 1.5;
}
```

**2.2 Test heading classes**

Create test page `src/content/pages/typography-test.mdx`:

```mdx
---
title: "Typography Test"
---

<h1 class="heading-hero">Hero Heading (h1)</h1>
<p class="text-xl text-neutral-600 mb-8">Hero subheading text</p>

<div class="prose">

<h2 class="heading-section">Section Heading (h2)</h2>
<p>This is body text following a section heading. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

<h3 class="heading-subsection">Subsection Heading (h3)</h3>
<p>This is body text following a subsection heading. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>

<h4 class="heading-minor">Minor Heading (h4)</h4>
<p>This is body text following a minor heading. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</p>

<h5 class="heading-small">Small Heading (h5)</h5>
<p>This is body text following a small heading. Excepteur sint occaecat cupidatat non proident.</p>

</div>
```

```bash
npm run dev
# Navigate to /typography-test
```

### Step 3: Define Section Rhythm Utilities (15 min)

**3.1 Add section rhythm classes to global.css**

```css
/* Section rhythm utilities (using Phase 2 tokens) */
.section-compact {
  @apply py-16;
}

.section-standard {
  @apply py-20 md:py-24;
}

.section-spacious {
  @apply py-24 md:py-32;
}

/* Content break spacing for long-form content */
.content-break {
  margin-top: 2.5rem;  /* 40px - from Phase 2 content-break token */
  margin-bottom: 2.5rem;
}
```

**3.2 Update SectionWrapper component to use utilities**

Edit `src/components/mdx/SectionWrapper.astro`:

```astro
---
interface Props {
  bg?: 'white' | 'light' | 'gradient' | 'gradient-subtle';
  padding?: 'sm' | 'md' | 'lg';  // Maps to compact/standard/spacious
  id?: string;
  class?: string;
}

const {
  bg = 'white',
  padding = 'md',
  id,
  class: additionalClass = ''
} = Astro.props;

const bgClass = {
  white: 'bg-white',
  light: 'bg-neutral-50',
  gradient: 'bg-gradient-to-b from-primary-50 via-white to-primary-50',
  'gradient-subtle': 'bg-gradient-to-br from-primary-50 to-secondary-50'
}[bg];

const paddingClass = {
  sm: 'section-compact',
  md: 'section-standard',
  lg: 'section-spacious'
}[padding];
---

<section
  {id}
  class={`${bgClass} ${paddingClass} ${additionalClass}`}
>
  <div class="container mx-auto px-4 max-w-7xl">
    <slot />
  </div>
</section>
```

### Step 4: Apply Prose to Content Layouts (20 min)

**4.1 Update blog post layout**

Create or update blog post rendering in `src/pages/[slug].astro`:

```astro
---
// ... existing imports and logic ...
const { entry } = Astro.props;
const { Content } = await entry.render();
---

<BaseLayout {seo}>
  <article class="py-24">
    <div class="container mx-auto px-4">
      <!-- Hero section (not prose) -->
      <header class="max-w-4xl mx-auto mb-12">
        <h1 class="heading-hero mb-6">{entry.data.title}</h1>
        {entry.data.description && (
          <p class="text-xl text-neutral-600">{entry.data.description}</p>
        )}
      </header>

      <!-- Content with prose styles -->
      <div class="prose prose-lg mx-auto">
        <Content />
      </div>
    </div>
  </article>
</BaseLayout>
```

**4.2 Apply prose to product descriptions**

Update product page template similarly:

```astro
<div class="prose prose-lg">
  <Content />
</div>
```

**4.3 Apply prose to about/generic pages**

Update generic page template:

```astro
<div class="prose prose-lg mx-auto">
  <Content />
</div>
```

### Step 5: Create Typography Documentation (15 min)

**5.1 Create visual type scale page**

Create `src/content/pages/type-scale.mdx`:

```mdx
---
title: "Typography Scale"
description: "Visual reference for typography hierarchy"
---

<div class="space-y-16 py-12">

## Hero Heading
<h1 class="heading-hero">The quick brown fox jumps over the lazy dog</h1>
<p class="text-sm text-neutral-500 mt-2">Class: heading-hero | 4xl → 5xl → 6xl | Bold</p>

## Section Heading
<h2 class="heading-section">The quick brown fox jumps over the lazy dog</h2>
<p class="text-sm text-neutral-500 mt-2">Class: heading-section | 3xl → 4xl | Bold</p>

## Subsection Heading
<h3 class="heading-subsection">The quick brown fox jumps over the lazy dog</h3>
<p class="text-sm text-neutral-500 mt-2">Class: heading-subsection | 2xl → 3xl | Semibold</p>

## Minor Heading
<h4 class="heading-minor">The quick brown fox jumps over the lazy dog</h4>
<p class="text-sm text-neutral-500 mt-2">Class: heading-minor | xl → 2xl | Semibold</p>

## Small Heading
<h5 class="heading-small">The quick brown fox jumps over the lazy dog</h5>
<p class="text-sm text-neutral-500 mt-2">Class: heading-small | lg → xl | Medium</p>

## Body Text
<p class="text-base">The quick brown fox jumps over the lazy dog. Regular body text at 16px (mobile) / 18px (desktop) with 1.75 line-height for comfortable reading. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

<p class="text-lg">The quick brown fox jumps over the lazy dog. Large body text at 18px with increased line-height.</p>

<p class="text-sm text-neutral-600">Small text at 14px, typically used for captions and metadata.</p>

</div>
```

### Step 6: Test Typography System (20 min)

**6.1 Visual test**

```bash
npm run dev
```

Navigate to:
- `/type-scale` — Check heading hierarchy visually
- `/typography-test` — Check prose styles
- Any blog post — Check real content rendering
- Any product page — Check description formatting

**6.2 Readability test**

Use browser DevTools:
- Select paragraph text
- Measure line width: Should be ~60-75 characters
- Measure line-height: Should be 1.6-1.75 for body text
- Check color contrast: text-neutral-700 on white ≥4.5:1 (WCAG AA)

**6.3 Responsive test**

Test at breakpoints:
- 375px: Headings scale down appropriately
- 768px: Text size increases to 18px (prose-lg)
- 1024px: Max-width 65ch maintains readability

**6.4 Accessibility check**

```bash
# Lighthouse test on blog post page
# Verify:
# - Accessibility score 95+
# - Heading hierarchy logical (no skipped levels)
# - Color contrast passes WCAG AA
```

### Step 7: Build Verification (10 min)

**7.1 Production build**

```bash
npm run build
```

Verify:
- 0 errors
- 0 warnings
- All pages build successfully

**7.2 Check CSS bundle size**

```bash
ls -lh dist/_astro/*.css
# Should be similar to Phase 4 (~40-50kb)
# Prose styles add ~2-3kb
```

**7.3 Preview build**

```bash
npm run preview
```

Test typography on:
- Blog post (prose rendering)
- Product page (description formatting)
- About page (long-form content)

### Step 8: Commit Typography System (10 min)

```bash
git add src/styles/global.css src/components/mdx/SectionWrapper.astro src/pages/[slug].astro
git commit -m "$(cat <<'EOF'
feat: establish typography and layout system

Prose styles:
- Base typography: 16px mobile / 18px desktop, line-height 1.75
- Max-width: 65ch for optimal readability (~60-75 characters/line)
- Paragraph spacing: 1.5em between paragraphs
- Heading spacing: 2em before, 0.5em after
- Link styles: Underline with primary color, hover transition
- Image/blockquote/code formatting

Heading hierarchy:
- heading-hero: 4xl → 5xl → 6xl, bold (hero sections only)
- heading-section: 3xl → 4xl, bold (major sections)
- heading-subsection: 2xl → 3xl, semibold (subsections)
- heading-minor: xl → 2xl, semibold (minor sections)
- heading-small: lg → xl, medium (small headings)

Section rhythm:
- section-compact: py-16 (64px)
- section-standard: py-20 md:py-24 (80-96px)
- section-spacious: py-24 md:py-32 (96-128px)
- content-break: 2.5rem (40px visual breaks)

Apply prose to blog posts, product descriptions, about pages.
SectionWrapper updated to use rhythm utilities.
Build: 0 errors. CSS: +2-3kb for prose styles.
EOF
)"
```

## Todo List

- [ ] Add prose styles to global.css
- [ ] Add heading hierarchy utilities to global.css
- [ ] Add section rhythm utilities to global.css
- [ ] Update SectionWrapper to use rhythm utilities
- [ ] Create typography-test.mdx test page
- [ ] Create type-scale.mdx reference page
- [ ] Apply prose to blog post layout
- [ ] Apply prose to product page layout
- [ ] Apply prose to about/generic page layout
- [ ] Visual test (type-scale, typography-test, real content pages)
- [ ] Readability test (line width 60-75ch, line-height 1.6-1.75, contrast ≥4.5:1)
- [ ] Responsive test (375px, 768px, 1024px)
- [ ] Accessibility test (Lighthouse, heading hierarchy)
- [ ] Run npm run build (verify 0 errors)
- [ ] Check CSS bundle size (+2-3kb expected)
- [ ] Commit changes

## Success Criteria

1. **Prose styles functional:**
   - Max-width 65ch enforced
   - Line-height 1.75 for body text
   - Paragraph spacing 1.5em
   - Link/image/blockquote/code styled consistently

2. **Heading hierarchy clear:**
   - 5 utility classes (hero, section, subsection, minor, small)
   - Responsive sizing at 3 breakpoints
   - Visual hierarchy intuitive (size, weight, spacing)

3. **Section rhythm consistent:**
   - 3 utilities (compact, standard, spacious)
   - Applied via SectionWrapper component
   - Alternating patterns create visual rhythm

4. **Build quality:**
   - npm run build: 0 errors
   - CSS bundle: +2-3kb (acceptable)
   - Lighthouse Accessibility: 95+

## Risk Assessment

**Low Risk:**
- Prose max-width breaks full-width layouts → Apply prose only to content areas, not wrappers
- Heading utilities conflict with component styles → Test all page types thoroughly
- Section rhythm too rigid → Utilities are opt-in, components can override

**Mitigation:**
- Test prose on all content types (blog, product, about)
- Document when to use .prose vs component-specific styling
- Keep section rhythm utilities separate from component internal spacing

## Next Steps

After Phase 5 complete:
- **Phase 6:** Component catalog (document all 52 components with typography usage examples)
- **Phase 7:** ai-content-rewriter beautification (teach rewriter to use prose styles, heading hierarchy)

## Unresolved Questions

1. Should prose-lg (18px) be default on desktop, or opt-in per content type?
   → Default for blog/about, opt-in for product (depends on content density)
2. Should heading utilities include margin-top/bottom, or only typography?
   → Only typography (size, weight, line-height, letter-spacing). Margins handled by prose class or component context
3. Should section rhythm utilities include horizontal padding (px), or only vertical (py)?
   → Only vertical. Horizontal padding handled by container classes (.container mx-auto px-4)
