const fs = require('fs');
const path = require('path');

// Load enhanced data from consolidated file
const enhancedData = JSON.parse(fs.readFileSync('surgeon-enhanced-data-consolidated.json', 'utf-8'));
console.log(`✅ Loaded ${Object.keys(enhancedData).length} enhanced surgeon profiles from consolidated file\n`);

// Load existing surgeons data to get full details
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ''));
  return result;
}

const csvContent = fs.readFileSync('surgeons-with-bios.csv', 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim());
const headers = parseCSVLine(lines[0]);

// Create map of surgeons by slug
const surgeonsMap = {};
for (let i = 1; i < lines.length; i++) {
  const values = parseCSVLine(lines[i]);
  if (values.length < headers.length) continue;
  
  const surgeon = {};
  headers.forEach((header, index) => {
    surgeon[header] = values[index] || '';
  });
  
  surgeonsMap[surgeon.slug] = surgeon;
}

// Generate enhanced profile pages
let generatedCount = 0;

for (const [slug, enhancedInfo] of Object.entries(enhancedData)) {
  const surgeon = surgeonsMap[slug];
  
  if (!surgeon) {
    console.log(`⚠️  No base data for ${slug}, skipping...`);
    continue;
  }
  
  // Check if this surgeon has meaningful enhanced data
  // Skip if only has minimal enhancement (just website/enhanced flag)
  const hasTeam = enhancedInfo.team && (enhancedInfo.team.has_dietitian || enhancedInfo.team.has_psychologist);
  const hasServices = enhancedInfo.services && enhancedInfo.services.procedures && enhancedInfo.services.procedures.length > 0;
  const hasHospitals = enhancedInfo.hospitals && enhancedInfo.hospitals.length > 0;
  const hasUniqueFeatures = enhancedInfo.unique_features && enhancedInfo.unique_features.length > 0;
  const hasFAQs = enhancedInfo.faqs && enhancedInfo.faqs.length > 0;
  const hasAchievements = enhancedInfo.achievements && enhancedInfo.achievements.length > 0;
  
  if (!hasTeam && !hasServices && !hasHospitals && !hasUniqueFeatures && !hasFAQs && !hasAchievements) {
    console.log(`⏭️  ${surgeon.surgeon_name}: Minimal enhancement, skipping...`);
    continue;
  }
  
  const citySlug = surgeon.city.toLowerCase().replace(/\s+/g, '-');
  const profilePath = path.join('src', 'pages', 'surgeons', citySlug, `${slug}.astro`);
  
  // Create directory if it doesn't exist
  const dir = path.dirname(profilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const surgeonName = surgeon.surgeon_name;
  const city = surgeon.city;
  const state = surgeon.state;
  const rating = surgeon.rating;
  const reviewCount = surgeon.review_count;
  const yearsExperience = surgeon.years_experience;
  const estimatedProcedures = surgeon.estimated_procedures;
  const phone = surgeon.phone;
  const website = surgeon.website;
  const googleMapsUrl = surgeon.google_maps_url;
  const surgeonPhoto = surgeon.surgeon_photo;
  const bioLong = surgeon.bio_long;
  
  // Generate comprehensive services section - with safe navigation
  const hasTeamSupport = (enhancedInfo.team?.has_dietitian === true) || 
                         (enhancedInfo.team?.has_psychologist === true) || 
                         (enhancedInfo.team?.has_exercise_physiologist === true);
  
  const teamSupportHTML = hasTeamSupport ? `
    <section class="mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">🎯 Comprehensive Care Team</h2>
      <div class="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${enhancedInfo.team?.has_dietitian === true ? `
          <div class="flex items-start space-x-3">
            <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <div>
              <div class="font-semibold text-gray-900">Dietitian/Nutritionist</div>
              <div class="text-sm text-gray-600">Pre & post-op dietary support</div>
            </div>
          </div>
          ` : ''}
          
          ${enhancedInfo.team?.has_psychologist === true ? `
          <div class="flex items-start space-x-3">
            <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <div>
              <div class="font-semibold text-gray-900">Psychologist</div>
              <div class="text-sm text-gray-600">Mental health & emotional support</div>
            </div>
          </div>
          ` : ''}
          
          ${enhancedInfo.team?.has_exercise_physiologist === true ? `
          <div class="flex items-start space-x-3">
            <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <div>
              <div class="font-semibold text-gray-900">Exercise Physiologist</div>
              <div class="text-sm text-gray-600">Fitness planning & guidance</div>
            </div>
          </div>
          ` : ''}
          
          ${enhancedInfo.services?.telehealth === true ? `
          <div class="flex items-start space-x-3">
            <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <div>
              <div class="font-semibold text-gray-900">Telehealth Available</div>
              <div class="text-sm text-gray-600">Virtual consultations offered</div>
            </div>
          </div>
          ` : ''}
          
          ${enhancedInfo.services?.follow_up_duration && enhancedInfo.services.follow_up_duration !== 'Not specified' ? `
          <div class="flex items-start space-x-3">
            <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <div>
              <div class="font-semibold text-gray-900">Follow-up Care</div>
              <div class="text-sm text-gray-600">${enhancedInfo.services?.follow_up_duration}</div>
            </div>
          </div>
          ` : ''}
        </div>
        
        ${enhancedInfo.team?.team_size ? `
        <div class="mt-4 pt-4 border-t border-green-300">
          <p class="text-sm text-gray-700">
            <span class="font-semibold">Team Size:</span> ${enhancedInfo.team?.team_size}
          </p>
        </div>
        ` : ''}
      </div>
    </section>
  ` : '';
  
  // Hospital affiliations
  const hospitalsHTML = (enhancedInfo.hospitals && enhancedInfo.hospitals.length > 0) ? `
    <section class="mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">🏥 Hospital Affiliations</h2>
      <div class="grid md:grid-cols-2 gap-4">
        ${enhancedInfo.hospitals.map(hospital => `
        <div class="bg-white rounded-lg border-2 border-gray-200 p-4 hover:border-blue-300 transition-colors">
          <h3 class="font-semibold text-gray-900">${hospital.name}</h3>
          ${hospital.address ? `<p class="text-sm text-gray-600 mt-1">${hospital.address}</p>` : ''}
          ${hospital.location ? `<p class="text-sm text-gray-600 mt-1">${hospital.location}</p>` : ''}
          ${hospital.type ? `<span class="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">${hospital.type}</span>` : ''}
        </div>
        `).join('')}
      </div>
    </section>
  ` : '';
  
  // Unique features
  const uniqueFeaturesHTML = (enhancedInfo.unique_features && enhancedInfo.unique_features.length > 0) ? `
    <section class="mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">🌟 What Makes This Practice Unique</h2>
      <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
        <ul class="space-y-3">
          ${enhancedInfo.unique_features.map(feature => `
          <li class="flex items-start space-x-3">
            <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span class="text-gray-700">${feature}</span>
          </li>
          `).join('')}
        </ul>
      </div>
    </section>
  ` : '';
  
  // Procedures section
  const proceduresHTML = (enhancedInfo.services?.procedures && enhancedInfo.services.procedures.length > 0) ? `
    <section class="mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">🔬 Procedures & Services</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        ${enhancedInfo.services.procedures.map(proc => `
        <div class="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <span class="text-sm font-medium text-gray-800">${proc}</span>
        </div>
        `).join('')}
      </div>
    </section>
  ` : '';
  
  const pageContent = `---
import BaseLayout from '../../../layouts/BaseLayout.astro';

const surgeon = {
  name: "${surgeonName}",
  title: "${surgeonName}",
  city: "${city}",
  state: "${state}",
  rating: ${rating},
  reviewCount: ${reviewCount},
  phone: "${phone}",
  website: "${website}",
  googleMapsUrl: "${googleMapsUrl}",
  surgeonPhoto: "${surgeonPhoto}",
  yearsExperience: ${yearsExperience},
  estimatedProcedures: ${estimatedProcedures},
  slug: "${slug}",
  citySlug: "${citySlug}"
};

const title = "${surgeonName} - ${city} Bariatric Surgeon | Enhanced Profile";
const description = "${surgeonName} is an experienced bariatric surgeon in ${city}, ${state}. ${rating} stars (${reviewCount} reviews). Comprehensive team support, ${enhancedInfo.hospitals?.length || 0} hospital affiliations. ${hasTeamSupport ? 'Full multidisciplinary care team.' : ''} Book your consultation today.";
const canonicalUrl = \`https://weightlosssurgery.com.au/surgeons/\${surgeon.citySlug}/\${surgeon.slug}\`;
---

<BaseLayout title={title} description={description} canonicalUrl={canonicalUrl}>
  <!-- Breadcrumbs -->
  <nav class="bg-gray-50 py-3">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ol class="flex items-center space-x-2 text-sm">
        <li><a href="/" class="text-blue-600 hover:text-blue-800">Home</a></li>
        <li class="text-gray-400">/</li>
        <li><a href="/surgeons" class="text-blue-600 hover:text-blue-800">Surgeons</a></li>
        <li class="text-gray-400">/</li>
        <li><a href={\`/surgeons/\${surgeon.citySlug}\`} class="text-blue-600 hover:text-blue-800">{surgeon.city}</a></li>
        <li class="text-gray-400">/</li>
        <li class="text-gray-900">{surgeon.name}</li>
      </ol>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 md:py-16">
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
              />
            </div>
          ) : (
            <div class="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg p-12 flex items-center justify-center">
              <svg class="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
              </svg>
            </div>
          )}
          
          <!-- Quick Actions -->
          <div class="mt-6 space-y-3">
            {surgeon.phone && (
              <a 
                href={\`tel:\${surgeon.phone}\`}
                class="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
              >
                📞 Call Now
              </a>
            )}
            {surgeon.website && (
              <a 
                href={surgeon.website}
                target="_blank"
                rel="noopener noreferrer"
                class="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
              >
                🌐 Visit Website
              </a>
            )}
            {surgeon.googleMapsUrl && (
              <a 
                href={surgeon.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="block w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
              >
                📍 Get Directions
              </a>
            )}
          </div>
        </div>
        
        <!-- Right: Info -->
        <div class="md:col-span-2">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {surgeon.name}
              </h1>
              <p class="text-xl text-gray-600">
                Bariatric & Upper GI Surgeon
              </p>
              <p class="text-lg text-gray-500">
                {surgeon.city}, {surgeon.state}
              </p>
            </div>
          </div>
          
          <!-- Quick Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-lg p-4 shadow-md border-l-4 border-yellow-500">
              <div class="text-3xl font-bold text-gray-900">
                ⭐ {surgeon.rating}
              </div>
              <div class="text-sm text-gray-600">
                {surgeon.reviewCount} reviews
              </div>
            </div>
            
            <div class="bg-white rounded-lg p-4 shadow-md border-l-4 border-blue-500">
              <div class="text-3xl font-bold text-gray-900">
                {surgeon.yearsExperience}+
              </div>
              <div class="text-sm text-gray-600">
                Years Experience
              </div>
            </div>
            
            <div class="bg-white rounded-lg p-4 shadow-md border-l-4 border-green-500">
              <div class="text-3xl font-bold text-gray-900">
                ${enhancedInfo.hospitals?.length || 0}
              </div>
              <div class="text-sm text-gray-600">
                Hospital Affiliations
              </div>
            </div>
            
            <div class="bg-white rounded-lg p-4 shadow-md border-l-4 border-purple-500">
              <div class="text-3xl font-bold text-gray-900">
                {surgeon.estimatedProcedures.toLocaleString()}+
              </div>
              <div class="text-sm text-gray-600">
                Procedures
              </div>
            </div>
          </div>
          
          <!-- Bio -->
          <div class="bg-white rounded-lg p-6 shadow-md">
            <h2 class="text-2xl font-bold text-gray-900 mb-3">About {surgeon.name}</h2>
            <p class="text-gray-700 leading-relaxed">
              ${bioLong}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Enhanced Content Sections -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    
    ${teamSupportHTML}
    
    ${proceduresHTML}
    
    ${hospitalsHTML}
    
    ${uniqueFeaturesHTML}
    
    <!-- Contact Section -->
    <section class="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p class="text-xl mb-6 text-blue-100">
          Book a consultation with {surgeon.name} today to discuss your weight loss surgery options.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          {surgeon.phone && (
            <a 
              href={\`tel:\${surgeon.phone}\`}
              class="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg transition-colors inline-block"
            >
              📞 {surgeon.phone}
            </a>
          )}
          {surgeon.website && (
            <a 
              href={surgeon.website}
              target="_blank"
              rel="noopener noreferrer"
              class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block border-2 border-white"
            >
              Visit Website →
            </a>
          )}
        </div>
      </div>
    </section>
    
  </div>
</BaseLayout>
`;

  fs.writeFileSync(profilePath, pageContent);
  console.log(`✅ Generated: ${surgeon.surgeon_name} (${city})`);
  generatedCount++;
}

console.log(`\n🎉 SUCCESS! Generated ${generatedCount} enhanced surgeon profiles`);
console.log(`\nNext: npm run build && git add . && git commit && git push`);

