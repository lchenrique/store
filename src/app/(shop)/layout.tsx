import Link from "next/link";
import { Search, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import db from "@/lib/db";

import { Badge } from "@/components/ui/badge";
import { useQuery } from "@/hooks/use-query";
import { getCart } from "@/lib/cart";
import { createClient } from "@/lib/supabase/server";
import { getStore } from "@/lib/store";
import { Header } from "@/components/layout/server-header";
import { AdminFAB } from "@/components/admin-fab";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const store = await getStore();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = user?.user_metadata?.role === 'ADMIN' || false;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 ">{children}</main>
      <AdminFAB isAdmin={isAdmin} />
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8  max-w-[1280px]">
          <div className="text-center text-sm text-muted-foreground">
            {new Date().getFullYear()} {store?.name}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
