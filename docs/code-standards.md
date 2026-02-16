# Code Standards

## File Naming Conventions

- **All files:** kebab-case (lowercase with hyphens)
- **Components:** descriptive names (e.g., `pricing-table.astro`, not `table.astro`)
- **Utilities:** verb-based (e.g., `format-date.ts`, `build-schema.ts`)
- **Config:** dash-separated (e.g., `site-config.json`)

**Examples:**
```
✓ src/components/mdx/pricing-table.astro
✓ src/lib/format-date.ts
✓ src/components/seo/schema-builder.ts
✓ scripts/generate-theme.mjs
✗ src/components/PricingTable.astro
✗ src/lib/formatDate.ts
```

## Astro 5 Patterns

### Component Structure
Every `.astro` component uses this pattern:

```astro
---
// 1. Props & TypeScript (with JSDoc)
interface Props {
  title: string;
  variant?: 'default' | 'centered' | 'split';
  cta?: { text: string; url: string };
}

const { title, variant = 'default', cta } = Astro.props;

// 2. Derived data
const classes = `hero ${variant}`;
---

<!-- 3. JSX/HTML template -->
<section class={classes}>
  <h1>{title}</h1>
  {cta && <a href={cta.url}>{cta.text}</a>}
</section>

<style>
  /* 4. Component-scoped CSS (auto-scoped) */
  section { @apply py-16; }
</style>
```

### Client-Side Interactivity
Use `client:load` or `client:idle` for interactive components:

```astro
---
// ui/dark-mode-toggle.astro
---
<button id="theme-toggle" client:load>
  <svg><!-- toggle icon --></svg>
</button>

<script>
  const button = document.getElementById('theme-toggle');
  button?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme-preference',
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );
  });
</script>
```

### View Transitions (ClientRouter)
Import in root layout to enable smooth page transitions:

```astro
// src/layouts/base-layout.astro
---
import { ViewTransitions } from 'astro:transitions';
---

<html lang="en">
  <head>
    <ViewTransitions />
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Content Collections & Glob Loader
Type-safe content access via Astro's glob loader:

```typescript
// src/lib/get-posts.ts
import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
```

### Render API
Render collection entries dynamically:

```astro
---
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');
const published = posts.filter(p => !p.data.draft);

// Render a post entry
import { render } from 'astro:content';
const { data, body } = await render(posts[0]);
---

<h1>{data.title}</h1>
<div set:html={body} />
```

## Tailwind CSS 4 via @tailwindcss/vite

### Setup Pattern
```javascript
// astro.config.mjs
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### CSS Layer Organization
```css
/* src/styles/global.css */
@import "tailwindcss";
@import "./theme.css";

/* Define custom variants */
@custom-variant dark (&:where(.dark, .dark *));

/* Base styles (reset + typography) */
@layer base {
  html { scroll-behavior: smooth; }
  body { @apply font-body text-neutral-900 dark:text-neutral-100; }
}

/* Utilities (reusable classes) */
@layer utilities {
  .glass {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
  }
}
```

### @theme Directive
Design tokens compile to Tailwind's `@theme` block:

```css
/* src/styles/theme.css (AUTO-GENERATED) */
@theme {
  /* Colors from design-tokens.json */
  --color-primary-50: oklch(98% 0.02 250);
  --color-primary-900: oklch(25% 0.15 250);

  /* Typography */
  --font-body: ui-sans-serif, system-ui, sans-serif;
  --text-base: 1rem / 1.5;

  /* Spacing scale */
  --spacing-xs: 0.5rem;
  --spacing-md: 1rem;

  /* Border radius */
  --radius-sm: 0.25rem;
}
```

### Class Naming
Use semantic, descriptive names:

