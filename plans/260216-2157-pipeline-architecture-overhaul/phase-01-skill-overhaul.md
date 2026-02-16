---
phase: 1
title: "Skill Overhaul — ai-content-rewriter"
status: complete
priority: P0
effort: 5h
blockedBy: []
blocks: [phase-02]
---

# Phase 1: Skill Overhaul — ai-content-rewriter

## Context Links

- [Scorer Internals Research](research/researcher-01-scorer-internals.md) — 128 checks, layer architecture
- [Brief-Brand-Template Research](research/researcher-02-brief-brand-template.md) — Coverage gaps, brand parser
- [Brainstorm](../reports/brainstorm-260216-2157-pipeline-architecture-overhaul.md) — Agreed architecture
- [Development Rules](../../../docs/development-rules.md) — YAGNI/KISS/DRY principles

---

## Overview

**Priority:** P0 (blocks Phase 2)
**Status:** Pending
**Effort:** 5h

Refactor ai-content-rewriter skill to create deterministic pipeline: Check Registry → Brief Generator v7 → Auto-Fixer. Activate L1 Research + rebalance all 8 layers.

**Key principle:** Single source of truth (Check Registry) drives brief generation and auto-fix strategies.

---

## Key Insights

1. **L1/L8 layers exist but not activated:** scorer-layer-research.cjs and scorer-layer-brand.cjs exist with 10+11 checks, but L1 weight is misallocated (15% but not properly integrated), L8 often has 0% weight per type
2. **Current weights misaligned:** Default { L1:15%, L2:10%, L3:15%, L4:15%, L5:15%, L6:15%, bonus:5%, conversion:5%, brand:5% } → need rebalance to { L1:10%, L2:10%, L3:22%, L4:18%, L5:15%, L6:10%, L7:10%, L8:5%, bonus:5% }
3. **Brief coverage 73%:** writing-brief-generator.cjs covers 94/128 checks — missing L1 Research section, weak L7 CRO (4/11), partial L8 Brand (8/11)
4. **Brand parser incomplete:** Extracts `contacts` object but brief doesn't use it; certifications in profile but no dedicated field
5. **No auto-fixer exists:** Manual fixes only, no iteration loop

---

## Requirements

### Functional
- FR1: Check Registry with 128 entries (all checks from 8 layer files)
- FR2: Brief Generator reads registry, outputs 12 sections covering 100% applicable checks
- FR3: Auto-fixer handles 75/128 fixable checks, max 3 iterations
- FR4: Brand parser extracts certifications[] and teamSize fields
- FR5: Gate evaluator uses new weights: L1=10%, L2=10%, L3=17%, L4=18%, L5=15%, L6=10%, L7=10%, L8=5%, bonus=5%
<!-- Updated: Validation Session 1 - L3 weight 22% → 17% to fix 105% sum bug -->

### Non-Functional
- NFR1: Each new file <200 lines (modularize if exceeds)
- NFR2: Zero breaking changes to layer file exports (only config.cjs changes)
- NFR3: All contract tests pass before Phase 1 complete
- NFR4: Token efficiency: brief <7K tokens for 128 checks

---

## Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Check Registry (NEW)                     │
│  128 check definitions: { id, layer, howToPass, autoFix... }│
└────────┬────────────────────────────────────────────┬───────┘
         │                                            │
         ▼                                            ▼
┌────────────────────┐                     ┌──────────────────┐
│ Brief Generator v7 │                     │   Auto-Fixer     │
│ (REWRITE)          │                     │   (NEW)          │
│ - Read registry    │                     │ - Filter fixable │
│ - 12 sections      │                     │ - Apply strategy │
│ - 100% coverage    │                     │ - Max 3 iter     │
└────────────────────┘                     └──────────────────┘
         │                                            ▲
         ▼                                            │
    ┌─────────┐                                   ┌──┴───┐
    │ Writer  │ → Content → Scorer → Failed IDs → │ Loop │
    └─────────┘                                   └──────┘

