const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Restructuring layout to eliminate gap...\n');

// Find all surgeon profile pages
const surgeonPages = glob.sync('src/pages/surgeons/**/*.astro');

let fixedCount = 0;
let skippedCount = 0;

surgeonPages.forEach((filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Check if file has the structure we need to fix
    if (!content.includes('<!-- Enhanced Content Sections -->')) {
      skippedCount++;
      return;
    }
    
    // Check if already restructured
    if (content.includes('<!-- Right: Main Info + Enhanced Sections -->')) {
      console.log(`   ⏭️  Already fixed: ${path.basename(filePath)}`);
      skippedCount++;
      return;
    }
    
    // Find the closing of right column procedures section
    const proceduresEnd = content.indexOf('</div>\n          </div>\n        </div>\n      </div>\n    </section>\n\n    <!-- Enhanced Content Sections -->');
    
    if (proceduresEnd === -1) {
      console.log(`   ⚠️  Pattern not found in: ${path.basename(filePath)}`);
      skippedCount++;
      return;
    }
    
    // Find where Enhanced Content Sections start
    const enhancedSectionsStart = content.indexOf('    <!-- Enhanced Content Sections -->\n    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">\n      <div class="space-y-6">');
    
    if (enhancedSectionsStart === -1) {
      console.log(`   ⚠️  Enhanced sections not found in: ${path.basename(filePath)}`);
      skippedCount++;
      return;
    }
    
    // Extract the enhanced sections block
    const enhancedSectionsEnd = content.indexOf('      </div>\n    </div>\n  </main>\n</BaseLayout>', enhancedSectionsStart);
    const enhancedBlock = content.substring(enhancedSectionsStart, enhancedSectionsEnd + 25); // +25 for closing tags
    
    // Extract just the component calls
    const componentsMatch = enhancedBlock.match(/\{enhanced\.credentials[\s\S]*?<FAQSection faqs=\{seo\.faqs\} \/>\n        \)/);
    
    if (!componentsMatch) {
      console.log(`   ⚠️  Could not extract components from: ${path.basename(filePath)}`);
      skippedCount++;
      return;
    }
    
    const componentsBlock = componentsMatch[0];
    
    // Remove the old enhanced sections
    content = content.replace(enhancedBlock, '');
    
    // Change the right column header comment
    content = content.replace('<!-- Right: Main Info -->', '<!-- Right: Main Info + Enhanced Sections -->');
    
    // Find where to insert - after the procedures grid but before the closing divs
    const insertPoint = content.indexOf('              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </section>');
    
    if (insertPoint === -1) {
      console.log(`   ⚠️  Insert point not found in: ${path.basename(filePath)}`);
      skippedCount++;
      return;
    }
    
    // Insert the components into the right column with proper indentation
    const insertContent = `              </div>
            </div>

            <!-- Enhanced Sections in Right Column -->
            <div class="mt-6 space-y-6">
              ${componentsBlock.replace(/\n        /g, '\n              ')}
            </div>
          </div>
        </div>
      </div>
    </section>`;
    
    content = content.substring(0, insertPoint) + insertContent + content.substring(insertPoint + 92); // +92 for the closing tags we're replacing
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`   ✅ Fixed: ${path.basename(filePath)}`);
    fixedCount++;
    
  } catch (err) {
    console.error(`   ❌ Error processing ${filePath}:`, err.message);
  }
});

console.log(`\n✅ Complete!`);
console.log(`   Fixed: ${fixedCount} files`);
console.log(`   Skipped: ${skippedCount} files`);
console.log(`\n💡 Enhanced sections now appear in the right column, filling the gap!`);
