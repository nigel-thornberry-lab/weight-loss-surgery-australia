/**
 * Enhanced Schema.org Markup Template for Surgeon Pages
 * This template adds the missing schema types to capture more SERP real estate
 */

// 1. ORGANIZATION SCHEMA - Establishes site authority
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  "@id": "https://weightlosssurgery.com.au/#organization",
  "name": "Weight Loss Surgery Australia",
  "alternateName": "WLSA",
  "url": "https://weightlosssurgery.com.au",
  "logo": {
    "@type": "ImageObject",
    "url": "https://weightlosssurgery.com.au/logo.png",
    "width": 600,
    "height": 60
  },
  "description": "Australia's leading directory of qualified bariatric surgeons specializing in weight loss surgery including gastric sleeve, bypass, and band procedures.",
  "sameAs": [
    // Add your social media profiles here
    "https://www.facebook.com/weightlosssurgeryaustralia",
    "https://www.linkedin.com/company/weightlosssurgeryaustralia"
  ],
  "medicalSpecialty": "Bariatric Surgery",
  "areaServed": [
    {
      "@type": "Country",
      "name": "Australia"
    },
    {
      "@type": "State",
      "name": "New South Wales"
    },
    {
      "@type": "State",
      "name": "Victoria"
    }
  ]
};

// 2. ENHANCED PHYSICIAN SCHEMA with more detail
function createEnhancedPhysicianSchema(surgeonData, enhanced) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": surgeonData.name,
    "image": surgeonData.surgeon_photo ? {
      "@type": "ImageObject",
      "url": `https://weightlosssurgery.com.au${surgeonData.surgeon_photo}`,
      "width": 800,
      "height": 1000,
      "caption": `${surgeonData.name} - Bariatric Surgeon`,
      "description": `Professional photo of ${surgeonData.name}`
    } : undefined,
    "url": surgeonData.canonicalUrl,
    "telephone": surgeonData.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": surgeonData.street,
      "addressLocality": surgeonData.city,
      "addressRegion": surgeonData.state,
      "postalCode": surgeonData.postalCode || "",
      "addressCountry": "AU"
    },
    "medicalSpecialty": ["Bariatric Surgery", "Weight Loss Surgery", "General Surgery"],

    // Add credentials
    "hasCredential": enhanced?.credentials?.fellowships?.map(fellowship => ({
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Fellowship",
      "name": fellowship
    })),

    // Add education
    "alumniOf": enhanced?.credentials?.medical_school ? {
      "@type": "EducationalOrganization",
      "name": enhanced.credentials.medical_school
    } : undefined,

    // Add years of experience
    "yearsOfExperience": enhanced?.credentials?.years_practicing || surgeonData.years_experience,

    // Add member organizations
    "memberOf": enhanced?.credentials?.professional_memberships?.map(org => ({
      "@type": "Organization",
      "name": org
    })),

    // Add procedures offered
    "availableService": [
      {
        "@type": "MedicalProcedure",
        "name": "Gastric Sleeve Surgery",
        "alternateName": ["Sleeve Gastrectomy", "VSG"]
      },
      {
        "@type": "MedicalProcedure",
        "name": "Gastric Bypass Surgery",
        "alternateName": ["Roux-en-Y Gastric Bypass", "RYGB"]
      },
      {
        "@type": "MedicalProcedure",
        "name": "Gastric Band Surgery",
        "alternateName": ["Lap Band", "Adjustable Gastric Band"]
      },
      {
        "@type": "MedicalProcedure",
        "name": "Revision Bariatric Surgery"
      }
    ],

    // Add hospitals as worksFor
    "worksFor": enhanced?.hospitals?.map(hospital => ({
      "@type": "Hospital",
      "name": hospital.name,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": hospital.address || "",
        "addressCountry": "AU"
      }
    })),

    // Add aggregate rating
    "aggregateRating": surgeonData.rating > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": surgeonData.rating,
      "reviewCount": surgeonData.review_count,
      "bestRating": 5,
      "worstRating": 1
    } : undefined,

    // Add pricing info if available
    "priceRange": enhanced?.pricing?.available ? "$$$$" : undefined,

    // Add offers
    "makesOffer": enhanced?.pricing?.consultation ? {
      "@type": "Offer",
      "name": "Initial Consultation",
      "price": enhanced.pricing.consultation === "Free" ? "0" : undefined,
      "priceCurrency": "AUD"
    } : undefined
  };

  // Remove undefined values
  return JSON.parse(JSON.stringify(schema));
}

