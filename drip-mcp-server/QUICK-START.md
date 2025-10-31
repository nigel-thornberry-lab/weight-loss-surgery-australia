# Quick Start Guide

## Step-by-Step Setup (5 minutes)

### 1. Get Your Drip Credentials

1. Log into your Drip account
2. **Get API Token:**
   - Click your profile icon → Settings
   - Go to "User Settings" → "API Tokens"
   - Create a new token (name it "MCP Server" or similar)
   - Copy the token immediately (you won't see it again!)

3. **Get Account ID:**
   - Look at your Drip URL: `https://www.getdrip.com/XXXXXXX/...`
   - The number is your Account ID
   - Or find it in Settings → Account Settings

### 2. Configure the Server

1. **Create your `.env` file:**

```bash
cp .env.example .env
```

2. **Edit `.env` with your credentials:**

```env
DRIP_API_TOKEN=your_actual_token_here
DRIP_ACCOUNT_ID=your_actual_account_id_here
```

### 3. Add to Claude Code

1. **Open Claude Code config file:**
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

2. **Add the Drip server** (replace the path with your actual path):

```json
{
  "mcpServers": {
    "drip": {
      "command": "node",
      "args": ["/Users/Cameron/Desktop/weight-loss-surgery-australia/drip-mcp-server/src/index.js"],
      "env": {
        "DRIP_API_TOKEN": "515780c07f58d9b514ddaf1b040ce225",
        "DRIP_ACCOUNT_ID": "4349557"
      }
    }
  }
}
```

**Important:**
- Use the **full absolute path** to `index.js`
- Replace the credentials with your actual values
- If you already have other MCP servers, add this inside the existing `mcpServers` object

3. **Restart Claude Code completely**

### 4. Test It

Open Claude Code and try:

```
List all my Drip tags
```

Or:

```
Show me my Drip account information
```

If you see data from your Drip account, it's working!

## Common Use Cases for BariatricSurgeryHub

### Add a Lead from Cost Calculator

When someone fills out your cost calculator:

```
Add sarah@example.com to Drip with:
- Name: Sarah Johnson
- Tag: calculator_user
- Custom fields:
  - estimated_cost: 12000
  - calculator_date: 2025-01-15
  - procedure_interest: gastric_sleeve
```

### Add a Lead from Surgeon Checklist

```
Add mike@example.com to Drip with:
- Name: Mike Chen
- Tag: surgeon_researcher
- Custom field location: Sydney
```

### Track an Event

```
Track that sarah@example.com completed the cost calculator with
an estimated cost of $12,000
```

### Check Your Workflows

```
Show me all my active workflows in Drip
```

### List Subscribers by Tag

```
Show me all subscribers tagged with "calculator_user"
```

### Get Subscriber Details

```
Show me all information about sarah@example.com from Drip
```

## Implementing Form Integration

### Option 1: Manual Integration (Start Here)

When someone fills out a form on your site, ask Claude Code:

```
Add [email] to Drip with tag [tag_name] and custom fields [fields]
```

### Option 2: API Integration (After Testing)

You can call the Drip API directly from your forms. Here's a simple example:

```javascript
// After form submission
async function addToDrip(formData) {
  const response = await fetch('https://api.getdrip.com/v3/YOUR_ACCOUNT_ID/subscribers', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      subscribers: [{
        email: formData.email,
        first_name: formData.firstName,
        tags: ['calculator_user'],
        custom_fields: {
          estimated_cost: formData.estimatedCost,
          calculator_date: new Date().toISOString()
        }
      }]
    })
  });
}
```

### Option 3: Zapier (No Code)

1. Create a Zap: Your Form → Drip
2. When form is submitted → Add subscriber to Drip
3. Map form fields to custom fields
4. Apply appropriate tag

## Troubleshooting

### "DRIP_API_TOKEN environment variable is required"

- Check your `.env` file exists and has the correct values
- OR check your `claude_desktop_config.json` has the env variables set
- Restart Claude Code

### "Drip API error (401): Unauthorized"

- Your API token is incorrect or expired
- Generate a new token in Drip settings
- Update your configuration

### "Drip API error (404): Not Found"

- Your Account ID is incorrect
- Double-check the number in your Drip URL

### Tools not showing in Claude Code

1. Check the file path in `claude_desktop_config.json` is correct
2. Make sure you're using forward slashes `/` (even on Windows)
3. Restart Claude Code completely (quit and reopen)
4. Check Claude Code logs for errors

### Still not working?

1. Test the server directly:
   ```bash
   cd drip-mcp-server
   node src/index.js
   ```

   Should output: `Drip MCP server running on stdio`

2. Check your Node.js version:
   ```bash
   node --version
   ```

   Should be 18 or higher

## Next Steps

Once it's working:

1. **Set up your 5 form tags** (from PRD):
   - `calculator_user`
   - `surgeon_researcher`
   - `readiness_quiz`
   - `consultation_request`
   - `newsletter_subscriber`

2. **Create custom fields** in Drip:
   - `estimated_cost`
   - `calculator_date`
   - `procedure_interest`
   - `location`
   - `bmi`

3. **Test with your own email** before using real leads

4. **Create your workflows** in Drip UI for each tag

5. **Start sending leads** from your forms!

## Support

- **MCP Server Issues:** Check the main README.md
- **Drip API Questions:** https://developer.drip.com/
- **BariatricSurgeryHub Implementation:** Refer to SIMPLE-EMAIL-SYSTEM-PRD.md

---

**You're ready to automate your email marketing!** 🚀
