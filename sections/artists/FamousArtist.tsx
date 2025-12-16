import React from "react";
import { artistList } from "@/constants/artist";

const FamousArtist = () => {
  return (
    <section className="relative py-24 px-4 bg-gradient-to-b from-gray-950 via-black to-gray-950">
      {/* Section heading */}
      <div className="max-w-6xl mx-auto mb-14 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Discover Artists Already Onboard
        </h2>
        <p className="mt-4 text-gray-400 text-sm md:text-base">
          Explore talented creators across multiple genres
        </p>
      </div>

      {/* Artist grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {artistList.map((artist) => (
          <div
            key={artist.name}
            className="group relative rounded-2xl p-[1px] 
            bg-gradient-to-br from-pink-500/40 via-purple-500/30 to-cyan-400/40 
            hover:from-pink-500 hover:via-purple-500 hover:to-cyan-400
            transition-all duration-300"
          >
            <div
              className="h-full rounded-2xl bg-gray-900/90 backdrop-blur 
              p-5 shadow-lg 
              transform transition-all duration-300
              group-hover:-translate-y-1 group-hover:shadow-pink-500/20"
            >
              {/* Artist name */}
              <h4 className="text-lg font-semibold text-white group-hover:text-pink-400 transition-colors">
                {artist.name}
              </h4>

              {/* Genre badge */}
              <span
                className="inline-block mt-3 px-3 py-1 text-xs rounded-full 
                bg-pink-500/10 text-pink-400 border border-pink-500/20"
              >
                {artist.genre}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FamousArtist;
