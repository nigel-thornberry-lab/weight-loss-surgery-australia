const fs = require('fs');

/**
 * Update JSON Files with Cleaned Names
 * 
 * This script updates all JSON data files to use the cleaned surgeon names
 * from the mapping file.
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

// Function to clean surgeon names (same as the main script)
function cleanSurgeonName(originalName) {
  if (!originalName) return '';
  
  // Skip if it's already clean (short and doesn't contain business terms)
  if (originalName.length < 50 && !originalName.includes(' - ') && !originalName.includes(' | ') && !originalName.includes('Centre') && !originalName.includes('Surgery') && !originalName.includes('Clinic')) {
    return originalName;
  }
  
  let cleaned = originalName;
  
  // Pattern 1: "Mr.Niruben Rajasagaram - Victorian Specialist Surgery & Weight Loss Centre"
  // Pattern 2: "Mr.Niruben Rajasagaram | Victorian Specialist Surgery & Weight loss centre"
  // Pattern 3: "Dr. John Smith – Bariatric Surgeon for Gastric Sleeve & Weight Loss Surgery Melbourne"
  
  // Remove everything after " - " or " | " or " – "
  cleaned = cleaned.replace(/\s*[-|–]\s*.*$/, '');
  
  // Remove common business suffixes that might still be attached
  const businessSuffixes = [
    /\s+(bariatric|weight\s*loss|surgery|specialist|centre|center|clinic|medical|health|group|practice|associates?|surgical|institute|hospital|healthcare|care|services?|solutions?|australia|melbourne|sydney|brisbane|perth|adelaide|gold\s*coast|canberra|hobart|darwin|tasmania|queensland|victoria|new\s*south\s*wales|western\s*australia|south\s*australia|northern\s*territory|australian\s*capital\s*territory|nsw|vic|qld|wa|sa|nt|act|tas)$/gi,
    /\s+(for\s*gastric\s*sleeve|&|and|weight\s*loss\s*surgery)$/gi,
    /\s+(pvt\s*ltd|pty\s*ltd|private\s*limited|inc|incorporated|llc|llp|partnership|associates?|group|holdings?|enterprises?|ventures?|international|global|worldwide|australia|australian)$/gi,
    /\s+(gallbladder|cosmetics|laser|skin|treatment|body|clinic)$/gi,
    /\s+(moggs|melbourne|oesophagogastric|general|surgery|east|melbourne)$/gi,
    /\s+(innerwest|ugit|surgery)$/gi,
    /\s+(lindfield|general|surgery|sydney|heartburn|clinic)$/gi,
    /\s+(langwarrin|mbsa)$/gi,
    /\s+(campbelltown)$/gi,
    /\s+(upper-gi|weight\s*loss|surgeon)$/gi
  ];
  
  businessSuffixes.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  // Clean up extra spaces and dashes
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  cleaned = cleaned.replace(/^-+|-+$/g, '').trim();
  cleaned = cleaned.replace(/\s*-+\s*/g, ' ').trim();
  
  // If the name is too short or empty, return original
  if (cleaned.length < 3) {
    return originalName;
  }
  
  return cleaned;
}

