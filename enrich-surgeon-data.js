#!/usr/bin/env node

/**
 * Surgeon Data Enrichment Script
 * 
 * This script reads the cleaned surgeon CSV and enriches it with:
 * - Years of experience estimates
 * - Estimated procedures performed
 * - SEO-friendly slugs
 * - Meta titles and descriptions
 * - Priority scores and tier classifications
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and parse CSV
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      data.push(row);
    }
  }
  
  return data;
}

// Parse CSV line handling quoted fields
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"' && nextChar === '"') {
      current += '"';
      i++; // Skip next quote
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim());
  return values;
}

// Estimate years of experience based on qualifications
function estimateYearsOfExperience(qualifications, reviewCount) {
  if (!qualifications || qualifications === 'NaN') {
    // Estimate based on review count
    if (reviewCount > 100) return 15;
    if (reviewCount > 50) return 10;
    if (reviewCount > 20) return 7;
    return 5;
  }
  
  const quals = qualifications.toLowerCase();
  
  // Senior positions indicate more experience
  if (quals.includes('professor') || quals.includes('a/prof')) {
    return 20;
  }
  
  // Fellowship (FRACS) typically means 10+ years
  if (quals.includes('fracs') || quals.includes('facs')) {
    return 15;
  }
  
  // PhD/MD indicates research experience
  if (quals.includes('phd') || quals.includes('md')) {
    return 12;
  }
  
  // Basic medical degree
  if (quals.includes('mbbs')) {
    return 8;
  }
  
  // Dr/Mr title with good reviews
  if (quals.includes('dr') || quals.includes('mr')) {
    if (reviewCount > 50) return 12;
    if (reviewCount > 20) return 8;
    return 5;
  }
  
  // Default
  return 7;
}

// Calculate estimated procedures performed
function estimateProcedures(yearsExperience, reviewCount) {
  const proceduresPerYear = 150;
  
  // Adjust based on review count (higher reviews = more active practice)
  let multiplier = 1.0;
  if (reviewCount > 100) multiplier = 1.5;
  else if (reviewCount > 50) multiplier = 1.2;
  else if (reviewCount < 10) multiplier = 0.7;
  
  return Math.round(yearsExperience * proceduresPerYear * multiplier);
}

// Generate SEO-friendly slug
function generateSlug(surgeonName, city) {
  // Use surgeon name if available, otherwise business name
  let name = surgeonName || '';
  
  // Remove special characters and extra spaces
  let slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  // Add city if available
  if (city && city !== 'NaN') {
    const citySlug = city
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    slug = `${slug}-${citySlug}`;
  }
  
  return slug || 'surgeon';
}

// Generate meta title
function generateMetaTitle(surgeonName, businessName, city, state) {
  const name = surgeonName || businessName;
  const location = city && city !== 'NaN' ? city : (state && state !== 'NaN' ? state : '');
  
  if (location) {
    return `${name} - Bariatric Surgeon ${location} | Gastric Sleeve & Bypass`;
  }
  
  return `${name} - Bariatric Surgeon | Gastric Sleeve & Bypass`;
}

// Generate meta description
function generateMetaDescription(surgeonName, businessName, city, state, rating, yearsExperience) {
  const name = surgeonName || businessName;
  const location = city && city !== 'NaN' ? city : (state && state !== 'NaN' ? state : 'Australia');
  
  const ratingText = rating && rating !== 'NaN' ? ` Rating: ${parseFloat(rating).toFixed(1)} stars.` : '';
  
  return `${name} is an experienced bariatric surgeon in ${location} with ${yearsExperience}+ years experience.${ratingText} Book your consultation for gastric sleeve, bypass, or band surgery.`;
}

// Calculate priority score
function calculatePriorityScore(rating, reviewCount, yearsExperience) {
  const r = parseFloat(rating) || 4.0;
  const rc = parseInt(reviewCount) || 1;
  const ye = yearsExperience || 5;
  
  return (r * rc * ye) / 10;
}

// Determine tier based on priority score
function determineTier(priorityScore, reviewCount, rating) {
  const rc = parseInt(reviewCount) || 0;
  const r = parseFloat(rating) || 0;
  
  // Tier 1: High priority (score > 300 OR 50+ reviews with 4.5+ rating)
  if (priorityScore > 300 || (rc >= 50 && r >= 4.5)) {
    return 1;
  }
  
  // Tier 2: Medium priority (score > 100 OR 20+ reviews with 4.0+ rating)
  if (priorityScore > 100 || (rc >= 20 && r >= 4.0)) {
    return 2;
  }
  
  // Tier 3: Lower priority
  return 3;
}

// Format location for display
function formatLocation(city, state) {
  if (city && city !== 'NaN' && state && state !== 'NaN') {
    return `${city}, ${state}`;
  }
  if (city && city !== 'NaN') return city;
  if (state && state !== 'NaN') return state;
  return '';
}

// Main enrichment function
function enrichSurgeonData(inputFile, outputFile) {
  console.log('Reading surgeon data...');
  const surgeons = parseCSV(inputFile);
  console.log(`Loaded ${surgeons.length} surgeon records`);
  
  console.log('\nEnriching data...');
  const enriched = surgeons.map((surgeon, index) => {
    const reviewCount = parseInt(surgeon.review_count) || 0;
    const rating = parseFloat(surgeon.rating) || 0;
    
    // Calculate experience
    const yearsExperience = estimateYearsOfExperience(surgeon.qualifications, reviewCount);
    const estimatedProcedures = estimateProcedures(yearsExperience, reviewCount);
    
    // Generate SEO fields
    const slug = generateSlug(surgeon.surgeon_name, surgeon.city);
    const metaTitle = generateMetaTitle(
      surgeon.surgeon_name,
      surgeon.business_name,
      surgeon.city,
      surgeon.state
    );
    const metaDescription = generateMetaDescription(
      surgeon.surgeon_name,
      surgeon.business_name,
      surgeon.city,
      surgeon.state,
      rating,
      yearsExperience
    );
    
    // Calculate priority and tier
    const priorityScore = calculatePriorityScore(rating, reviewCount, yearsExperience);
    const tier = determineTier(priorityScore, reviewCount, rating);
    
    // Format location
    const location = formatLocation(surgeon.city, surgeon.state);
    
    if ((index + 1) % 50 === 0) {
      console.log(`  Processed ${index + 1}/${surgeons.length} records...`);
    }
    
    return {
      ...surgeon,
      years_experience: yearsExperience,
      estimated_procedures: estimatedProcedures,
      slug: slug,
      meta_title: metaTitle,
      meta_description: metaDescription,
      priority_score: priorityScore.toFixed(2),
      tier: tier,
      location_display: location
    };
  });
  
  console.log(`\nEnrichment complete!`);
  
  // Sort by priority score (highest first)
  enriched.sort((a, b) => parseFloat(b.priority_score) - parseFloat(a.priority_score));
  
  // Write to CSV
  console.log(`\nWriting to ${outputFile}...`);
  const headers = Object.keys(enriched[0]);
  const csvContent = [
    headers.join(','),
    ...enriched.map(row => 
      headers.map(header => {
        const value = row[header] || '';
        // Escape quotes and wrap in quotes if contains comma
        if (value.toString().includes(',') || value.toString().includes('"') || value.toString().includes('\n')) {
          return `"${value.toString().replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  fs.writeFileSync(outputFile, csvContent);
  console.log('Done!');
  
  // Print statistics
  console.log('\n' + '='.repeat(80));
  console.log('ENRICHMENT STATISTICS');
  console.log('='.repeat(80));
  
  const tier1 = enriched.filter(s => s.tier === 1);
  const tier2 = enriched.filter(s => s.tier === 2);
  const tier3 = enriched.filter(s => s.tier === 3);
  
  console.log(`\nTier Distribution:`);
  console.log(`  Tier 1 (High Priority): ${tier1.length} surgeons`);
  console.log(`  Tier 2 (Medium Priority): ${tier2.length} surgeons`);
  console.log(`  Tier 3 (Lower Priority): ${tier3.length} surgeons`);
  
  console.log(`\nTop 10 Surgeons by Priority Score:`);
  enriched.slice(0, 10).forEach((s, i) => {
    console.log(`  ${i + 1}. ${s.surgeon_name || s.business_name} (${s.location_display}) - Score: ${s.priority_score}, Tier ${s.tier}`);
  });
  
  const avgExperience = enriched.reduce((sum, s) => sum + s.years_experience, 0) / enriched.length;
  const avgProcedures = enriched.reduce((sum, s) => sum + s.estimated_procedures, 0) / enriched.length;
  
  console.log(`\nAverage Experience: ${avgExperience.toFixed(1)} years`);
  console.log(`Average Estimated Procedures: ${Math.round(avgProcedures)}`);
  
  // Show Sydney vs Melbourne stats
  const sydney = enriched.filter(s => s.primary_location === 'Sydney');
  const melbourne = enriched.filter(s => s.primary_location === 'Melbourne');
  
  console.log(`\nLocation Statistics:`);
  console.log(`  Sydney: ${sydney.length} surgeons (Avg Tier: ${(sydney.reduce((sum, s) => sum + s.tier, 0) / sydney.length).toFixed(1)})`);
  console.log(`  Melbourne: ${melbourne.length} surgeons (Avg Tier: ${(melbourne.reduce((sum, s) => sum + s.tier, 0) / melbourne.length).toFixed(1)})`);
  
  console.log('\n' + '='.repeat(80));
}

// Run the script
const inputFile = path.join(__dirname, 'surgeons-cleaned.csv');
const outputFile = path.join(__dirname, 'surgeons-enriched.csv');

if (!fs.existsSync(inputFile)) {
  console.error(`Error: Input file not found: ${inputFile}`);
  process.exit(1);
}

enrichSurgeonData(inputFile, outputFile);
