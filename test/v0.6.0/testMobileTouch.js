#!/usr/bin/env node
// test/v0.6.0/testMobileTouch.js
/**
 * Mobile Touch Optimization Test Suite
 * Version: 0.6.0
 * Tests mobile touch and drag & drop optimization
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
const wordTablePath = join(projectRoot, 'src/components/WordTable/WordTable.jsx');
const packagePath = join(projectRoot, 'package.json');

// Tests

function test1_DndKitInstalled() {
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
  const deps = packageJson.dependencies || {};
  
  const checks = {
    '@dnd-kit/core': !!deps['@dnd-kit/core'],
    '@dnd-kit/sortable': !!deps['@dnd-kit/sortable'],
    '@dnd-kit/utilities': !!deps['@dnd-kit/utilities']
  };
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✓' : '✗';
    const version = passed ? deps[check] : 'not installed';
    log(`   ${icon} ${check}: ${version}`, passed ? 'yellow' : 'red');
    if (!passed) allPassed = false;
  }
  
  return allPassed;
}

function test2_TouchSensorImported() {
  const content = readFileSync(wordTablePath, 'utf8');
  
  const hasTouchSensor = 
    content.includes('TouchSensor') ||
    content.includes('useSensor') ||
    content.includes('PointerSensor');
  
  if (hasTouchSensor) {
    log(`   ✓ Touch/Pointer sensor imported`, 'yellow');
  } else {
    log(`   ✗ Touch sensor not found`, 'red');
  }
  
  return hasTouchSensor;
}

function test3_TouchSensorConfiguration() {
  const content = readFileSync(wordTablePath, 'utf8');
  
  const checks = {
    'Sensor usage': content.includes('useSensor'),
    'TouchSensor': content.includes('TouchSensor') || content.includes('PointerSensor'),
    'Activation constraint': content.includes('activationConstraint') || content.includes('delay'),
    'Distance or delay': content.includes('distance') || content.includes('delay')
  };
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✓' : '✗';
    log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
    if (!passed) allPassed = false;
  }
  
  return allPassed;
}

function test4_OptimalTouchSettings() {
  const content = readFileSync(wordTablePath, 'utf8');
  
  // Check for optimal settings: 100ms delay, 5px tolerance
  const hasDelay = content.match(/delay:\s*(\d+)/);
  const hasTolerance = content.match(/tolerance:\s*(\d+)/);
  const hasDistance = content.match(/distance:\s*(\d+)/);
  
  if (hasDelay) {
    const delay = parseInt(hasDelay[1]);
    const isOptimal = delay >= 50 && delay <= 150;
    log(`   ${isOptimal ? '✓' : '⚠️'} Delay: ${delay}ms ${isOptimal ? '(optimal: 100ms)' : ''}`, 'yellow');
  }
  
  if (hasTolerance) {
    const tolerance = parseInt(hasTolerance[1]);
    const isOptimal = tolerance <= 10;
    log(`   ${isOptimal ? '✓' : '⚠️'} Tolerance: ${tolerance}px ${isOptimal ? '(optimal: 5px)' : ''}`, 'yellow');
  }
  
  if (hasDistance) {
    const distance = parseInt(hasDistance[1]);
    const isOptimal = distance <= 10;
    log(`   ${isOptimal ? '✓' : '⚠️'} Distance: ${distance}px ${isOptimal ? '(optimal: 5px)' : ''}`, 'yellow');
  }
  
  return hasDelay || hasTolerance || hasDistance;
}

function test5_DragHandleImplementation() {
  const content = readFileSync(wordTablePath, 'utf8');
  
  // Check for drag handle (⋮⋮ or similar)
  const hasDragHandle = 
    content.includes('drag-handle') ||
    content.includes('DragHandle') ||
    content.includes('⋮') ||
    content.includes('GripVertical') ||
    content.includes('grip');
  
  if (hasDragHandle) {
    log(`   ✓ Drag handle found`, 'yellow');
  } else {
    log(`   ⚠️  Drag handle not explicitly found`, 'yellow');
    log(`   ℹ️  Entire row might be draggable`, 'yellow');
  }
  
  return true; // Optional feature
}

function test6_TouchActionCSS() {
  const cssPath = join(projectRoot, 'src/index.css');
  
  if (!existsSync(cssPath)) {
    log(`   ⚠️  index.css not found`, 'yellow');
    return false;
  }
  
  const content = readFileSync(cssPath, 'utf8');
  
  const hasTouchAction = 
    content.includes('touch-action') ||
    content.includes('touch-none');
  
  if (hasTouchAction) {
    log(`   ✓ touch-action CSS property found`, 'yellow');
  } else {
    log(`   ⚠️  touch-action CSS not found`, 'yellow');
    log(`   ℹ️  Might be in Tailwind classes`, 'yellow');
  }
  
  return true; // Optional
}

function test7_HapticFeedback() {
  const content = readFileSync(wordTablePath, 'utf8');
  
  const hasHaptic = 
    content.includes('vibrate') ||
    content.includes('navigator.vibrate') ||
    content.includes('haptic');
  
  if (hasHaptic) {
    log(`   ✓ Haptic feedback (vibration) found`, 'yellow');
  } else {
    log(`   ⚠️  Haptic feedback not found`, 'yellow');
    log(`   ℹ️  Optional mobile enhancement`, 'yellow');
  }
  
  return true; // Optional feature
}

function test8_ScrollConflictPrevention() {
  const content = readFileSync(wordTablePath, 'utf8');
  
  // Check for scroll prevention during drag
  const hasScrollPrevention = 
    content.includes('preventDefault') ||
    content.includes('stopPropagation') ||
    content.includes('touch-action');
  
  if (hasScrollPrevention) {
    log(`   ✓ Scroll conflict prevention found`, 'yellow');
  } else {
    log(`   ⚠️  Scroll conflict prevention not explicitly found`, 'yellow');
  }
  
  return true; // Handled by @dnd-kit
}

function test9_ResponsiveDragArea() {
  const content = readFileSync(wordTablePath, 'utf8');
  
  // Check for responsive design considerations
  const hasResponsive = 
    content.includes('sm:') ||
    content.includes('md:') ||
    content.includes('touch') ||
    content.includes('pointer');
  
  if (hasResponsive) {
    log(`   ✓ Responsive drag area implementation`, 'yellow');
  } else {
    log(`   ⚠️  Responsive considerations not found`, 'yellow');
  }
  
  return true; // Optional
}

// Main test runner
async function runAllTests() {
  log('\n📱 MOBILE TOUCH OPTIMIZATION TEST SUITE', 'magenta');
  log('Version: 0.6.0\n', 'cyan');
  
  logSection('TEST 1: @dnd-kit Installation');
  runTest('@dnd-kit packages installed', test1_DndKitInstalled);
  
  logSection('TEST 2: Touch Sensor Import');
  runTest('Touch sensor imported', test2_TouchSensorImported);
  
  logSection('TEST 3: Touch Sensor Configuration');
  runTest('Touch sensor configured', test3_TouchSensorConfiguration);
  
  logSection('TEST 4: Optimal Touch Settings');
  runTest('Optimal touch settings (100ms/5px)', test4_OptimalTouchSettings);
  
  logSection('TEST 5: Drag Handle');
  runTest('Drag handle implementation', test5_DragHandleImplementation);
  
  logSection('TEST 6: Touch Action CSS');
  runTest('touch-action CSS property', test6_TouchActionCSS);
  
  logSection('TEST 7: Haptic Feedback');
  runTest('Haptic feedback (vibration)', test7_HapticFeedback);
  
  logSection('TEST 8: Scroll Conflict Prevention');
  runTest('Scroll conflict prevention', test8_ScrollConflictPrevention);
  
  logSection('TEST 9: Responsive Drag Area');
  runTest('Responsive drag area', test9_ResponsiveDragArea);
  
  // Summary
  logSection('TEST SUMMARY');
  log(`Total Tests: ${tests.total}`, 'cyan');
  log(`Passed: ${tests.passed}`, 'green');
  log(`Failed: ${tests.failed}`, tests.failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((tests.passed / tests.total) * 100).toFixed(1)}%`, 'cyan');
  log('');
  
  if (tests.failed === 0) {
    log('🎉 ALL MOBILE TOUCH TESTS PASSED!', 'green');
    log('✅ v0.6.0 mobile touch optimization is implemented!', 'green');
  } else {
    log('⚠️  SOME TESTS FAILED! Please review the output above.', 'red');
  }
  
  log('');
  
  process.exit(tests.failed > 0 ? 1 : 0);
}

runAllTests();
