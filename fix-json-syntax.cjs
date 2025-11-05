#!/usr/bin/env node

/**
 * Fix JSON syntax error: missing comma after address object in Physician schema
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing JSON syntax errors...\n');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix: Missing comma after address closing brace before comment
  // Pattern: }[newline][whitespace]// Add credentials
  const pattern1 = /(\s*"addressCountry": "AU"\s*\n\s*})\s*\n(\s*\/\/ Add credentials)/g;
  if (content.match(pattern1)) {
    content = content.replace(pattern1, '$1,\n$2');
    modified = true;
  }

  // Alternative pattern without addressCountry
  const pattern2 = /(\s*}\s*)\n(\s*\/\/ Add )/g;
  const matches = content.match(pattern2);
  if (matches) {
    // Only fix if it's inside physicianSchema
    const physicianStart = content.indexOf('const physicianSchema');
    const physicianEnd = content.indexOf('};', physicianStart);

    if (physicianStart > -1 && physicianEnd > -1) {
      let physicianSection = content.substring(physicianStart, physicianEnd);
      if (physicianSection.match(/}\s*\n\s*\/\/ Add credentials\s*\n\s*"hasCredential"/)) {
        content = content.replace(
          /("addressCountry": "AU"\s*\n\s*})\s*\n(\s*\/\/ Add credentials)/,
          '$1,\n$2'
        );
        modified = true;
      }
    }
  }

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
          console.log(`  ✓ Fixed: ${path.basename(itemPath)}`);
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

  console.log('✅ All JSON syntax errors fixed!');
  console.log('\n🔨 Next steps:');
  console.log('  1. npm run build');
  console.log('  2. vercel --prod');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
