const fs = require('fs');
const path = require('path');

const CSV_FILE = 'surgeons-with-bios.csv';
const OUTPUT_FILE = 'public/image-sitemap.xml';

function generateImageSitemap() {
  console.log('🗺️  Generating Image Sitemap for Google...\n');
  
  const csvContent = fs.readFileSync(CSV_FILE, 'utf-8');
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
    
    const name = cols[1]?.trim().replace(/"/g, '');
    const city = cols[7]?.trim().replace(/"/g, '');
    const state = cols[8]?.trim().replace(/"/g, '');
    const slug = cols[18]?.trim().replace(/"/g, '');
    const photo = cols[25]?.trim().replace(/"/g, '');
    
    if (!slug || !photo) continue;
    
    const citySlug = city.toLowerCase().replace(/\s+/g, '-');
    const pageUrl = `https://weightlosssurgery.com.au/surgeons/${citySlug}/${slug}`;
    // Remove /public/ prefix if present (Astro serves public folder from root)
    const cleanPhoto = photo.startsWith('/public/') ? photo.replace('/public/', '/') : photo;
    const imageUrl = `https://weightlosssurgery.com.au${cleanPhoto}`;
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
  
  fs.writeFileSync(OUTPUT_FILE, xml);
  console.log(`✅ Generated image sitemap with ${imageCount} surgeon photos`);
  console.log(`📄 Saved to: ${OUTPUT_FILE}\n`);
  
  // Update robots.txt to include image sitemap
  const robotsTxt = `# Robots.txt for Weight Loss Surgery Australia
User-agent: *
Allow: /

# Sitemaps
Sitemap: https://weightlosssurgery.com.au/sitemap-index.xml
Sitemap: https://weightlosssurgery.com.au/image-sitemap.xml

# Block admin/development paths
Disallow: /api/
Disallow: /.git/
Disallow: /node_modules/

# Allow all images
Allow: /surgeons/images/
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.png$
Allow: /*.webp$
Allow: /*.gif$

# Crawl delay for non-essential bots
User-agent: AhrefsBot
Crawl-delay: 10

User-agent: SemrushBot
Crawl-delay: 10
`;
  
  fs.writeFileSync('public/robots.txt', robotsTxt);
  console.log('✅ Updated robots.txt with image sitemap reference\n');
  
  console.log('💡 Next steps:');
  console.log('   1. Deploy to production');
  console.log('   2. Submit image sitemap to Google Search Console');
  console.log('   3. Google will index all surgeon photos within 24-48 hours');
}

generateImageSitemap();

