"use client";

import Link from "next/link";
import { Store, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Nav } from "./Nav";
import { useSidebar } from "@/hooks/use-sidebar";

export function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside
      className={`
        fixed top-0 left-0 z-40 h-screen border-r bg-background transition-[width] duration-300 ease-in-out
        ${isCollapsed ? "w-[80px]" : "w-64"}
        hidden md:block
      `}
    >
      <div className="flex h-full flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <Link
            href="/admin"
            className={`
              flex items-center gap-2
              ${isCollapsed ? "w-full justify-center px-0" : ""}
            `}
          >
            <Store className="w-6 h-6 text-primary shrink-0" />
            <span
              className={`
                text-lg font-bold bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text
                transition-[width] duration-300 ease-in-out overflow-hidden
                ${isCollapsed ? "w-0" : "w-32"}
              `}
            >
              Administração
            </span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <Nav />
        </div>

        <Button
          variant="ghost"
          className="w-full h-16 rounded-none border-t flex items-center justify-center hover:bg-accent/50 transition-colors"
          onClick={toggleSidebar}
          title={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          <ChevronLeft
            className={`
              w-5 h-5 transition-transform duration-300 ease-in-out 
              ${isCollapsed ? "rotate-180" : ""}
            `}
          />
        </Button>
      </div>
    </aside>
  );
}
