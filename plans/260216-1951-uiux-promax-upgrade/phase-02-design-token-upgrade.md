# Phase 2: Design Token Upgrade

**Date:** 2026-02-16
**Priority:** P1 (Foundation)
**Status:** ✅ Complete
**Effort:** 2h

## Context Links

- Parent plan: [plan.md](plan.md)
- Previous phase: [phase-01-bug-fixes-dark-mode-strip.md](phase-01-bug-fixes-dark-mode-strip.md)
- Research: [researcher-02-darkmode-removal-token-upgrade.md](research/researcher-02-darkmode-removal-token-upgrade.md)

## Overview

Expand design token system to support premium UI patterns. Replace sparse orange secondary (3 shades) with full blue-grey palette (50-950). Add gradient text tokens for keyword highlights. Add section rhythm spacing for visual breaks. Redefine glass utilities for light-only mode. Update theme generation script.

**Why second:** Token changes affect all component work. Must define before building new components (Phase 3) or upgrading existing (Phase 4).

## Key Insights

- **Current secondary:** Orange hue 40, only 3 shades (50, 500, 900) — insufficient for UI range
- **Target secondary:** Blue-grey hue 240, full 50-950 scale — trust/professionalism for B2B
- **Gradient tokens missing:** Text highlights need dedicated gradient definitions (not bg gradients)
- **Section rhythm undefined:** No tokens for consistent py-16/py-20/py-24 section padding patterns
- **Glass broken for light mode:** Current rgba(255,255,255,0.08) assumes dark background — needs opaque white for light
- **generate-theme.mjs has .dark selector** (lines 57-61) — must remove after Phase 1

## Requirements

### Functional
1. Secondary palette expanded to 11 shades (50-950) with blue-grey hue ~240
2. Three gradient text tokens added (text-primary, text-teal-blue, text-accent)
3. Section rhythm spacing tokens added (section-sm/md/lg, content-break)
4. Glass tokens redefined for light mode (opaque white bg, dark borders)
5. generate-theme.mjs updated (remove .dark selector, add gradient text vars)
6. npm run build — 0 errors, theme.css regenerated correctly

### Non-Functional
1. OKLCH color space maintained for perceptual uniformity
2. All tokens remain CSS-variable based (no hardcoded values in components)
3. Backward compatible (existing var(--color-primary-600) refs unchanged)

## Architecture

### Token Changes (design-tokens.json)

**1. Replace secondary palette:**
```json
// BEFORE (3 shades, orange)
"secondary": {
  "50": "oklch(0.97 0.02 40)",
  "500": "oklch(0.74 0.17 40.24)",
  "900": "oklch(0.35 0.10 40)"
}

// AFTER (11 shades, blue-grey)
"secondary": {
  "50": "oklch(0.98 0.01 240)",
  "100": "oklch(0.95 0.02 240)",
  "200": "oklch(0.90 0.03 240)",
  "300": "oklch(0.82 0.05 240)",
  "400": "oklch(0.70 0.08 240)",
  "500": "oklch(0.58 0.10 240)",
  "600": "oklch(0.48 0.11 240)",
  "700": "oklch(0.38 0.09 240)",
  "800": "oklch(0.28 0.07 240)",
  "900": "oklch(0.20 0.05 240)",
  "950": "oklch(0.12 0.03 240)"
}
```

**2. Add gradient text tokens:**
```json
"gradients": {
  "hero": "linear-gradient(135deg, var(--color-primary-600), var(--color-secondary-500))",
  "card": "linear-gradient(135deg, var(--color-primary-900), var(--color-primary-800))",
  "accent": "linear-gradient(135deg, var(--color-accent-400), var(--color-accent-600))",

  // NEW: Text gradient tokens
  "text-primary": "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-400))",
  "text-teal-blue": "linear-gradient(135deg, var(--color-primary-600), var(--color-secondary-500))",
  "text-accent": "linear-gradient(135deg, var(--color-accent-500), var(--color-primary-500))"
}
```

**3. Add section rhythm tokens:**
```json
"spacing": {
  "xs": "0.5rem",
  "sm": "0.75rem",
  "md": "1rem",
  "lg": "1.5rem",
  "xl": "2rem",
  "2xl": "3rem",
  "3xl": "4rem",

  // NEW: Section rhythm tokens
  "section-sm": "4rem",
  "section-md": "6rem",
  "section-lg": "8rem",
  "content-break": "2.5rem"
}
```

**4. Fix glass for light mode:**
```json
// BEFORE (transparent white for dark bg)
"glass": {
  "bg": "rgba(255, 255, 255, 0.08)",
  "bgLight": "rgba(255, 255, 255, 0.15)",
  "border": "rgba(255, 255, 255, 0.18)",
  "blur": "12px"
}

// AFTER (opaque white for light bg)
"glass": {
  "bg": "rgba(255, 255, 255, 0.7)",
  "bgLight": "rgba(255, 255, 255, 0.85)",
  "border": "rgba(0, 0, 0, 0.08)",
  "blur": "12px"
}
```

