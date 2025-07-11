import React from 'react';
import Link from "next/link";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="py-10 px-4 text-center text-gray-400 text-sm bg-black">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
          Join the Artist Community
        </h2>
        <p className="mb-6">
          Connect with fellow artists, showcase your talent, and get discovered by top organizers.
        </p>
        {/* <Link href="/artist/register">
          <Button className="bg-pink-600 hover:bg-pink-700 rounded-full text-white px-6 py-4 text-base sm:text-lg">
            Make Yourself Available, Update your Profile <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link> */}
      </div>

      <div className="my-10 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left text-sm">
        <div>
          <h2 className="text-xl font-extrabold text-pink-500">ArtistBridge</h2>
          <p className="mt-2 text-gray-400">
            Connecting event organizers with the perfect artists.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-pink-400 mb-2">Explore</h3>
          <ul className="space-y-1 text-gray-300">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/artists">Artists</Link></li>
            <li><Link href="/organizers">Organizers</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-pink-400 mb-2">Follow Us</h3>
          <div className="flex gap-4 text-xl text-gray-300">
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-pink-400 mb-2">Contact</h3>
          <p>Email: rohanbhangale25@gmail.com</p>
          <p>Phone: +91 93079 85422</p>
        </div>
      </div>

      <div className="mt-10 text-xs text-gray-500 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} ArtistBridge. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
