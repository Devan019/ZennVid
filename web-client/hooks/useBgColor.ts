"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function useThemeGradient() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default colors
  let fromColor = "from-purple-100/80";
  let toColor = "to-pink-100/80";

  if (mounted) {
    const currentTheme = theme;;

    if (currentTheme === "dark") {
      fromColor = "from-black/80";
      toColor = "to-black/50";
    }
  }

  return {
    fromColor,
    toColor,
    bgGradient: `bg-gradient-to-r ${fromColor} ${toColor}`,
  };
}
