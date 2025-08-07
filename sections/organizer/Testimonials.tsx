"use client";

import { motion } from "framer-motion";
import React from "react";
import { reviews } from "@/constants/organizationlist";

const InfiniteScroller = ({ reverse }: { reverse?: boolean }) => {
  const duplicated = [...reviews, ...reviews].map((review, index) => ({
    ...review,
    _uid: `${review.id}-${index}`, // ensures unique key
  }));

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-8"
        animate={{ x: reverse ? ["-100%", "100%"] : ["100%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
      >
        {duplicated.map((review) => (
          <div
            key={review._uid}
            className="bg-white/10 text-white border border-white/20 backdrop-blur-md px-6 py-4 rounded-xl text-sm min-w-[400px] min-h-[150px] shadow-lg overflow-hidden break-words"
          >
            <h3 className="text-base font-semibold mb-1">{review.name}</h3>
            <p className="text-gray-400 text-xs">{review.city}</p>
            <p className="mt-2 text-sm leading-relaxed break-words">
              {review.text}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const TestimonialsSection = () => {
  return (
    <section className="bg-black text-white py-16 px-4">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-pink-500 mb-4">
          What People Are Saying
        </h2>
        <p className="text-gray-300">
          Real feedback from our organizers and artists
        </p>
      </div>

      <div className="space-y-10">
        <InfiniteScroller />
        <InfiniteScroller reverse />
      </div>
    </section>
  );
};

export default TestimonialsSection;
