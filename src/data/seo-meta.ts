/**
 * SEO Meta Data Configuration
 * Centralized meta titles and descriptions for all pages
 * Optimized for Australian search and conversion intent
 */

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
}

export const seoMeta: Record<string, PageMeta> = {
  // Homepage
  home: {
    title: "Weight Loss Surgery Australia - Compare Gastric Sleeve, Bypass & Costs 2025",
    description: "Compare gastric sleeve, bypass & bariatric surgery in Australia. Transparent pricing $15k-30k, Medicare rebates, qualified surgeons. Book free consultation today.",
    keywords: ["weight loss surgery australia", "gastric sleeve", "gastric bypass", "bariatric surgery", "surgery cost"]
  },

  // Procedures Hub
  procedures: {
    title: "Weight Loss Surgery Procedures in Australia | Compare All Options 2025",
    description: "Compare gastric sleeve, gastric bypass, gastric band and other weight loss surgery procedures in Australia. Transparent pricing, eligibility criteria, and expert guidance.",
    keywords: ["weight loss surgery procedures", "bariatric surgery types", "gastric sleeve vs bypass"]
  },

  // Individual Procedure Pages
  gastricSleeve: {
    title: "Gastric Sleeve Surgery Australia - Cost, Recovery & Results 2025",
    description: "Gastric sleeve surgery in Australia: $15k-25k cost, 60-70% weight loss, 2-3 week recovery. Compare surgeons, Medicare rebates & financing. Book free consultation.",
    keywords: ["gastric sleeve australia", "sleeve gastrectomy", "gastric sleeve cost", "VSG surgery"]
  },

  gastricBypass: {
    title: "Gastric Bypass Surgery Australia - Cost, Procedure & Success Rate 2025",
    description: "Gastric bypass in Australia: $18k-30k cost, 70-80% weight loss, best for diabetes. Compare RYGB surgeons, Medicare coverage & payment plans. Free consultation.",
    keywords: ["gastric bypass australia", "RYGB", "gastric bypass cost", "bypass surgery"]
  },

  miniGastricBypass: {
    title: "Mini Gastric Bypass Australia - Cost, Procedure & Recovery 2025",
    description: "Mini gastric bypass surgery: $16k-27k, 65-75% weight loss, faster recovery than traditional bypass. Find surgeons, costs & eligibility in Australia.",
    keywords: ["mini gastric bypass", "OAGB", "one anastomosis gastric bypass"]
  },

  gastricBand: {
    title: "Gastric Band Surgery Australia - Cost, Removal & Alternatives 2025",
    description: "Gastric band (LAP-BAND) in Australia: $12k-20k, reversible procedure, 40-50% weight loss. Compare to sleeve & bypass. Find surgeons & costs.",
    keywords: ["gastric band", "lap band", "adjustable gastric banding"]
  },

  duodenalSwitch: {
    title: "Duodenal Switch Surgery Australia - Cost, Results & Surgeons 2025",
    description: "Duodenal switch (BPD-DS): $25k-35k, maximum weight loss 70-80%, most complex procedure. Find experienced surgeons in Australia. Free consultation.",
    keywords: ["duodenal switch", "BPD-DS", "biliopancreatic diversion"]
  },

  gastricBalloon: {
    title: "Gastric Balloon Australia - Non-Surgical Weight Loss Cost & Results 2025",
    description: "Gastric balloon: $8k-12k, non-surgical, 10-15% weight loss over 6-12 months. Temporary solution. Compare costs & providers across Australia.",
    keywords: ["gastric balloon", "intragastric balloon", "non surgical weight loss"]
  },

  // Cost Pages (Highest Conversion)
  gastricSleeveCost: {
    title: "Gastric Sleeve Cost Australia 2025 - Prices, Medicare Rebates & Financing",
    description: "Gastric sleeve surgery costs $15,000-$25,000 in Australia. Compare prices by city, Medicare rebates, private health insurance gaps & payment plans. Calculate your cost now.",
    keywords: ["gastric sleeve cost", "how much is gastric sleeve", "gastric sleeve price"]
  },

  gastricBypassCost: {
    title: "Gastric Bypass Cost Australia 2025 - Surgery Prices & Insurance Coverage",
    description: "Gastric bypass surgery costs $18,000-$30,000 in Australia. Get breakdown by surgeon, hospital & city. Medicare rebates, Bupa, Medibank coverage. Free cost calculator.",
    keywords: ["gastric bypass cost", "gastric bypass price", "RYGB cost"]
  },

  weightLossSurgeryCost: {
    title: "Weight Loss Surgery Cost Australia 2025 - Complete Price Guide & Calculator",
    description: "Weight loss surgery costs: Gastric sleeve $15k-25k, Bypass $18k-30k, Band $12k-20k. Compare procedures, Medicare rebates, insurance gaps & financing. Use our calculator.",
    keywords: ["weight loss surgery cost", "bariatric surgery cost", "how much is weight loss surgery"]
  },

  // Location Pages
  sydney: {
    title: "Weight Loss Surgery Sydney - Top Surgeons, Costs & Reviews 2025",
    description: "Weight loss surgery in Sydney: Find AHPRA-registered bariatric surgeons, compare costs, read reviews. Gastric sleeve $15k-25k. Book consultations across Sydney metro.",
    keywords: ["weight loss surgery sydney", "gastric sleeve sydney", "bariatric surgeon sydney"]
  },

  melbourne: {
    title: "Weight Loss Surgery Melbourne - Best Surgeons, Prices & Clinics 2025",
    description: "Melbourne bariatric surgery: Compare top surgeons, costs & clinics. Gastric sleeve, bypass & band options. Medicare rebates available. Free consultations Melbourne-wide.",
    keywords: ["weight loss surgery melbourne", "gastric sleeve melbourne", "bariatric surgeon melbourne"]
  },

  brisbane: {
    title: "Weight Loss Surgery Brisbane - Surgeons, Costs & Hospital Options 2025",
    description: "Weight loss surgery Brisbane: Find qualified surgeons, compare costs, hospital options. Gastric sleeve $15k-25k, bypass $18k-30k. Book free consultation today.",
    keywords: ["weight loss surgery brisbane", "gastric sleeve brisbane", "bariatric surgeon brisbane"]
  },

  perth: {
    title: "Weight Loss Surgery Perth - Compare Surgeons, Costs & Procedures 2025",
    description: "Perth bariatric surgery: Find experienced surgeons, compare procedure costs, read patient reviews. Medicare & private health insurance options. Free consultation.",
    keywords: ["weight loss surgery perth", "gastric sleeve perth", "bariatric surgeon perth"]
  },

  adelaide: {
    title: "Weight Loss Surgery Adelaide - Surgeons, Costs & Hospital Locations 2025",
    description: "Weight loss surgery in Adelaide: Compare bariatric surgeons, costs & procedures. Gastric sleeve, bypass & band options. Medicare rebates available. Book consultation.",
    keywords: ["weight loss surgery adelaide", "gastric sleeve adelaide", "bariatric surgeon adelaide"]
  },

  goldCoast: {
    title: "Weight Loss Surgery Gold Coast - Find Surgeons, Costs & Reviews 2025",
    description: "Gold Coast bariatric surgery: Compare surgeons, costs & patient reviews. Gastric sleeve, bypass & band procedures. Medicare & insurance options. Free consultation.",
    keywords: ["weight loss surgery gold coast", "gastric sleeve gold coast"]
  },

  // Comparison Pages
  sleeveVsBypass: {
    title: "Gastric Sleeve vs Bypass - Which is Better? Compare Surgery Options 2025",
    description: "Gastric sleeve vs bypass comparison: Weight loss (60-70% vs 70-80%), cost ($15-25k vs $18-30k), recovery time, risks & benefits. Take our quiz to find your best option.",
    keywords: ["gastric sleeve vs bypass", "sleeve vs bypass", "which weight loss surgery"]
  },

  bandVsSleeve: {
    title: "Gastric Band vs Sleeve - Compare Cost, Weight Loss & Recovery 2025",
    description: "Gastric band vs sleeve: Compare weight loss results, costs, recovery time & reversibility. Which procedure is right for you? Expert comparison guide.",
    keywords: ["gastric band vs sleeve", "lap band vs sleeve gastrectomy"]
  },

  // Insurance Pages
  medicareCoverage: {
    title: "Medicare Weight Loss Surgery Coverage 2025 - Rebates & Eligibility",
    description: "Medicare covers weight loss surgery with rebates up to $2,000. Eligibility: BMI 40+ or 35+ with conditions. Item numbers, waiting periods & out-of-pocket costs explained.",
    keywords: ["medicare weight loss surgery", "medicare bariatric surgery", "medicare rebate"]
  },

  bupaCoverage: {
    title: "Bupa Weight Loss Surgery Coverage 2025 - Hospital Cover & Gap Costs",
    description: "Bupa covers weight loss surgery with Gold hospital cover. Gap payments $5k-12k, 12-month waiting period. Compare Bupa plans & find participating surgeons.",
    keywords: ["bupa weight loss surgery", "bupa bariatric surgery", "bupa gastric sleeve"]
  },

  medibankCoverage: {
    title: "Medibank Weight Loss Surgery Coverage 2025 - Plans & Out-of-Pocket Costs",
    description: "Medibank covers bariatric surgery with Gold Plus hospital cover. Understand gap fees, waiting periods & Medicare rebates. Compare Medibank plans for surgery.",
    keywords: ["medibank weight loss surgery", "medibank bariatric surgery"]
  },

  hcfCoverage: {
    title: "HCF Weight Loss Surgery Coverage 2025 - Hospital Plans & Gap Payments",
    description: "HCF covers weight loss surgery with Top or Top Plus hospital cover. Gap fees, 12-month wait, Medicare rebates. Find HCF-approved bariatric surgeons.",
    keywords: ["hcf weight loss surgery", "hcf bariatric surgery"]
  },

  // Tools
  costCalculator: {
    title: "Weight Loss Surgery Cost Calculator Australia 2025 - Free Instant Quote",
    description: "Calculate your weight loss surgery cost in 60 seconds. Personalized quote based on procedure, location, insurance & surgeon. Gastric sleeve, bypass & band pricing.",
    keywords: ["weight loss surgery calculator", "gastric sleeve cost calculator", "surgery cost estimator"]
  },

  eligibilityQuiz: {
    title: "Am I Eligible for Weight Loss Surgery? Take Our Free Quiz 2025",
    description: "Take our 2-minute eligibility quiz to find out if you qualify for weight loss surgery. BMI calculator, health conditions & Medicare eligibility assessment. Free & confidential.",
    keywords: ["weight loss surgery eligibility", "bariatric surgery quiz", "am i eligible"]
  },

  bmiCalculator: {
    title: "BMI Calculator for Weight Loss Surgery - Check Your Eligibility 2025",
    description: "Calculate your BMI and weight loss surgery eligibility. BMI 40+ or 35+ with conditions qualifies. Includes recommendations for gastric sleeve, bypass or band.",
    keywords: ["bmi calculator", "weight loss surgery bmi", "bariatric surgery eligibility"]
  },

  // Recovery & Support
  gastricSleeveRecovery: {
    title: "Gastric Sleeve Recovery Timeline - Week by Week Guide Australia 2025",
    description: "Gastric sleeve recovery: Hospital 1-2 nights, return to work 2-3 weeks, full recovery 6 weeks. Diet stages, exercise, complications & what to expect each week.",
    keywords: ["gastric sleeve recovery", "sleeve recovery timeline", "post op gastric sleeve"]
  },

  gastricBypassRecovery: {
    title: "Gastric Bypass Recovery - Complete Timeline & Diet Guide 2025",
    description: "Gastric bypass recovery timeline: 2-3 nights hospital, 4-6 weeks full recovery. Liquid to solid diet progression, vitamin supplements & exercise guidelines.",
    keywords: ["gastric bypass recovery", "RYGB recovery", "post op gastric bypass"]
  },

  // Static Pages
  about: {
    title: "About Weight Loss Surgery Australia - Our Mission & Team 2025",
    description: "Weight Loss Surgery Australia connects patients with AHPRA-registered bariatric surgeons. Transparent pricing, unbiased information, expert guidance. Learn about our mission.",
    keywords: ["about us", "weight loss surgery platform"]
  },

  contact: {
    title: "Contact Us - Weight Loss Surgery Australia | Book Free Consultation",
    description: "Contact Weight Loss Surgery Australia for free consultation. Phone 1300 000 000, email info@wlsaustralia.com.au. Get personalised advice from bariatric surgery experts.",
    keywords: ["contact", "consultation", "book appointment"]
  },

  privacyPolicy: {
    title: "Privacy Policy - Weight Loss Surgery Australia",
    description: "Our privacy policy explains how we collect, use and protect your personal information. GDPR compliant. Your medical information is confidential and secure.",
    keywords: ["privacy policy"]
  },

  termsOfService: {
    title: "Terms of Service - Weight Loss Surgery Australia",
    description: "Terms and conditions for using Weight Loss Surgery Australia website and services. User responsibilities, disclaimers and legal information.",
    keywords: ["terms of service", "terms and conditions"]
  },

  medicalDisclaimer: {
    title: "Medical Disclaimer - Weight Loss Surgery Australia",
    description: "Important medical disclaimer: This website provides educational information only and does not constitute medical advice. Always consult qualified healthcare professionals.",
    keywords: ["medical disclaimer"]
  }
};

// Helper function to get meta data
export function getPageMeta(pageKey: string): PageMeta {
  return seoMeta[pageKey] || seoMeta.home;
}

// Default meta for dynamic pages
export function generateLocationMeta(city: string, state?: string): PageMeta {
  return {
    title: `Weight Loss Surgery ${city} - Top Surgeons, Costs & Reviews 2025`,
    description: `Weight loss surgery in ${city}: Find qualified bariatric surgeons, compare costs, read reviews. Gastric sleeve, bypass & band options. Medicare rebates available. Book consultation.`,
    keywords: [`weight loss surgery ${city.toLowerCase()}`, `gastric sleeve ${city.toLowerCase()}`, `bariatric surgeon ${city.toLowerCase()}`]
  };
}

export function generateProcedureCityMeta(procedure: string, city: string): PageMeta {
  return {
    title: `${procedure} Surgery ${city} - Costs, Surgeons & Reviews 2025`,
    description: `${procedure} surgery in ${city}: Find experienced surgeons, compare costs, read patient reviews. Medicare & private health insurance options. Book free consultation.`,
    keywords: [`${procedure.toLowerCase()} ${city.toLowerCase()}`, `${procedure.toLowerCase()} surgery ${city.toLowerCase()}`]
  };
}
