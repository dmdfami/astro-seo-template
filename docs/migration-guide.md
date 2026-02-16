# Migration Guide

## Migrating Existing MDX Content

### Step 1: Remove Import Statements
All components are auto-imported. Remove all `import` lines from MDX files.

**Before:**
```mdx
---
title: "My Post"
---
import Hero from '@components/mdx/Hero.astro';
import CTA from '@components/mdx/CTA.astro';

<Hero title="Welcome" />
<CTA href="/contact">Contact</CTA>
```

**After:**
```mdx
---
title: "My Post"
---
<Hero title="Welcome" />
<CTA href="/contact">Contact</CTA>
```

Bulk remove:
```bash
# Remove all import lines from MDX files
find src/content -name "*.mdx" -exec sed -i '' '/^import.*from/d' {} +
```

### Step 2: Update Frontmatter

Ensure all frontmatter matches collection schemas.

**Blog posts require:**
```yaml
title: "string"
description: "string"
publishDate: YYYY-MM-DD
```

**Products require:**
```yaml
title: "string"
description: "string"
```

**Pages require:**
```yaml
title: "string"
description: "string"
contentType: "landing" | "generic" | "homepage"
```

### Step 3: Update Component Usage

Some component APIs may have changed. Check `docs/component-api.md` for current props.

**CTA unified API:**
```mdx
<!-- Props-based (for paired buttons) -->
<CTA
  primary={{ text: "Get Quote", url: "/contact" }}
  secondary={{ text: "Learn More", url: "/about" }}
/>

<!-- Slot-based (for inline) -->
<CTA href="/contact" variant="primary">Request Quote</CTA>
```

### Step 4: Test Build
```bash
npm run build
```

Fix any validation errors reported by Astro content collections.

### Step 5: Validate SEO
```bash
npm run test:schema
```

Verify Schema.org structured data is valid on all pages.
