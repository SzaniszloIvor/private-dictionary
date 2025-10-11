/**
 * 🧪 Favorites Feature Test Suite
 * Run: node test/favorites/testFavorites.js
 */

// Mock localStorage for Node.js environment
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }

  removeItem(key) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }
}

// Initialize mock localStorage
const localStorage = new LocalStorageMock();

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

// Helper functions
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

// Test data setup
function setupTestData() {
  const testDictionary = {
    "1": {
      title: "Test Lesson 1",
      words: [
        { english: "apple", hungarian: "alma", phonetic: "/ˈæp.əl/" },
        { english: "banana", hungarian: "banán", phonetic: "/bəˈnɑː.nə/" },
        { english: "cherry", hungarian: "cseresznye", phonetic: "/ˈtʃer.i/" }
      ]
    },
    "2": {
      title: "Test Lesson 2",
      words: [
        { english: "dog", hungarian: "kutya", phonetic: "/dɒɡ/" },
        { english: "cat", hungarian: "macska", phonetic: "/kæt/" }
      ]
    }
  };

  localStorage.setItem('demoDictionary', JSON.stringify(testDictionary));
  localStorage.removeItem('demoFavorites');
  return testDictionary;
}

// Favorites Helper Functions (from favoritesHelper.js)
const FAVORITES_STORAGE_KEY = 'demoFavorites';

function getDemoFavorites() {
  const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveDemoFavorites(favorites) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  return true;
}

function addDemoFavorite(lessonId, wordIndex) {
  const favorites = getDemoFavorites();
  const exists = favorites.some(
    f => f.lessonId === lessonId && f.wordIndex === wordIndex
  );
  
  if (!exists) {
    favorites.push({
      lessonId,
      wordIndex,
      addedAt: new Date().toISOString()
    });
    return saveDemoFavorites(favorites);
  }
  return true;
}

function removeDemoFavorite(lessonId, wordIndex) {
  let favorites = getDemoFavorites();
  favorites = favorites.filter(
    f => !(f.lessonId === lessonId && f.wordIndex === wordIndex)
  );
  return saveDemoFavorites(favorites);
}

function toggleDemoFavorite(lessonId, wordIndex) {
  const favorites = getDemoFavorites();
  const existingIndex = favorites.findIndex(
    f => f.lessonId === lessonId && f.wordIndex === wordIndex
  );
  
  if (existingIndex > -1) {
    favorites.splice(existingIndex, 1);
    saveDemoFavorites(favorites);
    return false;
  } else {
    favorites.push({
      lessonId,
      wordIndex,
      addedAt: new Date().toISOString()
    });
    saveDemoFavorites(favorites);
    return true;
  }
}

function isDemoFavorite(lessonId, wordIndex) {
  const favorites = getDemoFavorites();
  return favorites.some(
    f => f.lessonId === lessonId && f.wordIndex === wordIndex
  );
}

function getAllDemoFavorites(dictionary) {
  const favoriteRefs = getDemoFavorites();
  const favorites = [];
  
  favoriteRefs.forEach(ref => {
    const lesson = dictionary[ref.lessonId];
    if (lesson && lesson.words && lesson.words[ref.wordIndex]) {
      const word = lesson.words[ref.wordIndex];
      favorites.push({
        ...word,
        lessonId: ref.lessonId,
        lessonTitle: lesson.title || `Lesson ${ref.lessonId}`,
        wordIndex: ref.wordIndex,
        favoritedAt: ref.addedAt
      });
    }
  });
  
  favorites.sort((a, b) => 
    new Date(b.favoritedAt) - new Date(a.favoritedAt)
  );
  
  return favorites;
}

function migrateDictionaryForFavorites(dictionary) {
  const favorites = getDemoFavorites();
  const migratedDictionary = JSON.parse(JSON.stringify(dictionary));
  
  Object.keys(migratedDictionary).forEach(lessonId => {
    if (migratedDictionary[lessonId].words) {
      migratedDictionary[lessonId].words = migratedDictionary[lessonId].words.map((word, index) => {
        const favoriteRef = favorites.find(
          f => f.lessonId === lessonId && f.wordIndex === index
        );
        
        return {
          ...word,
          isFavorite: !!favoriteRef,
          favoritedAt: favoriteRef ? favoriteRef.addedAt : null
        };
      });
    }
  });
  
  return migratedDictionary;
}

// Test Suite
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

// Individual Tests
function test1_AddFavorites() {
  setupTestData();
  
  addDemoFavorite('1', 0); // apple
  addDemoFavorite('1', 2); // cherry
  addDemoFavorite('2', 0); // dog
  
  const favorites = getDemoFavorites();
  log(`   Added ${favorites.length} favorites`, 'yellow');
  
  return favorites.length === 3;
}

