import React from "react";

const Header = ({ today = 5, lifetime = 45 }) => {
  return (
    <div className="relative w-[calc(100%-42px)] mx-[21px] flex flex-col items-center pt-[70px] text-white  ">
      {/* Logo */}
      <img
        src="/images/Speeki-ai-Logo__Original_Transparen.png"
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
            <p className="text-base">{today}</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <p className="text-base text-white">Life Time</p>
            <p className="text-base">{lifetime}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
