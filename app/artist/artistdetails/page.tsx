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
    <main className="relative min-h-screen bg-neutral-50 text-neutral-900 flex items-center justify-center overflow-hidden py-16 px-4 font-sans">
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Title & Subtitle */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-medium tracking-tight mb-3 text-neutral-950">
            Welcome, <span className="font-serif italic text-neutral-700">Artist</span>
          </h2>
          <p className="text-neutral-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Let's build your creative profile to stand out and connect with event organizers.
          </p>
        </motion.div>

        {/* The Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="w-full bg-white border border-neutral-200 rounded-lg p-8 md:p-10 shadow-xs"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Basic Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-heading font-medium flex items-center gap-2 text-neutral-900 border-b border-neutral-100 pb-3">
                  <span className="w-6 h-6 rounded-full bg-neutral-900 flex items-center justify-center text-xs text-white">
                    1
                  </span>
                  Your Expertise
                </h3>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                  Primary Category
                </label>
                <Select onValueChange={handleCategory}>
                  <SelectTrigger className="w-full h-11 bg-white border border-neutral-200 hover:border-neutral-950 transition-colors rounded-md text-neutral-900 focus:ring-0 focus:ring-offset-0 focus:border-neutral-950">
                    <SelectValue placeholder="What kind of artist are you?" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-neutral-200 text-neutral-900 rounded-md shadow-md">
                    {artistCategories.map((item) => (
                      <SelectItem
                        key={item}
                        value={item}
                        className="hover:bg-neutral-50 cursor-pointer focus:bg-neutral-50 rounded-md m-1"
                      >
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.category.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.category.map((cat) => (
                      <span
                        key={cat}
                        className="px-2.5 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-600 rounded-full text-xs font-medium"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                  Base Price (₹)
                </label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price || ""}
                  onChange={handleInputChange}
                  className="h-11 bg-white border border-neutral-200 hover:border-neutral-950 transition-colors rounded-md text-neutral-900 focus:border-neutral-950"
                  placeholder="E.g. 5000"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                  Artist Bio
                </label>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="bg-white border border-neutral-200 hover:border-neutral-950 transition-colors rounded-md text-neutral-900 focus:border-neutral-950 min-h-[110px] resize-none text-sm leading-relaxed"
                  placeholder="Tell your story. What makes your art unique?"
                />
              </div>
            </div>

            {/* Right Column: Media & Experience */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-heading font-medium flex items-center gap-2 text-neutral-900 border-b border-neutral-100 pb-3">
                  <span className="w-6 h-6 rounded-full bg-neutral-900 flex items-center justify-center text-xs text-white">
                    2
                  </span>
                  Portfolio & Media
                </h3>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                  Best Performance / Event
                </label>
                <Textarea
                  name="bestEvent"
                  value={formData.bestEvent}
                  onChange={handleInputChange}
                  className="bg-white border border-neutral-200 hover:border-neutral-950 transition-colors rounded-md text-neutral-900 focus:border-neutral-950 min-h-[90px] resize-none text-sm leading-relaxed"
                  placeholder="Describe your most memorable gig..."
                />
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                    Instagram URL
                  </label>
                  <Input
                    name="instagramUrl"
                    value={formData.instagramUrl}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/yourhandle"
                    className="h-11 bg-white border border-neutral-200 hover:border-neutral-950 transition-colors rounded-md text-neutral-900 focus:border-neutral-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                    YouTube Channel
                  </label>
                  <Input
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/c/yourchannel"
                    className="h-11 bg-white border border-neutral-200 hover:border-neutral-950 transition-colors rounded-md text-neutral-900 focus:border-neutral-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                    Intro Video Link
                  </label>
                  <Input
                    name="introVideoUrl"
                    value={formData.introVideoUrl}
                    onChange={handleInputChange}
                    placeholder="Link to a short video of your work"
                    className="h-11 bg-white border border-neutral-200 hover:border-neutral-950 transition-colors rounded-md text-neutral-900 focus:border-neutral-950"
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
              className="mt-6 text-red-650 text-center font-medium bg-red-50 py-2.5 rounded-md border border-red-200 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="mt-8 flex justify-center border-t border-neutral-100 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-[280px] h-12 bg-neutral-900 text-white hover:bg-neutral-850 font-medium text-sm rounded-md shadow-xs transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Saving Profile..." : "Launch Profile"}
            </button>
          </div>
        </motion.form>
      </div>
    </main>
  );
};

export default ArtistDetailsForm;
