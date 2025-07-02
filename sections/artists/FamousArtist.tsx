import React from 'react'
import { artistList } from "@/constants/artist";

const FamousArtist = () => {
  return (
    <main>
       <section className="py-20 px-4 min-h-[85vh] bg-gray-950">
        <h2 className="text-4xl font-bold text-center mb-10 text-white">
          Discover Artists Already Onboard
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          {artistList.map((artist) => (
            <div
              key={artist.name}
              className="bg-gray-800 p-4 rounded-xl shadow hover:scale-105 transition-transform"
            >
              <h4 className="text-xl text-pink-500 font-semibold">{artist.name}</h4>
              <p className="text-sm text-gray-300 mt-1">{artist.genre}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default FamousArtist
