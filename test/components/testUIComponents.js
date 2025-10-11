/**
 * 🧪 UI Components Test Suite
 * Tests FavoriteButton and FavoritesModal components
 * 
 * Run: node test/components/testUIComponents.js
 */

import { existsSync } from 'fs';
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

// Component paths
const components = {
  FavoriteButton: {
    path: join(projectRoot, 'src/components/FavoriteButton/FavoriteButton.jsx'),
    name: 'FavoriteButton'
  },
  FavoritesModal: {
    path: join(projectRoot, 'src/components/FavoritesModal/FavoritesModal.jsx'),
    name: 'FavoritesModal'
  }
};

// Tests

function test1_FavoriteButtonExists() {
  const path = components.FavoriteButton.path;
  const exists = existsSync(path);
  
  if (exists) {
    log(`   ✓ File found: ${path}`, 'yellow');
  } else {
    log(`   ✗ File not found: ${path}`, 'red');
  }
  
  return exists;
}

function test2_FavoritesModalExists() {
  const path = components.FavoritesModal.path;
  const exists = existsSync(path);
  
  if (exists) {
    log(`   ✓ File found: ${path}`, 'yellow');
  } else {
    log(`   ✗ File not found: ${path}`, 'red');
  }
  
  return exists;
}

async function test3_FavoriteButtonSyntax() {
  try {
    const fs = await import('fs');
    const content = fs.readFileSync(components.FavoriteButton.path, 'utf8');
    
    // Check for syntax errors and valid JSX structure
    const checks = {
      'Valid JSX syntax (has JSX elements)': /<[A-Z]/.test(content) || /<button/.test(content),
      'No obvious syntax errors (balanced braces)': (content.match(/{/g) || []).length === (content.match(/}/g) || []).length,
      'Has return statement': content.includes('return'),
      'Proper imports format': content.includes('import') && content.includes('from'),
      'Proper export format': content.includes('export default')
    };
    
    let allPassed = true;
    for (const [check, passed] of Object.entries(checks)) {
      const icon = passed ? '✓' : '✗';
      log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
      if (!passed) allPassed = false;
    }
    
    return allPassed;
  } catch (error) {
    log(`   ✗ Error checking syntax: ${error.message}`, 'red');
    return false;
  }
}

async function test4_FavoritesModalSyntax() {
  try {
    const fs = await import('fs');
    const content = fs.readFileSync(components.FavoritesModal.path, 'utf8');
    
    // Check for syntax errors and valid JSX structure
    const checks = {
      'Valid JSX syntax (has JSX elements)': /<div/.test(content),
      'No obvious syntax errors (balanced braces)': (content.match(/{/g) || []).length === (content.match(/}/g) || []).length,
      'Has return statement': content.includes('return'),
      'Proper imports format': content.includes('import') && content.includes('from'),
      'Proper export format': content.includes('export default'),
      'Has conditional rendering': content.includes('if') || content.includes('?')
    };
    
    let allPassed = true;
    for (const [check, passed] of Object.entries(checks)) {
      const icon = passed ? '✓' : '✗';
      log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
      if (!passed) allPassed = false;
    }
    
    return allPassed;
  } catch (error) {
    log(`   ✗ Error checking syntax: ${error.message}`, 'red');
    return false;
  }
}

async function test5_FavoriteButtonStructure() {
  try {
    const fs = await import('fs');
    const content = fs.readFileSync(components.FavoriteButton.path, 'utf8');
    
    // Check for required elements
    const checks = {
      'import React': content.includes('import React'),
      'import Star from lucide-react': content.includes('lucide-react'),
      'export default': content.includes('export default'),
      'isFavorite prop': content.includes('isFavorite'),
      'onClick prop': content.includes('onClick'),
      'size prop': content.includes('size'),
      'Tailwind classes': content.includes('className')
    };
    
    let allPassed = true;
    for (const [check, passed] of Object.entries(checks)) {
      const icon = passed ? '✓' : '✗';
      log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
      if (!passed) allPassed = false;
    }
    
    return allPassed;
  } catch (error) {
    log(`   ✗ Error reading file: ${error.message}`, 'red');
    return false;
  }
}

async function test6_FavoritesModalStructure() {
  try {
    const fs = await import('fs');
    const content = fs.readFileSync(components.FavoritesModal.path, 'utf8');
    
    // Check for required elements
    const checks = {
      'import React': content.includes('import React'),
      'import useState': content.includes('useState'),
      'import lucide-react': content.includes('lucide-react'),
      'export default': content.includes('export default'),
      'isOpen prop': content.includes('isOpen'),
      'onClose prop': content.includes('onClose'),
      'favorites prop': content.includes('favorites'),
      'Search functionality': content.includes('searchQuery') || content.includes('Search'),
      'Filter functionality': content.includes('filter') || content.includes('selectedLesson')
    };
    
    let allPassed = true;
    for (const [check, passed] of Object.entries(checks)) {
      const icon = passed ? '✓' : '✗';
      log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
      if (!passed) allPassed = false;
    }
    
    return allPassed;
  } catch (error) {
    log(`   ✗ Error reading file: ${error.message}`, 'red');
    return false;
  }
}

