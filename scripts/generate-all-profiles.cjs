const fs = require('fs');
const path = require('path');

const BASE_CSV = 'surgeons-with-bios.csv';
const ENHANCED_DATA = 'surgeon-enhanced-data.json';
const SEO_DATA = 'surgeon-seo-enhancement-data.json';
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
import LeadContactForm from '../../../components/surgeons/LeadContactForm.astro';

const surgeon = ${JSON.stringify(surgeon, null, 2)};
const citySlug = "${citySlug}";
const slug = "${slug}";
const enhanced = ${JSON.stringify(enhanced || {}, null, 2)};
const seo = ${JSON.stringify(seo || {}, null, 2)};

// Extract clean name (remove title/role if present)
const cleanName = surgeon.name.split('|')[0].split('-')[0].trim();

const title = \`\${cleanName} - Bariatric Surgeon \${surgeon.city}, \${surgeon.state}\`;
const description = \`Top-rated bariatric surgeon in \${surgeon.city} (\${surgeon.rating}★, \${surgeon.review_count} reviews). Gastric sleeve, bypass & revision. Serving \${surgeon.state}. Book consultation today.\`;
const canonicalUrl = \`https://weightlosssurgery.com.au/surgeons/\${citySlug}/\${slug}\`;

// Comprehensive Schema.org structured data
const physicianSchema = {
  "@context": "https://schema.org",
  "@type": "Physician",
  "name": cleanName,
  "image": surgeon.surgeon_photo || "https://weightlosssurgery.com.au/default-surgeon.jpg",
  "url": canonicalUrl,
  "telephone": surgeon.phone,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": surgeon.street,
    "addressLocality": surgeon.city,
    "addressRegion": surgeon.state,
    "addressCountry": "AU"
  },
  "medicalSpecialty": "Bariatric Surgery",
  "availableService": [
    {
      "@type": "MedicalProcedure",
      "name": "Gastric Sleeve Surgery",
      "alternateName": "Sleeve Gastrectomy"
    },
    {
      "@type": "MedicalProcedure",
      "name": "Gastric Bypass Surgery",
      "alternateName": "Roux-en-Y Gastric Bypass"
    },
    {
      "@type": "MedicalProcedure",
      "name": "Gastric Band Surgery",
      "alternateName": "Lap Band"
    }
  ]
};

if (surgeon.rating > 0 && surgeon.review_count > 0) {
  physicianSchema.aggregateRating = {
    "@type": "AggregateRating",
    "ratingValue": surgeon.rating,
    "reviewCount": surgeon.review_count,
    "bestRating": "5",
    "worstRating": "1"
  };
}

const faqSchema = seo?.faqs && seo.faqs.length > 0 ? {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": seo.faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question || faq.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer || faq.a
    }
  }))
} : null;

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://weightlosssurgery.com.au"
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
      "item": \`https://weightlosssurgery.com.au/surgeons/\${citySlug}\`
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": cleanName,
      "item": canonicalUrl
    }
  ]
};
---

<BaseLayout title={title} description={description} canonicalUrl={canonicalUrl}>
  <!-- Comprehensive Schema.org Structured Data -->
  <script type="application/ld+json" set:html={JSON.stringify(physicianSchema)} />
  <script type="application/ld+json" set:html={JSON.stringify(breadcrumbSchema)} />
  {faqSchema && <script type="application/ld+json" set:html={JSON.stringify(faqSchema)} />}

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

    <!-- Hero Section - Clean Compact Layout -->
    <section class="bg-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-[280px_1fr] gap-8">
          
          <!-- Left Sidebar: Photo + Rating + CTAs -->
          <div class="space-y-4">
            <!-- Surgeon Photo -->
            {surgeon.surgeon_photo ? (
              <img src={surgeon.surgeon_photo} alt={surgeon.name} class="w-full rounded-xl shadow-lg" loading="eager" />
            ) : (
              <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg aspect-[3/4] flex items-center justify-center">
                <div class="text-center text-white p-6">
                  <svg class="w-20 h-20 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                  </svg>
                  <p class="text-xs font-semibold uppercase tracking-wide">Experience</p>
                  <p class="text-xs uppercase tracking-wide">Precision</p>
                  <p class="text-xs uppercase tracking-wide">Results</p>
                </div>
              </div>
            )}

            <!-- Rating Tile -->
            <div class="bg-white rounded-lg p-4 shadow-md border border-gray-200">
              <div class="text-center">
                <p class="text-sm text-gray-600 mb-1">Rating</p>
                {surgeon.rating > 0 ? (
                  <>
                    <div class="flex items-center justify-center gap-1 mb-1">
                      <span class="text-2xl">⭐</span>
                      <span class="text-2xl font-bold text-gray-900">{surgeon.rating}</span>
                    </div>
                    <p class="text-sm text-gray-600">{surgeon.review_count} reviews</p>
                  </>
                ) : (
                  <>
                    <div class="flex items-center justify-center gap-1 mb-1">
                      <span class="text-2xl">⭐</span>
                      <span class="text-lg font-bold text-gray-900">New</span>
                    </div>
                    <p class="text-sm text-gray-600">0 reviews</p>
                  </>
                )}
              </div>
              <div class="mt-3 pt-3 border-t border-gray-200">
                <p class="text-xs text-gray-600 text-center">Experience</p>
                <p class="text-lg font-bold text-gray-900 text-center">{surgeon.years_experience}+ years</p>
              </div>
            </div>

            <!-- CTA Buttons -->
            {surgeon.website && (
              <a href={surgeon.website} target="_blank" rel="noopener" class="block w-full bg-blue-600 text-white text-center px-4 py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md">
                Visit Website
              </a>
            )}
            {surgeon.google_maps_url && (
              <a href={surgeon.google_maps_url} target="_blank" rel="noopener" class="block w-full bg-green-600 text-white text-center px-4 py-3 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors shadow-md">
                View on Google Maps
              </a>
            )}
                    {surgeon.phone && (
                      <a href={\`tel:\${surgeon.phone}\`} class="block w-full bg-gray-800 text-white text-center px-4 py-3 rounded-lg text-sm font-semibold hover:bg-gray-900 transition-colors shadow-md">
                        📞 Call Now
                      </a>
                    )}

                    <!-- Lead Contact Form -->
                    <div class="mt-6">
                      <LeadContactForm surgeonName={cleanName} surgeonCity={surgeon.city} />
                    </div>
                  </div>

          <!-- Right: Main Info -->
          <div class="space-y-6">
            <!-- Header -->
            <div>
              <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{cleanName}</h1>
              <p class="text-lg text-gray-600 mb-4">{surgeon.category}</p>
              
              <!-- Info Tiles - Smaller & More Rounded -->
              <div class="grid grid-cols-3 gap-2 mb-4">
                <div class="bg-blue-50 rounded-xl p-2 text-center">
                  <svg class="w-4 h-4 mx-auto mb-0.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                  </svg>
                  <p class="text-[10px] font-semibold text-gray-700">{surgeon.city}, {surgeon.state}</p>
                </div>
                
                <div class="bg-purple-50 rounded-xl p-2 text-center">
                  <svg class="w-4 h-4 mx-auto mb-0.5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                  </svg>
                  <p class="text-[10px] font-semibold text-gray-700">{enhanced.credentials?.fellowships?.[0]?.replace('Royal Australasian College of Surgeons', 'FRACS') || 'MBBS, FRACS'}</p>
                </div>

                <div class="bg-green-50 rounded-xl p-2 text-center">
                  <svg class="w-4 h-4 mx-auto mb-0.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                  </svg>
                  <p class="text-[10px] font-semibold text-gray-700">{surgeon.estimated_procedures}+ Procedures</p>
                </div>
              </div>
            </div>

            <!-- About - Enhanced with Specific Details -->
            <div class="bg-gray-50 rounded-lg p-5">
              <h2 class="text-xl font-bold text-gray-900 mb-3">About {cleanName}</h2>
              <p class="text-gray-700 leading-relaxed mb-4">{surgeon.bio_long.replace(surgeon.name, cleanName)}</p>
              
              {enhanced.unique_features && enhanced.unique_features.length > 0 && (
                <div class="mt-4 pt-4 border-t border-gray-300">
                  <h3 class="text-sm font-bold text-gray-900 mb-2">What Sets {cleanName} Apart:</h3>
                  <ul class="space-y-1">
                    {enhanced.unique_features.slice(0, 4).map(feature => (
                      <li class="text-sm text-gray-700 flex items-start gap-2">
                        <svg class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {enhanced.services?.approach && (
                <div class="mt-4 pt-4 border-t border-gray-300">
                  <h3 class="text-sm font-bold text-gray-900 mb-2">Treatment Approach:</h3>
                  <p class="text-sm text-gray-700">{enhanced.services.approach}</p>
                </div>
              )}
            </div>

            <!-- Procedures - With Shaded Background -->
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 shadow-sm border border-blue-100">
              <h3 class="text-lg font-bold text-gray-900 mb-3">Procedures Offered</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div class="bg-white rounded-lg p-3 flex items-center gap-2 text-gray-700 shadow-sm">
                  <svg class="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <span class="font-semibold text-sm">Gastric Sleeve</span>
                </div>
                <div class="bg-white rounded-lg p-3 flex items-center gap-2 text-gray-700 shadow-sm">
                  <svg class="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <span class="font-semibold text-sm">Gastric Bypass</span>
                </div>
                <div class="bg-white rounded-lg p-3 flex items-center gap-2 text-gray-700 shadow-sm">
                  <svg class="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <span class="font-semibold text-sm">Gastric Band</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Enhanced Content Sections -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="space-y-6">
        {enhanced.credentials && <CredentialsSection credentials={enhanced.credentials} />}
        {enhanced.team && <TeamSection team={enhanced.team} />}
        {enhanced.hospitals && <HospitalsSection hospitals={enhanced.hospitals} />}
        {enhanced.pricing && <PricingSection pricing={enhanced.pricing} />}
        {seo.faqs && seo.faqs.length > 0 && <FAQSection faqs={seo.faqs} />}
      </div>
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
          <a href={\`/surgeons/${citySlug}/\${s.slug}\`} class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            {/* Surgeon Photo */}
            <div class="w-full h-64 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              {s.surgeon_photo ? (
                <img 
                  src={s.surgeon_photo} 
                  alt={s.name}
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <svg class="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                </svg>
              )}
            </div>
            
            {/* Surgeon Details */}
            <div class="p-6">
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
              
              {/* Procedures Offered */}
              <div class="mb-4">
                <h3 class="text-sm font-semibold text-gray-900 mb-2">Procedures</h3>
                <div class="flex flex-wrap gap-1">
                  <span class="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">Gastric Sleeve</span>
                  <span class="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">Gastric Bypass</span>
                  <span class="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">Gastric Band</span>
                </div>
              </div>
              
              <div class="flex gap-2 text-sm text-gray-600">
                <span>✓ {s.years_experience}+ years experience</span>
              </div>
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
      google_maps_url: values[15],
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
    const hasEnhanced = !!(enhancedData[slug] && seoData[slug]);

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

