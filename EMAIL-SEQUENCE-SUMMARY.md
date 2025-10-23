# Email Nurture Sequence — Implementation Summary

## Overview

Complete 7-email nurture sequence for quiz/form submitters, designed to educate, build trust, and guide prospective patients through their decision-making journey.

**Created**: October 2025  
**Compliance**: AHPRA-compliant, based on Content Agent Master Prompt  
**Tone**: Empathetic, honest, non-judgmental, Australian-focused

---

## Sequence Architecture

### Email 1: "You're Not Alone" Welcome
- **Timing**: Immediate (triggered on form submission)
- **Subject**: "You're not alone in this (and what's next)"
- **Theme**: Validation, normalizing the journey, expectation-setting
- **Key Message**: Research takes time; you're in the right place
- **Links**: `/am-i-ready`, `/common-fears`, `/faq`
- **File**: `EMAIL-01-WELCOME.md`

---

### Email 2: What to Expect — The Real Timeline
- **Timing**: Day 2 (48 hours after submission)
- **Subject**: "Here's what actually happens (week by week)"
- **Theme**: Realistic expectations, journey phases, balanced information
- **Key Message**: Four phases from decision to lifelong maintenance; includes challenges and risks
- **Links**: `/blog/gastric-sleeve-recovery-week-by-week`, `/common-fears`
- **File**: `EMAIL-02-WHAT-TO-EXPECT.md`

---

### Email 3: Let's Talk Money
- **Timing**: Day 5
- **Subject**: "How much it costs (and how people pay for it)"
- **Theme**: Cost transparency, financing pathways, reducing financial anxiety
- **Key Message**: Real costs ($15k-$25k+), hidden expenses, Medicare, superannuation, payment plans
- **Links**: `/cost-calculator`, `/costs/superannuation-release`
- **File**: `EMAIL-03-COSTS-FINANCING.md`

---

### Email 4: The Part That Heals Slower
- **Timing**: Day 8
- **Subject**: "Surgery changes your stomach, not your mind"
- **Theme**: Mental health preparation, emotional readiness, psychological expectations
- **Key Message**: Emotional adjustment takes longer than physical healing; preparation is critical
- **Links**: `/am-i-ready`, `/surgeon-selection-checklist`
- **File**: `EMAIL-04-MENTAL-HEALTH.md`

---

### Email 5: How to Choose a Surgeon
- **Timing**: Day 12
- **Subject**: "Not all surgeons are equal (what to look for)"
- **Theme**: Surgeon selection criteria, red flags, credentials, questions to ask
- **Key Message**: FRACS qualification, experience, comprehensive programs; trust your gut
- **Links**: `/surgeons`, `/surgeon-selection-checklist`
- **File**: `EMAIL-05-CHOOSING-SURGEON.md`

---

### Email 6: Your Questions Answered
- **Timing**: Day 16
- **Subject**: "The questions everyone asks (honest answers)"
- **Theme**: FAQ, myth-busting, addressing objections
- **Key Message**: Honest answers to common questions (alcohol, hair loss, pregnancy, reversal, etc.)
- **Links**: `/faq`, `/compare/gastric-sleeve-vs-gastric-bypass`, `/compare/surgery-vs-medication`
- **File**: `EMAIL-06-FAQS.md`

---

### Email 7: Are You Ready?
- **Timing**: Day 21
- **Subject**: "Ready for a consultation? (Here's how to know)"
- **Theme**: Decision readiness, next steps, multiple path validation
- **Key Message**: Self-assessment framework; clear next steps whether ready, waiting, or declining
- **Links**: `/surgeons`, `/surgeon-selection-checklist`, `/cost-calculator`, `/am-i-ready`, `/blog`, location pages, `/contact`
- **File**: `EMAIL-07-READY-CONSULTATION.md`

---

## Compliance Summary

### ✅ AHPRA Compliance Confirmed

Every email in this sequence adheres to:

