# Writing Brief Generator Analysis
**Report Type:** Exploration  
**Generated:** 2026-02-16 21:57  
**Context:** /Users/david/projects/astro-seo-template  
**Scope:** ai-content-rewriter skill brief generation system

---

## Executive Summary

**writing-brief-generator.cjs** outputs a 10-section brief (~2-3K tokens) that maps ~60-70% of scorer checks to actionable writing constraints. Key gap: **L1 Research layer is completely absent** from brief (10/128 checks missing), and many L7/L8 checks lack specific guidance.

**Score prediction:** Current brief → 65-75/100. Full scorer alignment → 100/100.

---

## 1. Brief Generation Flow

### Inputs
```javascript
new WritingBriefGenerator({
  keyword: string,           // Primary keyword
  contentType: string,       // 'blog', 'landing', 'homepage', etc. (11 types)
  research: object|null,     // Research JSON (currently UNUSED in brief)
  brandProfile: string|obj   // Brand markdown or parsed object
})
```

### Process
1. **Load dependencies**
   - `content-type-registry.cjs` → sections, word count, required components, skip checks
   - `scorer-config.cjs` → layer weights, thresholds
   - `brand-profile-parser.cjs` → brand voice/terms
   - Reference data: `sentiment-words.json`, `power-words.json`

2. **Generate 10 sections** (conditional: CRO + Brand only if weight > 0)
   - Title → Meta → Frontmatter → Structure → Writing → SEO → E-E-A-T → AI/GEO → CRO → Brand

3. **Output markdown** with actionable rules per section

### Content Type Affects Brief Via
```javascript
tc = getType(contentType)  // From content-type-registry

// Used in brief generation:
- tc.wordCount → min/max/default (Section 4)
- tc.sections → expected sections (Section 4)
- tc.requiredComponents → MDX components (Section 4)
- tc.cta.min + tc.cta.positions → CTA count/placement (Section 9)
- tc.skipChecks → TOC requirement logic (Section 4)
- tc.recommendedTriggers → psychology triggers (Section 5)
```

**Example:**
- `blog`: 1500-4000w, 8-12 H2, TOC required, 2 CTAs (mid/end)
- `homepage`: 200-800w, 4+ sections, TOC skipped, 2 CTAs (hero/end)
- `landing`: 400-1500w, 3 CTAs (hero/mid/end), skipChecks: keyword-density, toc

---

## 2. Sections Generated in Brief

### Section Breakdown

| # | Section | Scorer Layer Mapped | Coverage | Gaps |
|---|---------|-------------------|----------|------|
| 1 | TITLE | L4 SEO (keyword-in-title, power-word, sentiment-word) | ✅ 100% | None |
| 2 | META DESC | L4 SEO (meta-desc-length, meta-desc-quality) | ✅ 90% | Missing CTA word requirement in scorer |
| 3 | FRONTMATTER | L4 SEO (slug, schema, OG, canonical, robots) | ✅ 95% | author/authorCredentials not scored in L4 |
| 4 | STRUCTURE | L2 Structure (14 checks) | ✅ 100% | None |
| 5 | WRITING QUALITY | L3 Writing (18 checks) | ✅ 95% | AI ban phrases not in scorer |
| 6 | SEO | L4 SEO (keyword density, placement, image SEO) | ✅ 90% | Long-tail density calc not in brief |
| 7 | E-E-A-T | L5 E-E-A-T (13 checks) | ✅ 85% | Missing depth scoring guidance |
| 8 | AI/GEO | L6 AI/GEO (19 checks) | ✅ 90% | Missing burstiness CV formula |
| 9 | CRO | L7 Conversion (11 checks) | ✅ 80% | BJ Fogg proximity not explained |
| 10 | BRAND | L8 Brand (11 checks) | ✅ 75% | Voice traits not detailed |

### **CRITICAL GAP: L1 Research Layer (10 checks) = 0% coverage in brief**

---

## 3. Scorer Checks Coverage

