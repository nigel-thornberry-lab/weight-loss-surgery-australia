#!/usr/bin/env node

/**
 * Remove medicalSpecialty from LocalBusiness schema
 * LocalBusiness doesn't support this property - only Physician does
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Removing medicalSpecialty from LocalBusiness schema...\n');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Remove the medicalSpecialty line from LocalBusiness schema
  // Pattern: "medicalSpecialty": "...", or "medicalSpecialty": ["..."],
  const patterns = [
    /,?\s*"medicalSpecialty":\s*"[^"]*",?\s*\n/g,
    /,?\s*"medicalSpecialty":\s*\[[^\]]*\],?\s*\n/g
  ];

  patterns.forEach(pattern => {
    if (content.match(pattern)) {
      content = content.replace(pattern, '\n');
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

// Process all surgeon pages
function fixSurgeonPages() {
  console.log('📄 Fixing surgeon pages...');
  const surgeonsDir = path.join(__dirname, 'src', 'pages', 'surgeons');
  let fixedCount = 0;

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
          fixedCount++;
        }
      }
    });
  }

  processDirectory(surgeonsDir);
  console.log(`✅ Fixed ${fixedCount} surgeon pages\n`);
}

// Main execution
try {
  fixSurgeonPages();

  console.log('✅ All medicalSpecialty properties removed from LocalBusiness!');
  console.log('\n📋 Note:');
  console.log('  - medicalSpecialty is KEPT in Physician schema (correct)');
  console.log('  - medicalSpecialty REMOVED from LocalBusiness schema (not supported)');
  console.log('\n🔨 Next steps:');
  console.log('  1. npm run build');
  console.log('  2. vercel --prod');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
