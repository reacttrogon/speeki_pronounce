import Header from "./components/Header";
import WordCard from "./components/WordCard";
import MicButton from "./components/MicButton";
import Feedback from "./components/Feedback";
import AppTour from "./components/AppTour";
import { useContext } from "react";
import { AssessmentContext } from "./context/AssessmentContext.jsx";

function App() {
  const { assessmentResult, setAssessmentResult, nextWord, isValidSession, token } =
    useContext(AssessmentContext);

  const isBlur = assessmentResult !== null && assessmentResult !== undefined;

  const storedIndex = localStorage.getItem("currentWordIndex");
  const numericIndex = storedIndex !== null ? parseInt(storedIndex, 10) : 0;

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-black font-obviously">
      <div className="min-h-screen bg-[#a40dee] to-white flex flex-col items-center max-w-[600px] w-full relative ">
        {/* upper section */}
        <div
          className={`h-[42vh] w-full bg-retro bg-cover bg-center ${
            isBlur ? "blur-sm" : ""
          }`}
        >
          <Header today={numericIndex + 1} lifetime={100} />
        </div>

        <WordCard
          word=""
          definition="A fact or situation that is observed to exist or happen, especially one whose cause or explanation is in question."
          tries={2}
        />
        {/* bottom section  */}
        <div
          className={`h-[58vh] w-full bg-white relative  pb-[55px]  items-end flex ${
            isBlur ? "blur-sm" : ""
          } `}
        >
          <svg
            className={`absolute top-[-8%] left-0 w-full h-auto z-0 ${
              isBlur ? "blur-sm" : ""
            }`}
            viewBox="0 0 1440 320"
          >
            <path
              fill="white"
              d="M0,0 C360,150 1080,150 1440,0 L1440,320 L0,320 Z"
            ></path>
          </svg>

          <MicButton />
        </div>
        <Feedback />
        <AppTour isValidSession={isValidSession} assessmentResult={assessmentResult} token={token} />
      </div>
    </div>
  );
}

export default App;
