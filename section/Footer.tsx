import React from "react";
import Link from "next/link";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white px-6 py-10 mt-10">
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
  );
};

export default Footer;
