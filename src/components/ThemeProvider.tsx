"use client";
import { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "A" | "B" | "C";

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (m: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "A",
  isDark: true,
  setMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("A");
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme-mode") as ThemeMode | null;
    if (saved) setMode(saved);
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    if (mode === "A") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDark(mql.matches);
      root.classList.toggle("dark", mql.matches);
      const handler = (e: MediaQueryListEvent) => {
        setIsDark(e.matches);
        root.classList.toggle("dark", e.matches);
      };
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    } else if (mode === "B") {
      setIsDark(false);
      root.classList.remove("dark");
    } else {
      setIsDark(true);
      root.classList.add("dark");
    }
    localStorage.setItem("theme-mode", mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, isDark, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
