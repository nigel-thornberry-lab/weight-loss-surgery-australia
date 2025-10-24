#!/usr/bin/env node

/**
 * HTML Update Script for Recipe Images
 * 
 * This script updates all HTML files to replace AI image placeholders
 * with actual generated images.
 * 
 * Usage: node update-html-with-images.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  imageMappingFile: './recipe-image-mapping.json',
  htmlFiles: [
    './src/pages/blog/bariatric-surgery-recipes-all-stages.astro',
    './src/pages/blog/stage-1-clear-liquid-recipes.astro',
    './src/pages/blog/stage-2-full-liquid-recipes.astro',
    './src/pages/blog/stage-3-pureed-food-recipes.astro',
    './src/pages/blog/stage-4-soft-food-recipes.astro'
  ],
  backupDir: './html-backups'
};

class HTMLUpdater {
  constructor() {
    this.imageMapping = {};
    this.updatedFiles = [];
    this.errors = [];
  }

  loadImageMapping() {
    try {
      if (!fs.existsSync(CONFIG.imageMappingFile)) {
        throw new Error(`Image mapping file not found: ${CONFIG.imageMappingFile}`);
      }
      
      const mappingData = fs.readFileSync(CONFIG.imageMappingFile, 'utf8');
      this.imageMapping = JSON.parse(mappingData);
      console.log(`✅ Loaded ${Object.keys(this.imageMapping).length} image mappings`);
      
    } catch (error) {
      console.error(`❌ Failed to load image mapping: ${error.message}`);
      throw error;
    }
  }

  createBackup(filePath) {
    if (!fs.existsSync(CONFIG.backupDir)) {
      fs.mkdirSync(CONFIG.backupDir, { recursive: true });
    }
    
    const fileName = path.basename(filePath);
    const backupPath = path.join(CONFIG.backupDir, `${fileName}.backup`);
    fs.copyFileSync(filePath, backupPath);
    console.log(`💾 Created backup: ${backupPath}`);
  }

  updateHTMLFile(filePath) {
    try {
      console.log(`\n🔄 Updating: ${filePath}`);
      
      // Create backup
      this.createBackup(filePath);
      
      // Read file content
      let content = fs.readFileSync(filePath, 'utf8');
      let updated = false;
      
      // Find and replace AI image placeholders
      const placeholderRegex = /<!-- AI IMAGE PLACEHOLDER: ([^>]+) -->[\s\S]*?<div[^>]*>[\s\S]*?\[AI IMAGE: ([^\]]+)\][\s\S]*?<\/div>/g;
      
      content = content.replace(placeholderRegex, (match, prompt, recipeName) => {
        // Extract recipe ID from recipe name
        const recipeId = this.extractRecipeId(recipeName);
        
        if (this.imageMapping[recipeId]) {
          const imagePath = this.imageMapping[recipeId];
          console.log(`   ✅ Replacing placeholder for: ${recipeName} → ${imagePath}`);
          updated = true;
          
          return `<!-- Real image: ${recipeName} -->
  <img 
    src="${imagePath}" 
    alt="${recipeName}" 
    style="width: 100%; height: 300px; object-fit: cover; border-radius: 0;"
    loading="lazy"
  />`;
        } else {
          console.log(`   ⚠️  No image found for: ${recipeName} (ID: ${recipeId})`);
          return match; // Keep original placeholder
        }
      });
      
      // Write updated content
      if (updated) {
        fs.writeFileSync(filePath, content, 'utf8');
        this.updatedFiles.push(filePath);
        console.log(`✅ Updated: ${filePath}`);
      } else {
        console.log(`ℹ️  No changes needed: ${filePath}`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to update ${filePath}: ${error.message}`);
      this.errors.push({ file: filePath, error: error.message });
    }
  }

  extractRecipeId(recipeName) {
    // Convert recipe name to ID format
    return recipeName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/\([^)]*\)/g, '') // Remove parentheses and content
      .trim();
  }

  updateAllFiles() {
    console.log('🚀 Starting HTML updates...');
    
    this.loadImageMapping();
    
    for (const filePath of CONFIG.htmlFiles) {
      if (fs.existsSync(filePath)) {
        this.updateHTMLFile(filePath);
      } else {
        console.log(`⚠️  File not found: ${filePath}`);
      }
    }
    
    this.printSummary();
  }

  printSummary() {
    console.log('\n📊 UPDATE SUMMARY');
    console.log('=================');
    console.log(`✅ Files updated: ${this.updatedFiles.length}`);
    console.log(`❌ Errors: ${this.errors.length}`);
    
    if (this.updatedFiles.length > 0) {
      console.log('\n✅ Updated files:');
      this.updatedFiles.forEach(file => {
        console.log(`   - ${file}`);
      });
    }
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach(error => {
        console.log(`   - ${error.file}: ${error.error}`);
      });
    }
    
    if (this.updatedFiles.length > 0) {
      console.log('\n🎉 HTML updates complete!');
      console.log('\n📝 Next steps:');
      console.log('1. Test the website to ensure images load correctly');
      console.log('2. Check that all placeholders have been replaced');
      console.log('3. Deploy changes to production');
      console.log('\n💾 Backups created in: ./html-backups/');
    }
  }
}

// Main execution
async function main() {
  const updater = new HTMLUpdater();
  
  try {
    updater.updateAllFiles();
  } catch (error) {
    console.error('❌ Update failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { HTMLUpdater, CONFIG };
