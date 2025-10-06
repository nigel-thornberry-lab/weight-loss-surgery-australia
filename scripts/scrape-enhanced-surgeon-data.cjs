/**
 * Enhanced Surgeon Data Scraper
 * Extracts reviews, team info, services, and pricing from Google Maps and websites
 */

const fs = require('fs');
const path = require('path');

const INPUT_CSV = 'surgeons-with-photos.csv';
const OUTPUT_CSV = 'surgeons-enhanced-data.csv';

// Parse CSV with proper quote handling
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ''));
  
  return result;
}

/**
 * Extract Google Reviews from Google Maps URL
 * Note: This requires the Google Places API for production use
 * For now, we'll create a structure to hold the data
 */
async function extractGoogleReviews(googleMapsUrl, surgeonName) {
  console.log(`   📝 Extracting reviews for ${surgeonName}...`);
  
  // TODO: Implement Google Places API call
  // For now, return placeholder structure showing what we'll collect
  return {
    reviews: [
      // {
      //   author_name: "Patient Name",
      //   rating: 5,
      //   text: "Excellent care and support throughout...",
      //   time: "2024-01-15",
      //   verified: true
      // }
    ],
    average_rating: 0,
    total_reviews: 0
  };
}

/**
 * Extract enhanced data from surgeon's website
 * Looks for: team size, services, pricing, support offerings
 */
async function extractWebsiteData(websiteUrl, surgeonName) {
  console.log(`   🌐 Analyzing website for ${surgeonName}...`);
  
  if (!websiteUrl || websiteUrl === '') {
    return {
      team_size: 0,
      services: [],
      has_nutritionist: false,
      has_psychologist: false,
      has_dietitian: false,
      has_exercise_physiologist: false,
      pricing: {},
      support_duration: '',
      hospital_affiliations: [],
      insurance_accepted: []
    };
  }
  
  try {
    // TODO: Implement website scraping with cheerio
    // For now, analyze the website URL and structure
    
    const data = {
      team_size: 0,
      services: [],
      has_nutritionist: false,
      has_psychologist: false,
      has_dietitian: false,
      has_exercise_physiologist: false,
      pricing: {
        gastric_sleeve: '',
        gastric_bypass: '',
        gastric_band: '',
        consultation_fee: ''
      },
      support_duration: '',
      hospital_affiliations: [],
      insurance_accepted: [],
      features: []
    };
    
    // Detect common patterns in URLs that indicate services
    const urlLower = websiteUrl.toLowerCase();
    
    if (urlLower.includes('team') || urlLower.includes('about')) {
      data.features.push('Has team page');
    }
    
    if (urlLower.includes('price') || urlLower.includes('cost') || urlLower.includes('fee')) {
      data.features.push('Pricing information available');
    }
    
    return data;
  } catch (error) {
    console.log(`   ⚠️  Could not analyze website: ${error.message}`);
    return {
      team_size: 0,
      services: [],
      has_nutritionist: false,
      has_psychologist: false,
      has_dietitian: false,
      has_exercise_physiologist: false,
      pricing: {},
      support_duration: '',
      hospital_affiliations: [],
      insurance_accepted: []
    };
  }
}

/**
 * Main processing function
 */
async function processEnhancedData() {
  console.log('🔄 Starting enhanced surgeon data extraction...\n');
  
  // Read input CSV
  const content = fs.readFileSync(INPUT_CSV, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    console.error('❌ CSV file is empty!');
    process.exit(1);
  }
  
  const headers = parseCSVLine(lines[0]);
  console.log(`📋 Processing ${lines.length - 1} surgeons...\n`);
  
  // Output headers with new fields
  const outputHeaders = [
    ...headers,
    'google_reviews_json',
    'average_rating_calculated',
    'team_size',
    'has_nutritionist',
    'has_psychologist',
    'has_dietitian',
    'has_exercise_physiologist',
    'gastric_sleeve_price',
    'gastric_bypass_price',
    'gastric_band_price',
    'consultation_fee',
    'support_duration',
    'hospital_affiliations',
    'insurance_accepted',
    'website_features'
  ];
  
  const results = [];
  let processedCount = 0;
  
  for (let i = 1; i < Math.min(lines.length, 6); i++) { // Process first 5 for testing
    const values = parseCSVLine(lines[i]);
    if (values.length < headers.length) continue;
    
    const surgeon = {};
    headers.forEach((header, index) => {
      surgeon[header] = values[index] || '';
    });
    
    const name = surgeon['title'] || '';
    const googleMapsUrl = surgeon['url'] || '';
    const websiteUrl = surgeon['website'] || '';
    
    if (!name) continue;
    
    console.log(`\n📊 Processing ${++processedCount}. ${name}`);
    
    // Extract Google reviews
    const reviewsData = await extractGoogleReviews(googleMapsUrl, name);
    
    // Extract website data
    const websiteData = await extractWebsiteData(websiteUrl, name);
    
    // Add enhanced data
    const enhanced = {
      ...surgeon,
      google_reviews_json: JSON.stringify(reviewsData.reviews),
      average_rating_calculated: reviewsData.average_rating,
      team_size: websiteData.team_size,
      has_nutritionist: websiteData.has_nutritionist,
      has_psychologist: websiteData.has_psychologist,
      has_dietitian: websiteData.has_dietitian,
      has_exercise_physiologist: websiteData.has_exercise_physiologist,
      gastric_sleeve_price: websiteData.pricing.gastric_sleeve || '',
      gastric_bypass_price: websiteData.pricing.gastric_bypass || '',
      gastric_band_price: websiteData.pricing.gastric_band || '',
      consultation_fee: websiteData.pricing.consultation_fee || '',
      support_duration: websiteData.support_duration || '',
      hospital_affiliations: JSON.stringify(websiteData.hospital_affiliations),
      insurance_accepted: JSON.stringify(websiteData.insurance_accepted),
      website_features: JSON.stringify(websiteData.features)
    };
    
    results.push(enhanced);
    console.log(`   ✅ Complete`);
  }
  
  // Write output
  console.log(`\n\n📝 Writing enhanced data to ${OUTPUT_CSV}...`);
  
  const csvContent = [
    outputHeaders.join(','),
    ...results.map(surgeon => {
      return outputHeaders.map(header => {
        const value = surgeon[header] || '';
        // Escape quotes and wrap in quotes
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',');
    })
  ].join('\n');
  
  fs.writeFileSync(OUTPUT_CSV, csvContent, 'utf-8');
  
  console.log(`\n✅ SUCCESS!`);
  console.log(`📊 Processed ${results.length} surgeons`);
  console.log(`📁 Output: ${OUTPUT_CSV}`);
  console.log(`\n💡 Next Steps:`);
  console.log(`   1. Implement Google Places API for reviews`);
  console.log(`   2. Implement website scraping for pricing & services`);
  console.log(`   3. Update profile generation to use enhanced data`);
}

processEnhancedData().catch(err => {
  console.error('❌ Error:', err.message);
  console.error(err.stack);
  process.exit(1);
});

