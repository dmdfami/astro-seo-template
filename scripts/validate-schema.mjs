import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const distDir = './dist';

function extractSchemas(html) {
  const regex = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
  const matches = [...html.matchAll(regex)];
  return matches.map(m => {
    try { return JSON.parse(m[1].trim()); }
    catch { return null; }
  }).filter(Boolean);
}

function validateSchema(schema) {
  const errors = [];
  if (!schema['@context']) errors.push('Missing @context');
  if (!schema['@type']) errors.push('Missing @type');

  if (schema['@type'] === 'Article') {
    if (!schema.headline) errors.push('Article missing headline');
    if (!schema.datePublished) errors.push('Article missing datePublished');
    if (!schema.author) errors.push('Article missing author');
  }
  if (schema['@type'] === 'Product') {
    if (!schema.name) errors.push('Product missing name');
    if (!schema.description) errors.push('Product missing description');
  }
  return errors;
}

function scanHTMLFiles(dir) {
  const files = readdirSync(dir, { recursive: true, withFileTypes: true });
  let totalSchemas = 0;
  let totalErrors = 0;

  files.forEach(file => {
    if (file.isFile() && file.name.endsWith('.html')) {
      const filePath = join(file.parentPath || file.path, file.name);
      const html = readFileSync(filePath, 'utf-8');
      const schemas = extractSchemas(html);

      schemas.forEach(schema => {
        totalSchemas++;
        const errors = validateSchema(schema);
        if (errors.length > 0) {
          console.log(`\n❌ ${filePath}`);
          console.log(`   Type: ${schema['@type']}`);
          errors.forEach(err => console.log(`   - ${err}`));
          totalErrors += errors.length;
        }
      });
    }
  });

  console.log(`\n✅ Scanned ${totalSchemas} schemas, found ${totalErrors} errors`);
  if (totalErrors > 0) process.exit(1);
}

scanHTMLFiles(distDir);
