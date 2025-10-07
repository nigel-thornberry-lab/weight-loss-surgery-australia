const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Making sidebar sticky to fix layout gap...\n');

// Find all surgeon profile pages
const surgeonPages = glob.sync('src/pages/surgeons/**/*.astro');

let fixedCount = 0;
let skippedCount = 0;

surgeonPages.forEach((filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Check if the file has the sidebar structure
    if (!content.includes('<!-- Left Sidebar: Photo + Rating + CTAs -->')) {
      skippedCount++;
      return;
    }
    
    // Check if already fixed
    if (content.includes('sticky top-4')) {
      console.log(`   ⏭️  Already fixed: ${path.basename(filePath)}`);
      skippedCount++;
      return;
    }
    
    // Add sticky positioning to the left sidebar
    const before = '<!-- Left Sidebar: Photo + Rating + CTAs -->\n          <div class="space-y-4">';
    const after = '<!-- Left Sidebar: Photo + Rating + CTAs -->\n          <div class="space-y-4 sticky top-4 self-start">';
    
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
console.log(`\n💡 The sidebar will now stay visible as you scroll, eliminating the gap!`);
