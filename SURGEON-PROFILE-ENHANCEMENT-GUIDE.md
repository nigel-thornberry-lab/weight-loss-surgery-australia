# Surgeon Profile Enhancement Guide

## 🎯 Overview

This guide explains how to create comprehensive, data-rich surgeon profiles with:
- ✅ Real Google Maps reviews
- ✅ Operating hours
- ✅ Surgeon photos
- ✅ Actual procedures offered
- ✅ Years of experience
- ✅ Professional memberships
- ✅ Pricing information (where available)
- ✅ Direct links to Google Maps & websites

---

## 📋 Step-by-Step Process

### Step 1: Clean Your CSV Data

**Your CSV should include these columns:**
- `business_name` - Practice name
- `surgeon_name` - Individual surgeon name (if available)
- `city` - City location
- `state` - State (NSW, VIC, etc.)
- `google_maps_url` - Full Google Maps URL (REQUIRED for scraping)
- `website` - Surgeon's website URL (REQUIRED for scraping)
- Any other existing data you want to keep

**Example CSV structure:**
```csv
business_name,surgeon_name,city,state,google_maps_url,website
"Dr. Andrew Huo",Andrew Huo,Richmond,VIC,https://www.google.com/maps/search/?api=1&query=...,http://www.melbourneweightloss.com.au/
"Bariatrics Melbourne",Andrew Packiyanathan,Melbourne,VIC,https://www.google.com/maps/search/?api=1&query=...,http://bariatricsmelbourne.com.au/
```

### Step 2: Install Dependencies

Run this command to install all required packages:

```bash
npm install
```

This installs:
- `puppeteer` - For browser automation
- `cheerio` - For HTML parsing
- `axios` - For HTTP requests
- `csv-parser` & `csv-writer` - For CSV processing

### Step 3: Run the Scraper

```bash
npm run scrape:surgeons surgeons-cleaned.csv surgeons-enriched-full.csv
```

**What it does:**
1. Reads your cleaned CSV
2. For each surgeon:
   - Opens Google Maps page
   - Extracts reviews (up to 10 per surgeon)
   - Extracts operating hours
   - Extracts photos
   - Opens their website
   - Extracts procedures offered
   - Extracts professional memberships
   - Extracts pricing information
   - Finds surgeon photos
3. Saves all enriched data to new CSV

**Expected runtime:** 2-5 seconds per surgeon
- 100 surgeons = ~5-10 minutes
- 400 surgeons = ~20-40 minutes

### Step 4: Review Enriched Data

The output CSV will include NEW columns:
- `surgeon_photo` - URL to surgeon's photo
- `operating_hours` - JSON object with hours {"Monday": "9:00 AM - 5:00 PM", ...}
- `professional_memberships` - Comma-separated (FRACS, RACS, ANZBS, etc.)
- `pricing_range` - Extracted pricing (e.g., "$15,000 - $25,000")
- `real_reviews` - JSON array of real Google reviews
- `practice_photos` - JSON array of practice/office photos

### Step 5: Generate Profile Pages

After enrichment, generate the profile pages:

```bash
npm run generate:pages
```

This will create individual surgeon pages in `/src/pages/surgeons/[city]/[surgeon-slug].astro`

---

## 🔍 What Gets Scraped

### From Google Maps:
1. **Reviews** (up to 10 per surgeon)
   - Author name
   - Rating (1-5 stars)
   - Date posted
   - Review text
   
2. **Operating Hours**
   - Monday - Sunday schedule
   - Closed days marked
   
3. **Photos**
   - Practice exterior/interior
   - Office photos
   - Up to 5 photos per location
   
4. **Contact Information**
   - Phone number (validated)
   - Full address
   - Website URL (backup if missing)

### From Surgeon Website:
1. **Procedures Offered**
   - Gastric Sleeve
   - Gastric Bypass
   - Mini Gastric Bypass
   - Gastric Band
   - Duodenal Switch
   
