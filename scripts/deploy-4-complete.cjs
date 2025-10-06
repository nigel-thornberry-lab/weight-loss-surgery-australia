const fs = require('fs');

const script = fs.readFileSync('scripts/generate-ultimate-seo-profiles.cjs', 'utf-8');
const updated = script.replace(
  /const targetSurgeons = \[[^\]]+\]/s,
  `const targetSurgeons = [
  'dr-mani-niazi-wantirna',
  'dr-devesh-kaushal-upper-gi-weight-loss-surgeon-gregory-hills',
  'dr-jason-maani-kogarah',
  'dr-jason-maani-bariatric-surgery-liverpool'
]`
);

fs.writeFileSync('scripts/generate-ultimate-seo-profiles.cjs', updated, 'utf-8');
console.log('✅ Updated to 4 complete surgeons');
