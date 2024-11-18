import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { products } = await req.json();

    if (!Array.isArray(products)) {
      return new NextResponse('Invalid products data', { status: 400 });
    }

    const createdProducts = await db.product.createMany({
      data: products.map(product => ({
        name: product.name,
        description: product.description || '',
        price: Number(product.price),
        stock: Number(product.stock || 0),
        images: product.images || [],
      })),
    });

    return NextResponse.json(createdProducts);
  } catch (error) {
    console.error('Products import error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
