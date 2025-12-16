/* eslint-disable @next/next/no-img-element */
// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import api from "@/lib/axios";
// import {
//   Youtube,
//   Instagram,
//   Video,
//   Loader2,
// } from "lucide-react";

// interface Artist {
//   id: number;
//   name: string;
//   city?: string;
//   category: string[];
//   bio?: string;
//   price?: number;
//   bestEvent?: string;
//   youtubeUrl?: string;
//   instagramUrl?: string;
//   introVideoUrl?: string;
// }

// export default function ArtistPublicPage() {
//   const params = useParams();
//   const rawId = params?.id;
//   const artistId = Array.isArray(rawId) ? rawId[0] : rawId;


//   const [artist, setArtist] = useState<Artist | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//   if (!artistId) {
//     setError("Invalid artist profile");
//     setLoading(false);
//     return;
//   }

//   const fetchArtist = async () => {
//     try {
//       const res = await api.get(`/artist/getProfile/${artistId}`);
//       setArtist(res.data.data);
//     } catch (err) {
//       setError("Artist not found");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchArtist();
// }, [artistId]);

//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-black">
//         <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
//       </div>
//     );
//   }

//   if (error || !artist) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-black text-red-500 text-xl">
//         {error || "Something went wrong"}
//       </div>
//     );
//   }

//   return (
//     <section className="relative min-h-screen bg-black text-white px-6 py-16 overflow-hidden">
//       {/*  Glow blobs */}
//       <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-pink-500 via-red-500 to-orange-400 opacity-25 blur-3xl rounded-full animate-pulse" />
//       <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] bg-gradient-to-tr from-orange-400 via-pink-500 to-purple-500 opacity-20 blur-3xl rounded-full animate-pulse" />

//       <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
//         {/* LEFT */}
//         <div className="lg:col-span-2 space-y-6">
//           <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-orange-400 to-purple-500 text-transparent bg-clip-text">
//             {artist.name}
//           </h1>

//           <p className="text-lg text-zinc-300">
//             {artist.category.join(" • ")}
//           </p>

//           {artist.bio && (
//             <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-xl">
//               <h2 className="text-xl font-semibold text-pink-400 mb-2">
//                 About
//               </h2>
//               <p className="text-zinc-200 leading-relaxed">
//                 {artist.bio}
//               </p>
//             </div>
//           )}

//           {artist.bestEvent && (
//             <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-xl">
//               <h2 className="text-xl font-semibold text-orange-400 mb-2">
//                 Best Performance
//               </h2>
//               <p className="text-zinc-200">
//                 {artist.bestEvent}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* RIGHT */}
//         <div className="space-y-6">
//           {/* Price */}
//           {artist.price && (
//             <div className="rounded-2xl bg-gradient-to-r from-pink-500 via-orange-400 to-purple-500 p-[2px] shadow-xl">
//               <div className="bg-black rounded-2xl p-6 text-center">
//                 <p className="text-zinc-400">Starting from</p>
//                 <p className="text-3xl font-bold text-white">
//                   ₹ {artist.price}
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Social Links */}
//           <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-xl space-y-4">
//             <h2 className="text-xl font-semibold text-pink-400 text-center">
//               Connect
//             </h2>

//             {artist.youtubeUrl && (
//               <a
//                 href={artist.youtubeUrl}
//                 target="_blank"
//                 className="flex items-center gap-3 justify-center rounded-full bg-red-600 hover:bg-red-700 py-3 font-semibold transition"
//               >
//                 <Youtube /> YouTube
//               </a>
//             )}

//             {artist.instagramUrl && (
//               <a
//                 href={artist.instagramUrl}
//                 target="_blank"
//                 className="flex items-center gap-3 justify-center rounded-full bg-pink-600 hover:bg-pink-700 py-3 font-semibold transition"
//               >
//                 <Instagram /> Instagram
//               </a>
//             )}

//             {artist.introVideoUrl && (
//               <a
//                 href={artist.introVideoUrl}
//                 target="_blank"
//                 className="flex items-center gap-3 justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 py-3 font-semibold transition"
//               >
//                 <Video /> Intro Video
//               </a>
//             )}
//           </div>

//           {/* CTA */}
//           <button className="w-full rounded-full bg-gradient-to-r from-pink-500 via-orange-400 to-purple-500 py-4 font-bold text-lg shadow-xl hover:scale-105 transition">
//             Book This Artist
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }



"use client";

import React, { useEffect, useRef, useState } from "react";
import api from "@/lib/axios";
import { twMerge } from "tailwind-merge";
import { Youtube, Instagram, Video, Loader2 } from "lucide-react";

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
      <div className="relative mb-2">
        <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-orange-400 opacity-60 blur-lg animate-glow" />
        <img
          src={`https://api.dicebear.com/8.x/lorelei-neutral/svg?seed=${artist.name}`}
          alt="avatar"
          className="relative size-32 rounded-full border-4 border-zinc-800 shadow-xl z-10"
        />
      </div>

      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight font-geist">
        Hi, I'm {artist.name}
      </h1>

      <p className="text-xl text-zinc-300 max-w-lg">
        {artist.category.join(" • ")}
      </p>
    </section>
  );
};

/* ---------------- SOCIALS (STATIC) ---------------- */
const SocialsBlock = () => (
  <div className="flex flex-wrap justify-center gap-4 w-full font-inter">
    <a
      href="#"
      className="flex items-center gap-2 rounded-full bg-red-500 px-7 py-3 text-white font-semibold shadow-lg hover:scale-105 transition"
    >
      <Youtube size={26} /> YouTube
    </a>

    <a
      href="#"
      className="flex items-center gap-2 rounded-full bg-pink-600 px-7 py-3 text-white font-semibold shadow-lg hover:scale-105 transition"
    >
      <Instagram size={26} /> Instagram
    </a>

    <a
      href="#"
      className="flex items-center gap-2 rounded-full bg-zinc-100 px-7 py-3 text-zinc-900 font-semibold shadow-lg hover:scale-105 transition"
    >
      <Video size={26} /> Self Intro
    </a>
  </div>
);

/* ---------------- ABOUT ---------------- */
const AboutBlock = ({ bio }: { bio?: string }) => (
  <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/80 p-7 shadow-lg text-center">
    <p className="text-lg text-zinc-200">
      {bio || "Passionate artist delivering memorable live performances."}
    </p>
  </div>
);

/* ---------------- MESSAGE (UNCHANGED LOGIC) ---------------- */
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

    setTimeout(() => setSent(false), 2000);
  };

  return (
    <section className="w-full flex flex-col items-center gap-4 mt-8 relative">
      {sent && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg">
          Message sent!
        </div>
      )}

      <form onSubmit={handleSend} className="flex w-full max-w-md gap-2">
        <input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-full px-5 py-3 bg-zinc-900 border border-zinc-700 text-white focus:border-pink-400 outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-gradient-to-r from-pink-500 to-orange-400 px-6 py-3 text-white font-semibold hover:scale-105 transition"
        >
          Send
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
      const res = await api.get("/artist/getProfile");
      setArtist(res.data.data);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading || !artist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 px-4 py-16 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-pink-500 via-red-500 to-orange-400 opacity-20 blur-3xl animate-pulse" />

      <div className="w-full max-w-2xl flex flex-col items-center gap-12 z-10">
        <HeroSection artist={artist} />
        <AboutBlock bio={artist.bio} />
        <SocialsBlock />
        <ConnectSection />
      </div>
    </div>
  );
}
