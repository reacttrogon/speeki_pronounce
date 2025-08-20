/**
 * Utility functions for URL parameter parsing and token validation
 */

/**
 * Parse URL parameters from the current window location
 * @returns {Object} Object containing parsed parameters
 */
export const parseUrlParameters = () => {
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    token: urlParams.get('token'),
    language: urlParams.get('language') || 'en-us', // Default to en-us
  };
};

/**
 * Validate token format (basic validation)
 * @param {string} token - The token to validate
 * @returns {boolean} True if token appears valid
 */
export const validateToken = (token) => {
  if (!token) return false;
  
  // Basic token validation - should be a non-empty string with reasonable length
  // You can enhance this with more sophisticated validation as needed
  return typeof token === 'string' && 
         token.length >= 10 &&
         /^[a-zA-Z0-9._-]+$/.test(token);
};

/**
 * Validate language parameter
 * @param {string} language - The language code to validate
 * @returns {boolean} True if language is supported
 */
export const validateLanguage = (language) => {
  const supportedLanguages = ['en-us', 'en-gb'];
  return supportedLanguages.includes(language?.toLowerCase());
};

/**
 * Get language configuration based on language code
 * @param {string} language - The language code
 * @returns {Object} Language configuration object
 */
export const getLanguageConfig = (language) => {
  const configs = {
    'en-us': {
      code: 'en-US',
      name: 'American English',
      voiceName: 'en-US-JennyNeural',
      speechRecognitionLanguage: 'en-US',
      flag: '🇺🇸'
    },
    'en-gb': {
      code: 'en-GB',
      name: 'British English',
      voiceName: 'en-GB-SoniaNeural',
      speechRecognitionLanguage: 'en-GB',
      flag: '🇬🇧'
    }
  };
  
  return configs[language?.toLowerCase()] || configs['en-us'];
};

/**
 * Initialize application with URL parameters
 * @returns {Object} Initialization result with parsed parameters and validation status
 */
export const initializeFromUrl = () => {
  const params = parseUrlParameters();
  const isTokenValid = validateToken(params.token);
  const isLanguageValid = validateLanguage(params.language);
  
  // If language is invalid, default to en-us
  if (!isLanguageValid) {
    params.language = 'en-us';
  }
  
  const languageConfig = getLanguageConfig(params.language);
  
  return {
    params,
    isTokenValid,
    isLanguageValid,
    languageConfig,
    isValid: isTokenValid && isLanguageValid
  };
};
