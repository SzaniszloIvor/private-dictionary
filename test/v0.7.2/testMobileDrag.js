#!/usr/bin/env node
// test/v0.7.2/testMobileDrag.js
/**
 * Mobile Drag & Drop Test Suite - v0.7.2
 * Tests the critical bug fix for mobile drag & drop
 * Bug: PointerSensor was active on mobile, conflicting with TouchSensor
 * Fix: Platform-specific sensors
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

// ========================================
// TEST 1: WordTable File Exists
// ========================================
function test1_FileExists() {
  const exists = existsSync(wordTablePath);
  if (!exists) {
    log(`   ✗ File not found: ${wordTablePath}`, 'red');
  }
  return exists;
}

// ========================================
// TEST 2: Sensors Import
// ========================================
function test2_SensorsImport() {
  const content = readFileSync(wordTablePath, 'utf8');
  
  const checks = {
    'PointerSensor imported': content.includes('PointerSensor'),
    'TouchSensor imported': content.includes('TouchSensor'),
    'useSensor imported': content.includes('useSensor'),
    'useSensors imported': content.includes('useSensors')
  };
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✓' : '✗';
    log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
    if (!passed) allPassed = false;
  }
  
  return allPassed;
}

// ========================================
// TEST 3: Mobile Detection
// ========================================
function test3_MobileDetection() {
  const content = readFileSync(wordTablePath, 'utf8');
  
  const hasMobile = content.includes('isMobile');
  const hasWindowWidth = content.includes('window.innerWidth') || content.includes('matchMedia');
  
  const checks = {
    'isMobile variable exists': hasMobile,
    'Window width detection': hasWindowWidth
  };
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✓' : '✗';
    log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
    if (!passed) allPassed = false;
  }
  
  return allPassed;
}

// ========================================
// TEST 4: Platform-Specific Sensors (CRITICAL)
// ========================================
function test4_PlatformSpecificSensors() {
  const content = readFileSync(wordTablePath, 'utf8');
  
  // Check that PointerSensor is ONLY used on desktop (!isMobile)
  const pointerSensorPattern = /useSensor\s*\(\s*PointerSensor/;
  const pointerSensorMatch = content.match(pointerSensorPattern);
  
  // Check that PointerSensor is wrapped in !isMobile condition
  const desktopOnlyPointer = /\.\.\.?\s*\(\s*!isMobile[^}]*useSensor\s*\(\s*PointerSensor/s.test(content);
  
  // Check that TouchSensor is wrapped in isMobile condition  
  const mobileOnlyTouch = /\.\.\.?\s*\(\s*isMobile[^}]*useSensor\s*\(\s*TouchSensor/s.test(content);
  
  // CRITICAL: PointerSensor should NOT be active on mobile
  const pointerNotConditional = pointerSensorMatch && !desktopOnlyPointer;
  
  const checks = {
    'PointerSensor desktop only (!isMobile)': desktopOnlyPointer,
    'TouchSensor mobile only (isMobile)': mobileOnlyTouch,
    'PointerSensor NOT active on mobile': !pointerNotConditional
  };
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✓' : '✗';
    log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
    if (!passed) {
      allPassed = false;
      if (check.includes('NOT active')) {
        log(`   ⚠️  BUG: PointerSensor is active on mobile, causing conflict!`, 'red');
      }
    }
  }
  
  return allPassed;
}

// ========================================
// TEST 5: TouchSensor Configuration
// ========================================
function test5_TouchSensorConfig() {
  const content = readFileSync(wordTablePath, 'utf8');
  
  // Extract TouchSensor delay and tolerance
  const touchSensorSection = content.match(/TouchSensor[^}]+activationConstraint[^}]+\}/s);
  
  if (!touchSensorSection) {
    log(`   ✗ TouchSensor configuration not found`, 'red');
    return false;
  }
  
  const delayMatch = touchSensorSection[0].match(/delay:\s*(\d+)/);
  const toleranceMatch = touchSensorSection[0].match(/tolerance:\s*(\d+)/);
  
  const delay = delayMatch ? parseInt(delayMatch[1]) : 0;
  const tolerance = toleranceMatch ? parseInt(toleranceMatch[1]) : 0;
  
  // Acceptable ranges
  const delayOK = delay >= 500 && delay <= 1500; // 0.5-1.5 seconds
  const toleranceOK = tolerance >= 3 && tolerance <= 10; // 3-10px
  
  const checks = {
    'TouchSensor has delay': delay > 0,
    'Delay in acceptable range (500-1500ms)': delayOK,
    'TouchSensor has tolerance': tolerance > 0,
    'Tolerance in acceptable range (3-10px)': toleranceOK
  };
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✓' : '✗';
    log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
    if (!passed) allPassed = false;
  }
  
  if (delay > 0) log(`   ℹ️  Current delay: ${delay}ms`, 'cyan');
  if (tolerance > 0) log(`   ℹ️  Current tolerance: ${tolerance}px`, 'cyan');
  
  return allPassed;
}

// ========================================
// TEST 6: PointerSensor Configuration
// ========================================
function test6_PointerSensorConfig() {
  const content = readFileSync(wordTablePath, 'utf8');
  
  const pointerSensorSection = content.match(/PointerSensor[^}]+activationConstraint[^}]+\}/s);
  
  if (!pointerSensorSection) {
    log(`   ✗ PointerSensor configuration not found`, 'red');
    return false;
  }
  
  const distanceMatch = pointerSensorSection[0].match(/distance:\s*(\d+)/);
  const distance = distanceMatch ? parseInt(distanceMatch[1]) : 0;
  
  const distanceOK = distance >= 5 && distance <= 10; // 5-10px
  
  const checks = {
    'PointerSensor has distance': distance > 0,
    'Distance in acceptable range (5-10px)': distanceOK
  };
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✓' : '✗';
    log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
    if (!passed) allPassed = false;
  }
  
  if (distance > 0) log(`   ℹ️  Current distance: ${distance}px`, 'cyan');
  
  return allPassed;
}

// ========================================
// TEST 7: KeyboardSensor (Both Platforms)
// ========================================
function test7_KeyboardSensor() {
  const content = readFileSync(wordTablePath, 'utf8');
  
  const hasKeyboardSensor = content.includes('KeyboardSensor');
  const notConditional = !(/\.\.\.?\s*\(\s*[!]?isMobile[^}]*KeyboardSensor/s.test(content));
  
  const checks = {
    'KeyboardSensor exists': hasKeyboardSensor,
    'KeyboardSensor not platform-specific': notConditional
  };
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✓' : '✗';
    log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
    if (!passed) allPassed = false;
  }
  
  return allPassed;
}

// ========================================
// TEST 8: Sensor Conflict Check
// ========================================
function test8_SensorConflictCheck() {
  const content = readFileSync(wordTablePath, 'utf8');
  
  // Extract the entire sensors configuration
  const sensorsMatch = content.match(/const\s+sensors\s*=\s*useSensors\s*\([^;]+\);/s);
  
  if (!sensorsMatch) {
    log(`   ✗ sensors configuration not found`, 'red');
    return false;
  }
  
  const sensorsConfig = sensorsMatch[0];
  
  // Check for bad patterns
  const badPatterns = {
    'PointerSensor with ternary (isMobile ? x : y)': /PointerSensor[^}]+isMobile\s*\?/s.test(sensorsConfig),
    'PointerSensor outside conditional spread': /useSensor\s*\(\s*PointerSensor[^)]+\)[^,]*,\s*useSensor/s.test(sensorsConfig) && !/!isMobile/.test(sensorsConfig)
  };
  
  let allPassed = true;
  for (const [check, hasBadPattern] of Object.entries(badPatterns)) {
    const passed = !hasBadPattern;
    const icon = passed ? '✓' : '✗';
    log(`   ${icon} No ${check}`, passed ? 'yellow' : 'red');
    if (!passed) {
      allPassed = false;
      log(`   ⚠️  This pattern causes mobile drag conflicts!`, 'red');
    }
  }
  
  return allPassed;
}

// ========================================
// MAIN TEST RUNNER
// ========================================
async function runAllTests() {
  log('\n🐛 MOBILE DRAG & DROP BUG FIX TEST SUITE', 'magenta');
  log('v0.7.2 - Critical Fix: Platform-Specific Sensors\n', 'cyan');
  
  logSection('TEST 1: File Existence');
  runTest('WordTable.jsx exists', test1_FileExists);
  
  logSection('TEST 2: Sensors Import');
  runTest('All sensors imported', test2_SensorsImport);
  
  logSection('TEST 3: Mobile Detection');
  runTest('Mobile device detection', test3_MobileDetection);
  
  logSection('TEST 4: Platform-Specific Sensors (CRITICAL)');
  runTest('PointerSensor desktop only, TouchSensor mobile only', test4_PlatformSpecificSensors);
  
  logSection('TEST 5: TouchSensor Configuration');
  runTest('TouchSensor properly configured for mobile', test5_TouchSensorConfig);
  
  logSection('TEST 6: PointerSensor Configuration');
  runTest('PointerSensor properly configured for desktop', test6_PointerSensorConfig);
  
  logSection('TEST 7: KeyboardSensor');
  runTest('KeyboardSensor available on both platforms', test7_KeyboardSensor);
  
  logSection('TEST 8: Sensor Conflict Check');
  runTest('No sensor conflicts detected', test8_SensorConflictCheck);
  
  // Summary
  logSection('TEST SUMMARY');
  log(`Total Tests: ${tests.total}`, 'cyan');
  log(`Passed: ${tests.passed}`, 'green');
  log(`Failed: ${tests.failed}`, tests.failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((tests.passed / tests.total) * 100).toFixed(1)}%`, 'cyan');
  log('');
  
  if (tests.failed === 0) {
    log('🎉 ALL TESTS PASSED! Mobile drag & drop should work correctly!', 'green');
    log('');
    log('✅ Bug Fix Verified:', 'green');
    log('   - PointerSensor active ONLY on desktop', 'green');
    log('   - TouchSensor active ONLY on mobile', 'green');
    log('   - No sensor conflicts', 'green');
    log('');
  } else {
    log('❌ TESTS FAILED! Mobile drag & drop may not work correctly.', 'red');
    log('');
    log('🔧 To fix:', 'yellow');
    log('   1. Ensure PointerSensor is wrapped in ...(!isMobile ? [...] : [])', 'yellow');
    log('   2. Ensure TouchSensor is wrapped in ...(isMobile ? [...] : [])', 'yellow');
    log('   3. KeyboardSensor should NOT be platform-specific', 'yellow');
    log('');
  }
  
  process.exit(tests.failed > 0 ? 1 : 0);
}

runAllTests();
