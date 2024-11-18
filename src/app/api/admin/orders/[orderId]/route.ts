import { NextResponse } from 'next/server';
import db  from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { status } = await req.json();

    const order = await db.order.update({
      where: { id: params.orderId },
      data: { status },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order update error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}