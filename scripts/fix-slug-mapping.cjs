const fs = require('fs');

const data = JSON.parse(fs.readFileSync('surgeon-enhanced-data.json', 'utf-8'));

// Create new object with corrected keys
const fixed = {};

// Copy existing with correct slugs
Object.entries(data).forEach(([oldKey, value]) => {
  let newKey = oldKey;
  
  // Fix the mismatched slugs
  if (oldKey === 'mr-niruben-rajasagaram-wantirna') {
    newKey = 'mr-niruben-rajasagaram-bariatric-surgeon-for-gastric-sleeve-weight-loss-surgery-melbourne-wantirna';
  } else if (oldKey === 'dr-devesh-kaushal-gregory-hills') {
    newKey = 'dr-devesh-kaushal-upper-gi-weight-loss-surgeon-gregory-hills';
  } else if (oldKey === 'dr-john-ozmen-bella-vista') {
    newKey = 'dr-john-ozmen-general-upper-gi-surgeon-bella-vista';
  }
  
  fixed[newKey] = value;
});

fs.writeFileSync('surgeon-enhanced-data.json', JSON.stringify(fixed, null, 2));
console.log('✅ Fixed slug mappings');
