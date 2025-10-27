oka# Simple AI Email System PRD
## Form-Based Segmentation for BariatricSurgeryHub

**Document Version:** 1.0 - Simplified
**Date:** October 27, 2025
**Implementation Time:** 1-2 weeks (vs 12 weeks for full system)
**Complexity:** LOW - Perfect for getting started

---

## 🎯 The Simple Version

### Core Concept
**Different lead forms = Different interests = Different email sequences**

Instead of tracking 20+ data points, we simply segment based on **which form the person filled out**. This tells us their primary interest and we nurture them accordingly.

### Why This Works
- ✅ **Simple to implement** - No complex behavioral tracking
- ✅ **High relevance** - Form choice reveals intent
- ✅ **Easy to maintain** - One sequence per form
- ✅ **Quick wins** - Launch in days, not months
- ✅ **Scalable** - Add more forms/sequences as you grow

---

## 📝 Your Lead Forms (Segments)

### Form 1: Cost Calculator
**URL:** `/cost-calculator`
**Intent:** Price-conscious, early research stage
**Tag in Drip:** `calculator_user`

**What They Want:**
- Cost breakdowns
- Financing options
- Insurance info
- "How to afford it" content

### Form 2: Surgeon Selection Checklist
**URL:** `/surgeon-selection-checklist`
**Intent:** Researching surgeons, middle stage
**Tag in Drip:** `surgeon_researcher`

**What They Want:**
- Surgeon credentials
- How to evaluate surgeons
- Questions to ask
- Surgeon directory access

### Form 3: Am I Ready Quiz
**URL:** `/am-i-ready`
**Intent:** Considering readiness, could be any stage
**Tag in Drip:** `readiness_quiz`

**What They Want:**
- Eligibility information
- Preparation guidance
- Success stories
- Next steps clarity

### Form 4: Contact/Consultation Request
**URL:** `/contact`
**Intent:** High-intent, ready to talk
**Tag in Drip:** `consultation_request`

**What They Want:**
- Fast response
- Booking confirmation
- What to expect
- Preparation for consultation

### Form 5: General Newsletter Signup
**URL:** Footer, popups, etc.
**Intent:** General interest, early stage
**Tag in Drip:** `newsletter_subscriber`

**What They Want:**
- Educational content
- Weekly updates
- Procedure information
- General guidance

---

## 📧 Email Sequences by Form

### Sequence 1: Cost Calculator Users (7 emails)

**Email 1: Immediate (after form submission)**
```
Subject: "Your Cost Calculation + How to Make It Affordable"
Content:
- Thank them for using calculator
- Quick cost summary
- "Here's how most people afford it"
- Introduce financing options
CTA: "Book free cost consultation"
```

**Email 2: Day 2**
```
Subject: "3 Ways to Reduce Your Out-of-Pocket Costs"
Content:
- Medicare rebates explained
- Insurance optimization tips
- Superannuation early release
CTA: "Download full financing guide"
```

**Email 3: Day 4**
```
Subject: "Real Patients: How They Paid for Surgery"
Content:
- 3 patient stories with different payment methods
- Budget-friendly options
- Payment plans explained
CTA: "See all payment options"
```

**Email 4: Day 7**
```
Subject: "Is Cost Your Only Concern? Let's Talk Value"
Content:
- Long-term savings (medications, health costs)
- Quality of life ROI
- Cost of NOT having surgery
CTA: "Calculate your lifetime savings"
```

**Email 5: Day 10**
```
Subject: "Compare Surgeons by Price (And Why That's Not Enough)"
Content:
- Price ranges by surgeon
- What you're actually paying for
- Red flags with cheap surgeons
CTA: "View surgeon directory"
```

**Email 6: Day 14**
```
Subject: "Special: Free Cost Consultation This Week"
Content:
- Limited consultation slots
- Personalized cost breakdown
- Financial planning help
CTA: "Book your consultation" (urgency)
```

