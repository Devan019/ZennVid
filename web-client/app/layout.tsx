import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VideoAI - AI-Powered Short Video Generator",
  description:
    "Create stunning AI-generated videos in seconds. Transform your ideas into captivating short videos with advanced artificial intelligence.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Toaster />
      <body className={inter.className}>{children}</body>
    </html>
  )
}
