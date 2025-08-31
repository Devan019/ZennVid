"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const RedocStandalone = dynamic(() => import("redoc").then((mod) => mod.RedocStandalone), {
  ssr: false,
  loading: () => <DocsSkeleton />,
})

function DocsSkeleton() {
  return (
    <div className="flex h-full">
      <div className="w-80 border-r bg-card p-4 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      </div>
      <div className="flex-1 p-6 space-y-6">
        <Skeleton className="h-12 w-1/2" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ApiDocs() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // if (typeof window !== "undefined" && !window.Prism) {
    //   window.Prism = { manual: true }
    // }
  }, [])

  if (!mounted) {
    return <DocsSkeleton />
  }

  const isDark = resolvedTheme === "dark"

  const redocOptions = {
    theme: {
      colors: {
        primary: {
          main: isDark ? "#60a5fa" : "#3b82f6",
        },
        text: {
          primary: isDark ? "#f9fafb" : "#111827",
          secondary: isDark ? "#d1d5db" : "#6b7280",
        },
        http: {
          get: "#10b981",
          post: "#3b82f6",
          put: "#f59e0b",
          delete: "#ef4444",
          patch: "#8b5cf6",
        },
        border: {
          dark: isDark ? "#374151" : "#e5e7eb",
          light: isDark ? "#4b5563" : "#f3f4f6",
        },
      },
      typography: {
        fontSize: "14px",
        lineHeight: "1.6",
        fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
        headings: {
          fontFamily: "var(--font-sans), sans-serif",
          fontWeight: "600",
        },
        code: {
          fontFamily: "var(--font-mono), Menlo, Monaco, 'Courier New', monospace",
          fontSize: "13px",
          backgroundColor: isDark ? "#1f2937" : "#f9fafb",
          color: isDark ? "#e5e7eb" : "#374151",
        },
      },
      sidebar: {
        backgroundColor: isDark ? "#111827" : "#ffffff",
        textColor: isDark ? "#f9fafb" : "#111827",
        activeTextColor: isDark ? "#60a5fa" : "#3b82f6",
        groupItems: {
          activeBackgroundColor: isDark ? "#1f2937" : "#f0f9ff",
          activeTextColor: isDark ? "#60a5fa" : "#3b82f6",
        },
        level1Items: {
          activeBackgroundColor: isDark ? "#1f2937" : "#f0f9ff",
          activeTextColor: isDark ? "#60a5fa" : "#3b82f6",
        },
        arrow: {
          color: isDark ? "#9ca3af" : "#6b7280",
        },
        width: "300px",
      },
      rightPanel: {
        backgroundColor: isDark ? "#0f172a" : "#f8fafc",
        textColor: isDark ? "#e2e8f0" : "#334155",
      },
      codeBlock: {
        backgroundColor: isDark ? "#0f172a" : "#1e293b",
        tokens: {
          string: { color: "#22d3ee" },
          number: { color: "#fb7185" },
          boolean: { color: "#a78bfa" },
          keyword: { color: "#60a5fa" },
          function: { color: "#34d399" },
          comment: { color: "#6b7280" },
        },
      },
    },
    scrollYOffset: 60,
    hideDownloadButton: false,
    expandResponses: "200,201",
    jsonSampleExpandLevel: 2,
    hideSchemaPattern: true,
    showExtensions: true,
    sortPropsAlphabetically: true,
    payloadSampleIdx: 0,
    expandSingleSchemaField: true,
    menuToggle: true,
    nativeScrollbars: false,
    pathInMiddlePanel: true,
    requiredPropsFirst: true,
    hideRequestPayloadSample: false,
    disableSearch: false,
    hideLoading: false,
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] w-full">
      <RedocStandalone specUrl="/openapi.json" options={redocOptions} />
    </div>
  )
}