**Email 7: Day 21**
```
Subject: "Don't Let Cost Stop You - Here's Why"
Content:
- Success story of someone who almost didn't proceed due to cost
- Creative financing solutions
- Final push to book consultation
CTA: "Let's find a way to make this work"
```

---

### Sequence 2: Surgeon Checklist Users (7 emails)

**Email 1: Immediate**
```
Subject: "Your Surgeon Selection Checklist + How to Use It"
Content:
- Thank them, confirm download
- How to use the checklist
- What to look for in consultations
CTA: "View AHPRA-registered surgeons"
```

**Email 2: Day 2**
```
Subject: "The 5 Must-Have Surgeon Credentials (Don't Skip These)"
Content:
- AHPRA registration
- Fellowship training
- Annual procedure volume
- Complication rates
- Hospital affiliations
CTA: "See surgeon credentials guide"
```

**Email 3: Day 5**
```
Subject: "Red Flags: When to Walk Away from a Surgeon"
Content:
- 10 warning signs
- What legitimate surgeons never say
- Pressure tactics to avoid
CTA: "Read full red flags guide"
```

**Email 4: Day 8**
```
Subject: "Meet Dr. [Surgeon Name]: Surgeon Spotlight"
Content:
- Feature one of your partner surgeons
- Credentials, experience, philosophy
- Patient testimonials
CTA: "Book consultation with Dr. [Name]"
```

**Email 5: Day 12**
```
Subject: "Questions to Ask in Your Surgeon Consultation"
Content:
- 15 essential questions
- What their answers should include
- How to compare responses
CTA: "Download question list"
```

**Email 6: Day 16**
```
Subject: "Sydney vs Melbourne vs Brisbane: Where to Have Surgery?"
Content:
- Surgeon availability by city
- Travel considerations
- Local support resources
CTA: "Find surgeons near you"
```

**Email 7: Day 21**
```
Subject: "Ready to Meet Your Surgeon? Book a Consultation"
Content:
- You've done the research
- Time to take action
- What happens in consultation
CTA: "Book consultation now"
```

---

### Sequence 3: Readiness Quiz Users (6 emails)

**Email 1: Immediate**
```
Subject: "Your Readiness Results + What They Mean"
Content:
- Personalized results summary
- What readiness means
- Next steps based on their score
CTA: "Read full readiness guide"
```

**Email 2: Day 3**
```
Subject: "Are You Eligible? BMI, Health, and Other Criteria"
Content:
- Eligibility requirements
- BMI calculator
- Health conditions that qualify
CTA: "Check your full eligibility"
```

**Email 3: Day 6**
```
Subject: "What If You're Not Ready Yet? Here's What to Do"
Content:
- How to prepare
- Pre-surgery weight loss
- Mental health considerations
CTA: "Download preparation guide"
```

**Email 4: Day 10**
```
Subject: "Real Talk: Are You Really Ready for This?"
Content:
- Honest assessment questions
- Lifestyle changes required
- Long-term commitment
CTA: "Retake readiness quiz"
```

**Email 5: Day 14**
```
Subject: "From 'Am I Ready?' to 'I'm Ready!' - Patient Stories"
Content:
- Stories of people who took the leap
- How they knew they were ready
- What happened after
CTA: "Start your journey"
```

**Email 6: Day 21**
```
Subject: "If You're Still Reading These, You're Probably Ready"
Content:
- Gentle push
- Summary of journey so far
- Clear next step
CTA: "Book consultation"
```

---

### Sequence 4: Consultation Requests (3 emails)

**Email 1: Immediate**
```
Subject: "Consultation Confirmed - Here's What to Expect"
Content:
- Confirmation details
- What to bring
- Questions to prepare
- What happens next
CTA: "Add to calendar"
```

