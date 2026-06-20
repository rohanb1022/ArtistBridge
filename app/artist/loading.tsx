"use client";

import { motion } from "framer-motion";
import { Mic2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        {/* SVG Dancing Character Animation */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-28 h-28 flex items-center justify-center text-neutral-900"
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            {/* Head */}
            <motion.circle
              cx="50"
              cy="25"
              r="7"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              animate={{ rotate: [-10, 10, -10] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "50px 25px" }}
            />
            {/* Torso */}
            <line
              x1="50"
              y1="32"
              x2="50"
              y2="65"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            
            {/* Left Arm (Pivots at shoulder) */}
            <motion.g
              style={{ transformOrigin: "50px 40px" }}
              animate={{ rotate: [-60, 30, -60] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <line
                x1="50"
                y1="40"
                x2="28"
                y2="28"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </motion.g>

            {/* Right Arm (Pivots at shoulder) */}
            <motion.g
              style={{ transformOrigin: "50px 40px" }}
              animate={{ rotate: [30, -60, 30] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <line
                x1="50"
                y1="40"
                x2="72"
                y2="28"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </motion.g>

            {/* Left Leg (Pivots at hip) */}
            <motion.g
              style={{ transformOrigin: "50px 65px" }}
              animate={{ rotate: [-25, 20, -25] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <line
                x1="50"
                y1="65"
                x2="35"
                y2="90"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </motion.g>

            {/* Right Leg (Pivots at hip) */}
            <motion.g
              style={{ transformOrigin: "50px 65px" }}
              animate={{ rotate: [20, -25, 20] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <line
                x1="50"
                y1="65"
                x2="65"
                y2="90"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </motion.g>
          </svg>
        </motion.div>

        {/* Text and Icon */}
        <div className="flex items-center gap-2 mt-2">
          <div className="w-6 h-6 rounded-md bg-neutral-900 flex items-center justify-center">
            <Mic2 size={12} className="text-white" />
          </div>
          <span className="text-md font-medium tracking-tight">
            Artist<span className="font-serif italic font-normal text-neutral-600">Bridge</span>
          </span>
        </div>
        <p className="text-xs text-neutral-450 font-sans tracking-wide animate-pulse">
          Tuning the stage for your arrival...
        </p>
      </div>
    </div>
  );
}
