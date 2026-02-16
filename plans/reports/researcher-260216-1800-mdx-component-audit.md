# MDX Component & Content Type Audit Report

## Summary

- **Component existence**: 24/27 exist in template's mdx/ directory. 3 MISSING from mdx/ (Badge, Breadcrumb, Image).
- **Auto-import coverage**: 24/27 auto-imported. Badge (ui/), Breadcrumb (seo/), and `Image` (from astro:assets) are NOT auto-imported as MDX components.
- **Props API mismatches**: 7 CRITICAL mismatches between what ai-content-rewriter generates and what the template components accept.
- **Content type coverage**: All 11 content types have required components present, BUT props API differences will cause runtime errors.

**Verdict: Pipeline is BROKEN for 7 of 27 components due to props API mismatches. The template was built independently from the rewriter's expected API.**

---

## Component Compatibility Matrix (27 components)

| # | Component | Exists in mdx/ | Auto-Imported | Props API Match | Severity |
|---|-----------|:-:|:-:|:-:|---|
| 1 | Hero | YES | YES | **MISMATCH** | CRITICAL |
| 2 | AuthorBox | YES | YES | **MISMATCH** | CRITICAL |
| 3 | TOC | YES | YES | **MISMATCH** | CRITICAL |
| 4 | Callout | YES | YES | **MISMATCH** | MODERATE |
| 5 | CardGrid | YES | YES | OK (minor) | LOW |
| 6 | Card | YES | YES | **MISMATCH** | MODERATE |
| 7 | Stats | YES | YES | OK | OK |
| 8 | Image (MdxImage) | YES (MdxImage) | YES (as MdxImage) | **MISMATCH** | CRITICAL |
| 9 | Steps | YES | YES | OK | OK |
| 10 | Step | YES | YES | OK | OK |
| 11 | FAQ | YES | YES | **MISMATCH** | CRITICAL |
| 12 | CTA | YES | YES | **MISMATCH** | CRITICAL |
| 13 | CTABlock | YES | YES | **MISMATCH** | CRITICAL |
| 14 | Badge | NO (ui/ only) | NO | **MISSING** | MODERATE |
| 15 | Breadcrumb | NO (seo/ only) | NO | **MISSING** | MODERATE |
| 16 | Newsletter | YES | YES | OK | OK |
| 17 | LogoCloud | YES | YES | OK | OK |
| 18 | Testimonial | YES | YES | **MISMATCH** | MODERATE |
| 19 | ComparisonTable | YES | YES | OK | OK |
| 20 | VideoEmbed | YES | YES | OK | OK |
| 21 | Timeline | YES | YES | OK | OK |
| 22 | TeamGrid | YES | YES | OK | OK |
| 23 | StarRating | YES | YES | OK | OK |
| 24 | Gallery | YES | YES | OK | OK |
| 25 | ContactForm | YES | YES | OK | OK |
| 26 | Tabs | YES | YES | OK (minor) | LOW |
| 27 | PricingTable | YES | YES | OK | OK |

---

## Props API Mismatches (DETAILED)

### 1. CTA -- CRITICAL

**Rewriter outputs:**
```mdx
<CTA href="/contact" variant="primary" size="lg" description="Free samples available">Get Quote</CTA>
```

**Template accepts:**
```typescript
interface Props {
  primary?: { text: string; url: string };
  secondary?: { text: string; url: string };
  note?: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}
```

