#!/usr/bin/env node

/**
 * Test script for Google AI Studio MCP Server
 * This script tests the MCP server functionality without requiring a full MCP client
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class MCPTester {
  constructor() {
    this.serverPath = join(__dirname, 'mcp-google-ai-studio.js');
    this.testResults = [];
  }

  async runTest(testName, testFunction) {
    console.log(`🧪 Running test: ${testName}`);
    try {
      const result = await testFunction();
      console.log(`✅ ${testName}: PASSED`);
      this.testResults.push({ name: testName, status: 'PASSED', result });
      return result;
    } catch (error) {
      console.log(`❌ ${testName}: FAILED - ${error.message}`);
      this.testResults.push({ name: testName, status: 'FAILED', error: error.message });
      return null;
    }
  }

  async testServerStartup() {
    return new Promise((resolve, reject) => {
      const serverPath = join(__dirname, 'mcp-server', 'mcp-google-ai-studio.js');
      const server = spawn('node', [serverPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, GOOGLE_AI_STUDIO_API_KEY: 'test-key' }
      });

      let output = '';
      let errorOutput = '';

      server.stdout.on('data', (data) => {
        output += data.toString();
      });

      server.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      server.on('error', (error) => {
        reject(new Error(`Server failed to start: ${error.message}`));
      });

      // Give server time to start
      setTimeout(() => {
        server.kill();
        if (errorOutput.includes('Google AI Studio MCP server running')) {
          resolve('Server started successfully');
        } else {
          reject(new Error('Server did not start properly'));
        }
      }, 2000);
    });
  }

  async testEnvironmentVariables() {
    if (!process.env.GOOGLE_AI_STUDIO_API_KEY) {
      throw new Error('GOOGLE_AI_STUDIO_API_KEY environment variable not set');
    }
    return 'Environment variables configured correctly';
  }

  async testDependencies() {
    try {
      // Check if the MCP server directory exists and has dependencies
      const fs = await import('fs');
      const path = await import('path');
      
      const mcpServerDir = path.join(__dirname, 'mcp-server');
      const packageJsonPath = path.join(mcpServerDir, 'package.json');
      const nodeModulesPath = path.join(mcpServerDir, 'node_modules');
      
      if (!fs.existsSync(packageJsonPath)) {
        throw new Error('MCP server package.json not found. Run setup-mcp-server.sh first.');
      }
      
      if (!fs.existsSync(nodeModulesPath)) {
        throw new Error('Dependencies not installed. Run npm install in mcp-server directory.');
      }
      
      return 'All dependencies available';
    } catch (error) {
      throw new Error(`Missing dependencies: ${error.message}`);
    }
  }

  async testAPIConnectivity() {
    // This would require a real API key, so we'll just check the structure
    const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
    if (!apiKey || apiKey === 'test-key' || apiKey === 'your_api_key_here') {
      return 'API key not configured (using test mode)';
    }
    
    // Test actual API call if key is provided
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Hello, this is a test.' }] }],
            generationConfig: { maxOutputTokens: 10 }
          })
        }
      );
      
      if (response.ok) {
        return 'API connectivity confirmed';
      } else {
        throw new Error(`API error: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`API test failed: ${error.message}`);
    }
  }

  async runAllTests() {
    console.log('🚀 Starting MCP Server Tests\n');

    await this.runTest('Dependencies Check', () => this.testDependencies());
    await this.runTest('Environment Variables', () => this.testEnvironmentVariables());
    await this.runTest('Server Startup', () => this.testServerStartup());
    await this.runTest('API Connectivity', () => this.testAPIConnectivity());

    this.printSummary();
  }

  printSummary() {
    console.log('\n📊 Test Summary:');
    console.log('================');
    
    const passed = this.testResults.filter(r => r.status === 'PASSED').length;
    const failed = this.testResults.filter(r => r.status === 'FAILED').length;
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${Math.round((passed / this.testResults.length) * 100)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults
        .filter(r => r.status === 'FAILED')
        .forEach(test => {
          console.log(`  - ${test.name}: ${test.error}`);
        });
    }
    
    console.log('\n💡 Next Steps:');
    if (failed === 0) {
      console.log('🎉 All tests passed! Your MCP server is ready to use.');
      console.log('📖 See MCP-SERVER-README.md for configuration instructions.');
    } else {
      console.log('🔧 Fix the failed tests before using the MCP server.');
      console.log('📖 Check MCP-SERVER-README.md for troubleshooting tips.');
    }
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new MCPTester();
  tester.runAllTests().catch(console.error);
}

export { MCPTester };