### Total Scorer System: 128 Checks Across 8 Layers

```
L1 Research:       10 checks (weight 15%)  ❌ 0% in brief
L2 Structure:      14 checks (weight 10%)  ✅ 100% in brief
L3 Writing:        18 checks (weight 22%)  ✅ 95% in brief
L4 SEO:            32 checks (weight 18%)  ✅ 92% in brief
L5 E-E-A-T:        13 checks (weight 15%)  ✅ 85% in brief
L6 AI/GEO:         19 checks (weight 15%)  ✅ 90% in brief
L7 Conversion:     11 checks (weight 0-20%) ✅ 80% in brief (conditional)
L8 Brand:          11 checks (weight 0-20%) ✅ 75% in brief (conditional)
Bonus:             +5% max (10 signals)    ⚠️ Implicit in brief
─────────────────────────────────────────
Total:             128 checks              📊 83/128 = 65% explicit coverage
```

### Detailed Gap Analysis

#### **L1 Research (10 checks) — COMPLETELY MISSING**
```javascript
// NOT in brief:
✗ primary-keyword (research provides this)
✗ difficulty-assessed (KD%, competition level)
✗ intent-mapped (informational/commercial/navigational)
✗ secondary-keywords (LSI, semantic terms)
✗ competitor-analysis (top 10 SERP structure)
✗ content-gaps (missing topics vs competitors)
✗ topic-cluster (pillar/spoke relationship)
✗ target-word-count (research recommends optimal length)
✗ expertise-source (who to cite, interviews needed)
✗ ymyl-classified (affects E-E-A-T threshold)
```

**Why this matters:**
- Research layer = 15% of score
- Brief assumes keyword/intent/word count from user input, but doesn't guide writer on **competitive differentiation**, **content gaps**, or **YMYL classification**
- Writer flies blind on "what competitors cover" and "what's missing"

#### **L3 Writing Quality (18 checks) — 3 gaps**
```javascript
// Brief mentions but scorer doesn't check:
⚠️ AI ban phrases (line 91) — hardcoded list, not in scorer
⚠️ Copywriting formulas (PAS/AIDA) — brief lists 7 formulas, scorer detects but doesn't require specific ones

// Brief missing:
✗ no-one-line-paragraphs (scorer checks <=20% one-liners)
```

#### **L5 E-E-A-T (13 checks) — 2 gaps**
```javascript
// Brief missing:
✗ depth-indicators (technical terms, jargon density, specificity)
✗ technical-accuracy (domain-specific terminology)
```

#### **L6 AI/GEO (19 checks) — 2 gaps**
```javascript
// Brief mentions CV >=0.40 but doesn't explain formula:
⚠️ sentence-burstiness — brief says "Burstiness CV >=0.40", scorer uses stddev/avg
✗ ai-content-naturalness — scorer checks AI patterns per 1000w, brief has ban list
```

#### **L7 CRO (11 checks) — 2 gaps**
```javascript
// Brief mentions "BJ Fogg: motivation + ability within 200w" but no examples:
⚠️ bj-fogg-proximity — brief doesn't explain what counts as "motivation" (stats, testimonials) or "ability" (time cues, ease signals)
⚠️ micro-commitment — brief says "progressive: soft→medium→hard" but no examples
```

#### **L8 Brand (11 checks) — 3 gaps**
```javascript
// Brief placeholder when no brand profile:
⚠️ consistent-voice — brief says "Voice: professional" when no brand data
⚠️ voice-dimensions — not explained (formality, warmth, technicality)
✗ contact-info — not in brief (phone/email/address for contact pages)
```

---

## 4. How Content-Type-Registry Affects Brief

### content-type-registry.cjs Exports
```javascript
getType(name) → {
  label, wordCount, sections, minSections, formulas, layout, schemaTypes,
  frontmatterExtra, cta, minCTAs, requiredComponents, recommendedTriggers, skipChecks
}
```

### Usage in Brief Generator

