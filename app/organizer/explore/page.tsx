"use client";

import api from '@/lib/axios';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';

// Define the artist type
type Artist = {
  id: number | string;
  name: string;
  bio: string;
  city: string;
  category: string[];
  price: number;
};

const ExploreArtist = () => {
  const [artists, setArtists] = React.useState<Artist[]>([]);
  const [filteredArtists, setFilteredArtists] = React.useState<Artist[]>([]);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchArtists = async () => {
      setIsLoading(true)
      try {
        const response = await api.get('/organizer/getAllArtists');
        setArtists(response.data);
        setFilteredArtists(response.data);
      } catch (error) {
        console.error('Error fetching artists:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtists();
  }, []);

  React.useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = artists.filter((artist) =>
      artist.name.toLowerCase().includes(lowerTerm) ||
      artist.city.toLowerCase().includes(lowerTerm) ||
      artist.category.some((cat) => cat.toLowerCase().includes(lowerTerm))
    );
    setFilteredArtists(filtered);
  }, [searchTerm, artists]);

  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white py-10 px-6">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-center text-pink-500 mb-10">
          Explore Top Artists
        </h1>

        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Search by name, city, or category..."
            className="w-full max-w-xl px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {
          isLoading && (
            <div className="text-center text-gray-400 mt-20">
              <p className="text-xl">
                <span className="animate-spin mr-2"><LoaderCircle/></span>
                Loading...
              </p>
            </div>
          )
        }
        {filteredArtists.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-xl">No artists are currently available. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtists.map((artist) => (
              <motion.div
                key={artist.id}
                className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 p-6 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform"
                whileHover={{ scale: 1.03 }}
              >
                <h2 className="text-2xl font-semibold text-white mb-2">
                  {artist.name}
                </h2>
                <p className="text-gray-300 mb-3 text-sm">
                  {artist.bio !== null && artist.bio.length > 150
                    ? artist.bio.slice(0, 150) + '...'
                    : artist.bio}
                </p>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>
                    <span className="font-semibold text-white">City:</span> {artist.city}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Category:</span> {artist.category.join(", ")}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Price:</span> ₹{artist.price}
                  </p>
                </div>
                <Link href={`/organizer/artist-profile/${artist.id}`}>
                  <button className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors">
                    View Profile
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ExploreArtist;
