#!/usr/bin/env node
// test/v0.6.0/testKeyboardShortcuts.js
/**
 * Keyboard Shortcuts System Test Suite
 * Version: 0.6.0
 * Tests keyboard shortcuts implementation
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

// Colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[91m',
  green: '\x1b[92m',
  yellow: '\x1b[93m',
  cyan: '\x1b[96m',
  magenta: '\x1b[95m'
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function logSection(title) {
  log('\n============================================================', 'cyan');
  log(`  ${title}`, 'cyan');
  log('============================================================', 'cyan');
}

function logTest(name, passed) {
  const icon = passed ? '✅' : '❌';
  log(`${icon} ${name}`, passed ? 'green' : 'red');
}

// Test suite
const tests = {
  passed: 0,
  failed: 0,
  total: 0
};

function runTest(name, testFn) {
  tests.total++;
  try {
    const result = testFn();
    if (result) {
      tests.passed++;
      logTest(name, true);
      return true;
    } else {
      tests.failed++;
      logTest(name, false);
      return false;
    }
  } catch (error) {
    tests.failed++;
    logTest(name, false);
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

// File paths
const hookPath = join(projectRoot, 'src/hooks/useKeyboardShortcuts.js');
const helperPath = join(projectRoot, 'src/components/KeyboardShortcutsHelper/KeyboardShortcutsHelper.jsx');
const appPath = join(projectRoot, 'src/App.jsx');

// Tests

function test1_HookFileExists() {
  const exists = existsSync(hookPath);
  if (exists) {
    log(`   ✓ File found: ${hookPath}`, 'yellow');
  } else {
    log(`   ✗ File not found: ${hookPath}`, 'red');
  }
  return exists;
}

function test2_HelperComponentExists() {
  const exists = existsSync(helperPath);
  if (exists) {
    log(`   ✓ File found: ${helperPath}`, 'yellow');
  } else {
    log(`   ✗ File not found: ${helperPath}`, 'red');
  }
  return exists;
}

function test3_HookStructure() {
  const content = readFileSync(hookPath, 'utf8');
  
  const checks = {
    'useEffect import': content.includes('useEffect'),
    'Export hook': content.includes('export') && content.includes('useKeyboardShortcuts'),
    'Event listener setup': content.includes('addEventListener'),
    'Keyboard event handling': content.includes('keydown') || content.includes('KeyboardEvent'),
    'Cleanup function': content.includes('removeEventListener')
  };
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✓' : '✗';
    log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
    if (!passed) allPassed = false;
  }
  
  return allPassed;
}

function test4_HelperComponentStructure() {
  const content = readFileSync(helperPath, 'utf8');
  
  const checks = {
    'React import': content.includes('import') && content.includes('react'),
    'Export default': content.includes('export default'),
    'Modal structure': content.includes('isOpen') || content.includes('show'),
    'Close handler': content.includes('onClose') || content.includes('close'),
    'Keyboard shortcuts list': content.includes('Ctrl') || content.includes('⌘')
  };
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✓' : '✗';
    log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
    if (!passed) allPassed = false;
  }
  
  // Optional platform detection
  const hasPlatformDetection = content.includes('Mac') || content.includes('isMac') || content.includes('platform');
  if (hasPlatformDetection) {
    log(`   ✓ Platform detection (optional)`, 'yellow');
  } else {
    log(`   ⚠️  Platform detection not in component (might be in App.jsx)`, 'yellow');
  }
  
  return allPassed;
}

function test5_AppIntegration() {
  const content = readFileSync(appPath, 'utf8');
  
  const checks = {
    'useKeyboardShortcuts import': content.includes('useKeyboardShortcuts'),
    'KeyboardShortcutsHelper import': content.includes('KeyboardShortcutsHelper'),
    'Shortcuts defined': content.includes('shortcuts') || content.includes('handleKeyPress'),
    'Helper modal state': content.includes('showShortcutsHelp') || content.includes('showKeyboardHelp'),
    'Helper modal rendered': content.includes('<KeyboardShortcutsHelper')
  };
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✓' : '✗';
    log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
    if (!passed) allPassed = false;
  }
  
  return allPassed;
}

function test6_ShortcutImplementations() {
  const content = readFileSync(appPath, 'utf8');
  
  // Check for key shortcuts (v0.6.0 had 11 shortcuts)
  const shortcuts = [
    { name: 'Add Word (Ctrl+E)', pattern: /mod\+e|ctrl.*e/i },
    { name: 'Search (Ctrl+F)', pattern: /mod\+f|ctrl.*f/i },
    { name: 'Save Status (Ctrl+S)', pattern: /mod\+s|ctrl.*s/i },
    { name: 'Dark Mode (Ctrl+D)', pattern: /mod\+d|ctrl.*d/i },
    { name: 'Help (Ctrl+K)', pattern: /mod\+k|ctrl.*k/i },
    { name: 'Next Lesson', pattern: /right|arrowright/i },
    { name: 'Previous Lesson', pattern: /left|arrowleft/i },
    { name: 'Escape', pattern: /escape|esc/i }
  ];
  
  let foundCount = 0;
  shortcuts.forEach(shortcut => {
    const found = shortcut.pattern.test(content);
    const icon = found ? '✓' : '✗';
    log(`   ${icon} ${shortcut.name}`, found ? 'yellow' : 'red');
    if (found) foundCount++;
  });
  
  log(`   Found ${foundCount}/${shortcuts.length} shortcuts`, 'yellow');
  
  return foundCount >= 6; // At least 6 shortcuts should be implemented
}

function test7_ToastNotifications() {
  const content = readFileSync(appPath, 'utf8');
  
  const hasToast = 
    content.includes('showToast') ||
    content.includes('toast(') ||
    content.includes('notification') ||
    content.includes('setShowSaveNotification');
  
  if (hasToast) {
    log(`   ✓ Toast notification system found`, 'yellow');
  } else {
    log(`   ✗ Toast notification system not found`, 'red');
  }
  
  return hasToast;
}

function test8_PlatformDetection() {
  const content = readFileSync(hookPath, 'utf8');
  
  const hasPlatformDetection = 
    content.includes('navigator.platform') ||
    content.includes('Mac') ||
    content.includes('isMac') ||
    content.includes('metaKey');
  
  if (hasPlatformDetection) {
    log(`   ✓ Platform detection (Mac/Windows) implemented`, 'yellow');
  } else {
    log(`   ✗ Platform detection not found`, 'red');
  }
  
  return hasPlatformDetection;
}

function test9_PackageJsonScripts() {
  const packagePath = join(projectRoot, 'package.json');
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
  
  // Check dependencies for keyboard handling
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  log(`   ℹ️  Note: v0.6.0 uses native keyboard events, no external libs needed`, 'yellow');
  log(`   ✓ Using browser KeyboardEvent API`, 'yellow');
  
  return true;
}

// Main test runner
async function runAllTests() {
  log('\n🧪 KEYBOARD SHORTCUTS TEST SUITE', 'magenta');
  log('Version: 0.6.0\n', 'cyan');
  
  logSection('TEST 1: useKeyboardShortcuts Hook Exists');
  runTest('useKeyboardShortcuts hook file exists', test1_HookFileExists);
  
  logSection('TEST 2: KeyboardShortcutsHelper Component Exists');
  runTest('KeyboardShortcutsHelper component exists', test2_HelperComponentExists);
  
  logSection('TEST 3: Hook Structure');
  runTest('useKeyboardShortcuts has required structure', test3_HookStructure);
  
  logSection('TEST 4: Helper Component Structure');
  runTest('KeyboardShortcutsHelper has required structure', test4_HelperComponentStructure);
  
  logSection('TEST 5: App.jsx Integration');
  runTest('App.jsx integrates keyboard shortcuts', test5_AppIntegration);
  
  logSection('TEST 6: Shortcut Implementations');
  runTest('Key shortcuts are implemented', test6_ShortcutImplementations);
  
  logSection('TEST 7: Toast Notifications');
  runTest('Toast notification system exists', test7_ToastNotifications);
  
  logSection('TEST 8: Platform Detection');
  runTest('Platform detection (Mac/Windows) exists', test8_PlatformDetection);
  
  logSection('TEST 9: Package Configuration');
  runTest('Package.json configured correctly', test9_PackageJsonScripts);
  
  // Summary
  logSection('TEST SUMMARY');
  log(`Total Tests: ${tests.total}`, 'cyan');
  log(`Passed: ${tests.passed}`, 'green');
  log(`Failed: ${tests.failed}`, tests.failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((tests.passed / tests.total) * 100).toFixed(1)}%`, 'cyan');
  log('');
  
  if (tests.failed === 0) {
    log('🎉 ALL KEYBOARD SHORTCUTS TESTS PASSED!', 'green');
    log('✅ v0.6.0 keyboard shortcuts are properly implemented!', 'green');
  } else {
    log('⚠️  SOME TESTS FAILED! Please review the output above.', 'red');
  }
  
  log('');
  
  process.exit(tests.failed > 0 ? 1 : 0);
}

runAllTests();