**Gap:** Template CTA has a DUAL-MODE API:
- Slot mode: `<CTA href="/path" variant="primary">Text</CTA>` -- renders a single button. **This partially works** but `size` and `description` props are silently ignored (not in template's Props interface).
- Object mode: `<CTA primary={{text: "X", url: "/y"}} />` -- renders button pair.

**Missing from template:** `size`, `description`, `fullWidth`, `id` props. The rewriter heavily uses `description` (sub-text under CTA) and `size` (sm/md/lg).

### 2. CTABlock -- CRITICAL

**Rewriter outputs:**
```mdx
<CTABlock href="/signup" ctaText="Start Free" variant="primary" frictionText="No credit card" socialProof="Join 10K+ teams" />
```

**Template accepts:**
```typescript
interface Props {
  title: string;
  description?: string;
  cta?: { primary?: { text: string; url: string }; secondary?: { text: string; url: string } };
  background?: 'gradient' | 'solid';
}
```

**Gap:** COMPLETELY different API. Template uses `title` + `description` + nested `cta` object. Rewriter uses `href` + `ctaText` + `frictionText` + `socialProof` + `variant` + `align`. None of the rewriter's props exist in template. This component will render broken/empty.

### 3. Hero -- CRITICAL

**Rewriter outputs:**
```mdx
<Hero title="..." subtitle="..." ctaText="Start Free" ctaHref="/signup" ctaVariant="primary" image="/bg.webp" overlay={true} size="lg" align="center" />
```

**Template accepts:**
```typescript
interface Props {
  title: string;
  subtitle?: string;
  badges?: string;
  image?: { src: string; alt: string };
  backgroundImage?: { src: string; alt: string; opacity?: number };
  cta?: { primary?: { text: string; url: string }; secondary?: { text: string; url: string } };
  trustItems?: string[];
  variant?: 'default' | 'centered' | 'split';
  background?: 'gradient' | 'solid' | 'none';
}
```

**Gap:**
- Rewriter uses flat `ctaText`/`ctaHref`/`ctaVariant`; template uses nested `cta` object.
- Rewriter uses `image` as string; template uses `image` as `{src, alt}` object.
- Rewriter uses `overlay`/`size`/`align`; template uses `variant`/`background`/`backgroundImage`.
- None of the rewriter's CTA props map to template. Hero CTA will not render.

### 4. AuthorBox -- CRITICAL

**Rewriter outputs:**
```mdx
<AuthorBox name="Jane Doe" role="Senior Engineer" image="/img.jpg" bio="10+ years..." credentials={["PhD"]} linkedin="url" twitter="url" />
```

**Template accepts:**
```typescript
interface Props {
  name: string;
  bio: string;
  avatar?: string;
  social?: { platform: 'twitter' | 'linkedin' | 'github' | 'email'; url: string }[];
}
```

**Gap:**
- `role` prop: exists in rewriter, MISSING from template
- `image` vs `avatar`: different prop name
- `credentials` prop: MISSING from template (critical for E-E-A-T)
- `linkedin`/`twitter` vs `social[]`: different structure. Rewriter uses flat props; template uses array.

### 5. TOC -- CRITICAL

**Rewriter outputs:**
```mdx
<TOC items={[{ text: "Introduction", href: "#intro", level: 2 }]} title="Table of Contents" />
```

**Template accepts:**
```typescript
interface Props {
  headings: { depth: number; slug: string; text: string }[];
}
```

**Gap:**
- `items` vs `headings`: different prop name
- `href` vs `slug`: different field name (and slug has no `#` prefix)
- `level` vs `depth`: different field name
- `title` prop: exists in rewriter, MISSING from template (hardcoded "Table of Contents")

### 6. FAQ -- CRITICAL

**Rewriter outputs:**
```mdx
<FAQ items={[{ question: "Q?", answer: "A." }]} />
```

**Template accepts:**
```typescript
interface Props {
  items?: { q: string; a: string }[];
}
```

**Gap:** Object keys are different: `question`/`answer` (rewriter) vs `q`/`a` (template). FAQ will render but display empty Q&A text. **NOTE:** The existing home.mdx already uses `q`/`a` format, confirming the template format. The mdx-converter.cjs (line 99) generates `question`/`answer` keys. The SKILL.md README also documents `question`/`answer`.

### 7. Callout -- MODERATE

**Rewriter outputs:**
```mdx
<Callout type="tip">Pro tip text here</Callout>
```

**Template accepts:**
```typescript
interface Props {
  type?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
}
```

**Gap:** Rewriter uses `type="tip"` and `type="note"`, but template only accepts `info | warning | success | error`. Types `tip` and `note` will fall through to undefined styling (no color, no icon). Rewriter never outputs `success` or `error`.

**Mapping needed:**
| Rewriter | Template |
|----------|----------|
| tip | info (closest) |
| warning | warning |
| note | info |
| info | info |

### 8. Image (MdxImage) -- CRITICAL

**Rewriter outputs:**
```mdx
<Image src="/path.webp" alt="description" width={800} />
```

**Template auto-imports as `MdxImage`**, NOT `Image`. So `<Image>` tags from the rewriter are NOT recognized. They would need to be `<MdxImage>`.

**Also:** Template MdxImage has `src: string` (matches), but `width`/`height` default to 800/600 already.

### 9. Testimonial -- MODERATE

**Rewriter outputs (from converter):**
```mdx
<Testimonial author="John" role="CEO" image="/img.jpg">Quote text</Testimonial>
```

**Template accepts:**
```typescript
interface Props {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
  rating?: number;
}
```

**Gap:**
- Rewriter uses children slot for quote text; template expects `quote` prop.
- `image` vs `avatar`: different prop name.
- Template has `company` and `rating` props that rewriter converter doesn't generate (but Claude's direct writing does use them correctly, as seen in home.mdx).

### 10. Card -- MODERATE

**Rewriter README expects:**
```mdx
<Card title="Feature" icon="rocket">Description text.</Card>
<Card title="Guide" href="/guide" image="/img.webp" badge="New" description="desc" />
```

**Template accepts:**
```typescript
interface Props {
  title: string;
  description: string;
  image?: string;
  href?: string;
  tags?: string[];
  variant?: 'default' | 'glass' | 'gradient';
}
```

