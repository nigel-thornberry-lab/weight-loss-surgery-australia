/**
 * Extract Reviews and Services Data
 * 
 * This script provides a framework for extracting:
 * 1. Google Reviews (requires Google Places API key)
 * 2. Website services, pricing, and team info
 * 
 * For production: Add Google Places API key
 * For now: Manual data entry template
 */

const fs = require('fs');

const INPUT_CSV = 'surgeons-with-photos.csv';
const OUTPUT_JSON = 'surgeon-enhanced-data.json';

/**
 * Template for enhanced surgeon data
 * This structure shows what we want to collect for each surgeon
 */
function createEnhancedDataTemplate(surgeon) {
  return {
    // Basic Info (from CSV)
    name: surgeon.title,
    city: surgeon.city,
    state: surgeon.state,
    rating: surgeon.totalScore,
    reviewCount: surgeon.reviewsCount,
    website: surgeon.website,
    googleMapsUrl: surgeon.url,
    
    // ENHANCED DATA TO COLLECT:
    
    // 1. Google Reviews (3-5 per surgeon)
    reviews: [
      {
        author: "Patient Name",
        rating: 5,
        text: "Review text here...",
        date: "2024-01-15",
        verified: true,
        surgeon_response: "" // If surgeon responded
      }
      // ... more reviews
    ],
    
    // 2. Team & Practice
    team: {
      size: 0, // Total team members
      surgeons: 1, // Number of surgeons
      nurses: 0,
      has_team_page: false
    },
    
    // 3. Services Offered
    services: {
      nutritionist: false,
      dietitian: false,
      psychologist: false,
      mental_health_support: false,
      exercise_physiologist: false,
      support_groups: false,
      telehealth: false,
      follow_up_duration: "", // e.g., "12 months", "lifetime"
      pre_op_program: false,
      post_op_program: false
    },
    
    // 4. Pricing
    pricing: {
      gastric_sleeve: "", // e.g., "$18,500" or "Contact for pricing"
      gastric_bypass: "",
      gastric_band: "",
      mini_gastric_bypass: "",
      consultation_fee: "",
      payment_plans: false,
      insurance_details: "",
      gap_fees: ""
    },
    
    // 5. Hospital & Facilities
    facilities: {
      hospital_affiliations: [], // ["St Vincent's Private", "Sydney Private"]
      accreditations: [],
      private_hospital: false,
      day_surgery: false
    },
    
    // 6. Insurance
    insurance: {
      medicare: false,
      private_health_accepted: [],
      payment_providers: [] // ["MacCredit", "zipPay"]
    },
    
    // 7. Unique Value Props (for comparison)
    highlights: [
      // Examples:
      // "Full multidisciplinary team",
      // "Transparent pricing",
      // "Lifetime follow-up",
      // "12-month psychology support"
    ]
  };
}

/**
 * Data Collection Instructions
 */
function generateDataCollectionGuide() {
  const guide = `
# Surgeon Data Collection Guide

## How to Collect Enhanced Data

For each surgeon, visit their website and Google Maps profile to collect:

### 1. GOOGLE REVIEWS (Priority 1)
**Source**: Google Maps URL from CSV
**Steps**:
1. Open Google Maps URL
2. Click "Reviews" tab
3. Copy 3-5 most helpful/recent reviews
4. Record: Author name, rating, text, date

**Example**:
\`\`\`json
{
  "author": "Sarah M.",
  "rating": 5,
  "text": "Dr. Smith was amazing! The entire team supported me...",
  "date": "2024-01-15",
  "verified": true
}
\`\`\`

### 2. TEAM & SERVICES (Priority 1)
**Source**: Website - Look for:
- "Team" or "About Us" pages
- "Services" or "What We Offer" pages
- "Our Approach" or "Program" pages

**Keywords to search for**:
- Nutritionist/Dietitian: "nutrition", "diet", "nutritionist"
- Psychologist: "psychology", "mental health", "counseling"
- Exercise: "exercise physiologist", "fitness", "trainer"
- Support: "support group", "follow-up", "aftercare"

### 3. PRICING (Priority 1)
**Source**: Website - Look for:
- "Pricing", "Costs", "Fees" pages
- "Investment", "Finance" pages
- FAQs about costs

**Record**:
- Exact prices if listed
- Price ranges
- "Contact for pricing" if not listed
- Payment plan options
- Insurance information

### 4. HOSPITAL AFFILIATIONS
**Source**: Website footer, "Locations" page
**Record**:
- Hospital names where they operate
- Accreditations (RACS, etc.)

## Data Entry Format

Save data in JSON format: surgeon-enhanced-data.json

\`\`\`json
{
  "dr-smith-sydney": {
    "reviews": [...],
    "services": {
      "nutritionist": true,
      "psychologist": true,
      ...
    },
    "pricing": {
      "gastric_sleeve": "$18,500",
      ...
    }
  }
}
\`\`\`

## Automation Options

### Option A: Google Places API (Recommended)
- Sign up: https://developers.google.com/maps/documentation/places/web-service/overview
- API key required
- Can fetch reviews automatically
- Cost: ~$20/1000 requests

### Option B: Manual Collection
- Use this template
- Collect data for top 20 surgeons first
- Expand based on results

### Option C: Hybrid Approach
- Use API for reviews
- Manual website scraping for services/pricing
- Best accuracy

## Priority Order

1. **Top 20 surgeons** (highest traffic): Full data
2. **Next 30 surgeons**: Reviews + basic services
3. **Remaining**: Reviews only

This ensures highest value pages are enhanced first.
`;

  fs.writeFileSync('DATA-COLLECTION-GUIDE.md', guide);
  console.log('✅ Created DATA-COLLECTION-GUIDE.md');
}

// Run
console.log('🎯 Enhanced Data Collection Framework\n');
console.log('This script provides the structure for collecting enhanced surgeon data.\n');
console.log('Options:');
console.log('1. Manual data collection (use template)');
console.log('2. Google Places API integration (requires API key)');
console.log('3. Website scraping automation (requires Puppeteer/Cheerio)\n');

generateDataCollectionGuide();

console.log('\n📋 Next steps:');
console.log('1. Review DATA-COLLECTION-GUIDE.md');
console.log('2. Decide: API, manual, or hybrid approach');
console.log('3. Start with top 10-20 surgeons for proof of concept');
console.log('4. Test enhanced profiles vs standard profiles');
console.log('5. Measure engagement improvement\n');