Gate Evaluator (EDIT)
- Update scorer-config.cjs weights
- Ensure L1 always scored (not optional)
- L7/L8 conditional per content type
```

### Data Flow

1. **Check Registry Creation:**
   - Extract 128 check definitions from 8 existing layer files
   - Each check: `{ id: "h-tag-hierarchy", layer: "L2", description: "...", howToPass: "...", maxPoints: 7.14, applicableTypes: ["all"], autoPass: [], hardBlock: false, briefSection: "STRUCTURE", autoFixable: true, autoFixStrategy: "reorder-headings" }`
   - Export as `SCORER_CHECKS` array

2. **Brief Generation:**
   ```
   Check Registry (128)
   → filter(check.applicableTypes includes contentType OR "all")
   → filter(NOT in check.autoPass[contentType])
   → groupBy(check.briefSection)
   → format as actionable rules with check.howToPass
   → output 12 sections
   ```

3. **Auto-Fix Loop:**
   ```
   Input: content + scorerResult.failedChecks[]
   → Filter: checks where autoFixable === true
   → Apply: autoFixStrategy per check
   → Rescore: run scorer again
   → Repeat: max 3 times or score === 100
   → Output: { fixedContent, fixReport, finalScore, iterations }
   ```

---

## Related Code Files

### To Create
- `~/.claude/skills/ai-content-rewriter/scripts/lib/scorer-check-registry.cjs` (NEW)
- `~/.claude/skills/ai-content-rewriter/scripts/lib/content-auto-fixer.cjs` (NEW)
- `~/.claude/skills/ai-content-rewriter/scripts/lib/content-auto-fixer-strategies.cjs` (NEW, if >200 lines)
- `~/.claude/skills/ai-content-rewriter/tests/test-registry-completeness.cjs` (NEW)
- `~/.claude/skills/ai-content-rewriter/tests/test-brief-coverage.cjs` (NEW)
- `~/.claude/skills/ai-content-rewriter/tests/test-auto-fixer-strategies.cjs` (NEW)
- `~/.claude/skills/ai-content-rewriter/tests/test-pipeline-e2e.cjs` (NEW)

### To Edit
- `~/.claude/skills/ai-content-rewriter/scripts/lib/scorer-config.cjs` (EDIT: contentTypeWeights)
- `~/.claude/skills/ai-content-rewriter/scripts/lib/writing-brief-generator.cjs` (REWRITE: read registry)
- `~/.claude/skills/ai-content-rewriter/scripts/lib/brand-profile-parser.cjs` (EDIT: add certifications[], teamSize)

### Reference Only (No Changes)
- `~/.claude/skills/ai-content-rewriter/scripts/lib/scorer-layer-research.cjs` (L1, 10 checks)
- `~/.claude/skills/ai-content-rewriter/scripts/lib/scorer-layer-structure.cjs` (L2, 14 checks)
- `~/.claude/skills/ai-content-rewriter/scripts/lib/scorer-layer-writing.cjs` (L3, 18 checks)
- `~/.claude/skills/ai-content-rewriter/scripts/lib/scorer-layer-seo-keyword-checks.cjs` (L4a, 11 checks)
- `~/.claude/skills/ai-content-rewriter/scripts/lib/scorer-layer-seo-technical-checks.cjs` (L4b, 21 checks)
- `~/.claude/skills/ai-content-rewriter/scripts/lib/scorer-layer-eeat.cjs` (L5, 13 checks)
- `~/.claude/skills/ai-content-rewriter/scripts/lib/scorer-layer-ai-geo-citation-checks.cjs` (L6a, 8 checks)
- `~/.claude/skills/ai-content-rewriter/scripts/lib/scorer-layer-ai-geo-format-checks.cjs` (L6b, 11 checks)
- `~/.claude/skills/ai-content-rewriter/scripts/lib/scorer-layer-conversion.cjs` (L7, 11 checks)
- `~/.claude/skills/ai-content-rewriter/scripts/lib/scorer-layer-brand.cjs` (L8, 11 checks)
- `~/.claude/skills/ai-content-rewriter/scripts/lib/scorer-composite-gate.cjs` (uses weights from config)

---

## Implementation Steps

### 1.1 Scorer Check Registry (NEW)

**File:** `scorer-check-registry.cjs`

**Steps:**
1. Create registry file with module structure
2. Extract 10 checks from `scorer-layer-research.cjs` → L1 array
3. Extract 14 checks from `scorer-layer-structure.cjs` → L2 array
4. Extract 18 checks from `scorer-layer-writing.cjs` → L3 array
5. Extract 32 checks from `scorer-layer-seo-*.cjs` (11+21) → L4 array
6. Extract 13 checks from `scorer-layer-eeat.cjs` → L5 array
7. Extract 19 checks from `scorer-layer-ai-geo-*.cjs` (8+11) → L6 array
8. Extract 11 checks from `scorer-layer-conversion.cjs` → L7 array
9. Extract 11 checks from `scorer-layer-brand.cjs` → L8 array
10. For each check, populate schema: `{ id, layer, description, howToPass, maxPoints, applicableTypes, autoPass, hardBlock, briefSection, autoFixable, autoFixStrategy }`
11. Export as flat array: `module.exports = SCORER_CHECKS;`
12. Export helper: `getByLayer(layer)`, `getByType(contentType)`, `getBriefSections(contentType)`
13. Verify total count === 128

**Schema example:**
```javascript
{
  id: "h-tag-hierarchy",
  layer: "L2",
  description: "Valid heading hierarchy (no skipped levels)",
  howToPass: "Use H2 → H3 → H4 sequentially. Never skip H3 to H4.",
  maxPoints: 7.14,
  applicableTypes: ["all"],
  autoPass: [],
  hardBlock: false,
  briefSection: "§4 STRUCTURE",
  autoFixable: true,
  autoFixStrategy: "reorder-headings"
}
```

**Target:** <200 lines (data-only, no logic)

---

### 1.2 Gate Evaluator Rebalance (EDIT)

**File:** `scorer-config.cjs`

**Steps:**
1. Find `contentTypeWeights` object (currently line ~50)
2. Update `default` entry weights:
   ```javascript
   default: {
     L1: 0.10,  // was 0.15
     L2: 0.10,  // unchanged
     L3: 0.17,  // was 0.15 (reduced from 0.22 per validation)
     L4: 0.18,  // was 0.15
     L5: 0.15,  // unchanged
     L6: 0.10,  // was 0.15
     bonus: 0.05, // unchanged
     conversion: 0.10, // was 0.05 (L7)
     brand: 0.05 // unchanged (L8)
   }
   ```
3. Verify sum === 1.00 (10+10+17+18+15+10+5+10+5 = 100% ✓)
<!-- Updated: Validation Session 1 - Weights verified at 100% after L3 fix -->
5. Update all content type weight entries (landing, homepage, product, etc.) with same ratios
6. Add comment: `// v5.5 rebalance: L1=10% (activated), L3/L4 increased, L6 reduced, L7 increased`
7. Test: run scorer with new weights, verify no errors

