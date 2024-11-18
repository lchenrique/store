"use client";

import { Card, CardContent } from "@/components/ui/card";

export function LoadingSkeleton() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Perfil Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="space-y-2">
              <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse mt-4" />
          </CardContent>
        </Card>

        {/* Pedidos Recentes Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>

        {/* Endereços Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="space-y-4 mb-4">
              {[1, 2].map((i) => (
                <div key={i} className="border p-3 rounded-lg">
                  <div className="space-y-2">
                    <div className="h-5 w-4/5 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
            <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>

        {/* Favoritos Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
