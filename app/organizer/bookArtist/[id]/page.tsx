"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, IndianRupee, Ticket } from "lucide-react";

export default function BookSpecificArtistPage() {
  const params = useParams();
  const router = useRouter();
  const artistId = params?.id;

  const [form, setForm] = useState({
    eventName: "", // Added required field
    city: "",
    price: "",
    date: "",
    time: "", // Renamed from 'timing' to match backend
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistId) {
      setMessage("Error: Invalid Artist ID");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Structure matches backend requirements exactly
      const payload = {
        artistId: artistId as string,
        eventName: form.eventName,
        city: form.city,
        price: parseInt(form.price), // Backend expects Number
        date: form.date,
        time: form.time
      };

      await api.post(`/booking/bookingRequest`, payload);

      setMessage("Booking request sent successfully!");
      
      setForm({
        eventName: "",
        city: "",
        price: "",
        date: "",
        time: "",
      });
      
      // router.push('/organizer/dashboard'); 
      
    } catch (error: any) {
      console.error("Failed to book artist:", error);
      // Try to show backend error message if available
      const errorMsg = error.response?.data?.message || "Failed to send request. Try again.";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-black relative overflow-hidden text-white">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        className="w-full max-w-2xl bg-[#0a0a0a] border border-neutral-800 p-8 rounded-2xl shadow-2xl relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-2">
            Confirm Booking
          </h2>
          <p className="text-neutral-400">
            Send a direct booking request to this artist.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Row 1: Event Name (Full Width) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Event Name</label>
            <div className="relative">
              <Ticket className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                name="eventName"
                placeholder="e.g. Summer Music Festival 2025"
                value={form.eventName}
                onChange={handleChange}
                className="w-full bg-[#111] border border-neutral-800 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-neutral-600"
                required
              />
            </div>
          </div>

          {/* Row 2: Location & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">City / Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type="text"
                  name="city"
                  placeholder="Mumbai, India"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full bg-[#111] border border-neutral-800 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-neutral-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Offer Price (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type="number"
                  name="price"
                  placeholder="25000"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full bg-[#111] border border-neutral-800 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-neutral-600"
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 3: Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Event Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full bg-[#111] border border-neutral-800 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all [color-scheme:dark]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Start Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type="time"
                  name="time" // Changed from 'timing' to 'time'
                  value={form.time}
                  onChange={handleChange}
                  className="w-full bg-[#111] border border-neutral-800 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all [color-scheme:dark]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending Request..." : "Send Booking Request"}
          </motion.button>
        </form>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 text-center font-medium p-3 rounded-lg ${
              message.toLowerCase().includes("success") 
                ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {message}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}