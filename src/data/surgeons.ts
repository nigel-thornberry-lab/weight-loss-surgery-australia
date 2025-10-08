/**
 * Surgeon Data Access Layer
 * 
 * Provides a clean, type-safe interface for accessing surgeon data
 * from the CSV database with filtering, searching, and formatting utilities.
 */

import fs from 'fs';
import path from 'path';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Enhanced data types from Perplexity research
export interface SurgeonCredentials {
  medical_school?: string;
  graduation_year?: string;
  surgical_training?: string;
  fellowships?: Array<{
    specialty: string;
    institution: string;
    year: string;
  }>;
  certifications?: string[];
  years_in_practice?: string;
  procedures_performed?: string;
  degrees?: string[];
  professional_memberships?: string[];
  special_training?: string[];
  years_practicing?: number;
}

export interface SurgeonTeam {
  surgeons?: Array<{ name: string; role: string }>;
  team_size?: string;
  has_dietitian?: boolean;
  has_psychologist?: boolean;
  has_nurses?: boolean;
}

export interface SurgeonServices {
  procedures?: string[];
  pre_op_program?: boolean | string;
  post_op_program?: boolean | string;
  follow_up_duration?: string;
  telehealth?: boolean;
  support_groups?: boolean;
}

export interface SurgeonHospital {
  name: string;
  address?: string;
  verified?: boolean;
}

export interface SurgeonPricing {
  available?: boolean;
  gastric_sleeve?: string;
  gastric_sleeve_uninsured?: string;
  gastric_bypass?: string;
  consultation?: string;
}

export interface SurgeonFAQ {
  q: string;
  a: string;
  question?: string;
  answer?: string;
}

export interface SurgeonEnhancedData {
  credentials?: SurgeonCredentials;
  team?: SurgeonTeam;
  services?: SurgeonServices;
  hospitals?: SurgeonHospital[];
  pricing?: SurgeonPricing;
  unique_features?: string[];
  faqs?: SurgeonFAQ[];
  achievements?: string[];
  teaching?: string[];
  _enhancement_level?: 'full' | 'partial' | 'minimal';
  enhanced?: boolean;
}

export interface Surgeon {
  business_name: string;
  surgeon_name: string;
  qualifications: string;
  procedures: string;
  rating: number;
  review_count: number;
  street: string;
  city: string;
  state: string;
  primary_location: string;
  country: string;
  phone: string;
  phone_original: string;
  website: string;
  category: string;
  google_maps_url: string;
  years_experience: number;
  estimated_procedures: number;
  slug: string;
  meta_title: string;
  meta_description: string;
  priority_score: number;
  tier: 1 | 2 | 3;
  location_display: string;
  bio_long: string;
  // Enhanced data from Perplexity research
  enhanced_data?: SurgeonEnhancedData;
}

export type SurgeonCity = 'Sydney' | 'Melbourne' | 'Other';
export type SurgeonTier = 1 | 2 | 3;
export type ProcedureType = 
  | 'gastric-sleeve' 
  | 'gastric-bypass' 
  | 'gastric-band' 
  | 'mini-gastric-bypass'
  | 'general-bariatric';

// ============================================================================
// PRIVATE HELPERS - CSV PARSING
// ============================================================================

/**
 * Parse a CSV line handling quoted fields with commas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  return result;
}

/**
 * Parse the CSV file into typed Surgeon objects
 */
function parseCSV(filePath: string): Surgeon[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }
  
  const headers = parseCSVLine(lines[0]);
  const surgeons: Surgeon[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    // Skip empty lines
    if (values.length < headers.length) continue;
    
    const surgeon: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index] || '';
      
      // Type conversion based on field
      switch (header) {
        case 'rating':
        case 'priority_score':
          surgeon[header] = parseFloat(value) || 0;
          break;
        case 'review_count':
        case 'years_experience':
        case 'estimated_procedures':
          surgeon[header] = parseInt(value) || 0;
          break;
        case 'tier':
          surgeon[header] = parseInt(value) as 1 | 2 | 3 || 3;
          break;
        default:
          surgeon[header] = value;
      }
    });
    
    surgeons.push(surgeon as Surgeon);
  }
  
  return surgeons;
}

// ============================================================================
// DATA CACHE
// ============================================================================

let surgeonCache: Surgeon[] | null = null;
let enhancedDataCache: Record<string, SurgeonEnhancedData> | null = null;

/**
 * Load enhanced data from consolidated JSON file
 */
function loadEnhancedData(): Record<string, SurgeonEnhancedData> {
  if (enhancedDataCache) {
    return enhancedDataCache;
  }
  
  const enhancedPath = path.join(process.cwd(), 'surgeon-enhanced-data-consolidated.json');
  
  if (fs.existsSync(enhancedPath)) {
    try {
      enhancedDataCache = JSON.parse(fs.readFileSync(enhancedPath, 'utf-8'));
      return enhancedDataCache!;
    } catch (error) {
      console.warn('Failed to load enhanced surgeon data:', error);
      return {};
    }
  }
  
  return {};
}

