/**
 * Playwright-based Surgeon Data Scraper
 * 
 * Enhanced scraper using Playwright for better reliability and image extraction
 * 
 * Usage:
 *   node scripts/scrape-with-playwright.js
 */

const fs = require('fs');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  INPUT_CSV: 'Copy of Surgeons Master - Working Copy - dataset_crawler-google-places_2025-10-04_06-45-50-735.csv',
  OUTPUT_CSV: 'surgeons-fully-enriched.csv',
  DELAY_BETWEEN_SURGEONS: 3000, // 3 seconds
  DELAY_BETWEEN_PAGES: 2000,     // 2 seconds
  MAX_REVIEWS_PER_SURGEON: 10,
  MAX_PHOTOS_PER_SURGEON: 5,
};

// ============================================================================
// CSV PROCESSING
// ============================================================================

/**
 * Read surgeons from CSV file
 */
async function readSurgeonsCSV(inputPath) {
  return new Promise((resolve, reject) => {
    const surgeons = [];
    
    fs.createReadStream(inputPath)
      .pipe(csv())
      .on('data', (row) => surgeons.push(row))
      .on('end', () => resolve(surgeons))
      .on('error', reject);
  });
}

/**
 * Write enriched surgeon data to CSV
 */
async function writeSurgeonsCSV(outputPath, surgeons) {
  const csvWriter = createObjectCsvWriter({
    path: outputPath,
    header: [
      // Original fields
      { id: 'title', title: 'title' },
      { id: 'totalScore', title: 'totalScore' },
      { id: 'reviewsCount', title: 'reviewsCount' },
      { id: 'street', title: 'street' },
      { id: 'city', title: 'city' },
      { id: 'state', title: 'state' },
      { id: 'countryCode', title: 'countryCode' },
      { id: 'website', title: 'website' },
      { id: 'phone', title: 'phone' },
      { id: 'categoryName', title: 'categoryName' },
      { id: 'url', title: 'url' },
      
      // NEW ENRICHED FIELDS
      { id: 'surgeon_photo', title: 'surgeon_photo' },
      { id: 'operating_hours', title: 'operating_hours' },
      { id: 'professional_memberships', title: 'professional_memberships' },
      { id: 'pricing_range', title: 'pricing_range' },
      { id: 'real_reviews', title: 'real_reviews' },
      { id: 'practice_photos', title: 'practice_photos' },
      { id: 'procedures_offered', title: 'procedures_offered' },
      { id: 'years_experience', title: 'years_experience' },
    ],
  });

  await csvWriter.writeRecords(surgeons);
}

// ============================================================================
// SCRAPING FUNCTIONS (TO BE USED WITH PLAYWRIGHT MCP)
// ============================================================================

/**
 * Instructions for using Playwright MCP to scrape data
 * 
 * This file provides the structure and logic.
 * You'll use Playwright MCP to:
 * 1. Navigate to Google Maps URL
 * 2. Extract reviews, hours, photos
 * 3. Navigate to website URL
 * 4. Extract procedures, experience, photos
 */

function getScrapingInstructions() {
  return {
    googleMaps: {
      url: '${surgeon.url}',
      selectors: {
        reviews: '[data-review-id]',
        reviewAuthor: '[class*="d4r55"]',
        reviewRating: '[class*="kvMYJc"]',
        reviewDate: '[class*="rsqaWe"]',
        reviewText: '[class*="wiI7pd"]',
        hoursButton: '[aria-label*="open hours"]',
        hoursTable: 'table',
        photos: 'img[src*="googleusercontent"]',
        address: '[data-item-id="address"]',
        phone: '[data-item-id^="phone"]',
        website: '[data-item-id="authority"] a',
      },
      actions: [
        'Wait for page load',
        'Scroll to reviews section',
        'Click "Show more reviews" if available',
        'Extract up to 10 reviews',
        'Click hours button if available',
        'Extract operating hours',
        'Extract practice photos',
      ],
    },
    website: {
      url: '${surgeon.website}',
      extractors: {
        procedures: {
          keywords: [
            'gastric sleeve',
            'sleeve gastrectomy',
            'gastric bypass',
            'roux-en-y',
            'gastric band',
            'lap band',
            'mini gastric bypass',
            'duodenal switch',
          ],
          normalize: true,
        },
        memberships: {
          keywords: ['FRACS', 'RACS', 'ANZBS', 'OSSANZ', 'ASPS', 'AHPRA'],
        },
        experience: {
          pattern: /(\d+)\+?\s*years?\s*(of\s*)?(experience|practice)/i,
        },
        pricing: {
          pattern: /\$\s*(\d{1,3}(?:,\d{3})*)\s*-?\s*\$?\s*(\d{1,3}(?:,\d{3})*)?/,
        },
        surgeonPhoto: {
          selectors: [
            'img[alt*="doctor"]',
            'img[alt*="surgeon"]',
            'img[alt*="dr"]',
            '.team-member img',
            '.doctor-profile img',
            '.surgeon-bio img',
            '.about-doctor img',
          ],
        },
      },
    },
  };
}

// ============================================================================
// DATA PROCESSING
// ============================================================================

/**
 * Process and enrich a single surgeon's data
 */