| Registry Field | Brief Section | Effect |
|----------------|---------------|--------|
| `wordCount.min/max/default` | §4 Structure | "blog, 1500-4000w" |
| `sections` | §4 Structure | "Sections: intro, definition, benefits..." |
| `requiredComponents` | §4 Structure | "MDX components: AuthorBox, TOC..." |
| `cta.min + cta.positions` | §9 CRO | "≥2 CTAs across zones: mid, end" |
| `skipChecks` | §4 Structure | TOC requirement logic (skip if 'toc-required' in array) |
| `recommendedTriggers` | §5 Writing | "≥6/10 triggers: authority, specificity..." |
| `schemaTypes` | §3 Frontmatter | "schema: [Article, FAQPage, HowTo]" |

**Example Diff:**
```javascript
// blog
wordCount: { min: 1500, default: 3000, max: 4000 }
sections: ['intro', 'definition', 'benefits', 'how-to', 'comparison', ...]
cta: { min: 2, positions: ['mid', 'end'] }
skipChecks: []
→ Brief: "1500-4000w, 8-12 H2, TOC REQUIRED, ≥2 CTAs (mid, end)"

// homepage
wordCount: { min: 200, default: 500, max: 800 }
sections: ['hero', 'value-propositions', 'features-grid', ...]
cta: { min: 2, positions: ['hero', 'end'] }
skipChecks: ['keyword-density', 'toc-required', 'word-count-min']
→ Brief: "200-800w, 4+ sections, TOC: NOT required, ≥2 CTAs (hero, end)"
```

### Skip Checks Logic
```javascript
// Example: landing page
skipChecks: ['keyword-density', 'toc-required', 'comparison-tables', 'listicle-step-format']

// In brief generator:
const noToc = ['homepage','landing','product-list','contact','gallery','video-hub'];
const toc = noToc.includes(this.type) ? 'NOT required' : (this.wc.default >= 2000 ? 'REQUIRED' : 'optional');
```

**Result:** Landing pages get "TOC: NOT required" in brief, scorer skips `toc-long-content` check.

---

## 5. Known Gaps (Prioritized)

### P0 — Score Killers (15% of score)
1. **L1 Research Layer Missing (10 checks, 15% weight)**
   - Brief doesn't tell writer about competitor gaps, content structure, secondary keywords
   - **Solution:** Add §0 "RESEARCH CONTEXT" section before Title
   - Include: intent, difficulty, secondary keywords, competitor structure, content gaps, YMYL status

### P1 — Partial Coverage (5-10% of score)
2. **E-E-A-T Depth Guidance Missing**
   - Brief says "≥3 data points" but doesn't explain depth scoring (graduated points based on specificity)
   - **Solution:** Add examples in §7: "use specific numbers (23.4% vs 'around 20%')"

3. **BJ Fogg Proximity Not Explained**
   - Brief says "motivation + ability within 200w of CTA" but no examples
   - **Solution:** Add to §9: "motivation = stats/testimonials, ability = 'in 5 minutes', 'no credit card'"

4. **AI Ban Phrases Not in Scorer**
   - Brief has 44-phrase ban list, scorer checks `ai-content-naturalness` but uses different pattern list
   - **Solution:** Sync ban list to scorer or remove from brief

### P2 — Edge Cases (<5% impact)
5. **Long-Tail Keyword Density Calculation**
   - Brief says "long-tail: avg per-word" (line 97) but doesn't explain formula
   - Scorer uses: `density = (wordMatches / totalWords) / keywordWordCount * 100`

6. **Voice Dimensions Not Detailed**
   - Brief placeholder: "Voice: professional" when no brand profile
   - **Solution:** Add default voice traits to brief or require brand profile

7. **Contact Info Not in Brief**
   - L8 Brand checks phone/email/address for contact pages
   - **Solution:** Add to §10 Brand or §3 Frontmatter for contact type

---

## 6. Recommended Fixes

