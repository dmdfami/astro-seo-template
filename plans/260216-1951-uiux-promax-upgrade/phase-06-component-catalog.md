# Phase 6: Component Catalog

**Date:** 2026-02-16
**Priority:** P1 (Integration)
**Status:** ✅ Complete
**Effort:** 1.5h

## Context Links

- Parent plan: [plan.md](plan.md)
- Previous phase: [phase-05-typography-layout-system.md](phase-05-typography-layout-system.md)

## Overview

Create `docs/component-catalog.md` as shared contract between template and ai-content-rewriter skill. Document all 63 components (47 existing + 5 premium + 11 utility premium): name, props API, variants, MDX usage examples, placement rules, spacing rules, frequency rules. Format must be parseable by both human developers and AI agents.

**Why sixth:** Catalog defines the "language" that ai-content-rewriter uses to output beautiful MDX. Must exist before teaching rewriter (Phase 7).

## Key Insights

- **Catalog is contract:** Template implements → Catalog documents → Rewriter follows
- **Dual audience:** Human developers (API reference) + AI agents (generation rules)
- **Format requirements:** Structured headings, clear prop syntax, MDX examples, usage guidelines
- **Component categories:** Content (text/headings), Data/Interactive (tables/forms), Product/Visual (cards/gallery), Social/Trust (testimonials/badges), Premium (new 5)
- **Frequency rules critical:** Prevent overuse (e.g., max 2 Highlights per H2 section, 1 BentoGrid per page)
- **Placement rules essential:** Define where components work (e.g., Hero only at page top, SectionWrapper wraps major sections)

## Requirements

### Functional
1. All 52 components documented with consistent structure
2. Each component entry includes: Name, Purpose, Props API, Variants, MDX Usage Example, Placement Rules, Spacing Rules, Frequency Rules
3. Grouped by category: Content, Data/Interactive, Product/Visual, Social/Trust, Premium
4. Markdown format with clear headings for easy parsing
5. Examples use realistic plywood/B2B industrial content

### Non-Functional
1. Parseable by AI (clear structure, consistent format)
2. Scannable by humans (TOC, category sections, inline examples)
3. Maintainable (single source of truth, easy to update when components change)
4. Version-tracked (committed to git, changes reviewed)

## Architecture

### Catalog Structure

```markdown
# Component Catalog

> Shared contract between astro-seo-template and ai-content-rewriter skill.
> Template implements components, catalog documents usage, rewriter generates MDX.

## Table of Contents
- [Premium Components](#premium-components)
- [Content Components](#content-components)
- [Data & Interactive Components](#data--interactive-components)
- [Product & Visual Components](#product--visual-components)
- [Social & Trust Components](#social--trust-components)

---

## Premium Components

### Highlight
**Purpose:** Gradient text highlight for keywords, certifications, features.

**Props:**
- `variant` (optional): `'primary'` | `'teal-blue'` | `'accent'` — Default: `'primary'`

**MDX Usage:**
```mdx
We offer <Highlight>FSC Certified</Highlight> plywood with <Highlight variant="teal-blue">ISO 9001:2015</Highlight> compliance.
```

**Placement Rules:**
- Inline within paragraphs or headings
- Typically after H2/H3 section titles
- Highlight key differentiators, certifications, numbers

**Spacing Rules:**
- No additional spacing (inline element)
- Inherits parent text size

**Frequency Rules:**
- Max 2 per H2 section
- Avoid consecutive highlights (space with 3-5 words)
- Use sparingly to maintain emphasis

---

[... Continue for all 52 components ...]
```

### Component Categories

**Premium (5 new):**
- Highlight, FloatingBadge, BentoGrid, BentoItem, SectionWrapper, ImageWithFallback

**Content (10):**
- Hero, CTA, CTABlock, Blockquote, Quote, Divider, Breadcrumbs, TOC, Alert, Banner

**Data & Interactive (12):**
- Table, SpecTable, ComparisonTable, PricingTable, Accordion, Tabs, FAQ, ContactForm, Newsletter, Steps, Step, ProcessFlow

