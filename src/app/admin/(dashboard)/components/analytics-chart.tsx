'use client';

import { useTheme } from 'next-themes';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Line, LineChart } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface AnalyticsChartProps {
  data: {
    name: string;
    revenue: number;
    orders: number;
  }[];
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const { theme } = useTheme();
  const [metric, setMetric] = useState<'revenue' | 'orders'>('revenue');

  const metrics = {
    revenue: {
      name: 'Receita',
      formatter: (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      color: theme === 'dark' ? 'rgb(59, 130, 246)' : 'rgb(37, 99, 235)', // blue-500/blue-600
    },
    orders: {
      name: 'Pedidos',
      formatter: (value: number) => value.toString(),
      color: theme === 'dark' ? 'rgb(168, 85, 247)' : 'rgb(147, 51, 234)', // purple-500/purple-600
    },
  };

  const chartConfig = {
    [metric]: {
      label: metrics[metric].name,
      color: metrics[metric].color,
    },
  };

  if (!data?.length) {
    return (
      <Card className="p-4">
        <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
          <p>Nenhum dado disponível para exibição</p>
        </div>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    name: item.name,
    [metric]: item[metric],
  }));

  return (
    <Card className="p-4">
      <div className="flex flex-col space-y-2">
        <h3 className="font-semibold">Análise de Vendas</h3>
        <div className="space-x-2">
          <Button
            size="sm"
            variant={metric === 'revenue' ? 'default' : 'outline'}
            onClick={() => setMetric('revenue')}
            className={metric === 'revenue' ? 'bg-primary hover:bg-primary/50' : ''}
          >
            Receita
          </Button>
          <Button
            size="sm"
            variant={metric === 'orders' ? 'default' : 'outline'}
            onClick={() => setMetric('orders')}
            className={metric === 'orders' ? 'bg-primary hover:bg-primary/50' : ''}
          >
            Pedidos
          </Button>
        </div>
      </div>
      <div className="h-[350px] mt-4">
        {/* <ChartContainer config={chartConfig}>
          <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <Line 
              type="monotone"
              dataKey={metric}
              strokeWidth={2}
              dot={{ 
                r: 4,
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                strokeWidth: 2,
              }}
            />
            <ChartTooltip 
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const value = payload[0].value;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">{metrics[metric].name}:</span>
                      <span className="font-mono">{metrics[metric].formatter(value as number)}</span>
                    </div>
                  </div>
                );
              }}
            />
          </LineChart>
        </ChartContainer> */}
      </div>
    </Card>
  );
}