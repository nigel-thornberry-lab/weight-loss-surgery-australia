const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

const CSV_FILE = 'surgeons-with-bios.csv';
const OPTIMIZED_DIR = 'public/surgeons/images/optimized';
const BACKUP_FILE = `surgeons-with-bios-backup-proper-${Date.now()}.csv`;

console.log('🔧  Updating CSV with Local Photo Paths\n');

// Read CSV properly
const csvContent = fs.readFileSync(CSV_FILE, 'utf-8');
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  relax_quotes: true,
  relax_column_count: true
});

console.log(`📊 Loaded ${records.length} surgeon records\n`);

// Get all optimized photos
const optimizedPhotos = fs.readdirSync(OPTIMIZED_DIR)
  .filter(f => f.endsWith('.webp'))
  .map(f => f.replace('.webp', ''));

console.log(`📸 Found ${optimizedPhotos.length} optimized photos\n`);

// Create backup
fs.writeFileSync(BACKUP_FILE, csvContent);
console.log(`💾 Backup: ${BACKUP_FILE}\n`);

let updated = 0;

// Update each record
for (const record of records) {
  const name = record.surgeon_name?.trim();
  if (!name) continue;
  
  // Find matching photo (exact or close match)
  const matchingPhoto = optimizedPhotos.find(photo => {
    const photoClean = photo.trim();
    const nameClean = name.trim();
    return photoClean === nameClean || 
           photoClean.toLowerCase() === nameClean.toLowerCase() ||
           photoClean.replace(/\s+/g, ' ') === nameClean.replace(/\s+/g, ' ') ||
           photoClean.replace(/\s+/g, '') === nameClean.replace(/\s+/g, '');
  });
  
  if (matchingPhoto) {
    record.surgeon_photo = `/surgeons/images/optimized/${matchingPhoto}.webp`;
    updated++;
    console.log(`✅ ${name}`);
  }
}

// Write updated CSV
const output = stringify(records, {
  header: true,
  quoted: true,
  quoted_empty: true
});

fs.writeFileSync(CSV_FILE, output);

console.log(`\n📊 Results:`);
console.log(`   ✅ Updated: ${updated} photo paths`);
console.log(`   📄 Total records: ${records.length}`);
console.log(`\n✨ Done!`);

