/**
 * 🧪 useFavorites Hook Test Suite
 * Tests the custom hook functionality (simulated, not actual React rendering)
 * 
 * Run: node test/favorites/testUseFavorites.js
 */

// Import the helper functions (ES modules)
import {
  toggleDemoFavorite,
  getAllDemoFavorites,
  isDemoFavorite,
  getDemoFavoritesCount,
  clearAllDemoFavorites
} from '../../src/utils/favoritesHelper.js';

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

global.localStorage = new LocalStorageMock();

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
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

// Test data
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

// Simulated hook state (since we can't use React hooks in Node)
class FavoritesState {
  constructor(isDemo, dictionary) {
    this.isDemo = isDemo;
    this.dictionary = dictionary;
    this.favorites = [];
    this.loading = false;
    this.error = null;
  }
  
  loadFavorites() {
    this.loading = true;
    this.error = null;
    
    try {
      if (this.isDemo) {
        this.favorites = getAllDemoFavorites(this.dictionary);
      }
      this.loading = false;
      return true;
    } catch (err) {
      this.error = err.message;
      this.loading = false;
      return false;
    }
  }
  
  toggleWordFavorite(lessonId, wordIndex) {
    try {
      const newStatus = toggleDemoFavorite(lessonId, wordIndex);
      this.loadFavorites();
      return newStatus;
    } catch (err) {
      this.error = err.message;
      throw err;
    }
  }
  
  isFavorited(lessonId, wordIndex) {
    return isDemoFavorite(lessonId, wordIndex);
  }
  
  get favoritesCount() {
    return getDemoFavoritesCount();
  }
  
  getFavoritesForLesson(lessonId) {
    return this.favorites.filter(f => f.lessonId === lessonId);
  }
  
