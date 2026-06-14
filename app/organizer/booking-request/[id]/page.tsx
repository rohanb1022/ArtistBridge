/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import api from '@/lib/axios';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, IndianRupee, Mail, User, Music, Loader2 } from 'lucide-react';

const RequestForm = () => {
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
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-neutral-50 relative overflow-hidden text-neutral-900 font-sans">
      <motion.div
        className="w-full max-w-2xl bg-white border border-neutral-200 p-8 md:p-10 rounded-lg shadow-xs relative z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-heading font-medium text-neutral-950 mb-3 tracking-tight">
            Book <span className="font-serif italic text-neutral-750">Artist</span>
          </h2>
          <p className="text-neutral-500 text-sm">
            Fill in the details below to send a booking request.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Row 1: Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className="studio-input pl-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450" />
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="studio-input pl-11"
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 2: Category & Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Category / Art Form</label>
              <div className="relative">
                <Music className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450" />
                <input
                  type="text"
                  name="category"
                  placeholder="Dancer, Singer, etc."
                  value={form.category}
                  onChange={handleChange}
                  className="studio-input pl-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Max Budget (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450" />
                <input
                  type="number"
                  name="maxBudget"
                  placeholder="10000"
                  value={form.maxBudget}
                  onChange={handleChange}
                  className="studio-input pl-11"
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 3: City */}
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

          {/* Row 4: Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Event Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450" />
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="studio-input pl-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Timing</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450" />
                <input
                  type="time"
                  name="timing"
                  value={form.timing}
                  onChange={handleChange}
                  className="studio-input pl-11"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-3.5 rounded-md flex items-center justify-center gap-2 font-medium mt-4 text-sm"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Confirm Booking Request"}
          </button>
        </form>

        {message && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className={`mt-6 text-center font-medium p-3 rounded-md text-sm border ${
              message.includes("successfully") 
                ? "bg-green-50 border-green-200 text-green-700" 
                : "bg-red-50 border-red-200 text-red-700"
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