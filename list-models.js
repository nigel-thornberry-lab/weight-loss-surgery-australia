#!/usr/bin/env node

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: './mcp-server/.env' });

const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;

async function listModels() {
  if (!apiKey) {
    console.error('GOOGLE_AI_STUDIO_API_KEY environment variable is required');
    return;
  }

  console.log('Listing available models...');
  
  const versions = ['v1', 'v1beta'];
  
  for (const version of versions) {
    console.log(`\n=== API Version: ${version} ===`);
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/${version}/models?key=${apiKey}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Available models:');
        if (data.models) {
          data.models.forEach(model => {
            console.log(`- ${model.name}`);
          });
        } else {
          console.log('No models found or unexpected response format');
          console.log('Response:', JSON.stringify(data, null, 2));
        }
      } else {
        const errorData = await response.text();
        console.log('Error:', errorData);
      }
    } catch (error) {
      console.log('Exception:', error.message);
    }
  }
}

listModels().catch(console.error);
