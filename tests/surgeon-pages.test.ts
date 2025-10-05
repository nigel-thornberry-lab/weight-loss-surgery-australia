/**
 * Surgeon Pages Test Suite
 * 
 * Tests for surgeon data integrity and validation
 */

import { describe, it, expect } from 'vitest';
import { 
  getAllSurgeons, 
  getSurgeonBySlug,
  getSurgeonsByCity,
  getSurgeonsByProcedure,
  getFeaturedSurgeons,
  searchSurgeons,
  getRelatedSurgeons,
  getAvailableCities,
  getAvailableProcedures,
  getDisplayName
} from '../src/data/surgeons';

describe('Surgeon Data', () => {
  it('should load all surgeons', () => {
    const surgeons = getAllSurgeons();
    expect(surgeons.length).toBeGreaterThan(0);
    expect(surgeons.length).toBe(395); // Expected number of surgeons
  });

  it('should find surgeon by slug', () => {
    const surgeons = getAllSurgeons();
    const firstSurgeon = surgeons[0];
    
    const surgeon = getSurgeonBySlug(firstSurgeon.slug);
    expect(surgeon).toBeDefined();
    expect(surgeon?.slug).toBe(firstSurgeon.slug);
  });

  it('should have valid phone numbers', () => {
    const surgeons = getAllSurgeons();
    surgeons.forEach(surgeon => {
      // Phone should match Australian format
      expect(surgeon.phone).toMatch(/^(\+?61|0)[0-9\s]{8,}$/);
    });
  });

  it('should have valid ratings', () => {
    const surgeons = getAllSurgeons();
    surgeons.forEach(surgeon => {
      expect(surgeon.rating).toBeGreaterThanOrEqual(0);
      expect(surgeon.rating).toBeLessThanOrEqual(5);
    });
  });

  it('should have valid review counts', () => {
    const surgeons = getAllSurgeons();
    surgeons.forEach(surgeon => {
      expect(surgeon.review_count).toBeGreaterThanOrEqual(0);
      expect(typeof surgeon.review_count).toBe('number');
    });
  });

  it('should have required fields', () => {
    const surgeons = getAllSurgeons();
    surgeons.forEach(surgeon => {
      expect(surgeon.slug).toBeDefined();
      expect(surgeon.city).toBeDefined();
      expect(surgeon.state).toBeDefined();
      expect(surgeon.rating).toBeDefined();
      expect(surgeon.phone).toBeDefined();
    });
  });

  it('should have valid slugs (URL-safe)', () => {
    const surgeons = getAllSurgeons();
    surgeons.forEach(surgeon => {
      // Slugs should only contain lowercase letters, numbers, and hyphens
      expect(surgeon.slug).toMatch(/^[a-z0-9-]+$/);
      expect(surgeon.slug).not.toContain(' ');
      expect(surgeon.slug).not.toContain('_');
    });
  });

  it('should have unique slugs', () => {
    const surgeons = getAllSurgeons();
    const slugs = surgeons.map(s => s.slug);
    const uniqueSlugs = new Set(slugs);
    
    expect(slugs.length).toBe(uniqueSlugs.size);
  });

  it('should have valid tier classifications', () => {
    const surgeons = getAllSurgeons();
    surgeons.forEach(surgeon => {
      expect([1, 2, 3]).toContain(surgeon.tier);
    });
  });

  it('should have valid years of experience', () => {
    const surgeons = getAllSurgeons();
    surgeons.forEach(surgeon => {
      expect(surgeon.years_experience).toBeGreaterThanOrEqual(0);
      expect(surgeon.years_experience).toBeLessThanOrEqual(60); // Reasonable max
    });
  });
});

describe('Surgeon Search Functions', () => {
  it('should get surgeons by city', () => {
    const cities = getAvailableCities();
    const firstCity = cities[0].city;
    
    const surgeons = getSurgeonsByCity(firstCity);
    expect(surgeons.length).toBeGreaterThan(0);
    
    surgeons.forEach(surgeon => {
      expect(surgeon.city).toBe(firstCity);
    });
  });

  it('should get surgeons by procedure', () => {
    const procedures = getAvailableProcedures();
    const firstProcedure = procedures[0].procedure;
    
    const surgeons = getSurgeonsByProcedure(firstProcedure);
    expect(surgeons.length).toBeGreaterThan(0);
    
    surgeons.forEach(surgeon => {
      expect(surgeon.procedures.toLowerCase()).toContain(firstProcedure.toLowerCase());
    });
  });

  it('should get featured surgeons', () => {
    const featured = getFeaturedSurgeons();
    expect(featured.length).toBeGreaterThan(0);
    
    featured.forEach(surgeon => {
      expect(surgeon.tier).toBe(1);
    });
  });

  it('should search surgeons', () => {
    const results = searchSurgeons('gastric');
    expect(results.length).toBeGreaterThan(0);
  });

  it('should get related surgeons', () => {
    const surgeons = getAllSurgeons();
    const firstSurgeon = surgeons[0];
    
    const related = getRelatedSurgeons(firstSurgeon, 3);
    expect(related.length).toBeLessThanOrEqual(3);
    
    // Should not include the surgeon itself
    related.forEach(surgeon => {
      expect(surgeon.slug).not.toBe(firstSurgeon.slug);
    });
  });
});

