# Code Review: Phase 2 Template Overhaul

**Reviewer:** code-reviewer | **Date:** 2026-02-16 | **Build:** 19 pages, 0 errors, 1.29s | **Tests:** 24/24 passed

---

## Scope

- **Files reviewed:** 6 (1 new TS, 1 new CJS test, 3 edited Astro, 1 edited CSS)
- **LOC changed:** ~250 added, ~50 removed
- **Focus:** Layout registry correctness, CSS specificity, rendering regressions, type safety

### Scout Findings (Edge Cases)

1. `hybrid` pattern exists in registry but NO branch handles it in `[slug].astro` -- silent rendering gap if any non-homepage content type ever gets `hybrid`
2. `container` field defined on all 12 types in registry but NEVER consumed by any page template
3. `proseWrapper` field consumed in `products/[slug].astro` but NOT in `[slug].astro` split branch (hardcoded prose div)
4. `blog/[slug].astro` does not use layout-registry at all -- breadcrumb and h1 hardcoded
5. `index.astro` imports `Container` component but never uses it in template
6. `index.astro` does not import or reference layout-registry -- homepage layout config effectively dead

---

## Overall Assessment

**Score: 7.5/10** -- Good architectural direction. The layout registry centralizes a previously scattered concern. Build succeeds, tests pass. However, several registry fields are defined but unused (dead config), and there is an incomplete migration leaving `blog/[slug].astro` and `index.astro` outside the registry pattern. The CSS `:where()` strategy for homepage is well-reasoned.

---

## Critical Issues

None. No security vulnerabilities, no data loss risk, no breaking changes detected.

---

## High Priority

### H1. `hybrid` pattern has no rendering branch in `[slug].astro`

**File:** `/Users/david/projects/astro-seo-template/src/pages/[slug].astro`
**Lines:** 47, 61, 103

The template handles `fullwidth`, `split`, and `prose` but NOT `hybrid`. Currently safe because `homepage` (the only `hybrid` type) is excluded by the `contentType !== 'homepage'` filter on line 14. But if someone adds a new content type with `pattern: 'hybrid'` to both the schema enum and registry, that page renders **completely empty** (no `<main>` block at all) with zero error.

**Fix options:**
- (A) Add a `hybrid` branch in `[slug].astro` (future-proofs)
- (B) Add runtime guard: throw/warn if pattern is unrecognized
- (C) Document that `hybrid` is homepage-only (least safe)

Recommended: Option B -- add fallback:

```astro
{!['fullwidth', 'split', 'prose'].includes(pattern) && (
  <main id="main-content" data-pagefind-body>
    <Container size="md">
      <article class="prose max-w-none">
        <h1>{page.data.title}</h1>
        <Content />
      </article>
    </Container>
  </main>
)}
```

### H2. `container` field defined but never consumed

**File:** `/Users/david/projects/astro-seo-template/src/lib/layout-registry.ts`
**Lines:** 10, 16-101

Every layout config defines `container: 'none' | 'md' | 'lg' | 'xl'` but no page template reads `layout.container`. The `[slug].astro` split branch hardcodes `<Container>` (default size) and prose branch hardcodes `<Container size="md">`. This means the registry value is dead config -- YAGNI violation.

**Fix:** Either wire `container` into templates (`<Container size={layout.container}>`) or remove the field until needed.

### H3. `proseWrapper` inconsistency between `[slug].astro` and `products/[slug].astro`

**File:** `/Users/david/projects/astro-seo-template/src/pages/[slug].astro`, line 96

The split branch in `[slug].astro` hardcodes `<div class="prose max-w-none">` around `<Content />` on line 96 instead of checking `layout.proseWrapper`. Meanwhile `products/[slug].astro` correctly uses `layout.proseWrapper` (line 70). If a split-type content ever sets `proseWrapper: false`, the generic slug route ignores it.

**Fix:**
```astro
{layout.proseWrapper ? (
  <div class="prose max-w-none">
    <Content />
  </div>
) : (
  <Content />
)}
```

---

## Medium Priority

### M1. Unused `Container` import in `index.astro`

**File:** `/Users/david/projects/astro-seo-template/src/pages/index.astro`, line 6

`Container` is imported but never referenced in the template. Dead import.

**Fix:** Remove line 6:
```diff
- import Container from '@components/sections/Container.astro';
```

### M2. `blog/[slug].astro` not migrated to layout-registry

**File:** `/Users/david/projects/astro-seo-template/src/pages/blog/[slug].astro`

Blog posts hardcode breadcrumb, h1 class, prose wrapper, and container size. The registry defines `blog` config (`pattern: 'prose', container: 'md', proseWrapper: true, h1Auto: true, breadcrumb: true`) but it's never imported. If blog layout rules change in the registry, this page won't reflect them.

