"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import useVapi from "@/hooks/use-vapi";

const RadialCard: React.FC = () => {
  const { volumeLevel, isSessionActive, toggleCall } = useVapi();
  const [bars, setBars] = useState(Array(50).fill(0));

  useEffect(() => {
    if (isSessionActive) {
      updateBars(volumeLevel);
    } else {
      resetBars();
    }
  }, [volumeLevel, isSessionActive]);

  const updateBars = (volume: number) => {
    setBars(bars.map(() => Math.random() * volume * 50));
  };

  const resetBars = () => {
    setBars(Array(50).fill(0));
  };

  return (
    <div className="border-2 border-amber-300/30 bg-white/40 backdrop-blur-sm text-center justify-items-center p-4 rounded-2xl shadow-lg">
      <div
        className="flex items-center justify-center h-full relative"
        style={{ width: "300px", height: "300px" }}
      >
        {isSessionActive ? (
          <MicOff
            size={32}
            className="text-red-600 hover:text-red-700 transition-colors duration-200"
            onClick={toggleCall}
            style={{
              cursor: "pointer",
              zIndex: 10,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
            }}
          />
        ) : (
          <Mic
            size={32}
            className="text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
            onClick={toggleCall}
            style={{
              cursor: "pointer",
              zIndex: 10,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
            }}
          />
        )}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 300 300"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {bars.map((height, index) => {
            const angle = (index / bars.length) * 360;
            const radians = (angle * Math.PI) / 180;
            const x1 = 150 + Math.cos(radians) * 50;
            const y1 = 150 + Math.sin(radians) * 50;
            const x2 = 150 + Math.cos(radians) * (100 + height);
            const y2 = 150 + Math.sin(radians) * (100 + height);

            // Gradient color based on height for more visual appeal
            const intensity = Math.min(height / 30, 1);
            const colorClass = isSessionActive
              ? intensity > 0.7
                ? "stroke-orange-500"
                : intensity > 0.4
                ? "stroke-amber-500"
                : "stroke-yellow-500"
              : "stroke-slate-400";

            return (
              <motion.line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={`${colorClass} opacity-80`}
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ x2: x1, y2: y1 }}
                animate={{ x2, y2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            );
          })}
        </svg>

        {/* Updated blur effect with warmer colors */}
        <span
          className={`absolute top-48 w-[calc(100%-70%)] h-[calc(100%-70%)] rounded-full ${
            isSessionActive
              ? "bg-gradient-to-br from-orange-400 to-amber-400"
              : "bg-gradient-to-br from-slate-300 to-gray-300"
          } blur-[120px] opacity-30`}
        ></span>

        {/* Additional inner glow effect */}
        <div
          className={`absolute inset-0 rounded-full ${
            isSessionActive
              ? "bg-gradient-radial from-amber-200/20 via-transparent to-transparent"
              : "bg-gradient-radial from-gray-200/10 via-transparent to-transparent"
          }`}
          style={{
            background: isSessionActive
              ? "radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(156, 163, 175, 0.05) 0%, transparent 70%)",
          }}
        />
      </div>
    </div>
  );
};

export default RadialCard;
