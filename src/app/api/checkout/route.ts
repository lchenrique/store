import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import mercadopago from 'mercadopago';
import  db  from '@/lib/db';
import { getCart, clearCart } from '@/lib/cart';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const cart = getCart();
    
    if (!cart.length) {
      return new NextResponse('Cart is empty', { status: 400 });
    }

    // Verifica se todos os produtos existem
    const productIds = cart.map(item => item.productId);
    const products = await db.product.findMany({
      where: {
        id: {
          in: productIds
        }
      }
    });

    if (products.length !== productIds.length) {
      return new NextResponse('One or more products not found', { status: 400 });
    }

    const items = cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      return {
        title: product.name,
        unit_price: product.price,
        quantity: item.quantity,
      };
    });

    const total = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

    // Create order in database
    const store = await db.store.findFirst();
    if (!store) throw new Error('Store not found');

    const order = await db.order.create({
      data: {
        storeId: store.id,
        userId: user.id,
        total,
        items: {
          create: cart.map((item) => {
            const product = products.find(p => p.id === item.productId);
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product?.price || 0,
            };
          }),
        },
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Clear cart after successful order creation
    clearCart();

    return NextResponse.json({
      orderId: order.id,
      total: order.total,
      items: order.items.map(item => ({
        id: item.productId,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity
      }))
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}