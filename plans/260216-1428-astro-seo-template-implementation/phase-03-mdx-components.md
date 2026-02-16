# Phase 3: MDX Components (44 Total)

**Priority:** P1 | **Status:** ✅ completed | **Effort:** 12h

## Context Links

- **Phase 2**: [Design System](phase-02-design-system.md)
- **Architecture**: [Brainstorm](../reports/brainstorm-260216-1408-astro-seo-template-architecture.md)

## Overview

Build 51 MDX-compatible components for content authoring. All components auto-imported via `astro-auto-import`. Split across 4 parallel build agents. Each component supports light/dark mode, responsive, accessible.

## Key Insights

- Each component < 200 lines (modularize if needed)
- All components auto-imported — NO manual imports in MDX files
- Unified CTA API: props-based for structured data, slot-based for inline usage
- Reuse Phase 2 UI components (Button, Badge, Icon, Grid, Section)
- All interactive components need `is:inline` scripts for view transitions compatibility
- Image components use Astro's built-in `<Image />` for optimization

## Requirements

### Functional
- 51 components across 7 categories (Core Content, Data Display, Interactive, Layout/Section, Product/Portfolio, Social/Trust, Layout System)
- All components accept both light/structured and slot-based content
- Responsive breakpoints: 320px, 768px, 1024px, 1536px
- Dark mode variants for all components
- Keyboard navigation for interactive components

### Non-Functional
- Each component < 200 lines
- Zero console errors
- Accessible (WCAG AA minimum)
- Performance: LCP < 2.5s on 3G
- All images lazy-loaded by default

## Architecture

### Component Distribution (4 Parallel Agents)

#### Agent A: Core Content (12 components)
Hero, AuthorBox, TOC, Callout, CTA, CTABlock, Stats, Steps, FAQ, Newsletter, LogoCloud, Image

#### Agent B: Data/Interactive (11 components)
CardGrid, Card, Testimonial, ComparisonTable, Tabs, PricingTable, Accordion, Modal, Tooltip, Drawer, Badge

#### Agent C: Product/Visual (11 components)
SpecTable, Gallery, BeforeAfter, Counter, ProgressBar, CertBadges, FeatureGrid, ProcessFlow, StarRating, ReviewCard, PriceRange

#### Agent D: Social/Misc (14 components)
SocialLinks, TrustBar, ClientLogos, WhatsAppButton, FloatingCTA, VideoEmbed, ContactForm, ScrollReveal, Timeline, TeamGrid, Divider, Spacer, Step, Tag

**Note:** Badge, Divider, Spacer, Tag were created in Phase 2 (UI layer) — Agent B/D can reference them in MDX context if needed.

## Component Specifications

### Core Content Components (Agent A)

#### Hero
- **Props**: `title`, `subtitle`, `image`, `cta` (primary/secondary), `variant` (default/centered/split)
- **Variants**: Default (left-aligned), Centered, Split (image right)
- **Features**: Gradient background option, glassmorphism card overlay

#### AuthorBox
- **Props**: `name`, `bio`, `avatar`, `social` (array)
- **Features**: Avatar image with fallback, social links with icons

#### TOC (Table of Contents)
- **Props**: `headings` (auto-extracted from markdown)
- **Features**: Sticky sidebar on desktop, collapsible on mobile, active section highlight

#### Callout
- **Props**: `type` (info/warning/success/error), `title`, slot content
- **Variants**: 4 types with icons and color schemes

#### CTA
- **Props**: `primary` (object), `secondary` (object), `note` (text) OR slot-based with `href`, `variant`
- **Unified API**: Detects props vs slot usage

#### CTABlock
- **Props**: `title`, `description`, `cta` (primary/secondary), `background` (gradient/solid)
- **Features**: Full-width section with glassmorphism

#### Stats
- **Props**: `items` (array of {label, value, icon?})
- **Variants**: Grid layout (2/3/4 cols), animated counters option

