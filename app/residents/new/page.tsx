'use client';

import React from 'react';
import { Col, Row } from 'antd';
import MainLayout from '@/components/layouts/MainLayout';
import ResidentForm from '@/components/residents/ResidentForm';
import { useSearchParams } from 'next/navigation';

export default function NewResidentPage() {
  const searchParams = useSearchParams();
  const unitId = searchParams.get('unitId');
  const condoId = searchParams.get('condoId');
  
  return (
    <MainLayout 
      title="Adicionar Residente" 
      breadcrumbs={[
        { title: 'Residentes', href: '/residents' },
        { title: 'Adicionar' }
      ]}
    >
      <Row justify="center">
        <Col xs={24} sm={24} md={18} lg={16} xl={14}>
          <ResidentForm unitId={unitId || undefined} condoId={condoId || undefined} />
        </Col>
      </Row>
    </MainLayout>
  );
}