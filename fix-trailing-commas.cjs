#!/usr/bin/env node

/**
 * Fix all trailing comma issues after removing medicalSpecialty
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing trailing comma issues...\n');

let totalFixed = 0;

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix patterns where a line ends without comma before next property
  const fixes = [
    // currenciesAccepted without comma before aggregateRating
    {
      pattern: /("currenciesAccepted":\s*"AUD")\s*\n(\s*"aggregateRating")/g,
      replacement: '$1,\n$2'
    },
    // memberOf without comma before availableService
    {
      pattern: /(\]\])\s*\n(\s*\/\/ Add procedures offered\s*\n\s*"availableService")/g,
      replacement: '$1,\n$2'
    },
    // Array closing without comma
    {
      pattern: /(\]\))\s*\n(\s*"availableService")/g,
      replacement: '$1,\n$2'
    },
    // yearsOfExperience without comma
    {
      pattern: /("yearsOfExperience":\s*[^,\n]+)\s*\n(\s*\/\/ Add professional)/g,
      replacement: '$1,\n$2'
    }
  ];

  fixes.forEach(fix => {
    if (content.match(fix.pattern)) {
      content = content.replace(fix.pattern, fix.replacement);
      modified = true;
    }
  });

  if (modified) {
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
        console.log(`  ✓ ${path.basename(itemPath)}`);
      }
    }
  });
}

try {
  const surgeonsDir = path.join(__dirname, 'src', 'pages', 'surgeons');
  processDirectory(surgeonsDir);

  console.log(`\n✅ Fixed ${totalFixed} files\n`);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
