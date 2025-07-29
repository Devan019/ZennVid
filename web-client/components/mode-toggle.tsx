"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before rendering to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder button during SSR to avoid hydration mismatch
    return (
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-purple-500/20 relative"
      >
        <div className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light"
    setTheme(newTheme)
    console.log(`Theme changed to ${newTheme}`)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="hover:bg-purple-500/20 relative overflow-hidden transition-colors duration-200"
    >
      <Sun 
        className={`h-[1.2rem] w-[1.2rem] absolute transition-all duration-300 ease-in-out ${
          resolvedTheme === "dark" 
            ? "rotate-90 scale-0 opacity-0" 
            : "rotate-0 scale-100 opacity-100"
        }`} 
      />
      <Moon 
        className={`h-[1.2rem] w-[1.2rem] absolute transition-all duration-300 ease-in-out ${
          resolvedTheme === "dark" 
            ? "rotate-0 scale-100 opacity-100" 
            : "-rotate-90 scale-0 opacity-0"
        }`} 
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}