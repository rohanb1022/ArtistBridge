import React, { ReactNode } from 'react'

const Formlayout = ({children} : Readonly<{children : ReactNode}>) => {
  return (
    <section  >
        <div className='flex justify-center items-center mx-2 ' >
            <h2 className='text-4xl text-pink-400 font-light mt-4 mb-4' >ArtistBridge</h2>
        </div>
        <hr className='mb-2' />
        {children}
    </section>
  )
}

export default Formlayout
