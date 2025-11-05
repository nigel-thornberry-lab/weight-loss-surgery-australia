# AI Directory Features Implementation Guide

Implementation guide for key monetization and SEO features based on successful directory case study.

---

## Feature 1: User Authentication & Claim Listings

### Overview
Allow surgeons/practices to claim their listings and manage their information.

### User Flow
1. User creates account (email/password)
2. Search for their practice in dashboard
3. Submit claim request with verification info
4. Admin approves/rejects
5. User can now edit their listing

### Database Schema
```typescript
// user_claims table
{
  id: uuid
  user_id: uuid (foreign key to auth.users)
  surgeon_id: uuid (foreign key to surgeons)
  status: enum ('pending', 'approved', 'rejected')
  contact_name: string
  contact_email: string
  contact_phone: string
  verification_notes: text
  claimed_at: timestamp
  reviewed_at: timestamp
}
```

### Pages Needed
- `/dashboard` - User's claimed listings overview
- `/dashboard/claim` - Search and claim a listing
- `/dashboard/manage/[surgeonId]` - Edit listing details
- `/admin/claims` - Admin review pending claims

### Claude Code Prompt
```
Create a user authentication and profile claim system:

1. Implement Supabase Auth for sign up/login
2. Create user dashboard at /dashboard showing:
   - List of claimed profile
   - "Claim profile" button
3. Create claim flow at /dashboard/claim:
   - Search by city dropdown
   - Display all surgeons in that city
   - "Claim this profile" button on each
   - Verification form: name, email, phone, position/role
4. Create admin dashboard at /admin/claims with:
   - Table of pending claims
   - Approve/reject buttons
   - View verification details
   - Email notification on approval
5. After approval, user can edit their profile at /dashboard/manage/[surgeonId]
6. Protected routes requiring authentication
7. Clean, minimal UI
```

---

## Feature 2: Featured Listings (Monetization)

### Overview
Paid upgrade that makes listing stand out with premium positioning and image uploads.

### Benefits
- Appears first on location pages (above regular listings)
- Blue border for visibility
- "Featured" badge
- Upload up to 8 photos and videos (consultation rooms, team, facilities)
- 30-day, 90-day, or 180-day plans

### Pricing Strategy
- $29/month - Monthly plan
- $79/3 months - Save $8 (~10% off)
- $149/6 months - Save $25 (~14% off)

### Database Schema
```typescript
// featured_listings table
{
  id: uuid
  surgeon_id: uuid (foreign key)
  user_id: uuid (foreign key)
  plan: enum ('monthly', 'quarterly', 'biannual')
  starts_at: timestamp
  expires_at: timestamp
  status: enum ('active', 'expired')
  stripe_payment_id: string
}

// listing_images table
{
  id: uuid
  surgeon_id: uuid (foreign key)
  image_url: string
  display_order: integer
  uploaded_at: timestamp
}
```

### Display Logic
```typescript
// On location pages:
1. Sort featured listings first (by created_at desc)
2. Then regular listings (alphabetically)

// Featured listing card styling:
- Blue border: border: 2px solid #3B82F6
- "Featured" badge (top-right corner)
- Image carousel (if images uploaded)
- Slightly larger card size
- Remove from regular position (don't show twice)
```

### Implementation Steps

#### 1. Create Advertise Page
At `/advertise` explain:
- Benefits of featured listing
- Pricing options
- Show example of featured vs regular listing
- CTA buttons for each plan

#### 2. Stripe Integration
```typescript
// Create products in Stripe:
- Featured Listing - 1 Month ($29)
- Featured Listing - 3 Months ($79)
- Featured Listing - 6 Months ($149)

// Handle webhook events:
- checkout.session.completed → Create featured_listing record
- customer.subscription.deleted → Mark as expired
```

#### 3. Image Upload/video Interface
After payment, redirect to `/dashboard/featured/[surgeonId]`:
- Show days remaining
- Upload interface (8 images max, 2MB each)
- Store in Supabase Storage
- Display preview

#### 4. Update Location Pages
Modify surgeon listing display:
- Query featured listings separately
- Display featured section at top
- Apply featured styling
- Show image carousel

### Claude Code Prompt
```
Implement featured listings monetization system:

1. Create /advertise page explaining:
   - Featured listing benefits
   - 3 pricing tiers ($89, $149, $199)
   - Visual comparison of featured vs regular
2. Integrate Stripe checkout:
   - Create checkout sessions for each plan
   - Handle success/cancel redirects
3. Create featured_listings and listing_images tables
4. After successful payment:
   - Redirect to /dashboard/featured/[surgeonId]
   - Show expiry date and days remaining
   - Image upload interface (8 max, 2MB each)
   - Use Supabase Storage for hosting
5. Update location pages (e.g., /surgeons/nsw/sydney):
   - Show featured listings at top
   - Blue border (2px solid #3B82F6)
   - "Featured" badge
   - Image carousel if images exist
   - Remove from regular position
6. In user dashboard:
   - Show "Upgrade to Featured" if not featured
   - Show "Manage Featured" if featured
   - Display days remaining
7. Implement Stripe webhook handling for payment events
```

