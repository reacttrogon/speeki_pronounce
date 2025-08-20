import React, { useState, useEffect } from 'react';
import Joyride from 'react-joyride';

const AppTour = ({ isValidSession, assessmentResult, token }) => {
  const [runTour, setRunTour] = useState(false);
  const [tourStage, setTourStage] = useState('initial'); // 'initial' or 'feedback'

  // Generate token-specific localStorage keys
  const getStorageKey = (type) => {
    if (!token) return null;
    return `speeki_${type}_tour_completed_${token}`;
  };

  // Debug logging
  useEffect(() => {
    console.log('🔍 AppTour Debug:', {
      isValidSession,
      token: token ? `${token.substring(0, 8)}...` : 'none',
      hasSeenInitialTour: localStorage.getItem(getStorageKey('initial')),
      hasSeenFeedbackTour: localStorage.getItem(getStorageKey('feedback')),
      assessmentResult: !!assessmentResult,
      runTour,
      tourStage
    });
  }, [isValidSession, runTour, assessmentResult, tourStage, token]);

  // Initial tour - runs on first visit for each token
  useEffect(() => {
    const initialTourKey = getStorageKey('initial');
    const hasSeenInitialTour = initialTourKey ? localStorage.getItem(initialTourKey) : null;
    
    console.log('🔍 Initial tour check:', {
      hasSeenInitialTour,
      isValidSession,
      token: token ? `${token.substring(0, 8)}...` : 'none',
      assessmentResult: !!assessmentResult,
      shouldStart: !hasSeenInitialTour && isValidSession && !assessmentResult && token
    });
    
    if (!hasSeenInitialTour && isValidSession && !assessmentResult && token) {
      console.log('⏰ Starting initial tour for new user in 1.5 seconds...');
      setTimeout(() => {
        console.log('🚀 Initial tour starting for new user!');
        setTourStage('initial');
        setRunTour(true);
      }, 1500);
    } else if (!hasSeenInitialTour && isValidSession) {
      // Fallback: Start tour even if assessmentResult exists (for testing)
      console.log('⏰ Fallback: Starting initial tour anyway...');
      setTimeout(() => {
        console.log('🚀 Fallback initial tour starting!');
        setTourStage('initial');
        setRunTour(true);
      }, 2000);
    }
  }, [isValidSession, assessmentResult, token]);

  // Feedback tour - runs when assessment result appears for the first time for each token
  useEffect(() => {
    const feedbackTourKey = getStorageKey('feedback');
    const hasSeenFeedbackTour = feedbackTourKey ? localStorage.getItem(feedbackTourKey) : null;
    
    if (!hasSeenFeedbackTour && assessmentResult && !runTour && token) {
      console.log('🎯 Assessment result detected for user, starting feedback tour...');
      setTimeout(() => {
        console.log('🚀 Feedback tour starting for user!');
        setTourStage('feedback');
        setRunTour(true);
      }, 1000); // Shorter delay since feedback is already visible
    }
  }, [assessmentResult, runTour, token]);

  // Define tour steps based on current stage
  const getSteps = () => {
    if (tourStage === 'initial') {
      return [
        {
          target: '.header-component',
          content: 'Welcome to Speeki! Track your daily progress and see how many words you\'ve mastered.',
          placement: 'bottom',
          disableBeacon: true,
        },
        {
          target: '.word-card-component', 
          content: 'Here\'s your word of the day! Read the definition to understand what you\'ll be pronouncing.',
          placement: 'top',
          disableBeacon: true,
        },
        {
          target: '.mic-button-component',
          content: 'Click this microphone to record your pronunciation. Make sure to speak clearly! Try recording now to see your feedback.',
          placement: 'top',
          disableBeacon: true,
        }
      ];
    } else if (tourStage === 'feedback') {
      return [
        {
          target: '.feedback-component img[alt="Play Reference Audio"]',
          content: '🔊 Click this speaker button to hear the correct pronunciation of the word.',
          placement: 'bottom',
          disableBeacon: true,
        },
        {
          target: '.feedback-component img[alt="Play Audio"]',
          content: '👂 Click this ear button to replay your own recording and compare it with the correct pronunciation.',
          placement: 'bottom',
          disableBeacon: true,
        },
        {
          target: '.colored-word',
          content: '🎯 Click on this colored word to access detailed phoneme-by-phoneme analysis! Each letter will be color-coded with specific pronunciation tips.',
          placement: 'bottom',
          disableBeacon: true,
        },
        {
          target: '.try-again-button',
          content: '🔄 Click "Try Again" if you want to record the same word again to improve your pronunciation.',
          placement: 'top',
          disableBeacon: true,
        },
        {
          target: '.next-word-button',
          content: '➡️ Click "Next Word" when you\'re ready to move on to the next pronunciation challenge!',
          placement: 'top',
          disableBeacon: true,
        }
      ];
    }
    return [];
  };

  const handleJoyrideCallback = (data) => {
    const { status, type, action } = data;
    console.log('🎪 Joyride callback:', { status, type, action, tourStage });
    
    if (status === 'finished' || status === 'skipped') {
      setRunTour(false);
      
      if (tourStage === 'initial') {
        const initialTourKey = getStorageKey('initial');
        localStorage.setItem(initialTourKey, 'true');
        console.log('✅ Initial tour completed');
      } else if (tourStage === 'feedback') {
        const feedbackTourKey = getStorageKey('feedback');
        localStorage.setItem(feedbackTourKey, 'true');
        console.log('✅ Feedback tour completed');
      }
    }
  };

  const tourStyles = {
    options: {
      primaryColor: '#a40dee',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      overlayColor: 'rgba(0, 0, 0, 0.6)',
      spotlightShadow: '0 0 15px rgba(164, 13, 238, 0.5)',
      zIndex: 1000,
      beaconSize: 0,
    },
    tooltip: {
      borderRadius: '12px',
      fontSize: '16px',
    },
    buttonNext: {
      backgroundColor: '#a40dee',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
    },
    buttonBack: {
      color: '#a40dee',
      marginRight: '10px',
    },
    buttonSkip: {
      color: '#666666',
    },
  };

  return (
    <Joyride
      steps={getSteps()}
      run={runTour}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      disableBeacon={true}
      disableOverlayClose={true}
      disableScrolling={true}
      disableScrollParentFix={true}
      scrollToFirstStep={false}
      callback={handleJoyrideCallback}
      styles={tourStyles}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish Tour',
        next: 'Next',
        skip: 'Skip Tour',
      }}
    />
    
  );
};

export default AppTour;
