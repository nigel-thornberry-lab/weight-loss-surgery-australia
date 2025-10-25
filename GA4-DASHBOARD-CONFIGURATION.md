# GA4 Dashboard Configuration for Weight Loss Surgery Website

**Measurement ID:** G-GGQF9749LT  
**Domain:** bariatricsurgeryhub.com  
**Purpose:** Track ranking positions, traffic growth, lead generation, and conversion rates

---

## 🎯 Dashboard Overview

### Dashboard 1: SEO Performance & Ranking Positions
**Purpose:** Monitor organic search performance and keyword rankings

#### Key Metrics to Track:
1. **Organic Traffic Growth**
   - Sessions from organic search (monthly comparison)
   - Top performing pages by organic traffic
   - Organic search trend over time

2. **Keyword Performance**
   - Top organic keywords driving traffic
   - Keyword ranking positions (via Search Console integration)
   - Click-through rates from search results

3. **Page Performance**
   - Top landing pages from organic search
   - Bounce rate by traffic source
   - Average session duration from organic

#### GA4 Configuration:
```javascript
// Custom Dimensions to Add:
1. Page Category (procedures, surgeons, costs, blog)
2. Content Type (landing page, blog post, surgeon profile)
3. Target Keyword (for tracking specific keyword performance)
4. Geographic Location (for local SEO tracking)
```

#### Dashboard Widgets:
1. **Organic Traffic Trend** (Line chart, last 12 months)
2. **Top Organic Keywords** (Table, top 20)
3. **Landing Page Performance** (Table, organic traffic only)
4. **Geographic Distribution** (Map, organic traffic)
5. **Device Performance** (Pie chart, organic traffic)

---

### Dashboard 2: Traffic Growth & User Behavior
**Purpose:** Monitor overall website growth and user engagement

#### Key Metrics:
1. **Traffic Growth**
   - Total sessions (monthly comparison)
   - New vs returning users
   - Traffic sources breakdown
   - Geographic expansion

2. **User Engagement**
   - Average session duration
   - Pages per session
   - Bounce rate by source
   - User flow through site

3. **Content Performance**
   - Most popular pages
   - Content engagement metrics
   - Exit pages analysis

#### Dashboard Widgets:
1. **Traffic Growth Trend** (Line chart, sessions over time)
2. **Traffic Sources** (Pie chart, all sources)
3. **User Engagement Metrics** (KPI cards)
4. **Top Content** (Table, by sessions)
5. **User Flow** (Sankey diagram)

---

### Dashboard 3: Lead Generation & Conversion Tracking
**Purpose:** Track lead generation performance and conversion funnels

#### Key Metrics:
1. **Lead Generation**
   - Form submissions by type
   - Lead sources and attribution
   - Conversion rates by page
   - Lead quality scoring

2. **Conversion Funnels**
   - Newsletter signups
   - Consultation requests
   - Cost calculator usage
   - Surgeon profile views

3. **Lead Attribution**
   - Which pages generate most leads
   - Form completion rates
   - Lead source performance

#### Custom Events to Track:
```javascript
// Lead Generation Events
gtag('event', 'newsletter_signup', {
  'event_category': 'Lead Generation',
  'event_label': 'Newsletter Form',
  'value': 1
});

gtag('event', 'consultation_request', {
  'event_category': 'Lead Generation',
  'event_label': 'Consultation Form',
  'value': 5
});

gtag('event', 'cost_calculator_complete', {
  'event_category': 'Lead Generation',
  'event_label': 'Cost Calculator',
  'value': 3
});

gtag('event', 'surgeon_profile_view', {
  'event_category': 'Lead Generation',
  'event_label': 'Surgeon Profile',
  'value': 2
});
```

#### Dashboard Widgets:
1. **Lead Generation Trend** (Line chart, leads over time)
2. **Lead Sources** (Table, by source and type)
3. **Conversion Funnel** (Funnel visualization)
4. **Form Performance** (Table, completion rates)
5. **Lead Quality Score** (KPI cards)

