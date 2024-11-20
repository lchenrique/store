"use client";

import { palettes } from "@/config/themes";
import { usePaletteStore } from "@/store/use-palette-store";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { useLayoutEffect } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
  initialPalette?: string ;
}

export function ThemeProvider({ children, initialPalette }: ThemeProviderProps) {
  const { updatePalette } = usePaletteStore();

  useLayoutEffect(() => {
    if (initialPalette) {
      const palette = palettes.find(p => p.name === initialPalette);
      if (palette) {
        console.log('Applying initial palette:', palette.name);
        updatePalette(palette);
      }
    }
  }, [initialPalette]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
