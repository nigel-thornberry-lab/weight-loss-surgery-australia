/**
 * Comprehensive Surgeon Data Scraper
 * 
 * This script scrapes enriched data from Google Maps and surgeon websites
 * to build complete surgeon profiles with:
 * - Real Google reviews
 * - Operating hours
 * - Surgeon photos
 * - Procedures offered
 * - Years of experience
 * - Professional memberships
 * - Pricing information
 * 
 * Usage:
 *   node scripts/scrape-surgeon-data.js <input-csv> <output-csv>
 * 
 * Requirements:
 *   npm install puppeteer csv-parser csv-writer cheerio axios
 */

const fs = require('fs');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  // Scraping delays to avoid rate limiting
  DELAY_BETWEEN_SURGEONS: 2000, // 2 seconds
  DELAY_BETWEEN_PAGES: 1000,     // 1 second
  
  // Review limits
  MAX_REVIEWS_PER_SURGEON: 10,
  
  // Browser settings
  HEADLESS: true,
  TIMEOUT: 30000, // 30 seconds
  
  // User agent
  USER_AGENT: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

// ============================================================================
// GOOGLE MAPS SCRAPER
// ============================================================================

/**
 * Extract Place ID from Google Maps URL
 */
function extractPlaceId(mapsUrl) {
  if (!mapsUrl) return null;
  
  const match = mapsUrl.match(/place_id=([^&]+)/);
  return match ? match[1] : null;
}

/**
 * Scrape Google Maps data for a surgeon
 */
async function scrapeGoogleMaps(page, mapsUrl) {
  try {
    if (!mapsUrl || !mapsUrl.includes('google.com/maps')) {
      console.log('  ⚠️  Invalid or missing Google Maps URL');
      return {};
    }

    console.log('  📍 Scraping Google Maps...');
    
    await page.goto(mapsUrl, {
      waitUntil: 'networkidle2',
      timeout: CONFIG.TIMEOUT,
    });

    // Wait for content to load
    await page.waitForTimeout(2000);

    const data = await page.evaluate(() => {
      const result = {
        reviews: [],
        hours: {},
        photos: [],
        address: '',
        phone: '',
        website: '',
      };

      // Extract address
      const addressEl = document.querySelector('[data-item-id="address"]');
      if (addressEl) {
        result.address = addressEl.textContent.trim();
      }

      // Extract phone
      const phoneEl = document.querySelector('[data-item-id^="phone"]');
      if (phoneEl) {
        result.phone = phoneEl.textContent.trim();
      }

      // Extract website
      const websiteEl = document.querySelector('[data-item-id="authority"]');
      if (websiteEl) {
        const link = websiteEl.querySelector('a');
        if (link) result.website = link.href;
      }

      // Extract operating hours
      const hoursButton = document.querySelector('[aria-label*="Hide open hours"]') ||
                         document.querySelector('[aria-label*="Show open hours"]');
      
      if (hoursButton) {
        hoursButton.click();
        
        setTimeout(() => {
          const hoursTable = document.querySelector('table');
          if (hoursTable) {
            const rows = hoursTable.querySelectorAll('tr');
            rows.forEach(row => {
              const day = row.querySelector('td:first-child')?.textContent.trim();
              const hours = row.querySelector('td:last-child')?.textContent.trim();
              if (day && hours) {
                result.hours[day] = hours;
              }
            });
          }
        }, 1000);
      }

      // Extract reviews
      const reviewElements = document.querySelectorAll('[data-review-id]');
      reviewElements.forEach((el, index) => {
        if (index >= 10) return; // Limit to 10 reviews

        const review = {};
        
        // Author name
        const authorEl = el.querySelector('[class*="d4r55"]');
        if (authorEl) review.author = authorEl.textContent.trim();

        // Rating
        const ratingEl = el.querySelector('[class*="kvMYJc"]');
        if (ratingEl) {
          const ariaLabel = ratingEl.getAttribute('aria-label');
          const match = ariaLabel?.match(/(\d+(?:\.\d+)?)/);
          if (match) review.rating = parseFloat(match[1]);
        }

        // Date
        const dateEl = el.querySelector('[class*="rsqaWe"]');
        if (dateEl) review.date = dateEl.textContent.trim();

        // Review text
        const textEl = el.querySelector('[class*="wiI7pd"]');
        if (textEl) review.text = textEl.textContent.trim();

        if (review.author && review.text) {
          result.reviews.push(review);
        }
      });

      // Extract photos
      const photoElements = document.querySelectorAll('img[src*="googleusercontent"]');
      photoElements.forEach((img, index) => {
        if (index < 5) { // Limit to 5 photos
          result.photos.push(img.src);
        }
      });

      return result;
    });

    console.log(`  ✅ Found ${data.reviews.length} reviews, ${Object.keys(data.hours).length} hours entries`);
    return data;

  } catch (error) {
    console.log(`  ❌ Error scraping Google Maps: ${error.message}`);
    return {};
  }
}

// ============================================================================
// WEBSITE SCRAPER
// ============================================================================

/**
 * Scrape surgeon website for additional data
 */
