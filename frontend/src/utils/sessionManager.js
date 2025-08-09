/**
 * Session management utilities for maintaining user progress per language and token
 */

/**
 * Generate a session key based on token and language
 * @param {string} token - User token
 * @param {string} language - Language code
 * @returns {string} Session key
 */
export const generateSessionKey = (token, language) => {
  if (!token || !language) return null;
  
  // Create a hash-like key from token and language for privacy
  const sessionId = btoa(`${token}_${language}`).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  return `speeki_session_${sessionId}`;
};

/**
 * Save session data to localStorage
 * @param {string} token - User token
 * @param {string} language - Language code
 * @param {Object} data - Session data to save
 */
export const saveSessionData = (token, language, data) => {
  const sessionKey = generateSessionKey(token, language);
  if (!sessionKey) return false;
  
  try {
    const sessionData = {
      token,
      language,
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
 * @param {string} language - Language code
 * @returns {Object|null} Session data or null if not found
 */
export const loadSessionData = (token, language) => {
  const sessionKey = generateSessionKey(token, language);
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
 * Update session progress
 * @param {string} token - User token
 * @param {string} language - Language code
 * @param {Object} progressData - Progress data to update
 */
export const updateSessionProgress = (token, language, progressData) => {
  const existingData = loadSessionData(token, language) || {};
  
  const updatedData = {
    ...existingData,
    progress: {
      ...existingData.progress,
      ...progressData
    },
    lastAccessed: Date.now()
  };
  
  return saveSessionData(token, language, updatedData);
};

/**
 * Get user statistics across all sessions
 * @param {string} token - User token
 * @returns {Object} User statistics
 */
export const getUserStatistics = (token) => {
  if (!token) return { totalWords: 0, languages: [], sessions: [] };
  
  const stats = {
    totalWords: 0,
    languages: [],
    sessions: [],
    lastActivity: null
  };
  
  // Scan localStorage for all sessions belonging to this token
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('speeki_session_')) {
      try {
        const sessionData = JSON.parse(localStorage.getItem(key));
        if (sessionData && sessionData.token === token) {
          stats.sessions.push(sessionData);
          
          if (sessionData.language && !stats.languages.includes(sessionData.language)) {
            stats.languages.push(sessionData.language);
          }
          
          if (sessionData.progress && sessionData.progress.wordsCompleted) {
            stats.totalWords += sessionData.progress.wordsCompleted;
          }
          
          if (!stats.lastActivity || sessionData.lastAccessed > stats.lastActivity) {
            stats.lastActivity = sessionData.lastAccessed;
          }
        }
      } catch (error) {
        console.warn('Failed to parse session data for key:', key);
      }
    }
  }
  
  return stats;
};

/**
 * Clean up old sessions (older than 30 days)
 */
export const cleanupOldSessions = () => {
  const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
  const keysToRemove = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('speeki_session_')) {
      try {
        const sessionData = JSON.parse(localStorage.getItem(key));
        if (sessionData && Date.now() - sessionData.lastAccessed > maxAge) {
          keysToRemove.push(key);
        }
      } catch (error) {
        // If we can't parse it, it's probably corrupted, so remove it
        keysToRemove.push(key);
      }
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  return keysToRemove.length;
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
  
  // Clean up old sessions first
  cleanupOldSessions();
  
  // Load existing session or create new one
  let sessionData = loadSessionData(token, language);
  
  if (!sessionData) {
    sessionData = {
      token,
      language,
      progress: {
        currentWordIndex: 0,
        wordsCompleted: 0,
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0
      },
      createdAt: Date.now(),
      lastAccessed: Date.now()
    };
    
    saveSessionData(token, language, sessionData);
  } else {
    // Update last accessed time
    sessionData.lastAccessed = Date.now();
    saveSessionData(token, language, sessionData);
  }
  
  return { success: true, sessionData };
};