describe('Data Completeness', () => {
  it('should have meta titles for all surgeons', () => {
    const surgeons = getAllSurgeons();
    surgeons.forEach(surgeon => {
      expect(surgeon.meta_title).toBeDefined();
      expect(surgeon.meta_title.length).toBeGreaterThan(0);
      expect(surgeon.meta_title.length).toBeLessThanOrEqual(60); // SEO best practice
    });
  });

  it('should have meta descriptions for all surgeons', () => {
    const surgeons = getAllSurgeons();
    surgeons.forEach(surgeon => {
      expect(surgeon.meta_description).toBeDefined();
      expect(surgeon.meta_description.length).toBeGreaterThan(0);
      expect(surgeon.meta_description.length).toBeLessThanOrEqual(160); // SEO best practice
    });
  });

  it('should have bios for all surgeons', () => {
    const surgeons = getAllSurgeons();
    surgeons.forEach(surgeon => {
      expect(surgeon.bio_long).toBeDefined();
      expect(surgeon.bio_long.length).toBeGreaterThan(100);
    });
  });

  it('should have procedures for all surgeons', () => {
    const surgeons = getAllSurgeons();
    surgeons.forEach(surgeon => {
      expect(surgeon.procedures).toBeDefined();
      expect(surgeon.procedures.length).toBeGreaterThan(0);
    });
  });

  it('should have valid location display', () => {
    const surgeons = getAllSurgeons();
    surgeons.forEach(surgeon => {
      expect(surgeon.location_display).toBeDefined();
      expect(surgeon.location_display).toContain(surgeon.city);
    });
  });
});

describe('Helper Functions', () => {
  it('should get display name correctly', () => {
    const surgeons = getAllSurgeons();
    
    surgeons.forEach(surgeon => {
      const displayName = getDisplayName(surgeon);
      expect(displayName).toBeDefined();
      expect(displayName.length).toBeGreaterThan(0);
    });
  });

  it('should have available cities', () => {
    const cities = getAvailableCities();
    expect(cities.length).toBeGreaterThan(0);
    
    cities.forEach(city => {
      expect(city.city).toBeDefined();
      expect(city.count).toBeGreaterThan(0);
    });
  });

  it('should have available procedures', () => {
    const procedures = getAvailableProcedures();
    expect(procedures.length).toBeGreaterThan(0);
    
    procedures.forEach(proc => {
      expect(proc.procedure).toBeDefined();
      expect(proc.count).toBeGreaterThan(0);
    });
  });
});

describe('Data Quality', () => {
  it('should have valid Australian states', () => {
    const validStates = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];
    const surgeons = getAllSurgeons();
    
    surgeons.forEach(surgeon => {
      expect(validStates).toContain(surgeon.state);
    });
  });

  it('should have valid website URLs', () => {
    const surgeons = getAllSurgeons();
    
    surgeons.forEach(surgeon => {
      if (surgeon.website && surgeon.website !== '') {
        expect(surgeon.website).toMatch(/^https?:\/\/.+/);
      }
    });
  });

  it('should have valid Google Maps URLs', () => {
    const surgeons = getAllSurgeons();
    
    surgeons.forEach(surgeon => {
      if (surgeon.google_maps_url && surgeon.google_maps_url !== '') {
        expect(surgeon.google_maps_url).toContain('google.com/maps');
      }
    });
  });

  it('should have valid priority scores', () => {
    const surgeons = getAllSurgeons();
    
    surgeons.forEach(surgeon => {
      expect(surgeon.priority_score).toBeGreaterThanOrEqual(0);
      expect(surgeon.priority_score).toBeLessThanOrEqual(100);
    });
  });

  it('should have valid estimated procedures', () => {
    const surgeons = getAllSurgeons();
    
    surgeons.forEach(surgeon => {
      expect(surgeon.estimated_procedures).toBeGreaterThanOrEqual(0);
      expect(surgeon.estimated_procedures).toBeLessThanOrEqual(10000); // Reasonable max
    });
  });
});

describe('Data Consistency', () => {
  it('should have consistent data types', () => {
    const surgeons = getAllSurgeons();
    
    surgeons.forEach(surgeon => {
      expect(typeof surgeon.rating).toBe('number');
      expect(typeof surgeon.review_count).toBe('number');
      expect(typeof surgeon.years_experience).toBe('number');
      expect(typeof surgeon.estimated_procedures).toBe('number');
      expect(typeof surgeon.priority_score).toBe('number');
      expect(typeof surgeon.tier).toBe('number');
    });
  });

  it('should have no duplicate surgeon names in same city', () => {
    const surgeons = getAllSurgeons();
    const cityGroups: Record<string, string[]> = {};
    
    surgeons.forEach(surgeon => {
      const city = surgeon.city;
      const name = getDisplayName(surgeon);
      
      if (!cityGroups[city]) {
        cityGroups[city] = [];
      }
      
      cityGroups[city].push(name);
    });
    
    Object.entries(cityGroups).forEach(([city, names]) => {
      const uniqueNames = new Set(names);
      expect(names.length).toBe(uniqueNames.size);
    });
  });

  it('should have ratings consistent with review counts', () => {
    const surgeons = getAllSurgeons();
    
    surgeons.forEach(surgeon => {
      if (surgeon.rating > 0) {
        // If there's a rating, there should be at least 1 review
        expect(surgeon.review_count).toBeGreaterThanOrEqual(1);
      }
    });
  });
});

describe('Performance', () => {
  it('should load surgeons quickly', () => {
    const startTime = performance.now();
    const surgeons = getAllSurgeons();
    const endTime = performance.now();
    
    const loadTime = endTime - startTime;
    
    expect(surgeons.length).toBeGreaterThan(0);
    expect(loadTime).toBeLessThan(100); // Should load in under 100ms
  });

  it('should search surgeons quickly', () => {
    const startTime = performance.now();
    const results = searchSurgeons('sydney');
    const endTime = performance.now();
    
    const searchTime = endTime - startTime;
    
    expect(results.length).toBeGreaterThan(0);
    expect(searchTime).toBeLessThan(50); // Should search in under 50ms
  });
});
