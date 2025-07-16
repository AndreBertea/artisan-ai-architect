// src/components/ui/ThemeToggle.tsx
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeId } from "@/theme/ThemeProvider";

export function ThemeToggle() {
  const { themeId, setThemeId } = useThemeId();

  // Switch clair/sombre tout en gardant la palette courante
  const nextId =
    themeId === 1 ? 2 // clair -> sombre
    : themeId === 2 ? 1 // sombre -> clair
    : themeId % 2 ? themeId + 1 : themeId - 1; // palette-X clair <-> palette-X sombre

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Basculer thème"
      onClick={() => setThemeId(nextId)}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Basculer thème</span>
    </Button>
  );
}