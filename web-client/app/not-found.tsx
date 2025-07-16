import { Rocket } from "lucide-react";
import Link from "next/link";
import { FaUserAstronaut } from "react-icons/fa";
import { GiAlienBug, GiPlanetCore } from "react-icons/gi";
import { TbAlienFilled } from "react-icons/tb";
// import { Rocket, Alien, Planet, Astronaut } from "@/components/icons"; // You can use any icons library

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Animated Alien Icon */}
        <div className="mb-8 ">
          <TbAlienFilled className="w-32 h-32 mx-auto text-green-400" />
        </div>

        <h1 className="text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-400">
          404
        </h1>
        
        <h2 className="text-3xl font-semibold mb-4">
          Houston, we have a problem!
        </h2>
        
        <p className="text-xl mb-8 text-gray-300">
          You've reached the edge of the universe. The page you're looking for 
          has been abducted by aliens or lost in a black hole.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-full font-medium transition-all flex items-center justify-center gap-2"
          >
            <Rocket className="w-5 h-5" />
            Beam Me Home
          </Link>
          
          <Link
            href="/contact"
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-full font-medium transition-all flex items-center justify-center gap-2"
          >
            <FaUserAstronaut className="w-5 h-5" />
            Contact Mission Control
          </Link>
        </div>

        <div className="text-gray-400 text-sm">
          <p>Meanwhile, here are some safe places to explore:</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <Link href="/about" className="hover:text-white">About</Link>
          </div>
        </div>

        {/* Floating planets decoration */}
        <div className="absolute top-20 left-10 opacity-30">
          <GiPlanetCore className="w-16 h-16 text-yellow-300 animate-spin-slow" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-30">
          <GiPlanetCore className="w-20 h-20 text-blue-300 animate-spin-slow" />
        </div>
      </div>
    </div>
  );
}