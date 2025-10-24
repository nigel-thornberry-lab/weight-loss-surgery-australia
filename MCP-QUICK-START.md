# 🚀 Google AI Studio MCP Server - Quick Start

Get your Google AI Studio API working with chat in 5 minutes!

## ⚡ Quick Setup

### 1. Get Your API Key
```bash
# Visit Google AI Studio
open https://aistudio.google.com/app/apikey
```

### 2. Run Setup
```bash
# Make setup script executable and run
chmod +x setup-mcp-server.sh
./setup-mcp-server.sh
```

### 3. Add Your API Key
```bash
cd mcp-server
echo "GOOGLE_AI_STUDIO_API_KEY=AIzaSyD3Igd4fS0kSFX9988fi0ISso0EZnLoI4g" > .env
```

### 4. Test It Works
```bash
# Test the server
node test-mcp-server.js

# Or test manually
cd mcp-server
npm start
```

## 🔧 Configure Your Chat Client

### For Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "google-ai-studio": {
      "command": "node",
      "args": ["/Users/Cameron/Desktop/weight-loss-surgery-australia/mcp-google-ai-studio.js"],
      "env": {
        "GOOGLE_AI_STUDIO_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### For Other MCP Clients

The server works with any MCP-compatible client. Just point it to:
- **Command**: `node`
- **Args**: `["/path/to/mcp-google-ai-studio.js"]`
- **Environment**: `GOOGLE_AI_STUDIO_API_KEY=your_key`

## 🎯 Available Tools

Once configured, you'll have these tools available:

1. **`google_ai_search`** - Basic AI search with optional grounding
2. **`google_ai_grounding_search`** - Advanced search with real-time web data
3. **`google_ai_chat`** - Conversational AI with context
4. **`google_maps_grounding`** - ✨ **NEW!** Google Maps grounding for location-based information

## 💡 Example Usage

### Search with Grounding
```
"Search for the latest bariatric surgery techniques in Australia"
```

### Get Real-time Information
```
"Find current reviews for weight loss surgeons in Sydney"
```

### Have a Conversation
```
"Help me understand the differences between gastric sleeve and gastric bypass"
```

## 🆘 Troubleshooting

### "API key not found"
- Make sure you've set `GOOGLE_AI_STUDIO_API_KEY` in your environment
- Check the key is valid at [aistudio.google.com](https://aistudio.google.com/app/apikey)

### "Server won't start"
- Ensure Node.js 18+ is installed
- Run `npm install` in the mcp-server directory
- Check the server path in your MCP client config

### "No tools available"
- Restart your MCP client after configuration
- Check the server is running without errors
- Verify the API key is working

## 📚 Full Documentation

For detailed information, see:
- `MCP-SERVER-README.md` - Complete documentation
- `test-mcp-server.js` - Test your setup

## 🎉 You're Ready!

Your Google AI Studio API is now accessible through chat with grounding capabilities for real-time information!

---

**Need help?** Check the full README or run the test script to diagnose issues.
