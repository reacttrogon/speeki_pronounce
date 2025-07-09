import React, { useContext } from "react";
import { AssessmentContext } from "../context/AssessmentContext.jsx"; // adjust path

const Feedback = () => {
  const { assessmentResult, setAssessmentResult, nextWord, setStatusMessage } =
    useContext(AssessmentContext);

  const handlePlayAudio = () => {
    if (assessmentResult.audioUrl) {
      const audio = new Audio(
        `speeki-pronounce-xj252.ondigitalocean.app${assessmentResult.audioUrl}`
      );
      audio.play();
    } else {
      console.warn("No audio URL found in assessmentResult");
    }
  };

  const handleTryAgain = () => {
    setAssessmentResult(null); // Clears feedback
  };

  function ColoredWord({ word, results }) {
    return (
      <div style={{ fontSize: "24px", fontFamily: "Arial" }}>
        {word.split("").map((letter, index) => {
          const result = results.find((p) => p.letterPosition === index);
          const color = result?.AccuracyScore > 80 ? "green" : "#C03535";
          // console.log("results", results);

          // const avgScore =
          //   results?.AccuracyScore.reduce((sum, p) => sum + p.AccuracyScore, 0) /
          //   results.length;
          return (
            <span key={index} style={{ color, marginRight: "2px" }}>
              {letter}
            </span>
          );
        })}
      </div>
    );
  }

  let avgScore = 0;

  if (assessmentResult?.phonemes?.length) {
    const totalScore = assessmentResult.phonemes.reduce(
      (sum, item) => sum + item.AccuracyScore,
      0
    );
    avgScore = totalScore / assessmentResult.phonemes.length;
  }

  if (!assessmentResult) return null;
  if (assessmentResult) {
    setStatusMessage("");
  }

  return (
    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-[330px] bg-white rounded-[20px] shadow-xl px-5 py-6">
      {/* Title */}
      <h5 className="text-sm font-semibold text-center text-gray-700">
        Pronunciation Feedback
      </h5>

      {/* Dotted Divider */}
      <div className="border-t border-dashed border-[#a40dee] my-3 w-full" />

      {/* Word */}
      <div className="text-center text-[26px] font-bold text-[#C03535]">
        {/* {assessmentResult?.word} */}
        <ColoredWord
          word={assessmentResult?.word}
          results={assessmentResult?.phonemes}
        />
      </div>

      {/* Audio Controls */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <img
          src="/images/speaker-filled-audio-tool.png"
          alt="Play Audio"
          className="w-6 h-6 cursor-pointer"
          onClick={handlePlayAudio}
        />
        {/* <img
          src="/images/hearing.png"
          alt="Listen Again"
          className="w-6 h-6 cursor-pointer"
        /> */}
      </div>

      {/* Score Box */}
      <div className="mt-4 bg-[#FFF5E5] rounded-md px-4 py-2 text-center border border-yellow-300">
        <p className="text-[16px] font-semibold text-green-700">
          {/* <span role="img" aria-label="smile">
            😃
          </span> */}

          <span className="font-bold text-black">
            Accuracy : {Math.round(avgScore)}%
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
          { label: "Accuracy", value: assessmentResult.AccuracyScore },
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
          className="px-4 py-2 text-sm font-medium text-red-500 border border-red-400 rounded-md hover:bg-red-50"
          onClick={handleTryAgain}
        >
          Try Again
        </button>
        <button
          className="px-4 py-2 rounded-md border border-[#a40dee] text-[#a40dee] font-medium text-sm hover:bg-[#f6ebff]"
          onClick={nextWord}
        >
          Next Word
        </button>
      </div>
    </div>
  );
};

export default Feedback;
