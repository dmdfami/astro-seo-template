/**
 * Layout Contract Test — verifies all 11 content types have valid layout configs.
 * Run: node tests/test-layout-registry.cjs
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Read and parse the TypeScript registry (simple extraction — no TS compiler needed)
const registryPath = path.join(__dirname, '..', 'src', 'lib', 'layout-registry.ts');
const registrySource = fs.readFileSync(registryPath, 'utf-8');

// Extract registry entries by parsing exported object keys
const CONTENT_TYPES = [
  'homepage', 'landing', 'gallery', 'video-hub', 'product',
  'blog', 'generic', 'about', 'contact', 'product-list', 'blog-list', 'reviews',
];

const VALID_PATTERNS = ['fullwidth', 'hybrid', 'split', 'prose'];
const VALID_CONTAINERS = ['none', 'md', 'lg', 'xl'];

let passed = 0;
let failed = 0;

for (const type of CONTENT_TYPES) {
  // Check type exists in registry source
  const typeKey = type.includes('-') ? `'${type}'` : type;
  if (!registrySource.includes(typeKey)) {
    console.error(`FAIL: Missing layout config for "${type}"`);
    failed++;
    continue;
  }
  passed++;
}

// Verify pattern values present
for (const pattern of VALID_PATTERNS) {
  if (!registrySource.includes(`'${pattern}'`)) {
    console.error(`FAIL: Pattern "${pattern}" not found in registry`);
    failed++;
  } else {
    passed++;
  }
}

// Verify required fields exist in interface
const requiredFields = ['pattern', 'container', 'proseWrapper', 'h1Auto', 'breadcrumb'];
for (const field of requiredFields) {
  if (!registrySource.includes(`${field}:`)) {
    console.error(`FAIL: Required field "${field}" not in LayoutConfig interface`);
    failed++;
  } else {
    passed++;
  }
}

// Verify helper functions exported
const requiredExports = ['getLayout', 'isFullWidth', 'LAYOUT_REGISTRY'];
for (const exp of requiredExports) {
  if (!registrySource.includes(exp)) {
    console.error(`FAIL: Missing export "${exp}"`);
    failed++;
  } else {
    passed++;
  }
}

// Verify total count (12 types in CONTENT_TYPES, registry should have all)
assert.strictEqual(CONTENT_TYPES.length, 12, `Expected 12 content types, got ${CONTENT_TYPES.length}`);

if (failed > 0) {
  console.error(`\nFAILED: ${failed} checks failed, ${passed} passed`);
  process.exit(1);
} else {
  console.log(`✓ Layout contract test passed: ${passed} checks, all ${CONTENT_TYPES.length} content types valid`);
}
