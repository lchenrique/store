import { NextResponse } from 'next/server';
import db from '@/lib/db';

type Params = Promise<{ orderId: string }>

export async function PATCH(
  req: Request,
  segmentData: { params: Params }
) {
  const params = await segmentData.params
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