import { create } from 'zustand'
import { ColorPalette, palettes } from '@/config/themes'
import { useLoadingStore } from './use-loading-store'

const COOKIE_KEY = "store-palette"

interface PaletteState {
  currentPalette: ColorPalette | null
  updatePalette: (palette: ColorPalette) => void
  initializeFromServer: (paletteName: string | null) => void
}

// Função para aplicar o tema
const aplicarTema = (tema: ColorPalette) => {
  if (typeof document === 'undefined') return;


  const oldStyles = document.querySelectorAll('style[data-theme-vars]');
  oldStyles.forEach(style => style.remove());

  // Define variáveis para :root (tema light)
  const lightStyles = document.createElement('style');
  lightStyles.setAttribute('data-theme-vars', 'light');
  lightStyles.textContent = `:root {\n${Object.entries(tema.light)
    .map(([key, value]) => `  --${camelToKebab(key)}: ${value};`)
    .join('\n')}\n}`;
  document.head.appendChild(lightStyles);

  // Define variáveis para o tema escuro no seletor .dark
  const darkStyles = document.createElement('style');
  darkStyles.setAttribute('data-theme-vars', 'dark');
  darkStyles.textContent = `.dark {\n${Object.entries(tema.dark)
    .map(([key, value]) => `  --${camelToKebab(key)}: ${value};`)
    .join('\n')}\n}`;
  document.head.appendChild(darkStyles);
};

const camelToKebab = (str: string) => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);


export const usePaletteStore = create<PaletteState>((set) => {
  
  // Remove loading após um delay
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      useLoadingStore.getState().stopLoading();
    }, 500);
  }

  return {
    currentPalette: null,
    updatePalette: (palette: ColorPalette) => {
      set({ currentPalette: palette });
   
      aplicarTema(palette);
    },
    initializeFromServer: (paletteName: string | null) => {
      if (!paletteName) return;
      
      const palette = palettes.find(p => p.name === paletteName);
      if (palette) {
        set({ currentPalette: palette });
        aplicarTema(palette);
      }
    }
  }
})