**Validation:**
```javascript
// Add at bottom of contentTypeWeights:
Object.values(contentTypeWeights).forEach(w => {
  const sum = (w.L1||0) + (w.L2||0) + (w.L3||0) + (w.L4||0) + (w.L5||0) + (w.L6||0) + (w.bonus||0) + (w.conversion||0) + (w.brand||0);
  if (Math.abs(sum - 1.0) > 0.001) throw new Error(`Weight sum ${sum} !== 1.0`);
});
```

---

### 1.3 Brief Generator v7 (REWRITE)

**File:** `writing-brief-generator.cjs`

**Current:** 10 sections, hardcoded rules, ~2-3K tokens, 94/128 coverage
**Target:** 12 sections, registry-driven, <7K tokens, 128/128 coverage

**Steps:**
1. Import Check Registry: `const CHECKS = require('./scorer-check-registry.cjs');`
2. Replace section generation with registry reader
3. New structure:
   ```javascript
   class BriefGenerator {
     constructor(contentType, research, brandProfile) {
       this.contentType = contentType;
       this.applicableChecks = CHECKS.getByType(contentType);
       this.sections = CHECKS.getBriefSections(contentType);
     }

     generate() {
       return [
         this._section0_research(),      // L1: 10 checks
         this._section1_title(),         // L4 title checks
         this._section2_meta(),          // L4 meta checks
         this._section3_frontmatter(),   // L4 schema/FM checks
         this._section4_structure(),     // L2: 14 checks
         this._section5_writing(),       // L3: 18 checks
         this._section6_seo(),           // L4: keyword checks
         this._section7_eeat(),          // L5: 13 checks
         this._section8_aigeo(),         // L6: 19 checks
         this._section9_cro(),           // L7: 11 checks
         this._section10_brand(),        // L8: 11 checks
         this._section11_template()      // Template contract
       ].join('\n\n');
     }

     _section0_research() {
       const checks = this.applicableChecks.filter(c => c.briefSection === '§0 RESEARCH');
       return `## §0 RESEARCH CONTEXT\n${checks.map(c => `- ${c.howToPass}`).join('\n')}`;
     }

     // ... similar for other sections
   }
   ```
4. Each section reads `check.howToPass` from registry and formats as bullet list
5. Add L7 CRO section with 7 missing checks: cta-distribution, urgency-signals, friction-reducers, micro-commitment, price-anchoring, objection-handling, benefit-over-feature
6. Add L8 Brand section with 3 missing checks: contact-info, certification-mentions, team-credibility
7. Add §11 Template Contract section:
   ```
   ## §11 TEMPLATE CONTRACT
   - ContentType: {contentType}
   - H1 injection: {h1Auto from layout-registry}
   - MDX start level: H2 (if h1Auto) or H1
   - Hero required: {heroRequired per type}
   - CTA placement: {per content type}
   - Image paths: /images/wp-content/uploads/image-v1w/{category}/{slug}/
   ```
8. Add assertion at end: `if (generatedCheckCount !== this.applicableChecks.length) throw new Error(...)`
9. Test: generate brief for 'blog' type, verify all 128 checks covered

**Token budget:** 128 checks × ~50 tokens = ~6.4K tokens (acceptable)

---

### 1.4 Brand Parser Enhancement (EDIT)

**File:** `brand-profile-parser.cjs`

**Steps:**
1. Find `_emptyProfile()` function (line ~250)
2. Add two new fields:
   ```javascript
   certifications: [],  // Extract from Company section
   teamSize: ''        // Extract from Company section
   ```
3. Find Company section parsing logic (line ~55)
4. Add extraction after existing `_extractBullet` calls:
   ```javascript
   // Extract certifications
   const certsLine = _extractBullet(companySection, 'Certifications');
   if (certsLine) {
     result.certifications = certsLine.split(',').map(c => c.trim());
   }

   // Extract team size
   const teamLine = _extractBullet(companySection, 'Employees');
   if (teamLine) {
     result.teamSize = teamLine;
   }
   ```
5. Update JSDoc return type to include new fields
6. Test: parse brand-profile.md (line 11 has "FSC, CARB P2, CE, ISO 9001"), verify `certifications` array populated

**Example output:**
```javascript
{
  brandName: 'Vietnam Plywood',
  certifications: ['FSC', 'CARB P2', 'CE', 'ISO 9001'],
  teamSize: '100+ skilled workers',
  // ... other fields
}
```

---

### 1.5 Auto-Fixer (NEW)

**File:** `content-auto-fixer.cjs`

**Scope:** 75/128 auto-fixable checks

**Steps:**
1. Create class `ContentAutoFixer`
2. Constructor: `constructor(content, scorerResult, checkRegistry, options = {})`
3. Method: `fix() → { fixedContent, fixReport, finalScore, iterations }`
4. Main loop:
   ```javascript
   fix() {
     let current = this.content;
     let iteration = 0;
     const maxIterations = 3;
     const fixLog = [];

     while (iteration < maxIterations) {
       const failed = this._getFailedFixableChecks();
       if (failed.length === 0) break;

       for (const check of failed) {
         const strategy = STRATEGIES[check.autoFixStrategy];
         if (!strategy) continue;

         current = strategy.apply(current, check, this.options);
         fixLog.push({ iteration, check: check.id, strategy: check.autoFixStrategy });
       }

       // Rescore
       const newResult = this._rescore(current);
       if (newResult.composite >= 100) break;

       iteration++;
     }

     return { fixedContent: current, fixReport: fixLog, finalScore: this._rescore(current).composite, iterations: iteration };
   }
   ```
5. Implement fixable categories:
   - **Frontmatter fixes** (47 checks): canonical, robots, dates, schema, author, OG tags
   - **Structural fixes** (28 checks): heading reorder, TOC inject, FAQ inject, conclusion inject
   - **Component injection strategy**: APPEND at end of body (per validation — KISS, no content flow breaking)
<!-- Updated: Validation Session 1 - Component injection = append at end -->
   - **SEO fixes**: meta length trim, title adjust, keyword density
   - **Link injection**: internal links from sitemap, external from research
   - **Component injection**: required MDX components per type
   - **Formatting**: paragraph split (>150w), sentence split (>50w), transition words
6. Extract strategies to separate file if >200 lines: `content-auto-fixer-strategies.cjs`
7. Strategy interface:
   ```javascript
   const STRATEGIES = {
     'reorder-headings': (content, check, opts) => { /* ... */ },
     'add-toc': (content, check, opts) => { /* ... */ },
     'trim-meta-description': (content, check, opts) => { /* ... */ },
     // ... 75 strategies
   };
   ```
8. Test: apply to sample content with 20 failed fixable checks, verify fixes applied

**NOT fixable (26 checks):**
- L3 creative: hooks, psychology triggers, copywriting formulas, varied vocabulary, rhythm
- L5 E-E-A-T: first-hand experience, case studies, author credentials (content quality)
- L8 Brand voice: tone, terminology (subjective)

**Modularization:** If file exceeds 200 lines, split:
- `content-auto-fixer.cjs` (orchestrator, <200 lines)
- `content-auto-fixer-strategies.cjs` (75 strategies, data-driven)

---

### 1.6 Contract Tests (NEW)

Create 4 test files in `~/.claude/skills/ai-content-rewriter/tests/`:

#### Test 1: `test-registry-completeness.cjs`
**Verifies:** Every layer check exists in registry

```javascript
const CHECKS = require('../scripts/lib/scorer-check-registry.cjs');
const assert = require('assert');

