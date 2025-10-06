const fs = require('fs');
const path = require('path');

// Load all data
const enhancedData = JSON.parse(fs.readFileSync('surgeon-enhanced-data.json', 'utf-8'));
const seoData = JSON.parse(fs.readFileSync('surgeon-seo-enhancement-data.json', 'utf-8'));

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

// Generate ULTIMATE profiles
let generatedCount = 0;

for (const [slug, enhancedInfo] of Object.entries(enhancedData)) {
  const surgeon = surgeonsMap[slug];
  
  if (!surgeon) {
    console.log(`⚠️  No base data for ${slug}, skipping...`);
    continue;
  }
  
  const seoInfo = seoData[slug] || {};
  const citySlug = surgeon.city.toLowerCase().replace(/\s+/g, '-');
  const profilePath = path.join('src', 'pages', 'surgeons', citySlug, `${slug}.astro`);
  
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
  const street = surgeon.street;
  
  // Generate FAQ Schema
  const faqSchema = seoInfo.faqs ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": seoInfo.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;
  
  // Generate Physician Schema
  const physicianSchema = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": surgeonName,
    "image": surgeonPhoto || "https://weightlosssurgery.com.au/default-surgeon.jpg",
    "jobTitle": "Bariatric Surgeon",
    "telephone": phone,
    "url": website,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": street,
      "addressLocality": city,
      "addressRegion": state,
      "addressCountry": "AU"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "reviewCount": reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    },
    "availableService": enhancedInfo.services.procedures.slice(0, 5).map(proc => ({
      "@type": "MedicalProcedure",
      "name": proc,
      "procedureType": "Bariatric Surgery"
    })),
    "medicalSpecialty": ["Bariatric Surgery", "Upper Gastrointestinal Surgery"],
    "memberOf": seoInfo.credentials?.certifications?.map(cert => ({
      "@type": "Organization",
      "name": cert
    })) || []
  };
  
  // Generate Breadcrumb Schema
  const breadcrumbSchema = {
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
        "name": `${city} Surgeons`,
        "item": `https://weightlosssurgery.com.au/surgeons/${citySlug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": surgeonName
      }
    ]
  };
  
  // Generate comprehensive services HTML
  const hasTeamSupport = enhancedInfo.team.has_dietitian === true || 
                         enhancedInfo.team.has_psychologist === true || 
                         enhancedInfo.team.has_exercise_physiologist === true;
  
  const teamSupportHTML = hasTeamSupport ? `
    <section class="mb-12" id="team">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">🎯 Comprehensive Care Team</h2>
      <div class="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${enhancedInfo.team.has_dietitian === true ? `
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
          
          ${enhancedInfo.team.has_psychologist === true ? `
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
          
          ${enhancedInfo.team.has_exercise_physiologist === true ? `
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
          
          ${enhancedInfo.services.telehealth === true ? `
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
          
          ${enhancedInfo.services.follow_up_duration && enhancedInfo.services.follow_up_duration !== 'Not specified' ? `
          <div class="flex items-start space-x-3">
            <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <div>
              <div class="font-semibold text-gray-900">Follow-up Care</div>
              <div class="text-sm text-gray-600">${enhancedInfo.services.follow_up_duration}</div>
            </div>
          </div>
          ` : ''}
        </div>
        
        ${enhancedInfo.team.team_size ? `
        <div class="mt-4 pt-4 border-t border-green-300">
          <p class="text-sm text-gray-700">
            <span class="font-semibold">Team Size:</span> ${enhancedInfo.team.team_size}
          </p>
        </div>
        ` : ''}
      </div>
    </section>
  ` : '';
  
  // Credentials section
  const credentialsHTML = seoInfo.credentials ? `
    <section class="mb-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border-2 border-blue-200" id="credentials">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">🎓 Education & Credentials</h2>
      
      ${seoInfo.credentials.medical_school ? `
      <div class="mb-6">
        <h3 class="text-xl font-bold text-gray-800 mb-3">Medical Education</h3>
        <div class="bg-white rounded-lg p-4 border-l-4 border-blue-500">
          <p class="text-gray-800"><span class="font-semibold">Medical School:</span> ${seoInfo.credentials.medical_school}</p>
          ${seoInfo.credentials.graduation_year ? `<p class="text-gray-600 text-sm mt-1">Graduated: ${seoInfo.credentials.graduation_year}</p>` : ''}
          ${seoInfo.credentials.surgical_training ? `<p class="text-gray-700 mt-2"><span class="font-semibold">Surgical Training:</span> ${seoInfo.credentials.surgical_training}</p>` : ''}
        </div>
      </div>
      ` : ''}
      
      ${seoInfo.credentials.fellowships && seoInfo.credentials.fellowships.length > 0 ? `
      <div class="mb-6">
        <h3 class="text-xl font-bold text-gray-800 mb-3">Specialized Fellowships</h3>
        <div class="space-y-3">
          ${seoInfo.credentials.fellowships.map(fellowship => `
          <div class="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <p class="font-semibold text-gray-900">${fellowship.specialty}</p>
            <p class="text-gray-700 text-sm mt-1">${fellowship.institution}</p>
            ${fellowship.year ? `<p class="text-gray-600 text-xs mt-1">${fellowship.year}</p>` : ''}
          </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
      
      ${seoInfo.credentials.certifications && seoInfo.credentials.certifications.length > 0 ? `
      <div class="mb-6">
        <h3 class="text-xl font-bold text-gray-800 mb-3">Board Certifications & Memberships</h3>
        <div class="bg-white rounded-lg p-4">
          <ul class="space-y-2">
            ${seoInfo.credentials.certifications.map(cert => `
            <li class="flex items-start space-x-2">
              <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span class="text-gray-700">${cert}</span>
            </li>
            `).join('')}
          </ul>
        </div>
      </div>
      ` : ''}
      
      ${seoInfo.credentials.years_in_practice ? `
      <div class="bg-white rounded-lg p-4 border-2 border-green-400">
        <p class="text-xl font-bold text-gray-900">
          ${seoInfo.credentials.years_in_practice} Years in Practice
        </p>
        ${seoInfo.credentials.procedures_performed ? `
        <p class="text-gray-600 mt-1">${seoInfo.credentials.procedures_performed} Procedures Performed</p>
        ` : ''}
      </div>
      ` : ''}
    </section>
  ` : '';
  
  // Generate rest of the profile (continuing...)
  
  console.log(`Processing ${surgeonName}...`);
  generatedCount++;
}

console.log(`\n✅ Processed ${generatedCount} ultimate profiles`);

