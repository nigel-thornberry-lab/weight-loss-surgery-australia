const fs = require('fs');
const path = require('path');

/**
 * Create Clean Image Sitemap
 * 
 * This script creates a clean image sitemap using the existing surgeon data
 * from the JSON files and the cleaned names.
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

// Function to get all surgeon pages
function getAllSurgeonPages() {
  const surgeonPages = [];
  const surgeonsDir = 'src/pages/surgeons';
  
  if (!fs.existsSync(surgeonsDir)) {
    console.log('❌ Surgeons directory not found');
    return [];
  }
  
  const cities = fs.readdirSync(surgeonsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  cities.forEach(city => {
    const cityDir = path.join(surgeonsDir, city);
    const files = fs.readdirSync(cityDir, { withFileTypes: true })
      .filter(dirent => dirent.isFile() && dirent.name.endsWith('.astro') && dirent.name !== 'index.astro')
      .map(dirent => dirent.name);
    
    files.forEach(file => {
      const filePath = path.join(cityDir, file);
      const slug = file.replace('.astro', '');
      
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Extract surgeon data from the frontmatter
        const surgeonMatch = content.match(/const surgeon = \{([\s\S]*?)\};/);
        if (surgeonMatch) {
          const surgeonData = surgeonMatch[1];
          
          // Extract key fields using regex
          const nameMatch = surgeonData.match(/"name":\s*"([^"]*)"/);
          const cityMatch = surgeonData.match(/"city":\s*"([^"]*)"/);
          const stateMatch = surgeonData.match(/"state":\s*"([^"]*)"/);
          const photoMatch = surgeonData.match(/"surgeon_photo":\s*"([^"]*)"/);
          
          if (nameMatch && cityMatch) {
            surgeonPages.push({
              name: nameMatch[1],
              city: cityMatch[1],
              state: stateMatch ? stateMatch[1] : '',
              photo: photoMatch ? photoMatch[1] : '',
              slug: slug,
              citySlug: city.toLowerCase().replace(/\s+/g, '-')
            });
          }
        }
      } catch (error) {
        console.log(`  ⚠️  Error reading ${filePath}: ${error.message}`);
      }
    });
  });
  
  return surgeonPages;
}

// Function to create image sitemap
function createImageSitemap(surgeonPages) {
  const sitemapPath = 'public/image-sitemap.xml';
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  let imageCount = 0;
  
  surgeonPages.forEach(surgeon => {
    if (!surgeon.photo) {
      console.log(`  ⚠️  Skipping ${surgeon.name}: no photo`);
      return;
    }
    
    const pageUrl = `https://bariatricsurgeryhub.com/surgeons/${surgeon.citySlug}/${surgeon.slug}`;
    const cleanPhoto = surgeon.photo.startsWith('/public/') ? surgeon.photo.replace('/public/', '/') : surgeon.photo;
    const imageUrl = `https://bariatricsurgeryhub.com${cleanPhoto}`;
    const imageTitle = `${surgeon.name} - Bariatric Surgeon in ${surgeon.city}, ${surgeon.state}`;
    const imageCaption = `Professional photo of ${surgeon.name}, expert bariatric surgeon specializing in weight loss surgery in ${surgeon.city}`;
    
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
  });
  
  xml += `</urlset>`;
  
  // Create backup
  if (fs.existsSync(sitemapPath)) {
    fs.writeFileSync(`${sitemapPath}.backup-${Date.now()}`, fs.readFileSync(sitemapPath));
  }
  
  // Write new sitemap
  fs.writeFileSync(sitemapPath, xml);
  
  console.log(`\n✅ Successfully created clean image sitemap!`);
  console.log(`📊 Summary:`);
  console.log(`   • Surgeon pages found: ${surgeonPages.length}`);
  console.log(`   • Surgeon photos included: ${imageCount}`);
  console.log(`   • Sitemap saved to: ${sitemapPath}`);
  
  return true;
}

// Main function
function createCleanImageSitemap() {
  console.log('🔄 Creating Clean Image Sitemap...\n');
  
  // Load name mappings (for reference)
  const nameMapping = loadNameMapping();
  
  // Get all surgeon pages
  console.log('📋 Scanning surgeon pages...');
  const surgeonPages = getAllSurgeonPages();
  
  if (surgeonPages.length === 0) {
    console.log('❌ No surgeon pages found');
    return false;
  }
  
  console.log(`   Found ${surgeonPages.length} surgeon pages`);
  
  // Create image sitemap
  console.log('\n📝 Creating image sitemap...');
  return createImageSitemap(surgeonPages);
}

// Run the script
if (require.main === module) {
  createCleanImageSitemap();
}

module.exports = { createCleanImageSitemap };
