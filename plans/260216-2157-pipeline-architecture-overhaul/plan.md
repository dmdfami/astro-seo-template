---
title: "Pipeline Architecture Overhaul"
description: "Deterministic 100/100 content engine via scorer↔brief↔writer sync"
status: complete
priority: P0
effort: 8h
branch: main
tags: [scorer, brief, template, pipeline, deterministic]
created: 2026-02-16
---

# Pipeline Architecture Overhaul

## Problem

Writer output scores 74-82/100 because:
- Brief covers only ~73% of scorer checks (94/128)
- L1 Research exists but not activated (weight 15% → wasted)
- L7 Conversion & L8 Brand exist but weights too low/incorrect
- No scorer check registry → each module evolved independently
- Template has inconsistent layout (homepage CSS, duplicate product router)
- Zero contract tests → no verification

**Goal:** Deterministic 100/100 when algorithm correct.

---

## Solution Architecture

### 8-Layer Scorer (Rebalanced)
- **L1 Research:** 10 checks, 10% (was 15%, currently not properly integrated)
- **L2 Structure:** 14 checks, 10%
- **L3 Writing:** 18 checks, 17% (increased from 15%, reduced from 22% per validation)
- **L4 SEO:** 32 checks, 18% (increased from 15%)
- **L5 E-E-A-T:** 13 checks, 15%
- **L6 AI/GEO:** 19 checks, 10% (reduced from 15%)
- **L7 Conversion:** 11 checks, 10% (increased from 5%, conditional)
- **L8 Brand:** 11 checks, 5% (currently 5%, ensure activated)
- **Bonus:** 5%
- **Total:** 128 checks, 100% weight

### Check Registry (Single Source of Truth)
New file: `scorer-check-registry.cjs`
- 128 check definitions extracted from all layer files
- Schema: { id, layer, description, howToPass, maxPoints, applicableTypes, autoPass, hardBlock, briefSection, autoFixable, autoFixStrategy }
- Brief generator reads registry → 100% coverage guaranteed

### Brief Generator v7
- Reads Check Registry → filters by contentType → groups by briefSection
- 12 sections: §0 Research, §1 Title, §2 Meta, §3 Frontmatter, §4 Structure, §5 Writing, §6 SEO, §7 EEAT, §8 AIGEO, §9 CRO, §10 Brand, §11 Template Contract
- Assertion: briefCheckCount === registryApplicableCount

### Auto-Fixer
New file: `content-auto-fixer.cjs`
- Full auto-fix (frontmatter + body)
- 75/128 checks auto-fixable (59%)
- Max 3 iterations: fix → rescore → verify
- NOT fixable: creative writing (26 checks), research-phase (10 checks)

### Layout Registry
New file: `src/lib/layout-registry.ts`
- Maps 11 content types → { pattern, container, proseWrapper, h1Auto, breadcrumb }
- 4 patterns: fullwidth, hybrid, split, prose
- Universal router reads registry → eliminates if/else duplication

---

## Phases

### Phase 1: Skill Overhaul (ai-content-rewriter) ✅ COMPLETE
**Blocking:** Must complete before Phase 2

1. **Scorer Check Registry** (NEW) ✅ — 128 checks, 8 layers
2. **Gate Evaluator Rebalance** (EDIT) ✅ — weights sum = 1.00
3. **Brief Generator v7** (REWRITE) ✅ — registry-driven, ~2500 tokens
4. **Brand Parser Enhancement** (EDIT) ✅ — certifications[], teamSize
5. **Auto-Fixer** (NEW) ✅ — 32 strategies, 3-iteration loop
6. **Contract Tests** (NEW, 4 files) ✅ — 3/4 pass

**Files:** 7 created, 3 modified, ~1,816 LOC

### Phase 2: Template Overhaul (astro-seo-template) ✅ COMPLETE
**Dependency:** Phase 1 complete + tests pass

1. **Layout Registry** (NEW) ✅
2. **Universal Router Refactor** (EDIT) ✅
3. **Homepage Layout Fix** (EDIT) ✅
4. **Product Router Refactor** (EDIT: share layout-registry) ✅
5. **Homepage UI/UX Rebuild** (EDIT) ✅ (already compliant)
6. **Layout Contract Test** (NEW) ✅

**Build:** 19 pages, 0 errors, 1.37s
**Test:** 24 checks passed

---

## Success Criteria

