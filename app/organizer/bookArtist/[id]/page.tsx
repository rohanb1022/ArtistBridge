"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, IndianRupee, Ticket, User, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BookSpecificArtistPage() {
  const params = useParams();
  const router = useRouter();
  const artistId = params?.id;

  const [artistName, setArtistName] = useState("");
  const [fetchingArtist, setFetchingArtist] = useState(true);

  const [form, setForm] = useState({
    eventName: "",
    city: "",
    price: "",
    date: "",
    time: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [minDate, setMinDate] = useState("");
  useEffect(() => {
    setMinDate(new Date().toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (!artistId) return;
    const fetchArtist = async () => {
      try {
        const res = await api.get(`/organizer/artist-profile/${artistId}`);
        setArtistName(res.data.data.name);
      } catch (error) {
        console.error("Failed to fetch artist details", error);
        setArtistName("Unknown Artist");
      } finally {
        setFetchingArtist(false);
      }
    };
    fetchArtist();
  }, [artistId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistId) {
      setMessage({ text: "Error: Invalid Artist ID", type: "error" });
      return;
    }

    // Client-side date & time validation
    const eventDateTime = new Date(`${form.date}T${form.time}`);
    if (eventDateTime < new Date()) {
      setMessage({ text: "Error: Event date and time must be in the future.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const payload = {
        artistId: artistId as string,
        eventName: form.eventName,
        city: form.city,
        price: parseInt(form.price),
        date: form.date,
        time: form.time
      };

      await api.post(`/booking/bookingRequest`, payload);

      setMessage({ text: "Booking request sent successfully!", type: "success" });
      
      setForm({
        eventName: "",
        city: "",
        price: "",
        date: "",
        time: "",
      });
      
      setTimeout(() => router.push('/organizer/home'), 2000);
      
    } catch (error: any) {
      console.error("Failed to book artist:", error);
      const errorMsg = error.response?.data?.message || "Failed to send request. Try again.";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingArtist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020817]">
        <Loader2 className="w-12 h-12 animate-spin text-[#0EA5E9]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#020817] relative overflow-hidden text-white">
      {/* Studio Noir Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#0EA5E9]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#7C3AED]/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        className="w-full max-w-3xl bg-[rgba(15,23,42,0.6)] border border-white/5 p-8 md:p-10 rounded-3xl shadow-2xl backdrop-blur-xl relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href={`/organizer/artist-profile/${artistId}`}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to Profile
        </Link>

        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 mb-4 tracking-tight">
            Book <span className="bg-gradient-to-r from-[#0EA5E9] to-[#7C3AED] bg-clip-text text-transparent">{artistName}</span>
          </h2>
          <p className="text-zinc-400 text-lg">
            Fill out the details below to send a direct booking request.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Event Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 ml-1">Event Name</label>
            <div className="relative group">
              <Ticket className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-[#0EA5E9] transition-colors" />
              <input
                type="text"
                name="eventName"
                placeholder="e.g. Summer Music Festival 2025"
                value={form.eventName}
                onChange={handleChange}
                className="w-full bg-[#0F172A] border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-[#0EA5E9]/50 focus:ring-1 focus:ring-[#0EA5E9]/50 transition-all placeholder:text-zinc-600 shadow-inner"
                required
              />
            </div>
          </div>

          {/* Row 2: Location & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">City / Location</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-[#0EA5E9] transition-colors" />
                <input
                  type="text"
                  name="city"
                  placeholder="Mumbai, India"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full bg-[#0F172A] border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-[#0EA5E9]/50 focus:ring-1 focus:ring-[#0EA5E9]/50 transition-all placeholder:text-zinc-600 shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Offer Price (₹)</label>
              <div className="relative group">
                <IndianRupee className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-[#0EA5E9] transition-colors" />
                <input
                  type="number"
                  name="price"
                  placeholder="25000"
                  value={form.price}
                  onChange={handleChange}
                  min="1"
                  className="w-full bg-[#0F172A] border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-[#0EA5E9]/50 focus:ring-1 focus:ring-[#0EA5E9]/50 transition-all placeholder:text-zinc-600 shadow-inner"
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 3: Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Event Date</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-[#0EA5E9] transition-colors" />
                <input
                  type="date"
                  name="date"
                  min={minDate}
                  value={form.date}
                  onChange={handleChange}
                  className="w-full bg-[#0F172A] border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-[#0EA5E9]/50 focus:ring-1 focus:ring-[#0EA5E9]/50 transition-all [color-scheme:dark] shadow-inner cursor-pointer"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Start Time</label>
              <div className="relative group">
                <Clock className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-[#0EA5E9] transition-colors" />
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="w-full bg-[#0F172A] border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-[#0EA5E9]/50 focus:ring-1 focus:ring-[#0EA5E9]/50 transition-all [color-scheme:dark] shadow-inner cursor-pointer"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-gradient-to-r from-[#0EA5E9] to-[#7C3AED] hover:from-[#0284C7] hover:to-[#6D28D9] text-white font-bold py-4 rounded-xl shadow-[0_0_40px_rgba(14,165,233,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : "Send Booking Request"}
          </motion.button>
        </form>

        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 text-center font-medium p-4 rounded-xl text-sm ${
              message.type === "success"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}