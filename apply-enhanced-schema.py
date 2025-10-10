#!/usr/bin/env python3
"""
Script to apply enhanced schema markup to all surgeon pages
Fixes critical SEO gaps by adding comprehensive schema.org markup
"""

import os
import re
import glob

def enhance_surgeon_page_schema(file_path):
    """
    Adds enhanced schema markup to a surgeon page
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if already enhanced
    if 'organizationSchema' in content:
        print(f"✓ Already enhanced: {file_path}")
        return False

    # Find the existing physicianSchema definition
    physician_schema_pattern = r'// Comprehensive Schema\.org structured data\nconst physicianSchema = \{'

    if not re.search(physician_schema_pattern, content):
        print(f"⚠ Pattern not found in: {file_path}")
        return False

    # Replacement text with enhanced schema
    enhanced_schema = '''// ===== ENHANCED SCHEMA.ORG STRUCTURED DATA =====
// Captures 100% of SERP real estate with comprehensive schema markup

// 1. Organization Schema - Establishes site authority
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  "@id": "https://weightlosssurgery.com.au/#organization",
  "name": "Weight Loss Surgery Australia",
  "url": "https://weightlosssurgery.com.au",
  "logo": {
    "@type": "ImageObject",
    "url": "https://weightlosssurgery.com.au/logo.png"
  },
  "description": "Australia's leading directory of qualified bariatric surgeons",
  "medicalSpecialty": "Bariatric Surgery"
};

// 2. Enhanced Physician Schema with comprehensive details
const physicianSchema = {'''

    content = re.sub(
        physician_schema_pattern,
        enhanced_schema,
        content,
        count=1
    )

    # Update the physicianSchema to include enhanced fields
    old_physician_end = r'  "medicalSpecialty": "Bariatric Surgery",\n  "availableService": \['
    new_physician_end = '''  "medicalSpecialty": ["Bariatric Surgery", "Weight Loss Surgery", "General Surgery"],

  // Add credentials
  "hasCredential": enhanced?.credentials?.fellowships?.map(fellowship => ({
    "@type": "EducationalOccupationalCredential",
    "credentialCategory": "Fellowship",
    "name": fellowship
  })) || [],

  // Add education
  "alumniOf": enhanced?.credentials?.medical_school ? {
    "@type": "EducationalOrganization",
    "name": enhanced.credentials.medical_school
  } : undefined,

  // Add years of experience
  "yearsOfExperience": enhanced?.credentials?.years_practicing || surgeon.years_experience,

  // Add professional memberships
  "memberOf": enhanced?.credentials?.professional_memberships?.map(org => ({
    "@type": "Organization",
    "name": org
  })) || [],

  // Add procedures offered
  "availableService": ['''

    content = re.sub(
        old_physician_end,
        new_physician_end,
        content,
        count=1
    )

    # Update availableService to include alternate names
    old_gastric_sleeve = r'\{\n      "@type": "MedicalProcedure",\n      "name": "Gastric Sleeve Surgery",\n      "alternateName": "Sleeve Gastrectomy"\n    \}'
    new_gastric_sleeve = '''{
      "@type": "MedicalProcedure",
      "name": "Gastric Sleeve Surgery",
      "alternateName": ["Sleeve Gastrectomy", "VSG"]
    }'''
    content = content.replace(old_gastric_sleeve, new_gastric_sleeve)

    old_gastric_bypass = r'\{\n      "@type": "MedicalProcedure",\n      "name": "Gastric Bypass Surgery",\n      "alternateName": "Roux-en-Y Gastric Bypass"\n    \}'
    new_gastric_bypass = '''{
      "@type": "MedicalProcedure",
      "name": "Gastric Bypass Surgery",
      "alternateName": ["Roux-en-Y Gastric Bypass", "RYGB"]
    }'''
    content = content.replace(old_gastric_bypass, new_gastric_bypass)

    old_gastric_band = r'\{\n      "@type": "MedicalProcedure",\n      "name": "Gastric Band Surgery",\n      "alternateName": "Lap Band"\n    \}'
    new_gastric_band = '''{
      "@type": "MedicalProcedure",
      "name": "Gastric Band Surgery",
      "alternateName": ["Lap Band", "Adjustable Gastric Band"]
    },
    {
      "@type": "MedicalProcedure",
      "name": "Revision Bariatric Surgery"
    }'''
    content = content.replace(old_gastric_band, new_gastric_band)

    # Add hospitals as worksFor (before the closing of availableService array)
    insert_point = content.find('  ]\n};', content.find('availableService'))
    if insert_point > 0:
        hospitals_field = ''',

  // Add hospitals as worksFor
  "worksFor": enhanced?.hospitals?.map(hospital => ({
    "@type": "Hospital",
    "name": hospital.name,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": hospital.address || "",
      "addressCountry": "AU"
    }
  })) || []'''
        content = content[:insert_point] + hospitals_field + '\n' + content[insert_point:]

    # Add MedicalBusiness schema after aggregateRating
    medical_business_pattern = r'(if \(surgeon\.rating > 0 && surgeon\.review_count > 0\) \{\n  physicianSchema\.aggregateRating = \{[^}]+\};\n\})\n\nconst faqSchema'

    medical_business_replacement = r'''\1

// 3. Medical Business Schema for local SEO
const medicalBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": `${cleanName} - Bariatric Surgery Practice`,
  "image": surgeon.surgeon_photo ? `https://weightlosssurgery.com.au${surgeon.surgeon_photo.replace('/public/', '/')}` : undefined,
  "telephone": surgeon.phone,
  "url": surgeon.website,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": surgeon.street,
    "addressLocality": surgeon.city,
    "addressRegion": surgeon.state,
    "addressCountry": "AU"
  },
  "priceRange": "$$$$",
  "paymentAccepted": ["Cash", "Credit Card", "Medicare", "Private Health Insurance"],
  "currenciesAccepted": "AUD",
  "medicalSpecialty": "Bariatric Surgery",
  "aggregateRating": surgeon.rating > 0 ? {
    "@type": "AggregateRating",
    "ratingValue": surgeon.rating,
    "reviewCount": surgeon.review_count,
    "bestRating": "5",
    "worstRating": "1"
  } : undefined
};

const faqSchema'''

    content = re.sub(
        medical_business_pattern,
        medical_business_replacement,
        content,
        flags=re.DOTALL
    )

    # Update schema injection in HTML
    old_schema_injection = r'  <!-- Comprehensive Schema\.org Structured Data -->\n  <script type="application/ld\+json" set:html=\{JSON\.stringify\(physicianSchema\)\} />\n  <script type="application/ld\+json" set:html=\{JSON\.stringify\(breadcrumbSchema\)\} />\n  \{faqSchema && <script type="application/ld\+json" set:html=\{JSON\.stringify\(faqSchema\)\} />\}'

    new_schema_injection = '''  <!-- Enhanced Schema.org Structured Data - Captures 100% of SERP Features -->
  <script type="application/ld+json" set:html={JSON.stringify(organizationSchema)} />
  <script type="application/ld+json" set:html={JSON.stringify(physicianSchema)} />
  <script type="application/ld+json" set:html={JSON.stringify(medicalBusinessSchema)} />
  <script type="application/ld+json" set:html={JSON.stringify(breadcrumbSchema)} />
  {faqSchema && <script type="application/ld+json" set:html={JSON.stringify(faqSchema)} />}'''

    content = re.sub(
        old_schema_injection,
        new_schema_injection,
        content
    )

    # Write back the enhanced content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✅ Enhanced: {file_path}")
    return True

def analyze_title_lengths(file_path):
    """
    Analyze title tag length for SEO optimization
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find title definition
    title_match = re.search(r'const title = `([^`]+)`;', content)
    if title_match:
        title_template = title_match.group(1)
        # Estimate max length (using longest common surgeon name)
        max_estimate = title_template.replace('${cleanName}', 'Associate Professor Christopher Smith')
        max_estimate = max_estimate.replace('${surgeon.city}', 'Campbelltown')
        max_estimate = max_estimate.replace('${surgeon.state}', 'NSW')
        max_estimate_length = len(max_estimate)

        return title_template, max_estimate_length
    return None, 0

