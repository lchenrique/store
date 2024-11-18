"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/hooks/use-sidebar";

const navigation = [
  { name: "Início", href: "/admin", icon: LayoutDashboard },
  { name: "Produtos", href: "/admin/products", icon: Package },
  { name: "Pedidos", href: "/admin/orders", icon: ShoppingCart },
  { name: "Clientes", href: "/admin/customers", icon: Users },
  { name: "Configurações", href: "/admin/settings", icon: Settings },
];

export function Nav() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="flex-1 space-y-2 flex flex-col">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const NavLink = (
            <Link key={item.name} href={item.href} className="w-full">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start transition-all duration-200 font-medium",
                  {
                    "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:text-primary-foreground": isActive,
                    "hover:bg-accent/50": !isActive,
                  }
                )}
              >
                <Icon
                  className={cn("transition-transform", isCollapsed ? "w-5 h-5" : "w-5 h-5 mr-3", {
                    "scale-110": isActive,
                  })}
                />
                {!isCollapsed && item.name}
              </Button>
            </Link>
          );

          if (isCollapsed) {
            return (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>{NavLink}</TooltipTrigger>
                <TooltipContent side="right" sideOffset={20}>
                  {item.name}
                </TooltipContent>
              </Tooltip>
            );
          }

          return NavLink;
        })}
      </nav>
    </TooltipProvider>
  );
}