// Expected counts per layer
const EXPECTED = { L1: 10, L2: 14, L3: 18, L4: 32, L5: 13, L6: 19, L7: 11, L8: 11 };

for (const [layer, count] of Object.entries(EXPECTED)) {
  const layerChecks = CHECKS.getByLayer(layer);
  assert.strictEqual(layerChecks.length, count, `${layer} should have ${count} checks, got ${layerChecks.length}`);
}

// Total
assert.strictEqual(CHECKS.length, 128, `Total checks should be 128, got ${CHECKS.length}`);

console.log('✓ Registry completeness test passed');
```

#### Test 2: `test-brief-coverage.cjs`
**Verifies:** Brief covers 100% applicable checks per content type

```javascript
const BriefGenerator = require('../scripts/lib/writing-brief-generator.cjs');
const CHECKS = require('../scripts/lib/scorer-check-registry.cjs');
const assert = require('assert');

const TYPES = ['blog', 'product', 'landing', 'homepage', 'about'];

for (const type of TYPES) {
  const applicableChecks = CHECKS.getByType(type);
  const brief = new BriefGenerator(type, {}, {}).generate();

  // Count check IDs mentioned in brief
  const mentionedIds = applicableChecks.filter(c => brief.includes(c.id) || brief.includes(c.howToPass));

  assert.strictEqual(mentionedIds.length, applicableChecks.length,
    `${type}: brief should cover ${applicableChecks.length} checks, covered ${mentionedIds.length}`);
}

