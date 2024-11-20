"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "@/lib/auth";
import type { Session } from "@supabase/supabase-js";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useSession() {
  const queryClient = useQueryClient();
  const pathname = usePathname();

  // Força revalidação da sessão quando mudar de página
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["session"] });
  }, [pathname, queryClient]);

  const { data: session } = useQuery<Session | null>({
    queryKey: ["session"],
    queryFn: getSession,
    staleTime: 0, // Nunca considera o cache válido
    gcTime: 0, // Não mantém em cache
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 0, // Não tenta novamente em caso de erro
  });

  // Limpa o cache de sessão quando não houver sessão
  useEffect(() => {
    if (!session) {
      queryClient.setQueryData(["session"], null);
    }
  }, [session, queryClient]);

  return {
    session,
    isAuthenticated: !!session,
  };
}
