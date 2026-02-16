# Deployment Guide

## Fork-Per-Site Model

Each client website gets its own repository fork. This provides:
- Independent versioning and deployment
- Custom branding via JSON config files
- No shared infrastructure concerns

## Setup Steps

### 1. Fork Template
```bash
gh repo fork your-org/astro-seo-template --clone
cd astro-seo-template
npm install
```

### 2. Configure Site Identity

Replace these 3 files:

**`site-config.json`** — Site metadata, navigation, contact
```json
{
  "site": {
    "name": "Client Corp",
    "url": "https://clientcorp.com",
    "description": "Client description",
    "language": "en",
    "defaultImage": "/images/og-default.jpg"
  }
}
```

**`schema-org.json`** — Schema.org structured data
```json
{
  "organization": {
    "name": "Client Corp",
    "url": "https://clientcorp.com",
    "logo": "https://clientcorp.com/logo.png"
  }
}
```

**`design-tokens.json`** — Visual identity (colors, fonts, spacing)
```json
{
  "colors": {
    "primary": { "50": "oklch(0.97 0.01 250)", ... }
  },
  "typography": {
    "fontFamily": { "heading": "Poppins", "body": "Inter" }
  }
}
```

### 3. Generate Theme
```bash
npm run dev  # auto-runs generate-theme.mjs via prebuild
```

### 4. Add Content
Place MDX files in:
- `src/content/blog/` — Blog posts
- `src/content/products/` — Products
- `src/content/pages/` — Generic/landing pages

### 5. Add Assets
- `public/images/` — Site images
- `public/logo.png` — Site logo
- `public/images/og-default.jpg` — Default OG image (1200x630)

## Cloudflare Pages Deployment

### Via Dashboard
1. Connect GitHub repo to Cloudflare Pages
2. Build settings:
   - Build command: `npm run build`
   - Build output: `dist`
   - Node version: `20`
3. Add custom domain

### Via CLI (Wrangler)
```bash
npm install -g wrangler
wrangler pages deploy dist --project-name=client-site
```

### Environment Variables
No env vars required — all config via JSON files.

## Build Verification

```bash
# Full build
npm run build

# Validate Schema.org
npm run test:schema

# Preview locally
npm run preview
```

## Production Checklist

- [ ] Update `site-config.json` with real domain + contact
- [ ] Update `schema-org.json` with organization data
- [ ] Update `design-tokens.json` with brand colors/fonts
- [ ] Add real OG image at `public/images/og-default.jpg`
- [ ] Add favicon at `public/favicon.svg`
- [ ] Update `astro.config.mjs` site URL
- [ ] Update `public/robots.txt` sitemap URL
- [ ] Remove sample content from `src/content/`
- [ ] Add real content
- [ ] Build and verify zero errors
- [ ] Test all pages render correctly
- [ ] Verify sitemap at `/sitemap-index.xml`
- [ ] Test OG tags with Facebook/Twitter validators
