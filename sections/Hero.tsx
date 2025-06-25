// import Image from 'next/image'
// import React from 'react'

// const Hero = () => {
//   return (
//     <section>
//     <div className='home-section' >
//        <div className='hero-section-text' >
//         <h1>Where</h1>
//         <h1 className='px-6' >Talent, </h1>
//         <h1>Meets</h1>
//         <h1 className='px-6'>Stage</h1>
//        </div>
//        <div>
//         <Image src={"/images/guitarArtist.png"} alt='guitarArtist' width={450} height={540} className='mt-6' />
//        </div>
//     </div>
//     </section>
//   )
// }

// export default Hero


import Image from 'next/image';
import React from 'react';

const Hero = () => {
  return (
    <section>
      <div className="home-section">
        <div className="hero-section-text">
          <h1>Where</h1>
          <h1 className="px-2 md:px-6">Talent,</h1>
          <h1>Meets</h1>
          <h1 className="px-2 md:px-6">Stage</h1>
        </div>
        <div>
          <Image
            src="/images/guitarArtist.png"
            alt="guitarArtist"
            width={450}
            height={540}
            className="mt-6 mx-auto md:mx-0 w-[250px] sm:w-[300px] md:w-[450px]"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
