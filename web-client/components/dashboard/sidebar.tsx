"use client";

import {
  Home,
  LogOut,
  Menu,
  VideoOff,
  Cog,
  Book,
  Languages,
  Speaker,
  UserPenIcon,
  UserCog,
  Videotape,
  Sparkles,
  X,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import { useEffect, useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

import { GiLipstick } from "react-icons/gi";

import { FaMagic } from "react-icons/fa";

import {
  TbApi,
  TbApiApp,
  TbPhoto,
  TbTransactionBitcoin,
} from "react-icons/tb";

import ModeToggle from "../common/mode-toggle";

import { useUser } from "@/context/UserProvider";
import { useRouter } from "next/navigation";
import { FRONTEND_ROUTES } from "@/constants/frontend_routes";

const iconMap: Record<string, React.ElementType> = {
  home: Home,
  magic: FaMagic,
  lipstick: GiLipstick,
  videoOff: VideoOff,
  dashboard: Home,
  createApp: Cog,
  caption: Book,
  translate: Languages,
  image: TbPhoto,
  textAudio: Speaker,
  UserPenIcon: UserPenIcon,
  TbTransactionBitcoin: TbTransactionBitcoin,
  TbApi: TbApi,
  UserCog: UserCog,
  TbApiApp: TbApiApp,
  Videotape: Videotape,
  sparkles: Sparkles,
};

export function AppSidebar({
  menuItems,
}: {
  menuItems: {
    href: string;
    icon: string;
    label: string;
    tooltip: string;
  }[];
}) {
  const { setOpenMobile, isMobile } =
    useSidebar();

  const { logout, user } = useUser();

  const [activeHash, setActiveHash] =
    useState<string>("magic-video");

  const router = useRouter();

  useEffect(() => {
    const syncActiveHash = () => {
      const currentHash =
        window.location.hash.replace("#", "");

      setActiveHash(
        currentHash || "magic-video"
      );
    };

    syncActiveHash();

    window.addEventListener(
      "hashchange",
      syncActiveHash
    );

    return () =>
      window.removeEventListener(
        "hashchange",
        syncActiveHash
      );
  }, []);

  const containerVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },

    visible: {
      opacity: 1,
      x: 0,

      transition: {
        duration: 0.4,
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -10,
    },

    visible: {
      opacity: 1,
      x: 0,

      transition: {
        duration: 0.25,
      },
    },
  };

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      {isMobile && (
        <button
          onClick={() => setOpenMobile(true)}
          className="
            fixed
            left-4
            top-4
            z-[120]
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-2xl
            border
            border-white/10
            bg-[#0D0D0D]
            text-white
            shadow-xl
            backdrop-blur-xl
            lg:hidden
          "
        >
          <Menu className="h-5 w-5" />
        </button>
      )}



      <Sidebar
        variant="sidebar"
        collapsible="offcanvas"
        className="
    z-[60]
    border-r
    border-white/[0.06]
    bg-[#0D0D0D]
    text-white
    3xl:w-96
    w-64
  "
      >
        {/* HEADER */}
        <SidebarHeader
          className="
    relative
    border-b
    border-white/[0.06]
    px-4
    py-5
  "
        >
          <motion.button
            type="button"
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            onClick={() => {
              if (isMobile) {
                setOpenMobile(false);
              }

              router.push(
                FRONTEND_ROUTES.HOME
              );
            }}
            className="
      flex
      w-full
      cursor-pointer
      items-center
      justify-center
    "
          >
            <span
              className="
        text-sm
        font-semibold
        uppercase
        tracking-[0.3em]
        text-white
        lg:text-base
      "
            >
              Zennvid
            </span>
          </motion.button>

          {/* CLOSE BUTTON */}
          {isMobile && (
            <button
              onClick={() =>
                setOpenMobile(false)
              }
              className="
        absolute
        right-4
        top-4
        z-[120]
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-2xl
        border
        border-white/10
        bg-[#0D0D0D]
        text-white
        shadow-xl
        backdrop-blur-xl
        xl:hidden
      "
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </SidebarHeader>



        {/* CONTENT */}
        <SidebarContent
          className="
            overflow-x-hidden
            px-2
            py-4
          "
        >
          <SidebarGroup>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <SidebarMenu className="space-y-2">
                {menuItems.map(
                  (item, index) => {
                    const Icon =
                      iconMap[item.icon];

                    const itemHash =
                      item.href.split(
                        "#"
                      )[1] ?? "";

                    const isActive =
                      activeHash ===
                      itemHash;

                    const handleNavigation =
                      () => {
                        window.location.hash =
                          itemHash;

                        if (isMobile) {
                          setOpenMobile(
                            false
                          );
                        }
                      };

                    return (
                      <motion.div
                        key={index}
                        variants={
                          itemVariants
                        }
                        whileHover={{
                          x: 3,
                        }}
                        whileTap={{
                          scale: 0.98,
                        }}
                      >
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            type="button"
                            size="lg"
                            onClick={
                              handleNavigation
                            }
                            tooltip={
                              item.tooltip
                            }
                            isActive={
                              isActive
                            }
                            className={`
                              group
                              relative
                              w-full
                              overflow-hidden
                              rounded-2xl
                              border
                              px-3
                              py-6
                              transition-all
                              duration-300

                              ${isActive
                                ? `
                                    border-white/10
                                    bg-white/[0.08]
                                    text-white
                                  `
                                : `
                                    border-transparent
                                    text-white/50
                                    hover:border-white/[0.06]
                                    hover:bg-white/[0.04]
                                    hover:text-white
                                  `
                              }
                            `}
                          >
                            {/* ICON */}
                            <motion.div
                              whileHover={{
                                rotate:
                                  isActive
                                    ? 0
                                    : 5,
                              }}
                            >
                              <Icon
                                className={`
                                  size-[18px]
                                  shrink-0
                                  transition-all
                                  duration-300

                                  ${isActive
                                    ? "text-white"
                                    : "text-white/40 group-hover:text-white"
                                  }
                                `}
                              />
                            </motion.div>

                            {/* LABEL */}
                            <span
                              className={`
                                truncate
                                text-[13px]
                                font-medium
                                tracking-[0.03em]
                                transition-all
                                duration-300

                                ${isActive
                                  ? "text-white"
                                  : "text-white/50 group-hover:text-white"
                                }
                              `}
                            >
                              {item.label}
                            </span>

                            {/* ACTIVE DOT */}
                            <AnimatePresence>
                              {isActive && (
                                <motion.div
                                  initial={{
                                    scale: 0,
                                    opacity: 0,
                                  }}
                                  animate={{
                                    scale: 1,
                                    opacity: 1,
                                  }}
                                  exit={{
                                    scale: 0,
                                    opacity: 0,
                                  }}
                                  className="
                                    absolute
                                    right-3
                                    h-2
                                    w-2
                                    rounded-full
                                    bg-white
                                  "
                                />
                              )}
                            </AnimatePresence>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </motion.div>
                    );
                  }
                )}

                {/* CREDITS */}
                {user &&
                  user.role ===
                  "user" && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 0.5,
                      }}
                      className="
                        mt-5
                        flex
                        items-center
                        gap-3
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.04]
                        px-4
                        py-4
                      "
                    >
                      <motion.div
                        className="
                          h-2
                          w-2
                          rounded-full
                          bg-green-400
                        "
                        animate={{
                          scale: [
                            1,
                            1.3,
                            1,
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat:
                            Infinity,
                        }}
                      />

                      <span
                        className="
                          text-sm
                          font-medium
                          text-white/80
                        "
                      >
                        {
                          user.credits
                        }{" "}
                        Credits
                      </span>
                    </motion.div>
                  )}
              </SidebarMenu>
            </motion.div>
          </SidebarGroup>
        </SidebarContent>

        {/* FOOTER */}
        <SidebarFooter
          className="
            border-t
            border-white/[0.06]
            p-3
          "
        >
          <SidebarMenu className="space-y-2">
            {/* THEME */}
            <SidebarMenuItem>
              <div
                className="
                  rounded-2xl
                  border
                  border-white/[0.06]
                  bg-white/[0.03]
                  p-2
                "
              >
                <ModeToggle />
              </div>
            </SidebarMenuItem>

            {/* LOGOUT */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={(e) => {
                  e.stopPropagation();
                  logout();
                }}
                tooltip="Logout"
                className="
                  group
                  rounded-2xl
                  border
                  border-transparent
                  px-4
                  py-6
                  text-white/50
                  transition-all
                  duration-300

                  hover:border-red-500/10
                  hover:bg-red-500/10
                  hover:text-red-400
                "
              >
                <LogOut
                  className="
                    size-[18px]
                    transition-colors
                    duration-300
                    group-hover:text-red-400
                  "
                />

                <span
                  className="
                    text-sm
                    font-medium
                  "
                >
                  Logout
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}