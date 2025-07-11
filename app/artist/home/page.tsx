"use client";

import React from 'react'
import Hero from '@/sections/artists/Hero';
import ArtistCTA from '@/sections/artists/ArtistCTA';
import OrgDemo from '@/sections/artists/OrgDemo';
import FamousArtist from '@/sections/artists/FamousArtist';
import Footer from '@/sections/artists/Footer';


const Home = () => {
  return (
    <div>
      <Hero/>
      <ArtistCTA/>
      <OrgDemo/>
      <FamousArtist/>
      <Footer/> 
    </div>
  )
}

export default Home
