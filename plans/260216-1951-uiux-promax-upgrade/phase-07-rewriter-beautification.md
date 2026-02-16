# Phase 7: ai-content-rewriter Beautification Layer

**Date:** 2026-02-16
**Priority:** P1 (Integration)
**Status:** ✅ Complete
**Effort:** 1h

## Context Links

- Parent plan: [plan.md](plan.md)
- Previous phase: [phase-06-component-catalog.md](phase-06-component-catalog.md)
- Skill path: `~/.claude/skills/ai-content-rewriter/`
- Component catalog: `docs/component-catalog.md` (created in Phase 6)

## Overview

Update ai-content-rewriter skill to output beautiful MDX using premium components. Add awareness of Highlight, FloatingBadge, BentoGrid, SectionWrapper, ImageWithFallback. Update visual-composition-guide.md with beautification rules. Update component-per-page-type matrix. Reference component-catalog.md for correct syntax.

**Why seventh:** Skill needs catalog (Phase 6) and implemented components (Phase 3) to generate correct MDX. This phase teaches the rewriter to use premium patterns automatically.

## Key Insights

- **Rewriter skill path:** `/Users/david/.claude/skills/ai-content-rewriter/`
- **Key files to update:** `references/visual-composition-guide.md`, `references/content-structure-templates.md`, component matrix
- **Core principle:** "Template leads, rewriter follows" — catalog is contract
- **Beautification rules:** Where to use premium components (Highlight 1-2x per H2, FloatingBadge for certifications, SectionWrapper alternation)
- **Visual breaks:** Every 300-500 words for long content (cards, stats, testimonials)
- **Frequency limits:** Prevent overuse (max 2 Highlights per section, 1 BentoGrid per page)

## Requirements

### Functional
1. visual-composition-guide.md updated with premium component awareness
2. Component-per-page-type matrix includes new 6 components
3. Beautification rules defined: when/where/how often to use each premium component
4. Reference to component-catalog.md for correct MDX syntax
5. content-structure-templates.md updated with beautification patterns
6. Examples added showing premium component usage in context

### Non-Functional
1. Rules clear and actionable for AI agent
2. Examples realistic (B2B plywood industry)
3. Backward compatible (existing non-premium components still work)
4. Frequency rules prevent component fatigue

## Architecture

### Skill Directory Structure

```
~/.claude/skills/ai-content-rewriter/
├── skill.md                                    # Main skill definition
├── references/
│   ├── visual-composition-guide.md             # UPDATE: Add premium components
│   ├── content-structure-templates.md          # UPDATE: Add beautification patterns
│   ├── component-usage-matrix.md               # UPDATE: Add 6 new components
│   └── seo-optimization-rules.md               # READ-ONLY: No changes
└── examples/
    └── [example MDX files]                     # OPTIONAL: Add premium examples
```

### Changes to visual-composition-guide.md

**Add sections:**
1. **Premium Components Overview** — Brief intro to 6 new components
2. **Highlight Usage Rules** — When/where to add gradient text
3. **FloatingBadge Placement** — Certifications, trust signals, features
4. **BentoGrid Strategy** — Homepage/landing only, featured content
5. **SectionWrapper Rhythm** — Alternating backgrounds on long pages
6. **ImageWithFallback** — Prefer over basic img tag
7. **Visual Break Frequency** — Every 300-500 words guideline

### Changes to content-structure-templates.md

**Add templates showing:**
1. Homepage with BentoGrid + SectionWrapper
2. Product page with Highlight + FloatingBadge
3. Blog post with ImageWithFallback + prose styling
4. Landing page with full premium stack

## Related Code Files

```
~/.claude/skills/ai-content-rewriter/
├── references/
│   ├── visual-composition-guide.md             # UPDATE
│   ├── content-structure-templates.md          # UPDATE
│   └── component-usage-matrix.md               # UPDATE
/Users/david/projects/astro-seo-template/
└── docs/
    └── component-catalog.md                    # REFERENCE (read-only)
```

## Implementation Steps

### Step 1: Update visual-composition-guide.md (25 min)

**1.1 Read current guide**

```bash
cat ~/.claude/skills/ai-content-rewriter/references/visual-composition-guide.md | head -50
```

**1.2 Add Premium Components section after existing components**

Insert after current component list:

```markdown
## Premium Components (New)

Post UI/UX Pro Max upgrade, 6 new premium components available:

### Highlight — Gradient Text Keywords

**Purpose:** Emphasize key terms with gradient text (certifications, features, numbers).

**When to use:**
- After H2/H3 section titles to highlight theme
- Certifications: "FSC Certified", "ISO 9001:2015"
- Key numbers: "10,000+ CBM monthly", "30+ countries"
- Unique features: "waterproof", "eco-friendly", "custom sizes"

**Frequency rules:**
- Max 2 per H2 section
- Minimum 3-5 words between consecutive highlights
- Avoid in every paragraph (dilutes emphasis)

**MDX syntax:**
```mdx
We offer <Highlight>FSC Certified</Highlight> plywood with <Highlight variant="teal-blue">ISO 9001:2015</Highlight> compliance.
```

**Variants:**
- `primary` (default): Teal gradient (brand)
- `teal-blue`: Teal to blue-grey (brand + trust)
- `accent`: Yellow-green (high emphasis)

---

### FloatingBadge — Pill Badges with Icons

**Purpose:** Display certifications, trust signals, features as pill badges.

**When to use:**
- Certification section (ISO, FSC, CE, CARB)
- About page hero (years experience, capacity, countries)
- Product cards (key specs as badges)

**Frequency rules:**
- Max 6 badges per page
- Group related badges together (all certs in one cluster)
- Use icons consistently (✓ for certifications, ⭐ for ratings, 🚀 for features)

**MDX syntax:**
```mdx
<FloatingBadge variant="certification" icon="✓">ISO 9001:2015</FloatingBadge>
<FloatingBadge variant="trust" icon="⭐">10+ Years Experience</FloatingBadge>
<FloatingBadge variant="feature" icon="🚀">Global Shipping</FloatingBadge>
```

**Placement:**
- After hero heading (site-wide certifications)
- Before or after product description (product-specific specs)
- In about page company overview

---

### BentoGrid — Featured Content Layout

**Purpose:** CSS Grid with flexible cell sizes for hero areas, featured products, testimonials.

**When to use:**
- Homepage hero (featured product + stats)
- Landing page above fold (product showcase + social proof)
- About page (company info grid)

**Frequency rules:**
- Max 1 per page (high visual weight)
- Use on long pages only (homepage, landing, about)
- Avoid in blog posts (too layout-heavy)

**MDX syntax:**
```mdx
<BentoGrid cols={3} gap="md">
  <BentoItem span={2} rowSpan={2}>
    ### Featured: Film Faced Plywood
    Premium construction-grade plywood...
  </BentoItem>
  <BentoItem>
    **10,000+ CBM**
    Monthly capacity
  </BentoItem>
  <BentoItem>
    **30+ Countries**
    Global export
  </BentoItem>
  <BentoItem span={2}>
    ### Customer Testimonial
    "Best plywood supplier..."
  </BentoItem>
</BentoGrid>
```

**Structure tips:**
- Large feature card (span=2, rowSpan=2) in top-left
- Stat cards (span=1) for numbers
- Wide card (span=2) for testimonials
- Keep content concise per cell (50-100 words)

---

### SectionWrapper — Alternating Backgrounds

**Purpose:** Wrap major sections with alternating backgrounds for visual rhythm.

**When to use:**
- All major sections on long pages (homepage, landing, about)
- Alternate: white → gradient-subtle → light → gradient-subtle
- Use consistent padding per section type

**Frequency rules:**
- Use for every major section (no limit)
- Never repeat same bg 2x in a row
- Follow rhythm pattern strictly

**MDX syntax:**
```mdx
<SectionWrapper bg="white" padding="lg" id="features">
  ## Product Features
  [Content...]
</SectionWrapper>

<SectionWrapper bg="gradient-subtle" padding="md">
  ## What Customers Say
  [Testimonials...]
</SectionWrapper>

<SectionWrapper bg="light" padding="md" id="process">
  ## Our Manufacturing Process
  [Process steps...]