---

### Dashboard 4: Conversion Rates & ROI
**Purpose:** Track conversion rates and return on investment

#### Key Metrics:
1. **Conversion Rates**
   - Overall site conversion rate
   - Conversion by traffic source
   - Conversion by page type
   - Mobile vs desktop conversion

2. **Revenue Attribution**
   - Cost per lead by source
   - Lead value by source
   - ROI by marketing channel
   - Customer lifetime value

3. **Performance Optimization**
   - A/B test results
   - Page speed impact on conversion
   - User experience metrics
   - Technical performance

#### Dashboard Widgets:
1. **Conversion Rate Trend** (Line chart, over time)
2. **Source Performance** (Table, conversion by source)
3. **ROI Analysis** (KPI cards)
4. **A/B Test Results** (Comparison charts)
5. **Technical Performance** (Speed and UX metrics)

---

## 🔧 Implementation Steps

### Step 1: Enhanced GA4 Configuration

Add to your existing GA4 setup in `BaseLayout.astro`:

```javascript
// Enhanced GA4 Configuration
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
  },
  
  // Custom Parameters
  'custom_map': {
    'custom_parameter_1': 'page_category',
    'custom_parameter_2': 'content_type',
    'custom_parameter_3': 'target_keyword'
  }
});
```

### Step 2: Custom Events Implementation

Add these event tracking scripts to your forms and key pages:

```javascript
// Newsletter Form Tracking
document.addEventListener('DOMContentLoaded', function() {
  const newsletterForms = document.querySelectorAll('[data-form-type="newsletter"]');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', function() {
      gtag('event', 'newsletter_signup', {
        'event_category': 'Lead Generation',
        'event_label': form.dataset.source || 'Unknown',
        'value': 1
      });
    });
  });
});

// Consultation Form Tracking
const consultationForms = document.querySelectorAll('[data-form-type="consultation"]');
consultationForms.forEach(form => {
  form.addEventListener('submit', function() {
    gtag('event', 'consultation_request', {
      'event_category': 'Lead Generation',
      'event_label': form.dataset.surgeon || 'General',
      'value': 5
    });
  });
});

// Cost Calculator Tracking
const costCalculator = document.getElementById('cost-calculator');
if (costCalculator) {
  costCalculator.addEventListener('submit', function() {
    gtag('event', 'cost_calculator_complete', {
      'event_category': 'Lead Generation',
      'event_label': 'Cost Calculator',
      'value': 3
    });
  });
}
```

### Step 3: Search Console Integration

1. **Link Search Console to GA4:**
   - Go to GA4 → Admin → Property Settings
   - Click "Search Console Links"
   - Add your Search Console property
   - This enables ranking position data in GA4

2. **Import Search Console Data:**
   - Go to GA4 → Explore → Create new exploration
   - Select "Search Console" as data source
   - Create reports for keyword rankings and CTR

### Step 4: Custom Dimensions Setup

In GA4 Admin → Custom Definitions → Custom Dimensions:

1. **Page Category**
   - Dimension name: Page Category
   - Scope: Event
   - Description: Categorizes pages (procedures, surgeons, costs, blog)

2. **Content Type**
   - Dimension name: Content Type
   - Scope: Event
   - Description: Type of content (landing page, blog post, surgeon profile)

3. **Target Keyword**
   - Dimension name: Target Keyword
   - Scope: Event
   - Description: Primary keyword for the page

4. **Lead Source**
   - Dimension name: Lead Source
   - Scope: Event
   - Description: Source of lead generation

### Step 5: Conversion Goals Setup

In GA4 Admin → Events → Mark as conversion:

1. **Newsletter Signup** (Value: 1)
2. **Consultation Request** (Value: 5)
3. **Cost Calculator Complete** (Value: 3)
4. **Surgeon Profile View** (Value: 2)
5. **Phone Number Click** (Value: 4)

---

## 📊 Dashboard Creation Guide

### Creating the Dashboards in GA4:

