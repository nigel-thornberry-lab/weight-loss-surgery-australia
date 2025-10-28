const fs = require('fs');

/**
 * Final Surgeon Name Fix Script
 * 
 * This script specifically targets the problematic surgeon names that include
 * business names and locations, cleaning them to just include title and name.
 */

// Function to clean surgeon names
function cleanSurgeonName(originalName) {
  if (!originalName) return '';
  
  // Skip if it's already clean (short and doesn't contain business terms)
  if (originalName.length < 50 && !originalName.includes(' - ') && !originalName.includes(' | ') && !originalName.includes('Centre') && !originalName.includes('Surgery') && !originalName.includes('Clinic')) {
    return originalName;
  }
  
  let cleaned = originalName;
  
  // Pattern 1: "Mr.Niruben Rajasagaram - Victorian Specialist Surgery & Weight Loss Centre"
  // Pattern 2: "Mr.Niruben Rajasagaram | Victorian Specialist Surgery & Weight loss centre"
  // Pattern 3: "Dr. John Smith – Bariatric Surgeon for Gastric Sleeve & Weight Loss Surgery Melbourne"
  
  // Remove everything after " - " or " | " or " – "
  cleaned = cleaned.replace(/\s*[-|–]\s*.*$/, '');
  
  // Remove common business suffixes that might still be attached
  const businessSuffixes = [
    /\s+(bariatric|weight\s*loss|surgery|specialist|centre|center|clinic|medical|health|group|practice|associates?|surgical|institute|hospital|healthcare|care|services?|solutions?|australia|melbourne|sydney|brisbane|perth|adelaide|gold\s*coast|canberra|hobart|darwin|tasmania|queensland|victoria|new\s*south\s*wales|western\s*australia|south\s*australia|northern\s*territory|australian\s*capital\s*territory|nsw|vic|qld|wa|sa|nt|act|tas)$/gi,
    /\s+(for\s*gastric\s*sleeve|&|and|weight\s*loss\s*surgery)$/gi,
    /\s+(pvt\s*ltd|pty\s*ltd|private\s*limited|inc|incorporated|llc|llp|partnership|associates?|group|holdings?|enterprises?|ventures?|international|global|worldwide|australia|australian)$/gi,
    /\s+(gallbladder|cosmetics|laser|skin|treatment|body|clinic)$/gi,
    /\s+(moggs|melbourne|oesophagogastric|general|surgery|east|melbourne)$/gi,
    /\s+(innerwest|ugit|surgery)$/gi,
    /\s+(lindfield|general|surgery|sydney|heartburn|clinic)$/gi,
    /\s+(langwarrin|mbsa)$/gi,
    /\s+(campbelltown)$/gi,
    /\s+(upper-gi|weight\s*loss|surgeon)$/gi
  ];
  
  businessSuffixes.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
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
    .replace(/^(Dr|Mr|Mrs|Ms|Prof|A\/Prof|Professor|Associate\s*Professor)\s*/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  const citySlug = city.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  return `${nameForSlug}-${citySlug}`;
}

// Function to process CSV file
function processCSVFile(inputFile, outputFile) {
  console.log('Reading CSV file...');
  const csvContent = fs.readFileSync(inputFile, 'utf-8');
  
  // Split by lines but handle multi-line fields properly
  const lines = csvContent.split('\n');
  
  console.log(`Processing ${lines.length} lines...`);
  
  const processedLines = [];
  const nameMapping = new Map();
  let currentLine = '';
  let inQuotedField = false;
  let quoteCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Count quotes to determine if we're in a multi-line field
    const lineQuotes = (line.match(/"/g) || []).length;
    quoteCount += lineQuotes;
    
    if (i === 0) {
      // Header line
      processedLines.push(line);
      continue;
    }
    
    currentLine += (currentLine ? '\n' : '') + line;
    
    // If quote count is even, we have a complete record
    if (quoteCount % 2 === 0 && line.trim()) {
      // Parse the complete line
      const columns = parseCSVLine(currentLine);
      
      if (columns.length >= 2) {
        const originalName = columns[0];
        const city = columns[4] || '';
        
        // Only process if this looks like a surgeon name
        if (originalName && !originalName.includes('**') && !originalName.includes('Gastric') && !originalName.includes('Bariatric') && originalName.length < 200) {
          const cleanedName = cleanSurgeonName(originalName);
          
          if (originalName !== cleanedName) {
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
            
            // Reconstruct the line
            const reconstructedLine = columns.map(escapeCSVField).join(',');
            processedLines.push(reconstructedLine);
          } else {
            processedLines.push(currentLine);
          }
        } else {
          processedLines.push(currentLine);
        }
      } else {
        processedLines.push(currentLine);
      }
      
      // Reset for next record
      currentLine = '';
      quoteCount = 0;
    }
  }
  
  // Handle any remaining line
  if (currentLine.trim()) {
    processedLines.push(currentLine);
  }
  
  // Write the cleaned CSV
  console.log('Writing cleaned CSV file...');
  fs.writeFileSync(outputFile, processedLines.join('\n'));
  
  // Write name mapping for reference
  console.log('Writing name mapping file...');
  const mappingData = Array.from(nameMapping.entries()).map(([old, newName]) => ({
    original: old,
    cleaned: newName
  }));
  fs.writeFileSync('surgeon-name-mapping-final.json', JSON.stringify(mappingData, null, 2));
  
  console.log(`✅ CSV processing complete!`);
  console.log(`📁 Output file: ${outputFile}`);
  console.log(`📁 Name mapping: surgeon-name-mapping-final.json`);
  console.log(`📊 Processed ${nameMapping.size} surgeon names`);
  
  return nameMapping;
}

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

// Function to escape CSV field
function escapeCSVField(field) {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return '"' + field.replace(/"/g, '""') + '"';
  }
  return field;
}

// Main execution
function main() {
  console.log('🎯 Starting Final Surgeon Name Fix...\n');
  
  const inputFile = 'surgeons-complete-data.csv';
  const outputFile = 'surgeons-complete-data-final.csv';
  
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Input file not found: ${inputFile}`);
    return;
  }
  
  try {
    // Process CSV file
    const nameMapping = processCSVFile(inputFile, outputFile);
    
    console.log('\n✅ Final surgeon name fix complete!');
    console.log('\n📋 Summary:');
    console.log(`   • Fixed CSV: ${outputFile}`);
    console.log(`   • Name mapping: surgeon-name-mapping-final.json`);
    console.log(`   • Fixed ${nameMapping.size} surgeon names`);
    
    // Show some examples
    console.log('\n📝 Examples of cleaned names:');
    const examples = Array.from(nameMapping.entries()).slice(0, 10);
    examples.forEach(([original, cleaned]) => {
      console.log(`   • "${original}" → "${cleaned}"`);
    });
    
  } catch (error) {
    console.error('❌ Error during fix process:', error);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  cleanSurgeonName,
  generateCleanSlug,
  processCSVFile
};
