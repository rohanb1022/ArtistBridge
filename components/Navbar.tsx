import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

const Navbar = () => {
  return (
    <section>
        <div className='w-full flex justify-between mt-4'>
        <div className='mt-5 ml-16 font-extrabold text-2xl' >
            <Link href={"/"} >ARTISTLY</Link>
        </div>
        <div className='flex justify-around items-center gap-9 mt-5 mr-18' >
            <Link href={"/artist"} ><Button variant="link" className='text-white font-light text-xl' >Artists</Button></Link>
            <Link href={"/organisors"} ><Button variant="link" className='text-white font-light text-xl' >Organisors</Button></Link>
            <Link href={"/artist/artistForm"} ><Button variant="link" className='text-white font-light text-xl' >Artists</Button></Link>
            <Link href={"/"} ><Button variant="link" className='text-white font-light text-xl' >Artists</Button></Link>
        </div>
        </div>
    </section>
  )
}

export default Navbar
