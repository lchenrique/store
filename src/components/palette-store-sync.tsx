import { useEffect, useRef } from 'react';
import { useStoreMutations } from '@/hooks/store/use-store';
import { usePaletteStore } from '@/store/use-palette-store';

export function PaletteStoreSync() {
  const currentPalette = usePaletteStore((state) => state.currentPalette);
  const { updatePalette } = useStoreMutations();
  const lastPalette = useRef<string | null>(null);
  const isFirstRender = useRef(true);
  const isInitialSync = useRef(true);

  useEffect(() => {
    // Ignora a sincronização inicial do servidor
    if (isInitialSync.current) {
      isInitialSync.current = false;
      if (currentPalette) {
        lastPalette.current = currentPalette.name;
      }
      return;
    }

    // Ignora a primeira renderização
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Só atualiza se a paleta mudou e não é a primeira vez
    if (currentPalette?.name && currentPalette.name !== lastPalette.current) {
      lastPalette.current = currentPalette.name;
      updatePalette.mutate(currentPalette.name);
    }
  }, [currentPalette, updatePalette]);

  return null;
}
