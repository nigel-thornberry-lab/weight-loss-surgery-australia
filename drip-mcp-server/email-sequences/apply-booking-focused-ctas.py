#!/usr/bin/env python3
"""
Apply booking-focused CTAs (simple coordination, not consultation about choosing surgeons)
"""
import re

# Read the booking-focused Email 6A
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

print("Starting booking-focused CTA updates...")

# ==================== EMAIL 2A ====================
print("\n1. Updating Email 2A CTA (booking-focused)...")

pattern_2a = r'(## Need Help Choosing\?.*?)(---\n\nTalk soon,\nCameron)'

replacement_2a = r'''## Ready to Book a Consultation?

All the surgeons we list are qualified and verified.

**Two ways to book:**

### 1. Book Directly
Browse surgeon profiles and contact their practice directly to book your consultation.

[View all surgeons in {{location}} →]

### 2. Get Help Booking
Not sure which surgeon to start with? We can help coordinate.

[Get help booking →]

We'll give you a quick call (5-10 min) to help you book with a surgeon's practice and answer basic questions about the consultation process.

**Either way works - whatever you prefer.**

---

Talk soon,
Cameron'''

content = re.sub(pattern_2a, replacement_2a, content, flags=re.DOTALL)
print("   ✅ Email 2A CTA updated (simple booking coordination)")

# ==================== EMAIL 6A ====================
print("\n2. Replacing Email 6A with booking-focused version...")

pattern_6a = r'(## Email 6A:.*?)(---\n\n## Email 7A:)'

replacement_6a = f'''## Email 6A: Getting More Accurate Numbers

**Day 14 | Subject:** Your ${{{{estimated_cost}}}} Gap - Here's How to Get More Accurate Numbers
**Preheader:** The calculator gives ballpark figures. Here's how to get closer to your actual cost.

---

{email_6a_body}

**Word Count:** ~650 words

---

## Email 7A:'''

content = re.sub(pattern_6a, replacement_6a, content, flags=re.DOTALL)
print("   ✅ Email 6A replaced with booking-focused version")

# ==================== EMAIL 5A ====================
print("\n3. Updating Email 5A CTA (booking-focused)...")

pattern_5a = r'(## Browse Verified Surgeon Profiles.*?)(\n\n---\n\n## Why This Matters)'

replacement_5a = r'''## Browse Verified Surgeon Profiles

[View all verified surgeons in {{location}} →]

**On each profile you'll see:**
- Complete credentials (AHPRA, FRACS, OSSANZ)
- Hospital affiliations
- Health fund participation
- Years of experience
- Last verified date

**Ready to book a consultation?**

You can contact surgeon practices directly, or if you'd like help coordinating:

[Get help booking →]

We'll give you a quick call to help you book with a surgeon's practice and answer basic questions about what to expect.

**Either way works - choose what's easier for you.**

---

## Why This Matters'''

content = re.sub(pattern_5a, replacement_5a, content, flags=re.DOTALL)
print("   ✅ Email 5A CTA updated (simple booking help)")

# ==================== EMAIL 7A ====================
print("\n4. Updating Email 7A final section (booking-focused)...")

pattern_7a = r'(### Where You.*?Path 2: Take a Next Step\n\nIf you.*?)(- .*?\n- .*?\n- .*?\n\n\[.*?\])'

replacement_7a = r'''\1- Book a consultation with a surgeon (directly or with our help)
- Get your exact gap quote from the surgeon's practice
- Discuss your specific situation with the surgeon

[Get help booking a consultation →]'''

content = re.sub(pattern_7a, replacement_7a, content, flags=re.DOTALL)
print("   ✅ Email 7A updated with booking-focused CTA")

# Write the updated content
with open('ALL-14-EMAILS-FINAL.md', 'w') as f:
    f.write(content)

print("\n" + "="*60)
print("✅ ALL BOOKING-FOCUSED CTA UPDATES COMPLETE!")
print("="*60)
print("\nUpdated positioning:")
print("  ✅ Email 2A: Simple booking coordination")
print("  ✅ Email 5A: Basic booking help")
print("  ✅ Email 6A: Booking-focused (no gap estimates)")
print("  ✅ Email 7A: Booking coordination CTA")
print("\nWhat you offer:")
print("  • Help booking consultations with surgeon practices")
print("  • Answer basic questions about the consultation process")
print("  • Coordinate on their behalf (5-10 min calls)")
print("\nWhat you DON'T offer:")
print("  • Gap estimates or pricing discussions")
print("  • Deep consultations about which surgeon is 'best'")
print("  • Insurance verification")
print("  • Payment plan advice")
print("\nMaster file updated: ALL-14-EMAILS-FINAL.md")
