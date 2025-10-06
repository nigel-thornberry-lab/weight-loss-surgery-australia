const fs = require('fs');

// Quick fix: update the target list to match CSV slugs exactly
const ultimateScript = fs.readFileSync('scripts/generate-ultimate-seo-profiles.cjs', 'utf-8');

// Replace the target surgeons list with correct slugs from CSV
const updated = ultimateScript.replace(
  /const targetSurgeons = \[[^\]]+\]/,
  `const targetSurgeons = [
  'dr-mani-niazi-wantirna',
  'dr-devesh-kaushal-upper-gi-weight-loss-surgeon-gregory-hills',
  'dr-jason-maani-kogarah',
  'dr-jason-maani-bariatric-surgery-liverpool',
  'dr-ravi-rao-perth', // Note: May need to check if exists
  'dr-ramin-mehdipour-wantirna', // Check if exists
  'dr-alan-hamer-miranda', // Check if exists
  'dr-william-hawkins-randwick' // Check if exists
]`
);

fs.writeFileSync('scripts/generate-ultimate-seo-profiles.cjs', updated, 'utf-8');
console.log('✅ Updated surgeon slug list');
