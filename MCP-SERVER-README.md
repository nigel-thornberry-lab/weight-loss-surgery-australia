# Google AI Studio MCP Server

A Model Context Protocol (MCP) server that wraps Google AI Studio API with grounding capabilities, allowing you to query Google's Gemini models through chat interfaces.

## 🚀 Features

- **Google AI Studio Integration**: Direct access to Gemini models
- **Grounding Support**: Real-time information retrieval with web search
- **Multiple Tools**: Search, grounding search, and chat capabilities
- **Secure API Key Management**: Environment variable based configuration
- **MCP Compatible**: Works with any MCP-compatible client

## 🛠️ Setup

### 1. Prerequisites

- Node.js 18+ 
- Google AI Studio API key (get from [aistudio.google.com](https://aistudio.google.com/app/apikey))

### 2. Installation

```bash
# Run the setup script
./setup-mcp-server.sh
```

### 3. Configuration

1. **Get your API key**:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Copy the key

2. **Add to environment**:
   ```bash
   cd mcp-server
   echo "GOOGLE_AI_STUDIO_API_KEY=your_actual_api_key_here" > .env
   ```

### 4. Test the Server

```bash
cd mcp-server
npm start
```

## 🔧 Available Tools

### 1. `google_ai_search`
Basic search with optional grounding.

**Parameters:**
- `query` (required): Your search query
- `model`: Model to use (default: gemini-1.5-flash)
- `use_grounding`: Enable grounding (default: true)
- `max_tokens`: Response length (default: 1024)
- `temperature`: Creativity level 0.0-1.0 (default: 0.7)

**Example:**
```json
{
  "name": "google_ai_search",
  "arguments": {
    "query": "What are the latest developments in weight loss surgery?",
    "use_grounding": true,
    "max_tokens": 2048
  }
}
```

### 2. `google_ai_grounding_search`
Advanced search with detailed grounding information.

**Parameters:**
- `query` (required): Your search query
- `search_engine`: Search engine to use (default: google)
- `max_results`: Number of results to use (default: 5)

**Example:**
```json
{
  "name": "google_ai_grounding_search",
  "arguments": {
    "query": "Best bariatric surgeons in Sydney Australia",
    "search_engine": "google",
    "max_results": 10
  }
}
```

### 3. `google_ai_chat`
Conversational AI with context support.

**Parameters:**
- `message` (required): Your message
- `model`: Model to use (default: gemini-1.5-flash)
- `system_instruction`: System prompt for the AI
- `conversation_history`: Previous messages for context

**Example:**
```json
{
  "name": "google_ai_chat",
  "arguments": {
    "message": "Can you help me understand gastric sleeve surgery?",
    "system_instruction": "You are a medical information assistant specializing in bariatric surgery.",
    "conversation_history": [
      {
        "role": "user",
        "content": "I'm considering weight loss surgery"
      },
      {
        "role": "model", 
        "content": "I'd be happy to help you understand your options..."
      }
    ]
  }
}
```

## 🔌 MCP Client Configuration

### For Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "google-ai-studio": {
      "command": "node",
      "args": ["/path/to/your/mcp-google-ai-studio.js"],
      "env": {
        "GOOGLE_AI_STUDIO_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### For Other MCP Clients

The server communicates via stdio and follows the MCP protocol. Any MCP-compatible client should work.

## 📊 Use Cases

### 1. Medical Research
```json
{
  "name": "google_ai_grounding_search",
  "arguments": {
    "query": "Latest research on gastric sleeve surgery outcomes 2024",
    "max_results": 8
  }
}
```

### 2. Local Business Information
```json
{
  "name": "google_ai_search",
  "arguments": {
    "query": "Bariatric surgeons near Parramatta NSW with reviews",
    "use_grounding": true
  }
}
```

### 3. Conversational AI
```json
{
  "name": "google_ai_chat",
  "arguments": {
    "message": "What should I expect during recovery from gastric bypass?",
    "system_instruction": "You are a patient care coordinator with expertise in bariatric surgery recovery."
  }
}
```

## 🔒 Security

- **API Key Protection**: Keys stored in environment variables
- **No Client Exposure**: API key never sent to client
- **Rate Limiting**: Respects Google AI Studio limits
- **Error Handling**: Secure error messages without exposing internals

## 🐛 Troubleshooting

### Common Issues

1. **"API key not found"**
   - Ensure `GOOGLE_AI_STUDIO_API_KEY` is set in environment
   - Check the key is valid at [aistudio.google.com](https://aistudio.google.com/app/apikey)

2. **"Model not found"**
   - Use supported models: `gemini-1.5-flash`, `gemini-1.5-pro`
   - Check model availability in your region

3. **"Rate limit exceeded"**
   - Google AI Studio has usage limits
   - Check your quota in the Google AI Studio console

### Debug Mode

Run with debug logging:
```bash
DEBUG=* node mcp-google-ai-studio.js
```

## 📈 Performance Tips

1. **Use appropriate models**:
   - `gemini-1.5-flash`: Fast, good for most tasks
   - `gemini-1.5-pro`: More capable, slower

2. **Optimize token usage**:
   - Set appropriate `max_tokens`
   - Use grounding only when needed

3. **Cache responses**:
   - Implement caching for repeated queries
   - Store conversation history efficiently

## 🔄 Updates

To update the MCP server:

```bash
cd mcp-server
npm update @modelcontextprotocol/sdk
```

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review Google AI Studio documentation
- Open an issue in the repository

---

**Ready to use!** Your Google AI Studio MCP server is now configured and ready to provide AI-powered search and chat capabilities through any MCP-compatible client.

