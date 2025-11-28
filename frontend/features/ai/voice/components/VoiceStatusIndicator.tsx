"use client";

import { Headphones, Mic } from "lucide-react";

interface VoiceStatusIndicatorProps {
  isActive: boolean;
  isSpeaking: boolean;
}

export function VoiceStatusIndicator({
  isActive,
  isSpeaking,
}: VoiceStatusIndicatorProps) {
  if (!isActive) {
    // Inactive state: Static microphone icon
    return (
      <div className="flex items-center justify-center p-2">
        <Mic className="w-6 h-6 text-gray-400" />
      </div>
    );
  }

  if (isSpeaking) {
    // Speaking state: Animated waveform
    return (
      <div className="flex items-center justify-center p-2">
        <div className="waveform">
          <div className="waveform-bar bg-blue-500"></div>
          <div className="waveform-bar bg-blue-500"></div>
          <div className="waveform-bar bg-blue-500"></div>
          <div className="waveform-bar bg-blue-500"></div>
          <div className="waveform-bar bg-blue-500"></div>
        </div>
      </div>
    );
  }

  // Waiting/Listening state: Pulsing headphones icon
  return (
    <div className="flex items-center justify-center p-2">
      <Headphones className="w-6 h-6 text-green-500 animate-pulse" />
    </div>
  );
}