```astro
<!-- ✓ Clear, semantic -->
<div class="flex gap-4 rounded-lg bg-primary-50 p-6 dark:bg-neutral-900">
  <h2 class="text-lg font-bold text-primary-900 dark:text-white">Title</h2>
</div>

<!-- ✗ Non-descriptive shortcuts -->
<div class="flex gap-1 rounded p-2 dark:bg-black">
  <h2 class="font-bold text-primary">Title</h2>
</div>
```

## MDX Components in Content

### Auto-Import Rule
**All components must be auto-imported via `astro.config.mjs`.**

```javascript
// astro.config.mjs - AutoImport integration
AutoImport({
  imports: [
    './src/components/mdx/hero.astro',
    './src/components/mdx/callout.astro',
    // 44 total components...
  ],
})
```

### No Import Statements in MDX
Use components directly in `.mdx` files:

```mdx
---
title: "Article"
---

<!-- ✓ Correct: Auto-imported, no statement needed -->
<Hero title="Welcome" variant="centered" />

<Callout type="info" title="Tip">
  This is a reusable component.
</Callout>

<!-- ✗ Wrong: Don't import auto-imported components -->
import { Hero } from '@/components/mdx/hero.astro';
<Hero />
```

### Component Prop Naming
Use camelCase for all props:

```astro
---
// src/components/mdx/pricing-table.astro
interface Props {
  title: string;
  rows: Array<{ plan: string; price: string; features: string[] }>;
  highlightedRow?: number;
  onSelect?: (plan: string) => void;
}

const { title, rows, highlightedRow, onSelect } = Astro.props;
---
```

## Design Tokens Flow

### Pipeline
```
design-tokens.json (source of truth)
  ↓
scripts/generate-theme.mjs (prebuild)
  ↓
src/styles/theme.css (CSS custom properties)
  ↓
Tailwind CSS 4 (@theme directive)
  ↓
Component utilities (e.g., bg-primary-50, text-lg)
```

### Adding New Tokens
1. Edit `design-tokens.json`:
   ```json
   {
     "colors": {
       "primary": {
         "50": "oklch(98% 0.02 250)",
         "900": "oklch(25% 0.15 250)"
       }
     }
   }
   ```

2. Run `npm run build` (automatically runs `generate-theme.mjs`)

3. Use in components:
   ```astro
   <div class="bg-primary-50 dark:bg-primary-900">Content</div>
   ```

### Token Variables in CSS
```css
/* Use tokens directly in CSS custom properties */
background: var(--glass-bg);
font-family: var(--font-body);
padding: var(--spacing-md);
border-radius: var(--radius-lg);
box-shadow: var(--shadow-lg);
```

## Schema.org JSON-LD

### Security: Escape `</` to `</\`
Prevent script injection attacks:

```typescript
// src/lib/schema-builder.ts
function escapeJsonLd(text: string): string {
  return text.replace(/<\//g, '<\\/');
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  'headline': escapeJsonLd(post.title),
  'description': escapeJsonLd(post.description),
};

// Output in <head> as escaped JSON string
<script type="application/ld+json">
  {JSON.stringify(schema)}
</script>
```

### 3-Tier Structure
1. **Organization** (site-wide, from `schema-org.json`):
   ```json
   {
     "@type": "Organization",
     "name": "Company Name",
     "logo": "https://...",
     "url": "https://..."
   }
   ```

2. **Auto-generated** (per page: BlogPosting, Product, BreadcrumbList)
3. **Frontmatter** (optional custom schemas: FAQ, Recipe, Review)

## Dark Mode Implementation

### Storage & Detection
```typescript
// src/lib/theme-preference.ts
export function getThemePreference(): 'light' | 'dark' | 'system' {
  return localStorage.getItem('theme-preference') ?? 'system';
}

export function applyTheme(preference: string): void {
  const isDark = preference === 'dark' ||
    (preference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  document.documentElement.classList.toggle('dark', isDark);
}

// Call on page load
applyTheme(getThemePreference());
```

