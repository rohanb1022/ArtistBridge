/* eslint-disable @typescript-eslint/no-explicit-any */


/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import api from '@/lib/axios';
import { useState } from 'react';
import { motion } from 'framer-motion';

const categories = [
  "SINGER",
  "DANCER",
  "MAGICIAN",
  "COMEDIAN",
  "DJ",
  "INSTRUMENTALIST",
  "MIME",
  "THEATRE",
  "BEATBOXER",
  "SPEAKER",
  "PAINTER",
  "POET",
  "PHOTOGRAPHER",
  "MODEL",
  "CIRCUS",
];

const SearchFilters = () => {
  const [filters, setFilters] = useState({
    city: "",
    category: "",
  });

  const [response, setResponse] = useState({
    data: [],
  });

  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!filters.city || !filters.category) return;

    setLoading(true);
    try {
      const response = await api.get(
        `/artist/searchArtist?city=${filters.city}&category=${filters.category}`
      );
      setResponse(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("Error fetching filters", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-heading font-medium mb-6 text-neutral-900 text-center">
          Find Artists by City and Category
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-4 font-sans">
          <input
            type="text"
            placeholder="Enter City"
            className="border border-neutral-200 rounded-md px-4 py-2 w-full md:w-1/2 focus:outline-none focus:border-neutral-900 bg-white text-neutral-900"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          />
          <select
            className="border border-neutral-200 rounded-md px-4 py-2 w-full md:w-1/2 focus:outline-none focus:border-neutral-900 bg-white text-neutral-900"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center mb-10">
          <button
            onClick={handleSearch}
            className="bg-neutral-900 hover:bg-neutral-800 text-white font-medium px-6 py-2.5 rounded-md shadow-xs transition"
          >
            {loading ? "Searching..." : "Search Artists"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 font-sans">
          {response.data.length === 0 ? (
            <p className="col-span-full text-center text-neutral-500">
              No artists found. Please update filters.
            </p>
          ) : (
            response.data.map((artist: any) => (
              <motion.div
                key={artist.id}
                className="bg-white border border-neutral-200 rounded-lg p-5 shadow-xs flex flex-col gap-2 hover:border-neutral-900 transition-colors"
                whileHover={{ y: -2 }}
              >
                <h3 className="text-base font-bold text-neutral-900">{artist.name}</h3>
                <p className="text-xs text-neutral-500">City: {artist.city}</p>
                <p className="text-xs text-neutral-500">
                  Category: {artist.category?.join(", ")}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SearchFilters;
