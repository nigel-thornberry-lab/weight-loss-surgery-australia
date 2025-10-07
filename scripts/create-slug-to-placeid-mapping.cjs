const fs = require('fs');

/**
 * Create slug-to-placeId mapping from place-id-mapping.json
 */

const placeIdMapping = JSON.parse(fs.readFileSync('place-id-mapping.json', 'utf-8'));

// Create reverse mapping: slug -> placeId
const slugToPlaceId = {};

Object.entries(placeIdMapping).forEach(([placeId, data]) => {
  if (data.slug) {
    slugToPlaceId[data.slug] = placeId;
  }
});

// Save to data directory
fs.writeFileSync('src/data/slug-to-placeid.json', JSON.stringify(slugToPlaceId, null, 2));

console.log(`✅ Created slug-to-placeId mapping with ${Object.keys(slugToPlaceId).length} entries`);

