# Phase 3: 5 New Premium Components

**Date:** 2026-02-16
**Priority:** P1 (Core Features)
**Status:** ✅ Complete
**Effort:** 3h

## Context Links

- Parent plan: [plan.md](plan.md)
- Previous phase: [phase-02-design-token-upgrade.md](phase-02-design-token-upgrade.md)
- Research: [researcher-01-premium-component-patterns.md](research/researcher-01-premium-component-patterns.md)

## Overview

Build 5 new MDX components for premium UI patterns: Highlight (gradient text), FloatingBadge (pill badges), BentoGrid/BentoItem (CSS Grid layouts), SectionWrapper (alternating backgrounds), ImageWithFallback (skeleton loading). All use design tokens, zero hardcoded brand values. Auto-import via astro.config.mjs.

**Why third:** New components use gradient text tokens from Phase 2. Must exist before upgrading existing components (Phase 4) that will reference them.

## Key Insights

- **Gradient text technique:** `bg-clip-text` + `text-transparent` + `bg-gradient-to-r` (Tailwind 4 native)
- **Bento grid pattern:** CSS Grid with `col-span-{n}` + `row-span-{n}`, `auto-rows-[200px]` for min height
- **Section alternation:** Logic can be manual (MDX author choice) or auto (SectionWrapper tracks index)
- **Image fallback hierarchy:** Remote URL → Local fallback → SVG placeholder → Skeleton shimmer
- **Floating effect:** `hover:-translate-y-1` + `transition-transform` + optional glow via ::before pseudo-element
- **All CSS-only:** No JS bundles, pure Tailwind + CSS animations

## Requirements

### Functional
1. **Highlight** component renders gradient text on inline keywords
2. **FloatingBadge** component renders pill badge with 3 variants (certification, trust, feature)
3. **BentoGrid** + **BentoItem** components render responsive CSS Grid layouts
4. **SectionWrapper** component wraps content with alternating bg colors and consistent padding
5. **ImageWithFallback** component shows skeleton shimmer while loading, fallback on error
6. All 5 registered in astro.config.mjs mdx.components auto-import
7. All components work in any MDX content type (landing, blog, product, etc.)

### Non-Functional
1. Zero hardcoded brand values — all colors via design tokens
2. CSS-only effects (no JS bundles for visual effects)
3. Accessible (WCAG AA contrast, keyboard navigable)
4. Responsive (mobile-first, 375px → 1440px tested)
5. Type-safe props (TypeScript interfaces)

## Architecture

### Component Specifications

#### 1. Highlight.astro
**Purpose:** Gradient text highlight for keywords (certifications, features, numbers)

**Props:**
```typescript
interface Props {
  variant?: 'primary' | 'teal-blue' | 'accent'; // default: 'primary'
}
```

**MDX Usage:**
```mdx
We offer <Highlight>FSC Certified</Highlight> plywood with <Highlight variant="teal-blue">ISO 9001:2015</Highlight> compliance.
```

**Implementation:**
```astro
---
const { variant = 'primary' } = Astro.props;
const gradientClass = {
  'primary': 'bg-[image:var(--gradient-text-primary)]',
  'teal-blue': 'bg-[image:var(--gradient-text-teal-blue)]',
  'accent': 'bg-[image:var(--gradient-text-accent)]'
}[variant];
---
<span class={`${gradientClass} inline-block text-transparent bg-clip-text font-semibold`}>
  <slot />
</span>
```

#### 2. FloatingBadge.astro
**Purpose:** Pill badge with icon, floating hover effect

**Props:**
```typescript
interface Props {
  variant?: 'certification' | 'trust' | 'feature'; // default: 'feature'
  icon?: string; // emoji or text
}
```

**MDX Usage:**
```mdx
<FloatingBadge variant="certification" icon="✓">ISO 9001:2015</FloatingBadge>
<FloatingBadge variant="trust" icon="⭐">10+ Years Experience</FloatingBadge>
```

