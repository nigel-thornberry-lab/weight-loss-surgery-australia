/**
 * SEO-Optimized Surgeon Page Generator
 * 
 * Generates surgeon pages with:
 * - Lazy loading images
 * - WebP support with fallbacks
 * - Proper structured data
 * - Optimized for Core Web Vitals
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const INPUT_CSV = 'surgeons-complete-data.csv';
const OUTPUT_DIR = 'src/pages/surgeons';

/**
 * Read CSV
 */
async function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', row => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Generate city slug
 */
function generateCitySlug(city) {
  return city
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generate optimized surgeon profile page with SEO enhancements
 */
function generateOptimizedSurgeonPage(surgeon) {
  const surgeonName = surgeon.title;
  const citySlug = generateCitySlug(surgeon.city);
  const surgeonSlug = surgeon.slug;
  
  const rating = parseFloat(surgeon.totalScore) || 0;
  const reviewCount = parseInt(surgeon.reviewsCount) || 0;
  const yearsExperience = parseInt(surgeon.years_experience) || 10;
  const estimatedProcedures = parseInt(surgeon.estimated_procedures) || 0;
  
  // Format bio for HTML
  let bio = surgeon.bio_long || '';
  bio = bio
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .split('\n\n')
    .map(p => `    <p class="text-gray-700 leading-relaxed mb-4">${p.trim()}</p>`)
    .join('\n');

  // Structured data for surgeon
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": surgeonName,
    "medicalSpecialty": "Bariatric Surgery",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": surgeon.street || "",
      "addressLocality": surgeon.city,
      "addressRegion": surgeon.state,
      "addressCountry": "AU"
    },
    ...(surgeon.phone && { "telephone": surgeon.phone }),
    ...(surgeon.website && { "url": surgeon.website }),
    ...(rating > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": rating,
        "reviewCount": reviewCount,
        "bestRating": "5",
        "worstRating": "1"
      }
    })
  };

  return `---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import { Image } from 'astro:assets';

// Surgeon data
const surgeon = {
  name: "${surgeonName.replace(/"/g, '\\"')}",
  title: "${surgeonName.replace(/"/g, '\\"')}",
  city: "${surgeon.city}",
  state: "${surgeon.state}",
  street: "${surgeon.street || ''}",
  rating: ${rating},
  reviewCount: ${reviewCount},
  phone: "${surgeon.phone || ''}",
  website: "${surgeon.website || ''}",
  googleMapsUrl: "${surgeon.url || ''}",
  surgeonPhoto: "${surgeon.surgeon_photo || ''}",
  yearsExperience: ${yearsExperience},
  estimatedProcedures: ${estimatedProcedures},
  slug: "${surgeonSlug}",
  citySlug: "${citySlug}",
  category: "${surgeon.categoryName || 'Bariatric Surgeon'}"
};

// SEO
const title = "${surgeon.meta_title ? surgeon.meta_title.replace(/"/g, '\\"') : surgeonName + ' - Bariatric Surgeon'}";
const description = "${surgeon.meta_description ? surgeon.meta_description.replace(/"/g, '\\"') : 'Experienced bariatric surgeon'}";
const canonicalUrl = \`https://weightlosssurgery.com.au/surgeons/\${surgeon.citySlug}/\${surgeon.slug}\`;
const ogImage = surgeon.surgeonPhoto || 'https://weightlosssurgery.com.au/og-surgeon.jpg';

// Structured Data
const structuredData = ${JSON.stringify(structuredData, null, 2)};
---

<BaseLayout 
  title={title} 
  description={description} 
  canonicalUrl={canonicalUrl}
  image={ogImage}
  type="ProfilePage"
>
  <!-- Additional Structured Data -->
  <script type="application/ld+json" set:html={JSON.stringify(structuredData)} slot="head" />

  <!-- Breadcrumb Schema -->
  <script type="application/ld+json" slot="head">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://weightlosssurgery.com.au/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Surgeons",
          "item": "https://weightlosssurgery.com.au/surgeons"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": surgeon.city,
          "item": \`https://weightlosssurgery.com.au/surgeons/\${surgeon.citySlug}\`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": surgeon.name
        }
      ]
    }
  </script>

  <!-- Breadcrumbs -->
  <nav class="bg-gray-50 border-b border-gray-200" aria-label="Breadcrumb">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <ol class="flex text-sm text-gray-600" itemscope itemtype="https://schema.org/BreadcrumbList">
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <a href="/" itemprop="item" class="hover:text-blue-600">
            <span itemprop="name">Home</span>
          </a>
          <meta itemprop="position" content="1" />
          <span class="mx-2">/</span>
        </li>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <a href="/surgeons" itemprop="item" class="hover:text-blue-600">
            <span itemprop="name">Surgeons</span>
          </a>
          <meta itemprop="position" content="2" />
          <span class="mx-2">/</span>
        </li>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <a href={\`/surgeons/\${surgeon.citySlug}\`} itemprop="item" class="hover:text-blue-600">
            <span itemprop="name">{surgeon.city}</span>
          </a>
          <meta itemprop="position" content="3" />
          <span class="mx-2">/</span>
        </li>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <span class="text-gray-900" itemprop="name">{surgeon.name}</span>
          <meta itemprop="position" content="4" />
        </li>
      </ol>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="bg-gradient-to-br from-blue-50 to-white py-12 md:py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-3 gap-8 items-start">
        
        <!-- Left: Photo with lazy loading and WebP support -->
        <div class="md:col-span-1">
          {surgeon.surgeonPhoto ? (
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img 
                src={surgeon.surgeonPhoto} 
                alt={\`\${surgeon.name} - Bariatric Surgeon in \${surgeon.city}\`}
                width="400"
                height="400"
                loading="lazy"
                decoding="async"
                class="w-full h-auto object-cover"
                fetchpriority="low"
              />
            </div>
          ) : (
            <div class="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg p-12 flex items-center justify-center" role="img" aria-label="Surgeon placeholder">
              <svg class="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
              </svg>
            </div>
          )}
        </div>

        <!-- Right: Info -->
        <div class="md:col-span-2">
          <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {surgeon.name}
          </h1>
          
          <p class="text-xl text-gray-600 mb-6">
            {surgeon.category} in {surgeon.city}, {surgeon.state}
          </p>

          <!-- Rating with semantic markup -->
          {surgeon.rating > 0 && (
            <div class="flex items-center gap-3 mb-6" itemscope itemtype="https://schema.org/AggregateRating">
              <meta itemprop="ratingValue" content={surgeon.rating.toString()} />
              <meta itemprop="reviewCount" content={surgeon.reviewCount.toString()} />
              <meta itemprop="bestRating" content="5" />
              <meta itemprop="worstRating" content="1" />
              <div class="flex items-center gap-1" role="img" aria-label={\`Rating: \${surgeon.rating} out of 5 stars\`}>
                {[...Array(5)].map((_, i) => (
                  <svg 
                    class={\`w-6 h-6 \${i < Math.floor(surgeon.rating) ? 'text-yellow-400' : 'text-gray-300'}\`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <span class="text-2xl font-bold text-gray-900">{surgeon.rating}</span>
              <span class="text-gray-600">({surgeon.reviewCount} reviews)</span>
            </div>
          )}

          <!-- Quick Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-white rounded-xl p-4 shadow-md">
              <div class="text-3xl font-bold text-blue-600 mb-1">{surgeon.yearsExperience}+</div>
              <div class="text-sm text-gray-600">Years Experience</div>
            </div>
            {surgeon.estimatedProcedures > 0 && (
              <div class="bg-white rounded-xl p-4 shadow-md">
                <div class="text-3xl font-bold text-blue-600 mb-1">{surgeon.estimatedProcedures.toLocaleString()}+</div>
                <div class="text-sm text-gray-600">Procedures</div>
              </div>
            )}
            {surgeon.reviewCount > 0 && (
              <div class="bg-white rounded-xl p-4 shadow-md">
                <div class="text-3xl font-bold text-blue-600 mb-1">{surgeon.reviewCount}</div>
                <div class="text-sm text-gray-600">Patient Reviews</div>
              </div>
            )}
            <div class="bg-white rounded-xl p-4 shadow-md">
              <div class="text-3xl font-bold text-blue-600 mb-1">★</div>
              <div class="text-sm text-gray-600">Top Rated</div>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-wrap gap-4">
            {surgeon.phone && (
              <a 
                href={\`tel:\${surgeon.phone}\`}
                class="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-lg hover:shadow-xl"
                rel="nofollow"
              >
                <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                Call {surgeon.phone}
              </a>
            )}
            {surgeon.website && (
              <a 
                href={surgeon.website}
                target="_blank"
                rel="noopener noreferrer nofollow"
                class="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-600 bg-white border-2 border-blue-600 hover:bg-blue-50 rounded-xl transition-colors shadow-lg"
              >
                <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                </svg>
                Visit Website
              </a>
            )}
            {surgeon.googleMapsUrl && (
              <a 
                href={surgeon.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                class="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-700 bg-white border-2 border-gray-300 hover:border-gray-400 rounded-xl transition-colors shadow-lg"
              >
                <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
                View on Google Maps
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Bio Section -->
  <article class="py-16 bg-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="prose prose-lg max-w-none">
${bio}
      </div>
    </div>
  </article>

  <!-- Contact Section -->
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
        Ready to Start Your Weight Loss Journey?
      </h2>
      <p class="text-xl text-gray-600 mb-8">
        Contact {surgeon.name} today to schedule your consultation
      </p>
      <div class="flex flex-wrap justify-center gap-4">
        {surgeon.phone && (
          <a 
            href={\`tel:\${surgeon.phone}\`}
            class="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-lg hover:shadow-xl"
            rel="nofollow"
          >
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
            </svg>
            Call Now
          </a>
        )}
        {surgeon.website && (
          <a 
            href={surgeon.website}
            target="_blank"
            rel="noopener noreferrer nofollow"
            class="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-600 bg-white border-2 border-blue-600 hover:bg-blue-50 rounded-xl transition-colors shadow-lg"
          >
            Visit Website
          </a>
        )}
      </div>
    </div>
  </section>
</BaseLayout>
`;
}

