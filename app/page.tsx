'use client';

import React, { useEffect } from 'react';
import { Layout, Typography, Button, Row, Col, Card, Space } from 'antd';
import { BuildOutlined, TeamOutlined, BankOutlined, BarChartOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to the appropriate dashboard
    if (isAuthenticated && user) {
      if (user.role === 'syndic' || user.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/resident-dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  const features = [
    {
      icon: <BuildOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
      title: 'Gestão de Condomínios',
      description: 'Cadastre e gerencie condomínios, unidades e residentes em um só lugar.',
    },
    {
      icon: <TeamOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
      title: 'Controle de Residentes',
      description: 'Mantenha um registro completo de todos os residentes e suas unidades.',
    },
    {
      icon: <BankOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
      title: 'Gestão Financeira',
      description: 'Registre receitas e despesas, tenha controle total do fluxo financeiro.',
    },
    {
      icon: <BarChartOutlined style={{ fontSize: 32, color: '#fa8c16' }} />,
      title: 'Dashboards Personalizados',
      description: 'Painéis visuais com métricas importantes para síndicos e residentes.',
    },
  ];

  return (
    <Layout>
      <Content>
        {/* Hero Section */}
        <div 
          style={{ 
            padding: '80px 0', 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
            color: 'white',
          }}
        >
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ marginBottom: 40 }}>
              <BuildOutlined style={{ fontSize: 72 }} />
            </div>
            <Title style={{ color: 'white', marginBottom: 24 }}>CondoManage</Title>
            <Title level={3} style={{ color: 'white', fontWeight: 'normal', marginBottom: 40 }}>
              Sistema completo para gestão de condomínios
            </Title>
            <Space size="large">
              <Link href="/login">
                <Button type="primary" size="large" icon={<LoginOutlined />}>
                  Entrar
                </Button>
              </Link>
              <Link href="/register">
                <Button size="large" ghost icon={<UserAddOutlined />}>
                  Cadastrar
                </Button>
              </Link>
            </Space>
          </div>
        </div>

        {/* Features Section */}
        <div style={{ padding: '80px 0', background: '#fff' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 60 }}>
              Recursos que simplificam a gestão de condomínios
            </Title>
            <Row gutter={[32, 32]}>
              {features.map((feature, index) => (
                <Col xs={24} sm={12} md={12} lg={6} key={index}>
                  <Card 
                    bordered={false} 
                    style={{ 
                      height: '100%', 
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      borderRadius: 8,
                    }}
                  >
                    <div style={{ marginBottom: 16 }}>{feature.icon}</div>
                    <Title level={4}>{feature.title}</Title>
                    <Paragraph>{feature.description}</Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{ padding: '80px 0', background: '#f5f5f5' }}>
          <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
            <Title level={2}>Comece a gerenciar seus condomínios hoje</Title>
            <Paragraph style={{ fontSize: 16, marginBottom: 32 }}>
              Junte-se a milhares de síndicos que já simplificaram a gestão de seus condomínios com o CondoManage.
            </Paragraph>
            <Space size="large">
              <Link href="/register">
                <Button type="primary" size="large">
                  Criar Conta Grátis
                </Button>
              </Link>
              <Link href="/login">
                <Button size="large">
                  Já tenho uma conta
                </Button>
              </Link>
            </Space>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '40px 0', background: '#001529', color: 'rgba(255, 255, 255, 0.65)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
            <div style={{ marginBottom: 16 }}>
              <BuildOutlined style={{ fontSize: 24 }} />
              <Title level={4} style={{ color: 'white', display: 'inline-block', marginLeft: 8 }}>
                CondoManage
              </Title>
            </div>
            <Paragraph>
              © {new Date().getFullYear()} CondoManage. Todos os direitos reservados.
            </Paragraph>
          </div>
        </div>
      </Content>
    </Layout>
  );
}