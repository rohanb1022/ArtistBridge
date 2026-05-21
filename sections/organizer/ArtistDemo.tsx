"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, IndianRupee, Tag, ArrowRight } from "lucide-react";

const dummyArtists = [
  {
    id: 1,
    name: "Rohan Bhangale",
    city: "Mumbai",
    category: ["Singer", "Performer"],
    bio: "Energetic and soulful artist performing at weddings, college fests and live events. Known for adaptability and stage charisma.",
    price: 15000,
    initial: "R",
    accent: "#F59E0B",
  },
  {
    id: 2,
    name: "Aisha Khan",
    city: "Delhi",
    category: ["Dancer", "Choreographer"],
    bio: "Dynamic Bollywood and contemporary dance performer with 5+ years of experience in corporate and wedding events.",
    price: 12000,
    initial: "A",
    accent: "#EC4899",
  },
  {
    id: 3,
    name: "Yash Mehta",
    city: "Bangalore",
    category: ["DJ"],
    bio: "Professional DJ specializing in corporate events and EDM parties. Played at over 100+ gigs across India.",
    price: 18000,
    initial: "Y",
    accent: "#7C3AED",
  },
  {
    id: 4,
    name: "Priya Sharma",
    city: "Bangalore",
    category: ["Singer", "Performer"],
    price: 12000,
    bio: "Versatile singer known for her soulful voice and strong stage presence. Experience at weddings, corporate events, and festivals.",
    initial: "P",
    accent: "#0EA5E9",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const PopularArtists = () => {
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
          Featured{" "}
          <span style={{ background: "linear-gradient(135deg, #F59E0B, #FCD34D)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Artists
          </span>
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          A glimpse of the top talent available on ArtistBridge. Explore thousands more on our platform.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10"
      >
        {dummyArtists.map((artist) => (
          <motion.div key={artist.id} variants={itemVariants}>
            <div className="glass-card p-5 h-full"
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = `${artist.accent}40`;
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                  style={{ background: `${artist.accent}18`, color: artist.accent, border: `1px solid ${artist.accent}30` }}>
                  {artist.initial}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm" style={{ fontFamily: "var(--font-sora)" }}>{artist.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={10} />{artist.city}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {artist.bio.length > 100 ? artist.bio.slice(0, 100) + "..." : artist.bio}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {artist.category.map((cat) => (
                  <span key={cat} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                    style={{ background: `${artist.accent}12`, color: artist.accent, border: `1px solid ${artist.accent}25` }}>
                    <Tag size={9} />{cat}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1 font-bold text-sm" style={{ color: "#F59E0B" }}>
                <IndianRupee size={13} />
                {artist.price.toLocaleString()}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex justify-center">
        <Link href="/organizer/explore">
          <button className="btn-gold px-8 py-3.5 rounded-xl flex items-center gap-2 text-sm">
            Explore All Artists <ArrowRight size={16} />
          </button>
        </Link>
      </div>
    </section>
  );
};

export default PopularArtists;
