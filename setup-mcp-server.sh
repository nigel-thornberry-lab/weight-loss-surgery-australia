#!/bin/bash

# Setup script for Google AI Studio MCP Server

echo "🚀 Setting up Google AI Studio MCP Server..."

# Create MCP server directory
mkdir -p mcp-server
cd mcp-server

# Copy package.json
cp ../mcp-server-package.json package.json

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Make the server executable
chmod +x ../mcp-google-ai-studio.js

# Create environment file template
cat > .env.example << 'EOF'
# Google AI Studio API Key
# Get your API key from: https://aistudio.google.com/app/apikey
GOOGLE_AI_STUDIO_API_KEY=your_api_key_here
EOF

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file. Please add your Google AI Studio API key."
fi

echo "✅ MCP Server setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your Google AI Studio API key to mcp-server/.env"
echo "2. Test the server: cd mcp-server && npm start"
echo "3. Configure your MCP client to use this server"
echo ""
echo "Configuration for MCP clients:"
echo "Add this to your MCP client configuration:"
echo ""
echo "  \"mcpServers\": {"
echo "    \"google-ai-studio\": {"
echo "      \"command\": \"node\","
echo "      \"args\": [\"$(pwd)/mcp-google-ai-studio.js\"],"
echo "      \"env\": {"
echo "        \"GOOGLE_AI_STUDIO_API_KEY\": \"your_api_key_here\""
echo "      }"
echo "    }"
echo "  }"

