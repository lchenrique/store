import { NextResponse } from 'next/server';
import db  from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { products } = await req.json();

    const createdProducts = await db.product.createMany({
      data: products.map((product: any) => ({
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
        images: product.images || [],
      })),
    });

    return NextResponse.json(createdProducts);
  } catch (error) {
    console.error('Bulk product creation error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}