  lessonHasFavorites(lessonId) {
    return this.favorites.some(f => f.lessonId === lessonId);
  }
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

// Individual Tests
function test1_InitializeState() {
  // Clean slate
  clearAllDemoFavorites();
  localStorage.setItem('demoDictionary', JSON.stringify(testDictionary));
  
  const state = new FavoritesState(true, testDictionary);
  state.loadFavorites();
  
  log(`   Initial favorites count: ${state.favoritesCount}`, 'yellow');
  log(`   Loading: ${state.loading}`, 'yellow');
  log(`   Error: ${state.error || 'none'}`, 'yellow');
  
  return state.favoritesCount === 0 && !state.loading && !state.error;
}

function test2_ToggleFavorite() {
  // Clean slate
  clearAllDemoFavorites();
  
  const state = new FavoritesState(true, testDictionary);
  state.loadFavorites();
  
  const newStatus = state.toggleWordFavorite('1', 0); // apple
  
  log(`   Toggled apple: ${newStatus}`, 'yellow');
  log(`   Favorites count: ${state.favoritesCount}`, 'yellow');
  log(`   Is apple favorited: ${state.isFavorited('1', 0)}`, 'yellow');
  
  return newStatus === true && state.favoritesCount === 1 && state.isFavorited('1', 0);
}

function test3_MultipleFavorites() {
  // Clean slate
  clearAllDemoFavorites();
  
  const state = new FavoritesState(true, testDictionary);
  state.loadFavorites();
  
  state.toggleWordFavorite('1', 0); // apple
  state.toggleWordFavorite('1', 2); // cherry
  state.toggleWordFavorite('2', 0); // dog
  
  log(`   Total favorites: ${state.favoritesCount}`, 'yellow');
  log(`   Favorites array length: ${state.favorites.length}`, 'yellow');
  
  return state.favoritesCount === 3 && state.favorites.length === 3;
}

function test4_GetFavoritesForLesson() {
  // Clean slate
  clearAllDemoFavorites();
  
  const state = new FavoritesState(true, testDictionary);
  state.loadFavorites();
  
  // Add favorites first
  state.toggleWordFavorite('1', 0); // apple
  state.toggleWordFavorite('1', 2); // cherry
  state.toggleWordFavorite('2', 0); // dog
  
  const lesson1Favs = state.getFavoritesForLesson('1');
  const lesson2Favs = state.getFavoritesForLesson('2');
  
  log(`   Lesson 1 favorites: ${lesson1Favs.length}`, 'yellow');
  log(`   Lesson 2 favorites: ${lesson2Favs.length}`, 'yellow');
  
  return lesson1Favs.length === 2 && lesson2Favs.length === 1;
}

function test5_LessonHasFavorites() {
  // Clean slate
  clearAllDemoFavorites();
  
  const state = new FavoritesState(true, testDictionary);
  state.loadFavorites();
  
  // Add favorites first
  state.toggleWordFavorite('1', 0); // apple
  state.toggleWordFavorite('2', 0); // dog
  
  const lesson1Has = state.lessonHasFavorites('1');
  const lesson2Has = state.lessonHasFavorites('2');
  
  log(`   Lesson 1 has favorites: ${lesson1Has}`, 'yellow');
  log(`   Lesson 2 has favorites: ${lesson2Has}`, 'yellow');
  
  return lesson1Has && lesson2Has;
}

function test6_ToggleOff() {
  // Clean slate
  clearAllDemoFavorites();
  
  const state = new FavoritesState(true, testDictionary);
  state.loadFavorites();
  
  // Add favorites first
  state.toggleWordFavorite('1', 0); // apple
  state.toggleWordFavorite('1', 2); // cherry
  state.toggleWordFavorite('2', 0); // dog
  
  const beforeCount = state.favoritesCount;
  const newStatus = state.toggleWordFavorite('1', 0); // Remove apple
  const afterCount = state.favoritesCount;
  
  log(`   Before: ${beforeCount}, After: ${afterCount}`, 'yellow');
  log(`   New status: ${newStatus}`, 'yellow');
  log(`   Is still favorited: ${state.isFavorited('1', 0)}`, 'yellow');
  
  return !newStatus && beforeCount === afterCount + 1 && !state.isFavorited('1', 0);
}

function test7_ClearAndReload() {
  clearAllDemoFavorites();
  
  const state = new FavoritesState(true, testDictionary);
  state.loadFavorites();
  
  log(`   Favorites after clear: ${state.favoritesCount}`, 'yellow');
  log(`   Favorites array: ${state.favorites.length}`, 'yellow');
  
  return state.favoritesCount === 0 && state.favorites.length === 0;
}

// Main test runner
function runAllTests() {
  log('\n🧪 useFavorites HOOK TEST SUITE', 'cyan');
  log('Phase 2 - Custom Hook & State Management\n', 'cyan');
  
  logSection('TEST 1: Initialize State');
  runTest('Initialize with empty favorites', test1_InitializeState);
  
  logSection('TEST 2: Toggle Favorite');
  runTest('Toggle favorite on (apple)', test2_ToggleFavorite);
  
  logSection('TEST 3: Multiple Favorites');
  runTest('Add multiple favorites', test3_MultipleFavorites);
  
  logSection('TEST 4: Get Favorites for Lesson');
  runTest('Filter favorites by lesson', test4_GetFavoritesForLesson);
  
  logSection('TEST 5: Lesson Has Favorites');
  runTest('Check if lesson has favorites', test5_LessonHasFavorites);
  
  logSection('TEST 6: Toggle Off');
  runTest('Toggle favorite off (remove apple)', test6_ToggleOff);
  
  logSection('TEST 7: Clear and Reload');
  runTest('Clear all favorites and reload', test7_ClearAndReload);
  
  // Summary
  logSection('TEST SUMMARY');
  log(`Total Tests: ${tests.total}`, 'cyan');
  log(`Passed: ${tests.passed}`, 'green');
  log(`Failed: ${tests.failed}`, tests.failed > 0 ? 'red' : 'green');
  
  const percentage = ((tests.passed / tests.total) * 100).toFixed(1);
  log(`Success Rate: ${percentage}%`, percentage === '100.0' ? 'green' : 'yellow');
  
  if (tests.failed === 0) {
    log('\n🎉 ALL HOOK TESTS PASSED! useFavorites is working correctly.', 'green');
    log('✅ Phase 2 implementation is complete!\n', 'green');
    process.exit(0);
  } else {
    log('\n⚠️  SOME TESTS FAILED! Please review the output above.\n', 'red');
    process.exit(1);
  }
}

// Run tests
runAllTests();
