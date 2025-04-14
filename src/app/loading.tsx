"use client";

import { useEffect, useState } from 'react';

const messages = [
  "Preparing your experience...",
  "Almost there...",
  "Loading the good stuff...",
  "Hang tight...",
  "Just a moment..."
];

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 300);

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-8">
      {/* Animated Spinner */}
      <div className="w-16 h-16 border-4 border-opacity-30 border-gray-300 rounded-full 
                      border-t-indigo-500 animate-[spin_1s_ease-in-out_infinite,pulse_2s_ease-in-out_infinite] 
                      mb-8"></div>
      
      {/* Progress Bar */}
      <div className="w-full max-w-xs h-2 bg-gray-200 rounded-full overflow-hidden mb-8">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Rotating Messages */}
      <p className="text-xl text-gray-600 font-medium mb-4 text-center">
        {messages[messageIndex]}
      </p>
      
      {/* Animated Dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span 
            key={i}
            className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></span>
        ))}
      </div>
    </div>
  );
}