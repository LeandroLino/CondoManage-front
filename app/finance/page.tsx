'use client';

import React, { useEffect, useState } from 'react';
import { Button, Spin, Space, Select, Typography, Radio, Row, Col } from 'antd';
import { PlusOutlined, DollarOutlined, BankOutlined, LineChartOutlined, BarChartOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layouts/MainLayout';
import FinanceChart from '@/components/dashboard/FinanceChart';
import TransactionList from '@/components/dashboard/TransactionList';
import DashboardSummary from '@/components/dashboard/DashboardSummary';
import { financeAPI, condoAPI, FinanceRecord, Condo, FinanceBalance } from '@/lib/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const { Title } = Typography;
const { Option } = Select;

export default function FinancePage() {
  const searchParams = useSearchParams();
  const urlCondoId = searchParams.get('condoId');
  
  const [transactions, setTransactions] = useState<FinanceRecord[]>([]);
  const [condos, setCondos] = useState<Condo[]>([]);
  const [balance, setBalance] = useState<FinanceBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCondoId, setSelectedCondoId] = useState<string | null>(urlCondoId);
  const [selectedCondo, setSelectedCondo] = useState<Condo | null>(null);
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Mock chart data (in real application, this would come from the API)
  const generateMockChartData = () => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    return months.map(month => ({
      name: month,
      income: Math.floor(Math.random() * 500000) + 100000,
      expense: Math.floor(Math.random() * 400000) + 50000,
    }));
  };

  // Fetch condos
  useEffect(() => {
    const fetchCondos = async () => {
      try {
        const response = await condoAPI.getAll();
        if (response.success) {
          setCondos(response.data);
          
          if (urlCondoId) {
            const condo = response.data.find(c => c._id === urlCondoId);
            if (condo) {
              setSelectedCondo(condo);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching condos:', error);
      }
    };

    fetchCondos();
  }, [urlCondoId]);

  // Fetch financial data when condo changes
  useEffect(() => {
    const fetchFinancialData = async () => {
      if (!selectedCondoId) {
        setTransactions([]);
        setBalance(null);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Fetch transactions
        const transactionsResponse = await financeAPI.getByCondoId(selectedCondoId);
        if (transactionsResponse.success) {
          setTransactions(transactionsResponse.data);
        }
        
        // Fetch balance
        const balanceResponse = await financeAPI.getBalance(selectedCondoId);
        if (balanceResponse.success) {
          setBalance(balanceResponse.data);
        }
        
        // Set chart data
        setChartData(generateMockChartData());
      } catch (error) {
        console.error('Error fetching financial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [selectedCondoId]);

  // Handle condo change
  const handleCondoChange = (value: string) => {
    setSelectedCondoId(value);
    const condo = condos.find(c => c._id === value);
    if (condo) {
      setSelectedCondo(condo);
    }
  };

  return (
    <MainLayout 
      title="Financeiro" 
      breadcrumbs={[
        { title: 'Financeiro' },
        ...(selectedCondo ? [{ title: selectedCondo.name }] : [])
      ]}
    >
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <Space size="middle" wrap>
          <Select
            placeholder="Selecione um condomínio"
            style={{ width: 250 }}
            value={selectedCondoId || undefined}
            onChange={handleCondoChange}
          >
            {condos.map(condo => (
              <Option key={condo._id} value={condo._id}>{condo.name}</Option>
            ))}
          </Select>
          
          <Radio.Group 
            value={chartType} 
            onChange={(e) => setChartType(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="area"><LineChartOutlined /> Área</Radio.Button>
            <Radio.Button value="bar"><BarChartOutlined /> Barras</Radio.Button>
          </Radio.Group>
        </Space>
        
        {selectedCondoId && (
          <Link href={`/finance/new?condoId=${selectedCondoId}`}>
            <Button type="primary" icon={<PlusOutlined />}>
              Novo Registro
            </Button>
          </Link>
        )}
      </div>

      {!selectedCondoId ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Title level={4}>Selecione um condomínio para ver os dados financeiros</Title>
        </div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {balance && (
            <DashboardSummary
              balance={balance.balance}
              income={balance.totalIncome}
              expense={balance.totalExpense}
            />
          )}
          
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <FinanceChart 
                data={chartData} 
                title="Histórico Financeiro (Últimos 6 meses)"
                type={chartType}
                height={350}
              />
            </Col>
            <Col xs={24} lg={8}>
              <TransactionList 
                transactions={transactions} 
                title="Transações"
                emptyText="Nenhuma transação encontrada"
              />
            </Col>
          </Row>
        </>
      )}
    </MainLayout>
  );
}