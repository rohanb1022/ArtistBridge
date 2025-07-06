"use client";

import api from '@/lib/axios';
import React from 'react';
import Link from 'next/link';

// Define the artist type
type Artist = {
  id:  number | string;
  name: string;
  bio: string;
  city: string;
  category: string[];
  price: number;
};

const ExploreArtist = () => {
  const [artists, setArtists] = React.useState<Artist[]>([]);

  React.useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await api.get('/organizer/getAllArtists');
        setArtists(response.data);
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };
    fetchArtists();
  }, []);

  return (
    <section className="min-h-screen bg-black text-white py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-pink-500 mb-10 text-center">
          Explore Top Artists
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform"
            >
              <h2 className="text-2xl font-semibold text-white mb-2">
                {artist.name}
              </h2>
              <p className="text-gray-300 mb-3 text-sm">
                {artist.bio.length > 150
                  ? artist.bio.slice(0, 150) + '...'
                  : artist.bio}
              </p>
              <div className="text-sm text-gray-400 space-y-1">
                <p>
                  <span className="font-semibold text-white">city:</span> {artist.city}
                </p>
                <p>
                  <span className="font-semibold text-white">category:</span> {artist.category}
                </p>
                <p>
                  <span className="font-semibold text-white">Price:</span> ${artist.price}
                </p>
              </div>
              <Link href={`/organizer/artist-profile/${artist.id}`}>
              <button className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors">
                View Profile
              </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreArtist;

