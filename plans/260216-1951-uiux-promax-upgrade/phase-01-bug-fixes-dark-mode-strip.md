# Phase 1: Bug Fixes + Dark Mode Strip

**Date:** 2026-02-16
**Priority:** P1 (Foundation)
**Status:** ✅ Complete
**Effort:** 3h

## Context Links

- Parent plan: [plan.md](plan.md)
- Research: [researcher-02-darkmode-removal-token-upgrade.md](research/researcher-02-darkmode-removal-token-upgrade.md)

## Overview

Clean foundation before premium upgrade. Fix 6 critical UI bugs affecting live site. Strip all 342 dark: occurrences across 69 files to simplify codebase for light-only design. Remove dark mode infrastructure (ThemeToggle, scripts, config flags).

**Why first:** Dark mode removal affects all subsequent component work. Must strip before adding gradient tokens and premium components to avoid conflicts.

## Key Insights

- **342 dark: occurrences** found via grep (researcher-02 found 342, initial estimate 240 — use higher)
- **High-density files:** PricingTable (14), Footer (9), SpecTable (8), AuthorBox/Testimonial/ComparisonTable/ContactForm (8 each)
- **Infrastructure files:** ThemeToggle.astro (component), BaseLayout.astro (lines 88-108), global.css (line 5, lines 31-32), site-config.json (line 51)
- **Manual review needed:** PricingTable classList script, Navigation/MobileMenu ternary active states, glass utilities
- **No build breaks expected:** Clean removal, tokens remain light-mode compatible

## Requirements

### Functional
1. All 6 UI bugs fixed and verified in dev server
2. Zero dark: classes remain in codebase
3. ThemeToggle component deleted
4. BaseLayout dark mode scripts removed (lines 88-108)
5. @custom-variant dark removed from global.css
6. features.darkMode: false in site-config.json
7. npm run build — 0 errors

### Non-Functional
1. No visual regression on existing light mode appearance
2. Build time unchanged (~1.1s)
3. All 19 pages render correctly

## Architecture

### Files Modified
- `src/components/ui/ThemeToggle.astro` — DELETE
- `src/layouts/BaseLayout.astro` — REMOVE lines 88-108 (dark mode scripts)
- `src/styles/global.css` — REMOVE line 5 (@custom-variant), lines 31-32 (dark: @apply)
- `site-config.json` — CHANGE features.darkMode: false
- `src/components/layout/Header.astro` — REMOVE ThemeToggle import/usage
- **56 component files** — BATCH REMOVE dark: classes via regex
- **13 plan/doc files** — SKIP (not production code)

### Bug Fix Targets
1. **Broken images on listing pages** — src/pages/[slug].astro, product-list/blog-list templates
2. **Mobile header wrap** — src/components/layout/Header.astro (logo + "Get Started")
3. **Blog duplicate title** — blog post template rendering
4. **FeatureGrid green squares** — src/components/mdx/FeatureGrid.astro (icon rendering)
5. **Footer missing social links** — src/components/layout/Footer.astro (add Facebook/YouTube)
6. **Unstyled section headings** — Apply typography hierarchy consistently

## Related Code Files

```
src/
├── components/
│   ├── ui/ThemeToggle.astro              # DELETE
│   ├── layout/
│   │   ├── Header.astro                  # Remove ThemeToggle, fix mobile wrap
│   │   └── Footer.astro                  # Fix social links, remove 9 dark: classes
│   └── mdx/
│       ├── PricingTable.astro            # Remove 14 dark: classes + toggle script
│       ├── SpecTable.astro               # Remove 8 dark: classes
│       ├── AuthorBox.astro               # Remove 8 dark: classes
│       ├── Testimonial.astro             # Remove 8 dark: classes
│       ├── ComparisonTable.astro         # Remove 8 dark: classes
│       ├── ContactForm.astro             # Remove 8 dark: classes
│       ├── FeatureGrid.astro             # Fix green square icons
│       └── [43 other MDX components]     # Batch remove dark: classes
├── layouts/BaseLayout.astro              # Remove lines 88-108, fix duplicate title logic
├── pages/[slug].astro                    # Fix broken images on listings
└── styles/global.css                     # Remove line 5, lines 31-32
site-config.json                          # features.darkMode: false
```

## Implementation Steps

### Step 1: Fix 6 UI Bugs (30 min)

**1.1 Broken images on listing pages**
```bash
# Investigate image paths in listing page rendering
grep -n "image\|img\|Picture" src/pages/[slug].astro
```
Fix: Ensure product-list/blog-list templates pass correct image paths to Card components. Check for missing fallback handling.

