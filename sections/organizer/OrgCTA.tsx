"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Search, BookOpen, LayoutDashboard, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const cards = [
  {
    icon: <Sparkles size={18} className="text-neutral-900" />,
    title: "AI Event Assistant",
    description: "Tell our AI your event details and it will instantly recommend the perfect artists from our database.",
    link: "/organizer/ai-assistant",
    tag: "New · AI-Powered",
  },
  {
    icon: <Search size={18} className="text-neutral-900" />,
    title: "Browse All Artists",
    description: "Explore our verified database of 2,000+ artists filtered by category, location, and price range.",
    link: "/organizer/explore",
    tag: "Artist Discovery",
  },
  {
    icon: <BookOpen size={18} className="text-neutral-900" />,
    title: "Manage Bookings",
    description: "Track all your bookings in one place — from initial requests to confirmed performances.",
    link: "/organizer/manage-bookings",
    tag: "Booking Manager",
  },
  {
    icon: <LayoutDashboard size={18} className="text-neutral-900" />,
    title: "View Sent Requests",
    description: "Review the history of all your organizer requests and track artist responses in real-time.",
    link: "/organizer/get-request",
    tag: "Request History",
  },
  {
    icon: <Calendar size={18} className="text-neutral-900" />,
    title: "Custom Booking",
    description: "Post a custom public request with your event details and let the right artists come to you.",
    link: "/organizer/org-request",
    tag: "Smart Booking",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const OrganizerCTA = () => {
  return (
    <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto bg-white text-neutral-900">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-heading font-medium text-neutral-900 mb-4">
          Everything you need to <span className="font-serif italic text-neutral-700">power your events.</span>
        </h2>
        <p className="text-neutral-500 max-w-xl mx-auto text-sm md:text-base">
          From AI-powered recommendations to seamless booking management — all in one platform.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {cards.map((card) => (
          <motion.div key={card.title} variants={itemVariants}>
            <Link href={card.link}>
              <div
                className="bg-white border border-neutral-200 rounded-lg p-6 h-full hover:border-neutral-900 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-10 h-10 rounded-md flex items-center justify-center bg-neutral-50 border border-neutral-200">
                      {card.icon}
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                      {card.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-neutral-950 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{card.description}</p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-sm font-semibold text-neutral-900 group-hover:translate-x-1 transition-transform">
                  Get Started →
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default OrganizerCTA;
