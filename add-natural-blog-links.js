#!/usr/bin/env node

/**
 * Add Natural Blog Cross-Linking
 * 
 * This script adds natural "Related Articles" sections to blog posts
 * where users would naturally want to read more related content.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Natural blog relationships - only where it makes sense for users
const naturalBlogRelationships = {
  'gastric-sleeve-recovery-week-by-week': {
    related: [
      {
        title: 'Gastric Sleeve Diet Stages: Complete Guide',
        href: '/blog/gastric-sleeve-diet-stages',
        reason: 'Learn what to eat during each recovery stage'
      },
      {
        title: 'Pre-Op Diet for Gastric Sleeve',
        href: '/blog/pre-op-diet-gastric-sleeve',
        reason: 'Prepare properly before your surgery'
      }
    ]
  },
  'gastric-sleeve-diet-stages': {
    related: [
      {
        title: 'Gastric Sleeve Recovery Week by Week',
        href: '/blog/gastric-sleeve-recovery-week-by-week',
        reason: 'See what to expect during your recovery'
      },
      {
        title: '50+ Bariatric Surgery Recipes',
        href: '/blog/bariatric-surgery-recipes-all-stages',
        reason: 'Get delicious recipes for every diet stage'
      }
    ]
  },
  'pre-op-diet-gastric-sleeve': {
    related: [
      {
        title: 'Gastric Sleeve Recovery Week by Week',
        href: '/blog/gastric-sleeve-recovery-week-by-week',
        reason: 'What happens after your pre-op diet'
      },
      {
        title: 'Gastric Sleeve Diet Stages',
        href: '/blog/gastric-sleeve-diet-stages',
        reason: 'Your post-surgery eating plan'
      }
    ]
  },
  'bariatric-surgery-recipes-all-stages': {
    related: [
      {
        title: 'Gastric Sleeve Diet Stages',
        href: '/blog/gastric-sleeve-diet-stages',
        reason: 'Understand which stage you\'re in'
      },
      {
        title: 'Stage 1 Clear Liquid Recipes',
        href: '/blog/stage-1-clear-liquid-recipes',
        reason: 'First week after surgery recipes'
      }
    ]
  },
  'stage-1-clear-liquid-recipes': {
    related: [
      {
        title: 'Stage 2 Full Liquid Recipes',
        href: '/blog/stage-2-full-liquid-recipes',
        reason: 'Next stage of your recovery diet'
      },
      {
        title: 'Gastric Sleeve Recovery Week by Week',
        href: '/blog/gastric-sleeve-recovery-week-by-week',
        reason: 'Your complete recovery timeline'
      }
    ]
  },
  'stage-2-full-liquid-recipes': {
    related: [
      {
        title: 'Stage 1 Clear Liquid Recipes',
        href: '/blog/stage-1-clear-liquid-recipes',
        reason: 'Previous stage recipes'
      },
      {
        title: 'Stage 3 Pureed Food Recipes',
        href: '/blog/stage-3-pureed-food-recipes',
        reason: 'Next stage of your diet progression'
      }
    ]
  },
  'stage-3-pureed-food-recipes': {
    related: [
      {
        title: 'Stage 2 Full Liquid Recipes',
        href: '/blog/stage-2-full-liquid-recipes',
        reason: 'Previous stage recipes'
      },
      {
        title: 'Stage 4 Soft Food Recipes',
        href: '/blog/stage-4-soft-food-recipes',
        reason: 'Next stage of your diet progression'
      }
    ]
  },
  'stage-4-soft-food-recipes': {
    related: [
      {
        title: 'Stage 3 Pureed Food Recipes',
        href: '/blog/stage-3-pureed-food-recipes',
        reason: 'Previous stage recipes'
      },
      {
        title: '50+ Bariatric Surgery Recipes',
        href: '/blog/bariatric-surgery-recipes-all-stages',
        reason: 'Complete recipe collection for all stages'
      }
    ]
  },
  'gastric-sleeve-cost-australia-2025': {
    related: [
      {
        title: 'Overseas Bariatric Surgery Risks',
        href: '/blog/overseas-bariatric-surgery-risks-australia-comparison',
        reason: 'Compare costs and risks of overseas surgery'
      },
      {
        title: 'Gastric Sleeve Recovery Week by Week',
        href: '/blog/gastric-sleeve-recovery-week-by-week',
        reason: 'What to expect after your investment'
      }
    ]
  },
  'overseas-bariatric-surgery-risks-australia-comparison': {
    related: [
      {
        title: 'Gastric Sleeve Cost in Australia',
        href: '/blog/gastric-sleeve-cost-australia-2025',
        reason: 'Compare costs of Australian surgery'
      },
      {
        title: 'Gastric Sleeve Recovery Week by Week',
        href: '/blog/gastric-sleeve-recovery-week-by-week',
        reason: 'What to expect with Australian care'
      }
    ]
  }
};

// Function to add natural related articles to a blog post
function addNaturalRelatedArticles(filePath, blogSlug) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if related articles already exist
    if (content.includes('Related Articles') || content.includes('related-articles')) {
      console.log(`✅ Related articles already exist`);
      return;
    }
    
    const relationships = naturalBlogRelationships[blogSlug];
    if (!relationships || !relationships.related.length) {
      console.log(`⚠️  No natural relationships defined for ${blogSlug}`);
      return;
    }
    
    // Create natural related articles section
    const relatedSection = `
	<!-- Related Articles Section -->
	<section class="py-12 bg-gray-50">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">Related Articles</h2>
			<div class="grid md:grid-cols-2 gap-6">
				${relationships.related.map(article => `
				<div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
					<div class="flex items-start mb-4">
						<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
							<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
							</svg>
						</div>
						<div>
							<h3 class="text-lg font-bold text-gray-900 mb-2">
								<a href="${article.href}" class="text-gray-900 hover:text-blue-600 transition">
									${article.title}
								</a>
							</h3>
							<p class="text-sm text-gray-600">${article.reason}</p>
						</div>
					</div>
					<a href="${article.href}" class="inline-block text-blue-600 hover:text-blue-800 font-semibold text-sm">
						Read Article →
					</a>
				</div>`).join('')}
			</div>
		</div>
	</section>`;

    // Find the best place to insert the section (before the footer)
    const footerIndex = content.lastIndexOf('</section>');
    if (footerIndex === -1) {
      console.log(`❌ Could not find insertion point`);
      return;
    }
    
    const newContent = content.slice(0, footerIndex) + relatedSection + content.slice(footerIndex);
    
    // Write the updated content
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Added natural related articles section`);
    
  } catch (error) {
    console.log(`❌ Error - ${error.message}`);
  }
}

// Function to process blog posts
function processBlogPosts() {
  console.log('🚀 Adding natural related articles to blog posts...\n');
  
  const blogDir = path.join(__dirname, 'src/pages/blog');
  
  if (!fs.existsSync(blogDir)) {
    console.log('❌ Blog directory not found');
    return;
  }
  
  const files = fs.readdirSync(blogDir);
  const blogFiles = files.filter(file => file.endsWith('.astro') && file !== 'index.astro');
  
  let processed = 0;
  let updated = 0;
  
  blogFiles.forEach(file => {
    const filePath = path.join(blogDir, file);
    const blogSlug = file.replace('.astro', '');
    
    console.log(`Processing ${blogSlug}...`);
    const hadContent = fs.readFileSync(filePath, 'utf8').includes('Related Articles');
    addNaturalRelatedArticles(filePath, blogSlug);
    
    if (!hadContent && fs.readFileSync(filePath, 'utf8').includes('Related Articles')) {
      updated++;
    }
    processed++;
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Processed: ${processed} blog posts`);
  console.log(`   Updated: ${updated} blog posts`);
}

// Run the function
console.log('🎯 Adding natural blog cross-linking for better user experience...\n');
processBlogPosts();

export { addNaturalRelatedArticles };
