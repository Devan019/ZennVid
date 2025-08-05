"use client"

import { Moon, Sun, Home, Video, LogOut, MenuIcon, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { GiLipstick } from "react-icons/gi";
import ModeToggle from "../mode-toggle";
import { useUser } from "@/context/UserProvider";

export function AppSidebar() {
  const pathname = usePathname();
  const { openMobile, setOpenMobile, isMobile } = useSidebar();
  const { logout } = useUser();


  const menuItems = [
    {
      href: "/",
      icon: Home,
      label: "Home",
      tooltip: "Home"
    },
    {
      href: "/dashboard/Prompt2Video",
      icon: Video,
      label: "Prompt2Video",
      tooltip: "Prompt To Video"
    },
    {
      href: "/SyncTalk",
      icon: GiLipstick,
      label: "SyncTalk",
      tooltip: "SyncTalk"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 }
    }
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="dark:bg-zinc-950 bg-white  shadow-lg dark:shadow-2xl transition-all duration-300"
    >
      {isMobile && (
        <button
          onClick={() => setOpenMobile(true)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
      <SidebarHeader className="flex items-center justify-center p-4 border-b border-gray-100 dark:border-gray-800">
        <motion.span
          // variants={logoVariants}
          initial="hidden"
          animate="visible"
          className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
        >
          ZeenvidAI
        </motion.span>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <SidebarMenu className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <motion.div
                    key={item.href}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <SidebarMenuItem>
                      <Link href={item.href} passHref >
                        <SidebarMenuButton
                          isActive={isActive}
                          tooltip={item.tooltip}
                          className={`
                            relative group w-full transition-all duration-200 ease-in-out
                            hover:bg-gray-100 dark:hover:bg-gray-800
                            ${isActive
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600 dark:border-blue-400'
                              : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                            }
                            rounded-lg mx-1 px-3 py-2
                          `}
                        >
                          <motion.div
                            whileHover={{ rotate: isActive ? 0 : 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Icon className={`
                              size-4 transition-colors duration-200
                              ${isActive
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                              }
                            `} />
                          </motion.div>
                          <span className={`
                            font-medium transition-colors duration-200
                            ${isActive
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100'
                            }
                          `}>
                            {item.label}
                          </span>

                          {/* Active indicator */}
                          <AnimatePresence>
                            {isActive && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute right-2 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"
                              />
                            )}
                          </AnimatePresence>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  </motion.div>
                );
              })}
            </SidebarMenu>
          </motion.div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-gray-100 dark:border-gray-800">
        <SidebarMenu className="space-y-2">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SidebarMenuItem>
              <div >
                <ModeToggle  />
              </div>
            </SidebarMenuItem>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SidebarMenuItem>
                <SidebarMenuButton
                onClick=  {logout}
                  tooltip="Logout"
                  className="
                    group w-full transition-all duration-200 ease-in-out
                    hover:bg-red-50 dark:hover:bg-red-900/20
                    text-gray-700 dark:text-gray-300
                    hover:text-red-600 dark:hover:text-red-400
                    rounded-lg mx-1 px-3 py-2
                  "
                >
                  <motion.div
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LogOut className="size-4 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200" />
                  </motion.div>
                  <span className="font-medium group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200">
                    Logout
                  </span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </motion.div>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}