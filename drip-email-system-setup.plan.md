# Drip Email System Setup Plan
## BariatricSurgeryHub Form Segmentation Implementation

**Date:** October 29, 2025
**Status:** Ready to Implement
**MCP Server Status:** ✅ Configured and Running
**CLI Tool:** ✅ Available at `drip-mcp-server/cli.js`

---

## 🚀 COMPLETE SETUP FROM CLAUDE CODE CLI

All commands below can be run directly from Claude Code. No need to use Drip UI or Claude Desktop!

---

## Phase 1: Create Tags in Drip (5 minutes via CLI)

### Required Tags for Form Segmentation

Tags in Drip are created automatically when first applied to a subscriber. We'll create temporary test subscribers to initialize each tag.

#### Tag 1: `calculator_user`
- **Purpose:** Track users who complete the Cost Calculator
- **Form URL:** `/cost-calculator`
- **Intent:** Price-conscious, early research stage
- **Email Sequence:** 7 emails focused on cost, financing, and affordability

**Create via CLI:**
```bash
cd drip-mcp-server
node cli.js create-tag setup-test-1@bariatricsurgeryhub.com calculator_user
```

---

#### Tag 2: `surgeon_researcher`
- **Purpose:** Track users who download the Surgeon Selection Checklist
- **Form URL:** `/surgeon-selection-checklist`
- **Intent:** Researching surgeons, middle stage of journey
- **Email Sequence:** 7 emails focused on surgeon credentials, red flags, and selection process

**Create via CLI:**
```bash
node cli.js create-tag setup-test-2@bariatricsurgeryhub.com surgeon_researcher
```

---

#### Tag 3: `readiness_quiz`
- **Purpose:** Track users who take the Am I Ready Quiz
- **Form URL:** `/am-i-ready`
- **Intent:** Considering readiness and eligibility
- **Email Sequence:** 6 emails focused on eligibility, preparation, and readiness assessment

**Create via CLI:**
```bash
node cli.js create-tag setup-test-3@bariatricsurgeryhub.com readiness_quiz
```

---

#### Tag 4: `consultation_request`
- **Purpose:** Track users who request a consultation
- **Form URL:** `/contact`
- **Intent:** High-intent, ready to talk with surgeons
- **Email Sequence:** 3 emails (confirmation, reminder, follow-up)

**Create via CLI:**
```bash
node cli.js create-tag setup-test-4@bariatricsurgeryhub.com consultation_request
```

---

#### Tag 5: `newsletter_subscriber`
- **Purpose:** Track general newsletter signups
- **Form URL:** Footer, popups, blog signups
- **Intent:** General interest, early stage education
- **Email Sequence:** Weekly educational newsletter (ongoing)

**Create via CLI:**
```bash
node cli.js create-tag setup-test-5@bariatricsurgeryhub.com newsletter_subscriber
```

---

## Phase 2: Initialize Custom Fields in Drip (5 minutes via CLI)

Custom fields are created automatically when first used. We'll create a subscriber with all custom fields to initialize them.

### Required Custom Fields

All 5 custom fields will be created in one command:

**Create via CLI:**
```bash
node cli.js create-subscriber-with-tag setup-fields-test@bariatricsurgeryhub.com TestUser calculator_user estimated_cost=12000 calculator_date=2025-10-29 procedure_interest=gastric_sleeve location=Sydney bmi=35
```

This single command creates:
- ✅ Subscriber with email and name
- ✅ Tag: calculator_user
- ✅ Custom field: `estimated_cost` (Number) = 12000
- ✅ Custom field: `calculator_date` (Text) = 2025-10-29
- ✅ Custom field: `procedure_interest` (Text) = gastric_sleeve
- ✅ Custom field: `location` (Text) = Sydney
- ✅ Custom field: `bmi` (Number) = 35

---

## Phase 3: Verify Setup (2 minutes via CLI)

### Test 1: Verify All Tags Exist
```bash
node cli.js list-tags
```

**Expected Result:** Should see all 5 tags:
- calculator_user
- surgeon_researcher
- readiness_quiz
- consultation_request
- newsletter_subscriber

---

### Test 2: Verify All Custom Fields Exist
```bash
node cli.js list-custom-fields
```

**Expected Result:** Should see all 5 custom fields:
- estimated_cost
- calculator_date
- procedure_interest
- location
- bmi

---

### Test 3: Verify Test Subscriber Data
```bash
node cli.js get-subscriber setup-fields-test@bariatricsurgeryhub.com
```