**Product & Visual (15):**
- Card, CardGrid, ProductCard, Gallery, Image, Video, Timeline, Stats, Metric, FeatureGrid, Icon, Logo, Badge, Tag, ProgressBar

**Social & Trust (10):**
- Testimonial, AuthorBox, Reviews, CalloutBox, FloatingBadge (also in Premium), Link, Button, Input, List, Pagination

## Related Code Files

```
docs/
└── component-catalog.md                # CREATE: Complete catalog

src/components/mdx/
└── [52 .astro files]                   # REFERENCE: Implementation details

~/.claude/skills/ai-content-rewriter/
└── references/
    └── visual-composition-guide.md      # UPDATE: Phase 7 (reference catalog)
```

## Implementation Steps

### Step 1: Create Catalog File Structure (15 min)

**1.1 Create docs/component-catalog.md**

```bash
mkdir -p docs
touch docs/component-catalog.md
```

**1.2 Write catalog header and TOC**

```markdown
# Component Catalog

**Version:** 1.0.0 (Post UI/UX Pro Max Upgrade)
**Date:** 2026-02-16
**Template:** astro-seo-template
**Consumer:** ai-content-rewriter skill

> This catalog serves as the shared contract between the Astro template (component implementation) and the ai-content-rewriter skill (MDX generation). When components change, update this catalog first, then implementations follow.

## Purpose

Define every available MDX component with:
- **Props API:** What parameters the component accepts
- **Variants:** Different visual styles or configurations
- **MDX Usage:** Real-world examples with plywood/B2B context
- **Placement Rules:** Where the component should be used
- **Spacing Rules:** How component affects layout rhythm
- **Frequency Rules:** How often to use per page to avoid repetition

## Table of Contents

- [Premium Components (6)](#premium-components)
- [Content Components (10)](#content-components)
- [Data & Interactive Components (12)](#data--interactive-components)
- [Product & Visual Components (15)](#product--visual-components)
- [Social & Trust Components (9)](#social--trust-components)

---
```

### Step 2: Document Premium Components (20 min)

**2.1 Add Premium Components section**

```markdown
## Premium Components

Components added in UI/UX Pro Max upgrade for gradient text, floating effects, bento layouts, section rhythm, and image fallbacks.

### Highlight

**Purpose:** Gradient text highlight for keywords, certifications, key numbers.

**Props:**
- `variant` (optional): `'primary'` | `'teal-blue'` | `'accent'` — Default: `'primary'`

**Variants:**
- `primary`: Teal gradient (brand color)
- `teal-blue`: Teal to blue-grey gradient (brand + trust)
- `accent`: Yellow-green accent gradient

**MDX Usage:**
```mdx
We manufacture <Highlight>FSC Certified</Highlight> plywood with <Highlight variant="teal-blue">ISO 9001:2015</Highlight> compliance, delivering <Highlight variant="accent">10,000+ CBM monthly</Highlight>.
```

**Placement Rules:**
- Inline within paragraphs or headings
- After H2/H3 titles to highlight section theme
- Key differentiators: certifications, capacity numbers, unique features

**Spacing Rules:**
- No additional spacing (inline element)
- Inherits parent font size

**Frequency Rules:**
- Max 2 highlights per H2 section
- Minimum 3-5 words between consecutive highlights
- Avoid in every paragraph (use for true emphasis only)

---

### FloatingBadge

**Purpose:** Pill badge with icon, hover lift effect. Use for certifications, trust signals, features.

**Props:**
- `variant` (optional): `'certification'` | `'trust'` | `'feature'` — Default: `'feature'`
- `icon` (optional): Emoji or text character

**Variants:**
- `certification`: Teal gradient, for standards/certifications
- `trust`: Blue-grey gradient, for experience/proof points
- `feature`: Yellow-green gradient, for product features

**MDX Usage:**
```mdx
<FloatingBadge variant="certification" icon="✓">ISO 9001:2015</FloatingBadge>
<FloatingBadge variant="trust" icon="⭐">10+ Years Experience</FloatingBadge>
<FloatingBadge variant="feature" icon="🚀">Global Shipping</FloatingBadge>
```

**Placement Rules:**
- Near headings or within hero sections
- Group 2-4 badges together (certification section, about page)
- Use in product cards to highlight key specs

**Spacing Rules:**
- Inline-flex, auto-wraps with gap-3
- Vertical margin: my-4 when in paragraph flow

**Frequency Rules:**
- Max 6 badges per page (avoid badge fatigue)
- Group related badges (all certifications together, not scattered)

---

### BentoGrid & BentoItem

**Purpose:** CSS Grid layout with flexible cell sizes for featured content, product showcases, testimonials.

**BentoGrid Props:**
- `cols` (optional): `2` | `3` | `4` — Default: `3`
- `gap` (optional): `'sm'` | `'md'` | `'lg'` — Default: `'md'`

**BentoItem Props:**
- `span` (optional): `1` | `2` — Column span, default: `1`
- `rowSpan` (optional): `1` | `2` — Row span, default: `1`
- `class` (optional): Additional Tailwind classes

**MDX Usage:**
```mdx
<BentoGrid cols={3} gap="md">
  <BentoItem span={2} rowSpan={2}>
    ### Featured Product
    Our premium film-faced plywood for construction.
    ![Product image](/images/featured-plywood.jpg)
  </BentoItem>
  <BentoItem>
    **Stat:** 10,000+ CBM/month
  </BentoItem>
  <BentoItem>
    **Certification:** FSC, ISO 9001
  </BentoItem>
  <BentoItem span={2}>
    ### Customer Testimonial
    "Best quality plywood we've sourced from Vietnam..."
  </BentoItem>
