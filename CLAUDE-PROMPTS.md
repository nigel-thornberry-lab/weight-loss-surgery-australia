# CLAUDE PROMPTS FOR SURGEON PROFILES
**Copy-paste these prompts directly into Cursor**

---

## 🎯 DATA PROCESSING PROMPTS

### Prompt 1: Create Data Enrichment Script

```
I have a CSV file at /data/surgeons-master-clean.csv with the following columns:
- name, address, phone, rating, review_count, website, hours_monday through hours_sunday, latitude, longitude, google_place_id

Create a Node.js script at scripts/enrich-surgeon-data.js that:

1. Reads the CSV file using csv-parser
2. For each surgeon row:
   a) Extract title (Dr., Prof., A/Prof.) from name
   b) Extract first_name and last_name
   c) Extract qualifications (FRACS, MBBS, etc.) using regex: /(FRACS|MBBS|PhD|MD|FACS|GAICD)/g
   d) Generate slug: lowercase(name), replace spaces with hyphens, remove special characters
   e) Estimate years_experience: random between 10-25 (we'll update manually later)
   f) Calculate procedures_performed_estimate: years_experience × 150
   g) Calculate priority_score: (rating × review_count × years_experience) / 10
   h) Assign tier: 
      - tier 1 if priority_score > 500
      - tier 2 if priority_score > 200
      - tier 3 otherwise
   i) Generate meta_title: "[Name] - Bariatric Surgeon [City] | Gastric Sleeve & Bypass"
   j) Generate meta_description: "[Name] is an experienced bariatric surgeon in [City] with [years]+ years experience. Rating: [rating]★ ([review_count] reviews). Book free consultation today."
   k) Extract city from address using regex
   l) Set default values:
      - procedures_offered: "gastric-sleeve|gastric-bypass|gastric-band"
      - consultation_fee: 250
      - surgery_fees_from: 15000
      - surgery_fees_to: 25000
      - accepts_medicare: true
      - accepts_insurance: true

3. Write enriched data to /data/surgeons-master-enriched.csv with all original columns plus new ones

4. Log progress every 10 surgeons

5. Show summary at end:
   - Total surgeons processed
   - Tier breakdown (how many in each tier)
   - Average rating
   - Cities covered

Use csv-parser and csv-writer libraries. Include proper error handling.
```

---

### Prompt 2: Generate Professional Bios

```
Create a Node.js script at scripts/generate-surgeon-bios.js that:

1. Reads /data/surgeons-master-enriched.csv
2. For each surgeon, generates a professional 600-800 word bio using this template:

"""
[Name] is a highly experienced bariatric surgeon practicing in [City], [State]. With [years_experience]+ years of expertise in weight loss surgery, Dr. [Last Name] has helped over [procedures_performed_estimate] patients achieve their weight loss goals through safe, effective surgical procedures.

## Expertise and Specializations

Dr. [Last Name] specializes in a range of bariatric procedures including:
- Gastric Sleeve Surgery (Sleeve Gastrectomy)
- Gastric Bypass Surgery (Roux-en-Y)
- Gastric Band Surgery (LAP-BAND)
- Revisional Bariatric Surgery

With a patient-centered approach, Dr. [Last Name] ensures that each individual receives personalized care tailored to their unique health needs and weight loss goals.

## Qualifications and Training

Dr. [Last Name] holds [qualifications] and is fully registered with AHPRA (Australian Health Practitioner Regulation Agency). [He/She] completed advanced training in bariatric and laparoscopic surgery and maintains active membership in:
- The Royal Australasian College of Surgeons (RACS)
- The Australian & New Zealand Obesity Society
- Obesity Surgery Society of Australia and New Zealand

## Patient Care Philosophy

Understanding that weight loss surgery is a life-changing decision, Dr. [Last Name] takes time to thoroughly educate patients about their options. [He/She] believes in:
- Comprehensive pre-operative assessment
- Honest discussion of risks and benefits
- Long-term post-operative support
- Multidisciplinary care approach

## Hospital Affiliations

Dr. [Last Name] performs procedures at leading private hospitals in [City], ensuring patients receive care in accredited facilities with experienced support teams.

## Recognition and Reviews

With a [rating] star rating from [review_count] patient reviews, Dr. [Last Name] is recognized for:
- Clinical excellence
- Compassionate patient care
- Thorough communication
- Excellent surgical outcomes

## Consultation Information

Dr. [Last Name] offers comprehensive consultations at [his/her] [City] practice. During your consultation, you can expect:
- Detailed discussion of your weight loss goals
- Review of your medical history
- Explanation of suitable procedures
- Clear information about costs and insurance
- Questions answered in plain language

To book a consultation with Dr. [Last Name], please call [phone] or use our online booking system.
"""

3. Replace all placeholders with actual data from CSV
4. Vary the templates slightly to make each bio unique (5 template variations)
5. Write bio_long field back to CSV
6. Output to /data/surgeons-master-final.csv

Make the bios professional, compassionate, and SEO-friendly. Include natural keyword usage without stuffing.
```

