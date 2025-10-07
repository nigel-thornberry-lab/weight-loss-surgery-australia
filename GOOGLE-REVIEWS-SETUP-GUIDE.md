# Google Reviews Integration - Complete Setup Guide

## 🎯 Overview

This guide will help you integrate **real Google Reviews** into your surgeon profiles using the Google Places API.

---

## 📋 Prerequisites

- Google Cloud Platform account
- Credit card (for API billing - free tier available)
- Basic understanding of API keys and environment variables

---

## 🚀 Step-by-Step Setup

### **STEP 1: Create Google Cloud Project**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Enter project name: `weight-loss-surgery-reviews`
4. Click **"Create"**

### **STEP 2: Enable Google Places API**

1. In the Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for **"Places API"**
3. Click on **"Places API (New)"** or **"Places API"**
4. Click **"Enable"**

### **STEP 3: Create API Key**

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"API Key"**
3. Your API key will be generated (e.g., `AIzaSyC...`)
4. **IMPORTANT:** Click **"Restrict Key"** to secure it

### **STEP 4: Restrict API Key (Security)**

1. Under **"Application restrictions"**:
   - Select **"HTTP referrers (websites)"**
   - Add your domains:
     - `https://weightlosssurgery.com.au/*`
     - `https://*.vercel.app/*` (for testing)
     - `http://localhost:*` (for local development)

2. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Choose **"Places API"**

3. Click **"Save"**

### **STEP 5: Enable Billing (Required)**

1. Go to **"Billing"** in Google Cloud Console
2. Link a credit card
3. **Don't worry:** Google provides:
   - $200 free credit per month
   - First 100,000 requests/month are free for Places API
   - You'll likely stay within free tier

---

## 💻 Implementation Options

### **OPTION A: Server-Side API (Recommended)**

This keeps your API key secure and allows caching.

#### **A1. Create API Route in Astro**

Create `/Users/Cameron/Desktop/weight-loss-surgery-australia/src/pages/api/google-reviews.ts`:

\`\`\`typescript
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const placeId = url.searchParams.get('placeId');
  
  if (!placeId) {
    return new Response(JSON.stringify({ error: 'Missing placeId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const API_KEY = import.meta.env.GOOGLE_PLACES_API_KEY;
  
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Fetch place details including reviews
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK') {
      return new Response(JSON.stringify({
        reviews: data.result.reviews || [],
        rating: data.result.rating || 0,
        total_ratings: data.result.user_ratings_total || 0
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
        }
      });
    } else {
      throw new Error(data.status);
    }
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch reviews' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
\`\`\`

#### **A2. Add API Key to Environment Variables**

Create `.env` file in project root:

\`\`\`
GOOGLE_PLACES_API_KEY=YOUR_API_KEY_HERE
\`\`\`

Add to `.gitignore`:
\`\`\`
.env
.env.local
\`\`\`

#### **A3. Add to Vercel Environment Variables**

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add:
   - **Name:** `GOOGLE_PLACES_API_KEY`
   - **Value:** Your API key
   - **Environments:** Production, Preview, Development
4. Click **"Save"**

---

### **OPTION B: Client-Side with Google Maps JavaScript API**

Simpler but exposes API key (use with restrictions).

#### **B1. Add Script to BaseLayout.astro**

Add to `<head>` section:

\`\`\`html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places" async defer></script>
\`\`\`

#### **B2. Update GoogleReviews Component**

Replace the fetch call with Google Maps JavaScript API:

\`\`\`javascript
function loadGoogleReviews() {
  const container = document.getElementById('google-reviews-container');
  const placeId = container.dataset.placeId;
  
  const service = new google.maps.places.PlacesService(document.createElement('div'));
  
  service.getDetails({
    placeId: placeId,
    fields: ['reviews', 'rating', 'user_ratings_total']
  }, (place, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && place.reviews) {
      // Render reviews (same as server-side option)
      container.innerHTML = place.reviews.slice(0, 5).map(review => \`
        <!-- Review HTML here -->
      \`).join('');
    }
  });
}
\`\`\`

---

## 🔍 Getting Place IDs for Surgeons

You need the Google Place ID for each surgeon. Here's how:

### **METHOD 1: From Google Maps URL**

Your CSV already has `google_maps_url` fields. Extract Place IDs:

1. URL format: `https://www.google.com/maps/search/?api=1&query=...&query_place_id=ChIJ...`
2. The `query_place_id` parameter IS the Place ID

### **METHOD 2: Place ID Finder Tool**

