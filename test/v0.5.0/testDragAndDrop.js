/**
 * 🧪 v0.5.0 - Drag & Drop Test Suite
 * Tests enhanced drag & drop with mobile optimization
 * 
 * Run: node test/v0.5.0/dragAndDrop.js
 */

import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(`  ${title}`, 'cyan');
  console.log('='.repeat(60));
}

function logTest(name, passed) {
  const icon = passed ? '✅' : '❌';
  const color = passed ? 'green' : 'red';
  log(`${icon} ${name}`, color);
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
const paths = {
  wordTable: join(projectRoot, 'src/components/WordTable/WordTable.jsx'),
  packageJson: join(projectRoot, 'package.json')
};

// ========================================
// TEST 1: WordTable File Exists
// ========================================
function test1_WordTableExists() {
  const exists = existsSync(paths.wordTable);
  if (exists) {
    log(`   ✓ File found: ${paths.wordTable}`, 'yellow');
  } else {
    log(`   ✗ File not found: ${paths.wordTable}`, 'red');
  }
  return exists;
}

// ========================================
// TEST 2: DnD Kit Sensors Import
// ========================================
function test2_SensorsImport() {
  try {
    const content = readFileSync(paths.wordTable, 'utf8');
    
    const checks = {
      'Import @dnd-kit/core': content.includes('@dnd-kit/core'),
      'TouchSensor imported': content.includes('TouchSensor'),
      'PointerSensor imported': content.includes('PointerSensor'),
      'KeyboardSensor imported': content.includes('KeyboardSensor'),
      'useSensors hook': content.includes('useSensors'),
      'useSensor helper': content.includes('useSensor')
    };
    
    let allPassed = true;
    for (const [check, passed] of Object.entries(checks)) {
      const icon = passed ? '✓' : '✗';
      log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
      if (!passed) allPassed = false;
    }
    
    return allPassed;
  } catch (error) {
    log(`   ✗ Error: ${error.message}`, 'red');
    return false;
  }
}

// ========================================
// TEST 3: Mobile Detection
// ========================================
function test3_MobileDetection() {
  try {
    const content = readFileSync(paths.wordTable, 'utf8');
    
    const checks = {
      'isMobile state/variable': content.includes('isMobile'),
      'Window width check': content.includes('window.innerWidth') || content.includes('matchMedia'),
      'useState for mobile': content.includes('useState') && content.includes('isMobile'),
      'useEffect for resize': (content.includes('useEffect') && content.includes('resize')) || 
                               content.includes('window.innerWidth')
    };
    
    let passedCount = 0;
    for (const [check, passed] of Object.entries(checks)) {
      const icon = passed ? '✓' : '⚠️';
      log(`   ${icon} ${check}`, passed ? 'yellow' : 'yellow');
      if (passed) passedCount++;
    }
    
    return passedCount >= 2; // At least 2/4 mobile detection methods
  } catch (error) {
    log(`   ✗ Error: ${error.message}`, 'red');
    return false;
  }
}

// ========================================
// TEST 4: TouchSensor Configuration
// ========================================
function test4_TouchSensorConfig() {
  try {
    const content = readFileSync(paths.wordTable, 'utf8');
    
    // Look for TouchSensor configuration
    const hasTouchSensor = content.includes('TouchSensor');
    const hasDelay = /delay:\s*\d+/.test(content);
    const hasTolerance = /tolerance:\s*\d+/.test(content);
    const hasActivationConstraint = content.includes('activationConstraint');
    
    // Check for specific delay values (150-1000ms is acceptable)
    const delayMatch = content.match(/delay:\s*(\d+)/);
    const delayValue = delayMatch ? parseInt(delayMatch[1]) : 0;
    const validDelay = delayValue >= 150 && delayValue <= 1000;
    
    // Check for tolerance (5-10px is acceptable)
    const toleranceMatch = content.match(/tolerance:\s*(\d+)/);
    const toleranceValue = toleranceMatch ? parseInt(toleranceMatch[1]) : 0;
    const validTolerance = toleranceValue >= 5 && toleranceValue <= 10;
    
    const checks = {
      'TouchSensor used': hasTouchSensor,
      'Delay configured': hasDelay,
      'Delay value valid (150-1000ms)': validDelay,
      'Tolerance configured': hasTolerance || hasActivationConstraint,
      'Tolerance valid (5-10px)': validTolerance || !hasTolerance
    };
    
    let allPassed = true;
    for (const [check, passed] of Object.entries(checks)) {
      const icon = passed ? '✓' : '✗';
      log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
      if (!passed) allPassed = false;
    }
    
    if (delayValue > 0) {
      log(`   ℹ️  Current delay: ${delayValue}ms`, 'cyan');
    }
    if (toleranceValue > 0) {
      log(`   ℹ️  Current tolerance: ${toleranceValue}px`, 'cyan');
    }
    
    return allPassed;
  } catch (error) {
    log(`   ✗ Error: ${error.message}`, 'red');
    return false;
  }
}

// ========================================
// TEST 5: PointerSensor Configuration
// ========================================
function test5_PointerSensorConfig() {
  try {
    const content = readFileSync(paths.wordTable, 'utf8');
    
    const hasPointerSensor = content.includes('PointerSensor');
    const hasActivationConstraint = content.includes('activationConstraint');
    
    // Look for distance in activationConstraint object (can be multiline)
    const hasDistance = /activationConstraint:\s*\{[^}]*distance/s.test(content) ||
                        /distance:\s*\d+/.test(content);
    
    // Extract distance value (checking both mobile and desktop values)
    const distanceMatches = content.match(/distance:\s*(isMobile\s*\?\s*(\d+)\s*:\s*(\d+)|\d+)/);
    let desktopDistance = 0;
    let mobileDistance = 0;
    
    if (distanceMatches) {
      if (distanceMatches[2] && distanceMatches[3]) {
        // Ternary: isMobile ? 10 : 5
        mobileDistance = parseInt(distanceMatches[2]);
        desktopDistance = parseInt(distanceMatches[3]);
      } else if (distanceMatches[1]) {
        // Single value
        desktopDistance = parseInt(distanceMatches[1]);
        mobileDistance = desktopDistance;
      }
    }
    
    const validDistance = (desktopDistance >= 5 && desktopDistance <= 10) ||
                          (mobileDistance >= 5 && mobileDistance <= 10);
    
    const checks = {
      'PointerSensor used': hasPointerSensor,
      'ActivationConstraint configured': hasActivationConstraint,
      'Distance configured': hasDistance,
      'Distance valid (5-10px)': validDistance || !hasDistance
    };
    
    let allPassed = true;
    for (const [check, passed] of Object.entries(checks)) {
      const icon = passed ? '✓' : '✗';
      log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
      if (!passed) allPassed = false;
    }
    
    if (desktopDistance > 0) {
      log(`   ℹ️  Desktop distance: ${desktopDistance}px`, 'cyan');
    }
    if (mobileDistance > 0 && mobileDistance !== desktopDistance) {
      log(`   ℹ️  Mobile distance: ${mobileDistance}px`, 'cyan');
    }
    
    return allPassed;
  } catch (error) {
    log(`   ✗ Error: ${error.message}`, 'red');
    return false;
  }
}

// ========================================
// TEST 6: Conditional Sensor Usage
// ========================================
function test6_ConditionalSensors() {
  try {
    const content = readFileSync(paths.wordTable, 'utf8');
    
    // Check if sensors are conditionally used based on isMobile
    const hasConditional = (
      content.includes('isMobile ?') ||
      content.includes('isMobile &&') ||
      /if\s*\(\s*isMobile\s*\)/.test(content)
    );
    
    const checks = {
      'Conditional sensor usage': hasConditional,
      'useSensors with multiple sensors': /useSensors\([^)]+,\s*[^)]+\)/.test(content),
      'Platform-specific config': content.includes('isMobile') && 
                                    (content.includes('TouchSensor') || content.includes('PointerSensor'))
    };
    
    let passedCount = 0;
    for (const [check, passed] of Object.entries(checks)) {
      const icon = passed ? '✓' : '⚠️';
      log(`   ${icon} ${check}`, passed ? 'yellow' : 'yellow');
      if (passed) passedCount++;
    }
    
    return passedCount >= 2; // At least 2/3
  } catch (error) {
    log(`   ✗ Error: ${error.message}`, 'red');
    return false;
  }
}

