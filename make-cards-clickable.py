#!/usr/bin/env python3
"""
Convert pharmacy and accommodation cards to clickable links that open in new window
"""

import re
from pathlib import Path

def convert_to_clickable_card(content):
    """
    Convert div-based cards with internal buttons to fully clickable anchor cards
    """
    changes = 0
    
    # Pattern 1: Pharmacy cards with Get Directions button
    pattern1 = r'<div class="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 border border-gray-200 group">\s*<div class="flex items-start mb-4">\s*<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">\s*<svg class="w-6 h-6 text-blue-600"[^>]*>.*?</svg>\s*</div>\s*<div class="flex-1">\s*<h3 class="font-bold text-gray-900 mb-1 text-lg">([^<]+)</h3>\s*<p class="text-sm text-blue-600 mb-1">([^<]*)</p>\s*<p class="text-sm text-gray-600">([^<]+)</p>\s*</div>\s*</div>\s*<p class="text-sm text-gray-700 mb-4"><strong class="text-blue-600">Best for:</strong> ([^<]+)</p>\s*<div class="flex flex-col sm:flex-row gap-3">\s*<a href="(https://www\.google\.com/maps/search/\?api=1&query=[^"]+)" target="_blank" rel="noopener noreferrer" class="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition text-sm font-medium text-center border border-blue-200">\s*📍 Get Directions\s*</a>\s*<a href="tel:([^"]+)" class="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg transition text-sm font-medium text-center border border-green-200">\s*📞 ([^<]+)\s*</a>\s*</div>\s*</div>'
    
    def replace_pharmacy(match):
        name = match.group(1)
        rating = match.group(2)
        address = match.group(3)
        best_for = match.group(4)
        maps_url = match.group(5)
        tel_number = match.group(6)
        phone_display = match.group(7)
        
        return f'''<a href="{maps_url}" target="_blank" rel="noopener noreferrer" class="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 border border-gray-200 group block">
			<div class="flex items-start mb-4">
				<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
					<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
					</svg>
				</div>
				<div class="flex-1">
					<h3 class="font-bold text-gray-900 mb-1 text-lg group-hover:text-blue-600 transition">{name}</h3>
					<p class="text-sm text-blue-600 mb-1">{rating}</p>
					<p class="text-sm text-gray-600">{address}</p>
				</div>
			</div>
			<p class="text-sm text-gray-700 mb-3"><strong class="text-blue-600">Best for:</strong> {best_for}</p>
			<p class="text-sm text-gray-600">📞 {phone_display}</p>
		</a>'''
    
    new_content = re.sub(pattern1, replace_pharmacy, content, flags=re.DOTALL)
    if new_content != content:
        changes += content.count('Get Directions')
        content = new_content
    
    # Pattern 2: Accommodation cards (similar structure but different content)
    pattern2 = r'<a href="(https://www\.google\.com/maps/search/\?api=1&query=[^"]+)" target="_blank" rel="noopener noreferrer" class="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 border border-gray-200">\s*<h3 class="font-bold text-gray-900 mb-2">([^<]+)</h3>\s*<p class="text-blue-600 text-sm mb-3">([^<]*)</p>\s*<p class="text-gray-700 text-sm mb-2"><strong>Distance:</strong> ([^<]+)</p>\s*<p class="text-gray-700 text-sm mb-2"><strong>From:</strong> ([^<]+)</p>\s*<p class="text-gray-600 text-xs">([^<]+)</p>\s*<p class="text-gray-600 text-xs">📞 ([^<]+)</p>\s*</a>'
    
    # These are already clickable links, so just verify they have target="_blank"
    # They already do based on the pattern, so no changes needed
    
    return content, changes

def main():
    base_path = Path('/Users/Cameron/Desktop/weight-loss-surgery-australia/src/pages/locations')
    
    suburbs = [
        'auburn', 'castle-hill', 'chatswood', 'fairfield', 'hurstville',
        'blacktown', 'liverpool', 'penrith', 'campbelltown', 'bankstown',
        'parramatta', 'dandenong', 'frankston', 'geelong'
    ]
    
    total_fixed = 0
    for suburb in suburbs:
        file_path = base_path / f'{suburb}.astro'
        
        if not file_path.exists():
            print(f"⚠️  {suburb} - file not found")
            continue
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content, changes = convert_to_clickable_card(content)
        
        if changes > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ {suburb} - converted {changes} cards to clickable links")
            total_fixed += changes
        else:
            print(f"⏭️  {suburb} - already has clickable cards")
    
    print(f"\n✨ Total: {total_fixed} cards converted to clickable links")

if __name__ == '__main__':
    main()

