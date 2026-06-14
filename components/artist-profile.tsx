"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { Youtube, Instagram, Video, Loader2, MapPin, Star, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

/* ---------------- TYPES ---------------- */
interface Artist {
  id: number;
  name: string;
  city?: string;
  category: string[];
  bio?: string;
  price?: number;
  bestEvent?: string;
}

export default function OrganizerArtistProfilePage() {
  const params = useParams();
  const artistId = params?.id as string;

  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!artistId) return;

    const fetchArtist = async () => {
      try {
        const res = await api.get(`/organizer/artist-profile/${artistId}`);
        setArtist(res.data.data);
      } catch (err) {
        setError("Artist not found");
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [artistId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-neutral-800">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-red-500 text-lg font-medium">
        {error || "Artist not found."}
      </div>
    );
  }

  return (
    <section className="relative min-h-screen bg-white text-neutral-900 pb-20">
      {/* Header Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto pt-20 px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center md:items-start gap-8"
        >
          {/* Avatar frame */}
          <div className="w-28 h-28 md:w-32 md:h-32 shrink-0 rounded-full border border-neutral-200 p-1 bg-white flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-neutral-100 flex items-center justify-center text-4xl font-heading font-medium tracking-tighter text-neutral-700">
              {artist.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-neutral-200 bg-neutral-50 text-xs text-neutral-600 font-medium">
              <Star className="w-3 h-3 fill-neutral-500 text-neutral-500" /> Featured Artist
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-neutral-950">
              {artist.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-neutral-500 font-medium text-xs">
              <span className="flex items-center gap-1 bg-neutral-50 px-2.5 py-1 rounded-md border border-neutral-200 uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                {artist.category.join(" • ")}
              </span>
              {artist.city && (
                <span className="flex items-center gap-1 bg-neutral-50 px-2.5 py-1 rounded-md border border-neutral-200 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  {artist.city}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN - Bio & Info */}
        <div className="lg:col-span-2 space-y-8">
          {artist.bio && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-lg border border-neutral-200 bg-white p-8 shadow-xs hover:border-neutral-400 transition-colors"
            >
              <h2 className="text-xl font-heading font-medium text-neutral-900 mb-4 flex items-center gap-2">
                <span className="font-serif italic font-normal text-neutral-500">✦</span>
                About the Artist
              </h2>
              <p className="text-neutral-600 leading-relaxed text-base">
                {artist.bio}
              </p>
            </motion.div>
          )}

          {artist.bestEvent && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-lg border border-neutral-200 bg-white p-8 shadow-xs hover:border-neutral-400 transition-colors"
            >
              <h2 className="text-xl font-heading font-medium text-neutral-900 mb-4 flex items-center gap-2">
                <span className="font-serif italic font-normal text-neutral-500">★</span>
                Highlight Performance
              </h2>
              <p className="text-neutral-600 text-base italic">
                "{artist.bestEvent}"
              </p>
            </motion.div>
          )}
        </div>

        {/* RIGHT COLUMN - Booking & Socials */}
        <div className="space-y-8">
          {artist.price && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center"
            >
              <p className="text-neutral-500 font-medium mb-1 uppercase tracking-wider text-xs">Starting Price</p>
              <p className="text-4xl font-heading font-medium text-neutral-950">
                ₹{artist.price.toLocaleString()}
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <Link
              href={`/organizer/bookArtist/${artist.id}`}
              className="flex w-full items-center justify-center rounded-md bg-neutral-900 py-4 font-medium text-white shadow-xs hover:bg-neutral-800 transition-all text-base tracking-wide"
            >
              Request Booking
            </Link>
          </motion.div>

          {/* SOCIALS */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-lg border border-neutral-200 bg-white p-6 shadow-xs space-y-3"
          >
            <h3 className="text-sm font-semibold text-neutral-850 text-center mb-3">
              Media Portfolio
            </h3>
            <button className="w-full flex items-center justify-center gap-2 rounded-md border border-neutral-200 hover:bg-neutral-50 text-neutral-700 py-3 text-sm font-medium transition-all">
              <Youtube className="w-4 h-4 text-red-600" /> YouTube Channel
            </button>
            <button className="w-full flex items-center justify-center gap-2 rounded-md border border-neutral-200 hover:bg-neutral-50 text-neutral-700 py-3 text-sm font-medium transition-all">
              <Instagram className="w-4 h-4 text-pink-600" /> Instagram
            </button>
            <button className="w-full flex items-center justify-center gap-2 rounded-md border border-neutral-200 hover:bg-neutral-50 text-neutral-700 py-3 text-sm font-medium transition-all">
              <Video className="w-4 h-4 text-neutral-500" /> Live Performances
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
