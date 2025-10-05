# Surgeon Data Quick Reference

## 📊 Data Files Overview

### `surgeons-enriched.csv`
**The main file to use for implementation**

| Column | Description | Example |
|--------|-------------|---------|
| `slug` | URL-friendly identifier | `dr-andrew-huo-richmond` |
| `meta_title` | SEO-optimized page title | `Dr. Andrew Huo - Bariatric Surgeon Richmond...` |
| `meta_description` | SEO meta description | `Dr. Andrew Huo is an experienced bariatric surgeon...` |
| `priority_score` | Ranking score (higher = better) | `1507.50` |
| `tier` | Quality tier (1=best, 3=lowest) | `1` |
| `years_experience` | Estimated experience | `15` |
| `estimated_procedures` | Lifetime procedures estimate | `3375` |
| `surgeon_name` | Clean name without titles | `Andrew Huo` |
| `business_name` | Full business name | `Melbourne Centre- Dr. Andrew Huo` |
| `location_display` | Formatted location | `Richmond, VIC` |

---

## 🔍 Quick Queries

### Get All Tier 1 Surgeons
```javascript
const tier1 = surgeons.filter(s => s.tier === 1);
// Returns: 131 surgeons
```

### Get Sydney Bariatric Surgeons
```javascript
const sydneyBariatric = surgeons.filter(s => 
  s.primary_location === 'Sydney' && 
  (s.procedures.includes('bariatric') || s.category.includes('Bariatric'))
);
```

### Get Top 10 by Priority Score
```javascript
const top10 = surgeons
  .sort((a, b) => b.priority_score - a.priority_score)
  .slice(0, 10);
```

### Get Surgeons by Rating
```javascript
const highRated = surgeons.filter(s => 
  parseFloat(s.rating) >= 4.5 && 
  parseInt(s.review_count) >= 20
);
```

### Get Experienced Surgeons
```javascript
const experienced = surgeons.filter(s => 
  s.years_experience >= 15
);
```

---

## 🎯 Use Cases

### 1. Generate Profile Page URL
```javascript
function getSurgeonUrl(surgeon) {
  return `/surgeons/${surgeon.slug}`;
}

// Example: /surgeons/dr-andrew-huo-richmond
```

### 2. Display Surgeon Card
```astro
---
const { surgeon } = Astro.props;
---

<div class="surgeon-card">
  <h3>{surgeon.surgeon_name || surgeon.business_name}</h3>
  <div class="rating">
    ⭐ {surgeon.rating} ({surgeon.review_count} reviews)
  </div>
  <p class="location">📍 {surgeon.location_display}</p>
  <p class="experience">
    {surgeon.years_experience}+ years | 
    ~{surgeon.estimated_procedures} procedures
  </p>
  <span class="tier-badge">Tier {surgeon.tier}</span>
  <a href={`/surgeons/${surgeon.slug}`}>View Profile</a>
</div>
```

### 3. Filter Component
```astro
---
const locations = [...new Set(surgeons.map(s => s.city))];
const minRating = 4.0;
---

<select id="location-filter">
  <option value="">All Locations</option>
  {locations.map(loc => <option value={loc}>{loc}</option>)}
</select>

<select id="rating-filter">
  <option value="4.0">4.0+ stars</option>
  <option value="4.5">4.5+ stars</option>
  <option value="4.8">4.8+ stars</option>
</select>
```

### 4. Comparison Table
```astro
---
const surgeons = [surgeon1, surgeon2, surgeon3];
---

<table class="surgeon-comparison">
  <tr>
    <th>Surgeon</th>
    {surgeons.map(s => <td>{s.surgeon_name}</td>)}
  </tr>
  <tr>
    <th>Rating</th>
    {surgeons.map(s => <td>⭐ {s.rating}</td>)}
  </tr>
  <tr>
    <th>Reviews</th>
    {surgeons.map(s => <td>{s.review_count}</td>)}
  </tr>
  <tr>
    <th>Experience</th>
    {surgeons.map(s => <td>{s.years_experience} years</td>)}
  </tr>
  <tr>
    <th>Location</th>
    {surgeons.map(s => <td>{s.location_display}</td>)}
  </tr>
</table>
```

