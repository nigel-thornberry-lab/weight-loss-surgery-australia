# Contextual Forms Deployment Guide

## ✅ Forms Created

### 1. **NewsletterForm** (Low Commitment)
**File:** `src/components/NewsletterForm.astro`
**Fields:** Email only
**Best for:** Curious visitors, educational content
**CTA:** "Send Me Free Info" / "Download Guide"

### 2. **ConsultationForm** (High Commitment)
**File:** `src/components/ConsultationForm.astro`
**Fields:** Name, Phone, Email, Location, Procedure
**Best for:** Ready buyers, surgeon profiles, quiz completers
**CTA:** "Request Free Consultation" / "Book Appointment"

### 3. **CostCalculatorForm** (Medium Commitment)
**File:** `src/components/CostCalculatorForm.astro`
**Fields:** Email, Procedure, Health Fund, Location
**Best for:** Price-conscious visitors, cost pages
**CTA:** "Calculate My Cost" / "Get Cost Breakdown"

---

## 📍 Where to Deploy Each Form

### ✅ ALREADY DEPLOYED:

1. **`/contact`** → ConsultationForm ✓
2. **`/am-i-ready`** → ConsultationForm (after quiz) ✓

---

### 🎯 HIGH PRIORITY - Deploy Next:

#### **Cost Pages** → CostCalculatorForm
Files to update:
- `/costs/gastric-sleeve-cost-australia.astro`
- `/costs/gastric-bypass-cost-australia.astro`
- `/costs/gastric-band-cost-australia.astro`

**Implementation:**
```astro
---
import CostCalculatorForm from '../components/CostCalculatorForm.astro';
---

<!-- Add before final CTA section -->
<section class="py-16 bg-white">
  <div class="max-w-3xl mx-auto px-4">
    <CostCalculatorForm 
      source="Gastric Sleeve Cost Page" 
      procedureName="Gastric Sleeve"
    />
  </div>
</section>
```

**Why:** Visitors on cost pages have HIGH intent but need financial clarity first.

---

#### **Blog Posts** → NewsletterForm
Files to update:
- `/blog/gastric-sleeve-cost-australia-2025.astro`
- `/blog/gastric-sleeve-recovery-week-by-week.astro`
- All other blog posts

**Implementation:**
```astro
---
import NewsletterForm from '../components/NewsletterForm.astro';
---

<!-- Add at end of article, before related posts -->
<section class="py-12 bg-gray-50">
  <div class="max-w-2xl mx-auto px-4">
    <NewsletterForm 
      source="Blog: [Article Title]"
      headline="Want More Like This?"
      description="Get our weekly newsletter with real stories, honest guidance, and no BS."
      ctaText="Subscribe Free"
    />
  </div>
</section>
```

**Why:** Blog readers are in research mode, not ready to book yet.

---

#### **Surgeon Profiles** → ConsultationForm
Files to update:
- All 77 surgeon profile pages in `/surgeons/`

**Implementation:**
```astro
---
import ConsultationForm from '../components/ConsultationForm.astro';
const surgeonName = "Dr. John Smith"; // Get from surgeon data
---

<!-- Add after surgeon details, before map -->
<section class="py-12 bg-gradient-to-br from-blue-50 to-purple-50">
  <div class="max-w-2xl mx-auto px-4">
    <ConsultationForm 
      source={`Surgeon Profile: ${surgeonName}`}
      surgeonName={surgeonName}
    />
  </div>
</section>
```

**Why:** Someone viewing a surgeon profile is HIGH intent, ready to book.

---

### 📊 MEDIUM PRIORITY - Deploy After:

#### **Procedure Pages** → ConsultationForm
Files to update:
- `/procedures/gastric-sleeve.astro`
- `/procedures/gastric-bypass.astro`
- `/procedures/gastric-band.astro`
- `/procedures/duodenal-switch.astro`
- And location-specific versions (e.g., `gastric-sleeve-sydney.astro`)

**Implementation:**
```astro
---
import ConsultationForm from '../components/ConsultationForm.astro';
---

<!-- Add before FAQs section -->
<section class="py-16 bg-gradient-to-br from-blue-600 to-purple-600">
  <div class="max-w-2xl mx-auto px-4">
    <ConsultationForm 
      source="Procedure Page: Gastric Sleeve"
      theme="dark"
    />
  </div>
</section>
```

**Why:** After reading about a procedure, they're ready to take action.

---

#### **Location Pages** → ConsultationForm
Files to update:
- `/locations/sydney.astro`
- `/locations/melbourne.astro`
- All suburb pages (Parramatta, Dandenong, etc.)

**Implementation:**
```astro
---
import ConsultationForm from '../components/ConsultationForm.astro';
---

<!-- Add after surgeon directory listing -->
<section class="py-12 bg-blue-50">
  <div class="max-w-2xl mx-auto px-4">
    <ConsultationForm 
      source="Location Page: Sydney"
      headline="Find Surgeons in Sydney"
    />
  </div>
</section>
```