def main():
    print("=" * 60)
    print("ENHANCED SCHEMA MARKUP APPLICATION SCRIPT")
    print("Fixing Critical SEO Gaps on Surgeon Pages")
    print("=" * 60)
    print()

    # Find all surgeon pages
    surgeon_pages = []
    patterns = [
        'src/pages/surgeons/**/aprof-*.astro',
        'src/pages/surgeons/**/dr-*.astro',
        'src/pages/surgeons/**/mr-*.astro',
        'src/pages/surgeons/**/professor-*.astro',
        'src/pages/surgeons/**/reginald-*.astro'
    ]

    for pattern in patterns:
        surgeon_pages.extend(glob.glob(pattern, recursive=True))

    surgeon_pages = list(set(surgeon_pages))  # Remove duplicates
    print(f"Found {len(surgeon_pages)} surgeon pages")
    print()

    # Analyze title lengths
    print("Analyzing title tag lengths...")
    long_titles = []
    for page in surgeon_pages:
        title_template, estimated_length = analyze_title_lengths(page)
        if estimated_length > 60:
            long_titles.append((page, estimated_length))

    if long_titles:
        print(f"⚠ Warning: {len(long_titles)} pages may have titles >60 characters")
        for page, length in long_titles[:5]:
            print(f"  - {os.path.basename(page)}: ~{length} chars")
    else:
        print("✓ All titles are within optimal length (<60 characters)")
    print()

    # Apply enhancements
    print("Applying enhanced schema markup...")
    enhanced_count = 0
    skipped_count = 0

    for page in surgeon_pages:
        if enhance_surgeon_page_schema(page):
            enhanced_count += 1
        else:
            skipped_count += 1

    print()
    print("=" * 60)
    print("RESULTS:")
    print(f"  ✅ Enhanced: {enhanced_count} pages")
    print(f"  ⏭  Skipped: {skipped_count} pages (already enhanced or pattern not found)")
    print(f"  📊 Total: {len(surgeon_pages)} pages")
    print("=" * 60)
    print()
    print("Next steps:")
    print("1. Review changes with: git diff")
    print("2. Test one page locally: npm run dev")
    print("3. Validate schema: https://validator.schema.org/")
    print("4. Commit changes: git add . && git commit -m 'Add enhanced schema markup'")

if __name__ == '__main__':
    main()
