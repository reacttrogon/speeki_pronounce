import React, { useContext } from "react";
import { AssessmentContext } from "../context/AssessmentContext.jsx"; // adjust path

const WordCard = () => {
  const { assessmentResult, setAssessmentResult, nextWord, currentWord } =
    useContext(AssessmentContext);
  return (
    <div className="max-w-[330px] max-h-[169px] bg-white  absolute top-[35%] z-20 rounded-[12px] shadow-lg  p-[23px] ">
      <h1 className="font-bold text-[24px] text-center underline pb-[8px]">
        {currentWord[0]?.toUpperCase() + currentWord.slice(1).toLowerCase()}
      </h1>

      <p className="text-[14px] leading-[20px] font-medium text-center capitalize text-[#8B8585]">
        Say the word out loud and we'll let you know how well you pronounced it.
      </p>
    </div>
  );
};

export default WordCard;
