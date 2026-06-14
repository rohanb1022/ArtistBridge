"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import { Menu, Calendar, Mic2, Search, LayoutDashboard, Sparkles, LogOut, BookOpen } from "lucide-react";

const Hero = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      toast.success("Logged out successfully");
      router.push("/auth/organizer/login");
    } catch {
      toast.error("Failed to logout");
    }
  };

  const navLinks = [
    { href: "/organizer/ai-assistant", label: "AI Assistant", icon: <Sparkles size={14} />, highlight: true },
    { href: "/organizer/explore", label: "Browse Artists", icon: <Search size={14} /> },
    { href: "/organizer/manage-bookings", label: "Manage Bookings", icon: <BookOpen size={14} /> },
    { href: "/organizer/get-request", label: "Sent Requests", icon: <LayoutDashboard size={14} /> },
    { href: "/organizer/org-request", label: "Book Custom", icon: <Calendar size={14} /> },
  ];

  return (
    <main className="relative bg-white text-neutral-900">
      
      {/* ── NAVBAR ── */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-neutral-200">
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
            <Calendar size={16} className="text-neutral-900" />
          </div>
          <span className="text-lg font-medium tracking-tight">
            Artist<span className="font-serif italic font-normal text-neutral-600">Bridge</span>
          </span>
        </motion.div>

        {/* Desktop Nav */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden md:flex items-center gap-1.5"
        >
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <button
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  link.highlight
                    ? "bg-neutral-900 text-neutral-900 hover:bg-neutral-800"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                }`}
              >
                {link.icon}
                {link.label}
              </button>
            </Link>
          ))}
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-red-650 hover:bg-red-50 hover:text-red-750 transition-all ml-1"
          >
            <LogOut size={14} />
            Logout
          </button>
        </motion.div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-md border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
                <Menu size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-52 border border-neutral-200 bg-white rounded-md p-1 shadow-md"
              align="end"
            >
              {navLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                      link.highlight ? "text-neutral-900 bg-neutral-50" : "text-neutral-600"
                    }`}>
                    {link.icon}
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
              >
                <LogOut size={14} />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-16 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 mb-6 rounded-full border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-650"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
          Organizer Dashboard
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-medium leading-[1.05] tracking-tight mb-6 text-neutral-900 font-heading"
        >
          Find the <span className="font-serif italic text-neutral-800">Perfect Artist.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg text-neutral-500 max-w-2xl mb-10 leading-relaxed font-sans"
        >
          Connect with top-performing artists for your events, weddings, concerts, and corporate functions across India.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/organizer/ai-assistant">
            <button className="w-full sm:w-auto px-6 py-3.5 rounded-md bg-neutral-900 text-neutral-900 font-medium hover:bg-neutral-850 transition-all flex items-center justify-center gap-2 text-sm">
              <Sparkles size={16} />
              Try AI Assistant
            </button>
          </Link>
          <Link href="/organizer/explore">
            <button className="w-full sm:w-auto px-6 py-3.5 rounded-md bg-white border border-neutral-200 text-neutral-800 font-medium hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 text-sm">
              <Search size={16} />
              Browse Artists
            </button>
          </Link>
        </motion.div>
      </section>

      {/* ── QUICK STATS ── */}
      <section className="relative z-10 pb-12 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { value: "2,000+", label: "Artists" },
            { value: "50+", label: "Cities" },
            { value: "500+", label: "Bookings" },
            { value: "4.9★", label: "Rating" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-neutral-200 rounded-lg p-5 text-center shadow-xs">
              <div className="text-2xl font-heading font-medium text-neutral-900">{s.value}</div>
              <div className="text-xs text-neutral-450 mt-1 uppercase tracking-wider font-semibold">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── AI Banner ── */}
      <section className="relative z-10 px-6 pb-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="p-8 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 bg-neutral-50 border border-neutral-200"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 bg-neutral-900">
              <Sparkles size={18} className="text-neutral-900" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-900 mb-1">
                AI Event Assistant is Live
              </h3>
              <p className="text-neutral-500 text-sm">Describe your event and let our RAG-powered AI instantly find the perfect artists for you.</p>
            </div>
          </div>
          <Link href="/organizer/ai-assistant">
            <button className="px-5 py-2.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-neutral-900 font-medium text-sm whitespace-nowrap flex items-center gap-2">
              Chat with AI <Mic2 size={15} />
            </button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
};

export default Hero;