---


## Feature 3: Badge Backlink Generator

### Overview
Offer 1 free month of featured listing ($29 value) in exchange for practices adding your badge to their website. Generates hyper-relevant local backlinks.

### Strategy
- Business adds badge to their website
- Badge links back to your site (to their city page)
- They get 1 free month featured listing
- You get a high-quality, relevant backlink

### Badge Generator Page
At `/free-badge` or `/get-badge`:

**User Flow:**
1. Select their city from dropdown
2. Badge preview generates automatically
3. Copy HTML embed code
4. Instructions for adding to website
5. Email template to request coupon code

### Badge HTML Example
```html
<a href="https://bariatricsurgeryhub.com/surgeons/nsw/sydney"
   target="_blank">
  <img src="https://bariatricsurgeryhub.com/badges/sydney-nsw.png"
       alt="Verified Bariatric Surgeon - BariatricSurgeryHub.com"
       width="200"
       height="80">
</a>
```

### Alternative for Non-Technical Users
Offer simple text link:
```html
<a href="https://bariatricsurgeryhub.com/surgeons/nsw/sydney">
  Verified by BariatricSurgeryHub.com
</a>
```

### Badge Design
Create badge image with:
- Your logo/branding
- "Verified Bariatric Surgeon"
- City name
- Professional medical aesthetic
- Size: 200x80px or 250x100px

### Verification Process
1. Business adds badge to website
2. Business emails you (using provided template)
3. You manually verify badge on their site
4. Generate coupon code (see Feature 5)
5. Email coupon to business

### Email Template (Pre-filled for users)
```
Subject: Badge Added - Requesting Featured Listing Coupon

Hi,

I've added the BariatricSurgeryHub.com verified badge to our website at [WEBSITE_URL].

Please verify and send the coupon code for 1 free month of featured listing.

Thank you!
[NAME]
[PRACTICE]
```

### Database Tracking (Optional)
```typescript
// badge_backlinks table
{
  id: uuid
  surgeon_id: uuid
  business_website: string
  badge_added_at: timestamp
  verified_at: timestamp
  coupon_code: string
  coupon_used: boolean
  notes: text
}
```

### Claude Code Prompt
```
Create badge backlink generator:

1. Create page at /free-badge with:
   - Headline: "Get 1 Free Month Featured Listing ($29 Value)"
   - Explanation of benefits
   - City dropdown selector (all cities in database)
   - Live badge preview that updates with selected city
   - HTML embed code (auto-generated, copyable)
   - Step-by-step instructions for adding badge
   - Alternative text link option for non-technical users
   - Pre-filled email template (copyable)

2. Badge design:
   - Create badge images for all cities
   - Store in /public/badges/ directory
   - Format: city-state.png (e.g., sydney-nsw.png)
   - Include: logo, "Verified Bariatric Surgeon", city name
   - Link back to correct city page
   - Professional medical aesthetic

3. Email template text:
   "Hi, I've added your badge to our website at [USER_ENTERS_URL].
   Please verify and send the coupon code for 1 free month of
   featured listing. Thank you!"

4. Badge HTML should be copy-paste ready
5. Make instructions clear and simple
6. Optional: Admin tracking table for badge placements
```

---

## Feature 5: Coupon Code Generator (Admin)

### Overview
Admin-only tool to quickly generate Stripe coupon codes without leaving the dashboard.

### Use Cases
- Badge backlink rewards ($29 off)
- Partnership deals
- Customer service credits
- Promotional campaigns

### Admin Interface
At `/admin/coupons`:

**Features:**
- Generate new coupon form:
  - Amount off ($29, $50, custom) OR percentage (20%, 50%)
  - Duration (once, forever, repeating)
  - Expiry date (optional)
  - Max redemptions (optional)
  - Type/category (dropdown)
  - Notes field
- List all generated coupons
- Copy code button
- View usage stats

### Stripe Integration
```typescript
// Generate coupon via Stripe API:
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const coupon = await stripe.coupons.create({
  amount_off: 2900, // $29 in cents
  currency: 'aud',
  duration: 'once',
  name: 'Badge Backlink Reward',
  metadata: {
    type: 'badge_reward',
    surgeon_id: 'abc123'
  }
});

// Returns coupon.id to share with customer
```

