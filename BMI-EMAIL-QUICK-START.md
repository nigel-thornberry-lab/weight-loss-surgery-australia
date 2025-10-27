# BMI Candidacy Email - Quick Start Guide

## What This Does

When users complete your BMI calculator and submit their contact details, they automatically receive a personalized "Complete Candidacy Report" email with:

- Their BMI result and category
- Candidacy information specific to their BMI range
- Next steps and recommendations
- Links to cost calculator and surgeon checklist
- Medical disclaimers and compliance info

**No PDF needed** - the email IS the report!

---

## 5-Minute Setup

### 1. Create Google Sheet (2 min)

1. Go to https://sheets.google.com
2. Create new sheet: "BMI Calculator Leads"
3. Add headers in Row 1:
   ```
   Timestamp | Name | Email | BMI | Gender | Age Range | BMI Category | Email Sent | Email Status
   ```

### 2. Add Apps Script (2 min)

1. In your sheet: **Extensions > Apps Script**
2. Delete existing code
3. Copy the ENTIRE script from `BMI-EMAIL-AUTOMATION-SETUP.md` (Step 2)
4. Paste it
5. Click **Save**

### 3. Deploy Webhook (1 min)

1. Click **Deploy > New deployment**
2. Choose **Web app**
3. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. **Copy the URL** (looks like `https://script.google.com/macros/s/ABC.../exec`)

### 4. Add to Your Site (30 sec)

1. Create/edit `.env` file in project root:
   ```
   PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_URL_HERE/exec
   ```
2. Restart dev server: `npm run dev`

### 5. Test It! (1 min)

1. Go to http://localhost:4321/bmi-calculator
2. Calculate BMI
3. Submit form with your real email
4. Check your inbox (arrives in 1-2 minutes)
5. Check Google Sheet (should see new row)

---

## ✅ Done!

Your BMI calculator now automatically sends personalized candidacy reports!

---

## What's Next?

### Immediate (This Week)
- [ ] Test with different BMI ranges
- [ ] Monitor first 10 submissions
- [ ] Verify email deliverability

### Short-term (This Month)
- [ ] Add email tracking (UTM parameters)
- [ ] Monitor conversion rates
- [ ] Collect user feedback

### Long-term (Next Quarter)
- [ ] Implement full AI Newsletter System (see AI-NEWSLETTER-SYSTEM-PRD.md)
- [ ] Set up Drip for advanced email marketing
- [ ] Build MCP server for automation
- [ ] Create 8 nurture sequences
- [ ] Add behavioral triggers
- [ ] Scale to full automation

---

## Files Created

1. ✅ `BMI-CANDIDACY-EMAIL-TEMPLATE.md` - Full email template with all BMI ranges
2. ✅ `BMI-EMAIL-AUTOMATION-SETUP.md` - Complete setup guide with Google Apps Script
3. ✅ `BMI-EMAIL-QUICK-START.md` - This file (quick reference)
4. ✅ Updated `src/pages/bmi-calculator.astro` - Better webhook configuration

---

## Troubleshooting

**Email not arriving?**
- Check Google Apps Script > Executions for errors
- Verify webhook URL in .env file
- Check Gmail quota (100/day for free Gmail)

**Form not submitting?**
- Check browser console for errors
- Verify webhook URL is correct
- Test webhook URL directly in browser

**Need help?**
- See full guide: `BMI-EMAIL-AUTOMATION-SETUP.md`
- Check setup-webhook.md for basic webhook info
- Review Google Apps Script logs

---

## Integration with Full Email System

This BMI email is designed to work standalone NOW, but will integrate seamlessly with the full AI Newsletter System later:

**Current:** Google Apps Script → Gmail (simple, free, works today)

**Future:** Google Apps Script → Drip → AI-powered nurture sequences

When you're ready to implement the full system from `AI-NEWSLETTER-SYSTEM-PRD.md`, this BMI email will become the entry point to your comprehensive email marketing automation.

---

**Status:** ✅ Ready to Use
**Time to Setup:** 5 minutes
**Cost:** Free (uses Gmail)
**Maintenance:** Minimal

