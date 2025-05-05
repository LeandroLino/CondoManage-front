'use client';

import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Typography, Spin, Row, Col } from 'antd';
import { BuildOutlined, HomeOutlined, TeamOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { dashboardAPI, ResidentDashboardData } from '@/lib/api';

const { Title } = Typography;

export default function CondoInfoPage() {
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
        console.error('Error fetching condo info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <MainLayout title="Informações do Condomínio">
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : dashboardData ? (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card 
              title={
                <span>
                  <BuildOutlined style={{ marginRight: 8 }} />
                  Dados do Condomínio
                </span>
              }
              bordered={false}
            >
              <Descriptions column={1}>
                <Descriptions.Item label="Nome">{dashboardData.condo.name}</Descriptions.Item>
                <Descriptions.Item label="Endereço">{dashboardData.condo.address}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          
          <Col xs={24} lg={12}>
            <Card 
              title={
                <span>
                  <HomeOutlined style={{ marginRight: 8 }} />
                  Sua Unidade
                </span>
              }
              bordered={false}
            >
              <Descriptions column={1}>
                <Descriptions.Item label="Número">
                  {dashboardData.unit.number}
                </Descriptions.Item>
                {dashboardData.unit.block && (
                  <Descriptions.Item label="Bloco">
                    {dashboardData.unit.block}
                  </Descriptions.Item>
                )}
                {dashboardData.unit.floor && (
                  <Descriptions.Item label="Andar">
                    {dashboardData.unit.floor}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          </Col>
          
          <Col xs={24}>
            <Card 
              title={
                <span>
                  <TeamOutlined style={{ marginRight: 8 }} />
                  Seus Dados
                </span>
              }
              bordered={false}
            >
              <Descriptions column={1}>
                <Descriptions.Item label="Nome">{dashboardData.resident.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{dashboardData.resident.email}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      ) : (
        <Title level={4} style={{ textAlign: 'center' }}>
          Nenhuma informação disponível
        </Title>
      )}
    </MainLayout>
  );
}