"use client"

import type React from "react"
import { OpenSidebar } from "./sidebar"
import ThemeToggleButton from "../ui/theme-toggle-button"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <h1 className="text-base font-semibold text-balance">Zennvid Open APIs</h1>
          {/* <ThemeToggleButton /> */}
        </div>
      </header>
      <div className="flex-1">
        <div className="mx-auto max-w-6xl flex">
          <OpenSidebar />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
