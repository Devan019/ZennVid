"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserProvider";
import { FRONTEND_ROUTES } from "@/constants/frontend_routes";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface NavbarProps {
  setMenuOpen: (val: boolean) => void;
}

interface URLS {
  url: string;
  label: string;
}

export const Navbar = ({ setMenuOpen }: NavbarProps) => {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useUser();

  const [isDarkSection, setIsDarkSection] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-theme]");

      let currentDark = false;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();

        if (rect.top <= 100 && rect.bottom >= 100) {
          currentDark =
            section.getAttribute("data-theme") === "dark";
        }
      });

      setIsDarkSection(currentDark);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const authUrls: URLS[] = [
    {
      url: FRONTEND_ROUTES.DASHBOARD,
      label: "Dashboard",
    },
    {
      url: FRONTEND_ROUTES.FEED,
      label: "Feed",
    },
    {
      url: FRONTEND_ROUTES.PRICING,
      label: "pricing"
    }
  ];

  const textColor = isDarkSection
    ? "text-white"
    : "text-black";

  const subTextColor = isDarkSection
    ? "text-white/70 hover:text-white"
    : "text-black/70 hover:text-black";

  const borderColor = isDarkSection
    ? "bg-white"
    : "bg-black";

  if (isLoading) {
    return (
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
            fixed
            top-0
            left-0
            z-50
            flex
            w-full
            items-center
            justify-between
            px-6
            py-8
            md:px-10
            transition-colors
            duration-500
          "
      >
        <div className="h-6 w-24 animate-pulse rounded bg-gray-300" />
        <div className="flex items-center gap-8">
          <div className="h-6 w-16 animate-pulse rounded bg-gray-300" />
        </div>
      </motion.nav>
    )
  }


  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        fixed
        top-0
        left-0
        z-50
        flex
        w-full
        items-center
        justify-between
        px-6
        py-8
        md:px-10
        transition-colors
        duration-500
      "
    >
      {/* LEFT */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push("/")}
        className={`
          cursor-pointer
          text-[1rem]
          font-semibold
          uppercase
          tracking-[0.2em]
          md:text-[1.2rem]
          transition-colors
          duration-500
          ${textColor}
        `}
      >
        ZENNVID
      </motion.div>

      {/* RIGHT */}
      <div className="flex items-center gap-8">
        {/* AUTH LINKS */}
        {isAuthenticated && (
          <div
            className="
              flex
              items-center
              gap-6
              md:flex
            "
          >
            {authUrls.map((item) => (
              <Link
                key={item.label}
                href={item.url}
                className={`
                  group
                  relative
                  overflow-hidden
                  text-[11px]
                  uppercase
                  tracking-[0.25em]
                  transition-all
                  duration-300
                  ${subTextColor}
                `}
              >
                {item.label}

                <span
                  className={`
                    absolute
                    bottom-0
                    left-0
                    h-px
                    w-0
                    transition-all
                    duration-500
                    group-hover:w-full
                    ${borderColor}
                  `}
                />
              </Link>
            ))}
          </div>
        )}

        {/* USER + CREDITS */}
        {isAuthenticated && user && (
          <motion.div
            whileHover={{
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.97,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className={`
      flex items-center gap-3 rounded-full border px-2 py-2 pr-4 backdrop-blur-xl
      transition-all duration-500
      ${isDarkSection
                ? "border-white/15 bg-white/5"
                : "border-black/10 bg-white/80"
              }
    `}
          >
            {/* AVATAR */}
            <Avatar
              className={`
        size-10
        cursor-pointer
        overflow-hidden
        border
        bg-white
        shadow-xl
        transition-colors
        duration-500
        ${isDarkSection
                  ? "border-white/20"
                  : "border-black/10"
                }
      `}
            >
              <AvatarImage
                draggable={false}
                src={user.profilePicture}
                className="object-cover"
              />

              <AvatarFallback
                className="
          bg-black
          text-white
          font-semibold
          uppercase
        "
              >
                {user.username?.[0] || "U"}
              </AvatarFallback>
            </Avatar>

            {/* CREDITS */}
            <div className="flex flex-col">
              <span
                className={`text-[10px] uppercase tracking-[0.18em] ${isDarkSection
                    ? "text-white/50"
                    : "text-black/40"
                  }`}
              >
                Credits
              </span>

              <div className="flex items-center gap-1.5">
                <Sparkles
                  className={`h-3.5 w-3.5 ${isDarkSection
                      ? "text-yellow-300"
                      : "text-amber-500"
                    }`}
                />

                <span
                  className={`text-sm font-semibold ${isDarkSection
                      ? "text-white"
                      : "text-black"
                    }`}
                >
                  {user.credits ?? 0}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* logout button */}
        {isAuthenticated && (
          <motion.button
            whileHover={{
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.96,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            onClick={logout}
            className={`
              flex
              md:flex
              items-center
              justify-center
              rounded-full
              px-6
              py-3
              text-[11px]
              font-medium
              uppercase
              tracking-[0.22em]
              transition-all
              duration-500
              ${isDarkSection
                ? "bg-white text-black hover:bg-white/90"
                : "bg-black text-white hover:bg-black/90"
              }
            `}
          >
            Logout
          </motion.button>
        )}

        {/* MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(true)}
          className={`
            group
            relative
            overflow-hidden
            text-sm
            uppercase
            tracking-[0.2em]
            transition-colors
            duration-500
            ${textColor}
          `}
        >
          Menu

          <span
            className={`
              absolute
              bottom-0
              left-0
              h-[2px]
              w-0
              transition-all
              duration-500
              group-hover:w-full
              ${borderColor}
            `}
          />
        </button>

        {/* pricing link */}
        {!isAuthenticated && (
          <div
            className="
              flex
              items-center
              gap-6
              md:flex
            "
          >
            <Link
              href={FRONTEND_ROUTES.PRICING}
              className={`
                  group
                  relative
                  overflow-hidden
                  text-[11px]
                  uppercase
                  tracking-[0.25em]
                  transition-all
                  duration-300
                  ${subTextColor}
                `}
            >
              pricing
              <span
                className={`
                    absolute
                    bottom-0
                    left-0
                    h-px
                    w-0
                    transition-all
                    duration-500
                    group-hover:w-full
                    ${borderColor}
                  `}
              />
            </Link>

          </div>
        )}

        {/* GET STARTED BUTTON */}
        {!isAuthenticated && <motion.button
          whileHover={{
            scale: 1.04,
          }}
          whileTap={{
            scale: 0.96,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          onClick={() => router.push("/auth")}
          className={`
    flex
    md:flex
    items-center
    justify-center
    rounded-full
    px-6
    py-3
    text-[11px]
    font-medium
    uppercase
    tracking-[0.22em]
    transition-all
    duration-500
    ${isDarkSection
              ? "bg-white text-black hover:bg-white/90"
              : "bg-black text-white hover:bg-black/90"
            }
  `}
        >
          Get Started
        </motion.button>}


      </div>
    </motion.nav>
  );
};