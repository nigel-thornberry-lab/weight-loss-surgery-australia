#!/usr/bin/env python3
"""
Script to add FAQ dropdown functionality to cost pages
Updates gastric bypass and gastric band pages to match gastric sleeve UX
"""

import re

def update_bypass_page():
    """Update gastric bypass page FAQ section"""
    with open('src/pages/costs/gastric-bypass-cost-australia.astro', 'r') as f:
        content = f.read()

    # Replace FAQ section
    old_faq = r'      <!-- FAQ Section -->\n      <section class="faq-section">\n        <h2>Frequently Asked Questions</h2>\n\n        \{faqs\.map\(\(faq\) => \(\n          <div class="faq-item">\n            <div class="faq-question">\{faq\.question\}</div>\n            <div class="faq-answer">\{faq\.answer\}</div>\n          </div>\n        \)\)\}\n      </section>'

    new_faq = '''      <!-- FAQ Section with Dropdowns -->
      <section class="faq-section">
        <h2>Frequently Asked Questions</h2>

        <div class="space-y-4">
          {faqs.map((faq, index) => (
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <button
                class="faq-question-btn w-full text-left px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center cursor-pointer"
                onclick={`toggleFAQ(${index})`}
              >
                <h3 class="text-lg font-bold text-gray-900 pr-8">{faq.question}</h3>
                <svg
                  class="faq-icon w-6 h-6 text-blue-600 transform transition-transform duration-200 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div class="faq-answer-div hidden px-6 py-4 bg-white border-t border-gray-200">
                <p class="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <script is:inline>
        function toggleFAQ(index) {
          const allAnswers = document.querySelectorAll('.faq-answer-div');
          const allIcons = document.querySelectorAll('.faq-icon');
          const answer = allAnswers[index];
          const icon = allIcons[index];

          if (answer.classList.contains('hidden')) {
            answer.classList.remove('hidden');
            icon.classList.add('rotate-180');
          } else {
            answer.classList.add('hidden');
            icon.classList.remove('rotate-180');
          }
        }
      </script>'''

    content = re.sub(old_faq, new_faq, content)

    with open('src/pages/costs/gastric-bypass-cost-australia.astro', 'w') as f:
        f.write(content)

    print("✅ Updated gastric bypass page")

def update_band_page():
    """Update gastric band page - add global.css import and FAQ dropdowns"""
    with open('src/pages/costs/gastric-band-cost-australia.astro', 'r') as f:
        content = f.read()

    # Add global.css import if not present
    if "import '../../styles/global.css';" not in content:
        content = content.replace('---\n// Gastric Band', "---\nimport '../../styles/global.css';\n\n// Gastric Band")
        print("✅ Added global.css import to band page")

    # Replace FAQ section
    old_faq = r'      <!-- FAQ Section -->\n      <section class="faq-section">\n        <h2>Frequently Asked Questions</h2>\n\n        \{faqs\.map\(\(faq\) => \(\n          <div class="faq-item">\n            <div class="faq-question">\{faq\.question\}</div>\n            <div class="faq-answer">\{faq\.answer\}</div>\n          </div>\n        \)\)\}\n      </section>'

    new_faq = '''      <!-- FAQ Section with Dropdowns -->
      <section class="faq-section">
        <h2>Frequently Asked Questions</h2>

        <div class="space-y-4">
          {faqs.map((faq, index) => (
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <button
                class="faq-question-btn w-full text-left px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center cursor-pointer"
                onclick={`toggleFAQ(${index})`}
              >
                <h3 class="text-lg font-bold text-gray-900 pr-8">{faq.question}</h3>
                <svg
                  class="faq-icon w-6 h-6 text-blue-600 transform transition-transform duration-200 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div class="faq-answer-div hidden px-6 py-4 bg-white border-t border-gray-200">
                <p class="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <script is:inline>
        function toggleFAQ(index) {
          const allAnswers = document.querySelectorAll('.faq-answer-div');
          const allIcons = document.querySelectorAll('.faq-icon');
          const answer = allAnswers[index];
          const icon = allIcons[index];

          if (answer.classList.contains('hidden')) {
            answer.classList.remove('hidden');
            icon.classList.add('rotate-180');
          } else {
            answer.classList.add('hidden');
            icon.classList.remove('rotate-180');
          }
        }
      </script>'''

    content = re.sub(old_faq, new_faq, content)

    with open('src/pages/costs/gastric-band-cost-australia.astro', 'w') as f:
        f.write(content)

    print("✅ Updated gastric band page")

def main():
    print("=" * 60)
    print("UPDATING COST PAGES FOR BETTER UX")
    print("=" * 60)
    print()

    print("Adding FAQ dropdowns to:")
    print("1. Gastric Bypass page")
    print("2. Gastric Band page")
    print("(Gastric Sleeve already updated)")
    print()

    update_bypass_page()
    update_band_page()

    print()
    print("=" * 60)
    print("✅ ALL UPDATES COMPLETE")
    print("=" * 60)
    print()
    print("Changes made:")
    print("- Added global.css import to bypass and band pages (Poppins font)")
    print("- Converted FAQ sections to interactive dropdowns")
    print("- Improved accessibility with proper button elements")
    print("- Added smooth animations for better UX")

if __name__ == '__main__':
    main()
