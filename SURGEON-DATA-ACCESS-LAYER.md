# Surgeon Data Access Layer Documentation

## Overview

The Surgeon Data Access Layer provides a clean, type-safe TypeScript interface for accessing surgeon data from the CSV database. It includes filtering, searching, formatting utilities, and is fully optimized for static site generation with Astro.

**File:** `src/data/surgeons.ts`

---

## 📦 Type Definitions

### Main Interface

```typescript
interface Surgeon {
  business_name: string;
  surgeon_name: string;
  qualifications: string;
  procedures: string;
  rating: number;
  review_count: number;
  street: string;
  city: string;
  state: string;
  primary_location: string;
  country: string;
  phone: string;
  phone_original: string;
  website: string;
  category: string;
  google_maps_url: string;
  years_experience: number;
  estimated_procedures: number;
  slug: string;
  meta_title: string;
  meta_description: string;
  priority_score: number;
  tier: 1 | 2 | 3;
  location_display: string;
  bio_long: string;
}
```

### Helper Types

```typescript
type SurgeonCity = 'Sydney' | 'Melbourne' | 'Other';
type SurgeonTier = 1 | 2 | 3;
type ProcedureType = 
  | 'gastric-sleeve' 
  | 'gastric-bypass' 
  | 'gastric-band' 
  | 'mini-gastric-bypass'
  | 'general-bariatric';
```

---

## 🔍 Core Functions

### 1. `getAllSurgeons()`

Returns all surgeon records from the database.

```typescript
const surgeons = getAllSurgeons();
console.log(`Total: ${surgeons.length} surgeons`);
```

**Returns:** `Surgeon[]`

---

### 2. `getSurgeonBySlug(slug, city?)`

Find a surgeon by their URL slug (and optionally city for disambiguation).

```typescript
// Find by slug only
const surgeon = getSurgeonBySlug('dr-andrew-huo-richmond');

// Find by slug and city (for duplicate slugs)
const surgeon = getSurgeonBySlug('dr-andrew-huo', 'Richmond');
```

**Parameters:**
- `slug: string` - The URL slug of the surgeon
- `city?: string` - Optional city to narrow down search

**Returns:** `Surgeon | null`

---

### 3. `getSurgeonsByCity(city)`

Get all surgeons in a specific city, sorted by priority score.

```typescript
const sydneySurgeons = getSurgeonsByCity('Sydney');
const melbourneSurgeons = getSurgeonsByCity('Melbourne');
const richmondSurgeons = getSurgeonsByCity('Richmond');
```

**Parameters:**
- `city: string` - City name (matches city or primary_location)

**Returns:** `Surgeon[]` (sorted by priority_score descending)

---

### 4. `getSurgeonsByProcedure(procedure)`

Get surgeons who offer a specific procedure.

```typescript
const sleeveSurgeons = getSurgeonsByProcedure('gastric-sleeve');
const bypassSurgeons = getSurgeonsByProcedure('gastric-bypass');
```

**Parameters:**
- `procedure: string` - Procedure type

**Returns:** `Surgeon[]` (sorted by priority_score)

---

### 5. `getFeaturedSurgeons(limit?)`

Get top featured surgeons (Tier 1 and 2 only) based on priority score.

```typescript
const topTen = getFeaturedSurgeons(10);
const topFive = getFeaturedSurgeons(5);
```

**Parameters:**
- `limit?: number` - Maximum number to return (default: 10)

**Returns:** `Surgeon[]`

---

### 6. `searchSurgeons(query)`

Search surgeons by name, city, procedures, or qualifications.

```typescript
const results = searchSurgeons('bariatric Melbourne');
const drSmith = searchSurgeons('Dr Smith');
const fracsSurgeons = searchSurgeons('FRACS');
```

**Parameters:**
- `query: string` - Search query

**Returns:** `Surgeon[]` (sorted by priority_score)

---

### 7. `getRelatedSurgeons(surgeon, limit?)`

Get surgeons related to a given surgeon (same city or similar procedures).

```typescript
const related = getRelatedSurgeons(surgeon, 3);
```

**Parameters:**
- `surgeon: Surgeon` - Reference surgeon
- `limit?: number` - Maximum number to return (default: 3)

**Returns:** `Surgeon[]`

---

### 8. `getSurgeonsByTier(tier)`

Get all surgeons in a specific quality tier.

```typescript
const tier1 = getSurgeonsByTier(1); // High priority
const tier2 = getSurgeonsByTier(2); // Medium priority
const tier3 = getSurgeonsByTier(3); // Lower priority
```

