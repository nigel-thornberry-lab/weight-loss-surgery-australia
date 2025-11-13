/**
 * Surgeon Match Data Layer
 * 
 * Provides patient-centered matching logic based on priorities and needs
 */

import type { Surgeon } from './surgeons';
import { getProcedureList } from './surgeons';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface MatchQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'priority';
  options: MatchOption[];
  category: 'support' | 'practical' | 'medical' | 'preference';
}

export interface MatchOption {
  id: string;
  label: string;
  value: string;
  weights: {
    [surgeonId: string]: number; // Will be calculated dynamically
  };
}

export interface PatientProfile {
  priorities: string[]; // Selected option IDs
  location?: string;
  procedure?: string;
  budget?: 'low' | 'medium' | 'high' | 'flexible';
  supportNeeds?: 'minimal' | 'moderate' | 'comprehensive';
  travelWillingness?: 'local' | 'regional' | 'anywhere';
}

export interface SurgeonMatch {
  surgeon: Surgeon;
  matchScore: number;
  matchReasons: string[];
  strengths: string[];
  considerations: string[];
}

// ============================================================================
// MATCH QUESTIONS
// ============================================================================

export const matchQuestions: MatchQuestion[] = [
  {
    id: 'support-needs',
    question: 'What level of support do you need?',
    type: 'single',
    category: 'support',
    options: [
      {
        id: 'comprehensive',
        label: 'Comprehensive - I want a full team (dietitian, psychologist, nurses) and long-term follow-up',
        value: 'comprehensive',
        weights: {},
      },
      {
        id: 'moderate',
        label: 'Moderate - Some support is good, but I can manage most things myself',
        value: 'moderate',
        weights: {},
      },
      {
        id: 'minimal',
        label: 'Minimal - I just need the surgeon and basic follow-up',
        value: 'minimal',
        weights: {},
      },
    ],
  },
  {
    id: 'follow-up',
    question: 'How important is long-term follow-up care?',
    type: 'single',
    category: 'support',
    options: [
      {
        id: 'very-important',
        label: 'Very important - I want ongoing support for years',
        value: 'very-important',
        weights: {},
      },
      {
        id: 'somewhat-important',
        label: 'Somewhat important - Regular check-ins for 1-2 years',
        value: 'somewhat-important',
        weights: {},
      },
      {
        id: 'not-important',
        label: 'Not very important - I\'ll manage on my own after recovery',
        value: 'not-important',
        weights: {},
      },
    ],
  },
  {
    id: 'location',
    question: 'How far are you willing to travel?',
    type: 'single',
    category: 'practical',
    options: [
      {
        id: 'local',
        label: 'Local only - Within 30 minutes of my home',
        value: 'local',
        weights: {},
      },
      {
        id: 'regional',
        label: 'Regional - Up to 2 hours away is fine',
        value: 'regional',
        weights: {},
      },
      {
        id: 'anywhere',
        label: 'Anywhere - I\'ll travel for the right surgeon',
        value: 'anywhere',
        weights: {},
      },
    ],
  },
  {
    id: 'budget',
    question: 'What is your budget priority?',
    type: 'single',
    category: 'practical',
    options: [
      {
        id: 'affordable',
        label: 'Affordability - I need the most cost-effective option',
        value: 'affordable',
        weights: {},
      },
      {
        id: 'value',
        label: 'Value - I want good quality at a fair price',
        value: 'value',
        weights: {},
      },
      {
        id: 'premium',
        label: 'Premium - I want the best regardless of cost',
        value: 'premium',
        weights: {},
      },
      {
        id: 'flexible',
        label: 'Flexible - Cost is not my primary concern',
        value: 'flexible',
        weights: {},
      },
    ],
  },
  {
    id: 'experience',
    question: 'How important is surgeon experience?',
    type: 'single',
    category: 'medical',
    options: [
      {
        id: 'very-experienced',
        label: 'Very important - I want someone with 10+ years and many procedures',
        value: 'very-experienced',
        weights: {},
      },
      {
        id: 'experienced',
        label: 'Somewhat important - 5+ years is fine',
        value: 'experienced',
        weights: {},
      },
      {
        id: 'not-critical',
        label: 'Not critical - I trust qualified surgeons',
        value: 'not-critical',
        weights: {},
      },
    ],
  },
  {
    id: 'complexity',
    question: 'Do you have complex medical needs?',
    type: 'single',
    category: 'medical',
    options: [
      {
        id: 'complex',
        label: 'Yes - Multiple health conditions, previous surgeries, or high BMI (50+)',
        value: 'complex',
        weights: {},
      },
      {
        id: 'moderate',
        label: 'Somewhat - A few health conditions or moderate complexity',
        value: 'moderate',
        weights: {},
      },
      {
        id: 'straightforward',
        label: 'No - Relatively straightforward case',
        value: 'straightforward',
        weights: {},
      },
    ],
  },
  {
    id: 'communication',
    question: 'How important is communication style?',
    type: 'single',
    category: 'preference',
    options: [
      {
        id: 'very-important',
        label: 'Very important - I need someone who explains everything clearly',
        value: 'very-important',
        weights: {},
      },
      {
        id: 'somewhat-important',
        label: 'Somewhat important - Clear communication is nice',
        value: 'somewhat-important',
        weights: {},
      },
      {
        id: 'not-important',
        label: 'Not important - I just want results',
        value: 'not-important',
        weights: {},
      },
    ],
  },
  {
    id: 'telehealth',
    question: 'Do you need telehealth/virtual consultations?',
    type: 'single',
    category: 'practical',
    options: [
      {
        id: 'required',
        label: 'Required - I need virtual options',
        value: 'required',
        weights: {},
      },
      {
        id: 'preferred',
        label: 'Preferred - Virtual is convenient but not required',
        value: 'preferred',
        weights: {},
      },
      {
        id: 'not-needed',
        label: 'Not needed - I prefer in-person',
        value: 'not-needed',
        weights: {},
      },
    ],
  },
];

