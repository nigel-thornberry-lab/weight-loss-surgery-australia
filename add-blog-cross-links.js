#!/usr/bin/env node

/**
 * Add Blog Post Cross-Linking
 * 
 * This script adds related article links to blog posts,
 * creating content clusters and improving internal linking.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Blog post relationships and topics
const blogRelationships = {
  'gastric-sleeve-cost-australia-2025': {
    related: [
      'gastric-sleeve-recovery-week-by-week',
      'pre-op-diet-gastric-sleeve',
      'gastric-sleeve-diet-stages'
    ],
    topic: 'gastric-sleeve'
  },
  'gastric-sleeve-recovery-week-by-week': {
    related: [
      'gastric-sleeve-cost-australia-2025',
      'pre-op-diet-gastric-sleeve',
      'gastric-sleeve-diet-stages'
    ],
    topic: 'gastric-sleeve'
  },
  'pre-op-diet-gastric-sleeve': {
    related: [
      'gastric-sleeve-recovery-week-by-week',
      'gastric-sleeve-diet-stages',
      'gastric-sleeve-cost-australia-2025'
    ],
    topic: 'gastric-sleeve'
  },
  'gastric-sleeve-diet-stages': {
    related: [
      'gastric-sleeve-recovery-week-by-week',
      'pre-op-diet-gastric-sleeve',
      'gastric-sleeve-cost-australia-2025'
    ],
    topic: 'gastric-sleeve'
  },
  'overseas-bariatric-surgery-risks-australia-comparison': {
    related: [
      'gastric-sleeve-cost-australia-2025',
      'gastric-sleeve-recovery-week-by-week'
    ],
    topic: 'comparison'
  }
};

// Function to add related articles section to a blog post
function addRelatedArticlesToBlogPost(filePath, postSlug) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if related articles already exist
    if (content.includes('Related Articles') || content.includes('You might also like')) {
      console.log(`✅ ${postSlug}: Already has related articles`);
      return;
    }
    
    const relationships = blogRelationships[postSlug];
    if (!relationships || relationships.related.length === 0) {
      console.log(`⚠️  ${postSlug}: No related articles defined`);
      return;
    }
    
    // Create the related articles section
    const relatedSection = `
	<!-- Related Articles Section -->
	<section class="py-12 bg-gray-50">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">Related Articles</h2>
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				${relationships.related.map(relatedSlug => {
					const relatedTitle = relatedSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
					return `
					<div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
						<div class="flex items-start mb-4">
							<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
								<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
								</svg>
							</div>
							<div>
								<h3 class="text-lg font-bold text-gray-900 mb-2">
									<a href="/blog/${relatedSlug}" class="text-gray-900 hover:text-blue-600 transition">
										${relatedTitle}
									</a>
								</h3>
								<p class="text-sm text-gray-600">Essential information about ${relatedTitle.toLowerCase()}</p>
							</div>
						</div>
						<a href="/blog/${relatedSlug}" class="inline-block text-blue-600 hover:text-blue-800 font-semibold text-sm">
							Read More →
						</a>
					</div>`;
				}).join('')}
			</div>
			
			<div class="text-center mt-8">
				<a href="/blog" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
					View All Articles
				</a>
			</div>
		</div>
	</section>`;

    // Find the best place to insert the section (before the footer)
    const footerIndex = content.lastIndexOf('</section>');
    if (footerIndex === -1) {
      console.log(`❌ ${postSlug}: Could not find insertion point`);
      return;
    }
    
    const newContent = content.slice(0, footerIndex) + relatedSection + content.slice(footerIndex);
    
    // Write the updated content
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ ${postSlug}: Added related articles section`);
    
  } catch (error) {
    console.log(`❌ ${postSlug}: Error - ${error.message}`);
  }
}

// Function to process all blog posts
function processBlogPosts() {
  console.log('🚀 Adding cross-linking to blog posts...\n');
  
  const blogDir = path.join(__dirname, 'src/pages/blog');
  
  if (!fs.existsSync(blogDir)) {
    console.log('❌ Blog directory not found');
    return;
  }
  
  const files = fs.readdirSync(blogDir);
  const blogFiles = files.filter(file => file.endsWith('.astro'));
  
  let processed = 0;
  let updated = 0;
  
  blogFiles.forEach(file => {
    const postSlug = file.replace('.astro', '');
    const filePath = path.join(blogDir, file);
    
    console.log(`Processing ${postSlug}...`);
    addRelatedArticlesToBlogPost(filePath, postSlug);
    processed++;
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Processed: ${processed} blog posts`);
  console.log(`   Updated: ${updated} pages`);
  console.log(`\n🎯 Next: Run the internal links audit to see the improvement!`);
}

// Run the script
processBlogPosts();

export { addRelatedArticlesToBlogPost };
