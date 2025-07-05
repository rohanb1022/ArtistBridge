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
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { motion } from "framer-motion";

const ArtistDetailsForm = () => {
  useProtectedRoute();
  const [formData, setFormData] = useState({
    category: [] as string[],
    price: 0,
    bio: "",
    bestEvent: "",
  });
  const [error, setError] = useState("");
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
        : [...prev.category, value],
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.put("/artist/completeProfile", formData);
      console.log(response.data);
      router.push("/artist/home");
    } catch (error) {
      console.error("Error submitting:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <motion.section
      className="min-h-screen bg-black text-white py-10 px-4 flex flex-col items-center justify-start"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        ArtistBridge
      </motion.h2>

      <motion.div
        className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 space-y-6 border border-pink-300/30"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-3xl font-semibold text-center text-pink-300 mb-6">
          Complete Your Artist Profile
        </h1>

        {/* Category Select */}
        <div className="space-y-2">
          <label className="text-lg font-medium">Select Your Category</label>
          <Select onValueChange={(e) => handleCategory(e)}>
            <SelectTrigger className="w-full bg-white/20 backdrop-blur-sm border border-pink-300/40 text-white placeholder:text-gray-300">
              <SelectValue placeholder="Choose a category..." />
            </SelectTrigger>
            <SelectContent className="bg-black border border-pink-300/40 text-white">
              {artistCategories.map((item) => (
                <SelectItem value={item} key={item} className="hover:bg-pink-500/20">
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Input */}
        <div className="space-y-2">
          <label className="text-lg font-medium">Your Price ($)</label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Enter your base price"
            className="bg-white/10 border border-pink-300/40 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Bio Input */}
        <div className="space-y-2">
          <label className="text-lg font-medium">Your Bio</label>
          <Textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Tell us a little about yourself..."
            className="bg-white/10 border border-pink-300/40 text-white placeholder:text-gray-400 min-h-[100px]"
          />
        </div>

        {/* Best Event Input */}
        <div className="space-y-2">
          <label className="text-lg font-medium">Best Event You Performed In</label>
          <Textarea
            name="bestEvent"
            value={formData.bestEvent}
            onChange={handleInputChange}
            placeholder="Share your best performance experience..."
            className="bg-white/10 border border-pink-300/40 text-white placeholder:text-gray-400 min-h-[100px]"
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-400 text-center font-medium">{error}</p>
        )}

        {/* Submit Button */}
        <motion.div
          className="flex justify-center mt-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-10 py-3 text-lg rounded-full shadow-md"
          >
            Submit Profile
          </Button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default ArtistDetailsForm;