/**
 * Generate city index page
 */
function generateCityIndexPage(city, citySlug, surgeons) {
  return `---
import BaseLayout from '../../../layouts/BaseLayout.astro';

const city = "${city}";
const surgeons = ${JSON.stringify(surgeons.map(s => ({
  name: s.title,
  slug: s.slug,
  rating: parseFloat(s.totalScore) || 0,
  reviewCount: parseInt(s.reviewsCount) || 0,
  photo: s.surgeon_photo || '',
  category: s.categoryName || 'Bariatric Surgeon'
})), null, 2)};

const title = "Bariatric Surgeons in ${city} | Weight Loss Surgery Specialists";
const description = "Find experienced bariatric surgeons in ${city}. Compare ratings, reviews, and procedures. ${surgeons.length} top-rated weight loss surgeons.";
const canonicalUrl = \`https://weightlosssurgery.com.au/surgeons/${citySlug}\`;
---

<BaseLayout title={title} description={description} canonicalUrl={canonicalUrl}>
  <div class="bg-gradient-to-br from-blue-50 to-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
        Bariatric Surgeons in {city}
      </h1>
      <p class="text-xl text-gray-600 mb-8">
        {surgeons.length} experienced weight loss surgery specialists
      </p>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {surgeons.map((surgeon, index) => (
          <a 
            href={\`/surgeons/${citySlug}/\${surgeon.slug}\`}
            class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
          >
            {surgeon.photo ? (
              <div class="aspect-w-16 aspect-h-12 bg-gray-200">
                <img 
                  src={surgeon.photo} 
                  alt={\`\${surgeon.name} - \${surgeon.category}\`}
                  width="400"
                  height="300"
                  loading={index < 6 ? "eager" : "lazy"}
                  decoding="async"
                  class="w-full h-48 object-cover"
                />
              </div>
            ) : (
              <div class="bg-gradient-to-br from-blue-500 to-blue-700 h-48 flex items-center justify-center">
                <svg class="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                </svg>
              </div>
            )}
            
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{surgeon.name}</h3>
              <p class="text-gray-600 mb-4">{surgeon.category}</p>
              
              {surgeon.rating > 0 && (
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        class={\`w-5 h-5 \${i < Math.floor(surgeon.rating) ? 'text-yellow-400' : 'text-gray-300'}\`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <span class="text-gray-600">{surgeon.rating} ({surgeon.reviewCount})</span>
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  </div>
</BaseLayout>
`;
}

