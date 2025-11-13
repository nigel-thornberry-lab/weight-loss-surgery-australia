/**
 * Surgeon Comparison Data Layer
 * 
 * Provides comparison field definitions, formatting functions, and comparison logic
 * for the Surgeon Comparison Tool.
 */

import type { Surgeon } from './surgeons';
import { getProcedureList, formatPhoneNumber, formatRating } from './surgeons';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ComparisonField {
  label: string;
  key: string;
  type: 'text' | 'number' | 'array' | 'boolean' | 'rating' | 'price' | 'phone' | 'url';
  displayFormat?: (value: any, surgeon?: Surgeon) => string;
  category: string;
  sortable?: boolean;
}

export interface ComparisonCategory {
  title: string;
  icon?: string;
  fields: ComparisonField[];
  expandable?: boolean;
}

export interface ComparisonValue {
  field: ComparisonField;
  values: Array<{ surgeon: Surgeon; value: any; formatted: string }>;
  hasDifferences: boolean;
}

// ============================================================================
// COMPARISON FIELD DEFINITIONS
// ============================================================================

/**
 * Get all comparison categories with their fields
 */
export function getComparisonCategories(): ComparisonCategory[] {
  return [
    {
      title: 'Basic Information',
      icon: '👤',
      fields: [
        {
          label: 'Name',
          key: 'surgeon_name',
          type: 'text',
          category: 'Basic Information',
          displayFormat: (value, surgeon) => surgeon?.surgeon_name || surgeon?.business_name || 'N/A',
        },
        {
          label: 'Qualifications',
          key: 'qualifications',
          type: 'text',
          category: 'Basic Information',
          displayFormat: (value) => value || 'Not specified',
        },
        {
          label: 'Years of Experience',
          key: 'years_experience',
          type: 'number',
          category: 'Basic Information',
          displayFormat: (value) => value ? `${value} years` : 'Not specified',
          sortable: true,
        },
        {
          label: 'Rating',
          key: 'rating',
          type: 'rating',
          category: 'Basic Information',
          displayFormat: (value) => value ? formatRating(value) : 'No rating',
          sortable: true,
        },
        {
          label: 'Review Count',
          key: 'review_count',
          type: 'number',
          category: 'Basic Information',
          displayFormat: (value) => value ? `${value} reviews` : 'No reviews',
          sortable: true,
        },
        {
          label: 'Category',
          key: 'category',
          type: 'text',
          category: 'Basic Information',
          displayFormat: (value) => value || 'Not specified',
        },
      ],
    },
    {
      title: 'Procedures Offered',
      icon: '🏥',
      fields: [
        {
          label: 'Procedures',
          key: 'procedures',
          type: 'array',
          category: 'Procedures Offered',
          displayFormat: (value) => {
            if (!value) return 'Not specified';
            const procedures = getProcedureList(value);
            if (procedures.length === 0) return 'Not specified';
            return procedures
              .map(p => p.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
              .join(', ');
          },
        },
      ],
    },
    {
      title: 'Location & Access',
      icon: '📍',
      fields: [
        {
          label: 'City',
          key: 'city',
          type: 'text',
          category: 'Location & Access',
          displayFormat: (value) => value || 'Not specified',
        },
        {
          label: 'State',
          key: 'state',
          type: 'text',
          category: 'Location & Access',
          displayFormat: (value) => value || 'Not specified',
        },
        {
          label: 'Address',
          key: 'street',
          type: 'text',
          category: 'Location & Access',
          displayFormat: (value, surgeon) => {
            if (!value && !surgeon) return 'Not specified';
            const parts = [value, surgeon?.city, surgeon?.state].filter(Boolean);
            return parts.length > 0 ? parts.join(', ') : 'Not specified';
          },
        },
        {
          label: 'Phone',
          key: 'phone',
          type: 'phone',
          category: 'Location & Access',
          displayFormat: (value) => value ? formatPhoneNumber(value) : 'Not available',
        },
        {
          label: 'Website',
          key: 'website',
          type: 'url',
          category: 'Location & Access',
          displayFormat: (value) => value || 'Not available',
        },
      ],
    },
    {
      title: 'Experience & Credentials',
      icon: '🎓',
      expandable: true,
      fields: [
        {
          label: 'Medical School',
          key: 'enhanced_data.credentials.medical_school',
          type: 'text',
          category: 'Experience & Credentials',
          displayFormat: (value) => value || 'Not specified',
        },
        {
          label: 'Degrees',
          key: 'enhanced_data.credentials.degrees',
          type: 'array',
          category: 'Experience & Credentials',
          displayFormat: (value) => {
            if (!value || !Array.isArray(value)) return 'Not specified';
            return value.join(', ');
          },
        },
        {
          label: 'Fellowships',
          key: 'enhanced_data.credentials.fellowships',
          type: 'array',
          category: 'Experience & Credentials',
          displayFormat: (value) => {
            if (!value || !Array.isArray(value)) return 'Not specified';
            return value.map((f: any) => 
              typeof f === 'string' ? f : `${f.specialty} (${f.institution})`
            ).join(', ');
          },
        },
        {
          label: 'Professional Memberships',
          key: 'enhanced_data.credentials.professional_memberships',
          type: 'array',
          category: 'Experience & Credentials',
          displayFormat: (value) => {
            if (!value || !Array.isArray(value)) return 'Not specified';
            return value.join(', ');
          },
        },
        {
          label: 'Certifications',
          key: 'enhanced_data.credentials.certifications',
          type: 'array',
          category: 'Experience & Credentials',
          displayFormat: (value) => {
            if (!value || !Array.isArray(value)) return 'Not specified';
            return value.join(', ');
          },
        },
      ],
    },
    {
      title: 'Team & Support',
      icon: '👥',
      expandable: true,
      fields: [
        {
          label: 'Has Dietitian',
          key: 'enhanced_data.team.has_dietitian',
          type: 'boolean',
          category: 'Team & Support',
          displayFormat: (value) => value ? 'Yes' : value === false ? 'No' : 'Not specified',
        },
        {
          label: 'Has Psychologist',
          key: 'enhanced_data.team.has_psychologist',
          type: 'boolean',
          category: 'Team & Support',
          displayFormat: (value) => value ? 'Yes' : value === false ? 'No' : 'Not specified',
        },
        {
          label: 'Has Nurse Support',
          key: 'enhanced_data.team.has_nurses',
          type: 'boolean',
          category: 'Team & Support',
          displayFormat: (value) => value ? 'Yes' : value === false ? 'No' : 'Not specified',
        },
        {
          label: 'Team Size',
          key: 'enhanced_data.team.team_size',
          type: 'text',
          category: 'Team & Support',
          displayFormat: (value) => value || 'Not specified',
        },
      ],
    },
    {
      title: 'Services & Programs',
      icon: '🩺',
      expandable: true,
      fields: [
        {
          label: 'Pre-Op Program',
          key: 'enhanced_data.services.pre_op_program',
          type: 'boolean',
          category: 'Services & Programs',
          displayFormat: (value) => value ? 'Yes' : value === false ? 'No' : 'Not specified',
        },
        {
          label: 'Post-Op Program',
          key: 'enhanced_data.services.post_op_program',
          type: 'boolean',
          category: 'Services & Programs',
          displayFormat: (value) => value ? 'Yes' : value === false ? 'No' : 'Not specified',
        },
        {
          label: 'Follow-Up Duration',
          key: 'enhanced_data.services.follow_up_duration',
          type: 'text',
          category: 'Services & Programs',
          displayFormat: (value) => value || 'Not specified',
        },
        {
          label: 'Telehealth Available',
          key: 'enhanced_data.services.telehealth',
          type: 'boolean',
          category: 'Services & Programs',
          displayFormat: (value) => value ? 'Yes' : value === false ? 'No' : 'Not specified',
        },
        {
          label: 'Support Groups',
          key: 'enhanced_data.services.support_groups',
          type: 'boolean',
          category: 'Services & Programs',
          displayFormat: (value) => value ? 'Yes' : value === false ? 'No' : 'Not specified',
        },
      ],
    },
    {
      title: 'Pricing',
      icon: '💰',
      expandable: true,
      fields: [
        {
          label: 'Consultation Fee',
          key: 'enhanced_data.pricing.consultation',
          type: 'price',
          category: 'Pricing',
          displayFormat: (value) => {
            if (!value) return 'Contact for quote';
            if (value === 'Free') return 'Free consultation';
            return value;
          },
        },
        {
          label: 'Gastric Sleeve (Uninsured)',
          key: 'enhanced_data.pricing.gastric_sleeve_uninsured',
          type: 'price',
          category: 'Pricing',
          displayFormat: (value) => value || 'Contact for quote',
        },
        {
          label: 'Gastric Sleeve (With Insurance)',
          key: 'enhanced_data.pricing.gastric_sleeve',
          type: 'price',
          category: 'Pricing',
          displayFormat: (value) => value || 'Contact for quote',
        },
        {
          label: 'Gastric Bypass',
          key: 'enhanced_data.pricing.gastric_bypass',
          type: 'price',
          category: 'Pricing',
          displayFormat: (value) => value || 'Contact for quote',
        },
      ],
    },
    {
      title: 'Hospital Affiliations',
      icon: '🏥',
      expandable: true,
      fields: [
        {
          label: 'Hospitals',
          key: 'enhanced_data.hospitals',
          type: 'array',
          category: 'Hospital Affiliations',
          displayFormat: (value) => {
            if (!value || !Array.isArray(value)) return 'Not specified';
            return value.map((h: any) => 
              typeof h === 'string' ? h : h.name
            ).join(', ');
          },
        },
      ],
    },
  ];
}

/**
 * Get all comparison fields flattened
 */
export function getAllComparisonFields(): ComparisonField[] {
  const categories = getComparisonCategories();
  return categories.flatMap(cat => cat.fields);
}

/**
 * Get a specific field by key
 */
export function getComparisonField(key: string): ComparisonField | undefined {
  return getAllComparisonFields().find(f => f.key === key);
}

// ============================================================================
// VALUE EXTRACTION
// ============================================================================

/**
 * Extract a value from a surgeon object using a dot-notation key
 */
export function extractValue(surgeon: Surgeon, key: string): any {
  if (!key.includes('.')) {
    return (surgeon as any)[key];
  }
  
  const parts = key.split('.');
  let value: any = surgeon;
  
  for (const part of parts) {
    if (value === null || value === undefined) {
      return undefined;
    }
    value = value[part];
  }
  
  return value;
}

/**
 * Format a comparison value using the field's display format
 */
export function formatComparisonValue(
  field: ComparisonField,
  value: any,
  surgeon?: Surgeon
): string {
  if (value === null || value === undefined || value === '') {
    return 'Not available';
  }
  
  if (field.displayFormat) {
    return field.displayFormat(value, surgeon);
  }
  
  // Default formatting based on type
  switch (field.type) {
    case 'array':
      return Array.isArray(value) ? value.join(', ') : String(value);
    case 'boolean':
      return value ? 'Yes' : 'No';
    case 'number':
      return String(value);
    case 'rating':
      return formatRating(value);
    case 'phone':
      return formatPhoneNumber(value);
    default:
      return String(value);
  }
}

// ============================================================================
// COMPARISON LOGIC
// ============================================================================

/**
 * Compare surgeons for a specific field
 */
export function compareSurgeons(
  surgeons: Surgeon[],
  field: ComparisonField
): ComparisonValue {
  const values = surgeons.map(surgeon => {
    const rawValue = extractValue(surgeon, field.key);
    const formatted = formatComparisonValue(field, rawValue, surgeon);
    return { surgeon, value: rawValue, formatted };
  });
  
  // Check for differences
  const hasDifferences = values.some((v, i) => {
    if (i === 0) return false;
    const prev = values[i - 1];
    
    // Normalize for comparison
    const normalize = (val: any) => {
      if (val === null || val === undefined || val === '') return null;
      if (Array.isArray(val)) return val.sort().join('|');
      if (typeof val === 'boolean') return val ? 'true' : 'false';
      return String(val).toLowerCase().trim();
    };
    
    return normalize(v.value) !== normalize(prev.value);
  });
  
  return {
    field,
    values,
    hasDifferences,
  };
}

/**
 * Get all comparison values for a set of surgeons
 */
export function getAllComparisonValues(surgeons: Surgeon[]): ComparisonValue[] {
  const fields = getAllComparisonFields();
  return fields.map(field => compareSurgeons(surgeons, field));
}

/**
 * Get comparison highlights (key differences)
 */
export function getComparisonHighlights(surgeons: Surgeon[]): ComparisonValue[] {
  const allComparisons = getAllComparisonValues(surgeons);
  
  // Filter to only fields with differences
  const differences = allComparisons.filter(c => c.hasDifferences);
  
  // Prioritize important fields
  const importantKeys = [
    'years_experience',
    'rating',
    'review_count',
    'procedures',
    'enhanced_data.pricing.consultation',
    'enhanced_data.team.has_dietitian',
    'enhanced_data.services.pre_op_program',
    'enhanced_data.services.post_op_program',
  ];
  
  const important = differences.filter(c => 
    importantKeys.includes(c.field.key)
  );
  
  const others = differences.filter(c => 
    !importantKeys.includes(c.field.key)
  );
  
  return [...important, ...others].slice(0, 10); // Top 10 differences
}

/**
 * Get comparison summary statistics
 */
export function getComparisonSummary(surgeons: Surgeon[]): {
  avgRating: number;
  avgExperience: number;
  avgReviews: number;
  totalProcedures: Set<string>;
  cities: Set<string>;
} {
  const ratings = surgeons.map(s => s.rating).filter(r => r > 0);
  const experiences = surgeons.map(s => s.years_experience).filter(e => e > 0);
  const reviews = surgeons.map(s => s.review_count).filter(r => r > 0);
  
  const allProcedures = new Set<string>();
  const allCities = new Set<string>();
  
  surgeons.forEach(s => {
    getProcedureList(s.procedures).forEach(p => allProcedures.add(p));
    if (s.city) allCities.add(s.city);
  });
  
  return {
    avgRating: ratings.length > 0 
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : 0,
    avgExperience: experiences.length > 0
      ? Math.round((experiences.reduce((a, b) => a + b, 0) / experiences.length) * 10) / 10
      : 0,
    avgReviews: reviews.length > 0
      ? Math.round(reviews.reduce((a, b) => a + b, 0) / reviews.length)
      : 0,
    totalProcedures: allProcedures,
    cities: allCities,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if a surgeon has enhanced data
 */
export function hasEnhancedData(surgeon: Surgeon): boolean {
  return !!surgeon.enhanced_data && surgeon.enhanced_data.enhanced === true;
}

/**
 * Get procedure display name
 */
export function getProcedureDisplayName(procedure: string): string {
  return procedure
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Validate surgeons for comparison (must have at least 2, max 3)
 */
export function validateSurgeonsForComparison(surgeons: Surgeon[]): {
  valid: boolean;
  error?: string;
} {
  if (surgeons.length < 2) {
    return { valid: false, error: 'Please select at least 2 surgeons to compare' };
  }
  if (surgeons.length > 3) {
    return { valid: false, error: 'You can compare a maximum of 3 surgeons at once' };
  }
  return { valid: true };
}