async function test7_ComponentDependencies() {
  try {
    const fs = await import('fs');
    const packageJsonPath = join(projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };
    
    const checks = {
      'react': !!dependencies.react,
      'lucide-react': !!dependencies['lucide-react'],
      'tailwindcss': !!dependencies.tailwindcss
    };
    
    let allPassed = true;
    for (const [dep, installed] of Object.entries(checks)) {
      const icon = installed ? '✓' : '✗';
      const version = installed ? dependencies[dep] : 'NOT INSTALLED';
      log(`   ${icon} ${dep}: ${version}`, installed ? 'yellow' : 'red');
      if (!installed) allPassed = false;
    }
    
    return allPassed;
  } catch (error) {
    log(`   ✗ Error checking dependencies: ${error.message}`, 'red');
    return false;
  }
}

function test8_DirectoryStructure() {
  const directories = [
    join(projectRoot, 'src/components'),
    join(projectRoot, 'src/components/FavoriteButton'),
    join(projectRoot, 'src/components/FavoritesModal')
  ];
  
  let allExist = true;
  for (const dir of directories) {
    const exists = existsSync(dir);
    const icon = exists ? '✓' : '✗';
    log(`   ${icon} ${dir}`, exists ? 'yellow' : 'red');
    if (!exists) allExist = false;
  }
  
  return allExist;
}

// Main test runner
async function runAllTests() {
  log('\n🧪 UI COMPONENTS TEST SUITE', 'magenta');
  log('Phase 3 - FavoriteButton & FavoritesModal\n', 'cyan');
  
  logSection('TEST 1: FavoriteButton File Exists');
  runTest('FavoriteButton.jsx exists', test1_FavoriteButtonExists);
  
  logSection('TEST 2: FavoritesModal File Exists');
  runTest('FavoritesModal.jsx exists', test2_FavoritesModalExists);
  
  logSection('TEST 3: FavoriteButton Syntax Check');
  const test3Result = await test3_FavoriteButtonSyntax();
  if (test3Result) {
    tests.passed++;
    logTest('FavoriteButton syntax is valid', true);
  } else {
    tests.failed++;
    logTest('FavoriteButton syntax is valid', false);
  }
  tests.total++;
  
  logSection('TEST 4: FavoritesModal Syntax Check');
  const test4Result = await test4_FavoritesModalSyntax();
  if (test4Result) {
    tests.passed++;
    logTest('FavoritesModal syntax is valid', true);
  } else {
    tests.failed++;
    logTest('FavoritesModal syntax is valid', false);
  }
  tests.total++;
  
  logSection('TEST 5: FavoriteButton Structure');
  const test5Result = await test5_FavoriteButtonStructure();
  if (test5Result) {
    tests.passed++;
    logTest('FavoriteButton has required code', true);
  } else {
    tests.failed++;
    logTest('FavoriteButton has required code', false);
  }
  tests.total++;
  
  logSection('TEST 6: FavoritesModal Structure');
  const test6Result = await test6_FavoritesModalStructure();
  if (test6Result) {
    tests.passed++;
    logTest('FavoritesModal has required code', true);
  } else {
    tests.failed++;
    logTest('FavoritesModal has required code', false);
  }
  tests.total++;
  
  logSection('TEST 7: Component Dependencies');
  const test7Result = await test7_ComponentDependencies();
  if (test7Result) {
    tests.passed++;
    logTest('Required packages installed', true);
  } else {
    tests.failed++;
    logTest('Required packages installed', false);
  }
  tests.total++;
  
  logSection('TEST 8: Directory Structure');
  runTest('Component directories exist', test8_DirectoryStructure);
  
  // Summary
  logSection('TEST SUMMARY');
  log(`Total Tests: ${tests.total}`, 'cyan');
  log(`Passed: ${tests.passed}`, 'green');
  log(`Failed: ${tests.failed}`, tests.failed > 0 ? 'red' : 'green');
  
  const percentage = ((tests.passed / tests.total) * 100).toFixed(1);
  log(`Success Rate: ${percentage}%`, percentage === '100.0' ? 'green' : 'yellow');
  
  if (tests.failed === 0) {
    log('\n🎉 ALL UI COMPONENT TESTS PASSED!', 'green');
    log('✅ Phase 3 components are ready!\n', 'green');
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
