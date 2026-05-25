/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { artistCategories } from "@/constants/artist";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const ArtistDetailsForm = () => {
  const [formData, setFormData] = useState({
    category: [] as string[],
    price: 0,
    bio: "",
    bestEvent: "",
    youtubeUrl: "",
    instagramUrl: "",
    introVideoUrl: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleCategory = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.includes(value) ? prev.category : [value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.put("/artist/completeProfile", formData);
      router.push("/artist/home");
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden py-20 px-4 font-sans">
      {/* 🌟 Dynamic Continuously Changing Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] opacity-40 blur-[120px] pointer-events-none"
          style={{
            background:
              "conic-gradient(from 90deg at 50% 50%, #ff0080, #7928ca, #ff0080)",
          }}
        />
        <motion.div
          animate={{
            x: [0, 100, -100, 0],
            y: [0, -100, 100, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen"
        />
        <motion.div
          animate={{
            x: [0, -150, 150, 0],
            y: [0, 150, -150, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[50px] z-0" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Title & Subtitle */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
              Welcome, Artist
            </span>
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl font-light max-w-2xl mx-auto">
            Let's build your creative portfolio. Stand out and connect with
            organizers who are looking for exactly what you do.
          </p>
        </motion.div>

        {/* The Glassmorphism Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="w-full bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {/* Left Column: Basic Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-white/90">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-sm shadow-lg shadow-pink-500/20">
                    1
                  </span>
                  Your Expertise
                </h3>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400 font-medium ml-1">
                  Primary Category
                </label>
                <Select onValueChange={handleCategory}>
                  <SelectTrigger className="w-full h-12 bg-white/5 border-white/10 hover:border-pink-500/50 transition-colors rounded-xl text-white focus:ring-pink-500/50">
                    <SelectValue placeholder="What kind of artist are you?" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl shadow-2xl">
                    {artistCategories.map((item) => (
                      <SelectItem
                        key={item}
                        value={item}
                        className="hover:bg-white/10 cursor-pointer focus:bg-pink-500/20 rounded-lg m-1"
                      >
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.category.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.category.map((cat) => (
                      <span
                        key={cat}
                        className="px-3 py-1 bg-pink-500/20 border border-pink-500/30 text-pink-300 rounded-full text-xs font-medium"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400 font-medium ml-1">
                  Base Price (₹)
                </label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price || ""}
                  onChange={handleInputChange}
                  className="h-12 bg-white/5 border-white/10 hover:border-pink-500/50 transition-colors rounded-xl text-white focus:ring-pink-500/50"
                  placeholder="E.g. 5000"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400 font-medium ml-1">
                  Artist Bio
                </label>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10 hover:border-pink-500/50 transition-colors rounded-xl text-white focus:ring-pink-500/50 min-h-[120px] resize-none"
                  placeholder="Tell your story. What makes your art unique?"
                />
              </div>
            </div>

            {/* Right Column: Media & Experience */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-white/90">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm shadow-lg shadow-cyan-500/20">
                    2
                  </span>
                  Portfolio & Media
                </h3>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400 font-medium ml-1">
                  Best Performance / Event
                </label>
                <Textarea
                  name="bestEvent"
                  value={formData.bestEvent}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10 hover:border-cyan-500/50 transition-colors rounded-xl text-white focus:ring-cyan-500/50 min-h-[100px] resize-none"
                  placeholder="Describe your most memorable gig..."
                />
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400 font-medium ml-1">
                    Instagram URL
                  </label>
                  <Input
                    name="instagramUrl"
                    value={formData.instagramUrl}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/yourhandle"
                    className="h-12 bg-white/5 border-white/10 hover:border-cyan-500/50 transition-colors rounded-xl text-white focus:ring-cyan-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-zinc-400 font-medium ml-1">
                    YouTube Channel
                  </label>
                  <Input
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/c/yourchannel"
                    className="h-12 bg-white/5 border-white/10 hover:border-cyan-500/50 transition-colors rounded-xl text-white focus:ring-cyan-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-zinc-400 font-medium ml-1">
                    Intro Video Link
                  </label>
                  <Input
                    name="introVideoUrl"
                    value={formData.introVideoUrl}
                    onChange={handleInputChange}
                    placeholder="Link to a short video of your work"
                    className="h-12 bg-white/5 border-white/10 hover:border-cyan-500/50 transition-colors rounded-xl text-white focus:ring-cyan-500/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 text-red-400 text-center font-medium bg-red-400/10 py-3 rounded-lg border border-red-400/20"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="mt-10 flex justify-center relative z-10">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full md:w-auto"
            >
              <Button
                type="submit"
                disabled={loading}
                className="w-full md:w-[300px] h-14 bg-white text-black hover:bg-zinc-200 font-bold text-lg rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving Profile...
                  </>
                ) : (
                  "Launch Profile"
                )}
              </Button>
            </motion.div>
          </div>
        </motion.form>
      </div>
    </main>
  );
};

export default ArtistDetailsForm;

