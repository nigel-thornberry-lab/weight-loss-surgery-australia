const fs = require('fs');

const INPUT_CSV = 'surgeons-with-bios.csv';
const OUTPUT_CSV = 'surgeons-with-bios.csv';

function cleanSurgeonName(name) {
  if (!name || name.trim() === '') return '';
  
  // Remove everything after " - " (hyphen with spaces)
  let cleaned = name.split(' - ')[0].trim();
  
  // Remove everything after " | " (pipe with spaces)
  cleaned = cleaned.split(' | ')[0].trim();
  
  // Remove common suffixes in parentheses
  cleaned = cleaned.replace(/\s*\([^)]*\)/g, '').trim();
  
  return cleaned;
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

function cleanCSV() {
  const content = fs.readFileSync(INPUT_CSV, 'utf-8');
  const lines = content.split('\n');
  
  if (lines.length === 0) {
    console.log('❌ Empty CSV file');
    return;
  }
  
  // Get header
  const header = parseCSVLine(lines[0]);
  const nameIndex = header.indexOf('surgeon_name');
  const businessIndex = header.indexOf('business_name');
  
  if (nameIndex === -1) {
    console.log('❌ surgeon_name column not found');
    return;
  }
  
  console.log(`📋 Found surgeon_name at column ${nameIndex}`);
  console.log(`📋 Found business_name at column ${businessIndex}`);
  
  const outputLines = [lines[0]]; // Keep header
  let cleanedCount = 0;
  
  // Process each line
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = parseCSVLine(lines[i]);
    if (values.length < header.length) continue;
    
    const originalName = values[nameIndex];
    const cleanedName = cleanSurgeonName(originalName);
    
    if (originalName !== cleanedName) {
      console.log(`✂️  "${originalName}" → "${cleanedName}"`);
      cleanedCount++;
    }
    
    values[nameIndex] = cleanedName;
    if (businessIndex !== -1) {
      values[businessIndex] = cleanedName;
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
  
  console.log(`\n✅ Cleaned ${cleanedCount} surgeon names`);
  console.log(`📁 Updated: ${OUTPUT_CSV}`);
  console.log(`\nNext steps:`);
  console.log('1. node scripts/generate-all-profiles.cjs');
  console.log('2. npm run build');
  console.log('3. git add . && git commit -m "Clean surgeon names" && git push');
}

cleanCSV();
