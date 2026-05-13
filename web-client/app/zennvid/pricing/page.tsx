
import PricingComponent from '@/components/common/pricing'
import React from 'react'
import { Footer } from 'react-day-picker'

const page = () => {
  return (
    <div className='min-h-screen relative'>
      <div className='relative  w-full z-10  bg-white'>
        <PricingComponent />
      </div>
      <Footer />
    </div>
  )
}

export default page