**1.2 Mobile header logo wrap**
Edit `src/components/layout/Header.astro`:
```astro
<!-- BEFORE: Logo text wraps poorly -->
<div class="flex items-center gap-2">
  <span class="text-xl font-bold">Vietnam Plywood - HCPLY</span>
</div>

<!-- AFTER: Truncate on mobile, show full on desktop -->
<div class="flex items-center gap-2">
  <span class="text-lg md:text-xl font-bold truncate max-w-[180px] md:max-w-none">
    Vietnam Plywood - HCPLY
  </span>
</div>
```

**1.3 Blog duplicate title**
Edit `src/layouts/BaseLayout.astro` or blog template:
- Check if hero section AND content both render h1 from frontmatter
- Keep hero h1, remove duplicate from content area

**1.4 FeatureGrid green square icons**
Edit `src/components/mdx/FeatureGrid.astro`:
```astro
<!-- BEFORE: Plain green squares -->
<div class="w-12 h-12 bg-primary-500 rounded-lg"></div>

<!-- AFTER: Icon container with actual icon rendering -->
<div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600
            rounded-lg flex items-center justify-center text-white text-2xl">
  {feature.icon || "✓"}
</div>
```

**1.5 Footer missing social links**
Edit `src/components/layout/Footer.astro`:
```astro
<!-- Add Facebook and YouTube from site-config.json -->
{config.social.facebook && (
  <a href={config.social.facebook} aria-label="Facebook">
    <!-- Facebook icon SVG -->
  </a>
)}
{config.social.youtube && (
  <a href={config.social.youtube} aria-label="YouTube">
    <!-- YouTube icon SVG -->
  </a>
)}
```

**1.6 Unstyled section headings**
Add to `src/styles/global.css`:
```css
/* Section heading defaults */
section h2 {
  @apply text-3xl md:text-4xl font-bold text-neutral-900 mb-4;
}

section h3 {
  @apply text-2xl md:text-3xl font-semibold text-neutral-800 mb-3;
}
```

Verify all fixes:
```bash
npm run dev
# Test: localhost:4321, check mobile responsive view
```

### Step 2: Kill Dark Mode Infrastructure (20 min)

**2.1 Delete ThemeToggle component**
```bash
rm src/components/ui/ThemeToggle.astro
```

**2.2 Remove ThemeToggle from Header**
Edit `src/components/layout/Header.astro`:
```astro
// Remove import line
- import ThemeToggle from '../ui/ThemeToggle.astro';

// Remove usage in navigation area (usually near mobile menu toggle)
- <ThemeToggle />
```

**2.3 Remove BaseLayout dark mode scripts**
Edit `src/layouts/BaseLayout.astro` — DELETE lines 88-108:
```astro
<!-- DELETE THIS ENTIRE BLOCK -->
<script is:inline>
  // Theme detection and toggle
  const theme = (() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  })();

  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  window.localStorage.setItem('theme', theme);
</script>
<!-- END DELETE -->
```

**2.4 Remove @custom-variant from global.css**
Edit `src/styles/global.css` line 5:
```css
/* DELETE THIS LINE */
- @custom-variant dark (&:where(.dark, .dark *));
```

**2.5 Remove dark: from body @apply**
Edit `src/styles/global.css` lines 31-32:
```css
/* BEFORE */
body {
  @apply font-body text-neutral-900 dark:text-neutral-100;
  @apply bg-neutral-50 dark:bg-neutral-950;
}

/* AFTER */
body {
  @apply font-body text-neutral-900 bg-neutral-50;
}
```

**2.6 Set features.darkMode: false**
Edit `site-config.json` line 51:
```json
"features": {
  "darkMode": false,
  "search": true,
  "blog": true,
  "products": true,
  "newsletter": true
}
```

### Step 3: Batch Remove dark: Classes (90 min)

**3.1 Identify all files with dark: classes**
```bash
# Get complete list
grep -rl "dark:" src/ --include="*.astro" > /tmp/dark-files.txt
wc -l /tmp/dark-files.txt  # Should show ~56 files
```

**3.2 High-priority manual fixes (files needing script/logic changes)**

**PricingTable.astro** — Remove toggle script + 14 dark: classes:
```bash
# Open file
vim src/components/mdx/PricingTable.astro
```
Delete entire `<script>` block that uses `classList.add/remove` for dark: classes (around lines 88-93).
Then regex replace all dark: classes in template.

**Navigation.astro / MobileMenu.astro** — Simplify ternary active states:
```astro
<!-- BEFORE -->
class={isActive ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-600'}

<!-- AFTER -->
class={isActive ? 'text-primary-600' : 'text-neutral-600'}
```

**3.3 Batch regex replace across remaining files**
```bash
# Use sed to remove all dark: classes (macOS version)
for file in $(cat /tmp/dark-files.txt); do
  # Regex: match space + dark:class-name pattern
  sed -i '' 's/ dark:[a-z-]*[a-z0-9/]*//g' "$file"
  echo "Cleaned: $file"
done
```

