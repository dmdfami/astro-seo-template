# Pipeline Architecture Overhaul - Implementation Plan
**Planner:** planner-260216-2230
**Date:** 2026-02-16 22:30
**Status:** Complete

---

## Summary

Created comprehensive implementation plan for Pipeline Architecture Overhaul to achieve deterministic 100/100 content scoring. Plan addresses scorer↔brief↔writer↔template sync gaps through Check Registry (single source of truth) and Layout Registry (deterministic rendering).

---

## Deliverables

### 1. Plan Overview
**File:** `plans/260216-2157-pipeline-architecture-overhaul/plan.md`

- YAML frontmatter: title, description, status, priority, effort (8h), branch, tags, created
- Problem statement: Brief covers 73% (94/128 checks), L1/L8 exist but not activated
- Solution: 8-layer scorer (rebalanced weights), Check Registry, Brief v7, Auto-Fixer, Layout Registry
- 2 phases: Phase 1 (Skill, 5h) → Phase 2 (Template, 3h)
- Success metrics: 100% check coverage, 95+ writer score, 100/100 after auto-fix

### 2. Phase 1: Skill Overhaul
**File:** `phase-01-skill-overhaul.md`

**6 deliverables:**
1. **Scorer Check Registry** (NEW: scorer-check-registry.cjs)
   - Extract 128 checks from 8 existing layer files
   - Schema: { id, layer, description, howToPass, maxPoints, applicableTypes, autoPass, hardBlock, briefSection, autoFixable, autoFixStrategy }
   - Target: <200 lines (data-only)

2. **Gate Evaluator Rebalance** (EDIT: scorer-config.cjs)
   - Update weights: L1=10%, L2=10%, L3=22%, L4=18%, L5=15%, L6=10%, L7=10%, L8=5%, bonus=5%
   - Was: L1=15%, L3=15%, L4=15%, L6=15%, L7=5%
   - Ensure L1 always scored (not optional), L7/L8 conditional per type
   - Validation: all weights sum to 1.00

3. **Brief Generator v7** (REWRITE: writing-brief-generator.cjs)
   - Read Check Registry → filter by contentType → group by briefSection
   - 12 sections: §0 Research, §1 Title, §2 Meta, §3 Frontmatter, §4 Structure, §5 Writing, §6 SEO, §7 EEAT, §8 AIGEO, §9 CRO, §10 Brand, §11 Template Contract
   - Coverage assertion: briefCheckCount === registryApplicableCount
   - Add missing: L1 Research (10), L7 CRO (7 missing), L8 Brand (3 missing)
   - Token budget: <7K tokens for 128 checks

4. **Brand Parser Enhancement** (EDIT: brand-profile-parser.cjs)
   - Add certifications[] field (extract from Company section: "Certifications: FSC, CARB P2...")
   - Add teamSize field (extract from Company section: "Employees: 100+...")
   - Needed for L8 checks: certification-mentions, team-credibility

5. **Auto-Fixer** (NEW: content-auto-fixer.cjs + strategies)
   - Input: content + scorer failed checks → Output: fixed content + report + final score
   - 75/128 checks auto-fixable (59%): frontmatter (47), structural (28)
   - NOT fixable: creative writing (26), research-phase (10)
   - Max 3 iterations: fix → rescore → verify
   - Modularize if >200 lines: orchestrator + strategies file

6. **Contract Tests** (NEW: 4 test files)
   - test-registry-completeness.cjs: verify 128 checks extracted
   - test-brief-coverage.cjs: verify 100% applicable checks in brief per type
   - test-auto-fixer-strategies.cjs: verify each strategy works
   - test-pipeline-e2e.cjs: mock content → score → auto-fix → assert improvement

**Blockers:** None
**Blocks:** Phase 2

---

### 3. Phase 2: Template Overhaul
**File:** `phase-02-template-overhaul.md`

**6 deliverables:**
1. **Layout Registry** (NEW: src/lib/layout-registry.ts)
   - Map 11 content types → { pattern, container, proseWrapper, h1Auto, breadcrumb }
   - 4 patterns: fullwidth, hybrid, split, prose
   - Export getLayout(contentType), isFullWidth(contentType)
   - Target: <100 lines (data-driven map)