**Parameters:**
- `tier: 1 | 2 | 3` - Tier level

**Returns:** `Surgeon[]` (sorted by priority_score)

---

## 🛠️ Helper Functions

### `formatPhoneNumber(phone)`

Format phone numbers for display.

```typescript
formatPhoneNumber('+61385941897')  // '(03) 8594 1897'
formatPhoneNumber('0385941897')    // '(03) 8594 1897'
```

---

### `formatRating(rating)`

Format rating with star emoji.

```typescript
formatRating(4.5)  // '⭐ 4.5'
formatRating(5.0)  // '⭐ 5.0'
```

---

### `getProcedureList(procedures)`

Parse procedures string into array.

```typescript
getProcedureList('gastric-sleeve|gastric-bypass')
// ['gastric-sleeve', 'gastric-bypass']
```

---

### `generateSlug(name)`

Generate URL-safe slug from name.

```typescript
generateSlug('Dr. Andrew Huo')  // 'dr-andrew-huo'
generateSlug('Melbourne Centre')  // 'melbourne-centre'
```

---

## 📊 Advanced Queries

### `getSurgeonsByCityAndProcedure(city, procedure?)`

Get surgeons filtered by city and optionally procedure.

```typescript
const sydneySleeve = getSurgeonsByCityAndProcedure('Sydney', 'gastric-sleeve');
const melbourneAll = getSurgeonsByCityAndProcedure('Melbourne');
```

---

### `getTopSurgeonsByCity(city, limit?)`

Get top surgeons in a specific city (Tier 1 & 2 only).

```typescript
const topSydney = getTopSurgeonsByCity('Sydney', 10);
const topMelbourne = getTopSurgeonsByCity('Melbourne', 5);
```

---

### `getSurgeonStats(city?)`

Get statistics for a location or entire database.

```typescript
const sydneyStats = getSurgeonStats('Sydney');
const allStats = getSurgeonStats();

// Returns:
{
  total: number;
  tier1: number;
  tier2: number;
  tier3: number;
  avgRating: number;
  avgExperience: number;
  avgReviews: number;
  topRated: Surgeon | null;
}
```

---

### `getAvailableCities()`

Get all cities with surgeon counts.

```typescript
const cities = getAvailableCities();
// [{ city: 'Melbourne', count: 95 }, { city: 'Sydney', count: 79 }, ...]
```

---

### `getAvailableProcedures()`

Get all procedures with surgeon counts.

```typescript
const procedures = getAvailableProcedures();
// [{ procedure: 'general-bariatric', count: 321 }, ...]
```

---

## ✅ Validation Functions

### `hasCompleteProfile(surgeon)`

Check if surgeon has complete profile data.

```typescript
if (hasCompleteProfile(surgeon)) {
  // Render full profile
} else {
  // Show limited info
}
```

---

### `isHighQuality(surgeon)`

Check if surgeon is high quality (Tier 1 or 2, good rating).

```typescript
if (isHighQuality(surgeon)) {
  // Add "Featured" badge
}
```

---

### `getDisplayName(surgeon)`

Get the best display name for a surgeon.

```typescript
const name = getDisplayName(surgeon);
// Prefers surgeon_name over business_name
```

---

## 🚀 Usage in Astro Pages

### Example 1: Individual Surgeon Profile Page

```astro
---
// src/pages/surgeons/[slug].astro
import Layout from '../../layouts/Layout.astro';
import { getSurgeonBySlug, getRelatedSurgeons, formatRating, getDisplayName } from '../../data/surgeons.ts';

export async function getStaticPaths() {
  const { getAllSurgeons } = await import('../../data/surgeons.ts');
  const surgeons = getAllSurgeons();
  
  return surgeons.map(surgeon => ({
    params: { slug: surgeon.slug },
    props: { surgeon }
  }));
}

const { surgeon } = Astro.props;
const related = getRelatedSurgeons(surgeon, 3);
---

<Layout 
  title={surgeon.meta_title}
  description={surgeon.meta_description}
>
  <article class="surgeon-profile">
    <h1>{getDisplayName(surgeon)}</h1>
    <p class="location">{surgeon.location_display}</p>
    
    <div class="rating">
      {formatRating(surgeon.rating)} ({surgeon.review_count} reviews)
    </div>
    
    <div class="experience">
      {surgeon.years_experience}+ years experience | 
      ~{surgeon.estimated_procedures} procedures
    </div>
    
    <section class="bio">
      <Fragment set:html={surgeon.bio_long.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')} />
    </section>
    
    <aside class="contact">
      <h3>Contact Information</h3>
      <a href={`tel:${surgeon.phone}`}>{surgeon.phone}</a>
      {surgeon.website && <a href={surgeon.website}>Visit Website</a>}
      <a href={surgeon.google_maps_url}>View on Google Maps</a>
    </aside>
    
    {related.length > 0 && (
      <section class="related">
        <h2>Related Surgeons</h2>
        {related.map(s => (
          <div class="surgeon-card">
            <h3>{getDisplayName(s)}</h3>
            <p>{s.location_display}</p>
            <a href={`/surgeons/${s.slug}`}>View Profile</a>
          </div>
        ))}
      </section>
    )}
  </article>
</Layout>
```