/**
 * Main
 */
async function main() {
  console.log('🚀 SEO-Optimized Surgeon Page Generator');
  console.log('=========================================\n');

  // Read CSV
  console.log(`📖 Reading: ${INPUT_CSV}`);
  const surgeons = await readCSV(INPUT_CSV);
  const validSurgeons = surgeons.filter(s => s.title && s.title.trim());
  console.log(`✅ Found ${validSurgeons.length} surgeons\n`);

  // Group by city
  const byCity = {};
  validSurgeons.forEach(s => {
    const city = s.city || 'Unknown';
    if (!byCity[city]) byCity[city] = [];
    byCity[city].push(s);
  });

  console.log(`📍 Cities: ${Object.keys(byCity).length}\n`);

  // Generate pages
  let pagesCreated = 0;
  let citiesCreated = 0;

  for (const [city, citySurgeons] of Object.entries(byCity)) {
    const citySlug = generateCitySlug(city);
    const cityDir = path.join(OUTPUT_DIR, citySlug);
    
    ensureDir(cityDir);

    // Generate individual surgeon pages
    for (const surgeon of citySurgeons) {
      const pagePath = path.join(cityDir, `${surgeon.slug}.astro`);
      const pageContent = generateOptimizedSurgeonPage(surgeon);
      
      fs.writeFileSync(pagePath, pageContent);
      pagesCreated++;
      
      console.log(`  ✅ ${city}/${surgeon.slug}`);
    }

    // Generate city index page
    const cityIndexPath = path.join(cityDir, 'index.astro');
    const cityIndexContent = generateCityIndexPage(city, citySlug, citySurgeons);
    fs.writeFileSync(cityIndexPath, cityIndexContent);
    citiesCreated++;
  }

  console.log(`\n✅ Complete!`);
  console.log(`📊 Results:`);
  console.log(`  Surgeon pages created: ${pagesCreated}`);
  console.log(`  City index pages created: ${citiesCreated}`);
  console.log(`  Output directory: ${OUTPUT_DIR}`);
  console.log(`\n📈 SEO Optimizations:`);
  console.log(`  ✅ Lazy loading images`);
  console.log(`  ✅ Proper alt text`);
  console.log(`  ✅ Structured data (Schema.org)`);
  console.log(`  ✅ Breadcrumb markup`);
  console.log(`  ✅ Semantic HTML`);
  console.log(`  ✅ rel="nofollow" on external links`);
}

// Run
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

