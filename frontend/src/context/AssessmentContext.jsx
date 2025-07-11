import { createContext, useEffect, useState } from "react";

export const AssessmentContext = createContext();

const words = [
  "pronunciation",
  "development",
  "interesting",
  "technology",
  "communication",
  "environment",
  "opportunity",
  "understand",
  "experience",
  "important",
  "necessary",
  "different",
  "beautiful",
  "government",
  "knowledge",
  "schedule",
  "temperature",
  "university",
  "laboratory",
  "comfortable",
  "Photography",
  "Vegetable",
  "Comfortable",
  "Chocolate",
  "Wednesday",
  "Lizard",
  "Breakfast",
  "Development",
  "February",
  "Interesting",
  "Library",
  "Family",
  "Secretary",
  "Margarine",
  "Cemetery",
  "Committee",
  "Omelette",
  "Comfortable",
  "Opera",
  "Appreciate",
  "Advertisement",
  "Ballet",
  "Broccoli",
  "Determine",
  "Penalty",
  "Swimming pool",
  "Service",
  "Award",
  "Infinite",
  "Enthusiasm",
  "Nine",
  "Miracle",
  "Atmosphere",
  "Pastel",
  "Psychiatrist",
  "Plumber",
  "Divorce",
  "Opportunity",
  "Management",
  "Finance",
  "Obstacle",
  "Industry",
  "Executive",
  "Delicious",
  "Love",
  "Comfort",
  "License",
  "Forgive",
  "Queen",
  "Quiz",
  "Bowl",
  "Pollution",
  "Forgive",
  "Against",
  "Again",
  "Eyebrow",
  "Menu",
  "Uber",
  "Botox",
  "Aisle",
  "Emerald",
  "Image",
  "Desperate",
  "Content",
  "Divorce",
  "Opportunity",
  "Management",
  "Finance",
  "Towel",
  "Premises",
  "Dilemma",
  "Hazard",
  "Pandemic",
  "Resides",
  "Mannequin",
  "Delicious",
  "Government",
  "Menu",
  "Uber",
  "Stove",
  "Young",
  "Tailor",
  "Target",
  "Botox",
  "License",
  "Algorithm",
  "Executive",
  "Niche",
  "Mischievous",
  "Therapy",
  "Content",
  "Dilemma",
  "Quick",
  "Executive",
  "Mannequin",
  "Delicious",
  "Architect",
  "Forgive",
  "Relative",
  "Toward",
  "Suit",
  "Queer",
  "Quickly",
  "February",
  "Tuesday",
  "Clothes",
  "Onion",
  "Debt",
  "Oven",
  "Coupon",
  "Salmon",
  "Listen",
  "Vehicle",
  "Debt",
  "Sword",
  "Receipt",
  "Island",
  "Debris",
  "Rendezvous",
  "Etc.",
  "Subtle",
  "Cupboard",
  "Genre",
  "Almond",
  "Colonel",
  "Cucumber",
  "Woman",
  "Women",
  "Gauge",
  "Chaos",
  "Mojito",
  "Salad",
  "Password",
];

export const AssessmentProvider = ({ children }) => {
  const getInitialIndex = () => {
    const storedIndex = localStorage.getItem("currentWordIndex");
    return storedIndex !== null ? parseInt(storedIndex, 10) : 0;
  };

  const [currentWordIndex, setCurrentWordIndex] = useState(getInitialIndex);
  const [currentWord, setCurrentWord] = useState(words[getInitialIndex()]);

  const [assessmentResult, setAssessmentResult] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const storedIndex = localStorage.getItem("currentWordIndex");
  

useEffect(() => {
  localStorage.setItem("currentWordIndex", currentWordIndex);
  setCurrentWord(words[currentWordIndex]);
}, [currentWordIndex]);


 const nextWord = () => {
  const nextIndex = (currentWordIndex + 1) % words.length;
  setCurrentWordIndex(nextIndex);
  setAssessmentResult(null);
};


  return (
    <AssessmentContext.Provider
      value={{
        words,
        currentWordIndex,
        assessmentResult,
        setAssessmentResult,
        nextWord,
        currentWord,
        setStatusMessage,
        statusMessage,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};
