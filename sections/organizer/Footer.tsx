"use client";

import React from "react";
import { Calendar, Instagram, Linkedin, Twitter, Github, Mic2 } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const links = {
    Platform: [
      { label: "Browse Artists", href: "/organizer/explore" },
      { label: "AI Assistant", href: "/organizer/ai-assistant" },
      { label: "Manage Bookings", href: "/organizer/manage-bookings" },
    ],
    Account: [
      { label: "Artist Login", href: "/auth/artist/login" },
      { label: "Organizer Login", href: "/auth/organizer/login" },
      { label: "Create Account", href: "/auth/artist/signup" },
    ],
    Company: [
      { label: "About", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  };

  return (
    <footer className="relative z-10 border-t border-neutral-200 bg-neutral-50 text-neutral-900 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-left">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
                <Calendar size={16} className="text-neutral-900" />
              </div>
              <span className="text-lg font-medium tracking-tight">
                Artist<span className="font-serif italic font-normal text-neutral-600">Bridge</span>
              </span>
            </div>
            <p className="text-sm text-neutral-500 max-w-xs leading-relaxed">
              India&apos;s premier platform connecting talented artists with event organizers.
            </p>
            <div className="flex gap-2.5 mt-5">
              {[Instagram, Twitter, Linkedin, Github].map((Icon, i) => (
                <Link key={i} href="#">
                  <div className="w-8 h-8 rounded-md flex items-center justify-center border border-neutral-200 bg-white text-neutral-400 hover:text-neutral-900 hover:border-neutral-400 transition-all duration-200">
                    <Icon size={14} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Link Groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group} className="text-left">
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-4 text-neutral-400">{group}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href}
                      className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-3 text-left">
          <p className="text-xs text-neutral-450 font-normal">
            © {new Date().getFullYear()} ArtistBridge · VESIT, Mumbai
          </p>
          <div className="flex items-center gap-2 text-xs text-neutral-450">
            <Mic2 size={12} />
            Powered by Pinecone RAG · Groq Llama 3
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
