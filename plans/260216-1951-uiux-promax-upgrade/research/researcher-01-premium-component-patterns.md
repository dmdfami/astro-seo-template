# Premium Component Patterns Research
**Date:** 2026-02-16
**Researcher:** researcher-01
**Context:** astro-seo-template UI/UX Pro Max upgrade

---

## 1. Gradient Text Highlights (Tailwind 4)

**Core technique:** `bg-clip-text` + `text-transparent` + gradient utilities

```html
<!-- Basic gradient text -->
<h1 class="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400
           inline-block text-transparent bg-clip-text">
  Premium Plywood Solutions
</h1>

<!-- Multi-stop gradient for richer effect -->
<span class="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-400
             text-transparent bg-clip-text font-bold">
  ISO Certified
</span>
```

**Key classes:**
- `bg-clip-text` - clips background to text shape
- `text-transparent` - makes text color transparent
- `inline-block` - required for proper rendering
- Gradient: `bg-gradient-to-r/l/t/b` + `from-{color}` + `via-{color}` + `to-{color}`

**Animated variant (CSS-only):**
```html
<!-- Add to global.css -->
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.gradient-text-animated {
  background-size: 200% auto;
  animation: gradient-shift 3s ease infinite;
}
```

**Best use cases:**
- Hero headlines
- Section titles
- Key stats/numbers
- CTA text highlights

**Note:** No `text-fill-color` needed - modern approach uses `background-clip: text` + `color: transparent`

---

## 2. Bento Grid Patterns (CSS Grid, No JS)

**2026 stack:** CSS Grid + Subgrid + Container Queries

```html
<!-- Responsive bento grid with variable spans -->
<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
  <!-- Large feature card -->
  <div class="col-span-1 md:col-span-2 lg:col-span-2 row-span-2
              bg-gradient-to-br from-emerald-50 to-teal-100
              rounded-2xl p-6">
    <h3>Large Feature</h3>
  </div>

  <!-- Standard cards -->
  <div class="col-span-1 row-span-1 bg-white rounded-xl p-4">
    <p>Stat 1</p>
  </div>

  <div class="col-span-1 row-span-1 bg-white rounded-xl p-4">
    <p>Stat 2</p>
  </div>

  <!-- Wide card -->
  <div class="col-span-1 md:col-span-2 row-span-1
              bg-gradient-to-r from-blue-50 to-cyan-50
              rounded-xl p-4">
    <p>Wide feature</p>
  </div>

  <!-- Tall card -->
  <div class="col-span-1 row-span-2 bg-white rounded-xl p-4">
    <p>Tall feature</p>
  </div>
</div>
```

**Key utilities:**
- `grid-cols-{n}` - base grid columns
- `col-span-{n}` - span multiple columns
- `row-span-{n}` - span multiple rows
- `auto-rows-[200px]` - set minimum row height
- `gap-{n}` - grid gap

**Subgrid for aligned content (Tailwind 4+):**
```html
<div class="grid grid-cols-3 gap-4">
  <div class="grid grid-rows-subgrid row-span-3">
    <!-- Child elements align with parent grid -->
  </div>
</div>
```

**Container queries for responsive cells:**
```css
/* global.css */
@container (min-width: 400px) {
  .bento-card { grid-column: span 2; }
}
```

**Responsive breakpoint strategy:**
- Mobile: 1 column, vertical stack
- Tablet: 3 columns, `col-span-2` for featured
- Desktop: 4 columns, `col-span-2` + `row-span-2` for hero cards

---

## 3. Image Fallback/Placeholder (Astro 5)

**Built-in Picture component with fallback:**
```astro
---
import { Picture } from 'astro:assets';
import fallbackImg from '../assets/placeholder-product.png';
---

<Picture
  src={product.image || fallbackImg}
  formats={['avif', 'webp']}
  fallbackFormat="png"
  alt={product.title}
  widths={[400, 800, 1200]}
  loading="lazy"
  class="w-full h-auto"
/>
```

**CSS skeleton loading (no JS):**
```html
<!-- Skeleton wrapper -->
<div class="relative overflow-hidden bg-gray-100 rounded-lg">
  <!-- Shimmer effect -->
  <div class="absolute inset-0 bg-gradient-to-r
              from-gray-100 via-gray-50 to-gray-100
              animate-shimmer"></div>

  <img
    src={imageUrl}
    alt={alt}
    class="relative z-10"
    loading="lazy"
  />
</div>
```

```css
/* global.css */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
  background-size: 200% 100%;
}
```

**Unpic low-res placeholder (blurred background):**
```astro
---
import { Image } from '@unpic/astro';
---

<Image
  src={product.image}
  layout="constrained"
  width={800}
  height={600}
  background="auto"
  alt={product.title}
/>
```

