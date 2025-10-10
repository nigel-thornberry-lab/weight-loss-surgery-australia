#!/usr/bin/env python3
"""Fix extra closing brackets after worksFor arrays"""

import os
import re
from pathlib import Path

fixed_count = 0

# Find all surgeon .astro files
surgeon_dir = Path('src/pages/surgeons')
for astro_file in surgeon_dir.rglob('*.astro'):
    try:
        with open(astro_file, 'r') as f:
            content = f.read()
        
        original = content
        
        # Fix pattern: })) || [] followed by extra ]
        pattern = r'(\}\)\) \|\| \[\])\s*\n\s*\]\s*\n(\s*\};)'
        replacement = r'\1\n\2'
        
        content = re.sub(pattern, replacement, content)
        
        if content != original:
            with open(astro_file, 'w') as f:
                f.write(content)
            fixed_count += 1
            print(f"✅ Fixed: {astro_file}")
            
    except Exception as e:
        print(f"❌ Error in {astro_file}: {e}")

print(f"\n🎉 Fixed {fixed_count} surgeon files with extra brackets")

