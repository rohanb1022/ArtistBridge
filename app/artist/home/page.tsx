import React from 'react'
import ArtistHomePage from "@/sections/artists/Home";
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

const Home = () => {
  useProtectedRoute();
  return (
    <div>
      <ArtistHomePage/>
    </div>
  )
}

export default Home