**Gap:**
- `icon` prop: MISSING from template
- `badge` prop: MISSING from template
- `tags` exists in template but not in rewriter's documented Card API
- `imageAlt` from rewriter: MISSING from template (uses title as alt)

---

## Content Type Section Coverage (11 types)

All section types are conceptual (not component names). They map to markdown headings + component combos. Section names from the registry are section labels for content structure, NOT component names. This mapping is valid for all types.

| Type | Required Components | All Present? | Gaps |
|------|-------------------|:-:|---|
| blog | AuthorBox, TOC, Callout, FAQ, CTA, Image | YES (exist) | Props mismatches on ALL 6 |
| landing | Hero, CTA, CTABlock, CardGrid, Testimonial, Stats, FAQ, Steps | YES (exist) | Hero, CTA, CTABlock, FAQ, Testimonial mismatches |
| homepage | Hero, Stats, CardGrid, CTA, CTABlock, Testimonial, Steps, FAQ | YES (exist) | Hero, CTA, CTABlock, FAQ, Testimonial mismatches |
| product | CTA, FAQ, Testimonial, ComparisonTable, Stats, Badge | Badge MISSING | CTA, FAQ, Testimonial, Badge |
| about | Timeline, TeamGrid, Stats, CTA, AuthorBox | YES (exist) | CTA, AuthorBox mismatches |
| product-list | CardGrid, CTA | YES | CTA mismatch |
| blog-list | CardGrid, CTA | YES | CTA mismatch |
| contact | ContactForm, CTA, FAQ | YES | CTA, FAQ mismatches |
| reviews | StarRating, CardGrid, Testimonial, CTA, CTABlock | YES | CTA, CTABlock, Testimonial mismatches |
| gallery | Gallery, CTA | YES | CTA mismatch |
| video-hub | VideoEmbed, CardGrid, CTA | YES | CTA mismatch |

---

## Auto-Import Verification

Auto-import via `astro-auto-import` in `astro.config.mjs` covers 44 components. Of the 27 rewriter components:

**Auto-imported (24):** Hero, AuthorBox, TOC, Callout, CTA, CTABlock, Stats, Steps, Step, FAQ, Newsletter, LogoCloud, MdxImage, CardGrid, Card, Testimonial, ComparisonTable, Tabs, PricingTable, Gallery, VideoEmbed, ContactForm, Timeline, TeamGrid, StarRating

**NOT auto-imported (3):**
1. **Badge** -- exists at `src/components/ui/Badge.astro` but NOT in mdx/ and NOT in auto-import list
2. **Breadcrumb** -- exists at `src/components/seo/Breadcrumb.astro` but NOT in mdx/ and NOT in auto-import list
3. **Image** (from astro:assets) -- NOT auto-imported. Template uses `MdxImage` instead. Rewriter generates `<Image>` tags which won't resolve.

---

## CTA Syntax Compatibility

**Rewriter standard syntax:** `<CTA href="/path" variant="primary">Text</CTA>`

**Template CTA behavior in slot mode:** `<CTA href="/path" variant="primary"><slot/></CTA>` -- renders a `<Button>` with the slot content.

**Partial compatibility:** The basic `href` + `variant` + children pattern WORKS. The button renders.

**BROKEN props:**
- `size` -- silently ignored (rewriter uses sm/md/lg)
- `description` -- silently ignored (rewriter outputs sub-text)
- `fullWidth` -- silently ignored
- `id` -- silently ignored

**CTABlock is completely incompatible.** Rewriter uses flat props (`href`, `ctaText`, `frictionText`, `socialProof`); template uses `title`, `description`, nested `cta` object. Output will be a section with no title, no CTA buttons, just an empty gradient block.

---

## Missing Components (from mdx/ directory)

| Component | Where it exists | Action needed |
|-----------|----------------|---------------|
| Badge | `src/components/ui/Badge.astro` | Create mdx wrapper OR add to auto-import |
| Breadcrumb | `src/components/seo/Breadcrumb.astro` | Create mdx wrapper OR add to auto-import |
| Image | N/A (from astro:assets) | Rewriter must output `<MdxImage>` instead of `<Image>` |

---

## Critical Gaps (MUST FIX)

### Priority 1 -- Runtime Errors / Broken Rendering

1. **CTA component props mismatch** -- Every content type uses CTA. Rewriter's `size`/`description` props silently dropped. Basic rendering works but missing design features.

2. **CTABlock completely incompatible** -- Different API entirely. Used in landing, homepage, blog, product, reviews. Will render empty/broken section.

3. **FAQ `question`/`answer` vs `q`/`a` keys** -- FAQ items will render with blank text. Used in 8+ content types. This is the most impactful bug.