</SectionWrapper>
```

**Background rhythm:**
1. Hero section: `gradient-subtle` (bold intro)
2. Features: `white` (clean, readable)
3. Social proof: `gradient-subtle` (emphasis)
4. Process/specs: `light` (neutral)
5. CTA: `gradient-subtle` (final push)

---

### ImageWithFallback — Smart Images

**Purpose:** Images with skeleton loading + fallback handling.

**When to use:**
- Always prefer over basic `<img>` tag
- Product images, blog featured images, gallery photos

**MDX syntax:**
```mdx
<ImageWithFallback
  src="/images/products/film-faced-plywood.webp"
  alt="Film faced plywood sheets for construction"
  width={800}
  height={600}
/>
```

**Benefit over img tag:**
- Skeleton shimmer while loading (better UX)
- Automatic fallback on error (no broken images)
- Consistent rounded corners (rounded-lg)

---

## Beautification Strategy

### Visual Break Frequency

Long content needs visual breaks every 300-500 words:

**After 1st paragraph (100 words):** FloatingBadge cluster (certifications)
**After 2nd section (300 words):** Stats component or Card grid
**After 3rd section (500 words):** Testimonial
**After 4th section (700 words):** Gallery or product cards
**After 5th section (900 words):** CTA block
**Final section (1100 words):** Contact form or newsletter

**Pattern:** Text → Visual → Text → Visual (alternate every 2-3 paragraphs)

### Component Priority per Page Type

**Homepage:**
1. Hero with gradient bg + Highlight in headline
2. FloatingBadge cluster (certifications)
3. BentoGrid (featured products + stats)
4. SectionWrapper alternation for remaining sections
5. Testimonials with gradient bg
6. CTA with gradient button

**Product Page:**
1. Hero with product title + Highlight key spec
2. FloatingBadge (certifications + specs)
3. ImageWithFallback (product photos)
4. SpecTable or ComparisonTable
5. Testimonial or AuthorBox (expert endorsement)
6. CTA (request quote)

**Blog Post:**
1. Heading-hero class on H1 (no Hero component)
2. Prose class on content area
3. ImageWithFallback for inline images
4. Highlight sparingly (1-2 per H2 section)
5. Blockquote for key insights
6. AuthorBox at end

**Landing Page:**
1. Hero with BentoGrid above fold
2. FloatingBadge cluster
3. SectionWrapper for all major sections (alternating bg)
4. FeatureGrid with gradient icons
5. Multiple testimonials
6. CTA block with gradient

---
```

### Step 2: Update component-usage-matrix.md (15 min)

**2.1 Read current matrix**

```bash
cat ~/.claude/skills/ai-content-rewriter/references/component-usage-matrix.md | head -30
```

**2.2 Add 6 new components to matrix**

Find component matrix table, add rows:

```markdown
| Component | Homepage | Product | Blog | Landing | About | Generic | Contact |
|-----------|----------|---------|------|---------|-------|---------|---------|
| Highlight | ✓✓ (2-3) | ✓✓ (2-3) | ✓ (1-2) | ✓✓ (3-4) | ✓ (1-2) | ✓ (1-2) | ✗ |
| FloatingBadge | ✓✓ (4-6) | ✓ (2-3) | ✗ | ✓✓ (4-6) | ✓✓ (4-6) | ✓ (2-3) | ✗ |
| BentoGrid | ✓ (1) | ✗ | ✗ | ✓ (1) | ✓ (1) | ✗ | ✗ |
| BentoItem | ✓✓ (4-6) | ✗ | ✗ | ✓✓ (4-6) | ✓ (3-4) | ✗ | ✗ |
| SectionWrapper | ✓✓✓ (all) | ✓✓ (major) | ✗ | ✓✓✓ (all) | ✓✓✓ (all) | ✓ (major) | ✓ (form wrap) |
| ImageWithFallback | ✓✓ (2-3) | ✓✓ (2-4) | ✓✓ (1-3) | ✓✓ (2-4) | ✓ (1-2) | ✓ (1-2) | ✗ |

Legend:
- ✓✓✓ = Always use (core to page type)
- ✓✓ = Recommended (use frequently)
- ✓ = Optional (use if fits context)
- ✗ = Avoid (wrong context)
- (n) = Frequency guideline
```

**2.3 Add usage notes**

