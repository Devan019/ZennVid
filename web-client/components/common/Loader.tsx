"use client"
import React from "react"

interface LoaderProps {
  size?: number
  className?: string
}

export default function Loader({ size = 24, className = "" }: LoaderProps) {
  const s = size
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="block"
        width={s}
        height={s}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle cx="50" cy="50" r="32" strokeWidth="8" stroke="#3b82f6" strokeDasharray="50.26548245743669 50.26548245743669" fill="none" strokeLinecap="round">
          <animateTransform
            attributeName="transform"
            type="rotate"
            repeatCount="indefinite"
            dur="1s"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
          />
        </circle>
      </svg>
    </div>
  )
}
