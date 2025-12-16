/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Ticket,
  MapPin,
  IndianRupee,
  Calendar,
  Clock,
  Mail,
  Layers,
  Loader2,
} from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

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
  "SINGER",
  "DANCER",
  "MAGICIAN",
  "COMEDIAN",
  "DJ",
  "INSTRUMENTALIST",
  "MIME",
  "THEATRE",
  "BEATBOXER",
  "SPEAKER",
  "PAINTER",
  "POET",
  "PHOTOGRAPHER",
  "MODEL",
  "CIRCUS",
];

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // NOTE: Adjust the endpoint if your route is strictly '/organizer/sendRequest' without '/api'
      const response = await fetch("/api/organizer/sendRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          maxBudget: Number(formData.maxBudget), // Ensure budget is a number for the backend
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage({ type: "success", text: "Request sent successfully!" });

      //  Reset form or redirect after success
      setTimeout(() => router.push("/organizer/home"), 2000);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-900/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-2xl bg-[#0a0a0a] border border-zinc-800/60 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600">
              Confirm Booking
            </span>
          </h1>
          <p className="text-zinc-400 text-sm">
            Fill in the details below to send a direct booking request.
          </p>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-medium border ${
              message.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Event Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">
                Event Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-pink-500 transition-colors">
                  <Ticket size={20} />
                </div>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  type="text"
                  placeholder="e.g. Summer Festival"
                  className="w-full bg-[#111] border border-zinc-800 text-zinc-100 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">
                Category
              </label>
              <div className="relative group">
                {/* Left Icon (Layers) */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-pink-500 transition-colors z-10">
                  <Layers size={20} />
                </div>

                {/* The Select Dropdown */}
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange as any} // Cast if TS complains about event type mismatch
                  required
                  className="w-full bg-[#111] border border-zinc-800 text-zinc-100 rounded-xl py-3.5 pl-12 pr-10 outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all placeholder:text-zinc-600 appearance-none cursor-pointer"
                >
                  <option value="" disabled className="text-zinc-500 bg-[#111]">
                    Select Category
                  </option>
                  {ARTIST_CATEGORIES.map((cat) => (
                    <option
                      key={cat}
                      value={cat}
                      className="bg-[#111] text-zinc-100"
                    >
                      {cat.charAt(0) + cat.slice(1).toLowerCase()}{" "}
                      {/* Formats "SINGER" to "Singer" */}
                    </option>
                  ))}
                </select>

                {/* Right Icon (Custom Chevron) */}
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-pink-500 transition-colors">
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Email (Required by Backend) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 ml-1">
              Organizer Email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-pink-500 transition-colors">
                <Mail size={20} />
              </div>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                type="email"
                placeholder="organizer@example.com"
                className="w-full bg-[#111] border border-zinc-800 text-zinc-100 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          {/* Row 3: Location & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">
                City / Location
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-pink-500 transition-colors">
                  <MapPin size={20} />
                </div>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  type="text"
                  placeholder="Mumbai, India"
                  className="w-full bg-[#111] border border-zinc-800 text-zinc-100 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">
                Max Budget (₹)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-pink-500 transition-colors">
                  <IndianRupee size={20} />
                </div>
                <input
                  name="maxBudget"
                  value={formData.maxBudget}
                  onChange={handleChange}
                  required
                  type="number"
                  placeholder="25000"
                  className="w-full bg-[#111] border border-zinc-800 text-zinc-100 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">
                Event Date
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-pink-500 transition-colors">
                  <Calendar size={20} />
                </div>
                <input
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  type="date"
                  className="w-full bg-[#111] border border-zinc-800 text-zinc-100 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all placeholder:text-zinc-600 [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">
                Start Time
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-pink-500 transition-colors">
                  <Clock size={20} />
                </div>
                <input
                  name="timing"
                  value={formData.timing}
                  onChange={handleChange}
                  required
                  type="time"
                  className="w-full bg-[#111] border border-zinc-800 text-zinc-100 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all placeholder:text-zinc-600 [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-pink-500/20 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Sending...
                </>
              ) : (
                "Send Booking Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
