
import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Try to get theme from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    // If we have a saved theme, use it, otherwise default to "dark"
    return savedTheme || "dark";
  });

  // Update the document attributes when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove old classes
    root.classList.remove("light", "dark");
    
    // Add new class based on current theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches 
        ? "dark" 
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
