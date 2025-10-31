# Drip MCP Server

Model Context Protocol (MCP) server for [Drip](https://www.drip.com/) email service provider integration. This server enables Claude Code and other MCP clients to interact with your Drip account for email marketing automation.

## Features

- **Subscriber Management**: Create, update, retrieve, and delete subscribers
- **Tag Management**: Apply and remove tags for segmentation
- **Custom Fields**: Set and manage custom field data
- **Campaign Management**: List and manage email campaigns (sequences)
- **Workflow Automation**: Control workflows (automations)
- **Event Tracking**: Track custom events for behavioral automation
- **Form Management**: Access and manage Drip forms
- **Broadcast Emails**: List and retrieve broadcast information
- **Account Information**: Get account details and statistics

## Installation

### Prerequisites

- Node.js 18 or higher
- A Drip account with API access
- Your Drip API token and Account ID

### Setup

1. **Clone or navigate to the server directory:**

```bash
cd drip-mcp-server
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create a `.env` file with your Drip credentials:**

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
DRIP_API_TOKEN=your_api_token_here
DRIP_ACCOUNT_ID=your_account_id_here
```

### Finding Your Drip Credentials

1. **API Token:**
   - Log into Drip
   - Go to Settings → User Settings → API Tokens
   - Create a new token or copy an existing one

2. **Account ID:**
   - In your Drip URL: `https://www.getdrip.com/YOUR_ACCOUNT_ID/...`
   - Or go to Settings → Account Settings

## Configuration for Claude Code

Add this server to your Claude Code MCP settings file (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "drip": {
      "command": "node",
      "args": ["/absolute/path/to/drip-mcp-server/src/index.js"],
      "env": {
        "DRIP_API_TOKEN": "your_api_token_here",
        "DRIP_ACCOUNT_ID": "your_account_id_here"
      }
    }
  }
}
```

**Important:** Replace `/absolute/path/to/drip-mcp-server` with the actual path to this directory.

After adding the configuration, restart Claude Code.

## Available Tools

### Subscriber Management

#### `drip_create_subscriber`
Create or update a subscriber with tags and custom fields.

**Example:**
```javascript
{
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "tags": ["calculator_user", "newsletter_subscriber"],
  "custom_fields": {
    "estimated_cost": "12000",
    "calculator_date": "2025-01-15",
    "bmi": "35"
  }
}
```

#### `drip_get_subscriber`
Get detailed information about a subscriber.

**Example:**
```javascript
{
  "email_or_id": "john@example.com"
}
```

#### `drip_list_subscribers`
List subscribers with optional filters.

**Example:**
```javascript
{
  "status": "active",
  "tags": "calculator_user",
  "page": 1
}
```

#### `drip_delete_subscriber`
Permanently delete a subscriber.

#### `drip_unsubscribe_subscriber`
Unsubscribe a subscriber from all mailings.

### Tag Management

#### `drip_tag_subscriber`
Apply a tag to a subscriber (for segmentation).

**Example:**
```javascript
{
  "email": "john@example.com",
  "tag": "calculator_user"
}
```

**Common tags from your PRD:**
- `calculator_user` - Cost Calculator form users
- `surgeon_researcher` - Surgeon Selection Checklist users
- `readiness_quiz` - Am I Ready Quiz users
- `consultation_request` - Contact/Consultation requests
- `newsletter_subscriber` - General newsletter signups

#### `drip_untag_subscriber`
Remove a tag from a subscriber.

#### `drip_list_tags`
List all tags in your account.

### Custom Fields

#### `drip_update_custom_fields`
Update custom fields for tracking additional data.

**Example:**
```javascript
{
  "email": "john@example.com",
  "custom_fields": {
    "estimated_cost": "12000",
    "procedure_interest": "gastric_sleeve",
    "location": "Sydney"
  }
}
```

#### `drip_list_custom_fields`
List all custom field identifiers.

### Campaign Management

#### `drip_list_campaigns`
List all email campaigns (sequences).

#### `drip_get_campaign`
Get details about a specific campaign.

#### `drip_get_campaign_subscribers`
Get subscribers enrolled in a campaign.

### Workflow Management

#### `drip_list_workflows`
List all workflows (automations).

#### `drip_get_workflow`
Get details about a specific workflow.

#### `drip_activate_workflow`
Activate a workflow to start processing.

#### `drip_pause_workflow`
Pause an active workflow.

### Event Tracking

#### `drip_track_event`
Track custom events for behavioral automation.

**Example:**
```javascript
{
  "email": "john@example.com",
  "action": "Completed Calculator",
  "properties": {
    "estimated_cost": "12000",
    "bmi": "35",
    "procedure": "gastric_sleeve"
  }
}
```

### Form Management

#### `drip_list_forms`
List all forms in your account.

#### `drip_get_form`
Get details about a specific form.

### Broadcast Management

#### `drip_list_broadcasts`
List broadcast emails.

#### `drip_get_broadcast`
Get details about a specific broadcast.

### Account Management

#### `drip_get_account`
Get account information and statistics.

## Usage Examples

### Example 1: Add a lead from Cost Calculator

When someone completes your cost calculator form:

```javascript
// Ask Claude Code:
"Add john@example.com to Drip with the tag 'calculator_user' and set
custom fields: estimated_cost=12000, calculator_date=2025-01-15"

