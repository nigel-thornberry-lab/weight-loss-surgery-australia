const fs = require('fs');
const path = require('path');

/**
 * Rename All Affected Files Script
 * 
 * This script renames all surgeon page files that have old URLs and updates
 * their content to use the new clean names and slugs.
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

// Function to generate new slug from cleaned name
function generateNewSlug(cleanedName, city) {
  // Extract just the name part (remove title for slug)
  let nameForSlug = cleanedName
    .replace(/^(Dr|Mr|Mrs|Ms|Prof|A\/Prof|Professor|Associate\s*Professor)\s*/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  const citySlug = city.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  return `${nameForSlug}-${citySlug}`;
}

// Function to rename a surgeon page file
function renameSurgeonPage(oldFilePath, newFilePath, cleanedName, newSlug) {
  try {
    console.log(`  📝 Renaming ${path.basename(oldFilePath)} → ${path.basename(newFilePath)}`);
    
    // Read the old file
    const content = fs.readFileSync(oldFilePath, 'utf-8');
    
    // Update the content with new name and slug
    let updatedContent = content;
    
    // Update the surgeon name in the frontmatter
    updatedContent = updatedContent.replace(
      /"name":\s*"[^"]*"/,
      `"name": "${cleanedName}"`
    );
    
    // Update the surgeon name in the frontmatter (alternative field names)
    updatedContent = updatedContent.replace(
      /"surgeon_name":\s*"[^"]*"/,
      `"surgeon_name": "${cleanedName}"`
    );
    
    // Update the title in the frontmatter
    updatedContent = updatedContent.replace(
      /"title":\s*"[^"]*"/,
      `"title": "${cleanedName}"`
    );
    
    // Update the slug in the frontmatter
    updatedContent = updatedContent.replace(
      /"slug":\s*"[^"]*"/,
      `"slug": "${newSlug}"`
    );
    
    // Update the slug variable
    updatedContent = updatedContent.replace(
      /const slug = "[^"]*";/,
      `const slug = "${newSlug}";`
    );
    
    // Update any references to the old slug in the content
    const oldSlug = path.basename(oldFilePath, '.astro');
    updatedContent = updatedContent.replace(
      new RegExp(oldSlug, 'g'),
      newSlug
    );
    
    // Create the new file
    fs.writeFileSync(newFilePath, updatedContent);
    
    // Remove the old file
    fs.unlinkSync(oldFilePath);
    
    console.log(`    ✅ Successfully renamed and updated`);
    return true;
  } catch (error) {
    console.error(`    ❌ Error renaming ${oldFilePath}:`, error.message);
    return false;
  }
}

// Function to update index files
function updateIndexFile(indexFilePath, oldSlug, newSlug) {
  try {
    console.log(`  📝 Updating index file: ${path.basename(indexFilePath)}`);
    
    const content = fs.readFileSync(indexFilePath, 'utf-8');
    
    // Update the slug reference
    const updatedContent = content.replace(
      new RegExp(`"slug": "${oldSlug}"`, 'g'),
      `"slug": "${newSlug}"`
    );
    
    fs.writeFileSync(indexFilePath, updatedContent);
    console.log(`    ✅ Successfully updated index file`);
    return true;
  } catch (error) {
    console.error(`    ❌ Error updating index file:`, error.message);
    return false;
  }
}

// Function to update JSON data files
function updateJSONFile(filePath, oldSlug, newSlug) {
  try {
    console.log(`  📝 Updating JSON file: ${path.basename(filePath)}`);
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let updated = false;
    
    // Update keys that contain old slugs
    const newData = {};
    Object.keys(data).forEach(key => {
      let newKey = key;
      
      if (key.includes(oldSlug)) {
        newKey = key.replace(oldSlug, newSlug);
        updated = true;
      }
      
      newData[newKey] = data[key];
    });
    
    if (updated) {
      // Create backup
      fs.writeFileSync(`${filePath}.backup-${Date.now()}`, fs.readFileSync(filePath));
      
      // Write updated file
      fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
      console.log(`    ✅ Successfully updated JSON file`);
      return true;
    } else {
      console.log(`    ⏭️  No changes needed for JSON file`);
      return false;
    }
  } catch (error) {
    console.error(`    ❌ Error updating JSON file:`, error.message);
    return false;
  }
}

