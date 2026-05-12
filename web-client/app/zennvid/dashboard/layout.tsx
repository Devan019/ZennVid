import { AppSidebar } from "@/components/dashboard/sidebar";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { FRONTEND_ROUTES } from "@/constants/frontend_routes";

import { QueryClientProviderWrapper } from "@/context/queryProvider";

import { ThemeProvider } from "next-themes";

import React from "react";

const layout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const menuItems = [
    {
      href: FRONTEND_ROUTES.MAGIC_VIDEO,
      icon: "magic",
      label: "Magic Video",
      tooltip:
        "Create cinematic AI videos",
    },

    {
      href: FRONTEND_ROUTES.SYNCSTUDIO,
      icon: "Videotape",
      label: "Sync Studio",
      tooltip:
        "Sync lips & cinematic motion",
    },

    {
      href:
        FRONTEND_ROUTES.ANIME_MATCHER,
      icon: "sparkles",
      label: "Anime Twin",
      tooltip:
        "Find your anime twin",
    },

    {
      href: FRONTEND_ROUTES.YOURVIDEO,
      icon: "videoOff",
      label: "Your Videos",
      tooltip:
        "View generated videos",
    },
  ];

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
    >
      <QueryClientProviderWrapper>
        <SidebarProvider>
          {/* ROOT */}
          <div
            className="
              grid
              min-h-screen
              w-full
              overflow-hidden
              bg-[#F4F1EA]

              lg:grid-cols-[340px_1fr]
              3xl:grid-cols-[420px_1fr]
            "
          >
            {/* SIDEBAR */}
            <AppSidebar
              menuItems={menuItems}
            />

            {/* CONTENT */}
            <SidebarInset
              className="
                relative
                w-full
                overflow-x-hidden
                bg-[#F4F1EA]
              "
            >
              {/* BACKGROUND */}
              <div
                className="
                  pointer-events-none
                  fixed
                  inset-0
                  z-0
                  overflow-hidden
                "
              >
                {/* GLOW */}
                <div
                  className="
                    absolute
                    left-1/2
                    top-[10%]
                    h-[500px]
                    w-[500px]
                    -translate-x-1/2
                    rounded-full
                    bg-black/[0.03]
                    blur-[120px]
                  "
                />

                {/* GRID */}
                <div className="absolute inset-0 opacity-[0.04]">
                  <div className="absolute left-1/3 top-0 h-full w-px bg-black" />

                  <div className="absolute left-2/3 top-0 h-full w-px bg-black" />

                  <div className="absolute left-0 top-1/3 h-px w-full bg-black" />

                  <div className="absolute left-0 top-2/3 h-px w-full bg-black" />
                </div>
              </div>

              {/* PAGE */}
              <main
                className="
                  relative
                  z-10
                  min-h-screen
                  px-4
                  py-20
                  sm:px-6
                  lg:px-10
                  xl:px-14
                  3xl:px-16
                "
              >
                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </QueryClientProviderWrapper>
    </ThemeProvider>
  );
};

export default layout;