**Implementation:**
```astro
---
const { variant = 'feature', icon } = Astro.props;
const variantClasses = {
  certification: 'bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200 text-primary-700',
  trust: 'bg-gradient-to-r from-secondary-50 to-secondary-100 border-secondary-200 text-secondary-700',
  feature: 'bg-gradient-to-r from-accent-50 to-accent-100 border-accent-200 text-accent-700'
}[variant];
---
<div class={`inline-flex items-center gap-2 px-4 py-2 ${variantClasses}
             border rounded-full shadow-sm
             hover:shadow-md hover:-translate-y-0.5
             transition-all duration-300 cursor-default`}>
  {icon && <span class="text-lg" aria-hidden="true">{icon}</span>}
  <span class="text-sm font-semibold"><slot /></span>
</div>
```

#### 3. BentoGrid.astro + BentoItem.astro
**Purpose:** Responsive CSS Grid with flexible cell sizes

**BentoGrid Props:**
```typescript
interface Props {
  cols?: 2 | 3 | 4; // default: 3
  gap?: 'sm' | 'md' | 'lg'; // default: 'md'
}
```

**BentoItem Props:**
```typescript
interface Props {
  span?: 1 | 2; // column span, default: 1
  rowSpan?: 1 | 2; // row span, default: 1
  class?: string; // additional classes
}
```

**MDX Usage:**
```mdx
<BentoGrid cols={4} gap="lg">
  <BentoItem span={2} rowSpan={2}>
    ## Featured Product
    Large hero card
  </BentoItem>
  <BentoItem>Standard card 1</BentoItem>
  <BentoItem>Standard card 2</BentoItem>
  <BentoItem span={2}>Wide card</BentoItem>
</BentoGrid>
```

**BentoGrid Implementation:**
```astro
---
const { cols = 3, gap = 'md' } = Astro.props;
const gapClass = { sm: 'gap-3', md: 'gap-4', lg: 'gap-6' }[gap];
const colsClass = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
}[cols];
---
<div class={`grid ${colsClass} ${gapClass} auto-rows-[200px] my-8`}>
  <slot />
</div>
```

**BentoItem Implementation:**
```astro
---
const { span = 1, rowSpan = 1, class: additionalClass = '' } = Astro.props;
const spanClass = span > 1 ? `md:col-span-${span}` : 'col-span-1';
const rowSpanClass = rowSpan > 1 ? `row-span-${rowSpan}` : 'row-span-1';
---
<div class={`${spanClass} ${rowSpanClass} ${additionalClass}
             bg-white rounded-2xl border border-neutral-200
             p-6 flex flex-col justify-between
             hover:shadow-lg transition-shadow duration-300`}>
  <slot />
</div>
```

#### 4. SectionWrapper.astro
**Purpose:** Alternating section backgrounds with consistent padding

**Props:**
```typescript
interface Props {
  bg?: 'white' | 'light' | 'gradient' | 'gradient-subtle'; // default: 'white'
  padding?: 'sm' | 'md' | 'lg'; // default: 'md'
  id?: string; // for anchor links
  class?: string; // additional classes
}
```

**MDX Usage:**
```mdx
<SectionWrapper bg="white" padding="lg" id="features">
  ## Features content
</SectionWrapper>

<SectionWrapper bg="gradient-subtle" padding="md">
  ## Testimonials
</SectionWrapper>
```

**Implementation:**
```astro
---
const { bg = 'white', padding = 'md', id, class: additionalClass = '' } = Astro.props;

const bgClass = {
  white: 'bg-white',
  light: 'bg-neutral-50',
  gradient: 'bg-gradient-to-b from-primary-50 via-white to-primary-50',
  'gradient-subtle': 'bg-gradient-to-br from-primary-50 to-secondary-50'
}[bg];

const paddingClass = {
  sm: 'py-16',
  md: 'py-20 md:py-24',
  lg: 'py-24 md:py-32'
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

#### 5. ImageWithFallback.astro
**Purpose:** Image with skeleton shimmer loading state and error fallback

**Props:**
```typescript
interface Props {
  src: string; // image URL
  alt: string; // required for a11y
  width?: number;
  height?: number;
  fallback?: string; // fallback image path
  class?: string;
}
```

**MDX Usage:**
```mdx
<ImageWithFallback
  src="/images/products/bintangor-plywood.webp"
  alt="Bintangor plywood sheets"
  width={800}
  height={600}
  fallback="/images/fallback-product.svg"
