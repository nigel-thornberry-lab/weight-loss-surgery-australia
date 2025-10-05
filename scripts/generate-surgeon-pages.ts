/**
 * Surgeon Pages Generation Script
 * 
 * Generates individual surgeon profile pages and city directory pages
 * 
 * Usage:
 *   npx tsx scripts/generate-surgeon-pages.ts              # Generate all pages
 *   npx tsx scripts/generate-surgeon-pages.ts --dry-run    # Preview without writing
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
  errors: [] as string[],
  cityCounts: {} as Record<string, number>,
};

/**
 * Parse CSV file
 */
function parseCSV(filePath: string): any[] {
  console.log('📖 Reading CSV file...');
  const csvContent = fs.readFileSync(filePath, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    throw new Error('CSV file is empty or has no data rows');
  }
  
  // Parse header
  const header = lines[0].split(',').map(h => h.trim());
  
  // Parse rows
  const rows = lines.slice(1).map((line, index) => {
    // Handle CSV with quoted values
    const values: string[] = [];
    let currentValue = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());
    
    // Create object from header and values
    const row: any = {};
    header.forEach((key, i) => {
      row[key] = values[i] || '';
    });
    
    return row;
  });
  
  console.log(`✓ Loaded ${rows.length} surgeon records\n`);
  return rows;
}

/**
 * Create slug from text
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get display name for surgeon
 */
function getDisplayName(surgeon: any): string {
  return surgeon.surgeon_name || surgeon.business_name;
}

/**
 * Generate individual surgeon page template
 */
function generateSurgeonPageTemplate(surgeon: any): string {
  const displayName = getDisplayName(surgeon);
  
  return `---
/**
 * Surgeon Profile Page: ${displayName}
 * 
 * Auto-generated from surgeons-with-bios.csv
 * City: ${surgeon.city}
 * Rating: ${surgeon.rating}⭐
 */

import Layout from '../../../layouts/Layout.astro';
import SurgeonHero from '../../../components/surgeons/SurgeonHero.astro';
import SurgeonProcedures from '../../../components/surgeons/SurgeonProcedures.astro';
import SurgeonBio from '../../../components/surgeons/SurgeonBio.astro';
import SurgeonReviews from '../../../components/surgeons/SurgeonReviews.astro';
import SurgeonLocation from '../../../components/surgeons/SurgeonLocation.astro';
import SurgeonCTA from '../../../components/surgeons/SurgeonCTA.astro';
import { getSurgeonBySlug, getRelatedSurgeons } from '../../../data/surgeons';

// Get surgeon data
const surgeonSlug = '${surgeon.slug}';
const surgeon = getSurgeonBySlug(surgeonSlug);

if (!surgeon) {
  return Astro.redirect('/surgeons/');
}

// Get related surgeons (same city or same procedures)
const relatedSurgeons = getRelatedSurgeons(surgeon, 3);

// SEO data
const pageTitle = \`\${surgeon.meta_title} | Weight Loss Surgery Australia\`;
const pageDescription = surgeon.meta_description;
---

<Layout title={pageTitle} description={pageDescription}>
  <!-- Surgeon Profile Content -->
  <SurgeonHero surgeon={surgeon} />
  <SurgeonProcedures surgeon={surgeon} />
  <SurgeonBio surgeon={surgeon} />
  <SurgeonReviews surgeon={surgeon} />
  <SurgeonLocation surgeon={surgeon} />
  <SurgeonCTA surgeon={surgeon} />
  
  <!-- Related Surgeons Section -->
  {relatedSurgeons.length > 0 && (
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">
          Other Surgeons You May Like
        </h2>
        
        <div class="grid md:grid-cols-3 gap-6">
          {relatedSurgeons.map(related => (
            <article class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 overflow-hidden group">
              <div class="p-6">
                <div class="flex items-start gap-4 mb-4">
                  <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {(related.surgeon_name || related.business_name).split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  
                  <div class="flex-1">
                    <h3 class="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      <a href={\`/surgeons/\${related.slug}\`} class="hover:underline">
                        {related.surgeon_name || related.business_name}
                      </a>
                    </h3>
                    <p class="text-sm text-gray-600">{related.location_display}</p>
                  </div>
                </div>
                
                <div class="flex items-center gap-2 mb-4">
                  <div class="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg class={\`w-4 h-4 \${i < Math.floor(related.rating) ? 'text-yellow-400' : 'text-gray-300'}\`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <span class="text-sm font-bold">{related.rating}</span>
                  <span class="text-sm text-gray-600">({related.review_count})</span>
                </div>
                
                <a 
                  href={\`/surgeons/\${related.slug}\`}
                  class="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition-colors"
                >
                  View Profile
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )}
  
  <!-- Compare CTA -->
  <section class="py-12 bg-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">
        Not Sure If This Is The Right Surgeon?
      </h2>
      <p class="text-xl text-gray-600 mb-8">
        Compare {surgeon.surgeon_name || surgeon.business_name} with other surgeons side-by-side
      </p>
      <a 
        href={\`/surgeons/compare?a=\${surgeon.slug}\`}
        class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-colors text-lg"
      >
        Compare with Other Surgeons
      </a>
    </div>
  </section>
</Layout>
`;
}