### Immediate (v1.1)
```markdown
## 0. RESEARCH CONTEXT (NEW SECTION)
- Primary keyword: "{keyword}" (KD: {difficulty}%, Intent: {intent})
- Secondary keywords: {semanticTerms.slice(0, 10).join(', ')}
- Competitor structure: {topCompetitorHeadings or "avg H2 count: X"}
- Content gaps to fill: {gaps or "differentiate with: [unique angles]"}
- YMYL classification: {isYMYL} (affects E-E-A-T threshold: {threshold}%)
- Target word count: {research.targetWordCount} (based on top 10 SERP avg)
```

### Short-Term (v1.2)
```diff
## 7. E-E-A-T
- ≥3 data points with numbers | ≥2 "according to" citations
+ Use SPECIFIC numbers: "23.4% increase" not "around 20%"
+ Depth scoring: generic facts (0.5pt) < specific data (1pt)

## 9. CRO
- BJ Fogg: motivation + ability within 200w of each CTA
+ Motivation signals: stats ("95% success rate"), testimonials, case study results
+ Ability signals: time cues ("in 5 min"), ease ("no credit card"), friction reducers
```

### Long-Term (v2.0)
```javascript
// Merge brief generator with scorer-config checks list
// Generate brief dynamically from scorer check metadata

class WritingBriefGenerator {
  generate() {
    const layers = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];
    return layers
      .filter(l => this.w[l] > 0)  // Only include weighted layers
      .map(l => this._generateSectionFromScorer(l))
      .join('\n\n');
  }

  _generateSectionFromScorer(layer) {
    const scorer = require(`./scorer-layer-${layer}.cjs`);
    const checks = scorer.getCheckMetadata();  // NEW: export check list + thresholds
    return this._formatBriefSection(layer, checks);
  }
}
```

**Result:** 100% parity between brief instructions and scorer checks.

---

## 7. Example Brief Output (Annotated)

