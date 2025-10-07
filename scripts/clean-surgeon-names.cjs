const fs = require('fs');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

const INPUT_CSV = 'surgeons-with-bios.csv';
const OUTPUT_CSV = 'surgeons-with-bios-cleaned-names.csv';

function cleanSurgeonName(name) {
  if (!name || name.trim() === '') return '';
  
  // Remove everything after " - " (hyphen with spaces)
  let cleaned = name.split(' - ')[0].trim();
  
  // Remove everything after " | " (pipe with spaces)
  cleaned = cleaned.split(' | ')[0].trim();
  
  // Remove common suffixes in parentheses
  cleaned = cleaned.replace(/\s*\([^)]*\)/g, '').trim();
  
  return cleaned;
}

async function cleanNames() {
  const surgeons = [];
  
  // Read CSV
  fs.createReadStream(INPUT_CSV)
    .pipe(csv())
    .on('data', (row) => {
      // Clean the surgeon_name field
      if (row.surgeon_name) {
        const originalName = row.surgeon_name;
        const cleanedName = cleanSurgeonName(originalName);
        
        if (originalName !== cleanedName) {
          console.log(`✂️  Cleaned: "${originalName}" → "${cleanedName}"`);
        }
        
        row.surgeon_name = cleanedName;
        row.business_name = cleanedName; // Also update business_name
      }
      
      surgeons.push(row);
    })
    .on('end', async () => {
      // Write cleaned CSV
      const headers = Object.keys(surgeons[0]).map(key => ({ id: key, title: key }));
      
      const csvWriter = createObjectCsvWriter({
        path: OUTPUT_CSV,
        header: headers
      });
      
      await csvWriter.writeRecords(surgeons);
      console.log(`\n✅ Cleaned ${surgeons.length} surgeon names`);
      console.log(`📁 Output: ${OUTPUT_CSV}`);
      console.log('\nNext steps:');
      console.log('1. Review the cleaned names');
      console.log('2. mv surgeons-with-bios-cleaned-names.csv surgeons-with-bios.csv');
      console.log('3. node scripts/generate-all-profiles.cjs');
      console.log('4. npm run build && git add . && git commit && git push');
    });
}

cleanNames();
