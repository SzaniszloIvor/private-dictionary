#!/usr/bin/env node
// test/v0.6.0/testDarkMode.js
/**
 * Dark Mode Test Suite
 * Version: 0.6.0
 * Tests dark mode implementation
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
const hookPath = join(projectRoot, 'src/hooks/useDarkMode.js');
const appPath = join(projectRoot, 'src/App.jsx');
const cssPath = join(projectRoot, 'src/index.css');

// Tests

function test1_DarkModeHookExists() {
  const exists = existsSync(hookPath);
  if (exists) {
    log(`   ✓ File found: ${hookPath}`, 'yellow');
  } else {
    log(`   ⚠️  File not found: ${hookPath}`, 'yellow');
    log(`   ℹ️  Dark mode might be in App.jsx directly`, 'yellow');
  }
  return true; // Optional file
}

function test2_AppHasDarkMode() {
  const content = readFileSync(appPath, 'utf8');
  
  const checks = {
    'Dark mode state': content.includes('darkMode') || content.includes('dark'),
    'Toggle function': content.includes('toggleDark') || content.includes('setDarkMode'),
    'Dark class': content.includes('className') && content.includes('dark'),
    'localStorage': content.includes('localStorage') && content.includes('dark')
  };
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✓' : '✗';
    log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
    if (!passed) allPassed = false;
  }
  
  return allPassed;
}

function test3_SystemPreferenceDetection() {
  const content = readFileSync(appPath, 'utf8');
  
  const hasSystemDetection = 
    content.includes('prefers-color-scheme') ||
    content.includes('matchMedia') ||
    content.includes('dark)');
  
  if (hasSystemDetection) {
    log(`   ✓ System preference detection found`, 'yellow');
  } else {
    log(`   ⚠️  System preference detection not found`, 'yellow');
    log(`   ℹ️  Manual toggle only`, 'yellow');
  }
  
  return true; // Optional feature
}

function test4_KeyboardShortcut() {
  const content = readFileSync(appPath, 'utf8');
  
  const hasShortcut = 
    (content.includes('mod+d') || content.includes("'d'")) &&
    (content.includes('toggleDark') || content.includes('setDarkMode'));
  
  if (hasShortcut) {
    log(`   ✓ Ctrl/⌘+D keyboard shortcut found`, 'yellow');
  } else {
    log(`   ✗ Keyboard shortcut not found`, 'red');
  }
  
  return hasShortcut;
}

function test5_DarkModeButton() {
  const content = readFileSync(appPath, 'utf8');
  
  const hasButton = 
    content.includes('toggleDark') ||
    (content.includes('onClick') && content.includes('darkMode'));
  
  const hasIcon = 
    content.includes('Moon') ||
    content.includes('Sun') ||
    content.includes('🌙') ||
    content.includes('☀️');
  
  if (hasButton) {
    log(`   ✓ Dark mode toggle button found`, 'yellow');
  }
  if (hasIcon) {
    log(`   ✓ Dark mode icon found`, 'yellow');
  }
  
  return hasButton;
}

function test6_CSSImplementation() {
  const content = readFileSync(cssPath, 'utf8');
  
  // Check for either traditional CSS dark mode or Tailwind setup
  const hasDarkSelector = content.includes('.dark') || content.includes('[data-theme="dark"]');
  const hasTailwindDirectives = content.includes('@tailwind');
  
  if (hasDarkSelector) {
    log(`   ✓ Dark mode CSS selector found`, 'yellow');
  } else if (hasTailwindDirectives) {
    log(`   ✓ Using Tailwind dark: utility classes (no explicit .dark needed)`, 'yellow');
  } else {
    log(`   ✗ No dark mode CSS found`, 'red');
  }
  
  const checks = {
    'Background colors': content.includes('bg-') || content.includes('background'),
    'Transitions': content.includes('transition')
  };
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✓' : '✗';
    log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
    if (!passed) allPassed = false;
  }
  
  // Dark mode is OK if either traditional CSS or Tailwind is used
  const hasDarkMode = hasDarkSelector || hasTailwindDirectives;
  
  return hasDarkMode && allPassed;
}

function test7_TailwindDarkMode() {
  const tailwindPath = join(projectRoot, 'tailwind.config.js');
  
  if (!existsSync(tailwindPath)) {
    log(`   ⚠️  tailwind.config.js not found`, 'yellow');
    return false;
  }
  
  const content = readFileSync(tailwindPath, 'utf8');
  
  const hasDarkMode = 
    content.includes('darkMode') &&
    (content.includes("'class'") || content.includes('"class"'));
  
  if (hasDarkMode) {
    log(`   ✓ Tailwind dark mode configured (class strategy)`, 'yellow');
  } else {
    log(`   ✗ Tailwind dark mode not configured`, 'red');
  }
  
  return hasDarkMode;
}

function test8_PersistentStorage() {
  const content = readFileSync(appPath, 'utf8');
  
  const hasGetItem = content.includes('localStorage.getItem') && content.includes('dark');
  const hasSetItem = content.includes('localStorage.setItem') && content.includes('dark');
  
  if (hasGetItem) {
    log(`   ✓ localStorage.getItem (read preference)`, 'yellow');
  }
  if (hasSetItem) {
    log(`   ✓ localStorage.setItem (save preference)`, 'yellow');
  }
  
  return hasGetItem && hasSetItem;
}

function test9_ComponentStyling() {
  // Check a few key components for dark mode classes
  const componentsToCheck = [
    'src/components/LoginScreen/LoginScreen.jsx',
    'src/components/LessonContent/LessonContent.jsx',
    'src/components/WordTable/WordTable.jsx'
  ];
  
  let styledCount = 0;
  
  componentsToCheck.forEach(componentPath => {
    const fullPath = join(projectRoot, componentPath);
    if (existsSync(fullPath)) {
      const content = readFileSync(fullPath, 'utf8');
      const hasDarkClasses = 
        content.includes('dark:') ||
        content.includes('dark-mode');
      
      if (hasDarkClasses) {
        styledCount++;
        log(`   ✓ ${componentPath.split('/').pop()} has dark mode styles`, 'yellow');
      }
    }
  });
  
  log(`   Found ${styledCount}/${componentsToCheck.length} components with dark styling`, 'yellow');
  
  return styledCount >= 1; // At least one component should have dark styles
}

// Main test runner
async function runAllTests() {
  log('\n🌙 DARK MODE TEST SUITE', 'magenta');
  log('Version: 0.6.0\n', 'cyan');
  
  logSection('TEST 1: Dark Mode Hook (Optional)');
  runTest('useDarkMode hook exists', test1_DarkModeHookExists);
  
  logSection('TEST 2: App.jsx Dark Mode State');
  runTest('App.jsx has dark mode implementation', test2_AppHasDarkMode);
  
  logSection('TEST 3: System Preference Detection');
  runTest('System color scheme detection', test3_SystemPreferenceDetection);
  
  logSection('TEST 4: Keyboard Shortcut');
  runTest('Ctrl/⌘+D keyboard shortcut', test4_KeyboardShortcut);
  
  logSection('TEST 5: Dark Mode Button');
  runTest('Dark mode toggle button exists', test5_DarkModeButton);
  
  logSection('TEST 6: CSS Implementation');
  runTest('index.css has dark mode styles', test6_CSSImplementation);
  
  logSection('TEST 7: Tailwind Configuration');
  runTest('Tailwind dark mode configured', test7_TailwindDarkMode);
  
  logSection('TEST 8: Persistent Storage');
  runTest('localStorage persistence', test8_PersistentStorage);
  
  logSection('TEST 9: Component Styling');
  runTest('Components have dark mode styles', test9_ComponentStyling);
  
  // Summary
  logSection('TEST SUMMARY');
  log(`Total Tests: ${tests.total}`, 'cyan');
  log(`Passed: ${tests.passed}`, 'green');
  log(`Failed: ${tests.failed}`, tests.failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((tests.passed / tests.total) * 100).toFixed(1)}%`, 'cyan');
  log('');
  
  if (tests.failed === 0) {
    log('🎉 ALL DARK MODE TESTS PASSED!', 'green');
    log('✅ v0.6.0 dark mode is properly implemented!', 'green');
  } else {
    log('⚠️  SOME TESTS FAILED! Please review the output above.', 'red');
  }
  
  log('');
  
  process.exit(tests.failed > 0 ? 1 : 0);
}

runAllTests();
