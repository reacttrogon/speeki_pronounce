import { createContext, useEffect, useState } from "react";
import { getWordList } from "../data/wordLists.js";
import { initializeFromUrl, getLanguageConfig } from "../utils/urlUtils.js";
import { initializeSession, updateLanguageProgress, getLanguageProgress } from "../utils/sessionManager.js";

export const AssessmentContext = createContext();

// Legacy word list - now using language-specific lists from wordLists.js

export const AssessmentProvider = ({ children }) => {
  // Initialize from URL parameters
  const urlInit = initializeFromUrl();
  const { params, languageConfig, isTokenValid } = urlInit;

  // Get language-specific word list
  const currentWordList = getWordList(params.language);

  // Initialize session
  const sessionInit = initializeSession(params.token, params.language);
  const sessionData = sessionInit.success ? sessionInit.sessionData : null;

  // Debug logging (can be removed in production)
  console.log("Language initialized:", {
    language: params.language,
    languageConfig: languageConfig.name,
    isTokenValid,
    wordListLength: currentWordList.length
  });

  const getInitialIndex = () => {
    const languageProgress = getLanguageProgress(params.token, params.language);
    if (languageProgress) {
      return languageProgress.currentWordIndex || 0;
    }
    const storedIndex = localStorage.getItem(`currentWordIndex_${params.language}`);
    return storedIndex !== null ? parseInt(storedIndex, 10) : 0;
  };

  // State management
  const [language] = useState(params.language);
  const [token] = useState(params.token);
  const [currentWordIndex, setCurrentWordIndex] = useState(getInitialIndex);
  const [currentWord, setCurrentWord] = useState(currentWordList[getInitialIndex()]);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isValidSession] = useState(isTokenValid && sessionInit.success);
  const [languageProgress] = useState(getLanguageProgress(params.token, params.language));

useEffect(() => {
  localStorage.setItem(`currentWordIndex_${language}`, currentWordIndex);
  setCurrentWord(currentWordList[currentWordIndex]);
}, [currentWordIndex, language, currentWordList]);

// Update language-specific progress
useEffect(() => {
  if (isValidSession && token && language) {
    updateLanguageProgress(token, language, {
      currentWordIndex,
      lastWordAccessed: currentWordList[currentWordIndex]
    });
  }
}, [currentWordIndex, isValidSession, token, language]);

// Effect to handle language changes
useEffect(() => {
  if (!isValidSession) {
    setStatusMessage("❌ Invalid or missing token. Please check your URL.");
  } else {
    setStatusMessage("");
  }
}, [isValidSession]);

// Effect to update session stats when assessment is completed
useEffect(() => {
  if (assessmentResult && isValidSession && token) {
    // Update language-specific progress with assessment results
    updateLanguageProgress(token, language, {
      totalAttempts: (languageProgress?.totalAttempts || 0) + 1,
      lastScore: assessmentResult.pronunciationScore,
      bestScore: Math.max(
        languageProgress?.bestScore || 0,
        assessmentResult.pronunciationScore
      ),
      averageScore: calculateAverageScore(
        languageProgress?.averageScore || 0,
        languageProgress?.totalAttempts || 0,
        assessmentResult.pronunciationScore
      )
    });
  }
}, [assessmentResult, isValidSession, token, language, languageProgress]);

// Helper function to calculate running average
const calculateAverageScore = (currentAvg, totalAttempts, newScore) => {
  if (totalAttempts === 0) return newScore;
  return ((currentAvg * totalAttempts) + newScore) / (totalAttempts + 1);
};

const nextWord = () => {
  const nextIndex = (currentWordIndex + 1) % currentWordList.length;
  setCurrentWordIndex(nextIndex);
  setAssessmentResult(null);

  // Update language-specific progress
  if (isValidSession && token && language) {
    updateLanguageProgress(token, language, {
      wordsCompleted: (languageProgress?.wordsCompleted || 0) + 1
    });
  }
};


  return (
    <AssessmentContext.Provider
      value={{
        // Legacy support
        words: currentWordList,
        // Core functionality
        currentWordIndex,
        assessmentResult,
        setAssessmentResult,
        nextWord,
        currentWord,
        setStatusMessage,
        statusMessage,
        // Language support
        language,
        languageConfig,
        token,
        isValidSession,
        currentWordList,
        // Session management
        sessionData,
        languageProgress,
        // Helper functions
        getLanguageConfig: () => getLanguageConfig(language),
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};
