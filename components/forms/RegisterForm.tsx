'use client';

import React from 'react';
import { Form, Input, Button, Card, Typography, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const { Title } = Typography;

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { register, isLoading } = useAuth();
  const [form] = Form.useForm();

  const onFinish = async (values: { name: string; email: string; password: string; confirm: string }) => {
    try {
      await register(values.name, values.email, values.password);
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error is handled in the auth context
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
        <Title level={2} style={{ marginBottom: 8 }}>Crie sua conta</Title>
        <Typography.Text type="secondary">
          Registre-se para começar a gerenciar condomínios
        </Typography.Text>
      </div>

      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        layout="vertical"
        size="large"
        scrollToFirstError
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Por favor insira seu nome' }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Nome completo"
          />
        </Form.Item>

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
          rules={[
            { required: true, message: 'Por favor insira sua senha' },
            { min: 6, message: 'A senha deve ter pelo menos 6 caracteres' },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Senha"
          />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Por favor confirme sua senha' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('As senhas não coincidem'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Confirme a senha"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: '100%' }}
            loading={isLoading}
          >
            Registrar
          </Button>
        </Form.Item>

        <Divider plain>ou</Divider>

        <div style={{ textAlign: 'center' }}>
          <Typography.Text style={{ marginRight: 8 }}>
            Já tem uma conta?
          </Typography.Text>
          <Link href="/login">Entre agora</Link>
        </div>
      </Form>
    </Card>
  );
};

export default RegisterForm;