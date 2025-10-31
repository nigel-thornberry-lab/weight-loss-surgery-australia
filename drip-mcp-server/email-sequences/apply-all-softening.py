#!/usr/bin/env python3
"""
Apply all CTA softening changes to master file
"""
import re

# Read the natural Email 6A content
with open('EMAIL-6A-NATURAL.md', 'r') as f:
    content_6a = f.read()
    # Extract just the email body
    lines = content_6a.split('\n')
    start_idx = 0
    for i, line in enumerate(lines):
        if line.startswith('Hi {{first_name}}'):
            start_idx = i
            break
    email_6a_body = '\n'.join(lines[start_idx:])
    # Remove metadata
    if '**Word Count:**' in email_6a_body:
        email_6a_body = email_6a_body.split('**Word Count:**')[0].rstrip()

# Read master file
with open('ALL-14-EMAILS-FINAL.md', 'r') as f:
    content = f.read()

print("Starting CTA softening updates...")

# ==================== EMAIL 2A ====================
print("\n1. Updating Email 2A CTA...")

# Find the section after "Important: Don't Choose on Gap Alone"
pattern_2a = r'(\*\*A surgeon \$2,000 more expensive who you trust completely is worth it\.\*\*\n\n---\n\n)(### Ready to Compare\?.*?)(Talk soon,\nCameron)'

replacement_2a = r'''\1## Need Help Choosing?

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

---

\3'''

content = re.sub(pattern_2a, replacement_2a, content, flags=re.DOTALL)
print("   ✅ Email 2A CTA softened")

# ==================== EMAIL 6A ====================
print("\n2. Replacing Email 6A with natural version...")

# Find Email 6A section
pattern_6a = r'(## Email 6A: Free Cost Consultation Offer\n\n\*\*Day 14.*?)(---\n\n## Email 7A:)'

replacement_6a = f'''## Email 6A: Getting More Accurate Numbers

**Day 14 | Subject:** Your ${{{{estimated_cost}}}} Gap - Here's How to Get More Accurate Numbers
**Preheader:** The calculator gives ballpark figures. Here's how to get closer to your actual cost.

---

{email_6a_body}

**Word Count:** ~650 words

---

## Email 7A:'''

content = re.sub(pattern_6a, replacement_6a, content, flags=re.DOTALL)
print("   ✅ Email 6A replaced with natural version")

# ==================== EMAIL 5A ====================
print("\n3. Updating Email 5A CTA...")

# Find the CTA section in Email 5A
pattern_5a = r'(## Compare Verified Surgeons Now\n\n\[View all verified surgeons.*?)(## Why This Matters)'

replacement_5a = r'''## Browse Verified Surgeon Profiles

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

\2'''

content = re.sub(pattern_5a, replacement_5a, content, flags=re.DOTALL)
print("   ✅ Email 5A CTA softened")

# ==================== EMAIL 7A ====================
print("\n4. Updating Email 7A final section...")

# Find the "Your Moment of Decision" section through end of email
pattern_7a = r'(### Your Moment of Decision\n\nYou.*?)(---\n\n# 💰 SELF-FUNDED SEQUENCE)'

replacement_7a = r'''### Where You're At

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

**Word Count:** ~850 words

---

\2'''

content = re.sub(pattern_7a, replacement_7a, content, flags=re.DOTALL)
print("   ✅ Email 7A softened with natural, supportive tone")

# Write the updated content
with open('ALL-14-EMAILS-FINAL.md', 'w') as f:
    f.write(content)

print("\n" + "="*60)
print("✅ ALL CTA SOFTENING COMPLETE!")
print("="*60)
print("\nUpdated sections:")
print("  ✅ Email 2A: Softer 'Chat with us' CTA")
print("  ✅ Email 5A: Softer 'Get help choosing' CTA")
print("  ✅ Email 6A: Natural version (no exact pricing)")
print("  ✅ Email 7A: Supportive, non-pushy tone")
print("\nChanges made:")
print("  • Removed 'exact pricing' promises")
print("  • Removed hard '24-hour call' promises")
print("  • Added 'no obligation' messaging")
print("  • Gave permission to NOT use service")
print("  • Softened button text")
print("  • Natural, helpful tone throughout")
print("\nMaster file updated: ALL-14-EMAILS-FINAL.md")
