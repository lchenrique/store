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
import { useProfile } from "@/hooks/profile";
import { useLogout } from "@/hooks/use-logout";

export function HeaderAdmin() {
  const router = useRouter();
  const { profile } = useProfile();
  const {logout} = useLogout()
  
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
    <header className="p-4">
      <div className="rounded-xl border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="h-14 px-6 flex items-center justify-between">
          <Button 
            onClick={() => router.push('/')} 
            variant="ghost" 
            size="icon"
            title="Ir para a Loja"
            className="rounded-lg hover:bg-accent/50"
          >
            <Store className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            {profile && (
              <div className="flex items-center gap-4">
                <PaletteSwitcher />
                <ThemeSwitcher />
                <LogoutConfirmation onConfirm={handleLogout} isAdmin={true} />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