---

## 💡 Pro Tips

### Sorting Best Practices
```javascript
// By priority (recommended for main listings)
surgeons.sort((a, b) => b.priority_score - a.priority_score);

// By rating (for "best rated" pages)
surgeons.sort((a, b) => b.rating - a.rating);

// By reviews (for "most reviewed" pages)
surgeons.sort((a, b) => b.review_count - a.review_count);

// By experience (for "most experienced" pages)
surgeons.sort((a, b) => b.years_experience - a.years_experience);
```

### Filtering Best Practices
```javascript
// High quality only (Tier 1 & 2)
const quality = surgeons.filter(s => s.tier <= 2);

// Established surgeons (good reviews + experience)
const established = surgeons.filter(s => 
  s.review_count >= 20 && 
  s.rating >= 4.0 && 
  s.years_experience >= 8
);

// Local surgeons (specific city)
const local = surgeons.filter(s => 
  s.city === 'Richmond' || s.city === 'Melbourne'
);
```

### SEO Metadata Usage
```astro
---
const { surgeon } = Astro.props;
---

<head>
  <title>{surgeon.meta_title}</title>
  <meta name="description" content={surgeon.meta_description} />
  
  <!-- Open Graph -->
  <meta property="og:title" content={surgeon.meta_title} />
  <meta property="og:description" content={surgeon.meta_description} />
  <meta property="og:type" content="profile" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={surgeon.meta_title} />
  <meta name="twitter:description" content={surgeon.meta_description} />
</head>
```

---

## 📝 Common Patterns

### Pattern 1: Location Landing Page
```astro
---
// src/pages/surgeons/sydney.astro
import { loadSurgeons } from '../../utils/surgeonData';

const allSurgeons = await loadSurgeons();
const sydneySurgeons = allSurgeons
  .filter(s => s.primary_location === 'Sydney')
  .sort((a, b) => b.priority_score - a.priority_score);

const tier1 = sydneySurgeons.filter(s => s.tier === 1);
const tier2 = sydneySurgeons.filter(s => s.tier === 2);
---

<Layout title="Best Bariatric Surgeons in Sydney">
  <h1>Top Bariatric Surgeons in Sydney</h1>
  
  <section>
    <h2>Premier Surgeons (Tier 1)</h2>
    {tier1.map(surgeon => <SurgeonCard surgeon={surgeon} />)}
  </section>
  
  <section>
    <h2>Experienced Surgeons (Tier 2)</h2>
    {tier2.map(surgeon => <SurgeonCard surgeon={surgeon} />)}
  </section>
</Layout>
```

### Pattern 2: Procedure-Specific Page
```astro
---
// src/pages/surgeons/gastric-sleeve-sydney.astro
const allSurgeons = await loadSurgeons();
const gastricsleeveSydney = allSurgeons.filter(s => 
  s.primary_location === 'Sydney' &&
  (s.procedures.includes('gastric-sleeve') || 
   s.procedures.includes('general-bariatric'))
);
---

<Layout title="Gastric Sleeve Surgeons in Sydney">
  <h1>Best Gastric Sleeve Surgeons in Sydney</h1>
  {gastricsleeveSydney.map(surgeon => 
    <SurgeonCard surgeon={surgeon} />
  )}
</Layout>
```

### Pattern 3: Top 10 Rankings
```astro
---
// src/pages/surgeons/best-bariatric-surgeons-australia.astro
const allSurgeons = await loadSurgeons();
const bariatric = allSurgeons.filter(s => 
  s.procedures.includes('bariatric') || 
  s.category.includes('Bariatric')
);
const top10 = bariatric.slice(0, 10);
---

<Layout>
  <h1>Top 10 Bariatric Surgeons in Australia</h1>
  <ol class="ranking-list">
    {top10.map((surgeon, i) => (
      <li>
        <div class="rank-number">{i + 1}</div>
        <SurgeonCard surgeon={surgeon} />
        <div class="score">Priority Score: {surgeon.priority_score}</div>
      </li>
    ))}
  </ol>
</Layout>
```

