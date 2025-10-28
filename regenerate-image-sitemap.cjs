const fs = require('fs');
const path = require('path');

/**
 * Regenerate Image Sitemap from Clean CSV
 * 
 * This script properly parses the CSV file and regenerates the image sitemap
 * with the cleaned surgeon names and URLs.
 */

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function regenerateImageSitemap() {
  console.log('🔄 Regenerating Image Sitemap from Clean CSV...\n');
  
  const csvPath = 'surgeons-complete-data-final.csv';
  const sitemapPath = 'public/image-sitemap.xml';
  
  if (!fs.existsSync(csvPath)) {
    console.log('❌ Cleaned CSV not found');
    return false;
  }
  
  try {
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.trim().split('\n');
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    let imageCount = 0;
    let processedCount = 0;
    
    // Skip header
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      try {
        const cols = parseCSVLine(line);
        
        if (cols.length < 18) {
          console.log(`  ⚠️  Skipping line ${i + 1}: insufficient columns (${cols.length})`);
          continue;
        }
        
        const name = cols[0]?.replace(/"/g, '').trim();
        const city = cols[4]?.replace(/"/g, '').trim();
        const state = cols[5]?.replace(/"/g, '').trim();
        const slug = cols[13]?.replace(/"/g, '').trim();
        const photo = cols[11]?.replace(/"/g, '').trim();
        
        if (!name || !city || !slug) {
          console.log(`  ⚠️  Skipping line ${i + 1}: missing required data`);
          continue;
        }
        
        processedCount++;
        
        if (!photo) {
          console.log(`  ⚠️  Skipping ${name}: no photo`);
          continue;
        }
        
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
        
        if (imageCount % 10 === 0) {
          console.log(`  📝 Processed ${imageCount} surgeon photos...`);
        }
        
      } catch (error) {
        console.log(`  ❌ Error processing line ${i + 1}: ${error.message}`);
        continue;
      }
    }
    
    xml += `</urlset>`;
    
    // Create backup
    if (fs.existsSync(sitemapPath)) {
      fs.writeFileSync(`${sitemapPath}.backup-${Date.now()}`, fs.readFileSync(sitemapPath));
    }
    
    // Write new sitemap
    fs.writeFileSync(sitemapPath, xml);
    
    console.log(`\n✅ Successfully regenerated image sitemap!`);
    console.log(`📊 Summary:`);
    console.log(`   • Total lines processed: ${processedCount}`);
    console.log(`   • Surgeon photos included: ${imageCount}`);
    console.log(`   • Sitemap saved to: ${sitemapPath}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error regenerating image sitemap:`, error.message);
    return false;
  }
}

// Run the script
if (require.main === module) {
  regenerateImageSitemap();
}

module.exports = { regenerateImageSitemap };
