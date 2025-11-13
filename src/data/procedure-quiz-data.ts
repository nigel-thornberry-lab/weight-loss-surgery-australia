// Procedure Selector Quiz Data - Australian Bariatric Surgery 2025
// Evidence-based scoring system aligned with clinical guidelines

import { procedures, healthConditions } from './calculator-data';

export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: QuizOption[];
  weight: number; // Scoring weight (1-5, higher = more important)
  required: boolean;
}

export interface QuizOption {
  text: string;
  value: string | number;
  procedureScores: Record<string, number>; // Points for each procedure slug
  explanation?: string; // Why this answer affects recommendations
}

export interface ProcedureRecommendation {
  procedure: string;
  procedureSlug: string;
  matchPercentage: number;
  reasons: string[];
  pros: string[];
  cons: string[];
  expectedOutcomes: {
    weightLoss: string;
    healthImprovements: string[];
    timeline: string;
  };
  costEstimate: {
    min: number;
    max: number;
    withInsurance: string;
  };
  recoveryTimeline: string;
  nextSteps: string[];
}

export interface QuizAnswers {
  bmi?: string;
  previousAttempts?: string;
  healthConditions?: string[];
  weightLossGoal?: string;
  timeline?: string;
  activityLevel?: string;
  recoveryTime?: string;
  workConstraints?: string;
  budget?: string;
  insurance?: string;
  riskTolerance?: string;
  permanentChange?: string;
  previousSurgeries?: string;
}

// Procedure slugs for reference
const PROCEDURE_SLUGS = {
  SLEEVE: 'gastric-sleeve',
  BYPASS: 'gastric-bypass',
  MINI_BYPASS: 'mini-gastric-bypass',
  BAND: 'gastric-band',
  DUODENAL_SWITCH: 'duodenal-switch'
};

