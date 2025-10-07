const fs = require('fs');

/**
 * Generate SEO enhancement data for all researched surgeons
 */

const csv = fs.readFileSync('surgeons-with-bios.csv', 'utf-8');
const lines = csv.split('\n').slice(1).filter(l => l.trim());

const seoData = {};

// Load existing SEO data
const existingSEO = fs.existsSync('surgeon-seo-enhancement-data.json') 
  ? JSON.parse(fs.readFileSync('surgeon-seo-enhancement-data.json', 'utf-8'))
  : {};

lines.forEach(line => {
  // Parse CSV properly to extract name, city, and slug
  const cols = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
  if (!cols || cols.length < 19) return;
  
  const name = cols[1]?.trim().replace(/"/g, '');  // surgeon_name (column 1)
  const city = cols[7]?.trim().replace(/"/g, '');  // city (column 7)
  const slug = cols[18]?.trim().replace(/"/g, ''); // slug (column 18)
  
  if (!name || !city || !slug) return;
  
  // Keep existing SEO data if it exists, otherwise create basic SEO data
  if (existingSEO[slug]) {
    seoData[slug] = existingSEO[slug];
  } else {
    seoData[slug] = {
      "meta_title": `${name} - Bariatric Surgeon ${city} | Weight Loss Surgery`,
      "meta_description": `${name} is an experienced bariatric surgeon in ${city}. Specialising in gastric sleeve, gastric bypass, and weight loss surgery. Book a consultation today.`,
      "schema_org": {
        "@context": "https://schema.org",
        "@type": "Physician",
        "name": name,
        "medicalSpecialty": "Bariatric Surgery",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city,
          "addressCountry": "AU"
        }
      },
      "faqs": [
        {
          "question": `What types of weight loss surgery does ${name} perform?`,
          "answer": `${name} performs gastric sleeve, gastric bypass, gastric band, and revision bariatric surgery procedures.`
        },
        {
          "question": `Where is ${name} located?`,
          "answer": `${name} practices in ${city} and operates at leading private hospitals in the area.`
        },
        {
          "question": `How do I book a consultation with ${name}?`,
          "answer": `You can book a consultation by using the contact form on this page or calling the practice directly.`
        },
        {
          "question": `Does ${name} accept health insurance?`,
          "answer": `${name} works with most major private health insurance providers. Contact the practice for specific coverage details.`
        }
      ]
    };
  }
});

fs.writeFileSync('surgeon-seo-enhancement-data.json', JSON.stringify(seoData, null, 2));
console.log(`✅ Generated SEO data for ${Object.keys(seoData).length} surgeons`);
console.log(`   - ${Object.keys(existingSEO).length} existing enhanced`);
console.log(`   - ${Object.keys(seoData).length - Object.keys(existingSEO).length} newly added`);

