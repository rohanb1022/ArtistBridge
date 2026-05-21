"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Search, BookOpen, LayoutDashboard, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const cards = [
  {
    icon: <Sparkles size={22} />,
    title: "AI Event Assistant",
    description: "Tell our AI your event details and it will instantly recommend the perfect artists from our database.",
    link: "/organizer/ai-assistant",
    accent: "#F59E0B",
    accentBg: "rgba(245,158,11,0.08)",
    accentBorder: "rgba(245,158,11,0.2)",
    tag: "New · AI-Powered",
  },
  {
    icon: <Search size={22} />,
    title: "Browse All Artists",
    description: "Explore our verified database of 2,000+ artists filtered by category, location, and price range.",
    link: "/organizer/explore",
    accent: "#0EA5E9",
    accentBg: "rgba(14,165,233,0.08)",
    accentBorder: "rgba(14,165,233,0.2)",
    tag: "Artist Discovery",
  },
  {
    icon: <BookOpen size={22} />,
    title: "Manage Bookings",
    description: "Track all your bookings in one place — from initial requests to confirmed performances.",
    link: "/organizer/manage-bookings",
    accent: "#10B981",
    accentBg: "rgba(16,185,129,0.08)",
    accentBorder: "rgba(16,185,129,0.2)",
    tag: "Booking Manager",
  },
  {
    icon: <LayoutDashboard size={22} />,
    title: "View Sent Requests",
    description: "Review the history of all your organizer requests and track artist responses in real-time.",
    link: "/organizer/get-request",
    accent: "#7C3AED",
    accentBg: "rgba(124,58,237,0.08)",
    accentBorder: "rgba(124,58,237,0.2)",
    tag: "Request History",
  },
  {
    icon: <Calendar size={22} />,
    title: "Custom Booking",
    description: "Post a custom public request with your event details and let the right artists come to you.",
    link: "/organizer/org-request",
    accent: "#F43F5E",
    accentBg: "rgba(244,63,94,0.08)",
    accentBorder: "rgba(244,63,94,0.2)",
    tag: "Smart Booking",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const OrganizerCTA = () => {
  return (
    <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-sora)" }}>
          Everything You Need to{" "}
          <span style={{ background: "linear-gradient(135deg, #0EA5E9, #38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Power Your Events
          </span>
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          From AI-powered recommendations to seamless booking management — all in one platform.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {cards.map((card) => (
          <motion.div key={card.title} variants={itemVariants}>
            <Link href={card.link}>
              <div
                className="glass-card p-6 h-full group cursor-pointer"
                style={{ borderColor: card.accentBorder }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = card.accentBg;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 48px ${card.accent}15`;
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(20,27,46,0.7)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: card.accentBg, color: card.accent, border: `1px solid ${card.accentBorder}` }}>
                    {card.icon}
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ background: card.accentBg, color: card.accent, border: `1px solid ${card.accentBorder}` }}>
                    {card.tag}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: "var(--font-sora)" }}>
                  {card.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{card.description}</p>
                <div className="mt-5 flex items-center gap-1 text-sm font-medium" style={{ color: card.accent }}>
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