console.log('✓ Brief coverage test passed');
```

#### Test 3: `test-auto-fixer-strategies.cjs`
**Verifies:** Each strategy works on sample input

```javascript
const STRATEGIES = require('../scripts/lib/content-auto-fixer-strategies.cjs');
const assert = require('assert');

// Test reorder-headings strategy
const sample1 = '## H2\n#### H4 (skipped H3)';
const fixed1 = STRATEGIES['reorder-headings'](sample1, {}, {});
assert(fixed1.includes('### H3'), 'Should fix skipped heading');

// Test add-toc strategy
const sample2 = 'Long content 2000+ words without TOC...';
const fixed2 = STRATEGIES['add-toc'](sample2, {}, {});
assert(fixed2.includes('<TOC'), 'Should inject TOC component');

// ... test each fixable strategy

console.log('✓ Auto-fixer strategies test passed');
```

#### Test 4: `test-pipeline-e2e.cjs`
**Verifies:** Write → Score → Auto-fix → 100/100

```javascript
const { runScorer } = require('../scripts/lib/content-scorer-engine.cjs');
const ContentAutoFixer = require('../scripts/lib/content-auto-fixer.cjs');
const assert = require('assert');

// Mock content with known fixable issues
const mockContent = `
---
title: Test
---
# H1
#### H4 (skipped H3)
Paragraph over 150 words...
No FAQ section.
`;