4. **Image vs MdxImage naming** -- `<Image>` from rewriter won't resolve to any auto-imported component. Every image in every article will be broken.

5. **Hero flat CTA props vs nested object** -- Hero CTA buttons won't render. Used in landing, homepage, product, about.

### Priority 2 -- Missing Features / Degraded Output

6. **AuthorBox missing `role`, `credentials`, `image` (vs `avatar`)** -- E-E-A-T signals lost. Used in blog, about. `credentials` array (critical for YMYL) has no template support.

7. **TOC `items`/`href`/`level` vs `headings`/`slug`/`depth`** -- TOC won't render any headings. Used in blog types.

8. **Callout `tip`/`note` types not in template** -- Falls to no styling. Moderate visual impact.

9. **Testimonial slot-based quote vs `quote` prop** -- Converter-generated testimonials will have empty quote text.

### Priority 3 -- Missing Components

10. **Badge not available in MDX** -- Needed for product, product-list, blog-list, landing.

11. **Breadcrumb not available in MDX** -- Needed for ALL content types per rewriter.

---

## Recommendations

### Option A: Align Template to Rewriter (RECOMMENDED)

Update 7 template components to match rewriter's expected API. This is safer because the rewriter has a stable, documented API with test articles proving the syntax works.

1. **CTA.astro** -- Add `size`, `description`, `fullWidth`, `id` props
2. **CTABlock.astro** -- Add `href`, `ctaText`, `frictionText`, `socialProof`, `variant`, `align` props (keep backward compat with existing `title`/`cta` API)
3. **FAQ.astro** -- Accept BOTH `{q, a}` AND `{question, answer}` keys (normalize in component)
4. **Hero.astro** -- Add flat CTA props `ctaText`/`ctaHref`/`ctaVariant` alongside existing nested `cta` object
5. **AuthorBox.astro** -- Add `role`, `credentials`, rename/alias `avatar`->`image`
6. **TOC.astro** -- Accept both `items` and `headings` prop, normalize `href`->`slug`, `level`->`depth`
7. **Callout.astro** -- Add `tip` and `note` to type union (map `tip`->`info`, or add green styling)

### Option B: Align Rewriter to Template

Update the rewriter's component-mapping, converter, README, and all template examples. Higher risk because the rewriter has more moving parts (scorer, converter, post-processor, brief generator).

### Additional Fixes Required (Both Options)

1. **Create `src/components/mdx/Badge.astro`** -- Wrapper or copy of `ui/Badge.astro`, add to auto-import
2. **Create `src/components/mdx/Breadcrumb.astro`** -- Wrapper or copy of `seo/Breadcrumb.astro`, add to auto-import
3. **Image naming resolution** -- EITHER:
   - (a) Update rewriter to output `<MdxImage>` instead of `<Image>` (change in mdx-converter.cjs, post-processor, and SKILL.md), OR
   - (b) Auto-import MdxImage AS `Image` (Astro auto-import supports renaming), OR
   - (c) Add a separate `Image.astro` to mdx/ that wraps MdxImage

### Recommended Fix Priority

| # | Fix | Impact | Effort |
|---|-----|--------|--------|
| 1 | FAQ q/a key normalization | Fixes ALL FAQ rendering | 5 min |
| 2 | Image/MdxImage naming | Fixes ALL images | 10 min |
| 3 | CTA add missing props | Fixes CTA styling | 15 min |
| 4 | CTABlock dual-API | Fixes CTABlock sections | 30 min |
| 5 | Hero flat CTA props | Fixes Hero CTAs | 20 min |
| 6 | AuthorBox props | Fixes E-E-A-T display | 15 min |
| 7 | TOC props normalization | Fixes blog TOC | 15 min |
| 8 | Callout type mapping | Fixes callout styling | 5 min |
| 9 | Badge mdx wrapper | Enables badge use | 5 min |
| 10 | Breadcrumb mdx wrapper | Enables breadcrumb use | 5 min |
| 11 | Testimonial dual-API | Fixes converter output | 10 min |

**Total estimated effort: ~2-3 hours to achieve full compatibility.**

---

## Unresolved Questions

1. Should the template maintain backward compatibility with its current API (dual-mode components), or can we do a breaking change since the project is pre-launch?
2. Does the Astro auto-import plugin support aliasing? (e.g., import MdxImage as Image) -- if so, fix #2 becomes trivial.
3. The rewriter's `reference-output-format.md` documents `<CTABlock href="..." ctaText="..." ...>` but the actual test outputs in `test-outputs/` also use this syntax. Are there any consumers of the current template CTABlock API besides the existing sample MDX files?
4. The `Testimonial` mismatch is partially masked because Claude (when writing directly, not via converter) uses the `quote` prop correctly (as seen in home.mdx). Should the converter be fixed too, or is it deprecated in favor of Claude's direct output?
