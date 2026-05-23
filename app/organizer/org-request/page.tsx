/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Ticket,
  MapPin,
  IndianRupee,
  Calendar,
  Clock,
  Mail,
  Layers,
  Loader2,
  ChevronDown
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function BookingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    city: "",
    maxBudget: "",
    date: "",
    timing: "",
  });

  const ARTIST_CATEGORIES = [
    "SINGER", "DANCER", "MAGICIAN", "COMEDIAN", "DJ",
    "INSTRUMENTALIST", "MIME", "THEATRE", "BEATBOXER",
    "SPEAKER", "PAINTER", "POET", "PHOTOGRAPHER", "MODEL", "CIRCUS",
  ];

  const [minDate, setMinDate] = useState("");
  useEffect(() => {
    setMinDate(new Date().toISOString().split("T")[0]);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side date & time validation
    const eventDateTime = new Date(`${formData.date}T${formData.timing}`);
    if (eventDateTime < new Date()) {
      setMessage({ type: "error", text: "Event date and time must be in the future." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/organizer/sendRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          maxBudget: Number(formData.maxBudget),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage({ type: "success", text: "Request published successfully! Artists will be notified." });

      setTimeout(() => router.push("/organizer/home"), 2000);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020817] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Studio Noir Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#0EA5E9]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#7C3AED]/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        className="w-full max-w-3xl bg-[rgba(15,23,42,0.6)] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              Publish Open Request
            </span>
          </h1>
          <p className="text-zinc-400 text-lg">
            Broadcast your event details. Interested artists will accept your invitation!
          </p>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-4 rounded-xl text-sm font-medium border ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {message.text}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Event Name</label>
              <div className="relative group">
                <Ticket className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-[#0EA5E9] transition-colors" />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  type="text"
                  placeholder="e.g. Corporate Gala 2026"
                  className="w-full bg-[#0F172A] border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-[#0EA5E9]/50 focus:ring-1 focus:ring-[#0EA5E9]/50 transition-all placeholder:text-zinc-600 shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Required Category</label>
              <div className="relative group">
                <Layers className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-[#0EA5E9] transition-colors z-10" />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0F172A] border border-white/10 text-white pl-12 pr-10 py-4 rounded-xl focus:outline-none focus:border-[#0EA5E9]/50 focus:ring-1 focus:ring-[#0EA5E9]/50 transition-all appearance-none cursor-pointer shadow-inner"
                >
                  <option value="" disabled className="text-zinc-500 bg-[#0F172A]">Select Category</option>
                  {ARTIST_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#0F172A] text-white">
                      {cat.charAt(0) + cat.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-zinc-500 pointer-events-none group-focus-within:text-[#0EA5E9] transition-colors" />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 ml-1">Organizer Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-[#0EA5E9] transition-colors" />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                type="email"
                placeholder="you@company.com"
                className="w-full bg-[#0F172A] border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-[#0EA5E9]/50 focus:ring-1 focus:ring-[#0EA5E9]/50 transition-all placeholder:text-zinc-600 shadow-inner"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">City / Location</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-[#0EA5E9] transition-colors" />
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  type="text"
                  placeholder="Mumbai, India"
                  className="w-full bg-[#0F172A] border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-[#0EA5E9]/50 focus:ring-1 focus:ring-[#0EA5E9]/50 transition-all placeholder:text-zinc-600 shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Maximum Budget (₹)</label>
              <div className="relative group">
                <IndianRupee className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-[#0EA5E9] transition-colors" />
                <input
                  name="maxBudget"
                  value={formData.maxBudget}
                  onChange={handleChange}
                  required
                  type="number"
                  min="1"
                  placeholder="50000"
                  className="w-full bg-[#0F172A] border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-[#0EA5E9]/50 focus:ring-1 focus:ring-[#0EA5E9]/50 transition-all placeholder:text-zinc-600 shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Event Date</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-[#0EA5E9] transition-colors" />
                <input
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  type="date"
                  min={minDate}
                  className="w-full bg-[#0F172A] border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-[#0EA5E9]/50 focus:ring-1 focus:ring-[#0EA5E9]/50 transition-all [color-scheme:dark] shadow-inner cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Start Time</label>
              <div className="relative group">
                <Clock className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-[#0EA5E9] transition-colors" />
                <input
                  name="timing"
                  value={formData.timing}
                  onChange={handleChange}
                  required
                  type="time"
                  className="w-full bg-[#0F172A] border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-[#0EA5E9]/50 focus:ring-1 focus:ring-[#0EA5E9]/50 transition-all [color-scheme:dark] shadow-inner cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-gradient-to-r from-[#0EA5E9] to-[#7C3AED] hover:from-[#0284C7] hover:to-[#6D28D9] text-white font-bold py-4 rounded-xl shadow-[0_0_40px_rgba(14,165,233,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : "Publish Open Request"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
