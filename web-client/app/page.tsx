"use client"

import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Reviews } from "@/components/reviews"
import { Footer } from "@/components/footer"
import { StepHome } from "@/components/steps"

export default function Home() {
  return (
    <div className={`min-h-screen relative  h-dvh z-10`}>
      <div className="relative  w-full z-10 dark:bg-[#040305] bg-white">
        <Navigation />
        <Hero />
        <Features />
        <StepHome />
        {/* <Reviews /> */}
      </div>
      <Footer />
    </div>
  )
}
