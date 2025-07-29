"use client"
import { useTheme } from "next-themes";

export function useThemeGradient() {
  const { theme } = useTheme();
  
  // Default light mode colors
  let fromColor = "from-purple-100/80";
  let toColor = "to-pink-100/80";
  
  if (theme === "dark") {
    fromColor = "dark:from-purple-900/50";
    toColor = "dark:to-pink-900/50";
  }
  
  return {
    fromColor,
    toColor,
    bgGradient: `bg-gradient-to-r ${fromColor} ${toColor}`,
  };
}