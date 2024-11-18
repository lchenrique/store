"use client";

import { useState } from "react";
import Link from "next/link";
import { Store, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Nav } from "./Nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="h-16 px-6 flex items-center justify-between">
      <Link href="/admin" className="flex items-center gap-2">
        <Store className="w-6 h-6 text-primary" />
        <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text">
          Administração
        </span>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0" title="Menu">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex flex-col h-full">
            <div className="h-16 flex items-center justify-between px-6 border-b">
              <div className="flex items-center gap-2">
                <Store className="w-6 h-6 text-primary" />
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text">
                  Administração
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} title="Fechar menu">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <Nav />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
