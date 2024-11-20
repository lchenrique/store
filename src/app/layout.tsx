import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth-provider";
import { QueryProvider } from "@/components/query-provider";
import { Loading } from "@/components/loading";
import { PaletteSwitcher } from "@/components/palette-switcher";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import db from "@/lib/db";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Store",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const store = await db.store.findFirst();
  const initialPalette = store?.palette || undefined;
  console.log('Initial palette:', {initialPalette});  

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn(
        inter.className,
        "min-h-screen bg-background antialiased"
      )}>
        <QueryProvider>
          <ThemeProvider initialPalette={initialPalette}>
            <AuthProvider>
              <Loading />
              {children}
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