// Score
const result1 = runScorer(mockContent, { contentType: 'blog' });
assert(result1.composite < 100, 'Initial score should be < 100');

// Auto-fix
const fixer = new ContentAutoFixer(mockContent, result1, {});
const { fixedContent, finalScore } = fixer.fix();

// Rescore
assert(finalScore >= 95, `Final score should be >= 95, got ${finalScore}`);

console.log('✓ Pipeline e2e test passed');
```

**Run command:**
```bash
cd ~/.claude/skills/ai-content-rewriter
node tests/test-registry-completeness.cjs
node tests/test-brief-coverage.cjs
node tests/test-auto-fixer-strategies.cjs
node tests/test-pipeline-e2e.cjs
```

---

## Todo List

### 1.1 Scorer Check Registry
- [ ] Create `scorer-check-registry.cjs` file structure
- [ ] Extract L1 checks (10) from scorer-layer-research.cjs
- [ ] Extract L2 checks (14) from scorer-layer-structure.cjs
- [ ] Extract L3 checks (18) from scorer-layer-writing.cjs
- [ ] Extract L4 checks (32) from scorer-layer-seo-*.cjs
- [ ] Extract L5 checks (13) from scorer-layer-eeat.cjs
- [ ] Extract L6 checks (19) from scorer-layer-ai-geo-*.cjs
- [ ] Extract L7 checks (11) from scorer-layer-conversion.cjs
- [ ] Extract L8 checks (11) from scorer-layer-brand.cjs
- [ ] Add helper functions: getByLayer, getByType, getBriefSections
- [ ] Verify total count === 128

### 1.2 Gate Evaluator Rebalance
- [ ] Open scorer-config.cjs
- [ ] Update default weights: L1=10%, L3=22%, L4=18%, L6=10%, conversion=10%
- [ ] Update all content type weight entries
- [ ] Add weight sum validation
- [ ] Test scorer runs without errors

### 1.3 Brief Generator v7
- [ ] Create new BriefGenerator class structure
- [ ] Import Check Registry
- [ ] Implement _section0_research() (L1)
- [ ] Implement _section4_structure() (L2)
- [ ] Implement _section5_writing() (L3)
- [ ] Implement _section6_seo() (L4)
- [ ] Implement _section7_eeat() (L5)
- [ ] Implement _section8_aigeo() (L6)
- [ ] Implement _section9_cro() (L7) — add 7 missing checks
- [ ] Implement _section10_brand() (L8) — add 3 missing checks
- [ ] Implement _section11_template() (template contract)
- [ ] Add coverage assertion
- [ ] Test brief generation for all content types

### 1.4 Brand Parser Enhancement
- [ ] Open brand-profile-parser.cjs
- [ ] Add certifications[] field to _emptyProfile()
- [ ] Add teamSize field to _emptyProfile()
- [ ] Extract certifications from Company section
- [ ] Extract team size from Company section
- [ ] Update JSDoc
- [ ] Test with brand-profile.md

### 1.5 Auto-Fixer
- [ ] Create content-auto-fixer.cjs class structure
- [ ] Implement fix() main loop (max 3 iterations)
- [ ] Implement _getFailedFixableChecks()
- [ ] Implement _rescore()
- [ ] Create content-auto-fixer-strategies.cjs
- [ ] Implement frontmatter fix strategies (47)
- [ ] Implement structural fix strategies (28)
- [ ] Test auto-fixer with sample content

### 1.6 Contract Tests
- [ ] Create tests/ directory
- [ ] Write test-registry-completeness.cjs
- [ ] Write test-brief-coverage.cjs
- [ ] Write test-auto-fixer-strategies.cjs
- [ ] Write test-pipeline-e2e.cjs
- [ ] Run all tests, verify 100% pass

---

## Success Criteria

1. **Registry completeness:** 128 checks extracted, `getByType()` returns correct count for each content type
2. **Weight rebalance:** scorer-config.cjs updated, all weights sum to 1.00, no errors on scorer run
3. **Brief coverage:** BriefGenerator outputs 12 sections covering 100% applicable checks (verified by test)
4. **Brand parser:** Extracts certifications[] and teamSize from brand profile
5. **Auto-fixer:** Fixes 75/128 checks, improves score from ~80 → 95+ in ≤3 iterations
6. **Contract tests:** All 4 tests pass with 0 failures

**Definition of done:** All 6 criteria met, all tests green, no breaking changes to existing layer file exports.

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Registry extraction errors | High (missing checks) | Medium | Double-check against research doc (128 count), run completeness test |
| Brief token budget overflow | Medium (>7K tokens) | Low | Use bullet format, avoid redundancy, test on longest type (blog) |
| Auto-fixer breaks content | High (writer intent lost) | Low | Only fix deterministic checks, skip creative/voice checks, max 3 iterations |
| Weight rebalance breaks scoring | High (all scores wrong) | Low | Validate sum === 1.00, test on 5 sample pages before Phase 2 |
| Strategies file >200 lines | Low (just split) | High | Pre-plan split: orchestrator + strategies |

---

## Security Considerations

- **No credential exposure:** Brand parser extracts contacts but doesn't log/store outside profile object
- **Input validation:** Auto-fixer validates content is valid MDX before applying fixes
- **No arbitrary code exec:** All fix strategies are predefined, no eval() or dynamic require()
- **File size limits:** Auto-fixer rejects content >100KB to prevent DoS

---

## Next Steps

1. **After Phase 1 complete:** Run all contract tests, verify 100% pass
2. **Before Phase 2:** Score 5 sample pages with new weights, verify scores reasonable (not all 100 or all 50)
3. **If tests fail:** Fix issues, do not proceed to Phase 2 until all green
4. **Documentation:** Update skill README with new pipeline flow diagram
