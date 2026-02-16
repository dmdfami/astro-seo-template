# Dark Mode Removal & Token Upgrade Research

**Date:** 2026-02-16
**Researcher:** researcher-02
**Context:** Strip dark mode from Astro 5 + Tailwind 4 site, upgrade design-tokens.json for pro-max UI/UX

---

## Executive Summary

- **342 dark: occurrences** across 69 files (56 code files, 13 plans/docs)
- **Core infrastructure:** ThemeToggle component, BaseLayout inline scripts (2), @custom-variant in global.css, features.darkMode flag
- **High-density files:** PricingTable (14), Footer (9), SpecTable (8), AuthorBox/Testimonial/ComparisonTable/ContactForm (8 each)
- **Glass utilities depend on dark mode:** --glass-bg/border swaps in .dark selector (generate-theme.mjs lines 57-61)
- **Token upgrade needed:** Add gradient text tokens, section rhythm tokens, hybrid palette (blue-grey secondary)

---

## Dark Mode Removal Strategy

### Order of Operations

1. **Kill infrastructure first:**
   - Delete `src/components/ui/ThemeToggle.astro`
   - Remove BaseLayout.astro lines 88-108 (2 inline scripts)
   - Remove global.css line 5 (@custom-variant dark)
   - Set site-config.json features.darkMode = false
   - Remove generate-theme.mjs lines 45-61 (.dark runtime vars)

2. **Batch replace dark: classes:**
   - Use regex: `\s+dark:[a-z-]+(-[a-z0-9]+)*` (matches space + dark:class)
   - Order: MDX components → Layout → Pages → UI
   - Priority list below (highest density first)

3. **Fix glass utilities:**
   - Redefine .glass in global.css with light-mode-only values
   - Remove dark mode fallbacks from token refs

4. **Update Header/Footer refs:**
   - Remove ThemeToggle import from Header
   - Clean up any theme-related props

---

## High-Density Files (Priority List)

**Critical (8+ occurrences):**
1. `src/components/mdx/PricingTable.astro` — 14 dark: (toggle script, card borders, text colors)
2. `src/components/layout/Footer.astro` — 9 dark: (bg, borders, social links)
3. `src/components/mdx/SpecTable.astro` — 8 dark: (table borders, hover states)
4. `src/components/mdx/AuthorBox.astro` — 8 dark:
5. `src/components/mdx/Testimonial.astro` — 8 dark:
6. `src/components/mdx/ComparisonTable.astro` — 8 dark:
7. `src/components/mdx/ContactForm.astro` — 8 dark:

**Medium (5-7 occurrences):**
- `src/components/mdx/Timeline.astro` — 6 dark:
- `src/components/mdx/Tabs.astro` — 7 dark:
- `src/components/mdx/ProgressBar.astro` — 7 dark:
- `src/components/mdx/TOC.astro` — 6 dark:
- `src/pages/[slug].astro` — 6 dark:

**Rest:** 41 files with 1-5 occurrences each

---

## Token Upgrade Requirements

### Current Structure (design-tokens.json)

```json
{
  "colors": {
    "primary": { "50"-"950": "oklch(...)" },      // teal-green hue 178
    "secondary": { "50", "500", "900": "oklch(...)" }, // orange hue 40 (sparse)
    "accent": { "400"-"600": "oklch(...)" },      // yellow hue 75
    "neutral": { "50"-"950": hex values }
  },
  "gradients": {
    "hero": "linear-gradient(...primary-600, secondary-500)",
    "card": "linear-gradient(...primary-900, primary-800)",
    "accent": "linear-gradient(...accent-400, accent-600)"
  },
  "glass": {
    "bg": "rgba(255,255,255,0.08)",     // assumes dark bg
    "bgLight": "rgba(255,255,255,0.15)", // assumes dark bg
    "border": "rgba(255,255,255,0.18)",
    "blur": "12px"
  }
}
```

### Changes Needed

#### 1. Replace Secondary Palette (orange → blue-grey)
```json
"secondary": {
  "50": "oklch(0.98 0.01 240)",
  "100": "oklch(0.95 0.02 240)",
  "200": "oklch(0.90 0.03 240)",
  "300": "oklch(0.82 0.05 240)",
  "400": "oklch(0.70 0.08 240)",
  "500": "oklch(0.58 0.10 240)",  // neutral anchor
  "600": "oklch(0.48 0.11 240)",
  "700": "oklch(0.38 0.09 240)",
  "800": "oklch(0.28 0.07 240)",
  "900": "oklch(0.20 0.05 240)",
  "950": "oklch(0.12 0.03 240)"
}
```

#### 2. Add Gradient Text Tokens
```json
"gradients": {
  "hero": "linear-gradient(...)",     // keep existing
  "card": "linear-gradient(...)",     // keep existing
  "accent": "linear-gradient(...)",   // keep existing
  "text-primary": "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-400))",
  "text-teal-blue": "linear-gradient(135deg, var(--color-primary-600), var(--color-secondary-500))",
  "text-accent": "linear-gradient(135deg, var(--color-accent-500), var(--color-primary-500))"
}
```

