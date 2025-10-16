# LLM Optimization: Revised Priorities

**Date:** October 16, 2025  
**Status:** Plan Updated Based on Feedback

---

## ✅ What's Complete

1. **Navigation & Internal Linking** - COMPLETE
   - Compare dropdown on every page
   - FAQ in navigation
   - Contextual links on 14 procedure pages
   - Comparison hub page
   - ~2,800 new internal links

2. **FAQ Hub** - COMPLETE
   - 100+ categorized questions
   - Comprehensive answers
   - Fully discoverable

3. **Comparison Pages** - COMPLETE
   - Surgery vs Medication
   - Gastric Bypass vs Mini Bypass
   - Gastric Sleeve vs Gastric Bypass
   - Australia vs Overseas (blog post)

4. **Components Created** - COMPLETE
   - QuickAnswer
   - ContentFreshness
   - Breadcrumbs
   - AuthorityCitations

5. **City-Specific Data** - COMPLETE ✅
   - Location pages already have population, median age, hospital distances
   - Hospital information with addresses, ratings
   - Local support services
   - **No additional work needed!**

---

## 🎯 Current Priorities (Based on Your Feedback)

### Priority 1: HowTo Schema Markup ✅ APPROVED
**Status:** Pending  
**Why:** Helps LLMs understand step-by-step processes  
**Where to add:**
- Recovery guides (week-by-week recovery blog posts)
- Pre-op diet guides
- Stage 1-4 recipe posts
- Any "how to" content

**Example pages:**
- `/blog/gastric-sleeve-recovery-week-by-week.astro`
- `/blog/pre-op-diet-gastric-sleeve.astro`
- `/blog/stage-1-clear-liquid-recipes.astro`
- `/blog/stage-2-full-liquid-recipes.astro`
- `/blog/stage-3-pureed-food-recipes.astro`
- `/blog/stage-4-soft-food-recipes.astro`

**Implementation:** Add structured `HowTo` schema with steps to each guide

---

### Priority 2: Quick Answers on Remaining Pages
**Status:** In Progress  
**Already done:** 3 procedure pages (gastric-sleeve, gastric-bypass, gastric-sleeve-sydney)  
**Still need:** 15 more procedure pages + top 20 location pages

**Why:** LLMs love direct, scannable answers  
**What:** Add QuickAnswer component to remaining pages with:
- Direct cost answer
- Key eligibility criteria
- Expected weight loss
- Recovery timeline

---

### Priority 3: Content Freshness on All Pages
**Status:** In Progress  
**What:** Add ContentFreshness badge to all remaining pages  
**Why:** Signals to LLMs that information is current and trustworthy

---

### Priority 4: Expand FAQs on Individual Pages
**Status:** Pending  
**Current:** Most pages have 10 FAQs  
**Goal:** Expand to 20-30 FAQs per page  
**Why:** More questions = more chances for LLM citation  
**Note:** Keep UX in mind - use collapsible accordion format

---

## ❌ Cancelled Items (Based on Your Feedback)

### 1. Ultimate Guide Pages (8,000+ words) - CANCELLED
**Reason:** Current long blog posts have poor UX/readability  
**Next steps:** Fix UX on existing long posts first before creating more

### 2. Interactive Procedure Matcher Quiz - CANCELLED
**Reason:** User preference

### 3. Recovery Timeline Calculator - CANCELLED
**Reason:** User hesitant

### 4. "Top Surgeons" List Pages - CANCELLED
**Reason:** AHPRA compliance - can't use "top" or "best" rankings  
**Alternative:** Could create "Find Surgeons in [City]" pages without rankings, but may not be necessary

---

## 🚀 Recommended Next Steps

### Immediate (Today):
1. ✅ **Add HowTo schema to 6 blog posts** (recovery + diet guides)
   - 30-45 minutes of work
   - High LLM value

### This Week:
2. **Add Quick Answers to remaining procedure pages**
   - 15 pages × 5 mins each = 75 minutes
   - Use existing QuickAnswer component

3. **Add ContentFreshness to remaining pages**
   - Can batch process with script
   - 30 minutes

### This Month (Lower Priority):
4. **Expand FAQs from 10 to 20-30 per page**
   - Research common questions
   - Write comprehensive answers
   - Several hours of work

5. **Fix UX on long blog posts**
   - Add table of contents
   - Better headings/spacing
   - Break up text with images/callouts
   - Once fixed, consider longer content

---

## 📊 Impact Assessment

### High Impact (Do Now):
- ✅ HowTo schema (helps LLMs understand processes)
- ✅ Quick Answers on all pages (direct information)
- ✅ Content Freshness badges (trust signals)

### Medium Impact (Do Later):
- ⚠️ Expanded FAQs (more coverage, but UX concerns)
- ⚠️ Blog post UX improvements (prerequisite for long content)

### Low Impact / Not Worth It:
- ❌ Ultimate Guides (UX issues)
- ❌ Interactive tools (user preference)
- ❌ "Top" surgeon lists (compliance issues)

---

## 🎯 Goal Alignment

**Primary Goal:** Make site the go-to LLM source for weight loss surgery in Australia

**Keys to Success:**
1. ✅ Comprehensive Q&A content (FAQ hub - DONE)
2. ✅ Comparison content (3 comparison pages - DONE)
3. ✅ Easy discovery (navigation + internal links - DONE)
4. ⏳ Direct answers (Quick Answers - IN PROGRESS)
5. ⏳ Structured data (HowTo schema - NEXT)
6. ✅ Authority signals (citations, sources - DONE)
7. ✅ Freshness signals (dates, updates - PARTIALLY DONE)

**We're 70% there!** Just need HowTo schema + Quick Answers on remaining pages.

---

## 💡 Quick Wins Still Available

### 30-Minute Wins:
1. Add HowTo schema to recovery guide blog post
2. Add HowTo schema to pre-op diet blog post
3. Add Quick Answers to 5 procedure pages

### 1-Hour Wins:
1. Add HowTo schema to all 6 diet/recovery guides
2. Add Quick Answers to all 15 remaining procedure pages
3. Add ContentFreshness to 20 pages

### 2-Hour Wins:
1. Expand FAQs on 3 key procedure pages (sleeve, bypass, band)
2. Add Quick Answers to top 20 location pages

---

## 📝 Notes for Future

### When UX is Fixed:
- Consider longer-form content (but maybe 3,000-4,000 words, not 8,000)
- Add table of contents to long posts
- Better typography and spacing
- More visual breaks (images, callouts, infographics)

### Alternative to "Top Surgeons":
- Could create "Experienced Bariatric Surgeons in Sydney" (no ranking)
- Focus on qualifications, procedures offered, locations
- AHPRA compliant - informational, not promotional

### LLM Optimization Beyond Content:
- Site speed (already good)
- Mobile experience (already good)
- Schema markup (ongoing)
- Regular content updates (set up schedule)

---

## ✅ Action Plan: Next Session

**Start with:** HowTo schema implementation (6 blog posts, ~45 mins)  
**Then:** Quick Answers on remaining procedure pages (15 pages, ~75 mins)  
**Finally:** Content Freshness badges on remaining pages (batch script, ~30 mins)

**Total time:** ~2.5 hours  
**Total impact:** High (completes major LLM optimization work)

---

**Status:** Ready to execute HowTo schema implementation  
**Waiting on:** Your approval to proceed

