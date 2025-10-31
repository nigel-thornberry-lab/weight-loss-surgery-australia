#!/usr/bin/env python3
"""
Update ALL-14-EMAILS-FINAL.md with revised emails 2A, 5A, 6A, 7A
"""

# Read revised email files
with open('EMAIL-2A-REVISED.md', 'r') as f:
    email_2a_revised = f.read().split('---\n\n')[1]  # Skip header
    # Remove metadata
    email_2a_revised = email_2a_revised.split('\n**Word Count:**')[0].rstrip() + '\n\n**Word Count:** ~580 words'

with open('EMAIL-5A-REVISED.md', 'r') as f:
    email_5a_revised = f.read().split('---\n\n')[1]  # Skip header
    # Remove metadata
    email_5a_revised = email_5a_revised.split('\n**Word Count:**')[0].rstrip() + '\n\n**Word Count:** ~820 words'

with open('EMAIL-6A-REVISED.md', 'r') as f:
    email_6a_revised = f.read().split('---\n\n')[1]  # Skip header
    # Remove metadata
    email_6a_revised = email_6a_revised.split('\n**Word Count:**')[0].rstrip() + '\n\n**Word Count:** ~820 words'

with open('EMAIL-7A-REVISED.md', 'r') as f:
    email_7a_revised = f.read().split('---\n\n')[1]  # Skip header
    # Remove metadata
    email_7a_revised = email_7a_revised.split('\n**Word Count:**')[0].rstrip() + '\n\n**Word Count:** ~980 words'

# Read main file
with open('ALL-14-EMAILS-FINAL.md', 'r') as f:
    lines = f.readlines()

# Find section boundaries
sections = {}
current_section = None
for i, line in enumerate(lines):
    if line.startswith('## Email 2A:'):
        sections['2A_start'] = i
    elif line.startswith('## Email 3A:'):
        sections['2A_end'] = i
    elif line.startswith('## Email 5A:'):
        sections['5A_start'] = i
    elif line.startswith('## Email 6A:'):
        sections['5A_end'] = i
        sections['6A_start'] = i
    elif line.startswith('## Email 7A:'):
        sections['6A_end'] = i
        sections['7A_start'] = i
    elif line.startswith('# 💰 SELF-FUNDED SEQUENCE'):
        sections['7A_end'] = i

print(f"Found sections: {sections}")

# Build new content
new_lines = []

# Keep everything before Email 2A
new_lines.extend(lines[:sections['2A_start']])

# Add revised Email 2A
new_lines.append('## Email 2A: We\'ve Compared Surgeon Gaps For You\n\n')
new_lines.append(email_2a_revised)
new_lines.append('\n\n---\n\n')

# Add Email 3A and 4A unchanged
new_lines.extend(lines[sections['2A_end']:sections['5A_start']])

# Add revised Email 5A
new_lines.append('## Email 5A: Every Surgeon Profile is Pre-Verified\n\n')
new_lines.append(email_5a_revised)
new_lines.append('\n\n---\n\n')

# Add revised Email 6A
new_lines.append('## Email 6A: We\'ll Call You With Exact Pricing\n\n')
new_lines.append(email_6a_revised)
new_lines.append('\n\n---\n\n')

# Add revised Email 7A
new_lines.append('## Email 7A: One Click. We\'ll Call You.\n\n')
new_lines.append(email_7a_revised)
new_lines.append('\n\n---\n\n')

# Add everything after Email 7A
if '7A_end' in sections:
    new_lines.extend(lines[sections['7A_end']:])

# Write updated file
with open('ALL-14-EMAILS-FINAL.md', 'w') as f:
    f.writelines(new_lines)

print("✅ All emails updated successfully!")
print(f"  - Email 2A: Updated")
print(f"  - Email 5A: Updated")
print(f"  - Email 6A: Updated")
print(f"  - Email 7A: Updated")
