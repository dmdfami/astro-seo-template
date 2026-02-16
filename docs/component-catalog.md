# Component Catalog

**Version:** 1.0.0
**Template:** astro-seo-template
**Consumer:** ai-content-rewriter skill

> This document is the **contract between template (implementation) and ai-content-rewriter (MDX generation)**. Every component here has matching MDX export in `src/components/mdx/*.astro` and can be used in content directly.

---

## Table of Contents

- [Premium Components](#premium-components) – 6 components
- [Content & Layout Components](#content--layout-components) – 10 components
- [Utility Components](#utility-components) – 11 components
- [Data & Interactive Components](#data--interactive-components) – 18 components
- [Product & Visual Components](#product--visual-components) – 12 components
- [Social & Trust Components](#social--trust-components) – 7 components
- [General Usage Guidelines](#general-usage-guidelines)

---

## Premium Components

Premium components create visual hierarchy and emotional impact. Use sparingly for high-value content.

### Highlight

**Purpose:** Apply gradient text highlighting to emphasize key phrases inline.

**Props:**
- `variant` (optional): `'primary' | 'teal-blue' | 'accent'` — Default: `'primary'`

**Variants:**
- `primary` – Primary gradient (blue-to-cyan)
- `teal-blue` – Teal-to-blue gradient (professional tone)
- `accent` – Accent gradient (warm tone)

**MDX Usage:**
```mdx
Our <Highlight>premium plywood collection</Highlight> exceeds international standards with certified grain consistency and structural integrity.
```

**Placement Rules:** Use to highlight 1-2 key phrases per section. Typically within paragraph text or headings.

**Spacing Rules:** Inline—no additional margins needed.

**Frequency Rules:** Max 3-4 per page. Overuse diminishes impact.

---

### FloatingBadge

**Purpose:** Floating badge element that hovers with subtle animation, often positioned as a callout or certification marker.

**Props:**
- `variant` (optional): `'certification' | 'trust' | 'feature'` — Default: `'feature'`
- `icon` (optional): string (emoji or Unicode symbol)

**Variants:**
- `certification` – Primary/blue gradient, for certifications or awards
- `trust` – Secondary/teal gradient, for trust signals
- `feature` – Accent/warm gradient, for highlights or features

**MDX Usage:**
```mdx
<FloatingBadge variant="certification" icon="✓">ISO 9001 Certified</FloatingBadge>
```

**Placement Rules:** Use above or beside key sections; pair with Callout or Stats components.

**Spacing Rules:** Margin-bottom `1rem` when stacked with other elements.

**Frequency Rules:** 1-2 per page, strategically placed.

---

### BentoGrid & BentoItem

**Purpose:** Modern grid layout for showcasing multiple content blocks with varied sizes (2x2, 1x2, etc.). Enables complex visual layouts.

**Props (BentoGrid):**
- `cols` (optional): `2 | 3 | 4` — Default: `3`
- `gap` (optional): `'sm' | 'md' | 'lg'` — Default: `'md'`

**Props (BentoItem):**
- `span` (optional): `1 | 2` — Default: `1` (column span)
- `rowSpan` (optional): `1 | 2` — Default: `1`
- `class` (optional): string for additional styling

**MDX Usage:**
```mdx
<BentoGrid cols={3} gap="md">
  <BentoItem>
    <div class="p-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg">
      <h3 class="font-bold mb-2">Durability</h3>
      <p>Up to 50+ years lifespan</p>
    </div>
  </BentoItem>
  <BentoItem span={2}>
    <div class="p-6 bg-white border border-neutral-200 rounded-lg">
      <h3 class="font-bold mb-2">Premium Grains</h3>
      <p>Hand-selected for aesthetic appeal</p>
    </div>
  </BentoItem>
</BentoGrid>
```

**Placement Rules:** Use for feature showcases, product highlights, or case studies.

**Spacing Rules:** Bento items auto-space via gap. Container has auto margins.

**Frequency Rules:** 1-2 per page. Too many complex layouts overwhelm users.

---

### SectionWrapper

**Purpose:** Container for consistent padding, background, and layout of full-width content sections.

**Props:**
- `bg` (optional): `'white' | 'light' | 'gradient' | 'gradient-subtle'` — Default: `'white'`
- `padding` (optional): `'sm' | 'md' | 'lg'` — Default: `'md'`
- `id` (optional): string (for anchor links)
- `class` (optional): string for additional styling

**Variants:**
- `white` – Clean white background
- `light` – Neutral-50 (very light gray)
- `gradient` – Blue-to-blue gradient (eye-catching)
- `gradient-subtle` – Blue-to-teal gradient (sophisticated)

**MDX Usage:**
```mdx
<SectionWrapper bg="gradient" padding="lg" id="benefits">
  <h2>Why Choose Our Plywood?</h2>
  <p>Industry-leading quality since 1995...</p>
</SectionWrapper>
```

**Placement Rules:** Wraps major sections; creates visual rhythm by alternating backgrounds.

**Spacing Rules:** Padding options:
- `sm` = `section-compact` (~2rem)
- `md` = `section-standard` (~4rem)
- `lg` = `section-spacious` (~6rem)

**Frequency Rules:** Alternate backgrounds every 2-3 sections for visual flow:
- Pattern: `white → gradient → light → gradient-subtle → repeat`

---

### ImageWithFallback

**Purpose:** Image component with automatic fallback support and error handling.

**Props:**
- `src` (required): string (image URL)
- `alt` (required): string (alt text for accessibility)
- `width` (optional): number — Default: auto
- `height` (optional): number — Default: auto
- `fallback` (optional): string (fallback image URL if src fails)
- `class` (optional): string for additional styling

**MDX Usage:**
```mdx
<ImageWithFallback
  src="/images/bintangor-plywood.jpg"
  alt="Bintangor plywood sample showing natural grain"
  fallback="/images/plywood-placeholder.jpg"
  class="rounded-lg shadow-md"
/>
```

**Placement Rules:** Use for hero images, product photos, case study visuals.

**Spacing Rules:** Wrap in container with margin-bottom `1.5rem`.

**Frequency Rules:** 1-3 per page depending on content type.

---

## Content & Layout Components

### Hero

**Purpose:** Large intro section with title, subtitle, optional CTA, and background image/gradient.

**Props:**
- `title` (required): string
- `subtitle` (optional): string
- `badges` (optional): string (small badge text above title)
- `image` (optional): `{ src: string; alt: string }` or string
- `backgroundImage` (optional): `{ src: string; alt: string; opacity?: number }`
- `cta` (optional): `{ primary?: { text: string; url: string }; secondary?: { text: string; url: string } }`
- `trustItems` (optional): string[] (trust signals below CTA)
- `variant` (optional): `'default' | 'centered' | 'split'` — Default: `'default'`
- `background` (optional): `'gradient' | 'solid' | 'none'` — Default: `'gradient'`
- **Rewriter flat props:** `ctaText`, `ctaHref`, `align`, `size`

**Variants:**
- `default` – Left-aligned, image right (desktop)
- `centered` – Centered text, no image
- `split` – Grid layout, image beside text

**MDX Usage:**
```mdx
<Hero
  title="Vietnam's Premium Plywood Solutions"
  subtitle="FSC-certified, kiln-dried for maximum stability"
  badges="Industry Leader"
  image={{
    src: "/images/plywood-hero.jpg",
    alt: "Premium plywood stack"
  }}
  cta={{
    primary: { text: "Get Quote", url: "/contact" },
    secondary: { text: "Learn More", url: "/about" }
  }}
  trustItems={["50+ countries", "2M+ m³ delivered", "20+ years"]}
  variant="split"
  background="gradient"
/>
```

**Placement Rules:** Page-top only, sets tone and expectation.

**Spacing Rules:** Py 24–32 (6rem–8rem).

**Frequency Rules:** 1 per page (page header only).

---

### CTA & CTABlock

**Purpose:**
- **CTA**: Single or dual button group with description text.
- **CTABlock**: Full-width colored section with title, description, and CTA(s).

**Props (CTA):**
- `primary` (optional): `{ text: string; url: string }`
- `secondary` (optional): `{ text: string; url: string }`
- `note` (optional): string (small text below buttons)
- `href` (optional): string (flat API for single button)
- `variant` (optional): `'primary' | 'secondary' | 'outline'`
- `size` (optional): `'sm' | 'md' | 'lg'`
- `description` (optional): string (text below button)
- `fullWidth` (optional): boolean

**Props (CTABlock):**
- `title` (optional): string
- `description` (optional): string
- `cta` (optional): nested object or flat `ctaText` / `href`
- `background` (optional): `'gradient' | 'solid'`
- `align` (optional): `'left' | 'center' | 'right'`
- `frictionText` (optional): string (discount note, e.g., "No credit card required")
- `socialProof` (optional): string (social proof text)

**MDX Usage:**
```mdx
<CTA
  primary={{ text: "Request Sample", url: "/samples" }}
  secondary={{ text: "View Pricing", url: "/pricing" }}
  note="Free shipping on orders over $500"
/>

<CTABlock
  title="Ready to Upgrade Your Project?"
  description="Get instant quotes from our expert team. Response in under 2 hours."
  ctaText="Start Now"
  href="/contact"
  background="gradient"
  align="center"
  frictionText="No credit card required"
  socialProof="⭐ Trusted by 500+ contractors"
/>
```

**Placement Rules:**
- CTA: Mid-section, after key benefit statements
- CTABlock: Section break between major content blocks

**Spacing Rules:**
- CTA: Inline, flex-wrap gap-4
- CTABlock: Py 16–24 (4rem–6rem), rounded-2xl

**Frequency Rules:**
- CTA: 2-4 per page
- CTABlock: 1-2 per page

---

### Callout

**Purpose:** Highlighted box for tips, warnings, notes, and key information.

**Props:**
- `type` (optional): `'info' | 'warning' | 'success' | 'error' | 'tip' | 'note'` — Default: `'info'`
- `title` (optional): string
- `class` (optional): string

**MDX Usage:**
```mdx
<Callout type="info" title="Pro Tip">
  Pre-drill pilot holes when fastening to prevent grain splitting and ensure clean edges.
</Callout>

<Callout type="warning" title="Important">
  Never expose unfinished plywood to moisture for extended periods. Cover during transport and storage.
</Callout>
```

**Placement Rules:** Within paragraph content, visually breaks text flow with key insights.

**Spacing Rules:** Margin-y 4 (1rem), border-l-4.

**Frequency Rules:** 1-3 per section max. Use sparingly to maintain impact.

---

### TOC (Table of Contents)

**Purpose:** Auto-generated or manual table of contents for easy navigation within long pages.

**Props:**
- `headings` (optional): array of `{ level: number; text: string; id: string }`
- `items` (optional): array of `{ title: string; id: string }`
- `title` (optional): string — Default: "Table of Contents"

**MDX Usage:**
```mdx
<TOC
  items={[
    { title: "Introduction", id: "intro" },
    { title: "Product Grades", id: "grades" },
    { title: "Installation", id: "installation" }
  ]}
  title="In This Guide"
/>
```

**Placement Rules:** High on page, after hero/intro, before main content.

**Spacing Rules:** Margin-y 6 (1.5rem), often in sticky container.

**Frequency Rules:** 1 per page for long-form content (2000+ words).

---

### AuthorBox

**Purpose:** Author bio with avatar, credentials, and social links.

**Props:**
- `name` (required): string
- `bio` (required): string
- `avatar` (optional): string (image URL)
- `role` (optional): string (job title)
- `credentials` (optional): string[] (e.g., ["MS, Wood Science", "20 years experience"])
- `social` (optional): array or flat `linkedin` / `twitter`

**MDX Usage:**
```mdx
<AuthorBox
  name="Dr. Nguyen Tran"
  role="Chief Product Officer"
  bio="20+ year veteran in sustainable forestry and plywood innovation."
  credentials={["MS Forest Science", "Certified FSC Auditor"]}
  avatar="/images/author-nguyen.jpg"
  linkedin="https://linkedin.com/in/nguyentran"
  twitter="https://twitter.com/nguyentran"
/>
```

**Placement Rules:** End of blog post or detailed guide.

**Spacing Rules:** Margin-t 8 (2rem), padding 6 (1.5rem), border-t.

**Frequency Rules:** 1 per long-form content page.

---

### Newsletter

**Purpose:** Email signup form, typically at end of content.

**Props:**
- `title` (optional): string
- `description` (optional): string
- `placeholder` (optional): string
- `buttonText` (optional): string
- `action` (optional): string (form action URL)

**MDX Usage:**
```mdx
<Newsletter
  title="Stay Updated"
  description="Get industry insights and exclusive plywood tips delivered to your inbox."
  placeholder="your@email.com"
  buttonText="Subscribe"
/>
```

**Placement Rules:** End of page, or within sidebar.

**Spacing Rules:** Margin-y 8 (2rem).

**Frequency Rules:** 1 per page max.

---

### LogoCloud

**Purpose:** Display client/partner logos in grid or marquee carousel.

**Props:**
- `logos` (required): array of `{ src: string; alt: string; href?: string }`
- `cols` (optional): `3 | 4 | 5 | 6` — Default: `4`
- `marquee` (optional): boolean (auto-scroll carousel)

**MDX Usage:**
```mdx
<LogoCloud
  cols={5}
  logos={[
    { src: "/logos/client-1.png", alt: "BuildCorp", href: "https://buildcorp.com" },
    { src: "/logos/client-2.png", alt: "EcoConstruct" }
  ]}
/>
```

**Placement Rules:** Under hero or "Our Clients" section.

**Spacing Rules:** Padding-y 6 (1.5rem).

**Frequency Rules:** 1-2 per page.

---

### MdxImage

**Purpose:** Richly-featured image with caption, lightbox, and lazy loading support.

**Props:**
- `src` (required): string
- `alt` (required): string
- `caption` (optional): string
- `width` (optional): number
- `height` (optional): number
- `lazy` (optional): boolean — Default: `true`
- `lightbox` (optional): boolean (click to expand)
- `class` (optional): string

**MDX Usage:**
```mdx
<MdxImage
  src="/images/plywood-installation.jpg"
  alt="Professional installation of tropical plywood flooring"
  caption="Fig. 1: Proper T&G joint alignment during installation"
  lightbox={true}
/>
```

**Placement Rules:** Within content flow, breakup text.

**Spacing Rules:** Margin-y 6 (1.5rem), max-width 100%.

**Frequency Rules:** 1-2 per 500 words of content.

---

## Utility Components

### Alert

**Purpose:** Dismissible or static alert boxes for notifications and messages.

**Props:**
- `variant` (optional): `'info' | 'warning' | 'error' | 'success'` — Default: `'info'`
- `title` (optional): string
- `dismissible` (optional): boolean

**MDX Usage:**
```mdx
<Alert variant="warning" title="Limited Stock">
  This product is currently in high demand. Stock may run out soon.
</Alert>
```

**Placement Rules:** Top of page or above critical content.

**Spacing Rules:** Margin-y 4 (1rem).

**Frequency Rules:** 1-2 per page max.

---

### Banner

**Purpose:** Sticky or static top/bottom banner for announcements.

**Props:**
- `bg` (optional): `'primary' | 'secondary' | 'accent' | 'neutral'`
- `icon` (optional): string (emoji)
- `ctaText` (optional): string
- `ctaLink` (optional): string

**MDX Usage:**
```mdx
<Banner
  bg="primary"
  icon="🎉"
  ctaText="Order Now"
  ctaLink="/shop"
>
  New Spring Collection Now Available
</Banner>
```

**Placement Rules:** Page top or before hero.

**Spacing Rules:** Full-width, margin-y 0.

**Frequency Rules:** 1 per page (seasonal or announcement).

---

### Blockquote

**Purpose:** Styled quotation, often from customers or thought leaders.

**Props:**
- `author` (optional): string
- `source` (optional): string (publication or context)
- `variant` (optional): `'default' | 'highlight' | 'minimal'`

**MDX Usage:**
```mdx
<Blockquote
  author="Jane Smith, BuildRight Contractor"
  source="Case Study"
  variant="highlight"
>
  The consistency and durability of this plywood has reduced our rework by 40%. It's our new standard on every project.
</Blockquote>
```

**Placement Rules:** After benefits or case study.

**Spacing Rules:** Margin-y 6 (1.5rem), padding 6 (1.5rem), border-l-4.

**Frequency Rules:** 1-2 per page.

---

### DividerLine

**Purpose:** Visual separator between sections.

**Props:**
- `variant` (optional): `'line' | 'dots' | 'gradient'` — Default: `'line'`
- `spacing` (optional): `'sm' | 'md' | 'lg'` — Default: `'md'`

**MDX Usage:**
```mdx
<DividerLine variant="gradient" spacing="lg" />
```

**Placement Rules:** Between major sections or topics.

**Spacing Rules:** Margin-y 8–12 (2–3rem depending on variant).

**Frequency Rules:** 1 between each major section.

---

### List

**Purpose:** Styled list with various marker styles (checkmarks, arrows, numbers, bullets).

**Props:**
- `variant` (optional): `'check' | 'arrow' | 'number' | 'bullet'` — Default: `'bullet'`
- `items` (required): string[] (array of list items)

**MDX Usage:**
```mdx
<List
  variant="check"
  items={[
    "Factory kiln-dried to 12% moisture",
    "FSC-certified sustainable sourcing",
    "Grade A grain selection",
    "Premium edge-banding finish"
  ]}
/>
```

**Placement Rules:** Within feature/benefit sections.

**Spacing Rules:** Margin-y 4 (1rem), item margin-y 2 (0.5rem).

**Frequency Rules:** 2-4 per page.

---

### Logo

**Purpose:** Single logo with optional hyperlink.

**Props:**
- `src` (required): string
- `alt` (required): string
- `width` (optional): number
- `height` (optional): number
- `href` (optional): string (link destination)

**MDX Usage:**
```mdx
<Logo src="/logos/company-logo.svg" alt="Vietnam Plywood Co." href="/" />
```

**Placement Rules:** Header, footer, or within logos section.

**Spacing Rules:** Inline or small container.

**Frequency Rules:** As needed in header/footer.

---

### Metric

**Purpose:** Small stat card with label, trend indicator, and optional icon.

**Props:**
- `value` (required): string (number with unit)
- `label` (required): string
- `trend` (optional): `'up' | 'down' | 'neutral'`
- `icon` (optional): string (emoji)

**MDX Usage:**
```mdx
<Metric value="40%" label="Reduced Waste" trend="up" icon="📉" />
```

**Placement Rules:** Within Stats grid or inline with text.

**Spacing Rules:** Typically in grid, 100px width.

**Frequency Rules:** 3-6 grouped in Stats component.

---

### Pagination

**Purpose:** Page navigation for multi-page content or blog listings.

**Props:**
- `currentPage` (required): number
- `totalPages` (required): number
- `baseUrl` (required): string (e.g., "/blog/page/")

**MDX Usage:**
```mdx
<Pagination currentPage={2} totalPages={5} baseUrl="/blog/page/" />
```

**Placement Rules:** Below content grids (CardGrid, table listings).

**Spacing Rules:** Margin-t 8 (2rem).

**Frequency Rules:** 1 on paginated pages.

---

### PricingCard

**Purpose:** Individual pricing tier card.

**Props:**
- `plan` (required): string (plan name)
- `price` (required): string (formatted price)
- `period` (optional): string (e.g., "/month")
- `features` (required): string[] (feature list)
- `ctaText` (optional): string
- `ctaLink` (optional): string
- `highlighted` (optional): boolean (visually prominent)

**MDX Usage:**
```mdx
<PricingCard
  plan="Professional"
  price="$299"
  period="/month"
  features={["Up to 10 projects", "Priority support", "Advanced analytics"]}
  ctaText="Get Started"
  ctaLink="/checkout?plan=pro"
  highlighted={true}
/>
```

**Placement Rules:** Within PricingTable or as standalone.

**Spacing Rules:** Max-width 350px, margin 4 (1rem).

**Frequency Rules:** 2-4 per pricing page.

---

### Quote

**Purpose:** Pull quote or testimonial attribution.

**Props:**
- `author` (optional): string
- `role` (optional): string
- `company` (optional): string

**MDX Usage:**
```mdx
<Quote author="Carlos Mendez" role="Architect" company="Modern Builds Inc.">
  The precision and uniformity make design specification simple and risk-free.
</Quote>
```

**Placement Rules:** Standalone, after Blockquote or Testimonial.

**Spacing Rules:** Margin-y 6 (1.5rem), italic body text.

**Frequency Rules:** 1-3 per page.

---

### Table

**Purpose:** Data table with headers and rows.

**Props:**
- `headers` (required): string[]
- `rows` (required): string[][] (2D array)
- `striped` (optional): boolean (alternating row colors)
- `compact` (optional): boolean (reduced padding)

**MDX Usage:**
```mdx
<Table
  headers={["Product", "Grade", "Thickness", "Price/m²"]}
  rows={[
    ["Bintangor", "A/B", "18mm", "$24"],
    ["Okume", "AA", "12mm", "$32"],
    ["Birch", "A/A", "9mm", "$28"]
  ]}
  striped={true}
/>
```

**Placement Rules:** Within product specs or comparison sections.

**Spacing Rules:** Margin-y 6 (1.5rem), full-width on mobile.

**Frequency Rules:** 1-3 per page.

---

## Data & Interactive Components

### CardGrid & Card

**Purpose:**
- **CardGrid**: Container for responsive card layouts.
- **Card**: Individual card with title, description, image, tags, and optional link.

**Props (CardGrid):**
- `cols` (optional): `2 | 3 | 4` — Default: `3`
- `gap` (optional): `'sm' | 'md' | 'lg'`
- `class` (optional): string

**Props (Card):**
- `title` (required): string
- `description` (required): string
- `image` (optional): string (image URL)
- `href` (optional): string (clickable link)
- `tags` (optional): string[]
- `variant` (optional): `'default' | 'glass' | 'gradient'`
- `class` (optional): string

**MDX Usage:**
```mdx
<CardGrid cols={3} gap="md">
  <Card
    title="FSC-Certified"
    description="Sustainably sourced from managed forests"
    href="/certifications"
    tags={["Eco-Friendly", "Certified"]}
    image="/images/cert-fsc.jpg"
  />
  <Card
    title="Durability"
    description="50+ years structural performance"
    variant="gradient"
    tags={["Quality"]}
  />
</CardGrid>
```

**Placement Rules:** After benefits section or case study intro.

**Spacing Rules:** Grid gap: 1rem (sm), 1.5rem (md), 2rem (lg).

**Frequency Rules:** 1-2 per page.

---

### ComparisonTable

**Purpose:** Side-by-side comparison of features or products.

**Props:**
- `headers` (required): string[] (first is feature name, rest are product names)
- `rows` (required): string[][] (feature rows)
- `highlightCol` (optional): number (column to highlight)

**MDX Usage:**
```mdx
<ComparisonTable
  headers={["Feature", "Our Plywood", "Competitor A", "Competitor B"]}
  rows={[
    ["Moisture Stability", "±1%", "±3%", "±2%"],
    ["Grain Consistency", "Grade A+", "Grade B", "Grade A"],
    ["Warranty", "10 years", "5 years", "7 years"]
  ]}
  highlightCol={1}
/>
```

**Placement Rules:** Competitive positioning section.

**Spacing Rules:** Margin-y 6 (1.5rem), responsive horizontal scroll on mobile.

**Frequency Rules:** 1 per page (if present).

---

### Tabs

**Purpose:** Tabbed interface for organizing related content sections.

**Props:**
- `tabs` (optional): array of `{ label: string; content: string }`

**MDX Usage:**
```mdx
<Tabs tabs={[
  { label: "Specifications", content: "Thickness: 18mm\nGrade: A/B..." },
  { label: "Installation", content: "Step 1: Prepare substrate..." },
  { label: "Maintenance", content: "Clean with damp cloth..." }
]} />
```

**Placement Rules:** Within product detail pages.

**Spacing Rules:** Full-width, tab bar sticky on scroll.

**Frequency Rules:** 0-1 per page.

---

### PricingTable

**Purpose:** Multi-tier pricing display with highlighted recommended plan.

**Props:**
- `plans` (required): array of pricing plan objects
- `toggle` (optional): boolean (annual/monthly toggle)

**MDX Usage:**
```mdx
<PricingTable
  plans={[
    { name: "Starter", price: "$99", features: ["Feature 1", "Feature 2"] },
    { name: "Pro", price: "$299", features: ["Feature 1", "Feature 2", "Feature 3"], highlighted: true },
    { name: "Enterprise", price: "Custom", features: ["All features", "Priority support"] }
  ]}
  toggle={true}
/>
```

**Placement Rules:** Dedicated pricing page.

**Spacing Rules:** Full-width, centered.

**Frequency Rules:** 1 on pricing page.

---

### Accordion

**Purpose:** Collapsible sections for FAQs or detailed specs.

**Props:**
- `items` (optional): array of `{ title: string; content: string }`
- `multiExpand` (optional): boolean (allow multiple open) — Default: `false`

**MDX Usage:**
```mdx
<Accordion
  items={[
    { title: "What's your lead time?", content: "Standard orders ship within 5-7 business days." },
    { title: "Do you offer bulk discounts?", content: "Yes, 10%+ on orders over 100m²." }
  ]}
  multiExpand={false}
/>
```

**Placement Rules:** FAQ section or product Q&A.

**Spacing Rules:** Full-width, margin-y 6 (1.5rem).

**Frequency Rules:** 1 per page.

---

### Modal

**Purpose:** Overlay dialog triggered by button or link.

**Props:**
- `trigger` (required): string (button text)
- `id` (optional): string (unique identifier)

**MDX Usage:**
```mdx
<Modal trigger="View Full Spec" id="spec-modal">
  <h3>Complete Specifications</h3>
  <p>Detailed product specs...</p>
</Modal>
```

**Placement Rules:** Inline, before detailed content.

**Spacing Rules:** Trigger button inline.

**Frequency Rules:** 1-2 per page.

---

### Tooltip

**Purpose:** Hover tooltip for additional context on terms or abbreviations.

**Props:**
- `content` (required): string (tooltip text)
- `position` (optional): `'top' | 'bottom' | 'left' | 'right'` — Default: `'top'`
- `class` (optional): string

**MDX Usage:**
```mdx
<Tooltip content="Engineered wood made from veneers glued together under heat and pressure" position="right">
  Plywood
</Tooltip>
```

**Placement Rules:** Inline, on technical terms.

**Spacing Rules:** Inline, 4px offset.

**Frequency Rules:** 3-5 per technical page.

---

### Drawer

**Purpose:** Side panel that slides in from left or right.

**Props:**
- `trigger` (required): string (button text)
- `side` (optional): `'left' | 'right'` — Default: `'right'`
- `id` (optional): string

**MDX Usage:**
```mdx
<Drawer trigger="View Catalog" side="right" id="catalog-drawer">
  <h3>Full Product Catalog</h3>
  <img src="/images/catalog.pdf" alt="Catalog" />
</Drawer>
```

**Placement Rules:** Header or sidebar navigation.

**Spacing Rules:** Trigger button, full-height drawer.

**Frequency Rules:** 1-2 per page.

---

### Steps & Step

**Purpose:**
- **Steps**: Container for sequential steps.
- **Step**: Individual step in a process.

**Props (Steps):**
- `items` (optional): array of `{ title: string; description: string }`

**Props (Step):**
- `title` (required): string
- `number` (optional): number

**MDX Usage:**
```mdx
<Steps items={[
  { title: "Measure", description: "Accurately measure project area" },
  { title: "Order", description: "Place order with correct specifications" },
  { title: "Install", description: "Follow installation guidelines" },
  { title: "Enjoy", description: "Beautiful, durable results" }
]} />
```

**Placement Rules:** Process or installation guides.

**Spacing Rules:** Full-width, vertical line connecting steps.

**Frequency Rules:** 1 per guide.

---

### FAQ

**Purpose:** Frequently asked questions section.

**Props:**
- `items` (optional): array of `{ question: string; answer: string }`

**MDX Usage:**
```mdx
<FAQ items={[
  { question: "What warranty do you offer?", answer: "10-year structural warranty on all products..." },
  { question: "How should I store plywood?", answer: "Store in dry location, cover with plastic tarp..." }
]} />
```

**Placement Rules:** End of page or dedicated FAQ page.

**Spacing Rules:** Margin-y 8 (2rem).

**Frequency Rules:** 1 per page.

---

### ContactForm

**Purpose:** Multi-field contact form with validation.

**Props:**
- `fields` (optional): array of field definitions
- `submitText` (optional): string — Default: "Send"
- `class` (optional): string

**MDX Usage:**
```mdx
<ContactForm
  fields={[
    { name: "name", label: "Full Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "message", label: "Message", type: "textarea", rows: 5 }
  ]}
  submitText="Send Inquiry"
/>
```

**Placement Rules:** Dedicated contact page or side-panel.

**Spacing Rules:** Max-width 600px, margin-y 8 (2rem).

**Frequency Rules:** 1-2 per contact page.

---

### ProcessFlow

**Purpose:** Visual workflow or process diagram.

**Props:**
- `steps` (required): array of `{ title: string; description: string }`
- `orientation` (optional): `'horizontal' | 'vertical'` — Default: `'horizontal'`
- `class` (optional): string

**MDX Usage:**
```mdx
<ProcessFlow
  orientation="vertical"
  steps={[
    { title: "Design", description: "Custom specs" },
    { title: "Manufacture", description: "Quality controlled" },
    { title: "Test", description: "Durability verified" },
    { title: "Ship", description: "Fast delivery" }
  ]}
/>
```

**Placement Rules:** Business process or workflow section.

**Spacing Rules:** Full-width, auto-height based on orientation.

**Frequency Rules:** 1 per process page.

---

## Product & Visual Components

### SpecTable

**Purpose:** Product specifications in table or grid format.

**Props:**
- `specs` (required): `Record<string, string>` (key-value pairs)
- `variant` (optional): `'table' | 'grid'` — Default: `'table'`
- `class` (optional): string

**MDX Usage:**
```mdx
<SpecTable
  variant="grid"
  specs={{
    "Thickness": "18mm",
    "Grade": "A/B",
    "Moisture": "12% ± 1%",
    "Strength": "2400 N/mm²",
    "Warranty": "10 years"
  }}
/>
```

**Placement Rules:** Product detail pages.

**Spacing Rules:** Margin-y 6 (1.5rem), responsive grid.

**Frequency Rules:** 1 per product.

---

### Gallery

**Purpose:** Image gallery with grid or masonry layout and lightbox.

**Props:**
- `images` (required): array of `{ src: string; alt: string; caption?: string }`
- `layout` (optional): `'grid' | 'masonry'` — Default: `'grid'`
- `class` (optional): string

**MDX Usage:**
```mdx
<Gallery
  layout="masonry"
  images={[
    { src: "/images/installation-1.jpg", alt: "Installation step 1", caption: "Prepare substrate" },
    { src: "/images/installation-2.jpg", alt: "Installation step 2", caption: "Apply adhesive" },
    { src: "/images/installation-3.jpg", alt: "Installation step 3", caption: "Place boards" }
  ]}
/>
```

**Placement Rules:** Visual showcase or case study.

**Spacing Rules:** Full-width, gap 1rem.

**Frequency Rules:** 1 per gallery page.

---

### BeforeAfter

**Purpose:** Interactive before/after image slider.

**Props:**
- `before` (required): string (before image URL)
- `after` (required): string (after image URL)
- `position` (optional): number (0-100, slider initial position) — Default: `50`

**MDX Usage:**
```mdx
<BeforeAfter
  before="/images/old-floor.jpg"
  after="/images/new-floor-with-plywood.jpg"
  position={50}
/>
```

**Placement Rules:** Product transformation or case study.

**Spacing Rules:** Margin-y 6 (1.5rem), responsive width.

**Frequency Rules:** 1-2 per transformation page.

---

### Counter

**Purpose:** Animated number counter for statistics.

**Props:**
- `target` (required): number (final value)
- `duration` (optional): number (milliseconds) — Default: `2000`
- `suffix` (optional): string (e.g., "%", "+")
- `prefix` (optional): string (e.g., "$", "€")
- `class` (optional): string

**MDX Usage:**
```mdx
<Counter target={50} suffix="+" prefix="" /> Countries Served
<Counter target={2000000} /> m³ Delivered Annually
```

**Placement Rules:** Stats or achievements section.

**Spacing Rules:** Inline, display-3 font size.

**Frequency Rules:** 2-6 grouped in Stats component.

---

### ProgressBar

**Purpose:** Visual progress indicator.

**Props:**
- `value` (required): number (0-100)
- `label` (optional): string
- `color` (optional): `'primary' | 'success' | 'warning' | 'error'`
- `class` (optional): string

**MDX Usage:**
```mdx
<ProgressBar value={85} label="Project Completion" color="success" />
```

**Placement Rules:** Project updates or skill display.

**Spacing Rules:** Margin-y 4 (1rem), full-width.

**Frequency Rules:** 1-3 per page.

---

### CertBadges

**Purpose:** Certification or achievement badges.

**Props:**
- `badges` (required): array of `{ icon: string; label: string; url?: string }`
- `class` (optional): string

**MDX Usage:**
```mdx
<CertBadges badges={[
  { icon: "🌱", label: "FSC Certified", url: "/certifications/fsc" },
  { icon: "✓", label: "ISO 9001", url: "/certifications/iso" },
  { icon: "🏆", label: "Industry Award", url: "/awards" }
]} />
```

**Placement Rules:** Trust/credibility section or footer.

**Spacing Rules:** Flex wrap, gap 1rem.

**Frequency Rules:** 1 per page.

---

### FeatureGrid

**Purpose:** Grid of feature blocks with icons and descriptions.

**Props:**
- `features` (required): array of `{ icon: string; title: string; description: string }`
- `cols` (optional): `2 | 3 | 4` — Default: `3`
- `class` (optional): string

**MDX Usage:**
```mdx
<FeatureGrid
  cols={3}
  features={[
    { icon: "🔒", title: "Durable", description: "50+ year lifespan with proper care" },
    { icon: "🌍", title: "Sustainable", description: "FSC-certified eco-friendly sourcing" },
    { icon: "⚡", title: "Easy Install", description: "Standard tools, straightforward process" }
  ]}
/>
```

**Placement Rules:** Benefits or features section.

**Spacing Rules:** Grid gap 2rem, animated fade-in on scroll.

**Frequency Rules:** 1-2 per page.

---

### StarRating

**Purpose:** Visual star rating display (1-5 stars).

**Props:**
- `rating` (required): number (0-5)
- `count` (optional): number (review count)
- `readonly` (optional): boolean — Default: `true`
- `class` (optional): string

**MDX Usage:**
```mdx
<StarRating rating={4.8} count={156} readonly={true} />
```

**Placement Rules:** Review section or product detail.

**Spacing Rules:** Inline, 1.5rem height.

**Frequency Rules:** 1 per review section.

---

### ReviewCard

**Purpose:** Individual customer review card.

**Props:**
- `rating` (required): number
- `title` (required): string (review headline)
- `review` (required): string (review body)
- `author` (required): string (reviewer name)
- `date` (required): Date or string
- `verified` (optional): boolean (verified purchase badge)
- `class` (optional): string

**MDX Usage:**
```mdx
<ReviewCard
  rating={5}
  title="Best plywood we've ever used"
  review="Consistent quality, precise dimensions, zero warping. Highly recommend for professional contractors."
  author="Robert Chen"
  date="2024-01-15"
  verified={true}
/>
```

**Placement Rules:** Reviews/testimonials section.

**Spacing Rules:** Width 300px, margin 1rem.

**Frequency Rules:** 3-6 grouped in grid.

---

### PriceRange

**Purpose:** Price range display with currency formatting.

**Props:**
- `min` (required): number
- `max` (required): number
- `currency` (optional): string — Default: "$"
- `unit` (optional): string (e.g., "/m²", "per sheet")
- `class` (optional): string

**MDX Usage:**
```mdx
<PriceRange min={24} max={45} currency="$" unit="/m²" />
```

**Placement Rules:** Pricing section or product listing.

**Spacing Rules:** Inline, text-2xl.

**Frequency Rules:** 1-3 per pricing page.

---

### VideoEmbed

**Purpose:** Embedded video (YouTube, Vimeo) with responsive aspect ratio.

**Props:**
- `url` (required): string (video URL)
- `title` (required): string (video title)
- `aspectRatio` (optional): `'16:9' | '4:3'` — Default: `'16:9'`
- `class` (optional): string

**MDX Usage:**
```mdx
<VideoEmbed
  url="https://www.youtube.com/embed/dQw4w9WgXcQ"
  title="Product Overview"
  aspectRatio="16:9"
/>
```

**Placement Rules:** Video tutorials or product demos.

**Spacing Rules:** Max-width 800px, margin-y 6 (1.5rem).

**Frequency Rules:** 1-3 per page.

---

### Timeline

**Purpose:** Vertical or horizontal timeline for milestones, history, or chronological events.

**Props:**
- `events` (required): array of `{ date: string; title: string; description: string }`
- `orientation` (optional): `'vertical' | 'horizontal'` — Default: `'vertical'`
- `class` (optional): string

**MDX Usage:**
```mdx
<Timeline
  orientation="vertical"
  events={[
    { date: "1995", title: "Founded", description: "Started operations with small mill" },
    { date: "2005", title: "Expanded", description: "Opened second facility" },
    { date: "2020", title: "FSC Certified", description: "Achieved FSC certification" }
  ]}
/>
```

**Placement Rules:** Company history or project timeline.

**Spacing Rules:** Full-width, vertical line connector.

**Frequency Rules:** 1 per timeline page.

---

### TeamGrid

**Purpose:** Grid of team members with photos and roles.

**Props:**
- `members` (required): array of `{ name: string; role: string; image: string; bio?: string }`
- `class` (optional): string

**MDX Usage:**
```mdx
<TeamGrid
  members={[
    { name: "Tran Nguyen", role: "CEO", image: "/images/tran.jpg", bio: "20 years in plywood industry" },
    { name: "Minh Ha", role: "CTO", image: "/images/minh.jpg", bio: "Tech innovator" }
  ]}
/>
```

**Placement Rules:** About page or team page.

**Spacing Rules:** Grid 2-4 cols, gap 2rem.

**Frequency Rules:** 1 per team page.

---

### Badge

**Purpose:** Inline badge label for tags, status, or categories.

**Props:**
- `variant` (optional): `'success' | 'warning' | 'error' | 'info' | 'neutral'`
- `size` (optional): `'sm' | 'md'`
- `class` (optional): string

**MDX Usage:**
```mdx
<Badge variant="success" size="md">Eco-Friendly</Badge>
```

**Placement Rules:** Inline within text or card headers.

**Spacing Rules:** Inline, padding 4-6px.

**Frequency Rules:** 1-3 per card or section.

---

### BreadcrumbNav

**Purpose:** Navigation breadcrumb trail showing page hierarchy.

**Props:**
- `items` (required): array of `{ label: string; href?: string }`

**MDX Usage:**
```mdx
<BreadcrumbNav
  items={[
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Bintangor Plywood" }
  ]}
/>
```

**Placement Rules:** Page top, below header.

**Spacing Rules:** Small font, margin-y 2 (0.5rem).

**Frequency Rules:** 1 per page (auto-generated on detail pages).

---

### Image

**Purpose:** Basic image component (extends Astro Image).

**Props:**
- Standard Astro Image props

**MDX Usage:**
```mdx
<Image src={plywoodImage} alt="Plywood stack" />
```

**Placement Rules:** Content insertion points.

**Spacing Rules:** Per context.

**Frequency Rules:** As needed.

---

### ScrollReveal

**Purpose:** Animation trigger on scroll—fade-in, scale, or slide effects.

**Props:**
- `animation` (optional): `'fade-up' | 'fade-down' | 'scale'` — Default: `'fade-up'`
- `delay` (optional): number (milliseconds)
- `class` (optional): string

**MDX Usage:**
```mdx
<ScrollReveal animation="fade-up" delay={100}>
  <h3>Content reveals on scroll</h3>
</ScrollReveal>
```

**Placement Rules:** Wraps sections or components.

**Spacing Rules:** No additional spacing; inherits wrapped content.

**Frequency Rules:** 2-4 per page for visual interest.

---

## Social & Trust Components

### Stats

**Purpose:** Grid of statistic/metric cards.

**Props:**
- `items` (required): array of `{ label: string; value: string; icon?: string }`
- `cols` (optional): `2 | 3 | 4` — Default: `3`
- `animated` (optional): boolean (scale animation on scroll)

**MDX Usage:**
```mdx
<Stats
  cols={4}
  animated={true}
  items={[
    { label: "Countries", value: "50+", icon: "🌍" },
    { label: "Projects", value: "10K+", icon: "📋" },
    { label: "Happy Clients", value: "99%", icon: "😊" },
    { label: "Years", value: "25+", icon: "📅" }
  ]}
/>
```

**Placement Rules:** Mid-page after hero or feature intro.

**Spacing Rules:** Margin-y 8 (2rem), gap 2rem.

**Frequency Rules:** 1-2 per page.

---

### Testimonial

**Purpose:** Customer testimonial or success story.

**Props:**
- `quote` (optional): string (testimonial text)
- `author` (required): string
- `role` (required): string (job title)
- `company` (optional): string
- `avatar` (optional): string (image URL)
- `rating` (optional): number (1-5 stars)
- `class` (optional): string

**MDX Usage:**
```mdx
<Testimonial
  quote="The quality and reliability have transformed our business. ROI within 6 months."
  author="Sarah Johnson"
  role="Operations Director"
  company="BuildRight Contractor"
  avatar="/images/sarah.jpg"
  rating={5}
/>
```

**Placement Rules:** Social proof sections, case studies.

**Spacing Rules:** Max-width 600px, margin-y 6 (1.5rem).

**Frequency Rules:** 2-4 per page.

---

### SocialLinks

**Purpose:** Social media icon/button links.

**Props:**
- `links` (required): array of `{ platform: string; url: string; icon?: string }`
- `size` (optional): `'sm' | 'md' | 'lg'`
- `variant` (optional): `'icon' | 'button'`
- `class` (optional): string

**MDX Usage:**
```mdx
<SocialLinks
  size="md"
  variant="icon"
  links={[
    { platform: "LinkedIn", url: "https://linkedin.com/company/...", icon: "in" },
    { platform: "Twitter", url: "https://twitter.com/...", icon: "tw" }
  ]}
/>
```

**Placement Rules:** Footer, header, or about section.

**Spacing Rules:** Flex wrap, gap 1rem.

**Frequency Rules:** 1 per page (typically footer).

---

### TrustBar

**Purpose:** Horizontal bar showing trust signals (certifications, awards, guarantees).

**Props:**
- `items` (required): array of `{ icon: string; label: string; description?: string }`
- `variant` (optional): `'compact' | 'spacious'` — Default: `'compact'`
- `class` (optional): string

**MDX Usage:**
```mdx
<TrustBar
  variant="spacious"
  items={[
    { icon: "🔐", label: "SSL Secure", description: "Encrypted transactions" },
    { icon: "✓", label: "Money-Back", description: "30-day guarantee" },
    { icon: "📞", label: "24/7 Support", description: "Always available" }
  ]}
/>
```

**Placement Rules:** Below hero or before CTA.

**Spacing Rules:** Full-width, margin-y 6 (1.5rem).

**Frequency Rules:** 1 per page.

---

### ClientLogos

**Purpose:** Display client/partner logos (alias for LogoCloud).

**Props:** Same as LogoCloud

**MDX Usage:** Same as LogoCloud

**Placement Rules:** "Our Clients" section, partnership page.

**Spacing Rules:** Margin-y 6 (1.5rem).

**Frequency Rules:** 1 per page.

---

### WhatsAppButton

**Purpose:** Floating WhatsApp contact button.

**Props:**
- `phone` (required): string (E.164 format: +1234567890)
- `message` (optional): string (pre-filled message)
- `position` (optional): `'bottom-right' | 'bottom-left'` — Default: `'bottom-right'`
- `class` (optional): string

**MDX Usage:**
```mdx
<WhatsAppButton
  phone="+84912345678"
  message="Hi, I'd like to know more about your plywood products."
  position="bottom-right"
/>
```

**Placement Rules:** Floating, persistent across entire page.

**Spacing Rules:** Fixed position, 1.5rem from edge.

**Frequency Rules:** 1 per page (site-wide or per-page).

---

### FloatingCTA

**Purpose:** Floating call-to-action button that appears after user scrolls.

**Props:**
- `text` (required): string (button text)
- `href` (required): string (link destination)
- `position` (optional): `'bottom-right' | 'bottom-left' | 'bottom-center'`
- `showAfterScroll` (optional): number (pixel threshold to show button)

**MDX Usage:**
```mdx
<FloatingCTA
  text="Get Your Quote"
  href="/contact"
  position="bottom-right"
  showAfterScroll={500}
/>
```

**Placement Rules:** Floating, persistent after scroll threshold.

**Spacing Rules:** Fixed position.

**Frequency Rules:** 0-1 per page (use with caution to avoid distraction).

---

## General Usage Guidelines

### Component Selection Priority

1. **Prefer semantic components** over generic divs (use Hero, not div + styling)
2. **Responsive-first**: All components have mobile-first design; test on devices
3. **Accessibility**: All components follow WCAG standards (labels, alt text, focus states)
4. **Performance**: Lazy-load images; limit animations to important components

### Visual Rhythm Pattern

Create balanced page flow by alternating section backgrounds:

```
SectionWrapper bg="white"
  ↓
SectionWrapper bg="gradient"
  ↓
SectionWrapper bg="light"
  ↓
SectionWrapper bg="gradient-subtle"
  ↓
Repeat pattern
```

### Component Frequency Best Practices

| Component | Min/Page | Max/Page | Notes |
|-----------|----------|----------|-------|
| Highlight | 2 | 4 | Key phrases only |
| Hero | 1 | 1 | Page header only |
| CTA | 2 | 4 | Mid-section, footer |
| CTABlock | 1 | 2 | Between major sections |
| Callout | 1 | 3 | Important insights only |
| Stats | 1 | 2 | Mid-page or footer |
| Testimonial | 2 | 6 | Spread throughout |
| CardGrid | 1 | 2 | Feature showcases |
| FeatureGrid | 1 | 2 | Benefits section |
| FloatingBadge | 0 | 2 | Certification callouts |
| BentoGrid | 0 | 1 | Complex layouts only |
| Accordion | 0 | 1 | FAQ or deep specs |

### Accessibility Requirements

- ✓ All images have descriptive `alt` text
- ✓ Color not used alone for meaning (use labels, icons)
- ✓ All interactive components keyboard-accessible (Tab, Enter)
- ✓ Focus states visible (blue outline, no invisible focus)
- ✓ Skip-to-content link on every page
- ✓ Heading hierarchy: H1 (once per page) → H2 → H3
- ✓ Form labels explicitly associated with inputs

### Mobile-First Guidelines

- Test every component at 375px width (mobile)
- Stack grids to 1 column on mobile (automatically handled)
- Ensure touch targets ≥44px (WCAG AAA standard)
- Reduce animation on prefers-reduced-motion
- Stack buttons vertically on mobile (< 640px)
- Avoid horizontal scroll; use vertical rhythm

### Content Beautification Rules

To ensure **"long content that's still beautiful"**:

1. **Break text every 300-500 words** with visual element (image, callout, divider, feature block)
2. **Alternate text alignment** occasionally (left, center, left)
3. **Use whitespace deliberately**—don't cram content
4. **Highlight keywords** with Highlight component (2-3 max per section)
5. **Mix component types**—don't repeat same component consecutively
6. **Use color strategically**—gradients for emphasis, neutrals for calm
7. **Add micro-interactions**—ScrollReveal, hover states, animations (subtle)

### Component Customization

All components accept `class` prop for Tailwind overrides:

```mdx
<Card
  title="Premium"
  description="High-end solution"
  class="shadow-2xl border-2 border-primary-600"
/>
```

Override default styles carefully; maintain brand consistency.

---

## Maintenance

**Version History:**
- **1.0.0** (2025-02-16) – Initial catalog with 64 components

**Update Workflow:**
1. When adding new component: Create `.astro` file in `src/components/mdx/`
2. Add Props interface to component
3. Update this catalog with new entry
4. Test with ai-content-rewriter
5. Commit both files together

**Review Checklist:**
- [ ] Props match implementation
- [ ] MDX example uses realistic plywood/B2B context
- [ ] Frequency rules prevent AI overuse
- [ ] Placement rules help writer know when to use
- [ ] All links to related components are valid

**Last Updated:** 2025-02-16
**Maintained By:** docs-manager agent
**Consumer:** ai-content-rewriter skill
