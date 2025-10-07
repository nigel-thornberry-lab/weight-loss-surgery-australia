# Google Maps Setup Guide

## ✅ The Simple Solution

Use the **official Google Maps Embed API** with a properly configured API key.

---

## 🔧 Setup Steps

### 1️⃣ Enable Maps Embed API

Visit: https://console.cloud.google.com/apis/library/maps-embed-backend.googleapis.com?project=weight-loss-surgery-reviews

Click **"ENABLE"**

---

### 2️⃣ Create NEW Restricted API Key

1. Go to: https://console.cloud.google.com/apis/credentials?project=weight-loss-surgery-reviews

2. Click **"CREATE CREDENTIALS"** → **"API key"**

3. **IMMEDIATELY** click **"EDIT API KEY"**

4. Configure:
   ```
   Name: Maps Embed API Key
   
   Application restrictions: HTTP referrers
   
   Website restrictions:
   - https://weightlosssurgery.com.au/*
   - https://*.vercel.app/*
   - http://localhost:*
   
   API restrictions: Restrict key
   - ✓ Maps Embed API
   - ✓ Places API (for reviews)
   ```

5. **Save** and copy the new key

---

### 3️⃣ Add to Vercel Environment Variables

**IMPORTANT:** Store in Vercel, NOT in git!

1. Go to: https://vercel.com/nigels-projects-5c3679ba/weight-loss-surgery-australia/settings/environment-variables

2. Add new variable:
   ```
   Key: PUBLIC_GOOGLE_MAPS_KEY
   Value: your_new_api_key_here
   
   Environments: Production, Preview, Development
   ```

3. Save

---

### 4️⃣ Delete OLD Exposed Key

**CRITICAL:** Delete the exposed key immediately!

Key to delete: `AIzaSyAbqPkgGdtyBmdqjdARyrnidZV4nqBWMZw`

Go to: https://console.cloud.google.com/apis/credentials?project=weight-loss-surgery-reviews

Find the old key and click **"DELETE"**

---

### 5️⃣ Redeploy

After adding the environment variable to Vercel:

```bash
vercel --prod --yes
```

---

## 🗺️ How It Works

**Embed URL Format:**
```
https://www.google.com/maps/embed/v1/place?key=API_KEY&q=place_id:PLACE_ID&zoom=15
```

**Features:**
- ✅ Proper marker on location
- ✅ Info card with business name
- ✅ Street-level zoom (15)
- ✅ Interactive controls
- ✅ "Get Directions" button
- ✅ Mobile responsive

---

## 🔒 Security

**Why this is secure:**

1. **HTTP Referrer restrictions:** Key only works on your domains
2. **API restrictions:** Key only works with Maps Embed API and Places API
3. **Environment variables:** Key stored in Vercel, not in git
4. **Not exposed:** `.env` file is in `.gitignore`

---

## 📝 Local Development

For local testing, create a `.env` file in project root:

```bash
# .env (this file is in .gitignore)
PUBLIC_GOOGLE_MAPS_KEY=your_new_maps_embed_key_here
GOOGLE_PLACES_API_KEY=your_places_api_key_here
```

**Never commit this file to git!**

---

## ✅ Verification

After deployment, test these profiles:

1. https://weightlosssurgery.com.au/surgeons/kogarah/associate-professor-michael-talbot-kogarah
2. https://weightlosssurgery.com.au/surgeons/east-melbourne/aprof-michael-hii-east-melbourne
3. https://weightlosssurgery.com.au/surgeons/wahroonga/aprof-christos-apostolou-surgeon-wahroonga

**What you should see:**
- Map loads properly
- Marker/pin on exact location
- Street-level zoom
- Interactive map controls
- No errors in console

---

## 🎉 Done!

Once you've:
1. ✅ Enabled Maps Embed API
2. ✅ Created new restricted key
3. ✅ Added `PUBLIC_GOOGLE_MAPS_KEY` to Vercel
4. ✅ Deleted old exposed key
5. ✅ Redeployed

Your maps will work perfectly on all 70 surgeon profiles! 🗺️

