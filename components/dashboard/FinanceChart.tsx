'use client';

import React from 'react';
import { Card, Typography, Empty } from 'antd';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

const { Title } = Typography;

interface ChartData {
  name: string;
  income?: number;
  expense?: number;
  balance?: number;
}

interface FinanceChartProps {
  data: ChartData[];
  title?: string;
  type?: 'area' | 'bar';
  height?: number;
}

const FinanceChart: React.FC<FinanceChartProps> = ({ 
  data, 
  title = 'Resumo Financeiro',
  type = 'area',
  height = 300
}) => {
  if (!data || data.length === 0) {
    return (
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Title level={5}>{title}</Title>
        <Empty description="Sem dados financeiros para exibir" />
      </Card>
    );
  }

  const formatTooltipValue = (value: number) => {
    return formatCurrency(value);
  };

  return (
    <Card bordered={false} style={{ marginBottom: 24 }}>
      <Title level={5}>{title}</Title>
      <ResponsiveContainer width="100%" height={height}>
        {type === 'area' ? (
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#52c41a" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#52c41a" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f5222d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f5222d" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis 
              tickFormatter={(value) => `R$${value / 100}`}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip formatter={formatTooltipValue} />
            <Legend />
            {data[0]?.income !== undefined && (
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#52c41a" 
                fillOpacity={1} 
                fill="url(#colorIncome)" 
                name="Receitas"
              />
            )}
            {data[0]?.expense !== undefined && (
              <Area 
                type="monotone" 
                dataKey="expense" 
                stroke="#f5222d" 
                fillOpacity={1} 
                fill="url(#colorExpense)" 
                name="Despesas"
              />
            )}
            {data[0]?.balance !== undefined && (
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#1890ff" 
                fillOpacity={1} 
                fill="url(#colorBalance)" 
                name="Saldo"
              />
            )}
          </AreaChart>
        ) : (
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis 
              tickFormatter={(value) => `R$${value / 100}`}
            />
            <Tooltip formatter={formatTooltipValue} />
            <Legend />
            {data[0]?.income !== undefined && (
              <Bar dataKey="income" name="Receitas" fill="#52c41a" />
            )}
            {data[0]?.expense !== undefined && (
              <Bar dataKey="expense" name="Despesas" fill="#f5222d" />
            )}
            {data[0]?.balance !== undefined && (
              <Bar dataKey="balance" name="Saldo" fill="#1890ff" />
            )}
          </BarChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
};

export default FinanceChart;