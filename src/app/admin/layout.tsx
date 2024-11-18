"use client";

import { Store, Menu } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { HeaderAdmin } from "@/components/layout/header-admin";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SidebarProvider, useSidebar } from "@/hooks/use-sidebar";
import { Sidebar } from "@/components/layout/sidebar";
import { useInitialUser } from "@/lib/initial-user";
import { useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { PaletteSwitcher } from "@/components/palette-switcher";
import { PaletteStoreSync } from "@/components/palette-store-sync";

function AdminLayoutContent({ 
  children,
}: { 
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="relative min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile Nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-background">
        <MobileNav />
      </div>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 min-h-screen flex flex-col transition-[margin] duration-300 ease-in-out",
          isCollapsed ? "md:ml-[80px]" : "md:ml-64"
        )}
      >
        {/* Mini Header */}
        <div className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <HeaderAdmin />
 
        </div>

        {/* Área de Conteúdo */}
        <div className="flex-1 p-6 md:p-8">
          <PaletteStoreSync />
          {children}
        </div>
      </main>
      <PaletteSwitcher />
    </div>
  );
}

export default function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </SidebarProvider>
  );
}