- **No testimonials or patient stories**: Uses aggregate data only
- **No guarantees or "safe" claims**: Honest about risks and variability
- **Balanced information**: Risks, challenges, and downsides in every email
- **General information disclaimers**: Included where appropriate
- **No superiority claims**: Avoids "best," "leading," comparative claims
- **No inducements**: No special offers or pressure tactics
- **Australian context**: Medicare, superannuation, FRACS, AHPRA, AU costs
- **Professional referral**: Encourages consultation with qualified health professionals
- **No pressure tactics**: Validates waiting or choosing alternative paths

---

## Content Strategy

### Psychological Journey Mapping

**Emails 1-2 (Days 0-2): Awareness → Interest**
- Normalize the journey
- Set realistic expectations
- Build trust through honesty

**Emails 3-4 (Days 5-8): Interest → Consideration**
- Remove barriers (cost, mental health concerns)
- Provide practical information
- Acknowledge emotional complexity

**Emails 5-6 (Days 12-16): Consideration → Intent**
- Empower with selection criteria
- Answer lingering questions
- Build confidence in decision-making

**Email 7 (Day 21): Intent → Action (or Informed Pause)**
- Provide decision framework
- Validate all outcomes
- Clear next steps for every path

---

## Tone & Voice

### Core Principles

**BE:**
- ✅ Empathetic without being patronizing
- ✅ Honest (including unglamorous details)
- ✅ Validating (of past struggles and current fears)
- ✅ Conversational (like a supportive friend)
- ✅ Evidence-based but accessible

**AVOID:**
- ❌ Medical jargon without explanation
- ❌ Toxic positivity or "life is perfect now" messaging
- ❌ Dismissing concerns or fears
- ❌ Shame-inducing language
- ❌ Pressure tactics or FOMO
- ❌ Hiding downsides

---

## Technical Specifications

### Each Email Includes

1. **Metadata**: Number, timing, theme, funnel stage, goal
2. **Subject Line**: 45-50 characters, compelling and empathetic
3. **Preview Text**: 85-100 characters, complements subject
4. **Body Copy**: 800-2,000 words, scannable, Australian English
5. **Single Primary CTA**: With 1-2 secondary CTAs
6. **Internal Links**: 2-4 relevant site pages
7. **Disclaimers**: Where appropriate (medical, financial, etc.)
8. **Compliance Checklist**: Binary confirmation of AHPRA adherence
9. **CTA Analysis**: Strategic reasoning for link choices
10. **Tone Notes**: Guidance on emotional temperature and techniques
11. **A/B Test Variations**: Alternative subject/preview text
12. **Editor Notes**: Context, assumptions, future optimization ideas

---

## Implementation Checklist

### To Deploy This Sequence

