#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test the MCP server
async function testMCPServer() {
  console.log('Testing AGNO MCP Server...\n');

  const serverProcess = spawn('node', [join(__dirname, 'dist/index.js')], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let output = '';
  let errorOutput = '';

  serverProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  serverProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  serverProcess.on('close', (code) => {
    console.log('Server process closed with code:', code);
    console.log('Output:', output);
    console.log('Error output:', errorOutput);
  });

  // Send a simple test request
  const testRequest = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list",
    params: {}
  };

  serverProcess.stdin.write(JSON.stringify(testRequest) + '\n');

  // Wait a bit then close
  setTimeout(() => {
    serverProcess.kill();
  }, 2000);
}

testMCPServer().catch(console.error); 