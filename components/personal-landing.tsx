"use client";

import React, { useEffect, useRef, useState } from "react";
import api from "@/lib/axios";
import { Youtube, Instagram, Video, Loader2, Send } from "lucide-react";

/* ---------------- TYPES ---------------- */
interface Artist {
  id: number;
  name: string;
  category: string[];
  bio?: string;
  price?: number;
  bestEvent?: string;
}

/* ---------------- HERO ---------------- */
const HeroSection = ({ artist }: { artist: Artist }) => {
  return (
    <section className="w-full flex flex-col items-center text-center gap-6">
      <div className="relative">
        <img
          src={`https://api.dicebear.com/8.x/lorelei-neutral/svg?seed=${artist.name}`}
          alt="avatar"
          className="size-28 rounded-full border border-neutral-200 shadow-xs z-10 bg-neutral-50"
        />
      </div>

      <h1 className="text-4xl md:text-5xl font-heading font-medium tracking-tight text-neutral-900">
        Hi, I'm <span className="font-serif italic text-neutral-700">{artist.name}</span>
      </h1>

      <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
        {artist.category.join(" • ")}
      </p>
    </section>
  );
};

/* ---------------- SOCIALS ---------------- */
const SocialsBlock = () => (
  <div className="flex flex-wrap justify-center gap-3 w-full max-w-lg">
    <a
      href="#"
      className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-all duration-200"
    >
      <Youtube size={16} className="text-red-600" /> YouTube
    </a>

    <a
      href="#"
      className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-all duration-200"
    >
      <Instagram size={16} className="text-pink-600" /> Instagram
    </a>

    <a
      href="#"
      className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-all duration-200"
    >
      <Video size={16} className="text-neutral-500" /> Self Intro
    </a>
  </div>
);

/* ---------------- ABOUT ---------------- */
const AboutBlock = ({ bio }: { bio?: string }) => (
  <div className="w-full max-w-xl rounded-lg border border-neutral-200 bg-white p-8 shadow-xs text-center">
    <p className="text-base text-neutral-600 leading-relaxed font-sans">
      {bio || "Passionate artist delivering memorable live performances."}
    </p>
  </div>
);

/* ---------------- MESSAGE ---------------- */
const ConnectSection = () => {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSent(true);
    setMessage("");
    inputRef.current?.blur();

    setTimeout(() => setSent(false), 2500);
  };

  return (
    <section className="w-full flex flex-col items-center gap-4 mt-4 relative">
      {sent && (
        <div className="fixed top-6 right-6 bg-neutral-900 text-white px-5 py-3 rounded-md shadow-lg text-sm font-medium z-50">
          Message sent!
        </div>
      )}

      <form onSubmit={handleSend} className="flex w-full max-w-md gap-2">
        <input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send a quick message..."
          className="flex-1 rounded-md px-4 py-2.5 bg-white border border-neutral-200 text-sm text-neutral-900 focus:border-neutral-900 outline-none transition-all placeholder:text-neutral-400"
        />
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-all flex items-center gap-1.5"
        >
          Send
          <Send size={13} />
        </button>
      </form>
    </section>
  );
};

/* ---------------- MAIN PAGE ---------------- */
export default function ArtistProfilePage() {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/artist/getProfile");
        setArtist(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading || !artist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-neutral-800">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50 px-6 py-16 text-neutral-900 relative">
      <div className="w-full max-w-xl flex flex-col items-center gap-10 z-10">
        <HeroSection artist={artist} />
        <AboutBlock bio={artist.bio} />
        <SocialsBlock />
        <ConnectSection />
      </div>
    </div>
  );
}
