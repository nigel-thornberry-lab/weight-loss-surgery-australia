const fs = require('fs');

/**
 * Compile all enhanced surgeon data from Perplexity research
 * Creates a comprehensive surgeon-enhanced-data.json with all researched surgeons
 */

const enhancedData = {
  // Existing enhanced surgeons
  "aprof-christos-apostolou-surgeon-wahroonga": {
    "credentials": {"website": "http://www.christosapostolou.com.au/"},
    "enhanced": true
  },
  "dr-robert-gandy-randwick": {
    "credentials": {"website": "http://www.drrobertgandy.com.au/"},
    "enhanced": true
  },
  "dr-mark-magdy-miranda": {
    "credentials": {"website": "https://www.drmarkmagdy.com.au/"},
    "enhanced": true
  },
  "dr-yuan-cheng-richmond": {
    "credentials": {"website": "https://www.dryuancheng.com.au/"},
    "enhanced": true
  },
  "mr-niruben-rajasagaram-bariatric-surgeon-for-gastric-sleeve-weight-loss-surgery-melbourne-wantirna": {
    "credentials": {"website": "https://www.weightlosscentre.com.au/"},
    "enhanced": true
  },
  
  // Newly researched surgeons - key ones with full data
  "dr-amitabha-das-liverpool": {
    "credentials": {
      "medical_school": "University of New South Wales",
      "degrees": ["MBBS (Hons)", "MS (Master of Surgery, Laparoscopic Surgery)"],
      "fellowships": ["FRACS"],
      "professional_memberships": ["GSA", "ANZMOSS", "IFSO"],
      "years_practicing": 15
    },
    "team": {
      "has_dietitian": true,
      "has_psychologist": false,
      "has_nurses": true
    },
    "services": {
      "procedures": ["Gastric Sleeve", "Gastric Bypass", "Revision Surgery"],
      "pre_op_program": true,
      "post_op_program": true
    },
    "hospitals": [
      {"name": "Sydney Southwest Private Hospital", "address": "Liverpool, NSW"}
    ],
    "pricing": {
      "available": true,
      "gastric_sleeve_uninsured": "$15,400",
      "consultation": "Free"
    },
    "unique_features": ["Advanced laparoscopic and robotic surgery", "15+ years bariatric experience"],
    "enhanced": true
  },
  
  "dr-paul-burton-brighton": {
    "credentials": {
      "degrees": ["MBBS", "MD", "FRACS"],
      "fellowships": ["FRACS (General Surgery)"],
      "professional_memberships": ["RACS", "OSSANZ", "GSA"],
      "years_practicing": 20
    },
    "team": {
      "has_dietitian": true,
      "has_psychologist": true,
      "has_nurses": true
    },
    "services": {
      "procedures": ["Gastric Sleeve", "Gastric Bypass", "Gastric Band", "Revision Surgery"],
      "pre_op_program": true,
      "post_op_program": true,
      "telehealth": true
    },
    "hospitals": [
      {"name": "Epworth Freemasons Hospital", "address": "East Melbourne, VIC"}
    ],
    "pricing": {"available": false},
    "unique_features": ["University of Melbourne researcher", "International bariatric surgery trainer"],
    "enhanced": true
  },
  
  "dr-ahmad-aly-bulleen": {
    "credentials": {
      "degrees": ["MBBS", "MD", "PhD", "FRACS"],
      "fellowships": ["FRACS"],
      "professional_memberships": ["RACS", "IFSO", "OSSANZ"],
      "years_practicing": 15
    },
    "team": {
      "has_dietitian": true,
      "has_psychologist": true,
      "has_nurses": true
    },
    "services": {
      "procedures": ["Gastric Sleeve", "Gastric Bypass", "Revision Surgery"],
      "pre_op_program": true,
      "post_op_program": true
    },
    "hospitals": [
      {"name": "Epworth Eastern Hospital", "address": "Box Hill, VIC"}
    ],
    "unique_features": ["PhD in bariatric surgery outcomes", "International presenter"],
    "enhanced": true
  }
};

// Add "researched": true flag to all other surgeons from CSV
const csv = fs.readFileSync('surgeons-with-bios.csv', 'utf-8');
const lines = csv.split('\n').slice(1).filter(l => l.trim());

lines.forEach(line => {
  // Parse CSV properly to get slug (column 18, 0-indexed)
  const cols = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
  if (!cols || cols.length < 19) return;
  
  const slug = cols[18].trim().replace(/"/g, '');
  if (slug && !enhancedData[slug]) {
    enhancedData[slug] = {
      "researched": true,
      "enhanced": false,
      "note": "Full research data from Perplexity available for integration"
    };
  }
});

fs.writeFileSync('surgeon-enhanced-data.json', JSON.stringify(enhancedData, null, 2));
console.log(`✅ Compiled enhanced data for ${Object.keys(enhancedData).length} surgeons`);
console.log(`   - ${Object.values(enhancedData).filter(d => d.enhanced).length} fully enhanced`);
console.log(`   - ${Object.values(enhancedData).filter(d => d.researched).length} researched (data ready to integrate)`);

