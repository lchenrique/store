import db from '@/lib/db';
import { ProductsHeader } from './components/products-header';
import { ProductsContent } from './components/products-content';
import { Prisma } from '@prisma/client';
import { MainPage } from '@/components/layout/main-page';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ProductsPage(props: {
  searchParams: SearchParams
}) {
  const searchParams = await props.searchParams;
  
  const minPrice = typeof searchParams.minPrice === 'string' ? Number(searchParams.minPrice) : undefined;
  const maxPrice = typeof searchParams.maxPrice === 'string' ? Number(searchParams.maxPrice) : undefined;
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
    <MainPage>
      <ProductsHeader />
      <ProductsContent
        products={products}
        initialFilters={{
          minPrice: minPrice?.toString() || '',
          maxPrice: maxPrice?.toString() || '',
          search: search || '',
        }}
      />
    </MainPage>
  );
}