/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import api from '@/lib/axios';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, IndianRupee, Mail, User, Music } from 'lucide-react';

const RequestForm = () => {
  // Added 'category' back to state
  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
    category: "",
    maxBudget: "",
    date: "",
    timing: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/organizer/sendRequest", {
        ...form,
        maxBudget: parseInt(form.maxBudget),
      });
      setMessage("Request sent successfully!");
      setForm({
        name: "",
        email: "",
        city: "",
        category: "",
        maxBudget: "",
        date: "",
        timing: "",
      });
    } catch (error) {
      console.error("Failed to send request:", error);
      setMessage("Failed to send request. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-black relative overflow-hidden text-white">
      
      {/* Background Ambient Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        className="w-full max-w-2xl bg-[#0a0a0a] border border-neutral-800 p-8 rounded-2xl shadow-2xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2">
            Book Artist
          </h2>
          <p className="text-neutral-400">
            Fill in the details below to send a booking request.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Row 1: Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-[#111] border border-neutral-800 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder:text-neutral-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-[#111] border border-neutral-800 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder:text-neutral-600"
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 2: Category & Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* RESTORED CATEGORY FIELD */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Category / Art Form</label>
              <div className="relative">
                <Music className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type="text"
                  name="category"
                  placeholder="Dancer, Singer, etc."
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-[#111] border border-neutral-800 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder:text-neutral-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Max Budget (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type="number"
                  name="maxBudget"
                  placeholder="10000"
                  value={form.maxBudget}
                  onChange={handleChange}
                  className="w-full bg-[#111] border border-neutral-800 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder:text-neutral-600"
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 3: City (Full Width for better address space) */}
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
                className="w-full bg-[#111] border border-neutral-800 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder:text-neutral-600"
                required
              />
            </div>
          </div>

          {/* Row 4: Date & Time */}
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
                  className="w-full bg-[#111] border border-neutral-800 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all [color-scheme:dark]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Timing</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type="time"
                  name="timing"
                  value={form.timing}
                  onChange={handleChange}
                  className="w-full bg-[#111] border border-neutral-800 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all [color-scheme:dark]"
                  required
                />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending Request..." : "Confirm Booking Request"}
          </motion.button>
        </form>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 text-center font-medium p-3 rounded-lg ${
              message.includes("success") 
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
};

export default RequestForm;