**Expected Result:** Should show subscriber with all tags and custom fields populated

---

### Test 4: Clean Up Test Subscribers
```bash
# Remove test subscribers
node cli.js delete-subscriber setup-test-1@bariatricsurgeryhub.com
node cli.js delete-subscriber setup-test-2@bariatricsurgeryhub.com
node cli.js delete-subscriber setup-test-3@bariatricsurgeryhub.com
node cli.js delete-subscriber setup-test-4@bariatricsurgeryhub.com
node cli.js delete-subscriber setup-test-5@bariatricsurgeryhub.com
node cli.js delete-subscriber setup-fields-test@bariatricsurgeryhub.com
```

**Expected Result:** All test subscribers removed (tags and custom fields remain in account)

---

## Phase 4: Form Integration via CLI

### Real-Time Form Submission Example

When a user submits a form on your site, use the CLI to add them to Drip:

**Cost Calculator Example:**
```bash
node cli.js create-subscriber-with-tag john.smith@email.com John calculator_user estimated_cost=14500 calculator_date=2025-10-29 procedure_interest=gastric_sleeve location=Sydney bmi=37
```

**Surgeon Checklist Example:**
```bash
node cli.js create-subscriber-with-tag sarah@email.com Sarah surgeon_researcher location=Melbourne procedure_interest=gastric_bypass
```

**Readiness Quiz Example:**
```bash
node cli.js create-subscriber-with-tag mike@email.com Mike readiness_quiz bmi=42 procedure_interest=gastric_sleeve
```

**Consultation Request Example:**
```bash
node cli.js create-subscriber-with-tag lisa@email.com Lisa consultation_request location=Brisbane procedure_interest=gastric_bypass
```

**Newsletter Signup Example:**
```bash
node cli.js create-subscriber test@email.com
node cli.js tag-subscriber test@email.com newsletter_subscriber
```

### Integration Options

**Option A: Backend API Integration (Recommended)**

Create a simple API endpoint that uses the Drip CLI:

```javascript
// /api/drip/subscriber
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  const { email, firstName, tag, customFields } = req.body;

  // Build CLI command
  const fields = Object.entries(customFields || {})
    .map(([key, value]) => `${key}=${value}`)
    .join(' ');

  const command = `cd /path/to/drip-mcp-server && node cli.js create-subscriber-with-tag ${email} ${firstName} ${tag} ${fields}`;

  try {
    const { stdout } = await execAsync(command);
    res.status(200).json({ success: true, data: JSON.parse(stdout) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
```

**Option B: Direct Node.js Integration**

Import the DripClient directly in your backend:

```javascript
import { DripClient } from './drip-mcp-server/src/drip-client.js';

const client = new DripClient(
  process.env.DRIP_API_TOKEN,
  process.env.DRIP_ACCOUNT_ID
);

// Add subscriber with tag
await client.createOrUpdateSubscriber({
  email: 'user@example.com',
  first_name: 'John',
  tags: ['calculator_user'],
  custom_fields: {
    estimated_cost: 12000,
    calculator_date: '2025-10-29'
  }
});
```

**Option C: Webhook Integration**

Set up a webhook endpoint that receives form submissions and calls the CLI.

---

## Phase 5: Email Workflows Management via CLI

### List All Workflows
```bash
node cli.js list-workflows
```

This shows all workflows (email sequences) in your Drip account with their IDs, names, and statuses.

### Get Specific Workflow Details
```bash
node cli.js get-workflow <workflow_id>
```

### Activate a Workflow
```bash
node cli.js activate-workflow <workflow_id>
```

### Pause a Workflow
```bash
node cli.js pause-workflow <workflow_id>
```

### Required Workflows (Create in Drip UI, Manage via CLI)

#### Workflow 1: Cost Calculator Sequence
- **Trigger:** Tag `calculator_user` applied
- **Emails:** 7 emails over 21 days
- **Focus:** Cost, financing, affordability
- **Manage:** List workflows → Get ID → Activate via CLI

#### Workflow 2: Surgeon Researcher Sequence
- **Trigger:** Tag `surgeon_researcher` applied
- **Emails:** 7 emails over 21 days
- **Focus:** Credentials, red flags, selection process

#### Workflow 3: Readiness Quiz Sequence
- **Trigger:** Tag `readiness_quiz` applied
- **Emails:** 6 emails over 21 days
- **Focus:** Eligibility, preparation, readiness

