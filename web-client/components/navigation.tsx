"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import ModeToggle from "./mode-toggle"

import { useUser } from "@/context/UserProvider"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { FRONTEND_ROUTES } from "@/constants/frontend_routes"
import Link from "next/link"

interface URLS {
  url: string;
  label: string;
}

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useUser()

  const defaultUrls: URLS[] = [
    { url: "#featurs", label: "Features" },
    // {url : "#", label : "Features"},
  ]

  const authUrls: URLS[] = [
    { url: FRONTEND_ROUTES.DASHBOARD, label: "Dashboard" },
    { url: FRONTEND_ROUTES.OPENAPI, label: "Openapi" },
    { url: FRONTEND_ROUTES.PRICING, label: "Pricing" },
    /** add more */
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
  };

  const handleViewProfile = () => {
    setIsMenuOpen(false);
  };




  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
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
              ZennVid
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-6">
              {isAuthenticated && (
                authUrls.map((url, index) => (
                  <Link
                    className="text-[18px] text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
                    href={url.url}
                    key={index}
                  >
                    {url.label}
                  </Link>
                ))
              )}
              {!isAuthenticated && (
                defaultUrls.map((url, index) => (
                  <Link
                    className="text-[18px] text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
                    href={url.url}
                    key={index}
                  >
                    {url.label}
                  </Link>
                ))
              )}
            </div>

            <div className="flex items-center gap-4 ml-6 relative">
              <ModeToggle />
              {!isAuthenticated && (
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
              )}
              {user && isAuthenticated &&
                (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="w-full flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 rounded-full border border-blue-200 cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.div
                        className="w-2 h-2 bg-green-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="w-18 text-sm font-semibold text-gray-700">
                        {user.credits + " Credits"}
                      </span>
                    </motion.div>

                    <Avatar
                      className="size-12 cursor-pointer"
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                      <AvatarImage draggable={false} src={user.profilePicture} />
                      <AvatarFallback
                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                 text-white font-bold text-lg flex items-center justify-center 
                 rounded-full uppercase shadow-lg"
                      >
                        {user.username?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <AnimatePresence>
                      {isMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="  mt-16  bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200"
                        >
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">{user.username}</p>
                            {/* <p className="text-xs text-gray-500">{user.credits} credits available</p> */}
                          </div>

                          <motion.button
                          
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={handleViewProfile}
                          >
                            Profile
                          </motion.button>

                          <motion.button
                            
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            onClick={handleLogout}
                          >
                            Logout
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
              {isAuthenticated && (
                authUrls.map((url, index) => (
                  <Link
                    className="text-[18px] text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
                    href={url.url}
                    key={index}
                  >
                    {url.label}
                  </Link>
                ))
              )}
              {!isAuthenticated && (
                defaultUrls.map((url, index) => (
                  <Link
                    className="text-[18px] text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
                    href={url.url}
                    key={index}
                  >
                    {url.label}
                  </Link>
                ))
              )}
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
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 rounded-full border border-blue-200 cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.div
                        className="w-2 h-2 bg-green-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="text-sm font-semibold text-gray-700">
                        {user?.credits} Credits
                      </span>
                    </motion.div>
                    <>
                      <Avatar
                        className="size-12 cursor-pointer"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                      >
                        <AvatarImage draggable={false} src={user?.profilePicture} />
                        <AvatarFallback
                          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                 text-white font-bold text-lg flex items-center justify-center 
                 rounded-full uppercase shadow-lg"
                        >
                          {user?.username?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </>
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