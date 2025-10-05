/**
 * Surgeon Pages Generation Script (JavaScript Version)
 * 
 * Generates individual surgeon profile pages and city directory pages
 * 
 * Usage:
 *   node scripts/generate-surgeon-pages.js              # Generate all pages
 *   node scripts/generate-surgeon-pages.js --dry-run    # Preview without writing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const ROOT_DIR = path.join(__dirname, '..');
const CSV_PATH = path.join(ROOT_DIR, 'surgeons-with-bios.csv');
const PAGES_DIR = path.join(ROOT_DIR, 'src', 'pages', 'surgeons');

// Check for dry-run flag
const isDryRun = process.argv.includes('--dry-run');

// Stats tracking
const stats = {
  startTime: Date.now(),
  totalPages: 0,
  citiesProcessed: 0,
  cityPages: 0,
  errors: [],
  cityCounts: {},
};

/**
 * Parse CSV file
 */
function parseCSV(filePath) {
  console.log('📖 Reading CSV file...');
  const csvContent = fs.readFileSync(filePath, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    throw new Error('CSV file is empty or has no data rows');
  }
  
  // Parse header
  const header = lines[0].split(',').map(h => h.trim());
  
  // Parse data rows
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = parseCSVLine(line);
    
    if (values.length === header.length) {
      const row = {};
      header.forEach((key, index) => {
        row[key] = values[index];
      });
      data.push(row);
    }
  }
  
  console.log(`✅ Loaded ${data.length} surgeons`);
  return data;
}

/**
 * Parse a single CSV line (handles quoted values with commas)
 */
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of value
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last value
  values.push(current.trim());
  
  return values;
}

/**
 * Generate slug from text
 */
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Group surgeons by city
 */
function groupByCity(surgeons) {
  console.log('📊 Grouping surgeons by city...');
  const cities = {};
  
  surgeons.forEach(surgeon => {
    const city = surgeon.city || 'Unknown';
    const citySlug = surgeon.slug ? surgeon.slug.split('-').pop() : generateSlug(city);
    
    if (!cities[citySlug]) {
      cities[citySlug] = {
        name: city,
        slug: citySlug,
        surgeons: []
      };
    }
    
    cities[citySlug].surgeons.push(surgeon);
  });
  
  console.log(`✅ Found ${Object.keys(cities).length} cities`);
  return cities;
}

/**
 * Generate individual surgeon profile page
 */
function generateSurgeonProfilePage(surgeon, citySlug) {
  const surgeonSlug = surgeon.slug || generateSlug(surgeon.surgeon_name || surgeon.business_name);
  const displayName = surgeon.surgeon_name || surgeon.business_name;
  const qualifications = surgeon.qualifications || '';
  const procedures = surgeon.procedures ? surgeon.procedures.split(',').map(p => p.trim()) : [];
  const bio = surgeon.bio_long || '';
  const rating = surgeon.rating || 0;
  const reviewCount = surgeon.review_count || 0;
  const phone = surgeon.phone || '';
  const website = surgeon.website || '';
  const street = surgeon.street || '';
  const city = surgeon.city || '';
  const state = surgeon.state || '';
  const primaryLocation = surgeon.primary_location || `${city}, ${state}`;
  
  return `---
// Auto-generated surgeon profile page
// Surgeon: ${displayName}
// City: ${city}
// Generated: ${new Date().toISOString()}

import SurgeonHero from '../../../components/surgeons/SurgeonHero.astro';
import SurgeonProcedures from '../../../components/surgeons/SurgeonProcedures.astro';
import SurgeonBio from '../../../components/surgeons/SurgeonBio.astro';
import SurgeonReviews from '../../../components/surgeons/SurgeonReviews.astro';
import SurgeonLocation from '../../../components/surgeons/SurgeonLocation.astro';
import SurgeonCTA from '../../../components/surgeons/SurgeonCTA.astro';

// Surgeon data
const surgeon = {
  name: "${displayName.replace(/"/g, '\\"')}",
  qualifications: "${qualifications.replace(/"/g, '\\"')}",
  bio: \`${bio.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
  rating: ${rating},
  reviewCount: ${reviewCount},
  phone: "${phone}",
  website: "${website}",
  address: {
    street: "${street}",
    city: "${city}",
    state: "${state}",
    display: "${primaryLocation}"
  },
  procedures: ${JSON.stringify(procedures)},
  slug: "${surgeonSlug}",
  citySlug: "${citySlug}"
};

// SEO
const title = "${surgeon.meta_title || `${displayName} - ${city} | Weight Loss Surgery Australia`}";
const description = "${surgeon.meta_description || `Book a consultation with ${displayName} in ${city}. Experienced bariatric surgeon offering weight loss surgery procedures.`}";
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content={description}>
  <link rel="canonical" href={\`https://weightlosssurgery.com.au/surgeons/\${surgeon.citySlug}/\${surgeon.slug}\`} />
</head>
<body>
  <SurgeonHero surgeon={surgeon} />
  <SurgeonProcedures procedures={surgeon.procedures} surgeon={surgeon} />
  <SurgeonBio bio={surgeon.bio} qualifications={surgeon.qualifications} />
  <SurgeonReviews rating={surgeon.rating} reviewCount={surgeon.reviewCount} surgeon={surgeon} />
  <SurgeonLocation surgeon={surgeon} />
  <SurgeonCTA surgeon={surgeon} />
</body>
</html>`;
}