#### Steps
- **Props**: `items` (array of {title, description}) OR slot with Step children
- **Features**: Numbered steps, connector lines, icon support

#### FAQ
- **Props**: `items` (array of {q, a}) OR slot with Accordion children
- **Features**: Collapsible, Schema.org FAQPage markup

#### Newsletter
- **Props**: `title`, `description`, `placeholder`, `buttonText`, `action` (form endpoint)
- **Features**: Email validation, loading state, success message

#### LogoCloud
- **Props**: `logos` (array of {src, alt, href?}), `cols` (3/4/5/6)
- **Features**: Grayscale with hover color, responsive grid

#### Image
- **Props**: `src`, `alt`, `caption?`, `width`, `height`, `lazy` (default true)
- **Features**: Astro Image optimization, caption overlay, lightbox option

### Data Display Components (Agent B)

#### CardGrid
- **Props**: `cols` (2/3/4), `gap` (sm/md/lg), slot children
- **Features**: Responsive grid wrapper for Card components

#### Card
- **Props**: `title`, `description`, `image?`, `href?`, `tags?`, `variant` (default/glass/gradient)
- **Features**: Hover lift effect, badge support, CTA button

#### Testimonial
- **Props**: `quote`, `author`, `role`, `company`, `avatar`, `rating?`
- **Features**: Quote marks, star rating, company logo support

#### ComparisonTable
- **Props**: `headers` (array), `rows` (array of arrays), `highlightCol?`
- **Features**: Sticky header, responsive horizontal scroll, highlight column

#### Tabs
- **Props**: `tabs` (array of {label, content}) OR slot with TabPanel children
- **Features**: Keyboard nav (arrow keys), URL hash support

#### PricingTable
- **Props**: `plans` (array of {name, price, features, cta, featured?})
- **Features**: Featured plan highlight, annual/monthly toggle, feature comparison

#### Accordion
- **Props**: `items` (array of {title, content}) OR slot
- **Features**: Single/multi-expand modes, chevron animation

#### Modal
- **Props**: `trigger` (button text), slot content
- **Features**: Focus trap, ESC to close, backdrop click close, scroll lock

#### Tooltip
- **Props**: `content`, `position` (top/bottom/left/right), slot trigger
- **Features**: Hover + focus support, arrow pointer

#### Drawer
- **Props**: `trigger`, `side` (left/right), slot content
- **Features**: Slide-in animation, backdrop, close button

### Product/Visual Components (Agent C)

#### SpecTable
- **Props**: `specs` (object of key-value pairs), `variant` (table/grid)
- **Features**: Responsive layout, icon support for keys

#### Gallery
- **Props**: `images` (array of {src, alt, caption?}), `layout` (grid/masonry)
- **Features**: Lightbox on click, lazy loading, masonry option

#### BeforeAfter
- **Props**: `before` (image), `after` (image), `position` (0-100)
- **Features**: Draggable slider, keyboard control (arrow keys)

#### Counter
- **Props**: `target` (number), `duration` (ms), `suffix?`, `prefix?`
- **Features**: Count-up animation on scroll into view, number formatting

#### ProgressBar
- **Props**: `value` (0-100), `label?`, `color?`
- **Features**: Animated fill on viewport entry, label position variants

#### CertBadges
- **Props**: `badges` (array of {name, image, year?})
- **Features**: Grid layout, tooltip with details

#### FeatureGrid
- **Props**: `features` (array of {icon, title, description}), `cols` (2/3/4)
- **Features**: Icon support, stagger animation

#### ProcessFlow
- **Props**: `steps` (array of {number, title, description}), `orientation` (horizontal/vertical)
- **Features**: Connector arrows, animated on scroll

#### StarRating
- **Props**: `rating` (0-5), `count?`, `readonly` (default true)
- **Features**: Half-star support, hover preview (if not readonly)

