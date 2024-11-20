import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import db from '@/lib/db';
import { Package, ShoppingCart, Users, DollarSign, ArrowUp, ArrowDown, AlertTriangle, Ban, CheckCircle2, Clock, CreditCard, Truck } from 'lucide-react';
import { AnalyticsChart } from './components/analytics-chart';
import { InventoryAlerts } from './components/inventory-alerts';
import { RecentOrders } from './components/recent-orders';
import { OrderStatus } from '@prisma/client';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  const currentDate = new Date();
  const startCurrentMonth = startOfMonth(currentDate);
  const endCurrentMonth = endOfMonth(currentDate);
  const startLastMonth = startOfMonth(subMonths(currentDate, 1));
  const endLastMonth = endOfMonth(subMonths(currentDate, 1));

  const [
    productsCount,
    ordersCount,
    customerCount,
    revenueSum,
    lowStockProducts,
    recentOrders,
    currentMonthOrders,
    lastMonthOrders,
    currentMonthRevenue,
    lastMonthRevenue,
  ] = await Promise.all([
    db.product.count(),
    db.order.count(),
    db.user.count({ where: { role: 'CUSTOMER' } }),
    db.order.aggregate({ where: { status: 'PAID' }, _sum: { total: true } }),
    db.product.findMany({
      where: { stock: { lte: 5 } },
      take: 5,
      orderBy: { stock: 'asc' }
    }),
    db.order.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    db.order.count({
      where: {
        createdAt: {
          gte: startCurrentMonth,
          lte: endCurrentMonth
        }
      }
    }),
    db.order.count({
      where: {
        createdAt: {
          gte: startLastMonth,
          lte: endLastMonth
        }
      }
    }),
    db.order.aggregate({
      where: {
        status: 'PAID',
        createdAt: {
          gte: startCurrentMonth,
          lte: endCurrentMonth
        }
      },
      _sum: { total: true }
    }),
    db.order.aggregate({
      where: {
        status: 'PAID',
        createdAt: {
          gte: startLastMonth,
          lte: endLastMonth
        }
      },
      _sum: { total: true }
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

  // Calcular variações percentuais
  const orderChange = ((ordersCount - lastMonthOrders) / lastMonthOrders) * 100;
  const revenueChange = ((currentMonthRevenue._sum.total || 0) - (lastMonthRevenue._sum.total || 0)) / (lastMonthRevenue._sum.total || 1) * 100;

  const statusMap = {
    [OrderStatus.CANCELLED]: {
      label: "Cancelados",
      icon: Ban,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    [OrderStatus.DELIVERED]: {
      label: "Entregues",
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    [OrderStatus.PENDING]: {
      label: "Pendentes",
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    [OrderStatus.PAID]: {
      label: "Pagos",
      icon: CreditCard,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    [OrderStatus.SHIPPED]: {
      label: "Enviados",
      icon: Truck,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  };

  const stats = [
    {
      name: 'Total de Produtos',
      value: productsCount,
      icon: Package,
      lowStockCount: lowStockProducts.length,
    },
    {
      name: 'Total de Pedidos',
      value: ordersCount,
      icon: ShoppingCart,
      change: orderChange,
      trend: orderChange >= 0 ? 'up' : 'down',
    },
    {
      name: 'Total de Clientes',
      value: customerCount,
      icon: Users,
    },
    {
      name: 'Receita Total',
      value: `R$ ${revenueSum._sum.total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`,
      icon: DollarSign,
      change: revenueChange,
      trend: revenueChange >= 0 ? 'up' : 'down',
    },
  ];

  // Dados para o gráfico
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(currentDate, i);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    return {
      date: monthStart,
      name: format(date, 'MMM', { locale: ptBR }),
      start: monthStart,
      end: monthEnd,
    };
  }).reverse();

  const chartData = await Promise.all(
    last6Months.map(async ({ name, start, end }) => {
      const revenue = await db.order.aggregate({
        where: {
          status: 'PAID',
          createdAt: {
            gte: start,
            lte: end,
          },
        },
        _sum: { total: true },
      });

      const orders = await db.order.count({
        where: {
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      });

      return {
        name,
        revenue: revenue._sum.total || 0,
        orders,
      };
    })
  );

  console.log('Chart Data:', chartData);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Painel de Controle</h1>
        <p className="text-muted-foreground">
          Visão geral do seu negócio e métricas importantes
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.name}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {stat.change !== undefined && (
                    <div className={`text-xs flex items-center gap-1 ${
                      stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stat.trend === 'up' ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )}
                      {Math.abs(stat.change).toFixed(1)}% em relação ao mês anterior
                    </div>
                  )}
                  {stat.lowStockCount !== undefined && stat.lowStockCount > 0 && (
                    <div className="text-xs text-yellow-500 mt-1">
                      {stat.lowStockCount} produtos com estoque baixo
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <AnalyticsChart data={chartData} />

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

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
          {orderStatusCounts.map(({ status, count }) => {
            const statusInfo = statusMap[status];
            const Icon = statusInfo.icon;
            
            return (
              <Card key={status} className="relative overflow-hidden">
                <div className={`absolute inset-0 ${statusInfo.bgColor} opacity-50`} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <CardTitle className="text-sm font-medium">
                    {statusInfo.label}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${statusInfo.color}`} />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold">{count}</div>
                  <p className={`text-xs ${statusInfo.color} mt-1`}>
                    {((count / ordersCount) * 100).toFixed(1)}% do total
                  </p>
                </CardContent>
              </Card>
            );
          })}
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