// Quiz Questions (8-10 questions as specified)
export const quizQuestions: QuizQuestion[] = [
  // Question 1: BMI & Eligibility
  {
    id: 'bmi',
    category: 'Eligibility',
    question: 'What is your current BMI range?',
    weight: 5, // Critical factor
    required: true,
    options: [
      {
        text: '30-35 (Eligible with health conditions)',
        value: '30-35',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 8,
          [PROCEDURE_SLUGS.BYPASS]: 6,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 7,
          [PROCEDURE_SLUGS.BAND]: 9,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 2
        },
        explanation: 'Lower BMI range - gastric band or sleeve may be more appropriate'
      },
      {
        text: '35-40 (Ideal candidate)',
        value: '35-40',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 10,
          [PROCEDURE_SLUGS.BYPASS]: 9,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 9,
          [PROCEDURE_SLUGS.BAND]: 7,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 4
        },
        explanation: 'Ideal BMI range for most procedures'
      },
      {
        text: '40-45 (Recommended)',
        value: '40-45',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 10,
          [PROCEDURE_SLUGS.BYPASS]: 10,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 9,
          [PROCEDURE_SLUGS.BAND]: 5,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 6
        },
        explanation: 'Excellent candidate for sleeve or bypass'
      },
      {
        text: '45-50 (Priority candidate)',
        value: '45-50',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 9,
          [PROCEDURE_SLUGS.BYPASS]: 10,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 8,
          [PROCEDURE_SLUGS.BAND]: 3,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 8
        },
        explanation: 'Higher BMI - bypass or duodenal switch may be more effective'
      },
      {
        text: '50+ (Critical priority)',
        value: '50+',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 7,
          [PROCEDURE_SLUGS.BYPASS]: 10,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 7,
          [PROCEDURE_SLUGS.BAND]: 2,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 10
        },
        explanation: 'Very high BMI - bypass or duodenal switch typically recommended'
      }
    ]
  },

  // Question 2: Previous Weight Loss Attempts
  {
    id: 'previousAttempts',
    category: 'History',
    question: 'Have you tried significant weight loss programs before?',
    weight: 2,
    required: true,
    options: [
      {
        text: 'Yes, multiple times without long-term success',
        value: 'multiple-failed',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 9,
          [PROCEDURE_SLUGS.BYPASS]: 10,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 9,
          [PROCEDURE_SLUGS.BAND]: 6,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 8
        },
        explanation: 'Surgery may be appropriate if diet/exercise attempts have failed'
      },
      {
        text: 'Yes, once or twice',
        value: 'some-attempts',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 8,
          [PROCEDURE_SLUGS.BYPASS]: 8,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 8,
          [PROCEDURE_SLUGS.BAND]: 7,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 6
        }
      },
      {
        text: 'No, this would be my first serious attempt',
        value: 'no-attempts',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 6,
          [PROCEDURE_SLUGS.BYPASS]: 5,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 6,
          [PROCEDURE_SLUGS.BAND]: 8,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 4
        },
        explanation: 'May want to try non-surgical options first, or consider reversible band'
      }
    ]
  },

  // Question 3: Health Conditions
  {
    id: 'healthConditions',
    category: 'Health',
    question: 'Do you have any of these health conditions? (Select all that apply)',
    weight: 5, // Critical factor
    required: false,
    options: [
      {
        text: 'Type 2 Diabetes',
        value: 'diabetes',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 6,
          [PROCEDURE_SLUGS.BYPASS]: 12, // Bypass is gold standard for diabetes
          [PROCEDURE_SLUGS.MINI_BYPASS]: 10,
          [PROCEDURE_SLUGS.BAND]: 4,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 11
        },
        explanation: 'Bypass has highest diabetes remission rate (80-90%)'
      },
      {
        text: 'GORD/Reflux (Heartburn)',
        value: 'gord',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 3, // Sleeve can worsen reflux
          [PROCEDURE_SLUGS.BYPASS]: 12, // Bypass helps reflux
          [PROCEDURE_SLUGS.MINI_BYPASS]: 10,
          [PROCEDURE_SLUGS.BAND]: 5,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 8
        },
        explanation: 'Bypass typically improves reflux; sleeve may worsen it'
      },
      {
        text: 'Sleep Apnoea',
        value: 'sleep-apnoea',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 9,
          [PROCEDURE_SLUGS.BYPASS]: 10,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 9,
          [PROCEDURE_SLUGS.BAND]: 6,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 9
        },
        explanation: 'All procedures help, but bypass and sleeve are most effective'
      },
      {
        text: 'High Blood Pressure',
        value: 'blood-pressure',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 8,
          [PROCEDURE_SLUGS.BYPASS]: 9,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 8,
          [PROCEDURE_SLUGS.BAND]: 6,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 8
        }
      },
      {
        text: 'PCOS',
        value: 'pcos',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 8,
          [PROCEDURE_SLUGS.BYPASS]: 9,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 8,
          [PROCEDURE_SLUGS.BAND]: 5,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 7
        }
      },
      {
        text: 'Joint Problems',
        value: 'joint-pain',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 9,
          [PROCEDURE_SLUGS.BYPASS]: 9,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 8,
          [PROCEDURE_SLUGS.BAND]: 6,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 8
        }
      },
      {
        text: 'None of these',
        value: 'none',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 8,
          [PROCEDURE_SLUGS.BYPASS]: 7,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 7,
          [PROCEDURE_SLUGS.BAND]: 7,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 5
        }
      }
    ]
  },

  // Question 4: Weight Loss Goals
  {
    id: 'weightLossGoal',
    category: 'Goals',
    question: 'What is your primary weight loss goal?',
    weight: 4,
    required: true,
    options: [
      {
        text: 'Moderate weight loss (40-50% of excess weight)',
        value: 'moderate',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 7,
          [PROCEDURE_SLUGS.BYPASS]: 6,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 7,
          [PROCEDURE_SLUGS.BAND]: 10,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 4
        },
        explanation: 'Gastric band may be sufficient for moderate goals'
      },
      {
        text: 'Significant weight loss (60-70% of excess weight)',
        value: 'significant',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 10,
          [PROCEDURE_SLUGS.BYPASS]: 9,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 9,
          [PROCEDURE_SLUGS.BAND]: 5,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 7
        },
        explanation: 'Sleeve or bypass typically achieve this range'
      },
      {
        text: 'Maximum weight loss (70-80% of excess weight)',
        value: 'maximum',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 7,
          [PROCEDURE_SLUGS.BYPASS]: 10,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 8,
          [PROCEDURE_SLUGS.BAND]: 3,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 10
        },
        explanation: 'Bypass or duodenal switch achieve highest weight loss'
      }
    ]
  },

  // Question 5: Recovery Time Preference
  {
    id: 'recoveryTime',
    category: 'Lifestyle',
    question: 'How much recovery time can you take off work?',
    weight: 3,
    required: true,
    options: [
      {
        text: '1 week or less',
        value: '1-week',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 6,
          [PROCEDURE_SLUGS.BYPASS]: 4,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 5,
          [PROCEDURE_SLUGS.BAND]: 10,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 2
        },
        explanation: 'Gastric band has shortest recovery time'
      },
      {
        text: '2-3 weeks',
        value: '2-3-weeks',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 10,
          [PROCEDURE_SLUGS.BYPASS]: 7,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 9,
          [PROCEDURE_SLUGS.BAND]: 8,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 5
        },
        explanation: 'Sleeve typically requires 2-3 weeks recovery'
      },
      {
        text: '4-6 weeks',
        value: '4-6-weeks',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 8,
          [PROCEDURE_SLUGS.BYPASS]: 10,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 9,
          [PROCEDURE_SLUGS.BAND]: 6,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 8
        },
        explanation: 'Bypass typically requires 4-6 weeks recovery'
      },
      {
        text: '6+ weeks (flexible)',
        value: '6-plus-weeks',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 7,
          [PROCEDURE_SLUGS.BYPASS]: 9,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 8,
          [PROCEDURE_SLUGS.BAND]: 5,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 10
        },
        explanation: 'Duodenal switch requires longest recovery but highest weight loss'
      }
    ]
  },

  // Question 6: Risk Tolerance
  {
    id: 'riskTolerance',
    category: 'Preferences',
    question: 'How do you feel about permanent changes to your anatomy?',
    weight: 3,
    required: true,
    options: [
      {
        text: 'I prefer reversible options',
        value: 'reversible',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 3,
          [PROCEDURE_SLUGS.BYPASS]: 2,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 3,
          [PROCEDURE_SLUGS.BAND]: 10,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 1
        },
        explanation: 'Gastric band is the only reversible procedure'
      },
      {
        text: 'I\'m comfortable with permanent changes if effective',
        value: 'permanent-ok',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 10,
          [PROCEDURE_SLUGS.BYPASS]: 10,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 9,
          [PROCEDURE_SLUGS.BAND]: 5,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 9
        },
        explanation: 'Sleeve and bypass are permanent but highly effective'
      },
      {
        text: 'I want the most effective option regardless',
        value: 'most-effective',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 8,
          [PROCEDURE_SLUGS.BYPASS]: 10,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 8,
          [PROCEDURE_SLUGS.BAND]: 3,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 10
        },
        explanation: 'Bypass or duodenal switch offer highest effectiveness'
      }
    ]
  },

  // Question 7: Budget Considerations
  {
    id: 'budget',
    category: 'Financial',
    question: 'What is your budget situation?',
    weight: 2,
    required: true,
    options: [
      {
        text: 'I have private health insurance (Gold level)',
        value: 'insured-gold',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 9,
          [PROCEDURE_SLUGS.BYPASS]: 9,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 8,
          [PROCEDURE_SLUGS.BAND]: 7,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 8
        },
        explanation: 'Insurance covers most procedures; out-of-pocket $5,000-$12,000'
      },
      {
        text: 'I have insurance but lower level (Silver/Bronze)',
        value: 'insured-lower',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 8,
          [PROCEDURE_SLUGS.BYPASS]: 7,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 8,
          [PROCEDURE_SLUGS.BAND]: 8,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 6
        },
        explanation: 'May have higher out-of-pocket costs; band or sleeve may be more affordable'
      },
      {
        text: 'No insurance, self-funded',
        value: 'self-funded',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 8,
          [PROCEDURE_SLUGS.BYPASS]: 6,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 7,
          [PROCEDURE_SLUGS.BAND]: 9,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 4
        },
        explanation: 'Band is most affordable; sleeve is good value; bypass/switch are more expensive'
      },
      {
        text: 'I can use payment plans or superannuation',
        value: 'payment-options',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 9,
          [PROCEDURE_SLUGS.BYPASS]: 9,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 8,
          [PROCEDURE_SLUGS.BAND]: 7,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 8
        },
        explanation: 'Payment options make all procedures accessible'
      }
    ]
  },

  // Question 8: Previous Surgeries
  {
    id: 'previousSurgeries',
    category: 'History',
    question: 'Have you had any previous stomach or bariatric surgeries?',
    weight: 4, // Important for eligibility
    required: true,
    options: [
      {
        text: 'No previous stomach surgeries',
        value: 'none',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 10,
          [PROCEDURE_SLUGS.BYPASS]: 10,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 10,
          [PROCEDURE_SLUGS.BAND]: 10,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 9
        },
        explanation: 'All procedures are available as primary surgery'
      },
      {
        text: 'I had gastric band (may need revision)',
        value: 'band-revision',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 10,
          [PROCEDURE_SLUGS.BYPASS]: 9,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 8,
          [PROCEDURE_SLUGS.BAND]: 3,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 6
        },
        explanation: 'Sleeve or bypass are common revision options after band'
      },
      {
        text: 'I had gastric sleeve (may need revision)',
        value: 'sleeve-revision',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 2,
          [PROCEDURE_SLUGS.BYPASS]: 10,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 9,
          [PROCEDURE_SLUGS.BAND]: 3,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 8
        },
        explanation: 'Bypass is common revision option after sleeve'
      },
      {
        text: 'Other stomach surgery',
        value: 'other-surgery',
        procedureScores: {
          [PROCEDURE_SLUGS.SLEEVE]: 6,
          [PROCEDURE_SLUGS.BYPASS]: 7,
          [PROCEDURE_SLUGS.MINI_BYPASS]: 6,
          [PROCEDURE_SLUGS.BAND]: 5,
          [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 5
        },
        explanation: 'Previous surgery may affect options; surgeon assessment required'
      }
    ]
  }
];

