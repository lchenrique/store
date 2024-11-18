import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { uploadImage } from "@/services/s3";
import type { Store } from "@prisma/client";
import type { SettingsForm } from "@/app/admin/settings/components/settings-form";
import { toast } from "@/hooks/use-toast";
import { usePaletteStore } from "@/store/use-palette-store";
import { palettes } from "@/config/themes";
import { apiClient } from "@/services/api";

interface UpdateSettingsData {
  data: SettingsForm;
  logo?: File;
}

// Hook para leitura dos dados da store
export function useStoreQuery() {
  const { data: store, isLoading: isLoadingStore } = useQuery({
    queryKey: ["store"],
    queryFn: () => apiClient.getStore(),
    staleTime: Infinity, // Mantem o cache para sempre até ser invalidado
    gcTime: Infinity, // Nunca remove do cache (garbage collection time)
    refetchOnMount: false, // Não refetch ao montar
    refetchOnWindowFocus: false, // Não refetch ao focar a janela
  });

  return { store, isLoadingStore };
}

// Hook para mutações da store
export function useStoreMutations() {
  const queryClient = useQueryClient();

  const updateSettings = useMutation({
    mutationFn: async ({ data, logo }: UpdateSettingsData) => {
      let logoUrl = data.logo;
      if (logo) {
        logoUrl = await uploadImage(logo, "logo", logo.name);
      }

      return apiClient.updateStore({ ...data, logo: logoUrl });
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["store"], updated);
      toast({
        title: "Configurações atualizadas",
        description: "As configurações da loja foram atualizadas com sucesso.",
      });
    },
    onError: (error) => {
      console.error("[UPDATE_SETTINGS_ERROR]", error);
      toast({
        title: "Erro ao atualizar configurações",
        description: error.message || "Ocorreu um erro ao atualizar as configurações.",
        variant: "destructive",
      });
    },
  });

  const updatePalette = useMutation({
    mutationFn: async (palette: string) => {
      // Otimista: atualiza o cache antes da chamada à API
      const previousStore = queryClient.getQueryData(["store"]) as Store;
      
      // Se a paleta for a mesma, não faz nada
      if (previousStore?.palette === palette) {
        return previousStore;
      }

      // Atualiza o cache do React Query
      queryClient.setQueryData(["store"], { ...previousStore, palette });

      // Atualiza o tema visual via Zustand
      const selectedPalette = palettes.find(p => p.name === palette);
      if (selectedPalette) {
        usePaletteStore.getState().updatePalette(selectedPalette);
      }

      try {
        return await apiClient.updateStorePalette(palette);
      } catch (error) {
        // Em caso de erro, reverte o cache e o tema
        queryClient.setQueryData(["store"], previousStore);
        const previousPalette = palettes.find(p => p.name === previousStore?.palette);
        if (previousPalette) {
          usePaletteStore.getState().updatePalette(previousPalette);
        }
        throw error;
      }
    },
    onError: (error) => {
      console.error("[UPDATE_PALETTE_ERROR]", error);
      toast({
        title: "Erro ao atualizar paleta",
        description: error.message || "Ocorreu um erro ao atualizar a paleta.",
        variant: "destructive",
      });
    },
  });

  const updateLogo = useMutation({
    mutationFn: async (logo: File) => {
      return apiClient.updateStoreLogo(logo);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["store"], updated);
      toast({
        title: "Logo atualizado",
        description: "O logo da loja foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      console.error("[UPDATE_LOGO_ERROR]", error);
      toast({
        title: "Erro ao atualizar logo",
        description: error.message || "Ocorreu um erro ao atualizar o logo.",
        variant: "destructive",
      });
    },
  });

  return {
    updateSettings,
    updatePalette,
    updateLogo,
  };
}

// Hook legado para compatibilidade
export function useStore() {
  const { store, isLoadingStore } = useStoreQuery();
  const mutations = useStoreMutations();

  return {
    store,
    isLoadingStore,
    ...mutations,
  };
}
