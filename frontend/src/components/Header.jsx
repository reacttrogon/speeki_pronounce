import React, { useContext } from "react";
import { AssessmentContext } from "../context/AssessmentContext.jsx";

const Header = ({ today = 5, lifetime = 45 }) => {
  const { languageConfig, isValidSession, sessionStats, sessionData } = useContext(AssessmentContext);

  // Use session data if available, otherwise fall back to props
  const todayWords = sessionData?.progress?.wordsCompleted || today;
  const lifetimeWords = Math.max(sessionStats?.totalWords || lifetime, todayWords);
  return (
    <div className="relative w-[calc(100%-42px)] mx-[21px] flex flex-col items-center pt-[70px] text-white  ">
      {/* Language Indicator */}
      {isValidSession && languageConfig && (
        <div className="absolute top-[15px] right-0 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
          <span className="text-lg">{languageConfig.flag}</span>
          <span>{languageConfig.name}</span>
        </div>
      )}

      {/* Session Status Indicator */}
      {!isValidSession && (
        <div className="absolute top-[15px] right-0 bg-red-500/80 backdrop-blur-md rounded-full px-3 py-1 text-xs font-medium">
          ⚠️ Invalid Session
        </div>
      )}

      {/* Logo */}
      <img
        src="./images/Speeki-ai-Logo__Original_Transparen.png"
        alt="Speeki AI brand logo"
        className="w-[51px] h-[47px] absolute top-[24%] left-1/2 transform -translate-x-1/2 z-10"
      />

      {/* Word Tracker */}
      <div className="w-full py-4 mt-4 text-center backdrop-blur-md bg-white/10 rounded-2xl">
        <p className="text-[16px] font-medium text-white  tracking-wide">
          Total Words Learned
        </p>

        {/* Divider line */}
        <div className="border-t-[2px] border-dashed border-white/90 w-[70%] mx-auto my-[15px]"></div>

        {/* Stats Row */}
        <div className="flex justify-around text-sm font-medium text-yellow-400 ">
          <div className="flex items-center justify-center gap-2">
            <p className="text-base text-white">Today</p>
            <p className="text-base">{todayWords}</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <p className="text-base text-white">Total</p>
            <p className="text-base">{lifetimeWords}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
