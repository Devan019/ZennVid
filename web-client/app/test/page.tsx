import React from "react"

const Preview: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen bg-zinc-800">
      {/* Main content area - now uses flex-grow */}
      <div className="flex-grow">
        <div className="w-full h-screen text-2xl md:text-7xl font-bold uppercase flex justify-center items-center text-black z-10">
          Scroll down ↓
        </div>
      </div>

      {/* Sticky footer - now properly constrained */}
      <div className="sticky bottom-0 left-0 w-full h-80 bg-amber-600 z-10">
        <div className="relative h-full w-full flex justify-end px-12 items-start py-12 text-[#ff5941]">
          <div className="flex flex-row space-x-12 sm:space-x-16 md:space-x-24 text-sm sm:text-lg md:text-xl">
            <ul>
              <li className="hover:underline cursor-pointer">Home</li>
              <li className="hover:underline cursor-pointer">Docs</li>
              <li className="hover:underline cursor-pointer">Comps</li>
            </ul>
            <ul>
              <li className="hover:underline cursor-pointer">Github</li>
              <li className="hover:underline cursor-pointer">Instagram</li>
              <li className="hover:underline cursor-pointer">X (Twitter)</li>
            </ul>
          </div>
          <h2 className="absolute bottom-0 left-0 translate-y-1/3 sm:text-[192px] text-[80px] text-[#ff5941] font-calendas">
            fancy
          </h2>
        </div>
      </div>
    </div>
  )
}

export default Preview