1. **Go to GA4 → Explore**
2. **Click "Create new exploration"**
3. **Select "Free form"**
4. **Configure each dashboard as follows:**

#### Dashboard 1: SEO Performance
- **Dimensions:** Date, Page title, Source/Medium, Country
- **Metrics:** Sessions, Users, Bounce rate, Average session duration
- **Filters:** Source/Medium = "google / organic"
- **Visualization:** Table and line charts

#### Dashboard 2: Traffic Growth
- **Dimensions:** Date, Source/Medium, Device category, Country
- **Metrics:** Sessions, Users, New users, Sessions per user
- **Filters:** None (all traffic)
- **Visualization:** Line charts and pie charts

#### Dashboard 3: Lead Generation
- **Dimensions:** Date, Event name, Page title, Source/Medium
- **Metrics:** Event count, Conversions, Conversion rate
- **Filters:** Event name contains "newsletter_signup" OR "consultation_request"
- **Visualization:** Funnel and table

#### Dashboard 4: Conversion Rates
- **Dimensions:** Date, Source/Medium, Device category, Page title
- **Metrics:** Sessions, Conversions, Conversion rate, Revenue
- **Filters:** None (all traffic)
- **Visualization:** KPI cards and comparison charts

---

## 🎯 Key Performance Indicators (KPIs)

### SEO Performance KPIs:
- **Organic Traffic Growth:** +20% month-over-month
- **Average Ranking Position:** Top 10 for target keywords
- **Click-Through Rate:** >3% from search results
- **Organic Conversion Rate:** >2%

### Traffic Growth KPIs:
- **Total Sessions:** +15% month-over-month
- **New User Percentage:** 60-70%
- **Average Session Duration:** >2 minutes
- **Pages per Session:** >3

### Lead Generation KPIs:
- **Total Leads:** +25% month-over-month
- **Lead Quality Score:** >7/10
- **Cost per Lead:** <$50
- **Lead to Consultation Rate:** >15%

### Conversion Rate KPIs:
- **Overall Conversion Rate:** >3%
- **Mobile Conversion Rate:** >2%
- **Form Completion Rate:** >80%
- **Return on Investment:** >300%

---

## 📈 Monthly Reporting Template

### Executive Summary:
- Total traffic growth
- Lead generation performance
- Top performing content
- Key optimization opportunities

### Detailed Metrics:
- Traffic sources breakdown
- Conversion funnel analysis
- Geographic performance
- Device performance
- Content performance

### Action Items:
- High-performing content to promote
- Underperforming pages to optimize
- New content opportunities
- Technical improvements needed

---

## 🔍 Advanced Tracking Features

### 1. Enhanced Ecommerce for Lead Value
```javascript
// Track lead value as revenue
gtag('event', 'purchase', {
  'transaction_id': 'lead_' + Date.now(),
  'value': leadValue,
  'currency': 'AUD',
  'items': [{
    'item_id': 'consultation_request',
    'item_name': 'Consultation Request',
    'category': 'Lead Generation',
    'quantity': 1,
    'price': leadValue
  }]
});
```

### 2. User Journey Tracking
```javascript
// Track user journey through site
gtag('event', 'page_view', {
  'page_title': document.title,
  'page_location': window.location.href,
  'page_category': getPageCategory(),
  'content_type': getContentType(),
  'target_keyword': getTargetKeyword()
});
```

### 3. A/B Testing Integration
```javascript
// Track A/B test variations
gtag('event', 'ab_test_view', {
  'experiment_id': 'newsletter_form_test',
  'variant_id': 'variant_a',
  'event_category': 'A/B Testing'
});
```

---

## 🚀 Next Steps

1. **Implement the enhanced GA4 configuration**
2. **Set up custom dimensions and events**
3. **Create the four dashboards in GA4**
4. **Link Search Console for ranking data**
5. **Set up conversion goals**
6. **Create monthly reporting schedule**
7. **Train team on dashboard usage**

This comprehensive setup will give you complete visibility into your website's performance, lead generation, and conversion optimization opportunities.
