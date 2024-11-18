'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useInitialUser } from '@/lib/initial-user';
import { useProfile } from '@/hooks/profile';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useInitialUser((state) => state.setUser);
  const { data: profile } = useProfile();

  useEffect(() => {
    // Verificar se já tem sessão
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("[AuthProvider] Initial session:", session ? "Found" : "Not found");
      
      if (session && profile) {
        console.log("[AuthProvider] Session user:", session.user);
        console.log("[AuthProvider] Profile loaded:", profile);
        
        const userData = {
          ...session.user,
          role: profile.role,
        };
        
        queryClient.setQueryData(['user'], userData);
       
      }
      
      setIsLoading(false);
    });

    // Observar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("[AuthProvider] Auth state changed:", event, session ? "Session exists" : "No session");
        
        if (session && profile) {
          const userData = {
            ...session.user,
            role: profile.role,
          };

          queryClient.setQueryData(['user'], userData);
          
       
          // Redirecionar para a área correta se estiver em uma rota de auth
          if (window.location.pathname.startsWith('/auth')) {
            const redirectTo = profile.role === 'ADMIN' ? '/admin' : '/minha-conta';
            console.log("[AuthProvider] Redirecting on auth change to:", redirectTo);
            router.push(redirectTo);
            router.refresh();
          }
        } else if (!session) {
          queryClient.setQueryData(['user'], null);
          // Verifica se está em uma rota protegida antes de redirecionar
          const protectedPaths = ['/admin', '/minha-conta', '/api/admin'];
          const isProtectedRoute = protectedPaths.some(path => 
            window.location.pathname.startsWith(path)
          );
          
          if (isProtectedRoute) {
            router.push('/auth/login');
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, router, setUser, profile]);

  if (isLoading) {
    return null; // ou um componente de loading
  }

  return <>{children}</>;
}