**Email 2: 1 Day Before Consultation**
```
Subject: "Tomorrow: Your Consultation Prep Checklist"
Content:
- Final reminders
- Documents needed
- Questions to ask
- Location/timing details
CTA: "View preparation checklist"
```

**Email 3: 1 Day After Consultation**
```
Subject: "Following Up: Next Steps After Your Consultation"
Content:
- Thank them for attending
- Common next steps
- Decision-making guidance
- How to proceed if interested
CTA: "Schedule surgery" or "Have more questions? Book follow-up"
```

---

### Sequence 5: General Newsletter (Ongoing)

**Weekly Email (Every Thursday 9am)**
```
Subject: Varies - educational topics
Content:
- Procedure guides
- Success stories
- Cost information
- Surgeon spotlights
- Myth-busting
CTA: Varies based on topic
```

**Rotate Through Topics:**
- Week 1: Procedure deep-dive
- Week 2: Cost & financing
- Week 3: Success story
- Week 4: Surgeon selection
- Repeat

---

## 🛠️ Simple Implementation

### Step 1: Set Up Forms in Drip (1 hour)

**For Each Form on Your Site:**

1. **Create Drip Form**
   - Go to Drip → Forms → Create New Form
   - Name: "Cost Calculator Form"
   - Style: Embed or API

2. **Add Tag Automation**
   - When someone submits → Add tag: `calculator_user`
   - Remove from other sequences if needed

3. **Embed Form on Your Site**
   ```html
   <!-- Cost Calculator Page -->
   <div id="drip-form"></div>
   <script src="https://www.drip.com/embed-form.js"></script>
   ```

4. **Test Submission**
   - Fill out your own form
   - Verify tag applied in Drip
   - Check email received

**Repeat for all 5 forms**

---

### Step 2: Create Email Sequences (2-3 hours per sequence)

**Using Your AI Email Generator:**

```
In Claude Code:

"Generate Email 1 of the Cost Calculator sequence:

Subject: Your Cost Calculation + How to Make It Affordable

Content should:
- Thank them for using the calculator
- Quick cost summary (use liquid tag {{cost_estimate}} if available)
- Explain 3 main ways people afford surgery: insurance, payment plans, super
- Empathetic tone about cost concerns
- CTA to book free cost consultation

Segment: calculator_user
Brand: BariatricSurgeryHub
Template: Educational"
```

**AI Generates Complete Email in 60 Seconds**

**Then:**
1. Review for accuracy
2. Copy HTML
3. Go to Drip → Campaigns → Create Campaign
4. Choose "Email Series"
5. Paste HTML
6. Set trigger: Tag = `calculator_user`
7. Set timing: Immediate (or Day 2, Day 4, etc.)
8. Activate

**Repeat for all 7 emails in sequence**

---

### Step 3: Set Up Workflows in Drip (30 min per form)

**Example: Cost Calculator Workflow**

```
Trigger: Tag "calculator_user" applied
├── Wait: 0 minutes
├── Send: Email 1 "Your Cost Calculation"
├── Wait: 2 days
├── Send: Email 2 "3 Ways to Reduce Costs"
├── Wait: 2 days
├── Send: Email 3 "Real Patients' Payment Stories"
├── Wait: 3 days
├── Send: Email 4 "Cost vs Value"
├── Wait: 3 days
├── Send: Email 5 "Compare Surgeons by Price"
├── Wait: 4 days
├── Send: Email 6 "Free Cost Consultation"
├── Wait: 7 days
├── Send: Email 7 "Don't Let Cost Stop You"
└── End (or move to general newsletter)
```

**Drip Automation Builder:**
1. Go to Drip → Automation → Create Workflow
2. Name: "Cost Calculator Sequence"
3. Trigger: Tag applied = `calculator_user`
4. Add email actions with delays
5. Test with yourself
6. Activate

---

### Step 4: Connect Forms to Drip (1 hour)

