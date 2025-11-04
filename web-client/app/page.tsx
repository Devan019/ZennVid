"use client"


import { Features } from "@/components/Home/features"
import { Reviews } from "@/components/Home/reviews"
import { Footer } from "@/components/common/footer"
import { StepHome } from "@/components/Home/steps"
import PricingComponent from "@/components/Home/pricing"
import { useEffect } from "react"
import Lenis from "lenis";
//@ts-ignore
import "lenis/dist/lenis.css";
import { Navigation } from "@/components/common/navigation"
import { Hero } from "@/components/Home/hero"
export default function Home() {
  useEffect(() => {
    document.body.classList.add("loaded");
    const lenis = new Lenis({
      lerp: 0.09
    });

    function raf(time: any) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <div className={`min-h-screen relative  h-dvh z-10`}>
      <div className="relative  w-full z-10 dark:bg-[#040305] bg-white">
        <Navigation />
        <Hero />
        <Features />
        <StepHome />
        <PricingComponent />
        {/* <Reviews /> */}
      </div>
      <Footer />
    </div>
  )
}
