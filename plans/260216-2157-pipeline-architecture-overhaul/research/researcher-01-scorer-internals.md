# Scorer Internals: Complete Check Registry

**Extracted from:** ai-content-rewriter v6.0 scorer layer files
**Purpose:** Deterministic check catalog for Brief↔Scorer sync
**Total checks:** 128 (L1:10, L2:14, L3:18, L4:32, L5:13, L6:19, L7:11, L8:11)

---

## Layer Architecture

**Composite scoring:** Weighted sum (L1-L8) + bonus - penalties → tier gate
**Thresholds:** PUBLISH (80), CONDITIONAL (65), BLOCK (<65 or hard blocks)
**Default weights:** L1:15%, L2:10%, L3:22%, L4:18%, L5:15%, L6:15%, bonus:5%, L7/L8:0% (type-dependent)
**Penalties (cap -20):** thin content (-10), AI phrases (-5), duplicate paragraphs (-3 each, max -15), keyword stuffing (-5)
**Hard blocks:** no-schema, no-expertise-no-citations → cap composite at 64

---

## L1: Research & Topic Authority (10 checks, 15% weight, 70% threshold)

Checks pre-computed research metadata, NOT content analysis. Auto-fail if research object missing.

| ID | Evaluation | Threshold | Auto-fix? |
|---|---|---|---|
| `primary-keyword` | keyword non-empty | required | N (research phase) |
| `difficulty-assessed` | research.difficulty exists | required | N |
| `intent-mapped` | research.intent exists | required | N |
| `secondary-keywords` | research.secondaryKeywords.length >= 5 | ≥5 | N |
| `competitor-analysis` | research.competitors exists | required | N |
| `content-gaps` | research.contentGaps exists | required | N |
| `topic-cluster` | research.topicCluster exists | required | N |
| `target-word-count` | research.targetWordCount exists | required | N |
| `expertise-source` | research.expertiseSource exists | required | N |
| `ymyl-classified` | research.ymyl defined | required | N |

**Content type exceptions:** None (research-phase checks)

---

## L2: Content Structure (14 checks, 10% weight, 75% threshold)

All deterministic except FAQ detection (4 heuristics). Checks normalized body + original MDX.

| ID | Evaluation | Threshold | Type exceptions | Auto-fix? |
|---|---|---|---|---|
| `h-tag-hierarchy` | No skipped levels (H2→H4) | valid hierarchy | — | Y (outline fix) |
| `distinct-h2` | All H2 texts unique | 100% unique | — | Y (rewrite) |
| `logical-flow` | Heading count >= 3 | ≥3 | — | Y (add headings) |
| `toc-present` | TOC component or 2000+ words | if words≥2000 | auto-pass: homepage, landing, product-list, contact, gallery, video-hub | Y (add TOC) |
| `intro-length` | First paragraph 1-200 words | 1-200w | — | Y (trim) |
| `conclusion-present` | H2 matching conclusion pattern OR CTA block near last H2 | required | — | Y (add section) |
| `faq-section` | FAQ heading OR `<FAQ>` component OR 3+ H3/H4 ending in `?` OR 3+ question-word headings | required | — | Y (add FAQ) |
| `image-density` | 1 per 500 words (counts MD, MDX, Card image=, Hero backgroundImage=, Gallery) | 1/500w | — | Y (add images) |
| `internal-link-targets` | 2+ internal links | ≥2 | — | Y (add links) |
| `section-depth` | 2+ heading levels | ≥2 | — | Y (add H3s) |
| `component-density` | MDX component count vs word count targets (3@<500w, 5@<1000w, 8@<2000w, 12@<3000w, 15@3000w+) | ratio≥0.6 | — | Y (add components) |
| `required-components` | Type-specific required components (per content-type-registry) | 70% present | — | Y (add missing) |
| `heading-density` | H2 count vs word count range (section-dense types: homepage/landing/product/about have wider ranges) | in range | — | Y (adjust headings) |
| `visual-rhythm` | Max consecutive text-only blocks < 4 | <4 | — | Y (add breaks) |