#### ReviewCard
- **Props**: `rating`, `title`, `review`, `author`, `date`, `verified?`
- **Features**: Star rating, verified badge, date formatting

#### PriceRange
- **Props**: `min`, `max`, `currency`, `unit` (per piece/per sqm)
- **Features**: Range display with currency formatting

### Social/Trust Components (Agent D)

#### SocialLinks
- **Props**: `links` (array of {platform, url}), `size` (sm/md/lg), `variant` (icon/button)
- **Features**: Auto-detect platform from URL, icon library (Twitter, LinkedIn, FB, Instagram, GitHub)

#### TrustBar
- **Props**: `items` (array of {icon, text}), `variant` (compact/spacious)
- **Features**: Trust signals (verified, secure, support, shipping)

#### ClientLogos
- **Props**: `clients` (array of {name, logo}), `cols` (4/5/6)
- **Features**: Grayscale with hover color, optional infinite scroll marquee

#### WhatsAppButton
- **Props**: `phone`, `message?`, `position` (bottom-right/bottom-left)
- **Features**: Floating button, opens WhatsApp with pre-filled message

#### FloatingCTA
- **Props**: `text`, `href`, `position` (bottom-right/bottom-left/bottom-center), `showAfterScroll` (px)
- **Features**: Slide-in after scroll threshold, hide on scroll up

#### VideoEmbed
- **Props**: `url` (YouTube/Vimeo), `title`, `aspectRatio` (16:9/4:3)
- **Features**: Responsive embed, lazy iframe loading, privacy-enhanced mode

#### ContactForm
- **Props**: `fields` (array), `submitText`, `class`
- **Features**: Static HTML form, `action` URL from `site-config.json`, client-side validation only, no JS submission
- **Note**: 100% static — no serverless functions. Each site configures form backend (Formspree, CF Workers, etc.) via site-config.json `contact.formAction`
<!-- Updated: Validation Session 1 - ContactForm is static HTML, action from site-config -->

#### ScrollReveal
- **Props**: `animation` (fade-up/fade-down/scale), `delay?`, slot children
- **Features**: IntersectionObserver wrapper, stagger option

#### Timeline
- **Props**: `events` (array of {date, title, description}), `orientation` (vertical/horizontal)
- **Features**: Connector line, date formatting, icons

#### TeamGrid
- **Props**: `members` (array of {name, role, bio, image, social})
- **Features**: Hover overlay with bio, social links

## Related Code Files

### To Create (51 components)
All in `/Users/david/projects/astro-seo-template/src/components/mdx/`:

**Agent A (12):**
- Hero.astro
- AuthorBox.astro
- TOC.astro
- Callout.astro
- CTA.astro
- CTABlock.astro
- Stats.astro
- Steps.astro
- FAQ.astro
- Newsletter.astro
- LogoCloud.astro
- Image.astro

**Agent B (11):**
- CardGrid.astro
- Card.astro
- Testimonial.astro
- ComparisonTable.astro
- Tabs.astro
- PricingTable.astro
- Accordion.astro
- Modal.astro
- Tooltip.astro
- Drawer.astro
- (Badge already in ui/)

**Agent C (11):**
- SpecTable.astro
- Gallery.astro
- BeforeAfter.astro
- Counter.astro
- ProgressBar.astro
- CertBadges.astro
- FeatureGrid.astro
- ProcessFlow.astro
- StarRating.astro
- ReviewCard.astro
- PriceRange.astro

**Agent D (14):**
- SocialLinks.astro
- TrustBar.astro
- ClientLogos.astro
- WhatsAppButton.astro
- FloatingCTA.astro
- VideoEmbed.astro
- ContactForm.astro
- ScrollReveal.astro
- Timeline.astro
- TeamGrid.astro
- (Divider, Spacer, Tag already in sections/ui)
- Step.astro (child of Steps)

### To Modify
- `/Users/david/projects/astro-seo-template/astro.config.mjs` (add all 51 components to auto-import)