/**
 * Generate city directory page
 */
function generateCityDirectoryPage(cityData) {
  const { name: cityName, slug: citySlug, surgeons } = cityData;
  const surgeonCount = surgeons.length;
  
  return `---
// Auto-generated city directory page
// City: ${cityName}
// Surgeons: ${surgeonCount}
// Generated: ${new Date().toISOString()}

// Surgeons data
const surgeons = ${JSON.stringify(surgeons.map(s => ({
  name: s.surgeon_name || s.business_name,
  slug: s.slug || generateSlug(s.surgeon_name || s.business_name),
  qualifications: s.qualifications || '',
  rating: parseFloat(s.rating) || 0,
  reviewCount: parseInt(s.review_count) || 0,
  procedures: s.procedures ? s.procedures.split(',').map(p => p.trim()) : [],
  phone: s.phone || '',
  address: s.primary_location || s.city,
  tier: parseInt(s.tier) || 3
})), null, 2)};

const cityName = "${cityName}";
const citySlug = "${citySlug}";
const surgeonCount = ${surgeonCount};

// SEO
const title = \`Weight Loss Surgeons in \${cityName} | Find Bariatric Surgeons\`;
const description = \`Find \${surgeonCount} verified weight loss surgeons in \${cityName}. Compare qualifications, ratings, and procedures. Book your consultation today.\`;
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content={description}>
  <link rel="canonical" href={\`https://weightlosssurgery.com.au/surgeons/\${citySlug}\`} />
</head>
<body>
  <div class="container mx-auto px-4 py-8">
    <!-- Hero Section -->
    <section class="mb-12 text-center">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">
        Weight Loss Surgeons in {cityName}
      </h1>
      <p class="text-xl text-gray-600">
        {surgeonCount} verified bariatric surgeons ready to help you
      </p>
    </section>

    <!-- Surgeons Grid -->
    <section class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {surgeons.map(surgeon => (
        <a 
          href={\`/surgeons/\${citySlug}/\${surgeon.slug}\`}
          class="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
        >
          <h2 class="text-2xl font-bold mb-2">{surgeon.name}</h2>
          {surgeon.qualifications && (
            <p class="text-sm text-gray-600 mb-3">{surgeon.qualifications}</p>
          )}
          
          <div class="flex items-center gap-2 mb-3">
            <span class="text-yellow-500">★</span>
            <span class="font-semibold">{surgeon.rating.toFixed(1)}</span>
            <span class="text-gray-600">({surgeon.reviewCount} reviews)</span>
          </div>

          <div class="mb-3">
            <p class="text-sm text-gray-600">{surgeon.address}</p>
          </div>

          {surgeon.procedures.length > 0 && (
            <div class="mb-3">
              <p class="text-sm font-semibold mb-1">Procedures:</p>
              <div class="flex flex-wrap gap-1">
                {surgeon.procedures.slice(0, 3).map(proc => (
                  <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {proc}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div class="mt-4">
            <span class="text-blue-600 font-semibold">View Profile →</span>
          </div>
        </a>
      ))}
    </section>

    <!-- CTA Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg text-center">
      <h2 class="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
      <p class="text-lg mb-6">Book a consultation with a qualified surgeon in {cityName}</p>
      <a 
        href="#contact" 
        class="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
      >
        Get Started
      </a>
    </section>
  </div>
</body>
</html>`;
}

/**
 * Write file (or simulate in dry-run mode)
 */
