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
        animate={{ x: reverse ? ["-100%", "100%"] : ["100%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
      >
        {duplicated.map((review) => (
          <div
            key={review._uid}
            className="glass-card px-6 py-5 min-w-[360px] flex-shrink-0"
          >
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill="#F59E0B" style={{ color: "#F59E0B" }} />
              ))}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4 break-words">
              &quot;{review.text}&quot;
            </p>
            <div>
              <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-sora)" }}>{review.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{review.city}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const TestimonialsSection = () => {
  return (
    <section className="relative z-10 py-16 px-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 px-6"
      >
        <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-sora)" }}>
          Loved by{" "}
          <span style={{ background: "linear-gradient(135deg, #0EA5E9, #38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Organizers
          </span>
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
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
