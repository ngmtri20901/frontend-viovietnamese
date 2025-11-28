"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Wifi } from "lucide-react";

interface CallConnectingLoaderProps {
  isConnecting: boolean;
}

const connectingMessages = [
  "Connecting to voice assistant...",
  "Establishing secure connection...",
  "Almost there...",
];

export function CallConnectingLoader({
  isConnecting,
}: CallConnectingLoaderProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isConnecting) {
      setMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % connectingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isConnecting]);

  if (!isConnecting) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      {/* Animated phone icon with pulse effect */}
      <div className="relative">
        {/* Outer pulsing rings */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-blue-500"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute inset-0 rounded-full bg-blue-400"
        />

        {/* Phone icon container */}
        <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-6 shadow-lg">
          <Phone className="w-12 h-12 text-white" />
        </div>
      </div>

      {/* Connecting message */}
      <motion.div
        key={messageIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {connectingMessages[messageIndex]}
        </h3>
        <p className="text-sm text-gray-500">Please wait a moment</p>
      </motion.div>

      {/* Signal strength indicator */}
      <div className="flex items-center gap-2">
        <Wifi className="w-4 h-4 text-blue-500" />
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((bar) => (
            <motion.div
              key={bar}
              initial={{ height: 4 }}
              animate={{
                height: [4, 16, 4],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: bar * 0.15,
              }}
              className="w-1 bg-blue-500 rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Dots loader */}
      <div className="flex gap-2">
        {[0, 1, 2].map((dot) => (
          <motion.div
            key={dot}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: dot * 0.2,
            }}
            className="w-2 h-2 bg-blue-500 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