2. **Professional Memberships**
   - FRACS (Fellow of Royal Australasian College of Surgeons)
   - RACS (Royal Australasian College of Surgeons)
   - ANZBS (Australian & NZ Bariatric Surgery Society)
   - OSSANZ (Obesity Surgery Society)
   - AHPRA registration
   
3. **Experience**
   - Years in practice
   - Number of procedures (if listed)
   
4. **Pricing**
   - Price ranges where available
   - "Contact for pricing" if not listed
   
5. **Surgeon Photo**
   - Professional headshot
   - Team photo (if individual not found)

---

## 📊 Enhanced Profile Pages

### New Features on Each Profile:

#### 1. Hero Section
- Surgeon photo (from website or practice)
- Name & qualifications
- Star rating from Google
- Years of experience
- "Book Consultation" CTA

#### 2. Procedures Offered Section
- Cards for each procedure
- Icons for visual appeal
- Links to procedure pages

#### 3. Professional Credentials
- Years of experience
- Estimated procedures performed
- Professional memberships
- Qualifications

#### 4. Real Patient Reviews
- Google reviews with stars
- Author names
- Review dates
- Full review text
- "View all reviews on Google" link

#### 5. Location & Hours
- Interactive map (Google Maps embed)
- Full address
- Operating hours (Monday - Sunday)
- Phone number (clickable)
- "Get Directions" button

#### 6. Pricing Information
- Price ranges (where available)
- "Contact for pricing" messaging
- "Book Free Consultation" CTA

#### 7. Gallery
- Practice photos
- Office images
- Facility photos (from Google Maps)

---

## 🔧 Customization Options

### Adjust Scraping Limits

Edit `scripts/scrape-surgeon-data.js`:

```javascript
const CONFIG = {
  DELAY_BETWEEN_SURGEONS: 2000,  // Time between surgeons (ms)
  DELAY_BETWEEN_PAGES: 1000,     // Time between pages (ms)
  MAX_REVIEWS_PER_SURGEON: 10,   // Number of reviews to scrape
  HEADLESS: true,                // Run browser in background
  TIMEOUT: 30000,                // Page load timeout (ms)
};
```

### Add More Data Sources

You can extend the scraper to include:
- RateMDs reviews
- HealthEngine reviews
- LinkedIn profiles
- Medical directory listings

---

## 🚨 Important Notes

### Rate Limiting
- The scraper includes delays to avoid rate limiting
- Google Maps: 2 seconds between requests
- Websites: 1 second between pages
- Do NOT reduce these delays or you may get blocked

### Legal Considerations
- ✅ Scraping publicly available data (reviews, hours) is legal
- ✅ Linking to Google Maps is allowed
- ✅ Displaying reviews with attribution is fair use
- ⚠️ Always respect robots.txt
- ⚠️ Don't scrape private/gated content

### Data Quality
- Not all surgeons will have complete data
- Some websites may not list procedures explicitly
- Pricing is often not public
- Photos may not always be available

---

## 📝 CSV Data Validation

### Before Running Scraper:

**Required Fields:**
- ✅ `google_maps_url` must be valid Google Maps URL
- ✅ `website` must be valid HTTP/HTTPS URL
- ✅ `city` and `state` must be present

**Recommended Fields:**
- `surgeon_name` (helps with photo detection)
- `business_name` (fallback for surgeon_name)
- `phone` (backup if not scraped)
- `rating` (from initial data collection)

### Data Cleaning Tips:

1. **Google Maps URLs:**
   ```
   ✅ Good: https://www.google.com/maps/search/?api=1&query=...
   ✅ Good: https://maps.google.com/?cid=123456789
   ❌ Bad: maps.google.com (missing https://)
   ❌ Bad: Just the business name
   ```

2. **Website URLs:**
   ```
   ✅ Good: https://www.example.com
   ✅ Good: http://example.com.au
   ❌ Bad: www.example.com (missing http)
   ❌ Bad: example (incomplete URL)
   ```