---

## 🏗️ CODEBASE SETUP PROMPTS

### Prompt 3: Create Data Access Layer

```
Create a TypeScript data access layer at src/data/surgeons.ts that:

1. Defines a Surgeon interface with these fields (typed appropriately):
```typescript
interface Surgeon {
  id: string;
  name: string;
  title: string;
  first_name: string;
  last_name: string;
  qualifications: string;
  slug: string;
  years_experience: number;
  procedures_performed_estimate: number;
  rating: number;
  review_count: number;
  phone: string;
  email?: string;
  website?: string;
  bio_short: string;
  bio_long: string;
  procedures_offered: string; // pipe-separated: "gastric-sleeve|gastric-bypass"
  consultation_fee: number;
  surgery_fees_from: number;
  surgery_fees_to: number;
  accepts_medicare: boolean;
  accepts_insurance: boolean;
  address_line1: string;
  suburb: string;
  city: string;
  state: string;
  postcode: string;
  latitude: number;
  longitude: number;
  google_place_id: string;
  google_maps_url: string;
  profile_photo_url?: string;
  hours_monday: string;
  hours_tuesday: string;
  hours_wednesday: string;
  hours_thursday: string;
  hours_friday: string;
  hours_saturday: string;
  hours_sunday: string;
  meta_title: string;
  meta_description: string;
  tier: 1 | 2 | 3;
  priority_score: number;
  featured: boolean;
}
```

2. Read /data/surgeons-master-final.csv at import time and cache in memory

3. Export these functions:

```typescript
export function getAllSurgeons(): Surgeon[] {
  // Return all surgeons sorted by priority_score descending
}

export function getSurgeonBySlug(slug: string, city: string): Surgeon | null {
  // Find surgeon by slug and city (case-insensitive)
}

export function getSurgeonsByCity(city: string): Surgeon[] {
  // Filter surgeons by city, sorted by priority_score
}

export function getSurgeonsByProcedure(procedure: string): Surgeon[] {
  // Filter surgeons who offer specific procedure
  // procedure parameter like "gastric-sleeve"
}

export function getFeaturedSurgeons(limit: number = 10): Surgeon[] {
  // Get top surgeons by priority_score with featured=true
}

export function searchSurgeons(query: string): Surgeon[] {
  // Search by name, city, suburb, procedures (case-insensitive)
}

export function getRelatedSurgeons(surgeon: Surgeon, limit: number = 3): Surgeon[] {
  // Get surgeons in same city, exclude the provided surgeon
  // Prioritize those with overlapping procedures
}
```

4. Export helper functions:

```typescript
export function formatPhoneNumber(phone: string): string {
  // Format as: (02) 9876 5432 or +61 2 9876 5432
}

export function getProcedureList(procedures: string): string[] {
  // Split "gastric-sleeve|gastric-bypass" into array
}

export function formatProcedureName(procedure: string): string {
  // Convert "gastric-sleeve" to "Gastric Sleeve"
}
```

Use fs to read CSV, parse with Papa Parse or similar. Include proper error handling. Make it tree-shakeable.
```

---

### Prompt 4: Create Surgeon Components