---

### Example 2: City Landing Page

```astro
---
// src/pages/surgeons/sydney.astro
import Layout from '../../layouts/Layout.astro';
import { 
  getTopSurgeonsByCity, 
  getSurgeonStats,
  getDisplayName,
  formatRating 
} from '../../data/surgeons.ts';

const city = 'Sydney';
const surgeons = getTopSurgeonsByCity(city, 20);
const stats = getSurgeonStats(city);
---

<Layout title={`Best Bariatric Surgeons in ${city}`}>
  <h1>Top Bariatric Surgeons in {city}</h1>
  
  <div class="stats">
    <p>{stats.total} surgeons</p>
    <p>Average rating: {stats.avgRating} stars</p>
    <p>Average experience: {stats.avgExperience} years</p>
  </div>
  
  <div class="surgeons-grid">
    {surgeons.map(surgeon => (
      <article class="surgeon-card">
        <h2>{getDisplayName(surgeon)}</h2>
        <p>{surgeon.city}, {surgeon.state}</p>
        <p>{formatRating(surgeon.rating)} ({surgeon.review_count} reviews)</p>
        <p>{surgeon.years_experience}+ years experience</p>
        <a href={`/surgeons/${surgeon.slug}`}>View Profile</a>
      </article>
    ))}
  </div>
</Layout>
```

---

### Example 3: Search/Filter Page

```astro
---
// src/pages/surgeons/index.astro
import Layout from '../../layouts/Layout.astro';
import { 
  getAllSurgeons,
  getAvailableCities,
  getAvailableProcedures,
  getDisplayName,
  formatRating 
} from '../../data/surgeons.ts';

const surgeons = getAllSurgeons()
  .filter(s => s.tier <= 2) // Only show Tier 1 & 2
  .slice(0, 50); // Limit for initial load

const cities = getAvailableCities().slice(0, 20);
const procedures = getAvailableProcedures();
---

<Layout title="Find a Bariatric Surgeon">
  <h1>Find a Bariatric Surgeon</h1>
  
  <aside class="filters">
    <div class="filter">
      <label>City</label>
      <select id="city-filter">
        <option value="">All Cities</option>
        {cities.map(c => (
          <option value={c.city}>{c.city} ({c.count})</option>
        ))}
      </select>
    </div>
    
    <div class="filter">
      <label>Procedure</label>
      <select id="procedure-filter">
        <option value="">All Procedures</option>
        {procedures.map(p => (
          <option value={p.procedure}>
            {p.procedure} ({p.count})
          </option>
        ))}
      </select>
    </div>
  </aside>
  
  <div class="surgeons-list">
    {surgeons.map(surgeon => (
      <article class="surgeon-card" data-city={surgeon.city}>
        <h2>{getDisplayName(surgeon)}</h2>
        <p>{surgeon.location_display}</p>
        <p>{formatRating(surgeon.rating)} ({surgeon.review_count} reviews)</p>
        <span class="tier-badge">Tier {surgeon.tier}</span>
        <a href={`/surgeons/${surgeon.slug}`}>View Profile</a>
      </article>
    ))}
  </div>
</Layout>
```

---

### Example 4: Procedure + Location Page

```astro
---
// src/pages/surgeons/gastric-sleeve-sydney.astro
import Layout from '../../layouts/Layout.astro';
import { getSurgeonsByCityAndProcedure, getDisplayName, formatRating } from '../../data/surgeons.ts';

const city = 'Sydney';
const procedure = 'gastric-sleeve';
const surgeons = getSurgeonsByCityAndProcedure(city, procedure);
---

<Layout title={`Gastric Sleeve Surgeons in ${city}`}>
  <h1>Best Gastric Sleeve Surgeons in {city}</h1>
  
  <p>Found {surgeons.length} experienced gastric sleeve surgeons in {city}.</p>
  
  {surgeons.map(surgeon => (
    <article class="surgeon-card">
      <h2>{getDisplayName(surgeon)}</h2>
      <p>{surgeon.location_display}</p>
      <p>{formatRating(surgeon.rating)} | {surgeon.years_experience}+ years</p>
      <a href={`/surgeons/${surgeon.slug}`}>View Profile & Book Consultation</a>
    </article>
  ))}
</Layout>
```

