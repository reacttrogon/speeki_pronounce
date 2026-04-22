import React, { useContext, useRef, useState, useEffect } from "react";
import axios from "axios";
import { AssessmentContext } from "../context/AssessmentContext.jsx";
import { API_BASE_URL } from "../config/api.js";

const MicButton = ({ onAssessmentComplete }) => {
  const [recording, setRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const streamRef = useRef(null);

  const {
    setAssessmentResult,
    currentWord,
    assessmentResult,
    setStatusMessage,
    statusMessage,
    languageConfig,
  } = useContext(AssessmentContext);
  const wordToAssess = currentWord;

  // Cleanup microphone on unmount to prevent 'zombie' recordings
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleRecordClick = async () => {
    if (isStarting || isProcessing) return;

    if (!recording) {
      try {
        setIsStarting(true);
        setStatusMessage("Initializing microphone...");

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const mimeType = MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : MediaRecorder.isTypeSupported("audio/mp4")
            ? "audio/mp4"
            : "";

        const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
        audioChunks.current = [];
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunks.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          setIsProcessing(true);
          const finalMimeType = mediaRecorder.mimeType || "audio/webm";
          const audioBlob = new Blob(audioChunks.current, { type: finalMimeType });

          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }

          const formData = new FormData();
          formData.append("audio", audioBlob);
          formData.append("word", wordToAssess);
          formData.append("language", languageConfig.speechRecognitionLanguage);
          formData.append("voiceName", languageConfig.voiceName);
          formData.append("includeReferenceAudio", "true");

          setStatusMessage("Analyzing...");

          try {
            const response = await axios.post(
              `${API_BASE_URL}/api/assess-pronunciation`,
              formData,
              { timeout: 30000 }
            );
            setAssessmentResult(response.data);
            setStatusMessage("");
          } catch (error) {
            console.error("API Error:", error);
            setStatusMessage("Analysis failed. Please try again.");
          } finally {
            setIsProcessing(false);
          }
        };

        mediaRecorder.start();
        setRecording(true);
        setStatusMessage("");
      } catch (err) {
        console.error("Mic Access Error:", err);
        setStatusMessage("Microphone unavailable. Check settings.");
        setIsStarting(false);
      } finally {
        setIsStarting(false);
      }
    } else {
      setIsProcessing(true);
      setRecording(false);

      if (mediaRecorderRef.current) {
        try {
          if (mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
          }
        } catch (err) {
          console.error("Stop Error:", err);
          setIsProcessing(false);
        }
      } else {
        setIsProcessing(false);
      }
    }
  };

  if (assessmentResult) return null;

  return (
    <div className={`mic-button-component relative z-10 flex flex-col justify-center w-full mt-6`}>
      {recording ? (
        <div className="flex items-center justify-center gap-1.5 mb-3">
          <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          <span className="text-red-600 text-xs font-medium tracking-tight">Recording...</span>
        </div>
      ) : statusMessage ? (
        <p className="text-center status-message mb-3 text-[10px] text-[#8B8585] font-medium">
          {statusMessage}
        </p>
      ) : null}

      <div className="flex justify-center">
        <button
          onClick={handleRecordClick}
          disabled={isProcessing || isStarting}
          className={`border-0 rounded-full w-16 h-16 flex items-center justify-center transition-all duration-150 ease-in-out active:scale-90 ${recording
            ? "bg-red-600 ring-8 ring-[rgba(220,38,38,0.2)] animate-pulse"
            : (isProcessing || isStarting)
              ? "bg-gray-100 opacity-70 grayscale"
              : "bg-transparent"
            }`}
          tabIndex={0}
        >
          {recording ? (
            <div className="w-6 h-6 bg-white rounded-sm shadow-sm" />
          ) : isProcessing ? (
            <div className="w-8 h-8 border-4 border-gray-100 border-t-[#a40dee] rounded-full animate-spin" />
          ) : (
            <img src="/images/mic.png" alt="Mic Button" className="w-16 h-16 object-contain" />
          )}
        </button>
      </div>
    </div>
  );
};

export default MicButton;
