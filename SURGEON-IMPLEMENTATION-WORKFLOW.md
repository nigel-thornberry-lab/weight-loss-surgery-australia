# SURGEON PROFILE IMPLEMENTATION - PRACTICAL WORKFLOW
**Step-by-Step Guide with Claude Prompts**

---

## 🚀 PHASE 1: DATA COLLECTION (Week 1)

### Day 1-2: Apify Scraping Setup

#### Step 1: Set Up Apify Account

1. Go to https://apify.com
2. Sign up for account (free tier includes $5 credit)
3. Search for "Google Maps Scraper" by Epctex
4. Click "Try for free"

#### Step 2: Configure the Scraper

**Input Configuration:**

```json
{
  "searchStringsArray": [
    "bariatric surgeon Sydney",
    "gastric sleeve surgeon Sydney",
    "gastric bypass surgeon Sydney",
    "weight loss surgeon Sydney",
    "obesity surgeon Sydney",
    "bariatric surgeon Parramatta",
    "bariatric surgeon Liverpool",
    "bariatric surgeon Westmead",
    "bariatric surgeon Melbourne",
    "gastric sleeve surgeon Melbourne",
    "gastric bypass surgeon Melbourne",
    "weight loss surgeon Melbourne",
    "bariatric surgeon Footscray",
    "bariatric surgeon Box Hill",
    "bariatric surgeon Brisbane",
    "gastric sleeve surgeon Brisbane",
    "bariatric surgeon Perth",
    "gastric sleeve surgeon Perth",
    "bariatric surgeon Adelaide",
    "bariatric surgeon Gold Coast",
    "bariatric surgeon Canberra",
    "bariatric surgeon Hobart"
  ],
  "maxCrawledPlacesPerSearch": 50,
  "language": "en",
  "countryCode": "au",
  "includeReviews": true,
  "maxReviews": 20,
  "includeImages": true,
  "maxImages": 5,
  "includeOpeningHours": true,
  "includePeopleAlsoSearch": false,
  "additionalInfo": true,
  "exportPlaceUrls": true
}
```

#### Step 3: Run and Download

1. Click "Start" (takes 2-4 hours)
2. Monitor progress in Apify dashboard
3. When complete, click "Export results"
4. Download as CSV
5. Save to: `/data/raw/google-maps-surgeons-raw.csv`

**Expected Output:** 200-500 surgeon/clinic results

---

### Day 3-4: Data Cleaning

#### Open Google Sheets

1. Upload `/data/raw/google-maps-surgeons-raw.csv` to Google Sheets
2. Create a copy: "Surgeons Master - Working Copy"

#### Cleaning Checklist

**1. Remove Duplicates**

```
# Formula to check for duplicates
=COUNTIF(B:B, B2) > 1

# Filter and keep only unique surgeons
# Keep the entry with highest review count
```

**2. Standardize Phone Numbers**

```
# Remove spaces and format
=REGEXREPLACE(C2, "[^0-9]", "")

# Add country code if missing
=IF(LEN(D2)=10, "61"&D2, D2)

# Format as display: (02) 9876 5432
=IF(LEN(E2)=12, 
  "("&MID(E2,3,2)&") "&MID(E2,5,4)&" "&MID(E2,9,4),
  E2)
```

**3. Clean Addresses**

```
# Proper case for addresses
=PROPER(F2)

# Extract suburb, state, postcode
=REGEXEXTRACT(F2, "([A-Za-z\s]+),\s*([A-Z]{2,3})\s*(\d{4})")
```

**4. Categorize Procedures**

Look at business category and name to determine procedures offered:

