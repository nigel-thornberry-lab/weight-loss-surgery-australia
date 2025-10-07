const fs = require('fs');

/**
 * Helper script to add enhanced data to surgeon-enhanced-data.json
 * 
 * Usage: node scripts/process-surgeon-batch.cjs <slug> '<json-data>'
 */

const ENHANCED_DATA_FILE = 'surgeon-enhanced-data-batch1.json';

const slug = process.argv[2];
const jsonData = process.argv[3];

if (!slug || !jsonData) {
  console.error('❌ Usage: node scripts/process-surgeon-batch.cjs <slug> \'<json-data>\'');
  process.exit(1);
}

// Load existing data
let enhancedData = {};
if (fs.existsSync(ENHANCED_DATA_FILE)) {
  enhancedData = JSON.parse(fs.readFileSync(ENHANCED_DATA_FILE, 'utf-8'));
}

// Parse new surgeon data
let surgeonData;
try {
  surgeonData = JSON.parse(jsonData);
} catch (err) {
  console.error('❌ Invalid JSON data:', err.message);
  process.exit(1);
}

// Add to enhanced data
enhancedData[slug] = surgeonData;

// Save
fs.writeFileSync(ENHANCED_DATA_FILE, JSON.stringify(enhancedData, null, 2));

console.log(`✅ Added enhanced data for: ${slug}`);
console.log(`📊 Total enhanced: ${Object.keys(enhancedData).length}`);
