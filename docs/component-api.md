# Component API Reference

All 44 components are auto-imported via `astro-auto-import`. **No `import` statements needed in MDX.**

## Core Content Components

### Hero
Full-width hero section with CTA buttons.
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

### AuthorBox
Author bio with avatar and social links.
```mdx
<AuthorBox name="John Doe" role="Content Writer" avatar="/images/john.jpg" />
```

### TOC
Auto-generated table of contents. Place at top of article.
```mdx
<TOC />
```

### Callout
Info/warning/success/error callout boxes.
```mdx
<Callout type="info" title="Pro Tip">Your content here</Callout>
<!-- type: info | warning | success | error -->
```

### CTA
Unified call-to-action. Props-based or slot-based.
```mdx
<!-- Props-based -->
<CTA
  primary={{ text: "Get Quote", url: "/contact" }}
  secondary={{ text: "Learn More", url: "/about" }}
/>

<!-- Slot-based -->
<CTA href="/contact" variant="primary">Request Quote</CTA>
```

### CTABlock
Full-width CTA section with background.
```mdx
<CTABlock
  title="Ready to start?"
  description="Contact us today"
  cta={{ primary: { text: "Get Quote", url: "/contact" } }}
  background="gradient"
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
