const fs = require('fs');
const path = require('path');

/**
 * Clean Surgeon Names Script V2
 * 
 * This script properly handles CSV parsing and cleans up surgeon names to only include 
 * the title (Dr, Mr, Prof, etc.) and the actual name, removing business names, locations, 
 * and other unnecessary text.
 */

// Function to parse CSV line properly handling quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current);
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  // Add the last field
  result.push(current);
  
  return result;
}

// Function to clean surgeon names
function cleanSurgeonName(originalName) {
  if (!originalName) return '';
  
  // Common patterns to remove
  const patternsToRemove = [
    // Business names and centers
    /-?\s*(bariatric|weight\s*loss|surgery|specialist|centre|center|clinic|medical|health|group|practice|associates?|surgical|institute|hospital|healthcare|care|services?|solutions?|australia|melbourne|sydney|brisbane|perth|adelaide|gold\s*coast|canberra|hobart|darwin|tasmania|queensland|victoria|new\s*south\s*wales|western\s*australia|south\s*australia|northern\s*territory|australian\s*capital\s*territory)/gi,
    
    // Location references
    /-?\s*(for\s*gastric\s*sleeve|&|and|weight\s*loss\s*surgery|melbourne|sydney|brisbane|perth|adelaide|gold\s*coast|canberra|hobart|darwin|tasmania|queensland|victoria|new\s*south\s*wales|western\s*australia|south\s*australia|northern\s*territory|australian\s*capital\s*territory|nsw|vic|qld|wa|sa|nt|act|tas)/gi,
    
    // Common business suffixes
    /-?\s*(pvt\s*ltd|pty\s*ltd|private\s*limited|inc|incorporated|llc|llp|partnership|associates?|group|holdings?|enterprises?|ventures?|international|global|worldwide|australia|australian)/gi,
    
    // Special characters and extra spaces
    /[–—]/g, // Replace en-dash and em-dash with regular dash
    /\s+/g, // Replace multiple spaces with single space
    /^\s+|\s+$/g, // Trim whitespace
  ];
  
  let cleaned = originalName;
  
  // Apply all patterns
  patternsToRemove.forEach(pattern => {
    cleaned = cleaned.replace(pattern, ' ');
  });
  
  // Clean up extra spaces and dashes
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  cleaned = cleaned.replace(/^-+|-+$/g, '').trim();
  cleaned = cleaned.replace(/\s*-+\s*/g, ' ').trim();
  
  // If the name is too short or empty, return original
  if (cleaned.length < 3) {
    return originalName;
  }
  
  return cleaned;
}