2. **Universal Router Refactor** (EDIT: src/pages/[slug].astro)
   - Import layout-registry, replace hardcoded FULL_WIDTH_TYPES/PRODUCT_TYPES
   - Pattern-based switch: fullwidth/hybrid/split/prose
   - Unified H1: all h1Auto types use .heading-hero class
   - Target: <150 lines (no nested if/else)

3. **Homepage Layout Fix** (EDIT: src/pages/index.astro + src/styles/global.css)
   - Replace .homepage-content direct-child selectors (& > p) with deep selectors
   - Use :where() for zero specificity (component styles override)
   - Add prose wrapper to text-heavy sections
   - Target: <50 lines for .homepage-content CSS block

4. **Product Router Dedup** (DELETE: src/pages/products/[slug].astro)
   - Verify no unique logic vs universal router
   - Delete entire file (logic merged into universal router pattern='split')
   - Validate: product pages still render at flat URLs (/bintangor-plywood-vietnam/)

5. **Homepage UI/UX Rebuild** (EDIT: src/content/pages/home.mdx)
   - Rebuild per component catalog specs (docs/component-catalog.md)
   - Apply section rhythm: compact (py-16), standard (py-20), spacious (py-24)
   - Fix heading hierarchy: H1 (Hero), H2 (sections), H3 (subsections)
   - Component frequency: CTA (3), Testimonial (1-2), ProductGrid (1)
   - Verify component prop contracts (Hero MUST have title/subtitle/backgroundImage)
   - Remove animation duplication (ScrollReveal vs data-animate)

6. **Layout Contract Test** (NEW: tests/test-layout-registry.cjs)
   - Assert every content type has layout-registry entry
   - Validate pattern enum values
   - Validate required fields (h1Auto boolean, etc.)

**Blockers:** Phase 1 complete + tests pass
**Blocks:** None

---

## Architecture Highlights

### Check Registry (Phase 1)
Single source of truth for 128 checks across 8 layers:
- L1 Research (10): keyword, intent, competitors, gaps, YMYL
- L2 Structure (14): headings, TOC, images, components
- L3 Writing (18): readability, psychology, copywriting, AI phrase blacklist
- L4 SEO (32): keywords (11), technical (21)
- L5 E-E-A-T (13): experience, expertise, authority, trust
- L6 AI/GEO (19): citations (8), formatting (11)
- L7 Conversion (11): CTA, social proof, urgency, BJ Fogg proximity
- L8 Brand (11): voice, terminology, tone, contact info

### Brief Generator v7 (Phase 1)
```
Check Registry (128)
→ filter(contentType)
→ groupBy(briefSection)
→ format(howToPass)
→ Brief (12 sections, 100% coverage)
```

### Auto-Fixer (Phase 1)
```
Content + Failed Checks
→ filter(autoFixable)
→ apply(strategy)
→ rescore()
→ repeat (max 3 iterations)
→ Fixed Content (95+ → 100/100)
```

### Layout Registry (Phase 2)
4 patterns for 11 types:
- **Fullwidth:** landing, gallery, video-hub (MDX controls all)
- **Hybrid:** homepage (full-width + selective prose)
- **Split:** product (2-col hero + prose below)
- **Prose:** blog, generic, about, contact, lists, reviews (standard article)

---

## Key Corrections from Brainstorm

1. **L1/L8 layers EXIST:** scorer-layer-research.cjs and scorer-layer-brand.cjs already in codebase with 10+11 checks. Task is ACTIVATE + REBALANCE, not write from scratch.

2. **Current weights confirmed:** Default { L1:15%, L2:10%, L3:15%, L4:15%, L5:15%, L6:15%, bonus:5%, conversion:5%, brand:5% } from scorer-config.cjs line ~50.

3. **L7/L8 conditional:** Already run conditionally via scorer-composite-gate.cjs lines 50-76. Just need weight rebalance.

4. **Brief coverage 73% (not 65%):** Research showed 94/128 checks covered, updated in plan.

---

## File Structure

```
plans/260216-2157-pipeline-architecture-overhaul/
├── plan.md                          # Overview (<80 lines)
├── phase-01-skill-overhaul.md       # Phase 1 detailed (6 deliverables)
├── phase-02-template-overhaul.md    # Phase 2 detailed (6 deliverables)
├── research/
│   ├── researcher-01-scorer-internals.md       # 128 checks, layer architecture
│   └── researcher-02-brief-brand-template.md   # Coverage gaps, brand parser
└── reports/
    └── planner-260216-2230-implementation-plan.md  # This file
```