---

## 📈 Performance & Caching

The data access layer implements automatic caching:

```typescript
let surgeonCache: Surgeon[] | null = null;

function loadSurgeons(): Surgeon[] {
  if (surgeonCache) {
    return surgeonCache; // Return cached data
  }
  
  // Load and parse CSV
  surgeonCache = parseCSV(filePath);
  return surgeonCache;
}
```

**Benefits:**
- CSV is only read once per build
- All subsequent calls use cached data
- Perfect for static site generation
- Zero runtime overhead

---

## 🔧 Error Handling

The data access layer includes built-in error handling:

```typescript
// Tries multiple file paths
const possiblePaths = [
  path.join(process.cwd(), 'surgeons-with-bios.csv'),
  path.join(process.cwd(), 'data', 'surgeons-master-final.csv'),
  // ... more paths
];

// Returns null instead of throwing for missing surgeons
export function getSurgeonBySlug(slug: string): Surgeon | null {
  // Returns null if not found
}

// Returns empty array instead of throwing
export function getSurgeonsByCity(city: string): Surgeon[] {
  // Returns [] if no matches
}
```

---

## 🎯 Best Practices

### 1. **Use in getStaticPaths()**

```astro
---
export async function getStaticPaths() {
  const { getAllSurgeons } = await import('../../data/surgeons.ts');
  return getAllSurgeons().map(s => ({
    params: { slug: s.slug },
    props: { surgeon: s }
  }));
}
---
```

### 2. **Filter by Quality**

```typescript
// Only show high-quality surgeons
const featured = getAllSurgeons()
  .filter(s => isHighQuality(s))
  .slice(0, 10);
```

### 3. **Validate Before Use**

```typescript
const surgeon = getSurgeonBySlug(slug);

if (!surgeon) {
  return Astro.redirect('/404');
}

if (!hasCompleteProfile(surgeon)) {
  // Show limited profile
}
```

### 4. **Use Display Helpers**

```typescript
// Always use getDisplayName() for consistent naming
<h1>{getDisplayName(surgeon)}</h1>

// Use formatters for consistency
<p>{formatRating(surgeon.rating)}</p>
<a href={`tel:${surgeon.phone}`}>{formatPhoneNumber(surgeon.phone)}</a>
```

---

## 📋 Complete API Reference

### Core Functions (8)
- `getAllSurgeons()` - Get all surgeons
- `getSurgeonBySlug(slug, city?)` - Find by slug
- `getSurgeonsByCity(city)` - Filter by city
- `getSurgeonsByProcedure(procedure)` - Filter by procedure
- `getFeaturedSurgeons(limit?)` - Get top surgeons
- `searchSurgeons(query)` - Search all fields
- `getRelatedSurgeons(surgeon, limit?)` - Find related
- `getSurgeonsByTier(tier)` - Filter by tier

### Helper Functions (4)
- `formatPhoneNumber(phone)` - Format phone display
- `formatRating(rating)` - Format rating with emoji
- `getProcedureList(procedures)` - Parse procedures
- `generateSlug(name)` - Create URL slug

### Advanced Queries (5)
- `getSurgeonsByCityAndProcedure(city, procedure?)` - Combined filter
- `getTopSurgeonsByCity(city, limit?)` - Top per city
- `getSurgeonStats(city?)` - Statistics
- `getAvailableCities()` - List cities
- `getAvailableProcedures()` - List procedures

### Validation (3)
- `hasCompleteProfile(surgeon)` - Check completeness
- `isHighQuality(surgeon)` - Check quality
- `getDisplayName(surgeon)` - Best name

### SSG Helpers (2)
- `getAllSurgeonSlugs()` - All unique slugs
- `getAllSurgeonPaths()` - All slug/city combinations

---

## ✅ Complete & Ready

The Surgeon Data Access Layer is:
- ✅ Fully typed with TypeScript
- ✅ Tree-shakeable (ES6 modules)
- ✅ Cached for performance
- ✅ Error handling included
- ✅ 22 public functions
- ✅ Ready for Astro SSG
- ✅ Documented with examples

**Total Lines:** ~680 lines of production-ready code

---

**Created:** October 5, 2025  
**File:** `src/data/surgeons.ts`  
**Status:** Ready for implementation
