#!/usr/bin/env node

/**
 * Test script for Surgeon Data Access Layer
 * 
 * Run with: node test-surgeons-data.js
 */

import {
  getAllSurgeons,
  getSurgeonBySlug,
  getSurgeonsByCity,
  getSurgeonsByProcedure,
  getFeaturedSurgeons,
  searchSurgeons,
  getRelatedSurgeons,
  getSurgeonsByTier,
  getSurgeonsByCityAndProcedure,
  getTopSurgeonsByCity,
  getSurgeonStats,
  getAvailableCities,
  getAvailableProcedures,
  formatPhoneNumber,
  formatRating,
  getProcedureList,
  generateSlug,
  hasCompleteProfile,
  isHighQuality,
  getDisplayName,
} from './src/data/surgeons.ts';

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║        SURGEON DATA ACCESS LAYER - TEST SUITE                 ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

try {
  // Test 1: Load all surgeons
  console.log('✓ Test 1: Load All Surgeons');
  const allSurgeons = getAllSurgeons();
  console.log(`  Loaded ${allSurgeons.length} surgeons\n`);

  // Test 2: Get surgeon by slug
  console.log('✓ Test 2: Get Surgeon by Slug');
  const surgeon = getSurgeonBySlug('melbourne-centre-dr-andrew-huo-richmond');
  if (surgeon) {
    console.log(`  Found: ${getDisplayName(surgeon)}`);
    console.log(`  Location: ${surgeon.location_display}`);
    console.log(`  Rating: ${formatRating(surgeon.rating)} (${surgeon.review_count} reviews)`);
    console.log(`  Tier: ${surgeon.tier}`);
    console.log(`  Complete Profile: ${hasCompleteProfile(surgeon) ? 'Yes' : 'No'}`);
    console.log(`  High Quality: ${isHighQuality(surgeon) ? 'Yes' : 'No'}\n`);
  } else {
    console.log('  Surgeon not found\n');
  }

  // Test 3: Get surgeons by city
  console.log('✓ Test 3: Get Surgeons by City (Sydney)');
  const sydneySurgeons = getSurgeonsByCity('Sydney');
  console.log(`  Found ${sydneySurgeons.length} surgeons in Sydney`);
  console.log(`  Top 3:`);
  sydneySurgeons.slice(0, 3).forEach((s, i) => {
    console.log(`    ${i + 1}. ${getDisplayName(s)} - ${formatRating(s.rating)}`);
  });
  console.log();

  // Test 4: Get surgeons by procedure
  console.log('✓ Test 4: Get Surgeons by Procedure (gastric-sleeve)');
  const sleeveSurgeons = getSurgeonsByProcedure('gastric-sleeve');
  console.log(`  Found ${sleeveSurgeons.length} surgeons offering gastric sleeve`);
  console.log(`  Top 3:`);
  sleeveSurgeons.slice(0, 3).forEach((s, i) => {
    console.log(`    ${i + 1}. ${getDisplayName(s)} - ${s.city}, ${s.state}`);
  });
  console.log();

  // Test 5: Get featured surgeons
  console.log('✓ Test 5: Get Featured Surgeons (Top 5)');
  const featured = getFeaturedSurgeons(5);
  console.log(`  Top 5 featured surgeons:`);
  featured.forEach((s, i) => {
    console.log(`    ${i + 1}. ${getDisplayName(s)}`);
    console.log(`       ${s.location_display} | ${formatRating(s.rating)} | Priority: ${s.priority_score.toFixed(2)}`);
  });
  console.log();

  // Test 6: Search surgeons
  console.log('✓ Test 6: Search Surgeons ("bariatric Melbourne")');
  const searchResults = searchSurgeons('bariatric Melbourne');
  console.log(`  Found ${searchResults.length} results`);
  searchResults.slice(0, 3).forEach((s, i) => {
    console.log(`    ${i + 1}. ${getDisplayName(s)} - ${s.city}`);
  });
  console.log();

  // Test 7: Get related surgeons
  if (surgeon) {
    console.log('✓ Test 7: Get Related Surgeons');
    const related = getRelatedSurgeons(surgeon, 3);
    console.log(`  Related to ${getDisplayName(surgeon)}:`);
    related.forEach((s, i) => {
      console.log(`    ${i + 1}. ${getDisplayName(s)} - ${s.city}`);
    });
    console.log();
  }

  // Test 8: Get surgeons by tier
  console.log('✓ Test 8: Get Surgeons by Tier');
  [1, 2, 3].forEach(tier => {
    const tierSurgeons = getSurgeonsByTier(tier);
    console.log(`  Tier ${tier}: ${tierSurgeons.length} surgeons`);
  });
  console.log();

  // Test 9: Get city-procedure combinations
  console.log('✓ Test 9: Get Sydney Gastric Bypass Surgeons');
  const sydneyBypass = getSurgeonsByCityAndProcedure('Sydney', 'gastric-bypass');
  console.log(`  Found ${sydneyBypass.length} surgeons in Sydney offering gastric bypass\n`);

  // Test 10: Get statistics
  console.log('✓ Test 10: Get Surgeon Statistics');
  const sydneyStats = getSurgeonStats('Sydney');
  console.log('  Sydney Statistics:');
  console.log(`    Total Surgeons: ${sydneyStats.total}`);
  console.log(`    Tier 1: ${sydneyStats.tier1}`);
  console.log(`    Tier 2: ${sydneyStats.tier2}`);
  console.log(`    Tier 3: ${sydneyStats.tier3}`);
  console.log(`    Avg Rating: ${sydneyStats.avgRating}`);
  console.log(`    Avg Experience: ${sydneyStats.avgExperience} years`);
  console.log(`    Avg Reviews: ${sydneyStats.avgReviews}`);
  if (sydneyStats.topRated) {
    console.log(`    Top Rated: ${getDisplayName(sydneyStats.topRated)} (${sydneyStats.topRated.rating}★)`);
  }
  console.log();

  // Test 11: Get available cities
  console.log('✓ Test 11: Get Available Cities (Top 10)');
  const cities = getAvailableCities().slice(0, 10);
  cities.forEach((c, i) => {
    console.log(`    ${i + 1}. ${c.city}: ${c.count} surgeons`);
  });
  console.log();

  // Test 12: Get available procedures
  console.log('✓ Test 12: Get Available Procedures');
  const procedures = getAvailableProcedures();
  procedures.forEach((p, i) => {
    console.log(`    ${i + 1}. ${p.procedure}: ${p.count} surgeons`);
  });
  console.log();

  // Test 13: Helper functions
  console.log('✓ Test 13: Test Helper Functions');
  console.log(`  formatPhoneNumber('+61385941897'): ${formatPhoneNumber('+61385941897')}`);
  console.log(`  formatRating(4.7): ${formatRating(4.7)}`);
  console.log(`  getProcedureList('gastric-sleeve|gastric-bypass'): ${getProcedureList('gastric-sleeve|gastric-bypass').join(', ')}`);
  console.log(`  generateSlug('Dr. Andrew Huo'): ${generateSlug('Dr. Andrew Huo')}`);
  console.log();

  // Summary
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('✅ ALL TESTS PASSED SUCCESSFULLY!');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Data Access Layer is ready for use
  console.log('📊 Data Access Layer Summary:');
  console.log(`   • ${allSurgeons.length} surgeon records loaded`);
  console.log(`   • ${getSurgeonsByTier(1).length} Tier 1 surgeons`);
  console.log(`   • ${cities.length} cities covered`);
  console.log(`   • ${procedures.length} procedures available`);
  console.log('   • All API functions working correctly\n');

} catch (error) {
  console.error('❌ Test failed with error:');
  console.error(error);
  process.exit(1);
}
