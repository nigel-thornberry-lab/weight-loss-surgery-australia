/**
 * Canonical URL utility for consistent SEO across all pages
 * Always uses the primary domain: https://bariatricsurgeryhub.com
 */

const SITE_URL = 'https://bariatricsurgeryhub.com';

/**
 * Generate a canonical URL for a given path
 * - Removes trailing slashes
 * - Removes query parameters
 * - Ensures consistent domain
 *
 * @param path - The page path (e.g., "/procedures/gastric-sleeve")
 * @returns Full canonical URL (e.g., "https://bariatricsurgeryhub.com/procedures/gastric-sleeve")
 */
export function getCanonical(path: string): string {
  // Remove query parameters
  const cleanPath = path.split('?')[0];

  // Remove trailing slash (unless it's the root)
  const normalizedPath = cleanPath === '/' ? '/' : cleanPath.replace(/\/$/, '');

  return `${SITE_URL}${normalizedPath}`;
}

/**
 * Get canonical URL from Astro URL object
 * Safe fallback for pages that don't explicitly set a canonical
 *
 * @param astroUrl - The Astro.url object
 * @returns Full canonical URL
 */
export function getCanonicalFromAstroUrl(astroUrl: URL): string {
  return getCanonical(astroUrl.pathname);
}
