/**
 * Surgeon Pages Generation Script V2 - With BaseLayout
 * 
 * Generates individual surgeon profile pages and city directory pages
 * Now includes proper header/footer via BaseLayout
 * 
 * Usage:
 *   node scripts/generate-surgeon-pages-v2.js              # Generate all pages
 *   node scripts/generate-surgeon-pages-v2.js --dry-run    # Preview without writing
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
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
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
 * Generate individual surgeon profile page (with BaseLayout)
 */
function generateSurgeonProfilePage(surgeon, citySlug) {
  const surgeonSlug = surgeon.slug || generateSlug(surgeon.surgeon_name || surgeon.business_name);
  const displayName = surgeon.surgeon_name || surgeon.business_name;
  const qualifications = surgeon.qualifications || '';
  const procedures = surgeon.procedures ? surgeon.procedures.split(',').map(p => p.trim()) : [];
  const bio = surgeon.bio_long || '';
  const rating = parseFloat(surgeon.rating) || 0;
  const reviewCount = parseInt(surgeon.review_count) || 0;
  const phone = surgeon.phone || '';
  const website = surgeon.website || '';
  const street = surgeon.street || '';
  const city = surgeon.city || '';
  const state = surgeon.state || '';
  const primaryLocation = surgeon.primary_location || `${city}, ${state}`;
  
  return `---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import SurgeonHero from '../../../components/surgeons/SurgeonHero.astro';
import SurgeonProcedures from '../../../components/surgeons/SurgeonProcedures.astro';
import SurgeonBio from '../../../components/surgeons/SurgeonBio.astro';
import SurgeonReviews from '../../../components/surgeons/SurgeonReviews.astro';
import SurgeonLocation from '../../../components/surgeons/SurgeonLocation.astro';
import SurgeonCTA from '../../../components/surgeons/SurgeonCTA.astro';

// Surgeon data
const surgeon = {
  name: "${displayName.replace(/"/g, '\\"')}",
  surgeon_name: "${(surgeon.surgeon_name || '').replace(/"/g, '\\"')}",
  business_name: "${(surgeon.business_name || displayName).replace(/"/g, '\\"')}",
  qualifications: "${qualifications.replace(/"/g, '\\"')}",
  bio: \`${bio.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
  rating: ${rating},
  reviewCount: ${reviewCount},
  review_count: ${reviewCount},
  phone: "${phone}",
  website: "${website}",
  years_experience: ${surgeon.years_experience || 0},
  estimated_procedures: ${surgeon.estimated_procedures || 0},
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
const title = "${surgeon.meta_title || `${displayName} - ${city} | Weight Loss Surgery Australia`}".replace(/"/g, '\\"');
const description = "${surgeon.meta_description || `Book a consultation with ${displayName} in ${city}. Experienced bariatric surgeon offering weight loss surgery procedures.`}".replace(/"/g, '\\"');
const canonicalUrl = \`https://weightlosssurgery.com.au/surgeons/\${surgeon.citySlug}/\${surgeon.slug}\`;
---

<BaseLayout title={title} description={description} canonicalUrl={canonicalUrl}>
  <!-- Breadcrumbs -->
  <div class="bg-gray-50 border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <nav class="flex text-sm text-gray-600">
        <a href="/" class="hover:text-blue-600">Home</a>
        <span class="mx-2">/</span>
        <a href="/surgeons" class="hover:text-blue-600">Surgeons</a>
        <span class="mx-2">/</span>
        <a href={\`/surgeons/\${surgeon.citySlug}\`} class="hover:text-blue-600">{surgeon.address.city}</a>
        <span class="mx-2">/</span>
        <span class="text-gray-900">{surgeon.name}</span>
      </nav>
    </div>
  </div>

  <SurgeonHero surgeon={surgeon} />
  <SurgeonProcedures procedures={surgeon.procedures} surgeon={surgeon} />
  <SurgeonBio bio={surgeon.bio} qualifications={surgeon.qualifications} />
  <SurgeonReviews rating={surgeon.rating} reviewCount={surgeon.reviewCount} surgeon={surgeon} />
  <SurgeonLocation surgeon={surgeon} />
  <SurgeonCTA surgeon={surgeon} />
</BaseLayout>`;
}

/**
 * Generate city directory page (with BaseLayout)
 */
