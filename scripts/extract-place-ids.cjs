const fs = require('fs');

const INPUT_CSV = 'surgeons-with-bios.csv';
const OUTPUT_CSV = 'surgeons-with-place-ids.csv';

function extractPlaceId(googleMapsUrl) {
  if (!googleMapsUrl) return '';
  
  // Extract from query_place_id parameter
  const match = googleMapsUrl.match(/query_place_id=([^&]+)/);
  if (match && match[1]) {
    return match[1];
  }
  
  // Extract from place/ URL format
  const placeMatch = googleMapsUrl.match(/place\/[^\/]+\/([^\/\?]+)/);
  if (placeMatch && placeMatch[1] && placeMatch[1].startsWith('ChIJ')) {
    return placeMatch[1];
  }
  
  return '';
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"' && (i === 0 || line[i - 1] === ',')) {
      inQuotes = true;
      continue;
    }
    
    if (char === '"' && nextChar === ',') {
      inQuotes = false;
      continue;
    }
    
    if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
      continue;
    }
    
    current += char;
  }
  
  result.push(current);
  return result;
}

function extractPlaceIds() {
  const content = fs.readFileSync(INPUT_CSV, 'utf-8');
  const lines = content.split('\n');
  
  if (lines.length === 0) {
    console.log('❌ Empty CSV file');
    return;
  }
  
  // Get header
  const header = parseCSVLine(lines[0]);
  const googleMapsUrlIndex = header.indexOf('google_maps_url');
  
  if (googleMapsUrlIndex === -1) {
    console.log('❌ google_maps_url column not found');
    return;
  }
  
  // Add place_id column if not exists
  let placeIdIndex = header.indexOf('place_id');
  if (placeIdIndex === -1) {
    header.push('place_id');
    placeIdIndex = header.length - 1;
    console.log('➕ Added place_id column');
  }
  
  const outputLines = [header.join(',')];
  let extractedCount = 0;
  let totalCount = 0;
  
  // Process each line
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = parseCSVLine(lines[i]);
    if (values.length < header.length - 1) continue; // -1 because we may have just added place_id
    
    totalCount++;
    
    // Ensure values array is long enough
    while (values.length < header.length) {
      values.push('');
    }
    
    const googleMapsUrl = values[googleMapsUrlIndex];
    const placeId = extractPlaceId(googleMapsUrl);
    
    if (placeId) {
      values[placeIdIndex] = placeId;
      extractedCount++;
      const surgeonName = values[1] || 'Unknown'; // Assuming surgeon_name is at index 1
      console.log(`✅ ${surgeonName}: ${placeId}`);
    } else if (googleMapsUrl) {
      console.log(`⚠️  Could not extract Place ID from: ${googleMapsUrl.substring(0, 80)}...`);
    }
    
    // Rebuild line with quotes around fields containing commas
    const rebuiltLine = values.map(val => {
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }).join(',');
    
    outputLines.push(rebuiltLine);
  }
  
  fs.writeFileSync(OUTPUT_CSV, outputLines.join('\n'), 'utf-8');
  
  console.log(`\n📊 SUMMARY:`);
  console.log(`   Total surgeons: ${totalCount}`);
  console.log(`   Place IDs extracted: ${extractedCount}`);
  console.log(`   Missing: ${totalCount - extractedCount}`);
  console.log(`\n✅ Output saved to: ${OUTPUT_CSV}`);
  console.log(`\nNext steps:`);
  console.log('1. Review the output file');
  console.log('2. mv surgeons-with-place-ids.csv surgeons-with-bios.csv');
  console.log('3. Follow GOOGLE-REVIEWS-SETUP-GUIDE.md to set up the API');
}

extractPlaceIds();
