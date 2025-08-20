import React, { useState } from 'react';
import { Volume2, Headphones, X } from 'lucide-react';

const PronunciationTrainer = ({ assessmentResult, onClose }) => {
  // Calculate progress based on overall accuracy score
  const currentProgress = assessmentResult?.phonemes ? 
    Math.round(assessmentResult.phonemes.reduce((acc, phoneme) => acc + phoneme.AccuracyScore, 0) / assessmentResult.phonemes.length) : 0;
  
  // Convert assessment result phonemes to exercises format
  const exercises = assessmentResult?.phonemes?.map(phoneme => {
    const score = phoneme.AccuracyScore;
    if (score > 80) {
      return {
        sound: `${phoneme.phoneme || 'unknown'}`,
        feedback: 'Excellent',
        status: 'excellent'
      };
    } else if (score >= 60) {
      return {
        sound: `${phoneme.phoneme || 'unknown'}`,
        feedback: `${phoneme.feedback}`,
        status: 'good'
      };
    } else {
      return {
        sound: `${phoneme.phoneme || 'unknown'}`,
        feedback: `${phoneme.feedback}`,
        status: 'improvement'
      };
    }
  }) || [];

  const getProgressColor = (progress) => {
    if (progress > 80) return 'bg-green-500';
    if (progress > 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const progressBarColor = getProgressColor(currentProgress);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
      <div className="w-[90%] max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 relative" style={{ background: "#ab30f0" }}>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">{assessmentResult?.word }</h1>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
              <div 
                className={`${progressBarColor} h-3 rounded-full relative transition-all duration-300`}
                style={{ width: `${currentProgress}%` }}
              >
                <div className="absolute right-0 top-0 transform translate-x-1/2 -translate-y-1">
                  <div className={`${progressBarColor} text-white text-xs font-bold px-2 py-1 rounded`}>
                    {currentProgress}%
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            className="absolute top-4 right-4 bg-slate-100 rounded-full p-1 text-black font-extrabold opacity-50 hover:opacity-100"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Sound</h2>
            <h2 className="text-xl font-semibold text-gray-800">Feedback</h2>
          </div>

          {/* Exercise List - Synchronized Scrollable */}
          <div className="h-96 overflow-y-auto">
            <div className="space-y-4 pr-2">
              {exercises.map((exercise, index) => (
                <div key={index} className="flex space-x-4 items-start">
                  {/* Sound Column */}
                  <div className="w-[20%] flex-shrink-0 text-center">
                    <div className="text-xl font-mono text-gray-800 p-2">
                      {exercise.sound}
                    </div>
                  </div>

                  {/* Feedback Column */}
                  <div className="w-[80%] flex-1">
                    <div className={`p-2 rounded-lg ${
                      exercise.status === 'excellent' ? 'bg-green-50 border-green-200' :
                      exercise.status === 'good' ? 'bg-orange-50 border-orange-200' :
                      'bg-red-50 border-red-200'
                    }`}>
                      {exercise.status === 'excellent' && (
                        <div className="text-green-600 font-semibold text-lg">
                          Excellent
                        </div>
                      )}
                      {exercise.status === 'good' && (
                        <div className="text-orange-600 font-semibold text-lg">
                          Good
                        </div>
                      )}
                      {exercise.status === 'improvement' && (
                        <div className="text-red-500 font-semibold text-lg">
                          Improvement
                        </div>
                      )}
                      <div className="text-gray-700 text-sm leading-relaxed mt-1">
                        {exercise.feedback}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PronunciationTrainer;
