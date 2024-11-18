import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.json({ items: [] });
    }

    // Busca o carrinho do usuário no banco com os produtos
    const cartItems = await db.cartItem.findMany({
      where: {
        user: {
          email: user.email
        }
      },
      include: {
        product: true
      }
    });

    // Filtra itens com produtos válidos
    const validCartItems = cartItems
      .filter(item => item.product !== null)
      .map(item => ({
        id: item.productId,
        quantity: item.quantity,
        price: item.product?.price || item.price,
        name: item.product?.name,
        image: item.product?.images[0]
      }));

    return NextResponse.json({
      items: validCartItems
    });
  } catch (error) {
    console.error('Error in GET /api/cart:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { items } = await req.json();

    // Encontra ou cria o usuário no banco
    const dbUser = await db.user.findUnique({
      where: { email: user.email }
    });

    if (!dbUser) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Verifica se todos os produtos existem
    const productIds = items.map((item: any) => item.id);
    const existingProducts = await db.product.findMany({
      where: {
        id: {
          in: productIds
        }
      }
    });

    if (existingProducts.length !== productIds.length) {
      return new NextResponse('One or more products not found', { status: 400 });
    }

    // Atualiza o carrinho no banco
    await db.$transaction([
      // Remove todos os itens atuais
      db.cartItem.deleteMany({
        where: { userId: dbUser.id }
      }),
      // Adiciona os novos itens
      ...items.map((item: any) => {
        const product = existingProducts.find(p => p.id === item.id);
        return db.cartItem.create({
          data: {
            userId: dbUser.id,
            productId: item.id,
            quantity: item.quantity,
            price: product?.price || item.price
          }
        });
      })
    ]);

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/cart:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const dbUser = await db.user.findUnique({
      where: { email: user.email }
    });

    if (!dbUser) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Limpa o carrinho do usuário
    await db.cartItem.deleteMany({
      where: { userId: dbUser.id }
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/cart:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