</BentoGrid>
```

**Placement Rules:**
- Homepage hero area (featured products + stats)
- Landing pages (product showcase + social proof)
- About page (company info grid)
- Avoid in blog posts (too layout-heavy for prose)

**Spacing Rules:**
- Vertical margin: my-8 (visual break from prose)
- Internal padding: p-6 per BentoItem

**Frequency Rules:**
- Max 1 BentoGrid per page (visual complexity)
- Use for high-impact areas only (hero, featured section)

---

### SectionWrapper

**Purpose:** Wrap major content sections with alternating backgrounds and consistent padding.

**Props:**
- `bg` (optional): `'white'` | `'light'` | `'gradient'` | `'gradient-subtle'` — Default: `'white'`
- `padding` (optional): `'sm'` | `'md'` | `'lg'` — Default: `'md'`
- `id` (optional): Anchor link ID
- `class` (optional): Additional classes

**Variants:**
- `white`: White background
- `light`: Light grey (neutral-50)
- `gradient`: Teal gradient (primary-50 via white)
- `gradient-subtle`: Teal to blue-grey gradient

**MDX Usage:**
```mdx
<SectionWrapper bg="white" padding="lg" id="features">
  ## Product Features
  [Content here...]
</SectionWrapper>

<SectionWrapper bg="gradient-subtle" padding="md">
  ## Customer Testimonials
  [Content here...]
</SectionWrapper>

<SectionWrapper bg="light" padding="md" id="certifications">
  ## Our Certifications
  [Content here...]
</SectionWrapper>
```

**Placement Rules:**
- Wrap major sections (features, testimonials, process, about)
- Alternate bg for visual rhythm: white → gradient → light → gradient
- Use on long pages (homepage, landing, about)

**Spacing Rules:**
- Padding variants: sm (64px), md (80-96px), lg (96-128px)
- Contains internal .container with max-w-7xl

**Frequency Rules:**
- Use for all major sections on long pages
- Alternate bg values (don't repeat same bg 2x in a row)

---

### ImageWithFallback

**Purpose:** Image with skeleton shimmer loading and fallback on error.

**Props:**
- `src` (required): Image URL
- `alt` (required): Alt text for accessibility
- `width` (optional): Width in pixels
- `height` (optional): Height in pixels
- `fallback` (optional): Fallback image path — Default: `/images/fallback-placeholder.svg`
- `class` (optional): Additional classes

**MDX Usage:**
```mdx
<ImageWithFallback
  src="/images/products/film-faced-plywood-vietnam.webp"
  alt="Film faced plywood sheets for construction"
  width={800}
  height={600}
  class="mx-auto"
