/**
 * Simple test file to verify URL parameter parsing functionality
 * Run this in browser console to test
 */

import { parseUrlParameters, validateToken, validateLanguage, getLanguageConfig, initializeFromUrl } from '../utils/urlUtils.js';

// Test URL parameter parsing
console.log('Testing URL parameter parsing...');

// Mock window.location.search for testing
const originalSearch = window.location.search;

// Test case 1: Valid en-US URL
window.history.replaceState({}, '', '?token=ffijbhfadfhiadbfhaddajshvdba.blaablabdkabblaadahak&language=en-us');
const params1 = parseUrlParameters();
console.log('Test 1 - en-US:', params1);

// Test case 2: Valid en-GB URL  
window.history.replaceState({}, '', '?token=ffijbhfadfhiadbfhaddajshvdba.blaablabdkabblaadahak&language=en-gb');
const params2 = parseUrlParameters();
console.log('Test 2 - en-GB:', params2);

// Test case 3: Invalid language (should default to en-us)
window.history.replaceState({}, '', '?token=ffijbhfadfhiadbfhaddajshvdba.blaablabdkabblaadahak&language=fr-fr');
const params3 = parseUrlParameters();
console.log('Test 3 - Invalid language:', params3);

// Test case 4: Missing token
window.history.replaceState({}, '', '?language=en-gb');
const params4 = parseUrlParameters();
console.log('Test 4 - Missing token:', params4);

// Test validation functions
console.log('\nTesting validation functions...');
console.log('Valid token:', validateToken('ffijbhfadfhiadbfhaddajshvdba.blaablabdkabblaadahak'));
console.log('Invalid token (too short):', validateToken('short'));
console.log('Invalid token (null):', validateToken(null));

console.log('Valid language en-us:', validateLanguage('en-us'));
console.log('Valid language en-gb:', validateLanguage('en-gb'));
console.log('Invalid language fr-fr:', validateLanguage('fr-fr'));

// Test language config
console.log('\nTesting language configurations...');
console.log('en-US config:', getLanguageConfig('en-us'));
console.log('en-GB config:', getLanguageConfig('en-gb'));
console.log('Invalid config (defaults to en-US):', getLanguageConfig('invalid'));

// Test full initialization
console.log('\nTesting full initialization...');
window.history.replaceState({}, '', '?token=ffijbhfadfhiadbfhaddajshvdba.blaablabdkabblaadahak&language=en-gb');
const init = initializeFromUrl();
console.log('Full initialization result:', init);

// Restore original URL
window.history.replaceState({}, '', originalSearch);

console.log('\nURL utils tests completed!');