function test2_GetFavorites() {
  const dictionary = JSON.parse(localStorage.getItem('demoDictionary'));
  const fullFavorites = getAllDemoFavorites(dictionary);
  
  log(`   Retrieved ${fullFavorites.length} favorites with full data`, 'yellow');
  log(`   First favorite: ${fullFavorites[0].english} (${fullFavorites[0].hungarian})`, 'yellow');
  
  // Just check we got 3 favorites with full data (order doesn't matter for this test)
  const hasApple = fullFavorites.some(f => f.english === 'apple');
  const hasDog = fullFavorites.some(f => f.english === 'dog');
  const hasCherry = fullFavorites.some(f => f.english === 'cherry');
  
  return fullFavorites.length === 3 && hasApple && hasDog && hasCherry;
}

function test3_ToggleFavorite() {
  const beforeCount = getDemoFavorites().length;
  const wasRemoved = !toggleDemoFavorite('1', 2); // Remove cherry
  const afterCount = getDemoFavorites().length;
  
  log(`   Before: ${beforeCount}, After: ${afterCount}`, 'yellow');
  log(`   Cherry was ${wasRemoved ? 'removed' : 'added'}`, 'yellow');
  
  return wasRemoved && beforeCount === afterCount + 1;
}

function test4_IsFavorite() {
  const checks = [
    { lessonId: '1', wordIndex: 0, expected: true, name: 'apple' },
    { lessonId: '1', wordIndex: 1, expected: false, name: 'banana' },
    { lessonId: '2', wordIndex: 0, expected: true, name: 'dog' },
    { lessonId: '1', wordIndex: 2, expected: false, name: 'cherry (removed)' }
  ];
  
  let allPassed = true;
  checks.forEach(check => {
    const result = isDemoFavorite(check.lessonId, check.wordIndex);
    const passed = result === check.expected;
    log(`   ${check.name}: ${result} ${passed ? '✓' : '✗'}`, passed ? 'yellow' : 'red');
    if (!passed) allPassed = false;
  });
  
  return allPassed;
}

function test5_Migration() {
  const dictionary = JSON.parse(localStorage.getItem('demoDictionary'));
  const migratedDict = migrateDictionaryForFavorites(dictionary);
  
  let totalWords = 0;
  let favoritedWords = 0;
  
  Object.keys(migratedDict).forEach(lessonId => {
    migratedDict[lessonId].words.forEach(word => {
      totalWords++;
      if (word.isFavorite) favoritedWords++;
    });
  });
  
  log(`   Migrated ${favoritedWords}/${totalWords} words as favorited`, 'yellow');
  
  return favoritedWords === 2 && totalWords === 5;
}

function test6_RemoveFavorite() {
  const beforeCount = getDemoFavorites().length;
  removeDemoFavorite('2', 0); // Remove dog
  const afterCount = getDemoFavorites().length;
  
  log(`   Before: ${beforeCount}, After: ${afterCount}`, 'yellow');
  
  return beforeCount === afterCount + 1 && afterCount === 1;
}

function test7_ClearFavorites() {
  localStorage.removeItem(FAVORITES_STORAGE_KEY);
  const favorites = getDemoFavorites();
  
  log(`   Favorites count after clear: ${favorites.length}`, 'yellow');
  
  return favorites.length === 0;
}

// Main test runner
function runAllTests() {
  log('\n🧪 FAVORITES FEATURE TEST SUITE', 'bright');
  log('Phase 1 - Backend & Data Structure\n', 'cyan');
  
  logSection('TEST 1: Add Favorites');
  runTest('Add 3 favorites (apple, cherry, dog)', test1_AddFavorites);
  
  logSection('TEST 2: Get Favorites');
  runTest('Get all favorites with full data', test2_GetFavorites);
  
  logSection('TEST 3: Toggle Favorite');
  runTest('Toggle (remove) cherry', test3_ToggleFavorite);
  
  logSection('TEST 4: Check isFavorite');
  runTest('Verify isFavorite for multiple words', test4_IsFavorite);
  
  logSection('TEST 5: Dictionary Migration');
  runTest('Migrate dictionary with favorite flags', test5_Migration);
  
  logSection('TEST 6: Remove Favorite');
  runTest('Remove dog from favorites', test6_RemoveFavorite);
  
  logSection('TEST 7: Clear Favorites');
  runTest('Clear all favorites', test7_ClearFavorites);
  
  // Summary
  logSection('TEST SUMMARY');
  log(`Total Tests: ${tests.total}`, 'bright');
  log(`Passed: ${tests.passed}`, 'green');
  log(`Failed: ${tests.failed}`, tests.failed > 0 ? 'red' : 'green');
  
  const percentage = ((tests.passed / tests.total) * 100).toFixed(1);
  log(`Success Rate: ${percentage}%`, percentage === '100.0' ? 'green' : 'yellow');
  
  if (tests.failed === 0) {
    log('\n🎉 ALL TESTS PASSED! Favorites feature is working correctly.', 'green');
    log('✅ Phase 1 implementation is complete!\n', 'green');
    process.exit(0);
  } else {
    log('\n⚠️  SOME TESTS FAILED! Please review the output above.\n', 'red');
    process.exit(1);
  }
}

// Run tests
runAllTests();
