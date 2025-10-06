
# Surgeon Data Collection Guide

## How to Collect Enhanced Data

For each surgeon, visit their website and Google Maps profile to collect:

### 1. GOOGLE REVIEWS (Priority 1)
**Source**: Google Maps URL from CSV
**Steps**:
1. Open Google Maps URL
2. Click "Reviews" tab
3. Copy 3-5 most helpful/recent reviews
4. Record: Author name, rating, text, date

**Example**:
```json
{
  "author": "Sarah M.",
  "rating": 5,
  "text": "Dr. Smith was amazing! The entire team supported me...",
  "date": "2024-01-15",
  "verified": true
}
```

### 2. TEAM & SERVICES (Priority 1)
**Source**: Website - Look for:
- "Team" or "About Us" pages
- "Services" or "What We Offer" pages
- "Our Approach" or "Program" pages

**Keywords to search for**:
- Nutritionist/Dietitian: "nutrition", "diet", "nutritionist"
- Psychologist: "psychology", "mental health", "counseling"
- Exercise: "exercise physiologist", "fitness", "trainer"
- Support: "support group", "follow-up", "aftercare"

### 3. PRICING (Priority 1)
**Source**: Website - Look for:
- "Pricing", "Costs", "Fees" pages
- "Investment", "Finance" pages
- FAQs about costs

**Record**:
- Exact prices if listed
- Price ranges
- "Contact for pricing" if not listed
- Payment plan options
- Insurance information

### 4. HOSPITAL AFFILIATIONS
**Source**: Website footer, "Locations" page
**Record**:
- Hospital names where they operate
- Accreditations (RACS, etc.)

## Data Entry Format

Save data in JSON format: surgeon-enhanced-data.json

```json
{
  "dr-smith-sydney": {
    "reviews": [...],
    "services": {
      "nutritionist": true,
      "psychologist": true,
      ...
    },
    "pricing": {
      "gastric_sleeve": "$18,500",
      ...
    }
  }
}
```

## Automation Options

### Option A: Google Places API (Recommended)
- Sign up: https://developers.google.com/maps/documentation/places/web-service/overview
- API key required
- Can fetch reviews automatically
- Cost: ~$20/1000 requests

### Option B: Manual Collection
- Use this template
- Collect data for top 20 surgeons first
- Expand based on results

### Option C: Hybrid Approach
- Use API for reviews
- Manual website scraping for services/pricing
- Best accuracy

## Priority Order

1. **Top 20 surgeons** (highest traffic): Full data
2. **Next 30 surgeons**: Reviews + basic services
3. **Remaining**: Reviews only

This ensures highest value pages are enhanced first.
