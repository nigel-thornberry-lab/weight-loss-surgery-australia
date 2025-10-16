#!/usr/bin/env node

/**
 * Add Surgeon Links to Location Pages
 * 
 * This script adds surgeon directory links to location pages that don't have them,
 * improving internal linking and page discovery.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping of suburbs to their nearby areas and potential surgeon locations
const suburbMapping = {
  // Sydney suburbs
  'burwood': ['burwood', 'strathfield', 'ashfield', 'croydon'],
  'hornsby': ['hornsby', 'waitara', 'wahroonga', 'pennant-hills'],
  'randwick': ['randwick', 'coogee', 'bondi', 'kingsford'],
  'ryde': ['ryde', 'eastwood', 'denistone', 'west-ryde'],
  'sutherland': ['sutherland', 'miranda', 'cronulla', 'jannali'],
  'dee-why': ['dee-why', 'manly', 'freshwater', 'collaroy'],
  'ashfield': ['ashfield', 'burwood', 'croydon', 'summer-hill'],
  'auburn': ['auburn', 'lidcombe', 'granville', 'regents-park'],
  'bankstown': ['bankstown', 'yagoona', 'condell-park', 'greenacre'],
  'baulkham-hills': ['baulkham-hills', 'castle-hill', 'bella-vista', 'norwest'],
  'blacktown': ['blacktown', 'mount-druitt', 'rooty-hill', 'doonside'],
  'bondi': ['bondi', 'bondi-junction', 'randwick', 'coogee'],
  'cabramatta': ['cabramatta', 'fairfield', 'canley-vale', 'liverpool'],
  'campbelltown': ['campbelltown', 'leumeah', 'minto', 'glemore-park'],
  'castle-hill': ['castle-hill', 'baulkham-hills', 'bella-vista', 'cherrybrook'],
  'chatswood': ['chatswood', 'willoughby', 'artarmon', 'st-leonards'],
  'cronulla': ['cronulla', 'sutherland', 'miranda', 'caringbah'],
  'dandenong': ['dandenong', 'springvale', 'noble-park', 'keysborough'],
  'eastwood': ['eastwood', 'ryde', 'denistone', 'west-ryde'],
  'fairfield': ['fairfield', 'cabramatta', 'smithfield', 'wetherill-park'],
  'hurstville': ['hurstville', 'kogarah', 'rockdale', 'mortdale'],
  'kogarah': ['kogarah', 'hurstville', 'rockdale', 'carlton'],
  'liverpool': ['liverpool', 'casula', 'moorebank', 'holsworthy'],
  'macquarie-park': ['macquarie-park', 'north-ryde', 'eastwood', 'marsfield'],
  'manly': ['manly', 'freshwater', 'dee-why', 'collaroy'],
  'miranda': ['miranda', 'sutherland', 'cronulla', 'caringbah'],
  'newtown': ['newtown', 'camperdown', 'glebe', 'annandale'],
  'parramatta': ['parramatta', 'westmead', 'harris-park', 'rosehill'],
  'penrith': ['penrith', 'st-marys', 'kingswood', 'cranebrook'],
  'strathfield': ['strathfield', 'burwood', 'homebush', 'flemington'],
  'wentworthville': ['wentworthville', 'westmead', 'parramatta', 'merrylands'],
  
  // Melbourne suburbs
  'bentleigh': ['bentleigh', 'mckinnon', 'ormond', 'east-bentleigh'],
  'berwick': ['berwick', 'narre-warren', 'pakenham', 'endeavour-hills'],
  'box-hill': ['box-hill', 'burwood', 'blackburn', 'forest-hill'],
  'cranbourne': ['cranbourne', 'narre-warren', 'berwick', 'endeavour-hills'],
  'dandenong': ['dandenong', 'springvale', 'noble-park', 'keysborough'],
  'doncaster': ['doncaster', 'templestowe', 'bulleen', 'manningham'],
  'epping': ['epping', 'lalor', 'thomastown', 'mill-park'],
  'footscray': ['footscray', 'maribyrnong', 'yarraville', 'seddon'],
  'frankston': ['frankston', 'seaford', 'carrum-downs', 'langwarrin'],
  'geelong': ['geelong', 'newtown', 'south-geelong', 'east-geelong'],
  'heidelberg': ['heidelberg', 'ivanhoe', 'rosanna', 'greensborough'],
  'narre-warren': ['narre-warren', 'berwick', 'cranbourne', 'endeavour-hills'],
  'pakenham': ['pakenham', 'berwick', 'narre-warren', 'endeavour-hills'],
  'richmond': ['richmond', 'south-yarra', 'east-melbourne', 'collingwood'],
  'ringwood': ['ringwood', 'croydon', 'mitcham', 'heathmont'],
  'springvale': ['springvale', 'dandenong', 'noble-park', 'keysborough'],
  'st-kilda': ['st-kilda', 'elwood', 'balaclava', 'south-melbourne'],
  'sunshine': ['sunshine', 'albion', 'braybrook', 'west-footscray'],
  'werribee': ['werribee', 'hoppers-crossing', 'tarneit', 'truganina']
};

// Function to get surgeon directory links for a suburb
function getSurgeonLinks(suburb) {
  const nearbyAreas = suburbMapping[suburb] || [suburb];
  const links = [];
  
  // Add main suburb link
  links.push(`<a href="/surgeons/${suburb}" class="text-blue-600 hover:text-blue-800 font-semibold">Surgeons in ${suburb.charAt(0).toUpperCase() + suburb.slice(1)}</a>`);
  
  // Add nearby suburb links
  nearbyAreas.slice(1, 3).forEach(area => {
    const areaName = area.charAt(0).toUpperCase() + area.slice(1);
    links.push(`<a href="/surgeons/${area}" class="text-blue-600 hover:text-blue-800">${areaName} Surgeons</a>`);
  });
  
  return links;
}

// Function to add surgeon links section to a location page
function addSurgeonLinksToLocationPage(filePath, suburb) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if surgeon links already exist
    if (content.includes('Surgeons in') || content.includes('/surgeons/')) {
      console.log(`✅ ${suburb}: Already has surgeon links`);
      return;
    }
    
    const surgeonLinks = getSurgeonLinks(suburb);
    const suburbName = suburb.charAt(0).toUpperCase() + suburb.slice(1);
    
    // Create the surgeon links section
    const surgeonSection = `
	<!-- Local Surgeons Section -->
	<section class="py-16 bg-blue-50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Expert Surgeons in ${suburbName}</h2>
			<div class="grid md:grid-cols-3 gap-6">
				<div class="bg-white rounded-xl shadow-md p-6 text-center">
					<div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
						</svg>
					</div>
					<h3 class="text-xl font-bold text-gray-900 mb-3">Find Local Surgeons</h3>
					<div class="space-y-2">
						${surgeonLinks.join('<br/>')}
					</div>
					<a href="/surgeons" class="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
						View All Surgeons
					</a>
				</div>
				
				<div class="bg-white rounded-xl shadow-md p-6 text-center">
					<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
					</div>
					<h3 class="text-xl font-bold text-gray-900 mb-3">FRACS Accredited</h3>
					<p class="text-gray-600 mb-4">All surgeons are FRACS-accredited with extensive bariatric experience</p>
					<a href="/surgeons/compare" class="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
						Compare Surgeons
					</a>
				</div>
				
				<div class="bg-white rounded-xl shadow-md p-6 text-center">
					<div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
						</svg>
					</div>
					<h3 class="text-xl font-bold text-gray-900 mb-3">Local Support</h3>
					<p class="text-gray-600 mb-4">Complete aftercare with local dietitians and support groups</p>
					<a href="/contact" class="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
						Get Support
					</a>
				</div>
			</div>
		</div>
	</section>`;

    // Find the best place to insert the section (before the footer)
    const footerIndex = content.lastIndexOf('</section>');
    if (footerIndex === -1) {
      console.log(`❌ ${suburb}: Could not find insertion point`);
      return;
    }
    
    const newContent = content.slice(0, footerIndex) + surgeonSection + content.slice(footerIndex);
    
    // Write the updated content
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ ${suburb}: Added surgeon links section`);
    
  } catch (error) {
    console.log(`❌ ${suburb}: Error - ${error.message}`);
  }
}

// Main execution
function main() {
  console.log('🚀 Adding surgeon links to location pages...\n');
  
  const locationsDir = path.join(__dirname, 'src/pages/locations');
  
  if (!fs.existsSync(locationsDir)) {
    console.log('❌ Locations directory not found');
    return;
  }
  
  const files = fs.readdirSync(locationsDir);
  const locationFiles = files.filter(file => file.endsWith('.astro') && file !== 'index.astro');
  
  let processed = 0;
  let updated = 0;
  
  locationFiles.forEach(file => {
    const suburb = file.replace('.astro', '');
    const filePath = path.join(locationsDir, file);
    
    console.log(`Processing ${suburb}...`);
    addSurgeonLinksToLocationPage(filePath, suburb);
    processed++;
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Processed: ${processed} location pages`);
  console.log(`   Updated: ${updated} pages`);
  console.log(`\n🎯 Next: Run the internal links audit to see the improvement!`);
}

// Run the script
main();

export { addSurgeonLinksToLocationPage, getSurgeonLinks };
