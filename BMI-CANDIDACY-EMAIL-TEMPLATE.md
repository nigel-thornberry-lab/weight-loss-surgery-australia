# BMI Candidacy Report - Email Template

## Email Configuration

**Subject Line:** Your Weight Loss Surgery Candidacy Report (BMI: {{BMI}})

**From:** Weight Loss Surgery Australia <hello@weightlosssurgery.com.au>

**Reply-To:** hello@weightlosssurgery.com.au

---

## Email Body (HTML Template)

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 3px solid #3b82f6;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
        }
        .bmi-badge {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 8px;
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
        }
        .section {
            margin: 30px 0;
            padding: 20px;
            background-color: #f9fafb;
            border-left: 4px solid #3b82f6;
            border-radius: 4px;
        }
        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 15px;
        }
        .checklist {
            list-style: none;
            padding: 0;
        }
        .checklist li {
            padding: 8px 0;
            padding-left: 30px;
            position: relative;
        }
        .checklist li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: bold;
            font-size: 18px;
        }
        .warning-box {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 10px 0;
            text-align: center;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
        }
        .disclaimer {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 20px;
            padding: 15px;
            background-color: #f9fafb;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Weight Loss Surgery Australia</div>
            <p style="color: #6b7280; margin: 0;">Your Personalized Candidacy Report</p>
        </div>

        <p>Hi {{NAME}},</p>

        <p>Thank you for using our BMI calculator. Based on your information, here's your comprehensive candidacy report:</p>

        <div style="text-align: center;">
            <div class="bmi-badge">Your BMI: {{BMI}}</div>
            <p style="color: #6b7280; font-size: 18px; margin-top: 10px;">{{BMI_CATEGORY}}</p>
        </div>

        <!-- DYNAMIC CONTENT BASED ON BMI RANGE -->
        {{CANDIDACY_CONTENT}}

        <div class="section">
            <div class="section-title">📋 General Eligibility Factors in Australia</div>
            <p>While BMI is important, surgeons assess multiple factors:</p>
            <ul class="checklist">
                <li>BMI requirements (typically 35+ with conditions, or 40+)</li>
                <li>Age (usually 18-65, but varies by individual case)</li>
                <li>Previous weight loss attempts</li>
                <li>Obesity-related health conditions</li>
                <li>Mental health assessment and clearance</li>
                <li>Commitment to lifelong lifestyle changes</li>
                <li>Realistic expectations about outcomes</li>
            </ul>
        </div>

        <div class="warning-box">
            <strong>⚠️ Important Medical Disclaimer</strong><br>
            This report is for educational purposes only and does not constitute medical advice. Only a qualified bariatric surgeon and GP can determine your individual eligibility. All medical decisions must be made in consultation with AHPRA-registered healthcare professionals.
        </div>

        <div class="section">
            <div class="section-title">🎯 Your Next Steps</div>
            <ol>
                <li><strong>Book a GP Appointment:</strong> Discuss your weight loss goals and request a referral to a bariatric surgeon</li>
                <li><strong>Research Surgeons:</strong> Find qualified bariatric surgeons in your area</li>
                <li><strong>Understand Costs:</strong> Calculate your potential surgery costs and financing options</li>
                <li><strong>Prepare Questions:</strong> Download our surgeon selection checklist</li>
            </ol>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <a href="https://weightlosssurgery.com.au/cost-calculator" class="cta-button">Calculate My Surgery Costs →</a>
            <br><br>
            <a href="https://weightlosssurgery.com.au/surgeon-selection-checklist" class="cta-button">Download Surgeon Checklist →</a>
        </div>

        <div class="section">
            <div class="section-title">❓ 5 Questions to Ask Your GP</div>
            <ol>
                <li>"Based on my BMI and health conditions, am I a candidate for weight loss surgery?"</li>
                <li>"What pre-surgery assessments or tests would I need?"</li>
                <li>"Can you provide a referral to a bariatric surgeon?"</li>
                <li>"What are the risks and benefits in my specific case?"</li>
                <li>"How long is the typical waiting period for initial consultations?"</li>
            </ol>
        </div>

        <div class="footer">
            <p><strong>Need Help?</strong> Reply to this email with any questions.</p>
            <p>Weight Loss Surgery Australia<br>
            Educational Resource & Surgeon Directory<br>
            <a href="https://weightlosssurgery.com.au">weightlosssurgery.com.au</a></p>
            
            <div class="disclaimer">
                <strong>Privacy & Compliance:</strong> Your information is confidential and will never be shared with third parties. We are an educational resource and directory only - we do not provide medical services or make medical recommendations. All surgeons listed are AHPRA-registered. You can unsubscribe from future emails at any time.
            </div>
        </div>
    </div>
</body>
</html>
```

---

## Dynamic Content Sections by BMI Range

### BMI < 18.5 (Underweight)

```html
<div class="section">
    <div class="section-title">ℹ️ Understanding Your BMI Result</div>
    <p>Your BMI of {{BMI}} falls in the <strong>underweight</strong> category. Weight loss surgery is typically not recommended for people in this BMI range.</p>
    
    <p><strong>What This Means:</strong></p>
    <ul>
        <li>Surgery is generally considered for BMI 30+ (with health conditions) or BMI 35+</li>
        <li>Your current weight may not meet clinical criteria for bariatric surgery</li>
        <li>Other health interventions may be more appropriate</li>
    </ul>
    
    <p><strong>Recommended Actions:</strong></p>
    <ul class="checklist">
        <li>Consult your GP about healthy weight management strategies</li>
        <li>Consider dietitian support if you have concerns about your weight</li>
        <li>Address any underlying health conditions affecting your weight</li>
        <li>Discuss whether there are specific medical circumstances that might warrant surgical consideration</li>
    </ul>
</div>
```

### BMI 18.5-24.9 (Normal Weight)

```html
<div class="section">
    <div class="section-title">ℹ️ Understanding Your BMI Result</div>
    <p>Your BMI of {{BMI}} falls in the <strong>normal weight</strong> category. Weight loss surgery is typically not recommended for people in this BMI range.</p>
    
    <p><strong>What This Means:</strong></p>
    <ul>
        <li>You are currently at a healthy weight for your height</li>
        <li>Surgery is not medically appropriate and carries risks without medical necessity</li>
        <li>Bariatric surgery is reserved for people with obesity-related health issues</li>
    </ul>
    
    <p><strong>Recommended Actions:</strong></p>
    <ul class="checklist">
        <li>Maintain your healthy weight through balanced nutrition and regular exercise</li>
        <li>Consult your GP if you have specific concerns about your weight or body composition</li>
        <li>Consider speaking with a dietitian for personalized nutrition guidance</li>
        <li>Focus on overall health and wellness rather than surgical interventions</li>
    </ul>
</div>
```

### BMI 25-29.9 (Overweight)

```html
<div class="section">
    <div class="section-title">ℹ️ Understanding Your BMI Result</div>
    <p>Your BMI of {{BMI}} falls in the <strong>overweight</strong> category. Weight loss surgery is typically considered for BMI 30+ (with health conditions) or BMI 35+.</p>
    
    <p><strong>What This Means:</strong></p>
    <ul>
        <li>You are currently below the typical BMI threshold for surgery (30-35 with conditions, or 35+)</li>
        <li>Non-surgical weight loss methods are usually recommended first</li>
        <li>Surgery may be considered in exceptional cases with significant health conditions</li>
    </ul>
    
    <p><strong>Recommended Actions:</strong></p>
    <ul class="checklist">
        <li>Consult your GP about medical weight loss programs</li>
        <li>Work with a dietitian on evidence-based nutrition strategies</li>
        <li>Consider an exercise physiologist for safe, effective physical activity plans</li>
        <li>Address any obesity-related health conditions (diabetes, sleep apnea, hypertension)</li>
        <li>If you have significant health conditions, discuss with your GP whether surgery might still be an option</li>
    </ul>
</div>
```

### BMI 30-34.9 (Obesity Class I)

```html
<div class="section">
    <div class="section-title">✅ Understanding Your BMI Result</div>
    <p>Your BMI of {{BMI}} falls in the <strong>Obesity Class I</strong> category. People in this range may be considered for weight loss surgery if they have obesity-related health conditions.</p>
    
    <p><strong>What This Means:</strong></p>
    <ul>
        <li>You may be a candidate for surgery if you have specific health conditions</li>
        <li>Typical qualifying conditions include Type 2 diabetes, sleep apnea, high blood pressure, or other obesity-related issues</li>
        <li>Individual assessment by a bariatric surgeon is essential</li>
    </ul>
    
    <p><strong>Common Qualifying Health Conditions:</strong></p>
    <ul class="checklist">
        <li>Type 2 diabetes or pre-diabetes</li>
        <li>Obstructive sleep apnea</li>
        <li>High blood pressure (hypertension)</li>
        <li>Heart disease or high cholesterol</li>
        <li>Joint problems or osteoarthritis</li>
        <li>Fatty liver disease</li>
        <li>PCOS (Polycystic Ovary Syndrome)</li>
    </ul>
    
    <p><strong>Typical Procedures Considered:</strong></p>
    <ul>
        <li><strong>Gastric Sleeve:</strong> Most common, removes ~80% of stomach</li>
        <li><strong>Gastric Bypass:</strong> For those with severe diabetes or reflux</li>
        <li><strong>Gastric Band:</strong> Less common, adjustable restriction</li>
    </ul>
    
    <div style="background-color: #dbeafe; padding: 15px; border-radius: 4px; margin-top: 15px;">
        <strong>💡 Next Step:</strong> Book an appointment with your GP to discuss your health conditions and request a referral to a bariatric surgeon for a comprehensive assessment.
    </div>
</div>
```

### BMI 35-39.9 (Obesity Class II)

```html
<div class="section">
    <div class="section-title">✅ Understanding Your BMI Result</div>
    <p>Your BMI of {{BMI}} falls in the <strong>Obesity Class II</strong> category. People in this range commonly meet criteria for weight loss surgery in Australia.</p>
    
    <p><strong>What This Means:</strong></p>
    <ul>
        <li>You likely meet the BMI criteria for weight loss surgery</li>
        <li>Eligibility depends on comprehensive medical assessment</li>
        <li>Most private health insurance policies cover this BMI range</li>
        <li>You may qualify for Medicare rebates</li>
    </ul>
    
    <p><strong>Typical Assessment Process:</strong></p>
    <ul class="checklist">
        <li>GP referral to bariatric surgeon</li>
        <li>Comprehensive medical history review</li>
        <li>Psychological evaluation</li>
        <li>Nutritional assessment</li>
        <li>Review of previous weight loss attempts</li>
        <li>Discussion of procedure options</li>
        <li>Pre-operative testing (blood work, imaging, etc.)</li>
    </ul>
    
    <p><strong>Procedures Commonly Considered:</strong></p>
    <ul>
        <li><strong>Gastric Sleeve (Most Popular):</strong> 60-70% excess weight loss, lower risk</li>
        <li><strong>Gastric Bypass:</strong> 70-80% excess weight loss, best for diabetes/reflux</li>
        <li><strong>Gastric Band:</strong> 40-50% excess weight loss, reversible but less effective</li>
    </ul>
    
    <p><strong>Estimated Costs (2025):</strong></p>
    <ul>
        <li><strong>With Private Health Insurance:</strong> $5,000-$8,000 out-of-pocket</li>
        <li><strong>Self-Funded:</strong> $18,000-$25,000 total</li>
        <li><strong>Medicare Rebates:</strong> ~$1,000-$1,500 (if eligible)</li>
    </ul>
    
    <div style="background-color: #dcfce7; padding: 15px; border-radius: 4px; margin-top: 15px;">
        <strong>💡 You're in a strong position:</strong> Most people in your BMI range are approved for surgery after completing the assessment process. Start by speaking to your GP about a referral.
    </div>
</div>
```

### BMI 40+ (Obesity Class III)

```html
<div class="section">
    <div class="section-title">✅ Understanding Your BMI Result</div>
    <p>Your BMI of {{BMI}} falls in the <strong>Obesity Class III</strong> category. People in this range typically meet the general BMI criteria for weight loss surgery in Australia.</p>
    
    <p><strong>What This Means:</strong></p>
    <ul>
        <li>You meet the standard BMI criteria for weight loss surgery</li>
        <li>Comprehensive medical assessment is still required</li>
        <li>Surgery may provide significant health benefits</li>
        <li>Most insurance policies cover this BMI range</li>
        <li>You may have priority access to public hospital programs (in some states)</li>
    </ul>
    
    <p><strong>Health Benefits Often Seen:</strong></p>
    <ul class="checklist">
        <li>Improvement or remission of Type 2 diabetes (60-80% of cases)</li>
        <li>Reduction in blood pressure medication</li>
        <li>Improvement in sleep apnea symptoms</li>
        <li>Reduced joint pain and improved mobility</li>
        <li>Improved cardiovascular health</li>
        <li>Enhanced quality of life and mental health</li>
    </ul>
    
    <p><strong>Procedures Commonly Considered:</strong></p>
    <ul>
        <li><strong>Gastric Sleeve (Most Common):</strong> 60-70% excess weight loss, good safety profile</li>
        <li><strong>Gastric Bypass:</strong> 70-80% excess weight loss, excellent for diabetes and reflux</li>
        <li><strong>Duodenal Switch:</strong> 80-90% excess weight loss, for very high BMI (usually 50+)</li>
    </ul>
    
    <p><strong>Important Considerations:</strong></p>
    <ul>
        <li>Higher BMI may require additional pre-operative preparation</li>
        <li>Some surgeons recommend pre-surgery weight loss (10-15kg)</li>
        <li>Psychological evaluation is crucial for long-term success</li>
        <li>Lifelong commitment to dietary changes and supplements required</li>
    </ul>
    
    <p><strong>Estimated Timeline:</strong></p>
    <ul>
        <li><strong>GP Referral to First Consultation:</strong> 2-8 weeks</li>
        <li><strong>Assessment Process:</strong> 1-3 months</li>
        <li><strong>Surgery Wait Time:</strong> 1-6 months (varies by surgeon/hospital)</li>
        <li><strong>Total Time:</strong> 3-12 months from GP visit to surgery</li>
    </ul>
    
    <div style="background-color: #dcfce7; padding: 15px; border-radius: 4px; margin-top: 15px;">
        <strong>💡 Take the first step:</strong> Book an appointment with your GP to discuss your options and request a referral to a bariatric surgeon. The assessment process will determine the best procedure for your individual situation.
    </div>
</div>
```

---

## Plain Text Version (Fallback)

```
Hi {{NAME}},

Thank you for using our BMI calculator. Here's your personalized candidacy report:

YOUR BMI: {{BMI}}
CATEGORY: {{BMI_CATEGORY}}

{{CANDIDACY_TEXT_CONTENT}}

GENERAL ELIGIBILITY FACTORS IN AUSTRALIA
While BMI is important, surgeons assess multiple factors:
- BMI requirements (typically 35+ with conditions, or 40+)
- Age (usually 18-65, but varies by individual case)
- Previous weight loss attempts
- Obesity-related health conditions
- Mental health assessment and clearance
- Commitment to lifelong lifestyle changes
- Realistic expectations about outcomes

⚠️ IMPORTANT MEDICAL DISCLAIMER
This report is for educational purposes only and does not constitute medical advice. Only a qualified bariatric surgeon and GP can determine your individual eligibility.

YOUR NEXT STEPS:
1. Book a GP appointment to discuss your weight loss goals
2. Research qualified bariatric surgeons in your area
3. Calculate your potential surgery costs
4. Download our surgeon selection checklist

HELPFUL RESOURCES:
- Cost Calculator: https://weightlosssurgery.com.au/cost-calculator
- Surgeon Checklist: https://weightlosssurgery.com.au/surgeon-selection-checklist
- Find Surgeons: https://weightlosssurgery.com.au/surgeons

5 QUESTIONS TO ASK YOUR GP:
1. "Based on my BMI and health conditions, am I a candidate for weight loss surgery?"
2. "What pre-surgery assessments or tests would I need?"
3. "Can you provide a referral to a bariatric surgeon?"
4. "What are the risks and benefits in my specific case?"
5. "How long is the typical waiting period for initial consultations?"

Need help? Reply to this email with any questions.

Weight Loss Surgery Australia
Educational Resource & Surgeon Directory
https://weightlosssurgery.com.au

---
Privacy & Compliance: Your information is confidential and will never be shared with third parties. We are an educational resource and directory only - we do not provide medical services or make medical recommendations. You can unsubscribe at any time.
```

---

## Implementation Notes

### Variables to Replace:
- `{{NAME}}` - User's first name
- `{{BMI}}` - Calculated BMI value (e.g., "37.2")
- `{{BMI_CATEGORY}}` - Category name (e.g., "Obesity Class II")
- `{{CANDIDACY_CONTENT}}` - Dynamic HTML section based on BMI range
- `{{CANDIDACY_TEXT_CONTENT}}` - Dynamic plain text section based on BMI range

### Email Sending Logic:
1. Capture form submission with BMI, name, email, age, gender
2. Determine BMI category
3. Select appropriate content section
4. Replace variables in template
5. Send email via Google Apps Script or email service
6. Log submission to Google Sheets

### Follow-up Sequence:
After sending this email, users should be added to the core nurture sequence (already created in EMAIL-01 through EMAIL-07).

