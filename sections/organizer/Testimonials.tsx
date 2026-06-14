"use client";

import { motion } from "framer-motion";
import React from "react";
import { reviews } from "@/constants/organizationlist";
import { Star } from "lucide-react";

const InfiniteScroller = ({ reverse }: { reverse?: boolean }) => {
  const duplicated = [...reviews, ...reviews].map((review, index) => ({
    ...review,
    _uid: `${review.id}-${index}`,
  }));

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-5"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        style={{ width: "fit-content" }}
      >
        {duplicated.map((review) => (
          <div
            key={review._uid}
            className="bg-white border border-neutral-200 rounded-lg px-6 py-5 min-w-[320px] max-w-[320px] flex-shrink-0 shadow-xs"
          >
            <div className="flex items-center gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} fill="#B45309" className="text-amber-600" />
              ))}
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed mb-4 break-words font-sans">
              &quot;{review.text}&quot;
            </p>
            <div>
              <p className="text-xs font-semibold text-neutral-900">{review.name}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">{review.city}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const TestimonialsSection = () => {
  return (
    <section className="relative z-10 py-16 px-0 overflow-hidden bg-white text-neutral-900">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 px-6"
      >
        <h2 className="text-4xl font-heading font-medium text-neutral-900 mb-4">
          Loved by <span className="font-serif italic text-neutral-700">Organizers</span>
        </h2>
        <p className="text-neutral-500 max-w-xl mx-auto text-sm md:text-base">
          Real feedback from event organizers and artists who use ArtistBridge every day.
        </p>
      </motion.div>

      <div className="space-y-6">
        <InfiniteScroller />
        <InfiniteScroller reverse />
      </div>
    </section>
  );
};

export default TestimonialsSection;
