# Google Sheets Lead Capture Setup

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create new sheet named: **"WLS Leads"**
3. In Row 1, add these column headers:
   - A1: `Timestamp`
   - B1: `Name`
   - C1: `Email`
   - D1: `Phone`
   - E1: `Location`
   - F1: `Procedure`
   - G1: `Source`
   - H1: `Message`
   - I1: `Surgeon Name`
   - J1: `Form Type`
   - K1: `BMI Range`
   - L1: `Health Conditions`

## Step 2: Create Apps Script Webhook

1. In your Google Sheet, click **Extensions > Apps Script**
2. Delete any existing code
3. Paste this code:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Add row with form data (matches current form structure)
    sheet.appendRow([
      new Date(),                           // Timestamp
      data.name || '',                      // Name
      data.email || '',                     // Email
      data.phone || '',                     // Phone
      data.location || '',                  // Location
      data.procedure || '',                 // Procedure
      data.source || '',                    // Source
      data.message || '',                   // Message
      data.surgeonName || '',               // Surgeon Name
      data.formType || 'Consultation',      // Form Type
      data.bmi || '',                       // BMI Range
      data.conditions || ''                 // Health Conditions
    ]);
    
    // Return success
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Webhook is active' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Click **Deploy > New deployment**
5. Click gear icon ⚙️ next to "Select type" > Choose **Web app**
6. Settings:
   - Description: "Lead capture webhook"
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy**
8. **Copy the Web App URL** - you'll need this!
9. Click **Authorize access** and grant permissions

## Step 3: Add Webhook URL to Your Site

1. Create `.env` file in your project root:
```
PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

2. The `.env` file is already in `.gitignore` ✅

3. Your forms are already configured to use `PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL` ✅

## Step 4: Test Your Webhook

Run this in your browser console (replace URL):
```javascript
fetch('YOUR_WEBHOOK_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    phone: '0400000000',
    location: 'Sydney',
    procedure: 'Gastric Sleeve',
    source: 'Manual Test',
    message: 'This is a test',
    surgeonName: 'Dr. Test Surgeon',
    formType: 'Consultation',
    bmi: '30-35',
    conditions: 'Diabetes, Sleep Apnea'
  })
})
.then(r => r.json())
.then(console.log);
```

Check your Google Sheet - you should see a new row!

## Optional: Email Notifications

Add this to your Apps Script to get email alerts:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Add row
    sheet.appendRow([
      new Date(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.location || '',
      data.procedure || '',
      data.source || '',
      data.message || ''
    ]);
    
    // Send email notification
    MailApp.sendEmail({
      to: 'contact@bariatricsurgeryhub.com', // Main contact email
      subject: '🎯 New Lead: ' + (data.name || 'Unknown'),
      htmlBody: `
        <h2>New Lead Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p><strong>Procedure:</strong> ${data.procedure}</p>
        <p><strong>Source:</strong> ${data.source}</p>
        <p><strong>Message:</strong> ${data.message}</p>
        <hr>
        <p><small>From: Weight Loss Surgery Australia</small></p>
      `
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Done!

Your lead capture system is now ready. All form submissions will automatically appear in your Google Sheet (and optionally trigger email notifications).

