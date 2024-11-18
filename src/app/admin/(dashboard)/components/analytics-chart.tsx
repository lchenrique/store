'use client';

import { useTheme } from 'next-themes';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { name: 'Jan', revenue: 2400 },
  { name: 'Fev', revenue: 1398 },
  { name: 'Mar', revenue: 9800 },
  { name: 'Abr', revenue: 3908 },
  { name: 'Mai', revenue: 4800 },
  { name: 'Jun', revenue: 3800 },
  { name: 'Jul', revenue: 4300 },
];

export function AnalyticsChart() {
  const { theme } = useTheme();

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke={theme === 'dark' ? '#888888' : '#444444'}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={theme === 'dark' ? '#888888' : '#444444'}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `R$ ${value}`}
        />
        <Tooltip 
          formatter={(value: number) => [`R$ ${value}`, 'Receita']}
          labelFormatter={(label) => `${label}/2023`}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke={theme === 'dark' ? '#ffffff' : '#000000'}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}