/>
```

**Implementation:**
```astro
---
const { src, alt, width, height, fallback = '/images/fallback-placeholder.svg', class: additionalClass = '' } = Astro.props;
---
<div class={`relative overflow-hidden bg-neutral-100 rounded-lg ${additionalClass}`}>
  <!-- Skeleton shimmer background -->
  <div class="absolute inset-0 bg-gradient-to-r from-neutral-100 via-neutral-50 to-neutral-100
              animate-shimmer bg-[length:200%_100%]" aria-hidden="true"></div>

  <!-- Image -->
  <img
    src={src}
    alt={alt}
    width={width}
    height={height}
    loading="lazy"
    class="relative z-10 w-full h-full object-cover"
    onerror={`this.onerror=null; this.src='${fallback}';`}
  />
</div>
```

**Add to global.css:**
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-shimmer {
  animation: shimmer 2s infinite linear;
}
```

## Related Code Files

```
src/
├── components/
│   └── mdx/
│       ├── Highlight.astro              # CREATE
│       ├── FloatingBadge.astro          # CREATE
│       ├── BentoGrid.astro              # CREATE
│       ├── BentoItem.astro              # CREATE
│       ├── SectionWrapper.astro         # CREATE
│       └── ImageWithFallback.astro      # CREATE
├── styles/
│   └── global.css                       # UPDATE: add shimmer animation
└── astro.config.mjs                     # UPDATE: register 5 new components
```

## Implementation Steps

### Step 1: Create Highlight Component (15 min)

**1.1 Create component file**
```bash
touch src/components/mdx/Highlight.astro
```

**1.2 Implement Highlight.astro**
```astro
---
interface Props {
  variant?: 'primary' | 'teal-blue' | 'accent';
}

const { variant = 'primary' } = Astro.props;

const gradientClass = {
  'primary': 'bg-[image:var(--gradient-text-primary)]',
  'teal-blue': 'bg-[image:var(--gradient-text-teal-blue)]',
  'accent': 'bg-[image:var(--gradient-text-accent)]'
}[variant];
---

<span
  class={`${gradientClass} inline-block text-transparent bg-clip-text font-semibold`}
>
  <slot />
</span>
```

**1.3 Test in dev server**
Create test MDX file `src/content/pages/test-highlight.mdx`:
```mdx
---
title: "Test Highlight"
---

Testing <Highlight>default primary</Highlight> gradient.

Testing <Highlight variant="teal-blue">teal to blue</Highlight> gradient.

Testing <Highlight variant="accent">accent</Highlight> gradient.
```

```bash
npm run dev
# Navigate to /test-highlight
```

### Step 2: Create FloatingBadge Component (20 min)

**2.1 Create component file**
```bash
touch src/components/mdx/FloatingBadge.astro
```

**2.2 Implement FloatingBadge.astro**
```astro
---
interface Props {
  variant?: 'certification' | 'trust' | 'feature';
  icon?: string;
}

const { variant = 'feature', icon } = Astro.props;

const variantClasses = {
  certification: 'bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200 text-primary-700',
  trust: 'bg-gradient-to-r from-secondary-50 to-secondary-100 border-secondary-200 text-secondary-700',
  feature: 'bg-gradient-to-r from-accent-50 to-accent-100 border-accent-200 text-accent-700'
}[variant];
---

<div
  class={`inline-flex items-center gap-2 px-4 py-2 ${variantClasses}
          border rounded-full shadow-sm
          hover:shadow-md hover:-translate-y-0.5
          transition-all duration-300 cursor-default`}
>
  {icon && <span class="text-lg" aria-hidden="true">{icon}</span>}
  <span class="text-sm font-semibold">
    <slot />
  </span>
</div>
```

**2.3 Test variants**
Add to test MDX:
```mdx
<FloatingBadge variant="certification" icon="✓">ISO 9001:2015</FloatingBadge>
<FloatingBadge variant="trust" icon="⭐">10+ Years</FloatingBadge>
<FloatingBadge variant="feature" icon="🚀">Fast Shipping</FloatingBadge>
```

### Step 3: Create BentoGrid Components (30 min)

**3.1 Create BentoGrid.astro**
```bash
touch src/components/mdx/BentoGrid.astro
```

```astro
---
interface Props {
  cols?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

const { cols = 3, gap = 'md' } = Astro.props;

const gapClass = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6'
}[gap];

const colsClass = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
}[cols];
---

<div class={`grid ${colsClass} ${gapClass} auto-rows-[200px] my-8`}>
  <slot />
</div>
```

