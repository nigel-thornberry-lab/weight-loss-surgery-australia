const fs = require('fs');
const https = require('https');

const API_KEY = process.argv[2];
const MAPPING_FILE = 'place-id-mapping.json';
const OUTPUT_JSON = 'src/data/cached-reviews.json';

if (!API_KEY) {
  console.error('❌ Please provide API key:');
  console.error('   node scripts/fetch-reviews-final.cjs YOUR_API_KEY');
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
  console.log('🔍 Loading Place ID mapping...\n');
  
  const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
  const entries = Object.entries(mapping);
  
  console.log(`Found ${entries.length} surgeons with Place IDs\n`);
  
  const reviewsCache = {};
  let successCount = 0;
  let errorCount = 0;
  
  for (const [placeId, data] of entries) {
    try {
      console.log(`   Fetching: ${data.name}...`);
      const result = await fetchReviews(placeId);
      
      if (result.success && result.reviews.length > 0) {
        reviewsCache[data.slug] = {
          placeId,
          surgeonName: data.name,
          rating: result.rating,
          totalRatings: result.total_ratings,
          reviews: result.reviews.slice(0, 5),
          lastUpdated: new Date().toISOString()
        };
        console.log(`   ✅ ${data.name}: ${result.reviews.length} reviews (${result.rating}★)`);
        successCount++;
      } else {
        console.log(`   ⚠️  ${data.name}: ${result.error || 'No reviews'}`);
        errorCount++;
      }
      
      await new Promise(resolve => setTimeout(resolve, 150));
      
    } catch (err) {
      console.log(`   ❌ ${data.name}: ${err.message}`);
      errorCount++;
    }
  }
  
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(reviewsCache, null, 2), 'utf-8');
  
  console.log(`\n✅ SUCCESS!`);
  console.log(`   Fetched reviews: ${successCount}`);
  console.log(`   Errors/No reviews: ${errorCount}`);
  console.log(`   Output: ${OUTPUT_JSON}`);
  console.log(`\n📅 Last updated: ${new Date().toLocaleString()}`);
}

main().catch(console.error);
