import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { UserProfile } from './types';
import apiClient  from "@/services/api";

interface ProfileData {
  name: string;
}

export function useProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProfileData) => {
      return apiClient.updateProfile(data);
    },
    onMutate: async (newProfile) => {
      // Cancela quaisquer refetchs pendentes para que não sobrescrevam nossa atualização otimista
      await queryClient.cancelQueries({ queryKey: ['profile'] });

      // Salva o valor anterior
      const previousProfile = queryClient.getQueryData<UserProfile>(['profile']);

      // Atualiza o cache otimisticamente
      if (previousProfile) {
        queryClient.setQueryData<UserProfile>(['profile'], {
          ...previousProfile,
          ...newProfile,
        });
      }

      // Retorna o contexto com o valor anterior
      return { previousProfile };
    },
    onError: (error, newProfile, context) => {
      console.error("Error updating profile:", error);
      // Em caso de erro, reverte para o valor anterior
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile'], context.previousProfile);
      }
      toast.error("Erro ao atualizar o perfil. Tente novamente.");
    },
    onSuccess: () => {
      toast.success("Perfil atualizado com sucesso!");
    },
  });
}
