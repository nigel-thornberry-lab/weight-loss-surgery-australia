# GA4 Dashboard Implementation Guide

**Complete step-by-step guide to set up comprehensive GA4 dashboards for your weight loss surgery website**

---

## 🚀 Quick Start (30 minutes to full setup)

### Step 1: Update Your GA4 Configuration (5 minutes)

Replace your existing GA4 code in `src/layouts/BaseLayout.astro` with the enhanced version:

```javascript
<!-- Enhanced GA4 Configuration -->
<script is:inline>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  
  // Defer GA4 loading until user interaction or after page load
  let gaLoaded = false;
  function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;
    
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-GGQF9749LT';
    script.onload = function() {
      gtag('js', new Date());
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
    };
    document.head.appendChild(script);
  }
  
  // Load GA on first user interaction
  ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, loadGA, { once: true, passive: true });
  });
  
  // Fallback: load GA after 3 seconds if no interaction
  setTimeout(loadGA, 3000);
</script>
```

### Step 2: Add Enhanced Tracking Code (10 minutes)

Add this script to your `BaseLayout.astro` before the closing `</body>` tag:

```html
<!-- Enhanced GA4 Tracking -->
<script src="/js/ga4-enhanced-tracking.js" defer></script>
```

Then create the file `public/js/ga4-enhanced-tracking.js` with the content from `GA4-ENHANCED-TRACKING-CODE.js`.

### Step 3: Set Up Custom Dimensions in GA4 (10 minutes)

1. **Go to GA4 → Admin → Custom Definitions → Custom Dimensions**
2. **Click "Create custom dimensions"**
3. **Add these 4 dimensions:**

#### Dimension 1: Page Category
- **Dimension name:** Page Category
- **Scope:** Event
- **Description:** Categorizes pages (procedures, surgeons, costs, blog)
- **Event parameter:** page_category

#### Dimension 2: Content Type
- **Dimension name:** Content Type
- **Scope:** Event
- **Description:** Type of content (landing page, blog post, surgeon profile)
- **Event parameter:** content_type

#### Dimension 3: Target Keyword
- **Dimension name:** Target Keyword
- **Scope:** Event
- **Description:** Primary keyword for the page
- **Event parameter:** target_keyword

#### Dimension 4: Lead Source
- **Dimension name:** Lead Source
- **Scope:** Event
- **Description:** Source of lead generation
- **Event parameter:** lead_source

### Step 4: Set Up Conversion Goals (5 minutes)

1. **Go to GA4 → Admin → Events**
2. **Click "Create event"**
3. **Add these conversion events:**

#### Conversion 1: Newsletter Signup
- **Event name:** newsletter_signup
- **Mark as conversion:** Yes
- **Value:** 1

#### Conversion 2: Consultation Request
- **Event name:** consultation_request
- **Mark as conversion:** Yes
- **Value:** 5

#### Conversion 3: Cost Calculator Complete
- **Event name:** cost_calculator_complete
- **Mark as conversion:** Yes
- **Value:** 3

#### Conversion 4: Phone Click
- **Event name:** phone_click
- **Mark as conversion:** Yes
- **Value:** 4

---

## 📊 Dashboard Creation (15 minutes)

### Dashboard 1: SEO Performance & Rankings

1. **Go to GA4 → Explore → Create new exploration**
2. **Select "Free form"**
3. **Configure as follows:**

#### Dimensions:
- Date
- Page title
- Source/Medium
- Country
- Page Category (custom dimension)

#### Metrics:
- Sessions
- Users
- Bounce rate
- Average session duration
- Conversions

#### Filters:
- Source/Medium = "google / organic"

#### Visualization:
- **Widget 1:** Line chart - Organic Traffic Trend (last 12 months)
- **Widget 2:** Table - Top Organic Keywords (top 20)
- **Widget 3:** Table - Landing Page Performance (organic traffic only)
- **Widget 4:** Map - Geographic Distribution (organic traffic)
- **Widget 5:** Pie chart - Device Performance (organic traffic)

### Dashboard 2: Traffic Growth & User Behavior

1. **Create new exploration → Free form**

#### Dimensions:
- Date
- Source/Medium
- Device category
- Country
- Page Category

#### Metrics:
- Sessions
- Users
- New users
- Sessions per user
- Average session duration

#### Filters:
- None (all traffic)

#### Visualization:
- **Widget 1:** Line chart - Traffic Growth Trend
- **Widget 2:** Pie chart - Traffic Sources
- **Widget 3:** KPI cards - User Engagement Metrics
- **Widget 4:** Table - Top Content by Sessions
- **Widget 5:** Sankey diagram - User Flow

### Dashboard 3: Lead Generation & Conversion

1. **Create new exploration → Free form**

#### Dimensions:
- Date
- Event name
- Page title
- Source/Medium
- Lead Source (custom dimension)

#### Metrics:
- Event count
- Conversions
- Conversion rate
- Total revenue

