/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";

const CTA = () => {
  return (
    // <section>
    //   <div className="cta-section" >
    //     <div>
    //         <Image src={"/images/drumSet.png"} alt="artist" width={540} height={415} />
    //     </div>
    //     <div className="flex flex-col justify-center items-center" >
    //         <p className="text-5xl font-bold" >Make Events</p>
    //         <p className="text-5xl font-bold mb-5">Truly Unforgettable</p>
    //         <Button className="book-now-button text-xl">Unleash Talent, Browse Artists</Button>
    //     </div>
    //   </div>
    // </section>
    <section className="min-h-screen w-full bg-black text-white px-12 py-10">
  <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
    
    {/* 🎸 Left: Image */}
    <div className="flex justify-center">
      <img
        src="/images/drumSet.png" // or whatever your image path is
        alt="instruments"
        className="max-w-[80%] h-auto object-contain"
      />
    </div>

    {/* 🎯 Right: Text + CTA */}
    <div className="flex flex-col items-start justify-center gap-6">
      <h2 className="text-3xl md:text-5xl font-bold leading-tight">
        Make Events <br /> Truly Unforgettable
      </h2>
      <p className="text-gray-300 text-lg">
        Unleash talent, browse artists & book performers instantly.
      </p>
      <Button className="book-now-button">Unleash Talent, Browse Artists</Button>
    </div>

  </div>
</section>

  );
};

export default CTA;