```
# Formula to detect procedures from name/category
=IF(OR(
  REGEXMATCH(G2, "(?i)gastric sleeve|sleeve gastrectomy|VSG"),
  REGEXMATCH(H2, "(?i)gastric sleeve|sleeve gastrectomy")
), "gastric-sleeve", "") & 
IF(OR(
  REGEXMATCH(G2, "(?i)gastric bypass|RYGB"),
  REGEXMATCH(H2, "(?i)gastric bypass")
), "|gastric-bypass", "") &
IF(OR(
  REGEXMATCH(G2, "(?i)gastric band|lap band"),
  REGEXMATCH(H2, "(?i)gastric band")
), "|gastric-band", "")
```

**5. Extract Qualifications**

```
# Extract FRACS, MBBS, etc. from name
=REGEXEXTRACT(I2, "(FRACS|MBBS|GAICD|FACS|PhD|MD)")

# Create comma-separated list
=JOIN(", ", UNIQUE(SPLIT(J2, "|")))
```

#### Download Cleaned Data

1. File → Download → CSV
2. Save as: `/data/clean/surgeons-master-clean.csv`

---

### Day 5-6: Data Enrichment with Claude

#### Upload CSV to Cursor

1. Open project in Cursor
2. Create folder: `/data`
3. Copy `surgeons-master-clean.csv` to `/data/`

#### Claude Prompt #1: Enrich Data

```
I have a CSV file with surgeon data at /data/surgeons-master-clean.csv

Please create a Node.js script that:

1. Reads the CSV file
2. For each surgeon:
   - Estimates years of experience from qualifications/bio
   - Calculates estimated procedures performed (years × 150 procedures/year)
   - Generates SEO-friendly slug (lowercase, hyphens, no special chars)
   - Creates meta title: "[Name] - Bariatric Surgeon [City] | Gastric Sleeve & Bypass"
   - Creates meta description: "[Name] is an experienced bariatric surgeon in [City] with [years] years experience. Rating: [rating] stars. Book consultation."
   - Assigns priority score: (rating × review_count × years_experience) / 10
   - Categorizes as tier 1/2/3 based on priority score

3. Outputs enriched CSV to /data/surgeons-master-enriched.csv

Include proper error handling and progress logging.
```

#### Claude Prompt #2: Generate Bio Content

```
For surgeons with missing or short bios, create a Node.js script that:

1. Reads /data/surgeons-master-enriched.csv
2. For each surgeon with bio_long < 200 characters:
   - Generate a professional 500-800 word bio including:
     * Opening paragraph with name, city, years experience
     * Specialties and procedures offered
     * Education and qualifications (use provided credentials)
     * Hospital affiliations (if provided)
     * Patient-centered approach
     * Contact and consultation information
   - Use a professional, compassionate tone
   - Include relevant keywords naturally

3. Update the CSV with generated bios
4. Output to /data/surgeons-master-final.csv

Use a template-based approach with variable insertion. Make each bio unique but maintain consistent structure.
```

#### Run the Scripts

```bash
# Install dependencies
npm install csv-parser csv-writer

# Run enrichment
node scripts/enrich-surgeon-data.js

# Run bio generation
node scripts/generate-surgeon-bios.js
```

---

### Day 7: Manual Validation

#### Validate Top 20 Surgeons

Create a validation spreadsheet:

```
Surgeon Name | Phone Verified | Address Verified | AHPRA Verified | Bio Quality | Action Items
-------------+----------------+------------------+----------------+-------------+--------------
Dr. John Smith | ✅ | ✅ | ✅ | Good | Request photo
Dr. Jane Doe | ❌ | ✅ | ✅ | Needs work | Update phone, enhance bio
```

**Validation Process:**
1. Call phone number to verify it's correct
2. Look up address on Google Maps
3. Check AHPRA registration: https://www.ahpra.gov.au/registration/registers-of-practitioners.aspx
4. Read bio for quality and accuracy
5. Note any issues or improvements needed

---

## 💻 PHASE 2: CODE GENERATION (Week 2)

### Day 1: Create Data Access Layer

#### Claude Prompt #3: Data Access Layer

