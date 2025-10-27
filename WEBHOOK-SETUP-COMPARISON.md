# Webhook Setup: One vs Multiple - Quick Comparison

## TL;DR Recommendation

**Use ONE unified webhook** (see `UNIFIED-WEBHOOK-SYSTEM.md`)

---

## Option 1: One Unified Webhook ⭐ RECOMMENDED

### How It Works
```
All forms → Same webhook URL → Routes based on 'type' field → Sends appropriate email
```

### Pros
✅ **Simple** - One URL to manage  
✅ **Organized** - All form logic in one place  
✅ **Easy to extend** - Add new forms easily  
✅ **One .env variable** - `PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL`  
✅ **Centralized** - All leads in one spreadsheet (different tabs)  
✅ **Consistent** - All emails use same styling/branding  
✅ **Better tracking** - See all activity in one place  

### Cons
❌ Slightly more complex script (but we've built it for you)  
❌ All forms fail if webhook is down (but unlikely)  

### Your .env File
```bash
PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/ABC123/exec
```

### Your Forms
Each form just needs to include a `type` field:

```javascript
// BMI Calculator
{ type: 'bmi-candidacy-report', name: '...', email: '...', bmi: 37.2 }

// Consultation Form
{ type: 'consultation', name: '...', email: '...', procedure: '...' }

// Cost Calculator
{ type: 'cost-calculator', name: '...', email: '...', estimatedCost: '...' }
```

### Setup Time
**30 minutes** (one-time setup)

---

## Option 2: Multiple Webhooks

### How It Works
```
BMI form → BMI webhook → BMI email
Consultation form → Consultation webhook → Consultation email
Cost calculator → Cost webhook → Cost email
```

### Pros
✅ **Isolated** - One form failing doesn't affect others  
✅ **Simple scripts** - Each script is smaller  

### Cons
❌ **More webhooks** - 5-6 different URLs to manage  
❌ **More .env variables** - Multiple entries needed  
❌ **More scripts** - 5-6 Google Apps Scripts to maintain  
❌ **More sheets** - 5-6 different spreadsheets  
❌ **Harder to track** - Leads scattered across multiple sheets  
❌ **Inconsistent** - Email templates might diverge  
❌ **More work** - Updates need to be made in multiple places  

### Your .env File
```bash
PUBLIC_BMI_WEBHOOK_URL=https://script.google.com/macros/s/ABC123/exec
PUBLIC_CONSULTATION_WEBHOOK_URL=https://script.google.com/macros/s/DEF456/exec
PUBLIC_COST_WEBHOOK_URL=https://script.google.com/macros/s/GHI789/exec
PUBLIC_NEWSLETTER_WEBHOOK_URL=https://script.google.com/macros/s/JKL012/exec
PUBLIC_CHECKLIST_WEBHOOK_URL=https://script.google.com/macros/s/MNO345/exec
```

### Your Forms
Each form uses a different webhook:

```javascript
// BMI Calculator
const webhookUrl = import.meta.env.PUBLIC_BMI_WEBHOOK_URL;

// Consultation Form
const webhookUrl = import.meta.env.PUBLIC_CONSULTATION_WEBHOOK_URL;

// Cost Calculator
const webhookUrl = import.meta.env.PUBLIC_COST_WEBHOOK_URL;
```

### Setup Time
**2-3 hours** (need to create 5-6 separate scripts)

---

## Side-by-Side Comparison

| Feature | One Webhook | Multiple Webhooks |
|---------|-------------|-------------------|
| **Setup Time** | 30 min | 2-3 hours |
| **Maintenance** | Easy (one place) | Hard (5-6 places) |
| **Tracking** | All in one sheet | Scattered across sheets |
| **Consistency** | Built-in | Manual effort |
| **Extensibility** | Add new forms easily | Create new webhook each time |
| **Debugging** | One log to check | Multiple logs |
| **.env Complexity** | 1 variable | 5-6 variables |
| **Risk** | Single point of failure | Isolated failures |

---

## Real-World Example

### Scenario: You want to add a new "Book Consultation" form

**With One Webhook:**
1. Add new sheet tab (1 min)
2. Add case to switch statement (2 min)
3. Write email function (5 min)
4. Test (2 min)
**Total: 10 minutes**

**With Multiple Webhooks:**
1. Create new Google Apps Script (2 min)
2. Write entire script from scratch (15 min)
3. Deploy as webhook (2 min)
4. Add new .env variable (1 min)
5. Update form to use new webhook (2 min)
6. Test (2 min)
**Total: 24 minutes**

---

## Recommendation

### Use One Unified Webhook If:
- ✅ You have 3+ forms (you do - BMI, consultation, cost calculator, newsletter, etc.)
- ✅ You want easy maintenance
- ✅ You want centralized tracking
- ✅ You plan to add more forms in the future
- ✅ You want consistent branding across emails

### Use Multiple Webhooks If:
- ✅ You only have 1-2 forms
- ✅ Forms are completely unrelated
- ✅ You need absolute isolation between forms
- ✅ Different teams manage different forms

---

## Your Situation

You have:
- BMI Calculator form
- Consultation forms (multiple pages)
- Cost calculator form
- Newsletter signup
- Surgeon checklist download
- Contact forms

**Verdict: One unified webhook is perfect for you.**

---

## Next Steps

### To Implement One Unified Webhook:

1. **Read:** `UNIFIED-WEBHOOK-SYSTEM.md`
2. **Create:** Google Sheet with multiple tabs
3. **Copy/Paste:** The unified Google Apps Script
4. **Deploy:** Get your webhook URL
5. **Update:** `.env` file with ONE webhook URL
6. **Test:** Each form type
7. **Done!** All forms working with intelligent routing

### Files You Need:
- ✅ `UNIFIED-WEBHOOK-SYSTEM.md` - Complete setup guide
- ✅ `BMI-EMAIL-AUTOMATION-SETUP.md` - BMI-specific details (for reference)
- ✅ `WEBHOOK-SETUP-COMPARISON.md` - This file

---

## Questions?

**Q: What if one form type breaks?**  
A: The script has error handling - other forms continue working. Failed submissions are logged.

**Q: Can I still use multiple webhooks later?**  
A: Yes, but you won't need to. The unified approach is more scalable.

**Q: What about Gmail quota limits?**  
A: Same limits apply (100/day free, 1,500/day paid) regardless of approach.

**Q: Is it harder to customize emails?**  
A: No - each email function is separate, easy to customize independently.

**Q: What if I want different sheets for different forms?**  
A: The unified approach uses tabs in ONE spreadsheet - easier to manage than multiple sheets.

---

## Summary

**One webhook = Better in every way**

- Easier to set up
- Easier to maintain
- Easier to extend
- Better tracking
- More consistent
- More professional

**Go with the unified approach.** 🎯