1. Go to [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Search for the surgeon's practice
3. Copy the Place ID

### **METHOD 3: Automated Extraction Script**

I can create a script to extract Place IDs from your CSV's `google_maps_url` column.

---

## 📊 Adding Place IDs to Your Data

### **Update surgeons-with-bios.csv**

Add a new column `place_id` and populate it:

\`\`\`csv
surgeon_name,city,google_maps_url,place_id
Dr Mark Magdy,Miranda,https://www.google.com/maps/...,ChIJ8RvQAOS5EmsR...
\`\`\`

### **Update generate-all-profiles.cjs**

Add Place ID to surgeon data:

\`\`\`javascript
const surgeon = {
  // ... existing fields
  place_id: row['place_id'] || extractPlaceIdFromUrl(row['google_maps_url'])
};
\`\`\`

---

## 🎨 Integrating Reviews into Profiles

### **Add to Enhanced Profile Template**

In `generate-all-profiles.cjs`, add after the Pricing section:

\`\`\`javascript
{surgeon.place_id && (
  <GoogleReviews 
    placeId={surgeon.place_id}
    surgeonName={cleanName}
    rating={surgeon.rating}
    reviewCount={surgeon.review_count}
  />
)}
\`\`\`

---

## 💰 Cost Estimate

### **Google Places API Pricing:**

- **First 100,000 requests/month:** FREE
- **After 100,000:** $17 per 1,000 requests

### **Your Expected Usage:**

- **84 surgeon profiles**
- **Assume 1,000 views per profile per month** = 84,000 requests
- **With 1-hour caching:** ~84,000 / 24 = ~3,500 API calls/month
- **Cost:** $0 (well within free tier)

---

## 🚀 Deployment Checklist

- [ ] Create Google Cloud project
- [ ] Enable Places API
- [ ] Create and restrict API key
- [ ] Add API key to `.env` file
- [ ] Add API key to Vercel environment variables
- [ ] Extract Place IDs from Google Maps URLs
- [ ] Update CSV with Place IDs
- [ ] Create `/api/google-reviews.ts` endpoint
- [ ] Import GoogleReviews component in profiles
- [ ] Test locally with `npm run dev`
- [ ] Deploy to Vercel
- [ ] Verify reviews display correctly

---

## 🧪 Testing

### **Test Locally:**

\`\`\`bash
npm run dev
# Visit http://localhost:4321/surgeons/miranda/dr-mark-magdy-miranda
\`\`\`

### **Test API Endpoint:**

\`\`\`bash
curl "http://localhost:4321/api/google-reviews?placeId=ChIJ8RvQAOS5EmsR..."
\`\`\`

### **Test on Vercel:**

After deployment, check:
- https://weightlosssurgery.com.au/surgeons/miranda/dr-mark-magdy-miranda
- Open browser console to check for errors

---

## 🔧 Troubleshooting

### **"API key not valid"**

- Check API key is correctly added to environment variables
- Verify API key restrictions allow your domain
- Ensure Places API is enabled in Google Cloud

### **"OVER_QUERY_LIMIT"**

- You've exceeded free tier
- Add billing information
- Implement better caching

### **"INVALID_REQUEST"**

- Check Place ID is correct
- Verify Place ID format (starts with "ChIJ")

### **Reviews not displaying**

- Check browser console for errors
- Verify API endpoint is returning data
- Check Place ID is valid

---

## 📈 Next Steps After Setup

1. **Add Review Schema Markup** (already implemented in profiles)
2. **Monitor API usage** in Google Cloud Console
3. **Set up alerts** for unusual API usage
4. **Consider caching** reviews in your database for better performance
5. **Add review filtering** (show only 4-5 star reviews)

---

## 🎯 Alternative: Third-Party Review Widgets

If Google Places API seems complex, consider these alternatives:

### **1. Elfsight Google Reviews Widget**
- **Cost:** $5-$10/month
- **Setup:** 5 minutes (embed code)
- **Pros:** No coding, automatic updates
- **Cons:** Monthly cost, less customization

### **2. Trustpilot**
- **Cost:** Free tier available
- **Setup:** 10 minutes
- **Pros:** More control, additional features
- **Cons:** Not Google reviews

### **3. Manual Reviews (Temporary Solution)**
- Copy/paste reviews from Google
- Update monthly
- **Pros:** Free, immediate
- **Cons:** Manual work, not real-time

---

## 📞 Need Help?

If you get stuck:
1. Check Google Cloud Console error logs
2. Test API key with [Place Details API tester](https://developers.google.com/maps/documentation/places/web-service/details)
3. Review Vercel deployment logs
4. Let me know and I can help debug!

---

**Ready to implement? Let me know which option you prefer (A or B) and I can help with the next steps!**
