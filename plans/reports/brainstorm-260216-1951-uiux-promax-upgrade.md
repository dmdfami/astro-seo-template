# Brainstorm: UI/UX Pro Max Upgrade + Content Beautification

## Problem Statement

astro-seo-template has 47 functional MDX components but lacks premium visual polish. 240 dark: occurrences across 56 files add complexity without value (BỎ). ai-content-rewriter outputs MDX that uses basic components without visual rhythm awareness. Result: pages work but look generic/boring.

**Goal:** Transform template into pro-max level design + teach rewriter to output beautiful MDX.

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Execution | Song song, template lead | Build components → catalog → rewriter follows |
| Dark mode | REMOVE entirely | Simplify, light-only with section rhythm |
| New components | 5 new | Highlight, FloatingBadge, BentoGrid, SectionWrapper, ImageWithFallback |
| Existing upgrade | ALL 47 | Full consistency, breaking changes OK |
| Breaking changes | Full rewrite OK | Content rebuilt by ai-content-rewriter |
| Color strategy | Hybrid | Teal-green primary (brand) + blue-grey secondary (trust) |
| Font | Keep Inter | Already professional, no churn needed |
| BentoGrid scope | Everywhere | Available as MDX component in any page type |

## Architecture: Component Catalog Contract

```
docs/component-catalog.md (SINGLE SOURCE OF TRUTH)
       ↓                          ↓
astro-seo-template            ai-content-rewriter
(implements components)       (outputs correct MDX)
```

- Each component: API (props/variants) + MDX Usage Example + Rules (spacing, frequency)
- Template reads catalog → implements component
- Rewriter reads catalog → outputs MDX that uses component correctly
- When adding/changing component → update catalog → both sides auto-align

## Recommended Approach: 7 Phases

### Phase 1: Bug Fixes + Dark Mode Strip (Foundation)
- Fix 6 known UI bugs (broken images, mobile header, duplicate title, icons, footer, headings)
- Remove ALL dark: classes (240 occurrences, 56 files)
- Remove ThemeToggle component, dark mode scripts in BaseLayout
- Set `features.darkMode: false` in site-config.json
- Remove `@custom-variant dark` from global.css
- **Output:** Clean, light-only codebase ready for upgrade

### Phase 2: Design Token Upgrade
- Update design-tokens.json: hybrid palette (teal primary + blue-grey secondary)
- Add gradient tokens for text highlights, section backgrounds
- Add section rhythm tokens (alternating bg colors)
- Update generate-theme.mjs if needed for new token types
- Keep Inter font, optimize weight loading (400, 500, 600, 700)
- **Output:** Rich token set that drives all visual decisions

### Phase 3: 5 New Premium Components
- `Highlight` — gradient text spans for keywords: `<Highlight>FSC Certified</Highlight>`
- `FloatingBadge` — pill badges with variants: `<FloatingBadge variant="certification">ISO 9001</FloatingBadge>`
- `BentoGrid` — CSS grid with flexible cell sizes: `<BentoGrid cols={3}><BentoItem span={2}>...</BentoItem></BentoGrid>`
- `SectionWrapper` — alternating bg + padding: `<SectionWrapper bg="light" id="features">...</SectionWrapper>`
- `ImageWithFallback` — img tag with skeleton/placeholder on error
- Each component: configurable via design tokens, zero hardcoded brand values
- **Output:** 5 new premium components ready for MDX use

### Phase 4: Upgrade All 47 Existing Components
- **Tier 1 — High Impact (10):** Hero, Card, CardGrid, Stats, Testimonial, CTA, CTABlock, FAQ, Footer, Header
- **Tier 2 — Medium Impact (10):** Steps/Step, Timeline, Gallery, FeatureGrid, ProcessFlow, ContactForm, AuthorBox, Newsletter, Accordion, Tabs
- **Tier 3 — Low Impact (remaining 27):** Polish existing styles, remove dark: classes, ensure consistent spacing/radius/shadows
- Every component: remove dark: prefixes, use SectionWrapper-aware styling, honor design tokens
- **Output:** 47 upgraded components, all premium, all consistent

### Phase 5: Typography & Layout System
- Heading hierarchy: consistent sizes/weights/spacing across all page types
- Prose styling for long-form content (line-height, max-width, paragraph spacing)
- Section rhythm: automatic alternating backgrounds via SectionWrapper
- Responsive breakpoints: 375/768/1024/1440px tested
- **Output:** Beautiful long-form reading experience

### Phase 6: Component Catalog (Contract Document)
- Create `docs/component-catalog.md` with ALL 52 components (47 existing + 5 new)
- Each entry: Component Name, Props API, Variants, MDX Example, Placement Rules, Spacing Rules
- Reference format that both template dev and rewriter skill can parse
- **Output:** Single source of truth for component usage

### Phase 7: ai-content-rewriter Beautification Layer
- Update `references/visual-composition-guide.md` with premium component awareness
- Add Highlight usage rules: gradient text on 1-2 keywords per H2 section
- Add SectionWrapper rules: auto-alternate bg per major section
- Add FloatingBadge rules: certifications, social proof, trust signals
- Add BentoGrid rules: homepage/landing featured content
- Update component frequency matrix with new components
- Reference `docs/component-catalog.md` for correct MDX syntax
- **Output:** Rewriter outputs premium MDX automatically

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep (47 components + 5 new) | HIGH | Tier system, parallel by tier |
| Template-rewriter misalignment | MEDIUM | Catalog contract, template leads |
| Build breaks during dark mode strip | LOW | Regex batch replace, incremental commits |
| Design token changes break existing CSS | MEDIUM | Generate theme → test → fix cycle |
| Performance regression (too many effects) | LOW | CSS-only animations, no JS for layout |

## Success Criteria

1. `npm run build` — 0 errors, all 19+ pages render
2. Every page: no dark: classes remain
3. Lighthouse: Performance 90+, Accessibility 95+
4. Every component uses design tokens, zero hardcoded brand values
5. `docs/component-catalog.md` covers all 52 components
6. ai-content-rewriter outputs MDX that renders beautifully without manual tweaks

## Implementation Considerations

- **Parallel opportunity:** Phase 1-2 sequential (foundation), Phase 3-4 can parallel by tier, Phase 5-6 parallel, Phase 7 after 6
- **Estimated scope:** 47 component upgrades + 5 new + 6 bug fixes + dark mode strip + token upgrade + catalog + rewriter update
- **Design tokens are king:** Every visual decision flows from tokens. Change token = change entire site appearance
- **Reusability:** Swap site-config.json + design-tokens.json + schema-org.json = different plywood brand, same template
- **No hardcoded values:** Components read from config/tokens, NEVER embed brand name/colors/contact directly
