# 📦 Static Google Reviews - Setup Guide

## ✅ **WHAT IS THIS?**

Instead of calling the Google Places API on every page load, we:
1. **Fetch reviews once** using a script
2. **Cache them** in a JSON file
3. **Display cached reviews** on the website
4. **Update monthly** by running the script again

**Benefits:**
- ✅ Works immediately
- ✅ Free (no ongoing API costs)
- ✅ Fast (no API calls on page load)
- ✅ Reliable (no rate limits)

---

## 🚀 **SETUP (5 minutes)**

### **Step 1: Run the Fetch Script**

Open terminal and run:

\`\`\`bash
cd /Users/Cameron/Desktop/weight-loss-surgery-australia
node scripts/fetch-google-reviews.cjs YOUR_API_KEY_HERE
\`\`\`

**Replace `YOUR_API_KEY_HERE` with your actual Google Places API key**

### **Step 2: Wait for Completion**

The script will:
- Read all surgeons from CSV
- Fetch reviews for each surgeon with a Place ID
- Save to `src/data/cached-reviews.json`
- Take about 2-3 minutes for 84 surgeons

You'll see output like:
\`\`\`
🔍 Reading surgeon data...
📥 Fetching reviews for 84 surgeons...

   Fetching: Dr Mark Magdy...
   ✅ Dr Mark Magdy: 5 reviews (4.9★)
   Fetching: Dr Jason Maani...
   ✅ Dr Jason Maani: 5 reviews (4.8★)
   ...

✅ SUCCESS!
   Fetched reviews: 78
   Errors/No reviews: 6
   Output: src/data/cached-reviews.json
\`\`\`

### **Step 3: Rebuild and Deploy**

\`\`\`bash
npm run build
git add -A
git commit -m "✨ Add cached Google reviews"
git push origin main
\`\`\`

### **Step 4: Visit Your Site**

Go to any enhanced surgeon profile and scroll to "Patient Reviews" section.

**You should see real Google reviews!** 🎉

---

## 📅 **MONTHLY UPDATES**

To keep reviews fresh, run the script once a month:

\`\`\`bash
cd /Users/Cameron/Desktop/weight-loss-surgery-australia
node scripts/fetch-google-reviews.cjs YOUR_API_KEY
git add src/data/cached-reviews.json
git commit -m "🔄 Update Google reviews"
git push origin main
\`\`\`

**Set a calendar reminder for the 1st of each month!**

---

## 🔍 **WHAT THE SCRIPT DOES**

1. **Reads** `surgeons-with-bios.csv`
2. **For each surgeon** with a Place ID:
   - Calls Google Places API
   - Gets reviews, rating, total count
   - Keeps 5 most recent reviews
3. **Saves** to `src/data/cached-reviews.json`
4. **Rate limits** to 100ms between requests (respectful to Google)

---

## 📊 **EXAMPLE OUTPUT**

`src/data/cached-reviews.json` will look like:

\`\`\`json
{
  "dr-mark-magdy-miranda": {
    "placeId": "ChIJ8RvQAOS5EmsRVcXt4aog-OA",
    "surgeonName": "Dr Mark Magdy",
    "rating": 4.9,
    "totalRatings": 23,
    "reviews": [
      {
        "author_name": "John Smith",
        "rating": 5,
        "text": "Dr Magdy was excellent...",
        "time": 1696723200,
        "relative_time_description": "2 weeks ago",
        "profile_photo_url": "https://..."
      },
      ...
    ],
    "lastUpdated": "2025-10-07T03:15:00.000Z"
  },
  ...
}
\`\`\`

---

## 🎨 **HOW REVIEWS ARE DISPLAYED**

The `GoogleReviews.astro` component:
1. **Imports** the cached JSON file
2. **Looks up** reviews by surgeon slug
3. **Displays** 5 most recent reviews
4. **Shows** "last updated" date
5. **Links** to Google Maps for all reviews

---

## 💰 **COST COMPARISON**

### **Static (This Approach):**
- **Initial fetch:** ~84 API calls
- **Monthly updates:** ~84 API calls
- **Annual cost:** $0 (well within free tier)

### **Dynamic (API on every page load):**
- **Daily:** ~2,000 API calls
- **Monthly:** ~60,000 API calls
- **Annual cost:** $0-$100 depending on traffic

**Static is better for your use case!**

---

## 🔧 **TROUBLESHOOTING**

### **Error: "API key not valid"**
- Check your API key is correct
- Make sure "Places API" is enabled (not "Places API (New)")
- Check API key restrictions allow your IP

### **Error: "REQUEST_DENIED"**
- Enable billing in Google Cloud Console
- Make sure Places API is enabled
- Check API key restrictions

### **No reviews for some surgeons**
- Normal - not all surgeons have Google reviews
- Check the Place ID is correct
- Verify the surgeon's Google Business Profile exists

### **Script hangs or times out**
- Normal for large datasets
- The 100ms delay is intentional (rate limiting)
- Should complete in 2-3 minutes for 84 surgeons

---

## 📈 **MONITORING**

### **Check API Usage:**

1. Go to: https://console.cloud.google.com/
2. Select your project
3. APIs & Services → Dashboard
4. Click "Places API"
5. View usage graph

**Expected usage:**
- ~84 calls per month
- $0 cost (free tier is 100,000/month)

---

## 🎯 **AUTOMATION (OPTIONAL)**

Want to automate monthly updates? Set up a GitHub Action:

Create `.github/workflows/update-reviews.yml`:

\`\`\`yaml
name: Update Google Reviews

on:
  schedule:
    - cron: '0 0 1 * *'  # Run on 1st of each month
  workflow_dispatch:  # Allow manual trigger

jobs:
  update-reviews:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: node scripts/fetch-google-reviews.cjs \${{ secrets.GOOGLE_PLACES_API_KEY }}
      - run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add src/data/cached-reviews.json
          git commit -m "🔄 Auto-update Google reviews"
          git push
\`\`\`

Then add `GOOGLE_PLACES_API_KEY` to GitHub Secrets.

---

## ✅ **CHECKLIST**

- [ ] Run fetch script with API key
- [ ] Verify `src/data/cached-reviews.json` is populated
- [ ] Build and deploy site
- [ ] Check reviews display on surgeon profiles
- [ ] Set calendar reminder for monthly updates
- [ ] (Optional) Set up GitHub Action for automation

---

## 🎉 **YOU'RE DONE!**

Reviews will now display on your surgeon profiles using cached data.

**Next steps:**
1. Set a monthly reminder to update reviews
2. Monitor which surgeons get new reviews
3. Encourage surgeons to ask patients for Google reviews

**Questions?** Let me know!
