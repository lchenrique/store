"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, ShoppingBag, User, Search, X, Shield, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCart } from "@/hooks/use-cart";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLogout } from "@/hooks/use-logout";
import { useRouter } from "next/navigation";

interface MegaMenuHeaderProps {
  user: any;
  store: any;
}

export function MegaMenuHeader({ user, store }: MegaMenuHeaderProps) {
  const cart = useCart((state) => state.items);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { logout } = useLogout();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY; 
      setIsScrolled(currentScrollY > 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    {
      title: "Feminino",
      featured: [
        {
          name: "Novidades",
          href: "/category/women/new",
          imageSrc: "/category-women-new.jpg",
        },
        {
          name: "Básicos",
          href: "/category/women/basics",
          imageSrc: "/category-women-basics.jpg",
        },
      ],
      sections: [
        {
          name: "Roupas",
          items: [
            { name: "Vestidos", href: "/category/women/dresses" },
            { name: "Blusas", href: "/category/women/tops" },
            { name: "Calças", href: "/category/women/pants" },
            { name: "Saias", href: "/category/women/skirts" },
          ],
        },
        {
          name: "Acessórios",
          items: [
            { name: "Bolsas", href: "/category/women/bags" },
            { name: "Joias", href: "/category/women/jewelry" },
            { name: "Cintos", href: "/category/women/belts" },
          ],
        },
      ],
    },
    // Adicione mais categorias aqui
  ];

  const links = [
    { href: "/new", label: "Novidades" },
    { href: "/sale", label: "Promoções" },
    { href: "/about", label: "Sobre Nós" },
    { href: "/testimonials", label: "Depoimentos" },
    { href: "/contact", label: "Contato" },
  ];

  return (
    <>
      {/* Espaçador para compensar o header fixed */}
      <div className={cn(
        "w-full transition-all duration-150",
        isScrolled ? "h-[64px]" : "h-[104px]" // 40px do top bar + 64px do header principal
      )} />
      
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        <div
          className={cn(
            "relative w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
            "transition-all duration-150",
            isScrolled ? "shadow-sm" : ""
          )}
        >
          {/* Top Bar */}
          <div 
            className={cn(
              "overflow-hidden transition-all duration-150",
              isScrolled ? "h-0 opacity-0" : "h-10 opacity-100 border-b"
            )}
          >
            <div className="h-10 border-b">
              <div className="container h-full mx-auto px-4 lg:px-0 md:px-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">
                    Frete grátis para compras acima de R$ 200
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href="/track-order"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Rastrear Pedido
                  </Link>
                  <span className="text-muted-foreground">|</span>
                  <Link
                    href="/stores"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Nossas Lojas
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Header */}
          <div className="container mx-auto px-4 lg:px-0">
            <div
              className={cn(
                "flex items-center justify-between gap-4 transition-all duration-150",
                isScrolled ? "py-2" : "py-4"
              )}
            >
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="relative h-10 w-10">
                  <img
                    src={store?.logo || ""}
                    alt="Logo"
                    className="object-cover rounded-xl"
                  />
                </div>
                <span
                  className={cn(
                    "font-bold transition-all duration-200",
                    isScrolled ? "text-lg" : "text-xl"
                  )}
                >
                  {store?.name}
                </span>
              </Link>

              {/* Navigation */}
              <nav className="hidden lg:block">
                <NavigationMenu>
                  <NavigationMenuList className="flex items-center gap-6">
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="bg-transparent">
                        <span className="flex items-center gap-1">
                          Feminino
                          <ChevronDown className="h-4 w-4" />
                        </span>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid grid-cols-2 gap-4 p-6">
                          <div className="space-y-4">
                            <h3 className="font-medium">Destaques</h3>
                            <div className="grid grid-cols-2 gap-4">
                              {categories[0].featured.map((item) => (
                                <Link
                                  key={item.name}
                                  href={item.href}
                                  className="group block"
                                >
                                  <div className="relative h-40 w-full overflow-hidden rounded-lg">
                                    <img
                                      src={item.imageSrc}
                                      alt={item.name}
                                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                  <h4 className="mt-2 font-medium group-hover:text-primary transition-colors">
                                    {item.name}
                                  </h4>
                                </Link>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-x-8">
                            {categories[0].sections.map((section) => (
                              <div key={section.name} className="space-y-4">
                                <h3 className="font-medium">{section.name}</h3>
                                <ul className="space-y-2">
                                  {section.items.map((item) => (
                                    <li key={item.name}>
                                      <Link
                                        href={item.href}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                      >
                                        {item.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    {links.map((link) => (
                      <NavigationMenuItem key={link.href}>
                        <Link href={link.href} legacyBehavior passHref>
                          <NavigationMenuLink
                            className={cn(
                              "text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                            )}
                          >
                            {link.label}
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-4">
                {/* Search Toggle */}
                <div className="hidden lg:flex items-center gap-2">
                  <AnimatePresence>
                    {isSearchOpen && (
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "300px", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="relative"
                      >
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="O que você está procurando?"
                          type="search"
                          className="pl-10 pr-4 w-full rounded-full"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg hover:bg-accent/10"
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                  >
                    {isSearchOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )}
                  </Button>
                </div>

                {/* Mobile Search Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg hover:bg-accent/10 lg:hidden"
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
                  <Button variant="ghost" size="icon" className="rounded-lg hover:bg-accent/10 relative">
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
                    {user.user_metadata.role === "ADMIN" ? (
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
                    ) : (
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
                      </TooltipProvider>
                    )}
                  </>
                ) : (
                  <Link href="/auth/login">
                    <Button variant="ghost" size="icon" className="rounded-lg hover:bg-accent/10">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden mt-4"
              >
                <div className="container mx-auto px-4 pb-4">
                  <div className="relative flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="O que você está procurando?"
                        type="search"
                        className="pl-10 pr-4 rounded-full w-full"
                      />
                    </div>
                    <Button size="icon" className="rounded-full shrink-0">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}
