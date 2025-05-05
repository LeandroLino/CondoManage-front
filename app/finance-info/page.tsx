'use client';

import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layouts/MainLayout';
import DashboardSummary from '@/components/dashboard/DashboardSummary';
import FinanceChart from '@/components/dashboard/FinanceChart';
import TransactionList from '@/components/dashboard/TransactionList';
import { useAuth } from '@/context/AuthContext';
import { dashboardAPI, ResidentDashboardData } from '@/lib/api';
import Link from 'next/link';

export default function FinanceInfoPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<ResidentDashboardData | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardAPI.getResidentDashboard();
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error('Error fetching finance info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process transactions to create chart data
  const processChartData = (transactions: any[]) => {
    // Group transactions by month
    const groupedByMonth = transactions.reduce((acc: any, transaction: any) => {
      const month = new Date(transaction.date).toLocaleString('pt-BR', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { income: 0, expense: 0 };
      }
      if (transaction.type === 'income') {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expense += transaction.amount;
      }
      return acc;
    }, {});

    // Convert to chart format
    return Object.entries(groupedByMonth).map(([month, data]: [string, any]) => ({
      name: month,
      income: data.income,
      expense: data.expense,
      balance: data.income - data.expense
    }));
  };

  return (
    <MainLayout title="Informações Financeiras">
      {loading || !dashboardData ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <Link href="/finance-info/new">
              <Button type="primary" icon={<PlusOutlined />}>
                Novo Registro
              </Button>
            </Link>
          </div>

          <DashboardSummary
            balance={dashboardData.finance.summary.balance}
            income={dashboardData.finance.summary.totalIncome}
            expense={dashboardData.finance.summary.totalExpense}
          />
          
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <FinanceChart 
                data={processChartData(dashboardData.finance.recentTransactions)} 
                title="Histórico Financeiro (Últimos 6 meses)"
                type="area"
                height={350}
              />
            </Col>
            <Col xs={24} lg={8}>
              <TransactionList 
                transactions={dashboardData.finance.recentTransactions} 
                title="Transações Recentes"
                emptyText="Nenhuma transação recente"
              />
            </Col>
          </Row>
        </>
      )}
    </MainLayout>
  );
}