// ============================================================================
// SURGEON SCORING
// ============================================================================

/**
 * Calculate match score for a surgeon based on patient profile
 */
export function calculateMatchScore(
  surgeon: Surgeon,
  profile: PatientProfile
): SurgeonMatch {
  let score = 0;
  const reasons: string[] = [];
  const strengths: string[] = [];
  const considerations: string[] = [];

  const priorities = profile.priorities || [];

  // Support needs scoring
  if (priorities.includes('comprehensive')) {
    const hasDietitian = surgeon.enhanced_data?.team?.has_dietitian;
    const hasPsychologist = surgeon.enhanced_data?.team?.has_psychologist;
    const hasNurses = surgeon.enhanced_data?.team?.has_nurses;
    const hasPostOp = surgeon.enhanced_data?.services?.post_op_program;
    const followUp = surgeon.enhanced_data?.services?.follow_up_duration;

    if (hasDietitian && hasPsychologist && hasNurses) {
      score += 30;
      reasons.push('Has comprehensive multidisciplinary team');
      strengths.push('Full team support (dietitian, psychologist, nurses)');
    } else if (hasDietitian || hasPsychologist) {
      score += 15;
      reasons.push('Has some team support');
    }

    if (hasPostOp) {
      score += 20;
      reasons.push('Offers post-op support program');
      strengths.push('Post-operative support program');
    }

    if (followUp && (followUp.toLowerCase().includes('ongoing') || followUp.toLowerCase().includes('lifetime'))) {
      score += 15;
      reasons.push('Offers long-term follow-up');
      strengths.push('Long-term follow-up care');
    }
  } else if (priorities.includes('moderate')) {
    const hasDietitian = surgeon.enhanced_data?.team?.has_dietitian;
    if (hasDietitian) {
      score += 15;
      reasons.push('Has dietitian support');
    }
  }

  // Follow-up importance
  if (priorities.includes('very-important')) {
    const followUp = surgeon.enhanced_data?.services?.follow_up_duration;
    if (followUp && (followUp.toLowerCase().includes('ongoing') || followUp.toLowerCase().includes('lifetime'))) {
      score += 25;
      reasons.push('Offers long-term follow-up care');
      strengths.push('Long-term follow-up program');
    } else if (followUp) {
      score += 10;
    } else {
      considerations.push('Limited follow-up information available');
    }
  }

  // Location scoring
  if (profile.location && priorities.includes('local')) {
    const surgeonCity = surgeon.city?.toLowerCase() || '';
    const patientCity = profile.location.toLowerCase();
    if (surgeonCity.includes(patientCity) || patientCity.includes(surgeonCity)) {
      score += 30;
      reasons.push(`Located in ${surgeon.city}`);
      strengths.push(`Convenient location: ${surgeon.city}`);
    } else {
      score -= 20;
      considerations.push(`Located in ${surgeon.city} - may require travel`);
    }
  } else if (priorities.includes('regional')) {
    // Regional is more flexible, less penalty
    score += 10;
  } else if (priorities.includes('anywhere')) {
    // No location penalty
    score += 5;
  }

  // Budget scoring
  if (priorities.includes('affordable')) {
    const consultation = surgeon.enhanced_data?.pricing?.consultation;
    if (consultation && (consultation.toLowerCase().includes('free') || consultation === 'Free')) {
      score += 20;
      reasons.push('Offers free consultation');
      strengths.push('Free initial consultation');
    }
    // Lower consultation fees get higher scores (would need price parsing)
    if (surgeon.enhanced_data?.pricing?.available) {
      score += 10;
      reasons.push('Transparent pricing available');
      strengths.push('Transparent pricing');
    }
  } else if (priorities.includes('value')) {
    if (surgeon.enhanced_data?.pricing?.available) {
      score += 15;
      reasons.push('Transparent pricing');
    }
  } else if (priorities.includes('premium')) {
    // Premium seekers value experience and ratings
    if (surgeon.rating >= 4.5 && surgeon.review_count >= 50) {
      score += 20;
      reasons.push('Highly rated with many reviews');
      strengths.push(`⭐ ${surgeon.rating.toFixed(1)} rating (${surgeon.review_count} reviews)`);
    }
    if (surgeon.years_experience >= 10) {
      score += 15;
      reasons.push('Very experienced surgeon');
      strengths.push(`${surgeon.years_experience}+ years of experience`);
    }
  }

  // Experience scoring
  if (priorities.includes('very-experienced')) {
    if (surgeon.years_experience >= 10) {
      score += 25;
      reasons.push(`${surgeon.years_experience}+ years of experience`);
      strengths.push(`${surgeon.years_experience}+ years of experience`);
    } else if (surgeon.years_experience >= 5) {
      score += 15;
      reasons.push(`${surgeon.years_experience} years of experience`);
    } else {
      considerations.push(`${surgeon.years_experience} years of experience`);
    }

    if (surgeon.estimated_procedures >= 1000) {
      score += 15;
      reasons.push(`Performed ${surgeon.estimated_procedures}+ procedures`);
      strengths.push(`${surgeon.estimated_procedures}+ procedures performed`);
    }
  } else if (priorities.includes('experienced')) {
    if (surgeon.years_experience >= 5) {
      score += 15;
      reasons.push(`${surgeon.years_experience} years of experience`);
    }
  }

  // Complexity scoring
  if (priorities.includes('complex')) {
    // Complex cases benefit from experience and comprehensive teams
    if (surgeon.years_experience >= 10) {
      score += 20;
      reasons.push('Experienced with complex cases');
    }
    const hasDietitian = surgeon.enhanced_data?.team?.has_dietitian;
    const hasPsychologist = surgeon.enhanced_data?.team?.has_psychologist;
    if (hasDietitian && hasPsychologist) {
      score += 20;
      reasons.push('Has team support for complex cases');
      strengths.push('Multidisciplinary team for complex cases');
    }
  }

  // Telehealth scoring
  if (priorities.includes('required')) {
    if (surgeon.enhanced_data?.services?.telehealth) {
      score += 25;
      reasons.push('Offers telehealth consultations');
      strengths.push('Telehealth/virtual consultations available');
    } else {
      score -= 15;
      considerations.push('Telehealth not available');
    }
  } else if (priorities.includes('preferred')) {
    if (surgeon.enhanced_data?.services?.telehealth) {
      score += 10;
      reasons.push('Offers telehealth');
    }
  }

  // Rating and review boost (always considered)
  if (surgeon.rating >= 4.5 && surgeon.review_count >= 20) {
    score += 15;
    reasons.push('Highly rated by patients');
    strengths.push(`⭐ ${surgeon.rating.toFixed(1)} rating (${surgeon.review_count} reviews)`);
  } else if (surgeon.rating >= 4.0) {
    score += 10;
  }

  // Procedure match
  if (profile.procedure) {
    const procedures = getProcedureList(surgeon.procedures);
    const normalizedProcedure = profile.procedure.toLowerCase().replace(/\s+/g, '-');
    if (procedures.some(p => p.toLowerCase().includes(normalizedProcedure) || normalizedProcedure.includes(p.toLowerCase()))) {
      score += 20;
      reasons.push(`Offers ${profile.procedure}`);
      strengths.push(`Performs ${profile.procedure}`);
    } else {
      considerations.push(`May not offer ${profile.procedure} - verify during consultation`);
    }
  }

  // Support groups
  if (surgeon.enhanced_data?.services?.support_groups) {
    score += 10;
    reasons.push('Offers support groups');
    strengths.push('Patient support groups available');
  }

  // Normalize score to 0-100
  const normalizedScore = Math.min(100, Math.max(0, score));

  return {
    surgeon,
    matchScore: normalizedScore,
    matchReasons: reasons.slice(0, 5), // Top 5 reasons
    strengths: strengths.slice(0, 5), // Top 5 strengths
    considerations: considerations.slice(0, 3), // Top 3 considerations
  };
}