function generateCityDirectoryPage(cityData) {
  const { name: cityName, slug: citySlug, surgeons } = cityData;
  const surgeonCount = surgeons.length;
  
  return `---
import BaseLayout from '../../../layouts/BaseLayout.astro';

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
const canonicalUrl = \`https://weightlosssurgery.com.au/surgeons/\${citySlug}\`;
---

<BaseLayout title={title} description={description} canonicalUrl={canonicalUrl}>
  <!-- Breadcrumbs -->
  <div class="bg-gray-50 border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <nav class="flex text-sm text-gray-600">
        <a href="/" class="hover:text-blue-600">Home</a>
        <span class="mx-2">/</span>
        <a href="/surgeons" class="hover:text-blue-600">Surgeons</a>
        <span class="mx-2">/</span>
        <span class="text-gray-900">{cityName}</span>
      </nav>
    </div>
  </div>

  <!-- Hero Section -->
  <section class="bg-gradient-to-br from-blue-50 to-white py-12 md:py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Weight Loss Surgeons in {cityName}
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          {surgeonCount} verified bariatric surgeons ready to help you
        </p>
        <div class="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            AHPRA Registered
          </div>
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            Verified Reviews
          </div>
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            Expert Care
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Surgeons Grid -->
  <section class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {surgeons.map(surgeon => (
          <a 
            href={\`/surgeons/\${citySlug}/\${surgeon.slug}\`}
            class="block p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition group"
          >
            <h2 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">{surgeon.name}</h2>
            {surgeon.qualifications && (
              <p class="text-sm text-gray-600 mb-3">{surgeon.qualifications}</p>
            )}
            
            <div class="flex items-center gap-2 mb-3">
              <div class="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    class={\`w-4 h-4 \${i < Math.floor(surgeon.rating) ? 'text-yellow-400' : 'text-gray-300'}\`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span class="font-semibold text-gray-900">{surgeon.rating.toFixed(1)}</span>
              <span class="text-gray-600 text-sm">({surgeon.reviewCount} reviews)</span>
            </div>

            <div class="mb-3">
              <p class="text-sm text-gray-600">{surgeon.address}</p>
            </div>

            {surgeon.procedures.length > 0 && (
              <div class="mb-4">
                <div class="flex flex-wrap gap-1">
                  {surgeon.procedures.slice(0, 3).map(proc => (
                    <span class="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">
                      {proc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div class="mt-4 flex items-center text-blue-600 font-semibold">
              View Profile 
              <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
      <p class="text-lg text-blue-100 mb-6">Book a consultation with a qualified surgeon in {cityName}</p>
      <a 
        href="/#consultation" 
        class="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition"
      >
        Book Free Consultation
      </a>
    </div>
  </section>
</BaseLayout>`;
}

/**
 * Write file (or simulate in dry-run mode)
 */
function writeFile(filePath, content) {
  if (isDryRun) {
    console.log(`  [DRY RUN] Would write: ${filePath}`);
    return;
  }
  
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
    console.log('\n📍 Top Cities:');
    Object.entries(stats.cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([city, count]) => {
        console.log(`   ${city.padEnd(20)} ${count} surgeons`);
      });
  }
  
  if (stats.errors.length > 0) {
    console.log('\n⚠️  Errors:');
    stats.errors.slice(0, 5).forEach(error => {
      console.log(`   • ${error}`);
    });
  }
  
  console.log('\n' + '═'.repeat(80));
  
  if (isDryRun) {
    console.log('\n💡 Run without --dry-run to generate files');
  } else {
    console.log('\n✨ Pages generated with BaseLayout!');
    console.log('📁 Location: src/pages/surgeons/');
    console.log('🚀 Next: npm run build && deploy');
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('\n' + '═'.repeat(80));
  console.log('🏥 SURGEON PAGES GENERATOR V2 (With BaseLayout)');
  console.log('═'.repeat(80));
  console.log(`\nMode: ${isDryRun ? '🔍 DRY RUN' : '✍️  WRITE'}`);
  console.log(`CSV: ${CSV_PATH}`);
  console.log(`Output: ${PAGES_DIR}\n`);
  
  try {
    const surgeons = parseCSV(CSV_PATH);
    const cities = groupByCity(surgeons);
    generateSurgeonPages(cities);
    generateCityPages(cities);
    printSummary();
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run
main();
