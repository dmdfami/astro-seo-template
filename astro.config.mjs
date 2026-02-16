// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import AutoImport from 'astro-auto-import';
import mdx from '@astrojs/mdx';
import pagefind from 'astro-pagefind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://vietnam-plywood.com',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    AutoImport({
      imports: [
        // Core Content
        './src/components/mdx/Hero.astro',
        './src/components/mdx/AuthorBox.astro',
        './src/components/mdx/TOC.astro',
        './src/components/mdx/Callout.astro',
        './src/components/mdx/CTA.astro',
        './src/components/mdx/CTABlock.astro',
        './src/components/mdx/Stats.astro',
        './src/components/mdx/Steps.astro',
        './src/components/mdx/Step.astro',
        './src/components/mdx/FAQ.astro',
        './src/components/mdx/Newsletter.astro',
        './src/components/mdx/LogoCloud.astro',
        './src/components/mdx/MdxImage.astro',
        // Data/Interactive
        './src/components/mdx/CardGrid.astro',
        './src/components/mdx/Card.astro',
        './src/components/mdx/Testimonial.astro',
        './src/components/mdx/ComparisonTable.astro',
        './src/components/mdx/Tabs.astro',
        './src/components/mdx/PricingTable.astro',
        './src/components/mdx/Accordion.astro',
        './src/components/mdx/Modal.astro',
        './src/components/mdx/Tooltip.astro',
        './src/components/mdx/Drawer.astro',
        // Product/Visual
        './src/components/mdx/SpecTable.astro',
        './src/components/mdx/Gallery.astro',
        './src/components/mdx/BeforeAfter.astro',
        './src/components/mdx/Counter.astro',
        './src/components/mdx/ProgressBar.astro',
        './src/components/mdx/CertBadges.astro',
        './src/components/mdx/FeatureGrid.astro',
        './src/components/mdx/ProcessFlow.astro',
        './src/components/mdx/StarRating.astro',
        './src/components/mdx/ReviewCard.astro',
        './src/components/mdx/PriceRange.astro',
        // Social/Trust
        './src/components/mdx/SocialLinks.astro',
        './src/components/mdx/TrustBar.astro',
        './src/components/mdx/ClientLogos.astro',
        './src/components/mdx/WhatsAppButton.astro',
        './src/components/mdx/FloatingCTA.astro',
        './src/components/mdx/VideoEmbed.astro',
        './src/components/mdx/ContactForm.astro',
        './src/components/mdx/ScrollReveal.astro',
        './src/components/mdx/Timeline.astro',
        './src/components/mdx/TeamGrid.astro',
        // Pipeline additions
        './src/components/mdx/Badge.astro',
        './src/components/mdx/BreadcrumbNav.astro',
        './src/components/mdx/Image.astro',
        // Premium components
        './src/components/mdx/Highlight.astro',
        './src/components/mdx/FloatingBadge.astro',
        './src/components/mdx/BentoGrid.astro',
        './src/components/mdx/BentoItem.astro',
        './src/components/mdx/SectionWrapper.astro',
        './src/components/mdx/ImageWithFallback.astro',
        // Utility components
        './src/components/mdx/Alert.astro',
        './src/components/mdx/Banner.astro',
        './src/components/mdx/Blockquote.astro',
        './src/components/mdx/DividerLine.astro',
        './src/components/mdx/List.astro',
        './src/components/mdx/Logo.astro',
        './src/components/mdx/Metric.astro',
        './src/components/mdx/Pagination.astro',
        './src/components/mdx/PricingCard.astro',
        './src/components/mdx/Quote.astro',
        './src/components/mdx/Table.astro',
      ],
    }),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/draft/'),
    }),
    pagefind(),
  ],
});
