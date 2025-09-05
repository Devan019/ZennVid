import { AppSidebar } from '@/components/dashboard/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { FRONTEND_ROUTES } from '@/constants/frontend_routes'
import { QueryClientProviderWrapper } from '@/context/queryProvider'
import { UserProvider } from '@/context/UserProvider'
import { Home, VideoOff } from 'lucide-react'
import { ThemeProvider } from 'next-themes'
import React from 'react'
import { FaMagic } from 'react-icons/fa'
import { GiLipstick } from 'react-icons/gi'

const layout = ({ children }: {
  children: React.ReactNode
}) => {
  const menuItems = [
    {
      href: FRONTEND_ROUTES.HOME,
      icon: "home",
      label: "Home",
      tooltip: "Home"
    },
    {
      href: FRONTEND_ROUTES.MAGIC_VIDEO,
      icon: "magic",
      label: "Magic Video",
      tooltip: "Magic Video"
    },
    {
      href: FRONTEND_ROUTES.SADTALKER,
      icon: "lipstick",
      label: "SadTalker",
      tooltip: "SadTalker"
    },
    {
      href: FRONTEND_ROUTES.YOURVIDEO,
      icon: "videoOff",
      label: "Your Videos",
      tooltip: "Your Videos"
    }
  ];
  return (
    <div>
      <ThemeProvider>
        <QueryClientProviderWrapper>
          <UserProvider>
            <SidebarProvider >
              <AppSidebar menuItems={menuItems} />
              {children}
              <div className="fixed top-1/2 left-1/4 w-64 h-64 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl -z-10" />
              <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-pink-200/30 dark:bg-pink-500/10 rounded-full blur-3xl -z-10" />
            </SidebarProvider>
          </UserProvider>
        </QueryClientProviderWrapper>
      </ThemeProvider>
    </div>
  )
}

export default layout