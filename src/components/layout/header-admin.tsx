"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useUser } from "@/hooks/use-user";
import { useInitialUser } from "@/lib/initial-user";
import { supabase } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";
import { LogoutConfirmation } from "@/components/logout-confirmation";
import { PaletteSwitcher } from "../palette-switcher";

export function HeaderAdmin() {
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
    <header className="h-16 px-6 flex items-center justify-between">
      <Button 
        onClick={() => router.push('/')} 
        variant="ghost" 
        size="icon"
        title="Ir para a Loja"
      >
        <Store className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-2">
        {user && (
          <div className="flex items-center gap-4">
            <PaletteSwitcher />
            <ThemeSwitcher />
            <LogoutConfirmation onConfirm={handleLogout} isAdmin={true} />
          </div>
        )}
      </div>
    </header>
  );
}
