const fs = require('fs');
const path = require('path');

const BASE_CSV = 'surgeons-with-bios.csv';
const ENHANCED_DATA = 'surgeon-enhanced-data-fixed.json';
const SEO_DATA = 'surgeon-complete-seo-data-clean.json';
const OUTPUT_DIR = 'src/pages/surgeons';

const enhancedData = fs.existsSync(ENHANCED_DATA) ? JSON.parse(fs.readFileSync(ENHANCED_DATA, 'utf-8')) : {};
const seoData = fs.existsSync(SEO_DATA) ? JSON.parse(fs.readFileSync(SEO_DATA, 'utf-8')) : {};

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Enhanced profile with components
function generateEnhancedProfile(surgeon, enhanced, seo) {
  const slug = surgeon.slug;
  const citySlug = surgeon.city.toLowerCase().replace(/\s+/g, '-');
  
  return `---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import CredentialsSection from '../../../components/surgeons/CredentialsSection.astro';
import FAQSection from '../../../components/surgeons/FAQSection.astro';
import TeamSection from '../../../components/surgeons/TeamSection.astro';
import HospitalsSection from '../../../components/surgeons/HospitalsSection.astro';
import PricingSection from '../../../components/surgeons/PricingSection.astro';

const surgeon = ${JSON.stringify(surgeon, null, 2)};
const citySlug = "${citySlug}";
const slug = "${slug}";
const enhanced = ${JSON.stringify(enhanced || {}, null, 2)};
const seo = ${JSON.stringify(seo || {}, null, 2)};

const title = \`\${surgeon.name} - Bariatric Surgeon \${surgeon.city} | Weight Loss Surgery\`;
const description = \`\${surgeon.name} is a leading bariatric surgeon in \${surgeon.city} with \${surgeon.years_experience}+ years experience. Rating: \${surgeon.rating}/5. Specialist in gastric sleeve, bypass & revision surgery.\`;
const canonicalUrl = \`https://weightlosssurgery.com.au/surgeons/\${citySlug}/\${slug}\`;
---

<BaseLayout title={title} description={description} canonicalUrl={canonicalUrl}>
  <main class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b border-gray-200 py-3">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center space-x-2 text-sm">
          <a href="/" class="text-blue-600 hover:text-blue-800">Home</a>
          <span class="text-gray-400">/</span>
          <a href="/surgeons" class="text-blue-600 hover:text-blue-800">Surgeons</a>
          <span class="text-gray-400">/</span>
          <a href={\`/surgeons/\${citySlug}\`} class="text-blue-600 hover:text-blue-800">{surgeon.city}</a>
          <span class="text-gray-400">/</span>
          <span class="text-gray-700">{surgeon.name}</span>
        </div>
      </div>
    </nav>

    <section class="bg-gradient-to-br from-blue-50 to-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-3 gap-8">
          <div class="md:col-span-1">
            {surgeon.surgeon_photo ? (
              <img src={surgeon.surgeon_photo} alt={surgeon.name} class="w-full rounded-2xl shadow-lg" loading="lazy" />
            ) : (
              <div class="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg p-12 flex items-center justify-center">
                <svg class="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                </svg>
              </div>
            )}
          </div>
          
          <div class="md:col-span-2">
            <h1 class="text-4xl font-bold text-gray-900 mb-3">{surgeon.name}</h1>
            <p class="text-xl text-gray-600 mb-4">{surgeon.category} • {surgeon.city}, {surgeon.state}</p>
            
            <div class="flex items-center gap-4 mb-6">
              {surgeon.rating > 0 && (
                <div class="flex items-center gap-2">
                  <div class="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <svg class={\`w-5 h-5 \${i < Math.floor(surgeon.rating) ? 'text-yellow-400' : 'text-gray-300'}\`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <span class="font-semibold text-gray-900">{surgeon.rating}</span>
                  <span class="text-gray-600">({surgeon.review_count} reviews)</span>
                </div>
              )}
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div class="bg-white rounded-lg p-4 shadow">
                <p class="text-sm text-gray-600">Experience</p>
                <p class="text-2xl font-bold text-blue-600">{surgeon.years_experience}+ years</p>
              </div>
              <div class="bg-white rounded-lg p-4 shadow">
                <p class="text-sm text-gray-600">Procedures</p>
                <p class="text-2xl font-bold text-blue-600">{surgeon.estimated_procedures}+</p>
              </div>
            </div>

            <div class="flex flex-wrap gap-3">
              {surgeon.phone && <a href={\`tel:\${surgeon.phone}\`} class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Call Now</a>}
              {surgeon.website && <a href={surgeon.website} target="_blank" rel="noopener" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors">Visit Website</a>}
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div class="bg-white rounded-xl p-6 shadow-lg">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">About {surgeon.name}</h2>
        <p class="text-gray-700 leading-relaxed">{surgeon.bio_long}</p>
      </div>

      {seo.credentials && <CredentialsSection credentials={seo.credentials} />}
      {enhanced.team && <TeamSection team={enhanced.team} />}
      {enhanced.hospitals && <HospitalsSection hospitals={enhanced.hospitals} />}
      {enhanced.pricing && <PricingSection pricing={enhanced.pricing} />}
      {seo.faqs && <FAQSection faqs={seo.faqs} />}
    </div>
  </main>
</BaseLayout>
`;
}

