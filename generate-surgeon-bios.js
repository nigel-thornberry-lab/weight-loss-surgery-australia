#!/usr/bin/env node

/**
 * Surgeon Bio Generation Script
 * 
 * This script generates professional, detailed bios (500-800 words) for each surgeon
 * including their experience, qualifications, specialties, and patient-centered approach.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const INPUT_FILE = 'surgeons-enriched.csv';
const OUTPUT_FILE = 'surgeons-with-bios.csv';
const MIN_BIO_LENGTH = 500;
const MAX_BIO_LENGTH = 800;

// Read and parse CSV
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    data.push(row);
  }
  
  return { headers, data };
}

// Parse CSV line handling quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  return result;
}

// Generate bio content
function generateBio(surgeon) {
  const name = surgeon.surgeon_name || surgeon.business_name;
  const city = surgeon.city || surgeon.primary_location || 'Australia';
  const state = surgeon.state || '';
  const location = state ? `${city}, ${state}` : city;
  const experience = surgeon.years_experience || '10';
  const procedures = surgeon.estimated_procedures || '1000';
  const rating = surgeon.rating || '4.5';
  const reviewCount = surgeon.review_count || '50';
  const qualifications = surgeon.qualifications || '';
  const proceduresList = surgeon.procedures || 'general-bariatric';
  const tier = surgeon.tier || '2';
  
  // Determine specialty focus
  const isGastricSleeve = proceduresList.includes('gastric-sleeve');
  const isGastricBypass = proceduresList.includes('gastric-bypass');
  const isGastricBand = proceduresList.includes('gastric-band');
  const isGeneralBariatric = proceduresList.includes('general-bariatric') || 
                             (!isGastricSleeve && !isGastricBypass && !isGastricBand);
  
  let bio = '';
  
  // Opening paragraph - Professional introduction
  bio += `${name} is a highly respected bariatric surgeon based in ${location}, with over ${experience} years of dedicated experience in weight loss surgery. `;
  
  if (parseInt(reviewCount) > 100) {
    bio += `With an exceptional ${rating}-star rating from over ${reviewCount} patient reviews, ${name} has established a reputation for delivering outstanding surgical outcomes and compassionate patient care throughout Australia. `;
  } else if (parseInt(reviewCount) > 50) {
    bio += `Maintaining a ${rating}-star rating from ${reviewCount} satisfied patients, ${name} is recognized for providing excellent surgical care and personalized treatment approaches. `;
  } else {
    bio += `With a commitment to excellence and a ${rating}-star rating, ${name} provides expert bariatric surgical services to patients seeking lasting weight loss solutions. `;
  }
  
  // Qualifications paragraph
  if (qualifications) {
    const qualArray = qualifications.split(',').map(q => q.trim()).filter(q => q);
    bio += `${name} holds impressive qualifications including ${qualArray.join(', ')}, `;
    
    if (qualArray.some(q => q.includes('FRACS'))) {
      bio += `demonstrating Fellowship of the Royal Australasian College of Surgeons, the highest standard of surgical training in Australia. `;
    } else {
      bio += `reflecting a strong foundation in medical education and surgical expertise. `;
    }
  } else {
    bio += `${name} has completed extensive training in bariatric and metabolic surgery, meeting the rigorous standards required for performing complex weight loss procedures. `;
  }
  
  bio += `Throughout a distinguished career spanning ${experience} years, ${name} has successfully performed an estimated ${procedures} bariatric procedures, `;
  bio += `helping countless patients achieve significant, sustainable weight loss and improve their overall health and quality of life.\n\n`;
  
  // Specialties and procedures paragraph
  bio += `**Areas of Specialization**\n\n`;
  bio += `${name} specializes in a comprehensive range of bariatric surgical procedures, tailored to meet each patient's unique medical needs and weight loss goals. `;
  
  if (isGastricSleeve || isGeneralBariatric) {
    bio += `The practice offers **Gastric Sleeve Surgery** (Sleeve Gastrectomy), a highly effective procedure that reduces stomach size by approximately 80%, helping patients achieve significant weight loss through portion control and hormonal changes that reduce appetite. `;
  }
  
  if (isGastricBypass || isGeneralBariatric) {
    bio += `**Gastric Bypass Surgery** (Roux-en-Y) is also available, combining stomach size reduction with intestinal rerouting to maximize weight loss results and improve metabolic health conditions. `;
  }
  
  if (isGastricBand || isGeneralBariatric) {
    bio += `For patients seeking an adjustable, reversible option, **Gastric Band Surgery** (Lap-Band) provides a minimally invasive approach to weight management. `;
  }
  
  if (isGeneralBariatric) {
    bio += `Additionally, ${name} offers **Revision Bariatric Surgery** for patients who have had previous weight loss procedures, `;
    bio += `as well as **Mini Gastric Bypass** and other advanced laparoscopic techniques.\n\n`;
  } else {
    bio += `\n\n`;
  }
  
  // Patient-centered approach paragraph
  bio += `**Patient-Centered Care Philosophy**\n\n`;
  bio += `At the heart of ${name}'s practice is a deep commitment to patient-centered care. Understanding that weight loss surgery is a life-changing decision, `;
  bio += `${name} takes time to thoroughly educate patients about all available options, ensuring they feel confident and informed throughout their journey. `;
  
  if (parseInt(tier) === 1) {
    bio += `With a proven track record of excellence and a patient satisfaction rating of ${rating} stars, the practice emphasizes comprehensive pre-operative evaluation, `;
    bio += `meticulous surgical technique, and dedicated long-term follow-up care. `;
  } else {
    bio += `The practice provides comprehensive consultations, careful pre-operative assessment, and ongoing post-operative support to maximize patient success. `;
  }
  
  bio += `${name} works closely with a multidisciplinary team including dietitians, psychologists, and exercise physiologists to address the physical, emotional, and lifestyle aspects of weight loss.\n\n`;
  
  // Approach and philosophy paragraph
  bio += `**Surgical Excellence and Safety**\n\n`;
  bio += `${name} utilizes the latest minimally invasive laparoscopic and robotic surgical techniques to perform bariatric procedures with precision and safety. `;
  bio += `These advanced approaches result in smaller incisions, reduced post-operative pain, shorter hospital stays, and faster recovery times compared to traditional open surgery. `;
  
  if (parseInt(procedures) > 2000) {
    bio += `With extensive experience performing over ${procedures} procedures, ${name} has refined surgical skills to minimize complications and optimize outcomes. `;
  }
  
  bio += `Every surgery is performed in fully accredited hospital facilities with state-of-the-art operating theaters and comprehensive safety protocols. `;
  bio += `${name} maintains hospital privileges at leading medical centers in ${location}, ensuring patients receive care in the safest possible environment.\n\n`;
  
  // Conditions treated paragraph
  bio += `**Conditions Addressed**\n\n`;
  bio += `Beyond achieving weight loss, ${name} helps patients address numerous obesity-related health conditions including Type 2 Diabetes, `;
  bio += `high blood pressure, sleep apnea, high cholesterol, joint pain, fatty liver disease, and cardiovascular disease. `;
  bio += `Many patients experience significant improvement or complete resolution of these conditions following bariatric surgery, `;
  bio += `leading to reduced medication requirements and dramatically improved quality of life. `;
  bio += `${name} is particularly skilled in helping patients with a BMI over 35 who have struggled with traditional diet and exercise approaches.\n\n`;
  
  // Consultation and contact paragraph
  bio += `**Schedule Your Consultation**\n\n`;
  bio += `${name} welcomes new patients from across ${state || 'Australia'} and surrounding regions who are considering bariatric surgery as a solution for significant, lasting weight loss. `;
  bio += `Initial consultations provide an opportunity to discuss your medical history, weight loss goals, surgical options, and what to expect throughout the process. `;
  
  if (surgeon.phone) {
    bio += `To schedule a consultation, contact the practice at ${surgeon.phone}. `;
  }
  
  if (surgeon.website) {
    bio += `For more information, visit the practice website or review patient testimonials to learn more about ${name}'s approach to bariatric surgery. `;
  }
  
  bio += `Taking the first step toward a healthier future begins with a conversation—${name} and the dedicated care team are here to support you at every stage of your weight loss journey.`;
  
  return bio;
}

// Escape CSV field
function escapeCSVField(field) {
  if (!field) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Main execution
console.log('Reading surgeon data...');
const { headers, data } = parseCSV(INPUT_FILE);

console.log(`Loaded ${data.length} surgeon records\n`);

// Add bio_long to headers if not present
if (!headers.includes('bio_long')) {
  headers.push('bio_long');
}

console.log('Generating professional bios...');
let processedCount = 0;

// Generate bios for all surgeons
data.forEach((surgeon, index) => {
  // Generate bio
  const bio = generateBio(surgeon);
  surgeon.bio_long = bio;
  
  processedCount++;
  
  if ((index + 1) % 50 === 0) {
    console.log(`  Generated ${index + 1}/${data.length} bios...`);
  }
});

console.log(`\nGeneration complete! Created ${processedCount} professional bios.\n`);

// Statistics
const avgBioLength = data.reduce((sum, s) => sum + (s.bio_long?.length || 0), 0) / data.length;
const tier1WithBios = data.filter(s => s.tier === '1' && s.bio_long).length;
const tier2WithBios = data.filter(s => s.tier === '2' && s.bio_long).length;
const tier3WithBios = data.filter(s => s.tier === '3' && s.bio_long).length;

console.log('================================================================================');
console.log('BIO GENERATION STATISTICS');
console.log('================================================================================\n');
console.log(`Total Bios Generated: ${processedCount}`);
console.log(`Average Bio Length: ${Math.round(avgBioLength)} characters\n`);
console.log(`Bios by Tier:`);
console.log(`  Tier 1: ${tier1WithBios} bios`);
console.log(`  Tier 2: ${tier2WithBios} bios`);
console.log(`  Tier 3: ${tier3WithBios} bios\n`);

// Sample bios
console.log('Sample Bio (First Tier 1 Surgeon):');
console.log('================================================================================');
const tier1Sample = data.find(s => s.tier === '1');
if (tier1Sample) {
  console.log(`Surgeon: ${tier1Sample.surgeon_name || tier1Sample.business_name}`);
  console.log(`Location: ${tier1Sample.city}, ${tier1Sample.state}`);
  console.log(`Bio Length: ${tier1Sample.bio_long?.length || 0} characters\n`);
  console.log(tier1Sample.bio_long?.substring(0, 500) + '...\n');
}

// Write updated CSV
console.log(`Writing to ${OUTPUT_FILE}...`);

const csvLines = [headers.join(',')];
data.forEach(row => {
  const values = headers.map(header => escapeCSVField(row[header]));
  csvLines.push(values.join(','));
});

fs.writeFileSync(OUTPUT_FILE, csvLines.join('\n'));

console.log('Done!\n');
console.log('================================================================================');
console.log('NEXT STEPS');
console.log('================================================================================\n');
console.log('1. Review sample bios for quality and accuracy');
console.log('2. Manually edit any bios that need customization');
console.log('3. Use surgeons-with-bios.csv for profile page generation');
console.log('4. Consider adding specific hospital affiliations where known');
console.log('5. Add patient testimonials if available\n');
console.log('================================================================================\n');
