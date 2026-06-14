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
  },
  {
    id: 2,
    name: "Aisha Khan",
    city: "Delhi",
    category: ["Dancer", "Choreographer"],
    bio: "Dynamic Bollywood and contemporary dance performer with 5+ years of experience in corporate and wedding events.",
    price: 12000,
    initial: "A",
  },
  {
    id: 3,
    name: "Yash Mehta",
    city: "Bangalore",
    category: ["DJ"],
    bio: "Professional DJ specializing in corporate events and EDM parties. Played at over 100+ gigs across India.",
    price: 18000,
    initial: "Y",
  },
  {
    id: 4,
    name: "Priya Sharma",
    city: "Bangalore",
    category: ["Singer", "Performer"],
    price: 12000,
    bio: "Versatile singer known for her soulful voice and strong stage presence. Experience at weddings, corporate events, and festivals.",
    initial: "P",
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

const PopularArtists = () => {
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
          Featured <span className="font-serif italic text-neutral-700">Artists</span>
        </h2>
        <p className="text-neutral-500 max-w-xl mx-auto text-sm md:text-base">
          A glimpse of the top talent available on ArtistBridge. Explore thousands more on our platform.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {dummyArtists.map((artist) => (
          <motion.div key={artist.id} variants={itemVariants}>
            <div className="bg-white border border-neutral-200 rounded-lg p-5 h-full hover:border-neutral-900 hover:shadow-sm transition-all duration-200 flex flex-col justify-between">
              
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200 flex-shrink-0">
                    {artist.initial}
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 text-sm">{artist.name}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                      <MapPin size={10} />{artist.city}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                  {artist.bio.length > 100 ? artist.bio.slice(0, 100) + "..." : artist.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {artist.category.map((cat) => (
                    <span key={cat} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-neutral-100 text-neutral-600 border border-neutral-200">
                      <Tag size={8} />{cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1 font-semibold text-sm text-neutral-900">
                <IndianRupee size={12} />
                {artist.price.toLocaleString()}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex justify-center">
        <Link href="/organizer/explore">
          <button className="btn-gold px-6 py-3 rounded-md flex items-center gap-2 text-sm">
            Explore All Artists <ArrowRight size={15} />
          </button>
        </Link>
      </div>
    </section>
  );
};

export default PopularArtists;
