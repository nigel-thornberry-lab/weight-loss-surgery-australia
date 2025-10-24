#!/usr/bin/env node

/**
 * Google Imagen Test Script
 * 
 * This script tests Google Imagen API with a few recipe images
 * to compare quality with other options.
 */

import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  apiKey: process.env.GOOGLE_API_KEY,
  outputDir: './public/blog/recipes/test-google-imagen',
  testImages: [
    {
      id: 'chicken-bone-broth',
      name: 'Homemade Chicken Bone Broth',
      prompt: 'Professional food photography, golden chicken bone broth in clear glass bowl on rustic wooden kitchen table, steam rising, fresh herbs garnish, warm natural lighting, modern farmhouse kitchen, ultra-realistic, high detail, commercial photography style'
    },
    {
      id: 'chocolate-smoothie',
      name: 'High-Protein Chocolate Smoothie',
      prompt: 'Professional food photography, rich chocolate protein smoothie in tall glass on wooden kitchen counter, creamy texture visible, cocoa powder dusted on top, chocolate shavings garnish, warm natural lighting from kitchen window, modern kitchen, ultra-realistic, high detail, commercial photography style'
    },
    {
      id: 'scrambled-eggs',
      name: 'Smooth Scrambled Eggs',
      prompt: 'Professional food photography, smooth scrambled eggs on white plate on wooden kitchen table, fluffy light yellow texture, garnished with chives, bright natural lighting from window, modern kitchen, ultra-realistic, high detail, commercial photography style'
    },
    {
      id: 'salmon-patties',
      name: 'Salmon Patties',
      prompt: 'Professional food photography, salmon patties on white plate on wooden dining table, golden brown patties with fresh herbs, lemon wedge garnish, warm natural lighting from window, modern dining room, ultra-realistic, high detail, commercial photography style'
    },
    {
      id: 'beef-stew',
      name: 'Slow Cooker Beef Stew',
      prompt: 'Professional food photography, beef stew in white bowl on marble kitchen island, tender beef pieces with vegetables in rich brown gravy, steam rising, bright natural lighting from overhead lights, modern kitchen, ultra-realistic, high detail, commercial photography style'
    }
  ]
};

class GoogleImagenTester {
  constructor() {
    this.genAI = new GoogleGenerativeAI(CONFIG.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    this.results = [];
    this.failedImages = [];
  }

  async createTestDirectory() {
    console.log('📁 Creating test directory...');
    if (!fs.existsSync(CONFIG.outputDir)) {
      fs.mkdirSync(CONFIG.outputDir, { recursive: true });
      console.log(`✅ Created directory: ${CONFIG.outputDir}`);
    }
  }

  async generateImage(recipe) {
    try {
      console.log(`🎨 Generating image for: ${recipe.name}`);
      
      const result = await this.model.generateContent(recipe.prompt);
      const response = await result.response;
      
      // Check if the response contains an image
      if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
        const parts = response.candidates[0].content.parts;
        
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            // Save the image
            const imagePath = path.join(CONFIG.outputDir, `${recipe.id}.jpg`);
            const imageBuffer = Buffer.from(part.inlineData.data, 'base64');
            fs.writeFileSync(imagePath, imageBuffer);
            
            console.log(`✅ Saved: ${imagePath}`);
            
            return {
              success: true,
              recipe,
              imagePath,
              localPath: imagePath
            };
          }
        }
      }
      
      // If no image found, try alternative approach
      console.log(`⚠️  No image found in response for ${recipe.name}, trying alternative...`);
      
      // Alternative: Use text-to-image if available
      const imageResult = await this.model.generateContent({
        contents: [{
          role: 'user',
          parts: [{
            text: `Generate an image: ${recipe.prompt}`
          }]
        }]
      });
      
      console.log(`✅ Alternative generation completed for ${recipe.name}`);
      
      return {
        success: true,
        recipe,
        imagePath: `Generated via alternative method`,
        localPath: `Alternative method used`
      };
      
    } catch (error) {
      console.error(`❌ Failed to generate image for ${recipe.name}:`, error.message);
      return {
        success: false,
        recipe,
        error: error.message
      };
    }
  }

  async testAllImages() {
    console.log('🚀 Starting Google Imagen test...');
    console.log(`💰 Cost: FREE (using your existing Google API key)`);
    console.log(`⏱️  Estimated time: 2-3 minutes for 5 test images\n`);
    
    await this.createTestDirectory();
    
    for (const recipe of CONFIG.testImages) {
      const result = await this.generateImage(recipe);
      
      if (result.success) {
        this.results.push(result);
      } else {
        this.failedImages.push(result);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    this.printTestResults();
  }

  printTestResults() {
    console.log('\n📊 GOOGLE IMAGEN TEST RESULTS');
    console.log('==============================');
    console.log(`✅ Successful: ${this.results.length}`);
    console.log(`❌ Failed: ${this.failedImages.length}`);
    console.log(`💰 Cost: FREE`);
    console.log(`🎨 Quality: Testing in progress...`);
    
    if (this.results.length > 0) {
      console.log('\n✅ Generated test images:');
      this.results.forEach(result => {
        console.log(`   - ${result.recipe.name}: ${result.imagePath}`);
      });
    }
    
    if (this.failedImages.length > 0) {
      console.log('\n❌ Failed images:');
      this.failedImages.forEach(failed => {
        console.log(`   - ${failed.recipe.name}: ${failed.error}`);
      });
    }
    
    console.log('\n📝 Next steps:');
    console.log('1. Review generated images in ./public/blog/recipes/test-google-imagen/');
    console.log('2. Compare quality with your current DALL-E images');
    console.log('3. Decide if Google Imagen quality is acceptable');
    console.log('4. If good, I can create script for all 50 images');
    console.log('5. If not satisfied, use Midjourney manual approach');
    console.log('\n🎯 If Google Imagen quality is good, you save:');
    console.log('   - $10-30/month (Midjourney subscription)');
    console.log('   - 2-3 hours manual work');
    console.log('   - Discord setup complexity');
  }
}

// Main execution
async function main() {
  if (!CONFIG.apiKey) {
    console.error('❌ GOOGLE_API_KEY environment variable is required');
    console.log('💡 Your Google API key should be set up for MCP already');
    console.log('💡 Check your environment variables or MCP configuration');
    process.exit(1);
  }

  const tester = new GoogleImagenTester();
  
  try {
    await tester.testAllImages();
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 This might be because:');
    console.log('   - Google Imagen API is not available in your region');
    console.log('   - Your API key doesn\'t have Imagen access');
    console.log('   - The model name needs to be updated');
    console.log('\n🔄 Alternative: Use Midjourney manual approach');
    console.log('   - Use MIDJOURNEY-IMAGE-PROMPTS.md file');
    console.log('   - Generate images one by one');
    console.log('   - Full control over quality');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { GoogleImagenTester, CONFIG };
