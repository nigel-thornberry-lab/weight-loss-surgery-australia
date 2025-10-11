#!/usr/bin/env python3
"""
Template the gastric band cost page using the gastric sleeve template.
Preserves band-specific frontmatter while applying sleeve's Tailwind visual framework.
"""

# Read the sleeve template
with open('src/pages/costs/gastric-sleeve-cost-australia.astro', 'r') as f:
    template = f.read()

# Read the band page to extract frontmatter
with open('src/pages/costs/gastric-band-cost-australia.astro', 'r') as f:
    band_content = f.read()

# Extract band frontmatter (everything before <!DOCTYPE html>)
band_frontmatter = band_content.split('<!DOCTYPE html>')[0]

# Extract sleeve HTML template (everything from <html lang="en-AU"> onwards)
template_html = template[template.find('<html lang="en-AU">'):]

# Replace sleeve-specific content with band-specific content
replacements = [
    ('Gastric Sleeve', 'Gastric Band'),
    ('gastric-sleeve', 'gastric-band'),
    ('Sleeve Gastrectomy', 'Lap Band'),
    ('sleeve gastrectomy', 'lap band'),

    # Prices
    ('$3,500 - $7,000', '$3,500 - $6,000'),
    ('$15,000 - $20,000', '$12,000 - $20,000'),
    ('$3,500 - $20,000', '$3,500 - $20,000'),

    # Medicare rebate
    ('$663', '$743'),
    ('30514', '31569'),

    # Surgery details
    ('1-2 hours', '45-60 minutes'),
    ('1-2 nights', 'Day surgery or 1 night'),

    # Weight loss
    ('55-65%', '40-50%'),
    ('60-65%', '40-50%'),
    ('60-70%', '45-60%'),

    # Vitamins - IMPORTANT: Band has LOWER vitamin costs than sleeve
    ('$400-$800/year', '$200-$400/year'),
    ('$50-$100/month', '$20-$40/month'),

    # Additional band-specific replacements
    ('permanent stomach alteration', 'reversible band placement'),
    ('Permanent procedure', 'Reversible procedure'),
    ('permanent procedure', 'reversible procedure'),
]

# Apply replacements
new_html = template_html
for old, new in replacements:
    new_html = new_html.replace(old, new)

# Combine band frontmatter + modified template
final_content = band_frontmatter + new_html

# Write new file
with open('src/pages/costs/gastric-band-cost-australia-NEW.astro', 'w') as f:
    f.write(final_content)

print("✅ Created gastric-band-cost-australia-NEW.astro")
print("   - Preserved band frontmatter (metadata, FAQs, schema)")
print("   - Applied sleeve page's Tailwind visual framework")
print("   - Updated all prices and procedure-specific details")