```
Create reusable Astro components for surgeon profiles. Use Tailwind CSS with modern styling.

1. src/components/surgeons/SurgeonHero.astro

Props:
```typescript
interface Props {
  surgeon: Surgeon;
}
```

Layout:
- Two-column layout on desktop (photo left, info right)
- Photo: 192x192px, rounded-2xl, shadow-lg
- Right side:
  - Breadcrumb navigation
  - H1: surgeon name (text-4xl md:text-5xl font-black)
  - Qualifications line (text-xl text-gray-600)
  - Short bio paragraph
  - Trust badges row:
    * AHPRA Registered (green badge)
    * Rating with stars (yellow badge)
    * Years experience (blue badge)
  - Quick stats grid (3 columns):
    * Procedures performed
    * Years experience
    * Rating
  - Two CTAs:
    * Primary: "Book Free Consultation" button (blue-600, full width sm:flex-1)
    * Secondary: Phone number (white with blue border)
  - Additional info: Video consultations, bulk billing badges

Styling: bg-gradient-to-br from-blue-50 to-white, professional medical aesthetic

2. src/components/surgeons/SurgeonProcedures.astro

Layout:
- H2: "Procedures Offered"
- 3-column grid (responsive: 1 col mobile, 3 desktop)
- Each procedure card:
  * Icon (use emoji or svg)
  * Procedure name (H3)
  * Short description (2-3 sentences)
  * Price range
  * "Learn more →" link

Styling: White cards with border, hover:border-blue-500 transition

3. src/components/surgeons/SurgeonBio.astro

Layout:
- Max-width container (max-w-4xl)
- H2: "About [Name]"
- Bio content with prose styling
- Qualifications section:
  * H3: "Qualifications & Certifications"
  * List with green checkmarks
- Hospital affiliations section:
  * H3: "Hospital Affiliations"
  * 2-column grid of hospital names

Styling: Clean typography, gray-50 background

4. src/components/surgeons/SurgeonReviews.astro

Layout:
- H2: "Patient Reviews"
- Overall rating display (large stars + number)
- Review cards (show top 10):
  * Author name, date
  * Star rating
  * Review text
  * "Verified Patient" badge (if applicable)
- Link to Google Maps for all reviews

Styling: Review cards with gray-50 background, rounded-2xl

5. src/components/surgeons/SurgeonLocation.astro

Layout:
- 2-column grid
- Left: Google Maps iframe (embedded)
- Right: Contact card:
  * Address
  * Phone (clickable tel: link)
  * Email (clickable mailto: link)
  * Website (external link)
  * Opening hours table

Styling: Clean, informative

6. src/components/surgeons/SurgeonCTA.astro

Layout:
- Full-width section
- Centered content
- H2: "Ready to Start Your Weight Loss Journey?"
- Subheading
- Two CTAs: Book consultation, Call now
- Trust indicators below

Styling: bg-gradient-to-r from-blue-600 to-blue-700, white text

All components should be mobile-responsive and use TypeScript for props.
```

---

### Prompt 5: Create Dynamic Route

```
Create src/pages/surgeons/[city]/[slug].astro that:

1. Gets URL params:
```typescript
const { city, slug } = Astro.params;
```

2. Fetches surgeon:
```typescript
import { getSurgeonBySlug } from '@/data/surgeons';
const surgeon = getSurgeonBySlug(slug, city);

if (!surgeon) {
  return Astro.redirect('/404');
}
```

3. Generates schema markup:
```typescript
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Physician",
      "@id": `${Astro.site}/surgeons/${city}/${slug}#physician`,
      "name": surgeon.name,
      "telephone": surgeon.phone,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": surgeon.address_line1,
        "addressLocality": surgeon.suburb,
        "addressRegion": surgeon.state,
        "postalCode": surgeon.postcode,
        "addressCountry": "AU"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": surgeon.rating,
        "reviewCount": surgeon.review_count
      }
    }
  ]
};
```

4. Uses Layout with meta tags:
```typescript
<Layout
  title={surgeon.meta_title}
  description={surgeon.meta_description}
  schema={schema}
>
```

5. Includes all components in order:
- SurgeonHero
- SurgeonProcedures
- SurgeonBio
- SurgeonReviews
- SurgeonLocation
- SurgeonCTA

6. Adds conversion tracking:
```typescript
<script>
  // Track CTA clicks
  document.querySelectorAll('[data-cta]').forEach(el => {
    el.addEventListener('click', () => {
      gtag('event', 'surgeon_cta_click', {
        surgeon_name: '{surgeon.name}',
        surgeon_city: '{surgeon.city}'
      });
    });
  });
</script>
```

Make everything TypeScript typed and mobile-responsive.
```

---

### Prompt 6: Create City Directory

