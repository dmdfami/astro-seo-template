# Phase 02: MDX Component API Alignment

## Context Links

- MDX component audit: `plans/reports/researcher-260216-1800-mdx-component-audit.md`
- Auto-import config: `astro.config.mjs` (lines 16-66)
- Component source: `src/components/mdx/`

## Overview

- **Priority:** P0 -- 7 components produce broken/empty rendering
- **Status:** complete
- **Description:** Fix 7 CRITICAL + 4 MODERATE component mismatches. Each component must accept BOTH the rewriter's API AND the existing template API (backward compatible). Add Badge + Breadcrumb to auto-import. Alias MdxImage as Image.

## Key Insights

- Rewriter uses flat props (`ctaText`, `ctaHref`); template uses nested objects (`cta: {primary: {text, url}}`)
- FAQ keys: rewriter outputs `{question, answer}`, template expects `{q, a}` -- normalize in component
- `<Image>` from rewriter won't resolve -- MdxImage must be aliased as `Image` in auto-import
- All components already exist except Badge/Breadcrumb mdx wrappers
- Backward compatibility is required: existing `home.mdx` and sample content use current API

## Requirements

### Functional
- All 7 CRITICAL components accept rewriter's props API
- All 4 MODERATE components accept rewriter's props API
- Badge and Breadcrumb available as auto-imported MDX components
- `<Image>` tag resolves to MdxImage component
- Existing content (home.mdx, sample pages) continues to render correctly

### Non-Functional
- No runtime errors from props mismatch
- TypeScript Props interfaces updated

## Related Code Files

### Files to MODIFY (9)
1. `src/components/mdx/CTA.astro` -- add `size`, `description`, `fullWidth`, `id`
2. `src/components/mdx/CTABlock.astro` -- add flat props API (`href`, `ctaText`, `frictionText`, `socialProof`, `variant`, `align`)
3. `src/components/mdx/Hero.astro` -- add flat CTA props (`ctaText`, `ctaHref`, `ctaVariant`)
4. `src/components/mdx/AuthorBox.astro` -- add `role`, `credentials`, alias `image`->`avatar`
5. `src/components/mdx/TOC.astro` -- accept `items` prop, normalize `href`->`slug`, `level`->`depth`
6. `src/components/mdx/FAQ.astro` -- accept both `{question, answer}` and `{q, a}` keys
7. `src/components/mdx/MdxImage.astro` -- no code change needed (already compatible)
8. `src/components/mdx/Callout.astro` -- add `tip` and `note` to type union
9. `astro.config.mjs` -- add Badge, Breadcrumb to auto-import + alias MdxImage as Image

### Files to CREATE (2)
1. `src/components/mdx/Badge.astro` -- wrapper re-exporting `ui/Badge.astro`
2. `src/components/mdx/BreadcrumbNav.astro` -- wrapper re-exporting `seo/Breadcrumb.astro` (named BreadcrumbNav to avoid conflict with SEO component import name)

## Implementation Steps

### Step 1: FAQ.astro -- normalize {question, answer} to {q, a}

File: `src/components/mdx/FAQ.astro`

Update the interface and add normalization:

```astro
---
interface FAQItem {
  q?: string;
  a?: string;
  question?: string;
  answer?: string;
}

interface Props {
  items?: FAQItem[];
}

const { items: rawItems = [] } = Astro.props;
const hasSlot = Astro.slots.has('default');

// Normalize: accept both {q, a} and {question, answer}
const items = rawItems.map(item => ({
  q: item.q || item.question || '',
  a: item.a || item.answer || '',
}));
---
```

Rest of template unchanged (already uses `item.q` and `item.a`).

**Effort:** 5 min

### Step 2: Image/MdxImage alias in auto-import

File: `astro.config.mjs`

The `astro-auto-import` plugin supports renaming. Add an alias entry:

```js
AutoImport({
  imports: [
    // ... existing imports ...
    './src/components/mdx/MdxImage.astro',
    // Add alias for Image -> MdxImage
    { './src/components/mdx/MdxImage.astro': [['default', 'Image']] },
  ],
})
```