## Implementation Steps

### 1. Update astro.config.mjs with Auto-Import List

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import AutoImport from 'astro-auto-import';
import mdx from '@astrojs/mdx';
import pagefind from 'astro-pagefind';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    AutoImport({
      imports: [
        // Agent A: Core Content
        './src/components/mdx/Hero.astro',
        './src/components/mdx/AuthorBox.astro',
        './src/components/mdx/TOC.astro',
        './src/components/mdx/Callout.astro',
        './src/components/mdx/CTA.astro',
        './src/components/mdx/CTABlock.astro',
        './src/components/mdx/Stats.astro',
        './src/components/mdx/Steps.astro',
        './src/components/mdx/Step.astro',
        './src/components/mdx/FAQ.astro',
        './src/components/mdx/Newsletter.astro',
        './src/components/mdx/LogoCloud.astro',
        './src/components/mdx/Image.astro',

        // Agent B: Data/Interactive
        './src/components/mdx/CardGrid.astro',
        './src/components/mdx/Card.astro',
        './src/components/mdx/Testimonial.astro',
        './src/components/mdx/ComparisonTable.astro',
        './src/components/mdx/Tabs.astro',
        './src/components/mdx/PricingTable.astro',
        './src/components/mdx/Accordion.astro',
        './src/components/mdx/Modal.astro',
        './src/components/mdx/Tooltip.astro',
        './src/components/mdx/Drawer.astro',

        // Agent C: Product/Visual
        './src/components/mdx/SpecTable.astro',
        './src/components/mdx/Gallery.astro',
        './src/components/mdx/BeforeAfter.astro',
        './src/components/mdx/Counter.astro',
        './src/components/mdx/ProgressBar.astro',
        './src/components/mdx/CertBadges.astro',
        './src/components/mdx/FeatureGrid.astro',
        './src/components/mdx/ProcessFlow.astro',
        './src/components/mdx/StarRating.astro',
        './src/components/mdx/ReviewCard.astro',
        './src/components/mdx/PriceRange.astro',

        // Agent D: Social/Trust
        './src/components/mdx/SocialLinks.astro',
        './src/components/mdx/TrustBar.astro',
        './src/components/mdx/ClientLogos.astro',
        './src/components/mdx/WhatsAppButton.astro',
        './src/components/mdx/FloatingCTA.astro',
        './src/components/mdx/VideoEmbed.astro',
        './src/components/mdx/ContactForm.astro',
        './src/components/mdx/ScrollReveal.astro',
        './src/components/mdx/Timeline.astro',
        './src/components/mdx/TeamGrid.astro',
      ],
    }),
    mdx(),
    pagefind(),
  ],
});
```

### 2. Agent A Implementation Pattern (Example: Hero)

```astro
---
// src/components/mdx/Hero.astro
import { cn } from '@lib/utils';
import Button from '../ui/Button.astro';
import { Image } from 'astro:assets';

interface Props {
  title: string;
  subtitle?: string;
  image?: { src: string; alt: string };
  cta?: {
    primary?: { text: string; url: string };
    secondary?: { text: string; url: string };
  };
  variant?: 'default' | 'centered' | 'split';
  background?: 'gradient' | 'solid' | 'none';
}

const {
  title,
  subtitle,
  image,
  cta,
  variant = 'default',
  background = 'gradient'
} = Astro.props;

const backgrounds = {
  gradient: 'bg-gradient-to-br from-primary-600 to-secondary-500 text-white',
  solid: 'bg-primary-600 text-white',
  none: 'bg-transparent',
};
---