#### Filters:
- Event name contains "newsletter_signup" OR "consultation_request" OR "cost_calculator_complete"

#### Visualization:
- **Widget 1:** Line chart - Lead Generation Trend
- **Widget 2:** Table - Lead Sources Performance
- **Widget 3:** Funnel - Conversion Funnel
- **Widget 4:** Table - Form Performance
- **Widget 5:** KPI cards - Lead Quality Score

### Dashboard 4: Conversion Rates & ROI

1. **Create new exploration → Free form**

#### Dimensions:
- Date
- Source/Medium
- Device category
- Page title
- Page Category

#### Metrics:
- Sessions
- Conversions
- Conversion rate
- Revenue
- Cost per conversion

#### Filters:
- None (all traffic)

#### Visualization:
- **Widget 1:** Line chart - Conversion Rate Trend
- **Widget 2:** Table - Source Performance
- **Widget 3:** KPI cards - ROI Analysis
- **Widget 4:** Comparison charts - A/B Test Results
- **Widget 5:** Table - Technical Performance

---

## 🔗 Search Console Integration

### Link Search Console to GA4:

1. **Go to GA4 → Admin → Property Settings**
2. **Click "Search Console Links"**
3. **Click "Link"**
4. **Select your Search Console property**
5. **Click "Confirm"**

### Import Search Console Data:

1. **Go to GA4 → Explore → Create new exploration**
2. **Select "Search Console" as data source**
3. **Create reports for:**
   - Keyword rankings
   - Click-through rates
   - Search impressions
   - Average position

---

## 📈 Monthly Reporting Setup

### Automated Reports:

1. **Go to GA4 → Library → Create new report**
2. **Set up monthly email reports for:**
   - Executive summary
   - Traffic performance
   - Lead generation
   - Conversion analysis

### Key Metrics to Monitor:

#### SEO Performance:
- Organic traffic growth (+20% month-over-month)
- Average ranking position (top 10 for target keywords)
- Click-through rate (>3% from search results)
- Organic conversion rate (>2%)

#### Traffic Growth:
- Total sessions (+15% month-over-month)
- New user percentage (60-70%)
- Average session duration (>2 minutes)
- Pages per session (>3)

#### Lead Generation:
- Total leads (+25% month-over-month)
- Lead quality score (>7/10)
- Cost per lead (<$50)
- Lead to consultation rate (>15%)

#### Conversion Rates:
- Overall conversion rate (>3%)
- Mobile conversion rate (>2%)
- Form completion rate (>80%)
- Return on investment (>300%)

---

## 🎯 Advanced Features

### 1. Custom Audiences

Create audiences for:
- High-intent users (visited cost calculator)
- Surgeon profile viewers
- Newsletter subscribers
- Mobile users
- Geographic segments

### 2. Enhanced Ecommerce

Set up lead value tracking:
- Newsletter signup: $1
- Cost calculator: $3
- Phone click: $4
- Consultation request: $5

### 3. A/B Testing Integration

Track A/B test performance:
- Form variations
- CTA button tests
- Page layout tests
- Content variations

### 4. Real-time Monitoring

Set up real-time alerts for:
- Traffic spikes
- Conversion drops
- Technical issues
- Lead generation anomalies

---

## 📱 Mobile Optimization Tracking

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

## 🔍 Troubleshooting

### Common Issues:

1. **Events not showing up:**
   - Check custom dimensions are set up
   - Verify event names match exactly
   - Wait 24-48 hours for data to appear

2. **Conversion goals not tracking:**
   - Ensure events are marked as conversions
   - Check event parameters are correct
   - Verify tracking code is firing

3. **Search Console not linking:**
   - Ensure same Google account for both
   - Verify Search Console property is verified
   - Check domain matches exactly

4. **Custom dimensions not working:**
   - Verify parameter names match
   - Check scope is set correctly
   - Ensure data is being sent

### Testing Your Setup:

1. **Use GA4 Debug View:**
   - Go to GA4 → Configure → DebugView
   - Test events in real-time
   - Verify all parameters are firing

2. **Use Google Tag Assistant:**
   - Install Chrome extension
   - Test your website
   - Verify all tags are firing

3. **Check Real-time Reports:**
   - Go to GA4 → Reports → Realtime
   - Test user actions
   - Verify events are tracking

---

## 📊 Dashboard Templates

### Executive Dashboard:
- Key performance indicators
- Traffic growth trends
- Lead generation summary
- Conversion rate overview
- Top performing content

### Marketing Dashboard:
- Traffic sources performance
- Campaign effectiveness
- Lead attribution
- Cost per acquisition
- Return on investment

### Content Dashboard:
- Top performing pages
- Content engagement metrics
- User journey analysis
- Content optimization opportunities
- SEO performance

### Lead Generation Dashboard:
- Lead sources breakdown
- Form performance
- Conversion funnel
- Lead quality metrics
- Follow-up effectiveness

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
