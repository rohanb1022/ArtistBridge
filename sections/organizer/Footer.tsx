"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/axios";

const Footer = () => {

  const router = useRouter();
  const [error, setError] = useState("");

    const handleLogout = async () => {
    try {
      const response = await api.post("/auth/logout");
      console.log(response.data);
      router.push("/auth/organizer/login");
    } catch (error: unknown) {
      setError("Failed to logout.");
    }
  };

  return (
    <footer className="bg-zinc-900 text-gray-300 py-12 px-6 mt-10 border-t border-zinc-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo / Intro */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">ArtistBridge</h2>
          <p className="text-sm">
            Connecting talented artists with event organizers across India.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-pink-500 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/organizer/home" className="hover:underline">Home</Link></li>
            <li><Link href="/explore" className="hover:underline">Explore Artists</Link></li>
            <li><Link href="/auth/organizer/login" className="hover:underline">Organizer Login</Link></li>
            <li><Link href="/auth/artist/login" className="hover:underline">Artist Login</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-pink-500 mb-3">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-lg font-semibold text-pink-500 mb-3">Follow Us</h3>
          <div className="flex gap-4">
            <Link href="#"><Facebook className="w-5 h-5 hover:text-pink-500" /></Link>
            <Link href="#"><Instagram className="w-5 h-5 hover:text-pink-500" /></Link>
            <Link href="#"><Twitter className="w-5 h-5 hover:text-pink-500" /></Link>
            <Link href="#"><Linkedin className="w-5 h-5 hover:text-pink-500" /></Link>
          </div>
        </div>

        <div>
          <Button
            variant="outline"
            className="mt-4 w-fit border-pink-600 text-pink-500 hover:bg-pink-800"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} ArtistBridge. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
