"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { artistList } from "@/constants/artist";
import { demoOrganizerList } from "@/constants/organizationlist";
import { Menu } from "lucide-react";
import Footer from "@/sections/artists/Footer";
import Hero from "@/sections/artists/Hero";

export default function ArtistHomePage() {
  return (
    <main className="relative text-white antialiased overflow-hidden">

      {/* ================= ONE GLOBAL BACKGROUND ================= */}
      <div className="fixed inset-0 -z-10">
        {/* base */}
        <div className="absolute inset-0 bg-[#070707]" />

        {/* animated gradients */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[700px] h-[700px] bg-purple-500/20 rounded-full blur-[180px] animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-[160px] animate-pulse delay-2000" />

        {/* grain */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>

      {/* ================= NAV ================= */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl tracking-widest  font-bold text-pink-500">ArtistBridge</h1>
          <Button variant="ghost" size="icon">
            <Menu />
          </Button>
        </div>
      </nav>

      {/* ================= HERO (your old hero logic, redesigned) ================= */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-32">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Welcome Back,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Artist
          </span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl text-gray-300 mb-10">
          Manage bookings, connect with organizers, and perform on bigger stages
          across India.
        </p>

        <div className="flex gap-4">
          <Link href="/artist/profile">
            <Button className="px-8 py-6 text-lg bg-pink-600 hover:bg-pink-700">
              Go to profile
            </Button>
          </Link>
          <Link href="/artist/requests">
            <Button variant="outline" className="px-8 py-6 text-lg text-black">
              View Requests
            </Button>
          </Link>
        </div>
      </section>


      {/* ================= CTA GRID (based on your ArtistCTA) ================= */}
      <section className="py-28 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {[
          {
            title: "🎉 Ready to Perform?",
            text: "View all your confirmed bookings and upcoming shows.",
            link: "/artist/bookings",
            btn: "View Bookings →",
          },
          {
            title: "⏳ Pending Requests",
            text: "You have organizers waiting for your response.",
            link: "/artist/pending",
            btn: "Review Pending →",
          },
          {
            title: "📭 Not Getting Bookings?",
            text: "Update your profile to attract better gigs.",
            link: "/artist/artistdetails",
            btn: "Update Profile →",
          },
          {
            title: "📢 Open Organizer Requests",
            text: "Respond to open requests and grab opportunities.",
            link: "/artist/requests",
            btn: "View Requests →",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:-translate-y-1 transition"
          >
            <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
            <p className="text-gray-300 mb-6">{item.text}</p>
            <Link href={item.link}>
              <Button className="w-full">{item.btn}</Button>
            </Link>
          </div>
        ))}
      </section>

      {/* ================= ARTISTS (your FamousArtist, redesigned) ================= */}
      <section className="py-28 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Artists Already Onboard
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {artistList.map((artist) => (
            <div
              key={artist.name}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition"
            >
              <h4 className="font-semibold text-lg">{artist.name}</h4>
              <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-pink-500/20 text-pink-400">
                {artist.genre}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ORGANIZERS (your OrgDemo, redesigned) ================= */}
      <section className="py-28 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Top Event Organizers
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {demoOrganizerList.map((org) => (
            <div
              key={org.id}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:-translate-y-1 transition"
            >
              <h3 className="text-xl font-semibold text-pink-400">
                {org.name}
              </h3>
              <p className="mt-4 text-gray-300 text-sm">
                {org.description}
              </p>
              <p className="mt-4 text-xs text-gray-400">
                {org.city} • {org.events.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER (cleaned but same content) ================= */}
      <Footer/>
    </main>
  );
}
