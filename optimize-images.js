#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function optimizeImages() {
  const publicDir = path.join(__dirname, 'public', 'images');
  
  console.log('🖼️  Optimizing images for better Core Web Vitals...\n');

  // 1. Optimize homepage4.webp (currently 897KB, displayed at 520x780)
  console.log('📸 Optimizing homepage4.webp...');
  try {
    await sharp(path.join(publicDir, 'homepage4.webp'))
      .resize(1040, 1560, { // 2x for retina displays
        fit: 'cover',
        position: 'center'
      })
      .webp({ 
        quality: 85,
        effort: 6
      })
      .toFile(path.join(publicDir, 'homepage4-optimized.webp'));
    
    const originalSize = fs.statSync(path.join(publicDir, 'homepage4.webp')).size;
    const optimizedSize = fs.statSync(path.join(publicDir, 'homepage4-optimized.webp')).size;
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`   ✅ Reduced from ${(originalSize / 1024).toFixed(1)}KB to ${(optimizedSize / 1024).toFixed(1)}KB (${savings}% savings)`);
  } catch (error) {
    console.log('   ❌ Error optimizing homepage4.webp:', error.message);
  }

  // 2. Convert logo.png to WebP and optimize (currently 183KB, displayed at 96x96)
  console.log('🏷️  Optimizing logo.png...');
  try {
    await sharp(path.join(publicDir, 'logo.png'))
      .resize(192, 192, { // 2x for retina displays
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .webp({ 
        quality: 90,
        effort: 6
      })
      .toFile(path.join(publicDir, 'logo-optimized.webp'));
    
    const originalSize = fs.statSync(path.join(publicDir, 'logo.png')).size;
    const optimizedSize = fs.statSync(path.join(publicDir, 'logo-optimized.webp')).size;
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`   ✅ Reduced from ${(originalSize / 1024).toFixed(1)}KB to ${(optimizedSize / 1024).toFixed(1)}KB (${savings}% savings)`);
  } catch (error) {
    console.log('   ❌ Error optimizing logo.png:', error.message);
  }

  // 3. Create responsive versions for homepage4
  console.log('📱 Creating responsive versions...');
  try {
    // Mobile version (520x780)
    await sharp(path.join(publicDir, 'homepage4.webp'))
      .resize(520, 780, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 85 })
      .toFile(path.join(publicDir, 'homepage4-mobile.webp'));

    // Desktop version (1040x1560)
    await sharp(path.join(publicDir, 'homepage4.webp'))
      .resize(1040, 1560, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 85 })
      .toFile(path.join(publicDir, 'homepage4-desktop.webp'));

    console.log('   ✅ Created responsive versions');
  } catch (error) {
    console.log('   ❌ Error creating responsive versions:', error.message);
  }

  console.log('\n🎉 Image optimization complete!');
  console.log('\nNext steps:');
  console.log('1. Update HTML to use optimized images');
  console.log('2. Implement responsive srcset attributes');
  console.log('3. Test Core Web Vitals improvements');
}

optimizeImages().catch(console.error);
