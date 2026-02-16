# Brainstorm: Pipeline Architecture Overhaul — Deterministic 100/100 Content Engine

**Date:** 2026-02-16
**Status:** Agreed
**Scope:** ai-content-rewriter skill + astro-seo-template
**Delivery:** Single plan, 2 phases (Phase 1: Skill, Phase 2: Template)

---

## Problem Statement

Writer (Claude) viết content score chỉ 74-82/100 vì:
1. Brief chỉ cover ~65% scorer checks (83/128 target checks)
2. L1 Research + L8 Brand removed/incomplete → 21 checks absent
3. Template UI inconsistent: homepage CSS direct-child-only, product 2 routers, no layout contract
4. Zero contract tests → no verification brief↔scorer↔template sync

**Root cause:** No single source of truth. Each module (scorer, brief, template) evolved independently.

---

## Agreed Architecture

### 8-Layer Scorer System (restored)

| Layer | Name | Weight | Checks | Status |
|-------|------|--------|--------|--------|
| L1 | Research Quality | 10% | 10 | **RESTORE** (keyword research, intent, competitors, gaps) |
| L2 | Content Structure | 10% | 14 | Existing |
| L3 | Writing Quality | 22% | 18 | Existing |
| L4 | SEO Technical | 18% | 32 | Existing |
| L5 | E-E-A-T Signals | 15% | 13 | Existing |
| L6 | AI/GEO Optimization | 10% | 19 | Existing (weight reduced from 15%) |
| L7 | Conversion | 10% | 11 | Existing (conditional, weight reduced from 15%) |
| L8 | Brand Voice | 5% | 11 | **RESTORE** (voice, terminology, tone, contact info) |
| — | **TOTAL** | **100%** | **128** | — |

**Weight redistribution rationale:**
- L1 Research (10%): Foundation for all other layers. Without research context, writer flies blind.
- L6 AI/GEO (15% → 10%): Overlap with L3 writing quality (burstiness checked in both). Reduce to avoid double-penalty.
- L7 Conversion (15% → 10%): Only runs for conversion-focused types. Lower weight = less penalty variance.
- L8 Brand (5%): Soft layer — brand voice is subjective. Low weight avoids brittle scoring.

### Check Registry (Single Source of Truth)

New file: `scorer-check-registry.cjs`

```javascript
// Structure per check:
{
  id: "h-tag-hierarchy",           // Unique ID
  layer: "L2",                     // Layer
  description: "Valid heading hierarchy (no skipped levels)",
  howToPass: "Use H2 → H3 → H4 sequentially. Never skip H3 to H4.",
  maxPoints: 7.14,                 // Auto-calculated: 100 / layer_check_count
  applicableTypes: ["all"],        // Or specific types
  autoPass: [],                    // Types that auto-pass this check
  hardBlock: false,                // Instant BLOCK if failed
  briefSection: "STRUCTURE",       // Which brief section covers this
  autoFixable: true,               // Can auto-fixer handle this
  autoFixStrategy: "reorder-headings" // How to auto-fix
}
```

**Total: 128 entries.** Brief generator reads this registry → guarantees 100% coverage.

### Brief Generator v7

**Flow:**
```
Check Registry (128 checks)
    ↓ filter by contentType
    ↓ group by briefSection
    ↓ format as actionable rules
Brief (10 sections, 100% coverage)
    ↓
Writer (Claude) → ~95/100
    ↓
Scorer (8 layers) → identify fails
    ↓
Auto-Fixer → fix body + frontmatter → 100/100
```

**Key changes from v6:**
1. Reads Check Registry instead of hardcoded rules
2. Every scorer check ID appears in brief with `howToPass` instruction
3. New §0 "RESEARCH CONTEXT" section (L1 checks)
4. New §10 "BRAND VOICE" section (L8 checks)
5. Check count assertion: `brief.checkIds.length === registry.getByType(contentType).length`

