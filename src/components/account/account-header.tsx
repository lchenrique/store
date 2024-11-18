"use client";

import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { LogoutConfirmation } from "@/components/logout-confirmation";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";

export function AccountHeader() {
  const router = useRouter();
  const { user } = useUser();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/auth/login');
      toast({
        title: 'Logout realizado com sucesso!',
        description: 'Até logo!',
      });
    } catch (error) {
      toast({
        title: 'Erro ao fazer logout',
        description: 'Tente novamente.',
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
