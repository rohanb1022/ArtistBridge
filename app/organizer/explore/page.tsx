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
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
    <div className="min-h-screen bg-white text-neutral-900 relative">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-600 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
            Artist Marketplace
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-medium text-neutral-950 mb-4">
            Discover Top <span className="font-serif italic text-neutral-850">Artists</span>
          </h1>
          <p className="text-sm text-neutral-500 max-w-xl mx-auto font-sans leading-relaxed">
            Browse verified artists by category, city, or name. Find the perfect talent for your next event.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="relative w-full max-w-xl">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, city, or category..."
              className="studio-input pl-12 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 size={30} className="animate-spin text-neutral-900" />
            <p className="text-sm text-neutral-450">Fetching artists...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredArtists.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="w-12 h-12 rounded-md flex items-center justify-center mx-auto mb-4 bg-neutral-50 border border-neutral-200 text-neutral-900">
              <Search size={22} />
            </div>
            <h3 className="text-lg font-medium text-neutral-950 mb-2">
              No Artists Found
            </h3>
            <p className="text-sm text-neutral-550">Try broadening your search terms.</p>
          </motion.div>
        )}

        {/* Artist Grid */}
        {!isLoading && filteredArtists.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredArtists.map((artist) => (
              <motion.div key={artist.id} variants={itemVariants}>
                <div className="bg-white border border-neutral-200 rounded-lg p-6 h-full hover:border-neutral-900 hover:shadow-sm transition-all duration-200 flex flex-col justify-between">
                  <div>
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200 flex-shrink-0">
                        {artist.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <h2 className="text-base font-bold text-neutral-900 leading-tight">
                          {artist.name}
                        </h2>
                        <div className="flex items-center gap-1 text-[11px] text-neutral-400 mt-0.5 font-sans">
                          <MapPin size={10} />
                          {artist.city || "India"}
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    {artist.bio && (
                      <p className="text-xs text-neutral-500 leading-relaxed mb-4 text-left font-sans">
                        {artist.bio.length > 120 ? artist.bio.slice(0, 120) + "..." : artist.bio}
                      </p>
                    )}

                    {/* Tags row */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {artist.category.slice(0, 3).map((cat) => (
                        <span key={cat} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] bg-neutral-100 text-neutral-600 border border-neutral-200">
                          <Tag size={8} />
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price + Button */}
                  <div className="flex items-center justify-between border-t border-neutral-100 pt-4 mt-auto">
                    <div className="flex items-center gap-0.5 font-semibold text-sm text-neutral-900">
                      <IndianRupee size={12} />
                      <span>{artist.price?.toLocaleString() || "—"}</span>
                    </div>
                    <Link href={`/organizer/artist-profile/${artist.id}`}>
                      <button className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold border border-neutral-200 hover:border-neutral-900 bg-white hover:bg-neutral-50 text-neutral-700 hover:text-neutral-900 transition-all">
                        View Profile <ArrowRight size={12} />
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
