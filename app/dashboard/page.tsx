'use client';

import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layouts/MainLayout';
import DashboardSummary from '@/components/dashboard/DashboardSummary';
import FinanceChart from '@/components/dashboard/FinanceChart';
import TransactionList from '@/components/dashboard/TransactionList';
import CondoList from '@/components/condos/CondoList';
import { useAuth } from '@/context/AuthContext';
import { dashboardAPI, SyndicDashboardData, Condo, FinanceRecord } from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<SyndicDashboardData[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Mock chart data (in real application, this would come from the API)
  const generateMockChartData = () => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    return months.map(month => ({
      name: month,
      income: Math.floor(Math.random() * 500000) + 300000,
      expense: Math.floor(Math.random() * 400000) + 200000,
      balance: Math.floor(Math.random() * 300000) + 100000
    }));
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await dashboardAPI.getSyndicDashboard();
        if (response.success) {
          setDashboardData(response.data);
          // In a real application, you would get chart data from the API
          setChartData(generateMockChartData());
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  
  // Calculate summary stats from dashboard data
  const calculateSummaryStats = () => {
    let totalCondos = dashboardData.length;
    let totalUnits = 0;
    let totalResidents = 0;
    let totalBalance = 0;
    
    dashboardData.forEach(data => {
      totalUnits += data.stats.totalUnits;
      totalResidents += data.stats.totalResidents;
      totalBalance += data.finance.balance;
    });
    
    return { totalCondos, totalUnits, totalResidents, balance: totalBalance };
  };
  
  // Get summary stats
  const summaryStats = calculateSummaryStats();
  
  // Extract condos from dashboard data
  const condos: Condo[] = dashboardData.map(data => ({
    _id: data.condo.id,
    name: data.condo.name,
    address: data.condo.address,
    createdBy: user?._id || '',
    createdAt: new Date().toISOString(),
  }));
  
  // Get recent transactions from all condos
  const getRecentTransactions = (): FinanceRecord[] => {
    const allTransactions: FinanceRecord[] = [];
    
    dashboardData.forEach(data => {
      allTransactions.push(...data.finance.lastRecords);
    });
    
    return allTransactions.slice(0, 5); // Return only the 5 most recent
  };

  return (
    <MainLayout title="Dashboard do Síndico">
      {loading ? (
        <>
          <Skeleton active />
          <Skeleton active />
        </>
      ) : (
        <>
          <DashboardSummary
            totalCondos={summaryStats.totalCondos}
            totalUnits={summaryStats.totalUnits}
            totalResidents={summaryStats.totalResidents}
            balance={summaryStats.balance}
          />
          
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <FinanceChart 
                data={chartData} 
                title="Resumo Financeiro (Últimos 6 meses)"
                type="area"
                height={350}
              />
            </Col>
            <Col xs={24} lg={8}>
              <TransactionList 
                transactions={getRecentTransactions()} 
                title="Últimas Transações"
                emptyText="Nenhuma transação recente"
              />
            </Col>
          </Row>
          
          <div style={{ marginTop: 24, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Seus Condomínios</h2>
            <Link href="/condos/new">
              <Button type="primary" icon={<PlusOutlined />}>
                Novo Condomínio
              </Button>
            </Link>
          </div>
          
          <CondoList condos={condos} />
        </>
      )}
    </MainLayout>
  );
}