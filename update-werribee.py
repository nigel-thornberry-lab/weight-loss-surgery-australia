#!/usr/bin/env python3
"""Update Werribee page with real data quickly"""

import re

# Read the file
with open('src/pages/locations/werribee.astro', 'r') as f:
    content = f.read()

# Replace all remaining Geelong references
replacements = [
    (r'Geelong', 'Werribee'),
    (r'geelongSurgeons', 'werribeeSurgeons'),
    (r'regional Victoria', 'Western Melbourne'),
    (r"Victoria's second-largest city", "Melbourne's growing western hub"),
    (r'Epworth Geelong and University Hospital Geelong provide state-of-the-art', 'St Vincent\'s Private Hospital Werribee provides state-of-the-art'),
]

for old, new in replacements:
    content = re.sub(old, new, content)

# Write back
with open('src/pages/locations/werribee.astro', 'w') as f:
    f.write(content)

print("✅ Updated Werribee page with global replacements")

