import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import db from "@/lib/db";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
}

type Params = Promise<{ itemId: string }>

async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get('cart');
  return cartCookie ? JSON.parse(cartCookie.value) : [];
}

async function setCart(cart: CartItem[]) {
  const cookieStore = await cookies();
  cookieStore.set('cart', JSON.stringify(cart));
}

export async function PATCH(
  req: Request,
  segmentData: { params: Params }
) {
  const params = await segmentData.params;
  try {
    const { quantity } = await req.json();
    const cart = await getCart();

    const item = cart.find((item) => item.id === params.itemId);
    if (!item) {
      return new NextResponse('Item not found', { status: 404 });
    }

    item.quantity = quantity;
    await setCart(cart);
    return NextResponse.json(item);
  } catch (error) {
    console.error('Cart item update error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  segmentData: { params: Params }
) {
  const params = await segmentData.params;
  try {
    const cart = await getCart();
    const newCart = cart.filter((item) => item.id !== params.itemId);
    await setCart(newCart);
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Cart item deletion error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}