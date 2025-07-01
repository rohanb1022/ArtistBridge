// Artist Home Page Sections (App Router)
// Place this file in: /app/artist/page.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { artistList } from "@/constants/artist";
import { demoOrganizerList } from "@/constants/organizationlist";
import Image from "next/image";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

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
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-pink-300">
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
      <footer className="py-10 text-center min-h-screen text-gray-400 text-sm bg-black">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <h2 className="text-3xl font-bold mb-4 text-white"> Join the Artist Community</h2>
        <p className="mb-6">
          Connect with fellow artists, showcase your talent, and get discovered by top organizers.
        </p>  
        <Link href="/artist/register">
          <Button 
          className="bg-pink-600 hover:bg-pink-700 rounded-full h-28 w-54 text-white px-6 py-2 text-xl ">
            Register Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
      <div className="max-w-4xl my-10 mx-auto px-4 py-4 text-gray-500">
        <p>&copy; {new Date().getFullYear()} ArtistBridge. All rights reserved.</p>
        <p className="mt-1">Made with Love for Artists & Organizers</p>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-extrabold text-pink-500">ArtistBridge</h2>
          <p className="text-sm mt-2 text-gray-400">
            Connecting event organizers with the perfect artists.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="font-semibold mb-2 text-pink-400">Explore</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/artists">Artists</Link></li>
            <li><Link href="/organizers">Organizers</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold mb-2 text-pink-400">Follow Us</h3>
          <div className="flex gap-4 text-xl text-gray-300">
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold mb-2 text-pink-400">Contact</h3>
          <p className="text-sm text-gray-300">Email: rohanbhangale25@gmail.com</p>
          <p className="text-sm text-gray-300">Phone: +91 93079 85422</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 text-center text-xs text-gray-500 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} ArtistBridge. All rights reserved.
      </div>
    </footer>
    </main>
  );
};

export default ArtistHomePage;
