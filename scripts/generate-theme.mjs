import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const tokens = JSON.parse(readFileSync(join(rootDir, 'design-tokens.json'), 'utf-8'));

let css = '/* AUTO-GENERATED - DO NOT EDIT */\n/* Run: node scripts/generate-theme.mjs */\n\n@theme {\n';

// Colors
for (const [palette, shades] of Object.entries(tokens.colors)) {
  for (const [shade, value] of Object.entries(shades)) {
    css += `  --color-${palette}-${shade}: ${value};\n`;
  }
}

// Typography
for (const [name, value] of Object.entries(tokens.typography.fonts)) {
  css += `  --font-${name}: ${value};\n`;
}
for (const [size, value] of Object.entries(tokens.typography.sizes)) {
  css += `  --text-${size}: ${value};\n`;
}

// Spacing - only base unit for Tailwind CSS 4 numeric scale (p-4 = 1rem, etc.)
// Named tokens (xs, sm, md, lg, xl, 2xl, 3xl) are NOT output as --spacing-*
// because they conflict with Tailwind's max-w-2xl, max-w-3xl etc. utilities
css += `  --spacing: 0.25rem;\n`;

// Radius
for (const [name, value] of Object.entries(tokens.radius)) {
  css += `  --radius-${name}: ${value};\n`;
}

// Shadows
for (const [name, value] of Object.entries(tokens.shadows)) {
  css += `  --shadow-${name}: ${value};\n`;
}

css += '}\n\n';

// Runtime CSS variables
css += '/* Runtime CSS variables */\n';
css += ':root {\n';
css += `  --glass-bg: ${tokens.glass.bg};\n`;
css += `  --glass-bg-light: ${tokens.glass.bgLight};\n`;
css += `  --glass-border: ${tokens.glass.border};\n`;
css += `  --glass-blur: ${tokens.glass.blur};\n`;
css += `  --gradient-hero: ${tokens.gradients.hero};\n`;
css += `  --gradient-card: ${tokens.gradients.card};\n`;
css += `  --gradient-accent: ${tokens.gradients.accent};\n`;
css += `  --gradient-text-primary: ${tokens.gradients['text-primary']};\n`;
css += `  --gradient-text-teal-blue: ${tokens.gradients['text-teal-blue']};\n`;
css += `  --gradient-text-accent: ${tokens.gradients['text-accent']};\n`;
css += '}\n';

writeFileSync(join(rootDir, 'src/styles/theme.css'), css);
console.log('✅ Generated src/styles/theme.css from design-tokens.json');
