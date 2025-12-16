/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
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
  const router = useRouter();

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
      category: prev.category.includes(value)
        ? prev.category
        : [value],
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

  return (
    <motion.section
      className="relative min-h-screen bg-black text-white py-16 px-4 flex flex-col items-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* 🔥 Animated background blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-pink-500 via-red-500 to-orange-400 opacity-25 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] bg-gradient-to-tr from-orange-400 via-pink-500 to-purple-500 opacity-20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Title */}
      <motion.h2
        className="relative z-10 text-5xl font-bold bg-gradient-to-r from-pink-500 via-orange-400 to-purple-500 text-transparent bg-clip-text mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        ArtistBridge
      </motion.h2>

      {/* Glow wrapper */}
      <div className="relative z-10 w-full max-w-3xl">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500 via-orange-400 to-purple-500 opacity-30 blur-xl" />

        {/* FORM */}
        <motion.form
          onSubmit={handleSubmit}
          className="relative bg-zinc-950/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6 border border-white/10 hover:border-pink-400/50 transition-all"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-semibold text-center text-pink-300 mb-6">
            Complete Your Artist Profile
          </h1>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-lg font-medium">Select Your Category</label>
            <Select onValueChange={handleCategory}>
              <SelectTrigger className="w-full bg-white/10 border border-white/20 text-white">
                <SelectValue placeholder="Choose a category..." />
              </SelectTrigger>
              <SelectContent className="bg-black border border-pink-300/40 text-white">
                {artistCategories.map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                    className="hover:bg-pink-500/20"
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-lg font-medium">Your Price</label>
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="bg-white/10 border border-white/20 text-white"
              placeholder="Enter your base price"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-lg font-medium">Your Bio</label>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="bg-white/10 border border-white/20 text-white min-h-[100px]"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Best Event */}
          <div className="space-y-2">
            <label className="text-lg font-medium">
              Best Event You Performed In
            </label>
            <Textarea
              name="bestEvent"
              value={formData.bestEvent}
              onChange={handleInputChange}
              className="bg-white/10 border border-white/20 text-white min-h-[100px]"
              placeholder="Share your best performance experience..."
            />
          </div>

          {/* Social Links */}
          <div className="pt-4 border-t border-white/10 space-y-4">
            <h2 className="text-xl font-semibold text-pink-400">
              Social & Media Links
            </h2>

            <Input
              name="youtubeUrl"
              value={formData.youtubeUrl}
              onChange={handleInputChange}
              placeholder="YouTube Channel URL"
              className="bg-white/10 border border-white/20 text-white"
            />

            <Input
              name="instagramUrl"
              value={formData.instagramUrl}
              onChange={handleInputChange}
              placeholder="Instagram Profile URL"
              className="bg-white/10 border border-white/20 text-white"
            />

            <Input
              name="introVideoUrl"
              value={formData.introVideoUrl}
              onChange={handleInputChange}
              placeholder="Intro / Self-Explanation Video URL"
              className="bg-white/10 border border-white/20 text-white"
            />
          </div>

          {error && (
            <p className="text-red-400 text-center font-medium">{error}</p>
          )}

          {/* Submit */}
          <motion.div
            className="flex justify-center pt-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-pink-500 via-orange-400 to-purple-500 text-white px-12 py-3 text-lg rounded-full shadow-xl disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Profile"}
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </motion.section>
  );
};

export default ArtistDetailsForm;
