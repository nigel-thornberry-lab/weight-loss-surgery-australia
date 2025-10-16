#!/usr/bin/env node

/**
 * Add Location Links to Surgeon Profiles
 * 
 * This script adds location page links to surgeon profiles,
 * improving internal linking and local SEO.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get location links for a surgeon based on their location data
function getLocationLinks(surgeonData) {
  const links = [];
  const suburbs = surgeonData.suburbs || [];
  const location = surgeonData.location || '';
  
  // Add links for each suburb the surgeon serves
  suburbs.forEach(suburb => {
    const suburbName = suburb.charAt(0).toUpperCase() + suburb.slice(1);
    links.push(`<a href="/locations/${suburb}" class="text-blue-600 hover:text-blue-800 font-semibold">${suburbName} Surgery Information</a>`);
  });
  
  // Add main city link if not already covered
  if (location.includes('Sydney') && !suburbs.includes('sydney')) {
    links.push(`<a href="/locations/sydney" class="text-blue-600 hover:text-blue-800">Sydney Weight Loss Surgery</a>`);
  }
  if (location.includes('Melbourne') && !suburbs.includes('melbourne')) {
    links.push(`<a href="/locations/melbourne" class="text-blue-600 hover:text-blue-800">Melbourne Weight Loss Surgery</a>`);
  }
  
  return links;
}

// Function to add location links section to a surgeon profile
function addLocationLinksToSurgeonProfile(filePath, surgeonData) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if location links already exist
    if (content.includes('/locations/') && content.includes('Surgery Information')) {
      console.log(`✅ ${surgeonData.name}: Already has location links`);
      return;
    }
    
    const locationLinks = getLocationLinks(surgeonData);
    if (locationLinks.length === 0) {
      console.log(`⚠️  ${surgeonData.name}: No location data found`);
      return;
    }
    
    const surgeonName = surgeonData.name || 'Surgeon';
    
    // Create the location links section
    const locationSection = `
	<!-- Location Information Section -->
	<section class="py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Surgery Locations</h2>
			<div class="bg-white rounded-xl shadow-md p-6">
				<div class="flex items-start mb-4">
					<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
						<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-bold text-gray-900 mb-2">Where Dr. ${surgeonName} Performs Surgery</h3>
						<p class="text-gray-600 mb-4">Comprehensive information about weight loss surgery in your area</p>
						<div class="space-y-2">
							${locationLinks.join('<br/>')}
						</div>
					</div>
				</div>
				
				<div class="grid md:grid-cols-2 gap-4 mt-6">
					<div class="bg-blue-50 rounded-lg p-4">
						<h4 class="font-bold text-gray-900 mb-2">🏥 Hospital Information</h4>
						<p class="text-sm text-gray-600">Learn about the hospitals where Dr. ${surgeonName} performs bariatric surgery, including facilities, parking, and accessibility.</p>
					</div>
					<div class="bg-green-50 rounded-lg p-4">
						<h4 class="font-bold text-gray-900 mb-2">📍 Local Support</h4>
						<p class="text-sm text-gray-600">Find local dietitians, support groups, and aftercare services in your area for ongoing support.</p>
					</div>
				</div>
				
				<div class="text-center mt-6">
					<a href="/contact" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
						Book Consultation with Dr. ${surgeonName}
					</a>
				</div>
			</div>
		</div>
	</section>`;

    // Find the best place to insert the section (before the footer or last section)
    const lastSectionIndex = content.lastIndexOf('</section>');
    if (lastSectionIndex === -1) {
      console.log(`❌ ${surgeonName}: Could not find insertion point`);
      return;
    }
    
    const newContent = content.slice(0, lastSectionIndex) + locationSection + content.slice(lastSectionIndex);
    
    // Write the updated content
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ ${surgeonName}: Added location links section`);
    
  } catch (error) {
    console.log(`❌ ${surgeonData.name}: Error - ${error.message}`);
  }
}

// Function to process all surgeon profiles
function processSurgeonProfiles() {
  console.log('🚀 Adding location links to surgeon profiles...\n');
  
  const surgeonsDir = path.join(__dirname, 'src/pages/surgeons');
  
  if (!fs.existsSync(surgeonsDir)) {
    console.log('❌ Surgeons directory not found');
    return;
  }
  
  let processed = 0;
  let updated = 0;
  
  // Process each surgeon directory
  const surgeonDirs = fs.readdirSync(surgeonsDir).filter(dir => {
    const dirPath = path.join(surgeonsDir, dir);
    return fs.statSync(dirPath).isDirectory();
  });
  
  surgeonDirs.forEach(dir => {
    const surgeonDirPath = path.join(surgeonsDir, dir);
    const files = fs.readdirSync(surgeonDirPath);
    
    // Find surgeon profile files (not index.astro)
    const profileFiles = files.filter(file => 
      file.endsWith('.astro') && 
      file !== 'index.astro' &&
      !file.includes('index')
    );
    
    profileFiles.forEach(file => {
      const filePath = path.join(surgeonDirPath, file);
      const surgeonName = file.replace('.astro', '');
      
      // Try to extract surgeon data from the file
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract basic surgeon data (this is a simplified approach)
        const surgeonData = {
          name: surgeonName.replace(/^dr-|^mr-|^prof-|^aprof-/i, '').replace(/-/g, ' '),
          location: content.includes('Sydney') ? 'Sydney' : content.includes('Melbourne') ? 'Melbourne' : '',
          suburbs: [] // We'll need to extract this from the content or use a mapping
        };
        
        // Add some common suburb mappings based on surgeon names/locations
        if (content.includes('Sydney') || content.includes('NSW')) {
          surgeonData.suburbs = ['sydney']; // Default to Sydney
        } else if (content.includes('Melbourne') || content.includes('VIC')) {
          surgeonData.suburbs = ['melbourne']; // Default to Melbourne
        }
        
        console.log(`Processing ${surgeonName}...`);
        addLocationLinksToSurgeonProfile(filePath, surgeonData);
        processed++;
        
      } catch (error) {
        console.log(`❌ ${surgeonName}: Error reading file - ${error.message}`);
      }
    });
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Processed: ${processed} surgeon profiles`);
  console.log(`   Updated: ${updated} pages`);
  console.log(`\n🎯 Next: Run the internal links audit to see the improvement!`);
}

// Run the script
processSurgeonProfiles();

export { addLocationLinksToSurgeonProfile, getLocationLinks };