**Deterministic:** All except FAQ (pattern-based heuristics)

---

## L3: Writing Quality (18 checks, 22% weight, 65% threshold)

Mix of deterministic (readability metrics) and pattern-based (psychology, formulas). AI phrase blacklist zero-tolerance.

| ID | Evaluation | Threshold | Type exceptions | Auto-fix? |
|---|---|---|---|---|
| `flesch-reading-ease` | FRE 50-80 (35-75 for technical B2B content) | 50-80 | auto-pass: non-English | N (rewrite) |
| `fk-grade-level` | FKGL 6-12 | 6-12 | auto-pass: non-English | N (rewrite) |
| `avg-sentence-length` | Avg sentence ≤22 words | ≤22 | — | N (split sentences) |
| `sentence-variety` | Stddev ≥4 | ≥4 | — | N (vary lengths) |
| `paragraph-length` | Avg ≤150w, ≤25% over 120w, ≤25% over 80w (mobile) | multi-tier | — | Y (split paragraphs) |
| `transition-words` | 3%+ of sentences have transition words | ≥3% | — | Y (add transitions) |
| `no-duplicate-sections` | All H2/H3 headings unique | 100% | — | Y (rename) |
| `active-voice` | Passive voice <15% of sentences | <15% | — | N (rewrite) |
| `psychology-triggers` | 6+ of 10 triggers present (curiosity, socialProof, lossAversion, scarcity, urgency, authority, specificity, reciprocity, commitment, anchoring) | ≥6/10 | — | Y (inject patterns) |
| `copywriting-formula` | Detect PAS/AIDA/BAB/FAB/ACCA/PPPP/4Ps structural patterns OR 3+ benefit statements | 1 formula | — | Y (restructure) |
| `no-run-on-sentences` | Max sentence ≤50 words | ≤50 | — | Y (split) |
| `no-one-line-paragraphs` | <30% of paragraphs <10 words | <30% | — | Y (merge/expand) |
| `opening-hook` | First paragraph contains hook patterns (?, imagine, did you know, surprising, etc.) | required | — | Y (add hook) |
| `varied-vocabulary` | Unique word ratio ≥30% | ≥30% | — | N (rewrite) |
| `cro-quality` | 2+ of 4 BJ Fogg signals near CTAs (motivation, ability, friction reducers, CTA count) | 2/4 | — | Y (add signals) |
| `ai-phrase-blacklist` | Zero AI phrases (31 banned phrases: "delve into", "in the realm of", "leverage", "tapestry", etc.) | 0 matches | — | Y (replace) |
| `rhythm-variation` | Sentence length burstiness ≥0.5 (anti-AI detection) | ≥0.5 | — | N (rewrite) |
| `sentence-opening-diversity` | No single opener >20% of sentences | ≤20% | — | Y (vary starters) |

**AI phrase blacklist (31):** delve into, in the realm of, leverage, tapestry of, embark on, navigate the complexities, in today's fast-paced, game-changer, unlock the power, robust, synergy, cutting-edge, seamless, holistic approach, paradigm shift, deep dive, circle back, unpack, at its core, in an era of, poised to, serves as a, plays a crucial role, stands as a

---

## L4: SEO Technical (32 checks = 11 keyword + 21 technical, 18% weight, 70% threshold)

Split into keyword-checks (density, prominence) and technical-checks (meta, schema, links).

