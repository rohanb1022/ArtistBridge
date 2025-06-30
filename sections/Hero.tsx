import { Navbar } from '@/components/Navbar'
import Image from 'next/image'
import React from 'react'

const Hero = () => {
  return (
    <>
    <Navbar/>
    <section className="flex flex-col-reverse md:flex-row justify-around items-center min-h-[90vh] px-4 py-8 gap-8">
      {/* Left Text Content */}
      <div className="finger-paint text-center md:text-left text-4xl sm:text-5xl md:text-7xl font-extrabold space-y-1">
        <p className="text-pink-500">Make</p>
        <p className="pl-2 text-black">Events,</p>
        <p className="text-pink-500">Truly</p>
        <p className="pl-2 text-black">Unforgettable</p>
      </div>

      {/* Hero Image */}
      <div className="w-full max-w-[500px]">
        <Image
          src="/images/heroSection.png"
          alt="dancers"
          width={600}
          height={450}
          className="rounded-xl rounded-tl-[80px] w-full object-cover"
        />
      </div>
    </section>
    </>
  )
}

export default Hero