### Auto-Fixer System

New file: `content-auto-fixer.cjs`

**Scope:** Full auto-fix (frontmatter + body)

**Fixable categories:**
- **Frontmatter:** canonical, robots, dates, schema, author fields, OG tags
- **Structure:** heading hierarchy reorder, TOC injection, FAQ section injection
- **SEO:** meta description length trim/expand, title length, keyword density adjustment
- **Links:** internal link injection from sitemap, external link from research sources
- **Components:** inject missing required MDX components (from registry)
- **Formatting:** paragraph splitting (>150w), sentence shortening (>50w), transition word injection

**NOT fixable (must come from writer):**
- Content quality: hooks, psychology triggers, copywriting formulas
- E-E-A-T: author credentials, first-hand experience, case studies
- Brand voice: tone, terminology specifics
- Creative writing: varied vocabulary, sentence diversity

**Strategy:**
1. Run scorer → get failed check IDs
2. Filter to `autoFixable: true` checks
3. Apply fix per `autoFixStrategy`
4. Re-run scorer → verify fix worked
5. Max 3 iterations (prevent infinite loop)
6. Report: fixed checks, remaining fails, final score

### Template Layout System

**New file: `src/lib/layout-registry.ts`**

```typescript
type LayoutPattern = 'fullwidth' | 'hybrid' | 'split' | 'prose';

const LAYOUT_REGISTRY: Record<ContentType, {
  pattern: LayoutPattern;
  container: 'none' | 'md' | 'lg' | 'xl';
  proseWrapper: boolean;
  h1Auto: boolean;
  breadcrumb: boolean;
}> = {
  homepage:     { pattern: 'hybrid', container: 'none', proseWrapper: false, h1Auto: false, breadcrumb: false },
  landing:      { pattern: 'fullwidth', container: 'none', proseWrapper: false, h1Auto: false, breadcrumb: false },
  gallery:      { pattern: 'fullwidth', container: 'none', proseWrapper: false, h1Auto: false, breadcrumb: true },
  'video-hub':  { pattern: 'fullwidth', container: 'none', proseWrapper: false, h1Auto: false, breadcrumb: true },
  product:      { pattern: 'split', container: 'lg', proseWrapper: true, h1Auto: true, breadcrumb: true },
  blog:         { pattern: 'prose', container: 'md', proseWrapper: true, h1Auto: true, breadcrumb: true },
  generic:      { pattern: 'prose', container: 'md', proseWrapper: true, h1Auto: true, breadcrumb: true },
  about:        { pattern: 'prose', container: 'md', proseWrapper: true, h1Auto: true, breadcrumb: true },
  contact:      { pattern: 'prose', container: 'md', proseWrapper: true, h1Auto: true, breadcrumb: true },
  'product-list': { pattern: 'prose', container: 'md', proseWrapper: true, h1Auto: true, breadcrumb: true },
  'blog-list':  { pattern: 'prose', container: 'md', proseWrapper: true, h1Auto: true, breadcrumb: true },
  reviews:      { pattern: 'prose', container: 'md', proseWrapper: true, h1Auto: true, breadcrumb: true },
};
```

**Template changes:**
1. **Remove** duplicate `src/pages/products/[slug].astro` (merge into universal router)
2. **Refactor** `src/pages/[slug].astro` to read from layout-registry
3. **Fix** homepage CSS: replace direct-child selectors with deep selectors + `.prose` class on text blocks
4. **Unified h1**: all auto-h1 types use `heading-hero` class

### Contract Tests

4 test files:

| Test | Verifies | Type |
|------|----------|------|
| `test-registry-completeness.cjs` | Every scorer check has registry entry | Unit |
| `test-brief-coverage.cjs` | Brief covers 100% checks per content type | Unit |
| `test-layout-registry.cjs` | Every content type has layout config | Unit |
| `test-pipeline-e2e.cjs` | Write → Score → Auto-fix → 100/100 | Integration |