/>
```

**Placement Rules:**
- Product detail pages (main product image)
- Blog posts (featured images, inline photos)
- Gallery sections (use with CardGrid wrapper)

**Spacing Rules:**
- Vertical margin: my-8 (within prose)
- Rounded corners: rounded-lg default

**Frequency Rules:**
- No limit (use as needed for visual content)
- Prefer over basic `<img>` tag (adds loading state + fallback)

---
```

### Step 3: Document Content Components (15 min)

List 10 components: Hero, CTA, CTABlock, Blockquote, Quote, Divider, Breadcrumbs, TOC, Alert, Banner

For each, follow same structure:
- Purpose (1 sentence)
- Props (TypeScript interface style)
- Variants (if applicable)
- MDX Usage (realistic B2B plywood example)
- Placement Rules (where to use)
- Spacing Rules (margins, padding)
- Frequency Rules (how often per page)

**Example entry:**

```markdown
### Hero

**Purpose:** Page top hero section with headline, description, CTA button, optional image.

**Props:**
- `title` (required): Main headline text
- `description` (optional): Subheading text
- `ctaText` (optional): Button label
- `ctaLink` (optional): Button href
- `image` (optional): Hero image URL
- `imageAlt` (optional): Image alt text

**MDX Usage:**
```mdx
<Hero
  title="Premium Vietnam Plywood Manufacturer"
  description="FSC certified, ISO 9001 compliant. 10,000+ CBM monthly capacity."
  ctaText="Request Quote"
  ctaLink="/contact"
  image="/images/hero-factory.jpg"
  imageAlt="HCPLY plywood factory"
/>
```

**Placement Rules:**
- First component on page (above all other content)
- Use on: homepage, landing pages, product category pages
- Avoid on: blog posts (use heading-hero instead), contact page

**Spacing Rules:**
- Internal padding: py-24 md:py-32
- No additional margin (fills viewport top)

**Frequency Rules:**
- Exactly 1 per page (never multiple heroes)
- If page has hero, don't use additional H1 in content

---
```

### Step 4: Document Data & Interactive Components (15 min)

List 12 components: Table, SpecTable, ComparisonTable, PricingTable, Accordion, Tabs, FAQ, ContactForm, Newsletter, Steps, Step, ProcessFlow

Follow same structure. Emphasize:
- **Tables:** When to use each type (Spec vs Comparison vs Pricing)
- **Interactive:** Accessibility requirements (keyboard nav, ARIA labels)
- **Forms:** Required vs optional fields, validation

### Step 5: Document Product & Visual Components (15 min)

List 15 components: Card, CardGrid, ProductCard, Gallery, Image, Video, Timeline, Stats, Metric, FeatureGrid, Icon, Logo, Badge, Tag, ProgressBar

Follow same structure. Emphasize:
- **Cards:** Difference between Card (generic) and ProductCard (specific schema)
- **Grid layouts:** CardGrid vs BentoGrid (when to use each)
- **Stats/Metrics:** Best practices for number formatting

### Step 6: Document Social & Trust Components (10 min)

List 9 components: Testimonial, AuthorBox, Reviews, CalloutBox, Link, Button, Input, List, Pagination

Follow same structure. Emphasize:
- **Testimonials:** Always include author name + role/company
- **AuthorBox:** For blog posts, product pages with expert content
- **Reviews:** Aggregate rating + individual reviews

### Step 7: Add Usage Guidelines Section (10 min)

**7.1 Add general guidelines at end of catalog**

```markdown
---

## General Usage Guidelines

### Component Selection Priority

When choosing components for a page:

1. **Start with structure:** SectionWrapper for major sections
2. **Add hero:** Hero component on landing/homepage
3. **Add content:** Prose text, headings, paragraphs
4. **Enhance visually:** Highlight keywords, FloatingBadge certifications
5. **Add data:** Tables, Stats, FeatureGrid as needed
6. **Add social proof:** Testimonial, Reviews, AuthorBox
7. **Add CTAs:** CTA buttons, ContactForm, Newsletter

### Visual Rhythm Pattern

Alternate section backgrounds for long pages:

```
Hero (gradient-subtle)
  ↓
