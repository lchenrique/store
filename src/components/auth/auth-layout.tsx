'use client';

import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from './animation-variants';

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
          <div className="bg-primary/30 p-2 rounded-lg backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            Gift Shop
          </div>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <div className="bg-primary/30 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-xl font-semibold">
                {sidebarTitle}
              </p>
              <footer className="text-sm opacity-90 mt-2">
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
