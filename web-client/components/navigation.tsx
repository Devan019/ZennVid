"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/UserStore"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
          ? "bg-white/90 dark:bg-black/10 backdrop-blur-md border-b border-gray-200 dark:border-white/10"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              VideoAI
            </span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="#reviews"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Reviews
            </a>
            <ModeToggle />
            {!isAuthenticated && (
              <Button
                variant="outline"
                className="border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white bg-transparent dark:text-purple-400"
                onClick={() => router.push('/auth')}
              >
                Sign In
              </Button>
            )}
            {isAuthenticated && (
              <Button
                variant="outline"
                className="border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white bg-transparent dark:text-purple-400"
                onClick={logout}
              >
                Logout
              </Button>
            )}
            {!isAuthenticated && (
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Get Started
              </Button>
            )}
            {isAuthenticated && (
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={() => router.push('/dashboard')}
              >
                Dashboard
              </Button>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={() => {
              setIsOpen(!isOpen)
            }}>
              {isOpen ? (
                <X className="text-gray-700 dark:text-white" />
              ) : (
                <Menu className="text-gray-700 dark:text-white" />
              )}
            </Button>
          </div>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/90 dark:bg-black/20 backdrop-blur-md rounded-lg mt-2 p-4 border border-gray-200 dark:border-white/10"
          >
            <div className="flex flex-col space-y-4">
              <a
                href="#features"
                className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                Pricing
              </a>
              <a
                href="#reviews"
                className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                Reviews
              </a>
              {!isAuthenticated && (
                <Button
                  variant="outline"
                  className="border-purple-500 text-purple-600 bg-transparent dark:text-purple-400"
                >
                  Sign In
                </Button>
              )}
              {isAuthenticated && (
                <Button
                  variant="outline"
                  className="border-purple-500 text-purple-600 bg-transparent dark:text-purple-400"
                  onClick={logout}
                >
                  Logout
                </Button>
              )}
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500">Get Started</Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