### CSS Variable Swapping
Light mode (default):
```css
:root {
  --glass-bg: rgba(255, 255, 255, 0.5);
  --glass-border: rgba(0, 0, 0, 0.1);
}
```

Dark mode override:
```css
.dark {
  --glass-bg: rgba(0, 0, 0, 0.3);
  --glass-border: rgba(255, 255, 255, 0.1);
}
```

### Dark Mode Utilities
```astro
<!-- Use dark: prefix for dark-mode-specific styles -->
<div class="bg-white dark:bg-neutral-900">
  Content adapts to light/dark
</div>
```

## Error Handling

### Type Safety First
Always use TypeScript interfaces for component props:

```typescript
// ✓ Strongly typed
interface Props {
  title: string;
  count: number;
  onComplete?: () => void;
}

// ✗ Avoid any
const MyComponent = (props: any) => {};
```

### Null Safety
Check optional data before rendering:

```astro
---
const post = await getEntry('blog', 'my-post');
if (!post) {
  return Astro.redirect('/404');
}
---

<article>
  <h1>{post.data.title}</h1>
  {post.data.tags?.map(tag => <span>{tag}</span>)}
</article>
```

### Try-Catch for Async Operations
```typescript
// src/lib/fetch-external-data.ts
export async function fetchData(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    return null;
  }
}
```

## Comments & Documentation

### JSDoc for Functions
```typescript
/**
 * Generate canonical URL for a page.
 * @param path - Page path (e.g., '/blog/post-slug')
 * @returns Full canonical URL including domain
 */
export function getCanonicalUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
```

### Inline Comments for Complex Logic
```astro
---
// Filter drafts and sort by date (newest first)
const posts = allPosts
  .filter(p => !p.data.draft)
  .sort((a, b) =>
    new Date(b.data.publishDate).getTime() -
    new Date(a.data.publishDate).getTime()
  );
---
```

### Avoid Over-Commenting
```typescript
// ✗ Obvious comments are noise
const name = user.name; // Get the user's name

// ✓ Explain the why, not the what
const price = item.basePrice * 1.15; // Add 15% tax for CA residents
```

## Performance Optimization

### Image Optimization
Use Astro's `<Image>` component:

```astro
---
import { Image } from 'astro:assets';
import heroImage from '@/images/hero.webp';
---

<Image
  src={heroImage}
  alt="Hero section"
  format="webp"
  quality="high"
/>
```

### Lazy Loading
```astro
<iframe
  src="https://youtube.com/..."
  loading="lazy"
  title="Video"
/>
```

### Preload Critical Resources
```astro
<link rel="preload" as="font" href="/fonts/inter.woff2" type="font/woff2" crossorigin />
```

## Testing Patterns

### Type Checking
```bash
npx astro check
```

### Linting
```bash
npx eslint src/ --fix
```

### Build Validation
```bash
npm run build  # Validates Schema.org, compiles theme, builds site
```

## Accessibility Standards

### ARIA Labels
```astro
<button aria-label="Toggle dark mode" aria-pressed={isDark}>
  🌙
</button>
```

### Semantic HTML
```astro
<!-- ✓ Semantic -->
<nav><ul><li><a href="/">Home</a></li></ul></nav>
<article><h1>Title</h1><p>Content</p></article>

<!-- ✗ Non-semantic -->
<div class="nav"><div class="item"><span>Home</span></div></div>
```

### Color Contrast
- Ensure WCAG AA contrast ratio (4.5:1 for text)
- Test dark mode colors in design tokens
- Use Tailwind's opacity utilities for layering

## Pre-Commit Checklist

- [ ] Component props are TypeScript interfaces
- [ ] All files use kebab-case naming
- [ ] No unused imports or variables
- [ ] Dark mode CSS variables use `.dark` selector
- [ ] Schema.org JSON escapes `</` as `</\`
- [ ] `npm run build` passes without errors
- [ ] Design token changes regenerate `theme.css`
