import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import db from '@/lib/db';
import { Package, ShoppingCart, Users, DollarSign, AlertTriangle } from 'lucide-react';
import { AnalyticsChart } from './components/analytics-chart';
import { InventoryAlerts } from './components/inventory-alerts';
import { RecentOrders } from './components/recent-orders';
import { OrderStatus } from '@prisma/client';

interface OrderFromDB {
  id: string;
  total: number;
  status: string;
  createdAt: Date;
  user: {
    name: string;
  };
}

interface CustomerCount {
  count: number;
}

interface RevenueSum {
  total: number;
}

export default async function DashboardPage() {
  const results = await Promise.all([
    db.product.count(),
    db.order.count(),
    db.user.count({ where: { role: 'CUSTOMER' } }),
    db.order.aggregate({ where: { status: 'PAID' }, _sum: { total: true } }),
    db.product.findMany({
      where: { stock: { lte: 5 } },
      take: 5
    }),
    db.order.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
  ]);

  const orderStatusCounts = await Promise.all(
    Object.values(OrderStatus).map(async (status) => {
      const count = await db.order.count({
        where: { status }
      });
      return { status, count };
    })
  );

  const [
    productsCount,
    ordersCount,
    customerCount,
    revenueSum,
    lowStockProducts,
    recentOrders,
  ] = results;

  const statusMap = {
    [OrderStatus.CANCELLED]: "Cancelados",
    [OrderStatus.DELIVERED]: "Entregues",
    [OrderStatus.PENDING]: "Pendentes",
    [OrderStatus.PAID]: "Pagos",
    [OrderStatus.SHIPPED]: "Enviados",
  };

  const stats = [
    { name: 'Total de Produtos', value: productsCount, icon: Package },
    { name: 'Total de Pedidos', value: ordersCount, icon: ShoppingCart },
    { name: 'Total de Clientes', value: customerCount, icon: Users },
    { name: 'Receita Total', value: `R$ ${revenueSum._sum.total?.toFixed(2) || '0.00'}`, icon: DollarSign },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Painel de Controle</h1>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.name}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Alertas de Estoque</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <InventoryAlerts products={lowStockProducts} />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
          {orderStatusCounts.map(({ status, count }) => (
            <Card key={status}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {statusMap[status]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrders orders={recentOrders} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}