# Unified Webhook System - All Forms, One Script

## Overview

This single Google Apps Script handles **all form submissions** from your website and automatically:
1. Saves data to the appropriate Google Sheet tab
2. Sends the correct email response based on form type
3. Logs everything for tracking

**One webhook URL, multiple form types, intelligent routing.**

---

## Supported Form Types

| Form Type | Triggers | Email Response |
|-----------|----------|----------------|
| `bmi-candidacy-report` | BMI Calculator | Personalized BMI Candidacy Report |
| `consultation` | Consultation forms | Consultation confirmation |
| `cost-calculator` | Cost Calculator | Cost breakdown follow-up |
| `newsletter` | Newsletter signup | Welcome to newsletter |
| `surgeon-checklist` | Checklist download | Checklist + next steps |
| `general-inquiry` | Contact forms | General inquiry response |

---

## Setup Instructions

### Step 1: Create Google Sheet with Multiple Tabs

1. Go to https://sheets.google.com
2. Create new sheet: **"Bariatric Surgery Hub - All Leads"**
3. Create these tabs (sheets):
   - `BMI Calculator` - For BMI submissions
   - `Consultations` - For consultation requests
   - `Cost Calculator` - For cost calculator completions
   - `Newsletter` - For newsletter signups
   - `Surgeon Checklist` - For checklist downloads
   - `General Inquiries` - For contact form submissions

4. Add headers to each tab:

**BMI Calculator tab:**
```
Timestamp | Name | Email | BMI | Gender | Age Range | BMI Category | Email Sent | Status
```

**Consultations tab:**
```
Timestamp | Name | Email | Phone | Location | Procedure | Surgeon Name | Message | Source | Email Sent | Status
```

**Cost Calculator tab:**
```
Timestamp | Name | Email | Procedure | Location | Insurance | BMI Range | Estimated Cost | Email Sent | Status
```

**Newsletter tab:**
```
Timestamp | Email | Name | Source | Interests | Email Sent | Status
```

**Surgeon Checklist tab:**
```
Timestamp | Name | Email | Source | Email Sent | Status
```

**General Inquiries tab:**
```
Timestamp | Name | Email | Phone | Message | Source | Email Sent | Status
```

---

### Step 2: Add the Unified Google Apps Script

1. In your Google Sheet: **Extensions > Apps Script**
2. Delete existing code
3. Paste this complete script:

```javascript
// ============================================================================
// UNIFIED WEBHOOK SYSTEM - BARIATRIC SURGERY HUB
// ============================================================================
// Handles all form submissions and sends appropriate email responses
// ============================================================================

// Configuration
const CONFIG = {
  FROM_EMAIL: 'Cam <contact@bariatricsurgeryhub.com>',
  REPLY_TO: 'contact@bariatricsurgeryhub.com',
  WEBSITE_URL: 'https://bariatricsurgeryhub.com',
  
  // Sheet names for each form type
  SHEETS: {
    'bmi-candidacy-report': 'BMI Calculator',
    'consultation': 'Consultations',
    'cost-calculator': 'Cost Calculator',
    'newsletter': 'Newsletter',
    'surgeon-checklist': 'Surgeon Checklist',
    'general-inquiry': 'General Inquiries'
  }
};

// ============================================================================
// MAIN WEBHOOK HANDLER
// ============================================================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const formType = data.type || 'general-inquiry';
    
    Logger.log(`Received ${formType} submission from ${data.email}`);
    
    // Save to appropriate sheet
    const saved = saveToSheet(formType, data);
    
    // Send appropriate email
    const emailSent = sendEmail(formType, data);
    
    // Update status in sheet
    if (saved) {
      updateEmailStatus(formType, emailSent);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true,
        formType: formType,
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
      status: 'Unified Webhook Active',
      supportedTypes: Object.keys(CONFIG.SHEETS),
      timestamp: new Date()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// SAVE TO SHEET FUNCTIONS
// ============================================================================

function saveToSheet(formType, data) {
  try {
    const sheetName = CONFIG.SHEETS[formType];
    if (!sheetName) {
      Logger.log(`Unknown form type: ${formType}`);
      return false;
    }
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      Logger.log(`Sheet not found: ${sheetName}`);
      return false;
    }
    
    const timestamp = new Date();
    let row = [];
    
    // Build row based on form type
    switch(formType) {
      case 'bmi-candidacy-report':
        row = [
          timestamp,
          data.name || '',
          data.email || '',
          data.bmi || '',
          data.gender || '',
          data.age || '',
          getBMICategory(parseFloat(data.bmi)),
          'Pending',
          ''
        ];
        break;
        
      case 'consultation':
        row = [
          timestamp,
          data.name || '',
          data.email || '',
          data.phone || '',
          data.location || '',
          data.procedure || '',
          data.surgeonName || '',
          data.message || '',
          data.source || 'Website',
          'Pending',
          ''
        ];
        break;
        
      case 'cost-calculator':
        row = [
          timestamp,
          data.name || '',
          data.email || '',
          data.procedure || '',
          data.location || '',
          data.insurance || '',
          data.bmiRange || '',
          data.estimatedCost || '',
          'Pending',
          ''
        ];
        break;
        
      case 'newsletter':
        row = [
          timestamp,
          data.email || '',
          data.name || '',
          data.source || 'Website',
          data.interests || '',
          'Pending',
          ''
        ];
        break;
        
      case 'surgeon-checklist':
        row = [
          timestamp,
          data.name || '',
          data.email || '',
          data.source || 'Website',
          'Pending',
          ''
        ];
        break;
        
      case 'general-inquiry':
        row = [
          timestamp,
          data.name || '',
          data.email || '',
          data.phone || '',
          data.message || '',
          data.source || 'Website',
          'Pending',
          ''
        ];
        break;
    }
    
    sheet.appendRow(row);
    Logger.log(`Saved to ${sheetName}`);
    return true;
    
  } catch (error) {
    Logger.log(`Error saving to sheet: ${error.toString()}`);
    return false;
  }
}

function updateEmailStatus(formType, emailSent) {
  try {
    const sheetName = CONFIG.SHEETS[formType];
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    const lastRow = sheet.getLastRow();
    
    // Update "Email Sent" column (second to last column)
    const emailStatusCol = sheet.getLastColumn() - 1;
    sheet.getRange(lastRow, emailStatusCol).setValue(emailSent ? 'Sent' : 'Failed');
    
    // Update "Status" column (last column)
    sheet.getRange(lastRow, sheet.getLastColumn()).setValue(
      emailSent ? new Date() : 'Error sending email'
    );
    
  } catch (error) {
    Logger.log(`Error updating status: ${error.toString()}`);
  }
}

// ============================================================================
// EMAIL ROUTING
// ============================================================================

function sendEmail(formType, data) {
  try {
    switch(formType) {
      case 'bmi-candidacy-report':
        return sendBMICandidacyEmail(data);
        
      case 'consultation':
        return sendConsultationEmail(data);
        
      case 'cost-calculator':
        return sendCostCalculatorEmail(data);
        
      case 'newsletter':
        return sendNewsletterWelcomeEmail(data);
        
      case 'surgeon-checklist':
        return sendChecklistEmail(data);
        
      case 'general-inquiry':
        return sendGeneralInquiryEmail(data);
        
      default:
        Logger.log(`No email handler for type: ${formType}`);
        return false;
    }
  } catch (error) {
    Logger.log(`Error sending email: ${error.toString()}`);
    return false;
  }
}

// ============================================================================
// BMI CANDIDACY EMAIL (Your existing email)
// ============================================================================

function sendBMICandidacyEmail(data) {
  try {
    const firstName = (data.name || '').split(' ')[0];
    const bmi = parseFloat(data.bmi);
    const category = getBMICategory(bmi);
    const subject = `Your Weight Loss Surgery Candidacy Report (BMI: ${bmi.toFixed(1)})`;
    
    const candidacyContent = getCandidacyContent(bmi, category);
    const htmlBody = buildBMIEmailHTML(firstName, bmi, category, candidacyContent);
    
    GmailApp.sendEmail(data.email, subject, '', {
      htmlBody: htmlBody,
      name: CONFIG.FROM_EMAIL,
      replyTo: CONFIG.REPLY_TO
    });
    
    Logger.log(`BMI email sent to ${data.email}`);
    return true;
    
  } catch (error) {
    Logger.log(`Error sending BMI email: ${error.toString()}`);
    return false;
  }
}

// ============================================================================
// CONSULTATION CONFIRMATION EMAIL
// ============================================================================

function sendConsultationEmail(data) {
  try {
    const firstName = (data.name || '').split(' ')[0];
    const subject = 'We Received Your Consultation Request';
    
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { background: white; border-radius: 8px; padding: 30px; }
        .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        .cta-button { display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: #1e40af; margin: 0;">Bariatric Surgery Hub</h1>
        </div>
        
        <p>Hi ${firstName},</p>
        
        <p>Thank you for your consultation request. We've received your information and will be in touch within 24 hours.</p>
        
        <p><strong>What you requested:</strong></p>
        <ul>
            ${data.procedure ? `<li>Procedure: ${data.procedure}</li>` : ''}
            ${data.location ? `<li>Location: ${data.location}</li>` : ''}
            ${data.surgeonName ? `<li>Surgeon: ${data.surgeonName}</li>` : ''}
        </ul>
        
        <p><strong>What happens next:</strong></p>
        <ol>
            <li>We'll review your request and match you with appropriate surgeons</li>
            <li>You'll receive surgeon recommendations within 24 hours</li>
            <li>We'll help you book your first consultation</li>
        </ol>
        
        <p>In the meantime, here are some helpful resources:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${CONFIG.WEBSITE_URL}/cost-calculator" class="cta-button">Calculate Your Costs</a>
        </div>
        
        <p>Questions? Just reply to this email.</p>
        
        <p>Best regards,<br>
        Cam<br>
        Bariatric Surgery Hub</p>
    </div>
</body>
</html>
    `;
    
    GmailApp.sendEmail(data.email, subject, '', {
      htmlBody: htmlBody,
      name: CONFIG.FROM_EMAIL,
      replyTo: CONFIG.REPLY_TO
    });
    
    Logger.log(`Consultation email sent to ${data.email}`);
    return true;
    
  } catch (error) {
    Logger.log(`Error sending consultation email: ${error.toString()}`);
    return false;
  }
}

