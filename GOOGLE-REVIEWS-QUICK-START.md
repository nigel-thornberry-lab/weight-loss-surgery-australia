# Google Reviews API - Quick Start Checklist

## ✅ **STEP-BY-STEP SETUP (15 minutes)**

### **STEP 1: Create Google Cloud Project (3 min)**

1. Go to: **https://console.cloud.google.com/**
2. Click **"Select a project"** (top left) → **"New Project"**
3. Project name: `weight-loss-surgery-reviews`
4. Click **"Create"**
5. Wait for project creation (30 seconds)

---

### **STEP 2: Enable Places API (2 min)**

1. Make sure your new project is selected (top left)
2. Go to: **"APIs & Services"** → **"Library"** (left sidebar)
3. Search for: **"Places API"**
4. Click on **"Places API"** (the main one, not "New")
5. Click **"Enable"** button
6. Wait for it to enable (~30 seconds)

---

### **STEP 3: Create API Key (2 min)**

1. Go to: **"APIs & Services"** → **"Credentials"** (left sidebar)
2. Click **"+ Create Credentials"** (top)
3. Select **"API Key"**
4. Your API key will appear (looks like: `AIzaSyC...`)
5. **COPY IT IMMEDIATELY** and save it somewhere safe
6. Click **"Restrict Key"** (important for security!)

---

### **STEP 4: Restrict API Key (3 min)**

#### **Application Restrictions:**
1. Select **"HTTP referrers (websites)"**
2. Click **"Add an item"**
3. Add these referrers (one at a time):
   ```
   https://weightlosssurgery.com.au/*
   https://*.vercel.app/*
   http://localhost:*
   ```
4. Click **"Done"**

#### **API Restrictions:**
1. Select **"Restrict key"**
2. From dropdown, check **"Places API"**
3. Click **"Save"** at bottom

---

### **STEP 5: Enable Billing (5 min)**

⚠️ **Required but FREE for your usage**

1. Go to **"Billing"** in left sidebar
2. Click **"Link a billing account"**
3. If you don't have one: **"Create billing account"**
4. Enter credit card details
5. Accept terms

**Don't worry about costs:**
- ✅ $200 free credit per month
- ✅ First 100,000 requests FREE
- ✅ Your usage: ~3,500 requests/month
- ✅ **You'll pay $0**

---

### **STEP 6: Add API Key to Vercel (2 min)**

1. Go to: **https://vercel.com/dashboard**
2. Select your project: **weight-loss-surgery-australia**
3. Click **"Settings"** tab
4. Click **"Environment Variables"** (left sidebar)
5. Click **"Add New"**
6. Enter:
   - **Key:** `GOOGLE_PLACES_API_KEY`
   - **Value:** [Paste your API key from Step 3]
   - **Environments:** Check all three (Production, Preview, Development)
7. Click **"Save"**

---

### **STEP 7: Test Locally (Optional - 3 min)**

1. Create `.env` file in project root:
   ```bash
   cd /Users/Cameron/Desktop/weight-loss-surgery-australia
   echo "GOOGLE_PLACES_API_KEY=YOUR_API_KEY_HERE" > .env
   ```

2. Start dev server:
   ```bash
   npm run dev
   ```

3. Visit: http://localhost:4321/surgeons/miranda/dr-mark-magdy-miranda

4. Open browser console (F12) and check for errors

5. Scroll to "Patient Reviews" section - should see real reviews!

---

### **STEP 8: Deploy to Production (1 min)**

Since the API endpoint and components are already deployed, you just need to:

1. Go to Vercel dashboard
2. Click **"Deployments"** tab
3. Click **"Redeploy"** on the latest deployment
   
   OR just push any small change:
   ```bash
   cd /Users/Cameron/Desktop/weight-loss-surgery-australia
   git commit --allow-empty -m "Trigger redeploy with API key"
   git push origin main
   ```

4. Wait 2-3 minutes for deployment

5. Visit: https://weightlosssurgery.com.au/surgeons/miranda/dr-mark-magdy-miranda

6. Scroll to "Patient Reviews" - **REVIEWS SHOULD NOW DISPLAY!** 🎉

---

## 🧪 **TESTING YOUR SETUP**

### **Test 1: API Key Works**

Visit this URL in your browser (replace YOUR_API_KEY):
```
https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJ8RvQAOS5EmsRVcXt4aog-OA&fields=reviews,rating&key=YOUR_API_KEY
```

