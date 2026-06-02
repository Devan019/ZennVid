"use client"
import { Footer } from '@/components/common/Footer'
import { FullscreenMenu } from '@/components/common/FullscreenMenu'
import { Navbar } from '@/components/common/Navbar'
import PricingComponent from '@/components/common/pricing'
import React, { useState } from 'react'

const Page = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className='min-h-screen relative'>
      <Navbar
        setMenuOpen={
          setMenuOpen
        }
      />

      {/* MENU */}
      <FullscreenMenu
        menuOpen={menuOpen}
        setMenuOpen={
          setMenuOpen
        }
      />
      <div className='relative  w-full z-10  bg-white'>
        <PricingComponent />
      </div>
      <Footer />
    </div>
  )
}

export default Page