3. **Remove duplicates** based on:
   - Same Google Maps Place ID
   - Same website URL
   - Same phone number + city

---

## 🎨 Styling & Design

### Profile Page Components:

Located in `/src/components/surgeons/`:

1. **SurgeonHero.astro** - Top banner with photo & name
2. **SurgeonBio.astro** - Professional background
3. **SurgeonProcedures.astro** - Procedures offered
4. **SurgeonReviews.astro** - Google reviews display
5. **SurgeonLocation.astro** - Map, hours, contact
6. **SurgeonCTA.astro** - Call-to-action buttons

### To Customize Styling:
- All components use Tailwind CSS classes
- Edit component files directly
- Colors: Primary blue (#2563EB)
- Font: Poppins (recently updated)

---

## 🚀 Deployment

After generating enriched profiles:

1. **Build the site:**
   ```bash
   npm run build
   ```

2. **Test locally:**
   ```bash
   npm run preview
   ```

3. **Deploy to Vercel:**
   ```bash
   git add .
   git commit -m "Add enhanced surgeon profiles with real data"
   git push origin main
   ```

Vercel will automatically deploy the changes.

---

## 📈 SEO Benefits

Enhanced profiles provide:

1. **Rich Snippets**
   - Star ratings visible in search results
   - Operating hours in Google Business
   - Review count displayed
   
2. **Local SEO**
   - Accurate address data
   - Phone numbers for local search
   - Hours of operation
   
3. **User Engagement**
   - Real reviews build trust
   - Photos increase engagement
   - Clear procedures listed
   
4. **E-E-A-T Signals**
   - Professional memberships
   - Years of experience
   - Credentials displayed

---

## 🐛 Troubleshooting

### "Module not found" errors:
```bash
npm install
```

### Scraper times out:
- Increase `TIMEOUT` in CONFIG
- Check your internet connection
- Some sites block automated requests

### Missing reviews:
- Google may not show reviews without scrolling
- Try increasing delays in CONFIG
- Some profiles have reviews disabled

### Photos not found:
- Not all websites have surgeon photos
- Try manual upload for key surgeons
- Use practice photos as backup

### Pricing not extracted:
- Most surgeons don't list prices publicly
- Manual entry recommended
- Use "Contact for consultation" messaging

---

## 🎯 Next Steps

### Immediate:
1. Clean your CSV with Google Maps URLs & websites
2. Run the scraper
3. Review enriched data
4. Generate pages
5. Deploy

### Future Enhancements:
- [ ] Add video testimonials
- [ ] Before/after gallery (if ethically sourced)
- [ ] Online booking integration
- [ ] Patient questionnaire/quiz
- [ ] Insurance checker tool
- [ ] Cost calculator
- [ ] Virtual consultation booking

---

## 💡 Pro Tips

1. **Batch Processing**
   - Process surgeons in batches of 50-100
   - Easier to review and fix issues
   
2. **Manual Review**
   - Always review scraped data
   - Some surgeons need manual correction
   - Verify photos are appropriate
   
3. **Keep CSV Updated**
   - Re-run scraper quarterly
   - Reviews and hours change
   - New procedures added
   
4. **Backup Data**
   - Keep original CSV
   - Save each scraping run
   - Track changes over time

---

## 📞 Support

If you encounter issues:
1. Check error messages in console
2. Verify CSV format is correct
3. Test with single surgeon first
4. Review troubleshooting section above

---

## ✅ Checklist

Before going live:

- [ ] All Sydney surgeons have profiles
- [ ] Melbourne surgeons updated
- [ ] Compare page removed
- [ ] Google Maps links working
- [ ] Website links working
- [ ] Reviews displaying correctly
- [ ] Hours formatted properly
- [ ] Photos loading
- [ ] Mobile responsive
- [ ] SEO meta tags updated
- [ ] Tested on staging
- [ ] Backup created
- [ ] Deployed to production

---

**Last Updated:** January 2025
**Version:** 1.0

