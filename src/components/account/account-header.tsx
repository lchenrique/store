"use client";

import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { LogoutConfirmation } from "@/components/logout-confirmation";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";
import { useLogout } from "@/hooks/use-logout";

export function AccountHeader() {
  const router = useRouter();
  const { user } = useUser();
  const {logout} = useLogout();

  const handleLogout = async () => {
    try {
      const { error } = await logout();
      if (error) throw error;

      router.push('/auth/login');
      toast({
        title: 'Logout realizado com sucesso!',
        description: 'Até logo!',
      });
    } catch (error) {
      console.error('[handleLogout] Error:', error);
      toast({
        title: 'Erro ao fazer logout',
        description: 'Tente novamente em alguns instantes.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-4 mb-6">
      <div className="rounded-xl border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="h-14 px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Minha Conta</h1>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => router.push('/')} 
              variant="ghost" 
              size="icon"
              title="Ir para a Loja"
              className="rounded-lg hover:bg-accent/50"
            >
              <Store className="h-5 w-5" />
            </Button>
            <LogoutConfirmation 
              onConfirm={handleLogout} 
              isAdmin={user?.role === 'ADMIN'} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