### Script Changes (generate-theme.mjs)

**DELETE lines 45-46 and 57-61:**
```js
// DELETE these lines about dark mode
- // Runtime CSS vars for dark mode
- css += '/* Runtime-swappable tokens for dark mode */\n';

// DELETE entire .dark selector block
- css += '.dark {\n';
- css += '  --glass-bg: rgba(0, 0, 0, 0.3);\n';
- css += '  --glass-bg-light: rgba(255, 255, 255, 0.05);\n';
- css += '  --glass-border: rgba(255, 255, 255, 0.1);\n';
- css += '}\n';
```

**ADD gradient text vars after line 54:**
```js
css += ':root {\n';
css += `  --glass-bg: ${tokens.glass.bg};\n`;
css += `  --glass-bg-light: ${tokens.glass.bgLight};\n`;
css += `  --glass-border: ${tokens.glass.border};\n`;
css += `  --glass-blur: ${tokens.glass.blur};\n`;
css += `  --gradient-hero: ${tokens.gradients.hero};\n`;
css += `  --gradient-card: ${tokens.gradients.card};\n`;
css += `  --gradient-accent: ${tokens.gradients.accent};\n`;

// NEW: Add gradient text tokens
css += `  --gradient-text-primary: ${tokens.gradients['text-primary']};\n`;
css += `  --gradient-text-teal-blue: ${tokens.gradients['text-teal-blue']};\n`;
css += `  --gradient-text-accent: ${tokens.gradients['text-accent']};\n`;

css += '}\n\n';
```

## Related Code Files

```
design-tokens.json                        # UPDATE: secondary, gradients, spacing, glass
scripts/generate-theme.mjs                # UPDATE: remove .dark, add gradient text vars
src/styles/theme.css                      # REGENERATE: via generate-theme.mjs
src/styles/global.css                     # REVIEW: .glass utilities (may need update)
```

## Implementation Steps

### Step 1: Update design-tokens.json (30 min)

**1.1 Backup current tokens**
```bash
cp design-tokens.json design-tokens.json.backup
```

**1.2 Replace secondary palette**
Edit `design-tokens.json` lines 16-20:
```json
"secondary": {
  "50": "oklch(0.98 0.01 240)",
  "100": "oklch(0.95 0.02 240)",
  "200": "oklch(0.90 0.03 240)",
  "300": "oklch(0.82 0.05 240)",
  "400": "oklch(0.70 0.08 240)",
  "500": "oklch(0.58 0.10 240)",
  "600": "oklch(0.48 0.11 240)",
  "700": "oklch(0.38 0.09 240)",
  "800": "oklch(0.28 0.07 240)",
  "900": "oklch(0.20 0.05 240)",
  "950": "oklch(0.12 0.03 240)"
}
```

**Verification:** OKLCH chroma increases from 50→500 (0.01→0.10), then decreases 500→950 (0.10→0.03). Lightness decreases monotonically 50→950 (0.98→0.12).

**1.3 Add gradient text tokens**
Edit `design-tokens.json` lines 89-93 (gradients section):
```json
"gradients": {
  "hero": "linear-gradient(135deg, var(--color-primary-600), var(--color-secondary-500))",
  "card": "linear-gradient(135deg, var(--color-primary-900), var(--color-primary-800))",
  "accent": "linear-gradient(135deg, var(--color-accent-400), var(--color-accent-600))",
  "text-primary": "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-400))",
  "text-teal-blue": "linear-gradient(135deg, var(--color-primary-600), var(--color-secondary-500))",
  "text-accent": "linear-gradient(135deg, var(--color-accent-500), var(--color-primary-500))"
}
```

**Note:** `text-teal-blue` bridges brand (teal primary) with trust (blue secondary).

**1.4 Add section rhythm tokens**
Edit `design-tokens.json` lines 59-67 (spacing section):
```json
"spacing": {
  "xs": "0.5rem",
  "sm": "0.75rem",
  "md": "1rem",
  "lg": "1.5rem",
  "xl": "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
  "section-sm": "4rem",
  "section-md": "6rem",
  "section-lg": "8rem",
  "content-break": "2.5rem"
}
```

**Usage:**
- `section-sm` (4rem/64px): Compact sections (footer, CTA blocks)
- `section-md` (6rem/96px): Standard sections (features, testimonials)
- `section-lg` (8rem/128px): Hero sections, major dividers
- `content-break` (2.5rem/40px): Visual breaks in long-form content