**Option A: Drip Native Forms (Easiest)**
```html
<!-- On your /cost-calculator page, after calculator -->
<div class="signup-section">
  <h2>Get Your Personalized Results</h2>
  <p>Enter your email to receive your cost breakdown + financing guide</p>

  <!-- Drip form embed code here -->
  <script data-drip-form="YOUR-FORM-ID"></script>
</div>
```

**Option B: Custom Forms + Drip API (More Control)**
```javascript
// After user completes calculator
async function submitToDrip(email, firstName, calculatedCost) {
  const response = await fetch('https://api.getdrip.com/v2/YOUR_ACCOUNT/subscribers', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      subscribers: [{
        email: email,
        first_name: firstName,
        tags: ['calculator_user'],
        custom_fields: {
          estimated_cost: calculatedCost,
          calculator_date: new Date().toISOString()
        }
      }]
    })
  });
}
```

**Option C: Zapier (No Code)**
1. Create Zap: Your Form → Drip
2. Trigger: Form submission
3. Action: Add subscriber to Drip with tag
4. Test and activate

---

## 📊 Simple Tracking

### Weekly Check (15 minutes)

**Questions to Answer:**
1. How many people entered each form this week?
2. What are the open rates for each sequence?
3. How many consultation bookings from email?
4. Any unsubscribes or issues?

**Drip Dashboard Shows:**
- Subscribers by tag (form)
- Email performance by sequence
- Conversions tracked

---

## 🎯 Expected Results (Simple Version)

### Month 1:
- **5 forms** set up and tagging correctly
- **5 email sequences** running automatically
- **Open rates:** 30-40% (better than general newsletters)
- **Consultation bookings:** 20-30 from email
- **Time spent:** 1-2 hours/week (vs 16+ hours manual)

### Month 3:
- **Refined sequences** based on performance data
- **A/B tested** subject lines and content
- **Email = top 3** lead sources
- **50+ consultations** booked from email
- **Documented ROI** to justify further investment

---

## 💡 Why This Works

### 1. **Self-Segmentation**
People tell you what they care about by which form they fill out
- Cost calculator = price concerns
- Surgeon checklist = vetting process
- Readiness quiz = eligibility/preparation
- Contact form = ready to act

### 2. **Relevant Content**
Each sequence speaks directly to their expressed interest
- No irrelevant emails
- Higher engagement
- Better conversion rates

### 3. **Simple to Maintain**
- No complex tracking systems
- Easy to add new forms/sequences
- Clear performance metrics
- Quick to troubleshoot

### 4. **Scales Easily**
Start with 5 forms → Add more as needed
- Add "Procedure Quiz" form → Create new sequence
- Add "Insurance Checker" form → Create new sequence
- Each form = new revenue stream

---

## 🚀 Quick Start Checklist

### Week 1: Setup
**Day 1:**
- [ ] Audit your existing forms (what do you have?)
- [ ] Create Drip account (if needed)
- [ ] Set up 5 tags in Drip

**Day 2:**
- [ ] Connect Cost Calculator form to Drip
- [ ] Test tag application

**Day 3:**
- [ ] Use AI to generate Cost Calculator sequence (7 emails)
- [ ] Create workflow in Drip

**Day 4:**
- [ ] Connect Surgeon Checklist form to Drip
- [ ] Generate and set up sequence

**Day 5:**
- [ ] Connect Readiness Quiz form to Drip
- [ ] Generate and set up sequence

**Day 6:**
- [ ] Connect Contact form to Drip
- [ ] Set up 3-email consultation sequence

**Day 7:**
- [ ] Set up general newsletter workflow
- [ ] Test all sequences with your own email
- [ ] Fix any issues

### Week 2: Launch & Monitor
**Day 8-14:**
- [ ] Activate all workflows
- [ ] Monitor first submissions
- [ ] Check email delivery
- [ ] Review first open rates
- [ ] Make any quick fixes

---

## 📋 Email Generation Prompts