```
Create a TypeScript data access layer at src/data/surgeons.ts that:

1. Reads /data/surgeons-master-final.csv
2. Exports a Surgeon interface with all CSV fields (typed appropriately)
3. Exports these functions:

   - getAllSurgeons(): Surgeon[]
     Returns all surgeons

   - getSurgeonBySlug(slug: string, city: string): Surgeon | null
     Find surgeon by slug and city
     
   - getSurgeonsByCity(city: string): Surgeon[]
     Filter surgeons by city
     
   - getSurgeonsByProcedure(procedure: string): Surgeon[]
     Filter surgeons who offer specific procedure
     
   - getFeaturedSurgeons(limit: number = 10): Surgeon[]
     Get top surgeons by priority_score
     
   - searchSurgeons(query: string): Surgeon[]
     Search by name, city, or procedures
     
   - getRelatedSurgeons(surgeon: Surgeon, limit: number = 3): Surgeon[]
     Get surgeons in same city with similar procedures
     
   - getSurgeonsByTier(tier: 1 | 2 | 3): Surgeon[]
     Filter by tier (based on priority_score)

4. Include helper functions:
   - formatPhoneNumber(phone: string): string
   - formatRating(rating: number): string
   - getProcedureList(procedures: string): string[]
   - generateSlug(name: string): string

5. Add proper error handling and TypeScript types

Use modern ES6+ syntax and make it tree-shakeable.
```

---

### Day 2: Generate Surgeon Profile Components

#### Claude Prompt #4: Create Reusable Components

```
Create reusable Astro components for surgeon profiles:

1. src/components/surgeons/SurgeonHero.astro
   Props: surgeon (Surgeon type)
   
   Layout:
   - Left: Profile photo (192x192, rounded-2xl)
   - Right: Name (H1), qualifications, short bio
   - Trust badges: AHPRA verified, rating, years experience
   - Quick stats grid: procedures performed, years, rating
   - Primary CTA: "Book Free Consultation" button
   - Secondary CTA: Phone number as clickable link
   
   Style: Professional medical aesthetic, blue gradient background

2. src/components/surgeons/SurgeonProcedures.astro
   Props: surgeon
   
   Layout:
   - Grid of procedure cards (3 columns on desktop)
   - Each card: icon, procedure name, description, price range
   - Link to procedure page with surgeon parameter
   
   Style: Clean cards with hover effects

3. src/components/surgeons/SurgeonBio.astro
   Props: surgeon
   
   Layout:
   - Full bio content (prose styling)
   - Qualifications list with checkmarks
   - Hospital affiliations in card format
   
   Style: Readable typography, professional

4. src/components/surgeons/SurgeonReviews.astro
   Props: surgeon
   
   Layout:
   - Overall rating display at top
   - Individual review cards (show top 10)
   - Each review: author name, rating stars, date, text, verified badge
   - Link to Google Maps for all reviews
   
   Style: Card-based, trustworthy

5. src/components/surgeons/SurgeonLocation.astro
   Props: surgeon
   
   Layout:
   - Two columns: Map (left) and Contact info (right)
   - Embedded Google Maps iframe
   - Address, phone, email, website, opening hours
   - Directions and parking info
   
   Style: Clean and informative

6. src/components/surgeons/SurgeonCTA.astro
   Props: surgeon
   
   Layout:
   - Full-width gradient section
   - Centered heading and subheading
   - Two CTAs: Book consultation, Call now
   - Trust indicators below
   
   Style: Eye-catching, conversion-focused

Use Tailwind CSS with modern patterns:
- rounded-2xl borders
- Subtle shadows and hover effects
- Professional blue color scheme
- Mobile-responsive grid layouts
- Proper semantic HTML

Include TypeScript interfaces for props.
```

---

### Day 3: Generate Surgeon Profile Pages

#### Claude Prompt #5: Dynamic Profile Pages

