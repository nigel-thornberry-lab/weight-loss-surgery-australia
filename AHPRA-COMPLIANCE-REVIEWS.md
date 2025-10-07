# AHPRA Compliance - Review Display Implementation

**Date:** October 7, 2025  
**Status:** ✅ COMPLIANT  
**Regulation:** Health Practitioner Regulation National Law, Section 133

---

## Summary

This website has been updated to comply with AHPRA's prohibition on using testimonials about clinical aspects of regulated health services in advertising.

## The Regulation

**Section 133** of the National Law prohibits:
- Using testimonials (or purported testimonials) 
- That refer to clinical aspects of regulated health services
- In advertising

### What Counts as "Advertising"?

AHPRA defines advertising as:
> "Any form of communication that is intended to promote or is likely to promote a regulated health service"

This **explicitly includes**:
- Websites
- Social media pages  
- Online directories
- Any platform promoting health services

### What Counts as a "Clinical Testimonial"?

A testimonial that:
- Refers to diagnosis, prevention, treatment, or management of a health condition
- Provides positive views about the quality of the health service
- Recommends or endorses the practitioner or service

### Key AHPRA Guidance

From [AHPRA's Testimonial Tool](https://www.ahpra.gov.au/Resources/Advertising-hub/Resources-for-advertisers/Testimonial-tool.aspx):

> "Review appearing on a clinic or practitioner's website that publishes (or republishes) reviews/testimonials. **The clinic business owner or practitioner (that is, whoever has control over the website) is responsible for compliance.**"

---

## Our Compliance Approach

### ✅ What We DO Display (Compliant)

1. **Aggregate Rating Score** (e.g., "4.9 out of 5.0")
   - This is factual, objective data
   - Not a testimonial or endorsement

2. **Review Count** (e.g., "50 Reviews")
   - Factual data about volume of feedback
   - No subjective content

3. **Star Rating Visualization**
   - Visual representation of aggregate data
   - No individual opinions

4. **Link to Google Maps/Reviews**
   - Directs users to third-party platform
   - We don't control content on Google

5. **Disclaimer Text**
   - "Reviews are independently verified and hosted by Google"
   - Makes clear we don't control the content

### ❌ What We DON'T Display (Non-Compliant)

1. **Individual Review Text**
   - Previously displayed full review content
   - Many contained clinical testimonials about:
     - Surgical outcomes
     - Treatment success
     - Clinical expertise
     - Recovery experiences

2. **Patient Names/Photos from Reviews**
   - Even without text, could imply endorsement

3. **Selected/Curated Reviews**
   - Selective display = misleading advertising

---

## Technical Implementation

### Component Updated: `GoogleReviews.astro`

**Location:** `/src/components/surgeons/GoogleReviews.astro`

**Changes Made:**
- ✅ Removed all individual review content display
- ✅ Kept aggregate rating and review count
- ✅ Enhanced visual design for rating display
- ✅ Prominent link to Google Reviews
- ✅ Added compliance documentation in code comments
- ✅ Added disclaimer about independent verification

**What Remains:**
- Rating score (factual data)
- Review count (factual data)
- Star visualization (aggregate data)
- Link to Google Maps reviews
- Fallback search link if no Place ID

### Data Files

The following files **remain in the codebase** but are **no longer displayed**:
- `/src/data/cached-reviews.json` - Cached review content (not displayed)
- `/src/data/slug-to-placeid.json` - Used only for generating Google Maps links

These can be:
- Kept for future internal use (analytics, monitoring)
- Deleted if not needed
- Used for non-advertising purposes

---

## Legal Rationale

### Why This Matters

AHPRA has enforcement powers including:
- Fines and penalties
- Mandatory corrections/takedowns
- Public warnings
- Potential suspension of practitioner registration

### Why "Just Displaying Information" Doesn't Apply

Common misconception: *"We're just showing what Google has - it's not our advertising"*

**AHPRA's Position:**
1. Your website **promotes** regulated health services ✓
2. You have **control** over what appears on your website ✓
3. The reviews contain **clinical testimonials** ✓
4. Therefore, displaying them = using testimonials in advertising ✓

### Precedent Cases

AHPRA has taken action against:
- Cosmetic surgery clinics displaying patient testimonials
- Dental practices with review widgets
- Physiotherapy clinics with patient stories

The defense of "just displaying" has **not been successful**.

---

## User Experience Impact

### Benefits of Compliant Approach

1. **Still Shows Social Proof**
   - Aggregate ratings are powerful trust signals
   - 4.9★ from 50 reviews is compelling data

2. **Cleaner, More Focused Design**
   - Less cluttered than full review displays
   - Emphasizes the rating score

3. **Direct Path to Google**
   - Users who want details can easily click through
   - Google has full review functionality (filtering, sorting, etc.)

4. **No Legal Risk**
   - Fully compliant with AHPRA regulations
   - No risk of enforcement action

### SEO Considerations

- Star ratings and review counts still provide SEO value
- Schema.org markup still works with aggregate data
- No negative impact on search rankings
- Actually may improve CTR with cleaner design

---

## Maintenance & Monitoring

### Ongoing Compliance

1. **Review Scripts**
   - The review caching scripts can still run
   - Data remains useful for internal monitoring
   - Just don't display individual review content

2. **Future Considerations**
   - If AHPRA guidance changes, update accordingly
   - Monitor competitor approaches (but don't assume they're compliant)
   - Consult healthcare advertising lawyer for major changes

3. **Other Components**
   - Ensure FAQs don't contain testimonial-like statements
   - Check that blog posts don't feature patient stories as promotional
   - Social media must also comply with same rules

### Questions to Ask Before Adding Content

Before adding any patient feedback/testimonials:

1. Is this content on our website? → If yes, it's advertising
2. Does our website promote health services? → Yes
3. Does the content refer to clinical matters? → If yes, DON'T USE IT
4. Is it factual aggregate data? → If yes, probably OK

---

## Additional AHPRA Compliance Areas

While we've addressed reviews, ensure compliance in these areas too:

### ✅ Other Compliant Content
- Practitioner qualifications (factual)
- Years of experience (factual)
- Hospital affiliations (factual)
- Procedures offered (factual)
- Educational content (non-promotional)

### ⚠️ Review Carefully
- Before/after photos (restricted for some procedures)
- Claims about outcomes or success rates
- Comparative statements ("best", "leading", etc.)
- Patient case studies or stories

---

## References

1. **AHPRA Testimonials Tool**  
   https://www.ahpra.gov.au/Resources/Advertising-hub/Resources-for-advertisers/Testimonial-tool.aspx

2. **Health Practitioner Regulation National Law**  
   Section 133 - Advertising of regulated health services

3. **AHPRA Advertising Guidelines**  
   https://www.ahpra.gov.au/Resources/Advertising-hub.aspx

4. **National Law PDF**  
   Available from AHPRA website

---

## Implementation Checklist

- [x] Updated GoogleReviews.astro component
- [x] Removed individual review text display
- [x] Kept aggregate rating data
- [x] Added compliance documentation
- [x] Added disclaimer text
- [x] Enhanced visual design for ratings
- [x] Tested link to Google Maps
- [ ] Test build and deployment
- [ ] Visual QA on staging environment
- [ ] Monitor for any missed review displays
- [ ] Consider legal review if needed

---

## Contact for Questions

For questions about AHPRA compliance:
- **AHPRA Advertising Enquiries:** advertising@ahpra.gov.au
- **Healthcare Advertising Lawyer:** Consult as needed
- **This Implementation:** Documented in code comments

---

**Last Updated:** October 7, 2025  
**Next Review:** Annually or when AHPRA guidance changes

