const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Moving enhanced sections to right column to fill gap...\n');

// Find all surgeon profile pages
const surgeonPages = glob.sync('src/pages/surgeons/**/*.astro');

let fixedCount = 0;
let skippedCount = 0;
let alreadyFixed = 0;

surgeonPages.forEach((filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Check if already fixed
    if (content.includes('<!-- Enhanced Content Sections - Now in Right Column -->')) {
      alreadyFixed++;
      return;
    }
    
    // Check if file has the old structure
    if (!content.includes('<!-- Enhanced Content Sections -->')) {
      skippedCount++;
      return;
    }
    
    // Pattern to match and replace
    const oldPattern = `              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Enhanced Content Sections -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="space-y-6">
        {enhanced.credentials && <CredentialsSection credentials={enhanced.credentials} />}
        {enhanced.team && <TeamSection team={enhanced.team} />}
        {enhanced.hospitals && <HospitalsSection hospitals={enhanced.hospitals} />}
        {enhanced.pricing && <PricingSection pricing={enhanced.pricing} />}
        
        {/* Google Reviews Section */}
        {surgeon.slug && (
          <GoogleReviews 
            surgeonName={cleanName}
            surgeonSlug={surgeon.slug}
            rating={surgeon.rating}
            reviewCount={surgeon.review_count}
          />
        )}
        
        {seo.faqs && seo.faqs.length > 0 && <FAQSection faqs={seo.faqs} />}
      </div>
    </div>`;

    const newPattern = `              </div>
            </div>

            <!-- Enhanced Content Sections - Now in Right Column -->
            {enhanced.credentials && <CredentialsSection credentials={enhanced.credentials} />}
            {enhanced.team && <TeamSection team={enhanced.team} />}
            {enhanced.hospitals && <HospitalsSection hospitals={enhanced.hospitals} />}
            {enhanced.pricing && <PricingSection pricing={enhanced.pricing} />}
            
            {/* Google Reviews Section */}
            {surgeon.slug && (
              <GoogleReviews 
                surgeonName={cleanName}
                surgeonSlug={surgeon.slug}
                rating={surgeon.rating}
                reviewCount={surgeon.review_count}
              />
            )}
            
            {seo.faqs && seo.faqs.length > 0 && <FAQSection faqs={seo.faqs} />}
          </div>
        </div>
      </div>
    </section>`;

    if (content.includes(oldPattern)) {
      content = content.replace(oldPattern, newPattern);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`   ✅ Fixed: ${path.basename(filePath)}`);
      fixedCount++;
    } else {
      console.log(`   ⚠️  Pattern not found: ${path.basename(filePath)}`);
      skippedCount++;
    }
    
  } catch (err) {
    console.error(`   ❌ Error processing ${filePath}:`, err.message);
  }
});

console.log(`\n✅ Complete!`);
console.log(`   Fixed: ${fixedCount} files`);
console.log(`   Already fixed: ${alreadyFixed} files`);
console.log(`   Skipped: ${skippedCount} files`);
console.log(`\n💡 Enhanced sections now appear in the narrower right column, filling the gap!`);
