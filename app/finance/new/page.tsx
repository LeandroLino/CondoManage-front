'use client';

import React from 'react';
import { Col, Row } from 'antd';
import MainLayout from '@/components/layouts/MainLayout';
import FinanceForm from '@/components/finance/FinanceForm';
import { useSearchParams } from 'next/navigation';

export default function NewFinanceRecordPage() {
  const searchParams = useSearchParams();
  const condoId = searchParams.get('condoId');
  
  return (
    <MainLayout 
      title="Adicionar Registro Financeiro" 
      breadcrumbs={[
        { title: 'Financeiro', href: '/finance' },
        { title: 'Adicionar' }
      ]}
    >
      <Row justify="center">
        <Col xs={24} sm={24} md={18} lg={16} xl={14}>
          <FinanceForm condoId={condoId || undefined} />
        </Col>
      </Row>
    </MainLayout>
  );
}