'use client';

import React from 'react';
import { Layout, Typography, Row, Col } from 'antd';
import { BuildOutlined } from '@ant-design/icons';
import LoginForm from '@/components/forms/LoginForm';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function LoginPage() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '50px 0' }}>
        <Row justify="center" align="middle" style={{ minHeight: 'calc(100vh - 100px)' }}>
          <Col xs={22} sm={20} md={16} lg={12} xl={8}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>
                <BuildOutlined />
              </div>
              <Title level={2} style={{ marginBottom: 8 }}>CondoManage</Title>
              <Text type="secondary">
                Sistema de gestão de condomínios
              </Text>
            </div>
            
            <LoginForm />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}