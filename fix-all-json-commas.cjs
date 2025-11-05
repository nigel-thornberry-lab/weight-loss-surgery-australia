#!/usr/bin/env node

/**
 * Fix all JSON syntax errors in surgeon files
 * Specifically: missing commas after "name" property in schema_org
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing all JSON comma errors in surgeon files...\n');

let totalFixed = 0;

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Fix 1: Missing comma after "name" in schema_org (frontmatter)
  // Pattern: "name": "Dr X"[newline][spaces]"address":
  content = content.replace(
    /("name":\s*"[^"]*")\s*\n(\s*"address":)/g,
    '$1,\n$2'
  );

  // Fix 2: Missing comma after "name" in schema_org (with medicalSpecialty)
  // Pattern: "name": "Dr X"[newline][spaces]"medicalSpecialty":
  content = content.replace(
    /("name":\s*"[^"]*")\s*\n(\s*"medicalSpecialty":)/g,
    '$1,\n$2'
  );

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

function processDirectory(dir) {
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      processDirectory(itemPath);
    } else if (item.endsWith('.astro')) {
      const fixed = fixFile(itemPath);
      if (fixed) {
        totalFixed++;
        console.log(`  ✓ Fixed: ${path.relative(process.cwd(), itemPath)}`);
      }
    }
  });
}

try {
  const surgeonsDir = path.join(__dirname, 'src', 'pages', 'surgeons');
  processDirectory(surgeonsDir);

  console.log(`\n✅ Fixed ${totalFixed} files with JSON comma errors\n`);
  console.log('🔨 Next: npm run build');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