// Basic profile without enhanced components
function generateBasicProfile(surgeon) {
  const slug = surgeon.slug;
  const citySlug = surgeon.city.toLowerCase().replace(/\s+/g, '-');
  
  return `---
import BaseLayout from '../../../layouts/BaseLayout.astro';

const surgeon = ${JSON.stringify(surgeon, null, 2)};

const title = \`\${surgeon.name} - Bariatric Surgeon \${surgeon.city} | Weight Loss Surgery\`;
const description = \`\${surgeon.name} is an experienced bariatric surgeon in \${surgeon.city} with \${surgeon.years_experience}+ years experience. Rating: \${surgeon.rating}/5 (\${surgeon.review_count} reviews). Specialist in gastric sleeve, bypass & band surgery.\`;
const canonicalUrl = \`https://weightlosssurgery.com.au/surgeons/${citySlug}/${slug}\`;
---

<BaseLayout title={title} description={description} canonicalUrl={canonicalUrl}>
  <main class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b border-gray-200 py-3">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center space-x-2 text-sm">
          <a href="/" class="text-blue-600 hover:text-blue-800">Home</a>
          <span class="text-gray-400">/</span>
          <a href="/surgeons" class="text-blue-600 hover:text-blue-800">Surgeons</a>
          <span class="text-gray-400">/</span>
          <a href="/surgeons/${citySlug}" class="text-blue-600 hover:text-blue-800">{surgeon.city}</a>
          <span class="text-gray-400">/</span>
          <span class="text-gray-700">{surgeon.name}</span>
        </div>
      </div>
    </nav>

    <section class="bg-gradient-to-br from-blue-50 to-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-3 gap-8">
          <div class="md:col-span-1">
            {surgeon.surgeon_photo ? (
              <img src={surgeon.surgeon_photo} alt={surgeon.name} class="w-full rounded-2xl shadow-lg" loading="lazy" />
            ) : (
              <div class="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg p-12 flex items-center justify-center">
                <svg class="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                </svg>
              </div>
            )}
          </div>
          
          <div class="md:col-span-2">
            <h1 class="text-4xl font-bold text-gray-900 mb-3">{surgeon.name}</h1>
            <p class="text-xl text-gray-600 mb-4">{surgeon.category} • {surgeon.city}, {surgeon.state}</p>
            
            {surgeon.rating > 0 && (
              <div class="flex items-center gap-4 mb-6">
                <div class="flex items-center gap-2">
                  <div class="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <svg class={\`w-5 h-5 \${i < Math.floor(surgeon.rating) ? 'text-yellow-400' : 'text-gray-300'}\`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <span class="font-semibold text-gray-900">{surgeon.rating}</span>
                  <span class="text-gray-600">({surgeon.review_count} reviews)</span>
                </div>
              </div>
            )}

            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-white rounded-lg p-4 shadow">
                <p class="text-sm text-gray-600">Experience</p>
                <p class="text-2xl font-bold text-blue-600">{surgeon.years_experience}+ years</p>
              </div>
              <div class="bg-white rounded-lg p-4 shadow">
                <p class="text-sm text-gray-600">Est. Procedures</p>
                <p class="text-2xl font-bold text-blue-600">{surgeon.estimated_procedures}+</p>
              </div>
            </div>

            <div class="flex flex-wrap gap-3">
              {surgeon.phone && <a href={\`tel:\${surgeon.phone}\`} class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Call Now</a>}
              {surgeon.website && <a href={surgeon.website} target="_blank" rel="noopener" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors">Visit Website</a>}
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-xl p-6 shadow-lg">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">About {surgeon.name}</h2>
        <p class="text-gray-700 leading-relaxed">{surgeon.bio_long}</p>
      </div>
    </div>
  </main>
</BaseLayout>
`;
}