#### Workflow 4: Consultation Request Sequence
- **Trigger:** Tag `consultation_request` applied
- **Emails:** 3 emails (immediate, day before, day after)
- **Focus:** Confirmation, preparation, follow-up

#### Workflow 5: Newsletter Sequence
- **Trigger:** Tag `newsletter_subscriber` applied
- **Emails:** Weekly ongoing
- **Focus:** Educational content rotation

**Note:** Email workflows (sequences) must be created in the Drip UI or via their workflow API. Once created, you can activate/pause them via CLI and manage subscribers via CLI.

---

## 🚀 QUICK START: Run All Setup Commands

### Copy-Paste Complete Setup (12 minutes)

Run these commands sequentially in your terminal from the project root:

```bash
# Navigate to drip-mcp-server
cd drip-mcp-server

# Phase 1: Create all 5 tags (1 minute)
node cli.js create-tag setup-test-1@bariatricsurgeryhub.com calculator_user
node cli.js create-tag setup-test-2@bariatricsurgeryhub.com surgeon_researcher
node cli.js create-tag setup-test-3@bariatricsurgeryhub.com readiness_quiz
node cli.js create-tag setup-test-4@bariatricsurgeryhub.com consultation_request
node cli.js create-tag setup-test-5@bariatricsurgeryhub.com newsletter_subscriber

# Phase 2: Create all 5 custom fields (1 minute)
node cli.js create-subscriber-with-tag setup-fields-test@bariatricsurgeryhub.com TestUser calculator_user estimated_cost=12000 calculator_date=2025-10-29 procedure_interest=gastric_sleeve location=Sydney bmi=35

# Phase 3: Verify setup (30 seconds)
node cli.js list-tags
node cli.js list-custom-fields

# Phase 4: Clean up test subscribers (30 seconds)
node cli.js delete-subscriber setup-test-1@bariatricsurgeryhub.com
node cli.js delete-subscriber setup-test-2@bariatricsurgeryhub.com
node cli.js delete-subscriber setup-test-3@bariatricsurgeryhub.com
node cli.js delete-subscriber setup-test-4@bariatricsurgeryhub.com
node cli.js delete-subscriber setup-test-5@bariatricsurgeryhub.com
node cli.js delete-subscriber setup-fields-test@bariatricsurgeryhub.com

# Verify account
node cli.js get-account

echo "✅ Setup complete! Tags and custom fields are ready."
```

---

## Checklist: Complete Setup via CLI

### Before You Start
- [x] Drip account is active and accessible
- [x] You have admin/owner permissions
- [x] Drip MCP server is configured (✅ Done)
- [x] CLI tool created (✅ Done)
- [ ] Environment variables set in `.env`

### Phase 1: Create Tags via CLI (5 min)
- [ ] Run tag creation commands for all 5 tags
- [ ] Verify with `node cli.js list-tags`

### Phase 2: Create Custom Fields via CLI (5 min)
- [ ] Run custom field initialization command
- [ ] Verify with `node cli.js list-custom-fields`

### Phase 3: Verify Setup via CLI (2 min)
- [ ] List all tags - should see 5
- [ ] List all custom fields - should see 5
- [ ] Get test subscriber - should show all data
- [ ] Clean up test subscribers

### Phase 4: Test Real Subscriber Flow (2 min)
- [ ] Create a real test subscriber with your email
- [ ] Verify tag was applied
- [ ] Verify custom fields saved
- [ ] Check Drip UI - subscriber should appear

---

## Quick Reference: Tag Usage by Form

| Form | URL | Tag | Custom Fields | Intent |
|------|-----|-----|---------------|--------|
| Cost Calculator | `/cost-calculator` | `calculator_user` | estimated_cost, calculator_date, procedure_interest, bmi | Price research |
| Surgeon Checklist | `/surgeon-selection-checklist` | `surgeon_researcher` | location, procedure_interest | Vetting surgeons |
| Readiness Quiz | `/am-i-ready` | `readiness_quiz` | bmi, procedure_interest | Eligibility check |
| Consultation Request | `/contact` | `consultation_request` | location, procedure_interest | Ready to book |
| Newsletter Signup | Various | `newsletter_subscriber` | None required | General interest |

---

## 📚 Common CLI Usage Examples

### Daily Operations