// Claude will use:
drip_create_subscriber({
  email: "john@example.com",
  first_name: "John",
  tags: ["calculator_user"],
  custom_fields: {
    estimated_cost: "12000",
    calculator_date: "2025-01-15"
  }
})
```

### Example 2: Track a form completion event

```javascript
// Ask Claude Code:
"Track that john@example.com completed the cost calculator with
an estimated cost of $12,000"

// Claude will use:
drip_track_event({
  email: "john@example.com",
  action: "Completed Cost Calculator",
  properties: {
    estimated_cost: "12000"
  }
})
```

### Example 3: List all subscribers in a specific segment

```javascript
// Ask Claude Code:
"Show me all active subscribers tagged with 'calculator_user'"

// Claude will use:
drip_list_subscribers({
  status: "active",
  tags: "calculator_user"
})
```

### Example 4: Check workflow status

```javascript
// Ask Claude Code:
"Show me all active workflows"

// Claude will use:
drip_list_workflows({
  status: "active"
})
```

## Integration with Your Email System

Based on your PRD (`SIMPLE-EMAIL-SYSTEM-PRD.md`), this MCP server enables you to:

### 1. Form-Based Segmentation

When users complete different forms, tag them appropriately:

- **Cost Calculator** → Tag: `calculator_user`
- **Surgeon Checklist** → Tag: `surgeon_researcher`
- **Readiness Quiz** → Tag: `readiness_quiz`
- **Contact Form** → Tag: `consultation_request`
- **Newsletter Signup** → Tag: `newsletter_subscriber`

### 2. Custom Field Tracking

Store important data in custom fields:

```javascript
{
  "estimated_cost": "12000",
  "calculator_date": "2025-01-15",
  "procedure_interest": "gastric_sleeve",
  "location": "Sydney",
  "bmi": "35",
  "surgeon_preference": "Dr. Smith"
}
```

### 3. Event-Based Automation

Track events to trigger workflows:

- "Completed Calculator"
- "Downloaded Checklist"
- "Booked Consultation"
- "Viewed Surgeon Profile"

### 4. Workflow Management

Monitor and control your email sequences:

- Activate new workflows
- Check subscriber counts
- Pause underperforming sequences
- View workflow performance

## API Reference

This server uses the Drip REST API v3. For more details:
- [Drip API Documentation](https://developer.drip.com/)

## Development

### Running in Development Mode

```bash
npm run dev
```

This uses Node's `--watch` flag to automatically restart on file changes.

### Testing

Test the server manually:

```bash
node src/index.js
```

The server will output: `Drip MCP server running on stdio`

## Troubleshooting

### "DRIP_API_TOKEN environment variable is required"

Make sure you've set your environment variables in the `.env` file or in your Claude Code config.

### "Drip API error (401): Unauthorized"

Check that your API token is correct and hasn't expired.

### "Drip API error (404): Not Found"

Verify your Account ID is correct.

### Tool not appearing in Claude Code

1. Check your `claude_desktop_config.json` has the correct path
2. Restart Claude Code completely
3. Check the Claude Code logs for errors

## Security

- **Never commit your `.env` file** to version control
- Keep your API token secure and rotate it regularly
- Use environment variables for credentials in production
- Limit API token permissions if possible in Drip settings

## License

MIT

## Support

For issues with:
- **This MCP server**: Open an issue in the project repository
- **Drip API**: Check [Drip's API documentation](https://developer.drip.com/)
- **MCP protocol**: See [Model Context Protocol documentation](https://modelcontextprotocol.io/)

## Next Steps

1. Install dependencies: `npm install`
2. Configure your `.env` file
3. Add to Claude Code configuration
4. Restart Claude Code
5. Start automating your email marketing!

---

**Built for BariatricSurgeryHub email automation system**
