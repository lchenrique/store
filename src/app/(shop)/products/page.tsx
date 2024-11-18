import db from '@/lib/db';
import { ProductsHeader } from './components/products-header';
import { ProductsContent } from './components/products-content';
import { Prisma } from '@prisma/client';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;

  const where: Prisma.ProductWhereInput = {
    AND: [
      minPrice ? { price: { gte: minPrice } } : {},
      maxPrice ? { price: { lte: maxPrice } } : {},
      search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      } : {},
    ],
  };

  const products = await db.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductsHeader />
      <ProductsContent 
        products={products}
        initialFilters={{
          minPrice: minPrice?.toString() || '',
          maxPrice: maxPrice?.toString() || '',
          search: search || '',
        }}
      />
    </div>
  );
}