**Why:** Location searches = high local intent.

---

#### **Homepage** → Multiple Forms
File: `/index.astro`

**Add NewsletterForm in sidebar or after stigma section:**
```astro
<NewsletterForm 
  source="Homepage Newsletter"
  headline="Start Your Research (No Pressure)"
  ctaText="Get Free Guide"
/>
```

**Keep existing ConsultationForm in hero (linked via /contact button)**

**Why:** Homepage gets mixed traffic - offer both low and high commitment options.

---

### 🔧 LOW PRIORITY - Advanced Features:

#### **Exit Intent Popup** → NewsletterForm
Create new component: `ExitIntentPopup.astro`
Shows NewsletterForm when user tries to leave

#### **Sticky Footer Bar**
Component: `StickyContactBar.astro`
Fixed bottom bar: "Get Free Guide" → Opens NewsletterForm modal

#### **Multi-Step Form** (from strategy doc)
Advanced: "What brings you here?" branching logic

---

## 🚀 Quick Deployment Script

Want to add a form to a page quickly? Here's the pattern:

### 1. Import the form
```astro
---
import NewsletterForm from '../components/NewsletterForm.astro';
// OR
import ConsultationForm from '../components/ConsultationForm.astro';
// OR
import CostCalculatorForm from '../components/CostCalculatorForm.astro';
---
```

### 2. Add to page
```astro
<section class="py-12 bg-gray-50">
  <div class="max-w-2xl mx-auto px-4">
    <FormComponent 
      source="Your Page Name"
      theme="light" <!-- or "dark" for gradient backgrounds -->
    />
  </div>
</section>
```

### 3. Test
```bash
npm run dev
# Visit the page
# Submit the form
# Check Google Sheet for new row
```

---

## 📊 Form Selection Matrix

| Page Type | Visitor Intent | Form Type | Fields | Why |
|-----------|---------------|-----------|--------|-----|
| Blog Posts | Research | Newsletter | Email | Low friction for learners |
| Cost Pages | Price Check | Cost Calculator | Email + Cost Info | Captures financial intent |
| Surgeon Profiles | Ready to Book | Consultation | Full Details | High intent = high commitment OK |
| Procedure Pages | Exploring Options | Consultation | Full Details | After education, ready to act |
| Homepage | Mixed | Both | Varies | Offer choice based on readiness |
| Location Pages | Local Search | Consultation | Full Details | Local search = high intent |

---

## 🎨 Form Themes

### Light Theme (Default)
Use on: White/light backgrounds
```astro
<ConsultationForm theme="light" />
```

### Dark Theme
Use on: Gradient/colored backgrounds
```astro
<ConsultationForm theme="dark" />
```

**Example dark background:**
```astro
<section class="py-12 bg-gradient-to-br from-blue-600 to-purple-600">
  <div class="max-w-2xl mx-auto px-4">
    <ConsultationForm theme="dark" />
  </div>
</section>
```

---

## 📈 Conversion Tracking

All forms track to Google Sheets with `source` parameter. Monitor these sources:

### Newsletter Forms:
- `Blog: [Article Title]`
- `Homepage Newsletter`
- `Exit Intent Popup`

### Consultation Forms:
- `Contact Page`
- `Am I Ready Quiz`
- `Surgeon Profile: [Name]`
- `Procedure Page: [Procedure]`
- `Location Page: [Location]`

### Cost Calculator Forms:
- `Gastric Sleeve Cost Page`
- `Gastric Bypass Cost Page`
- `Gastric Band Cost Page`

### Analysis:
```
High-performing sources = Add more forms there
Low-performing sources = Test different form type or placement
```

---

## ✅ Next Steps

1. **Test current forms** (contact page + am-i-ready)
2. **Deploy to cost pages** (3 pages, 10 min)
3. **Deploy to blog posts** (test on 1-2 articles first)
4. **Deploy to surgeon profiles** (create reusable pattern)
5. **Monitor Google Sheet** for lead quality
6. **Iterate based on data**

---

## 🎯 Expected Impact

### Current State:
- 2 pages with forms
- Generic "contact us" approach
- ~2-5% conversion rate (estimated)

### After Full Deployment:
- 100+ pages with contextual forms
- Matched to visitor intent
- ~10-15% conversion rate (estimated)
- 3-5x more leads

### Lead Quality:
- Newsletter leads: Low urgency, nurture over time
- Cost calculator leads: High financial concern, respond with pricing
- Consultation leads: HIGH intent, call ASAP

---

## 🆘 Troubleshooting

### Form not submitting?
1. Check `.env` file has correct webhook URL
2. Test webhook directly: `node test-webhook.js`
3. Check browser console for errors

### Success message not showing?
- This is normal with `no-cors` mode
- Check Google Sheet for the row
- Form hides and success shows = it worked

### Want to customize a form?
- All forms accept props: `source`, `theme`, `headline`, etc.
- See individual component files for full prop list

---

**Ready to deploy? Start with cost pages - they'll have the highest impact!**

