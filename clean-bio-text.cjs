const fs = require('fs');
const path = require('path');

/**
 * Clean Bio Text Script
 * 
 * This script cleans up the bio text in surgeon pages to use the cleaned names
 * instead of the long business names.
 */

// Load the name mapping
function loadNameMapping() {
  try {
    const mappingData = JSON.parse(fs.readFileSync('surgeon-name-mapping-final.json', 'utf-8'));
    const mapping = new Map();
    
    mappingData.forEach(item => {
      mapping.set(item.original, item.cleaned);
    });
    
    console.log(`📋 Loaded ${mapping.size} name mappings`);
    return mapping;
  } catch (error) {
    console.error('❌ Error loading name mapping:', error.message);
    return new Map();
  }
}

// Function to clean bio text
function cleanBioText(bioText, nameMapping) {
  if (!bioText) return bioText;
  
  let cleaned = bioText;
  
  // Replace all instances of the old long names with the cleaned names
  nameMapping.forEach((cleanedName, originalName) => {
    // Replace the full original name with the cleaned name
    cleaned = cleaned.replace(new RegExp(originalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), cleanedName);
    
    // Also replace common variations
    const variations = [
      originalName.replace(/[^a-zA-Z0-9\s]/g, ' '), // Remove special characters
      originalName.replace(/\s+/g, ' ').trim(), // Normalize spaces
    ];
    
    variations.forEach(variation => {
      if (variation !== originalName) {
        cleaned = cleaned.replace(new RegExp(variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), cleanedName);
      }
    });
  });
  
  return cleaned;
}

// Function to clean a single surgeon page
function cleanSurgeonPage(filePath, nameMapping) {
  try {
    console.log(`  📝 Cleaning ${path.basename(filePath)}`);
    
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract the bio_long from the frontmatter
    const bioMatch = content.match(/"bio_long":\s*"([^"]*(?:\\.[^"]*)*)"/);
    if (bioMatch) {
      const originalBio = bioMatch[1];
      const cleanedBio = cleanBioText(originalBio, nameMapping);
      
      if (originalBio !== cleanedBio) {
        // Replace the bio_long in the content
        const updatedContent = content.replace(
          /"bio_long":\s*"[^"]*(?:\\.[^"]*)*"/,
          `"bio_long": "${cleanedBio.replace(/"/g, '\\"')}"`
        );
        
        // Write the updated content
        fs.writeFileSync(filePath, updatedContent);
        console.log(`    ✅ Successfully cleaned bio text`);
        return true;
      } else {
        console.log(`    ⏭️  No bio text changes needed`);
        return false;
      }
    } else {
      console.log(`    ⏭️  No bio_long found in frontmatter`);
      return false;
    }
  } catch (error) {
    console.error(`    ❌ Error cleaning ${filePath}:`, error.message);
    return false;
  }
}

// Function to clean all surgeon pages
function cleanAllSurgeonPages() {
  console.log('🧹 Starting Bio Text Cleanup Process...\n');
  
  const nameMapping = loadNameMapping();
  
  if (nameMapping.size === 0) {
    console.log('❌ No name mappings found. Please run the name cleaning script first.');
    return;
  }
  
  // Find all surgeon page files
  const surgeonsDir = 'src/pages/surgeons';
  const filesToClean = [];
  
  function findSurgeonFiles(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        findSurgeonFiles(fullPath);
      } else if (item.endsWith('.astro') && item !== 'index.astro' && !item.includes('melbourne.astro') && !item.includes('sydney.astro')) {
        filesToClean.push(fullPath);
      }
    });
  }
  
  findSurgeonFiles(surgeonsDir);
  
  console.log(`📋 Found ${filesToClean.length} surgeon files to clean\n`);
  
  let successCount = 0;
  let totalCount = filesToClean.length;
  
  filesToClean.forEach(filePath => {
    if (cleanSurgeonPage(filePath, nameMapping)) {
      successCount++;
    }
  });
  
  console.log(`\n✅ Bio text cleanup complete!`);
  console.log(`📊 Summary:`);
  console.log(`   • Files processed: ${totalCount}`);
  console.log(`   • Files updated: ${successCount}`);
  console.log(`   • Files unchanged: ${totalCount - successCount}`);
  
  if (successCount > 0) {
    console.log('\n🔄 Next steps:');
    console.log('   1. Test the website to ensure all content displays correctly');
    console.log('   2. Check that the bio text looks clean and professional');
    console.log('   3. Verify that all surgeon names are consistent');
  }
}

// Run the script
if (require.main === module) {
  cleanAllSurgeonPages();
}

module.exports = {
  loadNameMapping,
  cleanBioText,
  cleanSurgeonPage,
  cleanAllSurgeonPages
};