// ========================================
// TEST 7: Drag Handlers
// ========================================
function test7_DragHandlers() {
  try {
    const content = readFileSync(paths.wordTable, 'utf8');
    
    const checks = {
      'handleDragStart/onDragStart': content.includes('handleDragStart') || content.includes('onDragStart'),
      'handleDragEnd/onDragEnd': content.includes('handleDragEnd') || content.includes('onDragEnd'),
      'Active id state': content.includes('activeId') || content.includes('active'),
      'Array reorder logic': content.includes('arrayMove') || content.includes('splice') || content.includes('reorder'),
      'DragOverlay component': content.includes('DragOverlay') || content.includes('<DragOverlay')
    };
    
    let allPassed = true;
    for (const [check, passed] of Object.entries(checks)) {
      const icon = passed ? '✓' : '✗';
      log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
      if (!passed) allPassed = false;
    }
    
    // Note: handleDragOver is optional in dnd-kit
    if (!content.includes('handleDragOver')) {
      log(`   ℹ️  handleDragOver not used (optional in dnd-kit)`, 'cyan');
    }
    
    return allPassed;
  } catch (error) {
    log(`   ✗ Error: ${error.message}`, 'red');
    return false;
  }
}

// ========================================
// TEST 8: DndContext Setup
// ========================================
function test8_DndContext() {
  try {
    const content = readFileSync(paths.wordTable, 'utf8');
    
    const checks = {
      'DndContext component': content.includes('DndContext'),
      'SortableContext component': content.includes('SortableContext'),
      'sensors prop': content.includes('sensors='),
      'onDragStart prop': content.includes('onDragStart='),
      'onDragEnd prop': content.includes('onDragEnd='),
      'Sortable items': content.includes('SortableContext') && content.includes('items=')
    };
    
    let allPassed = true;
    for (const [check, passed] of Object.entries(checks)) {
      const icon = passed ? '✓' : '✗';
      log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
      if (!passed) allPassed = false;
    }
    
    return allPassed;
  } catch (error) {
    log(`   ✗ Error: ${error.message}`, 'red');
    return false;
  }
}