#### 3. Add Section Rhythm Tokens
```json
"spacing": {
  "xs": "0.5rem",    // keep
  "sm": "0.75rem",   // keep
  "md": "1rem",      // keep
  "lg": "1.5rem",    // keep
  "xl": "2rem",      // keep
  "2xl": "3rem",     // keep
  "3xl": "4rem",     // keep
  "section-sm": "4rem",   // 64px min section padding
  "section-md": "6rem",   // 96px standard
  "section-lg": "8rem",   // 128px hero/major sections
  "content-break": "2.5rem" // 40px between visual blocks in long content
}
```

#### 4. Fix Glass for Light Mode
```json
"glass": {
  "bg": "rgba(255, 255, 255, 0.7)",      // opaque white for light bg
  "bgLight": "rgba(255, 255, 255, 0.85)", // more opaque variant
  "border": "rgba(0, 0, 0, 0.08)",       // dark border on light
  "blur": "12px"
}
```

---

## Regex Patterns for Safe Removal

### Pattern 1: Dark Class Only (safe delete)
```regex
\s+dark:[a-z-]+(-[a-z0-9]+)*
```
**Example:** `text-neutral-900 dark:text-white` → `text-neutral-900`

### Pattern 2: Ternary with Dark (requires manual review)
```regex
\?\s*'[^']*dark:[^']*'\s*:\s*'[^']*'
```
**Example:** `isActive ? 'text-primary dark:text-primary-400' : 'text-neutral'`
**Action:** Keep light variant, drop dark: from true branch

### Pattern 3: Dynamic Classes Array (grep first)
```regex
classList\.(add|remove)\([^)]*dark:
```
**Example:** PricingTable.astro lines 88-93 (toggle script)
**Action:** Delete entire classList logic block

### Pattern 4: Prose Dark Variant
```regex
prose\s+dark:prose-invert
```
**Example:** `prose dark:prose-invert` → `prose`

---

## Risk Areas

### 1. Glass Utilities (.glass, .glass-light)
**Current state:** Depend on CSS vars that swap in .dark selector
**Impact:** Header.astro uses `backdrop-blur-md`, likely other components use .glass
**Fix:** Rewrite .glass utility in global.css after token update, remove dark fallback from generate-theme.mjs

### 2. Gradient Tokens
**Current state:** `--gradient-hero` references primary-600 + secondary-500
**Risk:** If secondary changes from orange (hue 40) to blue-grey (hue 240), existing gradients break visually
**Fix:** Update gradient definitions AFTER palette swap

### 3. Navigation Active States
**Current state:** Navigation.astro/MobileMenu.astro use ternary: `isActive ? 'text-primary-600 dark:text-primary-400' : '...'`
**Fix:** Simplify to single light color: `text-primary-600` (primary-400 is lighter, not needed without dark)

### 4. BaseLayout Body Classes
**Current state:** global.css lines 31-32 apply dark:text-neutral-100 and dark:bg-neutral-950 to <body>
**Impact:** If @apply dark: fails after removing @custom-variant, build breaks
**Fix:** Remove dark: from @apply before deleting @custom-variant

---

## Token Generation Impact

### generate-theme.mjs Current Flow
1. Reads design-tokens.json
2. Outputs `@theme {}` block with --color-*, --font-*, --radius-*, --shadow-* (lines 11-43)
3. Outputs `:root {}` with runtime vars for glass/gradients (lines 47-55)
4. Outputs `.dark {}` selector with dark mode overrides (lines 57-61)

### Changes Needed
- **Delete lines 45-46** (comment about dark mode)
- **Delete lines 57-61** (.dark selector)
- **Update line 48-51** (new glass token values from design-tokens.json)
- **Add lines for gradient text tokens** (after line 54, before closing brace)

**New output:**
```css
:root {
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-bg-light: rgba(255, 255, 255, 0.85);
  --glass-border: rgba(0, 0, 0, 0.08);
  --glass-blur: 12px;
  --gradient-hero: linear-gradient(...);
  --gradient-card: linear-gradient(...);
  --gradient-accent: linear-gradient(...);
  --gradient-text-primary: linear-gradient(...);
  --gradient-text-teal-blue: linear-gradient(...);
  --gradient-text-accent: linear-gradient(...);
}
```

---

## Files Requiring Manual Review (Not Auto-Replace)

1. **PricingTable.astro** — Toggle script classList manipulation (delete entire <script> block)
2. **BaseLayout.astro** — Inline dark mode scripts (delete lines 88-108)
3. **global.css** — @apply with dark: variants (lines 31-32), @custom-variant (line 5)
4. **site-config.json** — features.darkMode flag (set false)
5. **Navigation/MobileMenu** — Ternary active states (simplify)

---

## Unresolved Questions

1. **Are there any client-side scripts** (outside BaseLayout/ThemeToggle) that check `document.documentElement.classList.contains('dark')`?
   → Grep: `classList.*dark|\.dark\b` in .astro/.ts files

2. **Do any MDX components use CSS var fallbacks** like `var(--color-primary-600, #fallback)` that assume dark mode?
   → Unlikely (tokens are compile-time), but verify after removal

3. **Gradient hero/card use primary-900/800** (very dark). Are these intended for dark bg only?
   → Yes, current gradients assume dark hero sections. Need new light-mode-friendly gradients or scrap them.

4. **Does ai-content-rewriter output** contain hardcoded dark: classes?
   → Test after template update, rewriter may need component-catalog.md update