### Coupon Types
```typescript
enum CouponType {
  'badge_reward',    // For badge backlink program
  'partnership',     // For partner clinics/referrers
  'promotion',       // Marketing campaigns
  'customer_service' // Support credits
}
```

### Database Schema (Optional)
```typescript
// coupon_codes table
{
  id: uuid
  stripe_coupon_id: string
  code: string
  amount_off: integer
  type: enum ('badge_reward', 'partnership', 'promotion', 'support')
  created_at: timestamp
  expires_at: timestamp (nullable)
  max_redemptions: integer (nullable)
  times_redeemed: integer
  notes: text
}
```

### Integration with Checkout
- Add coupon code field to Stripe checkout
- Validate and apply discount automatically
- Show discount amount before payment

### Claude Code Prompt
```
Create admin coupon code generator:

1. Add section to /admin dashboard at /admin/coupons
2. Form to generate new Stripe coupon:
   - Radio: Amount off (dollars) OR Percentage off
   - Input: Dollar amount or percentage value
   - Dropdown: Duration (once, forever, repeating)
   - Date picker: Optional expiry date
   - Number: Optional max redemptions
   - Dropdown: Type (badge_reward, partnership, promotion, support)
   - Textarea: Notes
   - Generate button
3. On submit:
   - Call Stripe API to create coupon
   - Display success message with coupon code
   - Add "Copy to clipboard" button
   - Store in local database (optional)
4. Below form, list all generated coupons:
   - Table with: Code, Amount/%, Type, Created, Expires, Used count
   - Copy button for each code
   - Link to Stripe dashboard for that coupon
5. Integrate with featured listing checkout:
   - Add coupon field to payment page
   - Validate and apply discount
   - Show final price after discount
6. Use environment variable for Stripe secret key
7. Restrict access to admin users only
8. Add error handling for invalid coupons
```

---

## Feature 6: Schema Markup (Critical for SEO)

### Overview
Implement comprehensive schema markup to help Google understand your site structure and content. This is critical for fast indexing and ranking.

### Why This Matters Most
From the case study:
- Site indexed in 2 months with DR 0
- Ranking on page 1 for FAQ content
- 200+ monthly visits from ChatGPT
- 3,500+ organic visitors in 2 months

### Schema Types to Implement

#### 1. Location Page Schema (MOST IMPORTANT)
Every location page (e.g., `/surgeons/nsw/sydney`) needs:

**BreadcrumbList:**
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://bariatricsurgeryhub.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "NSW",
      "item": "https://bariatricsurgeryhub.com/surgeons/nsw"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Sydney",
      "item": "https://bariatricsurgeryhub.com/surgeons/nsw/sydney"
    }
  ]
}
```

**ItemList of Surgeons:**
```json
{
  "@type": "ItemList",
  "name": "Bariatric Surgeons in Sydney, NSW",
  "description": "Find experienced weight loss surgeons in Sydney",
  "numberOfItems": 12,
  "itemListElement": [
    {
      "@type": "LocalBusiness",
      "name": "Dr. John Smith - Sydney Bariatric Clinic",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 George Street",
        "addressLocality": "Sydney",
        "addressRegion": "NSW",
        "postalCode": "2000",
        "addressCountry": "AU"
      },
      "telephone": "+61-2-1234-5678",
      "url": "https://bariatricsurgeryhub.com/surgeons/dr-john-smith",
      "openingHours": ["Mo-Fr 09:00-17:00"]
    }
    // ... repeat for each surgeon
  ]
}
```

**FAQPage:**
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does weight loss surgery cost in Sydney?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Weight loss surgery costs in Sydney typically range from $15,000-$25,000 depending on the procedure..."
      }
    },
    {
      "@type": "Question",
      "name": "Which Sydney hospitals perform bariatric surgery?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Major Sydney hospitals offering bariatric surgery include..."
      }
    }
    // ... 4-6 more FAQs
  ]
}
```

#### 2. Individual Surgeon Page Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Physician",
  "name": "Dr. John Smith",
  "medicalSpecialty": "Bariatric Surgery",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 George Street",
    "addressLocality": "Sydney",
    "addressRegion": "NSW",
    "postalCode": "2000",
    "addressCountry": "AU"
  },
  "telephone": "+61-2-1234-5678",
  "url": "https://example-clinic.com.au",
  "image": "https://bariatricsurgeryhub.com/images/dr-john-smith.jpg",
  "availableService": [
    {
      "@type": "MedicalProcedure",
      "name": "Gastric Sleeve Surgery"
    },
    {
      "@type": "MedicalProcedure",
      "name": "Gastric Bypass Surgery"
    }
  ]
}
```

#### 3. Homepage Schema
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Bariatric Surgery Hub",
  "description": "Find trusted bariatric surgeons across Australia. Compare procedures, costs, and book consultations.",
  "url": "https://bariatricsurgeryhub.com"
}
```

