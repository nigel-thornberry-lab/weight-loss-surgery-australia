#!/usr/bin/env node

/**
 * Automated Recipe Image Generation Script
 * 
 * This script generates all 50 recipe images using DALL-E 3 API
 * and updates the HTML files to use the real images.
 * 
 * Setup:
 * 1. Get OpenAI API key from https://platform.openai.com/api-keys
 * 2. Set OPENAI_API_KEY environment variable
 * 3. Run: node generate-recipe-images.js
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
  quality: 'standard', // or 'hd' for higher quality (+$0.08 per image)
  batchSize: 5, // Process 5 images at a time to avoid rate limits
  delayBetweenBatches: 2000, // 2 seconds delay between batches
};

// Recipe data with prompts organized by stage
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
      prompt: 'Hyper-realistic image of colorful sugar-free jelly cups in rainbow colors, wobbling texture visible, garnished with mint, professional food photography, bright natural lighting'
    },
    {
      id: 'herbal-iced-tea',
      name: 'Herbal Iced Tea',
      prompt: 'Hyper-realistic image of herbal iced tea in a tall glass with ice cubes, condensation on glass, fresh mint garnish, lemon slice, professional beverage photography, refreshing look'
    },
    {
      id: 'beef-bone-broth',
      name: 'Rich Beef Bone Broth',
      prompt: 'Hyper-realistic image of beef bone broth in rustic ceramic bowl, rich dark amber color, steam wisps, garnished with fresh parsley, professional food photography, rustic wooden table'
    },
    {
      id: 'vegetable-stock',
      name: 'Vegetable Stock',
      prompt: 'Hyper-realistic image of vegetable stock in clear glass container, light golden color, carrot and celery visible in background, professional food photography, natural lighting'
    },
    {
      id: 'lemon-ginger-water',
      name: 'Lemon Ginger Infused Water',
      prompt: 'Hyper-realistic image of lemon ginger water in elegant glass pitcher with ice, fresh lemon slices and ginger root visible, condensation on glass, bright refreshing look'
    },
    {
      id: 'apple-cider',
      name: 'Warm Apple Cider (Strained)',
      prompt: 'Hyper-realistic image of apple cider drink in glass mug with cinnamon stick, warm amber color, steam rising, rustic presentation, autumn vibes'
    },
    {
      id: 'cranberry-juice',
      name: 'Diluted Cranberry Juice',
      prompt: 'Hyper-realistic image of cranberry juice in elegant glass, deep red color, ice cubes, fresh cranberries floating, professional beverage photography, refreshing presentation'
    }
  ],
  'stage-2': [
    {
      id: 'chocolate-smoothie',
      name: 'High-Protein Chocolate Smoothie',
      prompt: 'Hyper-realistic image of chocolate protein smoothie in a tall glass, creamy texture visible, cocoa powder dusted on top, chocolate shavings garnish, professional beverage photography'
    },
    {
      id: 'tomato-soup',
      name: 'Creamy Tomato Soup',
      prompt: 'Hyper-realistic image of creamy tomato soup in white bowl, smooth velvety texture, garnished with basil leaf and cream swirl, professional food photography, warm lighting'
    },
    {
      id: 'greek-yogurt-bowl',
      name: 'Greek Yogurt Protein Bowl',
      prompt: 'Hyper-realistic image of Greek yogurt protein bowl with berries on top, creamy white yogurt texture, fresh blueberries and strawberries, granola sprinkle, professional food photography, bright natural lighting'
    },
    {
      id: 'vanilla-protein-shake',
      name: 'Vanilla Protein Shake',
      prompt: 'Hyper-realistic image of vanilla protein shake in tall glass with straw, creamy beige color, vanilla bean garnish, condensation on glass, professional beverage photography'
    },
    {
      id: 'butternut-squash-soup',
      name: 'Butternut Squash Soup',
      prompt: 'Hyper-realistic image of butternut squash soup in white bowl, smooth orange creamy texture, garnished with cream swirl and pepitas, professional food photography, warm autumn lighting'
    },
    {
      id: 'strawberry-banana-smoothie',
      name: 'Strawberry Banana Protein Smoothie',
      prompt: 'Hyper-realistic image of strawberry banana smoothie in tall glass, pink creamy texture, fresh strawberry garnish, professional beverage photography'
    },
    {
      id: 'pumpkin-soup',
      name: 'Creamy Pumpkin Soup',
      prompt: 'Hyper-realistic image of pumpkin soup in white bowl, smooth orange texture, cream swirl on top, pumpkin seeds garnish, professional food photography'
    },
    {
      id: 'green-smoothie',
      name: 'Green Protein Smoothie',
      prompt: 'Hyper-realistic image of green smoothie in glass, vibrant green color, spinach leaves visible, professional beverage photography, healthy fresh look'
    },
    {
      id: 'chicken-noodle-soup',
      name: 'Strained Chicken Noodle Soup Broth',
      prompt: 'Hyper-realistic image of chicken noodle soup (strained) in bowl, clear golden broth, steam rising, professional food photography, comfort food vibes'
    },
    {
      id: 'protein-hot-chocolate',
      name: 'Protein Hot Chocolate',
      prompt: 'Hyper-realistic image of protein hot chocolate in mug, rich chocolate brown color, marshmallow on top, steam rising, cozy presentation'
    },
    {
      id: 'mango-lassi',
      name: 'Mango Lassi',
      prompt: 'Hyper-realistic image of mango lassi in tall glass, golden yellow color, mango slice garnish, professional beverage photography, tropical vibes'
    },
    {
      id: 'mushroom-soup',
      name: 'Mushroom Soup',
      prompt: 'Hyper-realistic image of mushroom soup in white bowl, creamy beige color, sliced mushroom garnish, fresh parsley, professional food photography'
    },
    {
      id: 'chia-pudding',
      name: 'Vanilla Chia Protein Pudding',
      prompt: 'Hyper-realistic image of chia pudding in glass jar, vanilla color with chia seeds visible, fresh berries on top, professional food photography, breakfast vibes'
    }
  ],
  'stage-3': [
    {
      id: 'pureed-chicken',
      name: 'Pureed Chicken with Gravy',
      prompt: 'Hyper-realistic image of pureed chicken with gravy in white bowl, smooth tan-colored texture, garnished with fresh thyme, professional food photography, warm lighting'
    },
    {
      id: 'sweet-potato-mash',
      name: 'Mashed Sweet Potato with Protein',
      prompt: 'Hyper-realistic image of mashed sweet potato with protein in white bowl, smooth orange texture, garnished with cinnamon stick, professional food photography'
    },
    {
      id: 'scrambled-eggs',
      name: 'Smooth Scrambled Eggs',
      prompt: 'Hyper-realistic image of smooth scrambled eggs on white plate, fluffy light yellow texture, garnished with chives, professional food photography, bright morning lighting'
    },
    {
      id: 'pureed-salmon',
      name: 'Pureed Salmon with Dill',
      prompt: 'Hyper-realistic image of pureed salmon in white bowl, pink-orange smooth texture, fresh dill garnish, lemon wedge, professional food photography, elegant presentation'
    },
    {
      id: 'tuna-salad-puree',
      name: 'Creamy Tuna Salad Puree',
      prompt: 'Hyper-realistic image of tuna salad puree in white bowl, smooth beige texture, garnished with parsley, professional food photography, clean presentation'
    },
    {
      id: 'pureed-white-fish',
      name: 'Pureed White Fish with Herbs',
      prompt: 'Hyper-realistic image of pureed white fish in white bowl, smooth white texture, fresh herb garnish, lemon slice, professional food photography, minimalist style'
    },
    {
      id: 'cottage-cheese-puree',
      name: 'Creamy Cottage Cheese Puree',
      prompt: 'Hyper-realistic image of cottage cheese puree in white bowl, smooth white texture, fresh chives garnish, professional food photography, clean presentation'
    },
    {
      id: 'pureed-lentils',
      name: 'Pureed Lentils with Vegetables',
      prompt: 'Hyper-realistic image of pureed lentils in white bowl, smooth brown texture, fresh parsley garnish, professional food photography, rustic presentation'
    },
    {
      id: 'ricotta-spinach',
      name: 'Creamy Ricotta with Spinach',
      prompt: 'Hyper-realistic image of ricotta spinach puree in white bowl, smooth green texture, fresh basil garnish, professional food photography, Italian style'
    },
    {
      id: 'pureed-turkey',
      name: 'Pureed Turkey with Gravy',
      prompt: 'Hyper-realistic image of pureed turkey with gravy in white bowl, smooth tan texture, fresh thyme garnish, professional food photography, comfort food style'
    },
    {
      id: 'hummus-puree',
      name: 'Creamy Hummus Puree',
      prompt: 'Hyper-realistic image of hummus puree in white bowl, smooth beige texture, olive oil drizzle, paprika garnish, professional food photography, Middle Eastern style'
    },
    {
      id: 'pureed-beans',
      name: 'Pureed Beans with Herbs',
      prompt: 'Hyper-realistic image of pureed beans in white bowl, smooth brown texture, fresh herb garnish, professional food photography, rustic presentation'
    },
    {
      id: 'avocado-puree',
      name: 'Creamy Avocado Puree',
      prompt: 'Hyper-realistic image of avocado puree in white bowl, smooth green texture, lime wedge garnish, professional food photography, fresh presentation'
    },
    {
      id: 'butternut-squash-puree',
      name: 'Pureed Butternut Squash',
      prompt: 'Hyper-realistic image of pureed butternut squash in white bowl, smooth orange texture, cinnamon sprinkle, professional food photography, autumn vibes'
    }
  ],
  'stage-4': [
    {
      id: 'scrambled-eggs-cheese',
      name: 'Scrambled Eggs with Cheese',
      prompt: 'Hyper-realistic image of scrambled eggs with cheese on white plate, fluffy yellow texture with melted cheese, fresh chives garnish, professional food photography, breakfast style'
    },
    {
      id: 'chicken-stir-fry',
      name: 'Tender Chicken Stir-Fry',
      prompt: 'Hyper-realistic image of chicken stir-fry in white bowl, tender chicken pieces with vegetables, steam rising, professional food photography, Asian cuisine style'
    },
    {
      id: 'baked-fish-cauliflower',
      name: 'Baked Fish with Mashed Cauliflower',
      prompt: 'Hyper-realistic image of baked fish with mashed cauliflower on white plate, golden fish fillet with creamy white mash, lemon wedge garnish, professional food photography, elegant presentation'
    },
    {
      id: 'turkey-meatballs',
      name: 'Turkey Meatballs in Tomato Sauce',
      prompt: 'Hyper-realistic image of turkey meatballs in tomato sauce in white bowl, golden meatballs in rich red sauce, fresh basil garnish, professional food photography, Italian style'
    },
    {
      id: 'cottage-cheese-bake',
      name: 'Cottage Cheese Bake',
      prompt: 'Hyper-realistic image of cottage cheese bake in white ramekin, golden brown top, fresh herbs garnish, professional food photography, comfort food style'
    },
    {
      id: 'beef-stew',
      name: 'Slow Cooker Beef Stew',
      prompt: 'Hyper-realistic image of beef stew in white bowl, tender beef pieces with vegetables in rich brown gravy, steam rising, professional food photography, rustic presentation'
    },
    {
      id: 'tuna-pasta-bake',
      name: 'Tuna Pasta Bake',
      prompt: 'Hyper-realistic image of tuna pasta bake in white dish, golden cheesy top with pasta visible, fresh parsley garnish, professional food photography, comfort food style'
    },
    {
      id: 'greek-yogurt-parfait',
      name: 'Greek Yogurt Parfait',
      prompt: 'Hyper-realistic image of Greek yogurt parfait in tall glass, layered yogurt with berries and granola, fresh mint garnish, professional food photography, breakfast style'
    },
    {
      id: 'salmon-patties',
      name: 'Salmon Patties',
      prompt: 'Hyper-realistic image of salmon patties on white plate, golden brown patties with fresh herbs, lemon wedge garnish, professional food photography, elegant presentation'
    },
    {
      id: 'tofu-curry',
      name: 'Tofu and Vegetable Curry',
      prompt: 'Hyper-realistic image of tofu curry in white bowl, creamy curry sauce with tofu and vegetables, fresh cilantro garnish, professional food photography, Asian cuisine style'
    },
    {
      id: 'beef-bolognese',
      name: 'Minced Beef Bolognese',
      prompt: 'Hyper-realistic image of minced beef bolognese in white bowl, rich meat sauce with visible herbs, fresh basil garnish, professional food photography, Italian style'
    },
    {
      id: 'chicken-corn-soup',
      name: 'Chicken and Sweet Corn Soup',
      prompt: 'Hyper-realistic image of chicken corn soup in white bowl, creamy yellow soup with visible corn kernels, fresh chives garnish, professional food photography, comfort food style'
    },
    {
      id: 'mini-quiches',
      name: 'Crustless Mini Quiches',
      prompt: 'Hyper-realistic image of mini quiches on white plate, golden brown quiches with visible fillings, fresh herbs garnish, professional food photography, elegant presentation'
    },
    {
      id: 'prawn-avocado-salad',
      name: 'Prawn and Avocado Salad',
      prompt: 'Hyper-realistic image of prawn avocado salad in white bowl, pink prawns with green avocado, fresh herbs garnish, professional food photography, fresh presentation'
    },
    {
      id: 'pulled-chicken',
      name: 'Slow Cooker Pulled Chicken',
      prompt: 'Hyper-realistic image of pulled chicken in white bowl, shredded chicken in rich sauce, fresh herbs garnish, professional food photography, comfort food style'
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
    console.log('🚀 Starting recipe image generation...');
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
    const timePerBatch = 30; // seconds
    const delayTime = (batches - 1) * (CONFIG.delayBetweenBatches / 1000);
    return Math.ceil((batches * timePerBatch + delayTime) / 60);
  }

  printSummary() {
    console.log('\n📊 GENERATION SUMMARY');
    console.log('====================');
    console.log(`✅ Successful: ${this.generatedImages.length}`);
    console.log(`❌ Failed: ${this.failedImages.length}`);
    console.log(`💰 Total cost: ~$${this.calculateCost()}`);
    
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
    console.log('\n🎉 Image generation complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Review generated images in /public/blog/recipes/');
    console.log('2. Run HTML update script to replace placeholders');
    console.log('3. Test the website to ensure images load correctly');
    
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
