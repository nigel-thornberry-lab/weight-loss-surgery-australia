#!/usr/bin/env node
/**
 * Update Existing Surgeon Profiles with Enhanced Data
 * This script properly merges enhanced data into existing profiles
 * WITHOUT overwriting Google Maps, Reviews, FAQs, and other components
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Load enhanced data
const enhancedData = JSON.parse(fs.readFileSync('surgeon-enhanced-data-consolidated.json', 'utf-8'));
console.log(`📊 Loaded ${Object.keys(enhancedData).length} enhanced profiles\n`);

// Find all surgeon profile files
const profileFiles = glob.sync('src/pages/surgeons/**/*.astro', {
  ignore: ['**/index.astro']
});

console.log(`🔍 Found ${profileFiles.length} surgeon profile files\n`);

let updatedCount = 0;
let skippedCount = 0;

for (const filePath of profileFiles) {
  // Extract slug from file path
  const fileName = path.basename(filePath, '.astro');
  const slug = fileName;
  
  // Check if we have enhanced data for this slug
  if (!enhancedData[slug]) {
    console.log(`⏭️  Skipping ${fileName} - no enhanced data`);
    skippedCount++;
    continue;
  }
  
  const enhanced = enhancedData[slug];
  
  // Skip if only minimal enhancement (just website)
  const hasSubstantialData = (
    (enhanced.team && (enhanced.team.has_dietitian || enhanced.team.has_psychologist)) ||
    (enhanced.services && enhanced.services.procedures && enhanced.services.procedures.length > 0) ||
    (enhanced.hospitals && enhanced.hospitals.length > 0) ||
    (enhanced.credentials && enhanced.credentials.years_practicing > 5) ||
    (enhanced.unique_features && enhanced.unique_features.length > 0)
  );
  
  if (!hasSubstantialData) {
    console.log(`⏭️  Skipping ${fileName} - minimal enhancement only`);
    skippedCount++;
    continue;
  }
  
  // Read the existing profile
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Find the enhanced object in the file
  const enhancedRegex = /const enhanced = \{[\s\S]*?\n\};/;
  const seoRegex = /const seo = \{[\s\S]*?\n\};/;
  
  if (!enhancedRegex.test(content)) {
    console.log(`⚠️  Warning: ${fileName} has no enhanced object`);
    skippedCount++;
    continue;
  }
  
  // Build the new enhanced object
  const newEnhancedObj = `const enhanced = ${JSON.stringify(enhanced, null, 2)};`;
  
  // Replace the enhanced object
  content = content.replace(enhancedRegex, newEnhancedObj);
  
  // Update SEO FAQs if they exist in enhanced data
  if (enhanced.faqs && enhanced.faqs.length > 0 && seoRegex.test(content)) {
    // Extract existing seo object
    const seoMatch = content.match(seoRegex);
    if (seoMatch) {
      const seoContent = seoMatch[0];
      
      // Try to parse the seo object
      try {
        const seoStr = seoContent.replace(/^const seo = /, '').replace(/;$/, '');
        const seoObj = eval(`(${seoStr})`);
        
        // Update FAQs
        seoObj.faqs = enhanced.faqs;
        
        // Rebuild seo object
        const newSeoObj = `const seo = ${JSON.stringify(seoObj, null, 2)};`;
        content = content.replace(seoRegex, newSeoObj);
      } catch (e) {
        console.log(`⚠️  Could not parse SEO object for ${fileName}`);
      }
    }
  }
  
  // Write the updated file
  fs.writeFileSync(filePath, content);
  console.log(`✅ Updated: ${fileName}`);
  updatedCount++;
}

console.log(`\n${'='.repeat(60)}`);
console.log(`📊 Summary:`);
console.log(`   ✅ Updated: ${updatedCount} profiles`);
console.log(`   ⏭️  Skipped: ${skippedCount} profiles`);
console.log(`${'='.repeat(60)}\n`);

if (updatedCount > 0) {
  console.log(`🎉 Successfully updated ${updatedCount} surgeon profiles!`);
  console.log(`   All profiles now have enhanced data PLUS:`);
  console.log(`   • Google Maps`);
  console.log(`   • Patient Reviews`);
  console.log(`   • FAQ sections`);
  console.log(`   • Enhanced credentials, team, services, hospitals`);
}