Section 1 (white) — Features
  ↓
Section 2 (gradient-subtle) — Testimonials
  ↓
Section 3 (light) — Process
  ↓
Section 4 (gradient-subtle) — CTA
```

### Component Frequency Best Practices

| Component | Max per Page | Notes |
|-----------|--------------|-------|
| Hero | 1 | Page top only |
| Highlight | 8-10 | Max 2 per H2 section |
| FloatingBadge | 6 | Group related badges |
| BentoGrid | 1 | High visual weight |
| SectionWrapper | Unlimited | Wrap all major sections |
| Testimonial | 3-5 | More than 5 = fatigue |
| CTA | 2-3 | Top, middle, bottom |
| Table | 2-3 | Tables are dense, limit per page |

### Accessibility Requirements

All components must:
- Include `alt` text on images
- Use semantic HTML (`<section>`, `<article>`, `<button>`)
- Support keyboard navigation (Tab, Enter, Space, Esc)
- Meet WCAG AA contrast (4.5:1 for text, 3:1 for UI)
- Include ARIA labels where needed (`aria-label`, `aria-describedby`)

### Mobile-First Guidelines

Design for mobile first, enhance for desktop:
- Text: 16px min (18px for prose on desktop)
- Touch targets: 44px min (iOS/Android standards)
- Images: Responsive srcset, lazy loading
- Grids: Stack vertically on mobile (grid-cols-1), expand on tablet/desktop
- Modals/overlays: Full-screen on mobile, dialog on desktop

---

## Maintenance

When adding/changing components:

1. Update component implementation (`.astro` file)
2. Update this catalog (props, usage, rules)
3. Test in dev server
4. Update ai-content-rewriter skill references
5. Commit changes together (template + catalog + skill)

**Catalog Owner:** Template maintainer
**Consumers:** ai-content-rewriter skill, human developers, documentation site
**Review Cadence:** After every component addition/major change

---

**End of Component Catalog**
```

### Step 8: Validate Catalog Completeness (10 min)

**8.1 Count components documented**

```bash
grep "^### " docs/component-catalog.md | wc -l
# Should show 52
```

**8.2 Verify all new premium components included**

```bash
grep -E "^### (Highlight|FloatingBadge|BentoGrid|BentoItem|SectionWrapper|ImageWithFallback)" docs/component-catalog.md
# Should show all 6 (BentoGrid + BentoItem separate entries)
```

**8.3 Check for TODOs or placeholders**

```bash
grep -i "TODO\|TBD\|FIXME" docs/component-catalog.md
# Should return 0 results
```

**8.4 Human review**

Read through catalog:
- Props syntax consistent?
- MDX examples realistic (B2B plywood context)?
- Placement rules clear?
- Frequency rules reasonable?

### Step 9: Test Catalog with Sample MDX (10 min)

**9.1 Create test page using catalog examples**

Create `src/content/pages/catalog-test.mdx`, copy 5-6 examples from catalog:

```mdx
---
title: "Catalog Examples Test"
---

## Premium Components Test

We manufacture <Highlight>FSC Certified</Highlight> plywood with <Highlight variant="teal-blue">ISO 9001:2015</Highlight> compliance.

<FloatingBadge variant="certification" icon="✓">ISO 9001:2015</FloatingBadge>
<FloatingBadge variant="trust" icon="⭐">10+ Years Experience</FloatingBadge>

<SectionWrapper bg="gradient-subtle" padding="md">
  ## Featured Products

  <BentoGrid cols={3} gap="md">
    <BentoItem span={2} rowSpan={2}>
      ### Film Faced Plywood
      Premium construction plywood
    </BentoItem>
    <BentoItem>
      **Capacity:** 10,000+ CBM
    </BentoItem>
    <BentoItem>
      **Certifications:** FSC, ISO
    </BentoItem>
  </BentoGrid>
</SectionWrapper>
```

**9.2 Verify examples render correctly**

```bash
npm run dev
# Navigate to /catalog-test
```

