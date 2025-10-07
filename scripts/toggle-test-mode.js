#!/usr/bin/env node
// scripts/toggle-test-mode.js
/**
 * Quick script to toggle test mode on/off
 * Usage: node scripts/toggle-test-mode.js [on|off]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV_FILE = path.join(__dirname, '..', '.env');
const TEST_MODE_KEY = 'VITE_ENABLE_TEST_MODE';

// Read current .env file
let envContent = '';
try {
  envContent = fs.readFileSync(ENV_FILE, 'utf8');
} catch (error) {
  console.error('❌ Error: .env file not found!');
  console.log('💡 Create a .env file first by copying .env.example');
  process.exit(1);
}

// Get command line argument
const command = process.argv[2]?.toLowerCase();

if (!command || !['on', 'off', 'status'].includes(command)) {
  console.log('Usage: node scripts/toggle-test-mode.js [on|off|status]');
  console.log('');
  console.log('Commands:');
  console.log('  on      - Enable test mode');
  console.log('  off     - Disable test mode');
  console.log('  status  - Check current status');
  process.exit(1);
}

// Check current status
const currentMatch = envContent.match(new RegExp(`${TEST_MODE_KEY}=(true|false)`));
const currentStatus = currentMatch ? currentMatch[1] : 'not set';

if (command === 'status') {
  console.log('');
  console.log('🔍 Test Mode Status:');
  console.log('═══════════════════════════════════');
  if (currentStatus === 'true') {
    console.log('✅ ENABLED - Test component will load');
  } else if (currentStatus === 'false') {
    console.log('❌ DISABLED - Normal app will load');
  } else {
    console.log('⚠️  NOT SET - Using default (disabled)');
  }
  console.log('═══════════════════════════════════');
  console.log('');
  process.exit(0);
}

// Toggle test mode
const newValue = command === 'on' ? 'true' : 'false';

if (currentStatus === newValue) {
  console.log('');
  console.log(`ℹ️  Test mode is already ${command.toUpperCase()}`);
  console.log('');
  process.exit(0);
}

// Update .env file
let newEnvContent;
if (currentMatch) {
  // Replace existing value
  newEnvContent = envContent.replace(
    new RegExp(`${TEST_MODE_KEY}=(true|false)`),
    `${TEST_MODE_KEY}=${newValue}`
  );
} else {
  // Add new line if not exists
  newEnvContent = envContent + `\n\n# Development & Testing\n${TEST_MODE_KEY}=${newValue}\n`;
}

// Write updated content
try {
  fs.writeFileSync(ENV_FILE, newEnvContent, 'utf8');
  
  console.log('');
  console.log('═══════════════════════════════════');
  if (command === 'on') {
    console.log('✅ Test Mode ENABLED');
    console.log('');
    console.log('🧪 Next steps:');
    console.log('   1. Restart dev server: npm run dev');
    console.log('   2. Look for red "TEST MODE ACTIVE" banner');
    console.log('   3. Use test buttons to verify functionality');
    console.log('');
    console.log('📖 Read TEST_MODE.md for full instructions');
  } else {
    console.log('✅ Test Mode DISABLED');
    console.log('');
    console.log('🏠 Next steps:');
    console.log('   1. Restart dev server: npm run dev');
    console.log('   2. Normal app interface will load');
  }
  console.log('═══════════════════════════════════');
  console.log('');
  
} catch (error) {
  console.error('❌ Error writing to .env file:', error.message);
  process.exit(1);
}
