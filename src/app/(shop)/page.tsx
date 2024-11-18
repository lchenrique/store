"use client";

import { useStoreProducts } from "@/hooks/product";
import { motion } from "framer-motion";
import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: products, isLoading } = useStoreProducts({
    search: debouncedSearch,
    sortBy,
    sortOrder,
  });

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split("-");
    setSortBy(newSortBy);
    setSortOrder(newSortOrder as "asc" | "desc");
  };

  const sortOptions = [
    { value: "updatedAt-desc", label: "Mais recentes" },
    { value: "name-asc", label: "Nome (A-Z)" },
    { value: "name-desc", label: "Nome (Z-A)" },
    { value: "price-asc", label: "Preço (menor-maior)" },
    { value: "price-desc", label: "Preço (maior-menor)" },
  ];

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(price));
  };

  return (
    <div>
      <Hero 
        title="Presentes Especiais para Momentos Únicos"
        subtitle="Descubra nossa seleção exclusiva de presentes para todas as ocasiões"
        imageUrl="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1920&auto=format&fit=crop"
      />
      
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-4">
            Produtos em Destaque
          </h1>
          <p className="text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Explore nossa seleção de produtos exclusivos com os melhores preços e qualidade garantida.
          </p>
        </motion.div>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-10 h-10 transition-all duration-200 focus:ring-2 focus:ring-primary"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchTerm("")}
              >
                <span className="sr-only">Limpar busca</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </Button>
            )}
          </div>
          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-full sm:w-[240px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="hover-lift">
                  <CardContent className="p-0">
                    <Skeleton className="h-64 w-full" />
                  </CardContent>
                  <CardContent className="space-y-2 mt-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                  </CardContent>
                  <CardFooter className="px-4 pb-4">
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))
            : products?.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/products/${product.id}`}>
                    <Card className="overflow-hidden hover-lift border-delicate">
                      <CardContent className="p-0">
                        <div className="relative aspect-square overflow-hidden bg-muted">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                              <svg
                                className="h-12 w-12"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardHeader>
                        <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-2xl font-bold text-primary">
                          {formatPrice(product.price)}
                        </p>
                      </CardHeader>
                      <CardFooter>
                        <Button className="w-full" size="lg">
                          Ver Detalhes
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              ))}
        </div>

        {/* Empty State */}
        {!isLoading && products?.length === 0 && (
          <Card className="text-center py-12 border-delicate">
            <CardContent>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <svg
                  className="w-6 h-6 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Nenhum produto corresponde aos critérios de busca."
                  : "Não há produtos disponíveis no momento."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}