### Keyword checks (11)
| ID | Evaluation | Threshold | Type exceptions | Auto-fix? |
|---|---|---|---|---|
| `keyword-in-title` | Keyword in frontmatter title | required | — | Y (update FM) |
| `keyword-in-slug` | Keyword or slug variant in slug | required | — | Y (update slug) |
| `keyword-in-h1` | Keyword in first H1 | required | — | Y (update H1) |
| `keyword-in-intro` | Keyword in first 150 words | required | — | Y (inject) |
| `keyword-density` | 0.5-2.5% (graduated: <300w: 0.3-3%, 300-800w: 0.4-2.5%, >800w: 0.5-2.5%) | graduated range | skip: homepage, landing | Y (adjust) |
| `keyword-in-h2` | Keyword in at least 1 H2 | ≥1 | — | Y (update H2) |
| `keyword-in-meta` | Keyword in meta description | required | — | Y (update FM) |
| `keyword-in-alt` | Keyword in 1+ image alt text | ≥1 | — | Y (update alt) |
| `keyword-early-prominence` | Keyword in first 5% of body | first 5% | — | Y (move up) |
| `keyword-last-paragraph` | Keyword in last paragraph | required | — | Y (inject) |
| `secondary-keywords` | 3+ secondary keywords in body | ≥3 | — | Y (inject) |

### Technical checks (21)
| ID | Evaluation | Threshold | Type exceptions | Auto-fix? |
|---|---|---|---|---|
| `title-length` | 50-65 chars | 50-65 | — | Y (trim/expand) |
| `meta-desc-length` | 140-160 chars | 140-160 | — | Y (adjust) |
| `meta-desc-quality` | Contains CTA OR benefit OR question | 1 signal | — | Y (enhance) |
| `slug-format` | kebab-case, no stop words, 2-6 words | valid | — | Y (reformat) |
| `h1-count` | Exactly 1 H1 | 1 | — | Y (adjust) |
| `h1-length` | 30-70 chars | 30-70 | — | Y (adjust) |
| `url-length` | <75 chars | <75 | — | Y (shorten slug) |
| `canonical-url` | fm.canonical exists | required | — | Y (add FM) |
| `robots-meta` | fm.robots NOT noindex/nofollow | valid | — | Y (fix FM) |
| `og-tags` | fm.ogImage + fm.ogDescription exist | 2 required | — | Y (add FM) |
| `schema-markup` | fm.schema OR fm.schemaType exists | required | — | **HARD BLOCK** Y (add FM) |
| `image-alt-text` | All images have non-empty alt | 100% | — | Y (add alt) |
| `internal-links` | 2+ internal links | ≥2 | — | Y (add links) |
| `internal-link-early` | 1+ internal link in first 300 words | first 300w | — | Y (add link) |
| `external-links` | 2+ external links | ≥2 | — | Y (add links) |
| `hub-spoke-linking` | If pillar → link to 2+ cluster pages; if cluster → link to pillar | topology | — | Y (add links) |
| `anchor-text-variety` | Link text variety (no single text >30% of links) | ≤30% | — | Y (vary anchors) |
| `featured-snippet` | FAQ schema OR numbered list OR comparison table OR definition paragraph | 1 format | — | Y (add format) |
| `breadcrumbs` | fm.breadcrumbs exists | required | — | Y (add FM) |
| `reading-time` | fm.readingTime exists | required | — | Y (calculate + add) |
| `word-count-min` | Word count >= type.wordCount.min | type-specific | skip: homepage, gallery, contact, blog-list, video-hub, product-list | Y (expand) |

---

## L5: E-E-A-T Signals (13 checks, 15% weight, 60% threshold / 80% YMYL)

Pattern-based markers + graduated scoring. Author credentials use 3-tier grading (30%/70%/100%).