**Add a new lead from cost calculator:**
```bash
cd drip-mcp-server
node cli.js create-subscriber-with-tag sarah.jones@email.com Sarah calculator_user estimated_cost=13500 calculator_date=2025-10-29 procedure_interest=gastric_sleeve location=Melbourne bmi=36
```

**Tag an existing subscriber:**
```bash
node cli.js tag-subscriber existing@email.com readiness_quiz
```

**Update custom fields for existing subscriber:**
```bash
node cli.js update-custom-fields john@email.com location=Brisbane bmi=38
```

**Check subscriber status:**
```bash
node cli.js get-subscriber sarah.jones@email.com
```

**Track a custom event:**
```bash
node cli.js track-event sarah.jones@email.com "Downloaded Surgeon Checklist" location=Melbourne
```

**List all subscribers by tag:**
```bash
node cli.js list-subscribers tags=calculator_user
```

**Remove a tag from subscriber:**
```bash
node cli.js untag-subscriber old@email.com newsletter_subscriber
```

---

## 🔧 Troubleshooting

### "DRIP_API_TOKEN environment variable is required"
**Solution:**
1. Check `.env` file exists in `drip-mcp-server/` directory
2. Verify it contains:
   ```
   DRIP_API_TOKEN=your_token_here
   DRIP_ACCOUNT_ID=your_account_id_here
   ```
3. Make sure there are no spaces around the `=` sign
4. Try running from the `drip-mcp-server/` directory

### "Drip API error (401): Unauthorized"
**Solution:**
- Your API token is invalid or expired
- Get new token from Drip: Settings → User Settings → API Tokens
- Update `.env` file with new token

### "Drip API error (404): Not Found"
**Solution:**
- Your Account ID is incorrect
- Check your Drip URL: `https://www.getdrip.com/XXXXXXX/...`
- The number is your Account ID
- Update `.env` file

### CLI command not found
**Solution:**
```bash
# Make sure you're in the right directory
cd /Users/Cameron/Desktop/weight-loss-surgery-australia/drip-mcp-server

# Check cli.js exists
ls -la cli.js

# Make it executable
chmod +x cli.js

# Run with node explicitly
node cli.js help
```

### Tags not appearing in Drip UI
**Solution:**
- Tags are created when first applied to a subscriber
- Check that the subscriber was created successfully
- Log into Drip UI → Subscribers → Click on subscriber → Check Tags tab
- Or run: `node cli.js list-tags` to see all tags

### Custom fields not saving values
**Solution:**
- Ensure field names match exactly (case-sensitive, underscores)
- Numbers should not have quotes: `bmi=35` not `bmi="35"`
- Text should not have quotes unless part of the value
- Check field was created: `node cli.js list-custom-fields`

### "Command failed" or network errors
**Solution:**
1. Check internet connection
2. Verify Drip API is accessible: `curl https://api.getdrip.com/v3`
3. Check if behind firewall/VPN
4. Try again in a few minutes (rate limiting)

---

## 🎯 Next Steps After Tag Setup

### Immediate (Can Do Now via CLI):
1. ✅ **Phase 1 Complete:** Tags and custom fields created
2. ✅ **Phase 2 Complete:** CLI tool ready for subscriber management
3. ✅ **Test subscriber flow:** Add yourself as a test subscriber

### Next (Requires Drip UI or Email Content):
4. 🔄 **Generate email content** for each sequence (use Claude Code + AI)
5. 🔄 **Create workflows in Drip UI** (visual workflow builder)
6. 🔄 **Connect forms to Drip** (via CLI/API integration)
7. 🔄 **Test complete flow** with real form submissions
8. 🔄 **Monitor and optimize** via CLI analytics

---

## 📊 Monitoring & Analytics via CLI

### Daily Checks (5 minutes)

**Check total subscribers:**
```bash
node cli.js list-subscribers
```

**Check subscribers by tag:**
```bash
node cli.js list-subscribers tags=calculator_user
node cli.js list-subscribers tags=consultation_request
```

**Check active workflows:**
```bash
node cli.js list-workflows status=active
```

**View account stats:**
```bash
node cli.js get-account
```

### Weekly Analytics

**Track which tags are growing:**
```bash
# List subscribers for each tag and count them
node cli.js list-subscribers tags=calculator_user | grep -c '"email"'
node cli.js list-subscribers tags=surgeon_researcher | grep -c '"email"'
node cli.js list-subscribers tags=readiness_quiz | grep -c '"email"'
```

**Review campaigns:**
```bash
node cli.js list-campaigns status=active
```

---

