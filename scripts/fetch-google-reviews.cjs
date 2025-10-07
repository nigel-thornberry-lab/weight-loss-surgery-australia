const fs = require('fs');
const https = require('https');

// This script fetches Google reviews once and caches them
// Run this monthly to update reviews

const API_KEY = process.argv[2]; // Pass API key as command line argument
const INPUT_CSV = 'surgeons-with-bios.csv';
const OUTPUT_JSON = 'src/data/cached-reviews.json';

if (!API_KEY) {
  console.error('❌ Please provide API key as argument:');
  console.error('   node scripts/fetch-google-reviews.cjs YOUR_API_KEY');
  process.exit(1);
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"' && (i === 0 || line[i - 1] === ',')) {
      inQuotes = true;
      continue;
    }
    
    if (char === '"' && nextChar === ',') {
      inQuotes = false;
      continue;
    }
    
    if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
      continue;
    }
    
    current += char;
  }
  
  result.push(current);
  return result;
}

function fetchReviews(placeId) {
  return new Promise((resolve, reject) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total,name&key=${API_KEY}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
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
              error: parsed.status
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
  console.log('🔍 Reading surgeon data...');
  
  const content = fs.readFileSync(INPUT_CSV, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length <= 1) {
    console.log('❌ No surgeon data found');
    return;
  }
  
  const headers = parseCSVLine(lines[0]);
  const placeIdIndex = headers.indexOf('place_id');
  const slugIndex = headers.indexOf('slug');
  const nameIndex = headers.findIndex(h => h.includes('name'));
  
  if (placeIdIndex === -1) {
    console.log('❌ place_id column not found in CSV');
    return;
  }
  
  const reviewsCache = {};
  let successCount = 0;
  let errorCount = 0;
  
  console.log(`\n📥 Fetching reviews for ${lines.length - 1} surgeons...\n`);
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const placeId = values[placeIdIndex];
    const slug = values[slugIndex] || `surgeon-${i}`;
    const name = values[nameIndex] || 'Unknown';
    
    if (!placeId || placeId.trim() === '') {
      console.log(`⏭️  Skipping ${name} (no Place ID)`);
      continue;
    }
    
    try {
      console.log(`   Fetching: ${name}...`);
      const data = await fetchReviews(placeId);
      
      if (data.success && data.reviews.length > 0) {
        reviewsCache[slug] = {
          placeId,
          surgeonName: name,
          rating: data.rating,
          totalRatings: data.total_ratings,
          reviews: data.reviews.slice(0, 5), // Keep only 5 most recent
          lastUpdated: new Date().toISOString()
        };
        console.log(`   ✅ ${name}: ${data.reviews.length} reviews (${data.rating}★)`);
        successCount++;
      } else {
        console.log(`   ⚠️  ${name}: No reviews found`);
        errorCount++;
      }
      
      // Rate limiting - wait 100ms between requests
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (err) {
      console.log(`   ❌ ${name}: Error - ${err.message}`);
      errorCount++;
    }
  }
  
  // Save to JSON file
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(reviewsCache, null, 2), 'utf-8');
  
  console.log(`\n✅ SUCCESS!`);
  console.log(`   Fetched reviews: ${successCount}`);
  console.log(`   Errors/No reviews: ${errorCount}`);
  console.log(`   Output: ${OUTPUT_JSON}`);
  console.log(`\n📅 Last updated: ${new Date().toLocaleString()}`);
  console.log(`\n💡 To update reviews, run this script again in 1 month`);
}

main().catch(console.error);
