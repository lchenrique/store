import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from 'mercadopago';
import db from "@/lib/db";
import { getUserSSR } from "@/services/get-user-ssr";

console.log("[CHECKOUT] Iniciando configuração do Mercado Pago");
console.log("[CHECKOUT] Access Token:", process.env.MERCADOPAGO_ACCESS_TOKEN);
console.log("[CHECKOUT] Public Key:", process.env.MERCADOPAGO_PUBLIC_KEY);

// Inicialização do client com credenciais de produção
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!
});
const preference = new Preference(client);

interface CartItem {
  id: string;
  quantity: number;
  price: number | string;
  name: string;
  description?: string;
  images?: string[];
}

interface PreferenceItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
  picture_url?: string;
  description?: string;
}

export async function POST(req: NextRequest) {
  console.log("[CHECKOUT] Iniciando requisição POST");
  try {
    const user = await getUserSSR(req);
    console.log("[CHECKOUT] User:", user?.id);
    
    if (!user?.id) {
      console.log("[CHECKOUT] Usuário não autenticado");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cartData = await req.json();
    console.log("[CHECKOUT] Body da requisição:", cartData);

    const cartItems = cartData?.state?.items as CartItem[];
    if (!cartItems?.length) {
      console.log("[CHECKOUT] Carrinho vazio");
      return new NextResponse("Cart is empty", { status: 400 });
    }

    // Verifica produtos...
    const productIds = cartItems.map(item => item.id);
    const products = await db.product.findMany({
      where: { id: { in: productIds } }
    });

    console.log("[CHECKOUT] Produtos encontrados:", products);

    if (products.length !== productIds.length) {
      console.log("[CHECKOUT] Um ou mais produtos não encontrados");
      return new NextResponse("One or more products not found", { status: 400 });
    }

    // Formata items conforme documentação
    const items: PreferenceItem[] = cartItems.map(item => {
      const product = products.find(p => p.id === item.id)!;
      return {
        id: product.id,
        title: product.name,
        quantity: item.quantity,
        unit_price: Number(item.price),
        currency_id: "BRL",
        picture_url: product.images?.[0],
        description: product.description || product.name
      };
    });

    console.log("[CHECKOUT] Itens formatados:", items);

    // Cria ordem no banco...
    const store = await db.store.findFirst();
    if (!store) throw new Error("Store not found");

    console.log("[CHECKOUT] Loja encontrada:", store);

    const order = await db.order.create({
      data: {
        userId: user.id,
        storeId: store.id,
        total: items.reduce((sum: number, item: PreferenceItem) => sum + (item.unit_price * item.quantity), 0),
        status: "PENDING",
        items: {
          create: cartItems.map((item: CartItem) => ({
            productId: item.id,
            quantity: item.quantity,
            price: Number(item.price)
          }))
        }
      }
    });

    console.log("[CHECKOUT] Ordem criada:", order);

    // Cria preferência para o Checkout Pro
    const result = await preference.create({
      body: {
        items,
        payer: {
          email: user.email!,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/pending`,
        },
        auto_return: "approved",
        external_reference: order.id,
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/mercadopago`,
        statement_descriptor: "Store Test"
      }
    });

    console.log("[CHECKOUT] Preferência criada:", result);

    return NextResponse.json({
      checkoutUrl: result.init_point,
      orderId: order.id
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}