```markdown
### Premium Component Notes

**Highlight:**
- Homepage: 2-3 in hero + features
- Product: 2-3 in description (key specs)
- Blog: 1-2 per major section (sparingly)
- Landing: 3-4 throughout (more promotional)

**FloatingBadge:**
- Homepage: 4-6 cluster after hero (certs + trust)
- Product: 2-3 key specs as badges
- Landing/About: 4-6 company credentials

**BentoGrid:**
- Homepage/Landing/About only (1 per page max)
- Use for hero area or featured section
- 4-6 BentoItems per grid (balanced layout)

**SectionWrapper:**
- Wrap ALL major sections on long pages
- Alternate bg: white → gradient-subtle → light → repeat
- Use padding="lg" for hero, padding="md" for others

**ImageWithFallback:**
- Always prefer over <img> tag
- Product pages: 2-4 images (main + details)
- Blog posts: 1-3 inline images (break up text)
```

### Step 3: Update content-structure-templates.md (15 min)

**3.1 Add Premium Homepage Template**

Insert after existing templates:

```markdown
## Homepage Template (Premium)

```mdx
---
title: "Premium Vietnam Plywood Manufacturer | HCPLY"
description: "FSC certified, ISO 9001 compliant. 10,000+ CBM monthly capacity. Shipping to 30+ countries."
type: "homepage"
---

<Hero
  title="Premium Vietnam Plywood for Global Construction"
  description="FSC certified, ISO 9001 compliant. 10,000+ CBM monthly capacity."
  ctaText="Request Quote"
  ctaLink="/contact"
  image="/images/hero-factory.jpg"
/>

<SectionWrapper bg="white" padding="lg" id="certifications">
  <div class="text-center mb-8">
    <h2 class="heading-section mb-4">Trusted <Highlight>Worldwide</Highlight></h2>
    <div class="flex flex-wrap justify-center gap-3">
      <FloatingBadge variant="certification" icon="✓">ISO 9001:2015</FloatingBadge>
      <FloatingBadge variant="certification" icon="✓">FSC Certified</FloatingBadge>
      <FloatingBadge variant="trust" icon="⭐">10+ Years Experience</FloatingBadge>
      <FloatingBadge variant="feature" icon="🚀">30+ Countries</FloatingBadge>
    </div>
  </div>
</SectionWrapper>

<SectionWrapper bg="gradient-subtle" padding="md" id="featured">
  <BentoGrid cols={3} gap="lg">
    <BentoItem span={2} rowSpan={2}>
      ### Film Faced Plywood
      Premium construction-grade plywood with <Highlight>waterproof film coating</Highlight>.
      Perfect for concrete formwork, reusable 20+ times.
      <ImageWithFallback
        src="/images/products/film-faced-plywood.webp"
        alt="Film faced plywood sheets"
        width={400}
        height={300}
      />
    </BentoItem>
    <BentoItem>
      **10,000+ CBM**
      Monthly production capacity
    </BentoItem>
    <BentoItem>
      **20+ Times**
      Reusable formwork
    </BentoItem>
    <BentoItem span={2}>
      _"HCPLY delivers the best quality plywood we've sourced from Vietnam.
      Consistent thickness, smooth finish, excellent formwork performance."_
      — Construction Manager, Singapore
    </BentoItem>
  </BentoGrid>
</SectionWrapper>

<SectionWrapper bg="white" padding="md" id="products">
  <h2 class="heading-section text-center mb-12">Product Range</h2>
  <CardGrid cols={3}>
    <Card
      title="Film Faced Plywood"
      description="Waterproof, reusable concrete formwork"
      image="/images/products/film-faced.jpg"
      link="/film-faced-plywood-vietnam"
    />
    <Card
      title="Bintangor Plywood"
      description="Furniture-grade, smooth natural finish"
      image="/images/products/bintangor.jpg"
      link="/bintangor-plywood-vietnam"
    />
    <Card
      title="Core Veneer"
      description="Eucalyptus core for plywood manufacturing"
      image="/images/products/core-veneer.jpg"
      link="/eucalyptus-core-veneer"
    />
  </CardGrid>
</SectionWrapper>

<SectionWrapper bg="light" padding="md" id="testimonials">
  <h2 class="heading-section text-center mb-12">What <Highlight variant="accent">Customers Say</Highlight></h2>
  <Testimonial
    quote="We've been importing from HCPLY for 3 years. Quality is consistent, delivery is reliable, and their team is professional. Highly recommend."
    author="David Chen"
    role="Procurement Manager"
    company="BuildMart Singapore"
    avatar="/images/avatars/david-chen.jpg"
  />
