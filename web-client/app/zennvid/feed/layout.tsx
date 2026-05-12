import { ThemeProvider } from "@/components/ui/theme-provider";

import { QueryClientProviderWrapper } from "@/context/queryProvider";

import React from "react";

const layout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
    >
      <QueryClientProviderWrapper>
        <div
          className="
            min-h-screen
            overflow-hidden
            bg-[#F4F1EA]
            text-black
          "
        >
          {/* GLOBAL BG */}
          <div
            className="
              pointer-events-none
              fixed
              inset-0
              overflow-hidden
            "
          >
            {/* GLOW */}
            <div
              className="
                absolute
                left-[10%]
                top-[10%]
                h-[450px]
                w-[450px]
                rounded-full
                bg-black/[0.04]
                blur-[120px]
              "
            />

            <div
              className="
                absolute
                bottom-[0%]
                right-[10%]
                h-[450px]
                w-[450px]
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

          <main className="relative z-10">
            {children}
          </main>
        </div>
      </QueryClientProviderWrapper>
    </ThemeProvider>
  );
};

export default layout;