```
Create an Astro dynamic route at src/pages/surgeons/[city]/[slug].astro that:

1. Gets city and slug from URL params
2. Fetches surgeon data using getSurgeonBySlug()
3. Returns 404 if surgeon not found
4. Generates schema markup for:
   - Physician
   - MedicalWebPage
   - FAQPage
   - BreadcrumbList

5. Uses these components in order:
   - SurgeonHero
   - SurgeonProcedures
   - SurgeonBio
   - SurgeonReviews
   - SurgeonLocation
   - SurgeonCTA

6. Includes proper meta tags:
   - title (from surgeon.meta_title)
   - description (from surgeon.meta_description)
   - canonical URL
   - Open Graph tags
   - Twitter Card tags

7. Adds conversion tracking:
   - Track CTA clicks
   - Track phone clicks
   - Track form submissions

Also create src/pages/surgeons/[city]/index.astro for city surgeon directory:
- List all surgeons in that city
- Filter by procedure
- Sort by rating, experience, name
- Grid/list view toggle
- Map showing all surgeon locations

Make everything fully typed with TypeScript.
```

---

### Day 4: Generate Directory Pages

#### Claude Prompt #6: Main Directory Page

```
Create src/pages/surgeons/index.astro for the main surgeon directory:

Features:
1. Hero section explaining the directory
2. Search bar (filters by name, city, procedure)
3. Filters sidebar:
   - City dropdown
   - Procedure checkboxes
   - Rating filter (4.5+, 4.0+, 3.5+)
   - Years experience slider
4. Sort options: Rating, Experience, Name, Newest
5. View toggle: Grid vs List
6. Surgeon cards showing:
   - Photo
   - Name and qualifications
   - City and rating
   - Procedures offered
   - "View Profile" button

7. Pagination (20 per page)
8. Map view showing all surgeons

For map view, create SurgeonMap.astro component with:
- Google Maps embed
- Custom markers for each surgeon
- Info window on marker click
- Cluster markers when zoomed out

Use clean, modern design with Tailwind.
Add filters as URL query params for SEO and shareability.
```

#### Claude Prompt #7: Comparison Tool

```
Create src/pages/surgeons/compare.astro for surgeon comparison:

Features:
1. Select up to 3 surgeons via URL params: ?a=slug1&b=slug2&c=slug3
2. Side-by-side comparison table:
   - Profile photos
   - Names and qualifications
   - Years of experience
   - Procedures offered
   - Ratings and reviews
   - Hospital affiliations
   - Consultation fees
   - Surgery price ranges
   - Insurance accepted
   - Location
   
3. Highlight differences in styling
4. "Book Consultation" buttons for each
5. Share comparison URL button

If no surgeons selected, show:
- Popular comparisons
- Search tool to find surgeons

Make the table mobile-responsive (stack vertically on mobile).
```

---

### Day 5: Automated Page Generation Script

#### Claude Prompt #8: Generation Script

```
Create scripts/generate-surgeon-pages.ts that:

1. Reads /data/surgeons-master-final.csv
2. Groups surgeons by city
3. For each city:
   - Creates /src/pages/surgeons/[city-slug]/ directory
   - Generates [surgeon-slug].astro file for each surgeon
   - Each file imports data from surgeons.ts (not embedded)
   - Uses standard template structure

4. Generates /src/pages/surgeons/[city-slug]/index.astro for each city directory

5. Logs progress:
   - City being processed
   - Surgeon pages created
   - Any errors encountered

6. Creates summary report:
   - Total pages generated
   - Pages by city
   - Average time per page

Run with: npx tsx scripts/generate-surgeon-pages.ts

Make it idempotent (safe to run multiple times).
Add --dry-run flag to preview without writing files.
```

#### Run Generation