---

## Deliverables

### Phase 1: Skill Overhaul (ai-content-rewriter)

| # | Deliverable | Files | Effort |
|---|-------------|-------|--------|
| 1.1 | Scorer Check Registry | `scorer-check-registry.cjs` (new) | Extract 128 checks from 8 layer files |
| 1.2 | L1 Research Layer | `scorer-layer-research.cjs` (new) | 10 checks: keyword, intent, competitors, gaps, YMYL |
| 1.3 | L8 Brand Layer | `scorer-layer-brand.cjs` (new) | 11 checks: voice, terminology, tone, contact, CTA style |
| 1.4 | Gate Evaluator Update | `scorer-gate-evaluator.cjs` (edit) | Add L1/L8 weights, rebalance percentages |
| 1.5 | Brief Generator v7 | `writing-brief-generator.cjs` (rewrite) | Read from Check Registry, 12 sections |
| 1.6 | Auto-Fixer | `content-auto-fixer.cjs` (new) | Full auto-fix with 3-iteration loop |
| 1.7 | Contract Tests | `tests/` (new, 4 files) | Registry completeness + brief coverage + e2e |

### Phase 2: Template Overhaul (astro-seo-template)

| # | Deliverable | Files | Effort |
|---|-------------|-------|--------|
| 2.1 | Layout Registry | `src/lib/layout-registry.ts` (new) | 11 types → 4 patterns map |
| 2.2 | Universal Router Refactor | `src/pages/[slug].astro` (edit) | Read from layout-registry |
| 2.3 | Homepage Layout Fix | `src/pages/index.astro` + `global.css` (edit) | Deep prose selectors, remove direct-child-only |
| 2.4 | Product Router Dedup | Delete `src/pages/products/[slug].astro` | Merge into universal router |
| 2.5 | Homepage UI/UX Rebuild | `home.mdx` + components (edit) | Per design system, no hotfixes |
| 2.6 | Layout Contract Test | `tests/test-layout-registry.cjs` (new) | Assert type→layout mapping |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| L1/L8 check design unvalidated | Score inflation/deflation | Start with low weight (10%+5%), tune after 10 pages scored |
| Auto-fixer over-modifies content | Breaks writer intent | Only fix deterministic checks, skip creative/voice checks |
| Brief too long (128 checks → huge prompt) | Token waste, writer confusion | Group checks by section, use bullet format, prune overlaps |
| Layout registry too rigid | New content types hard to add | Registry is just a map — add 1 entry per new type |
| Homepage CSS deep selectors | Performance concern | Specificity via `.homepage-content :where(p, h2, h3)` — zero specificity cost |

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Brief↔Scorer check coverage | 65% (83/128) | 100% (128/128) |
| Writer output score (before fix) | 74-82 | 95+ |
| Final score (after auto-fix) | N/A | 100/100 |
| Content types with layout contract | 0/11 | 11/11 |
| Contract test pass rate | 0% | 100% |

---

## Unresolved Questions

1. **L1 Research check definitions**: 10 checks proposed but not validated against actual research JSON format. Need to inspect research output to confirm check feasibility.
2. **L8 Brand check definitions**: 11 checks proposed but brand-profile-parser.cjs output format needs verification.
3. **Auto-fixer component injection**: How to inject missing MDX components (e.g., FAQ, TOC) into existing body without breaking content flow? Need template/insertion point strategy.
4. **Brief token budget**: 128 checks × ~50 tokens each = ~6400 tokens for brief. Acceptable? Or need compression?
5. **Weight tuning**: Layer weights (10/10/22/18/15/10/10/5) are theoretical. Need calibration with real content scoring.

---

## Next Steps

1. **If approved → `/plan` with this context** → detailed implementation plan with phases + tasks
2. Phase 1 (Skill) blocks Phase 2 (Template) — sequential execution
3. Each phase ends with contract test pass before proceeding
