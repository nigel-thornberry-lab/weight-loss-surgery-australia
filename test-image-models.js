#!/usr/bin/env node

/**
 * Image Model Testing Script
 * 
 * This script generates the first recipe (Chicken Bone Broth) with different
 * models and settings so you can compare results and choose the best one.
 * 
 * Usage: node test-image-models.js
 */

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  apiKey: process.env.OPENAI_API_KEY,
  outputDir: './public/blog/recipes/test-models',
  testRecipe: {
    id: 'chicken-bone-broth',
    name: 'Homemade Chicken Bone Broth',
    basePrompt: 'Ultra-photorealistic food photography: golden chicken bone broth in a clear glass bowl on a rustic wooden kitchen table, steam rising naturally, garnished with fresh thyme and parsley, warm natural lighting from kitchen window, shallow depth of field, shot with professional camera, modern farmhouse kitchen setting, 8K resolution, hyper-detailed textures'
  }
};

// Different model configurations to test
const MODEL_CONFIGS = [
  {
    name: 'DALL-E-3-Standard',
    model: 'dall-e-3',
    size: '1024x1024',
    quality: 'standard',
    prompt: CONFIG.testRecipe.basePrompt
  },
  {
    name: 'DALL-E-3-HD',
    model: 'dall-e-3',
    size: '1024x1024',
    quality: 'hd',
    prompt: CONFIG.testRecipe.basePrompt
  },
  {
    name: 'DALL-E-3-Portrait',
    model: 'dall-e-3',
    size: '1024x1792',
    quality: 'hd',
    prompt: CONFIG.testRecipe.basePrompt
  },
  {
    name: 'DALL-E-3-Enhanced-Prompt',
    model: 'dall-e-3',
    size: '1024x1024',
    quality: 'hd',
    prompt: 'Professional food photography, golden chicken bone broth in clear glass bowl on rustic wooden kitchen table, steam rising, fresh herbs garnish, warm natural lighting, shallow depth of field, modern farmhouse kitchen, ultra-realistic, high detail, commercial photography style'
  },
  {
    name: 'DALL-E-3-Minimal-Prompt',
    model: 'dall-e-3',
    size: '1024x1024',
    quality: 'hd',
    prompt: 'Chicken bone broth in glass bowl on wooden table, steam, herbs, natural lighting, professional food photography'
  },
  {
    name: 'DALL-E-3-Artistic',
    model: 'dall-e-3',
    size: '1024x1024',
    quality: 'hd',
    prompt: 'Artistic food photography, golden chicken bone broth in elegant glass bowl, steam wisps, fresh herbs, warm kitchen lighting, shallow focus, rustic wooden background, fine art photography style'
  }
];

class ModelTester {
  constructor() {
    this.openai = new OpenAI({ apiKey: CONFIG.apiKey });
    this.results = [];
  }

  async createTestDirectory() {
    console.log('📁 Creating test directory...');
    if (!fs.existsSync(CONFIG.outputDir)) {
      fs.mkdirSync(CONFIG.outputDir, { recursive: true });
      console.log(`✅ Created directory: ${CONFIG.outputDir}`);
    }
  }

  async testModel(config) {
    try {
      console.log(`\n🎨 Testing ${config.name}...`);
      console.log(`   Model: ${config.model}`);
      console.log(`   Size: ${config.size}`);
      console.log(`   Quality: ${config.quality}`);
      console.log(`   Prompt length: ${config.prompt.length} characters`);
      
      const response = await this.openai.images.generate({
        model: config.model,
        prompt: config.prompt,
        size: config.size,
        quality: config.quality,
        n: 1,
      });

      const imageUrl = response.data[0].url;
      const imagePath = path.join(CONFIG.outputDir, `${config.name}.jpg`);
      
      // Download and save image
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      fs.writeFileSync(imagePath, Buffer.from(imageBuffer));
      
      console.log(`✅ Saved: ${imagePath}`);
      
      return {
        success: true,
        config,
        imagePath,
        cost: this.calculateCost(config)
      };
      
    } catch (error) {
      console.error(`❌ Failed to generate image for ${config.name}:`, error.message);
      return {
        success: false,
        config,
        error: error.message
      };
    }
  }

  calculateCost(config) {
    let baseCost = 0.04; // Standard cost
    if (config.quality === 'hd') baseCost = 0.12;
    if (config.size === '1024x1792') baseCost *= 1.5; // Portrait costs more
    return baseCost;
  }

  async testAllModels() {
    console.log('🚀 Starting model comparison test...');
    console.log(`💰 Estimated total cost: $${this.calculateTotalCost()}`);
    console.log(`⏱️  Estimated time: ${this.calculateTime()} minutes\n`);
    
    await this.createTestDirectory();
    
    for (const config of MODEL_CONFIGS) {
      const result = await this.testModel(config);
      this.results.push(result);
      
      // Delay between requests to avoid rate limits
      console.log('⏳ Waiting 3 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    this.printComparison();
  }

  calculateTotalCost() {
    return MODEL_CONFIGS.reduce((total, config) => {
      return total + this.calculateCost(config);
    }, 0).toFixed(2);
  }

  calculateTime() {
    return Math.ceil((MODEL_CONFIGS.length * 45 + (MODEL_CONFIGS.length - 1) * 3) / 60);
  }

  printComparison() {
    console.log('\n📊 MODEL COMPARISON RESULTS');
    console.log('============================');
    
    const successful = this.results.filter(r => r.success);
    const failed = this.results.filter(r => !r.success);
    
    console.log(`✅ Successful: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);
    console.log(`💰 Total cost: $${this.calculateTotalCost()}`);
    
    if (successful.length > 0) {
      console.log('\n✅ Generated test images:');
      successful.forEach(result => {
        console.log(`   - ${result.config.name}: ${result.imagePath}`);
        console.log(`     Cost: $${result.cost.toFixed(2)} | Size: ${result.config.size} | Quality: ${result.config.quality}`);
      });
    }
    
    if (failed.length > 0) {
      console.log('\n❌ Failed tests:');
      failed.forEach(result => {
        console.log(`   - ${result.config.name}: ${result.error}`);
      });
    }
    
    console.log('\n📝 Next steps:');
    console.log('1. Review all test images in ./public/blog/recipes/test-models/');
    console.log('2. Compare quality, realism, and style');
    console.log('3. Choose your preferred model configuration');
    console.log('4. Update the main generation script with your choice');
    console.log('\n🎯 Recommended order to review:');
    console.log('   1. DALL-E-3-HD (most realistic)');
    console.log('   2. DALL-E-3-Enhanced-Prompt (better prompt)');
    console.log('   3. DALL-E-3-Artistic (more artistic style)');
    console.log('   4. DALL-E-3-Portrait (different aspect ratio)');
  }
}

// Main execution
async function main() {
  if (!CONFIG.apiKey) {
    console.error('❌ OPENAI_API_KEY environment variable is required');
    console.log('💡 Get your API key from: https://platform.openai.com/api-keys');
    console.log('💡 Set it with: export OPENAI_API_KEY="your-key-here"');
    process.exit(1);
  }

  const tester = new ModelTester();
  
  try {
    await tester.testAllModels();
  } catch (error) {
    console.error('❌ Testing failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { ModelTester, MODEL_CONFIGS, CONFIG };

