# Surgeon Pages Generation Script Documentation

## Overview

Automated script to generate individual surgeon profile pages and city directory pages for all 395 surgeons in the database.

**Created:** October 5, 2025  
**Location:** `scripts/generate-surgeon-pages.ts`  
**Status:** ✅ Ready to Run

---

## 📦 What Gets Generated

### Individual Surgeon Pages
**Format:** `src/pages/surgeons/[city-slug]/[surgeon-slug].astro`

**Example:** `src/pages/surgeons/sydney/dr-john-smith.astro`

**Features:**
- Full profile using all 7 surgeon components
- SEO-optimized meta tags
- Related surgeons section
- Compare CTA button
- Dynamic data from surgeons.ts

### City Directory Pages
**Format:** `src/pages/surgeons/[city-slug]/index.astro`

**Example:** `src/pages/surgeons/sydney/index.astro`

**Features:**
- Lists all surgeons in the city
- Sortable by rating
- Quick stats
- Breadcrumb navigation
- Links to compare page

---

## 🚀 Installation

### Install Dependencies
```bash
npm install --save-dev tsx
```

---

## 📖 Usage

### Dry Run (Preview Only)
Preview what will be generated without creating files:
```bash
npx tsx scripts/generate-surgeon-pages.ts --dry-run
```

**Output Example:**
```
📖 Reading CSV file...
✓ Loaded 395 surgeon records

📋 Grouping surgeons by city...
✓ Found 47 cities

📍 Processing Sydney (89 surgeons)...
  [DRY RUN] Would create: src/pages/surgeons/sydney/dr-john-smith.astro
  [DRY RUN] Would create: src/pages/surgeons/sydney/dr-jane-doe.astro
  ...
  [DRY RUN] Would create: src/pages/surgeons/sydney/index.astro

📍 Processing Melbourne (67 surgeons)...
  ...
```

### Generate All Pages
Generate actual files:
```bash
npx tsx scripts/generate-surgeon-pages.ts
```

**Output Example:**
```
📖 Reading CSV file...
✓ Loaded 395 surgeon records

📋 Grouping surgeons by city...
✓ Found 47 cities

📍 Processing Sydney (89 surgeons)...
  ✓ Created: src/pages/surgeons/sydney/dr-john-smith.astro
  ✓ Created: src/pages/surgeons/sydney/dr-jane-doe.astro
  ...
  ✓ Created: src/pages/surgeons/sydney/index.astro

📊 GENERATION SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Pages Generated:       395 surgeon profiles
City Directory Pages:        47 city indexes
Cities Processed:            47 cities
Total Time:                  12.5s
Avg Time Per Page:           28ms
Errors Encountered:          0

✅ Generation complete!
```

---

## 🏗️ Generated Structure

After running the script:

```
src/pages/surgeons/
├── index.astro                    (main directory - already exists)
├── compare.astro                  (comparison tool - already exists)
│
├── sydney/
│   ├── index.astro               (Sydney directory page)
│   ├── dr-john-smith.astro       (Individual profiles)
│   ├── dr-jane-doe.astro
│   ├── dr-michael-jones.astro
│   └── ... (89 total)
│
├── melbourne/
│   ├── index.astro               (Melbourne directory page)
│   ├── dr-sarah-wilson.astro     (Individual profiles)
│   ├── dr-david-brown.astro
│   └── ... (67 total)
│
├── brisbane/
│   ├── index.astro
│   └── ... (43 total)
│
├── perth/
│   ├── index.astro
│   └── ... (31 total)
│
└── ... (47 cities total)
```

---

## 📄 Generated File Structure

### Individual Surgeon Page Template

```astro
---
/**
 * Surgeon Profile Page: Dr. John Smith
 * 
 * Auto-generated from surgeons-with-bios.csv
 * City: Sydney
 * Rating: 4.8⭐
 */

import Layout from '../../../layouts/Layout.astro';
import SurgeonHero from '../../../components/surgeons/SurgeonHero.astro';
import SurgeonProcedures from '../../../components/surgeons/SurgeonProcedures.astro';
import SurgeonBio from '../../../components/surgeons/SurgeonBio.astro';
import SurgeonReviews from '../../../components/surgeons/SurgeonReviews.astro';
import SurgeonLocation from '../../../components/surgeons/SurgeonLocation.astro';
import SurgeonCTA from '../../../components/surgeons/SurgeonCTA.astro';
import { getSurgeonBySlug, getRelatedSurgeons } from '../../../data/surgeons';

// Get surgeon data
const surgeonSlug = 'dr-john-smith';
const surgeon = getSurgeonBySlug(surgeonSlug);

if (!surgeon) {
  return Astro.redirect('/surgeons/');
}

// Get related surgeons
const relatedSurgeons = getRelatedSurgeons(surgeon, 3);
---

<Layout title={surgeon.meta_title} description={surgeon.meta_description}>
  <SurgeonHero surgeon={surgeon} />
  <SurgeonProcedures surgeon={surgeon} />
  <SurgeonBio surgeon={surgeon} />
  <SurgeonReviews surgeon={surgeon} />
  <SurgeonLocation surgeon={surgeon} />
  <SurgeonCTA surgeon={surgeon} />
  
  <!-- Related Surgeons Section -->
  <!-- Compare CTA -->
</Layout>
```

