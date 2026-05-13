

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { FRONTEND_ROUTES } from "@/constants/frontend_routes";
import { QueryClientProviderWrapper } from "@/context/queryProvider";
import React from "react";
import { AppSidebar } from "../dashboard/components/sidebar";

const layout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const items = [
    {
      tooltip: "Dashboard",
      label: "API Dashboard",
      href: FRONTEND_ROUTES.OPENAPI,
      icon: "dashboard",
    },

    {
      tooltip: "Apps",
      label: "Create App",
      href: FRONTEND_ROUTES.APPS,
      icon: "createApp",
    },

    {
      tooltip: "Caption",
      label: "Caption Generator",
      href: FRONTEND_ROUTES.CAPTION,
      icon: "caption",
    },

    {
      tooltip: "Translator",
      label: "Text Translator",
      href: FRONTEND_ROUTES.TRANSLATE,
      icon: "translate",
    },

    {
      tooltip: "Audio",
      label: "Text to Audio",
      href: FRONTEND_ROUTES.TEXT_AUDIO,
      icon: "textAudio",
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
            <AppSidebar menuItems={items} />

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



                {/* GRID */}
                <div className="absolute inset-0 opacity-[0.04] ">
                  <div className="absolute left-1/3 top-0 h-full w-px bg-black " />

                  <div className="absolute left-2/3 top-0 h-full w-px bg-black " />

                  <div className="absolute left-0 top-1/3 h-px w-full bg-black " />

                  <div className="absolute left-0 top-2/3 h-px w-full bg-black " />
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