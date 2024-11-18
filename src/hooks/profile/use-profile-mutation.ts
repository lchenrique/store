import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase/client';
import type { UserProfile } from './types';

interface ProfileData {
  name: string;
}

export function useProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProfileData) => {
      // Primeiro verifica se tem sessão
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Não autorizado");
      }

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar perfil");
      }

      return response.json() as Promise<UserProfile>;
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
    onSuccess: (updatedProfile) => {
      toast.success("Perfil atualizado com sucesso!");
    },
  });
}
