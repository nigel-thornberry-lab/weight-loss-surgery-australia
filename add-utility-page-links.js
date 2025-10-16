#!/usr/bin/env node

/**
 * Add Utility Page Links
 * 
 * This script adds links to utility pages (BMI calculator, surgeon checklist)
 * from relevant pages to improve internal linking and user experience.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to add BMI calculator link to procedure pages
function addBMICalculatorToProcedurePage(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if BMI calculator link already exists
    if (content.includes('/bmi-calculator') || content.includes('BMI Calculator')) {
      console.log(`✅ BMI calculator link already exists`);
      return;
    }
    
    // Create BMI calculator section
    const bmiSection = `
	<!-- BMI Calculator Section -->
	<section class="py-12 bg-gradient-to-br from-green-50 to-blue-50">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="bg-white rounded-xl shadow-lg p-8">
				<div class="flex items-start mb-6">
					<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
						<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
						</svg>
					</div>
					<div>
						<h3 class="text-2xl font-bold text-gray-900 mb-3">Calculate Your BMI</h3>
						<p class="text-gray-600 mb-4">Find out if you qualify for weight loss surgery with our free BMI calculator</p>
						<div class="flex flex-col sm:flex-row gap-4">
							<a href="/bmi-calculator" class="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold">
								Calculate BMI Now
							</a>
							<a href="/surgeon-selection-checklist" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
								Surgeon Selection Checklist
							</a>
						</div>
					</div>
				</div>
				
				<div class="grid md:grid-cols-3 gap-6 mt-6">
					<div class="bg-green-50 rounded-lg p-4">
						<h4 class="font-bold text-gray-900 mb-2">BMI Requirements</h4>
						<p class="text-sm text-gray-600">Most procedures require BMI 30+ or 27+ with health conditions</p>
					</div>
					<div class="bg-blue-50 rounded-lg p-4">
						<h4 class="font-bold text-gray-900 mb-2">Free Assessment</h4>
						<p class="text-sm text-gray-600">Get instant results and qualification guidance</p>
					</div>
					<div class="bg-purple-50 rounded-lg p-4">
						<h4 class="font-bold text-gray-900 mb-2">Next Steps</h4>
						<p class="text-sm text-gray-600">Use our surgeon checklist to find the right specialist</p>
					</div>
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
    
    const newContent = content.slice(0, footerIndex) + bmiSection + content.slice(footerIndex);
    
    // Write the updated content
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Added BMI calculator section`);
    
  } catch (error) {
    console.log(`❌ Error - ${error.message}`);
  }
}

// Function to add utility links to location pages
function addUtilityLinksToLocationPage(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if utility links already exist
    if (content.includes('/bmi-calculator') && content.includes('/surgeon-selection-checklist')) {
      console.log(`✅ Utility links already exist`);
      return;
    }
    
    // Create utility links section
    const utilitySection = `
	<!-- Helpful Tools Section -->
	<section class="py-12 bg-gray-50">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">Helpful Tools</h2>
			<div class="grid md:grid-cols-2 gap-6">
				<div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
					<div class="flex items-start mb-4">
						<div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
							<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
							</svg>
						</div>
						<div>
							<h3 class="text-lg font-bold text-gray-900 mb-2">
								<a href="/bmi-calculator" class="text-gray-900 hover:text-green-600 transition">
									BMI Calculator
								</a>
							</h3>
							<p class="text-sm text-gray-600">Check if you qualify for weight loss surgery</p>
						</div>
					</div>
					<a href="/bmi-calculator" class="inline-block text-green-600 hover:text-green-800 font-semibold text-sm">
						Calculate Now →
					</a>
				</div>
				
				<div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
					<div class="flex items-start mb-4">
						<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
							<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
							</svg>
						</div>
						<div>
							<h3 class="text-lg font-bold text-gray-900 mb-2">
								<a href="/surgeon-selection-checklist" class="text-gray-900 hover:text-blue-600 transition">
									Surgeon Checklist
								</a>
							</h3>
							<p class="text-sm text-gray-600">Essential questions to ask potential surgeons</p>
						</div>
					</div>
					<a href="/surgeon-selection-checklist" class="inline-block text-blue-600 hover:text-blue-800 font-semibold text-sm">
						View Checklist →
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
    
    const newContent = content.slice(0, footerIndex) + utilitySection + content.slice(footerIndex);
    
    // Write the updated content
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Added utility links section`);
    
  } catch (error) {
    console.log(`❌ Error - ${error.message}`);
  }
}

// Function to process procedure pages
function processProcedurePages() {
  console.log('🚀 Adding utility links to procedure pages...\n');
  
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
    addBMICalculatorToProcedurePage(filePath);
    processed++;
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Processed: ${processed} procedure pages`);
}

// Function to process location pages
function processLocationPages() {
  console.log('🚀 Adding utility links to location pages...\n');
  
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
    addUtilityLinksToLocationPage(filePath);
    processed++;
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Processed: ${processed} location pages`);
}

// Run both functions
console.log('🎯 Adding utility page links for better internal linking...\n');
processProcedurePages();
console.log('\n' + '='.repeat(50) + '\n');
processLocationPages();

export { addBMICalculatorToProcedurePage, addUtilityLinksToLocationPage };