**1.5 Fix glass tokens**
Edit `design-tokens.json` lines 83-88 (glass section):
```json
"glass": {
  "bg": "rgba(255, 255, 255, 0.7)",
  "bgLight": "rgba(255, 255, 255, 0.85)",
  "border": "rgba(0, 0, 0, 0.08)",
  "blur": "12px"
}
```

**Rationale:** Light mode backgrounds need opaque white glass (70-85% alpha) with dark borders for contrast. Dark mode glass used transparent white — opposite.

### Step 2: Update generate-theme.mjs (20 min)

**2.1 Remove dark mode comments and selector**
Edit `scripts/generate-theme.mjs`:

Delete lines 45-46:
```js
- // Runtime CSS vars for dark mode
- css += '/* Runtime-swappable tokens for dark mode */\n';
```

Change line 46 to:
```js
css += '/* Runtime CSS variables */\n';
```

Delete lines 57-61 (entire .dark block):
```js
- css += '.dark {\n';
- css += '  --glass-bg: rgba(0, 0, 0, 0.3);\n';
- css += '  --glass-bg-light: rgba(255, 255, 255, 0.05);\n';
- css += '  --glass-border: rgba(255, 255, 255, 0.1);\n';
- css += '}\n';
```

**2.2 Add gradient text variables**
After line 54 (after `--gradient-accent`), add:
```js
css += `  --gradient-text-primary: ${tokens.gradients['text-primary']};\n`;
css += `  --gradient-text-teal-blue: ${tokens.gradients['text-teal-blue']};\n`;
css += `  --gradient-text-accent: ${tokens.gradients['text-accent']};\n`;
```

**Final :root block should look like:**
```js
css += ':root {\n';
css += `  --glass-bg: ${tokens.glass.bg};\n`;
css += `  --glass-bg-light: ${tokens.glass.bgLight};\n`;
css += `  --glass-border: ${tokens.glass.border};\n`;
css += `  --glass-blur: ${tokens.glass.blur};\n`;
css += `  --gradient-hero: ${tokens.gradients.hero};\n`;
css += `  --gradient-card: ${tokens.gradients.card};\n`;
css += `  --gradient-accent: ${tokens.gradients.accent};\n`;
css += `  --gradient-text-primary: ${tokens.gradients['text-primary']};\n`;
css += `  --gradient-text-teal-blue: ${tokens.gradients['text-teal-blue']};\n`;
css += `  --gradient-text-accent: ${tokens.gradients['text-accent']};\n`;
css += '}\n\n';
```

### Step 3: Regenerate theme.css (5 min)

**3.1 Run theme generator**
```bash
node scripts/generate-theme.mjs
```

Expected output:
```
✅ Generated src/styles/theme.css from design-tokens.json
```

**3.2 Verify theme.css output**
```bash
# Check secondary palette expanded
grep "color-secondary" src/styles/theme.css | wc -l
# Should show 11 lines (50, 100, 200, ..., 950)

# Check gradient text tokens present
grep "gradient-text" src/styles/theme.css
# Should show 3 lines: text-primary, text-teal-blue, text-accent

# Check no .dark selector
grep "\.dark" src/styles/theme.css
# Should return 0 results
```

**3.3 Review generated theme.css**
Open `src/styles/theme.css`, verify structure:
```css
/* AUTO-GENERATED - DO NOT EDIT */
/* Run: node scripts/generate-theme.mjs */

@theme {
  --color-primary-50: oklch(...);
  /* ... primary 100-950 ... */
  --color-secondary-50: oklch(0.98 0.01 240);
  --color-secondary-100: oklch(0.95 0.02 240);
  /* ... secondary 200-950 ... */
  --color-accent-400: oklch(...);
  /* ... rest of @theme tokens ... */
}

/* Runtime CSS variables */
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

### Step 4: Test Token Changes (30 min)

**4.1 Visual regression test**
```bash
npm run dev
```

Check pages for unintended color shifts:
- **Hero gradient** (uses secondary-500) — should shift from orange→blue-grey
- **Glass utilities** (Header backdrop) — should remain visible with opaque white
- **No secondary color usage breaks** — grep for hardcoded secondary refs

**4.2 Find components using secondary colors**
```bash
grep -r "secondary" src/components/ --include="*.astro"
```

Review each match:
- `bg-secondary-*` classes — verify blue-grey works for context
- `text-secondary-*` classes — verify contrast meets WCAG AA
- Gradient refs — hero gradient should show teal→blue transition

**4.3 Test glass utilities**
Navigate to pages with glass effects:
- Header with backdrop blur (should remain visible on white bg)
- Any cards using `.glass` class
- Verify backdrop blur renders correctly

**4.4 Accessibility check**
```bash
# Use browser DevTools Lighthouse
# Check contrast ratios for secondary text colors
```

Verify:
- `text-secondary-600` on white: contrast ≥4.5:1 (WCAG AA)
- `text-secondary-700` on light-grey: contrast ≥4.5:1
- Glass border visible: `rgba(0,0,0,0.08)` shows subtle edge

### Step 5: Build Verification (15 min)

**5.1 Production build**
```bash
npm run build
```

Verify:
- 0 errors
- 0 warnings about missing CSS variables
- 19 pages built
- Build time ~1.1s (unchanged)

**5.2 Preview build**
```bash
npm run preview
```

Test critical paths:
- Homepage hero gradient (primary→secondary transition)
- Product cards (no broken secondary colors)
- Footer (glass bg if used)
- Navigation active states (no missing secondary shades)

**5.3 Check for broken variable references**
```bash
# Look for components hardcoding old secondary values
grep -r "oklch.*40\.24" src/components/
# Should return 0 results (old secondary-500 orange hue)