// ============================================================================
// COST CALCULATOR FOLLOW-UP EMAIL
// ============================================================================

function sendCostCalculatorEmail(data) {
  try {
    const firstName = (data.name || '').split(' ')[0];
    const subject = 'Your Surgery Cost Breakdown + Next Steps';
    
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { background: white; border-radius: 8px; padding: 30px; }
        .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        .cost-box { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .cta-button { display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: #1e40af; margin: 0;">Your Cost Breakdown</h1>
        </div>
        
        <p>Hi ${firstName},</p>
        
        <p>Thanks for using our cost calculator! Here's a summary of your estimated costs:</p>
        
        ${data.estimatedCost ? `
        <div class="cost-box">
            <h3 style="margin-top: 0;">Estimated Total: ${data.estimatedCost}</h3>
            <p style="margin-bottom: 0;">For ${data.procedure || 'your selected procedure'} in ${data.location || 'your area'}</p>
        </div>
        ` : ''}
        
        <p><strong>Ways to Make Surgery More Affordable:</strong></p>
        <ul>
            <li><strong>Private Health Insurance:</strong> Can reduce out-of-pocket costs to $5,000-$8,000</li>
            <li><strong>Medicare Rebates:</strong> Up to $1,500 if eligible</li>
            <li><strong>Payment Plans:</strong> Many surgeons offer interest-free options</li>
            <li><strong>Superannuation:</strong> May be accessible for medical reasons</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${CONFIG.WEBSITE_URL}/surgeon-selection-checklist" class="cta-button">Download Surgeon Checklist</a>
        </div>
        
        <p>Ready to take the next step? Reply to this email and we'll help you find the right surgeon.</p>
        
        <p>Best regards,<br>
        Cam<br>
        Bariatric Surgery Hub</p>
    </div>
</body>
</html>
    `;
    
    GmailApp.sendEmail(data.email, subject, '', {
      htmlBody: htmlBody,
      name: CONFIG.FROM_EMAIL,
      replyTo: CONFIG.REPLY_TO
    });
    
    Logger.log(`Cost calculator email sent to ${data.email}`);
    return true;
    
  } catch (error) {
    Logger.log(`Error sending cost calculator email: ${error.toString()}`);
    return false;
  }
}

// ============================================================================
// NEWSLETTER WELCOME EMAIL
// ============================================================================

function sendNewsletterWelcomeEmail(data) {
  try {
    const firstName = (data.name || '').split(' ')[0] || 'there';
    const subject = 'Welcome to Bariatric Surgery Hub';
    
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { background: white; border-radius: 8px; padding: 30px; }
        .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: #1e40af; margin: 0;">Welcome! 👋</h1>
        </div>
        
        <p>Hi ${firstName},</p>
        
        <p>Thanks for subscribing to Bariatric Surgery Hub! You'll now receive:</p>
        
        <ul>
            <li>Weekly educational content about weight loss surgery</li>
            <li>Real patient success stories</li>
            <li>Cost-saving tips and financing strategies</li>
            <li>Surgeon selection guidance</li>
            <li>Updates on new procedures and research</li>
        </ul>
        
        <p><strong>Get started with these popular resources:</strong></p>
        <ul>
            <li><a href="${CONFIG.WEBSITE_URL}/bmi-calculator">BMI Calculator</a> - Am I eligible?</li>
            <li><a href="${CONFIG.WEBSITE_URL}/cost-calculator">Cost Calculator</a> - What will it cost?</li>
            <li><a href="${CONFIG.WEBSITE_URL}/surgeons">Find Surgeons</a> - Browse qualified surgeons</li>
        </ul>
        
        <p>Questions? Just reply to this email - I read every message.</p>
        
        <p>Best regards,<br>
        Cam<br>
        Bariatric Surgery Hub</p>
        
        <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">
            You can <a href="#">unsubscribe</a> anytime, but I hope you'll stick around!
        </p>
    </div>
</body>
</html>
    `;
    
    GmailApp.sendEmail(data.email, subject, '', {
      htmlBody: htmlBody,
      name: CONFIG.FROM_EMAIL,
      replyTo: CONFIG.REPLY_TO
    });
    
    Logger.log(`Newsletter welcome sent to ${data.email}`);
    return true;
    
  } catch (error) {
    Logger.log(`Error sending newsletter email: ${error.toString()}`);
    return false;
  }
}

// ============================================================================
// SURGEON CHECKLIST EMAIL
// ============================================================================

function sendChecklistEmail(data) {
  try {
    const firstName = (data.name || '').split(' ')[0];
    const subject = 'Your Surgeon Selection Checklist + Interview Questions';
    
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { background: white; border-radius: 8px; padding: 30px; }
        .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        .cta-button { display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: #1e40af; margin: 0;">Your Surgeon Checklist</h1>
        </div>
        
        <p>Hi ${firstName},</p>
        
        <p>Thanks for downloading our Surgeon Selection Checklist! This will help you evaluate surgeons and ask the right questions during consultations.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${CONFIG.WEBSITE_URL}/surgeon-selection-checklist" class="cta-button">View Your Checklist</a>
        </div>
        
        <p><strong>Top 5 Questions to Ask Every Surgeon:</strong></p>
        <ol>
            <li>How many of these procedures have you performed?</li>
            <li>What is your complication rate?</li>
            <li>What follow-up support do you provide?</li>
            <li>Which hospital will the surgery be at?</li>
            <li>What happens if I need revision surgery?</li>
        </ol>
        
        <p><strong>Red Flags to Watch For:</strong></p>
        <ul>
            <li>Pressure to book immediately</li>
            <li>Unwilling to discuss risks</li>
            <li>No clear follow-up plan</li>
            <li>Prices that seem too good to be true</li>
        </ul>
        
        <p>Ready to start booking consultations? Browse our directory of qualified surgeons:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${CONFIG.WEBSITE_URL}/surgeons" class="cta-button">Find Surgeons Near You</a>
        </div>
        
        <p>Questions? Reply to this email anytime.</p>
        
        <p>Best regards,<br>
        Cam<br>
        Bariatric Surgery Hub</p>
    </div>
</body>
</html>
    `;
    
    GmailApp.sendEmail(data.email, subject, '', {
      htmlBody: htmlBody,
      name: CONFIG.FROM_EMAIL,
      replyTo: CONFIG.REPLY_TO
    });
    
    Logger.log(`Checklist email sent to ${data.email}`);
    return true;
    
  } catch (error) {
    Logger.log(`Error sending checklist email: ${error.toString()}`);
    return false;
  }
}

// ============================================================================
// GENERAL INQUIRY EMAIL
// ============================================================================

function sendGeneralInquiryEmail(data) {
  try {
    const firstName = (data.name || '').split(' ')[0];
    const subject = 'We Received Your Message';
    
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { background: white; border-radius: 8px; padding: 30px; }
        .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: #1e40af; margin: 0;">Thanks for Reaching Out</h1>
        </div>
        
        <p>Hi ${firstName},</p>
        
        <p>Thanks for your message. I'll review it and get back to you within 24 hours.</p>
        
        <p>In the meantime, here are some resources that might help:</p>
        <ul>
            <li><a href="${CONFIG.WEBSITE_URL}/bmi-calculator">Check Your Eligibility</a></li>
            <li><a href="${CONFIG.WEBSITE_URL}/cost-calculator">Calculate Costs</a></li>
            <li><a href="${CONFIG.WEBSITE_URL}/surgeons">Browse Surgeons</a></li>
        </ul>
        
        <p>Best regards,<br>
        Cam<br>
        Bariatric Surgery Hub</p>
    </div>
</body>
</html>
    `;
    
    GmailApp.sendEmail(data.email, subject, '', {
      htmlBody: htmlBody,
      name: CONFIG.FROM_EMAIL,
      replyTo: CONFIG.REPLY_TO
    });
    
    Logger.log(`General inquiry email sent to ${data.email}`);
    return true;
    
  } catch (error) {
    Logger.log(`Error sending general inquiry email: ${error.toString()}`);
    return false;
  }
}

// ============================================================================
// BMI HELPER FUNCTIONS (from your existing script)
// ============================================================================

function getBMICategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal Weight';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obesity Class I';
  if (bmi < 40) return 'Obesity Class II';
  return 'Obesity Class III';
}

function getCandidacyContent(bmi, category) {
  // [PASTE YOUR EXISTING getCandidacyContent FUNCTION HERE]
  // This is the same function from BMI-EMAIL-AUTOMATION-SETUP.md
  // I'm omitting it here for brevity, but you should copy it from your existing script
  return `<p>BMI content for ${category}</p>`;
}

function buildBMIEmailHTML(firstName, bmi, category, candidacyContent) {
  // [PASTE YOUR EXISTING buildEmailHTML FUNCTION HERE]
  // This is the same function from BMI-EMAIL-AUTOMATION-SETUP.md
  // I'm omitting it here for brevity, but you should copy it from your existing script
  return `<html><body><p>BMI email for ${firstName}</p></body></html>`;
}
```

4. Click **Save**
5. Name your project: "Unified Webhook System"

---

### Step 3: Deploy as Web App

1. Click **Deploy > New deployment**
2. Choose **Web app**
3. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. **COPY THE WEB APP URL**

---

### Step 4: Update Your .env File

**You only need ONE line:**

```bash
PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

---

## How It Works

### Form Submission Flow

```
User submits BMI calculator
    ↓
JavaScript sends: { type: 'bmi-candidacy-report', name: 'John', email: '...', bmi: 37.2 }
    ↓
Unified webhook receives submission
    ↓
Routes to BMI handler
    ↓
Saves to "BMI Calculator" sheet tab
    ↓
Sends personalized BMI candidacy email
    ↓
Updates status in sheet
```

```
User submits consultation form
    ↓
JavaScript sends: { type: 'consultation', name: 'Sarah', email: '...', procedure: 'Gastric Sleeve' }
    ↓
Unified webhook receives submission
    ↓
Routes to consultation handler
    ↓
Saves to "Consultations" sheet tab
    ↓
Sends consultation confirmation email
    ↓
Updates status in sheet
```

### Your Forms Just Need to Include `type`

**BMI Calculator** (already set):
```javascript
const data = {
  type: 'bmi-candidacy-report',
  name: formData.get('name'),
  email: formData.get('email'),
  bmi: calculatedBMI,
  gender: userGender,
  age: userAge
};
```

**Consultation Form**:
```javascript
const data = {
  type: 'consultation',
  name: formData.get('name'),
  email: formData.get('email'),
  phone: formData.get('phone'),
  procedure: formData.get('procedure'),
  location: formData.get('location')
};
```

**Cost Calculator**:
```javascript
const data = {
  type: 'cost-calculator',
  name: formData.get('name'),
  email: formData.get('email'),
  procedure: selectedProcedure,
  location: selectedLocation,
  estimatedCost: calculatedCost
};
```

---

## Benefits of This Approach

✅ **One webhook URL** - Easy to manage  
✅ **Intelligent routing** - Correct email for each form  
✅ **Organized data** - Separate sheet tabs for each form type  
✅ **Easy to extend** - Add new form types easily  
✅ **Centralized logic** - All email templates in one place  
✅ **Better tracking** - See all leads in one spreadsheet  
✅ **Consistent branding** - All emails use same styling  

---

## Testing Each Form Type

### Test BMI Calculator
```javascript
// In browser console or test script
fetch('YOUR_WEBHOOK_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'bmi-candidacy-report',
    name: 'Test User',
    email: 'your@email.com',
    bmi: 37.2,
    gender: 'female',
    age: '35-45'
  })
});
```

### Test Consultation Form
```javascript
fetch('YOUR_WEBHOOK_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'consultation',
    name: 'Test User',
    email: 'your@email.com',
    phone: '0400000000',
    procedure: 'Gastric Sleeve',
    location: 'Sydney'
  })
});
```

---

## Adding New Form Types

To add a new form type:

1. **Add sheet tab** in Google Sheets
2. **Add to CONFIG.SHEETS** object
3. **Add case to saveToSheet()** function
4. **Create email function** (e.g., `sendNewFormEmail()`)
5. **Add case to sendEmail()** switch statement

---

## Monitoring & Maintenance

### Check Execution Logs
1. Apps Script Editor > **Executions**
2. See all form submissions and email sends
3. Check for errors

### Review Sheet Data
- Each tab shows submissions for that form type
- "Email Sent" column shows success/failure
- "Status" column shows timestamp or error

### Gmail Quota
- Free Gmail: 100 emails/day
- Google Workspace: 1,500 emails/day
- Monitor in Apps Script > Quotas

---

## Migration from Multiple Webhooks

If you currently have multiple webhook URLs:

1. Deploy this unified webhook
2. Update `.env` to use new URL
3. Test each form type
4. Remove old webhook scripts
5. Clean up old sheets (optional)

---

## Summary

**One webhook URL = All forms handled**

- ✅ BMI Calculator → BMI Candidacy Report
- ✅ Consultation Forms → Consultation Confirmation
- ✅ Cost Calculator → Cost Follow-up
- ✅ Newsletter → Welcome Email
- ✅ Surgeon Checklist → Checklist Email
- ✅ Contact Forms → General Inquiry Response

**Simple, organized, scalable.**

