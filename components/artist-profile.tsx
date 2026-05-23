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
      <div className="min-h-screen flex items-center justify-center bg-[#020817]">
        <Loader2 className="w-12 h-12 animate-spin text-[#F59E0B]" />
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020817] text-red-500 text-xl font-medium">
        {error || "Artist not found."}
      </div>
    );
  }

  return (
    <section className="relative min-h-screen bg-[#020817] text-white overflow-hidden pb-20">
      {/* Background Studio Noir Glows */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#7C3AED]/20 to-transparent pointer-events-none" />
      <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-[#F59E0B]/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] bg-[#0EA5E9]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Header Section */}
      <div className="relative z-10 w-full max-w-5xl mx-auto pt-24 px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center md:items-start gap-8"
        >
          {/* Avatar / Initial Badge */}
          <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#0EA5E9] p-1 shadow-[0_0_40px_rgba(124,58,237,0.3)]">
            <div className="w-full h-full rounded-full bg-[#0F172A] flex items-center justify-center text-5xl font-black tracking-tighter text-white">
              {artist.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E293B]/80 border border-[#334155] text-sm text-[#0EA5E9] font-medium backdrop-blur-md">
              <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" /> Featured Artist
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              {artist.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-zinc-400 font-medium">
              <span className="flex items-center gap-1.5 bg-[#0F172A] px-3 py-1.5 rounded-lg border border-white/5">
                <User className="w-4 h-4 text-[#F59E0B]" />
                {artist.category.join(" • ")}
              </span>
              {artist.city && (
                <span className="flex items-center gap-1.5 bg-[#0F172A] px-3 py-1.5 rounded-lg border border-white/5">
                  <MapPin className="w-4 h-4 text-[#7C3AED]" />
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
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group rounded-3xl border border-white/5 bg-[rgba(20,27,46,0.7)] backdrop-blur-xl p-8 shadow-2xl hover:border-[#7C3AED]/30 transition-all duration-500"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED]">
                  ✦
                </span>
                About the Artist
              </h2>
              <p className="text-zinc-300 leading-relaxed text-lg">
                {artist.bio}
              </p>
            </motion.div>
          )}

          {artist.bestEvent && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group rounded-3xl border border-white/5 bg-[rgba(20,27,46,0.7)] backdrop-blur-xl p-8 shadow-2xl hover:border-[#F59E0B]/30 transition-all duration-500"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B]">
                  ★
                </span>
                Highlight Performance
              </h2>
              <p className="text-zinc-300 text-lg">
                "{artist.bestEvent}"
              </p>
            </motion.div>
          )}
        </div>

        {/* RIGHT COLUMN - Booking & Socials */}
        <div className="space-y-8">
          {artist.price && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative rounded-3xl bg-gradient-to-b from-[#F59E0B]/20 to-transparent p-[1px] shadow-[0_0_30px_rgba(245,158,11,0.1)]"
            >
              <div className="bg-[rgba(15,23,42,0.95)] backdrop-blur-xl rounded-3xl p-8 text-center border border-white/5">
                <p className="text-zinc-400 font-medium mb-2 tracking-wide uppercase text-sm">Starting Price</p>
                <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                  ₹{artist.price}
                </p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link
              href={`/organizer/bookArtist/${artist.id}`}
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] py-5 font-bold text-white shadow-[0_0_40px_rgba(245,158,11,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(245,158,11,0.5)] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="relative text-lg tracking-wide">Request Booking</span>
            </Link>
          </motion.div>

          {/* SOCIALS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="rounded-3xl border border-white/5 bg-[rgba(20,27,46,0.7)] backdrop-blur-xl p-6 shadow-2xl space-y-4"
          >
            <h3 className="text-lg font-bold text-white text-center mb-4">
              Media Portfolio
            </h3>
            <button className="w-full flex items-center justify-center gap-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-3.5 font-semibold transition-all">
              <Youtube className="w-5 h-5" /> YouTube Channel
            </button>
            <button className="w-full flex items-center justify-center gap-3 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 border border-pink-500/20 py-3.5 font-semibold transition-all">
              <Instagram className="w-5 h-5" /> Instagram
            </button>
            <button className="w-full flex items-center justify-center gap-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3.5 font-semibold transition-all">
              <Video className="w-5 h-5" /> Live Performances
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
