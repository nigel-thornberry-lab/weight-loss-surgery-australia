#!/usr/bin/env node

/**
 * Enhanced Recipe Image Generation Script
 * 
 * This script generates all 50 recipe images using DALL-E 3 API
 * with hyper-realistic prompts including kitchen/dining settings.
 * 
 * Setup:
 * 1. Get OpenAI API key from https://platform.openai.com/api-keys
 * 2. Set OPENAI_API_KEY environment variable
 * 3. Run: node generate-recipe-images-enhanced.js
 * 
 * Cost: ~$2-5 for all 50 images
 * Time: ~30 minutes
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
  outputDir: './public/blog/recipes',
  imageSize: '1024x1024', // or '1024x1792' for portrait
  quality: 'hd', // Use HD quality for better realism
  batchSize: 3, // Smaller batches for HD quality
  delayBetweenBatches: 3000, // 3 seconds delay between batches
};

// Enhanced recipe data with hyper-realistic prompts
const RECIPES = {
  'stage-1': [
    {
      id: 'chicken-bone-broth',
      name: 'Homemade Chicken Bone Broth',
      prompt: 'Ultra-photorealistic food photography: golden chicken bone broth in a clear glass bowl on a rustic wooden kitchen table, steam rising naturally, garnished with fresh thyme and parsley, warm natural lighting from kitchen window, shallow depth of field, shot with professional camera, modern farmhouse kitchen setting, 8K resolution, hyper-detailed textures'
    },
    {
      id: 'sugar-free-jelly',
      name: 'Sugar-Free Jelly Cups',
      prompt: 'Hyper-realistic food photography: colorful sugar-free jelly cups in rainbow colors on a marble kitchen counter, wobbling texture visible, garnished with fresh mint leaves, bright natural lighting from overhead pendant lights, modern minimalist kitchen setting, professional food styling, shallow depth of field, shot with macro lens, ultra-detailed textures'
    },
    {
      id: 'herbal-iced-tea',
      name: 'Herbal Iced Tea',
      prompt: 'Ultra-photorealistic beverage photography: herbal iced tea in a tall glass with ice cubes on a wooden dining table, condensation on glass, fresh mint garnish and lemon slice, bright natural lighting from window, modern dining room setting, shallow depth of field, professional food photography, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'beef-bone-broth',
      name: 'Rich Beef Bone Broth',
      prompt: 'Hyper-realistic food photography: dark amber beef bone broth in rustic ceramic bowl on wooden kitchen island, steam wisps rising, garnished with fresh parsley, warm natural lighting, modern farmhouse kitchen setting, professional food styling, shallow depth of field, ultra-detailed textures, shot with professional camera'
    },
    {
      id: 'vegetable-stock',
      name: 'Vegetable Stock',
      prompt: 'Ultra-photorealistic food photography: light golden vegetable stock in clear glass container on marble kitchen counter, carrot and celery visible in background, natural lighting from kitchen window, modern minimalist kitchen setting, professional food styling, shallow depth of field, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'lemon-ginger-water',
      name: 'Lemon Ginger Infused Water',
      prompt: 'Hyper-realistic beverage photography: lemon ginger water in elegant glass pitcher with ice on wooden dining table, fresh lemon slices and ginger root visible, condensation on glass, bright natural lighting, modern dining room setting, shallow depth of field, professional food photography, ultra-detailed textures'
    },
    {
      id: 'apple-cider',
      name: 'Warm Apple Cider (Strained)',
      prompt: 'Ultra-photorealistic food photography: warm apple cider in glass mug with cinnamon stick on rustic wooden table, warm amber color, steam rising, cozy autumn kitchen setting, natural lighting from window, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'cranberry-juice',
      name: 'Diluted Cranberry Juice',
      prompt: 'Hyper-realistic beverage photography: deep red cranberry juice in elegant glass on marble counter, ice cubes and fresh cranberries floating, bright natural lighting from overhead lights, modern kitchen setting, professional food styling, shallow depth of field, ultra-detailed textures, shot with professional camera'
    }
  ],
  'stage-2': [
    {
      id: 'chocolate-smoothie',
      name: 'High-Protein Chocolate Smoothie',
      prompt: 'Ultra-photorealistic beverage photography: rich chocolate protein smoothie in tall glass on wooden kitchen counter, creamy texture visible, cocoa powder dusted on top, chocolate shavings garnish, warm natural lighting from kitchen window, modern kitchen setting, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'tomato-soup',
      name: 'Creamy Tomato Soup',
      prompt: 'Hyper-realistic food photography: creamy tomato soup in white bowl on marble kitchen island, smooth velvety texture, garnished with basil leaf and cream swirl, warm natural lighting, modern kitchen setting, shallow depth of field, professional food styling, ultra-detailed textures, shot with professional camera'
    },
    {
      id: 'greek-yogurt-bowl',
      name: 'Greek Yogurt Protein Bowl',
      prompt: 'Ultra-photorealistic food photography: Greek yogurt protein bowl on wooden dining table, creamy white yogurt texture, fresh blueberries and strawberries, granola sprinkle, bright natural lighting from window, modern dining room setting, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'vanilla-protein-shake',
      name: 'Vanilla Protein Shake',
      prompt: 'Hyper-realistic beverage photography: vanilla protein shake in tall glass with straw on marble kitchen counter, creamy beige color, vanilla bean garnish, condensation on glass, bright natural lighting, modern kitchen setting, shallow depth of field, professional food styling, ultra-detailed textures, shot with professional camera'
    },
    {
      id: 'butternut-squash-soup',
      name: 'Butternut Squash Soup',
      prompt: 'Ultra-photorealistic food photography: butternut squash soup in white bowl on rustic wooden table, smooth orange creamy texture, garnished with cream swirl and pepitas, warm autumn lighting from window, cozy kitchen setting, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'strawberry-banana-smoothie',
      name: 'Strawberry Banana Protein Smoothie',
      prompt: 'Hyper-realistic beverage photography: strawberry banana smoothie in tall glass on marble kitchen island, pink creamy texture, fresh strawberry garnish, bright natural lighting from overhead lights, modern kitchen setting, shallow depth of field, professional food styling, ultra-detailed textures, shot with professional camera'
    },
    {
      id: 'pumpkin-soup',
      name: 'Creamy Pumpkin Soup',
      prompt: 'Ultra-photorealistic food photography: pumpkin soup in white bowl on wooden kitchen table, smooth orange texture, cream swirl on top, pumpkin seeds garnish, warm natural lighting from window, modern farmhouse kitchen setting, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'green-smoothie',
      name: 'Green Protein Smoothie',
      prompt: 'Hyper-realistic beverage photography: green smoothie in glass on marble counter, vibrant green color, spinach leaves visible, bright natural lighting from kitchen window, modern minimalist kitchen setting, shallow depth of field, professional food styling, ultra-detailed textures, shot with professional camera'
    },
    {
      id: 'chicken-noodle-soup',
      name: 'Strained Chicken Noodle Soup Broth',
      prompt: 'Ultra-photorealistic food photography: chicken noodle soup broth in white bowl on wooden dining table, clear golden broth, steam rising, warm natural lighting from window, cozy dining room setting, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'protein-hot-chocolate',
      name: 'Protein Hot Chocolate',
      prompt: 'Hyper-realistic beverage photography: protein hot chocolate in ceramic mug on wooden kitchen counter, rich chocolate brown color, marshmallow on top, steam rising, warm natural lighting, cozy kitchen setting, shallow depth of field, professional food styling, ultra-detailed textures, shot with professional camera'
    },
    {
      id: 'mango-lassi',
      name: 'Mango Lassi',
      prompt: 'Ultra-photorealistic beverage photography: mango lassi in tall glass on marble kitchen island, golden yellow color, mango slice garnish, bright natural lighting from overhead lights, modern kitchen setting, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'mushroom-soup',
      name: 'Mushroom Soup',
      prompt: 'Hyper-realistic food photography: mushroom soup in white bowl on wooden kitchen table, creamy beige color, sliced mushroom garnish, fresh parsley, warm natural lighting from window, modern kitchen setting, shallow depth of field, professional food styling, ultra-detailed textures, shot with professional camera'
    },
    {
      id: 'chia-pudding',
      name: 'Vanilla Chia Protein Pudding',
      prompt: 'Ultra-photorealistic food photography: chia pudding in glass jar on marble kitchen counter, vanilla color with chia seeds visible, fresh berries on top, bright natural lighting from window, modern minimalist kitchen setting, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    }
  ],
  'stage-3': [
    {
      id: 'pureed-chicken',
      name: 'Pureed Chicken with Gravy',
      prompt: 'Ultra-photorealistic food photography: pureed chicken with gravy in white bowl on wooden dining table, smooth tan-colored texture, garnished with fresh thyme, warm natural lighting from window, modern dining room setting, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'sweet-potato-mash',
      name: 'Mashed Sweet Potato with Protein',
      prompt: 'Hyper-realistic food photography: mashed sweet potato in white bowl on marble kitchen counter, smooth orange texture, garnished with cinnamon stick, warm natural lighting from kitchen window, modern kitchen setting, shallow depth of field, professional food styling, ultra-detailed textures, shot with professional camera'
    },
    {
      id: 'scrambled-eggs',
      name: 'Smooth Scrambled Eggs',
      prompt: 'Ultra-photorealistic food photography: smooth scrambled eggs on white plate on wooden kitchen table, fluffy light yellow texture, garnished with chives, bright natural lighting from window, modern kitchen setting, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'pureed-salmon',
      name: 'Pureed Salmon with Dill',
      prompt: 'Hyper-realistic food photography: pureed salmon in white bowl on marble kitchen island, pink-orange smooth texture, fresh dill garnish, lemon wedge, bright natural lighting from overhead lights, modern kitchen setting, shallow depth of field, professional food styling, ultra-detailed textures, shot with professional camera'
    },
    {
      id: 'tuna-salad-puree',
      name: 'Creamy Tuna Salad Puree',
      prompt: 'Ultra-photorealistic food photography: tuna salad puree in white bowl on wooden dining table, smooth beige texture, garnished with parsley, warm natural lighting from window, modern dining room setting, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'pureed-white-fish',
      name: 'Pureed White Fish with Herbs',
      prompt: 'Hyper-realistic food photography: pureed white fish in white bowl on marble kitchen counter, smooth white texture, fresh herb garnish, lemon slice, bright natural lighting from kitchen window, modern kitchen setting, shallow depth of field, professional food styling, ultra-detailed textures, shot with professional camera'
    },
    {
      id: 'cottage-cheese-puree',
      name: 'Creamy Cottage Cheese Puree',
      prompt: 'Ultra-photorealistic food photography: cottage cheese puree in white bowl on wooden kitchen table, smooth white texture, fresh chives garnish, warm natural lighting from window, modern kitchen setting, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'pureed-lentils',
      name: 'Pureed Lentils with Vegetables',
      prompt: 'Hyper-realistic food photography: pureed lentils in white bowl on marble kitchen island, smooth brown texture, fresh parsley garnish, bright natural lighting from overhead lights, modern kitchen setting, shallow depth of field, professional food styling, ultra-detailed textures, shot with professional camera'
    },
    {
      id: 'ricotta-spinach',
      name: 'Creamy Ricotta with Spinach',
      prompt: 'Ultra-photorealistic food photography: ricotta spinach puree in white bowl on wooden dining table, smooth green texture, fresh basil garnish, warm natural lighting from window, modern dining room setting, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'pureed-turkey',
      name: 'Pureed Turkey with Gravy',
      prompt: 'Hyper-realistic food photography: pureed turkey with gravy in white bowl on marble kitchen counter, smooth tan texture, fresh thyme garnish, bright natural lighting from kitchen window, modern kitchen setting, shallow depth of field, professional food styling, ultra-detailed textures, shot with professional camera'
    },
    {
      id: 'hummus-puree',
      name: 'Creamy Hummus Puree',
      prompt: 'Ultra-photorealistic food photography: hummus puree in white bowl on wooden kitchen table, smooth beige texture, olive oil drizzle, paprika garnish, warm natural lighting from window, modern kitchen setting, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'pureed-beans',
      name: 'Pureed Beans with Herbs',
      prompt: 'Hyper-realistic food photography: pureed beans in white bowl on marble kitchen island, smooth brown texture, fresh herb garnish, bright natural lighting from overhead lights, modern kitchen setting, shallow depth of field, professional food styling, ultra-detailed textures, shot with professional camera'
    },
    {
      id: 'avocado-puree',
      name: 'Creamy Avocado Puree',
      prompt: 'Ultra-photorealistic food photography: avocado puree in white bowl on wooden dining table, smooth green texture, lime wedge garnish, bright natural lighting from window, modern dining room setting, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'butternut-squash-puree',
      name: 'Pureed Butternut Squash',
      prompt: 'Hyper-realistic food photography: pureed butternut squash in white bowl on marble kitchen counter, smooth orange texture, cinnamon sprinkle, warm natural lighting from kitchen window, modern kitchen setting, shallow depth of field, professional food styling, ultra-detailed textures, shot with professional camera'
    }
  ],
  'stage-4': [
    {
      id: 'scrambled-eggs-cheese',
      name: 'Scrambled Eggs with Cheese',
      prompt: 'Ultra-photorealistic food photography: scrambled eggs with cheese on white plate on wooden kitchen table, fluffy yellow texture with melted cheese, fresh chives garnish, bright natural lighting from window, modern kitchen setting, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'chicken-stir-fry',
      name: 'Tender Chicken Stir-Fry',
      prompt: 'Hyper-realistic food photography: chicken stir-fry in white bowl on marble kitchen island, tender chicken pieces with vegetables, steam rising, bright natural lighting from overhead lights, modern kitchen setting, shallow depth of field, professional food styling, ultra-detailed textures, shot with professional camera'
    },
    {
      id: 'baked-fish-cauliflower',
      name: 'Baked Fish with Mashed Cauliflower',
      prompt: 'Ultra-photorealistic food photography: baked fish with mashed cauliflower on white plate on wooden dining table, golden fish fillet with creamy white mash, lemon wedge garnish, warm natural lighting from window, modern dining room setting, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'turkey-meatballs',
      name: 'Turkey Meatballs in Tomato Sauce',
      prompt: 'Hyper-realistic food photography: turkey meatballs in tomato sauce in white bowl on marble kitchen counter, golden meatballs in rich red sauce, fresh basil garnish, bright natural lighting from kitchen window, modern kitchen setting, shallow depth of field, professional food styling, ultra-detailed textures, shot with professional camera'
    },
    {
      id: 'cottage-cheese-bake',
      name: 'Cottage Cheese Bake',
      prompt: 'Ultra-photorealistic food photography: cottage cheese bake in white ramekin on wooden kitchen table, golden brown top, fresh herbs garnish, warm natural lighting from window, modern kitchen setting, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'beef-stew',
      name: 'Slow Cooker Beef Stew',
      prompt: 'Hyper-realistic food photography: beef stew in white bowl on marble kitchen island, tender beef pieces with vegetables in rich brown gravy, steam rising, bright natural lighting from overhead lights, modern kitchen setting, shallow depth of field, professional food styling, ultra-detailed textures, shot with professional camera'
    },
    {
      id: 'tuna-pasta-bake',
      name: 'Tuna Pasta Bake',
      prompt: 'Ultra-photorealistic food photography: tuna pasta bake in white dish on wooden dining table, golden cheesy top with pasta visible, fresh parsley garnish, warm natural lighting from window, modern dining room setting, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'greek-yogurt-parfait',
      name: 'Greek Yogurt Parfait',
      prompt: 'Hyper-realistic food photography: Greek yogurt parfait in tall glass on marble kitchen counter, layered yogurt with berries and granola, fresh mint garnish, bright natural lighting from kitchen window, modern kitchen setting, shallow depth of field, professional food styling, ultra-detailed textures, shot with professional camera'
    },
    {
      id: 'salmon-patties',
      name: 'Salmon Patties',
      prompt: 'Ultra-photorealistic food photography: salmon patties on white plate on wooden dining table, golden brown patties with fresh herbs, lemon wedge garnish, warm natural lighting from window, modern dining room setting, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'tofu-curry',
      name: 'Tofu and Vegetable Curry',
      prompt: 'Hyper-realistic food photography: tofu curry in white bowl on marble kitchen island, creamy curry sauce with tofu and vegetables, fresh cilantro garnish, bright natural lighting from overhead lights, modern kitchen setting, shallow depth of field, professional food styling, ultra-detailed textures, shot with professional camera'
    },
    {
      id: 'beef-bolognese',
      name: 'Minced Beef Bolognese',
      prompt: 'Ultra-photorealistic food photography: minced beef bolognese in white bowl on wooden kitchen table, rich meat sauce with visible herbs, fresh basil garnish, warm natural lighting from window, modern kitchen setting, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'chicken-corn-soup',
      name: 'Chicken and Sweet Corn Soup',
      prompt: 'Hyper-realistic food photography: chicken corn soup in white bowl on marble kitchen counter, creamy yellow soup with visible corn kernels, fresh chives garnish, bright natural lighting from kitchen window, modern kitchen setting, shallow depth of field, professional food styling, ultra-detailed textures, shot with professional camera'
    },
    {
      id: 'mini-quiches',
      name: 'Crustless Mini Quiches',
      prompt: 'Ultra-photorealistic food photography: mini quiches on white plate on wooden dining table, golden brown quiches with visible fillings, fresh herbs garnish, warm natural lighting from window, modern dining room setting, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    },
    {
      id: 'prawn-avocado-salad',
      name: 'Prawn and Avocado Salad',
      prompt: 'Hyper-realistic food photography: prawn avocado salad in white bowl on marble kitchen island, pink prawns with green avocado, fresh herbs garnish, bright natural lighting from overhead lights, modern kitchen setting, shallow depth of field, professional food styling, ultra-detailed textures, shot with professional camera'
    },
    {
      id: 'pulled-chicken',
      name: 'Slow Cooker Pulled Chicken',
      prompt: 'Ultra-photorealistic food photography: pulled chicken in white bowl on wooden kitchen table, shredded chicken in rich sauce, fresh herbs garnish, warm natural lighting from window, modern kitchen setting, shallow depth of field, professional food styling, hyper-detailed textures, 8K resolution'
    }
  ]
};

class RecipeImageGenerator {
  constructor() {
    this.openai = new OpenAI({ apiKey: CONFIG.apiKey });
    this.generatedImages = [];
    this.failedImages = [];
  }

  async createDirectories() {
    console.log('📁 Creating directory structure...');
    
    const stages = ['stage-1', 'stage-2', 'stage-3', 'stage-4'];
    for (const stage of stages) {
      const dir = path.join(CONFIG.outputDir, stage);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
      }
    }
  }

  async generateImage(recipe, stage) {
    try {
      console.log(`🎨 Generating image for: ${recipe.name}`);
      
      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: recipe.prompt,
        size: CONFIG.imageSize,
        quality: CONFIG.quality,
        n: 1,
      });

      const imageUrl = response.data[0].url;
      const imagePath = path.join(CONFIG.outputDir, stage, `${recipe.id}.jpg`);
      
      // Download and save image
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      fs.writeFileSync(imagePath, Buffer.from(imageBuffer));
      
      console.log(`✅ Saved: ${imagePath}`);
      
      return {
        success: true,
        recipe,
        imagePath: `/blog/recipes/${stage}/${recipe.id}.jpg`,
        localPath: imagePath
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

  async processBatch(recipes, stage) {
    console.log(`\n🔄 Processing ${recipes.length} recipes for ${stage}...`);
    
    for (let i = 0; i < recipes.length; i += CONFIG.batchSize) {
      const batch = recipes.slice(i, i + CONFIG.batchSize);
      console.log(`\n📦 Processing batch ${Math.floor(i / CONFIG.batchSize) + 1}/${Math.ceil(recipes.length / CONFIG.batchSize)}`);
      
      const promises = batch.map(recipe => this.generateImage(recipe, stage));
      const results = await Promise.all(promises);
      
      results.forEach(result => {
        if (result.success) {
          this.generatedImages.push(result);
        } else {
          this.failedImages.push(result);
        }
      });
      
      // Delay between batches to avoid rate limits
      if (i + CONFIG.batchSize < recipes.length) {
        console.log(`⏳ Waiting ${CONFIG.delayBetweenBatches / 1000} seconds before next batch...`);
        await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenBatches));
      }
    }
  }

  async generateAllImages() {
    console.log('🚀 Starting enhanced recipe image generation...');
    console.log(`💰 Estimated cost: $${this.calculateCost()}`);
    console.log(`⏱️  Estimated time: ${this.calculateTime()} minutes\n`);
    
    await this.createDirectories();
    
    for (const [stage, recipes] of Object.entries(RECIPES)) {
      await this.processBatch(recipes, stage);
    }
    
    this.printSummary();
  }

  calculateCost() {
    const totalImages = Object.values(RECIPES).flat().length;
    const costPerImage = CONFIG.quality === 'hd' ? 0.12 : 0.04;
    return (totalImages * costPerImage).toFixed(2);
  }

  calculateTime() {
    const totalImages = Object.values(RECIPES).flat().length;
    const batches = Math.ceil(totalImages / CONFIG.batchSize);
    const timePerBatch = 45; // seconds for HD quality
    const delayTime = (batches - 1) * (CONFIG.delayBetweenBatches / 1000);
    return Math.ceil((batches * timePerBatch + delayTime) / 60);
  }

  printSummary() {
    console.log('\n📊 ENHANCED GENERATION SUMMARY');
    console.log('================================');
    console.log(`✅ Successful: ${this.generatedImages.length}`);
    console.log(`❌ Failed: ${this.failedImages.length}`);
    console.log(`💰 Total cost: ~$${this.calculateCost()}`);
    console.log(`🎨 Quality: HD (${CONFIG.quality})`);
    console.log(`🏠 Settings: Kitchen/Dining environments`);
    
    if (this.failedImages.length > 0) {
      console.log('\n❌ Failed images:');
      this.failedImages.forEach(failed => {
        console.log(`   - ${failed.recipe.name}: ${failed.error}`);
      });
    }
    
    if (this.generatedImages.length > 0) {
      console.log('\n✅ Generated images:');
      this.generatedImages.forEach(img => {
        console.log(`   - ${img.recipe.name}: ${img.imagePath}`);
      });
    }
  }

  generateImageMapping() {
    const mapping = {};
    this.generatedImages.forEach(img => {
      mapping[img.recipe.id] = img.imagePath;
    });
    return mapping;
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

  const generator = new RecipeImageGenerator();
  
  try {
    await generator.generateAllImages();
    
    // Save image mapping for HTML updates
    const mapping = generator.generateImageMapping();
    fs.writeFileSync(
      './recipe-image-mapping.json', 
      JSON.stringify(mapping, null, 2)
    );
    console.log('\n💾 Saved image mapping to: recipe-image-mapping.json');
    console.log('\n🎉 Enhanced image generation complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Review generated images in /public/blog/recipes/');
    console.log('2. Run HTML update script to replace placeholders');
    console.log('3. Test the website to ensure images load correctly');
    console.log('\n🏠 All images now include kitchen/dining settings for realism!');
    
  } catch (error) {
    console.error('❌ Generation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { RecipeImageGenerator, RECIPES, CONFIG };