<section class={cn('py-20 lg:py-32', backgrounds[background])}>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {variant === 'split' ? (
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div data-animate="fade-right">
          <h1 class="text-4xl lg:text-6xl font-bold font-heading mb-6">
            {title}
          </h1>
          {subtitle && (
            <p class="text-xl lg:text-2xl opacity-90 mb-8">{subtitle}</p>
          )}
          {cta && (
            <div class="flex flex-wrap gap-4">
              {cta.primary && (
                <Button href={cta.primary.url} variant="secondary" size="lg">
                  {cta.primary.text}
                </Button>
              )}
              {cta.secondary && (
                <Button href={cta.secondary.url} variant="outline" size="lg">
                  {cta.secondary.text}
                </Button>
              )}
            </div>
          )}
        </div>
        {image && (
          <div data-animate="fade-left">
            <Image
              src={image.src}
              alt={image.alt}
              width={600}
              height={400}
              class="rounded-xl shadow-2xl"
            />
          </div>
        )}
      </div>
    ) : (
      <div class={cn('text-center max-w-4xl mx-auto', variant === 'centered' && 'text-center')}>
        <div data-animate="fade-up">
          <h1 class="text-4xl lg:text-6xl font-bold font-heading mb-6">
            {title}
          </h1>
          {subtitle && (
            <p class="text-xl lg:text-2xl opacity-90 mb-8">{subtitle}</p>
          )}
          {cta && (
            <div class="flex flex-wrap gap-4 justify-center">
              {cta.primary && (
                <Button href={cta.primary.url} variant="secondary" size="lg">
                  {cta.primary.text}
                </Button>
              )}
              {cta.secondary && (
                <Button href={cta.secondary.url} variant="outline" size="lg">
                  {cta.secondary.text}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    )}
  </div>
</section>
```

### 3. Agent B Implementation Pattern (Example: Accordion)

```astro
---
// src/components/mdx/Accordion.astro
interface AccordionItem {
  title: string;
  content: string;
}

interface Props {
  items?: AccordionItem[];
  multiExpand?: boolean;
}

const { items = [], multiExpand = false } = Astro.props;
const hasSlot = Astro.slots.has('default');
---

<div class="space-y-4" data-accordion data-multi={multiExpand}>
  {hasSlot ? (
    <slot />
  ) : (
    items.map((item, index) => (
      <div class="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <button
          type="button"
          class="accordion-trigger w-full px-6 py-4 text-left font-medium text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center justify-between"
          aria-expanded="false"
          aria-controls={`accordion-panel-${index}`}
        >
          <span>{item.title}</span>
          <svg
            class="accordion-icon w-5 h-5 transition-transform text-neutral-600 dark:text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div
          id={`accordion-panel-${index}`}
          class="accordion-panel overflow-hidden transition-all duration-300 max-h-0"
          role="region"
        >
          <div class="px-6 py-4 text-neutral-600 dark:text-neutral-400">
            {item.content}
          </div>
        </div>
      </div>
    ))
  )}
</div>

<script is:inline>
  function initAccordions() {
    document.querySelectorAll('[data-accordion]').forEach(accordion => {
      const multiExpand = accordion.dataset.multi === 'true';

      accordion.querySelectorAll('.accordion-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
          const panel = trigger.nextElementSibling;
          const icon = trigger.querySelector('.accordion-icon');
          const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

          // Close others if single-expand mode
          if (!multiExpand && !isExpanded) {
            accordion.querySelectorAll('.accordion-trigger').forEach(otherTrigger => {
              if (otherTrigger !== trigger) {
                otherTrigger.setAttribute('aria-expanded', 'false');
                otherTrigger.nextElementSibling.style.maxHeight = '0';
                otherTrigger.querySelector('.accordion-icon').style.transform = 'rotate(0deg)';
              }
            });
          }

          // Toggle current
          trigger.setAttribute('aria-expanded', !isExpanded);
          panel.style.maxHeight = isExpanded ? '0' : `${panel.scrollHeight}px`;
          icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
        });
      });
    });
  }

  initAccordions();
  document.addEventListener('astro:page-load', initAccordions);
</script>
```

### 4. Agent C Implementation Pattern (Example: Counter)

```astro
---
// src/components/mdx/Counter.astro
interface Props {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  class?: string;
}

const {
  target,
  duration = 2000,
  suffix = '',
  prefix = '',
  class: className = ''
} = Astro.props;
---

<div
  class={`counter text-4xl font-bold text-primary-600 dark:text-primary-400 ${className}`}
  data-target={target}
  data-duration={duration}
  data-suffix={suffix}
  data-prefix={prefix}
  data-animate="scale"
>
  <span class="counter-value">{prefix}0{suffix}</span>
</div>

<script is:inline>
  function initCounters() {
    const counters = document.querySelectorAll('.counter');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.target);
          const duration = parseInt(counter.dataset.duration);
          const suffix = counter.dataset.suffix || '';
          const prefix = counter.dataset.prefix || '';
          const valueEl = counter.querySelector('.counter-value');

          let start = 0;
          const increment = target / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              valueEl.textContent = prefix + target.toLocaleString() + suffix;
              clearInterval(timer);
            } else {
              valueEl.textContent = prefix + Math.floor(start).toLocaleString() + suffix;
            }
          }, 16);

          counter.dataset.counted = 'true';
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  initCounters();
  document.addEventListener('astro:page-load', initCounters);
