import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
}

function getCart(): CartItem[] {
  const cartCookie = cookies().get('cart');
  return cartCookie ? JSON.parse(cartCookie.value) : [];
}

function setCart(cart: CartItem[]) {
  cookies().set('cart', JSON.stringify(cart));
}

export async function PATCH(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const { quantity } = await req.json();
    const cart = getCart();

    const item = cart.find((item) => item.id === params.itemId);
    if (item) {
      item.quantity = quantity;
    }

    setCart(cart);
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const cart = getCart().filter((item) => item.id !== params.itemId);
    setCart(cart);
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 });
  }
}