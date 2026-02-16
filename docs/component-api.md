# Component API Reference

All 44 components are auto-imported via `astro-auto-import`. **No `import` statements needed in MDX.**

## Dual-API Components (Template + Pipeline)

Starting with Template Pipeline Alignment (Phase 5), **7 core content components support both legacy template API and modern rewriter pipeline API**. This enables backward compatibility while supporting new pipeline workflows.

**Dual-API Components:** FAQ, CTA, CTABlock, Hero, AuthorBox, TOC, Callout

**Key Principles:**
- Use **template API** (original props) for direct MDX content
- Use **pipeline API** (rewriter fields) for ai-content-rewriter pipeline integration
- Both APIs work simultaneously in the same component
- No breaking changes to existing content

---

## Core Content Components

### Hero
Full-width hero section with CTA buttons.

**Template API:**
```mdx
<Hero
  title="Your Title"
  subtitle="Your subtitle"
  variant="centered"  <!-- default | centered | split -->
  background="gradient"  <!-- gradient | solid | none -->
  cta={{
    primary: { text: "Get Started", url: "/contact" },
    secondary: { text: "Learn More", url: "/about" }
  }}
/>
```

**Pipeline API:**
```mdx
<Hero
  content={{ title: "...", subtitle: "...", ctaText: "...", ctaUrl: "..." }}
  sectionId="hero"
/>
```

### AuthorBox
Author bio with avatar and social links.

**Template API:**
```mdx
<AuthorBox name="John Doe" role="Content Writer" avatar="/images/john.jpg" />
```

**Pipeline API:**
```mdx
<AuthorBox
  content={{ name: "John Doe", jobTitle: "Content Writer", sameAs: [...], image: "..." }}
/>
```

### TOC
Auto-generated table of contents. Place at top of article.

**Template API:**
```mdx
<TOC />
```

**Pipeline API:**
```mdx
<TOC content={{ headings: [...] }} />
```

### Callout
Info/warning/success/error callout boxes.

**Template API:**
```mdx
<Callout type="info" title="Pro Tip">Your content here</Callout>
<!-- type: info | warning | success | error -->
```

**Pipeline API:**
```mdx
<Callout content={{ type: "info", title: "...", body: "..." }} />
```

### CTA
Unified call-to-action. Props-based or slot-based.

**Template API:**
```mdx
<!-- Props-based -->
<CTA
  primary={{ text: "Get Quote", url: "/contact" }}
  secondary={{ text: "Learn More", url: "/about" }}
/>

<!-- Slot-based -->
<CTA href="/contact" variant="primary">Request Quote</CTA>
```

**Pipeline API:**
```mdx
<CTA content={{ primary: { text: "...", url: "..." }, secondary: {...} }} />
```

### CTABlock
Full-width CTA section with background.

**Template API:**
```mdx
<CTABlock
  title="Ready to start?"
  description="Contact us today"
  cta={{ primary: { text: "Get Quote", url: "/contact" } }}
  background="gradient"
/>
```

**Pipeline API:**
```mdx
<CTABlock
  content={{ title: "...", description: "...", cta: {...} }}
  sectionId="cta"
/>
```

### Stats
Statistics grid with animated counters.
```mdx
<Stats items={[
  { value: "500+", label: "Happy Clients" },
  { value: "99%", label: "Satisfaction" }
]} />
```

### Steps / Step
Numbered step lists.
```mdx
<Steps>
  <Step title="Step One" number={1}>Description</Step>
  <Step title="Step Two" number={2}>Description</Step>
</Steps>
```

### FAQ
Collapsible FAQ with Schema.org markup.
```mdx
<FAQ items={[
  { q: "Question?", a: "Answer." },
  { q: "Another?", a: "Another answer." }
]} />
```

### Newsletter
Email signup form.
```mdx
<Newsletter title="Subscribe" description="Get updates" />
```

### LogoCloud
Responsive logo grid with grayscale hover.
```mdx
<LogoCloud logos={[
  { name: "Company", src: "/images/logo.png" }
]} />
```

### MdxImage
Optimized image with caption.
```mdx
<MdxImage src="/images/photo.jpg" alt="Description" caption="Photo caption" />
```

## Data/Interactive Components

### CardGrid / Card
Responsive card grid.
```mdx
<CardGrid cols={3}>
  <Card title="Title" description="Description" />
  <Card title="Title 2" description="Description 2" />
</CardGrid>
```

### ComparisonTable
Feature comparison.
```mdx
<ComparisonTable
  headers={["Feature", "Plan A", "Plan B"]}
  rows={[["Storage", "10GB", "100GB"]]}
/>
```

### Tabs
Tabbed content with keyboard nav.
```mdx
<Tabs tabs={[
  { label: "Tab 1", content: "Content 1" },
  { label: "Tab 2", content: "Content 2" }
]} />
```

### PricingTable
Pricing plans display.
```mdx
<PricingTable plans={[{
  name: "Pro", price: "$29/mo",
  features: ["Feature 1", "Feature 2"],
  cta: { text: "Start", url: "/signup" },
  featured: true
}]} />
```

