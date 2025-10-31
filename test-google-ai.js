#!/usr/bin/env node

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: './mcp-server/.env' });

const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
const baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

async function testGoogleAI() {
  if (!apiKey) {
    console.error('GOOGLE_AI_STUDIO_API_KEY environment variable is required');
    return;
  }

  console.log('Testing Google AI API...');
  console.log('API Key:', apiKey.substring(0, 10) + '...');
  console.log('Base URL:', baseUrl);

  // Test with different models
  const models = ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'];
  
  for (const model of models) {
    console.log(`\nTesting model: ${model}`);
    
    try {
      const response = await fetch(
        `${baseUrl}/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: 'Hello, can you help me find bariatric surgeons in Brisbane, Australia?',
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: 1024,
              temperature: 0.7,
            },
          }),
        }
      );

      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Success! Model works.');
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          const result = data.candidates[0].content.parts
            .map(part => part.text)
            .join('');
          console.log('Response:', result.substring(0, 200) + '...');
        }
        break; // Found a working model
      } else {
        const errorData = await response.text();
        console.log('Error:', errorData);
      }
    } catch (error) {
      console.log('Exception:', error.message);
    }
  }
}

testGoogleAI().catch(console.error);
