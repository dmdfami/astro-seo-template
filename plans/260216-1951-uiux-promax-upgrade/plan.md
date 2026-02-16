---
title: "UI/UX Pro Max Upgrade"
description: "Transform template to premium design + teach rewriter beautiful MDX output"
status: complete
priority: P1
effort: "20h"
branch: main
tags: [ui-ux, design-system, components, dark-mode-removal, content-beautification]
created: 2026-02-16
---

# UI/UX Pro Max Upgrade Implementation Plan

## Overview

Transform astro-seo-template from functional to premium with gradient text highlights, floating badges, bento grids, and section rhythm. Strip 342 dark: occurrences across 69 files. Build 5 new premium + 11 new utility components, upgrade all 47 existing. Create component catalog as contract between template and ai-content-rewriter skill. Total: 63 components.

**Goal:** "Long content that's still beautiful" — template leads, rewriter follows.

**Strategy:** Light-only design with section alternation. Hybrid color (teal-green primary + blue-grey secondary). CSS-only effects, zero hardcoded brand values. Breaking changes OK (content rebuilt by ai-content-rewriter).

## Related Files

- Brainstorm: `plans/reports/brainstorm-260216-1951-uiux-promax-upgrade.md`
- Research 01: `plans/260216-1951-uiux-promax-upgrade/research/researcher-01-premium-component-patterns.md`
- Research 02: `plans/260216-1951-uiux-promax-upgrade/research/researcher-02-darkmode-removal-token-upgrade.md`

## Phases

### Phase 1: Bug Fixes + Dark Mode Strip
**Status:** ✅ Complete | **Progress:** 100% | **Effort:** 3h
- Fix 6 known UI bugs (broken images, mobile header, duplicate title, icons, footer, headings)
- Remove all 342 dark: classes across 69 files
- Delete ThemeToggle component, BaseLayout dark scripts, @custom-variant dark
- Set features.darkMode: false in site-config.json
- [Details →](phase-01-bug-fixes-dark-mode-strip.md)

### Phase 2: Design Token Upgrade
**Status:** ✅ Complete | **Progress:** 100% | **Effort:** 2h
- Expand secondary palette to full 50-950 scale with blue-grey (hue 240)
- Add gradient text tokens (primary, teal-blue, accent)
- Add section rhythm spacing tokens (section-sm/md/lg, content-break)
- Fix glass tokens for light-only mode (opaque white, dark borders)
- Update generate-theme.mjs, remove .dark selector (lines 57-61)
- [Details →](phase-02-design-token-upgrade.md)

### Phase 3: 5 New Premium Components
**Status:** ✅ Complete | **Progress:** 100% | **Effort:** 3h
- Highlight — gradient text keyword highlights
- FloatingBadge — pill badges with variants (certification/trust/feature)
- BentoGrid + BentoItem — CSS Grid flexible layout
- SectionWrapper — alternating bg + padding automation
- ImageWithFallback — skeleton shimmer + onerror handling
- Register all 5 in astro.config.mjs AutoImport
- [Details →](phase-03-new-premium-components.md)

### Phase 4: Upgrade Existing + Create New Utility Components
**Status:** ✅ Complete | **Progress:** 100% | **Effort:** 7h
- Tier 1 (10 high-impact): Hero, Card, CardGrid, Stats, Testimonial, CTA, CTABlock, FAQ, Footer, Header
- Tier 2 (10 medium-impact): Steps/Step, Timeline, Gallery, FeatureGrid, ProcessFlow, ContactForm, AuthorBox, Newsletter, Accordion, Tabs
- Tier 3 (27 existing): Polish existing styles, ensure token consistency
- NEW: Create 11 utility components: Alert, Banner, Blockquote, Divider, List, Logo, Metric, Pagination, PricingCard, Quote, Table
- Remove all dark: prefixes, use design token CSS variables, consistent spacing/radius/shadows
- Component-to-component imports use relative paths (not auto-import)
- [Details →](phase-04-upgrade-existing-components.md)

### Phase 5: Typography & Layout System
**Status:** ✅ Complete | **Progress:** 100% | **Effort:** 1.5h
- Global prose styles for long-form content (line-height 1.6-1.75, max-width 65ch, paragraph spacing)
- Heading hierarchy (h1: 4xl-6xl bold, h2: 3xl-4xl semibold, h3: 2xl-3xl medium, h4: xl-2xl medium)
- Section rhythm (py-16/py-20/py-24, alternating via SectionWrapper)
- Responsive typography: CSS clamp() for headings (h1-h3), breakpoint-based for body
- Update global.css with prose-like base styles
- [Details →](phase-05-typography-layout-system.md)

### Phase 6: Component Catalog
**Status:** ✅ Complete | **Progress:** 100% | **Effort:** 1.5h
- Create docs/component-catalog.md — shared spec for template + rewriter
- Document all 63 components (47 existing + 5 premium + 11 utility)
- Each entry: name, props API, variants, MDX usage example, placement rules, spacing rules, frequency rules
- Group by category (Content, Data/Interactive, Product/Visual, Social/Trust, Premium, Utility)
- Parseable format for human + AI
- [Details →](phase-06-component-catalog.md)

