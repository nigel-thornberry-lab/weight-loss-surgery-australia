#!/usr/bin/env python3
"""
Fix gastric bypass cost page - properly apply the sleeve template.
"""

# Read the sleeve template
with open('src/pages/costs/gastric-sleeve-cost-australia.astro', 'r') as f:
    sleeve_content = f.read()

# Read the current bypass page to extract frontmatter
with open('src/pages/costs/gastric-bypass-cost-australia.astro', 'r') as f:
    bypass_content = f.read()

# Extract bypass frontmatter (everything before and including the closing ---)
bypass_frontmatter = bypass_content.split('---')[0] + '---\n' + bypass_content.split('---')[1] + '---\n'

# Extract sleeve HTML (everything after the closing ---)
sleeve_parts = sleeve_content.split('---')
sleeve_html = '---'.join(sleeve_parts[2:])  # Everything after the second ---

# Replace sleeve-specific content with bypass-specific content
replacements = [
    ('Gastric Sleeve', 'Gastric Bypass'),
    ('gastric-sleeve', 'gastric-bypass'),
    ('Sleeve Gastrectomy', 'Roux-en-Y Gastric Bypass'),

    # Prices
    ('$3,500 - $7,000', '$4,500 - $7,624'),
    ('$15,000 - $20,000', '$18,000 - $26,000'),

    # Medicare rebate
    ('$663', '$816'),
    ('30514', '30515'),

    # Surgery details
    ('1-2 hours', '2-4 hours'),
    ('1-2 nights', '2-3 nights'),

    # Weight loss
    ('55-65%', '65-75%'),
    ('60-65%', '65-75%'),
    ('60-70%', '75-85%'),

    # Vitamins - bypass has HIGHER costs
    ('$400-$800/year', '$600-$1,200/year'),
    ('$50-$100/month', '$50-$100/month'),  # Keep same
]

# Apply replacements
new_html = sleeve_html
for old, new in replacements:
    new_html = new_html.replace(old, new)

# Combine bypass frontmatter + modified HTML
final_content = bypass_frontmatter + new_html

# Write the complete file
with open('src/pages/costs/gastric-bypass-cost-australia.astro', 'w') as f:
    f.write(final_content)

print("✅ Fixed gastric-bypass-cost-australia.astro")
print("   - Preserved bypass frontmatter")
print("   - Applied sleeve HTML template")
print("   - Updated procedure-specific content")
