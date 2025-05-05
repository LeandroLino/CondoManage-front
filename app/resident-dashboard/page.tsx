'use client';

import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Descriptions, Skeleton } from 'antd';
import MainLayout from '@/components/layouts/MainLayout';
import DashboardSummary from '@/components/dashboard/DashboardSummary';
import FinanceChart from '@/components/dashboard/FinanceChart';
import TransactionList from '@/components/dashboard/TransactionList';
import { useAuth } from '@/context/AuthContext';
import { dashboardAPI, ResidentDashboardData } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function ResidentDashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<ResidentDashboardData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Mock chart data (in real application, this would come from the API)
  const generateMockChartData = () => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    return months.map(month => ({
      name: month,
      income: Math.floor(Math.random() * 200000) + 100000,
      expense: Math.floor(Math.random() * 150000) + 50000,
      balance: Math.floor(Math.random() * 100000) + 20000
    }));
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await dashboardAPI.getResidentDashboard();
        if (response.success) {
          setDashboardData(response.data);
          setChartData(generateMockChartData());
        }
      } catch (error) {
        console.error('Error fetching resident dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <MainLayout title="Painel do Residente">
      {loading || !dashboardData ? (
        <>
          <Skeleton active />
          <Skeleton active />
        </>
      ) : (
        <>
          <DashboardSummary
            balance={dashboardData.finance.summary.balance}
            income={dashboardData.finance.summary.totalIncome}
            expense={dashboardData.finance.summary.totalExpense}
          />
          
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} md={12}>
              <Card title="Informações da Unidade" bordered={false}>
                <Descriptions column={1}>
                  <Descriptions.Item label="Condomínio">{dashboardData.condo.name}</Descriptions.Item>
                  <Descriptions.Item label="Endereço">{dashboardData.condo.address}</Descriptions.Item>
                  <Descriptions.Item label="Unidade">
                    {dashboardData.unit.number}
                    {dashboardData.unit.block && ` - Bloco ${dashboardData.unit.block}`}
                    {dashboardData.unit.floor && ` - Andar ${dashboardData.unit.floor}`}
                  </Descriptions.Item>
                  <Descriptions.Item label="Residente">{dashboardData.resident.name}</Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Resumo Financeiro" bordered={false}>
                <Descriptions column={1}>
                  <Descriptions.Item label="Saldo Atual">
                    {formatCurrency(dashboardData.finance.summary.balance)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total de Receitas">
                    {formatCurrency(dashboardData.finance.summary.totalIncome)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total de Despesas">
                    {formatCurrency(dashboardData.finance.summary.totalExpense)}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <FinanceChart 
                data={chartData} 
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