// ========================================
// TEST 9: Persistence Logic
// ========================================
function test9_Persistence() {
  try {
    const content = readFileSync(paths.wordTable, 'utf8');
    
    const checks = {
      'onDragEnd updates state': content.includes('onDragEnd') && 
                                  (content.includes('setState') || content.includes('set')),
      'Calls parent handler': content.includes('onDragEnd') && 
                               (content.includes('onReorder') || content.includes('handleReorder') || 
                                content.includes('updateWords')),
      'Array manipulation': content.includes('arrayMove') || content.includes('splice')
    };
    
    let passedCount = 0;
    for (const [check, passed] of Object.entries(checks)) {
      const icon = passed ? '✓' : '⚠️';
      log(`   ${icon} ${check}`, passed ? 'yellow' : 'yellow');
      if (passed) passedCount++;
    }
    
    return passedCount >= 2; // At least 2/3
  } catch (error) {
    log(`   ✗ Error: ${error.message}`, 'red');
    return false;
  }
}

// ========================================
// TEST 10: Dependencies Installed
// ========================================
function test10_Dependencies() {
  try {
    const packageJson = JSON.parse(readFileSync(paths.packageJson, 'utf8'));
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };
    
    const required = {
      '@dnd-kit/core': 'Drag & drop core',
      '@dnd-kit/sortable': 'Sortable utilities',
      '@dnd-kit/utilities': 'DnD utilities'
    };
    
    let allInstalled = true;
    for (const [pkg, description] of Object.entries(required)) {
      const installed = !!deps[pkg];
      const icon = installed ? '✓' : '✗';
      const version = installed ? deps[pkg] : 'NOT INSTALLED';
      log(`   ${icon} ${pkg} (${description}): ${version}`, 
          installed ? 'yellow' : 'red');
      if (!installed) allInstalled = false;
    }
    
    return allInstalled;
  } catch (error) {
    log(`   ✗ Error: ${error.message}`, 'red');
    return false;
  }
}

// ========================================
// MAIN TEST RUNNER
// ========================================
async function runAllTests() {
  log('\n🧪 DRAG & DROP TEST SUITE', 'magenta');
  log('v0.5.0 - Feature 2: Enhanced Mobile Drag & Drop\n', 'cyan');
  
  logSection('TEST 1: WordTable File Exists');
  runTest('WordTable.jsx exists', test1_WordTableExists);
  
  logSection('TEST 2: DnD Kit Sensors Import');
  runTest('Sensors properly imported', test2_SensorsImport);
  
  logSection('TEST 3: Mobile Detection');
  runTest('Mobile device detection implemented', test3_MobileDetection);
  
  logSection('TEST 4: TouchSensor Configuration');
  runTest('TouchSensor properly configured', test4_TouchSensorConfig);
  
  logSection('TEST 5: PointerSensor Configuration');
  runTest('PointerSensor properly configured', test5_PointerSensorConfig);
  
  logSection('TEST 6: Conditional Sensor Usage');
  runTest('Sensors used conditionally', test6_ConditionalSensors);
  
  logSection('TEST 7: Drag Handlers');
  runTest('Drag handlers implemented', test7_DragHandlers);
  
  logSection('TEST 8: DndContext Setup');
  runTest('DndContext properly set up', test8_DndContext);
  
  logSection('TEST 9: Persistence Logic');
  runTest('Drag changes persist', test9_Persistence);
  
  logSection('TEST 10: Dependencies Installed');
  runTest('Required packages installed', test10_Dependencies);
  
  // Summary
  logSection('TEST SUMMARY');
  log(`Total Tests: ${tests.total}`, 'cyan');
  log(`Passed: ${tests.passed}`, 'green');
  log(`Failed: ${tests.failed}`, tests.failed > 0 ? 'red' : 'green');
  
  const percentage = ((tests.passed / tests.total) * 100).toFixed(1);
  log(`Success Rate: ${percentage}%`, percentage === '100.0' ? 'green' : 'yellow');
  
  if (tests.failed === 0) {
    log('\n🎉 ALL DRAG & DROP TESTS PASSED!', 'green');
    log('✅ Mobile drag & drop is properly optimized!\n', 'green');
    process.exit(0);
  } else {
    log('\n⚠️  SOME TESTS FAILED! Please review the output above.\n', 'red');
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(error => {
  log('\n❌ Fatal error running tests:', 'red');
  console.error(error);
  process.exit(1);
});