/**
 * Generate city directory page template
 */
function generateCityPageTemplate(city: string, citySlug: string, surgeons: any[]): string {
  return `---
/**
 * City Directory Page: ${city}
 * 
 * Auto-generated directory of surgeons in ${city}
 * Total surgeons: ${surgeons.length}
 */

import Layout from '../../../layouts/Layout.astro';
import { getSurgeonsByCity, getDisplayName } from '../../../data/surgeons';

// Get all surgeons in this city
const surgeons = getSurgeonsByCity('${city}');

// Sort by rating and review count
surgeons.sort((a, b) => b.rating - a.rating || b.review_count - a.review_count);

// SEO data
const pageTitle = \`Top Bariatric Surgeons in ${city} | Weight Loss Surgery Australia\`;
const pageDescription = \`Find the best weight loss surgeons in ${city}. Compare \${surgeons.length} verified bariatric specialists with ratings, reviews, and qualifications.\`;
---

<Layout title={pageTitle} description={pageDescription}>
  <!-- Hero Section -->
  <section class="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl lg:text-5xl font-bold mb-4">
          Bariatric Surgeons in ${city}
        </h1>
        <p class="text-xl text-blue-100 max-w-3xl mx-auto">
          Browse {surgeons.length} verified weight loss surgery specialists in ${city}. 
          Compare qualifications, experience, ratings, and procedures.
        </p>
      </div>
      
      <!-- Quick Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <div class="text-3xl font-bold">{surgeons.length}</div>
          <div class="text-sm text-blue-200">Surgeons</div>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <div class="text-3xl font-bold">{surgeons.filter(s => s.rating >= 4.5).length}</div>
          <div class="text-sm text-blue-200">Top Rated</div>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <div class="text-3xl font-bold">{Math.round(surgeons.reduce((sum, s) => sum + s.rating, 0) / surgeons.length * 10) / 10}⭐</div>
          <div class="text-sm text-blue-200">Avg Rating</div>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <div class="text-3xl font-bold">100%</div>
          <div class="text-sm text-blue-200">Verified</div>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Surgeons Grid -->
  <section class="py-12 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Breadcrumbs -->
      <nav class="mb-8 flex items-center gap-2 text-sm text-gray-600">
        <a href="/" class="hover:text-blue-600">Home</a>
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
        </svg>
        <a href="/surgeons/" class="hover:text-blue-600">Surgeons</a>
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
        </svg>
        <span class="font-medium text-gray-900">${city}</span>
      </nav>
      
      <!-- Surgeons Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {surgeons.map(surgeon => (
          <article class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 overflow-hidden group hover:-translate-y-1">
            <div class="p-6">
              <div class="flex items-start gap-4 mb-4">
                <!-- Avatar -->
                <div class="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {getDisplayName(surgeon).split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                
                <div class="flex-1 min-w-0">
                  <h3 class="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    <a href={\`/surgeons/\${surgeon.slug}\`} class="hover:underline">
                      {getDisplayName(surgeon)}
                    </a>
                  </h3>
                  {surgeon.qualifications && (
                    <p class="text-sm text-gray-600 mb-2">
                      {surgeon.qualifications.split(',').slice(0, 2).join(', ')}
                    </p>
                  )}
                  {surgeon.tier === 1 && (
                    <span class="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg text-xs font-bold">
                      ⭐ Featured
                    </span>
                  )}
                </div>
              </div>
              
              <!-- Rating -->
              <div class="flex items-center gap-2 mb-4">
                <div class="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg class={\`w-5 h-5 \${i < Math.floor(surgeon.rating) ? 'text-yellow-400' : 'text-gray-300'}\`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <span class="font-bold text-gray-900">{surgeon.rating}</span>
                <span class="text-gray-600">({surgeon.review_count})</span>
              </div>
              
              <!-- Stats -->
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="bg-gray-50 rounded-lg p-3">
                  <div class="text-sm text-gray-600 mb-1">Experience</div>
                  <div class="font-bold text-gray-900">{surgeon.years_experience}+ yrs</div>
                </div>
                <div class="bg-gray-50 rounded-lg p-3">
                  <div class="text-sm text-gray-600 mb-1">Procedures</div>
                  <div class="font-bold text-gray-900">~{surgeon.estimated_procedures.toLocaleString()}</div>
                </div>
              </div>
              
              <!-- CTA -->
              <a 
                href={\`/surgeons/\${surgeon.slug}\`}
                class="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                View Profile
              </a>
            </div>
          </article>
        ))}
      </div>
      
      <!-- Actions -->
      <div class="mt-12 text-center space-y-4">
        <a 
          href="/surgeons/"
          class="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-xl transition-colors"
        >
          ← Back to All Surgeons
        </a>
        <div>
          <a 
            href="/surgeons/compare"
            class="inline-block text-blue-600 hover:text-blue-700 font-semibold"
          >
            Compare ${city} Surgeons →
          </a>
        </div>
      </div>
    </div>
  </section>
</Layout>
`;
}