// Main function to rename all affected files
function renameAllAffectedFiles() {
  console.log('🔄 Starting Comprehensive File Rename Process...\n');
  
  const nameMapping = loadNameMapping();
  
  if (nameMapping.size === 0) {
    console.log('❌ No name mappings found. Please run the name cleaning script first.');
    return;
  }
  
  // Define the files that need to be renamed based on the audit
  const filesToRename = [
    {
      oldPath: 'src/pages/surgeons/wahroonga/aprof-christos-apostolou-surgeon-wahroonga.astro',
      city: 'wahroonga',
      cleanedName: 'A/Prof. Christos Apostolou',
      newSlug: 'christos-apostolou-wahroonga'
    },
    {
      oldPath: 'src/pages/surgeons/campbelltown/dr-edward-tong-campbelltown-campbelltown.astro',
      city: 'campbelltown',
      cleanedName: 'Dr Edward Tong',
      newSlug: 'edward-tong-campbelltown'
    },
    {
      oldPath: 'src/pages/surgeons/wetherill-park/dr-govind-krishna-weight-loss-general-surgeon-wetherill-park.astro',
      city: 'wetherill-park',
      cleanedName: 'Dr Govind Krishna',
      newSlug: 'govind-krishna-wetherill-park'
    },
    {
      oldPath: 'src/pages/surgeons/liverpool/dr-jason-maani-gallbladder-surgery-liverpool.astro',
      city: 'liverpool',
      cleanedName: 'Dr Jason Maani',
      newSlug: 'jason-maani-liverpool'
    },
    {
      oldPath: 'src/pages/surgeons/langwarrin/dr-mani-niazi-langwarrin-mbsa-langwarrin.astro',
      city: 'langwarrin',
      cleanedName: 'Dr Mani Niazi',
      newSlug: 'mani-niazi-langwarrin'
    },
    {
      oldPath: 'src/pages/surgeons/concord/dr-philip-le-page-surgeon-concord.astro',
      city: 'concord',
      cleanedName: 'Dr Philip Le Page',
      newSlug: 'philip-le-page-concord'
    },
    {
      oldPath: 'src/pages/surgeons/frenchs-forest/dr-philip-le-page-surgeon-frenchs-forest.astro',
      city: 'frenchs-forest',
      cleanedName: 'Dr Philip Le Page',
      newSlug: 'philip-le-page-frenchs-forest'
    },
    {
      oldPath: 'src/pages/surgeons/east-melbourne/mr-jacob-vanyai-moggs-melbourne-oesophagogastric-and-general-surgery-east-melbourne-east-melbourne.astro',
      city: 'east-melbourne',
      cleanedName: 'Mr Jacob Vanyai',
      newSlug: 'jacob-vanyai-east-melbourne'
    },
    {
      oldPath: 'src/pages/surgeons/lindfield/professor-gregory-falk-lindfield-general-surgery-sydney-heartburn-clinic-lindfield.astro',
      city: 'lindfield',
      cleanedName: 'Professor Gregory Falk',
      newSlug: 'gregory-falk-lindfield'
    }
  ];
  
  let successCount = 0;
  let totalCount = filesToRename.length;
  
  console.log(`📋 Found ${totalCount} files to rename\n`);
  
  filesToRename.forEach(({ oldPath, city, cleanedName, newSlug }) => {
    if (fs.existsSync(oldPath)) {
      const newPath = `src/pages/surgeons/${city}/${newSlug}.astro`;
      
      console.log(`🔄 Processing: ${path.basename(oldPath)}`);
      
      if (renameSurgeonPage(oldPath, newPath, cleanedName, newSlug)) {
        successCount++;
        
        // Update the corresponding index file
        const indexPath = `src/pages/surgeons/${city}/index.astro`;
        if (fs.existsSync(indexPath)) {
          const oldSlug = path.basename(oldPath, '.astro');
          updateIndexFile(indexPath, oldSlug, newSlug);
        }
      }
    } else {
      console.log(`  ⏭️  File not found: ${oldPath}`);
    }
    
    console.log(''); // Empty line for readability
  });
  
  // Update JSON data files
  console.log('🔄 Updating JSON data files...\n');
  
  const jsonFiles = [
    'src/data/cached-reviews.json',
    'src/data/slug-to-placeid.json'
  ];
  
  // Update each JSON file with all the slug changes
  jsonFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      console.log(`📝 Updating ${path.basename(filePath)}...`);
      
      filesToRename.forEach(({ oldPath, newSlug }) => {
        const oldSlug = path.basename(oldPath, '.astro');
        updateJSONFile(filePath, oldSlug, newSlug);
      });
    }
  });
  
  console.log(`\n✅ Comprehensive rename process complete!`);
  console.log(`📊 Summary:`);
  console.log(`   • Files processed: ${totalCount}`);
  console.log(`   • Files successfully renamed: ${successCount}`);
  console.log(`   • Files failed: ${totalCount - successCount}`);
  console.log(`   • JSON files updated: ${jsonFiles.length}`);
  
  if (successCount > 0) {
    console.log('\n🔄 Next steps:');
    console.log('   1. Test the website to ensure all links work correctly');
    console.log('   2. Check that the new pages load properly');
    console.log('   3. Verify that all internal links are updated');
    console.log('   4. Submit updated sitemaps to Google Search Console');
  }
}

// Run the script
if (require.main === module) {
  renameAllAffectedFiles();
}

module.exports = {
  loadNameMapping,
  generateNewSlug,
  renameSurgeonPage,
  updateIndexFile,
  updateJSONFile,
  renameAllAffectedFiles
};