**Fallback hierarchy:**
1. Remote image URL (try first)
2. Local fallback image (if remote fails)
3. SVG placeholder icon (if both fail)
4. Skeleton shimmer (while loading)

---

## 4. Section Alternating Backgrounds (Visual Rhythm)

**Pattern strategy:** Alternate neutral + branded gradients every 2-3 sections

```html
<!-- Section 1: White background -->
<section class="py-16 bg-white">
  <div class="container mx-auto px-4">
    <!-- Content -->
  </div>
</section>

<!-- Section 2: Subtle gradient -->
<section class="py-16 bg-gradient-to-b from-emerald-50 to-white">
  <div class="container mx-auto px-4">
    <!-- Content -->
  </div>
</section>

<!-- Section 3: Gray background -->
<section class="py-16 bg-gray-50">
  <div class="container mx-auto px-4">
    <!-- Content -->
  </div>
</section>

<!-- Section 4: Branded gradient -->
<section class="py-16 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
  <div class="container mx-auto px-4">
    <!-- Content -->
  </div>
</section>
```

**2026 gradient trends:**
- Soft fades for mood-setting (not sharp contrast)
- Chromatic transitions for emotional continuity
- Layered gradients with patterns as brand elements

**Visual break frequency:**
- Every 300-500 words for long content
- Alternate: white → gradient → gray → gradient
- Use spacing (`py-16`, `py-20`, `py-24`) to establish rhythm

**Pattern overlays:**
```html
<section class="relative py-16 bg-emerald-50">
  <!-- Subtle pattern overlay -->
  <div class="absolute inset-0 opacity-5"
       style="background-image: url('/patterns/dots.svg');">
  </div>

  <div class="relative z-10 container mx-auto px-4">
    <!-- Content above pattern -->
  </div>
</section>
```

---

## 5. Premium MDX Components (B2B Industrial)

### A. Trust Badge Component
```astro
---
// src/components/mdx/TrustBadge.astro
const { icon, label, value } = Astro.props;
---

<div class="inline-flex items-center gap-2 px-4 py-2
            bg-gradient-to-r from-emerald-50 to-teal-50
            border border-emerald-200 rounded-full">
  <span class="text-emerald-600">{icon}</span>
  <div class="text-sm">
    <div class="font-semibold text-gray-900">{value}</div>
    <div class="text-gray-600">{label}</div>
  </div>
</div>
```

**MDX usage:**
```mdx
<TrustBadge
  icon="✓"
  label="ISO Certified"
  value="ISO 9001:2015"
/>
```

### B. Floating Stats Counter
```astro
---
// src/components/mdx/FloatingStats.astro
const { stats } = Astro.props; // Array of {value, label}
---

<div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
  {stats.map(stat => (
    <div class="relative group">
      <!-- Floating effect on hover -->
      <div class="p-6 bg-white rounded-xl border border-gray-200
                  shadow-sm hover:shadow-lg
                  transition-all duration-300
                  hover:-translate-y-1">
        <div class="text-3xl font-bold
                    bg-gradient-to-r from-emerald-600 to-teal-600
                    text-transparent bg-clip-text">
          {stat.value}
        </div>
        <div class="text-sm text-gray-600 mt-1">
          {stat.label}
        </div>
      </div>

      <!-- Gradient glow on hover -->
      <div class="absolute inset-0 -z-10
                  bg-gradient-to-r from-emerald-200 to-teal-200
                  rounded-xl blur-xl opacity-0
                  group-hover:opacity-30
                  transition-opacity duration-300">
      </div>
    </div>
  ))}
</div>
```

### C. Feature Grid with Icons
```astro
---
// src/components/mdx/FeatureGrid.astro
const { features } = Astro.props; // [{icon, title, description}]
---

<div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
  {features.map(feature => (
    <div class="p-6 bg-gradient-to-br from-white to-gray-50
                rounded-2xl border border-gray-200">
      <!-- Icon container with gradient -->
      <div class="w-12 h-12 rounded-lg
                  bg-gradient-to-br from-emerald-500 to-teal-500
                  flex items-center justify-center
                  text-white text-2xl mb-4">
        {feature.icon}
      </div>

      <h3 class="text-xl font-bold text-gray-900 mb-2">
        {feature.title}
      </h3>

      <p class="text-gray-600">
        {feature.description}
      </p>
    </div>
  ))}
</div>
```