</script>
```

### 5. Agent D Implementation Pattern (Example: FloatingCTA)

```astro
---
// src/components/mdx/FloatingCTA.astro
import Button from '../ui/Button.astro';

interface Props {
  text: string;
  href: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  showAfterScroll?: number;
}

const {
  text,
  href,
  position = 'bottom-right',
  showAfterScroll = 300
} = Astro.props;

const positions = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
};
---

<div
  id="floating-cta"
  class={`fixed ${positions[position]} z-40 transform translate-y-24 opacity-0 transition-all duration-300`}
  data-show-after={showAfterScroll}
>
  <Button href={href} variant="primary" size="lg" class="shadow-2xl">
    {text}
  </Button>
</div>

<script is:inline>
  function initFloatingCTA() {
    const cta = document.getElementById('floating-cta');
    if (!cta) return;

    const showAfter = parseInt(cta.dataset.showAfter);
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;

      if (currentScrollY > showAfter && !scrollingDown) {
        cta.classList.remove('translate-y-24', 'opacity-0');
        cta.classList.add('translate-y-0', 'opacity-100');
      } else {
        cta.classList.add('translate-y-24', 'opacity-0');
        cta.classList.remove('translate-y-0', 'opacity-100');
      }

      lastScrollY = currentScrollY;
    });
  }

  initFloatingCTA();
  document.addEventListener('astro:page-load', initFloatingCTA);
