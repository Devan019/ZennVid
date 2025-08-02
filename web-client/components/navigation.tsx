"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import ModeToggle from "./mode-toggle"
import FlipLink from "./ui/text-effect-flipper"
import Link from "next/link"
import { useUser } from "@/context/UserProvider"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useUser()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (isLoading) {
    return null
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              VideoAI
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-6">
              <FlipLink 
                className="text-[18px] text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400" 
                href="#features"
              >
                Features
              </FlipLink>
              <FlipLink 
                className="text-[18px] text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400" 
                href="#pricing"
              >
                Pricing
              </FlipLink>
              <FlipLink 
                className="text-[18px] text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400" 
                href="#reviews"
              >
                Reviews
              </FlipLink>
            </div>

            <div className="flex items-center gap-4 ml-6">
              <ModeToggle />
              {!isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    className="border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white dark:text-purple-400 dark:hover:bg-purple-600 dark:hover:text-white"
                    onClick={() => router.push('/auth')}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    Get Started
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white dark:text-purple-400 dark:hover:bg-purple-600 dark:hover:text-white"
                    // onClick={logout}
                  >
                    Logout
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    onClick={() => router.push('/dashboard/Prompt2Video')}
                  >
                    Dashboard
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 rounded-lg mt-2 p-4 border border-gray-200 dark:border-gray-800"
          >
            <div className="flex flex-col space-y-4">
              <Link
                href="#features"
                className="px-4 py-2 text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="px-4 py-2 text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Pricing
              </Link>
              <Link
                href="#reviews"
                className="px-4 py-2 text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Reviews
              </Link>
              <div className="flex flex-col gap-2 pt-2">
                {!isAuthenticated ? (
                  <>
                    <Button
                      variant="outline"
                      className="border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white dark:text-purple-400 dark:hover:bg-purple-600 dark:hover:text-white"
                      onClick={() => router.push('/auth')}
                    >
                      Sign In
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      Get Started
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white dark:text-purple-400 dark:hover:bg-purple-600 dark:hover:text-white"
                      // onClick={logout}
                    >
                      Logout
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      onClick={() => router.push('/dashboard/Prompt2Video')}
                    >
                      Dashboard
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}