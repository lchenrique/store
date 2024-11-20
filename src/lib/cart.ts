import { cookies } from 'next/headers';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
}

export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get('cart');
  return cartCookie ? JSON.parse(cartCookie.value) : [];
}

export async function setCart(cart: CartItem[]) {
  const cookieStore = await cookies();
  cookieStore.set('cart', JSON.stringify(cart));
}

export async function addToCart(productId: string, quantity: number = 1) {
  const cart = await getCart();
  const existingItem = cart.find(item => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: Math.random().toString(36).substring(7),
      productId,
      quantity,
    });
  }

  await setCart(cart);
}

export async function updateCartItem(itemId: string, quantity: number) {
  const cart = await getCart();
  const item = cart.find(item => item.id === itemId);

  if (item) {
    item.quantity = quantity;
    await setCart(cart);
  }
}

export async function removeFromCart(itemId: string) {
  const cart = await getCart();
  const updatedCart = cart.filter(item => item.id !== itemId);
  await setCart(updatedCart);
}

export async function clearCart() {
  await setCart([]);
}