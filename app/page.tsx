"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mic2, Calendar, Star, Users, Zap, ChevronRight } from "lucide-react";

const stats = [
  { value: "2,000+", label: "Artists Listed" },
  { value: "500+", label: "Events Booked" },
  { value: "50+", label: "Cities Covered" },
  { value: "4.9★", label: "Average Rating" },
];

const categories = ["Singer", "Dancer", "DJ", "Magician", "Comedian", "Painter", "Poet", "Beatboxer", "Instrumentalist", "Photographer"];

const features = [
  {
    icon: <Zap size={20} className="text-neutral-900" />,
    title: "AI-Powered Matching",
    desc: "Our intelligent matching assistant instantly finds the best artists tailored to your event budget, vibe, and city.",
  },
  {
    icon: <Calendar size={20} className="text-neutral-900" />,
    title: "Seamless Booking",
    desc: "Request, negotiate, and confirm bookings in one completely streamlined workflow with real-time status updates.",
  },
  {
    icon: <Star size={20} className="text-neutral-900" />,
    title: "Verified Talent",
    desc: "Every artist on our platform is hand-reviewed and verified for quality assurance, reliability, and professionalism.",
  },
  {
    icon: <Users size={20} className="text-neutral-900" />,
    title: "Dual Dashboard",
    desc: "Dedicated portals for both artists and organizers to keep schedules, pricing, and communication in sync.",
  },
];

export default function HomePage() {
  return (
    <main className="relative bg-white min-h-screen text-neutral-900 font-sans selection:bg-neutral-100">
      
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-5 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
              <Mic2 size={16} className="text-white" />
            </div>
            <span className="text-xl font-medium tracking-tight">
              Artist<span className="font-serif italic font-normal text-neutral-600">Bridge</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <Link href="/auth/artist/login">
              <button className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                Artist Login
              </button>
            </Link>
            <Link href="/auth/organizer/login">
              <button className="px-5 py-2 rounded-md text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition-all">
                Book Artists
              </button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 text-center pt-28 pb-16">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 mb-8 rounded-full border border-neutral-200 bg-neutral-50"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
            <span className="text-xs font-medium text-neutral-600 tracking-wide">India&apos;s Premium Talent Network</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-[7.5rem] font-medium leading-[0.95] tracking-tight mb-8 font-heading"
          >
            Unforgettable <br />
            <span className="font-serif italic text-neutral-800">Experiences.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-neutral-500 max-w-2xl mb-12 leading-relaxed"
          >
            Discover, book, and manage world-class artists for your events. Powered by intelligent RAG-based AI matching.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link href="/auth/organizer/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-7 py-3.5 rounded-md bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-all flex items-center justify-center gap-2">
                Start Booking
                <ArrowRight size={16} />
              </button>
            </Link>
            
            <Link href="/auth/artist/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-7 py-3.5 rounded-md bg-white border border-neutral-200 text-neutral-800 font-medium hover:bg-neutral-50 transition-all flex items-center justify-center gap-1.5">
                Join as Artist
                <ChevronRight size={16} className="text-neutral-400" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── MARQUEE CATEGORIES ── */}
      <section className="py-6 border-y border-neutral-100 bg-neutral-50/50 overflow-hidden flex whitespace-nowrap">
        <motion.div 
          animate={{ x: [0, -800] }} 
          transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
          className="flex gap-4 px-4"
        >
          {[...categories, ...categories, ...categories].map((cat, i) => (
            <div key={i} className="px-6 py-2.5 rounded-md bg-white border border-neutral-200 text-sm font-medium text-neutral-600">
              {cat}
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, idx) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              className="flex flex-col border-l border-neutral-200 pl-6"
            >
              <div className="text-4xl md:text-5xl font-heading font-normal text-neutral-900 mb-1">
                {stat.value}
              </div>
              <div className="text-neutral-500 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-24 px-6 border-t border-neutral-100 bg-neutral-50/30">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center md:text-left"
          >
            <h2 className="text-3xl md:text-5xl font-heading font-normal tracking-tight mb-4 text-neutral-900">
              Engineered for the <span className="font-serif italic text-neutral-600">future of events.</span>
            </h2>
            <p className="text-base md:text-lg text-neutral-500 max-w-xl">
              Everything you need to discover talent, negotiate terms, and manage your entire event roster in one beautiful, clean interface.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="bg-white border border-neutral-200 rounded-lg p-8 hover:border-neutral-400 transition-all duration-200 shadow-sm"
              >
                <div className="w-10 h-10 rounded-md bg-neutral-50 border border-neutral-200 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-neutral-950 mb-2 font-sans">{feature.title}</h3>
                <p className="text-neutral-500 leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-28 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto bg-neutral-50 border border-neutral-200 rounded-lg p-12 md:p-20 text-center relative shadow-xs"
        >
          <h2 className="text-4xl md:text-6xl font-heading font-normal tracking-tight mb-6 text-neutral-900">
            Ready to <span className="font-serif italic text-neutral-600">create magic?</span>
          </h2>
          <p className="text-base md:text-lg text-neutral-500 mb-10 max-w-xl mx-auto">
            Join thousands of event organizers and world-class artists who trust ArtistBridge to make their vision a reality.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth/organizer/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-all">
                Get Started Free
              </button>
            </Link>
            <Link href="/auth/artist/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-white border border-neutral-200 text-neutral-800 font-medium hover:bg-neutral-50 transition-all">
                Apply as Artist
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-neutral-100 bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-80">
            <Mic2 size={15} className="text-neutral-900" />
            <span className="font-medium tracking-tight text-neutral-900 text-sm">ArtistBridge</span>
          </div>
          <p className="text-neutral-400 text-xs font-normal">
            © 2026 ArtistBridge. Designed for the Future of Art.
          </p>
        </div>
      </footer>
    </main>
  );
}
