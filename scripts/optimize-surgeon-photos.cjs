const fs = require('fs');
const path = require('path');

/**
 * Surgeon Photo Optimization Script
 * 
 * Processes raw surgeon photos and optimizes them for web:
 * - Resizes to optimal dimensions
 * - Converts to WebP format
 * - Generates thumbnails
 * - Updates CSV with new photo paths
 */

const RAW_DIR = 'public/surgeons/images/raw';
const OPTIMIZED_DIR = 'public/surgeons/images/optimized';
const THUMBNAIL_DIR = 'public/surgeons/images/thumbnails';
const CSV_FILE = 'surgeons-with-bios.csv';

// Image dimensions
const LARGE_WIDTH = 800;
const LARGE_HEIGHT = 1000;
const THUMB_WIDTH = 300;
const THUMB_HEIGHT = 375;

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (err) {
  console.error('\n❌ ERROR: "sharp" package not found!');
  console.error('   Please install it: npm install sharp\n');
  process.exit(1);
}

// Create directories if they don't exist
[RAW_DIR, OPTIMIZED_DIR, THUMBNAIL_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

async function optimizePhoto(inputPath, slug, surgeonName) {
  const outputFilename = `${slug}.webp`;
  const optimizedPath = path.join(OPTIMIZED_DIR, outputFilename);
  const thumbnailPath = path.join(THUMBNAIL_DIR, outputFilename);
  
  try {
    // Generate optimized large version
    await sharp(inputPath)
      .resize(LARGE_WIDTH, LARGE_HEIGHT, {
        fit: 'cover',
        position: 'top'
      })
      .webp({ quality: 85 })
      .toFile(optimizedPath);
    
    // Generate thumbnail
    await sharp(inputPath)
      .resize(THUMB_WIDTH, THUMB_HEIGHT, {
        fit: 'cover',
        position: 'top'
      })
      .webp({ quality: 80 })
      .toFile(thumbnailPath);
    
    const stats = fs.statSync(optimizedPath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    
    console.log(`   ✅ ${surgeonName}: ${sizeKB}KB`);
    
    return `/surgeons/images/optimized/${outputFilename}`;
    
  } catch (err) {
    console.error(`   ❌ ${surgeonName}: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('🖼️  Surgeon Photo Optimization\n');
  console.log('📂 Scanning for raw photos...\n');
  
  // Get all raw photos
  if (!fs.existsSync(RAW_DIR)) {
    console.error(`❌ Raw photos directory not found: ${RAW_DIR}`);
    console.error('   Please create it and add photos first.');
    process.exit(1);
  }
  
  const rawFiles = fs.readdirSync(RAW_DIR)
    .filter(f => f.match(/\.(jpg|jpeg|png)$/i));
  
  if (rawFiles.length === 0) {
    console.log('⚠️  No photos found in raw directory.');
    console.log(`   Upload photos to: ${RAW_DIR}`);
    console.log('   Naming format: {surgeon-slug}.jpg\n');
    process.exit(0);
  }
  
  console.log(`Found ${rawFiles.length} photos to process\n`);
  
  // Load CSV
  const csvContent = fs.readFileSync(CSV_FILE, 'utf-8');
  const lines = csvContent.split('\n');
  const headers = parseCSVLine(lines[0]);
  
  // Find slug column (column 18, 0-indexed)
  const surgeonPhotoIndex = 25; // Column 26 (0-indexed 25)
  
  // Process each photo
  const photoMap = {};
  let processed = 0;
  let errors = 0;
  
  for (const filename of rawFiles) {
    const slug = filename.replace(/\.(jpg|jpeg|png)$/i, '');
    const inputPath = path.join(RAW_DIR, filename);
    
    // Find surgeon in CSV
    let surgeonName = slug;
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values[18] === slug) {
        surgeonName = values[1]; // Get surgeon name
        break;
      }
    }
    
    const photoPath = await optimizePhoto(inputPath, slug, surgeonName);
    if (photoPath) {
      photoMap[slug] = photoPath;
      processed++;
    } else {
      errors++;
    }
  }
  
  console.log(`\n📊 Results:`);
  console.log(`   ✅ Processed: ${processed}`);
  console.log(`   ❌ Errors: ${errors}`);
  
  if (processed === 0) {
    console.log('\n⚠️  No photos were processed. Exiting.\n');
    return;
  }
  
  // Update CSV
  console.log(`\n📝 Updating CSV...`);
  
  const updatedLines = lines.map((line, index) => {
    if (index === 0) return line; // Keep header
    
    const values = parseCSVLine(line);
    if (values.length < headers.length) return line;
    
    const slug = values[18];
    if (photoMap[slug]) {
      values[surgeonPhotoIndex] = photoMap[slug];
    }
    
    // Re-join with proper CSV formatting
    return values.map(v => {
      // Escape quotes and wrap in quotes if contains comma or quotes
      if (v.includes(',') || v.includes('"') || v.includes('\n')) {
        return `"${v.replace(/"/g, '""')}"`;
      }
      return v;
    }).join(',');
  });
  
  // Backup original CSV
  const backupFile = CSV_FILE.replace('.csv', `-backup-${Date.now()}.csv`);
  fs.copyFileSync(CSV_FILE, backupFile);
  console.log(`   📦 Backup created: ${backupFile}`);
  
  // Write updated CSV
  fs.writeFileSync(CSV_FILE, updatedLines.join('\n'));
  console.log(`   ✅ CSV updated with ${Object.keys(photoMap).length} photo paths`);
  
  console.log(`\n✨ Done! Next steps:`);
  console.log(`   1. Review photos in: ${OPTIMIZED_DIR}`);
  console.log(`   2. Regenerate site: node scripts/generate-all-profiles.cjs`);
  console.log(`   3. Deploy: vercel --prod --yes\n`);
}

// Handle command line arguments
if (process.argv.includes('--help')) {
  console.log(`
Surgeon Photo Optimization Script

Usage:
  node scripts/optimize-surgeon-photos.cjs [options]

Options:
  --help     Show this help message

Workflow:
  1. Place raw photos in: ${RAW_DIR}
  2. Name photos with surgeon slug: {slug}.jpg
  3. Run: node scripts/optimize-surgeon-photos.cjs
  4. Check output in: ${OPTIMIZED_DIR}
  5. Regenerate site: node scripts/generate-all-profiles.cjs

Photo Requirements:
  - Format: JPG or PNG
  - Min size: 600x800px
  - Professional headshot
  - Clear face visibility

Output:
  - Format: WebP (90% smaller than JPG)
  - Size: 800x1000px
  - Quality: 85%
  - Thumbnails: 300x375px
  
`);
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
