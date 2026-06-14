"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, IndianRupee, Ticket, Loader2, ArrowLeft } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-white text-neutral-800">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-neutral-50 relative text-neutral-900 font-sans">
      <motion.div
        className="w-full max-w-2xl bg-white border border-neutral-200 p-8 md:p-10 rounded-lg shadow-xs relative z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href={`/organizer/artist-profile/${artistId}`}
          className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft size={15} /> Back to Profile
        </Link>

        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-heading font-medium text-neutral-950 mb-3 tracking-tight">
            Book <span className="font-serif italic text-neutral-750">{artistName}</span>
          </h2>
          <p className="text-neutral-500 text-sm">
            Fill out the details below to send a direct booking request.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Event Name */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Event Name</label>
            <div className="relative">
              <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450" />
              <input
                type="text"
                name="eventName"
                placeholder="e.g. Summer Music Festival"
                value={form.eventName}
                onChange={handleChange}
                className="studio-input pl-11"
                required
              />
            </div>
          </div>

          {/* Row 2: Location & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">City / Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450" />
                <input
                  type="text"
                  name="city"
                  placeholder="Mumbai, India"
                  value={form.city}
                  onChange={handleChange}
                  className="studio-input pl-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Offer Price (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450" />
                <input
                  type="number"
                  name="price"
                  placeholder="25000"
                  value={form.price}
                  onChange={handleChange}
                  min="1"
                  className="studio-input pl-11"
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 3: Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Event Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450" />
                <input
                  type="date"
                  name="date"
                  min={minDate}
                  value={form.date}
                  onChange={handleChange}
                  className="studio-input pl-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Start Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450" />
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="studio-input pl-11"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-3.5 rounded-md flex items-center justify-center gap-2 font-medium mt-4 text-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Send Booking Request"}
          </button>
        </form>

        {message.text && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className={`mt-6 text-center font-medium p-3 rounded-md text-sm ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700" 
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}