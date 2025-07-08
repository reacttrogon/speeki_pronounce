import React, { useContext } from "react"; 
import { AssessmentContext } from "../context/AssessmentContext.jsx"; // adjust path

const WordCard = () => {
  const { assessmentResult, setAssessmentResult, nextWord,currentWord } =
    useContext(AssessmentContext);
  return (
    <div className="max-w-[330px] max-h-[169px] bg-white  absolute top-[35%] z-20 rounded-[12px] shadow-lg  p-[23px] ">
      <h1 className="font-bold text-[24px] text-center underline  pb-[8px]  ">
        {currentWord}
      </h1>
      <p className="text-[14px] leading-[20px] font-medium text-center capitalize text-[#8B8585]">
        A fact or situation that is observed to exist or happen, especially one
        whose cause or explanation is in question.
      </p>
    </div>
  );
};

export default WordCard;
