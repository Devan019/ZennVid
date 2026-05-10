"use client"

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import MagicVideo from '../../../components/dashboard/magic-video/magic-video'
import SyncStudio from '../../../components/dashboard/syncstudio/syncstudio'
import AnimeMatcher from '../../../components/dashboard/anime-matcher/anime-matcher'
import VideoGallery from '../../../components/dashboard/your-videos/gallery'

type DashboardTab = 'magic-video' | 'syncstudio' | 'your-videos' | 'anime-matcher'

const tabOrder: DashboardTab[] = ['magic-video', 'syncstudio', 'your-videos', 'anime-matcher']

const normalizeHash = (hash: string) => hash.replace(/^#/, '')

const isDashboardTab = (value: string): value is DashboardTab => tabOrder.includes(value as DashboardTab)

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('magic-video')

  useEffect(() => {
    const syncTabFromHash = () => {
      const hashValue = normalizeHash(window.location.hash)
      setActiveTab(isDashboardTab(hashValue) ? hashValue : 'magic-video')
    }

    syncTabFromHash()
    window.addEventListener('hashchange', syncTabFromHash)

    return () => window.removeEventListener('hashchange', syncTabFromHash)
  }, [])

  useEffect(() => {
    return () => {
      // nothing to cleanup here for SSE
    }
  }, [])

  const showVideoGallery = () => {
    window.location.hash = 'your-videos'
    setActiveTab('your-videos')
  }

  const startVideoMonitor = () => {
    toast('Generating a video')
    showVideoGallery()
  }

  const renderedTab = (() => {
    switch (activeTab) {
      case 'magic-video':
        return <MagicVideo onGenerate={startVideoMonitor} />
      case 'syncstudio':
        return <SyncStudio onGenerate={startVideoMonitor} />
      case 'your-videos':
        return <VideoGallery />
      case 'anime-matcher':
        return <AnimeMatcher />
      default:
        return <MagicVideo onGenerate={startVideoMonitor} />
    }
  })()

  return <>{renderedTab}</>
}