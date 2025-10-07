const fs = require('fs');

/**
 * Filter surgeons list to only include TRUE bariatric surgery specialists
 * Remove GPs, cosmetic doctors, hepatobiliary/colorectal/breast surgeons
 */

const INPUT_CSV = 'surgeons-with-bios.csv';
const OUTPUT_CSV = 'surgeons-with-bios-filtered.csv';
const REMOVED_CSV = 'surgeons-removed-non-bariatric.csv';

// Surgeons to REMOVE (not bariatric specialists)
const NON_BARIATRIC_NAMES = [
  'Dr Jan Parker',              // GP weight loss clinician
  'Dr. Ina Takkar',             // GP weight loss clinician
  'Dr Ina Takkar',              // GP weight loss clinician
  'A/Prof Carlo Pulitano',      // Hepatobiliary (some bariatric but primarily HPB)
  'Dr James Gallagher',         // Hepatobiliary/Upper GI (not bariatric focus)
  'Dr LP Cheah',                // General surgeon (hernias, endoscopy)
  'Dr Michael Yunaev',          // Breast surgery specialist
  'Dr Stuart Pincott',          // Colorectal surgeon
  'Dr Suhirdan Vivekanandarajah', // Gastroenterologist
  'Dr Nicole Winter',           // Upper GI (minimal bariatric)
  'Dr. Chris Nahm',             // Hepatobiliary/pancreatic surgeon
  'Dr Chris Nahm',              // Hepatobiliary/pancreatic surgeon
  'Prof. Charbel Sandroussi',   // Hepatobiliary surgeon
  'Professor Charbel Sandroussi', // Hepatobiliary surgeon
  'Dr Saras & Co',              // Cosmetic medicine clinic
  'Dr. Umed Cosmetics',         // Cosmetic doctor
  'Dr Umed Cosmetics',          // Cosmetic doctor
];

// Read CSV
const csvContent = fs.readFileSync(INPUT_CSV, 'utf-8');
const lines = csvContent.split('\n');
const header = lines[0];

// Filter surgeons
const bariatricSurgeons = [header];
const removedSurgeons = [header];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  // Extract surgeon name (2nd column)
  const match = line.match(/^[^,]*,([^,]+),/);
  if (!match) continue;
  
  const surgeonName = match[1].trim();
  
  // Check if surgeon is in removal list
  const shouldRemove = NON_BARIATRIC_NAMES.some(name => 
    surgeonName.toLowerCase().includes(name.toLowerCase()) ||
    name.toLowerCase().includes(surgeonName.toLowerCase())
  );
  
  if (shouldRemove) {
    removedSurgeons.push(line);
    console.log(`❌ REMOVED: ${surgeonName} (not bariatric specialist)`);
  } else {
    bariatricSurgeons.push(line);
  }
}

// Write filtered CSV
fs.writeFileSync(OUTPUT_CSV, bariatricSurgeons.join('\n'), 'utf-8');
fs.writeFileSync(REMOVED_CSV, removedSurgeons.join('\n'), 'utf-8');

console.log(`\n✅ Filtered surgeons:`);
console.log(`   Original: ${lines.length - 1} surgeons`);
console.log(`   Removed: ${removedSurgeons.length - 1} non-bariatric specialists`);
console.log(`   Bariatric: ${bariatricSurgeons.length - 1} true bariatric surgeons`);
console.log(`\n📄 Files created:`);
console.log(`   ${OUTPUT_CSV} - filtered bariatric surgeons only`);
console.log(`   ${REMOVED_CSV} - removed non-bariatric specialists`);