function writeFile(filePath, content) {
  if (isDryRun) {
    console.log(`  [DRY RUN] Would write: ${filePath}`);
    return;
  }
  
  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * Generate all surgeon pages
 */
function generateSurgeonPages(cities) {
  console.log('\n📝 Generating surgeon profile pages...');
  
  Object.entries(cities).forEach(([citySlug, cityData]) => {
    const cityDir = path.join(PAGES_DIR, citySlug);
    
    cityData.surgeons.forEach(surgeon => {
      const surgeonSlug = surgeon.slug || generateSlug(surgeon.surgeon_name || surgeon.business_name);
      const filePath = path.join(cityDir, `${surgeonSlug}.astro`);
      const content = generateSurgeonProfilePage(surgeon, citySlug);
      
      try {
        writeFile(filePath, content);
        stats.totalPages++;
        
        if (stats.totalPages % 50 === 0) {
          console.log(`  ✓ Generated ${stats.totalPages} pages...`);
        }
      } catch (error) {
        console.error(`  ✗ Error generating ${surgeonSlug}:`, error.message);
        stats.errors.push(`${surgeonSlug}: ${error.message}`);
      }
    });
    
    stats.cityCounts[citySlug] = cityData.surgeons.length;
  });
  
  console.log(`✅ Generated ${stats.totalPages} surgeon profile pages`);
}

/**
 * Generate city directory pages
 */
function generateCityPages(cities) {
  console.log('\n📝 Generating city directory pages...');
  
  Object.entries(cities).forEach(([citySlug, cityData]) => {
    const cityDir = path.join(PAGES_DIR, citySlug);
    const filePath = path.join(cityDir, 'index.astro');
    const content = generateCityDirectoryPage(cityData);
    
    try {
      writeFile(filePath, content);
      stats.cityPages++;
      stats.citiesProcessed++;
      console.log(`  ✓ ${cityData.name} (${cityData.surgeons.length} surgeons)`);
    } catch (error) {
      console.error(`  ✗ Error generating ${citySlug}:`, error.message);
      stats.errors.push(`${citySlug} directory: ${error.message}`);
    }
  });
  
  console.log(`✅ Generated ${stats.cityPages} city directory pages`);
}

/**
 * Print summary
 */
function printSummary() {
  const duration = ((Date.now() - stats.startTime) / 1000).toFixed(2);
  
  console.log('\n' + '═'.repeat(80));
  console.log('📊 GENERATION SUMMARY');
  console.log('═'.repeat(80));
  console.log(`\n${isDryRun ? '🔍 DRY RUN MODE (no files written)' : '✅ GENERATION COMPLETE'}\n`);
  console.log(`📄 Total Pages:           ${stats.totalPages + stats.cityPages}`);
  console.log(`👤 Surgeon Profiles:      ${stats.totalPages}`);
  console.log(`🏙️  City Directories:      ${stats.cityPages}`);
  console.log(`⏱️  Duration:              ${duration}s`);
  console.log(`❌ Errors:                ${stats.errors.length}`);
  
  if (Object.keys(stats.cityCounts).length > 0) {
    console.log('\n📍 Surgeons by City:');
    Object.entries(stats.cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([city, count]) => {
        console.log(`   ${city.padEnd(20)} ${count} surgeons`);
      });
    
    if (Object.keys(stats.cityCounts).length > 10) {
      console.log(`   ... and ${Object.keys(stats.cityCounts).length - 10} more cities`);
    }
  }
  
  if (stats.errors.length > 0) {
    console.log('\n⚠️  Errors:');
    stats.errors.slice(0, 5).forEach(error => {
      console.log(`   • ${error}`);
    });
    if (stats.errors.length > 5) {
      console.log(`   ... and ${stats.errors.length - 5} more errors`);
    }
  }
  
  console.log('\n' + '═'.repeat(80));
  
  if (isDryRun) {
    console.log('\n💡 Run without --dry-run to generate files');
  } else {
    console.log('\n✨ Pages generated successfully!');
    console.log('📁 Location: src/pages/surgeons/');
    console.log('🚀 Next: npm run dev to test');
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('\n' + '═'.repeat(80));
  console.log('🏥 SURGEON PAGES GENERATOR');
  console.log('═'.repeat(80));
  console.log(`\nMode: ${isDryRun ? '🔍 DRY RUN' : '✍️  WRITE'}`);
  console.log(`CSV: ${CSV_PATH}`);
  console.log(`Output: ${PAGES_DIR}\n`);
  
  try {
    // Parse CSV
    const surgeons = parseCSV(CSV_PATH);
    
    // Group by city
    const cities = groupByCity(surgeons);
    
    // Generate pages
    generateSurgeonPages(cities);
    generateCityPages(cities);
    
    // Print summary
    printSummary();
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run
main();
