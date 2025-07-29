"use client"
import { useThemeGradient } from '@/hooks/useBgColor'
import React from 'react'

const page = () => {
  const { bgGradient } = useThemeGradient()
  return (
    <div className={`${bgGradient} w-full h-screen`} >

    </div>
  )
}

export default page