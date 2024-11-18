"use client";

import { useLoadingStore } from "@/store/use-loading-store";

export function Loading() {
  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div 
      className="fixed inset-0 bg-background z-[99999] flex items-center justify-center transition-opacity duration-500"
      style={{
        opacity: isLoading ? 1 : 0,
      }}
    >
      <div className="w-8 h-8 border-2 border-primary rounded-full animate-spin border-t-transparent" />
    </div>
  );
}