If the above aliasing syntax is not supported by `astro-auto-import`, create a thin wrapper instead:

Create `src/components/mdx/Image.astro`:
```astro
---
// Wrapper so <Image> in MDX resolves to MdxImage
import MdxImage from './MdxImage.astro';
const props = Astro.props;
---
<MdxImage {...props}><slot /></MdxImage>
```

Then add to auto-import:
```js
'./src/components/mdx/Image.astro',
```

**Effort:** 10 min (test which approach works)

### Step 3: CTA.astro -- add missing props

File: `src/components/mdx/CTA.astro`

Expand Props interface:

```astro
---
import Button from '../ui/Button.astro';

interface Props {
  // Existing API
  primary?: { text: string; url: string };
  secondary?: { text: string; url: string };
  note?: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  // New: rewriter API
  size?: 'sm' | 'md' | 'lg';
  description?: string;
  fullWidth?: boolean;
  id?: string;
}

const {
  primary, secondary, note, href,
  variant = 'primary',
  size = 'lg',
  description,
  fullWidth = false,
  id
} = Astro.props;
const hasSlot = Astro.slots.has('default');
---

{hasSlot ? (
  <div id={id} class:list={[fullWidth && 'w-full']}>
    <Button href={href} variant={variant} size={size} class:list={[fullWidth && 'w-full']}>
      <slot />
    </Button>
    {description && (
      <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
    )}
  </div>
) : (
  <div class="flex flex-wrap gap-4 items-center">
    {primary && (
      <Button href={primary.url} variant="primary" size="lg">
        {primary.text}
      </Button>
    )}
    {secondary && (
      <Button href={secondary.url} variant="outline" size="lg">
        {secondary.text}
      </Button>
    )}
    {note && (
      <p class="text-sm text-neutral-600 dark:text-neutral-400">{note}</p>
    )}
  </div>
)}
```

**Effort:** 15 min

### Step 4: CTABlock.astro -- dual API

File: `src/components/mdx/CTABlock.astro`

Keep existing `title`/`description`/`cta` API, add rewriter's flat API:

```astro
---
import { cn } from '@lib/utils';
import Button from '../ui/Button.astro';

interface Props {
  // Existing API
  title?: string;
  description?: string;
  cta?: {
    primary?: { text: string; url: string };
    secondary?: { text: string; url: string };
  };
  background?: 'gradient' | 'solid';
  // Rewriter API (flat)
  href?: string;
  ctaText?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  frictionText?: string;
  socialProof?: string;
  align?: 'left' | 'center' | 'right';
}

const {
  title, description, cta, background = 'gradient',
  href, ctaText, variant = 'primary', frictionText, socialProof,
  align = 'center'
} = Astro.props;

// Normalize: if flat props provided, build cta object
const resolvedTitle = title || '';
const resolvedCta = cta || (href && ctaText ? { primary: { text: ctaText, url: href } } : undefined);

const backgrounds = {
  gradient: 'bg-gradient-to-br from-primary-600 to-secondary-500',
  solid: 'bg-primary-600',
};

const alignments = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};
---

<section class={cn('py-16 lg:py-24 text-white', backgrounds[background])}>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class={cn('max-w-3xl mx-auto', alignments[align])}>
      {resolvedTitle && (
        <h2 class="text-3xl lg:text-5xl font-bold font-heading mb-6">
          {resolvedTitle}
        </h2>
      )}
      {description && (
        <p class="text-xl opacity-90 mb-8">{description}</p>
      )}
      {resolvedCta && (
        <div class={cn('flex flex-wrap gap-4', align === 'center' && 'justify-center')}>
          {resolvedCta.primary && (
            <Button href={resolvedCta.primary.url} variant="secondary" size="lg">
              {resolvedCta.primary.text}
            </Button>
          )}
          {resolvedCta.secondary && (
            <Button href={resolvedCta.secondary.url} variant="outline" size="lg">
              {resolvedCta.secondary.text}
            </Button>
          )}
        </div>
      )}
      {frictionText && (
        <p class="mt-4 text-sm opacity-80">{frictionText}</p>
      )}
      {socialProof && (
        <p class="mt-2 text-sm opacity-70">{socialProof}</p>
      )}
    </div>
  </div>
</section>
```

