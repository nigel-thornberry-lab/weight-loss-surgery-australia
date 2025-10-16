#!/usr/bin/env node

/**
 * Add Natural Procedure Cross-Linking
 * 
 * This script adds natural "Related Procedures" sections to procedure pages
 * where users would naturally want to compare or learn about alternatives.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Natural procedure relationships - only where it makes sense for users
const naturalProcedureRelationships = {
  'gastric-sleeve': {
    related: [
      {
        title: 'Gastric Bypass',
        href: '/procedures/gastric-bypass',
        reason: 'Compare the two most popular procedures',
        comparison: '/compare/gastric-sleeve-vs-gastric-bypass'
      },
      {
        title: 'Mini Gastric Bypass',
        href: '/procedures/mini-gastric-bypass',
        reason: 'Alternative bypass procedure with shorter recovery'
      }
    ]
  },
  'gastric-bypass': {
    related: [
      {
        title: 'Gastric Sleeve',
        href: '/procedures/gastric-sleeve',
        reason: 'Compare the two most popular procedures',
        comparison: '/compare/gastric-sleeve-vs-gastric-bypass'
      },
      {
        title: 'Mini Gastric Bypass',
        href: '/procedures/mini-gastric-bypass',
        reason: 'Alternative bypass procedure with shorter recovery',
        comparison: '/compare/gastric-bypass-vs-mini-bypass'
      }
    ]
  },
  'mini-gastric-bypass': {
    related: [
      {
        title: 'Gastric Bypass',
        href: '/procedures/gastric-bypass',
        reason: 'Compare traditional vs mini bypass',
        comparison: '/compare/gastric-bypass-vs-mini-bypass'
      },
      {
        title: 'Gastric Sleeve',
        href: '/procedures/gastric-sleeve',
        reason: 'Alternative procedure with different benefits'
      }
    ]
  },
  'gastric-band': {
    related: [
      {
        title: 'Gastric Sleeve',
        href: '/procedures/gastric-sleeve',
        reason: 'More effective alternative to gastric band'
      },
      {
        title: 'Gastric Balloon',
        href: '/procedures/gastric-balloon',
        reason: 'Non-surgical weight loss option'
      }
    ]
  },
  'gastric-balloon': {
    related: [
      {
        title: 'Gastric Sleeve',
        href: '/procedures/gastric-sleeve',
        reason: 'Permanent surgical alternative'
      },
      {
        title: 'Gastric Band',
        href: '/procedures/gastric-band',
        reason: 'Another reversible weight loss option'
      }
    ]
  },
  'duodenal-switch': {
    related: [
      {
        title: 'Gastric Bypass',
        href: '/procedures/gastric-bypass',
        reason: 'Similar but less complex procedure'
      },
      {
        title: 'Gastric Sleeve',
        href: '/procedures/gastric-sleeve',
        reason: 'First part of duodenal switch procedure'
      }
    ]
  }
};

// Function to add natural related procedures to a procedure page
function addNaturalRelatedProcedures(filePath, procedureSlug) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if related procedures already exist
    if (content.includes('Related Procedures') || content.includes('related-procedures')) {
      console.log(`✅ Related procedures already exist`);
      return;
    }
    
    const relationships = naturalProcedureRelationships[procedureSlug];
    if (!relationships || !relationships.related.length) {
      console.log(`⚠️  No natural relationships defined for ${procedureSlug}`);
      return;
    }
    
    // Create natural related procedures section
    const relatedSection = `
	<!-- Related Procedures Section -->
	<section class="py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">Related Procedures</h2>
			<p class="text-center text-gray-600 mb-8">Compare your options to make the best decision for your weight loss journey</p>
			<div class="grid md:grid-cols-2 gap-6">
				${relationships.related.map(procedure => `
				<div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
					<div class="flex items-start mb-4">
						<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
							<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
							</svg>
						</div>
						<div>
							<h3 class="text-lg font-bold text-gray-900 mb-2">
								<a href="${procedure.href}" class="text-gray-900 hover:text-blue-600 transition">
									${procedure.title}
								</a>
							</h3>
							<p class="text-sm text-gray-600">${procedure.reason}</p>
						</div>
					</div>
					<div class="flex gap-3">
						<a href="${procedure.href}" class="inline-block text-blue-600 hover:text-blue-800 font-semibold text-sm">
							Learn More →
						</a>
						${procedure.comparison ? `
						<a href="${procedure.comparison}" class="inline-block text-purple-600 hover:text-purple-800 font-semibold text-sm">
							Compare →
						</a>` : ''}
					</div>
				</div>`).join('')}
			</div>
			
			<div class="text-center mt-8">
				<a href="/compare" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
					View All Comparisons
				</a>
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
    console.log(`✅ Added natural related procedures section`);
    
  } catch (error) {
    console.log(`❌ Error - ${error.message}`);
  }
}

// Function to process procedure pages
function processProcedurePages() {
  console.log('🚀 Adding natural related procedures to procedure pages...\n');
  
  const proceduresDir = path.join(__dirname, 'src/pages/procedures');
  
  if (!fs.existsSync(proceduresDir)) {
    console.log('❌ Procedures directory not found');
    return;
  }
  
  const files = fs.readdirSync(proceduresDir);
  const procedureFiles = files.filter(file => file.endsWith('.astro') && !file.includes('melbourne') && !file.includes('sydney'));
  
  let processed = 0;
  let updated = 0;
  
  procedureFiles.forEach(file => {
    const filePath = path.join(proceduresDir, file);
    const procedureSlug = file.replace('.astro', '');
    
    console.log(`Processing ${procedureSlug}...`);
    const hadContent = fs.readFileSync(filePath, 'utf8').includes('Related Procedures');
    addNaturalRelatedProcedures(filePath, procedureSlug);
    
    if (!hadContent && fs.readFileSync(filePath, 'utf8').includes('Related Procedures')) {
      updated++;
    }
    processed++;
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Processed: ${processed} procedure pages`);
  console.log(`   Updated: ${updated} procedure pages`);
}

// Run the function
console.log('🎯 Adding natural procedure cross-linking for better user experience...\n');
processProcedurePages();

export { addNaturalRelatedProcedures };