**3.2 Create BentoItem.astro**
```bash
touch src/components/mdx/BentoItem.astro
```

```astro
---
interface Props {
  span?: 1 | 2;
  rowSpan?: 1 | 2;
  class?: string;
}

const { span = 1, rowSpan = 1, class: additionalClass = '' } = Astro.props;

const spanClass = span > 1 ? `md:col-span-${span}` : 'col-span-1';
const rowSpanClass = rowSpan > 1 ? `row-span-${rowSpan}` : 'row-span-1';
---

<div
  class={`${spanClass} ${rowSpanClass} ${additionalClass}
          bg-white rounded-2xl border border-neutral-200
          p-6 flex flex-col justify-between
          hover:shadow-lg transition-shadow duration-300`}
>
  <slot />
</div>
```

**3.3 Test BentoGrid**
Add to test MDX:
```mdx
<BentoGrid cols={3} gap="md">
  <BentoItem span={2} rowSpan={2}>
    <h3>Large Feature</h3>
    <p>Spans 2 columns and 2 rows</p>
  </BentoItem>
  <BentoItem>Card 1</BentoItem>
  <BentoItem>Card 2</BentoItem>
  <BentoItem span={2}>Wide Card</BentoItem>
  <BentoItem>Card 3</BentoItem>
</BentoGrid>
```

### Step 4: Create SectionWrapper Component (25 min)

**4.1 Create component file**
```bash
touch src/components/mdx/SectionWrapper.astro
```

**4.2 Implement SectionWrapper.astro**
```astro
---
interface Props {
  bg?: 'white' | 'light' | 'gradient' | 'gradient-subtle';
  padding?: 'sm' | 'md' | 'lg';
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
  sm: 'py-16',
  md: 'py-20 md:py-24',
  lg: 'py-24 md:py-32'
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

**4.3 Test alternating sections**
Add to test MDX:
```mdx
<SectionWrapper bg="white" padding="md" id="section1">
  <h2>Section 1 - White</h2>
</SectionWrapper>

<SectionWrapper bg="gradient-subtle" padding="md" id="section2">
  <h2>Section 2 - Gradient</h2>
</SectionWrapper>

<SectionWrapper bg="light" padding="lg" id="section3">
  <h2>Section 3 - Light Grey</h2>
</SectionWrapper>
```

### Step 5: Create ImageWithFallback Component (30 min)

**5.1 Add shimmer animation to global.css**
Edit `src/styles/global.css`, add after line 65 (after stagger animations):
```css
/* Shimmer loading animation for images */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-shimmer {
  animation: shimmer 2s infinite linear;
}
```

**5.2 Create fallback placeholder SVG**
```bash
mkdir -p public/images
```

Create `public/images/fallback-placeholder.svg`:
```svg
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f5f5f4"/>
  <text x="50%" y="50%" font-family="system-ui" font-size="24" fill="#a8a29e"
        text-anchor="middle" dominant-baseline="middle">
    Image unavailable
  </text>
</svg>
```

**5.3 Create component file**
```bash
touch src/components/mdx/ImageWithFallback.astro
```

**5.4 Implement ImageWithFallback.astro**
```astro
---
interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fallback?: string;
  class?: string;
}

const {
  src,
  alt,
  width,
  height,
  fallback = '/images/fallback-placeholder.svg',
  class: additionalClass = ''
} = Astro.props;
---

<div class={`relative overflow-hidden bg-neutral-100 rounded-lg ${additionalClass}`}>
  <!-- Skeleton shimmer background -->
  <div
    class="absolute inset-0 bg-gradient-to-r from-neutral-100 via-neutral-50 to-neutral-100
           animate-shimmer bg-[length:200%_100%]"
    aria-hidden="true"
  >
  </div>

  <!-- Image -->
  <img
    src={src}
    alt={alt}
    width={width}
    height={height}
    loading="lazy"
    class="relative z-10 w-full h-full object-cover"
    onerror={`this.onerror=null; this.src='${fallback}';`}
  />
</div>
```

**5.5 Test with broken image**
Add to test MDX:
```mdx
<ImageWithFallback
  src="https://fake-url.com/broken-image.jpg"
  alt="This should show fallback"
  width={800}
  height={600}