- [ ] Import email content into email marketing platform (Mailchimp, ConvertKit, etc.)
- [ ] Set up automation triggers (form submission → Email 1)
- [ ] Configure send delays (Day 2, 5, 8, 12, 16, 21)
- [ ] Test all internal links for accuracy
- [ ] Ensure unsubscribe functionality works
- [ ] Create email templates matching brand design
- [ ] Set up tracking (open rates, click rates, conversion rates)
- [ ] Create segments for re-engagement (e.g., opened all but didn't book)
- [ ] Configure email 7 to unsubscribe from nurture sequence but optionally keep on newsletter
- [ ] Test full sequence end-to-end before launching

---

## Success Metrics to Track

### Email Performance

**Engagement Metrics:**
- Open rate by email (benchmark: 20-30% for nurture sequences)
- Click-through rate (benchmark: 2-5%)
- Unsubscribe rate (should stay under 1% per email)

**Behavioral Metrics:**
- Which CTAs get clicked most (indicates pain points/interests)
- Read-through rate (Email 1 → Email 7)
- Time between email 1 and consultation booking

**Conversion Metrics:**
- Consultation booking rate (primary goal)
- Cost calculator usage (indicates financial concern)
- Readiness assessment completion (indicates evaluation phase)
- Surgeon directory views (indicates decision intent)

---

## Optimization Opportunities

### A/B Test Candidates

1. **Subject lines**: Test emotional vs. informational framing
2. **Send timing**: Test 3-day vs. 4-day intervals
3. **Email length**: Test current length vs. shorter versions
4. **CTA placement**: Test single CTA vs. multiple CTAs
5. **Tone**: Test current empathetic approach vs. more clinical approach

### Content Expansion Ideas

**Supplementary Emails** (if reader doesn't engage):
- "Still thinking it over?" (14 days after Email 7)
- "What's holding you back?" survey email
- Success milestone content for those who book

**Advanced Segmentation:**
- Procedure-specific sequences (sleeve vs. bypass)
- Location-specific content (Sydney vs. Melbourne resources)
- Readiness-based paths (high-intent vs. exploratory)

---

## Maintenance Schedule

### Quarterly Review
- ✅ Update cost ranges (inflation, market changes)
- ✅ Verify internal links still valid
- ✅ Check Medicare rebate amounts current
- ✅ Review compliance for any regulatory changes

### Annual Update
- ✅ Refresh statistics and research citations
- ✅ Update timelines based on current surgical protocols
- ✅ Review A/B test results and implement winners
- ✅ Assess sequence length (add/remove emails based on data)

---

## Integration with Website

### Cross-Promotion Opportunities

**On-Site Triggers:**
- Quiz completion → Email 1
- Cost calculator usage → Add to email list with Email 3
- Surgeon directory browsing → Add to list with Email 5
- Exit intent on high-value pages → Offer email series

**Content Repurposing:**
- Convert emails to blog posts for SEO value
- Create downloadable "Complete Guide" PDF from email series
- Use email FAQs to expand website FAQ section

---

## Future Enhancements

### Phase 2 Additions

1. **Post-Surgery Sequence**: 7-email series for recovery support
2. **Partner/Supporter Sequence**: Content for family members
3. **Video Versions**: Short videos summarizing each email topic
4. **SMS Reminders**: Brief text messages between emails
5. **Interactive Tools**: Expand cost calculator, readiness quiz
6. **Live Webinars**: Monthly Q&A sessions for email subscribers

---

## Files in This Package

1. `EMAIL-01-WELCOME.md` — Welcome and expectation-setting
2. `EMAIL-02-WHAT-TO-EXPECT.md` — Realistic timeline and journey phases
3. `EMAIL-03-COSTS-FINANCING.md` — Cost transparency and payment options
4. `EMAIL-04-MENTAL-HEALTH.md` — Psychological preparation and readiness
5. `EMAIL-05-CHOOSING-SURGEON.md` — Surgeon selection guide and red flags
6. `EMAIL-06-FAQS.md` — Common questions with honest answers
7. `EMAIL-07-READY-CONSULTATION.md` — Decision framework and next steps
8. `EMAIL-SEQUENCE-SUMMARY.md` — This overview document

---

## Legal & Compliance

### Approvals Required Before Launch

- [ ] Legal review (confirm AHPRA compliance)
- [ ] Medical review (verify clinical accuracy of health information)
- [ ] Privacy policy compliance (data collection, storage, usage)
- [ ] CAN-SPAM compliance (US subscribers)
- [ ] SPAM Act compliance (Australian subscribers)
- [ ] Unsubscribe mechanism tested
- [ ] Email authentication (SPF, DKIM, DMARC)

---

## Contact & Support

For questions about this email sequence:
- **Content updates**: Refer to `CONTENT-AGENT-MASTER-PROMPT.md` for guidelines
- **Compliance questions**: Review `AHPRA-COMPLIANCE-REVIEWS.md`
- **Psychology strategy**: See `CONSUMER-PSYCHOLOGY-IMPLEMENTATION-PLAN.md`

---

**Created by**: Content Agent (following CONTENT-AGENT-MASTER-PROMPT.md)  
**Date**: October 2025  
**Status**: ✅ Complete — Ready for technical implementation  
**Next Steps**: Platform integration and launch preparation


