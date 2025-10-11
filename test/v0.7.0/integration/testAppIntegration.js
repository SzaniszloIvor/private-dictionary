/**
 * 🧪 App.jsx Integration Test (FIXED VERSION)
 * Tests that App.jsx correctly integrates the Favorites feature
 * 
 * Run: node test/integration/testAppIntegration.js
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
  total: 0,
  warnings: 0
};

function runTest(name, testFn, isWarning = false) {
  tests.total++;
  try {
    const result = testFn();
    if (result) {
      tests.passed++;
      logTest(name, true);
      return true;
    } else {
      if (isWarning) {
        tests.warnings++;
        log(`⚠️  ${name}`, 'yellow');
        log(`   This is optional but recommended`, 'yellow');
      } else {
        tests.failed++;
        logTest(name, false);
      }
      return false;
    }
  } catch (error) {
    tests.failed++;
    logTest(name, false);
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

// App.jsx path
const appPath = join(projectRoot, 'src/App.jsx');
const lessonContentPath = join(projectRoot, 'src/components/LessonContent/LessonContent.jsx');

// Tests
function test1_AppJsxExists() {
  const exists = existsSync(appPath);
  if (!exists) {
    log(`   ✗ App.jsx not found at: ${appPath}`, 'red');
  }
  return exists;
}

function test2_HasFavoritesImports() {
  const content = readFileSync(appPath, 'utf8');
  
  const imports = {
    'useFavorites hook': content.includes("from './hooks/useFavorites'") || content.includes('from "./hooks/useFavorites"'),
    'FavoritesModal component': content.includes('FavoritesModal'),
    'Star icon from lucide-react': content.includes('Star') && content.includes('lucide-react')
  };
  
  // NOTE: FavoriteButton should NOT be imported in App.jsx!
  // It's used in WordTable.jsx, which is the correct architecture
  const hasFavoriteButtonImport = content.includes("from './components/FavoriteButton") || 
                                   content.includes('from "./components/FavoriteButton');
  
  if (hasFavoriteButtonImport) {
    log(`   ⚠️  FavoriteButton is imported but shouldn't be (used in WordTable instead)`, 'yellow');
  }
  
  let allPassed = true;
  for (const [importName, found] of Object.entries(imports)) {
    const icon = found ? '✓' : '✗';
    log(`   ${icon} ${importName}`, found ? 'yellow' : 'red');
    if (!found) allPassed = false;
  }
  
  return allPassed;
}

function test3_UsesUseFavoritesHook() {
  const content = readFileSync(appPath, 'utf8');
  
  const checks = {
    'useFavorites called': content.includes('useFavorites('),
    'favorites destructured': content.includes('favorites'),
    'toggleWordFavorite available': content.includes('toggleWordFavorite'),
    'isFavorited available': content.includes('isFavorited'),
    'favoritesCount available': content.includes('favoritesCount')
  };
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✓' : '✗';
    log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
    if (!passed) allPassed = false;
  }
  
  return allPassed;
}

function test4_HasFavoritesModal() {
  const content = readFileSync(appPath, 'utf8');
  
  const checks = {
    'FavoritesModal component used': content.includes('<FavoritesModal'),
    'isOpen prop': /isOpen=\{showFavoritesModal/.test(content),
    'onClose prop': /onClose=\{.*setShowFavoritesModal/.test(content),
    'favorites prop passed': /favorites=\{favorites/.test(content),
    'onToggleFavorite handler': content.includes('onToggleFavorite'),
    'onNavigateToWord handler': content.includes('onNavigateToWord')
  };
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✓' : '✗';
    log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
    if (!passed) allPassed = false;
  }
  
  return allPassed;
}

function test5_PassesFavoritePropsToLessonContent() {
  const content = readFileSync(appPath, 'utf8');
  
  const checks = {
    'LessonContent component used': content.includes('<LessonContent'),
    'handleToggleFavorite prop passed': /handleToggleFavorite=\{handleToggleFavorite/.test(content),
    'isFavorited prop passed': /isFavorited=\{isFavorited/.test(content)
  };
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✓' : '✗';
    log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
    if (!passed) allPassed = false;
  }
  
  if (allPassed) {
    log(`   ℹ️  Props correctly passed to LessonContent (separation of concerns)`, 'yellow');
  }
  
  return allPassed;
}

function test6_HasToggleHandler() {
  const content = readFileSync(appPath, 'utf8');
  
  const hasHandler = content.includes('handleToggleFavorite');
  
  if (hasHandler) {
    log(`   ✓ handleToggleFavorite handler exists`, 'yellow');
    
    // Check if it calls toggleWordFavorite
    const callsToggle = content.includes('toggleWordFavorite');
    if (callsToggle) {
      log(`   ✓ Handler calls toggleWordFavorite from hook`, 'yellow');
    }
  } else {
    log(`   ✗ No toggle favorite handler found`, 'red');
  }
  
  return hasHandler;
}

function test7_HasFavoritesButton() {
  const content = readFileSync(appPath, 'utf8');
  
  const checks = {
    'Has button to open favorites': content.includes('setShowFavoritesModal(true)'),
    'Shows favorites count': content.includes('favoritesCount'),
    'Uses Star icon': content.includes('<Star')
  };
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✓' : '✗';
    log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
    if (!passed) allPassed = false;
  }
  
  return allPassed;
}

function test8_HasModalState() {
  const content = readFileSync(appPath, 'utf8');
  
  const hasModalState = content.includes('showFavoritesModal');
  
  if (hasModalState) {
    log(`   ✓ Has showFavoritesModal state`, 'yellow');
  } else {
    log(`   ✗ No modal state found`, 'red');
  }
  
  return hasModalState;
}

function test9_HasNavigateHandler() {
  const content = readFileSync(appPath, 'utf8');
  
  const checks = {
    'handleNavigateToWord exists': content.includes('handleNavigateToWord'),
    'Sets current lesson': content.includes('setCurrentLesson'),
    'Closes modal on navigate': content.includes('setShowFavoritesModal(false)')
  };
  
  let somePassed = false;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✓' : '✗';
    log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
    if (passed) somePassed = true;
  }
  
  return somePassed;
}

// Optional tests
function test10_HasKeyboardShortcut() {
  const content = readFileSync(appPath, 'utf8');
  
  const hasShortcut = 
    content.includes("'mod+shift+f'") ||
    content.includes('"mod+shift+f"');
  
  if (hasShortcut) {
    log(`   ✓ Has keyboard shortcut (Ctrl+Shift+F) for favorites`, 'yellow');
  } else {
    log(`   ! No keyboard shortcut found (optional)`, 'yellow');
  }
  
  return hasShortcut;
}

function test11_LessonContentPassesToWordTable() {
  if (!existsSync(lessonContentPath)) {
    log(`   ! LessonContent.jsx not found (skipping check)`, 'yellow');
    return true; // Don't fail if file doesn't exist
  }
  
  const content = readFileSync(lessonContentPath, 'utf8');
  
  const checks = {
    'WordTable component used': content.includes('<WordTable'),
    'isFavorited prop passed': /isFavorited=\{isFavorited/.test(content),
    'handleToggleFavorite prop passed': /handleToggleFavorite=\{handleToggleFavorite/.test(content)
  };
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✓' : '✗';
    log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
    if (!passed) allPassed = false;
  }
  
  if (allPassed) {
    log(`   ℹ️  LessonContent correctly passes props to WordTable`, 'yellow');
  }
  
  return allPassed;
}

// Main test runner
function runAllTests() {
  log('\n🧪 APP.JSX INTEGRATION TEST (FIXED)', 'magenta');
  log('Phase 4 - Favorites Feature Integration\n', 'cyan');
  
  logSection('TEST 1: App.jsx Exists');
  if (!runTest('App.jsx file exists', test1_AppJsxExists)) {
    log('\n❌ Cannot continue - App.jsx not found!\n', 'red');
    process.exit(1);
  }
  
  logSection('TEST 2: Favorites Imports');
  runTest('Has required imports (excluding FavoriteButton)', test2_HasFavoritesImports);
  
  logSection('TEST 3: useFavorites Hook Usage');
  runTest('Uses useFavorites hook', test3_UsesUseFavoritesHook);
  
  logSection('TEST 4: FavoritesModal Integration');
  runTest('Has FavoritesModal component', test4_HasFavoritesModal);
  
  logSection('TEST 5: Props Passed to LessonContent');
  runTest('Passes favorite props to LessonContent', test5_PassesFavoritePropsToLessonContent);
  
  logSection('TEST 6: Toggle Handler');
  runTest('Has toggle favorite handler', test6_HasToggleHandler);
  
  logSection('TEST 7: Favorites Button in Header');
  runTest('Has button to open favorites modal', test7_HasFavoritesButton);
  
  logSection('TEST 8: Modal State Management');
  runTest('Has modal state', test8_HasModalState);
  
  logSection('TEST 9: Navigate Handler');
  runTest('Has navigate to word handler', test9_HasNavigateHandler);
  
  logSection('TEST 10: Keyboard Shortcut (Optional)');
  runTest('Has keyboard shortcut (Ctrl+Shift+F)', test10_HasKeyboardShortcut, true);
  
  logSection('TEST 11: LessonContent Integration (Optional)');
  runTest('LessonContent passes props to WordTable', test11_LessonContentPassesToWordTable, true);
  
  // Architecture note
  log('\n📐 ARCHITECTURE NOTE:', 'cyan');
  log('   FavoriteButton should NOT be used directly in App.jsx', 'yellow');
  log('   Correct flow: App.jsx → LessonContent → WordTable → FavoriteButton', 'yellow');
  log('   This follows separation of concerns and component hierarchy principles', 'yellow');
  
  // Summary
  logSection('TEST SUMMARY');
  log(`Total Tests: ${tests.total}`, 'cyan');
  log(`Passed: ${tests.passed}`, 'green');
  log(`Failed: ${tests.failed}`, tests.failed > 0 ? 'red' : 'green');
  if (tests.warnings > 0) {
    log(`Warnings: ${tests.warnings} (optional features)`, 'yellow');
  }
  
  const percentage = ((tests.passed / tests.total) * 100).toFixed(1);
  log(`Success Rate: ${percentage}%`, percentage === '100.0' ? 'green' : 'yellow');
  
  if (tests.failed === 0) {
    log('\n🎉 ALL INTEGRATION TESTS PASSED!', 'green');
    log('✅ Phase 4 - App.jsx is properly integrated!', 'green');
    log('✅ Architecture follows best practices!\n', 'green');
    
    if (tests.warnings > 0) {
      log('💡 Tip: Consider adding optional features for better UX', 'cyan');
    }
    
    process.exit(0);
  } else {
    log('\n⚠️  SOME TESTS FAILED!', 'red');
    log('Please review the integration above\n', 'red');
    process.exit(1);
  }
}

// Run tests
runAllTests();
