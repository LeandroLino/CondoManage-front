'use client';

import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Typography, Spin, Row, Col, List, Avatar, Tag } from 'antd';
import { HomeOutlined, TeamOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { dashboardAPI, ResidentDashboardData } from '@/lib/api';
import { getInitials } from '@/lib/utils';

const { Title } = Typography;

export default function MyUnitPage() {
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
        console.error('Error fetching unit info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <MainLayout title="Minha Unidade">
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
                  <HomeOutlined style={{ marginRight: 8 }} />
                  Detalhes da Unidade
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
                <Descriptions.Item label="Condomínio">
                  {dashboardData.condo.name}
                </Descriptions.Item>
                <Descriptions.Item label="Endereço">
                  {dashboardData.condo.address}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          
          <Col xs={24} lg={12}>
            <Card 
              title={
                <span>
                  <TeamOutlined style={{ marginRight: 8 }} />
                  Residentes
                </span>
              }
              bordered={false}
            >
              <List
                itemLayout="horizontal"
                dataSource={[dashboardData.resident]} // In a real app, this would be a list of all residents
                renderItem={resident => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar style={{ backgroundColor: '#722ed1' }}>
                          {getInitials(resident.name)}
                        </Avatar>
                      }
                      title={resident.name}
                      description={
                        <>
                          <div>{resident.email}</div>
                          <div style={{ marginTop: 4 }}>
                            <Tag color="purple">Residente</Tag>
                          </div>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
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