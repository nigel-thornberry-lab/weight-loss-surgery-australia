/**
 * Batch Surgeon Research Script
 * Processes all surgeons and stores enhanced data
 */

const fs = require('fs');

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

function extractSurgeonsForResearch() {
  const content = fs.readFileSync('surgeons-with-bios.csv', 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  const headers = parseCSVLine(lines[0]);
  const surgeons = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < headers.length) continue;
    
    const surgeon = {};
    headers.forEach((header, index) => {
      surgeon[header] = values[index] || '';
    });
    
    if (surgeon.website && surgeon.website !== '') {
      surgeons.push({
        id: surgeon.slug,
        name: surgeon.surgeon_name,
        website: surgeon.website,
        city: surgeon.city,
        state: surgeon.state,
        rating: surgeon.rating,
        reviewCount: surgeon.review_count,
        priority: parseFloat(surgeon.priority_score) || 0
      });
    }
  }
  
  // Sort by priority score (highest first)
  surgeons.sort((a, b) => b.priority - a.priority);
  
  return surgeons;
}

const surgeons = extractSurgeonsForResearch();

console.log(`\n🔍 Surgeon Research Plan\n`);
console.log(`Total surgeons with websites: ${surgeons.length}`);
console.log(`\n📊 Top 20 Priority Surgeons:\n`);

surgeons.slice(0, 20).forEach((s, i) => {
  console.log(`${i + 1}. ${s.name} (${s.city}, ${s.state})`);
  console.log(`   Website: ${s.website}`);
  console.log(`   Rating: ⭐ ${s.rating} (${s.reviewCount} reviews)\n`);
});

// Save list for reference
fs.writeFileSync('surgeon-research-queue.json', JSON.stringify(surgeons, null, 2));
console.log(`\n✅ Saved research queue to surgeon-research-queue.json`);
console.log(`\n📋 Next: Use Perplexity to research each surgeon's website`);
console.log(`   Extract: Team, Services, Hospitals, Pricing, Unique Features`);

