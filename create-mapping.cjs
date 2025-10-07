const fs = require('fs');

// Read the CSV
const content = fs.readFileSync('surgeons-with-bios.csv', 'utf-8');
const lines = content.split('\n');

// Extract Place IDs and create mapping
const mapping = {};

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  
  // Find Place ID
  const placeIdMatch = line.match(/(ChIJ[A-Za-z0-9_-]+)/);
  if (!placeIdMatch) continue;
  
  const placeId = placeIdMatch[1];
  
  // Find slug pattern (lowercase with hyphens, looks like a URL slug)
  const slugMatches = line.match(/([a-z][a-z0-9-]{10,})/g);
  if (!slugMatches) continue;
  
  // The longest match is usually the slug
  const slug = slugMatches.sort((a, b) => b.length - a.length)[0];
  
  // Find name (starts with Dr, Mr, Ms, Prof, A/Prof)
  const nameMatch = line.match(/((?:Dr|Mr|Ms|Prof|A\/Prof)[^,]{3,50})/);
  if (!nameMatch) continue;
  
  const name = nameMatch[1].replace(/"/g, '').trim();
  
  mapping[placeId] = { slug, name };
}

console.log(`Found ${Object.keys(mapping).length} mappings`);
fs.writeFileSync('place-id-mapping.json', JSON.stringify(mapping, null, 2));
console.log('Saved to place-id-mapping.json');

// Show first 5
Object.entries(mapping).slice(0, 5).forEach(([pid, data]) => {
  console.log(`  ${data.name} -> ${data.slug}`);
});
