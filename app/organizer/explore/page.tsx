"use client";

import api from "@/lib/axios";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Search, MapPin, IndianRupee, Tag, ArrowRight } from "lucide-react";

type Artist = {
  id: number | string;
  name: string;
  bio: string;
  city: string;
  category: string[];
  price: number;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const ExploreArtist = () => {
  const [artists, setArtists] = React.useState<Artist[]>([]);
  const [filteredArtists, setFilteredArtists] = React.useState<Artist[]>([]);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchArtists = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/organizer/getAllArtists");
        setArtists(response.data);
        setFilteredArtists(response.data);
      } catch (error) {
        console.error("Error fetching artists:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtists();
  }, []);

  React.useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = artists.filter(
      (artist) =>
        artist.name.toLowerCase().includes(lowerTerm) ||
        artist.city?.toLowerCase().includes(lowerTerm) ||
        artist.category.some((cat) => cat.toLowerCase().includes(lowerTerm))
    );
    setFilteredArtists(filtered);
  }, [searchTerm, artists]);

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: "#020817" }}>

      {/* Ambient blobs */}
      <div className="ambient-blob w-[600px] h-[600px] top-[-100px] right-[-150px]"
        style={{ background: "radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 70%)" }} />
      <div className="ambient-blob w-[500px] h-[500px] bottom-0 left-[-100px]"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)", animationDelay: "4s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 uppercase tracking-widest"
            style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)", color: "#38BDF8" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            Artist Marketplace
          </div>
          <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-sora)" }}>
            Discover Top{" "}
            <span style={{ background: "linear-gradient(135deg, #0EA5E9, #38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Artists
            </span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Browse verified artists by category, city, or name. Find the perfect talent for your next event.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="relative w-full max-w-xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, city, or category..."
              className="studio-input pl-12 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={36} className="animate-spin" style={{ color: "#0EA5E9" }} />
            <p className="text-slate-500">Fetching artists...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredArtists.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.2)" }}>
              <Search size={28} style={{ color: "#0EA5E9" }} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: "var(--font-sora)" }}>
              No Artists Found
            </h3>
            <p className="text-slate-500">Try broadening your search terms.</p>
          </motion.div>
        )}

        {/* Artist Grid */}
        {!isLoading && filteredArtists.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredArtists.map((artist) => (
              <motion.div key={artist.id} variants={itemVariants}>
                <div className="glass-card p-6 h-full group"
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(14,165,233,0.3)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(14,165,233,0.08)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}>

                  {/* Artist Avatar Placeholder */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.15), rgba(124,58,237,0.15))", color: "#0EA5E9", border: "1px solid rgba(14,165,233,0.2)" }}>
                      {artist.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                        {artist.name}
                      </h2>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <MapPin size={11} />
                        {artist.city || "India"}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {artist.bio && (
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">
                      {artist.bio.length > 120 ? artist.bio.slice(0, 120) + "..." : artist.bio}
                    </p>
                  )}

                  {/* Tags row */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {artist.category.slice(0, 3).map((cat) => (
                      <span key={cat} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ background: "rgba(124,58,237,0.1)", color: "#A78BFA", border: "1px solid rgba(124,58,237,0.2)" }}>
                        <Tag size={10} />
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Price + Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 font-bold" style={{ color: "#F59E0B" }}>
                      <IndianRupee size={15} />
                      <span style={{ fontFamily: "var(--font-sora)" }}>{artist.price?.toLocaleString() || "—"}</span>
                    </div>
                    <Link href={`/organizer/artist-profile/${artist.id}`}>
                      <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                        style={{ background: "rgba(14,165,233,0.1)", color: "#38BDF8", border: "1px solid rgba(14,165,233,0.2)" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(14,165,233,0.2)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "rgba(14,165,233,0.1)")}>
                        View Profile <ArrowRight size={14} />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExploreArtist;
