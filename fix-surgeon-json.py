#!/usr/bin/env python3
"""Fix JSON syntax errors in surgeon schema markup"""

import os
import re
from pathlib import Path

fixed_count = 0
errors = []

# Find all surgeon .astro files
surgeon_dir = Path('src/pages/surgeons')
for astro_file in surgeon_dir.rglob('*.astro'):
    try:
        with open(astro_file, 'r') as f:
            content = f.read()
        
        original = content
        
        # Fix pattern: closing } followed by comma and newline, then comment/worksFor
        # Should be: closing } then ] to close the array
        pattern = r'("Lap Band")\s*\}\s*,\s*\n\s*\n\s*(//\s*Add hospitals as worksFor)'
        replacement = r'\1\n    }\n  ],\n\n  \2'
        
        content = re.sub(pattern, replacement, content)
        
        if content != original:
            with open(astro_file, 'w') as f:
                f.write(content)
            fixed_count += 1
            print(f"✅ Fixed: {astro_file}")
            
    except Exception as e:
        errors.append(f"{astro_file}: {e}")

print(f"\n🎉 Fixed {fixed_count} surgeon files")
if errors:
    print(f"\n❌ Errors in {len(errors)} files:")
    for error in errors:
        print(f"   {error}")

