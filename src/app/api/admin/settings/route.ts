import { NextResponse } from 'next/server';
import db  from '@/lib/db';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const store = await db.store.findFirst();

    if (!store) {
      return new NextResponse('Store not found', { status: 404 });
    }

    const updatedStore = await db.store.update({
      where: { id: store.id },
      data: {
        name: body.name,
        description: body.description,
        logo: body.logo,
        settings: body.settings,
      },
    });

    return NextResponse.json(updatedStore);
  } catch (error) {
    console.error('Settings update error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}