---

## 🔧 Utility Functions

### Load Surgeons
```typescript
// src/utils/surgeonData.ts
import fs from 'fs';
import Papa from 'papaparse';

export async function loadSurgeons() {
  const csv = fs.readFileSync('surgeons-enriched.csv', 'utf-8');
  const { data } = Papa.parse(csv, { header: true });
  return data.filter(row => row.slug); // Remove empty rows
}
```

### Get Surgeon by Slug
```typescript
export async function getSurgeonBySlug(slug: string) {
  const surgeons = await loadSurgeons();
  return surgeons.find(s => s.slug === slug);
}
```

### Get Surgeons by Location
```typescript
export async function getSurgeonsByLocation(location: string) {
  const surgeons = await loadSurgeons();
  return surgeons.filter(s => 
    s.primary_location === location
  ).sort((a, b) => b.priority_score - a.priority_score);
}
```

### Get Surgeons by Tier
```typescript
export async function getSurgeonsByTier(tier: 1 | 2 | 3) {
  const surgeons = await loadSurgeons();
  return surgeons.filter(s => s.tier === tier);
}
```

---

## 📈 Statistics Helper

```typescript
export function getSurgeonStats(surgeons: Surgeon[]) {
  return {
    total: surgeons.length,
    avgRating: surgeons.reduce((sum, s) => sum + parseFloat(s.rating || '0'), 0) / surgeons.length,
    avgReviews: surgeons.reduce((sum, s) => sum + parseInt(s.review_count || '0'), 0) / surgeons.length,
    avgExperience: surgeons.reduce((sum, s) => sum + s.years_experience, 0) / surgeons.length,
    tier1Count: surgeons.filter(s => s.tier === 1).length,
    tier2Count: surgeons.filter(s => s.tier === 2).length,
    tier3Count: surgeons.filter(s => s.tier === 3).length,
  };
}

// Usage:
const sydneySurgeons = await getSurgeonsByLocation('Sydney');
const stats = getSurgeonStats(sydneySurgeons);
console.log(`Sydney has ${stats.tier1Count} Tier 1 surgeons`);
```

---

## 🚀 Quick Start Command

```bash
# Install dependencies
npm install papaparse @types/papaparse

# Create utility file
mkdir -p src/utils
touch src/utils/surgeonData.ts

# Create surgeon pages directory
mkdir -p src/pages/surgeons
touch src/pages/surgeons/[slug].astro
touch src/pages/surgeons/index.astro

# Start dev server
npm run dev
```

---

## 📞 Contact Information Format

```astro
<div class="contact-info">
  <a href={`tel:${surgeon.phone}`} class="phone">
    📞 {surgeon.phone}
  </a>
  
  {surgeon.website && (
    <a href={surgeon.website} target="_blank" class="website">
      🌐 Visit Website
    </a>
  )}
  
  <a href={surgeon.google_maps_url} target="_blank" class="location">
    📍 View on Google Maps
  </a>
</div>
```

---

## ✅ Validation Checks

```typescript
// Check if surgeon has complete data
function isCompleteProfile(surgeon: Surgeon): boolean {
  return !!(
    surgeon.surgeon_name &&
    surgeon.rating &&
    surgeon.review_count &&
    surgeon.phone &&
    surgeon.city &&
    surgeon.state
  );
}

// Check if surgeon is high quality
function isHighQuality(surgeon: Surgeon): boolean {
  return surgeon.tier <= 2 && 
         parseFloat(surgeon.rating) >= 4.0 &&
         parseInt(surgeon.review_count) >= 10;
}
```

---

**Last Updated:** October 5, 2025  
**Data Version:** surgeons-enriched.csv (395 records)