**Impact:** Low now (blog has custom layout with author/date metadata). But this undermines the "single source of truth" goal of the registry.

**Fix:** Import and use at minimum `h1Auto` and `breadcrumb` flags.

### M3. `isFullWidth()` helper exported but unused

**File:** `/Users/david/projects/astro-seo-template/src/lib/layout-registry.ts`, lines 107-110

`isFullWidth()` is exported but no consumer imports it. Dead code.

**Fix:** Remove or add `// TODO: used by future middleware` comment.

### M4. Test is text-parsing, not runtime validation

**File:** `/Users/david/projects/astro-seo-template/tests/test-layout-registry.cjs`

The contract test reads the TS source as a string and uses `includes()` to check for key presence. This means:
- A commented-out key would still pass
- A typo in pattern value (e.g. `'fullwdith'`) would still pass if `'fullwidth'` exists elsewhere
- No actual runtime validation of the JS module

**Fix:** Use `tsx` or `ts-node` to actually import and validate the module, or at minimum use regex with word boundaries:

```js
const typeRegex = new RegExp(`^\\s+${typeKey}:\\s*\\{`, 'm');
assert(typeRegex.test(registrySource), `Missing layout config for "${type}"`);
```

---

## Low Priority

### L1. Inconsistent `mb-4` on h1 across patterns

- Split pattern (line 78): `<h1 class="heading-hero mb-4">`
- Prose pattern (line 113): `<h1 class="heading-hero">` (no mb-4)

May be intentional (prose typography handles margins), but worth documenting.

### L2. CSS `:where()` selectors duplicate `.prose` styles

The `.homepage-content :where(...)` block repeats many styles that `.prose` already defines (link colors, list padding, image rounding, headings). Consider using `@apply` or a shared mixin to reduce duplication, though `:where()` zero-specificity is the correct approach here for the homepage hybrid pattern where components need to override.

### L3. Registry `Record<string, LayoutConfig>` type is loose

**File:** `/Users/david/projects/astro-seo-template/src/lib/layout-registry.ts`, line 16

`Record<string, LayoutConfig>` allows any string key. Could be tightened:

```ts
type ContentType = 'homepage' | 'landing' | 'gallery' | 'video-hub' | 'product' | 'blog' | 'generic' | 'about' | 'contact' | 'product-list' | 'blog-list' | 'reviews';
export const LAYOUT_REGISTRY: Record<ContentType, LayoutConfig> = { ... };
```

This would catch typos at compile time. The `getLayout()` function would still accept `string` for flexibility.

---

## Positive Observations

1. **Good architectural direction** -- centralizing layout config into a typed registry is the right move
2. **`:where()` zero-specificity** is the correct CSS strategy for hybrid layouts where component styles must win
3. **Fallback to `generic`** in `getLayout()` (line 104) gracefully handles unknown content types
4. **Contract test** exists and validates all 12 types
5. **Build is green** -- 19 pages, 0 errors, fast 1.29s
6. **h1 unified to `heading-hero`** class across product pages (was `text-4xl font-bold font-heading`)
7. **Breadcrumb now conditional** based on registry, allowing future content types to opt out

---

## Recommended Actions (Priority Order)

1. **[H1]** Add fallback/guard for unrecognized patterns in `[slug].astro` to prevent silent empty renders
2. **[H2]** Either wire `container` field into templates or remove it (YAGNI)
3. **[H3]** Use `layout.proseWrapper` in `[slug].astro` split branch instead of hardcoding
4. **[M1]** Remove unused `Container` import from `index.astro`
5. **[M3]** Remove unused `isFullWidth()` or document planned usage
6. **[M2]** Migrate `blog/[slug].astro` to use registry (optional, lower priority given custom blog layout)
7. **[L3]** Tighten `LAYOUT_REGISTRY` type from `Record<string, ...>` to explicit union

---

## Metrics

| Metric | Value |
|--------|-------|
| Build | 19 pages, 0 errors, 1.29s |
| Contract Tests | 24/24 passed |
| Type Coverage | Partial (registry typed, consumers use `string`) |
| Dead Code | 3 items (Container import, isFullWidth, container field) |
| Linting Issues | 0 syntax errors |

---

## Unresolved Questions

1. Is the `container` field intended for a future phase that wires it into `<Container size={...}>`? If so, document it. If not, remove it.
2. Should `blog/[slug].astro` be migrated to use the registry, or is blog intentionally separate due to its unique metadata layout (author, date, tags)?
3. The `hybrid` pattern is only used by homepage which has its own route -- should `hybrid` be removed from the `LayoutPattern` type and registry to avoid confusion?
