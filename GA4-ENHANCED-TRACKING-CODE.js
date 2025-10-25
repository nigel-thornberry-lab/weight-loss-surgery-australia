/**
 * Enhanced GA4 Tracking Code for Weight Loss Surgery Website
 * Measurement ID: G-GGQF9749LT
 * 
 * This file contains all the enhanced tracking code to be added to your website
 * for comprehensive analytics tracking.
 */

// ============================================================================
// ENHANCED GA4 CONFIGURATION
// ============================================================================

// Enhanced GA4 Configuration with custom parameters
function initializeEnhancedGA4() {
  gtag('config', 'G-GGQF9749LT', {
    'send_page_view': true,
    'anonymize_ip': true,
    'allow_google_signals': true,
    'allow_ad_personalization_signals': false,
    'cookie_flags': 'SameSite=None;Secure',
    
    // Enhanced Ecommerce for Lead Tracking
    'enhanced_measurement': {
      'scrolls': true,
      'outbound_clicks': true,
      'site_search': true,
      'video_engagement': true,
      'file_downloads': true
    },
    
    // Custom Parameters for better tracking
    'custom_map': {
      'custom_parameter_1': 'page_category',
      'custom_parameter_2': 'content_type',
      'custom_parameter_3': 'target_keyword',
      'custom_parameter_4': 'lead_source'
    }
  });
}

// ============================================================================
// CUSTOM DIMENSIONS HELPER FUNCTIONS
// ============================================================================

// Get page category based on URL
function getPageCategory() {
  const path = window.location.pathname;
  
  if (path.includes('/procedures/')) return 'procedures';
  if (path.includes('/surgeons/')) return 'surgeons';
  if (path.includes('/costs/')) return 'costs';
  if (path.includes('/locations/')) return 'locations';
  if (path.includes('/blog/')) return 'blog';
  if (path.includes('/compare/')) return 'compare';
  if (path === '/') return 'homepage';
  if (path === '/contact') return 'contact';
  if (path === '/cost-calculator') return 'cost-calculator';
  
  return 'other';
}

// Get content type based on page structure
function getContentType() {
  const path = window.location.pathname;
  
  if (path.includes('/surgeons/') && path.split('/').length > 3) return 'surgeon-profile';
  if (path.includes('/blog/')) return 'blog-post';
  if (path.includes('/procedures/')) return 'procedure-page';
  if (path.includes('/costs/')) return 'cost-page';
  if (path.includes('/locations/')) return 'location-page';
  if (path === '/') return 'homepage';
  
  return 'landing-page';
}

// Get target keyword for the page
function getTargetKeyword() {
  const path = window.location.pathname;
  const title = document.title.toLowerCase();
  
  // Extract keywords from URL and title
  if (path.includes('gastric-sleeve')) return 'gastric sleeve';
  if (path.includes('gastric-bypass')) return 'gastric bypass';
  if (path.includes('gastric-band')) return 'gastric band';
  if (path.includes('weight-loss-surgery')) return 'weight loss surgery';
  if (path.includes('bariatric-surgery')) return 'bariatric surgery';
  if (path.includes('sydney')) return 'weight loss surgery sydney';
  if (path.includes('melbourne')) return 'weight loss surgery melbourne';
  
  return 'weight loss surgery australia';
}

// Get lead source from form or page context
function getLeadSource() {
  // Check if we're on a specific form page
  const path = window.location.pathname;
  if (path === '/contact') return 'contact-page';
  if (path === '/am-i-ready') return 'readiness-quiz';
  if (path.includes('/surgeons/')) return 'surgeon-profile';
  if (path.includes('/costs/')) return 'cost-page';
  if (path.includes('/blog/')) return 'blog-post';
  
  return 'general';
}

// ============================================================================
// LEAD GENERATION TRACKING
// ============================================================================

// Newsletter Form Tracking
function trackNewsletterSignup(source = 'unknown') {
  gtag('event', 'newsletter_signup', {
    'event_category': 'Lead Generation',
    'event_label': source,
    'value': 1,
    'page_category': getPageCategory(),
    'content_type': getContentType(),
    'target_keyword': getTargetKeyword(),
    'lead_source': source
  });
}