## 🔗 Integration with Your Astro Site

### Option 1: Server-Side API Route (Recommended)

Create `/src/pages/api/drip/subscribe.ts`:

```typescript
import type { APIRoute } from 'astro';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  const { email, firstName, tag, customFields } = data;

  // Build CLI command
  const fields = Object.entries(customFields || {})
    .map(([key, value]) => `${key}=${value}`)
    .join(' ');

  const command = `cd ${process.cwd()}/drip-mcp-server && node cli.js create-subscriber-with-tag ${email} ${firstName} ${tag} ${fields}`;

  try {
    const { stdout, stderr } = await execAsync(command);

    if (stderr && !stderr.includes('Creating')) {
      throw new Error(stderr);
    }

    return new Response(JSON.stringify({ success: true, message: 'Subscriber added' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

### Option 2: Direct DripClient Usage

```typescript
import type { APIRoute } from 'astro';
import { DripClient } from '../../drip-mcp-server/src/drip-client.js';

const client = new DripClient(
  import.meta.env.DRIP_API_TOKEN,
  import.meta.env.DRIP_ACCOUNT_ID
);

export const POST: APIRoute = async ({ request }) => {
  const { email, firstName, tag, customFields } = await request.json();

  try {
    const result = await client.createOrUpdateSubscriber({
      email,
      first_name: firstName,
      tags: [tag],
      custom_fields: customFields || {}
    });

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

### Frontend Form Integration

```javascript
// In your cost calculator component
async function submitToDrip(formData) {
  const response = await fetch('/api/drip/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: formData.email,
      firstName: formData.firstName,
      tag: 'calculator_user',
      customFields: {
        estimated_cost: formData.calculatedCost,
        calculator_date: new Date().toISOString().split('T')[0],
        procedure_interest: formData.procedure,
        location: formData.location,
        bmi: formData.bmi
      }
    })
  });

  return await response.json();
}
```

---

## 📝 Summary

### What You Can Do Now (100% via CLI):
✅ Create and manage subscribers
✅ Apply and remove tags
✅ Set and update custom fields
✅ Track custom events
✅ List and filter subscribers
✅ Manage workflows (activate/pause)
✅ Monitor account stats
✅ Integrate with your forms

### What Requires Drip UI:
❌ Creating email content (use Claude Code to generate, paste into Drip)
❌ Building workflow visual flows (create in Drip UI, manage via CLI)
❌ Designing email templates (generate with AI, upload to Drip)

### Your Workflow:
1. **Generate emails** → Claude Code (AI generation)
2. **Create workflows** → Drip UI (visual builder)
3. **Manage subscribers** → CLI (command line)
4. **Monitor performance** → CLI + Drip UI
5. **Integrate forms** → API/CLI (automated)

---

## 🚀 Implementation Timeline

### Today (30 minutes):
- [x] MCP server configured
- [x] CLI tool created
- [ ] Run setup commands to create tags and fields
- [ ] Test with your own email
- [ ] Verify in Drip UI

### This Week (2-3 hours):
- [ ] Generate email content for one sequence (cost calculator)
- [ ] Create first workflow in Drip UI
- [ ] Set up API endpoint for form integration
- [ ] Test end-to-end flow

### Next Week (3-4 hours):
- [ ] Create remaining 4 email sequences
- [ ] Build all 5 workflows in Drip
- [ ] Connect all forms
- [ ] Monitor first real subscribers

---

## Support Resources

- **CLI Tool:** `drip-mcp-server/cli.js`
- **MCP Server Code:** `drip-mcp-server/src/`
- **Setup Guide:** `drip-mcp-server/QUICK-START.md`
- **Email System PRD:** `SIMPLE-EMAIL-SYSTEM-PRD.md`
- **Drip API Docs:** https://developer.drip.com/
- **This Setup Plan:** `drip-email-system-setup.plan.md`

---

**Status:** ✅ Ready to implement (Complete CLI control)
**Estimated Setup Time:** 12 minutes via CLI
**Next Action:** Run the Quick Start commands above

---

## Notes

- ✅ Drip MCP server configured and running
- ✅ CLI tool provides complete control from Claude Code
- ✅ All subscriber management can be done via command line
- ✅ No need to use Drip UI except for workflow creation and email editing
- ✅ Tags are auto-created when first applied
- ✅ Custom fields are auto-created when first used
- ✅ Integration ready for Astro API routes
- ✅ This follows the simplified form-based segmentation from the PRD
