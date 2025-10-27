# BMI Candidacy Email Automation - Setup Guide

## Overview

This guide sets up automated email delivery for the BMI Calculator "Complete Candidacy Report". When users submit their contact details after calculating their BMI, they receive a personalized email with candidacy information based on their BMI range.

---

## Architecture

```
User completes BMI Calculator
    ↓
Submits contact form with BMI data
    ↓
JavaScript sends to Google Apps Script webhook
    ↓
Google Apps Script:
  1. Saves data to Google Sheet
  2. Determines BMI category
  3. Selects appropriate email content
  4. Sends personalized email via Gmail
    ↓
User receives Complete Candidacy Report email
```

---

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create new sheet named: **"BMI Calculator Leads"**
3. Add these headers in Row 1:

```
A: Timestamp
B: Name
C: Email
D: BMI
E: Gender
F: Age Range
G: BMI Category
H: Email Sent
I: Email Status
```

---

## Step 2: Create Google Apps Script

1. In your Google Sheet: **Extensions > Apps Script**
2. Delete existing code
3. Paste the complete script below:

```javascript
// ============================================================================
// BMI CANDIDACY EMAIL AUTOMATION
// ============================================================================
// This script:
// 1. Receives BMI calculator form submissions via webhook
// 2. Saves data to Google Sheet
// 3. Sends personalized candidacy email based on BMI range
// ============================================================================

// Configuration
const CONFIG = {
  SHEET_NAME: 'BMI Calculator Leads', // Change if your sheet has a different name
  FROM_EMAIL: 'Cam <contact@bariatricsurgeryhub.com>',
  REPLY_TO: 'contact@bariatricsurgeryhub.com',
  WEBSITE_URL: 'https://bariatricsurgeryhub.com'
};

// ============================================================================
// MAIN WEBHOOK HANDLER
// ============================================================================

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
    const data = JSON.parse(e.postData.contents);
    
    // Extract form data
    const timestamp = new Date();
    const name = data.name || '';
    const email = data.email || '';
    const bmi = parseFloat(data.bmi) || 0;
    const gender = data.gender || '';
    const age = data.age || '';
    
    // Determine BMI category
    const bmiCategory = getBMICategory(bmi);
    
    // Save to sheet
    sheet.appendRow([
      timestamp,
      name,
      email,
      bmi,
      gender,
      age,
      bmiCategory,
      'Pending',
      ''
    ]);
    
    // Send email
    const emailSent = sendCandidacyEmail(name, email, bmi, bmiCategory, gender, age);
    
    // Update email status
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 8).setValue(emailSent ? 'Sent' : 'Failed');
    sheet.getRange(lastRow, 9).setValue(emailSent ? new Date() : 'Error sending email');
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        emailSent: emailSent 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test endpoint
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: 'BMI Email Webhook Active',
      timestamp: new Date()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// BMI CATEGORY DETERMINATION
// ============================================================================

function getBMICategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal Weight';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obesity Class I';
  if (bmi < 40) return 'Obesity Class II';
  return 'Obesity Class III';
}

// ============================================================================
// EMAIL SENDING FUNCTION
// ============================================================================

function sendCandidacyEmail(name, email, bmi, category, gender, age) {
  try {
    const firstName = name.split(' ')[0];
    const subject = `Your Weight Loss Surgery Candidacy Report (BMI: ${bmi.toFixed(1)})`;
    
    // Get dynamic content based on BMI
    const candidacyContent = getCandidacyContent(bmi, category);
    
    // Build HTML email
    const htmlBody = buildEmailHTML(firstName, bmi, category, candidacyContent);
    
    // Send email
    GmailApp.sendEmail(email, subject, '', {
      htmlBody: htmlBody,
      name: CONFIG.FROM_EMAIL,
      replyTo: CONFIG.REPLY_TO
    });
    
    Logger.log(`Email sent successfully to ${email}`);
    return true;
    
  } catch (error) {
    Logger.log(`Error sending email: ${error.toString()}`);
    return false;
  }
}

// ============================================================================
// DYNAMIC CONTENT GENERATION
// ============================================================================

function getCandidacyContent(bmi, category) {
  if (bmi < 18.5) {
    return `
      <div class="section">
        <div class="section-title">ℹ️ Understanding Your BMI Result</div>
        <p>Your BMI of ${bmi.toFixed(1)} falls in the <strong>underweight</strong> category. Weight loss surgery is typically not recommended for people in this BMI range.</p>
        
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
    `;
  }
  
  if (bmi < 25) {
    return `
      <div class="section">
        <div class="section-title">ℹ️ Understanding Your BMI Result</div>
        <p>Your BMI of ${bmi.toFixed(1)} falls in the <strong>normal weight</strong> category. Weight loss surgery is typically not recommended for people in this BMI range.</p>
        
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
    `;
  }
  
  if (bmi < 30) {
    return `
      <div class="section">
        <div class="section-title">ℹ️ Understanding Your BMI Result</div>
        <p>Your BMI of ${bmi.toFixed(1)} falls in the <strong>overweight</strong> category. Weight loss surgery is typically considered for BMI 30+ (with health conditions) or BMI 35+.</p>
        
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
    `;
  }
  
  if (bmi < 35) {
    return `
      <div class="section">
        <div class="section-title">✅ Understanding Your BMI Result</div>
        <p>Your BMI of ${bmi.toFixed(1)} falls in the <strong>Obesity Class I</strong> category. People in this range may be considered for weight loss surgery if they have obesity-related health conditions.</p>
        
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
    `;
  }
  
  if (bmi < 40) {
    return `
      <div class="section">
        <div class="section-title">✅ Understanding Your BMI Result</div>
        <p>Your BMI of ${bmi.toFixed(1)} falls in the <strong>Obesity Class II</strong> category. People in this range commonly meet criteria for weight loss surgery in Australia.</p>
        
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
    `;
  }
  
  // BMI 40+
  return `
    <div class="section">
      <div class="section-title">✅ Understanding Your BMI Result</div>
      <p>Your BMI of ${bmi.toFixed(1)} falls in the <strong>Obesity Class III</strong> category. People in this range typically meet the general BMI criteria for weight loss surgery in Australia.</p>
      
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
  `;
}

// ============================================================================
// HTML EMAIL TEMPLATE
// ============================================================================

function buildEmailHTML(firstName, bmi, category, candidacyContent) {
  return `
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
        ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        li {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Weight Loss Surgery Australia</div>
            <p style="color: #6b7280; margin: 0;">Your Personalized Candidacy Report</p>
        </div>

        <p>Hi ${firstName},</p>

        <p>Thank you for using our BMI calculator. Based on your information, here's your comprehensive candidacy report:</p>

        <div style="text-align: center;">
            <div class="bmi-badge">Your BMI: ${bmi.toFixed(1)}</div>
            <p style="color: #6b7280; font-size: 18px; margin-top: 10px;">${category}</p>
        </div>

        ${candidacyContent}

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
            <a href="${CONFIG.WEBSITE_URL}/cost-calculator" class="cta-button">Calculate My Surgery Costs →</a>
            <br><br>
            <a href="${CONFIG.WEBSITE_URL}/surgeon-selection-checklist" class="cta-button">Download Surgeon Checklist →</a>
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
            <a href="${CONFIG.WEBSITE_URL}">${CONFIG.WEBSITE_URL}</a></p>
            
            <div class="disclaimer">
                <strong>Privacy & Compliance:</strong> Your information is confidential and will never be shared with third parties. We are an educational resource and directory only - we do not provide medical services or make medical recommendations. All surgeons listed are AHPRA-registered. You can unsubscribe from future emails at any time.
            </div>
        </div>
    </div>
</body>
</html>
  `;
}
```

4. Click **Save** (disk icon)
5. Name your project: "BMI Email Automation"

---

## Step 3: Deploy as Web App

1. Click **Deploy > New deployment**
2. Click gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Settings:
   - **Description:** "BMI Candidacy Email Webhook"
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Click **Deploy**
6. Click **Authorize access** and grant permissions
7. **COPY THE WEB APP URL** - you'll need this!

The URL will look like:
```
https://script.google.com/macros/s/AKfycbx.../exec
```

---

## Step 4: Update BMI Calculator

1. Open `.env` file in your project root (create if it doesn't exist)
2. Add this line with your actual webhook URL:

```
PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec
```

3. Restart your dev server: `npm run dev`

---

## Step 5: Test the System

### Test 1: Webhook Endpoint
Open your webhook URL in a browser. You should see:
```json
{
  "status": "BMI Email Webhook Active",
  "timestamp": "2025-10-27T..."
}
```

### Test 2: Full Flow
1. Go to http://localhost:4321/bmi-calculator
2. Calculate your BMI
3. Click "Get Your Full Candidacy Report"
4. Enter your email and name
5. Submit the form
6. Check your email inbox (should arrive within 1-2 minutes)
7. Check your Google Sheet (should see new row with data)

### Test 3: Different BMI Ranges
Test with different BMI values to ensure correct content:
- BMI 22 (Normal) - Should get "not recommended" message
- BMI 32 (Class I) - Should get "may qualify with conditions"
- BMI 37 (Class II) - Should get "commonly meets criteria"
- BMI 42 (Class III) - Should get "meets standard criteria"

---

## Troubleshooting

### Email Not Sending

**Check Gmail Quota:**
- Free Gmail: 100 emails/day
- Google Workspace: 1,500 emails/day
- Check quota: Apps Script > Executions

**Check Script Logs:**
1. Apps Script Editor > Executions
2. Look for errors
3. Check "Email sent successfully" log messages

**Common Issues:**
- Invalid email address format
- Gmail blocked due to suspicious activity
- Script permissions not granted

### Data Not Saving to Sheet

**Check Sheet Name:**
- Default is 'Sheet1'
- Update `CONFIG.SHEET_NAME` if different

**Check Permissions:**
- Script must have access to spreadsheet
- Re-authorize if needed

### Webhook Not Responding

**Check Deployment:**
- Must be deployed as "Web app"
- "Who has access" must be "Anyone"
- Try redeploying if issues persist

**Check URL:**
- Must end with `/exec` not `/dev`
- Copy from deployment, not script editor URL

---

## Customization Options

### Change Email Sender Name
```javascript
const CONFIG = {
  FROM_EMAIL: 'Your Name <noreply@yourdomain.com>',
  REPLY_TO: 'support@yourdomain.com'
};
```

### Modify Email Content
Edit the `getCandidacyContent()` function to change the email text for each BMI range.

### Add Email Tracking
Add UTM parameters to links:
```javascript
<a href="${CONFIG.WEBSITE_URL}/cost-calculator?utm_source=email&utm_campaign=bmi-report">
```

### Add to Email List
After sending email, add subscriber to your email marketing platform:
```javascript
// Add after email sent successfully
addToEmailList(email, name, bmi);
```

---

## Production Checklist

Before going live:

- [ ] Test all BMI ranges (< 18.5, 18.5-25, 25-30, 30-35, 35-40, 40+)
- [ ] Verify email formatting on mobile devices
- [ ] Check all links work correctly
- [ ] Confirm medical disclaimers are present
- [ ] Test with real email addresses
- [ ] Monitor first 10 submissions closely
- [ ] Set up email quota monitoring
- [ ] Document webhook URL securely
- [ ] Add error notification (email yourself if script fails)

---

## Monitoring & Maintenance

### Daily Checks
- Review Google Sheet for new submissions
- Check "Email Sent" column for failures
- Monitor email delivery rates

### Weekly Tasks
- Review email open rates (if tracking added)
- Check for bounce emails
- Update content if needed

### Monthly Tasks
- Review BMI distribution of leads
- Analyze which BMI ranges convert best
- Update email content based on feedback
- Check Gmail quota usage

---

## Next Steps: Full Email System

Once this is working, you can implement the full AI Newsletter System (see AI-NEWSLETTER-SYSTEM-PRD.md):

1. **Set up Drip account** for advanced email marketing
2. **Build MCP server** to connect Claude Code to Drip
3. **Create AI email generator** for ongoing campaigns
4. **Implement 8 nurture sequences** from the PRD
5. **Add behavioral triggers** and segmentation
6. **Scale to full automation**

This BMI email will integrate seamlessly into that larger system when ready.

---

## Support

**Issues?**
- Check Google Apps Script logs
- Review execution history
- Test webhook URL directly
- Verify .env file configuration

**Questions?**
- Refer to setup-webhook.md for basic webhook setup
- See AI-NEWSLETTER-SYSTEM-PRD.md for full email system
- Check Google Apps Script documentation

---

**Status:** ✅ Ready to Deploy
**Estimated Setup Time:** 30 minutes
**Maintenance:** Minimal (check weekly)