// Consultation Form Tracking
function trackConsultationRequest(surgeon = 'general', source = 'unknown') {
  gtag('event', 'consultation_request', {
    'event_category': 'Lead Generation',
    'event_label': surgeon,
    'value': 5,
    'page_category': getPageCategory(),
    'content_type': getContentType(),
    'target_keyword': getTargetKeyword(),
    'lead_source': source,
    'surgeon_name': surgeon
  });
}

// Cost Calculator Tracking
function trackCostCalculatorComplete(procedure = 'unknown') {
  gtag('event', 'cost_calculator_complete', {
    'event_category': 'Lead Generation',
    'event_label': procedure,
    'value': 3,
    'page_category': 'cost-calculator',
    'content_type': 'cost-calculator',
    'target_keyword': 'cost calculator',
    'lead_source': 'cost-calculator',
    'procedure_type': procedure
  });
}

// Surgeon Profile View Tracking
function trackSurgeonProfileView(surgeonName, location) {
  gtag('event', 'surgeon_profile_view', {
    'event_category': 'Lead Generation',
    'event_label': surgeonName,
    'value': 2,
    'page_category': 'surgeons',
    'content_type': 'surgeon-profile',
    'target_keyword': surgeonName + ' ' + location,
    'lead_source': 'surgeon-profile',
    'surgeon_name': surgeonName,
    'location': location
  });
}

// Phone Number Click Tracking
function trackPhoneClick(source = 'unknown') {
  gtag('event', 'phone_click', {
    'event_category': 'Lead Generation',
    'event_label': source,
    'value': 4,
    'page_category': getPageCategory(),
    'content_type': getContentType(),
    'target_keyword': getTargetKeyword(),
    'lead_source': source
  });
}

// ============================================================================
// USER JOURNEY TRACKING
// ============================================================================

// Enhanced page view tracking
function trackEnhancedPageView() {
  gtag('event', 'page_view', {
    'page_title': document.title,
    'page_location': window.location.href,
    'page_category': getPageCategory(),
    'content_type': getContentType(),
    'target_keyword': getTargetKeyword(),
    'lead_source': getLeadSource()
  });
}

// User engagement tracking
function trackUserEngagement(action, details = {}) {
  gtag('event', 'user_engagement', {
    'event_category': 'User Behavior',
    'event_label': action,
    'value': 1,
    'page_category': getPageCategory(),
    'content_type': getContentType(),
    'target_keyword': getTargetKeyword(),
    'engagement_action': action,
    ...details
  });
}

// ============================================================================
// A/B TESTING TRACKING
// ============================================================================

// Track A/B test views
function trackABTestView(experimentId, variantId) {
  gtag('event', 'ab_test_view', {
    'event_category': 'A/B Testing',
    'event_label': experimentId,
    'value': 1,
    'experiment_id': experimentId,
    'variant_id': variantId,
    'page_category': getPageCategory(),
    'content_type': getContentType()
  });
}

// Track A/B test conversions
function trackABTestConversion(experimentId, variantId, conversionType) {
  gtag('event', 'ab_test_conversion', {
    'event_category': 'A/B Testing',
    'event_label': experimentId,
    'value': 1,
    'experiment_id': experimentId,
    'variant_id': variantId,
    'conversion_type': conversionType,
    'page_category': getPageCategory(),
    'content_type': getContentType()
  });
}

// ============================================================================
// REVENUE TRACKING (Lead Value)
// ============================================================================

// Track lead value as revenue
function trackLeadValue(leadType, value, source = 'unknown') {
  gtag('event', 'purchase', {
    'transaction_id': 'lead_' + Date.now(),
    'value': value,
    'currency': 'AUD',
    'items': [{
      'item_id': leadType,
      'item_name': leadType.replace('_', ' ').toUpperCase(),
      'category': 'Lead Generation',
      'quantity': 1,
      'price': value
    }],
    'page_category': getPageCategory(),
    'content_type': getContentType(),
    'target_keyword': getTargetKeyword(),
    'lead_source': source
  });
}

// ============================================================================
// FORM TRACKING AUTOMATION
// ============================================================================

