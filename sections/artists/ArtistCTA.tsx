import React from 'react'
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ArtistCTA = () => {
  return (
    <main>
       <section
      className="min-h-screen w-full bg-black bg-cover bg-center bg-no-repeat text-white px-6 py-12 flex flex-col items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1533106418989-88406c7cc8e1?auto=format&fit=crop&w=1950&q=80')", // 👈 change this URL if needed
      }}
    >
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Stay on Top of Your Gigs</h2>
        <p className="text-lg max-w-xl mx-auto text-gray-300">
          Manage your bookings, respond to requests, and make your profile stand out.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* Card 1 - Confirmed Bookings */}
        <div className="hover:scale-102 transition-transform  bg-white/10 border border-white/20 backdrop-blur-md p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2">🎉 Ready to Perform?</h3>
          <p className="text-sm text-gray-300 mb-4">
            View all your confirmed bookings and upcoming performances.
          </p>
          <Link href="/artist/bookings">
            <Button className="w-full hover:scale-110 transition-transform">View Bookings →</Button>
          </Link>
        </div>

        {/* Card 2 - Pending Confirmations */}
        <div className="hover:scale-102 transition-transform  bg-white/10 border border-white/20 backdrop-blur-md p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2">⏳ Bookings Awaiting Your Response</h3>
          <p className="text-sm text-gray-300 mb-4">
            You have pending booking requests waiting for your acceptance.
          </p>
          <Link href="/artist/pending">
            <Button className="w-full hover:scale-110 transition-transform">Review Pending →</Button>
          </Link>
        </div>

        {/* Card 3 - Update Profile */}
        <div className="hover:scale-102 transition-transform  bg-white/10 border border-white/20 backdrop-blur-md p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2">📭 Not Getting Bookings?</h3>
          <p className="text-sm text-gray-300 mb-4">
            Update your genres, pricing, and city to attract more organizers.
          </p>
          <Link href="/artist/profile/edit">
            <Button className="w-full hover:scale-110 transition-transform">Update Profile →</Button>
          </Link>
        </div>

        {/* Card 4 - Organizer Requests */}
        <div className="hover:scale-102 transition-transform  bg-white/10 border border-white/20 backdrop-blur-md p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2">📢 Organizers Are Looking For You</h3>
          <p className="text-sm text-gray-300 mb-4">
            Organizers couldn&apos;t find artists — reply to their open requests and grab the gig.
          </p>
          <Link href="/artist/requests">
            <Button className="w-full hover:scale-110 transition-transform">View Organizer Requests →</Button>
          </Link>
        </div>
      </div>
    </section>
    </main>
  )
}

export default ArtistCTA
