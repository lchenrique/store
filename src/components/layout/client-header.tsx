"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, ShoppingBag, User, Search, X, Shield, LogOut } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCart } from "@/hooks/use-cart";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { User as UserType } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useLogout } from "@/hooks/use-logout";
import { toast } from "@/hooks";

interface ClientHeaderProps {
  user: SupabaseUser | null;
  store: any;
}

export function ClientHeader({ user, store }: ClientHeaderProps) {
  const cart = useCart((state) => state.items);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const {logout} = useLogout()
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await logout();
      if (error) throw error;
      
      router.refresh();
    } catch (error) {
      console.error('[handleLogout] Error:', error);
      toast({
        title: 'Erro ao fazer logout',
        description: 'Tente novamente em alguns instantes.',
        variant: 'destructive',
      });
    }
  };

  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "Sobre Nós" },
    { href: "/products", label: "Produtos" },
    { href: "/testimonials", label: "Depoimentos" },
    { href: "/contact", label: "Contato" },
  ];


  return (
    <header className="fixed top-0 z-50 w-full p-4">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
          <div className="container mx-auto py-4 px-6">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="relative min-w-9 h-9 max-h-9 flex-1  rounded-xl">
                  <img
                    src={store?.logo || ""}
                    alt="Logo"
                    className="object-cover w-full max-h-9"
                  />
                </div>

                <span className="text-xl font-bold text-primary hidden sm:block">
                  {store?.name}
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden xl:flex items-center gap-6">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-4">
                {/* Search Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg  hover:bg-accent/10"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  {isSearchOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </Button>

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Cart */}
                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="rounded-lg  hover:bg-accent/10 relative">
                    <ShoppingBag className="h-5 w-5" />
                    {cart.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                      >
                        {cart.reduce((total, item) => total + item.quantity, 0)}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {/* User Menu */}
                {user ? (
                  <>
                    {user.user_metadata.role === 'ADMIN' ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href="/admin">
                              <Button variant="ghost" size="icon" className="rounded-lg hover:bg-primary/10 text-primary">
                                <Shield className="h-5 w-5" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Área Administrativa</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) :
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href="/minha-conta">
                              <Button variant="ghost" size="icon" className="rounded-lg hover:bg-accent/10">
                                <User className="h-5 w-5" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Minha Conta</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>}

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-lg hover:bg-accent/10"
                              >
                                <LogOut className="h-5 w-5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Sair da conta</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja sair da sua conta?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleLogout}>
                                  Confirmar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Sair</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                ) : (
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm" className="rounded-lg  hover:bg-accent/10">
                      Login
                    </Button>
                  </Link>
                )}

                {/* Mobile Menu */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-lg  hover:bg-accent/10 xl:hidden"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <nav className="flex flex-col gap-4">
                      {menuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t"
              >
                <div className="container mx-auto py-4 px-6">
                  <div className="flex gap-4">
                    <Input
                      placeholder="Buscar produtos..."
                      className="rounded-lg"
                    />
                    <Button className="rounded-lg">Buscar</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
