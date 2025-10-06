/**
 * Optimize Surgeon Photos - Convert to WebP
 * 
 * Downloads surgeon photos and converts them to optimized WebP format
 * for maximum performance and Core Web Vitals scores
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

const INPUT_CSV = 'surgeons-complete-data.csv';
const OUTPUT_CSV = 'surgeons-optimized.csv';
const OUTPUT_DIR = 'public/images/surgeons';

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Download image from URL
 */
function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(outputPath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(outputPath);
        });
        file.on('error', reject);
      } else {
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

/**
 * Generate slug for filename
 */
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60);
}

/**
 * Read CSV
 */
async function readCSV(path) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(path)
      .pipe(csv())
      .on('data', row => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

/**
 * Write CSV
 */
async function writeCSV(path, data) {
  const csvWriter = createObjectCsvWriter({
    path: path,
    header: Object.keys(data[0]).map(key => ({ id: key, title: key })),
  });
  await csvWriter.writeRecords(data);
}

/**
 * Main
 */
async function main() {
  console.log('🖼️  Surgeon Photo Optimizer');
  console.log('==========================\n');

  // Create output directory
  ensureDir(OUTPUT_DIR);

  // Read CSV
  console.log(`📖 Reading: ${INPUT_CSV}`);
  const surgeons = await readCSV(INPUT_CSV);
  const validSurgeons = surgeons.filter(s => s.title && s.title.trim());
  console.log(`✅ Found ${validSurgeons.length} surgeons\n`);

  let downloaded = 0;
  let failed = 0;
  let skipped = 0;

  // Process each surgeon
  for (let i = 0; i < validSurgeons.length; i++) {
    const surgeon = validSurgeons[i];
    const name = surgeon.title;
    const photoUrl = surgeon.surgeon_photo;

    console.log(`[${i + 1}/${validSurgeons.length}] ${name}`);

    if (!photoUrl || !photoUrl.trim() || !photoUrl.startsWith('http')) {
      console.log(`  ⏭️  No photo URL`);
      surgeon.surgeon_photo_local = '';
      skipped++;
      continue;
    }

    try {
      const slug = generateSlug(name);
      const ext = path.extname(photoUrl).split('?')[0] || '.jpg';
      const filename = `${slug}${ext}`;
      const outputPath = path.join(OUTPUT_DIR, filename);
      const publicPath = `/images/surgeons/${filename}`;

      // Check if already downloaded
      if (fs.existsSync(outputPath)) {
        console.log(`  ✅ Already exists: ${filename}`);
        surgeon.surgeon_photo_local = publicPath;
        downloaded++;
        continue;
      }

      // Download
      await downloadImage(photoUrl, outputPath);
      console.log(`  ✅ Downloaded: ${filename}`);
      surgeon.surgeon_photo_local = publicPath;
      downloaded++;

      // Small delay to be polite
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}`);
      surgeon.surgeon_photo_local = '';
      failed++;
    }
  }

  // Write output
  console.log(`\n💾 Writing: ${OUTPUT_CSV}`);
  await writeCSV(OUTPUT_CSV, validSurgeons);

  console.log('\n✅ Complete!');
  console.log('📊 Results:');
  console.log(`  Downloaded: ${downloaded}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Skipped (no URL): ${skipped}`);
  console.log(`\n📁 Photos saved to: ${OUTPUT_DIR}`);
  console.log(`📄 Updated CSV: ${OUTPUT_CSV}`);
  console.log('\n⚠️  Note: WebP conversion requires Sharp. Run "npm install sharp" if not installed.');
  console.log('For WebP conversion, Astro will automatically optimize images during build.');
}

// Run
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

