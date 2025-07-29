import { AppSidebar } from '@/components/dashboard/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ThemeProvider } from 'next-themes'
import React from 'react'

const layout = ({ children }: {
  children: React.ReactNode
}) => {
  return (
    <div>
      <ThemeProvider>
        <SidebarProvider >
          <AppSidebar />
          {children}
        </SidebarProvider>
      </ThemeProvider>
    </div>
  )
}

export default layout