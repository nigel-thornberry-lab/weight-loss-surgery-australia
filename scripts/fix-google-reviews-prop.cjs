const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Fixing GoogleReviews component props...\n');

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
    
    // Check if surgeonSlug is already present
    if (content.includes('surgeonSlug={')) {
      console.log(`   ⏭️  Already fixed: ${path.basename(filePath)}`);
      skippedCount++;
      return;
    }
    
    // Simple string replacement approach
    // Look for: surgeonName={cleanName}\n and add surgeonSlug after it
    const before = 'surgeonName={cleanName}\n            rating={surgeon.rating}';
    const after = 'surgeonName={cleanName}\n            surgeonSlug={surgeon.slug}\n            rating={surgeon.rating}';
    
    if (content.includes(before)) {
      content = content.replace(before, after);
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