### Quick Copy-Paste Prompts for Claude Code

**Cost Calculator Email:**
```
Generate email [NUMBER] for Cost Calculator sequence:

Subject: [SUBJECT FROM OUTLINE ABOVE]
Content: [CONTENT DESCRIPTION FROM OUTLINE]
Segment: calculator_user
Brand: BariatricSurgeryHub
Tone: Empathetic, helpful, cost-focused
CTA: [CTA FROM OUTLINE]
Include: Drip liquid tags for personalization
Format: HTML email with BariatricSurgeryHub styling
```

**Surgeon Checklist Email:**
```
Generate email [NUMBER] for Surgeon Checklist sequence:

Subject: [SUBJECT FROM OUTLINE ABOVE]
Content: [CONTENT DESCRIPTION FROM OUTLINE]
Segment: surgeon_researcher
Brand: BariatricSurgeryHub
Tone: Authoritative, educational, helpful
CTA: [CTA FROM OUTLINE]
Include: Medical credentials info, AHPRA references
Format: HTML email with BariatricSurgeryHub styling
```

**Readiness Quiz Email:**
```
Generate email [NUMBER] for Readiness Quiz sequence:

Subject: [SUBJECT FROM OUTLINE ABOVE]
Content: [CONTENT DESCRIPTION FROM OUTLINE]
Segment: readiness_quiz
Brand: BariatricSurgeryHub
Tone: Supportive, honest, motivating
CTA: [CTA FROM OUTLINE]
Include: Eligibility criteria, preparation tips
Format: HTML email with BariatricSurgeryHub styling
```

---

## 🎨 Simple Email Template

**Basic HTML Template for All Emails:**

