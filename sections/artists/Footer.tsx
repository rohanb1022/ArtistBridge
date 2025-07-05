import React from 'react'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";


const Footer = () => {
  return (
    <main>
      <footer className="py-10 text-center min-h-screen text-gray-400 text-sm bg-black">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <h2 className="text-3xl font-bold mb-4 text-white"> Join the Artist Community</h2>
        <p className="mb-6">
          Connect with fellow artists, showcase your talent, and get discovered by top organizers.
        </p>  
        <Link href="/artist/register">
          <Button 
          className="bg-pink-600 hover:bg-pink-700 rounded-full h-28 w-[35vw] text-white px-6 py-2 text-xl ">
            Make Yourself Available , Update your Profile <ArrowRight className="ml-2 h-5 w-5" />
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
  )
}

export default Footer