```bash
# Install dependencies
npm install tsx

# Dry run first (preview)
npx tsx scripts/generate-surgeon-pages.ts --dry-run

# Generate all pages
npx tsx scripts/generate-surgeon-pages.ts

# Output should show:
# ✓ Generated sydney/dr-john-smith.astro
# ✓ Generated sydney/dr-jane-doe.astro
# ...
# ✅ Total: 247 surgeon pages created
```

---

### Day 6: Schema Markup and SEO

#### Claude Prompt #9: Schema Generation

```
Create src/utils/schema.ts with functions to generate schema markup:

1. generateSurgeonSchema(surgeon: Surgeon): SchemaGraph
   Returns full @graph with:
   - Physician (with all surgeon details)
   - MedicalWebPage
   - BreadcrumbList
   
2. generateFAQSchema(faqs: FAQ[]): FAQPage
   Generate FAQ schema for surgeon profiles

3. generateReviewSchema(surgeon: Surgeon): AggregateRating
   Generate review schema

Include proper TypeScript types for all schema objects.
Validate against schema.org specifications.

Also create src/utils/seo.ts with:
- generateMetaTags(surgeon: Surgeon): MetaTags
- generateCanonicalUrl(surgeon: Surgeon): string
- generateOGTags(surgeon: Surgeon): OGTags
```

---

### Day 7: Testing and QA

#### Testing Checklist

Create `tests/surgeon-pages.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { getAllSurgeons, getSurgeonBySlug } from '../src/data/surgeons';

describe('Surgeon Data', () => {
  it('should load all surgeons', () => {
    const surgeons = getAllSurgeons();
    expect(surgeons.length).toBeGreaterThan(0);
  });

  it('should find surgeon by slug', () => {
    const surgeon = getSurgeonBySlug('dr-john-smith', 'sydney');
    expect(surgeon).toBeDefined();
    expect(surgeon?.name).toContain('John Smith');
  });

  it('should have valid phone numbers', () => {
    const surgeons = getAllSurgeons();
    surgeons.forEach(surgeon => {
      expect(surgeon.phone).toMatch(/^(\+?61|0)[0-9\s]{8,}$/);
    });
  });

  it('should have valid ratings', () => {
    const surgeons = getAllSurgeons();
    surgeons.forEach(surgeon => {
      expect(surgeon.rating).toBeGreaterThanOrEqual(0);
      expect(surgeon.rating).toBeLessThanOrEqual(5);
    });
  });
});
```

#### Manual Testing

Test on staging:

1. **Load Times**
   ```bash
   # Use Lighthouse
   npx lighthouse https://staging.wlsaustralia.com.au/surgeons/sydney/dr-john-smith --view
   
   # Target: 90+ score
   ```

2. **Schema Validation**
   - Go to: https://search.google.com/test/rich-results
   - Test 10 random surgeon pages
   - Fix any schema errors

3. **Mobile Responsiveness**
   - Test on iPhone, Android
   - Check all CTAs work
   - Verify phone click-to-call works

4. **Conversion Tracking**
   - Click all CTAs
   - Submit test form
   - Verify tracking fires in Google Analytics

---

## 🚀 PHASE 3: LAUNCH & OPTIMIZE (Week 3)

### Day 1: Deploy to Production

#### Pre-Launch Checklist

- [ ] All 200+ surgeon pages generated
- [ ] Schema markup validated
- [ ] Mobile tested
- [ ] Forms work
- [ ] Tracking installed
- [ ] Sitemap generated
- [ ] robots.txt updated

#### Deployment

```bash
# Build production site
npm run build

# Deploy to Vercel
vercel --prod

# Verify deployment
curl -I https://wlsaustralia.com.au/surgeons/sydney/dr-john-smith

# Should return 200 OK
```

---

### Day 2: SEO Setup

#### Generate Sitemap

Create `scripts/generate-surgeon-sitemap.ts`:

```typescript
import fs from 'fs';
import { getAllSurgeons } from '../src/data/surgeons';

const surgeons = getAllSurgeons();
const baseUrl = 'https://wlsaustralia.com.au';

const sitemapEntries = surgeons.map(surgeon => {
  const url = `${baseUrl}/surgeons/${surgeon.city}/${surgeon.slug}`;
  return `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
}).join('');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>`;

fs.writeFileSync('public/sitemap-surgeons.xml', sitemap);
console.log(`✅ Generated sitemap with ${surgeons.length} surgeon URLs`);
```

#### Submit to Google Search Console

1. Go to: https://search.google.com/search-console
2. Add property if not already added
3. Go to Sitemaps
4. Submit: `https://wlsaustralia.com.au/sitemap-surgeons.xml`
5. Click "Submit"

#### Set Up Rank Tracking

In SEMrush or Ahrefs:

```
Track these keywords for top 20 surgeons:
- [surgeon name] sydney
- dr [last name] sydney
- [surgeon name] bariatric surgeon
- [surgeon name] reviews
- [surgeon name] cost

Total: ~100 keywords to track
```

---

### Day 3-4: Surgeon Outreach

#### Email Template

```
Subject: Your profile on Weight Loss Surgery Australia

Hi Dr. [Last Name],

I wanted to let you know that we've featured your practice on Weight Loss Surgery Australia:

https://wlsaustralia.com.au/surgeons/[city]/[your-slug]

We're a free resource helping patients find qualified bariatric surgeons. Your profile includes:
✓ Your qualifications and experience
✓ Patient reviews from Google
✓ Procedures you offer
✓ Contact information

If you'd like to:
• Verify your details
• Update your bio
• Add a professional photo
• Claim your profile

Please reply to this email or call us at [phone].

All the best,
[Your Name]
Weight Loss Surgery Australia
```

#### Follow-Up Calls

For top 20 surgeons:
1. Call their office
2. Introduce yourself
3. Mention the free profile
4. Offer to update any details
5. Ask if they'd like to be "featured" (for a fee, if you want to monetize)
6. Request professional headshot

---

### Day 5-7: Initial Link Building

#### Directory Submissions

Submit surgeon profiles to:

1. **Medical Directories**
   - HealthEngine
   - HealthShare
   - RateMDs Australia
   - True Local (medical category)

2. **Local Business Directories**
   - Google Business Profile (if you create one)
   - Yellow Pages Australia
   - White Pages Australia

3. **Industry Directories**
   - Australian Medical Association
   - RACS (Royal Australasian College of Surgeons)

#### Content Partnerships

Reach out to:
- Weight loss blogs
- Health and wellness sites
- Women's health publications

Pitch:
```
Subject: Free surgeon directory for your readers

Hi [Name],

I run Weight Loss Surgery Australia, a free resource helping people find qualified bariatric surgeons.

We have profiles for 200+ AHPRA-registered surgeons across Australia with:
• Patient reviews
• Transparent pricing
• Procedure information
• Direct booking

Would you be interested in linking to our surgeon directory from your [relevant article]? 

Happy to return the favor by linking to your content from our blog.

Best,
[Your Name]
```

---

## 📊 PHASE 4: MONITOR & OPTIMIZE (Ongoing)

### Week 4+: Continuous Improvement

#### Weekly Tasks

**Monday: Analytics Review**
```
Check in Google Analytics:
1. Surgeon page views (top 20)
2. Conversion rate by surgeon
3. Traffic sources
4. Bounce rate issues

Look for:
- Surgeons with high traffic but low conversions → improve CTAs
- High bounce rate → improve content quality
- Pages not getting traffic → improve SEO
```

**Wednesday: Ranking Check**
```
Check keyword rankings:
1. How many surgeon names rank top 10?
2. Any sudden ranking drops?
3. New competitors appearing?

Actions:
- Build backlinks to pages that dropped
- Update content on underperforming pages
- Add more reviews/testimonials
```

