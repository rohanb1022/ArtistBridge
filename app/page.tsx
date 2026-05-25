"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Mic2, Calendar, Star, Users, Zap, ChevronRight, Play } from "lucide-react";

const stats = [
  { value: "2,000+", label: "Artists Listed" },
  { value: "500+", label: "Events Booked" },
  { value: "50+", label: "Cities Covered" },
  { value: "4.9★", label: "Average Rating" },
];

const categories = ["Singer", "Dancer", "DJ", "Magician", "Comedian", "Painter", "Poet", "Beatboxer", "Instrumentalist", "Photographer"];

const features = [
  {
    icon: <Zap size={24} className="text-cyan-400" />,
    title: "AI-Powered Matching",
    desc: "Our RAG-based AI engine instantly finds the best artists tailored to your exact event budget, vibe, and city.",
  },
  {
    icon: <Calendar size={24} className="text-pink-400" />,
    title: "Seamless Booking",
    desc: "Request, negotiate, and confirm bookings in one completely streamlined workflow with instant notifications.",
  },
  {
    icon: <Star size={24} className="text-purple-400" />,
    title: "Verified Talent",
    desc: "Every artist on our platform is hand-reviewed and verified for quality assurance and professionalism.",
  },
  {
    icon: <Users size={24} className="text-orange-400" />,
    title: "Dual Dashboard",
    desc: "Dedicated, powerful portals for both artists and organizers with real-time status tracking.",
  },
];

export default function HomePage() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax transforms
  const yHeroText = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const yHeroSub = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const yBlobs = useTransform(scrollYProgress, [0, 1], [0, 600]);
  const scaleHero = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <main ref={containerRef} className="relative bg-black min-h-screen text-white font-sans selection:bg-pink-500/30 selection:text-pink-200">
      
      {/* ── PARALLAX AMBIENT BACKGROUND ── */}
      <motion.div style={{ y: yBlobs }} className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-pink-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-cyan-600/10 rounded-full blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        
        {/* Noise overlay for texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}></div>
      </motion.div>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 transition-all duration-300 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 p-[1px]">
              <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
                <Mic2 size={20} className="text-white" />
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Artist<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Bridge</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-4"
          >
            <Link href="/auth/artist/login">
              <button className="px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                Artist Login
              </button>
            </Link>
            <Link href="/auth/organizer/login">
              <button className="px-6 py-2.5 rounded-full text-sm font-semibold bg-white text-black hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Book Artists
              </button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[100vh] px-6 text-center pt-20">
        <motion.div style={{ y: yHeroText, scale: scaleHero, opacity: opacityHero }} className="max-w-5xl mx-auto flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full border border-pink-500/30 bg-pink-500/10 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
            <span className="text-sm font-medium text-pink-200 tracking-wide">India&apos;s Premium Talent Network</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-[7rem] font-black leading-[1.05] tracking-tighter mb-8"
          >
            Unforgettable <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">Experiences.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            style={{ y: yHeroSub }}
            className="text-xl md:text-2xl text-zinc-400 max-w-3xl mb-12 font-light leading-relaxed"
          >
            Discover, book, and manage world-class artists for your events. Powered by intelligent AI matching.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Link href="/auth/organizer/signup">
              <button className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-lg flex items-center gap-3 overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(236,72,153,0.4)]">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                <span className="relative z-10">Start Booking</span>
                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            
            <Link href="/auth/artist/signup">
              <button className="group px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-lg flex items-center gap-3 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95">
                Join as Artist
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform text-zinc-400" />
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── MARQUEE CATEGORIES ── */}
      <section className="relative z-20 py-10 border-y border-white/5 bg-black/50 backdrop-blur-lg overflow-hidden flex whitespace-nowrap">
        <motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex gap-4 px-4"
        >
          {[...categories, ...categories, ...categories].map((cat, i) => (
            <div key={i} className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-lg font-medium text-zinc-300">
              {cat}
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, idx) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="flex flex-col items-center md:items-start border-l border-white/10 pl-6"
            >
              <div className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500 mb-2">
                {stat.value}
              </div>
              <div className="text-zinc-400 text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="relative z-10 py-32 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20 text-center md:text-left"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Engineered for the <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Future of Events.</span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl">
              Everything you need to discover talent, negotiate terms, and manage your entire event roster in one beautiful interface.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-10 overflow-hidden hover:border-white/20 transition-colors"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center mb-8 shadow-xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-lg">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="relative z-10 py-40 px-6 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-5xl mx-auto bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[3rem] p-12 md:p-24 text-center relative shadow-2xl"
        >
          {/* Inner glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-purple-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
          
          <h2 className="relative z-10 text-5xl md:text-7xl font-bold tracking-tight mb-8">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">create magic?</span>
          </h2>
          <p className="relative z-10 text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
            Join thousands of premier event organizers and world-class artists who trust ArtistBridge to make their vision a reality.
          </p>
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/auth/organizer/signup">
              <button className="w-full sm:w-auto px-10 py-5 rounded-full bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                Get Started Free
              </button>
            </Link>
            <Link href="/auth/artist/signup">
              <button className="w-full sm:w-auto px-10 py-5 rounded-full bg-zinc-900 border border-white/20 text-white font-bold text-lg hover:bg-zinc-800 transition-transform hover:scale-105 active:scale-95">
                Apply as Artist
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/10 bg-black pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Mic2 size={16} />
            <span className="font-semibold tracking-tight">ArtistBridge</span>
          </div>
          <p className="text-zinc-600 text-sm font-medium">
            © 2026 ArtistBridge. Designed for the Future of Art.
          </p>
        </div>
      </footer>
    </main>
  );
}