**Alternative (manual VSCode):**
1. Open VSCode search (Cmd+Shift+F)
2. Enable regex mode
3. Search: `\s+dark:[a-z-]+(-[a-z0-9/]+)*`
4. Replace: (empty)
5. Review matches, replace all in src/ only (skip plans/)

**3.4 Verify removals**
```bash
# Should return 0 files in src/
grep -rl "dark:" src/ --include="*.astro" | wc -l

# Check for missed ternary patterns
grep -rn "dark:" src/ --include="*.astro"
```

### Step 4: Test Build (10 min)

**4.1 Rebuild theme**
```bash
node scripts/generate-theme.mjs
# Should still output theme.css with :root vars (no .dark selector yet — that's Phase 2)
```

**4.2 Run dev server**
```bash
npm run dev
```
Check all 11 page types render correctly:
- Homepage (/)
- About page (/about-vietnam-plywood-factory)
- Product list (/products)
- Product detail (any /product-slug)
- Blog list (/blog)
- Blog post (any /blog-slug)
- Contact (/contact)
- Generic page
- Gallery page
- Reviews page
- Video hub page

**4.3 Production build**
```bash
npm run build
```
Verify:
- 0 errors
- 19 pages built
- Build time ~1.1s
- dist/ contains all expected HTML files

**4.4 Visual smoke test**
```bash
npm run preview
```
Navigate through pages, verify no dark mode remnants appear.

### Step 5: Commit Clean State (10 min)

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix: resolve 6 UI bugs and remove dark mode

Bug fixes:
- Fix broken images on product/blog listing pages
- Fix mobile header logo text wrapping
- Remove duplicate blog post title rendering
- Fix FeatureGrid green square icons (show actual icons)
- Add missing Facebook/YouTube social links to footer
- Apply consistent typography to section headings

Dark mode removal:
- Delete ThemeToggle component
- Remove BaseLayout dark mode detection scripts (lines 88-108)
- Remove @custom-variant dark from global.css
- Remove all 342 dark: class occurrences across 56 files
- Set features.darkMode: false in site-config.json
- Simplify Navigation/MobileMenu active state logic

No visual regression on light mode. Build: 0 errors, 19 pages, ~1.1s.
EOF
)"
```

## Todo List

- [ ] Fix broken images on listing pages
- [ ] Fix mobile header logo wrap
- [ ] Remove blog duplicate title
- [ ] Fix FeatureGrid green square icons
- [ ] Add Facebook/YouTube to footer
- [ ] Style section headings consistently
- [ ] Delete ThemeToggle.astro
- [ ] Remove ThemeToggle from Header.astro
- [ ] Remove BaseLayout dark scripts (lines 88-108)
- [ ] Remove @custom-variant dark from global.css (line 5)
- [ ] Remove dark: from body @apply (lines 31-32)
- [ ] Set features.darkMode: false in site-config.json
- [ ] Manual fix PricingTable.astro (script + 14 dark: classes)
- [ ] Manual fix Navigation/MobileMenu ternary states
- [ ] Batch remove dark: classes from remaining 54 files
- [ ] Verify 0 dark: occurrences in src/
- [ ] Run npm run build (verify 0 errors)
- [ ] Visual smoke test all 11 page types
- [ ] Commit changes

## Success Criteria

1. **All 6 bugs fixed:**
   - Images display on product/blog listings
   - Mobile header logo doesn't wrap
   - Blog posts show single title
   - FeatureGrid shows icons (not green squares)
   - Footer has all 4 social links
   - Section headings have consistent typography

2. **Dark mode fully removed:**
   - Zero dark: occurrences in src/ (grep returns 0 results)
   - ThemeToggle.astro deleted
   - BaseLayout dark scripts removed
   - @custom-variant dark removed
   - features.darkMode: false

3. **Build quality:**
   - npm run build: 0 errors, 19 pages
   - Dev server renders all page types
   - No console errors in browser
   - Light mode appearance unchanged

## Risk Assessment

**Low Risk:**
- Regex batch replace may miss complex ternary patterns → Manual review high-density files first
- PricingTable script removal may break pricing display → Test pricing pages specifically
- Navigation active states may lose hover effects → Verify menu interactions

**Mitigation:**
- Manual fix high-density files (PricingTable, Navigation) before batch regex
- Test all 11 page types in dev server before build
- Keep git commit separate from Phase 2 for easy rollback

## Next Steps

After Phase 1 complete:
- **Phase 2:** Update design-tokens.json (blue-grey secondary, gradient text tokens, section rhythm, light-only glass)
- **Phase 2:** Update generate-theme.mjs (remove .dark selector lines 57-61, add gradient text vars)

## Unresolved Questions

1. Are there client-side scripts outside BaseLayout/ThemeToggle that check `document.documentElement.classList.contains('dark')`?
   → Grep: `classList.*dark|\.dark\b` in .astro/.ts files before batch replace
2. Do any third-party integrations (analytics, chat widgets) depend on dark mode class?
   → Review integrations list in BaseLayout
