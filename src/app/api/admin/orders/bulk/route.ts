import { NextResponse } from 'next/server';
import db  from '@/lib/db';

export async function PATCH(req: Request) {
  try {
    const { orderIds, status } = await req.json();

    await db.order.updateMany({
      where: {
        id: {
          in: orderIds,
        },
      },
      data: { status },
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Bulk order update error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}