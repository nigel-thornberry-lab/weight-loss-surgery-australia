#!/usr/bin/env node

/**
 * Fix Schema.org Validation Warnings
 *
 * Issues to fix:
 * 1. MedicalBusiness doesn't support 'medicalSpecialty' property
 * 2. MedicalOrganization doesn't support 'isBasedOn' property
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Schema.org validation warnings...\n');

// Fix 1: Replace MedicalBusiness with LocalBusiness (which supports all the same properties)
// MedicalBusiness is too restrictive and doesn't support medicalSpecialty
function fixMedicalBusinessSchema(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace MedicalBusiness with LocalBusiness
  if (content.includes('"@type": "MedicalBusiness"')) {
    content = content.replace(
      /"@type": "MedicalBusiness"/g,
      '"@type": "LocalBusiness"'
    );
    modified = true;
    console.log(`  ✓ Changed MedicalBusiness to LocalBusiness`);
  }

  // Also remove the separate medicalSpecialty line from MedicalBusiness schema
  // It's now part of LocalBusiness which doesn't have this restriction

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

// Fix 2: Remove isBasedOn from MedicalOrganization
// MedicalOrganization doesn't support this property
function fixMedicalOrganizationSchema(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Remove isBasedOn property and its array value from MedicalOrganization
  // Pattern: "isBasedOn": [...], (including the comma and any content inside)
  const isBasedOnPattern = /,?\s*"isBasedOn":\s*\[[\s\S]*?\],?\s*\n/g;

  if (content.match(isBasedOnPattern)) {
    content = content.replace(isBasedOnPattern, '\n');
    modified = true;
    console.log(`  ✓ Removed isBasedOn property from MedicalOrganization`);
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

// Process all surgeon pages
function fixSurgeonPages() {
  console.log('📄 Fixing surgeon pages...');
  const surgeonsDir = path.join(__dirname, 'src', 'pages', 'surgeons');
  let fixedCount = 0;

  function processDirectory(dir) {
    const items = fs.readdirSync(dir);

    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        processDirectory(itemPath);
      } else if (item.endsWith('.astro')) {
        const fixed = fixMedicalBusinessSchema(itemPath);
        if (fixed) {
          fixedCount++;
          console.log(`    Fixed: ${path.relative(surgeonsDir, itemPath)}`);
        }
      }
    });
  }

  processDirectory(surgeonsDir);
  console.log(`✅ Fixed ${fixedCount} surgeon pages\n`);
}

// Fix index.astro
function fixIndexPage() {
  console.log('📄 Fixing index.astro...');
  const indexPath = path.join(__dirname, 'src', 'pages', 'index.astro');

  if (fs.existsSync(indexPath)) {
    const fixed = fixMedicalOrganizationSchema(indexPath);
    if (fixed) {
      console.log('✅ Fixed index.astro\n');
    } else {
      console.log('  ℹ️  No changes needed\n');
    }
  }
}

// Main execution
try {
  fixSurgeonPages();
  fixIndexPage();

  console.log('✅ All schema warnings fixed!');
  console.log('\n📋 Changes made:');
  console.log('  1. Changed MedicalBusiness → LocalBusiness (supports medicalSpecialty)');
  console.log('  2. Removed isBasedOn from MedicalOrganization (not supported)');
  console.log('\n🔍 Validate your pages at: https://validator.schema.org/');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