### City Directory Page Template

```astro
---
/**
 * City Directory Page: Sydney
 * 
 * Auto-generated directory of surgeons in Sydney
 * Total surgeons: 89
 */

import Layout from '../../../layouts/Layout.astro';
import { getSurgeonsByCity } from '../../../data/surgeons';

const surgeons = getSurgeonsByCity('Sydney');
surgeons.sort((a, b) => b.rating - a.rating);
---

<Layout title="Top Bariatric Surgeons in Sydney">
  <section><!-- Hero --></section>
  <section><!-- Surgeons Grid --></section>
</Layout>
```

---

## ⚙️ Script Features

### Intelligent Processing
- ✅ Reads from `surgeons-with-bios.csv`
- ✅ Groups surgeons by city automatically
- ✅ Creates city directories as needed
- ✅ Generates both surgeon and city pages
- ✅ Idempotent (safe to run multiple times)

### Error Handling
- ✅ Validates surgeon data
- ✅ Skips surgeons with missing data
- ✅ Logs all errors
- ✅ Continues on individual failures

### Progress Tracking
- ✅ Real-time progress display
- ✅ City-by-city processing
- ✅ Success/failure indicators
- ✅ Performance metrics

### Dry Run Mode
- ✅ Preview without writing files
- ✅ Validate data before generation
- ✅ Check for potential issues
- ✅ Estimate generation time

---

## 📊 Expected Output Statistics

Based on current data (395 surgeons):

| Metric | Value |
|--------|-------|
| **Surgeon Pages** | 395 individual profiles |
| **City Pages** | 47 city directories |
| **Total Pages** | 442 pages |
| **Largest City** | Sydney (~89 pages) |
| **Average City** | ~8 surgeons |
| **Generation Time** | ~10-15 seconds |
| **Avg Per Page** | ~25-35ms |

---

## 🔧 Script Configuration

### File Paths (in script)
```typescript
const CSV_PATH = 'surgeons-with-bios.csv';
const PAGES_DIR = 'src/pages/surgeons';
```

### Template Components Used
- `SurgeonHero.astro` - Hero section
- `SurgeonProcedures.astro` - Procedures offered
- `SurgeonBio.astro` - Biography
- `SurgeonReviews.astro` - Reviews
- `SurgeonLocation.astro` - Location/contact
- `SurgeonCTA.astro` - Call-to-action

### Data Functions Used
- `getSurgeonBySlug()` - Get single surgeon
- `getRelatedSurgeons()` - Get similar surgeons
- `getSurgeonsByCity()` - Get city surgeons
- `getDisplayName()` - Format name

---

## 🧪 Testing Generated Pages

### Test Individual Profile
```bash
# Start dev server
npm run dev

# Visit a profile
http://localhost:4321/surgeons/sydney/dr-john-smith
```

### Test City Directory
```bash
# Visit city page
http://localhost:4321/surgeons/sydney/
```

### Test Related Surgeons
Check that related surgeons display correctly on each profile.

### Test Compare Link
Click "Compare with Other Surgeons" button on any profile.

---

## 🔄 Regeneration

The script is **idempotent** - safe to run multiple times.

### When to Regenerate

1. **After Data Updates**
   ```bash
   # Update CSV file
   # Then regenerate
   npx tsx scripts/generate-surgeon-pages.ts
   ```

2. **After Template Changes**
   ```bash
   # Modify script templates
   # Then regenerate
   npx tsx scripts/generate-surgeon-pages.ts
   ```

3. **To Fix Issues**
   ```bash
   # Delete problematic pages
   # Then regenerate
   npx tsx scripts/generate-surgeon-pages.ts
   ```

---

## 🎯 URL Structure

### Individual Surgeon Profiles
```
/surgeons/[city]/[surgeon-slug]

Examples:
/surgeons/sydney/dr-john-smith
/surgeons/melbourne/dr-jane-doe
/surgeons/brisbane/dr-michael-jones
```

### City Directories
```
/surgeons/[city]/

Examples:
/surgeons/sydney/
/surgeons/melbourne/
/surgeons/brisbane/
```

