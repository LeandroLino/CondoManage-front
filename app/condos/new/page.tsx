'use client';

import React from 'react';
import { Col, Row } from 'antd';
import MainLayout from '@/components/layouts/MainLayout';
import CondoForm from '@/components/condos/CondoForm';

export default function NewCondoPage() {
  return (
    <MainLayout 
      title="Adicionar Condomínio" 
      breadcrumbs={[
        { title: 'Condomínios', href: '/condos' },
        { title: 'Adicionar' }
      ]}
    >
      <Row justify="center">
        <Col xs={24} sm={24} md={18} lg={16} xl={14}>
          <CondoForm />
        </Col>
      </Row>
    </MainLayout>
  );
}