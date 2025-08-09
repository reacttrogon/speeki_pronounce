import React, { useContext, useRef, useState } from "react";
import axios from "axios";
import { AssessmentContext } from "../context/AssessmentContext.jsx"; // adjust path

const API_BASE_URL = "http://localhost:3000";


const MicButton = ({ onAssessmentComplete }) => {
  const [recording, setRecording] = useState(false);
  // const [statusMessage, setStatusMessage] = useState("");
  const [responseData, setResponseData] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const {
    setAssessmentResult,
    currentWord,
    assessmentResult,
    setStatusMessage,
    statusMessage,
    language,
    languageConfig,
  } = useContext(AssessmentContext);
  const wordToAssess = currentWord;

  const handleRecordClick = async () => {
    if (!recording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        audioChunks.current = [];
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunks.current.push(e.data);
          }
        };

        setStatusMessage("Recording...");

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, {
            type: "audio/webm",
          });

          // Stop mic stream
          stream.getTracks().forEach((track) => track.stop());

          const formData = new FormData();
          formData.append("audio", audioBlob);
          formData.append("word", wordToAssess);
          formData.append("language", languageConfig.speechRecognitionLanguage);
          formData.append("voiceName", languageConfig.voiceName);
          formData.append("includeReferenceAudio", "true");

          // Debug logging
          console.log("Sending assessment request with:", {
            word: wordToAssess,
            language: languageConfig.speechRecognitionLanguage,
            voiceName: languageConfig.voiceName,
            currentLanguage: language
          });

          setStatusMessage("Processing...");

          try {
            const response = await axios.post(
              `${API_BASE_URL}/api/assess-pronunciation`,
              formData
            );

            setResponseData(response.data); // optional if you want to show result later
            setAssessmentResult(response.data);
            setStatusMessage("✅ Assessment Complete!");

            if (onAssessmentComplete) {
              onAssessmentComplete(response.data);
            }
          } catch (error) {
            console.error("API Error:", error);
            setStatusMessage("❌ Error during processing.");
          }
        };

        mediaRecorder.start();
        setRecording(true);
      } catch (err) {
        console.error("Microphone access denied:", err);
        setStatusMessage("❌ Microphone access denied.");
      }
    } else {
      // Stop recording
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
        setRecording(false);
      }
    }
  };

  if (assessmentResult) return null;

  return (
    <div className={`relative z-10 flex flex-col justify-center w-full mt-6 `}>
      {statusMessage && (
        <p className="text-center status-message text-muted mb-3 text-[10px] text-[#8B8585] ">
          {statusMessage}
        </p>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleRecordClick}
          className={`bg-red-300 border-0 rounded-full  w-16 h-16  items-center justify-center transition-transform duration-150 ease-in-out active:scale-90 ${
            recording ? "ring-8 ring-[rgba(164,13,238,0.2)] animate-pulse" : ""
          }`}
          tabIndex={0}
        >
          <img src="./images/mic.png" alt="Mic Button" className="w-16 h-16" />
        </button>
      </div>
    </div>
  );
};

export default MicButton;