### Main Directory
```
/surgeons/
```

### Comparison Tool
```
/surgeons/compare?a=slug1&b=slug2
```

---

## 📈 SEO Benefits

### Individual Pages
- ✅ Unique meta title per surgeon
- ✅ Custom meta description
- ✅ Structured data ready
- ✅ Semantic HTML
- ✅ Fast load times

### City Pages
- ✅ Location-based SEO
- ✅ Local search optimization
- ✅ Breadcrumb navigation
- ✅ Internal linking

### Overall Impact
- ✅ 395+ indexable pages
- ✅ Deep internal linking
- ✅ Geographic coverage
- ✅ Long-tail keywords

---

## 🚨 Troubleshooting

### Error: "CSV file not found"
**Solution:** Ensure `surgeons-with-bios.csv` is in the root directory.

### Error: "tsx not installed"
**Solution:** Run `npm install --save-dev tsx`

### Error: "Network timeout"
**Solution:** Check internet connection, try again, or install tsx globally.

### Warning: "Surgeon has no slug"
**Cause:** Missing slug in CSV data  
**Solution:** Re-run data enrichment script

### Error: "Layout not found"
**Cause:** Incorrect relative path  
**Solution:** Verify Layout.astro exists at `src/layouts/Layout.astro`

---

## 🔒 Safety Features

### Idempotent
- Safe to run multiple times
- Overwrites existing files
- No duplicate pages

### Data Validation
- Checks for required fields
- Skips invalid surgeons
- Logs all errors

### Dry Run Mode
- Preview before generation
- No file modifications
- Safe testing

---

## 📚 Related Scripts

### Data Pipeline Scripts
1. `enrich-surgeon-data.js` - Add enrichment data
2. `generate-surgeon-bios.js` - Generate bios
3. `generate-surgeon-pages.ts` - Generate pages ⭐ (This script)

### Workflow
```
surgeons-cleaned.csv
  ↓ (enrich)
surgeons-enriched.csv
  ↓ (bios)
surgeons-with-bios.csv
  ↓ (pages)
src/pages/surgeons/[city]/[slug].astro ✅
```

---

## 🎨 Customization

### Modify Templates
Edit the script's template functions:
- `generateSurgeonPageTemplate()` - Individual pages
- `generateCityPageTemplate()` - City pages

### Change Directory Structure
Modify `PAGES_DIR` constant in script:
```typescript
const PAGES_DIR = 'src/pages/doctors'; // Change path
```

### Add More Components
Update surgeon page template:
```typescript
import NewComponent from '../../../components/NewComponent.astro';
// Add to template
<NewComponent surgeon={surgeon} />
```

---

## ✅ Completion Checklist

Before running in production:

- [ ] `surgeons-with-bios.csv` exists
- [ ] All components created
- [ ] Data access layer ready
- [ ] Layout.astro exists
- [ ] tsx installed
- [ ] Dry run tested
- [ ] Sample pages reviewed
- [ ] SEO meta verified
- [ ] Links tested
- [ ] Mobile tested

---

## 🚀 Deployment

### Local Build
```bash
# Generate pages
npx tsx scripts/generate-surgeon-pages.ts

# Build site
npm run build

# Preview
npm run preview
```

### Production Deploy
```bash
# Generate pages
npx tsx scripts/generate-surgeon-pages.ts

# Commit changes
git add src/pages/surgeons
git commit -m "Generate 395 surgeon profile pages"

# Deploy (e.g., Vercel)
git push origin main
```

---

## 📊 Performance Metrics

### Expected Generation Time
| Surgeons | Time | Avg/Page |
|----------|------|----------|
| 100 | ~3s | ~30ms |
| 200 | ~6s | ~30ms |
| 395 | ~12s | ~30ms |
| 500 | ~15s | ~30ms |

### File Sizes
| File Type | Size |
|-----------|------|
| Surgeon Page | ~6-8 KB |
| City Page | ~4-6 KB |
| Total (395) | ~2.5 MB |

---

## 🎯 Success Criteria

Script is successful when:

✅ All 395 surgeon pages generated  
✅ All 47 city pages generated  
✅ Zero critical errors  
✅ All pages have valid data  
✅ All links work correctly  
✅ Build completes without errors  
✅ Pages render correctly  

---

## 📞 Support

If you encounter issues:

1. Check this documentation
2. Review error logs
3. Run dry-run mode
4. Check CSV data
5. Verify components exist
6. Test with small dataset first

---

**Created:** October 5, 2025  
**Version:** 1.0.0  
**License:** Proprietary  
**Maintainer:** Weight Loss Surgery Australia