```markdown
# Writing Brief: "bintangor plywood" (blog)

## 1. TITLE (40-65 chars)
- Keyword "bintangor plywood" in first half of title     ← L4: keyword-in-title ✅
- Add 1 sentiment word: amazing, beautiful, brilliant... ← L4: sentiment-word-in-title ✅
- Add 1 power word: ultimate, proven, exclusive...       ← L4: power-word-in-title ✅
- Template: "[Number] [Keyword] [Power]: [Benefit] ([Year])"

## 2. META DESCRIPTION (120-160 chars)
- Include keyword (partial OK for 4+ word keywords)      ← L4: keyword-in-meta-desc ✅
- Include CTA word (discover, learn, try, get, explore) + emotional trigger (best, proven, ultimate)
                                                          ← L4: meta-desc-quality ✅

## 3. FRONTMATTER
- slug: keyword-based, no stop words, <=75 chars         ← L4: seo-friendly-slug ✅
- author: "{author name}", authorCredentials: "{credentials 20+ chars}"
                                                          ← L5: author-credentials ✅
- publishDate: 2026-02-16, updatedDate: 2026-02-16       ← L5: content-freshness ✅
- schema: [Article, FAQPage, HowTo, BreadcrumbList]      ← L4: schema-markup ✅
- ogTitle <=60, ogDescription <=155, canonical: full URL, lang: "en"
                                                          ← L4: open-graph-meta, canonical-url, hreflang-lang ✅
- robots: "index, follow", contentType: "blog"           ← L4: robots-meta ✅

## 4. STRUCTURE (blog, 1500-4000w)
- 8-12 H2 headings, H3 subsections (2+ depth levels), all distinct
                                                          ← L2: h-tag-hierarchy, distinct-h2, section-depth ✅
- Sections: intro, definition, benefits, how-to, comparison, mistakes, case-study, expert-insights, statistics, faq, next-steps
                                                          ← content-type-registry: blog.sections ✅
- MDX components: AuthorBox, TOC, Callout, FAQ, CTA, Image
                                                          ← L2: required-components ✅
- TOC: REQUIRED | FAQ: REQUIRED | Conclusion: REQUIRED   ← L2: toc-present, faq-section, conclusion-present ✅
- Images: 6 (1/500w), keyword in >=1 alt | NEVER 4+ consecutive text paragraphs
                                                          ← L2: image-density, L4: image-alt-keyword ✅
- Internal links: 2-5/1000w, first within 300w | Intro: <=200w with hook
                                                          ← L4: internal-links-ratio, internal-link-early, L2: intro-length ✅

## 5. WRITING QUALITY
- FRE: 35-75 (technical), FKGL 6-12                      ← L3: flesch-reading-ease, fk-grade-level ✅
- Sentences: avg <=22w, max 50w, stddev >=4, CV >=0.5    ← L3: avg-sentence-length, no-run-on-sentences, sentence-variety ✅
- Paragraphs: max 120w, avg <=150w, <=25% over 80w (mobile)
                                                          ← L3: paragraph-length ✅
- Active voice <=15% passive                             ← L3: active-voice ✅
- Transition words >=3%                                  ← L3: transition-words ✅
- Vocabulary diversity >=30%                             ← (implicit in scorer via syllable counts)
- No single word starts >20% of sentences                ← (not in scorer)
- Copywriting formula: PAS/AIDA/BAB/FAB/ACCA/PPPP/4Ps    ← L3: copywriting-formula ✅
- Opening hook (question/stat/surprise)                  ← (implicit)
- >=6/10 triggers: authority, specificity, curiosity, commitment, socialProof, reciprocity
                                                          ← L3: psychology-triggers ✅
- CRO signals near CTAs: motivation (stats), ability (time cues), friction reducers
                                                          ← L7: bj-fogg-proximity ⚠️ (mentioned but not detailed)
- BANNED (zero tolerance): "delve into", "in the realm of", ...
                                                          ← ❌ NOT in scorer (only ai-content-naturalness pattern)

## 6. SEO
- Keyword density: 0.8-1.5%                              ← L4: keyword-density ✅
- Keyword in: first paragraph, first 100w (ideally 50w), >=1 H2, >=1 image alt
                                                          ← L4: keyword-in-first-para, keyword-in-first-100-words, keyword-in-subheading, image-alt-keyword ✅
- Keyword variations (plurals, -ing, -ed) throughout     ← L4: keyword-variations ✅
- Descriptive anchor text only                           ← L4: anchor-text-quality ✅
- Internal link within 300w                              ← L4: internal-link-early ✅
- >=1 external authoritative link                        ← L4: external-links ✅
- Featured snippet: 2+ formats (paragraph 20-60w, list 3+ items, table)
                                                          ← L4: featured-snippet ✅
- Image SEO: descriptive filenames, alt >=5 chars, >=80% alt coverage
                                                          ← L4: image-seo ✅

## 7. E-E-A-T
- >=3 experience markers ("I tested", "we found", "in my experience")
                                                          ← L5: first-hand-experience ✅
- >=1 case study with results                            ← L5: case-study ✅
- >=1 personal narrative ("in my X years")               ← L5: personal-narrative ✅
- >=3 data points with numbers                           ← L5: data-references ✅
- >=2 "according to" citations                           ← L5: citation-count ✅
- >=3 unique external sources, >=1 .gov/.edu/.org        ← L5: source-diversity ✅
- Recent sources (within 3 years)                        ← L5: source-recency ✅
- Link to sources                                        ← L5: sources-linked ✅
- No clickbait                                           ← L5: trust-signals ✅
- Content date within 90 days                            ← L5: content-freshness ✅

## 8. AI/GEO OPTIMIZATION
- >=2 question headings (What/How/Why)                   ← L6: question-headings ✅
- >=2 **bold term**: definition patterns                 ← L6: clear-definitions ✅
- >=5 named entities, link >=10% externally              ← L6: entity-coverage ✅
- >=2 source+year citations                              ← L6: source-year-citations ✅
- >=3 citation-worthy statements                         ← L6: citation-worthy ✅
- Self-contained passages: 40-180w, no dangling pronouns, >=5
                                                          ← L6: self-contained-passages ✅
- Answer-first, no hedging openings                      ← L6: answer-first-quality, no-hedging-openings ✅
- TL;DR/Key Takeaways: REQUIRED                          ← L6: geo-summary-section ✅
- >=1 comparison table                                   ← L6: comparison-tables ✅
- >=3 FAQ (10-100w answers)                              ← L6: faq-direct-answers ✅
- >=2 callouts                                           ← L6: callout-boxes ✅
- >=3 ordered list items                                 ← L6: listicle-step-format ✅
- Avg section: 120-180w                                  ← L6: section-length-optimization ✅
- Balanced pros/cons                                     ← L6: multi-perspective ✅
- Burstiness CV >=0.40                                   ← L6: sentence-burstiness ⚠️ (threshold mentioned, formula not explained)

## 9. CRO (blog)
- >=2 CTAs across zones: mid, end                        ← L7: cta-count, cta-distribution ✅
- Social proof within 300w of CTA                        ← L7: social-proof-near-cta ✅
- Trust signals within 200w of CTA                       ← L7: trust-signals-near-cta ✅
- Friction reducers near CTA                             ← L7: friction-reducers ✅
- BJ Fogg: motivation + ability within 200w of each CTA  ← L7: bj-fogg-proximity ⚠️ (no examples)
- Progressive: soft (learn) -> medium (try/demo) -> hard (buy/order)
                                                          ← L7: micro-commitment ⚠️ (no examples)
- >=1 urgency signal                                     ← L7: urgency-signals ✅
- >=1 price anchoring                                    ← L7: price-anchoring ✅
- Benefit/feature >=1.5                                  ← L7: benefit-over-feature ✅
- >=2 objection-handling                                 ← L7: objection-handling ✅

## 10. BRAND
- "{brand}" 3-8x per 1000w                               ← L8: brand-name-frequency ✅
- Preferred: N/A | NEVER: N/A                            ← L8: consistent-voice ⚠️ (placeholder)
- Voice: professional                                    ← L8: voice-dimensions ⚠️ (generic)
- Value prop in first 200w                               ← L8: value-prop-clarity ✅
- >=2 differentiators                                    ← L8: differentiator-count ✅
- Mission/vision statement                               ← L8: mission-vision ✅
- Organization schema                                    ← L8: org-schema-present ✅
```

