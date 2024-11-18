'use client';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProductFilters } from './product-filters';
import { ProductGrid } from './product-grid';
import { motion } from 'framer-motion';
import { Product } from '@prisma/client';

interface ProductsContentProps {
  products: Product[];
  initialFilters: {
    minPrice: string;
    maxPrice: string;
    search: string;
  };
}

export function ProductsContent({ products, initialFilters }: ProductsContentProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="lg:w-64 p-6 h-fit border-delicate">
          <h2 className="text-lg font-semibold text-foreground mb-4">Filtros</h2>
          <Separator className="mb-6" />
          <ProductFilters initialFilters={initialFilters} />
        </Card>
      </motion.div>

      <motion.div 
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ProductGrid products={products} />
      </motion.div>
    </div>
  );
}
