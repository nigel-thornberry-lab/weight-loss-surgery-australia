const fs = require('fs');
const path = require('path');

/**
 * Rename Surgeon Pages Script
 * 
 * This script renames surgeon page files to use the new clean names
 * and updates their content accordingly.
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
      /"surgeon_name":\s*"[^"]*"/,
      `"surgeon_name": "${cleanedName}"`
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

// Main function to rename all affected pages
function renameAllSurgeonPages() {
  console.log('🔄 Starting Surgeon Pages Rename Process...\n');
  
  const nameMapping = loadNameMapping();
  
  if (nameMapping.size === 0) {
    console.log('❌ No name mappings found. Please run the name cleaning script first.');
    return;
  }
  
  // Define the files that need to be renamed
  const filesToRename = [
    {
      oldPath: 'src/pages/surgeons/berwick/mrniruben-rajasagaram-victorian-specialist-surgery-weight-loss-centre-berwick.astro',
      city: 'berwick',
      cleanedName: 'Mr.Niruben Rajasagaram',
      newSlug: 'niruben-rajasagaram-berwick'
    },
    {
      oldPath: 'src/pages/surgeons/frankston/mrniruben-rajasagaram-victorian-specialist-surgery-weight-loss-centre-frankston.astro',
      city: 'frankston',
      cleanedName: 'Mr.Niruben Rajasagaram',
      newSlug: 'niruben-rajasagaram-frankston'
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
  
  console.log(`✅ Rename process complete!`);
  console.log(`📊 Summary:`);
  console.log(`   • Files processed: ${totalCount}`);
  console.log(`   • Files successfully renamed: ${successCount}`);
  console.log(`   • Files failed: ${totalCount - successCount}`);
  
  if (successCount > 0) {
    console.log('\n🔄 Next steps:');
    console.log('   1. Test the website to ensure all links work correctly');
    console.log('   2. Update any internal links that reference the old URLs');
    console.log('   3. Check that the new pages load properly');
  }
}

// Run the script
if (require.main === module) {
  renameAllSurgeonPages();
}

module.exports = {
  loadNameMapping,
  generateNewSlug,
  renameSurgeonPage,
  updateIndexFile,
  renameAllSurgeonPages
};
