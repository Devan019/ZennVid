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
      href: FRONTEND_ROUTES.TRANSCATION_STATS,
      icon: "TbTransactionBitcoin",
      label: "Transcation Stats",
      tooltip: "Transcation Stats"
    },
    {
      href: FRONTEND_ROUTES.USER_STATS,
      icon: "UserPenIcon",
      label: "User Stats",
      tooltip: "User Stats"
    },
    {
      href: FRONTEND_ROUTES.DEVELOPER_STATS,
      icon: "TbApiApp",
      label: "Developer Stats",
      tooltip: "Developer Stats"
    },
    {
      href: FRONTEND_ROUTES.VIDEO_STATS,
      icon: "Videotape",
      label: "Video Stats",
      tooltip: "Video Stats"
    },
    {
      href: FRONTEND_ROUTES.USER_ACCOUNTS,
      icon: "UserCog",
      label: "User Accounts",
      tooltip: "User Accounts"
    }
  ];
  return (
    <div>
      <ThemeProvider>
        <QueryClientProviderWrapper>
            <SidebarProvider >
              <AppSidebar menuItems={menuItems} />
              {children}
              <div className="fixed top-1/2 left-1/4 w-64 h-64 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl -z-10" />
              <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-pink-200/30 dark:bg-pink-500/10 rounded-full blur-3xl -z-10" />
            </SidebarProvider>
        </QueryClientProviderWrapper>
      </ThemeProvider>
    </div>
  )
}

export default layout