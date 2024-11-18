'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Search } from 'lucide-react';

interface ProductFiltersProps {
  initialFilters: {
    minPrice: string;
    maxPrice: string;
    search: string;
  };
}

export function ProductFilters({ initialFilters }: ProductFiltersProps) {
  const router = useRouter();
  const [filters, setFilters] = useState({
    minPrice: initialFilters.minPrice,
    maxPrice: initialFilters.maxPrice,
    search: initialFilters.search,
  });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedFilters.minPrice) params.set('minPrice', debouncedFilters.minPrice);
    if (debouncedFilters.maxPrice) params.set('maxPrice', debouncedFilters.maxPrice);
    if (debouncedFilters.search) params.set('search', debouncedFilters.search);

    router.push(`/products?${params.toString()}`);
  }, [debouncedFilters, router]);

  function clearFilters() {
    setFilters({ minPrice: '', maxPrice: '', search: '' });
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <Label htmlFor="search" className="text-muted-foreground">
          Buscar Produtos
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Buscar..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="pl-9 border-delicate focus:border-primary"
          />
        </div>
      </div>

      <Separator className="my-6" />

      <Accordion type="single" collapsible defaultValue="price" className="w-full space-y-4">
        <AccordionItem value="price" className="border-none">
          <AccordionTrigger className="text-foreground hover:text-primary transition-colors">
            Faixa de Preço
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="min-price" className="text-muted-foreground">
                  Preço Mínimo
                </Label>
                <Input
                  id="min-price"
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="border-delicate focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-price" className="text-muted-foreground">
                  Preço Máximo
                </Label>
                <Input
                  id="max-price"
                  type="number"
                  placeholder="1000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="border-delicate focus:border-primary"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator className="my-6" />

      <Button
        variant="outline"
        onClick={clearFilters}
        className="w-full border-delicate hover:bg-muted transition-colors"
      >
        Limpar Filtros
      </Button>
    </motion.div>
  );
}