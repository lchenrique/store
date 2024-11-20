"use client";

import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const logout = async () => {
    try {
      // Faz o signOut do Supabase
      const { error } = await signOut();
      if (error) throw error;

      // Limpa o cache do React Query
      queryClient.clear();
      queryClient.removeQueries();
      
      // Mostra mensagem de sucesso
      toast({
        title: "Logout realizado com sucesso",
        description: "Até logo!",
      });
      
      // Redireciona para o login
      router.push("/auth/login");

      return { error: null };
    } catch (error) {
      console.error("[useLogout] Error:", error);
      toast({
        title: "Erro ao fazer logout",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
      return { error };
    }
  };

  return {
    logout
  };
}
