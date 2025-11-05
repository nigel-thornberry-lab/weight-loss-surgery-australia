# ✅ Drip Email Sequence - Automation Complete

**Project:** Weight Loss Surgery Australia
**Date:** November 3, 2025
**Status:** Ready for Workflow Creation

---

## What's Been Automated ✅

The `auto-setup.js` script has automatically:

1. ✅ **Created all required tags** in Drip:
   - `calculator_user`
   - `calculator_user_insured`
   - `calculator_user_self_funded`
   - `booking_call_requested`
   - `consultation_booked`

2. ✅ **Verified custom fields** (6 exist, 3 need manual creation)

3. ✅ **Created test subscribers** for both sequences:
   - A-Segment: `test-insured-1762151651469@bariatricsurgeryhub.com`
   - B-Segment: `test-selffunded-1762151651469@bariatricsurgeryhub.com`

4. ✅ **Configured sequence structure** (sequence-config.json)

5. ✅ **Prepared all 14 email content files** (ALL-14-EMAILS-FINAL.md)

---

## What Needs Manual Setup (Drip API Limitation) ⚠️

Drip's API doesn't support **creating** workflows/campaigns. You must create them in the UI:

### 1. Create Missing Custom Fields

Go to: https://www.getdrip.com/4349557/settings/custom_fields

Create these 3 fields:

| Field Name | Type | Description |
|------------|------|-------------|
| `procedure_type` | String | Type of procedure (Gastric Sleeve, Bypass, etc.) |
| `insurance_fund` | String | Health insurance provider name |
| `payment_preference` | String | Payment method preference |

### 2. Create Workflows in Drip UI

**Workflow A - Insured Patients:**
1. Go to: https://www.getdrip.com/4349557/workflows
2. Click "Create Workflow"
3. Name: **"Calculator Follow-up: Insured Patients"**
4. Trigger: **Tag applied** → `calculator_user_insured`
5. Add 7 emails (copy from `ALL-14-EMAILS-FINAL.md`, emails 1A-7A)
6. Exit condition: Tag **`consultation_booked`** applied
7. Save as Draft (test first)

**Workflow B - Self-Funded Patients:**
1. Create Workflow
2. Name: **"Calculator Follow-up: Self-Funded Patients"**
3. Trigger: **Tag applied** → `calculator_user_self_funded`
4. Add 7 emails (copy from `ALL-14-EMAILS-FINAL.md`, emails 1B-7B)
5. Exit condition: Tag **`consultation_booked`** applied
6. Save as Draft

---

## Email Schedule Reference

### A-Segment (Insured):