**Effort:** 30 min

### Step 5: Hero.astro -- add flat CTA props

File: `src/components/mdx/Hero.astro`

Add to Props interface:
```ts
// Rewriter flat CTA props
ctaText?: string;
ctaHref?: string;
ctaVariant?: 'primary' | 'secondary' | 'outline';
overlay?: boolean;
size?: 'sm' | 'md' | 'lg';
align?: 'left' | 'center' | 'right';
```

In component logic, normalize flat CTA to nested:
```ts
// Normalize: flat CTA props -> nested cta object
const resolvedCta = cta || (ctaText && ctaHref
  ? { primary: { text: ctaText, url: ctaHref } }
  : undefined);

// Normalize: string image -> object
const resolvedImage = typeof image === 'string'
  ? { src: image, alt: title }
  : image;

// Map align to variant if variant not explicitly set
const resolvedVariant = variant || (align === 'center' ? 'centered' : 'default');
```

Replace all references to `cta` with `resolvedCta`, `image` with `resolvedImage`, `variant` with `resolvedVariant` in the template.

**Effort:** 20 min

### Step 6: AuthorBox.astro -- add role, credentials, image alias

File: `src/components/mdx/AuthorBox.astro`

Update Props:
```ts
interface Props {
  name: string;
  bio: string;
  avatar?: string;
  image?: string;          // Alias for avatar (rewriter uses 'image')
  role?: string;           // New: rewriter API
  credentials?: string[];  // New: rewriter API
  social?: SocialLink[];
  // Rewriter flat social props
  linkedin?: string;
  twitter?: string;
}
```

Normalize:
```ts
const resolvedAvatar = avatar || image;

// Build social array from flat props if social not provided
const resolvedSocial = social?.length ? social : [
  ...(linkedin ? [{ platform: 'linkedin' as const, url: linkedin }] : []),
  ...(twitter ? [{ platform: 'twitter' as const, url: twitter }] : []),
];
```

Add role and credentials to template:
```astro
<h3 class="text-xl font-bold text-neutral-900 dark:text-white mb-1">
  {name}
</h3>
{role && (
  <p class="text-sm text-primary-600 dark:text-primary-400 mb-2">{role}</p>
)}
{credentials?.length > 0 && (
  <div class="flex flex-wrap gap-2 mb-2">
    {credentials.map(c => (
      <span class="text-xs bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">{c}</span>
    ))}
  </div>
)}
```

**Effort:** 15 min

### Step 7: TOC.astro -- accept items prop

File: `src/components/mdx/TOC.astro`

Update Props:
```ts
interface RewriterHeading {
  text: string;
  href: string;
  level: number;
}

interface Props {
  headings?: { depth: number; slug: string; text: string }[];
  items?: RewriterHeading[];
  title?: string;
}

const { headings: rawHeadings, items, title = 'Table of Contents' } = Astro.props;

// Normalize: accept both items (rewriter) and headings (template)
const headings = rawHeadings || (items?.map(item => ({
  depth: item.level || 2,
  slug: item.href?.replace(/^#/, '') || '',
  text: item.text || '',
})) || []);
```

Replace hardcoded "Table of Contents" h2 text with `{title}`.

**Effort:** 15 min

### Step 8: Callout.astro -- add tip/note types

File: `src/components/mdx/Callout.astro`

Update type union and add mapping:
```ts
interface Props {
  type?: 'info' | 'warning' | 'success' | 'error' | 'tip' | 'note';
  title?: string;
  class?: string;
}

const { type: rawType = 'info', title, class: className } = Astro.props;

// Map rewriter types to template types
const typeMap: Record<string, string> = {
  tip: 'info',
  note: 'info',
};
const type = (typeMap[rawType] || rawType) as 'info' | 'warning' | 'success' | 'error';
```

**Effort:** 5 min

### Step 9: Testimonial.astro -- accept slot-based quote

File: `src/components/mdx/Testimonial.astro`

The rewriter converter sends quote as children. Add slot support:

