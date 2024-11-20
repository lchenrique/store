import { palettes } from "@/config/themes";
import { useMutation } from "../use-query";
import apiClient from "@/services/api";
import { toast } from "../use-toast";
import { usePaletteStore } from "@/store/use-palette-store";


export function useStorePalette() {
    const updatePalette = useMutation(async (palette: string) => {
    
        // Atualiza o tema visual via Zustand
        const selectedPalette = palettes.find(p => p.name === palette);
        if (selectedPalette) {
          usePaletteStore.getState().updatePalette(selectedPalette);
        }
  
        try {
          return await apiClient.updateStorePalette(palette);
        } catch (error) {
          throw error;
        }
      },{
        onError: (error) => {
          console.error("[UPDATE_PALETTE_ERROR]", error);
          toast({
            title: "Erro ao atualizar paleta",
            description: error.message || "Ocorreu um erro ao atualizar a paleta.",
            variant: "destructive",
          });
        },
      });

      return {
        updatePalette,
      };
}