// Auto-track form submissions
function initializeFormTracking() {
  // Newsletter forms
  const newsletterForms = document.querySelectorAll('[data-form-type="newsletter"]');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const source = form.dataset.source || getLeadSource();
      trackNewsletterSignup(source);
    });
  });

  // Consultation forms
  const consultationForms = document.querySelectorAll('[data-form-type="consultation"]');
  consultationForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const surgeon = form.dataset.surgeon || 'general';
      const source = form.dataset.source || getLeadSource();
      trackConsultationRequest(surgeon, source);
      
      // Track lead value
      trackLeadValue('consultation_request', 5, source);
    });
  });

  // Cost calculator
  const costCalculator = document.getElementById('cost-calculator');
  if (costCalculator) {
    costCalculator.addEventListener('submit', function(e) {
      const procedure = costCalculator.dataset.procedure || 'unknown';
      trackCostCalculatorComplete(procedure);
      
      // Track lead value
      trackLeadValue('cost_calculator_complete', 3, 'cost-calculator');
    });
  }
}

// ============================================================================
// PHONE NUMBER TRACKING
// ============================================================================

// Auto-track phone number clicks
function initializePhoneTracking() {
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach(link => {
    link.addEventListener('click', function() {
      const source = link.dataset.source || getLeadSource();
      trackPhoneClick(source);
      
      // Track lead value
      trackLeadValue('phone_click', 4, source);
    });
  });
}

// ============================================================================
// SURGEON PROFILE TRACKING
// ============================================================================

// Auto-track surgeon profile views
function initializeSurgeonTracking() {
  const surgeonProfiles = document.querySelectorAll('[data-surgeon-profile]');
  surgeonProfiles.forEach(profile => {
    const surgeonName = profile.dataset.surgeonName || 'Unknown';
    const location = profile.dataset.location || 'Unknown';
    
    // Track profile view
    trackSurgeonProfileView(surgeonName, location);
  });
}

// ============================================================================
// SCROLL DEPTH TRACKING
// ============================================================================

// Track scroll depth for engagement
function initializeScrollTracking() {
  let maxScroll = 0;
  const scrollThresholds = [25, 50, 75, 90, 100];
  const triggeredThresholds = new Set();

  window.addEventListener('scroll', function() {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      
      scrollThresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !triggeredThresholds.has(threshold)) {
          triggeredThresholds.add(threshold);
          trackUserEngagement('scroll_depth', {
            'scroll_percentage': threshold,
            'page_category': getPageCategory(),
            'content_type': getContentType()
          });
        }
      });
    }
  });
}

// ============================================================================
// TIME ON PAGE TRACKING
// ============================================================================

// Track time spent on page
function initializeTimeTracking() {
  const startTime = Date.now();
  const timeThresholds = [30, 60, 120, 300]; // 30s, 1m, 2m, 5m
  const triggeredTimes = new Set();

  setInterval(() => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    
    timeThresholds.forEach(threshold => {
      if (timeSpent >= threshold && !triggeredTimes.has(threshold)) {
        triggeredTimes.add(threshold);
        trackUserEngagement('time_on_page', {
          'time_seconds': threshold,
          'page_category': getPageCategory(),
          'content_type': getContentType()
        });
      }
    });
  }, 1000);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize all tracking when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize enhanced GA4
  initializeEnhancedGA4();
  
  // Initialize all tracking
  initializeFormTracking();
  initializePhoneTracking();
  initializeSurgeonTracking();
  initializeScrollTracking();
  initializeTimeTracking();
  
  // Track initial page view
  trackEnhancedPageView();
  
  console.log('Enhanced GA4 tracking initialized');
});

// ============================================================================
// EXPORT FUNCTIONS FOR MANUAL USE
// ============================================================================

// Export functions for manual tracking
window.GA4Tracking = {
  trackNewsletterSignup,
  trackConsultationRequest,
  trackCostCalculatorComplete,
  trackSurgeonProfileView,
  trackPhoneClick,
  trackUserEngagement,
  trackABTestView,
  trackABTestConversion,
  trackLeadValue,
  getPageCategory,
  getContentType,
  getTargetKeyword,
  getLeadSource
};
