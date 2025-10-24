#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

class GoogleAIStudioServer {
  constructor() {
    this.server = new Server(
      {
        name: 'google-ai-studio-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'google_ai_search',
            description: 'Search using Google AI with grounding capabilities',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'The search query to send to Google AI',
                },
                model: {
                  type: 'string',
                  description: 'The model to use (default: gemini-1.5-flash)',
                  default: 'gemini-1.5-flash',
                },
                use_grounding: {
                  type: 'boolean',
                  description: 'Whether to use grounding for real-time information',
                  default: true,
                },
                max_tokens: {
                  type: 'number',
                  description: 'Maximum number of tokens in the response',
                  default: 1024,
                },
                temperature: {
                  type: 'number',
                  description: 'Temperature for response generation (0.0-1.0)',
                  default: 0.7,
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'google_ai_grounding_search',
            description: 'Search with Google AI grounding for real-time information',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'The search query with grounding',
                },
                search_engine: {
                  type: 'string',
                  description: 'Search engine to use for grounding',
                  default: 'google',
                },
                max_results: {
                  type: 'number',
                  description: 'Maximum number of search results to use',
                  default: 5,
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'google_ai_chat',
            description: 'Have a conversation with Google AI',
            inputSchema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'The message to send to Google AI',
                },
                model: {
                  type: 'string',
                  description: 'The model to use',
                  default: 'gemini-1.5-flash',
                },
                system_instruction: {
                  type: 'string',
                  description: 'System instruction for the AI',
                },
                conversation_history: {
                  type: 'array',
                  description: 'Previous conversation messages',
                  items: {
                    type: 'object',
                    properties: {
                      role: { type: 'string', enum: ['user', 'model'] },
                      content: { type: 'string' },
                    },
                  },
                },
              },
              required: ['message'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'google_ai_search':
            return await this.handleSearch(args);
          case 'google_ai_grounding_search':
            return await this.handleGroundingSearch(args);
          case 'google_ai_chat':
            return await this.handleChat(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async handleSearch(args) {
    const {
      query,
      model = 'gemini-1.5-flash',
      use_grounding = true,
      max_tokens = 1024,
      temperature = 0.7,
    } = args;

    if (!this.apiKey) {
      throw new Error('GOOGLE_AI_STUDIO_API_KEY environment variable is required');
    }

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: query,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: max_tokens,
        temperature: temperature,
      },
    };

    // Add grounding configuration if requested
    if (use_grounding) {
      requestBody.groundingConfig = {
        groundingChunkingConfig: {
          chunkSize: 1000,
          chunkOverlap: 200,
        },
        searchQueries: [query],
      };
    }

    const response = await fetch(
      `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Google AI API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    let result = '';
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      result = data.candidates[0].content.parts
        .map(part => part.text)
        .join('');
    }

    // Include grounding information if available
    let groundingInfo = '';
    if (data.groundingMetadata && data.groundingMetadata.groundingChunks) {
      groundingInfo = '\n\n**Grounding Sources:**\n';
      data.groundingMetadata.groundingChunks.forEach((chunk, index) => {
        groundingInfo += `${index + 1}. ${chunk.webSearchQueries?.[0] || 'Search result'}\n`;
      });
    }

    return {
      content: [
        {
          type: 'text',
          text: result + groundingInfo,
        },
      ],
    };
  }

  async handleGroundingSearch(args) {
    const {
      query,
      search_engine = 'google',
      max_results = 5,
    } = args;

    if (!this.apiKey) {
      throw new Error('GOOGLE_AI_STUDIO_API_KEY environment variable is required');
    }

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Please search for information about: ${query}. Use grounding to get real-time information.`,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
      groundingConfig: {
        groundingChunkingConfig: {
          chunkSize: 1000,
          chunkOverlap: 200,
        },
        searchQueries: [query],
        webSearchConfig: {
          searchEngine: search_engine,
          maxResults: max_results,
        },
      },
    };

    const response = await fetch(
      `${this.baseUrl}/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Google AI API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    let result = '';
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      result = data.candidates[0].content.parts
        .map(part => part.text)
        .join('');
    }

    // Include detailed grounding information
    let groundingInfo = '';
    if (data.groundingMetadata && data.groundingMetadata.groundingChunks) {
      groundingInfo = '\n\n**Grounding Sources:**\n';
      data.groundingMetadata.groundingChunks.forEach((chunk, index) => {
        if (chunk.webSearchQueries && chunk.webSearchQueries.length > 0) {
          groundingInfo += `${index + 1}. Search: ${chunk.webSearchQueries[0]}\n`;
        }
        if (chunk.segment && chunk.segment.text) {
          groundingInfo += `   Content: ${chunk.segment.text.substring(0, 200)}...\n`;
        }
      });
    }

    return {
      content: [
        {
          type: 'text',
          text: result + groundingInfo,
        },
      ],
    };
  }

  async handleChat(args) {
    const {
      message,
      model = 'gemini-1.5-flash',
      system_instruction,
      conversation_history = [],
    } = args;

    if (!this.apiKey) {
      throw new Error('GOOGLE_AI_STUDIO_API_KEY environment variable is required');
    }

    const contents = [...conversation_history];
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const requestBody = {
      contents,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    };

    if (system_instruction) {
      requestBody.systemInstruction = {
        parts: [{ text: system_instruction }],
      };
    }

    const response = await fetch(
      `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Google AI API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    let result = '';
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      result = data.candidates[0].content.parts
        .map(part => part.text)
        .join('');
    }

    return {
      content: [
        {
          type: 'text',
          text: result,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Google AI Studio MCP server running on stdio');
  }
}

const server = new GoogleAIStudioServer();
server.run().catch(console.error);