### Implementation in Astro

For each page component, add schema to `<head>`:

```astro
---
// In your location page component
const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    // BreadcrumbList
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        // breadcrumbs here
      ]
    },
    // ItemList
    {
      "@type": "ItemList",
      "name": `Bariatric Surgeons in ${city}, ${state}`,
      "numberOfItems": surgeons.length,
      "itemListElement": surgeons.map((surgeon, index) => ({
        "@type": "LocalBusiness",
        "name": surgeon.name,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": surgeon.address,
          "addressLocality": surgeon.city,
          "addressRegion": surgeon.state,
          "postalCode": surgeon.postcode,
          "addressCountry": "AU"
        },
        "telephone": surgeon.phone,
        "url": surgeon.website || `https://bariatricsurgeryhub.com/surgeons/${surgeon.slug}`
      }))
    },
    // FAQPage
    {
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
  ]
};
---

<head>
  <script type="application/ld+json" set:html={JSON.stringify(schemaData)} />
</head>
```

### Validation
Test every page with:
1. **Schema.org Validator**: https://validator.schema.org/
2. **Google Rich Results Test**: https://search.google.com/test/rich-results

### Claude Code Prompt
```
Implement comprehensive schema markup across all pages:

1. For every location page (e.g., /surgeons/nsw/sydney):
   - Add BreadcrumbList showing Home > State > City
   - Add ItemList of all surgeons with LocalBusiness type
   - Include: name, full address, phone, url, openingHours
   - Add FAQPage with all FAQ Q&As from that page
   - Use "@graph" to combine all three schemas

2. For individual surgeon pages:
   - Add Physician schema (or LocalBusiness)
   - Include: name, medicalSpecialty, address, phone, services, image
   - Add availableService for each procedure they offer

3. For homepage:
   - Add WebSite schema with name, description, url

4. Implementation requirements:
   - Dynamically generate from database (not hardcoded)
   - Use JSON-LD format in <script type="application/ld+json">
   - Add to <head> section of each page
   - Ensure all data matches what's visible on the page
   - Use most specific schema types (Physician vs LocalBusiness)

5. After implementation:
   - Validate with schema.org validator
   - Test with Google Rich Results Test
   - Check for errors and warnings

Please implement across all existing pages and ensure new pages (like crowdsourced submissions) automatically include proper schema.
```

---

## Implementation Priority

### Phase 1: Foundation (Week 1)
1. **Schema Markup** - Highest SEO impact
   - Implement on all existing location pages
   - Add to surgeon profile pages
   - Validate with tools

### Phase 2: User Engagement (Week 2)
2. **User Authentication & Claim System**
   - Supabase auth setup
   - User dashboard
   - Claim workflow
   - Admin approval

### Phase 3: Monetization (Week 3)
3. **Featured Listings**
   - Stripe integration
   - Payment flow
   - Image uploads
   - Featured display on location pages

### Phase 4: Growth (Week 4)
4. **Crowdsourced Submissions**
   - Public submission form
   - Admin review dashboard
   - Auto-create location pages
   - Email notifications

### Phase 5: Link Building (Week 5)
5. **Badge Backlink Generator**
   - Badge design for all cities
   - Generator page
   - Email templates

6. **Coupon Generator**
   - Admin interface
   - Stripe API integration
   - Tracking system

---

## Expected Results

Based on case study with similar implementation:

**Timeline:**
- Month 1: Indexed by Google
- Month 2: 3,500+ monthly visitors
- Month 3+: Scaling to 6,000+ visitors

**Traffic Sources:**
- Organic search: 95%
- ChatGPT/LLMs: 5%
- All with DR 0, zero backlinks

**Monetization:**
- 10-20 featured listings per month
- $290-$580 MRR to start
- 50+ listings = $1,450/month potential

---

## Key Success Factors

1. **Schema markup from day 1** - Don't skip this
2. **Clean, simple UI** - Especially for claim/dashboard
3. **Mobile-first** - 60%+ traffic is mobile
4. **Fast implementation** - Use Claude Code, ship quickly
5. **Validate everything** - Schema, payments, emails

---

## Cost Breakdown

**Monthly Operating Costs:**
- Hosting (Vercel): $0-20
- Database (Supabase): $0-25
- Stripe: 2.9% + 30¢ per transaction
- Domain: ~$1.50/month
- **Total: $30-50/month**

**Revenue Potential:**
- 20 featured listings: $580/month
- 50 featured listings: $1,450/month
- 100 featured listings: $2,900/month

---

*Implementation guide based on real directory achieving rapid growth with zero backlinks using these exact features.*
