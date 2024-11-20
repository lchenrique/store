"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, ShoppingBag, User, Search, X, Shield, LogOut } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
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

interface MinimalHeaderProps {
  user: SupabaseUser | null;
  store: any;
}

export function MinimalHeader({ user, store }: MinimalHeaderProps) {
  const cart = useCart((state) => state.items);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const {logout} = useLogout();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
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
    <header className="fixed top-0 z-50 w-full">
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="mx-auto p-4 container max-w-7xl"
      >
        <div className="rounded-full border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm px-4">
          <div className="mx-auto py-2 px-2">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <Image
                  src={store?.logo ?? ""}
                  alt={store?.name ?? ""}
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                <span className="ml-2 text-lg font-medium text-primary hidden sm:inline-block">
                  {store?.name}
                </span>
              </Link>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Search Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-8 h-8 hover:bg-accent/10"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  {isSearchOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>

                {/* Cart */}
                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 hover:bg-accent/10 relative">
                    <ShoppingBag className="h-4 w-4" />
                    {cart.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
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
                              <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 hover:bg-primary/10 text-primary">
                                <Shield className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Área Administrativa</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href="/minha-conta">
                              <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 hover:bg-accent/10">
                                <User className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Minha Conta</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full w-8 h-8 hover:bg-accent/10"
                              >
                                <LogOut className="h-4 w-4" />
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
                    <Button variant="ghost" size="sm" className="rounded-full text-sm hover:bg-accent/10">
                      Login
                    </Button>
                  </Link>
                )}

                {/* Theme and Menu */}
                <ThemeToggle />

                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full w-8 h-8 hover:bg-accent/10"
                    >
                      <Menu className="h-4 w-4" />
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
              >
                <div className="mx-auto py-2 px-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Buscar produtos..."
                      className="rounded-full border-none bg-accent/5"
                    />
                    <Button size="sm" className="rounded-full">
                      Buscar
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </header>
  );
}
