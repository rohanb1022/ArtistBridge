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
    <div className="min-h-screen w-full bg-neutral-50 text-neutral-900 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <motion.div
        className="w-full max-w-2xl bg-white border border-neutral-200 rounded-lg p-8 md:p-10 shadow-xs relative z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-medium mb-3 tracking-tight text-neutral-950">
            Publish Open <span className="font-serif italic text-neutral-750">Request</span>
          </h1>
          <p className="text-neutral-500 text-sm">
            Broadcast your event details. Interested artists will accept your invitation!
          </p>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className={`mb-8 p-3 rounded-md text-sm border ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {message.text}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Event Name</label>
              <div className="relative">
                <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450" />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  type="text"
                  placeholder="e.g. Corporate Gala 2026"
                  className="studio-input pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Required Category</label>
              <div className="relative">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450 z-10" />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="studio-input pl-11 pr-10 appearance-none cursor-pointer bg-white"
                >
                  <option value="" disabled className="text-neutral-400 bg-white">Select Category</option>
                  {ARTIST_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-white text-neutral-900">
                      {cat.charAt(0) + cat.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Organizer Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450" />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                type="email"
                placeholder="you@company.com"
                className="studio-input pl-11"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">City / Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450" />
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  type="text"
                  placeholder="Mumbai, India"
                  className="studio-input pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Maximum Budget (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450" />
                <input
                  name="maxBudget"
                  value={formData.maxBudget}
                  onChange={handleChange}
                  required
                  type="number"
                  min="1"
                  placeholder="50000"
                  className="studio-input pl-11"
                />
              </div>
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Event Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450" />
                <input
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  type="date"
                  min={minDate}
                  className="studio-input pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Start Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450" />
                <input
                  name="timing"
                  value={formData.timing}
                  onChange={handleChange}
                  required
                  type="time"
                  className="studio-input pl-11"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-3.5 rounded-md flex items-center justify-center gap-2 font-medium mt-4 text-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Publish Open Request"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
