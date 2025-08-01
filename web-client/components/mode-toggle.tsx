import React from "react"
import ThemeToggleButton from "./ui/theme-toggle-button"


const ModeToggle = () => {
  return (
    <div className="h-full w-full flex items-center justify-center hover:cursor-pointer ">
      <ThemeToggleButton  className="hover:scale-110 transition-transform hover:cursor-pointer" variant="circle" start="top-left"  />
    </div>
  )
}

export default ModeToggle
