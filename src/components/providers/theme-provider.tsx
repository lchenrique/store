"use client";

import { palettes } from "@/config/themes";
import { useStoreMutations } from "@/hooks/store/use-store";
import { usePaletteStore } from "@/store/use-palette-store";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { useEffect, useRef } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { updatePalette } = useStoreMutations();

  usePaletteStore();



  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
    >
      {children}
    </NextThemeProvider>
  );
}
