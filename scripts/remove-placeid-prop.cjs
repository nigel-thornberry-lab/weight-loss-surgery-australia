const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Removing placeId prop from GoogleReviews calls...\n');

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
    
    // Check if placeId prop exists
    if (!content.includes('placeId={surgeon.place_id}')) {
      console.log(`   ⏭️  Already fixed: ${path.basename(filePath)}`);
      skippedCount++;
      return;
    }
    
    // Remove the placeId line
    const before = 'placeId={surgeon.place_id}\n            surgeonName={cleanName}';
    const after = 'surgeonName={cleanName}';
    
    if (content.includes(before)) {
      content = content.replace(before, after);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`   ✅ Fixed: ${path.basename(filePath)}`);
      fixedCount++;
    } else {
      console.log(`   ⚠️  Pattern not found in: ${path.basename(filePath)}`);
      skippedCount++;
    }
  } catch (err) {
    console.error(`   ❌ Error processing ${filePath}:`, err.message);
  }
});

console.log(`\n✅ Complete!`);
console.log(`   Fixed: ${fixedCount} files`);
console.log(`   Skipped: ${skippedCount} files`);
