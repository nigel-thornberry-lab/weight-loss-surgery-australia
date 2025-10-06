const fs = require('fs');

// Read existing data
const existingData = JSON.parse(fs.readFileSync('surgeon-enhanced-data.json', 'utf-8'));

// Add new surgeon data
const newSurgeons = {
  "mr-niruben-rajasagaram-wantirna": {
    "surgeon_name": "Mr Niruben Rajasagaram",
    "city": "Wantirna",
    "state": "Victoria",
    "team": {
      "surgeons": [
        {
          "name": "Mr Niruben Rajasagaram",
          "role": "Consultant Bariatric, Oesophago-gastric, and General Surgeon",
          "qualifications": "Adjunct Lecturer at Monash University, Reviewer for Obesity Surgery Journal"
        }
      ],
      "team_size": "Principal surgeon practice",
      "has_dietitian": "Not specified",
      "has_psychologist": "Not specified"
    },
    "services": {
      "procedures": [
        "Gastric Sleeve (Sleeve Gastrectomy)",
        "Gastric Bypass",
        "Mini Gastric Bypass",
        "Gastric Band",
        "Gastric Balloon",
        "Revisional Bariatric Surgery",
        "Laparoscopic Gallbladder Surgery",
        "Groin Hernia Surgery",
        "Upper GI & Advanced Interventional Endoscopy"
      ],
      "pre_op_program": "Yes - comprehensive consultation",
      "post_op_program": "Yes - post-operative support",
      "follow_up_duration": "Not specified",
      "telehealth": "Not specified",
      "support_groups": "Not specified",
      "approach": "Comprehensive patient care from consultation to post-op"
    },
    "hospitals": [
      {
        "name": "Mulgrave Private Hospital"
      },
      {
        "name": "St John of God Specialist Centre, Berwick"
      }
    ],
    "pricing": {
      "available": false,
      "gastric_sleeve": "Contact for pricing",
      "gastric_bypass": "Contact for pricing"
    },
    "unique_features": [
      "Specialist in complex revisional bariatric surgery",
      "Single-stage conversions (sleeve to bypass, band to bypass)",
      "Both surgical and non-surgical options (gastric balloon)",
      "Academic engagement - Monash University Adjunct Lecturer",
      "Reviewer for Obesity Surgery Journal",
      "Advanced laparoendoscopic surgery expertise",
      "Patient-centered compassionate care focus"
    ]
  },
  "dr-yuan-cheng-richmond": {
    "surgeon_name": "Dr Yuan Cheng",
    "city": "Richmond",
    "state": "Victoria",
    "team": {
      "surgeons": [
        {
          "name": "Mr Yuan Cheng",
          "qualifications": "M.B.B.S., F.R.A.C.S., PGDipSurgAnat"
        },
        {
          "name": "Mr Harry Frydenberg AM",
          "qualifications": "M.B.B.S., F.R.A.C.S."
        },
        {
          "name": "Mr Ernest Kah-Seong Lim",
          "qualifications": "M.B.B.S., F.R.A.C.S."
        },
        {
          "name": "Dr Chiu Kang",
          "qualifications": "FRACS MBBS BMedSc MSurgicalEd"
        }
      ],
      "team_size": "4-surgeon team with allied health support",
      "has_dietitian": "Yes (allied health support)",
      "has_psychologist": "Not specified"
    },
    "services": {
      "procedures": [
        "Sleeve Gastrectomy",
        "Roux-en-Y Gastric Bypass",
        "One Anastomosis Gastric Bypass",
        "Mini Bypass",
        "Adjustable Gastric Band (Lapband)",
        "Revision Bariatric Surgery",
        "Intragastric Balloon (Orbera)",
        "Laparoscopic Cholecystectomy (Gallbladder)",
        "Hernia Repairs"
      ],
      "pre_op_program": "Yes - free information seminars",
      "post_op_program": "Yes - long-term follow-up",
      "follow_up_duration": "Not specified",
      "telehealth": true,
      "support_groups": "Free information seminars for prospective patients",
      "approach": "Evidence-based multidisciplinary approach"
    },
    "hospitals": [
      {
        "name": "Epworth Centre for Bariatric Surgery",
        "location": "East Melbourne"
      },
      {
        "name": "Box Hill Hospital",
        "type": "Public appointment"
      },
      {
        "name": "Mulgrave Private Hospital"
      },
      {
        "name": "St Vincent's Private Hospital"
      }
    ],
    "pricing": {
      "available": false,
      "gastric_sleeve": "Contact for pricing",
      "note": "Discussed during consultation"
    },
    "unique_features": [
      "4-surgeon bariatric team at Epworth Centre",
      "Extensive revision surgery expertise",
      "Belgian fellowship training (Dr. B. Dillemans) - advanced laparoscopic techniques",
      "Free patient information seminars",
      "Telehealth consultations available",
      "Multilingual services (Mandarin, English)",
      "Multidisciplinary collaboration with allied health",
      "Evidence-based approach with long-term support"
    ]
  },
  "dr-devesh-kaushal-gregory-hills": {
    "surgeon_name": "Dr Devesh Kaushal",
    "city": "Gregory Hills",
    "state": "NSW",
    "team": {
      "surgeons": [
        {
          "name": "Dr Devesh Kaushal",
          "role": "Specialist General Surgeon",
          "qualifications": "FRACS, Master of Surgery",
          "experience": "15+ years"
        }
      ],
      "team_members": [
        {
          "name": "Claudia",
          "role": "Dietitian and Nutritionist",
          "qualifications": "Master of Nutrition and Dietetics, University of Sydney"
        },
        {
          "role": "Psychologist",
          "description": "Specialized psychologist for weight loss surgery support"
        },
        {
          "role": "Exercise Physiologist",
          "description": "Multidisciplinary support for weight loss patients"
        }
      ],
      "team_size": "Full multidisciplinary team (4+)",
      "has_dietitian": true,
      "has_psychologist": true,
      "has_exercise_physiologist": true
    },
    "services": {
      "procedures": [
        "Gastric Sleeve",
        "Gastric Bypass",
        "Upper Gastrointestinal Surgery",
        "Gastroscopy & Colonoscopy",
        "Endoscopic Mucosal Resection (EMR)",
        "Balloon Dilatation & Stent Insertion",
        "Hernia Surgery (Abdominal & Groin)",
        "Acid Reflux Surgery (Fundoplication)",
        "Gallbladder Surgery",
        "Colorectal Surgery",
        "General Surgery"
      ],
      "pre_op_program": "Yes - comprehensive multidisciplinary assessment",
      "post_op_program": "Yes - ongoing support with dietitian, psychologist, exercise physiologist",
      "follow_up_duration": "Long-term multidisciplinary support",
      "telehealth": "Not specified",
      "support_groups": "Not specified",
      "approach": "Comprehensive multidisciplinary care with dietitian, psychologist, and exercise physiologist"
    },
    "hospitals": [
      {
        "name": "Campbelltown Private Hospital"
      },
      {
        "name": "Sydney Southwest Private Hospital"
      }
    ],
    "pricing": {
      "available": "Website has pricing section",
      "gastric_sleeve": "Contact for specific pricing",
      "note": "Pricing page available, contact for details"
    },
    "unique_features": [
      "FULL MULTIDISCIPLINARY TEAM - Dietitian, Psychologist, Exercise Physiologist",
      "One of few practices with complete support team",
      "Advanced endoscopic procedures (EMR for early-stage disease)",
      "15+ years surgical experience",
      "UK training at leading centre",
      "Clinical awards and research involvement",
      "Minimally invasive laparoscopic focus",
      "Personalized, empathetic, continuous care",
      "Patient registration form online for streamlined process"
    ]
  },
  "dr-john-ozmen-bella-vista": {
    "surgeon_name": "Dr John Ozmen",
    "city": "Bella Vista",
    "state": "NSW",
    "team": {
      "surgeons": [
        {
          "name": "Dr John Ozmen",
          "role": "General, Upper-GI & Bariatric Surgeon",
          "qualifications": "Australian-trained, Sub-specialty accreditation in Upper-GI & Bariatric",
          "procedures_performed": "5,000+ laparoscopic surgeries"
        }
      ],
      "team_size": "Principal surgeon with professional support team",
      "has_dietitian": "Not specified",
      "has_psychologist": "Not specified"
    },
    "services": {
      "procedures": [
        "Weight Loss (Bariatric) Surgery",
        "Hernia Surgery",
        "Acid Reflux Surgery",
        "Gallbladder Surgery",
        "Endoscopy (Gastroscopy & Colonoscopy)",
        "Laparoscopic General Surgery"
      ],
      "pre_op_program": "Yes - comprehensive consultation",
      "post_op_program": "Yes - personal post-operative attention",
      "follow_up_duration": "In-person reviews after surgery",
      "telehealth": "Not specified",
      "support_groups": "Not specified",
      "approach": "Personalized care with exemplary bedside manner"
    },
    "hospitals": [
      {
        "name": "Norwest Private Hospital"
      },
      {
        "name": "Westmead Private Hospital"
      },
      {
        "name": "Prince of Wales Private Hospital"
      },
      {
        "name": "Lakeview Private Hospital"
      },
      {
        "name": "Campbelltown Private Hospital"
      },
      {
        "name": "Sydney South West Private Hospital"
      }
    ],
    "pricing": {
      "available": "Pricing page on website",
      "gastric_sleeve": "Contact for specific pricing",
      "note": "Dedicated pricing page available"
    },
    "unique_features": [
      "5,000+ laparoscopic surgeries performed",
      "Sub-specialty accreditation in Upper-GI and Bariatric surgery",
      "6 hospital affiliations across Sydney",
      "Exemplary bedside manner (noted in reviews)",
      "Personal post-operative attention",
      "Takes complex or emergency cases",
      "Thorough communication and genuine patient care",
      "Minimally invasive (keyhole) procedure focus",
      "Multiple consulting locations (Bella Vista, Dural)"
    ]
  }
};

// Merge data
const mergedData = { ...existingData, ...newSurgeons };

// Write back
fs.writeFileSync('surgeon-enhanced-data.json', JSON.stringify(mergedData, null, 2));

console.log(`✅ Added ${Object.keys(newSurgeons).length} new surgeons`);
console.log(`📊 Total enhanced surgeons: ${Object.keys(mergedData).length}`);

