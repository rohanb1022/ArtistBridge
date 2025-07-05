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
        <h1 className="text-3xl font-bold mb-6 text-pink-600 text-center">
          Find Artists by City and Category
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Enter City"
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          />
          <select
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-2 rounded-md shadow-md transition"
          >
            {loading ? "Searching..." : "Search Artists"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {response.data.length === 0 ? (
            <p className="col-span-full text-center text-gray-600">
              No artists found. Please update filters.
            </p>
          ) : (
            response.data.map((artist: any) => (
              <motion.div
                key={artist.id}
                className="bg-pink-100/40 border border-pink-300 rounded-xl p-4 shadow-md backdrop-blur-md"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-xl font-semibold text-pink-700">{artist.name}</h3>
                <p className="text-sm text-gray-700">City: {artist.city}</p>
                <p className="text-sm text-gray-700">
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