// Procedure-specific information for recommendations
export const procedureInfo: Record<string, {
  pros: string[];
  cons: string[];
  bestFor: string[];
  notRecommendedFor: string[];
  healthImprovements: string[];
}> = {
  [PROCEDURE_SLUGS.SLEEVE]: {
    pros: [
      'Most popular procedure in Australia',
      'Simpler surgery with lower complication rates',
      'Faster recovery (2-3 weeks)',
      'No foreign objects (unlike band)',
      'Effective for 60-70% excess weight loss',
      'Lower risk of nutritional deficiencies than bypass'
    ],
    cons: [
      'Permanent - cannot be reversed',
      'May worsen existing reflux/GORD',
      'Lower weight loss than bypass for very high BMI',
      'Requires lifelong dietary changes',
      '5-10% may need revision surgery'
    ],
    bestFor: [
      'BMI 35-45',
      'First-time bariatric surgery',
      'Want simpler procedure',
      'Faster recovery needed',
      'No significant reflux issues'
    ],
    notRecommendedFor: [
      'Severe GORD/reflux (may worsen)',
      'BMI 50+ (bypass may be better)',
      'Type 2 diabetes (bypass more effective)'
    ],
    healthImprovements: [
      'Sleep apnoea improvement (85%)',
      'High blood pressure reduction (60%)',
      'Joint pain relief (80%)',
      'Type 2 diabetes remission (60-70%)',
      'PCOS symptom improvement'
    ]
  },
  [PROCEDURE_SLUGS.BYPASS]: {
    pros: [
      'Highest diabetes remission rate (80-90%)',
      'Best for GORD/reflux (typically improves)',
      'Highest weight loss (70-80% excess weight)',
      'Gold standard for BMI 50+',
      'Lower revision rate (3-5%)',
      'Long-term proven track record'
    ],
    cons: [
      'More complex surgery',
      'Longer recovery (4-6 weeks)',
      'Higher risk of nutritional deficiencies',
      'Requires lifelong vitamin supplements',
      'Dumping syndrome possible',
      'More expensive than sleeve'
    ],
    bestFor: [
      'Type 2 diabetes',
      'GORD/reflux',
      'BMI 45+',
      'Maximum weight loss goals',
      'Previous sleeve needing revision'
    ],
    notRecommendedFor: [
      'Want reversible option',
      'Very short recovery time needed',
      'Cannot commit to lifelong vitamins',
      'BMI under 35 (unless severe comorbidities)'
    ],
    healthImprovements: [
      'Type 2 diabetes remission (80-90%)',
      'GORD/reflux improvement (90%)',
      'Sleep apnoea resolution (85%)',
      'High blood pressure normalization (70%)',
      'PCOS improvement',
      'Joint pain relief'
    ]
  },
  [PROCEDURE_SLUGS.MINI_BYPASS]: {
    pros: [
      'Simpler than traditional bypass',
      'Faster recovery than bypass',
      'Good weight loss (65-75%)',
      'Effective for diabetes',
      'Lower complication risk than bypass'
    ],
    cons: [
      'Less long-term data than bypass',
      'Still requires vitamin supplements',
      'May have dumping syndrome',
      'Not as widely performed'
    ],
    bestFor: [
      'Want bypass benefits with simpler surgery',
      'BMI 40-50',
      'Type 2 diabetes',
      'Faster recovery than bypass preferred'
    ],
    notRecommendedFor: [
      'BMI 50+ (traditional bypass may be better)',
      'Want most proven option',
      'Cannot commit to vitamins'
    ],
    healthImprovements: [
      'Type 2 diabetes remission (75-85%)',
      'GORD improvement',
      'Sleep apnoea improvement',
      'Blood pressure reduction'
    ]
  },
  [PROCEDURE_SLUGS.BAND]: {
    pros: [
      'Only reversible procedure',
      'Shortest recovery (1 week)',
      'Lowest cost',
      'No permanent anatomical changes',
      'Adjustable without surgery',
      'Lowest risk of nutritional deficiencies'
    ],
    cons: [
      'Lowest weight loss (40-50%)',
      'Highest revision rate (40-60%)',
      'Requires regular adjustments',
      'Foreign object in body',
      'Long-term complications possible',
      'Less effective than other procedures'
    ],
    bestFor: [
      'Want reversible option',
      'Lower BMI (30-40)',
      'Moderate weight loss goals',
      'Very short recovery needed',
      'Budget-conscious',
      'First-time surgery consideration'
    ],
    notRecommendedFor: [
      'Maximum weight loss needed',
      'BMI 45+',
      'Type 2 diabetes (less effective)',
      'Want most effective option',
      'Cannot commit to regular follow-ups'
    ],
    healthImprovements: [
      'Sleep apnoea improvement (60%)',
      'Blood pressure reduction (50%)',
      'Joint pain relief (60%)',
      'Type 2 diabetes improvement (40-50%)'
    ]
  },
  [PROCEDURE_SLUGS.DUODENAL_SWITCH]: {
    pros: [
      'Highest weight loss (70-80%)',
      'Very effective for BMI 50+',
      'Good diabetes remission',
      'Lowest revision rate (2-4%)',
      'Most effective for super obesity'
    ],
    cons: [
      'Most complex surgery',
      'Longest recovery (6+ weeks)',
      'Highest risk of nutritional deficiencies',
      'Most expensive',
      'Requires strict vitamin compliance',
      'Less commonly performed',
      'Higher complication risk'
    ],
    bestFor: [
      'BMI 50+',
      'Super obesity',
      'Maximum weight loss critical',
      'Can commit to strict vitamin regimen',
      'Flexible recovery time'
    ],
    notRecommendedFor: [
      'BMI under 45',
      'Cannot commit to vitamins',
      'Need quick recovery',
      'Budget constraints',
      'Want simpler procedure'
    ],
    healthImprovements: [
      'Type 2 diabetes remission (85-90%)',
      'Sleep apnoea resolution',
      'Blood pressure normalization',
      'Maximum weight loss benefits'
    ]
  }
};