/**
 * Load and cache surgeon data from CSV, merging with enhanced data
 */
function loadSurgeons(): Surgeon[] {
  if (surgeonCache) {
    return surgeonCache;
  }
  
  // Try multiple possible paths for the CSV file
  const possiblePaths = [
    path.join(process.cwd(), 'surgeons-with-bios.csv'),
    path.join(process.cwd(), 'data', 'surgeons-master-final.csv'),
    path.join(process.cwd(), '..', '..', 'surgeons-with-bios.csv'),
  ];
  
  let baseSurgeons: Surgeon[] = [];
  
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      baseSurgeons = parseCSV(filePath);
      break;
    }
  }
  
  if (baseSurgeons.length === 0) {
    throw new Error('Surgeon data file not found. Please ensure surgeons-with-bios.csv exists in the project root.');
  }
  
  // Load and merge enhanced data
  const enhancedData = loadEnhancedData();
  
  surgeonCache = baseSurgeons.map(surgeon => {
    const enhanced = enhancedData[surgeon.slug];
    if (enhanced) {
      return {
        ...surgeon,
        enhanced_data: enhanced
      };
    }
    return surgeon;
  });
  
  return surgeonCache;
}

// ============================================================================
// PUBLIC API - CORE FUNCTIONS
// ============================================================================

/**
 * Get all surgeons from the database
 * @returns Array of all surgeon records
 */
export function getAllSurgeons(): Surgeon[] {
  return loadSurgeons();
}

/**
 * Find a surgeon by their slug and city
 * @param slug - The URL slug of the surgeon
 * @param city - Optional city to narrow down search (handles duplicate slugs)
 * @returns Surgeon object or null if not found
 */
export function getSurgeonBySlug(slug: string, city?: string): Surgeon | null {
  const surgeons = loadSurgeons();
  
  const matches = surgeons.filter(s => s.slug === slug);
  
  if (matches.length === 0) {
    return null;
  }
  
  // If city provided, find exact match
  if (city) {
    const exactMatch = matches.find(s => 
      s.city.toLowerCase() === city.toLowerCase()
    );
    if (exactMatch) return exactMatch;
  }
  
  // Return first match (or highest priority if multiple)
  return matches.sort((a, b) => b.priority_score - a.priority_score)[0];
}

/**
 * Get all surgeons in a specific city
 * @param city - City name (e.g., 'Sydney', 'Melbourne', 'Richmond')
 * @returns Array of surgeons in that city, sorted by priority score
 */
export function getSurgeonsByCity(city: string): Surgeon[] {
  const surgeons = loadSurgeons();
  const normalizedCity = city.toLowerCase();
  
  return surgeons
    .filter(s => 
      s.city.toLowerCase() === normalizedCity ||
      s.primary_location.toLowerCase() === normalizedCity
    )
    .sort((a, b) => b.priority_score - a.priority_score);
}

/**
 * Get surgeons who offer a specific procedure
 * @param procedure - Procedure type (e.g., 'gastric-sleeve', 'gastric-bypass')
 * @returns Array of surgeons offering that procedure
 */
export function getSurgeonsByProcedure(procedure: string): Surgeon[] {
  const surgeons = loadSurgeons();
  const normalizedProcedure = procedure.toLowerCase();
  
  return surgeons
    .filter(s => {
      const procedures = s.procedures.toLowerCase();
      return procedures.includes(normalizedProcedure) || 
             procedures.includes('general-bariatric');
    })
    .sort((a, b) => b.priority_score - a.priority_score);
}

/**
 * Get top featured surgeons based on priority score
 * @param limit - Maximum number of surgeons to return (default: 10)
 * @returns Array of top surgeons
 */
export function getFeaturedSurgeons(limit: number = 10): Surgeon[] {
  const surgeons = loadSurgeons();
  
  return surgeons
    .filter(s => s.tier <= 2) // Only Tier 1 and 2
    .sort((a, b) => b.priority_score - a.priority_score)
    .slice(0, limit);
}

/**
 * Search surgeons by name, city, or procedures
 * @param query - Search query string
 * @returns Array of matching surgeons
 */
export function searchSurgeons(query: string): Surgeon[] {
  const surgeons = loadSurgeons();
  const normalizedQuery = query.toLowerCase();
  
  return surgeons
    .filter(s => {
      const searchableText = [
        s.surgeon_name,
        s.business_name,
        s.city,
        s.state,
        s.primary_location,
        s.procedures,
        s.category,
        s.qualifications,
      ].join(' ').toLowerCase();
      
      return searchableText.includes(normalizedQuery);
    })
    .sort((a, b) => b.priority_score - a.priority_score);
}