| Email | Day | Subject | Source |
|-------|-----|---------|--------|
| 1 | 0 | Your ${{estimated_cost}} gap - here's what happens next | Email 1A |
| 2 | 2 | How to use your health insurance for bariatric surgery | Email 2A |
| 3 | 5 | Is your ${{estimated_cost}} gap accurate? | Email 3A |
| 4 | 7 | Every surgeon is verified (here's how) | Email 4A |
| 5 | 10 | Still Googling surgeons in {{location}}? | Email 5A |
| 6 | 14 | Two Weeks of Research - Ready to Actually Book? | Email 6A |
| 7 | 21 | 3 Weeks Later: Are You Ready? | Email 7A |

### B-Segment (Self-Funded):

| Email | Day | Subject | Source |
|-------|-----|---------|--------|
| 1 | 0 | Your ${{estimated_cost}} estimate - here's what happens next | Email 1B |
| 2 | 2 | Still Googling surgeons in {{location}}? | Email 2B |
| 3 | 5 | What does waiting another year actually cost you? | Email 3B |
| 4 | 8 | There's no "perfect" surgeon - here's what actually matters | Email 4B |
| 5 | 11 | Stop vetting surgeons yourself - we've already done it | Email 5B |
| 6 | 14 | Two Weeks of Research - Ready to Actually Book? | Email 6B |
| 7 | 21 | 3 Weeks Later: Are You Ready? | Email 7B |

---

## Integration Code (Ready to Use)

### Frontend (Calculator Completion):

```javascript
// Add to your calculator results page
async function handleCalculatorComplete(results) {
  const data = {
    email: results.userEmail,
    first_name: results.firstName,
    insurance_status: results.hasInsurance, // true/false
    estimated_cost: results.calculatedCost,
    location: results.userLocation,
    procedure_type: results.procedureType
  };

  try {
    const response = await fetch('/api/calculator-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      // Show success message
      showSuccessMessage('Check your email for your personalized guide!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Backend (API Endpoint):

```javascript
// api/calculator-complete.js
import { DripClient } from './drip-mcp-server/src/drip-client.js';
import dotenv from 'dotenv';

dotenv.config();

const drip = new DripClient(
  process.env.DRIP_API_TOKEN,
  process.env.DRIP_ACCOUNT_ID
);

export async function POST(req, res) {
  const {
    email,
    first_name,
    insurance_status,
    estimated_cost,
    location,
    procedure_type
  } = req.body;

  // Determine which sequence to trigger
  const sequenceTag = insurance_status
    ? 'calculator_user_insured'
    : 'calculator_user_self_funded';

  try {
    // Create subscriber and trigger workflow
    await drip.createOrUpdateSubscriber({
      email,
      first_name,
      tags: ['calculator_user', sequenceTag],
      custom_fields: {
        estimated_cost: parseInt(estimated_cost),
        location,
        procedure_type,
        calculator_date: new Date().toISOString().split('T')[0]
      }
    });

    return res.json({
      success: true,
      sequence: insurance_status ? 'insured' : 'self-funded'
    });

  } catch (error) {
    console.error('Drip error:', error);
    return res.status(500).json({ error: 'Failed to start sequence' });
  }
}
```

### Exit Sequence (When Booked):

```javascript
// When user books consultation
import { DripClient } from './drip-mcp-server/src/drip-client.js';

const drip = new DripClient(
  process.env.DRIP_API_TOKEN,
  process.env.DRIP_ACCOUNT_ID
);

// This removes them from the active email sequence
await drip.tagSubscriber(email, 'consultation_booked');
```

---

## Testing Commands

### Test A-Segment (CLI):

```bash
cd drip-mcp-server

# Create test subscriber (triggers A-sequence)
node cli.js create-subscriber-with-tag your@email.com John calculator_user_insured estimated_cost=12000 location=Sydney

# Verify subscriber
node cli.js get-subscriber your@email.com

# Check inbox for emails
```

### Test B-Segment (CLI):

```bash
# Create test subscriber (triggers B-sequence)
node cli.js create-subscriber-with-tag your@email.com Jane calculator_user_self_funded estimated_cost=18000 location=Melbourne

# Verify subscriber
node cli.js get-subscriber your@email.com
```

### Test Exit Condition:

```bash
# Apply exit tag (removes from workflow)
node cli.js tag-subscriber your@email.com consultation_booked
```

---

## Workflow Settings

Configure these settings for BOTH workflows:

- **Allow multiple subscriptions:** No
- **Send time:** Optimized (Drip picks best time)
- **Timezone:** Australia/Sydney
- **Exit condition:** Tag `consultation_booked` applied

---

## Files Reference

| File | Purpose |
|------|---------|
| `email-sequences/ALL-14-EMAILS-FINAL.md` | All 14 email content (copy into Drip) |
| `email-sequences/sequence-config.json` | Sequence configuration |
| `auto-setup.js` | Automated setup script (**already run**) |
| `cli.js` | CLI for testing subscribers/tags |
| `src/drip-client.js` | Drip API client (for integration) |

---

## Quick Start Checklist

Once workflows are created in Drip:

- [ ] 3 missing custom fields created in Drip
- [ ] Workflow A created (insured) with 7 emails
- [ ] Workflow B created (self-funded) with 7 emails
- [ ] Email content copied from ALL-14-EMAILS-FINAL.md
- [ ] Email delays configured (Day 0, 2, 5, 7, 10, 14, 21)
- [ ] Exit condition set (consultation_booked tag)
- [ ] Workflows tested with CLI commands
- [ ] Test emails received and verified
- [ ] Calculator integration code added to website
- [ ] Backend API endpoint deployed
- [ ] Workflows **activated** (not draft)

---

## Monitoring

**Drip Dashboard Links:**
- Main: https://www.getdrip.com/4349557/
- Workflows: https://www.getdrip.com/4349557/workflows
- Subscribers: https://www.getdrip.com/4349557/subscribers
- Tags: https://www.getdrip.com/4349557/tags
- Custom Fields: https://www.getdrip.com/4349557/settings/custom_fields

**Key Metrics to Watch:**
- Workflow enrollment rate
- Email open rates (target: 20-30%)
- Email click rates (target: 2-5%)
- Consultation booking rate
- Sequence completion rate

---

## Summary

✅ **What's Done:**
- Tags created automatically
- Test subscribers created
- Email content finalized
- Integration code ready
- CLI tools ready

⚠️ **What You Need to Do:**
1. Create 3 custom fields in Drip UI
2. Create 2 workflows in Drip UI
3. Copy email content into workflows
4. Test workflows with CLI
5. Integrate with calculator
6. Activate workflows
7. Monitor results

**Estimated time to complete:** 2-3 hours (mainly copying email content into Drip)

---

**Status:** ✅ Ready for Workflow Creation
**Next Step:** Create workflows in Drip UI (see instructions above)
