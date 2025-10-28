const fs = require('fs');
const path = require('path');

/**
 * Update SEO Files with Cleaned Names
 * 
 * This script updates all SEO-related files including sitemaps, meta descriptions,
 * and other references to use the cleaned surgeon names.
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

// Function to update image sitemap
function updateImageSitemap(nameMapping) {
  const sitemapPath = 'public/image-sitemap.xml';
  
  if (!fs.existsSync(sitemapPath)) {
    console.log('  ⏭️  Image sitemap not found');
    return false;
  }
  
  try {
    console.log('  📝 Updating image sitemap...');
    let content = fs.readFileSync(sitemapPath, 'utf-8');
    let updated = false;
    
    // Update URLs with old surgeon names
    nameMapping.forEach((cleanedName, originalName) => {
      // Generate old and new slugs
      const oldSlug = originalName
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      const newSlug = cleanedName
        .replace(/^(Dr|Mr|Mrs|Ms|Prof|A\/Prof|Professor|Associate\s*Professor)\s*/i, '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Update URLs in sitemap
      const oldUrlPattern = new RegExp(`https://bariatricsurgeryhub\\.com/surgeons/[^/]+/${oldSlug}(-[^/]+)?`, 'g');
      const newUrlPattern = `https://bariatricsurgeryhub.com/surgeons/$1/${newSlug}$2`;
      
      if (content.includes(oldSlug)) {
        content = content.replace(oldUrlPattern, newUrlPattern);
        updated = true;
      }
    });
    
    if (updated) {
      // Create backup
      fs.writeFileSync(`${sitemapPath}.backup-${Date.now()}`, fs.readFileSync(sitemapPath));
      
      // Write updated content
      fs.writeFileSync(sitemapPath, content);
      console.log('    ✅ Successfully updated image sitemap');
      return true;
    } else {
      console.log('    ⏭️  No changes needed for image sitemap');
      return false;
    }
  } catch (error) {
    console.error(`    ❌ Error updating image sitemap:`, error.message);
    return false;
  }
}

// Function to update internal links audit
function updateInternalLinksAudit(nameMapping) {
  const auditPath = 'internal-links-audit.json';
  
  if (!fs.existsSync(auditPath)) {
    console.log('  ⏭️  Internal links audit not found');
    return false;
  }
  
  try {
    console.log('  📝 Updating internal links audit...');
    const data = JSON.parse(fs.readFileSync(auditPath, 'utf-8'));
    let updated = false;
    
    // Update URLs in the audit data
    data.forEach(item => {
      if (item.url) {
        let newUrl = item.url;
        
        nameMapping.forEach((cleanedName, originalName) => {
          const oldSlug = originalName
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
          
          const newSlug = cleanedName
            .replace(/^(Dr|Mr|Mrs|Ms|Prof|A\/Prof|Professor|Associate\s*Professor)\s*/i, '')
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
          
          if (newUrl.includes(oldSlug)) {
            newUrl = newUrl.replace(new RegExp(`/${oldSlug}(-[^/]+)?`, 'g'), `/${newSlug}$1`);
            updated = true;
          }
        });
        
        if (newUrl !== item.url) {
          item.url = newUrl;
        }
      }
    });
    
    if (updated) {
      // Create backup
      fs.writeFileSync(`${auditPath}.backup-${Date.now()}`, fs.readFileSync(auditPath));
      
      // Write updated data
      fs.writeFileSync(auditPath, JSON.stringify(data, null, 2));
      console.log('    ✅ Successfully updated internal links audit');
      return true;
    } else {
      console.log('    ⏭️  No changes needed for internal links audit');
      return false;
    }
  } catch (error) {
    console.error(`    ❌ Error updating internal links audit:`, error.message);
    return false;
  }
}