function generateCityIndex(citySlug, cityName, surgeons) {
  return `---
import BaseLayout from '../../../layouts/BaseLayout.astro';

const surgeons = ${JSON.stringify(surgeons, null, 2)};
const cityName = "${cityName}";

const title = \`Bariatric Surgeons in \${cityName} | Weight Loss Surgery\`;
const description = \`Find top-rated bariatric surgeons in \${cityName}. Compare \${surgeons.length} specialists for gastric sleeve, bypass, and band surgery.\`;
const canonicalUrl = \`https://weightlosssurgery.com.au/surgeons/${citySlug}\`;
---

<BaseLayout title={title} description={description} canonicalUrl={canonicalUrl}>
  <main class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b border-gray-200 py-3">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center space-x-2 text-sm">
          <a href="/" class="text-blue-600 hover:text-blue-800">Home</a>
          <span class="text-gray-400">/</span>
          <a href="/surgeons" class="text-blue-600 hover:text-blue-800">Surgeons</a>
          <span class="text-gray-400">/</span>
          <span class="text-gray-700">{cityName}</span>
        </div>
      </div>
    </nav>

    <section class="bg-gradient-to-br from-blue-50 to-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Bariatric Surgeons in {cityName}</h1>
        <p class="text-xl text-gray-600">Find and compare {surgeons.length} weight loss surgeon{surgeons.length !== 1 ? 's' : ''} in {cityName}</p>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {surgeons.map(s => (
          <a href={\`/surgeons/${citySlug}/\${s.slug}\`} class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h2 class="text-xl font-bold text-gray-900 mb-2">{s.name}</h2>
            <p class="text-gray-600 mb-3">{s.category}</p>
            {s.rating > 0 && (
              <div class="flex items-center gap-2 mb-3">
                <div class="flex">
                  {Array(5).fill(0).map((_, i) => (
                    <svg class={\`w-4 h-4 \${i < Math.floor(s.rating) ? 'text-yellow-400' : 'text-gray-300'}\`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <span class="text-sm font-semibold text-gray-900">{s.rating}</span>
                <span class="text-sm text-gray-600">({s.review_count})</span>
              </div>
            )}
            <div class="flex gap-2 text-sm text-gray-600">
              <span>{s.years_experience}+ years</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  </main>
</BaseLayout>
`;
}

function main() {
  const csvContent = fs.readFileSync(BASE_CSV, 'utf-8');
  const lines = csvContent.split('\n').filter(l => l.trim());
  const headers = parseCSVLine(lines[0]);
  
  let enhanced = 0;
  let basic = 0;
  const citySurgeons = {};

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < headers.length) continue;

    const surgeon = {
      name: values[1],
      city: values[7],
      state: values[8],
      phone: values[11],
      website: values[13],
      category: values[14],
      years_experience: values[16],
      estimated_procedures: values[17],
      slug: values[18],
      bio_long: values[24],
      surgeon_photo: values[25],
      rating: parseFloat(values[4]) || 0,
      review_count: parseInt(values[5]) || 0
    };

    // Skip empty rows
    if (!surgeon.name || !surgeon.city || !surgeon.slug) continue;

    const slug = surgeon.slug;
    const citySlug = surgeon.city.toLowerCase().replace(/\s+/g, '-');
    const hasEnhanced = enhancedData[slug] && seoData[slug];

    const content = hasEnhanced 
      ? generateEnhancedProfile(surgeon, enhancedData[slug], seoData[slug])
      : generateBasicProfile(surgeon);

    const dir = path.join(OUTPUT_DIR, citySlug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filename = path.join(dir, `${slug}.astro`);
    fs.writeFileSync(filename, content);
    
    // Track surgeons by city
    if (!citySurgeons[citySlug]) {
      citySurgeons[citySlug] = { name: surgeon.city, surgeons: [] };
    }
    citySurgeons[citySlug].surgeons.push({
      name: surgeon.name,
      slug: surgeon.slug,
      category: surgeon.category,
      rating: surgeon.rating,
      review_count: surgeon.review_count,
      years_experience: surgeon.years_experience
    });
    
    if (hasEnhanced) {
      enhanced++;
      console.log(`✨ ${surgeon.name} (${surgeon.city}) [ENHANCED]`);
    } else {
      basic++;
      console.log(`✅ ${surgeon.name} (${surgeon.city})`);
    }
  }

  // Generate city index pages
  let cityIndexCount = 0;
  for (const [citySlug, data] of Object.entries(citySurgeons)) {
    const indexContent = generateCityIndex(citySlug, data.name, data.surgeons);
    const indexFile = path.join(OUTPUT_DIR, citySlug, 'index.astro');
    fs.writeFileSync(indexFile, indexContent);
    cityIndexCount++;
    console.log(`📍 ${data.name} index (${data.surgeons.length} surgeons)`);
  }

  console.log(`\n🎉 Generated ${enhanced + basic} profiles (${enhanced} enhanced, ${basic} basic)`);
  console.log(`📍 Generated ${cityIndexCount} city index pages`);
}

main();

