"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <main>
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/orgHome.png"
          alt="Organizer Hero Background"
          fill
          priority
          className="object-cover brightness-[0.3]"
        />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center text-white px-6 py-12">
        <div className='flex justify-center items-center mx-2 ' >
            <h2 className='text-4xl text-pink-400 font-light mt-4 mb-4' >ArtistBridge</h2>
        </div>
        <hr className='mb-2' />
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extralight leading-tight text-pink-500 mb-6 drop-shadow-lg">
          Find the Perfect Artist
        </h1>
        <p className="text-lg md:text-2xl max-w-2xl text-gray-200 mb-8">
          Connect with top-performing artists for your events, weddings, concerts,
          and corporate functions.
        </p>

        <Link href="/explore">
          <Button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full text-lg shadow-lg transition-all duration-300">
            Explore Artists
          </Button>
        </Link>
      </section>
    </main>
  );
};

export default Hero;
