'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, Typography, Divider, message } from 'antd';
import { MailOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const { Title } = Typography;

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login, isLoading } = useAuth();
  const [form] = Form.useForm();

  const onFinish = async (values: { email: string; password: string; remember: boolean }) => {
    try {
      await login(values.email, values.password);
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error is already handled in the auth context
      console.error(error);
    }
  };

  return (
    <Card
      bordered={false}
      style={{
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        borderRadius: 8,
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 8 }}>Bem-vindo</Title>
        <Typography.Text type="secondary">
          Entre com suas credenciais para acessar sua conta
        </Typography.Text>
      </div>

      <Form
        form={form}
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Por favor insira seu email' },
            { type: 'email', message: 'Email inválido' },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Por favor insira sua senha' }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Senha"
          />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Lembrar-me</Checkbox>
            </Form.Item>
            <Link href="/forgot-password" style={{ fontSize: 14 }}>
              Esqueceu a senha?
            </Link>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            icon={<LoginOutlined />}
            style={{ width: '100%' }}
          >
            Entrar
          </Button>
        </Form.Item>

        <Divider plain>ou</Divider>

        <div style={{ textAlign: 'center' }}>
          <Typography.Text style={{ marginRight: 8 }}>
            Não tem uma conta?
          </Typography.Text>
          <Link href="/register">Registre-se agora</Link>
        </div>
      </Form>
    </Card>
  );
};

export default LoginForm;