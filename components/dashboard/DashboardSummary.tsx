'use client';

import React from 'react';
import { Card, Row, Col, Statistic, Typography, Skeleton } from 'antd';
import { 
  HomeOutlined, 
  TeamOutlined, 
  BankOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined 
} from '@ant-design/icons';
import { formatCurrency } from '@/lib/utils';

const { Title } = Typography;

interface DashboardSummaryProps {
  totalCondos?: number;
  totalUnits?: number;
  totalResidents?: number;
  balance?: number;
  income?: number;
  expense?: number;
  loading?: boolean;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  totalCondos = 0,
  totalUnits = 0,
  totalResidents = 0,
  balance = 0,
  income = 0,
  expense = 0,
  loading = false
}) => {
  return (
    <div className="mb-6">
      <Title level={4} className="mb-4">Resumo Geral</Title>
      
      <Row gutter={[16, 16]}>
        {totalCondos > 0 && (
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card bordered={false} className="h-full">
              {loading ? (
                <Skeleton active paragraph={{ rows: 1 }} />
              ) : (
                <Statistic
                  title="Condomínios"
                  value={totalCondos}
                  prefix={<BuildOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              )}
            </Card>
          </Col>
        )}
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} className="h-full">
            {loading ? (
              <Skeleton active paragraph={{ rows: 1 }} />
            ) : (
              <Statistic
                title="Unidades"
                value={totalUnits}
                prefix={<HomeOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            )}
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} className="h-full">
            {loading ? (
              <Skeleton active paragraph={{ rows: 1 }} />
            ) : (
              <Statistic
                title="Residentes"
                value={totalResidents}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            )}
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} className="h-full">
            {loading ? (
              <Skeleton active paragraph={{ rows: 1 }} />
            ) : (
              <Statistic
                title="Saldo"
                value={formatCurrency(balance)}
                prefix={<BankOutlined />}
                valueStyle={{ color: balance >= 0 ? '#3f8600' : '#cf1322' }}
              />
            )}
          </Card>
        </Col>
        
        {(income > 0 || expense > 0) && (
          <>
            <Col xs={24} sm={12} md={12} lg={12}>
              <Card bordered={false} className="h-full">
                {loading ? (
                  <Skeleton active paragraph={{ rows: 1 }} />
                ) : (
                  <Statistic
                    title="Receitas"
                    value={formatCurrency(income)}
                    prefix={<ArrowUpOutlined />}
                    valueStyle={{ color: '#3f8600' }}
                  />
                )}
              </Card>
            </Col>
            
            <Col xs={24} sm={12} md={12} lg={12}>
              <Card bordered={false} className="h-full">
                {loading ? (
                  <Skeleton active paragraph={{ rows: 1 }} />
                ) : (
                  <Statistic
                    title="Despesas"
                    value={formatCurrency(expense)}
                    prefix={<ArrowDownOutlined />}
                    valueStyle={{ color: '#cf1322' }}
                  />
                )}
              </Card>
            </Col>
          </>
        )}
      </Row>
    </div>
  );
};

export default DashboardSummary;