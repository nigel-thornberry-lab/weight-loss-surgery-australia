# 🎯 Google Reviews API - Visual Walkthrough

## 📱 **START HERE**

Open this link in a new tab: **https://console.cloud.google.com/**

---

## 🚀 **PART 1: Create Project (3 minutes)**

### **Step 1.1: Click "Select a project"**
- Look at the top left of the screen
- Click the dropdown that says "Select a project"

### **Step 1.2: Click "NEW PROJECT"**
- In the popup, click the "NEW PROJECT" button (top right)

### **Step 1.3: Name your project**
- Project name: `weight-loss-surgery-reviews`
- Leave organization as-is
- Click "CREATE"
- Wait 30 seconds for project creation

### **Step 1.4: Select your new project**
- Click "Select a project" again
- Choose "weight-loss-surgery-reviews"
- You should now see it in the top left

✅ **Checkpoint:** Top left should show "weight-loss-surgery-reviews"

---

## 🔌 **PART 2: Enable Places API (2 minutes)**

### **Step 2.1: Open API Library**
- Look at the left sidebar
- Click "APIs & Services"
- Click "Library"

### **Step 2.2: Search for Places API**
- In the search box, type: `Places API`
- Click on "Places API" (NOT "Places API (New)")

### **Step 2.3: Enable it**
- Click the big blue "ENABLE" button
- Wait 30 seconds
- You'll see "API enabled" message

✅ **Checkpoint:** You should see "Places API" with a green checkmark

---

## 🔑 **PART 3: Create API Key (2 minutes)**

### **Step 3.1: Go to Credentials**
- Left sidebar → "APIs & Services" → "Credentials"

### **Step 3.2: Create Credentials**
- Click "+ CREATE CREDENTIALS" at the top
- Select "API key" from dropdown

### **Step 3.3: Copy your API key**
- A popup appears with your API key
- It looks like: `AIzaSyC...` (long string)
- **COPY IT NOW** and paste it somewhere safe (Notes app, etc.)

### **Step 3.4: Restrict the key**
- In the popup, click "RESTRICT KEY"
- This opens the API key settings page

✅ **Checkpoint:** You have your API key saved somewhere

---

## 🔒 **PART 4: Restrict API Key (3 minutes)**

### **Step 4.1: Application restrictions**
- Under "Application restrictions", select "HTTP referrers (websites)"

### **Step 4.2: Add website referrers**
Click "ADD AN ITEM" and add these one by one:

1. `https://weightlosssurgery.com.au/*`
2. `https://*.vercel.app/*`
3. `http://localhost:*`

(Click "DONE" after each one)

### **Step 4.3: API restrictions**
- Under "API restrictions", select "Restrict key"
- In the dropdown, find and check "Places API"

### **Step 4.4: Save**
- Scroll to bottom
- Click "SAVE"

✅ **Checkpoint:** Your API key is now restricted to Places API only

---

## 💳 **PART 5: Enable Billing (5 minutes)**

⚠️ **Don't worry - you won't be charged!**
- Google gives $200 free credit per month
- Your usage: ~$0/month (well within free tier)

### **Step 5.1: Go to Billing**
- Left sidebar → "Billing"

### **Step 5.2: Link billing account**
- Click "LINK A BILLING ACCOUNT"
- If you don't have one: Click "CREATE BILLING ACCOUNT"

### **Step 5.3: Enter payment info**
- Country: Australia
- Enter credit card details
- Accept terms
- Click "START MY FREE TRIAL" or "SUBMIT"

