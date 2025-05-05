'use client';

import React from 'react';
import { Col, Row } from 'antd';
import MainLayout from '@/components/layouts/MainLayout';
import ResidentFinanceForm from '@/components/finance/ResidentFinanceForm';

export default function NewFinanceRecordPage() {
  return (
    <MainLayout 
      title="Adicionar Registro Financeiro" 
      breadcrumbs={[
        { title: 'Financeiro', href: '/finance-info' },
        { title: 'Adicionar' }
      ]}
    >
      <Row justify="center">
        <Col xs={24} sm={24} md={18} lg={16} xl={14}>
          <ResidentFinanceForm />
        </Col>
      </Row>
    </MainLayout>
  );
}