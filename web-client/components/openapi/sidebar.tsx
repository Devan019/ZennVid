"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { FRONTEND_ROUTES } from "@/constants/frontend_routes"
import ModeToggle from "../mode-toggle"
import { useUser } from "@/context/UserProvider"
import { LogOut } from "lucide-react"

const items = [
  { href: FRONTEND_ROUTES.APPS, label: "Create App" },
  { href: FRONTEND_ROUTES.CAPTION, label: "Caption" },
  { href: FRONTEND_ROUTES.TRANSLATE, label: "Translate" },
  { href: FRONTEND_ROUTES.IMAGE, label: "Image" },
  { href: FRONTEND_ROUTES.TEXT_AUDIO, label: "Text → Audio" },
]

export function OpenSidebar() {
  const pathname = usePathname()
  const { logout } = useUser();
  return (
    <aside className="w-full md:w-56 border-r">
      <nav className="p-4 flex md:flex-col gap-2 overflow-x-auto">
        {items.map((it) => {
          const active = pathname === it.href
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-pill"
                  className="absolute inset-0 bg-primary/10 rounded-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative">{it.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>

  )
}
