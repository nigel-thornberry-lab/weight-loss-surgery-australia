# 🚀 Quick Webhook Setup Guide

## What You Need to Do (5 minutes)

### 1. Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create new sheet named: **"WLS Leads"**
3. Add these headers in Row 1:
   ```
   Timestamp | Name | Email | Phone | Location | Procedure | Source | Message | Surgeon Name | Form Type | BMI Range | Health Conditions
   ```

### 2. Create Apps Script
1. In your Google Sheet: **Extensions > Apps Script**
2. Delete existing code, paste this:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
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

### 3. Deploy Webhook
1. Click **Deploy > New deployment**
2. Click gear ⚙️ > Choose **Web app**
3. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. **COPY THE WEB APP URL** (looks like: `https://script.google.com/macros/s/ABC123.../exec`)

### 4. Add to Your Site
Create `.env` file in your project root:
```
PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_ACTUAL_URL_HERE/exec
```

### 5. Test It
1. Restart your dev server: `npm run dev`
2. Go to your contact page and submit the form
3. Check your Google Sheet - you should see a new row!

## ✅ Done!

Your forms will now capture leads directly to Google Sheets. All 84 pages with forms are ready to go!

## 🔧 Troubleshooting

**Form not working?**
- Check the `.env` file has the correct URL
- Make sure you restarted the dev server after adding `.env`
- Check browser console for errors

**No data in sheet?**
- Verify the Apps Script is deployed as "Web app"
- Check "Who has access" is set to "Anyone"
- Test the webhook URL directly in browser