// Function to update meta descriptions in CSV
function updateMetaDescriptions(nameMapping) {
  const csvPath = 'surgeons-complete-data-final.csv';
  
  if (!fs.existsSync(csvPath)) {
    console.log('  ⏭️  Cleaned CSV not found');
    return false;
  }
  
  try {
    console.log('  📝 Updating meta descriptions in CSV...');
    let content = fs.readFileSync(csvPath, 'utf-8');
    let updated = false;
    
    // Update meta descriptions to use cleaned names
    nameMapping.forEach((cleanedName, originalName) => {
      const oldPattern = new RegExp(originalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (content.includes(originalName)) {
        content = content.replace(oldPattern, cleanedName);
        updated = true;
      }
    });
    
    if (updated) {
      // Create backup
      fs.writeFileSync(`${csvPath}.backup-${Date.now()}`, fs.readFileSync(csvPath));
      
      // Write updated content
      fs.writeFileSync(csvPath, content);
      console.log('    ✅ Successfully updated meta descriptions in CSV');
      return true;
    } else {
      console.log('    ⏭️  No changes needed for CSV meta descriptions');
      return false;
    }
  } catch (error) {
    console.error(`    ❌ Error updating CSV meta descriptions:`, error.message);
    return false;
  }
}

// Function to regenerate image sitemap from clean CSV
function regenerateImageSitemap() {
  const csvPath = 'surgeons-complete-data-final.csv';
  const sitemapPath = 'public/image-sitemap.xml';
  
  if (!fs.existsSync(csvPath)) {
    console.log('  ⏭️  Cleaned CSV not found for sitemap regeneration');
    return false;
  }
  
  try {
    console.log('  📝 Regenerating image sitemap from clean CSV...');
    
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.trim().split('\n');
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    let imageCount = 0;
    
    // Skip header
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
      if (!cols || cols.length < 26) continue;
      
      const name = cols[0]?.trim().replace(/"/g, '');
      const city = cols[4]?.trim().replace(/"/g, '');
      const state = cols[5]?.trim().replace(/"/g, '');
      const slug = cols[13]?.trim().replace(/"/g, '');
      const photo = cols[12]?.trim().replace(/"/g, '');
      
      if (!slug || !photo) continue;
      
      const citySlug = city.toLowerCase().replace(/\s+/g, '-');
      const pageUrl = `https://bariatricsurgeryhub.com/surgeons/${citySlug}/${slug}`;
      const cleanPhoto = photo.startsWith('/public/') ? photo.replace('/public/', '/') : photo;
      const imageUrl = `https://bariatricsurgeryhub.com${cleanPhoto}`;
      const imageTitle = `${name} - Bariatric Surgeon in ${city}, ${state}`;
      const imageCaption = `Professional photo of ${name}, expert bariatric surgeon specializing in weight loss surgery in ${city}`;
      
      xml += `  <url>
    <loc>${pageUrl}</loc>
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${imageTitle}</image:title>
      <image:caption>${imageCaption}</image:caption>
    </image:image>
  </url>
`;
      imageCount++;
    }
    
    xml += `</urlset>`;
    
    // Create backup
    if (fs.existsSync(sitemapPath)) {
      fs.writeFileSync(`${sitemapPath}.backup-${Date.now()}`, fs.readFileSync(sitemapPath));
    }
    
    // Write new sitemap
    fs.writeFileSync(sitemapPath, xml);
    console.log(`    ✅ Successfully regenerated image sitemap with ${imageCount} surgeon photos`);
    return true;
  } catch (error) {
    console.error(`    ❌ Error regenerating image sitemap:`, error.message);
    return false;
  }
}

// Function to check for any remaining old URLs in the codebase
function checkForOldUrls(nameMapping) {
  console.log('  🔍 Checking for remaining old URLs in codebase...');
  
  const searchPaths = [
    'src',
    'public',
    'scripts'
  ];
  
  const oldUrls = [];
  
  nameMapping.forEach((cleanedName, originalName) => {
    const oldSlug = originalName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Search for old slug patterns
    searchPaths.forEach(searchPath => {
      if (fs.existsSync(searchPath)) {
        const files = getAllFiles(searchPath);
        files.forEach(file => {
          if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.astro') || file.endsWith('.json') || file.endsWith('.xml')) {
            try {
              const content = fs.readFileSync(file, 'utf-8');
              if (content.includes(oldSlug)) {
                oldUrls.push({
                  file,
                  oldSlug,
                  cleanedName
                });
              }
            } catch (error) {
              // Skip files that can't be read
            }
          }
        });
      }
    });
  });
  
  if (oldUrls.length > 0) {
    console.log(`    ⚠️  Found ${oldUrls.length} files with old URLs:`);
    oldUrls.forEach(({ file, oldSlug, cleanedName }) => {
      console.log(`      • ${file} contains "${oldSlug}" (should be updated to use "${cleanedName}")`);
    });
  } else {
    console.log('    ✅ No old URLs found in codebase');
  }
  
  return oldUrls;
}

// Helper function to get all files recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  
  return arrayOfFiles;
}

// Main function to update all SEO files
function updateAllSEOFiles() {
  console.log('🔄 Starting SEO Files Update with Cleaned Names...\n');
  
  const nameMapping = loadNameMapping();
  
  if (nameMapping.size === 0) {
    console.log('❌ No name mappings found. Please run the name cleaning script first.');
    return;
  }
  
  let totalUpdated = 0;
  let totalFiles = 0;
  
  // Update image sitemap
  totalFiles++;
  if (updateImageSitemap(nameMapping)) {
    totalUpdated++;
  }
  
  // Update internal links audit
  totalFiles++;
  if (updateInternalLinksAudit(nameMapping)) {
    totalUpdated++;
  }
  
  // Update meta descriptions in CSV
  totalFiles++;
  if (updateMetaDescriptions(nameMapping)) {
    totalUpdated++;
  }
  
  // Regenerate image sitemap from clean CSV
  totalFiles++;
  if (regenerateImageSitemap()) {
    totalUpdated++;
  }
  
  // Check for remaining old URLs
  const oldUrls = checkForOldUrls(nameMapping);
  
  console.log(`\n✅ SEO files update complete!`);
  console.log(`📊 Summary:`);
  console.log(`   • Files processed: ${totalFiles}`);
  console.log(`   • Files updated: ${totalUpdated}`);
  console.log(`   • Files unchanged: ${totalFiles - totalUpdated}`);
  console.log(`   • Files with old URLs found: ${oldUrls.length}`);
  
  if (oldUrls.length > 0) {
    console.log('\n⚠️  Manual Review Needed:');
    console.log('   Some files still contain old URLs that may need manual updating.');
    console.log('   Check the files listed above and update them as needed.');
  }
  
  console.log('\n🔄 Next steps:');
  console.log('   1. Test the website to ensure all URLs work correctly');
  console.log('   2. Submit updated sitemaps to Google Search Console');
  console.log('   3. Monitor for any 404 errors from old URLs');
  console.log('   4. Update any hardcoded references found in the audit');
}

// Run the script
if (require.main === module) {
  updateAllSEOFiles();
}

module.exports = {
  loadNameMapping,
  updateImageSitemap,
  updateInternalLinksAudit,
  updateMetaDescriptions,
  regenerateImageSitemap,
  checkForOldUrls,
  updateAllSEOFiles
};
