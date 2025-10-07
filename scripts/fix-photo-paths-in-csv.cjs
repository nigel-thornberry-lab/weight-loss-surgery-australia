const fs = require('fs');
const path = require('path');

const CSV_FILE = 'surgeons-with-bios.csv';
const OPTIMIZED_DIR = 'public/surgeons/images/optimized';
const BACKUP_FILE = `surgeons-with-bios-backup-fix-${Date.now()}.csv`;

console.log('🔧 Fixing Photo Paths in CSV...\n');

// Get all optimized photos
const optimizedPhotos = fs.readdirSync(OPTIMIZED_DIR).filter(f => f.endsWith('.webp'));
console.log(`📸 Found ${optimizedPhotos.length} optimized photos\n`);

// Read CSV
const csvContent = fs.readFileSync(CSV_FILE, 'utf-8');
const lines = csvContent.split('\n');
const headers = lines[0];

// Create backup
fs.writeFileSync(BACKUP_FILE, csvContent);
console.log(`💾 Backup created: ${BACKUP_FILE}\n`);

let updated = 0;
const newLines = [headers];

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) {
    newLines.push(lines[i]);
    continue;
  }
  
  // Properly parse CSV with quotes
  const cols = lines[i].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
  if (cols.length < 26) {
    newLines.push(lines[i]);
    continue;
  }
  
  const name = cols[1]?.trim().replace(/^"|"$/g, '');
  
  // Find matching photo file
  const matchingPhoto = optimizedPhotos.find(photo => {
    const photoBase = photo.replace('.webp', '').trim();
    const nameClean = name.trim();
    return photoBase === nameClean || 
           photoBase.toLowerCase() === nameClean.toLowerCase() ||
           photoBase.replace(/\s+/g, ' ') === nameClean.replace(/\s+/g, ' ');
  });
  
  if (matchingPhoto) {
    // Update the surgeon_photo column (index 25)
    cols[25] = `/public/surgeons/images/optimized/${matchingPhoto}`;
    updated++;
    console.log(`✅ ${name} → ${matchingPhoto}`);
  }
  
  // Reconstruct line
  newLines.push(cols.join(','));
}

// Write updated CSV
fs.writeFileSync(CSV_FILE, newLines.join('\n'));

console.log(`\n📊 Results:`);
console.log(`   ✅ Updated: ${updated} photo paths`);
console.log(`   💾 Backup: ${BACKUP_FILE}`);
console.log(`\n✨ Done! CSV updated with local photo paths`);

