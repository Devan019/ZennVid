"use client"

import VideoConfigUI from '@/components/dashboard/Prompt2Video/videogen'
import { useThemeGradient } from '@/hooks/useBgColor'

import React from 'react'

const page = () => {
  // const { bgGradient } = useThemeGradient()
  return (
    <div className={` w-full h-screen`} >
      <VideoConfigUI />
      
    </div>
  )
}

export default page