# GA4 Dashboard Quick Start Guide

**Get your GA4 dashboards up and running in 30 minutes**

---

## ⚡ Quick Implementation (30 minutes)

### Step 1: Update GA4 Configuration (5 min)

Replace your existing GA4 code in `src/layouts/BaseLayout.astro` (lines 176-185) with:

```javascript
gtag('config', 'G-GGQF9749LT', {
  'send_page_view': true,
  'anonymize_ip': true,
  'allow_google_signals': true,
  'allow_ad_personalization_signals': false,
  'cookie_flags': 'SameSite=None;Secure',
  
  // Enhanced Ecommerce for Lead Tracking
  'enhanced_measurement': {
    'scrolls': true,
    'outbound_clicks': true,
    'site_search': true,
    'video_engagement': true,
    'file_downloads': true
  }
});
```

### Step 2: Add Enhanced Tracking (5 min)

1. **Create file:** `public/js/ga4-enhanced-tracking.js`
2. **Copy content from:** `GA4-ENHANCED-TRACKING-CODE.js`
3. **Add to BaseLayout.astro** before `</body>`:
```html
<script src="/js/ga4-enhanced-tracking.js" defer></script>
```

### Step 3: Set Up Custom Dimensions (10 min)

**Go to GA4 → Admin → Custom Definitions → Custom Dimensions → Create custom dimensions**

#### Add these 4 dimensions:

1. **Page Category**
   - Dimension name: Page Category
   - Scope: Event
   - Event parameter: page_category

2. **Content Type**
   - Dimension name: Content Type
   - Scope: Event
   - Event parameter: content_type

3. **Target Keyword**
   - Dimension name: Target Keyword
   - Scope: Event
   - Event parameter: target_keyword

4. **Lead Source**
   - Dimension name: Lead Source
   - Scope: Event
   - Event parameter: lead_source

### Step 4: Set Up Conversions (5 min)

**Go to GA4 → Admin → Events → Mark as conversion**

Mark these events as conversions:
- ✅ newsletter_signup (Value: 1)
- ✅ consultation_request (Value: 5)
- ✅ cost_calculator_complete (Value: 3)
- ✅ phone_click (Value: 4)

### Step 5: Create Dashboards (5 min)

**Go to GA4 → Explore → Create new exploration → Free form**

#### Dashboard 1: SEO Performance
- **Dimensions:** Date, Page title, Source/Medium, Page Category
- **Metrics:** Sessions, Users, Bounce rate, Conversions
- **Filters:** Source/Medium = "google / organic"
- **Save as:** "SEO Performance Dashboard"

#### Dashboard 2: Lead Generation
- **Dimensions:** Date, Event name, Page title, Lead Source
- **Metrics:** Event count, Conversions, Conversion rate
- **Filters:** Event name contains "newsletter_signup" OR "consultation_request"
- **Save as:** "Lead Generation Dashboard"

#### Dashboard 3: Traffic Growth
- **Dimensions:** Date, Source/Medium, Device category, Country
- **Metrics:** Sessions, Users, New users, Average session duration
- **Filters:** None (all traffic)
- **Save as:** "Traffic Growth Dashboard"

#### Dashboard 4: Conversion Rates
- **Dimensions:** Date, Source/Medium, Device category, Page Category
- **Metrics:** Sessions, Conversions, Conversion rate, Revenue
- **Filters:** None (all traffic)
- **Save as:** "Conversion Rates Dashboard"

---

## 🎯 Key Metrics to Monitor

### SEO Performance:
- **Organic traffic growth:** +20% month-over-month
- **Average ranking position:** Top 10 for target keywords
- **Click-through rate:** >3% from search results
- **Organic conversion rate:** >2%

### Lead Generation:
- **Total leads:** +25% month-over-month
- **Lead quality score:** >7/10
- **Cost per lead:** <$50
- **Lead to consultation rate:** >15%

### Traffic Growth:
- **Total sessions:** +15% month-over-month
- **New user percentage:** 60-70%
- **Average session duration:** >2 minutes
- **Pages per session:** >3

### Conversion Rates:
- **Overall conversion rate:** >3%
- **Mobile conversion rate:** >2%
- **Form completion rate:** >80%
- **Return on investment:** >300%

---

## 📊 Dashboard Widgets

