"use client";

import React, { useState } from "react";
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
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      toast.success("Logged out successfully");
      router.push("/auth/organizer/login");
    } catch {
      setError("Failed to logout.");
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
    <main className="relative min-h-screen overflow-hidden" style={{ backgroundColor: "#020817" }}>

      {/* Ambient Blobs */}
      <div className="ambient-blob w-[700px] h-[700px] top-[-200px] right-[-200px]"
        style={{ background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)" }} />
      <div className="ambient-blob w-[600px] h-[600px] bottom-0 left-[-100px]"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)", animationDelay: "5s" }} />

      {/* Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

      {/* ── NAVBAR ── */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto border-b"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0284C7, #0EA5E9)" }}>
            <Calendar size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold" style={{ fontFamily: "var(--font-sora)" }}>
            Artist<span style={{ color: "#0EA5E9" }}>Bridge</span>
          </span>
        </motion.div>

        {/* Desktop Nav */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden md:flex items-center gap-2"
        >
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <button
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={
                  link.highlight
                    ? { background: "rgba(245,158,11,0.12)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.25)" }
                    : { color: "#94A3B8", background: "transparent" }
                }
                onMouseEnter={e => { if (!link.highlight) e.currentTarget.style.color = "#F8FAFC"; }}
                onMouseLeave={e => { if (!link.highlight) e.currentTarget.style.color = "#94A3B8"; }}
              >
                {link.icon}
                {link.label}
              </button>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ml-2"
            style={{ border: "1px solid rgba(239,68,68,0.2)", color: "#F87171", background: "rgba(239,68,68,0.05)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.05)")}
          >
            <LogOut size={14} />
            Logout
          </button>
        </motion.div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-lg transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8" }}>
                <Menu size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 border rounded-xl p-1"
              style={{ background: "#141B2E", borderColor: "rgba(255,255,255,0.08)" }}
            >
              {navLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors"
                    style={{ color: link.highlight ? "#F59E0B" : "#94A3B8" }}>
                    {link.icon}
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm cursor-pointer"
                style={{ color: "#F87171" }}
              >
                <LogOut size={14} />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border text-xs font-medium tracking-widest uppercase"
          style={{ borderColor: "rgba(14,165,233,0.3)", color: "#38BDF8", background: "rgba(14,165,233,0.06)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          Organizer Dashboard
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6 text-white"
          style={{ fontFamily: "var(--font-sora)" }}
        >
          Find the{" "}
          <span style={{ background: "linear-gradient(135deg, #0EA5E9, #38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Perfect Artist
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed"
        >
          Connect with top-performing artists for your events, weddings, concerts, and corporate functions across India.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/organizer/ai-assistant">
            <button className="btn-gold px-8 py-4 rounded-xl text-base flex items-center gap-2">
              <Sparkles size={18} />
              Try AI Assistant
            </button>
          </Link>
          <Link href="/organizer/explore">
            <button className="px-8 py-4 rounded-xl text-base font-semibold flex items-center gap-2 transition-all duration-200"
              style={{ background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.25)", color: "#38BDF8" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(14,165,233,0.18)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(14,165,233,0.1)")}>
              <Search size={18} />
              Browse Artists
            </button>
          </Link>
        </motion.div>
      </section>

      {/* ── QUICK STATS ── */}
      <section className="relative z-10 pb-8 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
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
            <div key={s.label} className="glass-card p-5 text-center">
              <div className="text-2xl font-bold" style={{ color: "#0EA5E9", fontFamily: "var(--font-sora)" }}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── AI Banner ── */}
      <section className="relative z-10 px-6 pb-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(14,165,233,0.06))", border: "1px solid rgba(245,158,11,0.15)" }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #D97706, #F59E0B)" }}>
              <Sparkles size={22} className="text-black" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "var(--font-sora)" }}>
                ✨ AI Event Assistant is Live!
              </h3>
              <p className="text-slate-400 text-sm">Describe your event and let our RAG-powered AI instantly find the perfect artists for you.</p>
            </div>
          </div>
          <Link href="/organizer/ai-assistant">
            <button className="btn-gold px-6 py-3 rounded-xl text-sm whitespace-nowrap flex items-center gap-2">
              Chat with AI <Mic2 size={16} />
            </button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
};

export default Hero;
