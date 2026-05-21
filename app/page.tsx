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

const categories = ["Singer", "Dancer", "DJ", "Magician", "Comedian", "Painter", "Poet", "Beatboxer"];

const features = [
  {
    icon: <Zap size={22} />,
    title: "AI-Powered Matching",
    desc: "Our RAG-based AI engine instantly finds the best artists for your event budget and city.",
  },
  {
    icon: <Calendar size={22} />,
    title: "Seamless Booking",
    desc: "Request, negotiate, and confirm bookings in one streamlined workflow.",
  },
  {
    icon: <Star size={22} />,
    title: "Verified Talent",
    desc: "Every artist on our platform is reviewed and verified for quality assurance.",
  },
  {
    icon: <Users size={22} />,
    title: "Dual Dashboard",
    desc: "Dedicated portals for both artists and organizers with real-time status tracking.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ backgroundColor: "#020817" }}>

      {/* ── AMBIENT BLOBS ── */}
      <div className="ambient-blob w-[700px] h-[700px] top-[-200px] left-[-200px]"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)" }} />
      <div className="ambient-blob w-[600px] h-[600px] top-[20%] right-[-150px]"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)", animationDelay: "4s" }} />
      <div className="ambient-blob w-[500px] h-[500px] bottom-0 left-[30%]"
        style={{ background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)", animationDelay: "8s" }} />

      {/* ── GRID OVERLAY ── */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

      {/* ── NAVBAR ── */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #D97706, #F59E0B)" }}>
            <Mic2 size={16} className="text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-sora)" }}>
            Artist<span style={{ color: "#F59E0B" }}>Bridge</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <Link href="/auth/artist/login">
            <button className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              Artist Login
            </button>
          </Link>
          <Link href="/auth/organizer/login">
            <button className="btn-gold px-5 py-2 rounded-lg text-sm">
              Book Artists →
            </button>
          </Link>
        </motion.div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-16 pb-24 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border text-xs font-medium tracking-widest uppercase"
          style={{ borderColor: "rgba(245,158,11,0.3)", color: "#F59E0B", background: "rgba(245,158,11,0.06)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          India&apos;s Premier Artist Marketplace
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
          style={{ fontFamily: "var(--font-sora)" }}
        >
          Make Every Event<br />
          <span className="text-brand">Truly Unforgettable</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed"
        >
          Discover and book world-class artists — singers, dancers, DJs, and more — for your events across India. Powered by AI-driven smart matching.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <Link href="/auth/organizer/signup">
            <button className="btn-gold px-8 py-4 rounded-xl text-base flex items-center gap-2">
              Start Booking Artists <ArrowRight size={18} />
            </button>
          </Link>
          <Link href="/auth/artist/signup">
            <button className="px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 flex items-center gap-2"
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#94A3B8", background: "rgba(255,255,255,0.03)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"; e.currentTarget.style.color = "#F8FAFC"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#94A3B8"; }}
            >
              Join as Artist <ChevronRight size={18} />
            </button>
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-3xl"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={itemVariants} className="text-center">
              <div className="text-3xl font-bold text-gold" style={{ fontFamily: "var(--font-sora)" }}>{stat.value}</div>
              <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CATEGORY PILLS ── */}
      <section className="relative z-10 py-12 overflow-hidden">
        <div className="flex gap-3 justify-center flex-wrap px-6">
          {categories.map((cat, i) => (
            <motion.span
              key={cat}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="px-5 py-2 rounded-full text-sm font-medium cursor-default"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#94A3B8",
              }}
            >
              {cat}
            </motion.span>
          ))}
        </div>
      </section>

      <div className="section-line max-w-4xl mx-auto" />

      {/* ── FEATURES ── */}
      <section className="relative z-10 py-20 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-sora)" }}>
            Built for the <span className="text-gold">Modern Event</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Everything you need to discover talent, manage bookings, and create unforgettable experiences.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants} className="glass-card p-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B" }}>
                {feature.icon}
              </div>
              <h3 className="font-semibold text-white mb-2" style={{ fontFamily: "var(--font-sora)" }}>{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="relative z-10 py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center p-12 rounded-3xl relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(124,58,237,0.08))", border: "1px solid rgba(245,158,11,0.15)" }}
        >
          <h2 className="text-4xl font-bold mb-4 text-white" style={{ fontFamily: "var(--font-sora)" }}>
            Ready to Find Your Perfect Artist?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Join thousands of event organizers who trust ArtistBridge to power their events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/organizer/signup">
              <button className="btn-gold px-8 py-4 rounded-xl text-base">Get Started Free →</button>
            </Link>
            <Link href="/auth/artist/signup">
              <button className="btn-violet px-8 py-4 rounded-xl text-base">Join as Artist</button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t py-8 px-6 text-center"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-slate-600 text-sm">
          © 2026 ArtistBridge · Built with ❤️ by Rohan Bhangale · VESIT, Mumbai
        </p>
      </footer>
    </main>
  );
}
