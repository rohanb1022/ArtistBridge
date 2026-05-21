import Hero from '@/sections/organizer/Hero'
import OrgCTA from '@/sections/organizer/OrgCTA'
import ArtistDemo from '@/sections/organizer/ArtistDemo'
import Testimonials from '@/sections/organizer/Testimonials'
import React from 'react'
import Footer from '@/sections/organizer/Footer'

const Home = () => {
  return (
    <div style={{ backgroundColor: "#020817", minHeight: "100vh" }}>
      <Hero />
      <OrgCTA />
      <ArtistDemo />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default Home
