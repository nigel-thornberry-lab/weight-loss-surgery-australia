const fs = require('fs');

/**
 * Consolidate all enhanced surgeon data into ONE authoritative file
 * 
 * Sources:
 * - surgeon-enhanced-data.json (3 fully enhanced + 67 minimal)
 * - surgeon-complete-seo-data.json (4 surgeons with good FAQs/achievements)
 */

console.log('🔄 Consolidating enhanced surgeon data...\n');

// Load all data sources
const enhancedData = fs.existsSync('surgeon-enhanced-data.json')
  ? JSON.parse(fs.readFileSync('surgeon-enhanced-data.json', 'utf-8'))
  : {};

const completeData = fs.existsSync('surgeon-complete-seo-data.json')
  ? JSON.parse(fs.readFileSync('surgeon-complete-seo-data.json', 'utf-8'))
  : {};

// Merge data - surgeon-complete-seo-data.json takes precedence for overlaps
const consolidated = { ...enhancedData };

Object.keys(completeData).forEach(slug => {
  if (consolidated[slug]) {
    // Merge, preferring surgeon-complete-seo-data
    consolidated[slug] = {
      ...consolidated[slug],
      ...completeData[slug]
    };
  } else {
    consolidated[slug] = completeData[slug];
  }
});

// Count enhancement levels
let fullyEnhanced = 0;
let partialEnhanced = 0;
let minimalEnhanced = 0;

Object.keys(consolidated).forEach(slug => {
  const data = consolidated[slug];
  
  const hasTeam = data.team && (data.team.has_dietitian || data.team.has_psychologist);
  const hasServices = data.services && data.services.procedures;
  const hasHospitals = data.hospitals && data.hospitals.length > 0;
  const hasUniqueFeatures = data.unique_features && data.unique_features.length > 0;
  const hasFAQs = data.faqs && data.faqs.length > 0;
  const hasAchievements = data.achievements && data.achievements.length > 0;
  
  if ((hasTeam || hasServices || hasUniqueFeatures) && (hasFAQs || hasAchievements)) {
    fullyEnhanced++;
    data._enhancement_level = 'full';
  } else if (hasTeam || hasServices || hasUniqueFeatures || hasFAQs || hasAchievements) {
    partialEnhanced++;
    data._enhancement_level = 'partial';
  } else {
    minimalEnhanced++;
    data._enhancement_level = 'minimal';
  }
});

// Save consolidated data
fs.writeFileSync(
  'surgeon-enhanced-data-consolidated.json',
  JSON.stringify(consolidated, null, 2)
);

console.log('✅ Consolidation complete!\n');
console.log('📊 Enhancement Summary:');
console.log(`   ✅ Fully Enhanced:      ${fullyEnhanced} surgeons`);
console.log(`   ⚠️  Partially Enhanced: ${partialEnhanced} surgeons`);
console.log(`   ❌ Minimal Enhancement: ${minimalEnhanced} surgeons`);
console.log(`   📄 Total:               ${Object.keys(consolidated).length} surgeons\n`);

// Show which surgeons are fully enhanced
console.log('✅ FULLY ENHANCED SURGEONS:');
Object.keys(consolidated)
  .filter(slug => consolidated[slug]._enhancement_level === 'full')
  .forEach(slug => {
    const data = consolidated[slug];
    console.log(`   - ${slug}`);
    if (data.team) console.log(`     ✓ Team info`);
    if (data.services) console.log(`     ✓ Services`);
    if (data.hospitals) console.log(`     ✓ Hospitals (${data.hospitals.length})`);
    if (data.unique_features) console.log(`     ✓ Unique features (${data.unique_features.length})`);
    if (data.faqs) console.log(`     ✓ FAQs (${data.faqs.length})`);
    if (data.achievements) console.log(`     ✓ Achievements (${data.achievements.length})`);
  });

console.log('\n💾 Saved to: surgeon-enhanced-data-consolidated.json');
console.log('\n🚀 Next step: Update surgeon data access layer to use this consolidated data');

