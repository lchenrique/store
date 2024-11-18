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
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Minha Conta</h1>
      <div className="flex gap-2">
        <Button 
          onClick={() => router.push('/')} 
          variant="ghost" 
          size="icon"
          title="Ir para a Loja"
        >
          <Store className="h-5 w-5" />
        </Button>
        <LogoutConfirmation 
          onConfirm={handleLogout} 
          isAdmin={user?.role === 'ADMIN'} 
        />
      </div>
    </div>
  );
}
