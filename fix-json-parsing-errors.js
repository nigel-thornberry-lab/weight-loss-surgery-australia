#!/usr/bin/env node

/**
 * Fix JSON Parsing Errors in Schema Markup
 * Fixes the issue where JSON.stringify() is being output as literal text instead of being executed
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let fixedCount = 0;
let errorCount = 0;
const errors = [];

console.log('🔧 Fixing JSON Parsing Errors in Schema Markup...\n');

// Function to fix JSON.stringify issues in a file
function fixJsonStringifyIssues(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Pattern 1: Fix script tags with JSON.stringify that are not using set:html
    // From: <script type="application/ld+json">\n      {JSON.stringify({...})}\n    </script>
    // To: <script type="application/ld+json" set:html={JSON.stringify({...})} />
    const pattern1 = /<script type="application\/ld\+json">\s*\n\s*\{JSON\.stringify\(/g;
    const replacement1 = '<script type="application/ld+json" set:html={JSON.stringify(';
    
    content = content.replace(pattern1, replacement1);
    
    // Pattern 2: Fix the closing part
    // From: ...})\n    </script>
    // To: ...})} />
    const pattern2 = /\)\}\s*\n\s*<\/script>/g;
    const replacement2 = '})} />';
    
    content = content.replace(pattern2, replacement2);
    
    // Pattern 3: Fix any remaining issues with JSON.stringify in script tags
    // Look for script tags that contain JSON.stringify but don't have set:html
    const pattern3 = /<script type="application\/ld\+json">([^<]*\{JSON\.stringify\([^}]*\}\)[^<]*)<\/script>/gs;
    content = content.replace(pattern3, (match, jsonContent) => {
      // Extract the JSON.stringify part
      const jsonMatch = jsonContent.match(/\{JSON\.stringify\(([^}]+)\)\}/);
      if (jsonMatch) {
        return `<script type="application/ld+json" set:html={JSON.stringify(${jsonMatch[1]})} />`;
      }
      return match;
    });
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      fixedCount++;
      console.log(`✅ Fixed: ${path.relative(__dirname, filePath)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    errors.push(`${filePath}: ${error.message}`);
    errorCount++;
    console.log(`❌ Error in ${path.relative(__dirname, filePath)}: ${error.message}`);
    return false;
  }
}

// Function to recursively find all .astro files
function findAstroFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (item.endsWith('.astro')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Main execution
try {
  const srcDir = path.join(__dirname, 'src');
  const astroFiles = findAstroFiles(srcDir);
  
  console.log(`Found ${astroFiles.length} .astro files to check...\n`);
  
  for (const file of astroFiles) {
    fixJsonStringifyIssues(file);
  }
  
  console.log(`\n🎉 JSON Parsing Errors Fixed!`);
  console.log(`✅ Files fixed: ${fixedCount}`);
  console.log(`❌ Errors encountered: ${errorCount}`);
  
  if (errors.length > 0) {
    console.log(`\n❌ Files with errors:`);
    errors.forEach(error => console.log(`   ${error}`));
  }
  
  console.log(`\n📋 Next Steps:`);
  console.log(`1. Run: npm run build`);
  console.log(`2. Check for any remaining JSON parsing errors`);
  console.log(`3. Test a few pages to ensure schema markup is working`);
  console.log(`4. Submit sitemaps to Google Search Console`);
  
} catch (error) {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
}