**Friday: Data Updates**
```
Update surgeon data:
1. Re-scrape Google Maps (monthly)
2. Update review counts
3. Add new surgeons
4. Remove closed practices
5. Update photos/bios

Run: npx tsx scripts/update-surgeon-data.ts
```

#### Monthly Tasks

**First Monday: Performance Report**

Generate monthly report:
```typescript
// scripts/generate-monthly-report.ts
import { getAllSurgeons } from '../src/data/surgeons';
import { getAnalyticsData } from '../src/utils/analytics';

const report = {
  totalSurgeons: getAllSurgeons().length,
  totalViews: getAnalyticsData('surgeon-pages', 'pageviews'),
  totalConversions: getAnalyticsData('surgeon-pages', 'goals'),
  conversionRate: calculateConversionRate(),
  revenue: estimateRevenue(),
  topSurgeons: getTopSurgeons(10),
  newSurgeons: getRecentlyAdded(),
  improvements: []
};

console.log(JSON.stringify(report, null, 2));
```

**Mid-Month: Content Enhancement**

Pick 5 underperforming surgeons:
1. Enhance bio (add more detail)
2. Request professional photo
3. Add before/after gallery (if available)
4. Record video introduction
5. Build 3-5 backlinks to their profile

**End of Month: Competitive Analysis**

Check competitors:
1. Are they creating surgeon profiles?
2. What features do they have that you don't?
3. Where are they ranking that you're not?

Actions:
- Add missing features
- Create content for gaps
- Build more backlinks

---

## 🎯 SUCCESS METRICS

### Month 1 Targets
- [ ] 200+ surgeon pages live
- [ ] 50+ surgeon keywords ranking (any position)
- [ ] 100-300 organic visits to surgeon pages
- [ ] 5-15 consultations booked
- [ ] $2.5K-7.5K revenue

### Month 3 Targets
- [ ] 250+ surgeon pages live
- [ ] 100+ surgeon keywords top 10
- [ ] 600-1,200 organic visits to surgeon pages
- [ ] 20-50 consultations booked
- [ ] $10K-25K revenue

### Month 6 Targets
- [ ] 300+ surgeon pages live
- [ ] 300+ surgeon keywords top 10
- [ ] 1,500-3,000 organic visits to surgeon pages
- [ ] 80-150 consultations booked
- [ ] $40K-75K revenue

---

## 🔧 TROUBLESHOOTING

### Common Issues

**Issue: Pages not indexing**
Solution:
1. Check robots.txt allows surgeon pages
2. Verify sitemap submitted to GSC
3. Build internal links to surgeon pages
4. Request indexing in GSC for key pages

**Issue: Low conversion rate**
Solution:
1. A/B test CTA button text and color
2. Add more trust signals (badges, reviews)
3. Simplify booking form
4. Add exit-intent popup
5. Show pricing more prominently

**Issue: Duplicate content**
Solution:
1. Ensure each surgeon bio is unique
2. Add surgeon-specific FAQs
3. Include unique reviews for each
4. Vary the procedures section content

**Issue: Slow page load**
Solution:
1. Optimize images (WebP, lazy loading)
2. Minimize JavaScript
3. Use CDN for static assets
4. Implement caching
5. Use Astro's built-in optimizations

---

## 📚 RESOURCES

### Tools Used
- **Apify** - Google Maps scraping ($5-50/month)
- **Google Sheets** - Data cleaning (free)
- **Cursor/Claude** - Code generation (subscription)
- **SEMrush/Ahrefs** - Rank tracking ($100+/month)
- **Google Analytics** - Traffic tracking (free)
- **Google Search Console** - Index monitoring (free)

### Helpful Links
- Apify Google Maps Scraper: https://apify.com/epctex/google-maps-scraper
- AHPRA Register: https://www.ahpra.gov.au/registration/registers-of-practitioners.aspx
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Physician: https://schema.org/Physician

---

**Ready to start? Begin with Phase 1, Day 1: Set up your Apify account!**