// Scoring algorithm
export function calculateRecommendations(answers: QuizAnswers): ProcedureRecommendation[] {
  const scores: Record<string, number> = {
    [PROCEDURE_SLUGS.SLEEVE]: 0,
    [PROCEDURE_SLUGS.BYPASS]: 0,
    [PROCEDURE_SLUGS.MINI_BYPASS]: 0,
    [PROCEDURE_SLUGS.BAND]: 0,
    [PROCEDURE_SLUGS.DUODENAL_SWITCH]: 0
  };

  // Calculate weighted scores for each question
  quizQuestions.forEach(question => {
    const answer = answers[question.id as keyof QuizAnswers];
    if (!answer) return;

    const questionWeight = question.weight;

    if (question.id === 'healthConditions') {
      // Handle multiple selections
      const conditions = Array.isArray(answer) ? answer : [answer];
      conditions.forEach(condition => {
        const option = question.options.find(opt => opt.value === condition);
        if (option) {
          Object.keys(option.procedureScores).forEach(procedure => {
            scores[procedure] += option.procedureScores[procedure] * questionWeight;
          });
        }
      });
    } else {
      // Single answer
      const option = question.options.find(opt => opt.value === answer);
      if (option) {
        Object.keys(option.procedureScores).forEach(procedure => {
          scores[procedure] += option.procedureScores[procedure] * questionWeight;
        });
      }
    }
  });

  // Apply eligibility gates based on BMI
  if (answers.bmi) {
    const bmiValue = answers.bmi;
    if (bmiValue === '30-35') {
      // Lower BMI - reduce scores for more aggressive procedures
      scores[PROCEDURE_SLUGS.DUODENAL_SWITCH] *= 0.3;
      scores[PROCEDURE_SLUGS.BYPASS] *= 0.7;
    } else if (bmiValue === '50+') {
      // Very high BMI - boost bypass and switch
      scores[PROCEDURE_SLUGS.BYPASS] *= 1.2;
      scores[PROCEDURE_SLUGS.DUODENAL_SWITCH] *= 1.3;
      scores[PROCEDURE_SLUGS.BAND] *= 0.4;
    }
  }

  // Apply health condition bonuses
  const conditions = Array.isArray(answers.healthConditions) 
    ? answers.healthConditions 
    : answers.healthConditions ? [answers.healthConditions] : [];

  if (conditions.includes('diabetes')) {
    scores[PROCEDURE_SLUGS.BYPASS] *= 1.3;
    scores[PROCEDURE_SLUGS.DUODENAL_SWITCH] *= 1.2;
    scores[PROCEDURE_SLUGS.MINI_BYPASS] *= 1.2;
  }

  if (conditions.includes('gord')) {
    scores[PROCEDURE_SLUGS.BYPASS] *= 1.4;
    scores[PROCEDURE_SLUGS.MINI_BYPASS] *= 1.2;
    scores[PROCEDURE_SLUGS.SLEEVE] *= 0.6; // Sleeve can worsen reflux
  }

  // Normalize scores to percentages (0-100)
  const maxScore = Math.max(...Object.values(scores));
  const recommendations: ProcedureRecommendation[] = [];

  Object.keys(scores).forEach(procedureSlug => {
    const matchPercentage = Math.round((scores[procedureSlug] / maxScore) * 100);
    const procedure = procedures.find(p => p.slug === procedureSlug);
    const info = procedureInfo[procedureSlug];

    if (!procedure || !info) return;

    // Generate personalized reasons
    const reasons = generateReasons(procedureSlug, answers, info);

    recommendations.push({
      procedure: procedure.name,
      procedureSlug,
      matchPercentage,
      reasons,
      pros: info.pros,
      cons: info.cons,
      expectedOutcomes: {
        weightLoss: procedure.weightLoss,
        healthImprovements: info.healthImprovements,
        timeline: `Most weight loss occurs in first 12-18 months, with full results by 24 months`
      },
      costEstimate: {
        min: procedure.costs.total[0],
        max: procedure.costs.total[1],
        withInsurance: `With insurance: $${Math.round(procedure.costs.total[0] * 0.3)}-$${Math.round(procedure.costs.total[1] * 0.5)} out-of-pocket`
      },
      recoveryTimeline: `${procedure.recoveryWeeks} weeks for full recovery, return to work typically at ${Math.round(procedure.recoveryWeeks * 0.6)} weeks`,
      nextSteps: [
        'Consult with AHPRA-registered bariatric surgeon (We\'ll help with this)',
        'Complete multidisciplinary team assessment',
        'Review Medicare eligibility criteria',
        'Check private health insurance coverage',
        'Begin pre-operative preparation program'
      ]
    });
  });

  // Sort by match percentage (highest first)
  return recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

// Generate personalized reasons for recommendation
function generateReasons(
  procedureSlug: string,
  answers: QuizAnswers,
  info: typeof procedureInfo[string]
): string[] {
  const reasons: string[] = [];

  // BMI-based reasons
  if (answers.bmi) {
    if (answers.bmi === '50+' && (procedureSlug === PROCEDURE_SLUGS.BYPASS || procedureSlug === PROCEDURE_SLUGS.DUODENAL_SWITCH)) {
      reasons.push('Your BMI of 50+ makes you an ideal candidate for more aggressive procedures like bypass or duodenal switch');
    } else if (answers.bmi === '35-40' && procedureSlug === PROCEDURE_SLUGS.SLEEVE) {
      reasons.push('Your BMI range is ideal for gastric sleeve surgery');
    }
  }

  // Health condition reasons
  const conditions = Array.isArray(answers.healthConditions) 
    ? answers.healthConditions 
    : answers.healthConditions ? [answers.healthConditions] : [];

  if (conditions.includes('diabetes') && (procedureSlug === PROCEDURE_SLUGS.BYPASS || procedureSlug === PROCEDURE_SLUGS.DUODENAL_SWITCH)) {
    reasons.push('Bypass and duodenal switch have the highest diabetes remission rates (80-90%)');
  }

  if (conditions.includes('gord') && procedureSlug === PROCEDURE_SLUGS.BYPASS) {
    reasons.push('Gastric bypass typically improves or resolves GORD/reflux, while sleeve may worsen it');
  }

  // Recovery time reasons
  if (answers.recoveryTime === '2-3-weeks' && procedureSlug === PROCEDURE_SLUGS.SLEEVE) {
    reasons.push('Gastric sleeve has a faster recovery time that matches your availability');
  }

  if (answers.recoveryTime === '1-week' && procedureSlug === PROCEDURE_SLUGS.BAND) {
    reasons.push('Gastric band has the shortest recovery time, fitting your schedule');
  }

  // Risk tolerance reasons
  if (answers.riskTolerance === 'reversible' && procedureSlug === PROCEDURE_SLUGS.BAND) {
    reasons.push('Gastric band is the only reversible procedure, matching your preference');
  }

  // Budget reasons
  if (answers.budget === 'self-funded' && procedureSlug === PROCEDURE_SLUGS.BAND) {
    reasons.push('Gastric band is the most affordable option for self-funded patients');
  }

  // Weight loss goal reasons
  if (answers.weightLossGoal === 'maximum' && (procedureSlug === PROCEDURE_SLUGS.BYPASS || procedureSlug === PROCEDURE_SLUGS.DUODENAL_SWITCH)) {
    reasons.push('This procedure offers the highest weight loss potential (70-80% excess weight)');
  }

  if (answers.weightLossGoal === 'moderate' && procedureSlug === PROCEDURE_SLUGS.BAND) {
    reasons.push('Gastric band can achieve moderate weight loss goals (40-50%)');
  }

  // Default reasons if none match
  if (reasons.length === 0) {
    reasons.push(`Based on your answers, ${info.bestFor[0] || 'this procedure'} may be a good fit`);
  }

  return reasons;
}