### SEO Performance Dashboard:
1. **Organic Traffic Trend** (Line chart, last 12 months)
2. **Top Organic Keywords** (Table, top 20)
3. **Landing Page Performance** (Table, organic traffic only)
4. **Geographic Distribution** (Map, organic traffic)
5. **Device Performance** (Pie chart, organic traffic)

### Lead Generation Dashboard:
1. **Lead Generation Trend** (Line chart, leads over time)
2. **Lead Sources** (Table, by source and type)
3. **Conversion Funnel** (Funnel visualization)
4. **Form Performance** (Table, completion rates)
5. **Lead Quality Score** (KPI cards)

### Traffic Growth Dashboard:
1. **Traffic Growth Trend** (Line chart, sessions over time)
2. **Traffic Sources** (Pie chart, all sources)
3. **User Engagement Metrics** (KPI cards)
4. **Top Content** (Table, by sessions)
5. **User Flow** (Sankey diagram)

### Conversion Rates Dashboard:
1. **Conversion Rate Trend** (Line chart, over time)
2. **Source Performance** (Table, conversion by source)
3. **ROI Analysis** (KPI cards)
4. **A/B Test Results** (Comparison charts)
5. **Technical Performance** (Speed and UX metrics)

---

## 🔗 Search Console Integration

### Link Search Console:
1. **Go to GA4 → Admin → Property Settings**
2. **Click "Search Console Links"**
3. **Click "Link"**
4. **Select your Search Console property**
5. **Click "Confirm"**

### Import Search Console Data:
1. **Go to GA4 → Explore → Create new exploration**
2. **Select "Search Console" as data source**
3. **Create reports for keyword rankings and CTR**

---

## 📈 Monthly Reporting

### Automated Reports:
1. **Go to GA4 → Library → Create new report**
2. **Set up monthly email reports for:**
   - Executive summary
   - Traffic performance
   - Lead generation
   - Conversion analysis

### Key Reports to Set Up:
- **Executive Dashboard:** KPI overview
- **Marketing Dashboard:** Traffic sources and campaigns
- **Content Dashboard:** Top performing pages
- **Lead Generation Dashboard:** Lead sources and conversion

---

## 🚀 Advanced Features

### Custom Audiences:
Create audiences for:
- High-intent users (visited cost calculator)
- Surgeon profile viewers
- Newsletter subscribers
- Mobile users
- Geographic segments

### Enhanced Ecommerce:
Set up lead value tracking:
- Newsletter signup: $1
- Cost calculator: $3
- Phone click: $4
- Consultation request: $5

### A/B Testing:
Track A/B test performance:
- Form variations
- CTA button tests
- Page layout tests
- Content variations

---

## 🔍 Testing Your Setup

### Use GA4 Debug View:
1. **Go to GA4 → Configure → DebugView**
2. **Test events in real-time**
3. **Verify all parameters are firing**

### Use Google Tag Assistant:
1. **Install Chrome extension**
2. **Test your website**
3. **Verify all tags are firing**

### Check Real-time Reports:
1. **Go to GA4 → Reports → Realtime**
2. **Test user actions**
3. **Verify events are tracking**

---

## 📱 Mobile Optimization

### Mobile-Specific Metrics:
- Mobile conversion rate
- Mobile bounce rate
- Mobile page load speed
- Mobile user engagement
- Mobile lead generation

### Mobile Dashboard:
- Device performance comparison
- Mobile user journey
- Mobile conversion funnel
- Mobile optimization opportunities

---

## 🎯 Success Metrics

### Week 1:
- All tracking code implemented
- Custom dimensions set up
- Conversions configured
- Basic dashboards created

### Week 2:
- Search Console linked
- Advanced dashboards created
- Automated reports set up
- Team trained on usage

### Month 1:
- Full data collection
- Performance baseline established
- Optimization opportunities identified
- ROI tracking implemented

---

## 🚀 Next Steps

1. **Implement the enhanced tracking code**
2. **Set up all 4 dashboards**
3. **Configure custom dimensions and conversions**
4. **Link Search Console**
5. **Test all tracking**
6. **Set up automated reports**
7. **Train your team on dashboard usage**

This comprehensive setup will give you complete visibility into your website's performance, lead generation, and conversion optimization opportunities.
