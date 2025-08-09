/**
 * Session management utilities for maintaining user progress per language and token
 */

/**
 * Generate a session key based on token only
 * @param {string} token - User token
 * @returns {string} Session key
 */
export const generateSessionKey = (token) => {
  if (!token) return null;
  
  // Create a hash-like key from token only for privacy
  const sessionId = btoa(token).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  return `speeki_session_${sessionId}`;
};

/**
 * Save session data to localStorage
 * @param {string} token - User token
 * @param {Object} data - Session data to save
 */
export const saveSessionData = (token, data) => {
  const sessionKey = generateSessionKey(token);
  if (!sessionKey) return false;
  
  try {
    const sessionData = {
      token,
      lastAccessed: Date.now(),
      ...data
    };
    
    localStorage.setItem(sessionKey, JSON.stringify(sessionData));
    return true;
  } catch (error) {
    console.error('Failed to save session data:', error);
    return false;
  }
};

/**
 * Load session data from localStorage
 * @param {string} token - User token
 * @returns {Object|null} Session data or null if not found
 */
export const loadSessionData = (token) => {
  const sessionKey = generateSessionKey(token);
  if (!sessionKey) return null;
  
  try {
    const sessionDataStr = localStorage.getItem(sessionKey);
    if (!sessionDataStr) return null;
    
    const sessionData = JSON.parse(sessionDataStr);
    
    // Check if session is still valid (not older than 30 days)
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    if (Date.now() - sessionData.lastAccessed > maxAge) {
      localStorage.removeItem(sessionKey);
      return null;
    }
    
    return sessionData;
  } catch (error) {
    console.error('Failed to load session data:', error);
    return null;
  }
};

/**
 * Update language-specific progress
 * @param {string} token - User token
 * @param {string} language - Language code
 * @param {Object} progressData - Progress data to update
 */
export const updateLanguageProgress = (token, language, progressData) => {
  const existingData = loadSessionData(token) || {};
  
  const updatedData = {
    ...existingData,
    [`progress_${language}`]: {
      ...existingData[`progress_${language}`],
      ...progressData
    },
    lastAccessed: Date.now()
  };
  
  return saveSessionData(token, updatedData);
};

/**
 * Get language-specific progress
 * @param {string} token - User token
 * @param {string} language - Language code
 * @returns {Object} Language progress data
 */
export const getLanguageProgress = (token, language) => {
  const sessionData = loadSessionData(token);
  if (!sessionData) return null;
  
  return sessionData[`progress_${language}`] || null;
};

/**
 * Initialize session for current user
 * @param {string} token - User token
 * @param {string} language - Language code
 * @returns {Object} Session initialization result
 */
export const initializeSession = (token, language) => {
  if (!token || !language) {
    return { success: false, error: 'Missing token or language' };
  }
  
  // Load existing session or create new one
  let sessionData = loadSessionData(token);
  
  if (!sessionData) {
    sessionData = {
      token,
      [`progress_${language}`]: {
        currentWordIndex: 0,
        wordsCompleted: 0,
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0
      },
      createdAt: Date.now(),
      lastAccessed: Date.now()
    };
    
    saveSessionData(token, sessionData);
  } else {
    // Ensure language progress exists
    if (!sessionData[`progress_${language}`]) {
      sessionData[`progress_${language}`] = {
        currentWordIndex: 0,
        wordsCompleted: 0,
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0
      };
      saveSessionData(token, sessionData);
    }
    
    // Update last accessed time
    sessionData.lastAccessed = Date.now();
    saveSessionData(token, sessionData);
  }
  
  return { success: true, sessionData };
};