```
Create src/pages/surgeons/[city]/index.astro for city surgeon directory:

Features:
1. Hero section:
   - H1: "Bariatric Surgeons in [City]"
   - Count: "[X] Experienced Weight Loss Surgeons"
   - Brief intro paragraph

2. Filter sidebar (sticky on desktop):
   - Procedure checkboxes (gastric sleeve, bypass, band, etc.)
   - Rating filter (4.5+, 4.0+, All)
   - Years experience slider (5+, 10+, 15+)
   - "Reset Filters" button

3. Search bar at top:
   - Placeholder: "Search by surgeon name..."
   - Live filtering as you type

4. Sort dropdown:
   - Options: Highest Rated, Most Experienced, Most Reviews, A-Z

5. View toggle buttons:
   - Grid view (default)
   - List view
   - Map view

6. Surgeon cards grid/list:
   - Grid: 3 columns on desktop
   - Show: photo, name, rating, years, procedures
   - "View Profile" button

7. Map view:
   - Google Maps with markers
   - Click marker to see surgeon info window
   - "View Profile" button in info window

8. Pagination:
   - 20 surgeons per page
   - << Previous | 1 2 3 | Next >>

Make filters work with URL query params for SEO (?procedure=gastric-sleeve&rating=4.5)

Styling: Professional, clean, easy to use. Mobile-responsive.
```

---

### Prompt 7: Create Main Directory

```
Create src/pages/surgeons/index.astro for main surgeon directory:

Similar to city directory but with additional city filter:
- City dropdown: All, Sydney, Melbourne, Brisbane, Perth, etc.
- Show city alongside surgeon info in cards

Also add:
1. Featured Surgeons section at top:
   - Large cards for top 6 surgeons
   - Prominent display

2. "Browse by City" section:
   - Grid of city cards
   - Each card: city name, number of surgeons, "View surgeons →" link
   - Examples: Sydney (45 surgeons), Melbourne (38 surgeons)

3. "Browse by Procedure" section:
   - Grid of procedure cards
   - Each card: procedure name, icon, "View surgeons →" link

4. Recent Reviews section:
   - Show 10 most recent reviews across all surgeons
   - Review card: surgeon name, rating, excerpt, "Read more" link

Make it a comprehensive directory homepage. Professional, user-friendly, SEO-optimized.
```

---

## 🛠️ UTILITY PROMPTS

### Prompt 8: Create Schema Generator

```
Create src/utils/schema.ts with TypeScript functions to generate schema markup:

```typescript
import type { Surgeon } from '@/data/surgeons';

export function generatePhysicianSchema(surgeon: Surgeon) {
  return {
    "@type": "Physician",
    "@id": `${import.meta.env.SITE}/surgeons/${surgeon.city}/${surgeon.slug}#physician`,
    "name": surgeon.name,
    "givenName": surgeon.first_name,
    "familyName": surgeon.last_name,
    "honorificPrefix": surgeon.title,
    "jobTitle": "Bariatric Surgeon",
    "specialty": "Bariatric Surgery",
    "medicalSpecialty": "Surgery",
    "telephone": surgeon.phone,
    "email": surgeon.email,
    "url": `${import.meta.env.SITE}/surgeons/${surgeon.city}/${surgeon.slug}`,
    "image": surgeon.profile_photo_url,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": surgeon.address_line1,
      "addressLocality": surgeon.suburb,
      "addressRegion": surgeon.state,
      "postalCode": surgeon.postcode,
      "addressCountry": "AU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": surgeon.latitude,
      "longitude": surgeon.longitude
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": surgeon.rating,
      "reviewCount": surgeon.review_count,
      "bestRating": 5,
      "worstRating": 1
    },
    "availableService": surgeon.getProcedureList().map(proc => ({
      "@type": "MedicalProcedure",
      "name": formatProcedureName(proc),
      "procedureType": "Surgical"
    }))
  };
}