### Experience (3 checks)
| ID | Evaluation | Threshold | Auto-fix? |
|---|---|---|---|
| `first-hand-experience` | 3+ first-hand markers (I tested, we found, in my experience, we've delivered, etc. + Vietnamese) | ≥3 | Y (inject) |
| `case-study` | Case study patterns (case study, real-world example, our results, etc.) | required | Y (add section) |
| `personal-narrative` | Personal OR organizational narrative (for homepage/about/product types) | required | Y (add bio) |

### Expertise (3 checks)
| ID | Evaluation | Threshold | Auto-fix? |
|---|---|---|---|
| `author-credentials` | Graduated: name only 30%, name+bio 50% (if bio<20 chars), name+bio 70%, name+bio+URL 100% | ≥70% | Y (enhance FM) |
| `technical-accuracy` | 2+ tech markers (according to, research shows, etc.) + 2+ data points | 2+2 | Y (inject) |
| `depth-indicators` | Composite depth score (word count, headings, tech term density, data points, examples, citations) | graduated | N (rewrite) |

### Authority (3 checks)
| ID | Evaluation | Threshold | Auto-fix? |
|---|---|---|---|
| `citation-count` | 3+ citations | ≥3 | Y (add refs) |
| `source-diversity` | 2+ distinct source domains | ≥2 | Y (add sources) |
| `data-references` | 2+ specific data references (stats, numbers with context) | ≥2 | Y (inject) |

### Trust (4 checks)
| ID | Evaluation | Threshold | Auto-fix? |
|---|---|---|---|
| `sources-linked` | 80%+ of citations have links | ≥80% | Y (add links) |
| `content-freshness` | fm.updatedDate or fm.publishedDate within 18 months | ≤18mo | Y (update FM) |
| `trust-signals` | Trust badges (HTTPS, privacy policy, verified, secure, certified, ISO, FSC, CARB, etc.) | 1+ | Y (inject) |
| `source-recency` | 50%+ of sources from last 3 years | ≥50% | Y (update sources) |

**Hard block combo:** no-expertise-no-citations (both author-credentials + citation-count fail)

---

## L6: AI/GEO Optimization (19 checks = 8 citation + 11 format, 15% weight, 55% threshold)

GEO = Generative Engine Optimization. Split into citation-checks (source quality) and format-checks (AI-friendly structure).

### Citation checks (8)
| ID | Evaluation | Threshold | Type exceptions | Auto-fix? |
|---|---|---|---|---|
| `citation-format` | Citations use [source](url) or (Year) or [1] format | 80% valid | — | Y (reformat) |
| `citation-authority` | 50%+ citations from high-authority domains (.gov, .edu, major news) | ≥50% | — | Y (replace sources) |
| `citation-recency` | 50%+ citations reference recent content (2-year window extracted from URL/context) | ≥50% | — | Y (update sources) |
| `citation-diversity` | 3+ distinct source domains | ≥3 | — | Y (add sources) |
| `citation-placement` | Citations distributed (early, mid, late thirds) | 2/3 zones | — | Y (redistribute) |
| `citation-transparency` | Citation text reveals source type (study, report, analysis, etc.) | 60% transparent | — | Y (enhance text) |
| `inline-citations` | 2+ inline citations near claims (not just end-of-section) | ≥2 | — | Y (move citations) |
| `citation-source-dates` | 3+ citations have explicit years in text or URL | ≥3 | — | Y (add dates) |

### Format checks (11)
| ID | Evaluation | Threshold | Type exceptions | Auto-fix? |
|---|---|---|---|---|
| `structured-data-present` | fm.schema or fm.schemaType exists | required | — | Y (add FM) |
| `entity-references` | 3+ named entities (people, orgs, products with caps) | ≥3 | — | Y (inject) |
| `semantic-markup` | Semantic HTML tags in MDX (time, abbr, dfn, cite, mark) | 1+ | — | Y (wrap text) |
| `definition-block` | Definition paragraph pattern (is/are/refers to, defined as) | 1+ | — | Y (add definition) |
| `comparison-format` | Comparison table OR vs/compared to pattern | 1+ | skip: homepage, gallery, contact, video-hub | Y (add table) |
| `list-format` | 1+ numbered or bulleted list | ≥1 | — | Y (add list) |
| `statistics-highlight` | 3+ statistics (number + unit/context) | ≥3 | — | Y (inject stats) |
| `temporal-context` | 3+ temporal markers (in 2024, recently, as of, since, etc.) | ≥3 | — | Y (add dates) |
| `step-format` | Step-by-step format (numbered H3s or Steps component) | required | skip: except how-to/listicle | Y (add Steps) |
| `summary-section` | Explicit summary heading OR TLDR OR key takeaways section | 1+ | — | Y (add section) |
| `faq-schema` | FAQ component OR fm.faq exists | required | — | Y (add FAQ) |

---

## L7: Conversion Optimization (11 checks, 0% default weight, 50% threshold)

Only runs when contentTypeWeights.conversion > 0 (landing, homepage, product). Per-CTA proximity checks.

| ID | Evaluation | Threshold | Type exceptions | Auto-fix? |
|---|---|---|---|---|
| `cta-count` | Text CTAs + `<CTA>`/`<CTABlock>` count >= type.cta.min | type-specific | — | Y (add CTAs) |
| `cta-distribution` | CTAs in 2+ zones (first 25%, middle, last 25%) | 2/3 zones | — | Y (redistribute) |
| `social-proof-near-cta` | Social proof (testimonial, stat, rating) within 300w of any CTA | required | — | Y (add nearby) |
| `urgency-signals` | 1+ urgency pattern (limited time, exclusive, deadline, etc. + B2B signals) | ≥1 | — | Y (inject) |
| `trust-signals-near-cta` | Trust signal (guarantee, ISO, FSC, CARB, money-back, etc.) within 200w of any CTA | required | — | Y (add nearby) |
| `friction-reducers` | 2+ friction reducers (no credit card, free trial, cancel anytime, free sample, etc. + B2B) | ≥2 | — | Y (inject) |
| `benefit-over-feature` | Benefit/feature ratio ≥1.5 (context-verified within 30-char window) | ≥1.5 | — | Y (rewrite features) |
| `objection-handling` | 2+ objection-handling patterns (worried about, FAQ, don't worry, quality assurance, etc. + B2B) | ≥2 | — | Y (add section) |
| `micro-commitment` | 2+ commitment levels (soft→medium→hard: learn more→try→buy) | 2/3 | — | Y (add CTAs) |
| `price-anchoring` | 1+ price anchoring pattern (compared to, save $, volume pricing, FOB, etc. + B2B) | ≥1 | — | Y (inject) |
| `bj-fogg-proximity` | 50%+ of CTAs have motivation + ability signals within 200w radius | ≥50% | — | Y (add nearby) |

**BJ Fogg model:** Every CTA needs prompt (CTA itself) + motivation (benefit, social proof) + ability (easy, quick, free) within 200w.

---

## L8: Brand Consistency (11 checks, 0% default weight, 50% threshold)

Only runs when contentTypeWeights.brand > 0 (homepage, landing, product, about). Checks brand voice + visual consistency.

| ID | Evaluation | Threshold | Auto-fix? |
|---|---|---|---|
| `brand-tone` | Tone matches brandProfile.tone (formal/casual/professional/friendly) | match | Y (rewrite) |
| `brand-values` | 1+ brand value keyword from brandProfile.values | ≥1 | Y (inject) |
| `brand-voice-consistency` | Voice markers consistent (we/you ratio, sentence length consistency, formality level) | consistent | N (rewrite) |
| `brand-terminology` | Brand-specific terms from brandProfile.terminology used | 2+ | Y (inject) |
| `brand-mission-alignment` | Mission keywords from brandProfile.mission present | 1+ | Y (inject) |
| `brand-color-mentions` | Color palette from brandProfile.colors mentioned in descriptions | 1+ | Y (add color) |
| `brand-tagline` | Tagline from brandProfile.tagline present | required | Y (add tagline) |
| `brand-usp` | USP from brandProfile.usp mentioned | required | Y (inject) |
| `brand-social-proof` | Brand social proof from brandProfile.achievements | 1+ | Y (inject) |
| `brand-visual-consistency` | Hero/featured images use brand imagery patterns | match | N (replace) |
| `brand-cta-voice` | CTA text matches brand CTA voice from brandProfile.ctaStyle | match | Y (rewrite CTAs) |

**Note:** L8 requires brandProfile object. If missing, auto-passes all checks with "No brand profile provided" detail.

---

## Penalty System (cap -20)

Applied after weighted composite, before tier gate.

| Penalty | Condition | Deduction | Type exceptions |
|---|---|---|---|
| `thin-content` | Word count < 500 | -10 | skip: homepage, gallery, contact, blog-list, video-hub, product-list |
| `ai-phrases-detected` | ai-phrase-blacklist check failed in L3 | -5 | — |
| `duplicate-paragraphs` | Duplicate paragraphs (normalized lowercase) | -3 each, max -15 | — |
| `keyword-stuffing` | Keyword density > 3% in L4 | -5 | — |

---

## Hard Blocks (cap composite at 64)

If ANY hard block triggers, tier = BLOCK regardless of score.

| Block ID | Condition | Fix |
|---|---|---|
| `grammar-errors` | AI-evaluated only (not checked deterministically) | N/A (manual) |
| `no-schema` | fm.schema AND fm.schemaType both missing | Y (add FM) |
| `no-expertise-no-citations` | author-credentials fail AND citation-count fail | Y (add both) |

---

## Bonus Points (max +10, 5% weight)

| Bonus | Condition | Points |
|---|---|---|
| `word-count-exceeds-target` | Word count > research.targetWordCount | +2 |
| `original-research` | "our research/study/analysis/findings" pattern | +2 |
| `expert-quotes` | Quoted text (20+ chars) + attribution | +2 |
| `multimedia` | Images, video, iframe, audio present | +2 |
| `comprehensive-faq` | FAQ section with 5+ questions | +2 |

---

## Content Type Exceptions

**Short-form types** (skip word-count-min, toc-required):
homepage, gallery, contact, blog-list, video-hub, product-list

**Conversion-focused types** (L7 weight > 0):
landing (20%), homepage (10%), product (10%)

**Brand-focused types** (L8 weight > 0):
homepage (20%), landing (10%), about (15%), product (10%)

**Section-dense types** (wider heading-density ranges):
homepage, landing, product, about

---

## Deterministic vs AI-Enhanced

**100% deterministic (128 checks):**
All checks except grammar-errors (hard block, AI-evaluated only).

**Pattern-based heuristics (deterministic but may have edge cases):**
- FAQ detection (4 patterns)
- Psychology triggers (10 regex patterns)
- Copywriting formulas (8 structural patterns)
- E-E-A-T markers (experience/authority patterns)
- Citation format/quality detection

**AI-enhanced (optional hybrid scoring):**
If aiChecks array provided, final composite = 70% deterministic + 30% AI score.

---

## Auto-fix Capability

**Frontmatter fixes (Y):** 47 checks (add/update FM fields)
**Structural fixes (Y):** 28 checks (add sections, components, headings, links)
**Content rewrites (N):** 26 checks (readability, voice, rhythm, vocabulary)
**Research-phase fixes (N):** 10 checks (L1 all require research metadata)
**Manual fixes:** 1 check (grammar-errors hard block)

**Total auto-fixable:** 75/128 (59%)
**Require rewrite:** 26/128 (20%)
**Require research:** 10/128 (8%)

---

## Unresolved Questions

1. **AI phrase blacklist updates:** How often is the 31-phrase list updated? Should it be externalized to a config file for easier maintenance?
2. **Graduated scoring ratios:** Several checks use partial credit (0.3, 0.5, 0.7 ratios). Are these ratios standardized or per-check discretion?
3. **Type-specific skipChecks:** Content-type-registry defines skipChecks arrays but most are empty. Are these fully implemented?
4. **Citation quality heuristics:** L6 citation-authority uses domain whitelist. Where is this list defined? (.gov, .edu mentioned but no full registry found)
5. **BJ Fogg 200w radius:** Is 200-word radius optimal or should it be content-type-dependent (shorter for landing pages)?
6. **Penalty cap rationale:** Why -20 cap? Does this prevent score manipulation in edge cases?
7. **Hybrid scoring weights (70/30):** Are these weights tuned or arbitrary? Should they be content-type-dependent?
