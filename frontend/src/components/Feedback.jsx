import React, { useContext, useState, useRef, useEffect } from "react";
import { AssessmentContext } from "../context/AssessmentContext.jsx"; // adjust path
import PronunciationTrainer from "./PronunciationTrainer.jsx";

const Feedback = () => {
  const { assessmentResult, setAssessmentResult, nextWord, setStatusMessage } =
    useContext(AssessmentContext);
  
  const [isUserAudioPlaying, setIsUserAudioPlaying] = useState(false);
  const [isReferenceAudioPlaying, setIsReferenceAudioPlaying] = useState(false);
  const userAudioRef = useRef(null);
  const referenceAudioRef = useRef(null);
  const [showTrainer, setShowTrainer] = useState(false);

  const API_BASE_URL = "http://localhost:3000";
  // const API_BASE_URL = "https://speeki-pronounce.trogon.info";
  // const API_BASE_URL = "https://speeki-pronounce-5baqq.ondigitalocean.app";

  // Cleanup audio on component unmount or when assessmentResult changes
  useEffect(() => {
    return () => {
      if (userAudioRef.current) {
        userAudioRef.current.pause();
        userAudioRef.current = null;
      }
      if (referenceAudioRef.current) {
        referenceAudioRef.current.pause();
        referenceAudioRef.current = null;
      }
    };
  }, [assessmentResult]);

  const handlePlayAudio = () => {
    console.log("clicked")
    if (assessmentResult.audioUrl) {
      if (!userAudioRef.current) {
        userAudioRef.current = new Audio(`${API_BASE_URL}${assessmentResult.audioUrl}`);
        userAudioRef.current.addEventListener('ended', () => {
          setIsUserAudioPlaying(false);
        });
      }

      if (isUserAudioPlaying) {
        userAudioRef.current.pause();
        setIsUserAudioPlaying(false);
      } else {
        // Pause reference audio if playing
        if (referenceAudioRef.current && isReferenceAudioPlaying) {
          referenceAudioRef.current.pause();
          setIsReferenceAudioPlaying(false);
        }
        
        userAudioRef.current.play().catch((err) => {
          console.error("Audio play failed:", err);
          setIsUserAudioPlaying(false);
        });
        setIsUserAudioPlaying(true);
      }
    } else {
      console.warn("No audio URL found in assessmentResult");
    }
  };

  const handlePlayReferenceAudio = () => {
    if (assessmentResult.referenceAudio?.data) {
      if (!referenceAudioRef.current) {
        referenceAudioRef.current = new Audio(assessmentResult.referenceAudio.data);
        referenceAudioRef.current.addEventListener('ended', () => {
          setIsReferenceAudioPlaying(false);
        });
      }

      if (isReferenceAudioPlaying) {
        referenceAudioRef.current.pause();
        setIsReferenceAudioPlaying(false);
      } else {
        // Pause user audio if playing
        if (userAudioRef.current && isUserAudioPlaying) {
          userAudioRef.current.pause();
          setIsUserAudioPlaying(false);
        }
        
        referenceAudioRef.current.play().catch((err) => {
          console.error("Reference audio play failed:", err);
          setIsReferenceAudioPlaying(false);
        });
        setIsReferenceAudioPlaying(true);
      }
    } else {
      console.warn("No reference audio available");
    }
  };
  const handleTryAgain = () => {
    setAssessmentResult(null); // Clears feedback
  };

  function ColoredWord({ word, results }) {
    const formattedWord = word.charAt(0).toUpperCase() + word.slice(1);
    return (
      <div style={{ fontSize: "24px", fontFamily: "Arial" }}>
        {formattedWord?.split("").map((letter, index) => {
          const result = results.find((p) => p.letterPosition === index);
          var color = "#C03535";
          if (result?.AccuracyScore > 80) {
            color = "green";
          } else if (result?.AccuracyScore > 50) {
            color = "#FFA500";
          } else {
            color = "#C03535";
          }

          return (
            <span key={index} style={{ color, marginRight: "2px" }}>
              {letter}
            </span>
          );
        })}
      </div>
    );
  }

  // Using AI's original accuracy score instead of calculated average

  // Clear status message when feedback is shown
  useEffect(() => {
    if (assessmentResult) {
      setStatusMessage("");
    }
  }, [assessmentResult, setStatusMessage]);

  if (!assessmentResult) return null;

  return (
    <>
      <div className="feedback-component absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-[330px] bg-white rounded-[20px] shadow-xl px-5 py-6">
        {/* Title */}
        <h5 className="text-sm font-semibold text-center text-gray-700">
          Pronunciation Feedback
        </h5>

        {/* Dotted Divider */}
        <div className="border-t border-dashed border-[#a40dee] my-3 w-full" />

        {/* Word */}
        <div className="colored-word text-center text-[26px] font-bold text-[#C03535] cursor-pointer" onClick={() => setShowTrainer(true)}>
          {/* {assessmentResult?.word} */}
          <ColoredWord
            word={assessmentResult?.word}
            results={assessmentResult?.phonemes}
          />
        </div>

        {/* Audio Controls */}
        <div className="flex items-center justify-center gap-4 mt-2">
          <img
            src="/speeki_pronounce/images/speaker-filled-audio-tool.png"
            alt="Play Audio"
            className="w-8 h-8 cursor-pointer"
            onClick={handlePlayReferenceAudio}
          />
          <img
            src="/speeki_pronounce/images/hearing.png"
            alt="Play Reference Audio"
            className="w-8 h-8 cursor-pointer tr6ansition-opacity hover:opacity-80"
            title="Play reference pronunciation"
            onClick={handlePlayAudio}
          />
        </div>

        {/* Score Box */}
        <div className="mt-4 bg-[#FFF5E5] rounded-md px-4 py-2 text-center border border-yellow-300">
          <p className="text-[16px] font-semibold text-green-700">
            {/* <span role="img" aria-label="smile">
              😃
            </span> */}

            <span className="font-bold text-black">
              Accuracy : {Math.round(assessmentResult.phonemes.reduce((acc, phoneme) => acc + phoneme.AccuracyScore, 0) / assessmentResult.phonemes.length)}%
            </span>
          </p>
          <p className="mt-1 text-xs text-gray-600">
            {assessmentResult?.feedbackMessage}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-2 mt-5 text-sm ">
          {[
            {
              label: "Pronunciation",
              value: assessmentResult.pronunciationScore,
            },
            { label: "Fluency", value: assessmentResult.fluencyScore },
            { label: "Completeness", value: assessmentResult.completenessScore },
          ].map((item) => (
            <div
              key={item.label}
              className="flex justify-between text-center rounded-md "
            >
              <p className="font-medium text-gray-800">{item.label}</p>
              <p className="font-bold text-yellow-500 ">{item.value}%</p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            className="try-again-button px-4 py-2 text-sm font-medium text-red-500 border border-red-400 rounded-md hover:bg-red-50"
            onClick={handleTryAgain}
          >
            Try Again
          </button>
          <button
            className="next-word-button px-4 py-2 rounded-md border border-[#a40dee] text-[#a40dee] font-medium text-sm hover:bg-[#f6ebff]"
            onClick={nextWord}
          >
            Next Word
          </button>
        </div>
      </div>
      {showTrainer && (
        <PronunciationTrainer
          assessmentResult={assessmentResult}
          onClose={() => setShowTrainer(false)}
        />
      )}
    </>
  );
};

export default Feedback;