// Function to generate clean slug
function generateCleanSlug(name, city) {
  const cleanName = cleanSurgeonName(name);
  
  // Extract just the name part (remove title for slug)
  let nameForSlug = cleanName
    .replace(/^(Dr|Mr|Mrs|Ms|Prof|A\/Prof|Professor|Associate\s*Professor)\s+/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  const citySlug = city.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  return `${nameForSlug}-${citySlug}`;
}

// Function to escape CSV field
function escapeCSVField(field) {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return '"' + field.replace(/"/g, '""') + '"';
  }
  return field;
}

// Function to process CSV file
function processCSVFile(inputFile, outputFile) {
  console.log('Reading CSV file...');
  const csvContent = fs.readFileSync(inputFile, 'utf-8');
  const lines = csvContent.split('\n');
  
  if (lines.length < 2) {
    console.error('Invalid CSV file');
    return;
  }
  
  const header = lines[0];
  const dataLines = lines.slice(1);
  
  console.log(`Processing ${dataLines.length} surgeon records...`);
  
  const processedLines = [header];
  const nameMapping = new Map(); // Track old name -> new name mapping
  
  dataLines.forEach((line, index) => {
    if (!line.trim()) {
      processedLines.push(line);
      return;
    }
    
    const columns = parseCSVLine(line);
    if (columns.length < 2) {
      processedLines.push(line);
      return;
    }
    
    const originalName = columns[0];
    const city = columns[4] || ''; // Assuming city is in column 4
    
    // Only process if this looks like a surgeon name (not bio text)
    if (originalName.includes('**') || originalName.includes('Gastric') || originalName.includes('Bariatric') || originalName.length > 100) {
      processedLines.push(line);
      return;
    }
    
    // Clean the name
    const cleanedName = cleanSurgeonName(originalName);
    
    // Store mapping for reference
    nameMapping.set(originalName, cleanedName);
    
    // Update the first column with cleaned name
    columns[0] = cleanedName;
    
    // Update slug if it exists (assuming slug is in column 13)
    if (columns[13]) {
      const newSlug = generateCleanSlug(cleanedName, city);
      columns[13] = newSlug;
    }
    
    // Update meta title if it exists (assuming meta_title is in column 16)
    if (columns[16]) {
      const metaTitle = `${cleanedName} - Bariatric Surgeon ${city} | Gastric Sleeve & Bypass`;
      columns[16] = metaTitle;
    }
    
    // Update meta description if it exists (assuming meta_description is in column 17)
    if (columns[17]) {
      const metaDescription = `${cleanedName} is an experienced bariatric surgeon in ${city}. Book your consultation for gastric sleeve, bypass, or band surgery.`;
      columns[17] = metaDescription;
    }
    
    // Reconstruct the line with proper CSV escaping
    const reconstructedLine = columns.map(escapeCSVField).join(',');
    processedLines.push(reconstructedLine);
    
    if ((index + 1) % 50 === 0) {
      console.log(`  Processed ${index + 1}/${dataLines.length} records...`);
    }
  });
  
  // Write the cleaned CSV
  console.log('Writing cleaned CSV file...');
  fs.writeFileSync(outputFile, processedLines.join('\n'));
  
  // Write name mapping for reference
  console.log('Writing name mapping file...');
  const mappingData = Array.from(nameMapping.entries()).map(([old, newName]) => ({
    original: old,
    cleaned: newName
  }));
  fs.writeFileSync('surgeon-name-mapping-v2.json', JSON.stringify(mappingData, null, 2));
  
  console.log(`✅ CSV processing complete!`);
  console.log(`📁 Output file: ${outputFile}`);
  console.log(`📁 Name mapping: surgeon-name-mapping-v2.json`);
  console.log(`📊 Processed ${nameMapping.size} surgeon names`);
  
  return nameMapping;
}

// Function to update JSON files with cleaned names
function updateJSONFiles(nameMapping) {
  const jsonFiles = [
    'surgeon-enhanced-data-consolidated.json',
    'surgeon-seo-enhancement-data.json',
    'surgeon-enhanced-data.json',
    'surgeon-complete-seo-data.json',
    'surgeon-complete-seo-data-clean.json'
  ];
  
  jsonFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      console.log(`Updating ${filePath}...`);
      
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        let updated = false;
        
        // Update surgeon names in the data
        Object.keys(data).forEach(key => {
          if (data[key].surgeon_name) {
            const originalName = data[key].surgeon_name;
            const cleanedName = cleanSurgeonName(originalName);
            
            if (originalName !== cleanedName) {
              data[key].surgeon_name = cleanedName;
              updated = true;
            }
          }
        });
        
        if (updated) {
          // Create backup
          fs.writeFileSync(`${filePath}.backup`, fs.readFileSync(filePath));
          
          // Write updated file
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
          console.log(`  ✅ Updated ${filePath}`);
        } else {
          console.log(`  ⏭️  No changes needed for ${filePath}`);
        }
      } catch (error) {
        console.error(`  ❌ Error updating ${filePath}:`, error.message);
      }
    } else {
      console.log(`  ⏭️  File not found: ${filePath}`);
    }
  });
}

// Main execution
function main() {
  console.log('🧹 Starting Surgeon Name Cleanup Process V2...\n');
  
  const inputFile = 'surgeons-complete-data.csv';
  const outputFile = 'surgeons-complete-data-cleaned-v2.csv';
  
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Input file not found: ${inputFile}`);
    return;
  }
  
  try {
    // Process CSV file
    const nameMapping = processCSVFile(inputFile, outputFile);
    
    console.log('\n📝 Updating JSON files...');
    updateJSONFiles(nameMapping);
    
    console.log('\n✅ Surgeon name cleanup complete!');
    console.log('\n📋 Summary:');
    console.log(`   • Cleaned CSV: ${outputFile}`);
    console.log(`   • Name mapping: surgeon-name-mapping-v2.json`);
    console.log(`   • Updated JSON files with cleaned names`);
    console.log('\n🔄 Next steps:');
    console.log('   1. Review the cleaned names in surgeon-name-mapping-v2.json');
    console.log('   2. Regenerate affected pages with new clean names');
    console.log('   3. Update any hardcoded references to old names');
    
  } catch (error) {
    console.error('❌ Error during cleanup process:', error);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  cleanSurgeonName,
  generateCleanSlug,
  processCSVFile,
  updateJSONFiles
};