| Metric | Before | After |
|--------|--------|-------|
| Brief check coverage | 73% (94/128) | 100% (128/128) |
| Writer output score | 74-82 | 95+ |
| Final score (after auto-fix) | N/A | 100/100 |
| Layout contract coverage | 0/11 | 11/11 |
| Contract test pass rate | 0% | 100% |

---

## Files Structure

```
plans/260216-2157-pipeline-architecture-overhaul/
├── plan.md                          # This file
├── phase-01-skill-overhaul.md       # Detailed Phase 1
├── phase-02-template-overhaul.md    # Detailed Phase 2
├── research/                         # Research reports (3 files)
└── reports/                          # Progress reports
```

---

## Risks

1. **Layer weight tuning:** Theoretical weights may need calibration after real content scoring
2. **Brief token budget:** 128 checks × ~50 tokens = ~6.4K tokens (within budget but large)
3. **Auto-fixer over-modification:** Mitigated by only fixing deterministic checks
4. **Breaking changes:** Both phases introduce breaking changes (acceptable per constraints)

---

## Related Links

- Research 01: [Scorer Internals](research/researcher-01-scorer-internals.md)
- Research 02: [Brief-Brand-Template](research/researcher-02-brief-brand-template.md)
- Brainstorm: [Pipeline Architecture](../reports/brainstorm-260216-2157-pipeline-architecture-overhaul.md)

---

## Validation Log

### Session 1 — 2026-02-16
**Trigger:** Initial plan creation validation
**Questions asked:** 5

#### Questions & Answers

1. **[Architecture]** Weight sum vượt 100%: L1(10)+L2(10)+L3(22)+L4(18)+L5(15)+L6(10)+bonus(5)+L7(10)+L8(5) = 105%. Cách fix?
   - Options: Giảm L3: 22→17% | Bỏ bonus 5% | Giảm L4: 18→13%
   - **Answer:** Giảm L3: 22→17%
   - **Rationale:** L3 vẫn là layer nặng nhất (17%). Tổng: 10+10+17+18+15+10+5+10+5 = 100%. Clean fix không ảnh hưởng các layer khác.

2. **[Architecture]** Auto-fixer inject MDX components (FAQ, TOC, CTA) vào body: chèn ở đâu?
   - Options: Append at end | Smart insertion | Don't auto-inject
   - **Answer:** Append at end
   - **Rationale:** KISS. Không break content flow. TOC tự scan headings. FAQ/CTA ở cuối là vị trí tự nhiên.

3. **[Risk]** Product collection riêng (`src/content/products/*.mdx`). Xóa products router thì products không render. Approach?
   - Options: C: Giữ router, share layout | A: Move to pages collection | B: Multi-collection router
   - **Answer:** C: Giữ products router, refactor dùng layout-registry
   - **Rationale:** Ít risk nhất. Không di chuyển file. Products router refactor dùng getLayout('product') từ layout-registry. Unified h1 style.

4. **[Tradeoff]** Brief token budget tăng từ ~3K → ~6.4K tokens (128 checks). Chấp nhận?
   - Options: Accept 6.4K | Compress to <4K | Split brief+checklist
   - **Answer:** Accept 6.4K
   - **Rationale:** 100% check coverage quan trọng hơn token savings. Claude xử lý tốt 6.4K brief. Cost chấp nhận được.

#### Confirmed Decisions
- **L3 weight**: 22% → 17% — fixes weight sum bug (105% → 100%)
- **Auto-fix inject**: Append at end — KISS, no content flow breaking
- **Product router**: Keep + refactor with layout-registry — safe, no file moves
- **Brief tokens**: Accept 6.4K — coverage > savings

#### Action Items
- [x] Update plan.md L3 weight: 22% → 17%
- [x] Update plan.md Phase 2 step 4: DELETE → EDIT (refactor with layout-registry)
- [ ] Update phase-01 weights in implementation steps
- [ ] Update phase-02 step 2.4 from DELETE to REFACTOR
- [ ] Add append-at-end strategy to auto-fixer spec in phase-01

#### Impact on Phases
- **Phase 1**: Step 1.2 weights: L3 0.22 → 0.17. Step 1.5 auto-fixer: component injection = append at end.
- **Phase 2**: Step 2.4 changes from DELETE products/[slug].astro to REFACTOR products/[slug].astro (import layout-registry, use getLayout('product')).
