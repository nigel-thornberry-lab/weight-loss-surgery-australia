// Cost Calculator Data - Australian Bariatric Surgery Costs 2025

export interface ProcedureData {
  name: string;
  slug: string;
  description: string;
  icon: string;
  popular?: boolean;
  costs: {
    surgeonFee: [number, number];
    anaesthetist: [number, number];
    hospital: [number, number];
    assistant: [number, number];
    preOp: [number, number];
    total: [number, number];
  };
  medicareRebate: number;
  weightLoss: string;
  recoveryWeeks: number;
  vitaminsYearly: [number, number];
  revisionRisk: string;
}

export interface CityData {
  name: string;
  costMultiplier: number; // Relative to base
  avgSurgeonFee: number;
  avgHospitalCost: number;
}

export interface InsuranceProvider {
  name: string;
  avgBenefit: {
    basic: number;
    bronze: number;
    silver: number;
    gold: number;
  };
}

export interface HealthCondition {
  name: string;
  value: string;
  annualCost: number;
  remissionRate: number; // Percentage who achieve remission
  icon: string;
}

export const procedures: ProcedureData[] = [
  {
    name: 'Gastric Sleeve',
    slug: 'gastric-sleeve',
    description: 'Most popular - 60-70% weight loss',
    icon: '🔵',
    popular: true,
    costs: {
      surgeonFee: [5000, 7000],
      anaesthetist: [1500, 2200],
      hospital: [3000, 4500],
      assistant: [800, 1200],
      preOp: [500, 800],
      total: [15000, 25000]
    },
    medicareRebate: 1500,
    weightLoss: '60-70%',
    recoveryWeeks: 2,
    vitaminsYearly: [300, 500],
    revisionRisk: '5-10%'
  },
  {
    name: 'Gastric Bypass',
    slug: 'gastric-bypass',
    description: 'Best for diabetes - 70-80% weight loss',
    icon: '🟢',
    costs: {
      surgeonFee: [6000, 8500],
      anaesthetist: [1800, 2500],
      hospital: [3500, 5000],
      assistant: [1000, 1500],
      preOp: [600, 900],
      total: [18000, 30000]
    },
    medicareRebate: 1500,
    weightLoss: '70-80%',
    recoveryWeeks: 3,
    vitaminsYearly: [600, 900],
    revisionRisk: '3-5%'
  },
  {
    name: 'Mini Gastric Bypass',
    slug: 'mini-gastric-bypass',
    description: 'Simpler bypass - 65-75% weight loss',
    icon: '🟡',
    costs: {
      surgeonFee: [5500, 7500],
      anaesthetist: [1600, 2300],
      hospital: [3200, 4700],
      assistant: [900, 1300],
      preOp: [550, 850],
      total: [16000, 27000]
    },
    medicareRebate: 1500,
    weightLoss: '65-75%',
    recoveryWeeks: 2.5,
    vitaminsYearly: [500, 700],
    revisionRisk: '4-7%'
  },
  {
    name: 'Gastric Band',
    slug: 'gastric-band',
    description: 'Reversible - 40-50% weight loss',
    icon: '🟠',
    costs: {
      surgeonFee: [4000, 6000],
      anaesthetist: [1200, 1800],
      hospital: [2500, 3500],
      assistant: [700, 1000],
      preOp: [400, 600],
      total: [12000, 20000]
    },
    medicareRebate: 1200,
    weightLoss: '40-50%',
    recoveryWeeks: 1,
    vitaminsYearly: [100, 200],
    revisionRisk: '40-60%'
  },
  {
    name: 'Duodenal Switch',
    slug: 'duodenal-switch',
    description: 'Most complex - 70-80% weight loss',
    icon: '🟣',
    costs: {
      surgeonFee: [8000, 12000],
      anaesthetist: [2500, 3500],
      hospital: [5000, 7000],
      assistant: [1500, 2000],
      preOp: [800, 1200],
      total: [25000, 40000]
    },
    medicareRebate: 1500,
    weightLoss: '70-80%',
    recoveryWeeks: 4,
    vitaminsYearly: [800, 1200],
    revisionRisk: '2-4%'
  }
];

