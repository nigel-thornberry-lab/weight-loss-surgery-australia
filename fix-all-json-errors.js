#!/usr/bin/env node

/**
 * Comprehensive Fix for JSON Parsing Errors in Schema Markup
 * Fixes all instances where JSON.stringify() is being output as literal text
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let fixedCount = 0;
let errorCount = 0;
const errors = [];

console.log('🔧 Comprehensive Fix for JSON Parsing Errors...\n');

// Function to fix JSON.stringify issues in a file
function fixJsonStringifyIssues(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Pattern 1: Fix the most common issue - script tags with JSON.stringify that are not using set:html
    // From: <script type="application/ld+json">\n      {JSON.stringify({...})}\n    </script>
    // To: <script type="application/ld+json" set:html={JSON.stringify({...})} />
    
    // First, find all script tags with JSON.stringify
    const scriptTagPattern = /<script type="application\/ld\+json">\s*\n\s*\{JSON\.stringify\(/g;
    content = content.replace(scriptTagPattern, '<script type="application/ld+json" set:html={JSON.stringify(');
    
    // Pattern 2: Fix the closing part
    // From: ...})\n    </script>
    // To: ...})} />
    const closingPattern = /\)\}\s*\n\s*<\/script>/g;
    content = content.replace(closingPattern, '})} />');
    
    // Pattern 3: Fix any remaining issues with JSON.stringify in script tags
    // Look for script tags that contain JSON.stringify but don't have set:html
    const complexPattern = /<script type="application\/ld\+json">([^<]*\{JSON\.stringify\([^}]*\}\)[^<]*)<\/script>/gs;
    content = content.replace(complexPattern, (match, jsonContent) => {
      // Extract the JSON.stringify part
      const jsonMatch = jsonContent.match(/\{JSON\.stringify\(([^}]+)\)\}/);
      if (jsonMatch) {
        return `<script type="application/ld+json" set:html={JSON.stringify(${jsonMatch[1]})} />`;
      }
      return match;
    });
    
    // Pattern 4: Fix any remaining script tags that have JSON.stringify without set:html
    const remainingPattern = /<script type="application\/ld\+json">\s*\{JSON\.stringify\(([^}]+)\)\}\s*<\/script>/g;
    content = content.replace(remainingPattern, '<script type="application/ld+json" set:html={JSON.stringify($1)} />');
    
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
  
  // First, find all files that contain JSON.stringify
  const filesWithJsonStringify = astroFiles.filter(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      return content.includes('JSON.stringify');
    } catch (error) {
      return false;
    }
  });
  
  console.log(`Found ${filesWithJsonStringify.length} files with JSON.stringify...\n`);
  
  for (const file of filesWithJsonStringify) {
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