/**
 * Get matched surgeons sorted by match score
 */
export function getMatchedSurgeons(
  surgeons: Surgeon[],
  profile: PatientProfile,
  limit: number = 10
): SurgeonMatch[] {
  const matches = surgeons.map(surgeon => calculateMatchScore(surgeon, profile));
  
  return matches
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

/**
 * Get surgeon categories based on strengths
 */
export function categorizeSurgeon(surgeon: Surgeon): string[] {
  const categories: string[] = [];

  // Support categories
  const hasDietitian = surgeon.enhanced_data?.team?.has_dietitian;
  const hasPsychologist = surgeon.enhanced_data?.team?.has_psychologist;
  const hasNurses = surgeon.enhanced_data?.team?.has_nurses;
  const hasPostOp = surgeon.enhanced_data?.services?.post_op_program;
  const followUp = surgeon.enhanced_data?.services?.follow_up_duration;

  if (hasDietitian && hasPsychologist && hasNurses && hasPostOp) {
    categories.push('Comprehensive Support');
  } else if (hasDietitian || hasPsychologist) {
    categories.push('Team Support');
  }

  if (followUp && (followUp.toLowerCase().includes('ongoing') || followUp.toLowerCase().includes('lifetime'))) {
    categories.push('Long-Term Follow-Up');
  }

  // Experience categories
  if (surgeon.years_experience >= 10 && surgeon.estimated_procedures >= 1000) {
    categories.push('Highly Experienced');
  } else if (surgeon.years_experience >= 5) {
    categories.push('Experienced');
  }

  // Rating categories
  if (surgeon.rating >= 4.5 && surgeon.review_count >= 50) {
    categories.push('Top Rated');
  } else if (surgeon.rating >= 4.0) {
    categories.push('Well Rated');
  }

  // Pricing categories
  const consultation = surgeon.enhanced_data?.pricing?.consultation;
  if (consultation && consultation.toLowerCase().includes('free')) {
    categories.push('Free Consultation');
  }
  if (surgeon.enhanced_data?.pricing?.available) {
    categories.push('Transparent Pricing');
  }

  // Practical categories
  if (surgeon.enhanced_data?.services?.telehealth) {
    categories.push('Telehealth Available');
  }

  if (surgeon.enhanced_data?.services?.support_groups) {
    categories.push('Support Groups');
  }

  return categories;
}

