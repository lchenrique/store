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
import { ServerTheme } from "@/components/providers/server-theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Store",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <ServerTheme />
      </head>
      <body className={cn(
        inter.className,
        "min-h-screen bg-background antialiased"
      )}>
        <QueryProvider>

          <ThemeProvider>
            <Loading />
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>

      </body>
    </html>
  );
}
