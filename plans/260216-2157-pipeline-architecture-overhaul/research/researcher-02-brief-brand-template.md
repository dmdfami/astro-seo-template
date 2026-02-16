# Research: Brief Generator, Brand Parser, Template Layout

**Context:** Scorer→Brief→Writer→Template sync gap analysis
**Files analyzed:** writing-brief-generator.cjs, brand-profile-parser.cjs, brand-profile.md, [slug].astro, index.astro
**Total scorer checks:** 128 (L1:10, L2:14, L3:18, L4:32, L5:13, L6:19, L7:11, L8:11)

---

## 1. Brief Generator Coverage Analysis

**File:** `~/.claude/skills/ai-content-rewriter/scripts/lib/writing-brief-generator.cjs`
**Structure:** 10 sections mapping to scorer layers, ~2-3K tokens

### Covered Checks (94/128 = 73%)

#### L1 Research (0/10) — NOT COVERED
Brief assumes research exists but doesn't verify:
- primary-keyword, difficulty-assessed, intent-mapped, secondary-keywords, competitor-analysis, content-gaps, topic-cluster, target-word-count, expertise-source, ymyl-classified

#### L2 Structure (13/14 = 93%)
✅ H2 range (lines 69-74), TOC requirement, intro <=200w, FAQ, conclusion, images 1/500w, internal links 2-5/1000w
❌ Missing: **heading-density** (new check, not in brief)

#### L3 Writing (17/18 = 94%)
✅ FRE/FKGL, sentence length/variety, paragraph length, active voice, transitions, vocabulary diversity, sentence opening diversity, copywriting formulas, opening hook, psychology triggers, AI phrase blacklist (lines 91)
❌ Missing: **rhythm-variation** (burstiness CV check added after brief v1.0)

#### L4 SEO (30/32 = 94%)
✅ Keyword in title/meta/first-para/H2/alt, density 0.8-1.5%, first 100w, sentiment/power words, variations, word count, internal/external links, anchor text, slug, meta lengths, TOC, schema, featured snippet, image SEO, robots, canonical, hreflang
❌ Missing: **hub-spoke-linking**, **internal-link-early** (within 300w — mentioned as "first within 300w" line 79 but not explicit check ID)