/>
```

### Step 6: Register Components in astro.config.mjs (10 min)

**6.1 Edit astro.config.mjs**
Find the MDX integration section (around line 15-30), update components object:
```js
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [
    mdx({
      remarkPlugins: [/* ... */],
      rehypePlugins: [/* ... */],
      components: {
        // ... existing components ...

        // New premium components
        Highlight: './src/components/mdx/Highlight.astro',
        FloatingBadge: './src/components/mdx/FloatingBadge.astro',
        BentoGrid: './src/components/mdx/BentoGrid.astro',
        BentoItem: './src/components/mdx/BentoItem.astro',
        SectionWrapper: './src/components/mdx/SectionWrapper.astro',
        ImageWithFallback: './src/components/mdx/ImageWithFallback.astro',
      }
    }),
    // ... other integrations ...
  ]
});
```

**Alternative (if using auto-import plugin):**
If astro.config.mjs uses auto-import from `src/components/mdx/*.astro`, verify new files are detected:
```bash
npm run dev
# Check terminal output for "Auto-imported 52 MDX components"
```

### Step 7: Integration Testing (20 min)

**7.1 Create comprehensive test page**
Create `src/content/pages/premium-components-test.mdx`:
```mdx
---
title: "Premium Components Test"
description: "Testing all 5 new premium components"
---

# Premium Components Test

## Highlight Component

We offer <Highlight>FSC Certified</Highlight> plywood with <Highlight variant="teal-blue">ISO 9001:2015</Highlight> compliance and <Highlight variant="accent">fast delivery</Highlight>.

## FloatingBadge Component

<FloatingBadge variant="certification" icon="✓">ISO 9001:2015</FloatingBadge>
<FloatingBadge variant="trust" icon="⭐">10+ Years Experience</FloatingBadge>
<FloatingBadge variant="feature" icon="🚀">Global Shipping</FloatingBadge>

## BentoGrid Component

<BentoGrid cols={3} gap="md">
  <BentoItem span={2} rowSpan={2}>
    ### Large Featured Card
    This spans 2 columns and 2 rows
  </BentoItem>
  <BentoItem>
    ### Card 1
    Standard size
  </BentoItem>
  <BentoItem>
    ### Card 2
    Standard size
  </BentoItem>
  <BentoItem span={2}>
    ### Wide Card
    Spans 2 columns
  </BentoItem>
</BentoGrid>

## SectionWrapper Component

<SectionWrapper bg="white" padding="md">
  ### Section 1 - White Background
  This section has white background with medium padding.
</SectionWrapper>

<SectionWrapper bg="gradient-subtle" padding="md">
  ### Section 2 - Gradient Background
  This section has subtle gradient background.
</SectionWrapper>

<SectionWrapper bg="light" padding="lg">
  ### Section 3 - Light Grey Background
  This section has light grey background with large padding.
</SectionWrapper>

## ImageWithFallback Component

<ImageWithFallback
  src="/images/uploads/image-v1w/banner/vietnam-plywood-export-banner-hcply-homepage-hero-image-011.webp"
  alt="Vietnam plywood banner"
  width={800}
  height={400}
/>
```

**7.2 Visual test in browser**
```bash
npm run dev
# Navigate to /premium-components-test
```

Verify:
- **Highlight:** Gradient text visible, 3 variants distinct
- **FloatingBadge:** Pills render correctly, hover effect works, icons display
- **BentoGrid:** Grid layout responsive, spans work correctly
- **SectionWrapper:** Alternating backgrounds visible, padding consistent
- **ImageWithFallback:** Image loads with shimmer effect

**7.3 Responsive test**
Use browser DevTools responsive mode:
- 375px (mobile): BentoGrid stacks vertically
- 768px (tablet): BentoGrid shows 2 columns
- 1024px (desktop): BentoGrid shows 3-4 columns

**7.4 Accessibility test**
```bash
# Check with browser Lighthouse
# Verify:
# - Gradient text has sufficient contrast with background
# - Images have alt text
# - Keyboard navigation works for interactive elements
```

### Step 8: Build Verification (10 min)

**8.1 Production build**
```bash
npm run build
```

Verify:
- 0 errors
- 0 warnings about missing components
- Test page builds successfully

**8.2 Check bundle size**
```bash
ls -lh dist/_astro/*.css
# CSS should be similar size (~30-40kb), no significant increase
```

**8.3 Preview build**
```bash
npm run preview
```

Test /premium-components-test page in production build.

### Step 9: Commit Components (10 min)

```bash
git add src/components/mdx/{Highlight,FloatingBadge,BentoGrid,BentoItem,SectionWrapper,ImageWithFallback}.astro
git add src/styles/global.css
git add astro.config.mjs
git add public/images/fallback-placeholder.svg
git commit -m "$(cat <<'EOF'
feat: add 5 premium MDX components

New components:
- Highlight: Gradient text keyword highlights (3 variants)
- FloatingBadge: Pill badges with hover effects (certification, trust, feature)
- BentoGrid + BentoItem: Responsive CSS Grid layouts with flexible spans
- SectionWrapper: Alternating section backgrounds with consistent padding
- ImageWithFallback: Skeleton shimmer loading + error fallback handling

Features:
- All use design token CSS variables (zero hardcoded brand values)
- CSS-only effects (no JS bundles)
- Responsive mobile-first design
- WCAG AA accessible
- Auto-imported via astro.config.mjs

Test page: /premium-components-test
EOF
)"
```

## Todo List

- [ ] Create Highlight.astro
- [ ] Test Highlight variants (primary, teal-blue, accent)
- [ ] Create FloatingBadge.astro
- [ ] Test FloatingBadge variants (certification, trust, feature)
- [ ] Create BentoGrid.astro
- [ ] Create BentoItem.astro
- [ ] Test BentoGrid responsive behavior
- [ ] Create SectionWrapper.astro
- [ ] Test SectionWrapper alternating backgrounds
- [ ] Add shimmer animation to global.css
- [ ] Create fallback placeholder SVG
- [ ] Create ImageWithFallback.astro
- [ ] Test ImageWithFallback with broken image URL
- [ ] Register all 5 components in astro.config.mjs
- [ ] Create comprehensive test page (premium-components-test.mdx)
- [ ] Visual test all components in browser
- [ ] Responsive test (375px, 768px, 1024px)
- [ ] Accessibility test (Lighthouse, keyboard nav)
- [ ] Run npm run build (verify 0 errors)
- [ ] Commit changes

## Success Criteria

1. **All 5 components implemented:**
   - Highlight: Gradient text with 3 variants
   - FloatingBadge: Pill badges with 3 variants + hover effect
   - BentoGrid + BentoItem: CSS Grid with flexible spans
   - SectionWrapper: 4 background options, 3 padding sizes
   - ImageWithFallback: Shimmer + fallback handling

2. **Components functional in MDX:**
   - Auto-imported via astro.config.mjs
   - Work in any content type (landing, blog, product, etc.)
   - Props validated, TypeScript interfaces defined

3. **Build quality:**
   - npm run build: 0 errors
   - Test page renders correctly
   - CSS bundle size minimal increase (<5kb)
   - Lighthouse: Performance 90+, Accessibility 95+

## Risk Assessment

**Low Risk:**
- Gradient text browser support → Modern CSS widely supported (2024+)
- BentoGrid col-span safelist → Tailwind 4 includes all span variants
- Image onerror inline script → Standard HTML, no CSP issues

**Medium Risk:**
- Shimmer animation performance → CSS-only, GPU-accelerated, should be fine
- BentoGrid auto-rows height → May need adjustment per design, test with real content

**Mitigation:**
- Test gradient text in Safari, Firefox, Chrome
- Verify BentoGrid with various content lengths
- Test shimmer on low-end devices (throttle CPU in DevTools)

## Next Steps

After Phase 3 complete:
- **Phase 4:** Upgrade 47 existing components to use these premium patterns (Tier 1 components can use Highlight, FloatingBadge in content)
- **Phase 6:** Document all 52 components (47 existing + 5 new) in component-catalog.md

## Unresolved Questions

1. Should BentoItem have default min-height for empty cards, or rely on parent auto-rows?
   → Use parent auto-rows-[200px], BentoItem inherits min-height from grid
2. Should SectionWrapper auto-alternate (track global index) or stay manual (author choice)?
   → Stay manual for v1. Auto-alternation can be added later as opt-in feature
3. Should ImageWithFallback use Astro Picture component for optimization?
   → No, keep simple for v1. Picture integration can be Phase 4 enhancement for existing Image components