/**
 * Ensure directory exists
 */
function ensureDir(dirPath: string): void {
  if (!isDryRun && !fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Write file
 */
function writeFile(filePath: string, content: string): void {
  if (isDryRun) {
    console.log(`  [DRY RUN] Would create: ${path.relative(ROOT_DIR, filePath)}`);
  } else {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✓ Created: ${path.relative(ROOT_DIR, filePath)}`);
  }
}

/**
 * Main generation function
 */
async function generatePages(): Promise<void> {
  console.log('╔═══════════════════════════════════════════════════════════════════════════╗');
  console.log('║                                                                            ║');
  console.log('║              🏗️  SURGEON PAGES GENERATION                                 ║');
  console.log('║                                                                            ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════╝\n');
  
  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No files will be written\n');
  }
  
  try {
    // Load surgeon data
    const surgeons = parseCSV(CSV_PATH);
    
    // Group surgeons by city
    console.log('📋 Grouping surgeons by city...');
    const surgeonsByCity: Record<string, any[]> = {};
    
    surgeons.forEach(surgeon => {
      const city = surgeon.city;
      if (!city) {
        stats.errors.push(`Surgeon ${getDisplayName(surgeon)} has no city`);
        return;
      }
      
      if (!surgeonsByCity[city]) {
        surgeonsByCity[city] = [];
      }
      surgeonsByCity[city].push(surgeon);
    });
    
    const cities = Object.keys(surgeonsByCity).sort();
    console.log(`✓ Found ${cities.length} cities\n`);
    
    // Generate pages for each city
    for (const city of cities) {
      const citySurgeons = surgeonsByCity[city];
      const citySlug = slugify(city);
      
      console.log(`\n📍 Processing ${city} (${citySurgeons.length} surgeons)...`);
      
      // Create city directory
      const cityDir = path.join(PAGES_DIR, citySlug);
      ensureDir(cityDir);
      
      // Generate individual surgeon pages
      for (const surgeon of citySurgeons) {
        try {
          const surgeonSlug = surgeon.slug;
          if (!surgeonSlug) {
            stats.errors.push(`Surgeon ${getDisplayName(surgeon)} has no slug`);
            continue;
          }
          
          const surgeonFilePath = path.join(cityDir, `${surgeonSlug}.astro`);
          const surgeonContent = generateSurgeonPageTemplate(surgeon);
          
          writeFile(surgeonFilePath, surgeonContent);
          stats.totalPages++;
          
        } catch (error) {
          const errorMsg = `Error generating page for ${getDisplayName(surgeon)}: ${error}`;
          stats.errors.push(errorMsg);
          console.error(`  ✗ ${errorMsg}`);
        }
      }
      
      // Generate city directory page
      const cityIndexPath = path.join(cityDir, 'index.astro');
      const cityIndexContent = generateCityPageTemplate(city, citySlug, citySurgeons);
      
      writeFile(cityIndexPath, cityIndexContent);
      stats.cityPages++;
      stats.citiesProcessed++;
      stats.cityCounts[city] = citySurgeons.length;
    }
    
    // Print summary
    printSummary();
    
  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

/**
 * Print summary report
 */
function printSummary(): void {
  const endTime = Date.now();
  const duration = ((endTime - stats.startTime) / 1000).toFixed(2);
  const avgTimePerPage = stats.totalPages > 0 
    ? ((endTime - stats.startTime) / stats.totalPages).toFixed(0)
    : 0;
  
  console.log('\n\n╔═══════════════════════════════════════════════════════════════════════════╗');
  console.log('║                                                                            ║');
  console.log('║              📊 GENERATION SUMMARY                                        ║');
  console.log('║                                                                            ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════╝\n');
  
  if (isDryRun) {
    console.log('🔍 DRY RUN COMPLETE - No files were written\n');
  }
  
  console.log(`Total Pages Generated:       ${stats.totalPages} surgeon profiles`);
  console.log(`City Directory Pages:        ${stats.cityPages} city indexes`);
  console.log(`Cities Processed:            ${stats.citiesProcessed} cities`);
  console.log(`Total Time:                  ${duration}s`);
  console.log(`Avg Time Per Page:           ${avgTimePerPage}ms`);
  console.log(`Errors Encountered:          ${stats.errors.length}`);
  
  if (stats.errors.length > 0) {
    console.log('\n⚠️  ERRORS:\n');
    stats.errors.forEach((error, i) => {
      console.log(`${i + 1}. ${error}`);
    });
  }
  
  console.log('\n📋 Pages by City:\n');
  Object.entries(stats.cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([city, count]) => {
      console.log(`  ${city.padEnd(25)} ${count} pages`);
    });
  
  if (Object.keys(stats.cityCounts).length > 10) {
    console.log(`  ... and ${Object.keys(stats.cityCounts).length - 10} more cities`);
  }
  
  console.log('\n✅ Generation complete!\n');
  
  if (!isDryRun) {
    console.log('📂 Generated pages location:');
    console.log(`   ${path.relative(ROOT_DIR, PAGES_DIR)}/[city-slug]/[surgeon-slug].astro`);
    console.log(`   ${path.relative(ROOT_DIR, PAGES_DIR)}/[city-slug]/index.astro`);
    console.log('\n🚀 Next steps:');
    console.log('   1. Review generated pages');
    console.log('   2. Test a few random profiles');
    console.log('   3. Build the site: npm run build');
    console.log('   4. Deploy to production\n');
  } else {
    console.log('To generate the files, run:');
    console.log('   npx tsx scripts/generate-surgeon-pages.ts\n');
  }
}

// Run the script
generatePages().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