function enrichSurgeonData(surgeon, scrapedData) {
  const enriched = { ...surgeon };

  // Process Google Maps data
  if (scrapedData.googleMaps) {
    const { reviews, hours, photos } = scrapedData.googleMaps;

    if (hours && Object.keys(hours).length > 0) {
      enriched.operating_hours = JSON.stringify(hours);
    }

    if (reviews && reviews.length > 0) {
      enriched.real_reviews = JSON.stringify(reviews);
    }

    if (photos && photos.length > 0) {
      enriched.practice_photos = JSON.stringify(photos);
    }
  }

  // Process website data
  if (scrapedData.website) {
    const { procedures, memberships, experience, pricing, photo } = scrapedData.website;

    if (procedures && procedures.length > 0) {
      enriched.procedures_offered = procedures.join(', ');
    }

    if (memberships && memberships.length > 0) {
      enriched.professional_memberships = memberships.join(', ');
    }

    if (experience) {
      enriched.years_experience = experience;
    }

    if (pricing) {
      enriched.pricing_range = pricing;
    }

    if (photo) {
      enriched.surgeon_photo = photo;
    }
  }

  return enriched;
}

/**
 * Normalize procedure names
 */
function normalizeProcedures(procedures) {
  const normalized = [];
  const text = procedures.join(' ').toLowerCase();

  if (text.includes('sleeve') || text.includes('gastrectomy')) {
    normalized.push('Gastric Sleeve');
  }
  if (text.includes('bypass') && !text.includes('mini')) {
    normalized.push('Gastric Bypass');
  }
  if (text.includes('mini') && text.includes('bypass')) {
    normalized.push('Mini Gastric Bypass');
  }
  if (text.includes('band') || text.includes('lap band')) {
    normalized.push('Gastric Band');
  }
  if (text.includes('duodenal') || text.includes('switch')) {
    normalized.push('Duodenal Switch');
  }

  return [...new Set(normalized)];
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('🚀 Playwright Surgeon Data Scraper');
  console.log('===================================\n');

  // Read input CSV
  console.log(`📖 Reading surgeons from: ${CONFIG.INPUT_CSV}`);
  const surgeons = await readSurgeonsCSV(CONFIG.INPUT_CSV);
  console.log(`✅ Found ${surgeons.length} surgeons\n`);

  console.log('📋 CSV Structure:');
  console.log('  - title (surgeon/business name)');
  console.log('  - totalScore (rating)');
  console.log('  - reviewsCount (number of reviews)');
  console.log('  - street, city, state');
  console.log('  - website (surgeon website URL)');
  console.log('  - phone');
  console.log('  - url (Google Maps URL)');
  console.log('');

  console.log('🎯 Next Steps:');
  console.log('');
  console.log('Since you have Playwright MCP available, I recommend:');
  console.log('');
  console.log('1. Use Playwright MCP to scrape each surgeon:');
  console.log('   - Navigate to Google Maps URL');
  console.log('   - Extract reviews, hours, photos');
  console.log('   - Navigate to website URL');
  console.log('   - Extract procedures, experience, surgeon photo');
  console.log('');
  console.log('2. Data to extract:');
  console.log('   ✓ Real reviews (author, rating, date, text)');
  console.log('   ✓ Operating hours (Monday-Sunday)');
  console.log('   ✓ Practice photos (up to 5)');
  console.log('   ✓ Procedures offered');
  console.log('   ✓ Professional memberships (FRACS, RACS, etc.)');
  console.log('   ✓ Years of experience');
  console.log('   ✓ Pricing (if available)');
  console.log('   ✓ Surgeon photo');
  console.log('');
  console.log('3. Process ${surgeons.length} surgeons at 3 seconds each');
  console.log(`   Estimated time: ~${Math.round((surgeons.length * 6) / 60)} minutes`);
  console.log('');

  // Sample surgeon for testing
  const sampleSurgeon = surgeons[0];
  console.log('📝 Sample Surgeon (for testing):');
  console.log(`  Name: ${sampleSurgeon.title}`);
  console.log(`  City: ${sampleSurgeon.city}, ${sampleSurgeon.state}`);
  console.log(`  Google Maps: ${sampleSurgeon.url}`);
  console.log(`  Website: ${sampleSurgeon.website}`);
  console.log(`  Rating: ${sampleSurgeon.totalScore} (${sampleSurgeon.reviewsCount} reviews)`);
  console.log('');

  console.log('💡 Recommendation:');
  console.log('  Let me know if you want me to:');
  console.log('  A) Create a Playwright MCP integration script');
  console.log('  B) Manually process a sample surgeon to show the format');
  console.log('  C) Use the existing Puppeteer scraper (needs npm install)');
  console.log('');
  
  // Save basic surgeon list for reference
  console.log('📊 Generating surgeon list for reference...');
  const surgeonList = surgeons.map((s, i) => ({
    index: i + 1,
    name: s.title,
    city: s.city,
    state: s.state,
    rating: s.totalScore,
    reviews: s.reviewsCount,
    has_website: s.website ? 'Yes' : 'No',
    has_maps_url: s.url ? 'Yes' : 'No',
  }));

  // Group by city
  const byCity = {};
  surgeons.forEach(s => {
    const city = s.city || 'Unknown';
    if (!byCity[city]) byCity[city] = [];
    byCity[city].push(s);
  });

  console.log('\n📍 Surgeons by City:');
  Object.entries(byCity)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 10)
    .forEach(([city, surgeonsInCity]) => {
      console.log(`  ${city}: ${surgeonsInCity.length} surgeons`);
    });

  console.log(`\n✅ Total: ${surgeons.length} surgeons ready to process`);
  console.log(`📄 Output will be saved to: ${CONFIG.OUTPUT_CSV}`);
}

// Helper function for delays
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { 
  readSurgeonsCSV, 
  writeSurgeonsCSV, 
  enrichSurgeonData,
  normalizeProcedures,
  getScrapingInstructions,
};

