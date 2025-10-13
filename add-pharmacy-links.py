#!/usr/bin/env python3
"""
Batch add website links to pharmacy sections across suburb pages.
This script adds website links in a consistent format for faster processing.
"""

import re
from pathlib import Path

# Define pharmacy URL mappings
PHARMACY_URLS = {
    "Chemist Warehouse": "https://www.chemistwarehouse.com.au",
    "Priceline": "https://www.priceline.com.au",
    "TerryWhite Chemmart": "https://www.terrywhitechemmart.com.au",
    "St Kilda Pharmacy": "https://stkildapharmacy.com.au",
}

# Define suburbs and their pharmacy files to process
SUBURB_FILES = [
    "richmond.astro",
    "st-kilda.astro",
    "sunshine.astro",
    "epping.astro",
    "pakenham.astro",
    "bentleigh.astro",
    "springvale.astro",
    "ringwood.astro",
]

def add_website_link(content, pharmacy_name):
    """Add website link after hours/phone for a pharmacy card"""
    
    # Determine the URL based on pharmacy name
    url = None
    domain = None
    for key, value in PHARMACY_URLS.items():
        if key in pharmacy_name:
            url = value
            domain = value.replace("https://www.", "").replace("https://", "")
            break
    
    if not url:
        print(f"⚠️  No URL mapping for: {pharmacy_name}")
        return content
    
    # SVG icon for website
    website_icon = '''<svg class="w-5 h-5 text-gray-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
\t\t\t\t\t\t<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 919-9" />
\t\t\t\t\t</svg>'''
    
    website_link_html = f'''
\t\t\t\t\t<div class="flex items-start">
\t\t\t\t\t\t{website_icon}
\t\t\t\t\t\t<a href="{url}" target="_blank" rel="noopener noreferrer" class="text-[#6c95ef] hover:text-[#5a7fd8] text-sm">{domain}</a>
\t\t\t\t\t</div>'''
    
    # Pattern: Find the pharmacy card and add website link before the "Stock:" section
    # Look for hours line followed by Stock section
    pattern = rf'({re.escape(pharmacy_name)}.*?<p class="text-sm text-gray-700">.*?</p>\s*</div>)(.*?<div class="mt-3 p-2 bg-white rounded text-xs text-gray-600">)'
    
    def replacement(match):
        before = match.group(1)
        after = match.group(2)
        # Only add if not already present
        if url in before or url in after:
            return match.group(0)  # Already has website link
        return before + website_link_html + after
    
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    if new_content != content:
        print(f"✅ Added website link for {pharmacy_name}")
    else:
        print(f"ℹ️  No changes for {pharmacy_name} (may already exist)")
    
    return new_content

def process_file(filepath):
    """Process a single suburb file to add pharmacy website links"""
    print(f"\n📄 Processing {filepath.name}...")
    
    try:
        content = filepath.read_text()
        
        # Find all pharmacy names in the file
        pharmacies = []
        for name in PHARMACY_URLS.keys():
            if name in content:
                # Count occurrences
                count = content.count(f'<h3 class="text-xl font-bold text-gray-900 mb-4">{name}')
                if count > 0:
                    pharmacies.append(name)
        
        if not pharmacies:
            print(f"⚠️  No pharmacies found in {filepath.name}")
            return False
        
        print(f"Found pharmacies: {', '.join(pharmacies)}")
        
        # Add links for each pharmacy
        for pharmacy in pharmacies:
            content = add_website_link(content, pharmacy)
        
        # Write back
        filepath.write_text(content)
        print(f"✅ {filepath.name} updated successfully")
        return True
        
    except Exception as e:
        print(f"❌ Error processing {filepath.name}: {e}")
        return False

def main():
    """Main function to process all suburb files"""
    print("=" * 60)
    print("🔗 Adding Pharmacy Website Links - Batch Processor")
    print("=" * 60)
    
    base_dir = Path(__file__).parent / "src" / "pages" / "locations"
    
    if not base_dir.exists():
        print(f"❌ Directory not found: {base_dir}")
        return
    
    success_count = 0
    for filename in SUBURB_FILES:
        filepath = base_dir / filename
        if filepath.exists():
            if process_file(filepath):
                success_count += 1
        else:
            print(f"⚠️  File not found: {filename}")
    
    print("\n" + "=" * 60)
    print(f"✅ Processing complete: {success_count}/{len(SUBURB_FILES)} files updated")
    print("=" * 60)

if __name__ == "__main__":
    main()

