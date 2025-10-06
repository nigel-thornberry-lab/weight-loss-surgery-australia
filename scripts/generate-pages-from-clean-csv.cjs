/**
 * Generate Surgeon Pages from Cleaned CSV
 * Creates individual surgeon profile pages and city index pages
 */

const fs = require('fs');
const path = require('path');

const INPUT_CSV = 'surgeons-with-bios.csv';
const OUTPUT_DIR = 'src/pages/surgeons';

// Parse CSV with proper quote handling
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, '')); // Remove surrounding quotes
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ''));
  
  return result;
}

// Slug generation helper
function generateCitySlug(city) {
  return city
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Generate surgeon profile page
function generateSurgeonPage(surgeon, citySlug) {
  const escapedBio = surgeon.bio_long.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  
  return `---
import BaseLayout from '../../../layouts/BaseLayout.astro';

// Surgeon data
const surgeon = {
  name: "${surgeon.surgeon_name}",
  title: "${surgeon.surgeon_name}",
  city: "${surgeon.city}",
  state: "${surgeon.state}",
  street: "${surgeon.street}",
  rating: ${surgeon.rating},
  reviewCount: ${surgeon.review_count},
  phone: "${surgeon.phone}",
  website: "${surgeon.website}",
  googleMapsUrl: "${surgeon.google_maps_url}",
  surgeonPhoto: "${surgeon.surgeon_photo || ''}",
  yearsExperience: ${surgeon.years_experience},
  estimatedProcedures: ${surgeon.estimated_procedures},
  slug: "${surgeon.slug}",
  citySlug: "${citySlug}",
  category: "${surgeon.category}",
  qualifications: "${surgeon.qualifications}",
  procedures: "${surgeon.procedures}"
};

// SEO
const title = "${surgeon.meta_title}";
const description = "${surgeon.meta_description}";
const canonicalUrl = \`https://weightlosssurgery.com.au/surgeons/\${surgeon.citySlug}/\${surgeon.slug}\`;
---

<BaseLayout title={title} description={description} canonicalUrl={canonicalUrl}>
  <!-- Breadcrumb -->
  <nav class="bg-gray-50 border-b border-gray-200" aria-label="Breadcrumb">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <ol class="flex items-center space-x-2 text-sm">
        <li><a href="/" class="text-blue-600 hover:text-blue-800">Home</a></li>
        <li class="text-gray-500">/</li>
        <li><a href="/surgeons" class="text-blue-600 hover:text-blue-800">Surgeons</a></li>
        <li class="text-gray-500">/</li>
        <li><a href={\`/surgeons/\${surgeon.citySlug}\`} class="text-blue-600 hover:text-blue-800">{surgeon.city}</a></li>
        <li class="text-gray-500">/</li>
        <li class="text-gray-900 font-medium">{surgeon.name}</li>
      </ol>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="bg-gradient-to-br from-blue-50 to-white py-12 md:py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-3 gap-8 items-start">
        
        <!-- Left: Photo -->
        <div class="md:col-span-1">
          {surgeon.surgeonPhoto ? (
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img 
                src={surgeon.surgeonPhoto} 
                alt={surgeon.name}
                class="w-full h-auto object-cover"
                loading="eager"
                width="400"
                height="400"
              />
            </div>
          ) : (
            <div class="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg p-12 flex items-center justify-center aspect-square">
              <svg class="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
              </svg>
            </div>
          )}
          
          <!-- Quick Stats -->
          <div class="mt-6 bg-white rounded-xl shadow-md p-6 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Rating</span>
              <span class="font-semibold text-lg">⭐ {surgeon.rating > 0 ? surgeon.rating.toFixed(1) : 'N/A'}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Reviews</span>
              <span class="font-semibold">{surgeon.reviewCount} reviews</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Experience</span>
              <span class="font-semibold">{surgeon.yearsExperience}+ years</span>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="mt-6 space-y-3">
            {surgeon.website && (
              <a 
                href={surgeon.website}
                target="_blank"
                rel="noopener noreferrer nofollow"
                class="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
              >
                Visit Website
              </a>
            )}
            {surgeon.googleMapsUrl && (
              <a 
                href={surgeon.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                class="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
              >
                View on Google Maps
              </a>
            )}
            {surgeon.phone && (
              <a 
                href={\`tel:\${surgeon.phone}\`}
                class="block w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
              >
                📞 Call Now
              </a>
            )}
          </div>
        </div>

        <!-- Right: Main Content -->
        <div class="md:col-span-2 space-y-8">
          
          <!-- Header -->
          <div>
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              {surgeon.name}
            </h1>
            <p class="text-xl text-gray-600 mb-4">{surgeon.category}</p>
            <div class="flex flex-wrap gap-2">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                📍 {surgeon.city}, {surgeon.state}
              </span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                ⭐ {surgeon.rating > 0 ? surgeon.rating.toFixed(1) : 'New'} ({surgeon.reviewCount} reviews)
              </span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                🎓 {surgeon.qualifications}
              </span>
            </div>
          </div>

          <!-- About Section -->
          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">About {surgeon.name}</h2>
            <div class="prose prose-lg max-w-none text-gray-700">
              <p>${escapedBio}</p>
            </div>
          </div>

          <!-- Procedures Offered -->
          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Procedures Offered</h2>
            <div class="grid sm:grid-cols-2 gap-3">
              {surgeon.procedures.split(',').map((proc) => (
                <div class="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                  <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="font-medium text-gray-900">{proc.trim().split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                </div>
              ))}
            </div>
          </div>

          <!-- Contact Information -->
          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div class="space-y-3">
              <div class="flex items-start space-x-3">
                <svg class="w-6 h-6 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <div>
                  <p class="font-medium text-gray-900">{surgeon.street}</p>
                  <p class="text-gray-600">{surgeon.city}, {surgeon.state}</p>
                </div>
              </div>
              {surgeon.phone && (
                <div class="flex items-center space-x-3">
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <a href={\`tel:\${surgeon.phone}\`} class="text-blue-600 hover:text-blue-800 font-medium">
                    {surgeon.phone}
                  </a>
                </div>
              )}
              {surgeon.website && (
                <div class="flex items-center space-x-3">
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                  </svg>
                  <a href={surgeon.website} target="_blank" rel="noopener noreferrer nofollow" class="text-blue-600 hover:text-blue-800 font-medium">
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>

  <!-- Bottom CTA -->
  <section class="bg-blue-600 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl font-bold text-white mb-4">
        Ready to Start Your Weight Loss Journey?
      </h2>
      <p class="text-xl text-blue-100 mb-8">
        Contact {surgeon.name} today to schedule your consultation
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        {surgeon.phone && (
          <a 
            href={\`tel:\${surgeon.phone}\`}
            class="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            📞 Call Now
          </a>
        )}
        {surgeon.website && (
          <a 
            href={surgeon.website}
            target="_blank"
            rel="noopener noreferrer nofollow"
            class="inline-flex items-center justify-center px-8 py-4 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-colors"
          >
            Visit Website →
          </a>
        )}
      </div>
    </div>
  </section>
</BaseLayout>
`;
}

// Generate city index page
function generateCityIndex(city, surgeons, citySlug) {
  const surgeonsList = surgeons.map(s => {
    const escapedName = s.surgeon_name.replace(/`/g, '\\`');
    const escapedBio = s.bio_long.substring(0, 200).replace(/`/g, '\\`').replace(/\$/g, '\\$');
    
    return `    {
      name: "${escapedName}",
      slug: "${s.slug}",
      rating: ${s.rating},
      reviewCount: ${s.review_count},
      street: "${s.street}",
      phone: "${s.phone}",
      website: "${s.website}",
      yearsExperience: ${s.years_experience},
      procedures: "${s.procedures}",
      bio: "${escapedBio}...",
      photo: "${s.surgeon_photo || ''}"
    }`;
  }).join(',\n');

  return `---
import BaseLayout from '../../../layouts/BaseLayout.astro';

const city = "${city}";
const citySlug = "${citySlug}";

const surgeons = [
${surgeonsList}
];

const title = "Bariatric Surgeons in ${city} | Weight Loss Surgery Specialists";
const description = "Find experienced bariatric surgeons in ${city}. Compare ${surgeons.length} qualified weight loss surgery specialists offering gastric sleeve, bypass, and band procedures.";
const canonicalUrl = \`https://weightlosssurgery.com.au/surgeons/\${citySlug}\`;
---

<BaseLayout title={title} description={description} canonicalUrl={canonicalUrl}>
  <!-- Breadcrumb -->
  <nav class="bg-gray-50 border-b border-gray-200" aria-label="Breadcrumb">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <ol class="flex items-center space-x-2 text-sm">
        <li><a href="/" class="text-blue-600 hover:text-blue-800">Home</a></li>
        <li class="text-gray-500">/</li>
        <li><a href="/surgeons" class="text-blue-600 hover:text-blue-800">Surgeons</a></li>
        <li class="text-gray-500">/</li>
        <li class="text-gray-900 font-medium">{city}</li>
      </ol>
    </div>
  </nav>

  <!-- Header -->
  <section class="bg-gradient-to-br from-blue-50 to-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Bariatric Surgeons in {city}
      </h1>
      <p class="text-xl text-gray-600">
        {surgeons.length} experienced weight loss surgery specialists in your area
      </p>
    </div>
  </section>

  <!-- Surgeons Grid -->
  <section class="py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {surgeons.map((surgeon) => (
          <article class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <a href={\`/surgeons/\${citySlug}/\${surgeon.slug}\`} class="block">
              {surgeon.photo ? (
                <img 
                  src={surgeon.photo} 
                  alt={surgeon.name}
                  class="w-full h-64 object-cover"
                  loading="lazy"
                  width="400"
                  height="256"
                />
              ) : (
                <div class="w-full h-64 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <svg class="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                  </svg>
                </div>
              )}
            </a>
            
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                <a href={\`/surgeons/\${citySlug}/\${surgeon.slug}\`} class="hover:text-blue-600">
                  {surgeon.name}
                </a>
              </h3>
              
              <div class="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <span class="flex items-center">
                  ⭐ {surgeon.rating > 0 ? surgeon.rating.toFixed(1) : 'New'}
                </span>
                <span>{surgeon.reviewCount} reviews</span>
                <span>{surgeon.yearsExperience}+ years</span>
              </div>
              
              <p class="text-gray-700 mb-4 line-clamp-3">
                {surgeon.bio}
              </p>
              
              <div class="space-y-2">
                <p class="text-sm text-gray-600 flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  </svg>
                  {surgeon.street}
                </p>
                {surgeon.phone && (
                  <p class="text-sm text-gray-600 flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    {surgeon.phone}
                  </p>
                )}
              </div>
              
              <a 
                href={\`/surgeons/\${citySlug}/\${surgeon.slug}\`}
                class="mt-4 block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors"
              >
                View Profile
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
</BaseLayout>
`;
}

async function generatePages() {
  console.log('🔄 Generating surgeon pages from cleaned CSV...\n');
  
  // Read CSV
  const content = fs.readFileSync(INPUT_CSV, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    console.error('❌ CSV file is empty!');
    process.exit(1);
  }
  
  const headers = parseCSVLine(lines[0]);
  console.log(`📊 Processing ${lines.length - 1} surgeons...\n`);
  
  // Parse all surgeons
  const surgeons = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < headers.length) continue;
    
    const surgeon = {};
    headers.forEach((header, index) => {
      surgeon[header] = values[index] || '';
    });
    
    // Type conversions
    surgeon.rating = parseFloat(surgeon.rating) || 0;
    surgeon.review_count = parseInt(surgeon.review_count) || 0;
    surgeon.years_experience = parseInt(surgeon.years_experience) || 10;
    surgeon.estimated_procedures = parseInt(surgeon.estimated_procedures) || 0;
    
    if (surgeon.surgeon_name && surgeon.city) {
      surgeons.push(surgeon);
    }
  }
  
  console.log(`✅ Parsed ${surgeons.length} valid surgeon profiles\n`);
  
  // Group by city
  const citiesMap = new Map();
  surgeons.forEach(surgeon => {
    const city = surgeon.city;
    if (!citiesMap.has(city)) {
      citiesMap.set(city, []);
    }
    citiesMap.get(city).push(surgeon);
  });
  
  console.log(`📍 Found ${citiesMap.size} cities\n`);
  
  // Generate pages
  let profileCount = 0;
  let cityCount = 0;
  
  for (const [city, citySurgeons] of citiesMap.entries()) {
    const citySlug = generateCitySlug(city);
    const cityDir = path.join(OUTPUT_DIR, citySlug);
    
    // Create city directory
    if (!fs.existsSync(cityDir)) {
      fs.mkdirSync(cityDir, { recursive: true });
    }
    
    // Generate city index page
    const cityIndexPath = path.join(cityDir, 'index.astro');
    fs.writeFileSync(cityIndexPath, generateCityIndex(city, citySurgeons, citySlug));
    cityCount++;
    console.log(`✅ Generated city index: ${city} (${citySurgeons.length} surgeons)`);
    
    // Generate individual surgeon pages
    for (const surgeon of citySurgeons) {
      const surgeonPath = path.join(cityDir, `${surgeon.slug}.astro`);
      fs.writeFileSync(surgeonPath, generateSurgeonPage(surgeon, citySlug));
      profileCount++;
    }
  }
  
  // Generate main surgeons index
  const mainIndexPath = path.join(OUTPUT_DIR, 'index.astro');
  const allCities = Array.from(citiesMap.entries())
    .map(([city, srgns]) => ({
      name: city,
      slug: generateCitySlug(city),
      count: srgns.length
    }))
    .sort((a, b) => b.count - a.count);
  
  const mainIndex = `---
import BaseLayout from '../../layouts/BaseLayout.astro';

const cities = ${JSON.stringify(allCities, null, 2)};

const title = "Find Bariatric Surgeons in Australia | Weight Loss Surgery Specialists";
const description = "Browse experienced bariatric surgeons across Australia. Compare qualifications, reviews, and procedures for gastric sleeve, bypass, and band surgery.";
const canonicalUrl = "https://weightlosssurgery.com.au/surgeons";
---

<BaseLayout title={title} description={description} canonicalUrl={canonicalUrl}>
  <section class="bg-gradient-to-br from-blue-50 to-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
        Find Your Bariatric Surgeon
      </h1>
      <p class="text-xl text-gray-600 text-center mb-8">
        Browse experienced weight loss surgery specialists by location
      </p>
      
      <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
        {cities.map((city) => (
          <a 
            href={\`/surgeons/\${city.slug}\`}
            class="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 text-center"
          >
            <h2 class="text-xl font-bold text-gray-900 mb-2">{city.name}</h2>
            <p class="text-gray-600">{city.count} {city.count === 1 ? 'surgeon' : 'surgeons'}</p>
          </a>
        ))}
      </div>
    </div>
  </section>
</BaseLayout>
`;
  
  fs.writeFileSync(mainIndexPath, mainIndex);
  
  console.log(`\n✅ SUCCESS!`);
  console.log(`📄 Generated ${profileCount} surgeon profiles`);
  console.log(`📍 Generated ${cityCount} city pages`);
  console.log(`🏠 Generated main index page`);
  console.log(`\n📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`\nNext: npm run build`);
}

generatePages().catch(err => {
  console.error('❌ Error:', err.message);
  console.error(err.stack);
  process.exit(1);
});

