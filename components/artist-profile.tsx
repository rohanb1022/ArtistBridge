"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { Youtube, Instagram, Video, Loader2 } from "lucide-react";
import Link from "next/link";

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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500 text-xl">
        {error || "Something went wrong"}
      </div>
    );
  }

  return (
    <section className="relative min-h-screen bg-black text-white px-6 py-16 overflow-hidden">
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-pink-500 via-red-500 to-orange-400 opacity-25 blur-3xl rounded-full animate-pulse" />
      <div className="pointer-events-none top-1/3 absolute -right-40 w-[450px] h-[450px] bg-gradient-to-tr from-orange-400 via-pink-500 to-purple-500 opacity-20 blur-3xl rounded-full animate-pulse" />

      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-orange-400 to-purple-500 text-transparent bg-clip-text">
            {artist.name}
          </h1>

          <p className="text-lg text-zinc-300">{artist.category.join(" • ")}</p>

          {artist.bio && (
            <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-pink-400 mb-2">
                About Artist
              </h2>
              <p className="text-zinc-200 leading-relaxed">{artist.bio}</p>
            </div>
          )}

          {artist.bestEvent && (
            <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-orange-400 mb-2">
                Best Performance
              </h2>
              <p className="text-zinc-200">{artist.bestEvent}</p>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {artist.price && (
            <div className="rounded-2xl bg-gradient-to-r from-pink-500 via-orange-400 to-purple-500 p-[2px] shadow-xl">
              <div className="bg-black rounded-2xl p-6 text-center">
                <p className="text-zinc-400">Starting from</p>
                <p className="text-3xl font-bold text-white">
                  ₹ {artist.price}
                </p>
              </div>
            </div>
          )}

          {/* STATIC SOCIALS (INTERVIEW SAFE) */}
          <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-semibold text-pink-400 text-center">
              Media & Socials
            </h2>

            <div className="flex items-center gap-3 justify-center rounded-full bg-red-600 py-3 font-semibold">
              <Youtube /> YouTube
            </div>

            <div className="flex items-center gap-3 justify-center rounded-full bg-pink-600 py-3 font-semibold">
              <Instagram /> Instagram
            </div>

            <div className="flex items-center gap-3 justify-center rounded-full bg-zinc-800 py-3 font-semibold">
              <Video /> Intro Video
            </div>
          </div>
          <Link
            href={`/organizer/bookArtist/${artist.id}`}
            className="block w-full text-center rounded-full bg-gradient-to-r from-pink-500 via-orange-400 to-purple-500 py-4 font-bold text-lg shadow-xl hover:scale-105 transition"
          >
            Request Booking
          </Link>
        </div>
      </div>
    </section>
  );
}
