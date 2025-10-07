const fs = require('fs');
const path = require('path');

/**
 * Batch Surgeon Enhancement Workflow
 * 
 * This script generates Perplexity queries for each surgeon that needs enhancement.
 * You'll use Perplexity MCP to research each surgeon and add data to surgeon-enhanced-data.json
 */

const BASE_CSV = 'surgeons-with-bios.csv';
const ENHANCED_DATA = 'surgeon-enhanced-data-batch1.json';
const OUTPUT_QUEUE = 'surgeon-research-queue.json';

// Parse CSV line with proper quote handling
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

// Load existing enhanced data
const enhancedSurgeons = fs.existsSync(ENHANCED_DATA) 
  ? new Set(Object.keys(JSON.parse(fs.readFileSync(ENHANCED_DATA, 'utf-8'))))
  : new Set();

console.log(`🔍 Found ${enhancedSurgeons.size} already enhanced surgeons\n`);

// Read CSV
const csvContent = fs.readFileSync(BASE_CSV, 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim());
const headers = parseCSVLine(lines[0]);

// Get column indices
const nameIdx = headers.indexOf('surgeon_name');
const cityIdx = headers.indexOf('city');
const stateIdx = headers.indexOf('state');
const websiteIdx = headers.indexOf('website');
const slugIdx = headers.indexOf('slug');
const categoryIdx = headers.indexOf('category');

const researchQueue = [];
let enhancedCount = 0;
let needsEnhancement = 0;

// Process each surgeon
for (let i = 1; i < lines.length; i++) {
  const cols = parseCSVLine(lines[i]);
  const slug = cols[slugIdx];
  const name = cols[nameIdx];
  const city = cols[cityIdx];
  const state = cols[stateIdx];
  const website = cols[websiteIdx];
  const category = cols[categoryIdx];
  
  if (!name || !slug) continue;
  
  if (enhancedSurgeons.has(slug)) {
    enhancedCount++;
    continue;
  }
  
  needsEnhancement++;
  
  researchQueue.push({
    slug,
    name,
    city,
    state,
    website,
    category,
    perplexityQuery: `Research ${name}, a ${category.toLowerCase()} in ${city}, ${state}. Visit their website ${website} and extract:

1. CREDENTIALS:
   - Medical school
   - Fellowships (FRACS, etc.)
   - Professional memberships (IFSO, RACS, etc.)
   - Special training or certifications
   - Years of experience in bariatric surgery

2. TEAM & PRACTICE:
   - How many surgeons in the practice?
   - Do they have dietitians?
   - Psychologist support?
   - Nursing team?
   - What makes their team unique?

3. SERVICES & PROCEDURES:
   - What specific procedures do they offer? (gastric sleeve, bypass, band, revision, etc.)
   - Pre-operative programs?
   - Post-operative follow-up duration?
   - Telehealth availability?
   - Support groups?

4. HOSPITAL AFFILIATIONS:
   - Which hospitals does ${name} operate at?
   - List hospital names and addresses

5. PRICING:
   - Do they list any pricing information?
   - If not, note "Contact for pricing"

6. UNIQUE FEATURES:
   - What makes this surgeon stand out?
   - Special techniques or approaches?
   - Research or publications?
   - Awards or recognition?

7. FAQS:
   - Generate 3-5 common questions patients might ask about ${name}'s practice
   - Provide answers based on the website information

Format as JSON matching this structure:
{
  "credentials": {
    "medical_school": "",
    "fellowships": [],
    "professional_memberships": [],
    "special_training": [],
    "years_practicing": 0
  },
  "team": {
    "surgeons": [{"name": "", "role": ""}],
    "team_size": "",
    "has_dietitian": true/false,
    "has_psychologist": true/false,
    "has_nurses": true/false
  },
  "services": {
    "procedures": [],
    "pre_op_program": "",
    "post_op_program": "",
    "follow_up_duration": "",
    "telehealth": true/false,
    "support_groups": true/false
  },
  "hospitals": [{"name": "", "address": ""}],
  "pricing": {
    "available": true/false,
    "gastric_sleeve": "",
    "gastric_bypass": "",
    "consultation": ""
  },
  "unique_features": [],
  "faqs": [{"question": "", "answer": ""}]
}`
  });
}

// Save research queue
fs.writeFileSync(OUTPUT_QUEUE, JSON.stringify(researchQueue, null, 2));

console.log(`📊 Summary:`);
console.log(`   ✅ Already enhanced: ${enhancedCount}`);
console.log(`   📝 Needs enhancement: ${needsEnhancement}`);
console.log(`   📄 Total surgeons: ${lines.length - 1}\n`);

console.log(`📋 Next steps:`);
console.log(`   1. Open ${OUTPUT_QUEUE}`);
console.log(`   2. For each surgeon, copy their Perplexity query`);
console.log(`   3. Run query in Perplexity MCP`);
console.log(`   4. Add returned JSON to surgeon-enhanced-data.json under the surgeon's slug`);
console.log(`   5. Regenerate profiles with: node scripts/generate-all-profiles.cjs\n`);

console.log(`💡 Tip: Process in batches of 10-20 surgeons at a time`);
console.log(`⏱️  Estimated time: ~3-5 minutes per surgeon = ${Math.ceil(needsEnhancement * 4 / 60)} hours total\n`);
