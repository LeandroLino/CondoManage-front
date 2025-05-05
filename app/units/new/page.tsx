'use client';

import React from 'react';
import { Col, Row } from 'antd';
import MainLayout from '@/components/layouts/MainLayout';
import UnitForm from '@/components/units/UnitForm';
import { useSearchParams } from 'next/navigation';

export default function NewUnitPage() {
  const searchParams = useSearchParams();
  const condoId = searchParams.get('condoId');
  
  return (
    <MainLayout 
      title="Adicionar Unidade" 
      breadcrumbs={[
        { title: 'Unidades', href: '/units' },
        { title: 'Adicionar' }
      ]}
    >
      <Row justify="center">
        <Col xs={24} sm={24} md={18} lg={16} xl={14}>
          <UnitForm condoId={condoId || undefined} />
        </Col>
      </Row>
    </MainLayout>
  );
}