"use client";

import React from "react";
import { Calendar, Instagram, Linkedin, Twitter, Github, Mic2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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
    <footer className="relative z-10 border-t mt-8" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(2,8,23,0.8)" }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #0284C7, #0EA5E9)" }}>
                <Calendar size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold" style={{ fontFamily: "var(--font-sora)" }}>
                Artist<span style={{ color: "#0EA5E9" }}>Bridge</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              India&apos;s premier platform connecting talented artists with event organizers.
            </p>
            <div className="flex gap-3 mt-5">
              {[Instagram, Twitter, Linkedin, Github].map((Icon, i) => (
                <Link key={i} href="#">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(14,165,233,0.3)";
                      (e.currentTarget as HTMLElement).style.color = "#38BDF8";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                      (e.currentTarget as HTMLElement).style.color = "#64748B";
                    }}>
                    <Icon size={14} style={{ color: "#64748B" }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Link Groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#64748B" }}>{group}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href}
                      className="text-sm text-slate-500 hover:text-slate-200 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} ArtistBridge · Built with ❤️ by Rohan Bhangale · VESIT, Mumbai
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Mic2 size={12} />
            Powered by Pinecone RAG · Groq Llama 3
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