---

## Success Metrics

| Metric | Before | Target |
|--------|--------|--------|
| Brief check coverage | 73% (94/128) | 100% (128/128) |
| Writer output score | 74-82 | 95+ |
| Final score (after auto-fix) | N/A | 100/100 |
| Layout contract coverage | 0/11 types | 11/11 types |
| Contract test pass rate | 0% | 100% |

---

## Constraints Met

- ✅ **YAGNI:** No over-engineering, only what's needed for deterministic scoring
- ✅ **KISS:** Simple data structures (registry = array, layout = map)
- ✅ **DRY:** Single source of truth (Check Registry, Layout Registry)
- ✅ **Breaking changes OK:** Both phases introduce breaking changes (acceptable per user)
- ✅ **Modularization:** All files <200 lines (split if exceeds)
- ✅ **Phase 1 blocks Phase 2:** Sequential execution enforced

---

## Risks & Mitigations

**Phase 1 risks:**
- Registry extraction errors → Double-check 128 count, run completeness test
- Brief token overflow → Use bullet format, test on longest type
- Auto-fixer over-modification → Only fix deterministic checks, max 3 iterations

**Phase 2 risks:**
- Product router deletion breaks URLs → Test build before commit
- Homepage CSS breaks components → Use :where() for zero specificity
- Homepage rebuild regressions → Follow component catalog exactly

---

## Next Steps

1. **Immediate:** User reviews plan, approves or requests changes
2. **Phase 1 start:** Create Check Registry → update scorer-config → rewrite brief generator → add auto-fixer → run tests
3. **Phase 1 gate:** All 4 contract tests pass (100% green) before Phase 2
4. **Phase 2 start:** Create Layout Registry → refactor router → fix homepage CSS → delete duplicate → rebuild UI → test
5. **Phase 2 validation:** Build succeeds (19 pages), homepage scores 100/100 after auto-fixer
6. **Deployment:** Score all 24 pages + 146 blogs with new pipeline, regenerate content

---

## Unresolved Questions

1. **Weight calibration:** Theoretical weights (L1=10%, L3=22%, etc.) may need tuning after scoring 5-10 real pages. Plan for iteration?
2. **Auto-fixer component injection:** How to inject missing MDX components (FAQ, TOC) into existing body without breaking content flow? Need template/insertion point strategy.
3. **Brief token compression:** If 12 sections × 128 checks exceeds 7K tokens, should we compress howToPass text or group similar checks?
4. **L8 Brand check definitions:** 11 checks proposed but need validation against actual brand-profile-parser.cjs output format (certifications[], teamSize fields).
5. **Homepage animation system:** Keep ScrollReveal or data-animate? Plan says remove duplication but doesn't specify which to keep.

---

## Effort Breakdown

**Phase 1: 5h**
- 1.1 Check Registry: 1.5h (extract 128 checks from 8 files)
- 1.2 Gate Rebalance: 0.5h (update weights, validate sum)
- 1.3 Brief Generator v7: 1.5h (rewrite with registry reader)
- 1.4 Brand Parser: 0.5h (add 2 fields)
- 1.5 Auto-Fixer: 1.5h (orchestrator + strategies)
- 1.6 Contract Tests: 1h (4 test files)

**Phase 2: 3h**
- 2.1 Layout Registry: 0.5h (data map)
- 2.2 Universal Router: 1h (pattern-based refactor)
- 2.3 Homepage CSS: 0.5h (deep selectors)
- 2.4 Product Dedup: 0.25h (delete file)
- 2.5 Homepage Rebuild: 1h (follow catalog)
- 2.6 Layout Test: 0.25h (contract test)

**Total: 8h**

---

## Plan Completeness

✅ Overview plan.md with YAML frontmatter
✅ Phase 1 detailed (all sections per spec: Context, Overview, Insights, Requirements, Architecture, Files, Steps, Todo, Success, Risks, Security, Next)
✅ Phase 2 detailed (same sections)
✅ Research context integrated (3 files read)
✅ Brainstorm decisions incorporated
✅ CRITICAL CORRECTION applied (L1/L8 exist, activate not create)
✅ All constraints met (YAGNI/KISS/DRY, <200 lines, breaking changes OK)
✅ Sequential phases (Phase 1 blocks Phase 2)
✅ Contract tests defined (4 files)
✅ Success metrics quantified
✅ Risks assessed with mitigations