```ts
interface Props {
  quote?: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
  image?: string;  // Alias for avatar
  rating?: number;
  class?: string;
}
```

In component:
```ts
const resolvedAvatar = avatar || image;
const hasSlot = Astro.slots.has('default');
```

In template, replace `"{quote}"` with:
```astro
<blockquote class="text-lg text-neutral-700 dark:text-neutral-300 mb-6">
  {hasSlot ? <slot /> : `"${quote}"`}
</blockquote>
```

**Effort:** 10 min

### Step 10: Create Badge MDX wrapper

Create `src/components/mdx/Badge.astro`:

```astro
---
// MDX wrapper for ui/Badge.astro
import BadgeUI from '../ui/Badge.astro';

interface Props {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  class?: string;
}

const props = Astro.props;
---

<BadgeUI {...props}><slot /></BadgeUI>
```

**Effort:** 5 min

### Step 11: Create BreadcrumbNav MDX wrapper

Create `src/components/mdx/BreadcrumbNav.astro`:

```astro
---
// MDX wrapper for seo/Breadcrumb.astro (named BreadcrumbNav to avoid SEO import conflicts)
import Breadcrumb from '../seo/Breadcrumb.astro';

interface Props {
  items: Array<{ label: string; href?: string }>;
}

const { items } = Astro.props;
---

<Breadcrumb items={items} />
```

**Effort:** 5 min

### Step 12: Update astro.config.mjs auto-import

Add to the imports array:

```js
'./src/components/mdx/Badge.astro',
'./src/components/mdx/BreadcrumbNav.astro',
// Image alias for MdxImage (so <Image> from rewriter resolves)
'./src/components/mdx/Image.astro',  // thin wrapper around MdxImage
```

If creating the Image wrapper approach, create `src/components/mdx/Image.astro`:

```astro
---
import MdxImage from './MdxImage.astro';
---
<MdxImage {...Astro.props}><slot /></MdxImage>
```

**Effort:** 10 min

### Step 13: Verify build

```bash
npm run build
```

Test that existing `home.mdx` and sample content still renders correctly.

## Todo List

- [ ] FAQ.astro: normalize `{question, answer}` to `{q, a}`
- [ ] Image alias: create `Image.astro` wrapper + add to auto-import
- [ ] CTA.astro: add `size`, `description`, `fullWidth`, `id` props
- [ ] CTABlock.astro: add flat props API (backward compatible)
- [ ] Hero.astro: add flat CTA props + string image normalization
- [ ] AuthorBox.astro: add `role`, `credentials`, `image` alias, flat social props
- [ ] TOC.astro: accept `items` prop + `title` prop
- [ ] Callout.astro: add `tip`/`note` type mapping
- [ ] Testimonial.astro: accept slot-based quote + `image` alias
- [ ] Create `src/components/mdx/Badge.astro`
- [ ] Create `src/components/mdx/BreadcrumbNav.astro`
- [ ] Create `src/components/mdx/Image.astro` (MdxImage wrapper)
- [ ] Update `astro.config.mjs` auto-import list
- [ ] Run `npm run build` and verify existing content renders

## Success Criteria

- All 7 CRITICAL components accept rewriter's props without runtime errors
- All 4 MODERATE components handle rewriter's props gracefully
- `<Image>`, `<Badge>`, `<BreadcrumbNav>` available in MDX without imports
- Existing `home.mdx` and sample content renders identically to before
- `npm run build` passes

## Risk Assessment

- **RISK:** `astro-auto-import` may not support renaming/aliasing. **Mitigation:** Use thin wrapper component (`Image.astro` wrapping `MdxImage.astro`).
- **RISK:** Backward compat -- existing content may pass props differently. **Mitigation:** All changes are additive (new optional props). Normalization logic handles both formats. No existing props removed.
- **RISK:** TypeScript strict mode may reject union types in normalization. **Mitigation:** Use explicit type guards and assertions.

## Security Considerations

- No new security surface. Components only render static HTML.
- Props validation via TypeScript interfaces (no user input processing).

## Next Steps

- Phase 3: Schema & SEO enhancements (SchemaRenderer, OpenGraph)
- After both Phase 2+3: content generation can begin
