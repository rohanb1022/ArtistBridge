// Artist Home Page Sections (App Router)
// Place this file in: /app/artist/page.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { artistList } from "@/constants/artist";
import { demoOrganizerList } from "@/constants/organizationlist";
import Image from "next/image";

const ArtistHomePage = () => {
    
  return (
    <main className="min-h-screen text-white">
  {/* Fullscreen background image */}
  <div className="fixed inset-0 -z-10">
    <Image
      src="/images/artistHome.jpg"
      alt="Artist Home Background"
      fill
      priority
      className="object-cover brightness-[0.4]"
    />
  </div>
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
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
      <section className="py-16 min-h-screen px-4 bg-gray-900">
        <h2 className="text-4xl font-bold text-center mb-10 text-white">
          Explore Top Organizers Who Host Grand Concerts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {demoOrganizerList.map((org: { id: number; name: string; description: string; city: string; events: string[] }) => (
            <div
              key={org.id.toString()}
              className="bg-gray-800 p-6 rounded-xl shadow-xl hover:scale-105 transition-transform"
            >
              <h3 className="text-2xl font-semibold text-pink-400">{org.name}</h3>
              <p className="mt-2 text-sm text-gray-300">
                {org.description || "Leading organizer for large-scale events and concerts."}
              </p>
              <p className="mt-4 text-sm text-gray-500">
                <strong>City:</strong> {org.city}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                <strong>Events:</strong> {org.events.join(", ") || "Various events hosted annually."}
              </p>
            </div>
          ))}
        </div>
        <div className="w-full flex justify-center items-center mt-10" >
          <Button className="bg-grey-900 border rounded-lg border-pink-500 hover:scale-[1.2]" >See the requests you got</Button>
        </div>
      </section>

      {/* Section 3 - Registered Artists */}
      <section className="py-20 px-4 min-h-[85vh] bg-gray-950">
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
