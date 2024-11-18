"use client";

import { LogoutConfirmation } from "@/components/logout-confirmation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { supabase } from "@/lib/supabase/client";
import { Store } from "@/types";
import { LogIn, Menu, ShieldCheck, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  store?: Store | null;
}

export function ClientHeader({ store }: HeaderProps) {
  const router = useRouter();
  const cart = useCart();
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
    <header className="sm:flex sm:justify-between py-3 px-4 border-b">
      <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between w-full">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger>
              <Menu className="h-6 md:hidden w-6" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="block px-2 py-1 text-lg"
                >
                  Início
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="ml-4 lg:ml-0">
            {store?.logo ? (
              <Image
                src={store.logo}
                alt={store.name}
                width={100}
                height={50}
                className="object-contain"
              />
            ) : (
              <h1 className="text-xl font-bold">{store?.name}</h1>
            )}
          </Link>
        </div>
        <nav className="mx-6 items-center space-x-4 lg:space-x-6 hidden md:block">
          <Button asChild variant="ghost">
            <Link
              href="/"
              className="text-sm font-medium transition-colors"
            >
              Início
            </Link>
          </Button>
        </nav>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            aria-label="Shopping Cart"
            onClick={() => router.push("/cart")}
          >
            <ShoppingBag className="h-6 w-6" />
            <Badge
              variant="secondary"
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-2"
            >
              {cart.items.length}
            </Badge>
          </Button>
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/minha-conta">
                <Button variant="ghost" size="icon" title="Minha Conta">
                  {user.user_metadata.role === 'ADMIN' ? (
                    <ShieldCheck className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </Link>
              <LogoutConfirmation 
                onConfirm={handleLogout} 
                isAdmin={user.user_metadata.role === 'ADMIN'} 
              />
            </div>
          ) : (
            <Link href="/auth/login">
              <Button variant="default" size="sm" className="gap-2">
                <LogIn className="h-4 w-4" />
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
