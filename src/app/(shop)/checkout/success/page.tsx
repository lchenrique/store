import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import db from '@/lib/db';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pedido Concluído',
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function CheckoutSuccessPage(props: {
  searchParams: SearchParams
}) {
  const searchParams = await props.searchParams;
  const orderId = typeof searchParams.orderId === 'string' ? searchParams.orderId : undefined;

  // if (!orderId) {
  //   redirect('/');
  // }

  // const order = await db.order.findUnique({
  //   where: { id: orderId },
  //   include: {
  //     items: {
  //       include: {
  //         product: true
  //       }
  //     }
  //   }
  // });

  // if (!order) {
  //   redirect('/');
  // }

  // // Update order status to PAID
  // await db.order.update({
  //   where: { id: order.id },
  //   data: { status: 'PAID' },
  // });

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Pedido Concluído!</h1>
          <p className="text-gray-500">Obrigado pela sua compra.</p>
        </div>

        <div className="border-t pt-6 mt-6">
          <h2 className="font-semibold mb-4">Resumo do Pedido</h2>
          <div className="space-y-4">
            {/* {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.product.name} x {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))} */}
            <div className="border-t pt-4 font-bold">
              <div className="flex justify-between">
                <span>Total</span>
                {/* <span>${order.total.toFixed(2)}</span> */}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Link href="//account/orders" className="flex-1">
            <Button className="w-full">Ver Detalhes do Pedido</Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full">
              Continuar Comprando
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}