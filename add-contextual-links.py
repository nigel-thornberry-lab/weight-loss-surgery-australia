#!/usr/bin/env python3
"""
Add "Still Deciding?" contextual link sections to all procedure pages
"""

import os
import re

# Pages that already have the section
COMPLETED_PAGES = [
    'gastric-sleeve.astro',
    'gastric-bypass.astro',
    'gastric-band.astro'
]

# Template for the "Still Deciding?" section
TEMPLATE = '''
		<!-- Still Deciding Section -->
		<section class="py-12 bg-gradient-to-br from-blue-50 to-purple-50">
			<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">Still Deciding on the Right Procedure?</h2>
				<p class="text-lg text-gray-600 mb-8 text-center">Compare your options to find the best fit for you</p>
				
				<div class="grid md:grid-cols-3 gap-6">
					<a href="/compare/gastric-sleeve-vs-gastric-bypass" class="block p-6 bg-white rounded-lg shadow-sm hover:shadow-lg transition group">
						<div class="flex items-center mb-3">
							<svg class="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
							</svg>
							<h3 class="font-bold text-lg text-gray-900 group-hover:text-blue-600">Sleeve vs Bypass</h3>
						</div>
						<p class="text-gray-600 text-sm">Compare the two most popular procedures: weight loss results, recovery time, and which is right for you.</p>
						<p class="text-blue-600 font-semibold mt-3 text-sm">Read comparison →</p>
					</a>

					<a href="/compare/surgery-vs-medication" class="block p-6 bg-white rounded-lg shadow-sm hover:shadow-lg transition group">
						<div class="flex items-center mb-3">
							<svg class="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
							<h3 class="font-bold text-lg text-gray-900 group-hover:text-purple-600">Surgery vs Medication</h3>
						</div>
						<p class="text-gray-600 text-sm">Compare surgery with GLP-1 medications like Ozempic. See 5-year costs and long-term effectiveness.</p>
						<p class="text-purple-600 font-semibold mt-3 text-sm">Compare options →</p>
					</a>

					<a href="/faq" class="block p-6 bg-white rounded-lg shadow-sm hover:shadow-lg transition group">
						<div class="flex items-center mb-3">
							<svg class="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
							<h3 class="font-bold text-lg text-gray-900 group-hover:text-green-600">100+ Questions Answered</h3>
						</div>
						<p class="text-gray-600 text-sm">Get comprehensive answers about costs, eligibility, recovery, insurance coverage, and life after surgery.</p>
						<p class="text-green-600 font-semibold mt-3 text-sm">Browse all FAQs →</p>
					</a>
				</div>
			</div>
		</section>
'''

def add_contextual_links(file_path):
    """Add contextual links section before the FAQ section"""
    
    # Read file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already has the section
    if '<!-- Still Deciding Section -->' in content:
        print(f"  ✓ Already has contextual links section")
        return False
    
    # Find the FAQ section marker (try multiple patterns)
    faq_patterns = [
        r'(\t*</section>\s*\n\s*<!-- FAQs -->)',
        r'(\t*</section>\s*\n\s*<!-- FAQ Section -->)',
        r'(\n\s*<!-- FAQs -->)',
        r'(\n\s*<!-- FAQ Section -->)'
    ]
    
    match = None
    matched_pattern = None
    
    for pattern in faq_patterns:
        match = re.search(pattern, content)
        if match:
            matched_pattern = pattern
            break
    
    if not match:
        print(f"  ✗ Could not find FAQ section marker")
        return False
    
    # Insert the template before the FAQ section
    # Determine what marker was found and what to replace with
    if '<!-- FAQs -->' in match.group(1):
        replacement = '\t</section>\n' + TEMPLATE + '\n\t\t<!-- FAQs -->'
    else:
        replacement = '\t</section>\n' + TEMPLATE + '\n\t\t<!-- FAQ Section -->'
    
    new_content = content[:match.start(1)] + replacement + content[match.end():]
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"  ✓ Added contextual links section")
    return True


def main():
    procedures_dir = 'src/pages/procedures'
    
    if not os.path.exists(procedures_dir):
        print(f"Error: {procedures_dir} not found")
        return
    
    # Get all .astro files in the procedures directory
    files = [f for f in os.listdir(procedures_dir) if f.endswith('.astro')]
    
    print(f"\n🔗 Adding contextual links to procedure pages...\n")
    print(f"Found {len(files)} procedure pages\n")
    
    updated_count = 0
    skipped_count = 0
    
    for filename in sorted(files):
        file_path = os.path.join(procedures_dir, filename)
        print(f"Processing: {filename}")
        
        if filename in COMPLETED_PAGES:
            print(f"  ⏭  Skipping (already manually updated)")
            skipped_count += 1
            continue
        
        if add_contextual_links(file_path):
            updated_count += 1
        else:
            skipped_count += 1
    
    print(f"\n{'='*60}")
    print(f"✅ Complete!")
    print(f"   Updated: {updated_count} pages")
    print(f"   Skipped: {skipped_count} pages")
    print(f"{'='*60}\n")


if __name__ == '__main__':
    main()

