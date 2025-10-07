const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Fixing GoogleReviews conditional check...\n');

// Find all surgeon profile pages
const surgeonPages = glob.sync('src/pages/surgeons/**/*.astro');

let fixedCount = 0;
let skippedCount = 0;

surgeonPages.forEach((filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Check if the file has GoogleReviews component
    if (!content.includes('<GoogleReviews')) {
      skippedCount++;
      return;
    }
    
    // Check if already fixed
    if (content.includes('{surgeon.slug && (')) {
      console.log(`   ⏭️  Already fixed: ${path.basename(filePath)}`);
      skippedCount++;
      return;
    }
    
    // Replace surgeon.place_id with surgeon.slug in the conditional
    const before = '{surgeon.place_id && (';
    const after = '{surgeon.slug && (';
    
    if (content.includes(before)) {
      content = content.replaceAll(before, after);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`   ✅ Fixed: ${path.basename(filePath)}`);
      fixedCount++;
    } else {
      console.log(`   ⚠️  Pattern not found: ${path.basename(filePath)}`);
      skippedCount++;
    }
  } catch (err) {
    console.error(`   ❌ Error processing ${filePath}:`, err.message);
  }
});

console.log(`\n✅ Complete!`);
console.log(`   Fixed: ${fixedCount} files`);
console.log(`   Skipped: ${skippedCount} files`);