export const cities: CityData[] = [
  {
    name: 'Sydney',
    costMultiplier: 1.0,
    avgSurgeonFee: 6500,
    avgHospitalCost: 4000
  },
  {
    name: 'Melbourne',
    costMultiplier: 0.95,
    avgSurgeonFee: 6000,
    avgHospitalCost: 3800
  },
  {
    name: 'Brisbane',
    costMultiplier: 0.90,
    avgSurgeonFee: 5800,
    avgHospitalCost: 3500
  },
  {
    name: 'Perth',
    costMultiplier: 0.93,
    avgSurgeonFee: 6200,
    avgHospitalCost: 3700
  },
  {
    name: 'Adelaide',
    costMultiplier: 0.85,
    avgSurgeonFee: 5500,
    avgHospitalCost: 3200
  },
  {
    name: 'Gold Coast',
    costMultiplier: 0.88,
    avgSurgeonFee: 5700,
    avgHospitalCost: 3400
  },
  {
    name: 'Canberra',
    costMultiplier: 0.92,
    avgSurgeonFee: 6000,
    avgHospitalCost: 3600
  },
  {
    name: 'Regional/Other',
    costMultiplier: 0.80,
    avgSurgeonFee: 5200,
    avgHospitalCost: 3000
  }
];

export const insuranceProviders: Record<string, InsuranceProvider> = {
  'Bupa': {
    name: 'Bupa',
    avgBenefit: { basic: 2000, bronze: 4000, silver: 6000, gold: 9000 }
  },
  'Medibank': {
    name: 'Medibank',
    avgBenefit: { basic: 2200, bronze: 4200, silver: 6300, gold: 9300 }
  },
  'HCF': {
    name: 'HCF',
    avgBenefit: { basic: 2100, bronze: 4100, silver: 6200, gold: 9200 }
  },
  'NIB': {
    name: 'NIB',
    avgBenefit: { basic: 1900, bronze: 3900, silver: 5900, gold: 8800 }
  },
  'Australian Unity': {
    name: 'Australian Unity',
    avgBenefit: { basic: 2000, bronze: 4000, silver: 6100, gold: 9100 }
  },
  'HBF': {
    name: 'HBF',
    avgBenefit: { basic: 2100, bronze: 4100, silver: 6200, gold: 9200 }
  },
  'AHM': {
    name: 'AHM',
    avgBenefit: { basic: 1800, bronze: 3700, silver: 5700, gold: 8500 }
  },
  'Other': {
    name: 'Other',
    avgBenefit: { basic: 2000, bronze: 4000, silver: 6000, gold: 9000 }
  }
};

export const healthConditions: HealthCondition[] = [
  {
    name: 'Type 2 Diabetes',
    value: 'diabetes',
    annualCost: 3200,
    remissionRate: 75,
    icon: '💉'
  },
  {
    name: 'Sleep Apnoea',
    value: 'sleep-apnoea',
    annualCost: 1200,
    remissionRate: 85,
    icon: '😴'
  },
  {
    name: 'High Blood Pressure',
    value: 'blood-pressure',
    annualCost: 800,
    remissionRate: 60,
    icon: '❤️'
  },
  {
    name: 'GORD/Reflux',
    value: 'gord',
    annualCost: 600,
    remissionRate: 70,
    icon: '🔥'
  },
  {
    name: 'PCOS',
    value: 'pcos',
    annualCost: 900,
    remissionRate: 50,
    icon: '🩺'
  },
  {
    name: 'Heart Disease',
    value: 'heart-disease',
    annualCost: 4000,
    remissionRate: 40,
    icon: '💔'
  },
  {
    name: 'Joint Problems',
    value: 'joint-pain',
    annualCost: 1500,
    remissionRate: 80,
    icon: '🦴'
  }
];

export const bmiRanges = [
  { value: '30-35', label: '30-35 (Eligible)', multiplier: 1.0 },
  { value: '35-40', label: '35-40 (Ideal)', multiplier: 1.0 },
  { value: '40-45', label: '40-45 (Recommended)', multiplier: 1.1 },
  { value: '45-50', label: '45-50 (Priority)', multiplier: 1.2 },
  { value: '50+', label: '50+ (Critical)', multiplier: 1.3 }
];

// Ongoing costs (per year)
export const ongoingCosts = {
  vitamins: [300, 600],
  dietitian: [150, 600],
  surgeonFollowUps: [100, 400],
  bloodTests: [50, 150],
  proteinSupplements: [200, 400]
};

// Hidden costs
export const hiddenCosts = {
  timeOffWork: { min: 1500, max: 4000, description: '2-3 weeks @ avg wage' },
  newWardrobe: { min: 500, max: 2000, description: 'Drop 3-5 clothing sizes' },
  skinRemoval: { min: 8000, max: 25000, description: '30-40% opt for this' },
  childcare: { min: 300, max: 800, description: 'If needed for 2 weeks' },
  travel: { min: 500, max: 2000, description: 'If interstate surgery' }
};