grep -r "secondary-[0-9]" src/components/ | grep -v "50\|100\|200\|300\|400\|500\|600\|700\|800\|900\|950"
# Should return 0 results (no invalid shades)
```

### Step 6: Commit Token Upgrade (10 min)

```bash
git add design-tokens.json scripts/generate-theme.mjs src/styles/theme.css
git commit -m "$(cat <<'EOF'
feat: upgrade design tokens for premium UI

Token changes:
- Expand secondary palette from 3 shades (orange) to 11 shades (blue-grey hue 240)
- Add gradient text tokens (text-primary, text-teal-blue, text-accent)
- Add section rhythm spacing (section-sm/md/lg, content-break)
- Fix glass tokens for light mode (opaque white bg, dark borders)

Script changes:
- Remove .dark selector from generate-theme.mjs
- Add gradient text CSS variables to :root output
- Update theme generation comments (remove dark mode refs)

All 19 pages build successfully. Hero gradient transitions from teal to blue-grey.
Glass utilities remain visible on light backgrounds.
EOF
)"
```

## Todo List

- [ ] Backup design-tokens.json
- [ ] Replace secondary palette (3→11 shades, orange→blue-grey)
- [ ] Add gradient text tokens (text-primary, text-teal-blue, text-accent)
- [ ] Add section rhythm tokens (section-sm/md/lg, content-break)
- [ ] Fix glass tokens for light mode
- [ ] Remove dark mode comments from generate-theme.mjs (lines 45-46)
- [ ] Remove .dark selector from generate-theme.mjs (lines 57-61)
- [ ] Add gradient text variables to generate-theme.mjs :root output
- [ ] Run node scripts/generate-theme.mjs
- [ ] Verify theme.css: 11 secondary shades, 3 gradient-text vars, no .dark selector
- [ ] Test dev server (check hero gradient, glass utilities)
- [ ] Find and review all components using secondary colors
- [ ] Check contrast ratios for secondary text colors
- [ ] Run npm run build (verify 0 errors)
- [ ] Preview build (test critical paths)
- [ ] Commit changes

## Success Criteria

1. **Token expansion complete:**
   - Secondary palette: 11 shades (50-950) with blue-grey hue 240
   - Gradient text tokens: 3 new (text-primary, text-teal-blue, text-accent)
   - Section rhythm: 4 new spacing tokens
   - Glass tokens: Light-mode compatible values

2. **Theme generation updated:**
   - generate-theme.mjs: No .dark selector code
   - theme.css: Contains all new tokens
   - :root block: 10 CSS variables (4 glass + 6 gradient)

3. **Build quality:**
   - npm run build: 0 errors, 0 warnings
   - All pages render with updated colors
   - Hero gradient shows teal→blue-grey transition
   - Glass utilities visible on light backgrounds

## Risk Assessment

**Medium Risk:**
- Secondary color change breaks existing component design intent → Review all secondary usage, adjust if needed
- Glass utilities become invisible on white bg → Test Header backdrop blur thoroughly
- Gradient hero/card tokens reference old secondary-500 → Verify gradient definitions updated in tokens.json

**Low Risk:**
- OKLCH browser support → Already using OKLCH, no change
- Spacing token conflicts with Tailwind → Named tokens (section-sm) don't conflict with numeric scale (p-4)

**Mitigation:**
- Grep all secondary color usage before build
- Visual test glass utilities on multiple page types
- Verify gradient token definitions reference new secondary palette

## Next Steps

After Phase 2 complete:
- **Phase 3:** Build 5 new premium components using new gradient text tokens
- **Phase 4:** Upgrade 47 existing components to use section rhythm and blue-grey secondary

## Unresolved Questions

1. Should hero gradient keep teal→orange for brand continuity, or switch to teal→blue-grey for cohesion?
   → Decision: Switch to blue-grey. Rationale: hybrid palette unifies nature (teal) + trust (blue-grey).
2. Do any components hardcode secondary-500 in inline styles (not Tailwind classes)?
   → Grep after token update: `style=.*secondary|oklch.*40\.24`