**Expected:** JSON response with reviews
**If error:** Check API key restrictions

---

### **Test 2: API Endpoint Works**

After deployment, visit:
```
https://weightlosssurgery.com.au/api/google-reviews?placeId=ChIJ8RvQAOS5EmsRVcXt4aog-OA
```

**Expected:** JSON with reviews array
**If error:** Check Vercel environment variables

---

### **Test 3: Reviews Display on Profile**

Visit any enhanced surgeon profile:
```
https://weightlosssurgery.com.au/surgeons/miranda/dr-mark-magdy-miranda
```

**Expected:** "Patient Reviews" section with 5 reviews
**If error:** Open browser console (F12) for error messages

---

## 🚨 **TROUBLESHOOTING**

### **"API key not valid"**
- ✅ Check API key is correctly copied (no extra spaces)
- ✅ Verify API key restrictions allow your domain
- ✅ Ensure Places API is enabled in Google Cloud

### **"REQUEST_DENIED"**
- ✅ Enable billing in Google Cloud Console
- ✅ Check API key restrictions (HTTP referrers)
- ✅ Verify Places API is enabled

### **"OVER_QUERY_LIMIT"**
- ✅ Check Google Cloud Console → Billing
- ✅ Verify billing account is active
- ✅ Check API usage quotas

### **Reviews not showing on website**
- ✅ Check Vercel environment variables are set
- ✅ Redeploy after adding environment variables
- ✅ Open browser console (F12) for JavaScript errors
- ✅ Check API endpoint directly: `/api/google-reviews?placeId=...`

### **"Invalid Place ID"**
- ✅ Verify Place ID starts with "ChIJ"
- ✅ Check Place ID is correctly extracted from Google Maps URL
- ✅ Test Place ID in Google's Place ID Finder tool

---

## 📊 **MONITORING YOUR USAGE**

### **Check API Usage:**

1. Go to: https://console.cloud.google.com/
2. Select your project
3. Go to: **"APIs & Services"** → **"Dashboard"**
4. Click on **"Places API"**
5. View usage graphs

**Your expected usage:**
- ~3,500 API calls per month
- Well within free tier (100,000/month)
- Cost: **$0**

---

## 🎯 **WHAT YOU'LL SEE AFTER SETUP**

### **On Surgeon Profiles:**

```
┌─────────────────────────────────────────┐
│  Patient Reviews                        │
│  ⭐⭐⭐⭐⭐ 4.9 (23 reviews)              │
├─────────────────────────────────────────┤
│  👤 John Smith        2 weeks ago       │
│     ⭐⭐⭐⭐⭐                             │
│     "Dr Magdy was excellent. Very       │
│      professional and caring..."        │
├─────────────────────────────────────────┤
│  👤 Sarah Johnson     1 month ago       │
│     ⭐⭐⭐⭐⭐                             │
│     "Best decision I ever made..."      │
├─────────────────────────────────────────┤
│  [3 more reviews...]                    │
│                                         │
│  🔗 See all 23 reviews on Google       │
└─────────────────────────────────────────┘
```

---

## ✅ **COMPLETION CHECKLIST**

- [ ] Google Cloud project created
- [ ] Places API enabled
- [ ] API key created
- [ ] API key restricted (HTTP referrers + Places API only)
- [ ] Billing enabled (credit card added)
- [ ] API key added to Vercel environment variables
- [ ] Site redeployed
- [ ] Reviews displaying on surgeon profiles
- [ ] Tested on multiple profiles
- [ ] Checked API usage in Google Cloud Console

---

## 🎉 **YOU'RE DONE!**

Once you see reviews displaying on your surgeon profiles, you're all set!

**Benefits you'll see:**
- ✅ Real Google reviews on every profile
- ✅ Automatic updates (cached for 1 hour)
- ✅ Social proof for patients
- ✅ Improved trust and conversions
- ✅ Better SEO (fresh user-generated content)

---

## 📞 **NEED HELP?**

If you get stuck at any step:
1. Check the error message in browser console (F12)
2. Review the troubleshooting section above
3. Test the API endpoint directly
4. Check Vercel deployment logs
5. Let me know and I'll help debug!

**Common issues are usually:**
- API key not added to Vercel
- Billing not enabled in Google Cloud
- API key restrictions too strict
- Need to redeploy after adding environment variable