async function scrapeWebsite(websiteUrl) {
  try {
    if (!websiteUrl || !websiteUrl.startsWith('http')) {
      console.log('  ⚠️  Invalid or missing website URL');
      return {};
    }

    console.log('  🌐 Scraping website...');

    const response = await axios.get(websiteUrl, {
      headers: {
        'User-Agent': CONFIG.USER_AGENT,
      },
      timeout: CONFIG.TIMEOUT,
    });

    const $ = cheerio.load(response.data);
    const data = {
      procedures: [],
      memberships: [],
      pricing: null,
      experience_years: null,
      surgeon_photo: null,
    };

    // Extract procedures (common keywords)
    const procedureKeywords = [
      'gastric sleeve',
      'sleeve gastrectomy',
      'gastric bypass',
      'roux-en-y',
      'gastric band',
      'lap band',
      'mini gastric bypass',
      'duodenal switch',
      'bariatric surgery',
      'weight loss surgery',
    ];

    const bodyText = $('body').text().toLowerCase();
    procedureKeywords.forEach(keyword => {
      if (bodyText.includes(keyword)) {
        // Normalize procedure names
        if (keyword.includes('sleeve')) data.procedures.push('Gastric Sleeve');
        else if (keyword.includes('bypass') && !keyword.includes('mini')) data.procedures.push('Gastric Bypass');
        else if (keyword.includes('mini')) data.procedures.push('Mini Gastric Bypass');
        else if (keyword.includes('band')) data.procedures.push('Gastric Band');
        else if (keyword.includes('duodenal')) data.procedures.push('Duodenal Switch');
      }
    });
    
    // Remove duplicates
    data.procedures = [...new Set(data.procedures)];

    // Extract professional memberships (common Australian medical bodies)
    const membershipKeywords = [
      'FRACS', // Fellow of the Royal Australasian College of Surgeons
      'RACS',  // Royal Australasian College of Surgeons
      'ANZBS', // Australian and New Zealand Bariatric Surgery Society  
      'OSSANZ', // Obesity Surgery Society of Australia and New Zealand
      'ASPS',  // Australian Society of Plastic Surgeons
      'ASAPS', // Australian Society of Aesthetic Plastic Surgeons
      'AHPRA', // Australian Health Practitioner Regulation Agency
    ];

    membershipKeywords.forEach(keyword => {
      if (bodyText.includes(keyword.toLowerCase())) {
        data.memberships.push(keyword);
      }
    });

    // Extract years of experience
    const experienceMatch = bodyText.match(/(\d+)\+?\s*years?\s*(of\s*)?(experience|practice)/i);
    if (experienceMatch) {
      data.experience_years = parseInt(experienceMatch[1]);
    }

    // Extract pricing information
    const pricingMatch = bodyText.match(/\$\s*(\d{1,3}(?:,\d{3})*)\s*-?\s*\$?\s*(\d{1,3}(?:,\d{3})*)?/);
    if (pricingMatch) {
      if (pricingMatch[2]) {
        data.pricing = `$${pricingMatch[1]} - $${pricingMatch[2]}`;
      } else {
        data.pricing = `From $${pricingMatch[1]}`;
      }
    }

    // Extract surgeon photo (look for common patterns)
    const possiblePhotos = [];
    
    // Method 1: Look for images with "doctor", "surgeon", "dr" in alt text
    $('img').each((i, elem) => {
      const alt = $(elem).attr('alt')?.toLowerCase() || '';
      const src = $(elem).attr('src');
      
      if (src && (alt.includes('doctor') || alt.includes('surgeon') || alt.includes('dr'))) {
        possiblePhotos.push(src);
      }
    });

    // Method 2: Look for images in common surgeon photo sections
    $('.team-member img, .doctor-profile img, .surgeon-bio img, .about-doctor img').each((i, elem) => {
      const src = $(elem).attr('src');
      if (src) possiblePhotos.push(src);
    });

    if (possiblePhotos.length > 0) {
      // Convert relative URLs to absolute
      data.surgeon_photo = new URL(possiblePhotos[0], websiteUrl).href;
    }

    console.log(`  ✅ Found ${data.procedures.length} procedures, ${data.memberships.length} memberships`);
    return data;

  } catch (error) {
    console.log(`  ❌ Error scraping website: ${error.message}`);
    return {};
  }
}

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
      { id: 'business_name', title: 'business_name' },
      { id: 'surgeon_name', title: 'surgeon_name' },
      { id: 'qualifications', title: 'qualifications' },
      { id: 'procedures', title: 'procedures' },
      { id: 'rating', title: 'rating' },
      { id: 'review_count', title: 'review_count' },
      { id: 'street', title: 'street' },
      { id: 'city', title: 'city' },
      { id: 'state', title: 'state' },
      { id: 'primary_location', title: 'primary_location' },
      { id: 'country', title: 'country' },
      { id: 'phone', title: 'phone' },
      { id: 'website', title: 'website' },
      { id: 'google_maps_url', title: 'google_maps_url' },
      { id: 'years_experience', title: 'years_experience' },
      { id: 'estimated_procedures', title: 'estimated_procedures' },
      { id: 'slug', title: 'slug' },
      
      // NEW ENRICHED FIELDS
      { id: 'surgeon_photo', title: 'surgeon_photo' },
      { id: 'operating_hours', title: 'operating_hours' },
      { id: 'professional_memberships', title: 'professional_memberships' },
      { id: 'pricing_range', title: 'pricing_range' },
      { id: 'real_reviews', title: 'real_reviews' },
      { id: 'practice_photos', title: 'practice_photos' },
    ],
  });

  await csvWriter.writeRecords(surgeons);
}

