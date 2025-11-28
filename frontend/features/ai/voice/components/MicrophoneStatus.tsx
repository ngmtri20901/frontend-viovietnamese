"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, AlertCircle } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface MicrophoneStatusProps {
  isCallActive: boolean;
}

export function MicrophoneStatus({ isCallActive }: MicrophoneStatusProps) {
  const [micPermission, setMicPermission] = useState<
    "granted" | "denied" | "pending"
  >("pending");
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [hasRecentAudio, setHasRecentAudio] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isCallActive) {
      // Cleanup when call is not active
      cleanup();
      setMicPermission("pending");
      setVolumeLevel(0);
      setHasRecentAudio(false);
      setError(null);
      return;
    }

    // Request microphone access when call is active
    const initMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = stream;
        setMicPermission("granted");
        setError(null);

        // Setup Web Audio API
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        // Start monitoring volume
        monitorVolume();

        // Start silence detection timer
        resetSilenceTimer();
      } catch (err) {
        console.error("Microphone access error:", err);
        setMicPermission("denied");
        setError("Microphone permission denied");
      }
    };

    initMicrophone();

    return () => {
      cleanup();
    };
  }, [isCallActive]);

  const monitorVolume = () => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      const average =
        dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      const normalizedVolume = Math.min(100, (average / 128) * 100);

      setVolumeLevel(normalizedVolume);

      // Detect audio activity
      if (normalizedVolume > 5) {
        setHasRecentAudio(true);
        resetSilenceTimer();
      }

      animationFrameRef.current = requestAnimationFrame(updateVolume);
    };

    updateVolume();
  };

  const resetSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    silenceTimerRef.current = setTimeout(() => {
      setHasRecentAudio(false);
      setError("No audio detected - please check your microphone");
    }, 5000); // 5 seconds of silence
  };

  const cleanup = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  if (!isCallActive) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <MicOff className="w-4 h-4" />
        <span>Mic inactive</span>
      </div>
    );
  }

  if (micPermission === "denied") {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <AlertCircle className="w-4 h-4" />
        <span>Microphone access denied</span>
      </div>
    );
  }

  if (micPermission === "pending") {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Mic className="w-4 h-4 animate-pulse" />
        <span>Requesting access...</span>
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full">
      {/* Mic Status */}
      <div className="flex items-center gap-2">
        <Mic
          className={cn(
            "w-4 h-4",
            hasRecentAudio ? "text-green-500" : "text-gray-400"
          )}
        />
        <span className="text-sm font-medium">
          {hasRecentAudio ? "Mic active" : "Waiting for input..."}
        </span>
      </div>

      {/* Volume Bar */}
      <div className="volume-bar">
        <div
          className="volume-bar-fill"
          style={{ width: `${volumeLevel}%` }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-1 text-xs text-orange-600">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