// 3. MEDICAL BUSINESS SCHEMA for each surgeon's practice
function createMedicalBusinessSchema(surgeonData, enhanced) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": `${surgeonData.name} - Bariatric Surgery Practice`,
    "image": surgeonData.surgeon_photo ? `https://weightlosssurgery.com.au${surgeonData.surgeon_photo}` : undefined,
    "telephone": surgeonData.phone,
    "url": surgeonData.website,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": surgeonData.street,
      "addressLocality": surgeonData.city,
      "addressRegion": surgeonData.state,
      "addressCountry": "AU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": surgeonData.latitude, // Add if available
      "longitude": surgeonData.longitude // Add if available
    },
    "priceRange": "$$$$",
    "paymentAccepted": ["Cash", "Credit Card", "Medicare", "Private Health Insurance"],
    "currenciesAccepted": "AUD",
    "openingHours": "Mo-Fr 09:00-17:00", // Adjust as needed
    "medicalSpecialty": "Bariatric Surgery",
    "aggregateRating": surgeonData.rating > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": surgeonData.rating,
      "reviewCount": surgeonData.review_count,
      "bestRating": 5
    } : undefined
  };
}

// 4. INDIVIDUAL REVIEW SCHEMA (enhances aggregate rating)
function createReviewSchema(surgeonData, reviews) {
  if (!reviews || reviews.length === 0) return null;

  return reviews.slice(0, 5).map(review => ({ // Limit to top 5 reviews
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Physician",
      "name": surgeonData.name
    },
    "author": {
      "@type": "Person",
      "name": review.author_name
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating,
      "bestRating": 5,
      "worstRating": 1
    },
    "reviewBody": review.text,
    "datePublished": review.time
  }));
}

// 5. HOWTO SCHEMA for procedure preparation/recovery
function createHowToSchema(procedureName, city) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Prepare for ${procedureName} Surgery in ${city}`,
    "description": `Step-by-step preparation guide for ${procedureName} surgery`,
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Initial Consultation",
        "text": "Schedule and attend initial consultation with your bariatric surgeon",
        "url": "#consultation"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Medical Assessment",
        "text": "Complete required medical tests and assessments including blood work, ECG, and psychological evaluation",
        "url": "#assessment"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Pre-operative Diet",
        "text": "Follow prescribed pre-operative diet (usually 2 weeks of low-calorie, high-protein meals)",
        "url": "#diet"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Surgery Day",
        "text": "Arrive at hospital for surgery (typically 1-2 hour procedure under general anesthesia)",
        "url": "#surgery"
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Recovery and Follow-up",
        "text": "Hospital stay 1-2 nights, then follow post-operative diet progression and attend follow-up appointments",
        "url": "#recovery"
      }
    ],
    "totalTime": "P8W" // 8 weeks total timeline
  };
}

// 6. WEBSITE SCHEMA (connects everything)
function createWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://weightlosssurgery.com.au/#website",
    "url": "https://weightlosssurgery.com.au",
    "name": "Weight Loss Surgery Australia",
    "description": "Find qualified bariatric surgeons in Australia for gastric sleeve, bypass, and band procedures",
    "publisher": {
      "@id": "https://weightlosssurgery.com.au/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://weightlosssurgery.com.au/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
}

// 7. COMPLETE SCHEMA GRAPH (recommended approach)
function createCompleteSchemaGraph(surgeonData, enhanced, reviews = []) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      createWebSiteSchema(),
      organizationSchema,
      createEnhancedPhysicianSchema(surgeonData, enhanced),
      createMedicalBusinessSchema(surgeonData, enhanced),
      // Breadcrumb schema (keep existing),
      // FAQ schema (keep existing),
      ...createReviewSchema(surgeonData, reviews) || []
    ]
  };
}

export {
  organizationSchema,
  createEnhancedPhysicianSchema,
  createMedicalBusinessSchema,
  createReviewSchema,
  createHowToSchema,
  createWebSiteSchema,
  createCompleteSchemaGraph
};