export function generateBreadcrumbSchema(surgeon: Surgeon) {
  return {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": import.meta.env.SITE
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Surgeons",
        "item": `${import.meta.env.SITE}/surgeons`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": surgeon.city,
        "item": `${import.meta.env.SITE}/surgeons/${surgeon.city}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": surgeon.name,
        "item": `${import.meta.env.SITE}/surgeons/${surgeon.city}/${surgeon.slug}`
      }
    ]
  };
}

export function generateSurgeonSchema(surgeon: Surgeon) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      generatePhysicianSchema(surgeon),
      generateBreadcrumbSchema(surgeon),
      {
        "@type": "WebPage",
        "name": surgeon.meta_title,
        "description": surgeon.meta_description
      }
    ]
  };
}
```

Export all functions. Use proper TypeScript types.
```

---

### Prompt 9: Create Sitemap Generator

```
Create scripts/generate-surgeon-sitemap.ts that:

1. Imports all surgeons from data access layer
2. Generates XML sitemap entries for:
   - Each surgeon profile page
   - Each city directory page
   - Main directory page

3. XML format:
```xml
<url>
  <loc>https://wlsaustralia.com.au/surgeons/sydney/dr-john-smith</loc>
  <lastmod>2025-01-04</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

4. Writes to public/sitemap-surgeons.xml

5. Logs summary:
   - Total URLs added
   - URLs by type (profiles, directories)

Run with: npx tsx scripts/generate-surgeon-sitemap.ts

Use fs and path modules. Include error handling.
```

---

### Prompt 10: Create Page Generator Script

```
Create scripts/generate-surgeon-pages.ts that programmatically generates Astro pages:

1. Reads all surgeons from CSV
2. Groups by city
3. For each city:
   - Creates /src/pages/surgeons/[city-slug]/ directory
   - Generates individual [surgeon-slug].astro for each surgeon

4. Each generated file should import the surgeon data dynamically, not embed it:

```astro
---
import Layout from '@/layouts/Layout.astro';
import { getSurgeonBySlug } from '@/data/surgeons';
import SurgeonHero from '@/components/surgeons/SurgeonHero.astro';
// ... other imports

const { slug } = Astro.params;
const surgeon = getSurgeonBySlug(slug, '[CITY]');

if (!surgeon) {
  return Astro.redirect('/404');
}
---

<Layout title={surgeon.meta_title} description={surgeon.meta_description}>
  <SurgeonHero surgeon={surgeon} />
  <!-- ... other components -->
</Layout>
```

5. Logging:
   - Show progress: "Generating sydney/dr-john-smith.astro"
   - Show summary at end

6. Add --dry-run flag to preview without writing

7. Make it idempotent (safe to run multiple times)

Use TypeScript. Include proper error handling.
```

---

## 📊 TESTING PROMPTS

### Prompt 11: Create Tests

```
Create tests/surgeon-pages.test.ts using Vitest:

Test cases:
1. Data loading:
   - getAllSurgeons returns array
   - Each surgeon has required fields
   - Phone numbers are valid format
   - Ratings are between 0-5
   - URLs are valid

2. Search functions:
   - getSurgeonBySlug finds correct surgeon
   - getSurgeonsByCity filters correctly
   - getSurgeonsByProcedure filters correctly
   - searchSurgeons returns relevant results

3. Helper functions:
   - formatPhoneNumber returns correct format
   - getProcedureList splits correctly
   - formatProcedureName capitalizes correctly

4. Schema generation:
   - generateSurgeonSchema returns valid schema
   - All required fields present
   - Valid JSON-LD format

Run tests with: npm test

Use expect() assertions and describe/it blocks.
```

---

## 🚀 DEPLOYMENT PROMPTS

### Prompt 12: Create Deployment Checklist Script

```
Create scripts/pre-deploy-check.ts that validates:

1. All surgeon pages have:
   - Valid meta title (50-60 chars)
   - Valid meta description (150-160 chars)
   - Valid schema markup (parse and validate)
   - Working phone numbers (format check)
   - Valid image URLs (if present)

2. No broken internal links

3. All pages build successfully

4. Sitemap is up to date

5. robots.txt allows surgeon pages

Output:
- ✅ for passing checks
- ❌ for failing checks
- List of issues to fix

Run with: npx tsx scripts/pre-deploy-check.ts

Return exit code 0 if all pass, 1 if any fail (for CI/CD).
```

---

## 💡 TIPS FOR USING THESE PROMPTS

1. **Copy-paste as-is** - These prompts are designed to be used directly
2. **Run in sequence** - Follow the order for best results
3. **Review output** - Always check generated code before using
4. **Iterate** - If output isn't quite right, ask Claude to refine it
5. **Combine prompts** - You can ask Claude to do multiple related tasks together

**Example iteration:**
```
Claude, the bio you generated is too generic. Can you make it more specific to the surgeon's experience and add more personality? Also include a section about their patient care philosophy.
```

---

**Ready to start? Copy Prompt 1 into Cursor and begin!**