/**
 * Get surgeons related to a given surgeon (same city, similar procedures)
 * @param surgeon - The reference surgeon
 * @param limit - Maximum number of related surgeons (default: 3)
 * @returns Array of related surgeons
 */
export function getRelatedSurgeons(surgeon: Surgeon, limit: number = 3): Surgeon[] {
  const surgeons = loadSurgeons();
  
  return surgeons
    .filter(s => {
      // Exclude the surgeon themselves
      if (s.slug === surgeon.slug) return false;
      
      // Same city or primary location
      const sameLocation = 
        s.city === surgeon.city || 
        s.primary_location === surgeon.primary_location;
      
      // Similar procedures
      const surgeonProcedures = getProcedureList(surgeon.procedures);
      const otherProcedures = getProcedureList(s.procedures);
      const hasCommonProcedure = surgeonProcedures.some(p => 
        otherProcedures.includes(p)
      );
      
      return sameLocation || hasCommonProcedure;
    })
    .sort((a, b) => {
      // Prioritize same city
      const aCityMatch = a.city === surgeon.city ? 1000 : 0;
      const bCityMatch = b.city === surgeon.city ? 1000 : 0;
      
      return (b.priority_score + bCityMatch) - (a.priority_score + aCityMatch);
    })
    .slice(0, limit);
}

/**
 * Get surgeons by quality tier
 * @param tier - Tier level (1 = highest, 3 = lowest)
 * @returns Array of surgeons in that tier
 */
export function getSurgeonsByTier(tier: SurgeonTier): Surgeon[] {
  const surgeons = loadSurgeons();
  
  return surgeons
    .filter(s => s.tier === tier)
    .sort((a, b) => b.priority_score - a.priority_score);
}

// ============================================================================
// PUBLIC API - HELPER FUNCTIONS
// ============================================================================

/**
 * Format phone number for display
 * @param phone - Raw phone number
 * @returns Formatted phone number
 * @example formatPhoneNumber('+61385941897') // '(03) 8594 1897'
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  
  // If already formatted, return as-is
  if (phone.includes('(') || phone.includes(' ')) {
    return phone;
  }
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Australian format
  if (digits.startsWith('61') && digits.length === 11) {
    // +61 3 8594 1897 -> (03) 8594 1897
    return `(0${digits.substring(2, 3)}) ${digits.substring(3, 7)} ${digits.substring(7)}`;
  } else if (digits.length === 10 && digits.startsWith('0')) {
    // 0385941897 -> (03) 8594 1897
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 6)} ${digits.substring(6)}`;
  }
  
  return phone; // Return original if format doesn't match
}

/**
 * Format rating for display with star emoji
 * @param rating - Numeric rating (0-5)
 * @returns Formatted rating string
 * @example formatRating(4.5) // '⭐ 4.5'
 */
export function formatRating(rating: number): string {
  if (!rating || rating === 0) return 'No rating';
  return `⭐ ${rating.toFixed(1)}`;
}

/**
 * Parse procedures string into array
 * @param procedures - Comma or pipe-separated procedures string
 * @returns Array of procedure names
 * @example getProcedureList('gastric-sleeve|gastric-bypass') // ['gastric-sleeve', 'gastric-bypass']
 */