</script>
```

## Todo List

### Pre-Build (All Agents)
- [ ] Update `astro.config.mjs` with all 51 component imports
- [ ] Create `/src/components/mdx/` directory if not exists

### Agent A: Core Content (12 components)
- [ ] Hero.astro (3 variants, gradient backgrounds)
- [ ] AuthorBox.astro (avatar, bio, social links)
- [ ] TOC.astro (sticky sidebar, active highlight)
- [ ] Callout.astro (4 types: info/warning/success/error)
- [ ] CTA.astro (unified API: props + slot)
- [ ] CTABlock.astro (full-width section)
- [ ] Stats.astro (grid layout, animated counters)
- [ ] Steps.astro (numbered, connector lines)
- [ ] Step.astro (child component for Steps)
- [ ] FAQ.astro (collapsible, Schema.org markup)
- [ ] Newsletter.astro (form validation, loading state)
- [ ] LogoCloud.astro (responsive grid, grayscale hover)
- [ ] Image.astro (Astro optimization, caption, lightbox)

### Agent B: Data/Interactive (11 components)
- [ ] CardGrid.astro (responsive wrapper)
- [ ] Card.astro (3 variants, hover effects)
- [ ] Testimonial.astro (quote, author, rating)
- [ ] ComparisonTable.astro (sticky header, highlight col)
- [ ] Tabs.astro (keyboard nav, URL hash)
- [ ] PricingTable.astro (featured plan, toggle annual/monthly)
- [ ] Accordion.astro (single/multi expand)
- [ ] Modal.astro (focus trap, ESC close)
- [ ] Tooltip.astro (4 positions, arrow)
- [ ] Drawer.astro (left/right, slide-in)
- [ ] Badge reference (already in Phase 2 ui/)

### Agent C: Product/Visual (11 components)
- [ ] SpecTable.astro (table/grid variants)
- [ ] Gallery.astro (grid/masonry, lightbox)
- [ ] BeforeAfter.astro (draggable slider)
- [ ] Counter.astro (animated count-up)
- [ ] ProgressBar.astro (animated fill)
- [ ] CertBadges.astro (grid, tooltips)
- [ ] FeatureGrid.astro (icons, stagger animation)
- [ ] ProcessFlow.astro (connector arrows)
- [ ] StarRating.astro (half-star support)
- [ ] ReviewCard.astro (rating, verified badge)
- [ ] PriceRange.astro (min-max, currency format)

### Agent D: Social/Trust (14 components)
- [ ] SocialLinks.astro (platform auto-detect)
- [ ] TrustBar.astro (trust signals)
- [ ] ClientLogos.astro (grayscale hover, marquee option)
- [ ] WhatsAppButton.astro (floating, pre-filled message)
- [ ] FloatingCTA.astro (scroll threshold, hide on scroll up)
- [ ] VideoEmbed.astro (YouTube/Vimeo, lazy iframe)
- [ ] ContactForm.astro (validation, success/error)
- [ ] ScrollReveal.astro (IntersectionObserver wrapper)
- [ ] Timeline.astro (vertical/horizontal)
- [ ] TeamGrid.astro (hover bio, social links)
- [ ] Divider reference (already in Phase 2 sections/)
- [ ] Spacer reference (already in Phase 2 sections/)
- [ ] Tag reference (already in Phase 2 ui/)

### Post-Build (All Agents)
- [ ] Test all 51 components render without errors
- [ ] Verify dark mode works on all components
- [ ] Test responsive layouts (320px → 1536px)
- [ ] Test keyboard navigation on interactive components
- [ ] Verify all scripts work after view transitions
- [ ] Check accessibility (ARIA labels, roles)
- [ ] Test lazy loading on images
- [ ] Verify no console errors
- [ ] Create test MDX file with all components
- [ ] Run Lighthouse performance audit

## Success Criteria

- All 51 components render in MDX without manual imports
- Zero console errors or warnings
- All components work in light + dark mode
- Interactive components accessible (keyboard nav, ARIA)
- All animations respect `prefers-reduced-motion`
- Images lazy-load and optimize via Astro
- Scripts re-initialize after view transitions
- Lighthouse Performance 90+, Accessibility 100

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Component count = scope creep | High | Strict < 200 line limit, parallel agents |
| Interactive components + view transitions | Medium | Use `is:inline` scripts, `astro:page-load` events |
| Auto-import performance penalty | Low | Components tree-shakeable, only used ones bundled |
| Image optimization edge cases | Medium | Test with various formats (WebP, AVIF, JPEG) |
| Unified CTA API complexity | Medium | Clear docs, detect props vs slot with conditional |

## Security Considerations

- ContactForm: Validate + sanitize inputs server-side (not just client)
- VideoEmbed: Use privacy-enhanced mode for YouTube
- WhatsAppButton: Validate phone number format
- External links: Add `rel="noopener noreferrer"`
- Modal/Drawer: Prevent scroll jacking, focus trap

## Next Steps

→ **Phase 4**: Build Page Templates (15+, 3 parallel agents)

**Dependencies**: Phase 4 requires Phase 3 complete (uses MDX components in templates)
