// src/theme/theme-utils.ts

// Palettes de couleurs hexadécimales (6 palettes)
export const PALETTES = [
  ["#3F756C", "#F6EECD", "#E1C789", "#C6743E"],
  ["#283D22", "#B4B66F", "#F1F0CC", "#93B5AF"],
  ["#83BBC1", "#E7DDC7", "#B92C0D", "#1F2C24"],
  ["#1B4D3E", "#EA362A", "#F1F0CC", "#C6C596"],
  ["#9CADB3", "#CFDADA", "#EBF2F2", "#BBD5D8"],
  ["#232E3F", "#CF9421", "#EEECE3", "#DAD5C6"]
] as const;

// Utilitaire pour convertir hex en HSL string
export function hexToHSL(hex: string): string {
  hex = hex.replace('#', '');
  let r = parseInt(hex.substring(0,2), 16) / 255;
  let g = parseInt(hex.substring(2,4), 16) / 255;
  let b = parseInt(hex.substring(4,6), 16) / 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if(max === min){ h = s = 0; }
  else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  h = Math.round(h*360); s = Math.round(s*100); l = Math.round(l*100);
  return `${h} ${s}% ${l}%`;
}

/* -------- applyThemeById ------------ */
export function applyThemeById(id: number) {
  const root = document.documentElement;
  root.classList.remove("dark");
  for (let i = 0; i < PALETTES.length; i++) {
    root.classList.remove(`palette-${i}`);
  }
  if (id === 2) root.classList.add("dark");
  else if (id >= 3) root.classList.add(`palette-${id - 3}`);
}

/* -------- applyPalette -------------- */
export function applyPalette(id: number) {
  // id est le themeId (>=3)
  const idx = id - 3;
  const palette = PALETTES[idx];
  if (!palette) return;

  const [c0, c1, c2, c3] = palette.map(hexToHSL);

  const css = {
    "--background": c1,
    "--foreground": c0,
    "--card": c1,
    "--card-foreground": c0,
    "--popover": c1,
    "--popover-foreground": c0,
    "--primary": c0,
    "--primary-foreground": c1,
    "--secondary": c2,
    "--secondary-foreground": c0,
    "--accent": c2,
    "--accent-foreground": c0,
    "--muted": c2,
    "--muted-foreground": c0,
    "--destructive": c3,
    "--destructive-foreground": c1,
    "--border": c0,
    "--input": c0,
    "--ring": c3,
    "--sidebar-background": c0,
    "--sidebar-foreground": c1,
  };
  Object.entries(css).forEach(([k, v]) =>
    document.documentElement.style.setProperty(k, v)
  );
} 