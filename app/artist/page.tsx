"use client"

/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Artist } from '@/types';
import {useState , useEffect } from 'react'

const Artist = () => {
  const categories = ["Singer", "DJ", "Dancer", "Speaker"];
  const [artists , setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    const fetchArtistDetails = async () => {
      const res = await fetch("https://dummyjson.com/users")
      const data = await res.json();
      setArtists(data)
    }
  } , [])

  

  return (
    <section className="artist-grid">
      {artists.map((artist) => (
        <div key={artist.id} className="artist-card">
          <h3 className="text-xl font-bold">{artist.name}</h3>
          <p className="text-sm text-gray-400">{artist.category}</p>
          <p className="text-sm text-gray-400">{artist.location}</p>
          <p className="text-sm text-emerald-400">{artist.priceRange}</p>
          <button className="quote-button">Ask for Quote</button>
        </div>
      ))}
    </section>
  )
}

export default Artist
