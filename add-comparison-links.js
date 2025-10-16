#!/usr/bin/env node

/**
 * Add Comparison Page Links
 * 
 * This script adds links to comparison pages from procedure and location pages
 * to improve internal linking and help users make informed decisions.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Comparison page mappings
const comparisonMappings = {
  'gastric-sleeve': [
    { url: '/compare/gastric-sleeve-vs-gastric-bypass', title: 'Sleeve vs Bypass', description: 'Compare the two most popular procedures' },
    { url: '/compare/surgery-vs-medication', title: 'Surgery vs Medication', description: 'Weight loss surgery vs medical treatments' }
  ],
  'gastric-bypass': [
    { url: '/compare/gastric-sleeve-vs-gastric-bypass', title: 'Sleeve vs Bypass', description: 'Compare the two most popular procedures' },
    { url: '/compare/gastric-bypass-vs-mini-bypass', title: 'Bypass vs Mini Bypass', description: 'Traditional vs mini gastric bypass' }
  ],
  'mini-gastric-bypass': [
    { url: '/compare/gastric-bypass-vs-mini-bypass', title: 'Bypass vs Mini Bypass', description: 'Traditional vs mini gastric bypass' },
    { url: '/compare/gastric-sleeve-vs-gastric-bypass', title: 'Sleeve vs Bypass', description: 'Compare the two most popular procedures' }
  ],
  'gastric-band': [
    { url: '/compare/gastric-sleeve-vs-gastric-bypass', title: 'Sleeve vs Bypass', description: 'Compare the two most popular procedures' },
    { url: '/compare/surgery-vs-medication', title: 'Surgery vs Medication', description: 'Weight loss surgery vs medical treatments' }
  ],
  'gastric-balloon': [
    { url: '/compare/surgery-vs-medication', title: 'Surgery vs Medication', description: 'Weight loss surgery vs medical treatments' },
    { url: '/compare/gastric-sleeve-vs-gastric-bypass', title: 'Sleeve vs Bypass', description: 'Compare the two most popular procedures' }
  ],
  'duodenal-switch': [
    { url: '/compare/gastric-sleeve-vs-gastric-bypass', title: 'Sleeve vs Bypass', description: 'Compare the two most popular procedures' },
    { url: '/compare/surgery-vs-medication', title: 'Surgery vs Medication', description: 'Weight loss surgery vs medical treatments' }
  ]
};

// Function to add comparison links to procedure pages
function addComparisonLinksToProcedurePage(filePath, procedureName) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if comparison links already exist
    if (content.includes('/compare/') && content.includes('Compare')) {
      console.log(`✅ Comparison links already exist`);
      return;
    }
    
    const comparisons = comparisonMappings[procedureName] || comparisonMappings['gastric-sleeve'];
    
    // Create comparison links section
    const comparisonSection = `
	<!-- Comparison Section -->
	<section class="py-12 bg-gradient-to-br from-purple-50 to-blue-50">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">Compare Your Options</h2>
			<div class="grid md:grid-cols-2 gap-6">
				${comparisons.map(comp => `
				<div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
					<div class="flex items-start mb-4">
						<div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
							<svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
							</svg>
						</div>
						<div>
							<h3 class="text-lg font-bold text-gray-900 mb-2">
								<a href="${comp.url}" class="text-gray-900 hover:text-purple-600 transition">
									${comp.title}
								</a>
							</h3>
							<p class="text-sm text-gray-600">${comp.description}</p>
						</div>
					</div>
					<a href="${comp.url}" class="inline-block text-purple-600 hover:text-purple-800 font-semibold text-sm">
						Compare Now →
					</a>
				</div>`).join('')}
			</div>
			
			<div class="text-center mt-8">
				<a href="/compare" class="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold">
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
    
    const newContent = content.slice(0, footerIndex) + comparisonSection + content.slice(footerIndex);
    
    // Write the updated content
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Added comparison links section`);
    
  } catch (error) {
    console.log(`❌ Error - ${error.message}`);
  }
}

// Function to add comparison links to location pages
function addComparisonLinksToLocationPage(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if comparison links already exist
    if (content.includes('/compare/') && content.includes('Compare')) {
      console.log(`✅ Comparison links already exist`);
      return;
    }
    
    // Create comparison links section for location pages
    const comparisonSection = `
	<!-- Procedure Comparison Section -->
	<section class="py-12 bg-white">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">Compare Weight Loss Procedures</h2>
			<div class="grid md:grid-cols-3 gap-6">
				<div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 hover:shadow-lg transition">
					<div class="flex items-center mb-4">
						<svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
						</svg>
						<h3 class="text-lg font-bold text-gray-900">
							<a href="/compare/gastric-sleeve-vs-gastric-bypass" class="text-gray-900 hover:text-blue-600 transition">
								Sleeve vs Bypass
							</a>
						</h3>
					</div>
					<p class="text-sm text-gray-600 mb-4">Compare the two most popular weight loss procedures</p>
					<a href="/compare/gastric-sleeve-vs-gastric-bypass" class="inline-block text-blue-600 hover:text-blue-800 font-semibold text-sm">
						Compare →
					</a>
				</div>
				
				<div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 hover:shadow-lg transition">
					<div class="flex items-center mb-4">
						<svg class="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
						<h3 class="text-lg font-bold text-gray-900">
							<a href="/compare/surgery-vs-medication" class="text-gray-900 hover:text-green-600 transition">
								Surgery vs Medication
							</a>
						</h3>
					</div>
					<p class="text-sm text-gray-600 mb-4">Weight loss surgery vs medical treatments</p>
					<a href="/compare/surgery-vs-medication" class="inline-block text-green-600 hover:text-green-800 font-semibold text-sm">
						Compare →
					</a>
				</div>
				
				<div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 hover:shadow-lg transition">
					<div class="flex items-center mb-4">
						<svg class="w-8 h-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
						</svg>
						<h3 class="text-lg font-bold text-gray-900">
							<a href="/compare" class="text-gray-900 hover:text-purple-600 transition">
								All Comparisons
							</a>
						</h3>
					</div>
					<p class="text-sm text-gray-600 mb-4">View all procedure comparisons and guides</p>
					<a href="/compare" class="inline-block text-purple-600 hover:text-purple-800 font-semibold text-sm">
						View All →
					</a>
				</div>
			</div>
		</div>
	</section>`;

    // Find the best place to insert the section (before the footer)
    const footerIndex = content.lastIndexOf('</section>');
    if (footerIndex === -1) {
      console.log(`❌ Could not find insertion point`);
      return;
    }
    
    const newContent = content.slice(0, footerIndex) + comparisonSection + content.slice(footerIndex);
    
    // Write the updated content
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Added comparison links section`);
    
  } catch (error) {
    console.log(`❌ Error - ${error.message}`);
  }
}

// Function to process procedure pages
function processProcedurePages() {
  console.log('🚀 Adding comparison links to procedure pages...\n');
  
  const proceduresDir = path.join(__dirname, 'src/pages/procedures');
  
  if (!fs.existsSync(proceduresDir)) {
    console.log('❌ Procedures directory not found');
    return;
  }
  
  const files = fs.readdirSync(proceduresDir);
  const procedureFiles = files.filter(file => file.endsWith('.astro') && !file.includes('melbourne') && !file.includes('sydney'));
  
  let processed = 0;
  
  procedureFiles.forEach(file => {
    const filePath = path.join(proceduresDir, file);
    const procedureName = file.replace('.astro', '');
    
    console.log(`Processing ${procedureName}...`);
    addComparisonLinksToProcedurePage(filePath, procedureName);
    processed++;
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Processed: ${processed} procedure pages`);
}

// Function to process location pages
function processLocationPages() {
  console.log('🚀 Adding comparison links to location pages...\n');
  
  const locationsDir = path.join(__dirname, 'src/pages/locations');
  
  if (!fs.existsSync(locationsDir)) {
    console.log('❌ Locations directory not found');
    return;
  }
  
  const files = fs.readdirSync(locationsDir);
  const locationFiles = files.filter(file => file.endsWith('.astro') && file !== 'index.astro');
  
  let processed = 0;
  
  locationFiles.forEach(file => {
    const filePath = path.join(locationsDir, file);
    const locationName = file.replace('.astro', '');
    
    console.log(`Processing ${locationName}...`);
    addComparisonLinksToLocationPage(filePath);
    processed++;
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Processed: ${processed} location pages`);
}

// Run both functions
console.log('🎯 Adding comparison page links for better internal linking...\n');
processProcedurePages();
console.log('\n' + '='.repeat(50) + '\n');
processLocationPages();

export { addComparisonLinksToProcedurePage, addComparisonLinksToLocationPage };