### Accordion
Expandable content sections.
```mdx
<Accordion items={[
  { title: "Section 1", content: "Content 1" }
]} />
```

### Modal / Tooltip / Drawer
Interactive overlays.
```mdx
<Modal trigger="Open Modal" title="Modal Title">Content</Modal>
<Tooltip text="Hover text">Trigger element</Tooltip>
<Drawer trigger="Open" position="right">Content</Drawer>
```

## Product/Visual Components

### SpecTable
Product specifications.
```mdx
<SpecTable specs={{ Thickness: "18mm", Grade: "A/A" }} variant="table" />
```

### Gallery
Image gallery with lightbox.
```mdx
<Gallery images={[
  { src: "/images/1.jpg", alt: "Photo 1" }
]} layout="grid" />
```

### BeforeAfter
Image comparison slider.
```mdx
<BeforeAfter before="/images/before.jpg" after="/images/after.jpg" />
```

### Counter
Animated count-up on scroll.
```mdx
<Counter target={500} suffix="+" duration={2000} />
```

### ProgressBar
Animated progress bar.
```mdx
<ProgressBar value={85} label="Completion" color="primary" />
```

### CertBadges
Certification badges grid.
```mdx
<CertBadges badges={[
  { name: "ISO 9001", image: "/images/iso.png" }
]} />
```

### FeatureGrid
Feature showcase grid.
```mdx
<FeatureGrid features={[
  { title: "Fast", description: "Lightning speed", icon: "bolt" }
]} />
```

### ProcessFlow
Step-by-step process visualization.
```mdx
<ProcessFlow steps={[
  { title: "Order", description: "Place your order" },
  { title: "Ship", description: "We ship within 24h" }
]} />
```

### StarRating / ReviewCard / PriceRange
Product review components.
```mdx
<StarRating rating={4.5} />
<ReviewCard author="Jane" rating={5} content="Great product!" verified={true} />
<PriceRange min={45} max={65} currency="$" unit="per sheet" />
```

## Social/Trust Components

### SocialLinks
Social media links with platform icons.
```mdx
<SocialLinks links={[
  { platform: "twitter", url: "https://twitter.com/example" }
]} />
```

### TrustBar
Trust signal indicators.
```mdx
<TrustBar items={[
  { icon: "verified", text: "ISO 9001 Certified" },
  { icon: "secure", text: "SSL Encrypted" }
]} />
```

### ClientLogos
Client logo showcase with optional marquee.
```mdx
<ClientLogos clients={[
  { name: "Acme", logo: "/images/acme.png" }
]} marquee={true} />
```

### WhatsAppButton
Floating WhatsApp contact button.
```mdx
<WhatsAppButton phone="+1234567890" message="Hello!" />
```

### FloatingCTA
Floating CTA that appears on scroll.
```mdx
<FloatingCTA text="Get Quote" url="/contact" />
```

### VideoEmbed
YouTube/Vimeo embed with privacy mode.
```mdx
<VideoEmbed url="https://youtube.com/watch?v=..." title="Demo Video" />
```

### ContactForm
Static HTML contact form.
```mdx
<ContactForm action="/api/contact" />
```

### ScrollReveal
Scroll-triggered animations wrapper.
```mdx
<ScrollReveal animation="fade-up"><p>Animated content</p></ScrollReveal>
```

### Timeline
Vertical timeline.
```mdx
<Timeline items={[
  { date: "2020", title: "Founded", description: "Company started" }
]} />
```

### TeamGrid
Team member showcase.
```mdx
<TeamGrid members={[
  { name: "Jane", role: "CEO", image: "/images/jane.jpg" }
]} />
```

## New Utility Wrappers (v1.1)

### Badge
Flexible badge component for tags, labels, and status indicators.
```mdx
<Badge variant="primary">New</Badge>
<Badge variant="success">Active</Badge>
```

### BreadcrumbNav
SEO-friendly breadcrumb navigation with Schema.org markup.
```mdx
<BreadcrumbNav />
<!-- Auto-generates from current page hierarchy -->
```

### Image
Optimized image wrapper with lazy loading and responsive variants.
```mdx
<Image
  src="/images/photo.jpg"
  alt="Description"
  width={1200}
  height={600}
  loading="lazy"
/>
```

## FAQ (Dual-API)
Collapsible FAQ with Schema.org markup.

**Template API:**
```mdx
<FAQ items={[
  { q: "Question?", a: "Answer." },
  { q: "Another?", a: "Another answer." }
]} />
```

**Pipeline API:**
```mdx
<FAQ
  content={{
    mainEntity: [
      { "@type": "Question", name: "...", acceptedAnswer: { "@type": "Answer", text: "..." } }
    ]
  }}
/>
```

## Testimonial
Customer testimonial with rating and metadata.

**Template API:**
```mdx
<Testimonial
  author="Jane Smith"
  role="CEO, Acme Corp"
  avatar="/images/jane.jpg"
  rating={5}
>
  This product changed our business.
</Testimonial>
```

**Pipeline API:**
```mdx
<Testimonial
  content={{
    author: "Jane Smith",
    jobTitle: "CEO",
    affiliation: "Acme Corp",
    text: "...",
    ratingValue: 5
  }}
/>
```