// ============================================================================
// MAIN SCRAPER LOGIC
// ============================================================================

/**
 * Enrich a single surgeon's data
 */
async function enrichSurgeon(surgeon, page) {
  console.log(`\n🔍 Processing: ${surgeon.surgeon_name || surgeon.business_name}`);

  const enriched = { ...surgeon };

  // 1. Scrape Google Maps
  if (surgeon.google_maps_url) {
    const mapsData = await scrapeGoogleMaps(page, surgeon.google_maps_url);
    
    if (mapsData.hours) {
      enriched.operating_hours = JSON.stringify(mapsData.hours);
    }
    
    if (mapsData.reviews && mapsData.reviews.length > 0) {
      enriched.real_reviews = JSON.stringify(mapsData.reviews);
    }
    
    if (mapsData.photos && mapsData.photos.length > 0) {
      enriched.practice_photos = JSON.stringify(mapsData.photos);
    }
    
    // Update contact info if found
    if (mapsData.phone && !enriched.phone) {
      enriched.phone = mapsData.phone;
    }
    
    if (mapsData.website && !enriched.website) {
      enriched.website = mapsData.website;
    }
  }

  await delay(CONFIG.DELAY_BETWEEN_PAGES);

  // 2. Scrape website
  if (surgeon.website || enriched.website) {
    const websiteData = await scrapeWebsite(surgeon.website || enriched.website);
    
    if (websiteData.procedures && websiteData.procedures.length > 0) {
      enriched.procedures = websiteData.procedures.join(', ');
    }
    
    if (websiteData.memberships && websiteData.memberships.length > 0) {
      enriched.professional_memberships = websiteData.memberships.join(', ');
    }
    
    if (websiteData.experience_years) {
      enriched.years_experience = websiteData.experience_years;
    }
    
    if (websiteData.pricing) {
      enriched.pricing_range = websiteData.pricing;
    }
    
    if (websiteData.surgeon_photo) {
      enriched.surgeon_photo = websiteData.surgeon_photo;
    }
  }

  await delay(CONFIG.DELAY_BETWEEN_SURGEONS);

  return enriched;
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node scrape-surgeon-data.js <input-csv> <output-csv>');
    console.log('Example: node scrape-surgeon-data.js surgeons-cleaned.csv surgeons-enriched-full.csv');
    process.exit(1);
  }

  const [inputPath, outputPath] = args;

  console.log('🚀 Comprehensive Surgeon Data Scraper');
  console.log('=====================================\n');

  // Read input CSV
  console.log(`📖 Reading surgeons from: ${inputPath}`);
  const surgeons = await readSurgeonsCSV(inputPath);
  console.log(`✅ Found ${surgeons.length} surgeons\n`);

  // Launch browser
  console.log('🌐 Launching browser...');
  const browser = await puppeteer.launch({
    headless: CONFIG.HEADLESS,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const page = await browser.newPage();
  await page.setUserAgent(CONFIG.USER_AGENT);
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('✅ Browser ready\n');

  // Process each surgeon
  const enrichedSurgeons = [];
  
  for (let i = 0; i < surgeons.length; i++) {
    console.log(`Progress: ${i + 1}/${surgeons.length}`);
    
    try {
      const enriched = await enrichSurgeon(surgeons[i], page);
      enrichedSurgeons.push(enriched);
    } catch (error) {
      console.log(`❌ Error processing surgeon: ${error.message}`);
      enrichedSurgeons.push(surgeons[i]); // Keep original data
    }
  }

  // Close browser
  await browser.close();

  // Write output CSV
  console.log(`\n💾 Writing enriched data to: ${outputPath}`);
  await writeSurgeonsCSV(outputPath, enrichedSurgeons);
  
  console.log('✅ Complete!');
  console.log(`\n📊 Summary:`);
  console.log(`  Total surgeons: ${enrichedSurgeons.length}`);
  console.log(`  With reviews: ${enrichedSurgeons.filter(s => s.real_reviews).length}`);
  console.log(`  With hours: ${enrichedSurgeons.filter(s => s.operating_hours).length}`);
  console.log(`  With photos: ${enrichedSurgeons.filter(s => s.surgeon_photo).length}`);
  console.log(`  With procedures: ${enrichedSurgeons.filter(s => s.procedures).length}`);
  console.log(`  With memberships: ${enrichedSurgeons.filter(s => s.professional_memberships).length}`);
}

// Helper function for delays
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the scraper
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { enrichSurgeon, scrapeGoogleMaps, scrapeWebsite };

