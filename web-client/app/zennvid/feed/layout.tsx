
import { AppSidebar } from '@/components/dashboard/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { FRONTEND_ROUTES } from '@/constants/frontend_routes'
import { QueryClientProviderWrapper } from '@/context/queryProvider'
import React from 'react'

const layout = ({ children }: {
  children: React.ReactNode
}) => {
  const items = [
    { tooltip: "Home", label: "Home", href: FRONTEND_ROUTES.HOME, icon: "home" },
  ]

  return (
    <div>
      <ThemeProvider>
        <QueryClientProviderWrapper>
            <SidebarProvider >
              <AppSidebar menuItems={items} />
              <div className="relative">{children}</div>
              <div className="fixed top-1/2 left-1/4 w-64 h-64 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl -z-10" />
              <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-pink-200/30 dark:bg-pink-500/10 rounded-full blur-3xl -z-10" />
            </SidebarProvider>
        </QueryClientProviderWrapper>
      </ThemeProvider>
    </div>
  )
}

export default layout