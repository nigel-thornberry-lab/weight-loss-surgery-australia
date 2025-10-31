#!/usr/bin/env python3
"""
Soften CTAs across email sequence - make more natural and less pushy
"""

# Read the natural Email 6A
with open('EMAIL-6A-NATURAL.md', 'r') as f:
    email_6a_natural = f.read().split('---\n\n')[1]  # Skip header
    email_6a_natural = email_6a_natural.split('\n**Word Count:**')[0].rstrip() + '\n\n**Word Count:** ~650 words'

# Read master file
with open('ALL-14-EMAILS-FINAL.md', 'r') as f:
    content = f.read()

# Find and replace Email 6A with natural version
import re

# Replace Email 6A
pattern_6a = r'(## Email 6A:.*?)(\n\n---\n\n## Email 7A:)'
match_6a = re.search(pattern_6a, content, re.DOTALL)
if match_6a:
    new_6a = '## Email 6A: Getting More Accurate Numbers\n\n' + email_6a_natural + '\n\n---\n'
    content = content[:match_6a.start()] + new_6a + content[match_6a.start(2):]
    print("✅ Email 6A replaced with natural version")
else:
    print("❌ Could not find Email 6A")

# Soften Email 2A CTA
pattern_2a_cta = r'(\*\*Want us to help narrow it down\?\*\*.*?)\n\n---'
replace_2a_cta = '''## Need Help Choosing?

All the surgeons we list are qualified - but which one is right for YOU?

Some things to consider:
- Gap amount vs your budget
- Location convenience
- Communication style preference
- Hospital preferences
- Health fund participation

**If you'd like to talk through your options with someone who knows these surgeons:**

[Chat with us about surgeons in {{location}} →]

We'll give you a call to discuss which ones might be the best fit for your situation. No obligation - just helpful guidance.

**Or browse and decide on your own** - that works too. You don't need us to make a good choice.

---'''

match_2a = re.search(pattern_2a_cta, content, re.DOTALL)
if match_2a:
    content = content[:match_2a.start(1)] + replace_2a_cta
    print("✅ Email 2A CTA softened")
else:
    print("⚠️  Email 2A CTA pattern not found (may need manual update)")

# Soften Email 5A CTA
pattern_5a_cta = r'(## Compare Verified Surgeons Now.*?)\n\n---\n\n## Why This Matters'
replace_5a_cta = '''## Browse Verified Surgeon Profiles

[View all verified surgeons in {{location}} →]

**On each profile you'll see:**
- Complete credentials (AHPRA, FRACS, OSSANZ)
- Hospital affiliations
- Gap range estimate
- Health fund participation
- Last verified date

**If you want help choosing between them:**

[Get help choosing a surgeon →]

We'll call you to discuss the pros/cons of different surgeons based on your situation (gap budget, location, insurance, preferences).

**Or just browse and pick one yourself** - you have all the info you need to make a good decision.

---

## Why This Matters'''

match_5a = re.search(pattern_5a_cta, content, re.DOTALL)
if match_5a:
    content = content[:match_5a.start(1)] + replace_5a_cta + '\n\n' + content[match_5a.start(2):]
    print("✅ Email 5A CTA softened")
else:
    print("⚠️  Email 5A CTA pattern not found (may need manual update)")

# Soften Email 7A final section
pattern_7a = r'(### Your Moment of Decision.*?)(\n\n---\n\n# 💰 SELF-FUNDED)'
replace_7a = '''### Where You're At

You've spent 3 weeks researching. You have:
- ✅ Understanding of costs
- ✅ Knowledge of payment options
- ✅ Verified surgeon profiles to review
- ✅ Information about the process

**Two paths from here:**

**Path 1: Keep Researching**

Maybe you're not quite ready. That's completely fine.
- Save this email for later
- Come back when the timing is right
- We'll still be here

**Path 2: Take a Next Step**

If you're leaning toward doing this, common next steps are:
- Chat with us about surgeon selection
- Book a consultation with a surgeon directly
- Discuss timeline and planning with someone who knows the process

[I'd like to discuss my options →]

**Or don't.** This is a big decision. Only move forward when you're genuinely ready.

---

### One More Thing

**From the research on long-term satisfaction:**
- 82.4% satisfied 5 years after surgery¹
- 65% say they would do it again¹

Most patients don't regret having surgery.

They regret waiting longer than they needed to because of fear or uncertainty.

**But "when you're ready" is different for everyone.**

Some people research for months. Others know quickly. Both are fine.

We're here when you need us. No pressure.

---

Talk soon,
Cameron
BariatricSurgeryHub

**P.S.** This is my last email focused on cost and logistics. You'll hear from us occasionally with educational content, but no more "decision time" emails. If you want help at any point - even 6 months from now - just reply or visit the site. We're here.

**¹** Bariatric surgery satisfaction rates: PubMed study data on 5-year and 10-year post-operative outcomes

**Word Count:** ~850 words'''

match_7a = re.search(pattern_7a, content, re.DOTALL)
if match_7a:
    content = content[:match_7a.start(1)] + replace_7a + '\n\n---\n\n# 💰 SELF-FUNDED'
    print("✅ Email 7A softened with natural tone")
else:
    print("⚠️  Email 7A pattern not found (may need manual update)")

# Write updated content
with open('ALL-14-EMAILS-FINAL.md', 'w') as f:
    f.write(content)

print("\n✅ All CTA softening complete!")
print("   - Email 2A: Softer CTA")
print("   - Email 5A: Softer CTA")
print("   - Email 6A: Natural version (no exact pricing)")
print("   - Email 7A: Supportive, non-pushy tone")