#### L5 E-E-A-T (12/13 = 92%)
✅ Experience markers >=3, case study, personal narrative, data points >=3, citations >=2, source diversity >=3, sources linked, content freshness <=90 days, no clickbait, trust signals, recent sources (within 3 years)
❌ Missing: **technical-accuracy** (qualitative, brief doesn't address validation)

#### L6 AI/GEO (18/19 = 95%)
✅ Question headings >=2, bold definitions, entity coverage >=5 entities (linked >=10%), source+year citations >=2, citation-worthy statements >=3, self-contained passages >=5 (40-180w), answer-first, TL;DR/Key Takeaways, comparison table >=1, FAQ >=3 (10-100w answers), callouts >=2, ordered lists >=3, section length 120-180w, balanced pros/cons, burstiness CV >=0.40
❌ Missing: **listicle-step-format** (implicit in "list 3+ items" but not explicit)

#### L7 Conversion (4/11 = 36%) — WEAKEST
✅ CTA count (min per type), social proof near CTA (within 300w), trust signals near CTA (within 200w), BJ Fogg (motivation+ability within 200w)
❌ Missing: **cta-distribution**, **urgency-signals**, **friction-reducers**, **benefit-over-feature** (>=1.5 ratio mentioned line 132 but not as check), **objection-handling**, **micro-commitment**, **price-anchoring**

#### L8 Brand (8/11 = 73%)
✅ Brand name 3-8x/1000w, preferred terms, prohibited terms, voice traits, value prop in first 200w, differentiators >=2, mission/vision statement, Organization schema
❌ Missing: **contact-info** (phone/email/address presence), **certification-mentions**, **team-credibility**

---

## 2. Brand Profile Parser Output

**File:** `~/.claude/skills/ai-content-rewriter/scripts/lib/brand-profile-parser.cjs`
**Return object:** 19 fields (lines 250-260)

### Extracted Fields
```js
{
  brandName: 'Vietnam Plywood',
  brandNameVariants: ['Vietnam Plywood', 'HCPLY'],
  industry: 'Leading plywood manufacturer...',
  website: 'https://vietnam-plywood.com',
  mission: '', vision: '',
  valueProposition: '100% factory-direct, no middlemen',
  differentiators: ['Real-time QC photos', 'Multilingual', '7-10 days lead'],
  voiceTraits: [{ trait, do, dont }], // table parse
  preferredTerms: ['factory-direct', 'export-grade'],
  prohibitedTerms: ['cheap', 'best in the world'],
  approvedCTAs: [{ text, link, useWhen }],
  authorName: 'Lucy', authorCredentials: 'Sales Manager, 6+ yrs',
  competitors: [{ name, theirStrength, ourAdvantage }],
  internalLinks: [{ url, topic, useWhen }],
  socialProof: ['669 testimonials/reviews'],
  targetAudience: { role, painPoints, goals },
  contacts: { phone: '+84-975807426', email, address }
}
```

### Mapping to L8 Checks
| Check | Field | Status |
|-------|-------|--------|
| brand-name-frequency | `brandName`, `brandNameVariants` | ✅ Direct |
| value-prop-clarity | `valueProposition` | ✅ Direct |
| differentiator-count | `differentiators` | ✅ Direct |
| org-schema-present | N/A (frontmatter check) | ⚠️ Parser doesn't touch schema |
| **contact-info** | `contacts.{phone,email,address}` | ✅ Available but brief ignores |
| social-proof-count | `socialProof` | ✅ Direct |
| **certification-mentions** | Missing field | ❌ Parse from Company section bullet? |
| **team-credibility** | `authorName`, `authorCredentials` | ⚠️ Partial (only 1 author) |
| mission-vision | `mission`, `vision` | ✅ Direct |
| consistent-voice | `preferredTerms`, `prohibitedTerms` | ✅ Direct |
| voice-dimensions | `voiceTraits` | ✅ Direct |

**Gap:** Parser extracts `contacts` but brief generator doesn't use it (line 57-65 only use `authorName` and `authorCredentials`). Brand profile line 11 has certifications ("FSC, CARB P2, CE, ISO 9001") but parser doesn't extract into dedicated field.

---

## 3. Template Layout Rendering

**Files:** `src/pages/[slug].astro`, `src/pages/index.astro`

### ContentType → Layout Map

| ContentType | Wrapper | H1 Style | CSS Class | Components |
|-------------|---------|----------|-----------|------------|
| **homepage** | `.homepage-content` (no prose) | N/A (MDX controls) | `global.css:348-351` | Full-width Hero/CTA/Testimonial/ProductGrid |
| **landing**, **gallery**, **video-hub** | `<main>` (no prose) | N/A (MDX Hero) | None | Full-width MDX components |
| **product** | `.prose` + 2-col grid | `.heading-hero` (line 70) | `grid lg:grid-cols-2 gap-12` | Image left, title/specs right, prose below |
| **Default** (blog, about, etc.) | `.prose` (line 100) | `<h1>{title}</h1>` (line 101) | `prose max-w-none` | Breadcrumb + article tag |

### Key Constraints
- **FULL_WIDTH_TYPES** (line 12): landing, gallery, video-hub — NO prose wrapper, all MDX
- **PRODUCT_TYPES** (line 14): product — 2-col hero with `.heading-hero`, then prose
- **Homepage** (index.astro): `.homepage-content` div wrapper (line 23), custom CSS in `global.css`

### Homepage UI Issue (260216 fix)
**Problem:** Homepage content overflowing container, inconsistent spacing
**Root cause:** `.homepage-content` CSS in `global.css` lines 348-351 only sets width, no padding/container reset
**Current CSS:**
```css
.homepage-content { width: 100%; max-width: 100%; margin: 0; padding: 0; }
```
**MDX responsibility:** All spacing via Hero/Section `padding` prop, no global prose rhythm

---

## 4. Critical Gaps Summary

### Brief → Scorer Mismatches (34 uncovered checks)
1. **L1 Research (10):** Brief assumes research exists, no verify logic
2. **L2:** heading-density (new)
3. **L3:** rhythm-variation (burstiness)
4. **L4:** hub-spoke-linking (internal link strategy)
5. **L5:** technical-accuracy (qualitative)
6. **L6:** listicle-step-format (implicit but not named)
7. **L7 (7):** cta-distribution, urgency-signals, friction-reducers, micro-commitment, price-anchoring, objection-handling, benefit-over-feature explicit check
8. **L8 (3):** contact-info, certification-mentions, team-credibility

### Brand → Brief Gaps
- **Contact info:** Parser extracts `contacts.{phone,email,address}` (line 259), brief ignores → L8 contact-info check fails
- **Certifications:** Brand profile line 11 lists "FSC, CARB P2, CE, ISO 9001", parser doesn't extract → brief can't instruct → L8 certification-mentions fails
- **Team credibility:** Parser only extracts 1 author, brief line 57 uses `authorName` + `authorCredentials` but doesn't instruct "mention team size/roles" → check expects "100+ skilled workers" (brand line 6)

### Template → Writer Contract Missing
- **No component usage rules:** Brief says "MDX components: Hero, CTA, FAQ" (line 76) but doesn't specify:
  - Hero MUST have `title`, `subtitle`, `backgroundImage` for homepage (3 props required)
  - CTA frequency: 1 per 500w vs 1 at end (contentType dependent)
  - Testimonial MUST use `quote` + `author` + `role` props (not free text)
- **No heading style rules:** Brief doesn't tell writer:
  - Product pages: first H1 is Astro-injected `.heading-hero` (line 70), MDX starts at H2
  - Homepage: NO H1 in MDX (Hero handles title), first heading is H2
  - Default pages: H1 in Astro (line 101), MDX starts at H2
- **No image path contract:** Brief says "keyword in >=1 alt" but not "images MUST use `/images/wp-content/uploads/image-v1w/{category}/{slug}/`" (brand profile lines 71-77)

---

## 5. Deterministic Pipeline Requirements

To achieve 100/100 score when algorithm correct:

### A. Brief Generator Enhancements
1. **Add L7 CRO section** (36% → 100% coverage):
   - Line 124-132: Add explicit checks for cta-distribution (intro/mid/end zones), urgency (time-limited, stock scarcity), friction reducers (free shipping, no CC), micro-commitment (soft CTAs first), price anchoring (was/now), objection handling (FAQs addressing objections)
2. **Add L8 Brand details** (73% → 100%):
   - Line 140-143: Add contact-info instruction ("Include phone {bp.contacts.phone}, email, address in Contact/Footer"), certifications ("Mention {bp.certifications} when discussing quality"), team credibility ("Reference team size/roles when establishing expertise")
3. **Add L1 Research verification**:
   - New section 0: "RESEARCH REQUIREMENTS" listing all L1 checks, error if `research` param null
4. **Add Template Contract section**:
   - New section 11: "MDX COMPONENT RULES" per contentType (Hero props, CTA placement, image paths, heading start level H1 vs H2)

### B. Brand Parser Additions
```js
// Add to _emptyProfile() line 250
certifications: [], // Extract from Company section: "Certifications: ..."
teamSize: '', // Extract from Company section: "Employees: 100+"
```
**Extraction logic (new):**
```js
// After line 55
const certs = _extractBullet(companySection, 'Certifications');
if (certs) result.certifications = certs.split(',').map(c => c.trim());
const team = _extractBullet(companySection, 'Employees');
if (team) result.teamSize = team;
```

### C. Template Layout Documentation
Create `docs/component-usage-rules.md`:
```md
| ContentType | H1 Injection | MDX Start Level | Hero Required | CTA Placement |
|-------------|--------------|-----------------|---------------|---------------|
| homepage | None (Hero title) | H2 | Yes (title/subtitle/bg) | 1 in Hero, 1 per 800w |
| product | Astro (.heading-hero) | H2 | Optional | 1 in specs, 1 at end |
| blog | Astro (line 101) | H2 | No | 1 per 1000w |
| landing | None (Hero title) | H2 | Yes | 2+ (intro/mid/end) |
```

**Image path rules:**
- Products: `/images/wp-content/uploads/image-v1w/products/{slug}/`
- Factory: `/images/wp-content/uploads/image-v1w/factory/`
- Avatars: `/images/wp-content/uploads/image-v1w/avatar/`

---

## Unresolved Questions
1. **Scorer check names in brief:** Should brief use exact check IDs (e.g., "hub-spoke-linking") or keep human-readable ("Internal link within 300w")? Affects writer→scorer traceability.
2. **contentType passthrough:** Brief generator line 26 reads `this.tc = getType(contentType)` but doesn't pass contentType to writer prompt. How does writer know product vs blog layout constraints?
3. **Component catalog version sync:** Brief references components from `docs/component-catalog.md` (template side), but what if catalog updates (new props, deprecated components)? Need version hash in brief header?