export function getProcedureList(procedures: string): string[] {
  if (!procedures) return [];
  
  return procedures
    .split(/[,|]/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
}

/**
 * Generate URL slug from name
 * @param name - Surgeon or business name
 * @returns URL-safe slug
 * @example generateSlug('Dr. Andrew Huo') // 'dr-andrew-huo'
 */
export function generateSlug(name: string): string {
  if (!name) return '';
  
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')          // Spaces to hyphens
    .replace(/-+/g, '-')           // Multiple hyphens to single
    .replace(/^-|-$/g, '');        // Trim hyphens
}

// ============================================================================
// PUBLIC API - ADVANCED QUERIES
// ============================================================================

/**
 * Get surgeons by location with procedure filter
 * @param city - City name
 * @param procedure - Optional procedure filter
 * @returns Array of filtered surgeons
 */
export function getSurgeonsByCityAndProcedure(
  city: string, 
  procedure?: string
): Surgeon[] {
  let surgeons = getSurgeonsByCity(city);
  
  if (procedure) {
    const normalizedProcedure = procedure.toLowerCase();
    surgeons = surgeons.filter(s => {
      const procedures = s.procedures.toLowerCase();
      return procedures.includes(normalizedProcedure) || 
             procedures.includes('general-bariatric');
    });
  }
  
  return surgeons;
}

/**
 * Get top surgeons by city
 * @param city - City name (e.g., 'Sydney', 'Melbourne')
 * @param limit - Maximum number to return (default: 10)
 * @returns Top surgeons in that city
 */
export function getTopSurgeonsByCity(city: string, limit: number = 10): Surgeon[] {
  return getSurgeonsByCity(city)
    .filter(s => s.tier <= 2) // Only Tier 1 and 2
    .slice(0, limit);
}

/**
 * Get surgeon statistics for a location
 * @param city - City name or 'all' for entire database
 * @returns Statistics object
 */
export function getSurgeonStats(city?: string) {
  let surgeons = city ? getSurgeonsByCity(city) : getAllSurgeons();
  
  if (surgeons.length === 0) {
    return {
      total: 0,
      tier1: 0,
      tier2: 0,
      tier3: 0,
      avgRating: 0,
      avgExperience: 0,
      avgReviews: 0,
      topRated: null,
    };
  }
  
  const tier1Count = surgeons.filter(s => s.tier === 1).length;
  const tier2Count = surgeons.filter(s => s.tier === 2).length;
  const tier3Count = surgeons.filter(s => s.tier === 3).length;
  
  const avgRating = surgeons.reduce((sum, s) => sum + s.rating, 0) / surgeons.length;
  const avgExperience = surgeons.reduce((sum, s) => sum + s.years_experience, 0) / surgeons.length;
  const avgReviews = surgeons.reduce((sum, s) => sum + s.review_count, 0) / surgeons.length;
  
  const topRated = surgeons
    .filter(s => s.review_count >= 20) // Minimum reviews for credibility
    .sort((a, b) => b.rating - a.rating)[0] || null;
  
  return {
    total: surgeons.length,
    tier1: tier1Count,
    tier2: tier2Count,
    tier3: tier3Count,
    avgRating: Math.round(avgRating * 10) / 10,
    avgExperience: Math.round(avgExperience * 10) / 10,
    avgReviews: Math.round(avgReviews),
    topRated,
  };
}

/**
 * Get available cities with surgeon counts
 * @returns Array of cities with counts
 */
export function getAvailableCities(): Array<{ city: string; count: number }> {
  const surgeons = getAllSurgeons();
  const cityMap = new Map<string, number>();
  
  surgeons.forEach(s => {
    const city = s.city || s.primary_location;
    cityMap.set(city, (cityMap.get(city) || 0) + 1);
  });
  
  return Array.from(cityMap.entries())
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get available procedures with surgeon counts
 * @returns Array of procedures with counts
 */
export function getAvailableProcedures(): Array<{ procedure: string; count: number }> {
  const surgeons = getAllSurgeons();
  const procedureMap = new Map<string, number>();
  
  surgeons.forEach(s => {
    const procedures = getProcedureList(s.procedures);
    procedures.forEach(proc => {
      procedureMap.set(proc, (procedureMap.get(proc) || 0) + 1);
    });
  });
  
  return Array.from(procedureMap.entries())
    .map(([procedure, count]) => ({ procedure, count }))
    .filter(p => p.procedure !== '') // Remove empty entries
    .sort((a, b) => b.count - a.count);
}

// ============================================================================
// PUBLIC API - VALIDATION
// ============================================================================

/**
 * Check if a surgeon has complete profile data
 * @param surgeon - Surgeon to validate
 * @returns True if profile is complete
 */
export function hasCompleteProfile(surgeon: Surgeon): boolean {
  return !!(
    surgeon.surgeon_name &&
    surgeon.city &&
    surgeon.state &&
    surgeon.phone &&
    surgeon.rating &&
    surgeon.review_count > 0 &&
    surgeon.bio_long &&
    surgeon.years_experience > 0
  );
}

/**
 * Check if a surgeon is high quality (Tier 1 or 2)
 * @param surgeon - Surgeon to check
 * @returns True if high quality
 */
export function isHighQuality(surgeon: Surgeon): boolean {
  return surgeon.tier <= 2 && 
         surgeon.rating >= 4.0 && 
         surgeon.review_count >= 10;
}

/**
 * Get the display name for a surgeon (prefers surgeon_name over business_name)
 * @param surgeon - Surgeon object
 * @returns Display name
 */
export function getDisplayName(surgeon: Surgeon): string {
  return surgeon.surgeon_name || surgeon.business_name || 'Unknown Surgeon';
}

// ============================================================================
// EXPORTS FOR STATIC SITE GENERATION
// ============================================================================

/**
 * Get all unique slugs for static path generation
 * @returns Array of unique slugs
 */
export function getAllSurgeonSlugs(): string[] {
  const surgeons = getAllSurgeons();
  return [...new Set(surgeons.map(s => s.slug))];
}

/**
 * Get slug/city combinations for pages with duplicate slugs
 * @returns Array of { slug, city } objects
 */
export function getAllSurgeonPaths(): Array<{ slug: string; city: string }> {
  const surgeons = getAllSurgeons();
  return surgeons.map(s => ({
    slug: s.slug,
    city: s.city,
  }));
}