</SectionWrapper>

<SectionWrapper bg="gradient-subtle" padding="lg" id="cta">
  <CTA
    title="Ready to Order?"
    description="Get a quote for your next plywood order. Fast response, competitive pricing."
    ctaText="Request Quote"
    ctaLink="/contact"
  />
</SectionWrapper>
```
```

**3.2 Add Premium Product Page Template**

```markdown
## Product Page Template (Premium)

```mdx
---
title: "Film Faced Plywood Vietnam | Waterproof Concrete Formwork"
description: "Premium film faced plywood. 18mm thickness, waterproof, reusable 20+ times. FSC certified. ISO 9001 factory."
type: "product"
---

<Hero
  title="Film Faced Plywood for Concrete Formwork"
  description="Waterproof, durable, reusable 20+ times. FSC certified manufacturing."
  ctaText="Request Quote"
  ctaLink="/contact"
  image="/images/products/film-faced-hero.jpg"
/>

<SectionWrapper bg="white" padding="md" id="overview">
  <div class="prose prose-lg mx-auto">
    <h2>Premium <Highlight>Waterproof</Highlight> Plywood for Construction</h2>

    <div class="flex flex-wrap gap-3 my-6">
      <FloatingBadge variant="certification" icon="✓">FSC Certified</FloatingBadge>
      <FloatingBadge variant="certification" icon="✓">ISO 9001</FloatingBadge>
      <FloatingBadge variant="feature" icon="💧">Waterproof</FloatingBadge>
    </div>

    <p>
      Our film faced plywood is manufactured specifically for <Highlight variant="accent">concrete formwork applications</Highlight>.
      The phenolic film coating provides excellent water resistance, allowing reuse 20+ times.
    </p>

    <ImageWithFallback
      src="/images/products/film-faced-closeup.webp"
      alt="Film faced plywood surface detail"
      width={800}
      height={600}
    />

    <h3>Key Features</h3>
    <FeatureGrid features={[
      {
        icon: "💪",
        title: "High Strength",
        description: "18mm thickness with poplar/eucalyptus core"
      },
      {
        icon: "💧",
        title: "Waterproof Film",
        description: "Phenolic coating, 120g/m² both sides"
      },
      {
        icon: "♻️",
        title: "Reusable 20+ Times",
        description: "Durable for multiple concrete pours"
      }
    ]} />

    <h3>Technical Specifications</h3>
    <SpecTable specs={[
      { spec: "Thickness", value: "18mm (other sizes available)" },
      { spec: "Size", value: "1220x2440mm standard" },
      { spec: "Film Weight", value: "120g/m² both sides" },
      { spec: "Core", value: "Poplar or Eucalyptus" },
      { spec: "Glue", value: "WBP phenolic" },
      { spec: "Moisture", value: "8-14%" }
    ]} />
  </div>
</SectionWrapper>

<SectionWrapper bg="gradient-subtle" padding="md" id="testimonial">
  <Testimonial
    quote="HCPLY film faced plywood performs excellently on our construction sites. We've achieved 25+ reuses on our latest project."
    author="Mike Johnson"
    role="Site Manager"
    company="BuildCorp Australia"
  />
</SectionWrapper>

<SectionWrapper bg="white" padding="md" id="cta">
  <CTA
    title="Need a Quote?"
    description="Contact us for pricing and specifications."
    ctaText="Request Quote"
    ctaLink="/contact"
  />
</SectionWrapper>
```
```

### Step 4: Add Catalog Reference (5 min)

**4.1 Add reference section to visual-composition-guide.md**

Insert at top of file after title:

```markdown
## Component Reference

For complete component documentation (props, variants, usage rules), refer to:

**Template Component Catalog:** `/Users/david/projects/astro-seo-template/docs/component-catalog.md`

This catalog is the authoritative source for:
- Component props (TypeScript interfaces)
- Available variants (visual options)
- MDX syntax (exact usage)
- Placement rules (where to use)
- Frequency limits (how often)

When generating MDX, always verify component syntax against catalog to ensure correctness.

---
```

### Step 5: Test Rewriter with Premium Components (10 min)

**5.1 Create test prompt**

```bash
cd ~/.claude/skills/ai-content-rewriter
```

