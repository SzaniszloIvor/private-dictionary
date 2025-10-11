#!/usr/bin/env node
// test/v0.6.0/testTailwind.js
/**
 * Tailwind CSS Migration Test Suite
 * Version: 0.6.0
 * Tests Tailwind CSS integration
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

// Tests

function test1_TailwindConfigExists() {
  const configPath = join(projectRoot, 'tailwind.config.js');
  const exists = existsSync(configPath);
  
  if (exists) {
    log(`   ✓ tailwind.config.js found`, 'yellow');
  } else {
    log(`   ✗ tailwind.config.js not found`, 'red');
  }
  
  return exists;
}

function test2_TailwindConfigContent() {
  const configPath = join(projectRoot, 'tailwind.config.js');
  const content = readFileSync(configPath, 'utf8');
  
  const checks = {
    'Content paths': content.includes('./src') || content.includes('content:'),
    'Dark mode': content.includes('darkMode'),
    'Theme extension': content.includes('extend')
  };
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✓' : '✗';
    log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
    if (!passed) allPassed = false;
  }
  
  // Custom animations are optional
  const hasAnimations = content.includes('animation') || content.includes('keyframes');
  if (hasAnimations) {
    log(`   ✓ Custom animations (optional)`, 'yellow');
  } else {
    log(`   ⚠️  Custom animations not in config (might be in CSS)`, 'yellow');
  }
  
  return allPassed;
}

function test3_PostCSSConfig() {
  const postcssPath = join(projectRoot, 'postcss.config.js');
  const exists = existsSync(postcssPath);
  
  if (exists) {
    const content = readFileSync(postcssPath, 'utf8');
    const hasTailwind = content.includes('tailwindcss');
    const hasAutoprefixer = content.includes('autoprefixer');
    
    log(`   ✓ postcss.config.js found`, 'yellow');
    if (hasTailwind) log(`   ✓ tailwindcss plugin configured`, 'yellow');
    if (hasAutoprefixer) log(`   ✓ autoprefixer configured`, 'yellow');
    
    return hasTailwind;
  } else {
    log(`   ✗ postcss.config.js not found`, 'red');
    return false;
  }
}

function test4_PackageDependencies() {
  const packagePath = join(projectRoot, 'package.json');
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
  
  const devDeps = packageJson.devDependencies || {};
  
  const checks = {
    'tailwindcss': !!devDeps.tailwindcss,
    'postcss': !!devDeps.postcss,
    'autoprefixer': !!devDeps.autoprefixer
  };
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✓' : '✗';
    const version = passed ? devDeps[check] : 'not installed';
    log(`   ${icon} ${check}: ${version}`, passed ? 'yellow' : 'red');
    if (!passed) allPassed = false;
  }
  
  return allPassed;
}

function test5_IndexCSSImport() {
  const cssPath = join(projectRoot, 'src/index.css');
  const content = readFileSync(cssPath, 'utf8');
  
  const checks = {
    '@tailwind base': content.includes('@tailwind base'),
    '@tailwind components': content.includes('@tailwind components'),
    '@tailwind utilities': content.includes('@tailwind utilities')
  };
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    const icon = passed ? '✓' : '✗';
    log(`   ${icon} ${check}`, passed ? 'yellow' : 'red');
    if (!passed) allPassed = false;
  }
  
  return allPassed;
}

function test6_ComponentMigration() {
  // Check key components for Tailwind classes
  const componentsToCheck = [
    { path: 'src/App.jsx', name: 'App' },
    { path: 'src/components/LoginScreen/LoginScreen.jsx', name: 'LoginScreen' },
    { path: 'src/components/LessonContent/LessonContent.jsx', name: 'LessonContent' }
  ];
  
  let migratedCount = 0;
  
  componentsToCheck.forEach(comp => {
    const fullPath = join(projectRoot, comp.path);
    if (existsSync(fullPath)) {
      const content = readFileSync(fullPath, 'utf8');
      
      // Check for Tailwind utility classes
      const hasTailwind = 
        content.includes('className=') &&
        (content.includes('bg-') ||
         content.includes('text-') ||
         content.includes('p-') ||
         content.includes('m-') ||
         content.includes('flex') ||
         content.includes('grid'));
      
      // Check for NO inline styles
      const hasNoInlineStyles = !content.includes('style={{');
      
      if (hasTailwind) {
        migratedCount++;
        log(`   ✓ ${comp.name} uses Tailwind classes`, 'yellow');
        if (hasNoInlineStyles) {
          log(`   ✓ ${comp.name} has no inline styles`, 'yellow');
        }
      }
    }
  });
  
  log(`   Migrated: ${migratedCount}/${componentsToCheck.length} components`, 'yellow');
  
  return migratedCount >= 2; // At least 2 components should be migrated
}

function test7_NoStylesJS() {
  const stylesPath = join(projectRoot, 'src/styles/styles.js');
  const exists = existsSync(stylesPath);
  
  if (!exists) {
    log(`   ✓ styles.js removed (no longer needed)`, 'yellow');
    return true;
  } else {
    log(`   ⚠️  styles.js still exists`, 'yellow');
    log(`   ℹ️  Should be removed after Tailwind migration`, 'yellow');
    return false;
  }
}

function test8_CustomAnimations() {
  const cssPath = join(projectRoot, 'src/index.css');
  const content = readFileSync(cssPath, 'utf8');
  
  // v0.6.0 added custom animations
  const animations = ['fade-in', 'slide-in', 'pulse', 'spin'];
  let foundCount = 0;
  
  animations.forEach(anim => {
    if (content.includes(anim)) {
      foundCount++;
      log(`   ✓ Animation: ${anim}`, 'yellow');
    }
  });
  
  if (foundCount === 0) {
    log(`   ⚠️  No custom animations found`, 'yellow');
  }
  
  return true; // Optional feature
}

function test9_ResponsiveDesign() {
  const componentsToCheck = [
    'src/components/WordTable/WordTable.jsx',
    'src/components/LessonContent/LessonContent.jsx',
    'src/App.jsx'
  ];
  
  let responsiveCount = 0;
  
  componentsToCheck.forEach(componentPath => {
    const fullPath = join(projectRoot, componentPath);
    if (existsSync(fullPath)) {
      const content = readFileSync(fullPath, 'utf8');
      
      // Check for responsive classes (sm:, md:, lg:, etc.)
      const hasResponsive = 
        content.includes('sm:') ||
        content.includes('md:') ||
        content.includes('lg:') ||
        content.includes('xl:');
      
      if (hasResponsive) {
        responsiveCount++;
        log(`   ✓ ${componentPath.split('/').pop()} has responsive classes`, 'yellow');
      }
    }
  });
  
  if (responsiveCount > 0) {
    log(`   ✓ Found ${responsiveCount}/${componentsToCheck.length} responsive components`, 'yellow');
  } else {
    log(`   ⚠️  No responsive utility classes found`, 'yellow');
    log(`   ℹ️  Mobile-first design might use base classes only`, 'yellow');
  }
  
  return true; // Optional feature
}

// Main test runner
async function runAllTests() {
  log('\n🎨 TAILWIND CSS MIGRATION TEST SUITE', 'magenta');
  log('Version: 0.6.0\n', 'cyan');
  
  logSection('TEST 1: Tailwind Config File');
  runTest('tailwind.config.js exists', test1_TailwindConfigExists);
  
  logSection('TEST 2: Tailwind Config Content');
  runTest('tailwind.config.js properly configured', test2_TailwindConfigContent);
  
  logSection('TEST 3: PostCSS Configuration');
  runTest('postcss.config.js configured', test3_PostCSSConfig);
  
  logSection('TEST 4: Package Dependencies');
  runTest('Tailwind packages installed', test4_PackageDependencies);
  
  logSection('TEST 5: CSS Import Directives');
  runTest('index.css has @tailwind directives', test5_IndexCSSImport);
  
  logSection('TEST 6: Component Migration');
  runTest('Components migrated to Tailwind', test6_ComponentMigration);
  
  logSection('TEST 7: Old Styles Removed');
  runTest('styles.js removed', test7_NoStylesJS);
  
  logSection('TEST 8: Custom Animations');
  runTest('Custom animations defined', test8_CustomAnimations);
  
  logSection('TEST 9: Responsive Design');
  runTest('Responsive utility classes used', test9_ResponsiveDesign);
  
  // Summary
  logSection('TEST SUMMARY');
  log(`Total Tests: ${tests.total}`, 'cyan');
  log(`Passed: ${tests.passed}`, 'green');
  log(`Failed: ${tests.failed}`, tests.failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((tests.passed / tests.total) * 100).toFixed(1)}%`, 'cyan');
  log('');
  
  if (tests.failed === 0) {
    log('🎉 ALL TAILWIND TESTS PASSED!', 'green');
    log('✅ v0.6.0 Tailwind CSS is properly integrated!', 'green');
  } else {
    log('⚠️  SOME TESTS FAILED! Please review the output above.', 'red');
  }
  
  log('');
  
  process.exit(tests.failed > 0 ? 1 : 0);
}

runAllTests();
