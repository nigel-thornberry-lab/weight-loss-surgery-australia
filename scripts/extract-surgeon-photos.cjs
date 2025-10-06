/**
 * Surgeon Photo Extractor
 * 
 * SIMPLE & FOCUSED: Only extracts surgeon photos from websites
 * Uses existing Google Maps data - no additional scraping needed
 * 
 * Usage: node scripts/extract-surgeon-photos.cjs
 */

const fs = require('fs');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');
const axios = require('axios');
const cheerio = require('cheerio');

const INPUT_CSV = 'Copy of Surgeons Master - Working Copy - dataset_crawler-google-places_2025-10-04_06-45-50-735 (1).csv';
const OUTPUT_CSV = 'surgeons-with-photos.csv';

/**
 * Extract surgeon photo from website
 */
async function extractSurgeonPhoto(websiteUrl, surgeonName) {
  try {
    if (!websiteUrl || !websiteUrl.startsWith('http')) {
      return null;
    }

    console.log(`  🌐 Checking ${websiteUrl}...`);

    const response = await axios.get(websiteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const possiblePhotos = [];

    // Strategy 1: Look for images with surgeon-related alt text
    $('img').each((i, elem) => {
      const alt = $(elem).attr('alt')?.toLowerCase() || '';
      const src = $(elem).attr('src');
      const dataSrc = $(elem).attr('data-src'); // Lazy-loaded images
      
      const imageUrl = src || dataSrc;
      
      if (!imageUrl) return;

      // Check if alt text mentions doctor/surgeon/dr or the surgeon's name
      const nameWords = surgeonName.toLowerCase().split(' ');
      const hasNameInAlt = nameWords.some(word => alt.includes(word) && word.length > 2);
      const hasSurgeonKeywords = alt.includes('doctor') || 
                                 alt.includes('surgeon') || 
                                 alt.includes('dr ') ||
                                 alt.includes('dr.') ||
                                 alt.includes('profile');

      if (hasNameInAlt || hasSurgeonKeywords) {
        const score = (hasNameInAlt ? 10 : 0) + (hasSurgeonKeywords ? 5 : 0);
        possiblePhotos.push({ url: imageUrl, score, alt });
      }
    });

    // Strategy 2: Look for images in common surgeon photo sections
    const sectionSelectors = [
      '.team-member img',
      '.doctor-profile img',
      '.surgeon-bio img',
      '.about-doctor img',
      '.staff-member img',
      '.our-team img',
      '.team img',
      '.about img',
      '#team img',
      '#about img',
      '[class*="team"] img',
      '[class*="doctor"] img',
      '[class*="surgeon"] img',
    ];

    sectionSelectors.forEach(selector => {
      $(selector).each((i, elem) => {
        const src = $(elem).attr('src') || $(elem).attr('data-src');
        const alt = $(elem).attr('alt') || '';
        
        if (src && !possiblePhotos.find(p => p.url === src)) {
          possiblePhotos.push({ url: src, score: 3, alt });
        }
      });
    });

    if (possiblePhotos.length === 0) {
      console.log(`  ❌ No photos found`);
      return null;
    }

    // Sort by score (highest first)
    possiblePhotos.sort((a, b) => b.score - a.score);

    // Convert relative URLs to absolute
    const bestPhoto = possiblePhotos[0];
    let photoUrl = bestPhoto.url;

    if (photoUrl.startsWith('//')) {
      photoUrl = 'https:' + photoUrl;
    } else if (photoUrl.startsWith('/')) {
      const baseUrl = new URL(websiteUrl);
      photoUrl = baseUrl.origin + photoUrl;
    } else if (!photoUrl.startsWith('http')) {
      photoUrl = new URL(photoUrl, websiteUrl).href;
    }

    console.log(`  ✅ Found photo: ${photoUrl.substring(0, 60)}...`);
    return photoUrl;

  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return null;
  }
}

/**
 * Read CSV
 */
async function readCSV(path) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(path)
      .pipe(csv())
      .on('data', row => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

/**
 * Write CSV
 */
async function writeCSV(path, data) {
  const csvWriter = createObjectCsvWriter({
    path: path,
    header: Object.keys(data[0]).map(key => ({ id: key, title: key })),
  });
  await csvWriter.writeRecords(data);
}

/**
 * Delay helper
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main
 */
async function main() {
  console.log('🎯 Surgeon Photo Extractor');
  console.log('==========================\n');

  // Read CSV
  console.log(`📖 Reading: ${INPUT_CSV}`);
  const surgeons = await readCSV(INPUT_CSV);
  console.log(`✅ Loaded ${surgeons.length} entries\n`);

  // Deduplicate by website URL (many duplicates in the CSV)
  const uniqueByWebsite = {};
  surgeons.forEach(s => {
    if (s.website && !uniqueByWebsite[s.website]) {
      uniqueByWebsite[s.website] = s;
    }
  });

  const uniqueSurgeons = Object.values(uniqueByWebsite);
  console.log(`📊 Found ${uniqueSurgeons.length} unique surgeon websites\n`);

  // Process each surgeon
  const results = [];
  let successCount = 0;

  for (let i = 0; i < uniqueSurgeons.length; i++) {
    const surgeon = uniqueSurgeons[i];
    console.log(`[${i + 1}/${uniqueSurgeons.length}] ${surgeon.title}`);

    const photo = await extractSurgeonPhoto(surgeon.website, surgeon.title);
    
    results.push({
      ...surgeon,
      surgeon_photo: photo || '',
    });

    if (photo) successCount++;

    // Delay between requests (be polite!)
    if (i < uniqueSurgeons.length - 1) {
      await delay(2000); // 2 seconds between requests
    }
  }

  // Now map back to ALL surgeons (including duplicates)
  const photoMap = {};
  results.forEach(r => {
    if (r.surgeon_photo) {
      photoMap[r.website] = r.surgeon_photo;
    }
  });

  const allSurgeonsWithPhotos = surgeons.map(s => ({
    ...s,
    surgeon_photo: photoMap[s.website] || '',
  }));

  // Write output
  console.log(`\n💾 Writing: ${OUTPUT_CSV}`);
  await writeCSV(OUTPUT_CSV, allSurgeonsWithPhotos);

  console.log('\n✅ Complete!');
  console.log(`📊 Results:`);
  console.log(`  Total entries: ${surgeons.length}`);
  console.log(`  Unique websites: ${uniqueSurgeons.length}`);
  console.log(`  Photos found: ${successCount} (${Math.round(successCount/uniqueSurgeons.length*100)}%)`);
  console.log(`  Output saved to: ${OUTPUT_CSV}`);
}

// Run
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

