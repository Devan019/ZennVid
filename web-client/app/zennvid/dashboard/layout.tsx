import { AppSidebar } from '@/components/dashboard/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { FRONTEND_ROUTES } from '@/constants/frontend_routes'
import { QueryClientProviderWrapper } from '@/context/queryProvider'
import { ThemeProvider } from 'next-themes'
import React from 'react'

const layout = ({ children }: {
  children: React.ReactNode
}) => {
  const menuItems = [
    {
      href: FRONTEND_ROUTES.MAGIC_VIDEO,
      icon: "magic",
      label: "Magic Video (20 credits)",
      tooltip: "Magic Video"
    },
    {
      href: FRONTEND_ROUTES.SYNCSTUDIO,
      icon: "lipstick",
      label: "SyncStudio (20 credits)",
      tooltip: "SyncStudio"
    },
    {
      href: FRONTEND_ROUTES.YOURVIDEO,
      icon: "videoOff",
      label: "Your Videos",
      tooltip: "Your Videos"
    },
    {
      href: FRONTEND_ROUTES.ANIME_MATCHER,
      icon: "sparkles",
      label: "Anime Matcher",
      tooltip: "Find your anime twin"
    }
  ];
  return (
    <div>
      <ThemeProvider>
        <QueryClientProviderWrapper>
          <SidebarProvider >
            <AppSidebar menuItems={menuItems} />
            {children}
          </SidebarProvider>
        </QueryClientProviderWrapper>
      </ThemeProvider>
    </div>
  )
}

export default layout