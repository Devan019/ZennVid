import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryClientProviderWrapper } from "@/context/queryProvider";
import { Toaster } from "sonner";
import { UserProvider } from "@/context/UserProvider";
import NextTopLoader from "nextjs-toploader";
// @ts-ignore
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zennvid",
  description: "Zennvid - a AI video generation platform, share your ideas with the world in a video format.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
          color="#6b7280"
          height={2.5}
          showSpinner={false}
        />
          <QueryClientProviderWrapper>
            <UserProvider>
              {children}
            </UserProvider>
          </QueryClientProviderWrapper>
          <Toaster position="top-center" />
      </body>
    </html >
  );
}
