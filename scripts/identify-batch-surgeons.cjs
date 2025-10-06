const fs = require('fs');

const INPUT_CSV = 'surgeons-with-bios.csv';

const already_enhanced = [
  'dr-devesh-kaushal-gregory-hills',
  'dr-jason-maani-kogarah',
  'dr-jason-maani-bariatric-surgery-liverpool',
  'dr-mani-niazi-wantirna'
];

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

const content = fs.readFileSync(INPUT_CSV, 'utf-8');
const lines = content.split('\n').filter(l => l.trim());

const headers = parseCSVLine(lines[0]);
const surgeons = [];

for (let i = 1; i < lines.length; i++) {
  const values = parseCSVLine(lines[i]);
  if (values.length < headers.length) continue;
  
  const surgeon = {};
  headers.forEach((header, index) => {
    surgeon[header] = values[index] || '';
  });
  
  const name = surgeon['surgeon_name'] || '';
  const city = surgeon['city'] || '';
  const state = surgeon['state'] || '';
  const rating = parseFloat(surgeon['rating']) || 0;
  const reviews = parseInt(surgeon['review_count']) || 0;
  const slug = surgeon['slug'] || '';
  const website = surgeon['website'] || '';
  
  if (name && city && slug && !already_enhanced.includes(slug) && rating > 0 && reviews > 0) {
    surgeons.push({
      name,
      city,
      state,
      rating,
      reviews,
      slug,
      website,
      score: rating * 10 + (reviews / 10)
    });
  }
}

surgeons.sort((a, b) => b.score - a.score);

console.log('🎯 BATCH 1: TOP 7 SURGEONS TO ENHANCE\n');
console.log('═'.repeat(80));

surgeons.slice(0, 7).forEach((s, i) => {
  console.log(`\n${i+1}. ${s.name}`);
  console.log(`   📍 Location: ${s.city}, ${s.state}`);
  console.log(`   ⭐ Rating: ${s.rating}/5 (${s.reviews} reviews)`);
  console.log(`   📊 Priority Score: ${s.score.toFixed(1)}`);
  console.log(`   🌐 Website: ${s.website}`);
  console.log(`   🔗 Slug: ${s.slug}`);
});

console.log('\n' + '═'.repeat(80));
console.log(`\n✅ Total surgeons eligible: ${surgeons.length}`);
console.log(`📋 Batches needed (7 per batch): ${Math.ceil(surgeons.length / 7)}`);

// Save for later use
fs.writeFileSync('batch-1-surgeons.json', JSON.stringify(surgeons.slice(0, 7), null, 2));
console.log('\n💾 Saved to: batch-1-surgeons.json');