Create test: "Generate a homepage for 'Vietnam Bamboo Plywood Co.' — FSC certified, ISO 9001, 5000 CBM/month, exporting to 20 countries. Use premium components."

**5.2 Verify rewriter output includes:**
- Highlight on key phrases (FSC, ISO, capacity)
- FloatingBadge cluster (certifications)
- BentoGrid for featured content
- SectionWrapper with alternating backgrounds
- ImageWithFallback for images

### Step 6: Commit Rewriter Updates (5 min)

```bash
cd ~/.claude/skills/ai-content-rewriter
git add references/*.md
git commit -m "$(cat <<'EOF'
feat: add premium component beautification layer

Updates to visual-composition-guide.md:
- Add Premium Components section (6 new components)
- Highlight usage rules (max 2 per H2, spacing guidelines)
- FloatingBadge placement (certifications, trust, features)
- BentoGrid strategy (homepage/landing only, 1 per page)
- SectionWrapper rhythm (alternating bg pattern)
- ImageWithFallback (prefer over img tag)
- Visual break frequency (every 300-500 words)

Updates to component-usage-matrix.md:
- Add 6 new components to page-type matrix
- Frequency guidelines per page type
- Usage notes for each premium component

Updates to content-structure-templates.md:
- Premium homepage template (full component stack)
- Premium product page template (Highlight, FloatingBadge, ImageWithFallback)

Add component-catalog.md reference:
- Link to template's authoritative catalog
- Instruct to verify syntax against catalog

Rewriter now outputs beautiful MDX automatically using premium patterns.
Template catalog serves as contract for correct component usage.
EOF
)"
```

## Todo List

- [ ] Read current visual-composition-guide.md
- [ ] Add Premium Components section to visual-composition-guide.md
- [ ] Add Highlight usage rules
- [ ] Add FloatingBadge placement rules
- [ ] Add BentoGrid strategy
- [ ] Add SectionWrapper rhythm pattern
- [ ] Add ImageWithFallback preference
- [ ] Add visual break frequency guidelines
- [ ] Read current component-usage-matrix.md
- [ ] Add 6 new components to matrix table
- [ ] Add premium component usage notes
- [ ] Read current content-structure-templates.md
- [ ] Add premium homepage template
- [ ] Add premium product page template
- [ ] Add component catalog reference section
- [ ] Test rewriter with premium component prompt
- [ ] Verify output includes all premium patterns
- [ ] Commit rewriter updates

## Success Criteria

1. **Rewriter skill updated:**
   - visual-composition-guide.md: Premium components documented with usage rules
   - component-usage-matrix.md: 6 new components in matrix
   - content-structure-templates.md: Premium templates added
   - component-catalog.md: Referenced as authoritative source

2. **Beautification rules defined:**
   - Highlight: Max 2 per H2, spacing guidelines
   - FloatingBadge: Max 6 per page, grouping rules
   - BentoGrid: 1 per page, homepage/landing only
   - SectionWrapper: Alternating bg pattern for all sections
   - ImageWithFallback: Always prefer over img
   - Visual breaks: Every 300-500 words

3. **Integration verified:**
   - Test prompt generates MDX with premium components
   - Component syntax matches catalog
   - Frequency rules followed

## Risk Assessment

**Low Risk:**
- Rewriter ignores new components → Mitigated by clear rules, examples, catalog reference
- Rewriter overuses components → Mitigated by explicit frequency limits in guide
- Syntax errors in generated MDX → Mitigated by catalog reference, test prompts

**Mitigation:**
- Test rewriter on 3-4 page types (homepage, product, blog, landing)
- Verify frequency rules respected in output
- Check component syntax against catalog

## Next Steps

After Phase 7 complete:
- **Implementation:** Execute all 7 phases in sequence
- **Testing:** Full site rebuild with regenerated content from rewriter
- **Deployment:** Push template + rewriter updates together
- **Documentation:** Update project README with premium component features

## Unresolved Questions

1. Should rewriter have "beautification level" parameter (minimal, standard, premium)?
   → Not in v1 (keep simple). Premium is new standard. Legacy non-premium still works.
2. Should catalog be copied into rewriter skill directory, or referenced externally?
   → Reference externally (single source of truth). Avoids sync issues.
3. Should rewriter validate generated MDX against catalog schema?
   → Out of scope for Phase 7. Could be future enhancement (schema validation tool).