```html
<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, sans-serif; background: #f3f4f6; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: #3B82F6; padding: 30px 20px; text-align: center; }
    .header img { max-width: 180px; }
    .content { padding: 40px 30px; color: #1f2937; }
    .content h1 { font-size: 24px; margin-bottom: 20px; color: #111827; }
    .content p { font-size: 16px; line-height: 1.6; margin-bottom: 16px; }
    .button { display: inline-block; background: #3B82F6; color: white !important;
              padding: 14px 32px; text-decoration: none; border-radius: 8px;
              font-weight: 600; margin: 20px 0; }
    .button:hover { background: #2563EB; }
    .footer { background: #f9fafb; padding: 30px; text-align: center;
              font-size: 14px; color: #6b7280; }
    .disclaimer { font-size: 12px; color: #9ca3af; margin-top: 20px;
                  padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <img src="https://bariatricsurgeryhub.com/logo-white.png" alt="BariatricSurgeryHub">
    </div>

    <!-- Content -->
    <div class="content">
      <h1>Hi {% if subscriber.first_name %}{{ subscriber.first_name }}{% else %}there{% endif %},</h1>

      <!-- Your email content here -->
      <p>[Email content goes here]</p>

      <a href="[YOUR_CTA_URL]" class="button">[Your CTA Text]</a>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>BariatricSurgeryHub</strong><br>
      Australia's Trusted Weight Loss Surgery Resource</p>

      <p class="disclaimer">
        <strong>Medical Disclaimer:</strong> This email provides educational information only
        and should not be considered medical advice. Always consult with qualified healthcare
        professionals before making medical decisions.
      </p>

      <p style="margin-top: 20px;">
        <a href="{{ unsubscribe_url }}" style="color: #6b7280;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 💰 Simple ROI Tracking

### Investment:
- **Drip Subscription:** ~$40/month (up to 2,500 subscribers)
- **Setup Time:** 16 hours @ $100/hr = $1,600
- **Monthly Maintenance:** 2 hours @ $100/hr = $200/month
- **Total Year 1:** ~$4,480

### Return (Conservative):
- **Consultation Bookings:** 30/month from email
- **Show-up Rate:** 70% = 21 consultations
- **Conversion Rate:** 30% = 6 surgeries
- **Average Revenue:** $8,000/surgery
- **Monthly Revenue:** $48,000
- **Annual Revenue:** $576,000

### ROI: 12,757% 🚀

Even if numbers are 50% lower = 6,357% ROI

---

## ❓ FAQ

### "Do I need coding skills?"
**No.** Use Drip's visual workflow builder + AI-generated emails. Option to code custom integrations if you want, but not required.

### "What if I don't have these exact forms?"
**Adapt the concept.** Use whatever lead magnets you have:
- Blog post downloads
- Webinar registrations
- Quiz completions
- Page visits (via tracking pixels)

### "How long until I see results?"
**Week 1:** System running
**Week 2-4:** First conversions
**Month 2:** Optimized based on data
**Month 3:** Consistent revenue stream

### "Can I start with just one form?"
**Yes!** Start with your highest-traffic form:
- Likely Cost Calculator or Contact Form
- Build one perfect sequence
- Prove ROI
- Add more forms/sequences

### "What if someone fills out multiple forms?"
**They get multiple sequences.** That's okay! More touchpoints = higher conversion. Or set rules in Drip:
- If already in sequence A, don't start sequence B
- Or pause sequence A when B starts

### "How do I know which emails to send when?"
**Test and learn:**
- Start with the cadence suggested above
- Monitor open rates (if dropping, too frequent)
- Monitor unsubscribes (red flag if >0.5%)
- Adjust timing based on YOUR data

---

## 📈 Next Level (After You Master This)

### Phase 2 Enhancements:
1. **Add Behavioral Tracking**
   - Link clicks → New sequences
   - Page visits → Trigger emails
   - Email opens → Engagement scoring

2. **Geographic Segmentation**
   - Sydney sequence vs Melbourne sequence
   - Local surgeon mentions
   - Regional support groups

3. **Procedure-Specific Sequences**
   - Gastric sleeve sequence
   - Gastric bypass sequence
   - For people who show interest in specific procedure

4. **Stage-Based Progression**
   - Move people through stages automatically
   - Early → Considering → Ready → Booked
   - Different messaging per stage

---

## ✅ Final Checklist

**Before Launch:**
- [ ] All 5 forms connected to Drip
- [ ] All 5 tags created
- [ ] All 28 emails written (5 sequences)
- [ ] All 5 workflows activated in Drip
- [ ] Test submissions completed
- [ ] Test emails received and look good
- [ ] Unsubscribe links work
- [ ] Analytics tracking set up
- [ ] Team trained on how to check results

**Week 1 After Launch:**
- [ ] Check daily: Are people being tagged correctly?
- [ ] Check daily: Are emails sending on schedule?
- [ ] Check email deliverability (inbox vs spam)
- [ ] Monitor first conversions
- [ ] Fix any bugs quickly

**Month 1 Review:**
- [ ] Review open rates by sequence
- [ ] Review click rates by sequence
- [ ] Count consultation bookings from email
- [ ] Calculate revenue attribution
- [ ] Identify winning emails
- [ ] Identify underperforming emails
- [ ] Make data-driven improvements

---

## 🎯 Success Metrics (Simple Version)

### Week 1:
- ✅ System running without errors
- ✅ First email subscribers tagged correctly
- ✅ First emails delivered successfully

### Month 1:
- 🎯 100+ people in email sequences
- 🎯 35%+ average open rate
- 🎯 20+ consultation bookings from email
- 🎯 $10k+ revenue attributed

### Month 3:
- 🎯 500+ people in email sequences
- 🎯 40%+ average open rate
- 🎯 50+ consultation bookings from email
- 🎯 $40k+ revenue attributed
- 🎯 Email = Top 3 lead source

---

**This simple version gets you 80% of the results with 20% of the complexity.**

Start here. Master it. Then expand.

**Ready to implement? Start with Week 1, Day 1 checklist above.** 🚀