Check:
- All components render as described in catalog
- Props work as documented
- Visual appearance matches expectations

### Step 10: Commit Catalog (5 min)

```bash
git add docs/component-catalog.md
git commit -m "$(cat <<'EOF'
docs: create component catalog contract

Complete catalog of all 52 MDX components:
- Premium (6): Highlight, FloatingBadge, BentoGrid, BentoItem, SectionWrapper, ImageWithFallback
- Content (10): Hero, CTA, CTABlock, Blockquote, Quote, Divider, etc.
- Data & Interactive (12): Tables, Accordion, Tabs, FAQ, Forms, etc.
- Product & Visual (15): Cards, Gallery, Stats, Timeline, etc.
- Social & Trust (9): Testimonial, AuthorBox, Reviews, etc.

Each entry includes:
- Purpose (what it does)
- Props API (TypeScript interface style)
- Variants (visual options)
- MDX Usage (realistic B2B plywood examples)
- Placement Rules (where to use)
- Spacing Rules (margins, padding)
- Frequency Rules (how often per page)

Plus usage guidelines:
- Component selection priority
- Visual rhythm pattern
- Frequency best practices
- Accessibility requirements
- Mobile-first guidelines
- Maintenance workflow

This catalog serves as contract between template (implementation) and
ai-content-rewriter skill (MDX generation). Update together when components change.
EOF
)"
```

## Todo List

- [ ] Create docs/component-catalog.md file
- [ ] Write catalog header, TOC, purpose
- [ ] Document Premium components (6): Highlight, FloatingBadge, BentoGrid, BentoItem, SectionWrapper, ImageWithFallback
- [ ] Document Content components (10): Hero, CTA, CTABlock, etc.
- [ ] Document Data & Interactive components (12): Tables, Accordion, Forms, etc.
- [ ] Document Product & Visual components (15): Cards, Gallery, Stats, etc.
- [ ] Document Social & Trust components (9): Testimonial, AuthorBox, Reviews, etc.
- [ ] Add General Usage Guidelines section
- [ ] Add Maintenance section
- [ ] Validate 52 components documented (grep count)
- [ ] Verify all premium components included
- [ ] Check for TODOs/placeholders (should be 0)
- [ ] Human review (consistency, clarity, completeness)
- [ ] Create catalog-test.mdx with 5-6 examples
- [ ] Test examples render correctly in dev server
- [ ] Commit catalog

## Success Criteria

1. **Catalog completeness:**
   - All 52 components documented
   - Consistent structure (Purpose, Props, Variants, Usage, Placement, Spacing, Frequency)
   - Realistic MDX examples with B2B plywood context

2. **Catalog usability:**
   - Human-readable (clear headings, scannable sections)
   - AI-parseable (consistent format, structured data)
   - Maintainable (single file, version-tracked, clear ownership)

3. **Validation:**
   - All catalog examples render correctly in test page
   - Zero TODOs or placeholders
   - Committed to git with descriptive message

## Risk Assessment

**Low Risk:**
- Catalog documentation drift from implementation → Mitigated by maintenance workflow (update together)
- Examples become outdated → Mitigated by test page using catalog examples
- AI cannot parse format → Mitigated by structured headings, consistent syntax

**Mitigation:**
- Review catalog after every component change
- Run catalog-test.mdx page in CI (future enhancement)
- Document parsing format in ai-content-rewriter skill instructions (Phase 7)

## Next Steps

After Phase 6 complete:
- **Phase 7:** Update ai-content-rewriter skill to reference component-catalog.md
- **Phase 7:** Add beautification rules using premium components
- **Phase 7:** Update component-per-page-type matrix with new components

## Unresolved Questions

1. Should catalog include "Don't use" examples (anti-patterns)?
   → Yes, add to each component where common mistakes occur (e.g., "Don't: Use Highlight on every word")
2. Should catalog include version history (component changes over time)?
   → Not in v1 (keep simple). Consider separate CHANGELOG.md for component library later
3. Should catalog be published as public documentation site?
   → Out of scope for Phase 6. Could be future enhancement (Astro docs site, deployed separately)