### D. Compliance Badge Row
```astro
---
// src/components/mdx/ComplianceBadges.astro
const { badges } = Astro.props; // ["ISO 9001", "FSC", "CE"]
---

<div class="flex flex-wrap gap-3 justify-center my-8">
  {badges.map(badge => (
    <div class="px-4 py-2
                bg-white border-2 border-emerald-600
                rounded-lg font-semibold text-emerald-700
                hover:bg-emerald-50 transition-colors">
      {badge}
    </div>
  ))}
</div>
```

### E. Quote/Testimonial with Floating Avatar
```astro
---
// src/components/mdx/Testimonial.astro
const { quote, author, role, avatar } = Astro.props;
---

<div class="relative my-12 p-8
            bg-gradient-to-br from-emerald-50 to-teal-50
            rounded-2xl border border-emerald-100">
  <!-- Quote icon -->
  <div class="absolute top-4 left-4 text-6xl text-emerald-200">
    "
  </div>

  <blockquote class="relative z-10 text-lg text-gray-700 italic mb-4">
    {quote}
  </blockquote>

  <div class="flex items-center gap-3">
    {avatar && (
      <img
        src={avatar}
        alt={author}
        class="w-12 h-12 rounded-full border-2 border-white shadow-lg"
      />
    )}
    <div>
      <div class="font-bold text-gray-900">{author}</div>
      <div class="text-sm text-gray-600">{role}</div>
    </div>
  </div>
</div>
```

---

## Implementation Recommendations

**Phase 1: Foundation (Drop dark mode)**
- Remove all `dark:` prefixes from existing components
- Simplify Tailwind config (no dark mode variant)
- Focus on light theme with subtle gradients

**Phase 2: Component library**
- Build 7-10 MDX components (TrustBadge, FloatingStats, FeatureGrid, etc.)
- Document in `docs/component-catalog.md` with API + usage examples
- Auto-import via `astro.config.mjs` MDX integration

**Phase 3: Visual rhythm system**
- Define section background pattern (white → gradient → gray → gradient)
- Add spacing tokens (`py-16`, `py-20`, `py-24`)
- Implement pattern overlays for branded sections

**Phase 4: Image fallback system**
- Create fallback images for each content type (product, blog, gallery)
- Implement skeleton shimmer CSS animation
- Use Astro Picture component with format fallbacks

**Phase 5: Bento grids**
- Homepage: 4-column bento with 2x2 hero card
- Product listings: 3-column with featured products spanning 2 columns
- Use `auto-rows-[200px]` for consistent height baseline

**Token efficiency notes:**
- CSS-only solutions (no JS bundles)
- Tailwind utility classes (no custom CSS files per component)
- Astro Picture for optimized image delivery
- Gradient text for premium feel without image assets

---

## Unresolved Questions

1. **Brand gradient colors** - Need design-tokens.json update with primary/secondary gradient stops?
2. **Pattern SVG assets** - Should we generate dot/line patterns or use CSS-only solutions?
3. **Subgrid browser support** - Do we need fallback for older browsers (site analytics needed)?
4. **Component frequency rules** - How often can FloatingStats appear in single page without repetition fatigue?
5. **Image optimization settings** - What's optimal widths array for Picture component based on site analytics?

---

## Sources

- [How To Create Gradient Text with Tailwind](https://codecourse.com/articles/how-to-create-gradient-text-with-tailwind)
- [Text Gradients in Tailwind v4 Using Functional Utilities](https://www.kylegoggin.com/blog/text-gradients-in-tailwind-v4/)
- [Tailwind CSS Official Bento Grids](https://tailwindcss.com/plus/ui-blocks/marketing/sections/bento-grids)
- [Build a bento layout with CSS grid](https://iamsteve.me/blog/bento-layout-css-grid)
- [Bento Grid Design: Modular Hierarchy For Conversion In 2026](https://inkbotdesign.com/bento-grid-design/)
- [Images - Astro Docs](https://docs.astro.build/en/guides/images/)
- [Zero javascript progressive loading with Astro](https://codehater.blog/articles/zero-js-progressive-loading/)
- [@unpic/astro Documentation](https://unpic.pics/img/astro/)
- [How Repetition, Pattern, and Rhythm Work in Design](https://arounda.agency/blog/how-repetition-pattern-and-rhythm-work-in-design)
- [Top 20 Graphic Design Trends For 2026](https://digitalsynopsis.com/design/graphic-design-trends-2026/)
- [Top B2B SaaS Website Examples 2026](https://www.vezadigital.com/post/best-b2b-saas-websites-2026)
- [20 Best Industrial Website Design for B2B Growth](https://pentaclay.com/blog/20-best-industrial-website-design-for-b2b-growth-in-2025)
- [B2B Web Design Trends 2026](https://www.windmillstrategy.com/top-9-b2b-web-design-trends/)
