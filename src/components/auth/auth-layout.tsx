'use client';

import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from './animation-variants';
import Image from 'next/image';
import { useStoreQuery } from '@/hooks/store/use-store';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  sidebarTitle: string;
  sidebarSubtitle: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  sidebarTitle,
  sidebarSubtitle,
}: AuthLayoutProps) {
  const { store } = useStoreQuery();

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/80 to-primary/70" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=2340&auto=format&fit=crop)',
          }}
        />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <div className="flex items-center gap-2 bg-primary/30 p-2 rounded-lg backdrop-blur-sm">
           {store?.logo && <Image
              src={store.logo}
              alt="Logo"
              width={32}
              height={32}
            />}
            {store?.name}
          </div>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <div className="bg-primary/30 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-lg">
                {sidebarTitle}
              </p>
              <footer className="text-sm text-white/70">
                {sidebarSubtitle}
              </footer>
            </div>
          </blockquote>
        </div>
      </div>
      <div className="relative lg:p-8">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.02] lg:hidden"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=2340&auto=format&fit=crop)',
          }}
        />
        <motion.div
          className="relative mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex flex-col space-y-2 text-center"
            variants={itemVariants}
          >
            <h1 className="text-2xl font-semibold tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {subtitle}
            </p>
          </motion.div>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
