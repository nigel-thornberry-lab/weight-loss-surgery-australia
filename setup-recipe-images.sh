#!/bin/bash

# Recipe Image Generation Setup Script
# This script sets up the environment for automated recipe image generation

echo "🚀 Setting up Recipe Image Generation..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "💡 Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install required dependencies
echo "📦 Installing dependencies..."
npm install openai

# Create directories
echo "📁 Creating directories..."
mkdir -p public/blog/recipes/stage-1
mkdir -p public/blog/recipes/stage-2
mkdir -p public/blog/recipes/stage-3
mkdir -p public/blog/recipes/stage-4
mkdir -p html-backups

echo "✅ Directories created"

# Make scripts executable
chmod +x generate-recipe-images.js
chmod +x update-html-with-images.js

echo "✅ Scripts made executable"

# Check for OpenAI API key
if [ -z "$OPENAI_API_KEY" ]; then
    echo ""
    echo "⚠️  OPENAI_API_KEY environment variable not set"
    echo ""
    echo "🔑 To get your API key:"
    echo "1. Go to: https://platform.openai.com/api-keys"
    echo "2. Create a new API key"
    echo "3. Set it with: export OPENAI_API_KEY='your-key-here'"
    echo ""
    echo "💡 Or add it to your ~/.bashrc or ~/.zshrc file:"
    echo "echo 'export OPENAI_API_KEY=\"your-key-here\"' >> ~/.bashrc"
    echo ""
else
    echo "✅ OPENAI_API_KEY is set"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set your OPENAI_API_KEY if not already done"
echo "2. Run: node generate-recipe-images.js"
echo "3. Run: node update-html-with-images.js"
echo "4. Test your website"
echo ""
echo "💰 Estimated cost: $2-5 for all 50 images"
echo "⏱️  Estimated time: 30-60 minutes"
echo ""
echo "📚 For manual generation, see: RECIPE-IMAGE-PROMPTS.md"

