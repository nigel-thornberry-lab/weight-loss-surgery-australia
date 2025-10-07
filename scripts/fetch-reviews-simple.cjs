const fs = require('fs');
const https = require('https');

// Simplified script that extracts Place IDs directly from CSV
const API_KEY = process.argv[2];
const INPUT_CSV = 'surgeons-with-bios.csv';
const OUTPUT_JSON = 'src/data/cached-reviews.json';

if (!API_KEY) {
  console.error('❌ Please provide API key as argument:');
  console.error('   node scripts/fetch-reviews-simple.cjs YOUR_API_KEY');
  process.exit(1);
}

function fetchReviews(placeId) {
  return new Promise((resolve, reject) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total,name&key=${API_KEY}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.status === 'OK' && parsed.result) {
            resolve({
              success: true,
              reviews: parsed.result.reviews || [],
              rating: parsed.result.rating || 0,
              total_ratings: parsed.result.user_ratings_total || 0,
              name: parsed.result.name || ''
            });
          } else {
            resolve({
              success: false,
              reviews: [],
              rating: 0,
              total_ratings: 0,
              error: parsed.status,
              message: parsed.error_message || ''
            });
          }
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('🔍 Reading surgeon data...\n');
  
  const content = fs.readFileSync(INPUT_CSV, 'utf-8');
  const lines = content.split('\n');
  
  // Extract all Place IDs and slugs using regex
  const surgeons = [];
  
  for (const line of lines) {
    // Match Place ID pattern
    const placeIdMatch = line.match(/ChIJ[A-Za-z0-9_-]+/);
    if (!placeIdMatch) continue;
    
    const placeId = placeIdMatch[0];
    
    // Extract slug (field 19) - look for pattern like "dr-name-city"
    const slugMatch = line.match(/,([a-z0-9-]+-(dr|mr|ms|prof|aprof)[a-z0-9-]+),/i) || 
                      line.match(/,([a-z]+-[a-z]+-[a-z]+-[a-z]+),/);
    
    // Extract name - look for "Dr " or "Mr " pattern
    const nameMatch = line.match(/((?:Dr|Mr|Ms|Prof|A\/Prof)[^,]+)/);
    
    if (slugMatch && nameMatch) {
      surgeons.push({
        placeId,
        slug: slugMatch[1],
        name: nameMatch[1].replace(/"/g, '').trim()
      });
    }
  }
  
  console.log(`Found ${surgeons.length} surgeons with Place IDs\n`);
  
  const reviewsCache = {};
  let successCount = 0;
  let errorCount = 0;
  
  for (const surgeon of surgeons) {
    try {
      console.log(`   Fetching: ${surgeon.name}...`);
      const data = await fetchReviews(surgeon.placeId);
      
      if (data.success && data.reviews.length > 0) {
        reviewsCache[surgeon.slug] = {
          placeId: surgeon.placeId,
          surgeonName: surgeon.name,
          rating: data.rating,
          totalRatings: data.total_ratings,
          reviews: data.reviews.slice(0, 5),
          lastUpdated: new Date().toISOString()
        };
        console.log(`   ✅ ${surgeon.name}: ${data.reviews.length} reviews (${data.rating}★)`);
        successCount++;
      } else {
        console.log(`   ⚠️  ${surgeon.name}: ${data.error || 'No reviews'} ${data.message || ''}`);
        errorCount++;
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 150));
      
    } catch (err) {
      console.log(`   ❌ ${surgeon.name}: ${err.message}`);
      errorCount++;
    }
  }
  
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(reviewsCache, null, 2), 'utf-8');
  
  console.log(`\n✅ SUCCESS!`);
  console.log(`   Fetched reviews: ${successCount}`);
  console.log(`   Errors/No reviews: ${errorCount}`);
  console.log(`   Output: ${OUTPUT_JSON}`);
  console.log(`\n📅 Last updated: ${new Date().toLocaleString()}`);
  console.log(`\n💡 Run this script monthly to update reviews`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
