import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { demoArtists } from "@/constants/artist";
import Image from "next/image";

const ArtistDemo = () => {
  return (
    <div className="min-h-screen flex flex-col gap-10 items-center px-4 py-6 md:py-16 bg-white">
      {/* Hero Section */}
      <div className="text-center max-w-2xl space-y-3">
        <p className="text-2xl md:text-4xl font-bold text-pink-600">
          Find the Perfect Artist for Your Event
        </p>
        <p className="text-base md:text-xl text-gray-700 font-light tracking-wide">
          Discover artists by genre, budget, or city. Book confidently with real reviews and transparent pricing.
        </p>
        <Button className="mt-2">
          <Link href={"/"}>Book now</Link>
        </Button>
      </div>

      {/* Artist Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl px-2">
        {demoArtists.map((artist, id) => (
          <div
            className="bg-white flex gap-4 items-start p-4 rounded-2xl shadow-md hover:shadow-lg transition duration-300"
            key={id}
          >
            <Image
              src={artist.img}
              alt={artist.category}
              width={90}
              height={90}
              className="rounded-xl object-cover aspect-square"
            />
            <div className="flex flex-col gap-1 text-sm">
              <p className="text-lg font-bold">{artist.name}</p>
              <p className="font-medium text-gray-800">{artist.category}</p>
              <p className="text-pink-600 font-semibold">{artist.priceRange}</p>
              <p className="text-gray-500">{artist.city}</p>
              <p className="text-gray-600 line-clamp-3">{artist.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistDemo;
