import { cookies } from 'next/headers';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
}

export function getCart(): CartItem[] {
  const cartCookie = cookies().get('cart');
  return cartCookie ? JSON.parse(cartCookie.value) : [];
}

export function setCart(cart: CartItem[]) {
  cookies().set('cart', JSON.stringify(cart));
}

export function addToCart(productId: string, quantity: number = 1) {
  const cart = getCart();
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

  setCart(cart);
}

export function updateCartItem(itemId: string, quantity: number) {
  const cart = getCart();
  const item = cart.find(item => item.id === itemId);

  if (item) {
    item.quantity = quantity;
    setCart(cart);
  }
}

export function removeFromCart(itemId: string) {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== itemId);
  setCart(updatedCart);
}

export function clearCart() {
  setCart([]);
}