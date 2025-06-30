// Artist Home Page Sections (App Router)
// Place this file in: /app/artist/page.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ArtistHomePage = () => {
    const artistList = [
        { name: "DJ Rexo", genre: "Electronic", city: "Mumbai" },
        { name: "Sufi Soul", genre: "Sufi", city: "Delhi" },
        { name: "Rock Throttle", genre: "Rock", city: "Bangalore" },
        { name: "JazzBeats", genre: "Jazz", city: "Chennai" },  
        { name: "HipHop Vibes", genre: "Hip-Hop", city: "Hyderabad" },
        { name: "Classical Echo", genre: "Classical", city: "Kolkata" },
        { name: "Fusion Beats", genre: "Fusion", city: "Pune" },
        { name: "Indie Groove", genre: "Indie", city: "Ahmedabad" },        
        { name: "Pop Star", genre: "Pop", city: "Jaipur" },
        { name: "Metal Mayhem", genre: "Metal", city: "Lucknow" },
        { name: "Folk Fusion", genre: "Folk", city: "Bhopal" },
        { name: "Reggae Rhythms", genre: "Reggae", city: "Nagpur" },
    ]
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-800 to-gray-700 text-white">

      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-pink-500">
          Welcome Back, Artist
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mb-6">
          Manage your bookings, profile and connect with top organizers across India.
        </p>
        <Link href="/artist/profile">
          <Button className="bg-pink-600 hover:bg-pink-700 rounded-full text-white px-6 py-2 text-lg">
            View Your Profile <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Section 2 - Famous Organizers */}
      <section className="py-20 min-h-screen px-4 bg-gray-900">
        <h2 className="text-4xl font-bold text-center mb-10 text-white">
          Explore Top Organizers Who Host Grand Concerts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Replace these cards with real organizer data */}
          {["VibeNation", "EchoLights", "BeatBuzz"].map((org) => (
            <div
              key={org}
              className="bg-gray-800 p-6 rounded-xl shadow-xl hover:scale-105 transition-transform"
            >
              <h3 className="text-2xl font-semibold text-pink-400">{org}</h3>
              <p className="mt-2 text-sm text-gray-300">
                Known for organizing mega-events across major cities with top artist lineups.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 - Registered Artists */}
      <section className="py-20 px-4 min-h-[90vh] bg-gray-950">
        <h2 className="text-4xl font-bold text-center mb-10 text-white">
          Discover Artists Already Onboard
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          {artistList.map((artist) => (
            <div
              key={artist.name}
              className="bg-gray-800 p-4 rounded-xl shadow hover:scale-105 transition-transform"
            >
              <h4 className="text-xl text-pink-500 font-semibold">{artist.name}</h4>
              <p className="text-sm text-gray-300 mt-1">{artist.genre}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-10 text-center text-gray-400 text-sm bg-black">
        <p>&copy; {new Date().getFullYear()} ArtistBridge. All rights reserved.</p>
        <p className="mt-1">Made with Love for Artists & Organizers</p>
      </footer>
    </main>
  );
};

export default ArtistHomePage;
