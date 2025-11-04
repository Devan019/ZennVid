import { Footer } from '@/components/common/footer'
import { Navigation } from '@/components/common/navigation'
import PricingComponent from '@/components/Home/pricing'
import React from 'react'

const page = () => {
  return (
    <div className='min-h-screen relative  h-dvh'>
      <div className='relative  w-full z-10 dark:bg-[#040305] bg-white'>
        <Navigation />
        <PricingComponent />
      </div>
      <Footer />
    </div>
  )
}

export default page
