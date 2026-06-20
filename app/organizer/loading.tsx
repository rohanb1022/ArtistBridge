"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        {/* Minimalist circular spinner logo */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 border-2 border-neutral-100 rounded-full"
          />
          <motion.div
            className="absolute inset-0 border-2 border-t-neutral-900 border-r-transparent border-b-transparent border-l-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <Sparkles size={20} className="text-neutral-900 animate-pulse" />
        </div>

        {/* Text */}
        <div className="flex items-center gap-2">
          <span className="text-md font-medium tracking-tight">
            Artist<span className="font-serif italic font-normal text-neutral-600">Bridge</span>
          </span>
        </div>
        <p className="text-xs text-neutral-450 font-sans tracking-wide animate-pulse">
          Curating the finest matches...
        </p>
      </div>
    </div>
  );
}