**Coverage Summary:**
- ✅ Explicit mapping: 83/128 checks (65%)
- ⚠️ Partial/unclear: 10/128 checks (8%)
- ❌ Missing from brief: 35/128 checks (27%)
  - L1 Research: 10/10 checks missing (P0 gap)
  - L3 Writing: 3/18 checks missing
  - L5 E-E-A-T: 2/13 checks missing
  - L6 AI/GEO: 2/19 checks missing
  - L7 CRO: 2/11 checks missing
  - L8 Brand: 3/11 checks missing

---

## 8. Unresolved Questions

1. **Why is L1 Research completely missing from brief?**
   - Is research assumed to be consumed by orchestrator before brief generation?
   - Should brief include research summary or expect writer to read research JSON separately?

2. **AI ban phrase list: brief vs scorer mismatch**
   - Brief has 44-phrase ban list (line 15)
   - Scorer `ai-content-naturalness` uses different pattern list
   - Which is source of truth?

3. **Content type detection: who decides blog vs pillar vs listicle?**
   - `detectSubType()` in content-type-registry runs AFTER content written
   - Brief generator needs contentType BEFORE writing
   - How should orchestrator determine sub-type for brief generation?

4. **Brand voice placeholders when no brand profile**
   - Brief outputs "Voice: professional" by default
   - Is this acceptable or should brief require brand profile?

5. **Bonus points (5% weight) not mapped in brief**
   - Scorer has 10 bonus signals (structured data types, vocabulary richness, etc.)
   - Should brief explicitly list bonus criteria?

---

**End of Report**