// Function to update a single JSON file
function updateJSONFile(filePath, nameMapping) {
  if (!fs.existsSync(filePath)) {
    console.log(`  ⏭️  File not found: ${filePath}`);
    return false;
  }
  
  try {
    console.log(`  📝 Updating ${filePath}...`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let updated = false;
    let changesCount = 0;
    
    // Update surgeon names in the data
    Object.keys(data).forEach(key => {
      if (data[key].surgeon_name) {
        const originalName = data[key].surgeon_name;
        const cleanedName = cleanSurgeonName(originalName);
        
        if (originalName !== cleanedName) {
          data[key].surgeon_name = cleanedName;
          updated = true;
          changesCount++;
        }
      }
    });
    
    if (updated) {
      // Create backup
      fs.writeFileSync(`${filePath}.backup-${Date.now()}`, fs.readFileSync(filePath));
      
      // Write updated file
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`    ✅ Updated ${changesCount} surgeon names in ${filePath}`);
      return true;
    } else {
      console.log(`    ⏭️  No changes needed for ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`    ❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Function to update all JSON files
function updateAllJSONFiles() {
  console.log('🔄 Updating JSON files with cleaned names...\n');
  
  const jsonFiles = [
    'surgeon-enhanced-data-consolidated.json',
    'surgeon-seo-enhancement-data.json',
    'surgeon-enhanced-data.json',
    'surgeon-complete-seo-data.json',
    'surgeon-complete-seo-data-clean.json',
    'src/data/cached-reviews.json',
    'src/data/slug-to-placeid.json'
  ];
  
  let totalUpdated = 0;
  let totalFiles = 0;
  
  jsonFiles.forEach(filePath => {
    totalFiles++;
    if (updateJSONFile(filePath)) {
      totalUpdated++;
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   • Files processed: ${totalFiles}`);
  console.log(`   • Files updated: ${totalUpdated}`);
  console.log(`   • Files unchanged: ${totalFiles - totalUpdated}`);
  
  return totalUpdated > 0;
}

// Function to update slug mappings
function updateSlugMappings() {
  console.log('\n🔄 Updating slug mappings...\n');
  
  const slugFiles = [
    'src/data/slug-to-placeid.json',
    'place-id-mapping.json'
  ];
  
  let updated = false;
  
  slugFiles.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
      console.log(`  ⏭️  File not found: ${filePath}`);
      return;
    }
    
    try {
      console.log(`  📝 Updating ${filePath}...`);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      let changesCount = 0;
      
      // Update keys that contain old surgeon names
      const newData = {};
      Object.keys(data).forEach(key => {
        let newKey = key;
        
        // Check if this key contains a surgeon name that needs cleaning
        if (key.includes('mrniruben-rajasagaram-victorian-specialist-surgery-weight-loss-centre')) {
          newKey = key.replace('mrniruben-rajasagaram-victorian-specialist-surgery-weight-loss-centre', 'niruben-rajasagaram');
          changesCount++;
        } else if (key.includes('mr-niruben-rajasagaram-bariatric-surgeon-for-gastric-sleeve-weight-loss-surgery-melbourne')) {
          newKey = key.replace('mr-niruben-rajasagaram-bariatric-surgeon-for-gastric-sleeve-weight-loss-surgery-melbourne', 'niruben-rajasagaram');
          changesCount++;
        }
        
        newData[newKey] = data[key];
      });
      
      if (changesCount > 0) {
        // Create backup
        fs.writeFileSync(`${filePath}.backup-${Date.now()}`, fs.readFileSync(filePath));
        
        // Write updated file
        fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
        console.log(`    ✅ Updated ${changesCount} slug mappings in ${filePath}`);
        updated = true;
      } else {
        console.log(`    ⏭️  No slug changes needed for ${filePath}`);
      }
    } catch (error) {
      console.error(`    ❌ Error updating ${filePath}:`, error.message);
    }
  });
  
  return updated;
}

// Main execution
function main() {
  console.log('🔄 Starting JSON Files Update with Cleaned Names...\n');
  
  try {
    // Load name mapping
    const nameMapping = loadNameMapping();
    
    if (nameMapping.size === 0) {
      console.log('❌ No name mappings found. Please run the name cleaning script first.');
      return;
    }
    
    // Update JSON files
    const jsonUpdated = updateAllJSONFiles();
    
    // Update slug mappings
    const slugUpdated = updateSlugMappings();
    
    console.log('\n✅ JSON files update complete!');
    
    if (jsonUpdated || slugUpdated) {
      console.log('\n🔄 Next steps:');
      console.log('   1. Review the updated files');
      console.log('   2. Regenerate affected pages with new clean names');
      console.log('   3. Test the website to ensure all links work correctly');
    } else {
      console.log('\n✨ All files were already up to date!');
    }
    
  } catch (error) {
    console.error('❌ Error during update process:', error);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  loadNameMapping,
  cleanSurgeonName,
  updateJSONFile,
  updateAllJSONFiles,
  updateSlugMappings
};