### Phase 7: ai-content-rewriter Beautification
**Status:** ✅ Complete | **Progress:** 100% | **Effort:** 1h
- Update skill: ~/.claude/skills/ai-content-rewriter/references/visual-composition-guide.md
- Add premium component awareness (Highlight, FloatingBadge, BentoGrid, SectionWrapper, ImageWithFallback)
- Update component-per-page-type matrix with new components
- Add rules: gradient highlights 1-2 keywords/H2, SectionWrapper auto-alternate, FloatingBadge for certifications
- Reference docs/component-catalog.md for correct MDX syntax
- Update content-structure-templates.md with beautification patterns
- [Details →](phase-07-rewriter-beautification.md)

## Success Criteria

1. `npm run build` — 0 errors, all 19+ pages render
2. Every page: no dark: classes remain
3. Lighthouse: Performance 90+, Accessibility 95+
4. Every component uses design tokens, zero hardcoded brand values
5. docs/component-catalog.md covers all 52 components
6. ai-content-rewriter outputs MDX that renders beautifully without manual tweaks

## Risk Mitigation

- Scope creep (52 components): Tier system, parallel execution by tier
- Template-rewriter misalignment: Catalog contract, template leads
- Build breaks during dark mode strip: Regex batch replace, incremental commits
- Design token changes break CSS: Generate theme → test → fix cycle
- Performance regression: CSS-only animations, no JS for layout

## Validation Log

### Session 1 — 2026-02-16
**Trigger:** Initial plan creation validation
**Questions asked:** 6

#### Questions & Answers

1. **[Architecture]** Phase 2 thay đổi secondary từ orange (hue 40) sang blue-grey (hue 240). Hero gradient sẽ chuyển từ teal→orange thành teal→blue-grey. OK?
   - Options: OK teal→blue-grey | Giữ teal→orange cho Hero | Tùy ý design
   - **Answer:** Tùy ý design
   - **Rationale:** User trusts designer decision. No constraint on hero gradient color — pick what looks best.

2. **[Architecture]** Component-to-component imports: auto-import hay relative path?
   - Options: Relative imports trong components | Dùng auto-import cho tất cả | Không dùng Highlight trong components
   - **Answer:** Relative imports trong components
   - **Rationale:** Auto-import chỉ cho MDX content. .astro components import nhau qua relative path. Tránh circular dependency issues.

3. **[Scope]** Phase 4 Tier 3 lists phantom components (Alert, Banner, etc.) không tồn tại. Xử lý sao?
   - Options: Chỉ upgrade các tồn tại | Tạo luôn phantom comps | Review lại list
   - **Answer:** Tạo luôn phantom comps
   - **Rationale:** Creates complete component library for content beautification. Increases scope +3h.

4. **[Scope]** Cụ thể tạo NHỮNG COMPONENT NÀO?
   - Options: Content essentials only (3) | Full list (11) | Skip
   - **Answer:** Full list (11)
   - **Rationale:** All 11 utility components: Alert, Banner, Blockquote, Divider, List, Logo, Metric, Pagination, PricingCard, Quote, Table.

5. **[Architecture]** Phase 7 update ai-content-rewriter skill (ngoài project repo). Commit thế nào?
   - Options: Update trực tiếp, không commit | Copy catalog vào skill | Symlink
   - **Answer:** Update trực tiếp, không commit
   - **Rationale:** Skills không nằm trong git repo của project. Edit files directly.

6. **[Architecture]** Typography responsive approach?
   - Options: Breakpoint-based | CSS clamp() fluid | Mix cả hai
   - **Answer:** Mix cả hai
   - **Rationale:** CSS clamp() cho headings (h1-h3) fluid sizing. Breakpoint-based cho body text. Best visual result.

#### Confirmed Decisions
- Hero gradient: designer discretion — no hard constraint
- Component imports: relative for .astro-to-.astro, auto-import for MDX only
- 11 new utility components created (Alert through Table)
- Skill updates: direct edit, no git commit
- Typography: hybrid clamp + breakpoint approach

#### Action Items
- [x] Update plan.md effort: 16h → 20h (scope increase from 11 new utility components)
- [x] Update Phase 4: add 11 new utility components to scope
- [x] Update Phase 5: specify clamp for headings, breakpoint for body
- [x] Update Phase 6: 52 → 63 components in catalog
- [ ] Update phase-04 file: add 11 utility component specs
- [ ] Update phase-05 file: add clamp() heading examples
- [ ] Update phase-06 file: update component count to 63

#### Impact on Phases
- Phase 4: +3h effort, add 11 new utility component creation to Tier 3 scope
- Phase 5: Use clamp() for h1-h3 heading sizes, breakpoint for body/h4-h6
- Phase 6: Document 63 components instead of 52 (add Utility category)
