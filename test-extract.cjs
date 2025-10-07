const fs = require('fs');
const content = fs.readFileSync('surgeons-with-bios.csv', 'utf-8');
const lines = content.split('\n');

const surgeons = [];

for (const line of lines) {
  const placeIdMatch = line.match(/ChIJ[A-Za-z0-9_-]+/);
  if (!placeIdMatch) continue;
  
  const placeId = placeIdMatch[0];
  
  // Extract slug - look for pattern
  const slugMatch = line.match(/,([a-z0-9-]+),/);
  
  // Extract name
  const nameMatch = line.match(/((?:Dr|Mr|Ms|Prof|A\/Prof)[^,]+)/);
  
  if (slugMatch && nameMatch) {
    surgeons.push({
      placeId,
      slug: slugMatch[1],
      name: nameMatch[1].replace(/"/g, '').trim()
    });
  }
}

console.log(`Found ${surgeons.length} surgeons`);
surgeons.slice(0, 5).forEach(s => console.log(`  ${s.name} -> ${s.slug} (${s.placeId})`));
