import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Order {
  id: string;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
  storeId: string;
  user: {
    name: string;
  } | null;
}

interface RecentOrdersProps {
  orders: Order[];
}

const statusColors = {
  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
  [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
  [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.PAID]: 'bg-blue-100 text-blue-800',
  [OrderStatus.SHIPPED]: 'bg-purple-100 text-purple-800',
};

const statusMap = {
  [OrderStatus.CANCELLED]: "Cancelado",
  [OrderStatus.DELIVERED]: "Entregue",
  [OrderStatus.PENDING]: "Pendente",
  [OrderStatus.PAID]: "Pago",
  [OrderStatus.SHIPPED]: "Enviado",
};

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="rounded-lg border shadow-sm">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Pedidos Recentes</h2>
        <Link
          href="/admin/orders"
          className="text-sm text-muted-foreground hover:underline"
        >
          Ver todos
        </Link>
      </div>
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Cliente</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Data</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {orders.map((order) => (
              <tr key={order.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td className="p-4 align-middle">{order.user?.name || 'Cliente removido'}</td>
                <td className="p-4 align-middle">
                  <Badge
                    variant="secondary"
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusColors[order.status]}`}
                  >
                    {statusMap[order.status]}
                  </Badge>
                </td>
                <td className="p-4 align-middle">R$ {order.total.toFixed(2)}</td>
                <td className="p-4 align-middle">{format(order.createdAt, 'dd/MM/yyyy', { locale: ptBR })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}