import { format } from 'date-fns';
import db  from '@/lib/db';
import { OrderList } from './components/order-list';

export default async function OrdersPage() {
  // const orders = await db.order.findMany({
  //   include: {
  //     user: true,
  //     items: {
  //       include: {
  //         product: true,
  //       },
  //     },
  //   },
  //   orderBy: { createdAt: 'desc' },
  // });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Orders</h1>
      {/* <OrderList orders={orders} /> */}
    </div>
  );
}