✅ **Checkpoint:** Billing is enabled (you'll see billing dashboard)

---

## 🌐 **PART 6: Add API Key to Vercel (2 minutes)**

### **Step 6.1: Open Vercel**
- Go to: https://vercel.com/dashboard
- Sign in if needed

### **Step 6.2: Select your project**
- Find "weight-loss-surgery-australia"
- Click on it

### **Step 6.3: Go to Settings**
- Click "Settings" tab at the top

### **Step 6.4: Environment Variables**
- Left sidebar → "Environment Variables"

### **Step 6.5: Add new variable**
- Click "Add New" button
- **Key:** `GOOGLE_PLACES_API_KEY`
- **Value:** [Paste your API key from Part 3]
- **Environments:** Check all three boxes:
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- Click "Save"

✅ **Checkpoint:** You should see `GOOGLE_PLACES_API_KEY` in the list

---

## 🔄 **PART 7: Redeploy (1 minute)**

### **Step 7.1: Trigger redeploy**
- In Vercel, click "Deployments" tab
- Find the latest deployment
- Click the three dots "..."
- Click "Redeploy"
- Click "Redeploy" again to confirm

### **Step 7.2: Wait for deployment**
- Wait 2-3 minutes
- Status should change to "Ready"

✅ **Checkpoint:** Deployment shows "Ready" with green checkmark

---

## 🧪 **PART 8: Test It! (2 minutes)**

### **Test 1: Check API directly**

Open this URL in your browser (replace YOUR_API_KEY with your actual key):

```
https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJ8RvQAOS5EmsRVcXt4aog-OA&fields=reviews,rating&key=YOUR_API_KEY
```

**Expected:** You should see JSON with reviews
**If error:** Go back and check your API key restrictions

---

### **Test 2: Check your API endpoint**

Open this URL:

```
https://weightlosssurgery.com.au/api/google-reviews?placeId=ChIJ8RvQAOS5EmsRVcXt4aog-OA
```

**Expected:** JSON response with reviews array
**If error:** Check Vercel environment variables

---

### **Test 3: Check surgeon profile**

Open this URL:

```
https://weightlosssurgery.com.au/surgeons/miranda/dr-mark-magdy-miranda
```

**Scroll down to "Patient Reviews" section**

**Expected:** You should see 5 real Google reviews! 🎉

**If not showing:**
1. Open browser console (Press F12)
2. Look for error messages
3. Check the troubleshooting section below

---

## 🚨 **TROUBLESHOOTING**

### **Problem: "API key not valid"**

**Solution:**
1. Go to Google Cloud Console
2. APIs & Services → Credentials
3. Click on your API key
4. Check that "Places API" is selected under API restrictions
5. Check that your domain is in the HTTP referrers list
6. Save changes
7. Wait 5 minutes and try again

---

### **Problem: "REQUEST_DENIED"**

**Solution:**
1. Go to Google Cloud Console
2. Click "Billing" in left sidebar
3. Make sure billing is enabled
4. Make sure you have a valid payment method
5. Go back to APIs & Services → Library
6. Search "Places API" and make sure it's enabled

---

### **Problem: Reviews not showing on website**

**Solution:**
1. Check Vercel environment variables are set correctly
2. Redeploy your site (Vercel → Deployments → Redeploy)
3. Wait 5 minutes for deployment
4. Clear your browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
5. Open browser console (F12) and look for errors

---

### **Problem: "OVER_QUERY_LIMIT"**

**Solution:**
1. Go to Google Cloud Console → Billing
2. Check that billing is active
3. Check API quotas: APIs & Services → Dashboard → Places API
4. You may need to increase your quota (unlikely with your traffic)

---

## 📊 **MONITOR YOUR USAGE**

### **Check how many API calls you're using:**

1. Go to: https://console.cloud.google.com/
2. Select your project
3. Left sidebar → "APIs & Services" → "Dashboard"
4. Click on "Places API"
5. View the usage graph

**Your expected usage:**
- ~100-200 API calls per day
- ~3,000-6,000 per month
- Cost: **$0** (free tier is 100,000/month)

---

## ✅ **SUCCESS CHECKLIST**

- [ ] Google Cloud project created
- [ ] Places API enabled
- [ ] API key created and saved
- [ ] API key restricted (HTTP referrers + Places API)
- [ ] Billing enabled
- [ ] API key added to Vercel
- [ ] Site redeployed
- [ ] Test 1 passed (API works)
- [ ] Test 2 passed (Endpoint works)
- [ ] Test 3 passed (Reviews display on profile)

---

## 🎉 **YOU'RE DONE!**

If you see reviews on your surgeon profiles, congratulations! 🎊

**What you've achieved:**
- ✅ Real Google reviews on every profile
- ✅ Automatic updates (cached for 1 hour)
- ✅ Social proof for patients
- ✅ Better SEO and conversions
- ✅ Professional, trustworthy profiles

---

## 💬 **STUCK? GET HELP**

If you're stuck at any step:

1. **Check the error message**
   - Open browser console (F12)
   - Look for red error messages
   - Copy the error and search Google

2. **Common issues:**
   - Forgot to enable billing
   - API key not added to Vercel
   - Need to redeploy after adding environment variable
   - API key restrictions too strict

3. **Still stuck?**
   - Take a screenshot of the error
   - Note which step you're on
   - Let me know and I'll help debug!

---

**Good luck! You've got this! 💪**
