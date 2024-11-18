"use client";
import { useEffect, useState } from "react";
import { ColorPalette, palettes } from "@/config/themes";
import { useLoading } from "@/components/providers/loading-provider";

const COOKIE_KEY = "store-palette";

// Função para aplicar o tema movida para fora do componente para reutilização
const aplicarTema = (tema: ColorPalette) => {
  const root = document.querySelector("html");
  console.log('Applying theme:', tema.name);

  // Define variáveis para :root (tema light)
  const lightStyles = document.createElement('style');
  lightStyles.textContent = `:root {\n${Object.entries(tema.light)
    .map(([key, value]) => `  --${camelToKebab(key)}: ${value};`)
    .join('\n')}\n}`;
  document.head.appendChild(lightStyles);

  // Define variáveis para o tema escuro no seletor .dark
  const darkStyles = document.createElement('style');
  darkStyles.textContent = `.dark {\n${Object.entries(tema.dark)
    .map(([key, value]) => `  --${camelToKebab(key)}: ${value};`)
    .join('\n')}\n}`;
  document.head.appendChild(darkStyles);
};

const camelToKebab = (str: string) => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

// Inicializa o tema do cookie imediatamente
const initializeTheme = () => {
  if (typeof window === 'undefined') return null;
  
  const storedPalette = document.cookie.split('; ').find(row => row.startsWith(COOKIE_KEY))?.split('=')[1];
  if (storedPalette) {
    const palette = palettes.find(p => p.name === storedPalette);
    if (palette) {
      aplicarTema(palette);
      return palette;
    }
  }
  return null;
};

// Aplica o tema inicial
const initialPalette = initializeTheme();
console.log('Initial palette:', initialPalette);

export function usePalette() {
  const [currentPalette, setCurrentPalette] = useState<ColorPalette | null>(initialPalette);
  const { stopLoading } = useLoading();

  // Para quando o tema inicial for carregado
  useEffect(() => {
    const timer = setTimeout(() => {
      stopLoading();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Função para atualizar a paleta
  const updatePalette = (palette: ColorPalette) => {
    setCurrentPalette(palette);
    // Define o cookie com expiração de 1 ano
    document.cookie = `${COOKIE_KEY}=${palette.name}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=strict`;
    aplicarTema(palette);
  };

  return {
    currentPalette,
    updatePalette,
  };
}
