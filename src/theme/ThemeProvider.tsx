import React, { createContext, useContext, useLayoutEffect, useState } from "react";
import { PALETTES, applyThemeById, applyPalette } from "./theme-utils";

const DEFAULT = { id: 1 };
const STORAGE_KEY = "themeId";

const ThemeCtx = createContext<{
  themeId: number;
  setThemeId: (n: number) => void;
}>({ themeId: DEFAULT.id, setThemeId: () => {} });

export const useThemeId = () => useContext(ThemeCtx);

function flashLoading() {
  if (typeof document === "undefined") return;
  document.body.classList.add("theme-changing");
  setTimeout(() => document.body.classList.remove("theme-changing"), 1000);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, _setThemeId] = useState(() => {
    if (typeof window === "undefined") return DEFAULT.id;
    const raw = parseInt(localStorage.getItem(STORAGE_KEY) || `${DEFAULT.id}`, 10);
    return isNaN(raw) ? DEFAULT.id : raw;
  });

  const setThemeId = (id: number) => {
    flashLoading();
    _setThemeId(id);
    localStorage.setItem(STORAGE_KEY, id.toString());
  };

  useLayoutEffect(() => {
    applyThemeById(themeId);
    if (themeId >= 3) {
      applyPalette(themeId);
    }
  }, [themeId]);

  return (
    <ThemeCtx.Provider value={{ themeId, setThemeId }}>
      {children}
    </ThemeCtx.Provider>
  );
} 