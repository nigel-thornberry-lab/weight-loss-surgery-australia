#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Recipe page files
const recipePages = [
  '/Users/Cameron/Desktop/weight-loss-surgery-australia/src/pages/blog/stage-1-clear-liquid-recipes.astro',
  '/Users/Cameron/Desktop/weight-loss-surgery-australia/src/pages/blog/stage-2-full-liquid-recipes.astro',
  '/Users/Cameron/Desktop/weight-loss-surgery-australia/src/pages/blog/stage-3-pureed-food-recipes.astro',
  '/Users/Cameron/Desktop/weight-loss-surgery-australia/src/pages/blog/stage-4-soft-food-recipes.astro'
];

// Load image data
const imageData = JSON.parse(fs.readFileSync('/Users/Cameron/Desktop/weight-loss-surgery-australia/recipe-image-data.json', 'utf8'));

// Comprehensive recipe name mappings
const recipeMappings = {
  // Stage 1
  'Homemade Chicken Bone Broth': 'chicken-bone-broth',
  'Vegetable Consommé': 'vegetable-stock',
  'Vegetable Stock': 'vegetable-stock',
  'Herbal Iced Tea': 'herbal-iced-tea',
  'Rich Beef Bone Broth': 'beef-bone-broth',
  'Vegetable Stock (Vegan)': 'vegetable-stock',
  'Lemon Ginger Infused Water': 'lemon-ginger-water',
  'Warm Apple Cider (Strained)': 'apple-cider',
  'Warm Apple Cider': 'apple-cider',
  'Diluted Cranberry Juice': 'cranberry-juice',
  'Sugar-Free Jelly': 'sugar-free-jelly',
  
  // Stage 2
  'Classic Vanilla Protein Shake': 'vanilla-protein-shake',
  'Strawberry Banana Protein Smoothie': 'strawberry-banana-smoothie',
  'Creamy Pumpkin Soup (Strained)': 'pumpkin-soup',
  'Creamy Pumpkin Soup': 'pumpkin-soup',
  'Greek Yogurt Protein Drink': 'greek-yogurt-bowl',
  'Chocolate Peanut Butter Shake': 'chocolate-smoothie',
  'Creamy Tomato Soup': 'tomato-soup',
  'Vanilla Chia Protein Pudding': 'chia-pudding',
  'Chicken Broth Protein Boost': 'chicken-noodle-soup',
  'Berry Blast Smoothie': 'strawberry-banana-smoothie',
  'Creamy Cauliflower Soup': 'butternut-squash-soup',
  'Tropical Green Smoothie': 'green-smoothie',
  'Sugar-Free Chocolate Pudding': 'protein-hot-chocolate',
  'Mocha Protein Coffee Shake': 'mango-lassi',
  
  // Stage 3
  'Creamy Chicken Puree': 'pureed-chicken',
  'Tuna Salad Puree': 'tuna-salad-puree',
  'Salmon & Sweet Potato Puree': 'pureed-salmon',
  'Refried Bean Puree': 'pureed-beans',
  'Cottage Cheese & Fruit Puree': 'cottage-cheese-puree',
  'Egg Salad Puree': 'scrambled-eggs',
  'Hummus with Greek Yogurt': 'hummus-puree',
  'Turkey & Gravy Puree': 'pureed-turkey',
  'Ricotta & Spinach Puree': 'ricotta-spinach',
  'Lentil & Carrot Puree': 'pureed-lentils',
  'White Fish with Pea Puree': 'pureed-white-fish',
  'Tofu Scramble Puree': 'scrambled-eggs',
  'Avocado & Tuna Puree': 'avocado-puree',
  'Butternut Squash & Chicken Puree': 'butternut-squash-puree',
  
  // Stage 4
  'Scrambled Eggs with Cheese': 'scrambled-eggs-cheese',
  'Tender Chicken Stir-Fry': 'chicken-stir-fry',
  'Baked Fish with Mashed Cauliflower': 'baked-fish-cauliflower',
  'Turkey Meatballs in Tomato Sauce': 'turkey-meatballs',
  'Cottage Cheese Bake': 'cottage-cheese-bake',
  'Pulled Chicken with Soft Vegetables': 'pulled-chicken',
  'Slow Cooker Beef Stew': 'beef-stew'
};

// Function to replace AI IMAGE placeholders with actual images
function replaceAllAIImages(content) {
  let updatedCount = 0;
  
  // Pattern 1: Full gradient div with AI IMAGE text
  const pattern1 = /<div style="background: linear-gradient\([^)]+\); height: 300px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1\.5rem; font-weight: bold; text-align: center; padding: 2rem;">\s*<div>\s*<div style="font-size: 3rem; margin-bottom: 0\.5rem;">[^<]+<\/div>\s*<div>AI IMAGE: ([^<]+)<\/div>\s*<div style="[^"]*">[^<]+<\/div>\s*<\/div>\s*<\/div>/g;
  
  content = content.replace(pattern1, (match, recipeName) => {
    const cleanRecipeName = recipeName.trim();
    const imageKey = recipeMappings[cleanRecipeName];
    
    if (imageKey && imageData[imageKey]) {
      const imageInfo = imageData[imageKey];
      updatedCount++;
      console.log(`  ✓ Replaced: ${cleanRecipeName}`);
      
      return `<div style="display: flex; justify-content: center; margin: 2rem 0;">
    <img 
      src="${imageInfo.src}" 
      alt="${imageInfo.alt}"
      title="${imageInfo.title}"
      style="max-width: 600px; width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"
      loading="lazy"
      decoding="async"
    />
  </div>`;
    }
    
    console.log(`  ⚠️  No mapping found for: ${cleanRecipeName}`);
    return match;
  });
  
  return { content, updatedCount };
}

// Function to update a recipe page
function updateRecipePage(filePath, pageName) {
  console.log(`\n🔄 Replacing AI images in ${pageName}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  const { content: updatedContent, updatedCount } = replaceAllAIImages(content);
  
  // Write updated content back to file
  fs.writeFileSync(filePath, updatedContent);
  console.log(`✅ ${pageName} complete: ${updatedCount} AI images replaced`);
  
  return updatedCount;
}

// Main function
function main() {
  console.log('🚀 Replacing ALL remaining AI IMAGE placeholders...\n');
  
  let totalReplaced = 0;
  
  recipePages.forEach((filePath, index) => {
    const pageNames = [
      'Stage 1: Clear Liquid Recipes',
      'Stage 2: Full Liquid Recipes', 
      'Stage 3: Pureed Food Recipes',
      'Stage 4: Soft Food Recipes'
    ];
    
    const pageName = pageNames[index] || `Page ${index + 1}`;
    const replaced = updateRecipePage(filePath, pageName);
    totalReplaced += replaced;
  });
  
  console.log(`\n🎉 Complete! ${totalReplaced} AI images replaced with real images.`);
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
